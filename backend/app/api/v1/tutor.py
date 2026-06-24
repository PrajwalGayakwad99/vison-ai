from fastapi import APIRouter, Depends
from app.models.schemas import TutorRequest, TutorResponse
from app.services.ai_langgraph import get_tutor_graph
from app.api.v1.auth import get_current_user

router = APIRouter(prefix="/tutor", tags=["tutor"])


@router.post("/", response_model=TutorResponse)
async def tutor(
    payload: TutorRequest,
    _current_user: dict = Depends(get_current_user),
) -> TutorResponse:
    """
    Send a message to the Gemini AI tutor via LangGraph.
    """
    state = {"messages": [payload.message], "context": payload.code_context}
    result = get_tutor_graph().invoke(state)
    reply = result["messages"][-1] if result["messages"] else "No response."
    return TutorResponse(reply=reply)
