"""
AI Tutor Service
================
Gemini-powered AI teacher for the Vision AI coding platform.
Provides chat, debugging, and hint generation capabilities.
"""

from __future__ import annotations

import os
from typing import Optional

import google.generativeai as genai

from app.core.config import settings


# ─────────────────────────────────────────────────────────────────────────────
# GEMINI CONFIGURATION
# ─────────────────────────────────────────────────────────────────────────────

def _configure_gemini() -> None:
    """Configure Gemini API with the API key from settings."""
    api_key = settings.gemini_api_key
    if api_key:
        genai.configure(api_key=api_key)


# Configure on module import
_configure_gemini()

# Model instance (lazy initialization)
_model: Optional[genai.GenerativeModel] = None


def get_gemini_model() -> genai.GenerativeModel:
    """Get or create the Gemini model instance."""
    global _model
    if _model is None:
        _model = genai.GenerativeModel("gemini-2.0-flash")
    return _model


# ─────────────────────────────────────────────────────────────────────────────
# SYSTEM PROMPTS
# ─────────────────────────────────────────────────────────────────────────────

TUTOR_SYSTEM_PROMPT = """You are an expert AI coding tutor helping students learn programming.
- Be friendly, patient, and encouraging
- Explain concepts clearly with simple language
- Use code examples when helpful
- Break down complex problems into smaller steps
- Focus on teaching, not just giving answers
- Language: Python (default)
"""

DEBUG_SYSTEM_PROMPT = """You are an expert debugging assistant. Given code with an error:
1. Explain what the error is and why it occurs
2. Provide a clear, corrected version of the code
3. Highlight what was changed and why
Be concise but thorough. Language: Python (default).
"""

HINT_SYSTEM_PROMPT = """You are a helpful coding tutor giving hints. The student is stuck on a problem.
- Give ONE small hint that helps them think in the right direction
- DO NOT give the full answer
- DO NOT write code for them
- Keep your response to ONE sentence maximum
- Be encouraging and specific
Language: Python (default).
"""


# ─────────────────────────────────────────────────────────────────────────────
# CHAT RESPONSE
# ─────────────────────────────────────────────────────────────────────────────

def generate_chat_response(user_message: str, code_context: Optional[str] = None, language: str = "python") -> str:
    """
    Generate a chat response from the AI tutor.

    Args:
        user_message: The user's question or message
        code_context: Optional code currently in the user's editor
        language: Programming language (default: python)

    Returns:
        str: The AI's response
    """
    model = get_gemini_model()

    # Build the prompt
    prompt_parts = [
        TUTOR_SYSTEM_PROMPT,
        f"\nLanguage: {language}\n",
    ]

    if code_context:
        prompt_parts.append(f"\nUser's current code:\n```python\n{code_context}\n```\n")

    prompt_parts.append(f"\nUser's question: {user_message}\n")

    prompt = "\n".join(prompt_parts)

    try:
        response = model.generate_content(prompt)
        return response.text if response.text else "I'm sorry, I couldn't generate a response. Please try again."
    except Exception as e:
        return f"I encountered an error: {str(e)}"


# ─────────────────────────────────────────────────────────────────────────────
# DEBUG RESPONSE
# ─────────────────────────────────────────────────────────────────────────────

def generate_debug_response(code: str, error_message: str) -> dict:
    """
    Generate a debugging response from the AI tutor.

    Args:
        code: The code with the bug
        error_message: The error message from execution

    Returns:
        dict with keys: explanation, suggested_fix, status
    """
    model = get_gemini_model()

    prompt = f"""{DEBUG_SYSTEM_PROMPT}

Code with error:
```python
{code}
```

Error message:
```
{error_message}
```

Please respond in this exact format:
1. First, explain the error clearly
2. Then provide the corrected code
"""

    try:
        response = model.generate_content(prompt)
        reply = response.text if response.text else ""

        # Parse the response to extract explanation and fix
        # The model should naturally provide both, so we return the full response
        # and let the client decide how to display it
        return {
            "explanation": reply,
            "suggested_fix": extract_code_block(reply),
            "status": "ok",
        }
    except Exception as e:
        return {
            "explanation": f"I encountered an error: {str(e)}",
            "suggested_fix": None,
            "status": "error",
        }


# ─────────────────────────────────────────────────────────────────────────────
# HINT RESPONSE
# ─────────────────────────────────────────────────────────────────────────────

def generate_hint_response(code: str, language: str = "python") -> str:
    """
    Generate a single hint for stuck students.

    Args:
        code: The code where the student is stuck
        language: Programming language (default: python)

    Returns:
        str: A single hint (max 1-2 sentences)
    """
    model = get_gemini_model()

    prompt = f"""{HINT_SYSTEM_PROMPT}

Student's code:
```python
{code}
```

Provide exactly ONE hint:
"""

    try:
        response = model.generate_content(prompt)
        hint = response.text if response.text else "Try breaking down the problem into smaller steps."
        # Ensure hint is concise
        if len(hint) > 200:
            hint = hint[:200].rsplit(" ", 1)[0] + "..."
        return hint.strip()
    except Exception as e:
        return "Think about what each line of your code is doing. Try adding print statements to debug."


# ─────────────────────────────────────────────────────────────────────────────
# UTILITY FUNCTIONS
# ─────────────────────────────────────────────────────────────────────────────

def extract_code_block(text: str) -> Optional[str]:
    """
    Extract the first code block from a markdown-formatted string.

    Args:
        text: String that may contain ```code blocks```

    Returns:
        The extracted code or None if not found
    """
    import re

    # Match ```python\n...``` or ```\n...```
    pattern = r"```(?:\w+)?\n(.*?)```"
    match = re.search(pattern, text, re.DOTALL)

    if match:
        return match.group(1).strip()
    return None
