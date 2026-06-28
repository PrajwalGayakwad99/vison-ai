"""
Socket.IO Manager for Real-Time Collaboration
============================================
Manages WebSocket connections using python-socketio with JWT authentication.
"""

from __future__ import annotations

import asyncio
import json
from datetime import datetime, timedelta, timezone
from typing import Any, Optional

import socketio
from jose import JWTError, jwt

from app.core.config import settings


# ─────────────────────────────────────────────────────────────────────────────
# SOCKET.IO SERVER SETUP
# ─────────────────────────────────────────────────────────────────────────────

# Create async Socket.IO server with CORS enabled
sio = socketio.AsyncServer(
    async_mode="asgi",
    cors_allowed_origins="*",  # In production, restrict to your frontend URL
    cors_credentials=True,
    logger=False,  # Set to True for debugging
    engineio_logger=False,  # Set to True for debugging
)


# ─────────────────────────────────────────────────────────────────────────────
# IN-MEMORY STATE STORAGE
# ─────────────────────────────────────────────────────────────────────────────

class RoomState:
    """Manages room state and user tracking in memory."""

    def __init__(self) -> None:
        # rooms: {room_id: {sid: {user_id, username, cursor, color}}}
        self._rooms: dict[str, dict[str, dict[str, Any]]] = {}
        # sids: {sid: {room_id, user_id, username}}
        self._sids: dict[str, dict[str, Any]] = {}
        # room_metadata: {room_id: {created_at, language, owner_id}}
        self._room_metadata: dict[str, dict[str, Any]] = {}

    def add_user(
        self,
        sid: str,
        room_id: str,
        user_id: str,
        username: str,
    ) -> None:
        """Add a user to a room."""
        if room_id not in self._rooms:
            self._rooms[room_id] = {}
            self._room_metadata[room_id] = {
                "created_at": datetime.now(timezone.utc).isoformat(),
                "language": "python",
                "owner_id": user_id,
            }

        # Assign a random color for cursor
        import random
        color = f"#{random.randint(0, 0xFFFFFF):06x}"

        self._rooms[room_id][sid] = {
            "user_id": user_id,
            "username": username,
            "cursor": {"x": 0, "y": 0, "line": 1, "column": 0},
            "color": color,
            "joined_at": datetime.now(timezone.utc).isoformat(),
        }

        self._sids[sid] = {
            "room_id": room_id,
            "user_id": user_id,
            "username": username,
        }

    def remove_user(self, sid: str) -> Optional[dict[str, Any]]:
        """Remove a user from their room and return user info."""
        if sid not in self._sids:
            return None

        room_id = self._sids[sid]["room_id"]
        user_info = self._rooms.get(room_id, {}).pop(sid, None)

        del self._sids[sid]

        # Clean up empty rooms
        if room_id in self._rooms and not self._rooms[room_id]:
            del self._rooms[room_id]
            if room_id in self._room_metadata:
                del self._room_metadata[room_id]

        return user_info

    def get_room_users(self, room_id: str) -> list[dict[str, Any]]:
        """Get all users in a room."""
        return list(self._rooms.get(room_id, {}).values())

    def get_room_user_count(self, room_id: str) -> int:
        """Get the number of users in a room."""
        return len(self._rooms.get(room_id, {}))

    def update_cursor(self, sid: str, cursor_data: dict[str, Any]) -> None:
        """Update user's cursor position."""
        if sid in self._sids:
            room_id = self._sids[sid]["room_id"]
            if room_id in self._rooms and sid in self._rooms[room_id]:
                self._rooms[room_id][sid]["cursor"] = cursor_data

    def get_user_info(self, sid: str) -> Optional[dict[str, Any]]:
        """Get user info by socket ID."""
        if sid in self._sids:
            room_id = self._sids[sid]["room_id"]
            return self._rooms.get(room_id, {}).get(sid)
        return None

    def get_room_metadata(self, room_id: str) -> Optional[dict[str, Any]]:
        """Get room metadata."""
        return self._room_metadata.get(room_id)

    def set_room_language(self, room_id: str, language: str) -> None:
        """Set the room's programming language."""
        if room_id in self._room_metadata:
            self._room_metadata[room_id]["language"] = language

    def get_all_rooms(self) -> list[str]:
        """Get list of all active rooms."""
        return list(self._rooms.keys())


# Singleton instance
room_state = RoomState()


# ─────────────────────────────────────────────────────────────────────────────
# JWT AUTHENTICATION
# ─────────────────────────────────────────────────────────────────────────────

ALGORITHM = "HS256"


def verify_token(token: str) -> Optional[dict[str, Any]]:
    """
    Verify JWT token and return payload.

    Args:
        token: JWT token string

    Returns:
        Decoded payload dict or None if invalid
    """
    try:
        payload = jwt.decode(
            token,
            settings.secret_key,
            algorithms=[ALGORITHM],
        )
        return payload
    except JWTError:
        return None


