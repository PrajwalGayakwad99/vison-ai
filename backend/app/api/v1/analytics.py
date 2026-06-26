"""
Analytics API Router
===================
Endpoints for user performance analytics, skill tracking, and dashboard data.
"""

from datetime import date
from typing import Optional

from fastapi import APIRouter, Depends, HTTPException, Query

from app.models.schemas import (
    HeatmapEntry,
    HeatmapResponse,
    SkillData,
    SkillRadarResponse,
    LearningStatsResponse,
    WeeklyPatternEntry,
    ErrorEntry,
    UserActivitySummary,
    ProgressOverTime,
)
from app.services import analytics as analytics_service
from app.api.v1.auth import get_current_user

router = APIRouter(prefix="/analytics", tags=["analytics"])


# =============================================================================
# HEATMAP
# =============================================================================

@router.get("/me/heatmap", response_model=HeatmapResponse)
async def get_my_heatmap(
    days: int = Query(default=365, ge=7, le=365, description="Number of days to retrieve"),
    current_user: dict = Depends(get_current_user),
) -> HeatmapResponse:
    """
    Get user's activity heatmap (GitHub-style contribution graph).

    Returns daily activity counts and intensity levels for the specified period.
    """
    user_id = current_user.get("id")
    if not user_id:
        raise HTTPException(status_code=401, detail="User not found")

    try:
        data = analytics_service.get_user_heatmap(user_id, days=days)

        entries = [
            HeatmapEntry(
                date=e["date"] if isinstance(e["date"], date) else date.fromisoformat(str(e["date"])),
                count=e["count"],
                level=e["level"],
            )
            for e in data["entries"]
        ]

        return HeatmapResponse(
            user_id=user_id,
            days=days,
            entries=entries,
            total_contributions=data["total_contributions"],
            longest_streak=data["longest_streak"],
            current_streak=data["current_streak"],
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to fetch heatmap: {str(e)}")


# =============================================================================
# SKILL RADAR
# =============================================================================

@router.get("/me/skills", response_model=SkillRadarResponse)
async def get_my_skills(
    current_user: dict = Depends(get_current_user),
) -> SkillRadarResponse:
    """
    Get user's skill proficiency scores for radar chart visualization.

    Returns proficiency levels (0-100) for various programming concepts.
    """
    user_id = current_user.get("id")
    if not user_id:
        raise HTTPException(status_code=401, detail="User not found")

    try:
        data = analytics_service.calculate_skill_metrics(user_id)

        skills = [
            SkillData(
                skill_name=s["skill_name"],
                category=s["category"],
                proficiency=s["proficiency"],
                total_attempts=s["total_attempts"],
                successful_attempts=s["successful_attempts"],
                last_practiced=s.get("last_practiced"),
            )
            for s in data["skills"]
        ]

        return SkillRadarResponse(
            user_id=user_id,
            skills=skills,
            overall_score=data["overall_score"],
            strongest_skill=data.get("strongest_skill"),
            weakest_skill=data.get("weakest_skill"),
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to fetch skills: {str(e)}")


# =============================================================================
# LEARNING STATS
# =============================================================================

@router.get("/me/stats", response_model=LearningStatsResponse)
async def get_my_stats(
    days: int = Query(default=90, ge=7, le=365, description="Number of days to analyze"),
    current_user: dict = Depends(get_current_user),
) -> LearningStatsResponse:
    """
    Get comprehensive learning statistics for the user.

    Includes execution counts, success rates, hours coded, and error analysis.
    """
    user_id = current_user.get("id")
    if not user_id:
        raise HTTPException(status_code=401, detail="User not found")

    try:
        data = analytics_service.get_general_stats(user_id, days=days)

        weekly_pattern = [
            WeeklyPatternEntry(
                day_of_week=w["day_of_week"],
                day_name=w["day_name"],
                avg_executions=w["avg_executions"],
                avg_xp=w["avg_xp"],
                total_sessions=w["total_sessions"],
            )
            for w in data.get("weekly_pattern", [])
        ]

        top_errors = [
            ErrorEntry(
                error_type=e["error_type"],
                frequency=e["frequency"],
                last_occurred=None,  # Not available in current implementation
            )
            for e in data.get("top_errors", [])
        ]

        return LearningStatsResponse(
            user_id=user_id,
            total_executions=data["total_executions"],
            successful_executions=data["successful_executions"],
            success_rate=data["success_rate"],
            total_tutor_sessions=data["total_tutor_sessions"],
            total_xp_earned=data["total_xp_earned"],
            hours_coded=data["hours_coded"],
            avg_session_length_minutes=data["avg_session_length_minutes"],
            most_active_day=data.get("most_active_day"),
            weekly_pattern=weekly_pattern,
            top_errors=top_errors,
            strongest_topics=data.get("strongest_topics", []),
            areas_for_improvement=data.get("areas_for_improvement", []),
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to fetch stats: {str(e)}")


# =============================================================================
# PROGRESS OVER TIME
# =============================================================================

@router.get("/me/progress", response_model=list[ProgressOverTime])
async def get_my_progress(
    days: int = Query(default=30, ge=7, le=365, description="Number of days"),
    current_user: dict = Depends(get_current_user),
) -> list[ProgressOverTime]:
    """
    Get cumulative progress over time for trend charts.
    """
    user_id = current_user.get("id")
    if not user_id:
        raise HTTPException(status_code=401, detail="User not found")

    try:
        data = analytics_service.get_progress_over_time(user_id, days=days)

        return [
            ProgressOverTime(
                date=d["date"] if isinstance(d["date"], date) else date.fromisoformat(str(d["date"])),
                cumulative_xp=d["cumulative_xp"],
                cumulative_exercises=d["cumulative_exercises"],
                cumulative_hours=d["cumulative_hours"],
            )
            for d in data
        ]
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to fetch progress: {str(e)}")


# =============================================================================
# COMPLETE DASHBOARD
# =============================================================================

@router.get("/me/dashboard")
async def get_my_dashboard(
    current_user: dict = Depends(get_current_user),
) -> dict:
    """
    Get complete analytics dashboard in one request.

    Returns heatmap, skills, stats, and progress trend combined.
    """
    user_id = current_user.get("id")
    if not user_id:
        raise HTTPException(status_code=401, detail="User not found")

    try:
        dashboard = analytics_service.get_user_dashboard(user_id)
        return dashboard
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to fetch dashboard: {str(e)}")


# =============================================================================
# ERROR TRACKING
# =============================================================================

@router.post("/track-error")
async def track_error(
    error_type: str,
    error_message: str,
    language: str = Query(default="python"),
    current_user: dict = Depends(get_current_user),
) -> dict:
    """
    Track an error occurrence for analytics.

    Called automatically when code execution fails.
    """
    user_id = current_user.get("id")
    if not user_id:
        raise HTTPException(status_code=401, detail="User not found")

    try:
        analytics_service.track_error(user_id, error_type, error_message, language)
        return {"success": True}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to track error: {str(e)}")


# =============================================================================
# SKILL UPDATE
# =============================================================================

@router.post("/update-skill")
async def update_skill(
    skill_name: str,
    success: bool,
    current_user: dict = Depends(get_current_user),
) -> dict:
    """
    Update skill proficiency after code execution.

    Called automatically when code is executed.
    """
    user_id = current_user.get("id")
    if not user_id:
        raise HTTPException(status_code=401, detail="User not found")

    try:
        analytics_service.update_skill_metrics(user_id, skill_name, success)
        return {"success": True}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to update skill: {str(e)}")


# =============================================================================
# SUMMARY STATS (lightweight)
# =============================================================================

@router.get("/me/summary")
async def get_my_summary(
    current_user: dict = Depends(get_current_user),
) -> dict:
    """
    Get a lightweight summary of user activity.

    Useful for quick dashboard loads.
    """
    user_id = current_user.get("id")
    if not user_id:
        raise HTTPException(status_code=401, detail="User not found")

    try:
        # Get last 7 days heatmap
        heatmap = analytics_service.get_user_heatmap(user_id, days=7)

        # Get quick stats
        stats = analytics_service.get_general_stats(user_id, days=7)

        return {
            "user_id": user_id,
            "active_days_this_week": heatmap["total_contributions"],
            "current_streak": heatmap["current_streak"],
            "xp_this_week": stats["total_xp_earned"],
            "executions_this_week": stats["total_executions"],
            "success_rate_this_week": stats["success_rate"],
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to fetch summary: {str(e)}")
