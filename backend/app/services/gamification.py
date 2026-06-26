"""
Gamification Service
====================
XP Engine, Achievement System, and Streak Management for Vision AI.
"""

from __future__ import annotations

from datetime import date, datetime, timedelta
from typing import Optional

from app.services.db import get_db


# ─────────────────────────────────────────────────────────────────────────────
# XP ENGINE
# ─────────────────────────────────────────────────────────────────────────────

def award_xp(
    user_id: str,
    amount: int,
    reason: str,
    source_type: Optional[str] = None,
    source_id: Optional[str] = None,
) -> dict:
    """
    Award XP to a user and log the transaction.

    Args:
        user_id: The user's ID
        amount: XP amount to award (1-1000)
        reason: Human-readable reason for the XP
        source_type: Optional source (e.g., 'exercise', 'course', 'achievement')
        source_id: Optional ID of the source entity

    Returns:
        dict with success status, new_xp_total, xp_awarded
    """
    if amount < 1 or amount > 1000:
        raise ValueError("XP amount must be between 1 and 1000")

    db = get_db()

    # Log the XP transaction
    transaction = db.table("xp_transactions").insert({
        "user_id": user_id,
        "amount": amount,
        "reason": reason,
        "source_type": source_type,
        "source_id": source_id,
    }).execute()

    if not transaction.data:
        raise Exception("Failed to log XP transaction")

    # Update user's total XP
    user_result = db.table("users").select("xp").eq("id", user_id).single().execute()
    if not user_result.data:
        raise Exception("User not found")

    current_xp = user_result.data.get("xp", 0)
    new_xp_total = current_xp + amount

    db.table("users").update({"xp": new_xp_total}).eq("id", user_id).execute()

    return {
        "success": True,
        "new_xp_total": new_xp_total,
        "xp_awarded": amount,
    }


def get_user_xp(user_id: str) -> int:
    """Get the current XP for a user."""
    db = get_db()
    result = db.table("users").select("xp").eq("id", user_id).single().execute()
    return result.data.get("xp", 0) if result.data else 0


def get_xp_history(user_id: str, limit: int = 50) -> list[dict]:
    """Get XP transaction history for a user."""
    db = get_db()
    result = (
        db.table("xp_transactions")
        .select("*")
        .eq("user_id", user_id)
        .order("created_at", desc=True)
        .limit(limit)
        .execute()
    )
    return result.data or []


# ─────────────────────────────────────────────────────────────────────────────
# STREAK MANAGEMENT
# ─────────────────────────────────────────────────────────────────────────────

def update_streak(user_id: str) -> dict:
    """
    Update the user's daily streak.
    Called when a user completes an activity.

    Args:
        user_id: The user's ID

    Returns:
        dict with current_streak, longest_streak, streak_updated
    """
    db = get_db()
    today = date.today()

    # Get current streak data
    streak_result = (
        db.table("user_streaks")
        .select("*")
        .eq("user_id", user_id)
        .single()
        .execute()
    )

    if streak_result.data:
        current_streak = streak_result.data.get("current_streak", 0)
        longest_streak = streak_result.data.get("longest_streak", 0)
        last_activity = streak_result.data.get("last_activity_date")

        # Convert date to date object if string
        if last_activity and isinstance(last_activity, str):
            last_activity = date.fromisoformat(last_activity.split("T")[0])

        # Check if streak is still active
        if last_activity == today:
            # Already updated today
            return {
                "current_streak": current_streak,
                "longest_streak": longest_streak,
                "streak_updated": False,
            }
        elif last_activity and last_activity == today - timedelta(days=1):
            # Consecutive day - increment streak
            current_streak += 1
        else:
            # Streak broken - reset to 1
            current_streak = 1

        # Update longest streak if needed
        if current_streak > longest_streak:
            longest_streak = current_streak

        # Update database
        db.table("user_streaks").update({
            "current_streak": current_streak,
            "longest_streak": longest_streak,
            "last_activity_date": today.isoformat(),
            "weekly_progress": current_streak if today.weekday() == 0 else streak_result.data.get("weekly_progress", 0) + 1,
            "updated_at": datetime.utcnow().isoformat(),
        }).eq("user_id", user_id).execute()
    else:
        # Create new streak record
        current_streak = 1
        longest_streak = 1

        db.table("user_streaks").insert({
            "user_id": user_id,
            "current_streak": 1,
            "longest_streak": 1,
            "last_activity_date": today.isoformat(),
        }).execute()

    return {
        "current_streak": current_streak,
        "longest_streak": longest_streak,
        "streak_updated": True,
    }


