"""
Collaboration REST API Router
===========================
REST endpoints for room management and collaboration features.
"""

from datetime import datetime, timezone
from typing import Optional
from uuid import uuid4

from fastapi import APIRouter, Depends, HTTPException, Query

from app.models.schemas import BaseModel, Field
from app.services.socket_manager import get_active_rooms, room_state
from app.api.v1.auth import get_current_user

router = APIRouter(prefix="/collaboration", tags=["collaboration"])


# ─────────────────────────────────────────────────────────────────────────────
# PYDANTIC MODELS
# ─────────────────────────────────────────────────────────────────────────────

class RoomCreate(BaseModel):
    """Request to create a new collaboration room."""
    language: str = Field(default="python", description="Programming language")
    title: Optional[str] = Field(None, description="Room title")


class RoomResponse(BaseModel):
    """Response containing room information."""
    room_id: str
    title: Optional[str] = None
    language: str
    user_count: int
    created_at: str
    join_url: str


class RoomListResponse(BaseModel):
    """List of active rooms."""
    rooms: list[RoomResponse]
    total_count: int


# ─────────────────────────────────────────────────────────────────────────────
# ROOM MANAGEMENT ENDPOINTS
# ─────────────────────────────────────────────────────────────────────────────

@router.post("/rooms", response_model=RoomResponse, status_code=201)
async def create_room(
    payload: RoomCreate,
    current_user: dict = Depends(get_current_user),
) -> RoomResponse:
    """
    Create a new collaboration room.

    Generates a unique room ID and returns the join URL.
    The creator is automatically set as the room owner.
    """
    user_id = current_user.get("id")
    username = current_user.get("username", "Anonymous")

    if not user_id:
        raise HTTPException(status_code=401, detail="User not found")

    # Generate unique room ID
    room_id = str(uuid4())[:8]  # Short ID for URL-friendly rooms

    # Initialize room in state (no socket connected yet, just metadata)
    room_state._room_metadata[room_id] = {
        "created_at": datetime.now(timezone.utc).isoformat(),
        "language": payload.language,
        "owner_id": user_id,
        "owner_username": username,
        "title": payload.title or f"Room {room_id}",
    }
    room_state._rooms[room_id] = {}

    return RoomResponse(
        room_id=room_id,
        title=payload.title or f"Room {room_id}",
        language=payload.language,
        user_count=0,
        created_at=room_state._room_metadata[room_id]["created_at"],
        join_url=f"/collaborate/{room_id}",
    )


@router.get("/rooms", response_model=RoomListResponse)
async def list_rooms(
    current_user: dict = Depends(get_current_user),
) -> RoomListResponse:
    """
    List all active collaboration rooms.

    Returns rooms with their metadata and current user counts.
    """
    rooms = []
    for room_id in room_state.get_all_rooms():
        metadata = room_state.get_room_metadata(room_id)
        if metadata:
            rooms.append(RoomResponse(
                room_id=room_id,
                title=metadata.get("title"),
                language=metadata.get("language", "python"),
                user_count=room_state.get_room_user_count(room_id),
                created_at=metadata.get("created_at", ""),
                join_url=f"/collaborate/{room_id}",
            ))

    return RoomListResponse(
        rooms=rooms,
        total_count=len(rooms),
    )


@router.get("/rooms/{room_id}", response_model=RoomResponse)
async def get_room(
    room_id: str,
    current_user: dict = Depends(get_current_user),
) -> RoomResponse:
    """
    Get information about a specific room.
    """
    metadata = room_state.get_room_metadata(room_id)
    if not metadata:
        raise HTTPException(status_code=404, detail="Room not found")

    return RoomResponse(
        room_id=room_id,
        title=metadata.get("title"),
        language=metadata.get("language", "python"),
        user_count=room_state.get_room_user_count(room_id),
        created_at=metadata.get("created_at", ""),
        join_url=f"/collaborate/{room_id}",
    )


@router.delete("/rooms/{room_id}")
async def delete_room(
    room_id: str,
    current_user: dict = Depends(get_current_user),
) -> dict:
    """
    Delete a collaboration room.

    Only the room owner can delete a room.
    All users in the room will be disconnected.
    """
    user_id = current_user.get("id")
    metadata = room_state.get_room_metadata(room_id)

    if not metadata:
        raise HTTPException(status_code=404, detail="Room not found")

    # Check ownership
    if metadata.get("owner_id") != user_id:
        raise HTTPException(status_code=403, detail="Only the room owner can delete this room")

    # Remove room and notify users
    if room_id in room_state._rooms:
        # Notify all users in room
        for sid in list(room_state._rooms[room_id].keys()):
            room_state.remove_user(sid)

    return {"success": True, "message": "Room deleted"}


@router.get("/rooms/{room_id}/users")
async def get_room_users(
    room_id: str,
    current_user: dict = Depends(get_current_user),
) -> dict:
    """
    Get list of users currently in a room.
    """
    metadata = room_state.get_room_metadata(room_id)
    if not metadata:
        raise HTTPException(status_code=404, detail="Room not found")

    users = room_state.get_room_users(room_id)

    return {
        "room_id": room_id,
        "users": users,
        "user_count": len(users),
    }


# ─────────────────────────────────────────────────────────────────────────────
# ROOM STATE ENDPOINTS (for non-Socket.IO integrations)
# ─────────────────────────────────────────────────────────────────────────────

@router.post("/rooms/{room_id}/language")
async def set_room_language(
    room_id: str,
    language: str = Query(..., description="Programming language"),
    current_user: dict = Depends(get_current_user),
) -> dict:
    """
    Set the programming language for a room.
    """
    metadata = room_state.get_room_metadata(room_id)
    if not metadata:
        raise HTTPException(status_code=404, detail="Room not found")

    room_state.set_room_language(room_id, language)

    return {"success": True, "language": language}


# ─────────────────────────────────────────────────────────────────────────────
# USER SESSION ENDPOINTS
# ─────────────────────────────────────────────────────────────────────────────

@router.get("/my/current-room")
async def get_my_current_room(
    current_user: dict = Depends(get_current_user),
) -> dict:
    """
    Get the current room the user is in (based on their session).

    Note: This requires tracking user sessions which is handled
    via Socket.IO state. This endpoint is for informational purposes.
    """
    user_id = current_user.get("id")
    if not user_id:
        raise HTTPException(status_code=401, detail="User not found")

    # Search for user in any room
    for room_id, users in room_state._rooms.items():
        for user_info in users.values():
            if user_info.get("user_id") == user_id:
                return {
                    "in_room": True,
                    "room_id": room_id,
                    "metadata": room_state.get_room_metadata(room_id),
                }

    return {
        "in_room": False,
        "room_id": None,
    }
