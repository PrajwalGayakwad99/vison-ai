"""
Gamification API Router
======================
Endpoints for XP, achievements, streaks, and leaderboard.
"""

from fastapi import APIRouter, Depends, HTTPException, Query

from app.models.schemas import (
    XPAwardRequest, XPAwardResponse,
    UserStats, UserStreak, XPTransaction,
    AchievementOut, LeaderboardEntryExtended,
)
from app.services import gamification as gamification_service
from app.api.v1.auth import get_current_user

router = APIRouter(prefix="/gamification", tags=["gamification"])


# =============================================================================
# XP MANAGEMENT
# =============================================================================

@router.post("/award-xp", response_model=XPAwardResponse)
async def award_xp(
    payload: XPAwardRequest,
    _current_user: dict = Depends(get_current_user),
) -> XPAwardResponse:
    """
    Award XP to a user.
    In production, this should be admin-only.
    For now, any authenticated user can award XP.
    """
    try:
        result = gamification_service.award_xp(
            user_id=payload.user_id,
            amount=payload.amount,
            reason=payload.reason,
            source_type=payload.source_type,
            source_id=payload.source_id,
        )

        # Check for new achievements
        new_achievements = gamification_service.check_and_award_achievements(payload.user_id)

        return XPAwardResponse(
            success=result["success"],
            new_xp_total=result["new_xp_total"],
            xp_awarded=result["xp_awarded"],
            achievement_unlocked=[AchievementOut(**a) for a in new_achievements] if new_achievements else None,
        )
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/xp/me")
async def get_my_xp(
    current_user: dict = Depends(get_current_user),
) -> dict:
    """Get the current user's XP total."""
    user_id = current_user.get("id")
    if not user_id:
        raise HTTPException(status_code=401, detail="User not found")

    xp = gamification_service.get_user_xp(user_id)
    return {"user_id": user_id, "xp": xp}


@router.get("/xp/history", response_model=list[XPTransaction])
async def get_xp_history(
    limit: int = Query(50, ge=1, le=100),
    current_user: dict = Depends(get_current_user),
) -> list[XPTransaction]:
    """Get the current user's XP transaction history."""
    user_id = current_user.get("id")
    if not user_id:
        raise HTTPException(status_code=401, detail="User not found")

    history = gamification_service.get_xp_history(user_id, limit)
    return [XPTransaction(**t) for t in history]


# =============================================================================
# STREAK MANAGEMENT
# =============================================================================

@router.get("/streak/me", response_model=UserStreak)
async def get_my_streak(
    current_user: dict = Depends(get_current_user),
) -> UserStreak:
    """Get the current user's streak information."""
    user_id = current_user.get("id")
    if not user_id:
        raise HTTPException(status_code=401, detail="User not found")

    streak = gamification_service.get_user_streak(user_id)
    return UserStreak(**streak)


@router.post("/streak/update")
async def update_my_streak(
    current_user: dict = Depends(get_current_user),
) -> dict:
    """
    Update the current user's daily streak.
    Called when completing an activity.
    """
    user_id = current_user.get("id")
    if not user_id:
        raise HTTPException(status_code=401, detail="User not found")

    result = gamification_service.update_streak(user_id)
    return result


# =============================================================================
# ACHIEVEMENTS
# =============================================================================

@router.get("/achievements", response_model=list[AchievementOut])
async def get_all_achievements(
    current_user: dict = Depends(get_current_user),
) -> list[AchievementOut]:
    """Get all achievements with earned status for current user."""
    user_id = current_user.get("id")
    if not user_id:
        raise HTTPException(status_code=401, detail="User not found")

    achievements = gamification_service.get_user_achievements(user_id)
    return [AchievementOut(**a) for a in achievements]


@router.get("/achievements/categories")
async def get_achievement_categories() -> dict:
    """Get achievement categories."""
    return {
        "categories": [
            {"id": "milestone", "name": "Milestones", "description": "Reach major goals"},
            {"id": "streak", "name": "Streaks", "description": "Daily practice rewards"},
            {"id": "xp", "name": "XP Hunter", "description": "Accumulate experience"},
            {"id": "course", "name": "Course Master", "description": "Complete courses"},
            {"id": "special", "name": "Special", "description": "Unique achievements"},
        ]
    }