def get_user_streak(user_id: str) -> dict:
    """Get the user's current streak information."""
    db = get_db()
    result = (
        db.table("user_streaks")
        .select("*")
        .eq("user_id", user_id)
        .single()
        .execute()
    )

    if result.data:
        return {
            "current_streak": result.data.get("current_streak", 0),
            "longest_streak": result.data.get("longest_streak", 0),
            "last_activity_date": result.data.get("last_activity_date"),
            "weekly_goal": result.data.get("weekly_goal", 7),
            "weekly_progress": result.data.get("weekly_progress", 0),
        }

    return {
        "current_streak": 0,
        "longest_streak": 0,
        "last_activity_date": None,
        "weekly_goal": 7,
        "weekly_progress": 0,
    }


# ─────────────────────────────────────────────────────────────────────────────
# ACHIEVEMENT SYSTEM
# ─────────────────────────────────────────────────────────────────────────────

def check_and_award_achievements(user_id: str) -> list[dict]:
    """
    Check if user qualifies for any new achievements and award them.

    Args:
        user_id: The user's ID

    Returns:
        list of newly awarded achievements
    """
    db = get_db()

    # Get user's current stats
    user_result = db.table("users").select("xp, current_streak").eq("id", user_id).single().execute()
    if not user_result.data:
        return []

    total_xp = user_result.data.get("xp", 0)
    current_streak = user_result.data.get("current_streak", 0)

    # Get user's exercise completion count
    exercise_count_result = (
        db.table("user_progress")
        .select("id")
        .eq("user_id", user_id)
        .eq("status", "completed")
        .eq("exercise_id", "exercise_id")
        .execute()
    )
    exercises_completed = len([p for p in exercise_count_result.data or [] if p.get("exercise_id")])

    # Get courses completed count
    course_count_result = (
        db.table("user_progress")
        .select("id")
        .eq("user_id", user_id)
        .eq("status", "completed")
        .eq("course_id", "course_id")
        .execute()
    )
    courses_completed = len([p for p in course_count_result.data or [] if p.get("course_id")])

    # Get already earned achievements
    earned_result = db.table("user_achievements").select("achievement_id").eq("user_id", user_id).execute()
    earned_ids = {a.get("achievement_id") for a in earned_result.data or []}

    # Get all achievements that user hasn't earned
    achievements_result = db.table("achievements").select("*").execute()
    new_achievements = []

    for achievement in achievements_result.data or []:
        achievement_id = achievement.get("id")

        # Skip if already earned
        if achievement_id in earned_ids:
            continue

        criteria_type = achievement.get("criteria_type")
        criteria_value = achievement.get("criteria_value")
        xp_bonus = achievement.get("xp_bonus", 0)

        earned = False

        # Check if user meets criteria
        if criteria_type == "total_xp" and total_xp >= criteria_value:
            earned = True
        elif criteria_type == "streak_days" and current_streak >= criteria_value:
            earned = True
        elif criteria_type == "exercises_completed" and exercises_completed >= criteria_value:
            earned = True
        elif criteria_type == "courses_completed" and courses_completed >= criteria_value:
            earned = True

        if earned:
            # Award the achievement
            db.table("user_achievements").insert({
                "user_id": user_id,
                "achievement_id": achievement_id,
            }).execute()

            # Award XP bonus if any
            if xp_bonus > 0:
                award_xp(
                    user_id=user_id,
                    amount=xp_bonus,
                    reason=f"Achievement bonus: {achievement.get('name')}",
                    source_type="achievement",
                    source_id=achievement_id,
                )

            new_achievements.append(achievement)

    return new_achievements


