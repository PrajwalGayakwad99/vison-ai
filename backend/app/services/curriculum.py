"""
Curriculum Service
==================
Course, Module, Lesson, Topic, and Exercise management for Vision AI.
"""

from __future__ import annotations

from datetime import datetime
from typing import Optional

from app.services.db import get_db


# ─────────────────────────────────────────────────────────────────────────────
# COURSE OPERATIONS
# ─────────────────────────────────────────────────────────────────────────────

def get_all_courses(published_only: bool = True) -> list[dict]:
    """Get all courses, optionally filtering by published status."""
    db = get_db()

    query = db.table("courses").select("*")

    if published_only:
        query = query.eq("is_published", True)

    result = query.order("created_at", desc=True).execute()
    return result.data or []


def get_course_by_id(course_id: str) -> Optional[dict]:
    """Get a single course by ID."""
    db = get_db()
    result = db.table("courses").select("*").eq("id", course_id).single().execute()
    return result.data


def get_course_by_slug(slug: str) -> Optional[dict]:
    """Get a single course by slug."""
    db = get_db()
    result = db.table("courses").select("*").eq("slug", slug).single().execute()
    return result.data


def get_course_with_modules(course_id: str) -> Optional[dict]:
    """Get a course with all its modules and their lessons."""
    db = get_db()

    # Get course
    course = get_course_by_id(course_id)
    if not course:
        return None

    # Get modules
    modules_result = (
        db.table("modules")
        .select("*")
        .eq("course_id", course_id)
        .order("order_index")
        .execute()
    )

    modules = []
    for module in modules_result.data or []:
        # Get lessons for each module
        lessons_result = (
            db.table("lessons")
            .select("*")
            .eq("module_id", module.get("id"))
            .order("order_index")
            .execute()
        )

        module_data = {
            **module,
            "lessons": lessons_result.data or [],
        }

        # Get topics for each lesson
        for lesson in module_data["lessons"]:
            topics_result = (
                db.table("topics")
                .select("*")
                .eq("lesson_id", lesson.get("id"))
                .order("order_index")
                .execute()
            )
            lesson["topics"] = topics_result.data or []

        modules.append(module_data)

    return {
        **course,
        "modules": modules,
    }


def create_course(data: dict) -> dict:
    """Create a new course."""
    db = get_db()

    data["created_at"] = datetime.utcnow().isoformat()
    data["updated_at"] = datetime.utcnow().isoformat()

    result = db.table("courses").insert(data).execute()

    if not result.data:
        raise Exception("Failed to create course")

    return result.data[0]


def update_course(course_id: str, data: dict) -> dict:
    """Update a course."""
    db = get_db()

    data["updated_at"] = datetime.utcnow().isoformat()

    result = (
        db.table("courses")
        .update(data)
        .eq("id", course_id)
        .execute()
    )

    if not result.data:
        raise Exception("Course not found or update failed")

    return result.data[0]


def delete_course(course_id: str) -> bool:
    """Delete a course (cascades to modules, lessons, topics, exercises)."""
    db = get_db()
    db.table("courses").delete().eq("id", course_id).execute()
    return True


# ─────────────────────────────────────────────────────────────────────────────
# MODULE OPERATIONS
# ─────────────────────────────────────────────────────────────────────────────

def get_modules_by_course(course_id: str) -> list[dict]:
    """Get all modules for a course."""
    db = get_db()
    result = (
        db.table("modules")
        .select("*")
        .eq("course_id", course_id)
        .order("order_index")
        .execute()
    )
    return result.data or []


def get_module_by_id(module_id: str) -> Optional[dict]:
    """Get a single module by ID."""
    db = get_db()
    result = db.table("modules").select("*").eq("id", module_id).single().execute()
    return result.data


