from __future__ import annotations

from pydantic import BaseModel, EmailStr


# ── Auth ──────────────────────────────────────────────────────────────────────
class UserCreate(BaseModel):
    username: str
    email: EmailStr
    password: str


class UserOut(BaseModel):
    id: str
    username: str
    email: EmailStr
    xp: int = 0

    model_config = {"from_attributes": True}


class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"


# ── Code Execution ────────────────────────────────────────────────────────────
class ExecuteRequest(BaseModel):
    language: str          # "python" | "java" | "javascript"
    code: str
    stdin: str | None = None


class ExecuteResponse(BaseModel):
    status: str            # "success" | "error" | "timeout"
    stdout: str | None = None
    stderr: str | None = None
    execution_time_ms: int | None = None


# ── AI Tutor ──────────────────────────────────────────────────────────────────
class TutorRequest(BaseModel):
    message: str
    code_context: str | None = None
    language: str | None = None


class TutorResponse(BaseModel):
    reply: str
    status: str = "ok"


# ── Leaderboard ───────────────────────────────────────────────────────────────
class LeaderboardEntry(BaseModel):
    rank: int
    username: str
    xp: int
