"""
Analytics Service
================
User performance tracking, skill gap analysis, and data for frontend charts.
"""

from __future__ import annotations

from datetime import date, datetime, timedelta
from typing import Optional

from app.services.db import get_db


# ─────────────────────────────────────────────────────────────────────────────
# HEATMAP DATA
# ─────────────────────────────────────────────────────────────────────────────

def get_user_heatmap(user_id: str, days: int = 365) -> dict:
    """
    Get user's activity heatmap for the last N days.
    Returns GitHub-style contribution data.

    Args:
        user_id: User's UUID
        days: Number of days to retrieve (default 365)

    Returns:
        dict with heatmap entries and statistics
    """
    db = get_db()

    # Get daily activity from aggregated table
    start_date = date.today() - timedelta(days=days)
    end_date = date.today()

    result = (
        db.table("daily_activity_heatmap")
        .select("*")
        .eq("user_id", user_id)
        .gte("activity_date", start_date.isoformat())
        .lte("activity_date", end_date.isoformat())
        .order("activity_date")
        .execute()
    )

    # Create a map of date -> activity
    activity_map = {}
    for row in result.data or []:
        activity_date = row.get("activity_date")
        if isinstance(activity_date, str):
            activity_date = date.fromisoformat(activity_date.split("T")[0])
        activity_map[activity_date] = row

    # Generate all days with 0 for missing dates
    entries = []
    current = start_date
    while current <= end_date:
        activity = activity_map.get(current, {})
        count = (
            activity.get("executions_count", 0) +
            activity.get("tutor_sessions_count", 0) +
            activity.get("exercises_completed", 0)
        )
        level = _calculate_heatmap_level(count)

        entries.append({
            "date": current,
            "count": count,
            "level": level,
        })
        current += timedelta(days=1)

    # Calculate streaks
    total_contributions = sum(e["count"] > 0 for e in entries)
    current_streak = _calculate_current_streak(entries)
    longest_streak = _calculate_longest_streak(entries)

    return {
        "user_id": user_id,
        "days": days,
        "entries": entries,
        "total_contributions": total_contributions,
        "longest_streak": longest_streak,
        "current_streak": current_streak,
    }


def _calculate_heatmap_level(count: int) -> int:
    """Calculate heatmap intensity level (0-4) based on activity count."""
    if count == 0:
        return 0
    elif count <= 2:
        return 1
    elif count <= 5:
        return 2
    elif count <= 10:
        return 3
    else:
        return 4


def _calculate_current_streak(entries: list[dict]) -> int:
    """Calculate current consecutive days with activity."""
    streak = 0
    for entry in reversed(entries):
        if entry["count"] > 0:
            streak += 1
        elif streak > 0:
            break
    return streak


def _calculate_longest_streak(entries: list[dict]) -> int:
    """Calculate longest consecutive days streak."""
    longest = 0
    current = 0
    for entry in entries:
        if entry["count"] > 0:
            current += 1
            longest = max(longest, current)
        else:
            current = 0
    return longest


# ─────────────────────────────────────────────────────────────────────────────
# SKILL METRICS
# ─────────────────────────────────────────────────────────────────────────────