def extract_user_from_token(token: str) -> Optional[tuple[str, str]]:
    """
    Extract user_id and username from JWT token.

    Args:
        token: JWT token string

    Returns:
        Tuple of (user_id, username) or None if invalid
    """
    payload = verify_token(token)
    if not payload:
        return None

    user_id = payload.get("sub")
    if not user_id:
        return None

    return (user_id, payload.get("username", f"User-{user_id[:8]}"))


# ─────────────────────────────────────────────────────────────────────────────
# SOCKET.IO EVENT HANDLERS
# ─────────────────────────────────────────────────────────────────────────────

@sio.event
async def connect(sid: str, environ: dict[str, Any]) -> bool:
    """
    Handle new socket connection.
    Authentication happens during handshake via query params.
    """
    print(f"Client connected: {sid}")
    return True


@sio.event
async def disconnect(sid: str) -> None:
    """Handle socket disconnection."""
    print(f"Client disconnected: {sid}")

    # Remove user from room and notify others
    user_info = room_state.remove_user(sid)
    if user_info:
        room_id = None
        # Find room_id from state before deletion
        for rid, users in room_state._rooms.items():
            if sid in users:
                room_id = rid
                break

        if room_id:
            await sio.emit(
                "user_left",
                {
                    "user_id": user_info.get("user_id"),
                    "username": user_info.get("username"),
                    "timestamp": datetime.now(timezone.utc).isoformat(),
                },
                room=room_id,
            )

            print(f"User {user_info.get('username')} left room {room_id}")


@sio.event
async def authenticate(sid: str, data: dict[str, Any]) -> dict[str, Any]:
    """
    Authenticate user and associate with socket connection.

    Expected data: {"token": "jwt_token"}

    Returns: {"success": bool, "user_id": str, "username": str}
    """
    token = data.get("token", "")

    if not token:
        return {"success": False, "error": "Token required"}

    result = extract_user_from_token(token)
    if not result:
        return {"success": False, "error": "Invalid token"}

    user_id, username = result

    # Store user info in sid mapping (without room yet)
    room_state._sids[sid] = {
        "user_id": user_id,
        "username": username,
        "room_id": None,
    }

    return {
        "success": True,
        "user_id": user_id,
        "username": username,
    }


@sio.event
async def join_room(sid: str, data: dict[str, Any]) -> dict[str, Any]:
    """
    Join a collaboration room.

    Expected data: {"room_id": str, "token": str, "language": str (optional)}

    Returns: {"success": bool, "users": list, "room_metadata": dict}
    """
    room_id = data.get("room_id")
    token = data.get("token")
    language = data.get("language", "python")

    if not room_id:
        return {"success": False, "error": "room_id required"}

    # Authenticate if not already authenticated
    if token:
        result = extract_user_from_token(token)
        if not result:
            return {"success": False, "error": "Invalid token"}
        user_id, username = result
    else:
        # Use existing auth
        user_info = room_state._sids.get(sid)
        if not user_info:
            return {"success": False, "error": "Not authenticated"}
        user_id = user_info.get("user_id")
        username = user_info.get("username")

    # Leave current room if in one
    if room_state._sids.get(sid, {}).get("room_id"):
        await leave_room(sid, {})

    # Join new room
    room_state.add_user(sid, room_id, user_id, username)
    room_state.set_room_language(room_id, language)
    room_state._sids[sid]["room_id"] = room_id

    # Notify others in room
    await sio.emit(
        "user_joined",
        {
            "user_id": user_id,
            "username": username,
            "cursor": room_state.get_user_info(sid),
            "timestamp": datetime.now(timezone.utc).isoformat(),
        },
        room=room_id,
        skip_sid=sid,
    )

    # Get all current users in room
    users = room_state.get_room_users(room_id)
    metadata = room_state.get_room_metadata(room_id)

    print(f"User {username} joined room {room_id}. Total users: {len(users)}")

    return {
        "success": True,
        "users": users,
        "room_metadata": metadata,
    }


@sio.event
async def leave_room(sid: str, data: dict[str, Any]) -> dict[str, Any]:
    """
    Leave current collaboration room.

    Expected data: {} (room_id is determined from current state)

    Returns: {"success": bool}
    """
    user_info = room_state.remove_user(sid)
    if not user_info:
        return {"success": False, "error": "Not in any room"}

    room_id = data.get("room_id") or room_state._sids.get(sid, {}).get("room_id")

    # Find the room to notify
    for rid, users in room_state._rooms.items():
        if sid not in users:
            continue
        room_id = rid
        break

    if room_id:
        await sio.emit(
            "user_left",
            {
                "user_id": user_info.get("user_id"),
                "username": user_info.get("username"),
                "timestamp": datetime.now(timezone.utc).isoformat(),
            },
            room=room_id,
        )

    print(f"User {user_info.get('username')} left room")

    return {"success": True}


