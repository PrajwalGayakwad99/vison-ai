from fastapi import APIRouter, HTTPException, Depends
from app.models.schemas import UserCreate, UserOut, LeaderboardEntry
from app.services.db import get_db
from app.core.security import get_password_hash
from app.api.v1.auth import get_current_user

router = APIRouter(prefix="/users", tags=["users"])


@router.post("/", response_model=UserOut, status_code=201)
async def create_user(payload: UserCreate) -> UserOut:
    """Register a new user."""
    db = get_db()
    result = db.table("users").insert({
        "username": payload.username,
        "email": payload.email,
        "password_hash": get_password_hash(payload.password),
    }).execute()
    if not result.data:
        raise HTTPException(status_code=400, detail="Could not create user.")
    return UserOut(**result.data[0])


@router.get("/me", response_model=UserOut)
async def get_me(current_user: dict = Depends(get_current_user)) -> UserOut:
    """Get the currently authenticated user's profile."""
    return UserOut(**current_user)


@router.get("/{user_id}", response_model=UserOut)
async def get_user(user_id: str) -> UserOut:
    db = get_db()
    result = db.table("users").select("*").eq("id", user_id).single().execute()
    if not result.data:
        raise HTTPException(status_code=404, detail="User not found.")
    return UserOut(**result.data)


@router.get("/leaderboard/", response_model=list[LeaderboardEntry])
async def leaderboard() -> list[LeaderboardEntry]:
    db = get_db()
    result = db.table("users").select("username, xp").order("xp", desc=True).limit(20).execute()
    return [
        LeaderboardEntry(rank=i + 1, username=r["username"], xp=r["xp"])
        for i, r in enumerate(result.data or [])
    ]
