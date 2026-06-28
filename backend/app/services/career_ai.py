"""
Career AI Service
================
Generates career profiles and skill assessments using Gemini AI.
"""

from __future__ import annotations

import json
import re
from typing import Optional

import google.generativeai as genai

from app.core.config import settings


def _configure_gemini() -> None:
    """Configure Gemini API."""
    if not hasattr(_configure_gemini, "_configured"):
        if settings.gemini_api_key:
            genai.configure(api_key=settings.gemini_api_key)
        _configure_gemini._configured = True


def generate_career_profile(
    user_xp: int,
    completed_modules: list[str],
    github_repos: Optional[list[dict]] = None,
) -> dict:
    """
    Generate a career profile based on user's XP and completed modules.

    Args:
        user_xp: Total XP accumulated by the user
        completed_modules: List of completed module names
        github_repos: Optional list of GitHub repos with skills

    Returns:
        dict containing:
        - summary: AI-generated career summary paragraph
        - recommended_roles: List of 3 recommended job roles
        - skill_breakdown: Dict of skill categories with levels
        - career_tips: List of 3 actionable tips
    """
    _configure_gemini()

    # Build the prompt
    prompt = _build_career_prompt(user_xp, completed_modules, github_repos)

    try:
        model = genai.GenerativeModel("gemini-1.5-flash")
        response = model.generate_content(prompt)
        response_text = response.text if hasattr(response, "text") else str(response)

        # Parse the JSON response
        parsed = _parse_ai_response(response_text)

        if parsed:
            return parsed

    except Exception as e:
        pass

    # Fallback response
    return _generate_fallback_profile(user_xp, completed_modules)


def _build_career_prompt(
    user_xp: int,
    completed_modules: list[str],
    github_repos: Optional[list[dict]],
) -> str:
    """Build the prompt for career profile generation."""
    modules_str = ", ".join(completed_modules) if completed_modules else "None"

    repos_str = ""
    if github_repos:
        repos_lines = [
            f"- {r['repo_name']} ({r.get('language', 'Unknown')}, {r.get('stars', 0)} stars)"
            for r in github_repos[:5]
        ]
        repos_str = "\nGitHub Repositories:\n" + "\n".join(repos_lines)

    prompt = f"""You are a career advisor analyzing a coding student's profile.
Based on their learning data, generate a career profile in JSON format.

USER DATA:
- Total XP: {user_xp}
- Completed Modules: {modules_str}
{repos_str}

TASK:
Generate a career profile with this EXACT JSON structure (no markdown, just raw JSON):
{{
    "summary": "A 2-3 sentence career summary paragraph",
    "recommended_roles": ["Role 1", "Role 2", "Role 3"],
    "skill_breakdown": {{
        "programming_fundamentals": 0-100,
        "data_structures": 0-100,
        "algorithms": 0-100,
        "web_development": 0-100,
        "problem_solving": 0-100
    }},
    "career_tips": ["Tip 1", "Tip 2", "Tip 3"]
}}

Rules:
- XP < 100: Beginner level, recommend entry-level roles
- XP 100-500: Junior level roles
- XP 500-1000: Mid-level roles
- XP > 1000: Senior/Advanced roles
- Match skill_breakdown scores to completed modules
- Output ONLY valid JSON, no markdown or explanation
"""
    return prompt


def _parse_ai_response(response_text: str) -> Optional[dict]:
    """Parse JSON from AI response."""
    # Try to extract JSON from response
    json_match = re.search(r"\{[\s\S]*\}", response_text)

    if not json_match:
        return None

    try:
        data = json.loads(json_match.group())

        # Validate required fields
        if not isinstance(data.get("recommended_roles"), list):
            return None

        return {
            "summary": data.get("summary", ""),
            "recommended_roles": data["recommended_roles"][:3],
            "skill_breakdown": data.get("skill_breakdown", {}),
            "career_tips": data.get("career_tips", [])[:3],
        }
    except (json.JSONDecodeError, KeyError):
        return None


def _generate_fallback_profile(
    user_xp: int,
    completed_modules: list[str],
) -> dict:
    """Generate a fallback profile when AI fails."""
    if user_xp < 100:
        level = "Beginner"
        roles = ["Junior Python Developer", "Software Development Intern", "Coding Bootcamp Graduate"]
    elif user_xp < 500:
        level = "Junior"
        roles = ["Junior Python Developer", "Junior Data Analyst", "Junior Backend Developer"]
    elif user_xp < 1000:
        level = "Mid-Level"
        roles = ["Python Developer", "Backend Engineer", "Full Stack Developer"]
    else:
        level = "Senior"
        roles = ["Senior Python Engineer", "Lead Developer", "Software Architect"]

    return {
        "summary": f"You are a {level} Python developer with {user_xp} XP. "
                   f"With {len(completed_modules)} modules completed, you're on your way to becoming a professional developer.",
        "recommended_roles": roles,
        "skill_breakdown": {
            "programming_fundamentals": min(50 + user_xp // 10, 100),
            "data_structures": min(30 + user_xp // 20, 100),
            "algorithms": min(20 + user_xp // 25, 100),
            "web_development": 40,
            "problem_solving": min(40 + user_xp // 15, 100),
        },
        "career_tips": [
            "Continue practicing daily to build your streak",
            "Work on personal projects to showcase your skills",
            "Contribute to open source to gain real-world experience",
        ],
    }


def generate_skill_insights(
    skill_scores: dict[str, int],
    weak_areas: list[str],
) -> str:
    """
    Generate personalized insights about a user's skills.

    Args:
        skill_scores: Dict of skill -> score (0-100)
        weak_areas: List of skills that need improvement

    Returns:
        Formatted insights string
    """
    _configure_gemini()

    strong_skills = [s for s, score in skill_scores.items() if score >= 70]
    moderate_skills = [s for s, score in skill_scores.items() if 40 <= score < 70]

    prompt = f"""You are a career mentor. Provide brief insights about this developer's skill profile.

STRONG SKILLS: {', '.join(strong_skills) if strong_skills else 'None identified'}
AREAS TO IMPROVE: {', '.join(weak_areas) if weak_areas else 'None specified'}

Give 2-3 concise sentences of encouragement and advice. Format as plain text, no markdown.
"""

    try:
        model = genai.GenerativeModel("gemini-1.5-flash")
        response = model.generate_content(prompt)
        return response.text if hasattr(response, "text") else ""
    except Exception:
        return "Keep practicing! Consistent coding builds expertise over time."
