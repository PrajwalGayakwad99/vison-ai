from __future__ import annotations

from typing import TypedDict

from langgraph.graph import END, StateGraph
from langchain_google_genai import ChatGoogleGenerativeAI

from app.core.config import settings


class AgentState(TypedDict):
    messages: list[str]
    context: str | None


def _build_graph() -> object:
    llm = ChatGoogleGenerativeAI(
        model="gemini-1.5-flash",
        google_api_key=settings.gemini_api_key,
    )

    def tutor_node(state: AgentState) -> AgentState:
        user_message = state["messages"][-1]
        code_ctx = state.get("context") or ""
        prompt = f"{user_message}\n\nCode context:\n{code_ctx}" if code_ctx else user_message
        response = llm.invoke(prompt)
        state["messages"].append(response.content)
        return state

    graph = StateGraph(AgentState)
    graph.add_node("tutor", tutor_node)
    graph.set_entry_point("tutor")
    graph.add_edge("tutor", END)
    return graph.compile()


tutor_graph = _build_graph()