def calculate_skill_metrics(user_id: str) -> dict:
    """
    Calculate user's proficiency scores for different skills.
    Analyzes execution history and progress to determine skill levels.

    Args:
        user_id: User's UUID

    Returns:
        dict with skill proficiency data for radar chart
    """
    db = get_db()

    # Define skill keywords to track
    skill_keywords = {
        "Variables": ["=", "variable", "assign", "int", "str", "float"],
        "Lists": ["[", "]", "list", "append", "pop", "index"],
        "Dictionaries": ["{", "}", "dict", "keys", "values", "items"],
        "Loops": ["for", "while", "range", "iterate", "loop"],
        "Functions": ["def", "return", "function", "lambda", "args", "kwargs"],
        "Conditionals": ["if", "elif", "else", "switch", "case"],
        "Recursion": ["def", "return", "recursion", "recursive"],
        "Classes": ["class", "self", "__init__", "object", "oop"],
        "Exceptions": ["try", "except", "raise", "exception", "error", "traceback"],
        "File I/O": ["open", "read", "write", "file", "with"],
    }

    skill_categories = {
        "Python Basics": ["Variables", "Conditionals", "Loops"],
        "Data Structures": ["Lists", "Dictionaries"],
        "Advanced": ["Functions", "Recursion", "Classes", "Exceptions"],
        "I/O": ["File I/O"],
    }

    # Get user's execution logs
    exec_result = (
        db.table("execution_logs")
        .select("code, status, language, created_at")
        .eq("user_id", user_id)
        .order("created_at", desc=True)
        .limit(500)
        .execute()
    )

    # Calculate proficiency for each skill
    skills = []
    for skill_name, keywords in skill_keywords.items():
        total_attempts = 0
        successful_attempts = 0

        for log in exec_result.data or []:
            code = (log.get("code") or "").lower()
            status = log.get("status")

            # Check if any keyword matches
            if any(kw.lower() in code for kw in keywords):
                total_attempts += 1
                if status == "success":
                    successful_attempts += 1

        # Calculate proficiency score (0-100)
        if total_attempts > 0:
            base_score = (successful_attempts / total_attempts) * 100
            # Bonus for volume (up to 20 points)
            volume_bonus = min(total_attempts // 10, 20)
            proficiency = min(100, int(base_score + volume_bonus))
        else:
            proficiency = 0

        skills.append({
            "skill_name": skill_name,
            "category": _get_skill_category(skill_name, skill_categories),
            "proficiency": proficiency,
            "total_attempts": total_attempts,
            "successful_attempts": successful_attempts,
            "last_practiced": None,  # Would need to query specific skill history
        })

    # Calculate overall score
    if skills:
        overall_score = sum(s["proficiency"] for s in skills) / len(skills)
    else:
        overall_score = 0

    # Find strongest and weakest
    sorted_skills = sorted(skills, key=lambda x: x["proficiency"], reverse=True)
    strongest = sorted_skills[0]["skill_name"] if sorted_skills and sorted_skills[0]["proficiency"] > 0 else None
    weakest = sorted_skills[-1]["skill_name"] if sorted_skills else None

    return {
        "user_id": user_id,
        "skills": skills,
        "overall_score": round(overall_score, 1),
        "strongest_skill": strongest,
        "weakest_skill": weakest,
    }


def _get_skill_category(skill_name: str, categories: dict) -> str:
    """Get the category for a skill."""
    for category, skills in categories.items():
        if skill_name in skills:
            return category
    return "General"


# ─────────────────────────────────────────────────────────────────────────────
# GENERAL STATS
# ─────────────────────────────────────────────────────────────────────────────

def get_general_stats(user_id: str, days: int = 90) -> dict:
    """
    Get general learning statistics for a user.

    Args:
        user_id: User's UUID
        days: Number of days to analyze

    Returns:
        dict with general statistics
    """
    db = get_db()
    start_date = datetime.utcnow() - timedelta(days=days)

    # Get execution logs
    exec_result = (
        db.table("execution_logs")
        .select("status, execution_time_ms, language, stderr, created_at")
        .eq("user_id", user_id)
        .gte("created_at", start_date.isoformat())
        .execute()
    )

    executions = exec_result.data or []

    # Calculate execution stats
    total_executions = len(executions)
    successful_executions = sum(1 for e in executions if e.get("status") == "success")
    total_time_ms = sum(e.get("execution_time_ms", 0) or 0 for e in executions)
    hours_coded = total_time_ms / (1000 * 60 * 60)  # Convert to hours

    # Get most common errors
    error_counts = {}
    for e in executions:
        stderr = e.get("stderr") or ""
        if e.get("status") == "error" and stderr:
            error_type = _extract_error_type(stderr)
            error_counts[error_type] = error_counts.get(error_type, 0) + 1

    top_errors = [
        {"error_type": err, "frequency": freq}
        for err, freq in sorted(error_counts.items(), key=lambda x: x[1], reverse=True)[:10]
    ]

    # Get tutor sessions count
    tutor_result = (
        db.table("tutor_sessions")
        .select("id")
        .eq("user_id", user_id)
        .gte("created_at", start_date.isoformat())
        .execute()
    )
    total_tutor_sessions = len(tutor_result.data or [])

    # Get XP earned
    xp_result = (
        db.table("xp_transactions")
        .select("amount")
        .eq("user_id", user_id)
        .gte("created_at", start_date.isoformat())
        .execute()
    )
    total_xp = sum(t.get("amount", 0) for t in xp_result.data or [])

    # Get weekly pattern
    weekly_pattern = _calculate_weekly_pattern(user_id, days)

    # Determine most active day
    most_active_day = None
    if weekly_pattern:
        max_activity = max(w.get("total_sessions", 0) for w in weekly_pattern)
        for w in weekly_pattern:
            if w.get("total_sessions", 0) == max_activity:
                most_active_day = w.get("day_name", "").strip()
                break

    # Calculate average session length
    avg_session_length = 0
    if total_executions > 0:
        avg_session_length = (total_time_ms / total_executions) / 1000 / 60  # minutes

    # Get exercises completed
    exercises_result = (
        db.table("user_progress")
        .select("id")
        .eq("user_id", user_id)
        .eq("status", "completed")
        .eq("exercise_id", "exercise_id")
        .gte("updated_at", start_date.isoformat())
        .execute()
    )
    exercises_completed = len([p for p in exercises_result.data or [] if p.get("exercise_id")])

    # Calculate success rate
    success_rate = (successful_executions / total_executions * 100) if total_executions > 0 else 0

    # Identify strongest and improvement areas
    strongest = [s["skill_name"] for s in calculate_skill_metrics(user_id)["skills"] if s["proficiency"] >= 70][:5]
    improvement = [s["skill_name"] for s in calculate_skill_metrics(user_id)["skills"] if s["proficiency"] < 50][:5]

    return {
        "user_id": user_id,
        "total_executions": total_executions,
        "successful_executions": successful_executions,
        "success_rate": round(success_rate, 1),
        "total_tutor_sessions": total_tutor_sessions,
        "total_xp_earned": total_xp,
        "hours_coded": round(hours_coded, 2),
        "avg_session_length_minutes": round(avg_session_length, 1),
        "most_active_day": most_active_day,
        "weekly_pattern": weekly_pattern,
        "top_errors": top_errors,
        "strongest_topics": strongest,
        "areas_for_improvement": improvement,
    }


def _extract_error_type(stderr: str) -> str:
    """Extract a clean error type from stderr."""
    if not stderr:
        return "Unknown Error"

    # Common error patterns
    error_patterns = [
        ("SyntaxError", "SyntaxError"),
        ("IndentationError", "IndentationError"),
        ("NameError", "NameError"),
        ("TypeError", "TypeError"),
        ("ValueError", "ValueError"),
        ("IndexError", "IndexError"),
        ("KeyError", "KeyError"),
        ("AttributeError", "AttributeError"),
        ("ZeroDivisionError", "ZeroDivisionError"),
        ("ImportError", "ImportError"),
        ("ModuleNotFoundError", "ModuleNotFoundError"),
        ("FileNotFoundError", "FileNotFoundError"),
        ("TimeoutError", "TimeoutError"),
    ]

    for pattern, name in error_patterns:
        if pattern in stderr:
            return name

    # Return first line if no pattern matches
    first_line = stderr.split("\n")[0]
    if first_line:
        return first_line[:50]  # Truncate long error messages
    return "Unknown Error"


def _calculate_weekly_pattern(user_id: str, days: int) -> list[dict]:
    """Calculate average activity by day of week."""
    db = get_db()
    start_date = date.today() - timedelta(days=days)

    result = (
        db.table("daily_activity_heatmap")
        .select("activity_date, executions_count, xp_earned, tutor_sessions_count")
        .eq("user_id", user_id)
        .gte("activity_date", start_date.isoformat())
        .execute()
    )

    # Group by day of week
    day_stats = {i: {"exec_sum": 0, "xp_sum": 0, "tutor_sum": 0, "count": 0} for i in range(7)}
    day_names = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]

    for row in result.data or []:
        activity_date = row.get("activity_date")
        if isinstance(activity_date, str):
            activity_date = date.fromisoformat(activity_date.split("T")[0])
        dow = activity_date.weekday()

        day_stats[dow]["exec_sum"] += row.get("executions_count", 0)
        day_stats[dow]["xp_sum"] += row.get("xp_earned", 0)
        day_stats[dow]["tutor_sum"] += row.get("tutor_sessions_count", 0)
        day_stats[dow]["count"] += 1

    # Calculate averages
    weekly_pattern = []
    for i in range(7):
        stats = day_stats[i]
        count = stats["count"] or 1  # Avoid division by zero
        weekly_pattern.append({
            "day_of_week": i,
            "day_name": day_names[i],
            "avg_executions": round(stats["exec_sum"] / count, 1),
            "avg_xp": round(stats["xp_sum"] / count, 1),
            "total_sessions": stats["tutor_sum"],
        })

    return weekly_pattern