def get_module_with_lessons(module_id: str) -> Optional[dict]:
    """Get a module with all its lessons and topics."""
    db = get_db()

    module = get_module_by_id(module_id)
    if not module:
        return None

    lessons_result = (
        db.table("lessons")
        .select("*")
        .eq("module_id", module_id)
        .order("order_index")
        .execute()
    )

    lessons = []
    for lesson in lessons_result.data or []:
        topics_result = (
            db.table("topics")
            .select("*")
            .eq("lesson_id", lesson.get("id"))
            .order("order_index")
            .execute()
        )
        lessons.append({
            **lesson,
            "topics": topics_result.data or [],
        })

    return {
        **module,
        "lessons": lessons,
    }


def create_module(data: dict) -> dict:
    """Create a new module."""
    db = get_db()

    data["created_at"] = datetime.utcnow().isoformat()
    data["updated_at"] = datetime.utcnow().isoformat()

    result = db.table("modules").insert(data).execute()

    if not result.data:
        raise Exception("Failed to create module")

    return result.data[0]


def update_module(module_id: str, data: dict) -> dict:
    """Update a module."""
    db = get_db()

    data["updated_at"] = datetime.utcnow().isoformat()

    result = (
        db.table("modules")
        .update(data)
        .eq("id", module_id)
        .execute()
    )

    if not result.data:
        raise Exception("Module not found or update failed")

    return result.data[0]


def delete_module(module_id: str) -> bool:
    """Delete a module."""
    db = get_db()
    db.table("modules").delete().eq("id", module_id).execute()
    return True


# ─────────────────────────────────────────────────────────────────────────────
# LESSON OPERATIONS
# ─────────────────────────────────────────────────────────────────────────────

def get_lessons_by_module(module_id: str) -> list[dict]:
    """Get all lessons for a module."""
    db = get_db()
    result = (
        db.table("lessons")
        .select("*")
        .eq("module_id", module_id)
        .order("order_index")
        .execute()
    )
    return result.data or []


def get_lesson_by_id(lesson_id: str) -> Optional[dict]:
    """Get a single lesson by ID."""
    db = get_db()
    result = db.table("lessons").select("*").eq("id", lesson_id).single().execute()
    return result.data


def get_lesson_with_topics(lesson_id: str) -> Optional[dict]:
    """Get a lesson with all its topics."""
    db = get_db()

    lesson = get_lesson_by_id(lesson_id)
    if not lesson:
        return None

    topics_result = (
        db.table("topics")
        .select("*")
        .eq("lesson_id", lesson_id)
        .order("order_index")
        .execute()
    )

    return {
        **lesson,
        "topics": topics_result.data or [],
    }


def create_lesson(data: dict) -> dict:
    """Create a new lesson."""
    db = get_db()

    data["created_at"] = datetime.utcnow().isoformat()
    data["updated_at"] = datetime.utcnow().isoformat()

    result = db.table("lessons").insert(data).execute()

    if not result.data:
        raise Exception("Failed to create lesson")

    return result.data[0]


def update_lesson(lesson_id: str, data: dict) -> dict:
    """Update a lesson."""
    db = get_db()

    data["updated_at"] = datetime.utcnow().isoformat()

    result = (
        db.table("lessons")
        .update(data)
        .eq("id", lesson_id)
        .execute()
    )

    if not result.data:
        raise Exception("Lesson not found or update failed")

    return result.data[0]


def delete_lesson(lesson_id: str) -> bool:
    """Delete a lesson."""
    db = get_db()
    db.table("lessons").delete().eq("id", lesson_id).execute()
    return True


# ─────────────────────────────────────────────────────────────────────────────
# TOPIC OPERATIONS
# ─────────────────────────────────────────────────────────────────────────────

def get_topics_by_lesson(lesson_id: str) -> list[dict]:
    """Get all topics for a lesson."""
    db = get_db()
    result = (
        db.table("topics")
        .select("*")
        .eq("lesson_id", lesson_id)
        .order("order_index")
        .execute()
    )
    return result.data or []


def get_topic_by_id(topic_id: str) -> Optional[dict]:
    """Get a single topic by ID."""
    db = get_db()
    result = db.table("topics").select("*").eq("id", topic_id).single().execute()
    return result.data


