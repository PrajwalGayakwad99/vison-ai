from __future__ import annotations

from pydantic import BaseModel, EmailStr, Field


# ── Auth ──────────────────────────────────────────────────────────────────────
class UserCreate(BaseModel):
    username: str
    email: EmailStr
    password: str = Field(..., min_length=8, max_length=128)


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


# ── Sandbox Code Execution ─────────────────────────────────────────────────────
class CodeExecutionRequest(BaseModel):
    language: str = Field(default="python", description="Language: python")
    code: str = Field(..., description="Source code to execute")


class CodeExecutionResponse(BaseModel):
    status: str = Field(..., description="Status: success or error")
    stdout: str = Field(default="", description="Standard output")
    stderr: str = Field(default="", description="Standard error or error message")
    execution_time_ms: int = Field(default=0, description="Execution time in milliseconds")


# ── AI Tutor ──────────────────────────────────────────────────────────────────
class TutorRequest(BaseModel):
    message: str
    code_context: str | None = None
    language: str | None = None


class TutorChatRequest(BaseModel):
    """Request for general AI tutor chat."""
    user_message: str = Field(..., description="User's question or message")
    code_context: str | None = Field(None, description="Current code in editor")
    language: str = Field(default="python", description="Programming language")


class TutorDebugRequest(BaseModel):
    """Request for AI-powered code debugging."""
    code: str = Field(..., description="Code with the bug")
    error_message: str = Field(..., description="Error message from execution")


class TutorHintRequest(BaseModel):
    """Request for a hint (lightweight)."""
    code: str = Field(..., description="Code where user is stuck")
    language: str = Field(default="python", description="Programming language")


class TutorResponse(BaseModel):
    """Response from AI tutor."""
    reply: str = Field(..., description="AI's response")
    suggested_fix: str | None = Field(None, description="Suggested code fix if applicable")
    status: str = Field(default="ok", description="Status: ok or error")


# ── Leaderboard ───────────────────────────────────────────────────────────────
class LeaderboardEntry(BaseModel):
    rank: int
    username: str
    xp: int


# ── Visual Code Tracker ───────────────────────────────────────────────────────
class VisualizeRequest(BaseModel):
    language: str = Field(default="python", description="Language: python, java, javascript")
    code: str = Field(..., description="Source code to visualize")


class VisualizeResponse(BaseModel):
    status: str = Field(default="ok", description="Status: ok, error, syntax_error")
    timeline: list[dict] = Field(default_factory=list, description="Execution timeline")
    total_steps: int = Field(default=0, description="Total execution steps captured")