# ─────────────────────────────────────────────────────────────────────────────
# PROGRESS OVER TIME
# ─────────────────────────────────────────────────────────────────────────────

def get_progress_over_time(user_id: str, days: int = 30) -> list[dict]:
    """
    Get cumulative progress over time for charts.

    Args:
        user_id: User's UUID
        days: Number of days

    Returns:
        list of daily progress snapshots
    """
    db = get_db()
    start_date = date.today() - timedelta(days=days)

    # Get daily activity
    result = (
        db.table("daily_activity_heatmap")
        .select("activity_date, xp_earned, exercises_completed, minutes_active")
        .eq("user_id", user_id)
        .gte("activity_date", start_date.isoformat())
        .order("activity_date")
        .execute()
    )

    # Calculate cumulative values
    cumulative_xp = 0
    cumulative_exercises = 0
    cumulative_hours = 0.0

    progress = []
    for row in result.data or []:
        activity_date = row.get("activity_date")
        if isinstance(activity_date, str):
            activity_date = date.fromisoformat(activity_date.split("T")[0])

        cumulative_xp += row.get("xp_earned", 0)
        cumulative_exercises += row.get("exercises_completed", 0)
        cumulative_hours += (row.get("minutes_active", 0) or 0) / 60

        progress.append({
            "date": activity_date,
            "cumulative_xp": cumulative_xp,
            "cumulative_exercises": cumulative_exercises,
            "cumulative_hours": round(cumulative_hours, 2),
        })

    return progress


