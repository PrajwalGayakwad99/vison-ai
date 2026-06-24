from fastapi import APIRouter, Depends
from app.models.schemas import ExecuteRequest, ExecuteResponse
from app.services.docker_bridge import run_container
from app.api.v1.auth import get_current_user

router = APIRouter(prefix="/execute", tags=["execute"])


@router.post("/", response_model=ExecuteResponse)
async def execute_code(
    payload: ExecuteRequest,
    _current_user: dict = Depends(get_current_user),
) -> ExecuteResponse:
    """
    Send code to the VPS Docker sandbox and return stdout/stderr.
    """
    image_map = {
        "python": "vision-ai/sandbox-python:latest",
        "java": "vision-ai/sandbox-java:latest",
        "javascript": "vision-ai/sandbox-javascript:latest",
    }
    image = image_map.get(payload.language, "vision-ai/sandbox-python:latest")
    result = run_container(image=image, code=payload.code, language=payload.language)
    return ExecuteResponse(**result)
