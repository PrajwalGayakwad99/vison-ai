from fastapi import APIRouter, Depends
from app.models.schemas import ExecuteRequest, ExecuteResponse, VisualizeRequest, VisualizeResponse
from app.services.docker_bridge import run_container
from app.services.visual_tracker import VisualTracker
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


@router.post("/visualize", response_model=VisualizeResponse)
async def visualize_code(
    payload: VisualizeRequest,
    _current_user: dict = Depends(get_current_user),
) -> VisualizeResponse:
    """
    Execute Python code with step-by-step visual tracking.
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

    try:
        tracker = VisualTracker()
        timeline = tracker.execute(payload.code)

        return VisualizeResponse(
            status="ok",
            timeline=timeline,
            total_steps=len(timeline),
        )

    except SyntaxError as e:
        # Return clean error in timeline format
        return VisualizeResponse(
            status="syntax_error",
            timeline=[{
                "step": 0,
                "line": 0,
                "variables": {},
                "call_stack": ["main"],
                "event": "exception",
                "error": f"SyntaxError: {str(e)}"
            }],
            total_steps=0,
        )

    except Exception as e:
        # Catch-all for runtime errors
        return VisualizeResponse(
            status="error",
            timeline=[{
                "step": 0,
                "line": 0,
                "variables": {},
                "call_stack": ["main"],
                "event": "exception",
                "error": f"{type(e).__name__}: {str(e)}"
            }],
            total_steps=0,
        )
