from fastapi import APIRouter, HTTPException, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer

from app.core.security import create_access_token, verify_password, verify_token
from app.models.schemas import Token
from app.services.db import get_db

router = APIRouter(prefix="/auth", tags=["auth"])
security = HTTPBearer()


def get_current_user(credentials: HTTPAuthorizationCredentials = security) -> dict:
    """Validate JWT and return the current user's data."""
    token = credentials.credentials
    payload = verify_token(token)
    if not payload:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired token",
            headers={"WWW-Authenticate": "Bearer"},
        )
    user_id = payload.get("sub")
    if not user_id:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid token payload",
        )
    db = get_db()
    result = db.table("users").select("*").eq("id", user_id).single().execute()
    if not result.data:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="User not found",
        )
    return result.data


@router.post("/login", response_model=Token)
async def login(email: str, password: str) -> Token:
    """Authenticate user and return a JWT access token."""
    try:
        db = get_db()
        result = db.table("users").select("*").eq("email", email).single().execute()

        if not result.data:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Incorrect email or password",
            )

        user = result.data

        if not verify_password(password, user["password_hash"]):
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Incorrect email or password",
            )

        access_token = create_access_token(subject=str(user["id"]))
        return Token(access_token=access_token)

    except HTTPException:
        # Re-raise HTTP exceptions as-is
        raise
    except Exception:
        # Catch Supabase connection errors and return clean 401
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
        )
