"""
AI Tutor Agent - LangGraph Orchestrator
=======================================
A LangGraph-based AI tutor that uses conditional logic to route
between general tutoring and specialized debugging.

State:
  - messages: List of conversation messages
  - code_context: Current code in the editor
  - error_logs: Optional error information from code execution

Conditional Routing:
  - If error_logs exists → debugger_node first
  - Otherwise → tutor_node
"""

from __future__ import annotations

from typing import TypedDict, Literal, Optional

from langchain_google_genai import ChatGoogleGenerativeAI
from langgraph.graph import END, StateGraph

from app.core.config import settings


# ─────────────────────────────────────────────────────────────────────────────
# STATE DEFINITION
# ─────────────────────────────────────────────────────────────────────────────

class TutorState(TypedDict):
    """State schema for the AI Tutor Agent."""
    messages: list[str]  # Conversation history
    code_context: Optional[str]  # Current code in editor
    error_logs: Optional[dict]  # Error info from execution (if any)
    language: str  # Programming language


# ─────────────────────────────────────────────────────────────────────────────
# SYSTEM PROMPTS
# ─────────────────────────────────────────────────────────────────────────────

TUTOR_PROMPT = """You are an expert AI coding tutor helping students learn programming.

Guidelines:
- Be friendly, patient, and encouraging
- Explain concepts clearly with simple language
- Use code examples when helpful
- Break down complex problems into smaller steps
- Focus on teaching, not just giving answers
- Ask follow-up questions to check understanding

User's current code (if any):
```{language}
{code_context}
```

User's question: {question}

Provide a helpful, pedagogical response:"""

DEBUGGER_PROMPT = """You are an expert debugging assistant for programming students.

Given the user's code and error information, help them understand and fix the bug.

User's code:
```{language}
{code_context}
```

Error information:
```
{error_type}: {error_message}
{traceback}
```

Guidelines:
1. Explain what the error is in simple terms
2. Explain why this error occurs
3. Provide the corrected code
4. Highlight what was changed and why

Be encouraging - bugs are learning opportunities!"""


# ─────────────────────────────────────────────────────────────────────────────
# LLM CONFIGURATION
# ─────────────────────────────────────────────────────────────────────────────

def _get_llm():
    """Get configured Gemini LLM instance."""
    return ChatGoogleGenerativeAI(
        model="gemini-2.0-flash",
        google_api_key=settings.gemini_api_key,
        temperature=0.7,
    )


# ─────────────────────────────────────────────────────────────────────────────
# GRAPH NODES
# ─────────────────────────────────────────────────────────────────────────────

def tutor_node(state: TutorState) -> TutorState:
    """
    General tutoring node - handles questions, explanations, and concept teaching.
    """
    llm = _get_llm()

    # Get the latest user message
    messages = state.get("messages", [])
    if not messages:
        return {**state, "messages": ["I didn't receive a message. Please try again."]}

    user_message = messages[-1]
    code_context = state.get("code_context", "") or "No code provided"
    language = state.get("language", "python")

    prompt = TUTOR_PROMPT.format(
        language=language,
        code_context=code_context,
        question=user_message,
    )

    response = llm.invoke(prompt)
    response_text = response.content if hasattr(response, "content") else str(response)

    # Append response to messages
    updated_messages = messages + [response_text]

    return {**state, "messages": updated_messages}


def debugger_node(state: TutorState) -> TutorState:
    """
    Specialized debugging node - analyzes errors and provides fixes.
    Only visited when error_logs exist in the state.
    """
    llm = _get_llm()

    messages = state.get("messages", [])
    if not messages:
        return {**state, "messages": ["I didn't receive a message. Please try again."]}

    user_message = messages[-1]
    code_context = state.get("code_context", "") or "No code provided"
    error_logs = state.get("error_logs", {}) or {}
    language = state.get("language", "python")

    # Extract error information
    error_type = error_logs.get("error_type", "Unknown Error")
    error_message = error_logs.get("error_message", "No error message provided")
    traceback = error_logs.get("traceback", "No traceback available")

    prompt = DEBUGGER_PROMPT.format(
        language=language,
        code_context=code_context,
        error_type=error_type,
        error_message=error_message,
        traceback=traceback,
    )

    response = llm.invoke(prompt)
    response_text = response.content if hasattr(response, "content") else str(response)

    # Append response to messages
    updated_messages = messages + [response_text]

    return {**state, "messages": updated_messages}


# ─────────────────────────────────────────────────────────────────────────────
# CONDITIONAL ROUTING
# ─────────────────────────────────────────────────────────────────────────────

def should_debug(state: TutorState) -> Literal["debugger_node", "tutor_node"]:
    """
    Determine which node to visit based on state.

    If error_logs exist → visit debugger_node first
    Otherwise → visit tutor_node
    """
    error_logs = state.get("error_logs")
    if error_logs and error_logs.get("error_message"):
        return "debugger_node"
    return "tutor_node"


# ─────────────────────────────────────────────────────────────────────────────
# GRAPH COMPILATION
# ─────────────────────────────────────────────────────────────────────────────

def _build_graph():
    """Build and compile the LangGraph."""
    graph = StateGraph(TutorState)

    # Add nodes
    graph.add_node("tutor_node", tutor_node)
    graph.add_node("debugger_node", debugger_node)

    # Set entry point with conditional routing
    graph.set_conditional_entry_point(
        should_debug,
        {
            "tutor_node": "tutor_node",
            "debugger_node": "debugger_node",
        }
    )

    # Both nodes lead to END
    graph.add_edge("tutor_node", END)
    graph.add_edge("debugger_node", END)

    return graph.compile()


# ─────────────────────────────────────────────────────────────────────────────
# SINGLETON INSTANCE
# ─────────────────────────────────────────────────────────────────────────────

_tutor_agent: Optional[object] = None


def get_tutor_agent():
    """Get or create the compiled tutor agent."""
    global _tutor_agent
    if _tutor_agent is None:
        _tutor_agent = _build_graph()
    return _tutor_agent


# ─────────────────────────────────────────────────────────────────────────────
# CONVENIENCE FUNCTIONS
# ─────────────────────────────────────────────────────────────────────────────

def run_tutor(
    message: str,
    code_context: Optional[str] = None,
    error_logs: Optional[dict] = None,
    language: str = "python",
) -> dict:
    """
    Run the tutor agent with the given input.

    Args:
        message: User's message/question
        code_context: Optional code in editor
        error_logs: Optional error information
        language: Programming language

    Returns:
        dict with final state (messages, code_context, error_logs)
    """
    agent = get_tutor_agent()

    initial_state = TutorState(
        messages=[message],
        code_context=code_context,
        error_logs=error_logs,
        language=language,
    )

    result = agent.invoke(initial_state)
    return dict(result)


def get_final_response(
    message: str,
    code_context: Optional[str] = None,
    error_logs: Optional[dict] = None,
    language: str = "python",
) -> str:
    """
    Get just the final response from the tutor agent.

    Args:
        message: User's message/question
        code_context: Optional code in editor
        error_logs: Optional error information
        language: Programming language

    Returns:
        str: The tutor's response
    """
    result = run_tutor(
        message=message,
        code_context=code_context,
        error_logs=error_logs,
        language=language,
    )

    messages = result.get("messages", [])
    if messages:
        return messages[-1]
    return "I'm sorry, I couldn't generate a response. Please try again."