def create_topic(data: dict) -> dict:
    """Create a new topic."""
    db = get_db()

    data["created_at"] = datetime.utcnow().isoformat()
    data["updated_at"] = datetime.utcnow().isoformat()

    result = db.table("topics").insert(data).execute()

    if not result.data:
        raise Exception("Failed to create topic")

    return result.data[0]


def update_topic(topic_id: str, data: dict) -> dict:
    """Update a topic."""
    db = get_db()

    data["updated_at"] = datetime.utcnow().isoformat()

    result = (
        db.table("topics")
        .update(data)
        .eq("id", topic_id)
        .execute()
    )

    if not result.data:
        raise Exception("Topic not found or update failed")

    return result.data[0]


def delete_topic(topic_id: str) -> bool:
    """Delete a topic."""
    db = get_db()
    db.table("topics").delete().eq("id", topic_id).execute()
    return True


# ─────────────────────────────────────────────────────────────────────────────
# EXERCISE OPERATIONS
# ─────────────────────────────────────────────────────────────────────────────

def get_exercises_by_topic(topic_id: str) -> list[dict]:
    """Get all exercises for a topic."""
    db = get_db()
    result = (
        db.table("exercises")
        .select("*")
        .eq("topic_id", topic_id)
        .order("order_index")
        .execute()
    )
    return result.data or []


def get_exercise_by_id(exercise_id: str) -> Optional[dict]:
    """Get a single exercise by ID."""
    db = get_db()
    result = db.table("exercises").select("*").eq("id", exercise_id).single().execute()
    return result.data


def create_exercise(data: dict) -> dict:
    """Create a new exercise."""
    db = get_db()

    data["created_at"] = datetime.utcnow().isoformat()
    data["updated_at"] = datetime.utcnow().isoformat()

    # Convert lists to JSON for JSONB columns
    if "test_cases" in data and isinstance(data["test_cases"], list):
        import json
        data["test_cases"] = json.dumps(data["test_cases"])
    if "hints" in data and isinstance(data["hints"], list):
        import json
        data["hints"] = json.dumps(data["hints"])

    result = db.table("exercises").insert(data).execute()

    if not result.data:
        raise Exception("Failed to create exercise")

    return result.data[0]


def update_exercise(exercise_id: str, data: dict) -> dict:
    """Update an exercise."""
    db = get_db()

    data["updated_at"] = datetime.utcnow().isoformat()

    # Convert lists to JSON for JSONB columns
    if "test_cases" in data and isinstance(data["test_cases"], list):
        import json
        data["test_cases"] = json.dumps(data["test_cases"])
    if "hints" in data and isinstance(data["hints"], list):
        import json
        data["hints"] = json.dumps(data["hints"])

    result = (
        db.table("exercises")
        .update(data)
        .eq("id", exercise_id)
        .execute()
    )

    if not result.data:
        raise Exception("Exercise not found or update failed")

    return result.data[0]


def delete_exercise(exercise_id: str) -> bool:
    """Delete an exercise."""
    db = get_db()
    db.table("exercises").delete().eq("id", exercise_id).execute()
    return True


# ─────────────────────────────────────────────────────────────────────────────
# USER PROGRESS OPERATIONS
# ─────────────────────────────────────────────────────────────────────────────

def get_user_progress(user_id: str, entity_type: str, entity_id: str) -> Optional[dict]:
    """Get user's progress for a specific entity (course/module/lesson/exercise)."""
    db = get_db()

    column_map = {
        "course": "course_id",
        "module": "module_id",
        "lesson": "lesson_id",
        "exercise": "exercise_id",
    }

    column = column_map.get(entity_type)
    if not column:
        raise ValueError(f"Invalid entity type: {entity_type}")

    result = (
        db.table("user_progress")
        .select("*")
        .eq("user_id", user_id)
        .eq(column, entity_id)
        .single()
        .execute()
    )

    return result.data