# ─────────────────────────────────────────────────────────────────────────────
# ERROR TRACKING
# ─────────────────────────────────────────────────────────────────────────────

def track_error(user_id: str, error_type: str, error_message: str, language: str = "python") -> None:
    """
    Track an error occurrence for analytics.

    Args:
        user_id: User's UUID
        error_type: Type of error
        error_message: Error message
        language: Programming language
    """
    db = get_db()

    # Check if this error type already exists for this user
    existing = (
        db.table("user_error_logs")
        .select("*")
        .eq("user_id", user_id)
        .eq("error_type", error_type)
        .eq("language", language)
        .single()
        .execute()
    )

    if existing.data:
        # Update frequency
        db.table("user_error_logs").update({
            "frequency": existing.data[0].get("frequency", 0) + 1,
            "last_occurred_at": datetime.utcnow().isoformat(),
            "updated_at": datetime.utcnow().isoformat(),
        }).eq("id", existing.data[0].get("id")).execute()
    else:
        # Create new entry
        db.table("user_error_logs").insert({
            "user_id": user_id,
            "error_type": error_type,
            "error_message": error_message[:500] if error_message else None,
            "language": language,
            "frequency": 1,
        }).execute()


# ─────────────────────────────────────────────────────────────────────────────
# SKILL METRICS UPDATE
# ─────────────────────────────────────────────────────────────────────────────

def update_skill_metrics(user_id: str, skill_name: str, success: bool) -> None:
    """
    Update skill proficiency metrics after an execution.

    Args:
        user_id: User's UUID
        skill_name: Name of the skill being practiced
        success: Whether the execution was successful
    """
    db = get_db()
    now = datetime.utcnow()

    # Check if skill record exists
    existing = (
        db.table("user_skill_metrics")
        .select("*")
        .eq("user_id", user_id)
        .eq("skill_name", skill_name)
        .single()
        .execute()
    )

    if existing.data:
        # Update existing
        record = existing.data[0]
        new_total = record.get("total_attempts", 0) + 1
        new_success = record.get("successful_attempts", 0) + (1 if success else 0)

        # Recalculate proficiency
        base_score = (new_success / new_total) * 100
        volume_bonus = min(new_total // 10, 20)
        proficiency = min(100, int(base_score + volume_bonus))

        db.table("user_skill_metrics").update({
            "total_attempts": new_total,
            "successful_attempts": new_success,
            "proficiency_score": proficiency,
            "last_practiced_at": now.isoformat(),
            "updated_at": now.isoformat(),
        }).eq("id", record.get("id")).execute()
    else:
        # Create new
        proficiency = 100 if success else 0
        db.table("user_skill_metrics").insert({
            "user_id": user_id,
            "skill_name": skill_name,
            "skill_category": _get_skill_category(skill_name, {}),
            "total_attempts": 1,
            "successful_attempts": 1 if success else 0,
            "proficiency_score": proficiency,
            "last_practiced_at": now.isoformat(),
        }).execute()


# ─────────────────────────────────────────────────────────────────────────────
# DASHBOARD AGGREGATION
# ─────────────────────────────────────────────────────────────────────────────

def get_user_dashboard(user_id: str) -> dict:
    """
    Get complete analytics dashboard data.
    Combines heatmap, skills, and stats for the frontend.

    Args:
        user_id: User's UUID

    Returns:
        dict with all analytics data
    """
    heatmap = get_user_heatmap(user_id, days=365)
    skills = calculate_skill_metrics(user_id)
    stats = get_general_stats(user_id, days=90)
    progress = get_progress_over_time(user_id, days=30)

    # Convert datetime objects to strings for JSON serialization
    for entry in heatmap["entries"]:
        if isinstance(entry["date"], date):
            entry["date"] = entry["date"].isoformat()

    for entry in progress:
        if isinstance(entry["date"], date):
            entry["date"] = entry["date"].isoformat()

    return {
        "heatmap": heatmap,
        "skill_radar": skills,
        "learning_stats": stats,
        "progress_trend": progress,
    }
