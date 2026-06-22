from fastapi import APIRouter
from app.models.schemas import TutorRequest, TutorResponse
from app.services.ai_langgraph import tutor_graph

router = APIRouter(prefix="/tutor", tags=["tutor"])


@router.post("/", response_model=TutorResponse)
async def tutor(payload: TutorRequest) -> TutorResponse:
    """
    Send a message to the Gemini AI tutor via LangGraph.
    """
    state = {"messages": [payload.message], "context": payload.code_context}
    result = tutor_graph.invoke(state)
    reply = result["messages"][-1] if result["messages"] else "No response."
    return TutorResponse(reply=reply)
