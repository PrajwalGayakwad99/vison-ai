from fastapi import APIRouter, Depends
from app.models.schemas import (
    ExecuteRequest,
    ExecuteResponse,
    VisualizeRequest,
    VisualizeResponse,
    CodeExecutionRequest,
    CodeExecutionResponse,
)
from app.services.docker_bridge import run_container
from app.services.sandbox import execute_code, visualize_code
from app.api.v1.auth import get_current_user

router = APIRouter(prefix="/execute", tags=["execute"])


@router.post("/", response_model=ExecuteResponse)
async def execute_code_endpoint(
    payload: ExecuteRequest,
    _current_user: dict = Depends(get_current_user),
) -> ExecuteResponse:
    """
    Execute code in Docker sandbox (uses existing docker_bridge service).
    """
    image_map = {
        "python": "vision-ai/sandbox-python:latest",
        "java": "vision-ai/sandbox-java:latest",
        "javascript": "vision-ai/sandbox-javascript:latest",
    }
    image = image_map.get(payload.language, "vision-ai/sandbox-python:latest")
    result = run_container(image=image, code=payload.code, language=payload.language)
    return ExecuteResponse(**result)


@router.post("/sandbox", response_model=CodeExecutionResponse)
async def sandbox_execute(
    payload: CodeExecutionRequest,
    _current_user: dict = Depends(get_current_user),
) -> CodeExecutionResponse:
    """
    Execute Python code in a sandboxed Docker container with timeout protection.
    Uses the local vision-ai-python Docker image.
    """
    result = execute_code(
        code=payload.code,
        language=payload.language,
        timeout=5,
    )
    return CodeExecutionResponse(**result)


@router.post("/visualize", response_model=VisualizeResponse)
async def visualize_code_endpoint(
    payload: VisualizeRequest,
    _current_user: dict = Depends(get_current_user),
) -> VisualizeResponse:
    """
    Execute Python code with step-by-step visual tracking.
    Runs code inside a Docker container with sys.settrace instrumentation.
    Returns a timeline of all state changes for visual debugging.
    """
    # Only Python is supported for visual tracking
    if payload.language.lower() != "python":
        return VisualizeResponse(
            status="error",
            timeline=[{
                "step": 0,
                "line": 0,
                "variables": {},
                "call_stack": ["main"],
                "event": "error",
                "error": f"Visual tracking not supported for {payload.language}. Currently only Python is supported."
            }],
            total_steps=0,
        )

    # Execute with visual tracing in Docker sandbox
    result = visualize_code(code=payload.code)

    return VisualizeResponse(
        status=result.get("status", "error"),
        timeline=result.get("timeline", []),
        total_steps=result.get("total_steps", 0),
    )
