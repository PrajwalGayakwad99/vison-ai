from fastapi import APIRouter, Depends
from app.models.schemas import (
    TutorChatRequest,
    TutorDebugRequest,
    TutorHintRequest,
    TutorResponse,
)
from app.services.ai_tutor import (
    generate_chat_response,
    generate_debug_response,
    generate_hint_response,
)
from app.services.ai_agent import get_final_response, run_tutor
from app.api.v1.auth import get_current_user

router = APIRouter(prefix="/tutor", tags=["tutor"])


@router.post("/chat", response_model=TutorResponse)
async def tutor_chat(
    payload: TutorChatRequest,
    _current_user: dict = Depends(get_current_user),
) -> TutorResponse:
    """
    Send a chat message to the AI tutor.
    The tutor will respond to questions about programming concepts,
    code explanations, and general coding help.
    """
    reply = generate_chat_response(
        user_message=payload.user_message,
        code_context=payload.code_context,
        language=payload.language,
    )
    return TutorResponse(reply=reply, status="ok")


@router.post("/debug", response_model=TutorResponse)
async def tutor_debug(
    payload: TutorDebugRequest,
    _current_user: dict = Depends(get_current_user),
) -> TutorResponse:
    """
    Get debugging help from the AI tutor.
    Send your buggy code and the error message, and get an explanation
    plus a suggested fix.
    """
    result = generate_debug_response(
        code=payload.code,
        error_message=payload.error_message,
    )
    return TutorResponse(
        reply=result.get("explanation", "Could not analyze the code."),
        suggested_fix=result.get("suggested_fix"),
        status=result.get("status", "ok"),
    )


@router.post("/hint", response_model=TutorResponse)
async def tutor_hint(
    payload: TutorHintRequest,
    _current_user: dict = Depends(get_current_user),
) -> TutorResponse:
    """
    Get a quick hint when you're stuck.
    Returns exactly ONE sentence to help you think in the right direction
    without giving away the answer.
    """
    hint = generate_hint_response(
        code=payload.code,
        language=payload.language,
    )
    return TutorResponse(reply=hint, status="ok")


# Keep the original endpoint for backward compatibility
@router.post("/", response_model=TutorResponse)
async def tutor_legacy(
    message: str,
    code_context: str | None = None,
    language: str | None = "python",
    _current_user: dict = Depends(get_current_user),
) -> TutorResponse:
    """
    Legacy endpoint for AI tutor (original format).
    """
    reply = generate_chat_response(
        user_message=message,
        code_context=code_context,
        language=language or "python",
    )
    return TutorResponse(reply=reply, status="ok")


@router.post("/analyze", response_model=TutorResponse)
async def tutor_analyze(
    payload: TutorChatRequest,
    _current_user: dict = Depends(get_current_user),
) -> TutorResponse:
    """
    AI-powered code analysis using LangGraph orchestrator.

    This endpoint uses a conditional graph:
    - If code_context is provided → tutor_node (general help)
    - If error_logs are provided → debugger_node (specialized debugging)

    The LangGraph agent decides which specialized node to visit based on context.
    """
    # Run the tutor agent with LangGraph
    reply = get_final_response(
        message=payload.user_message,
        code_context=payload.code_context,
        error_logs=None,  # Add error_logs if you want to trigger debugger_node
        language=payload.language,
    )

    return TutorResponse(reply=reply, status="ok")