def update_user_progress(
    user_id: str,
    entity_type: str,
    entity_id: str,
    status: str = "in_progress",
) -> dict:
    """
    Update or create user progress for an entity.

    Args:
        user_id: User's ID
        entity_type: One of 'course', 'module', 'lesson', 'exercise'
        entity_id: ID of the entity
        status: One of 'not_started', 'in_progress', 'completed'

    Returns:
        The updated or created progress record
    """
    db = get_db()

    column_map = {
        "course": "course_id",
        "module": "module_id",
        "lesson": "lesson_id",
        "exercise": "exercise_id",
    }

    column = column_map.get(entity_type)
    if not column:
        raise ValueError(f"Invalid entity type: {entity_type}")

    now = datetime.utcnow().isoformat()

    # Check if progress record exists
    existing = (
        db.table("user_progress")
        .select("*")
        .eq("user_id", user_id)
        .eq(column, entity_id)
        .single()
        .execute()
    )

    if existing.data:
        # Update existing
        update_data = {
            "status": status,
            "updated_at": now,
        }

        if status == "completed":
            update_data["completed_at"] = now

        result = (
            db.table("user_progress")
            .update(update_data)
            .eq("id", existing.data[0].get("id"))
            .execute()
        )
    else:
        # Create new
        insert_data = {
            "user_id": user_id,
            column: entity_id,
            "status": status,
            "attempts": 0,
            "created_at": now,
            "updated_at": now,
        }

        if status == "completed":
            insert_data["completed_at"] = now

        result = db.table("user_progress").insert(insert_data).execute()

    if not result.data:
        raise Exception("Failed to update progress")

    return result.data[0]


def increment_attempt(user_id: str, exercise_id: str) -> int:
    """Increment the attempt counter for an exercise."""
    db = get_db()

    now = datetime.utcnow().isoformat()

    # Check if progress exists
    existing = (
        db.table("user_progress")
        .select("attempts")
        .eq("user_id", user_id)
        .eq("exercise_id", exercise_id)
        .single()
        .execute()
    )

    if existing.data:
        current_attempts = existing.data.get("attempts", 0)
        new_attempts = current_attempts + 1

        db.table("user_progress").update({
            "attempts": new_attempts,
            "updated_at": now,
        }).eq("user_id", user_id).eq("exercise_id", exercise_id).execute()

        return new_attempts
    else:
        # Create new progress record
        db.table("user_progress").insert({
            "user_id": user_id,
            "exercise_id": exercise_id,
            "status": "in_progress",
            "attempts": 1,
            "created_at": now,
            "updated_at": now,
        }).execute()

        return 1


def get_user_course_progress(user_id: str, course_id: str) -> dict:
    """Get comprehensive progress for a course including all modules/lessons."""
    db = get_db()

    course = get_course_by_id(course_id)
    if not course:
        raise Exception("Course not found")

    # Get all progress for this user and course
    progress_result = (
        db.table("user_progress")
        .select("*")
        .eq("user_id", user_id)
        .eq("course_id", course_id)
        .execute()
    )

    progress_map = {}
    for p in progress_result.data or []:
        for key in ["course_id", "module_id", "lesson_id", "exercise_id"]:
            if p.get(key):
                progress_map[key] = p

    # Get modules with their lessons
    modules = get_modules_by_course(course_id)

    for module in modules:
        module_progress = progress_map.get("module_id", {})
        module["status"] = module_progress.get("status", "not_started")

        lessons = get_lessons_by_module(module["id"])
        for lesson in lessons:
            lesson_progress = progress_map.get("lesson_id", {})
            lesson["status"] = lesson_progress.get("status", "not_started")

            # Get topics with exercises
            topics = get_topics_by_lesson(lesson["id"])
            for topic in topics:
                exercises = get_exercises_by_topic(topic["id"])
                topic["exercises"] = exercises

            lesson["topics"] = topics

        module["lessons"] = lessons

    return {
        **course,
        "modules": modules,
    }
