from fastapi import APIRouter
from app.models.schemas import ExecuteRequest, ExecuteResponse
from app.services.docker_bridge import run_container

router = APIRouter(prefix="/execute", tags=["execute"])


@router.post("/", response_model=ExecuteResponse)
async def execute_code(payload: ExecuteRequest) -> ExecuteResponse:
    """
    Send code to the VPS Docker sandbox and return stdout/stderr.
    """
    image_map = {
        "python": "invincia/sandbox-python:latest",
        "java": "invincia/sandbox-java:latest",
    }
    image = image_map.get(payload.language, "invincia/sandbox-python:latest")
    result = run_container(image=image, code=payload.code)
    return ExecuteResponse(**result)