def get_user_achievements(user_id: str) -> list[dict]:
    """Get all achievements for a user (earned and unearned)."""
    db = get_db()

    # Get all achievements
    all_achievements_result = db.table("achievements").select("*").execute()
    all_achievements = {a.get("id"): a for a in all_achievements_result.data or []}

    # Get earned achievements
    earned_result = (
        db.table("user_achievements")
        .select("*")
        .eq("user_id", user_id)
        .execute()
    )
    earned_map = {a.get("achievement_id"): a for a in earned_result.data or []}

    # Combine
    result = []
    for achievement_id, achievement in all_achievements.items():
        earned_entry = earned_map.get(achievement_id)
        result.append({
            "id": achievement_id,
            "name": achievement.get("name"),
            "description": achievement.get("description"),
            "icon": achievement.get("icon"),
            "category": achievement.get("category"),
            "xp_bonus": achievement.get("xp_bonus", 0),
            "earned": achievement_id in earned_map,
            "earned_at": earned_entry.get("earned_at") if earned_entry else None,
        })

    return result


# ─────────────────────────────────────────────────────────────────────────────
# LEADERBOARD
# ─────────────────────────────────────────────────────────────────────────────

def get_leaderboard(limit: int = 20) -> list[dict]:
    """Get the top users by XP."""
    db = get_db()

    result = (
        db.table("users")
        .select("id, username, xp, current_streak")
        .order("xp", desc=True)
        .limit(limit)
        .execute()
    )

    leaderboard = []
    for i, user in enumerate(result.data or [], 1):
        # Get achievement count for each user
        achievement_count = (
            db.table("user_achievements")
            .select("id")
            .eq("user_id", user.get("id"))
            .execute()
        )

        leaderboard.append({
            "rank": i,
            "user_id": user.get("id"),
            "username": user.get("username"),
            "xp": user.get("xp", 0),
            "current_streak": user.get("current_streak", 0),
            "achievements_count": len(achievement_count.data or []),
        })

    return leaderboard


def get_user_rank(user_id: str) -> int:
    """Get a user's rank in the leaderboard."""
    db = get_db()

    # Get user's XP
    user_result = db.table("users").select("xp").eq("id", user_id).single().execute()
    if not user_result.data:
        return 0

    user_xp = user_result.data.get("xp", 0)

    # Count users with more XP
    higher_count = (
        db.table("users")
        .select("id")
        .gt("xp", user_xp)
        .execute()
    )

    return len(higher_count.data or []) + 1


# ─────────────────────────────────────────────────────────────────────────────
# COMBINED XP + STREAK + ACHIEVEMENTS
# ─────────────────────────────────────────────────────────────────────────────

def complete_exercise(user_id: str, exercise_id: str, xp_amount: int) -> dict:
    """
    Process exercise completion:
    1. Award XP
    2. Update streak
    3. Check for achievements

    Args:
        user_id: The user's ID
        exercise_id: The completed exercise's ID
        xp_amount: XP to award for this exercise

    Returns:
        dict with xp_awarded, new_xp_total, new_streak, achievements_unlocked
    """
    # Award XP
    xp_result = award_xp(
        user_id=user_id,
        amount=xp_amount,
        reason=f"Exercise completion: {exercise_id}",
        source_type="exercise",
        source_id=exercise_id,
    )

    # Update streak
    streak_result = update_streak(user_id)

    # Check for achievements
    new_achievements = check_and_award_achievements(user_id)

    return {
        "xp_awarded": xp_result["xp_awarded"],
        "new_xp_total": xp_result["new_xp_total"],
        "new_streak": streak_result["current_streak"],
        "achievements_unlocked": new_achievements,
    }