# =============================================================================
# LEADERBOARD
# =============================================================================

@router.get("/leaderboard", response_model=list[LeaderboardEntryExtended])
async def get_leaderboard(
    limit: int = Query(20, ge=1, le=100),
    _current_user: dict = Depends(get_current_user),
) -> list[LeaderboardEntryExtended]:
    """Get the top users by XP."""
    leaderboard = gamification_service.get_leaderboard(limit)
    return [LeaderboardEntryExtended(**entry) for entry in leaderboard]


@router.get("/leaderboard/me")
async def get_my_rank(
    current_user: dict = Depends(get_current_user),
) -> dict:
    """Get the current user's rank in the leaderboard."""
    user_id = current_user.get("id")
    if not user_id:
        raise HTTPException(status_code=401, detail="User not found")

    rank = gamification_service.get_user_rank(user_id)
    xp = gamification_service.get_user_xp(user_id)

    return {
        "user_id": user_id,
        "rank": rank,
        "xp": xp,
    }


# =============================================================================
# USER STATS
# =============================================================================

@router.get("/stats/me", response_model=UserStats)
async def get_my_stats(
    current_user: dict = Depends(get_current_user),
) -> UserStats:
    """Get comprehensive stats for the current user."""
    user_id = current_user.get("id")
    if not user_id:
        raise HTTPException(status_code=401, detail="User not found")

    username = current_user.get("username", "Unknown")
    xp = gamification_service.get_user_xp(user_id)
    streak = gamification_service.get_user_streak(user_id)
    achievements = gamification_service.get_user_achievements(user_id)
    rank = gamification_service.get_user_rank(user_id)

    # Count completed exercises and courses
    from app.services.db import get_db
    db = get_db()

    exercises_result = (
        db.table("user_progress")
        .select("id")
        .eq("user_id", user_id)
        .eq("status", "completed")
        .not_.is_("exercise_id", None)
        .execute()
    )

    courses_result = (
        db.table("user_progress")
        .select("id")
        .eq("user_id", user_id)
        .eq("status", "completed")
        .not_.is_("course_id", None)
        .execute()
    )

    earned_achievements = [a for a in achievements if a.get("earned")]

    return UserStats(
        user_id=user_id,
        username=username,
        xp=xp,
        current_streak=streak.get("current_streak", 0),
        longest_streak=streak.get("longest_streak", 0),
        exercises_completed=len(exercises_result.data or []),
        courses_completed=len(courses_result.data or []),
        achievements_earned=len(earned_achievements),
        rank=rank,
    )


# =============================================================================
# BATCH OPERATIONS
# =============================================================================

@router.post("/claim-daily-bonus")
async def claim_daily_bonus(
    current_user: dict = Depends(get_current_user),
) -> dict:
    """
    Claim daily bonus XP and update streak.
    Should only be callable once per day.
    """
    user_id = current_user.get("id")
    if not user_id:
        raise HTTPException(status_code=401, detail="User not found")

    # Update streak first
    streak_result = gamification_service.update_streak(user_id)

    # If streak was updated (it's a new day), award bonus XP
    if streak_result.get("streak_updated"):
        bonus_xp = min(streak_result["current_streak"] * 5, 50)  # 5 XP per day, max 50
        xp_result = gamification_service.award_xp(
            user_id=user_id,
            amount=bonus_xp,
            reason=f"Daily bonus (streak: {streak_result['current_streak']} days)",
            source_type="daily_bonus",
        )

        # Check for streak achievements
        achievements = gamification_service.check_and_award_achievements(user_id)

        return {
            "success": True,
            "bonus_xp": bonus_xp,
            "new_xp_total": xp_result["new_xp_total"],
            "current_streak": streak_result["current_streak"],
            "longest_streak": streak_result["longest_streak"],
            "achievements_unlocked": achievements,
        }
    else:
        return {
            "success": False,
            "message": "Daily bonus already claimed today",
            "current_streak": streak_result["current_streak"],
            "longest_streak": streak_result["longest_streak"],
        }