@sio.event
async def cursor_move(sid: str, data: dict[str, Any]) -> None:
    """
    Broadcast cursor position to room.

    Expected data: {"x": int, "y": int, "line": int, "column": int}

    Skips the sender - only broadcasts to others in room.
    """
    cursor_data = {
        "x": data.get("x", 0),
        "y": data.get("y", 0),
        "line": data.get("line", 1),
        "column": data.get("column", 0),
    }

    # Update stored cursor
    room_state.update_cursor(sid, cursor_data)

    # Get room_id for this socket
    user_info = room_state._sids.get(sid, {})
    room_id = user_info.get("room_id")

    if not room_id:
        return

    # Get user info
    full_info = room_state.get_user_info(sid)
    if not full_info:
        return

    # Broadcast to others in room (skip sender)
    await sio.emit(
        "cursor_update",
        {
            "user_id": full_info.get("user_id"),
            "username": full_info.get("username"),
            "color": full_info.get("color"),
            "cursor": cursor_data,
            "timestamp": datetime.now(timezone.utc).isoformat(),
        },
        room=room_id,
        skip_sid=sid,
    )


@sio.event
async def code_change(sid: str, data: dict[str, Any]) -> None:
    """
    Broadcast code changes to room.

    Expected data: {"code": str, "delta": dict (optional), "version": int}

    Skips the sender - only broadcasts to others in room.
    """
    room_id = room_state._sids.get(sid, {}).get("room_id")
    if not room_id:
        return

    user_info = room_state.get_user_info(sid)
    if not user_info:
        return

    # Broadcast code change to others
    await sio.emit(
        "code_update",
        {
            "user_id": user_info.get("user_id"),
            "username": user_info.get("username"),
            "code": data.get("code"),
            "delta": data.get("delta"),  # Monaco editor delta
            "version": data.get("version", 0),
            "timestamp": datetime.now(timezone.utc).isoformat(),
        },
        room=room_id,
        skip_sid=sid,
    )


@sio.event
async def chat_message(sid: str, data: dict[str, Any]) -> dict[str, Any]:
    """
    Handle chat message in a room.

    Expected data: {"message": str}

    Broadcasts to all users in room including sender.
    """
    message = data.get("message", "").strip()
    if not message:
        return {"success": False, "error": "Empty message"}

    user_info = room_state.get_user_info(sid)
    if not user_info:
        return {"success": False, "error": "Not in a room"}

    room_id = room_state._sids.get(sid, {}).get("room_id")
    if not room_id:
        return {"success": False, "error": "Not in a room"}

    chat_payload = {
        "user_id": user_info.get("user_id"),
        "username": user_info.get("username"),
        "color": user_info.get("color"),
        "message": message,
        "timestamp": datetime.now(timezone.utc).isoformat(),
    }

    # Broadcast to all in room (including sender)
    await sio.emit("chat_message", chat_payload, room=room_id)

    return {"success": True}


@sio.event
async def set_language(sid: str, data: dict[str, Any]) -> None:
    """
    Set the room's programming language.

    Expected data: {"language": str}

    Broadcasts language change to all users in room.
    """
    language = data.get("language", "python")
    room_id = room_state._sids.get(sid, {}).get("room_id")

    if not room_id:
        return

    room_state.set_room_language(room_id, language)

    # Notify all users in room
    await sio.emit(
        "language_changed",
        {
            "language": language,
            "changed_by": room_state.get_user_info(sid).get("username") if room_state.get_user_info(sid) else "Unknown",
            "timestamp": datetime.now(timezone.utc).isoformat(),
        },
        room=room_id,
    )


@sio.event
async def get_room_info(sid: str, data: dict[str, Any]) -> dict[str, Any]:
    """
    Get current room information.

    Returns: {"room_id": str, "users": list, "metadata": dict}
    """
    room_id = room_state._sids.get(sid, {}).get("room_id")
    if not room_id:
        return {"success": False, "error": "Not in any room"}

    users = room_state.get_room_users(room_id)
    metadata = room_state.get_room_metadata(room_id)

    return {
        "success": True,
        "room_id": room_id,
        "users": users,
        "metadata": metadata,
    }


# ─────────────────────────────────────────────────────────────────────────────
# HELPER FUNCTIONS
# ─────────────────────────────────────────────────────────────────────────────

def get_active_rooms() -> list[dict[str, Any]]:
    """Get list of all active rooms with user counts."""
    rooms = []
    for room_id in room_state.get_all_rooms():
        rooms.append({
            "room_id": room_id,
            "user_count": room_state.get_room_user_count(room_id),
            "metadata": room_state.get_room_metadata(room_id),
        })
    return rooms
