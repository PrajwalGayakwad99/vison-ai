"""
Curriculum API Router
====================
RESTful endpoints for curriculum management.
"""

from fastapi import APIRouter, Depends, HTTPException, Query
from typing import Optional

from app.models.schemas import (
    CourseCreate, CourseUpdate, CourseOut, CourseWithModules,
    ModuleCreate, ModuleUpdate, ModuleOut, ModuleWithLessons,
    LessonCreate, LessonUpdate, LessonOut, LessonWithTopics,
    TopicCreate, TopicUpdate, TopicOut,
    ExerciseCreate, ExerciseUpdate, ExerciseOut, ExerciseSubmit, ExerciseSubmitResponse,
    UserProgressOut,
)
from app.services import curriculum as curriculum_service
from app.services import gamification as gamification_service
from app.api.v1.auth import get_current_user

router = APIRouter(prefix="/curriculum", tags=["curriculum"])


# =============================================================================
# COURSES
# =============================================================================

@router.get("/courses", response_model=list[CourseOut])
async def list_courses(
    published_only: bool = Query(True, description="Only show published courses"),
    _current_user: dict = Depends(get_current_user),
) -> list[CourseOut]:
    """Get all available courses."""
    courses = curriculum_service.get_all_courses(published_only=published_only)
    return [CourseOut(**c) for c in courses]


@router.get("/courses/{course_id}", response_model=CourseWithModules)
async def get_course(
    course_id: str,
    _current_user: dict = Depends(get_current_user),
) -> CourseWithModules:
    """Get a course with all its modules, lessons, and topics."""
    course = curriculum_service.get_course_with_modules(course_id)
    if not course:
        raise HTTPException(status_code=404, detail="Course not found")
    return CourseWithModules(**course)


@router.get("/courses/slug/{slug}", response_model=CourseWithModules)
async def get_course_by_slug(
    slug: str,
    _current_user: dict = Depends(get_current_user),
) -> CourseWithModules:
    """Get a course by its slug."""
    course = curriculum_service.get_course_by_slug(slug)
    if not course:
        raise HTTPException(status_code=404, detail="Course not found")

    # Get full course with modules
    full_course = curriculum_service.get_course_with_modules(course["id"])
    if not full_course:
        raise HTTPException(status_code=404, detail="Course not found")

    return CourseWithModules(**full_course)


@router.post("/courses", response_model=CourseOut, status_code=201)
async def create_course(
    payload: CourseCreate,
    _current_user: dict = Depends(get_current_user),
) -> CourseOut:
    """Create a new course (admin only in production)."""
    try:
        course = curriculum_service.create_course(payload.model_dump())
        return CourseOut(**course)
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.patch("/courses/{course_id}", response_model=CourseOut)
async def update_course(
    course_id: str,
    payload: CourseUpdate,
    _current_user: dict = Depends(get_current_user),
) -> CourseOut:
    """Update a course."""
    existing = curriculum_service.get_course_by_id(course_id)
    if not existing:
        raise HTTPException(status_code=404, detail="Course not found")

    update_data = {k: v for k, v in payload.model_dump().items() if v is not None}
    try:
        course = curriculum_service.update_course(course_id, update_data)
        return CourseOut(**course)
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.delete("/courses/{course_id}")
async def delete_course(
    course_id: str,
    _current_user: dict = Depends(get_current_user),
) -> dict:
    """Delete a course and all its content."""
    existing = curriculum_service.get_course_by_id(course_id)
    if not existing:
        raise HTTPException(status_code=404, detail="Course not found")

    curriculum_service.delete_course(course_id)
    return {"success": True, "message": "Course deleted"}


# =============================================================================
# MODULES
# =============================================================================

@router.get("/courses/{course_id}/modules", response_model=list[ModuleOut])
async def list_modules(
    course_id: str,
    _current_user: dict = Depends(get_current_user),
) -> list[ModuleOut]:
    """Get all modules for a course."""
    course = curriculum_service.get_course_by_id(course_id)
    if not course:
        raise HTTPException(status_code=404, detail="Course not found")

    modules = curriculum_service.get_modules_by_course(course_id)
    return [ModuleOut(**m) for m in modules]


@router.get("/modules/{module_id}", response_model=ModuleWithLessons)
async def get_module(
    module_id: str,
    _current_user: dict = Depends(get_current_user),
) -> ModuleWithLessons:
    """Get a module with all its lessons."""
    module = curriculum_service.get_module_with_lessons(module_id)
    if not module:
        raise HTTPException(status_code=404, detail="Module not found")
    return ModuleWithLessons(**module)


@router.post("/modules", response_model=ModuleOut, status_code=201)
async def create_module(
    payload: ModuleCreate,
    _current_user: dict = Depends(get_current_user),
) -> ModuleOut:
    """Create a new module."""
    # Verify course exists
    course = curriculum_service.get_course_by_id(payload.course_id)
    if not course:
        raise HTTPException(status_code=404, detail="Course not found")

    try:
        module = curriculum_service.create_module(payload.model_dump())
        return ModuleOut(**module)
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.patch("/modules/{module_id}", response_model=ModuleOut)
async def update_module(
    module_id: str,
    payload: ModuleUpdate,
    _current_user: dict = Depends(get_current_user),
) -> ModuleOut:
    """Update a module."""
    existing = curriculum_service.get_module_by_id(module_id)
    if not existing:
        raise HTTPException(status_code=404, detail="Module not found")

    update_data = {k: v for k, v in payload.model_dump().items() if v is not None}
    try:
        module = curriculum_service.update_module(module_id, update_data)
        return ModuleOut(**module)
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.delete("/modules/{module_id}")
async def delete_module(
    module_id: str,
    _current_user: dict = Depends(get_current_user),
) -> dict:
    """Delete a module."""
    existing = curriculum_service.get_module_by_id(module_id)
    if not existing:
        raise HTTPException(status_code=404, detail="Module not found")

    curriculum_service.delete_module(module_id)
    return {"success": True, "message": "Module deleted"}


# =============================================================================
# LESSONS
# =============================================================================

@router.get("/modules/{module_id}/lessons", response_model=list[LessonOut])
async def list_lessons(
    module_id: str,
    _current_user: dict = Depends(get_current_user),
) -> list[LessonOut]:
    """Get all lessons for a module."""
    module = curriculum_service.get_module_by_id(module_id)
    if not module:
        raise HTTPException(status_code=404, detail="Module not found")

    lessons = curriculum_service.get_lessons_by_module(module_id)
    return [LessonOut(**l) for l in lessons]


@router.get("/lessons/{lesson_id}", response_model=LessonWithTopics)
async def get_lesson(
    lesson_id: str,
    _current_user: dict = Depends(get_current_user),
) -> LessonWithTopics:
    """Get a lesson with all its topics."""
    lesson = curriculum_service.get_lesson_with_topics(lesson_id)
    if not lesson:
        raise HTTPException(status_code=404, detail="Lesson not found")
    return LessonWithTopics(**lesson)


@router.post("/lessons", response_model=LessonOut, status_code=201)
async def create_lesson(
    payload: LessonCreate,
    _current_user: dict = Depends(get_current_user),
) -> LessonOut:
    """Create a new lesson."""
    module = curriculum_service.get_module_by_id(payload.module_id)
    if not module:
        raise HTTPException(status_code=404, detail="Module not found")

    try:
        lesson = curriculum_service.create_lesson(payload.model_dump())
        return LessonOut(**lesson)
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.patch("/lessons/{lesson_id}", response_model=LessonOut)
async def update_lesson(
    lesson_id: str,
    payload: LessonUpdate,
    _current_user: dict = Depends(get_current_user),
) -> LessonOut:
    """Update a lesson."""
    existing = curriculum_service.get_lesson_by_id(lesson_id)
    if not existing:
        raise HTTPException(status_code=404, detail="Lesson not found")

    update_data = {k: v for k, v in payload.model_dump().items() if v is not None}
    try:
        lesson = curriculum_service.update_lesson(lesson_id, update_data)
        return LessonOut(**lesson)
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.delete("/lessons/{lesson_id}")
async def delete_lesson(
    lesson_id: str,
    _current_user: dict = Depends(get_current_user),
) -> dict:
    """Delete a lesson."""
    existing = curriculum_service.get_lesson_by_id(lesson_id)
    if not existing:
        raise HTTPException(status_code=404, detail="Lesson not found")

    curriculum_service.delete_lesson(lesson_id)
    return {"success": True, "message": "Lesson deleted"}


# =============================================================================
# TOPICS
# =============================================================================

@router.get("/lessons/{lesson_id}/topics", response_model=list[TopicOut])
async def list_topics(
    lesson_id: str,
    _current_user: dict = Depends(get_current_user),
) -> list[TopicOut]:
    """Get all topics for a lesson."""
    lesson = curriculum_service.get_lesson_by_id(lesson_id)
    if not lesson:
        raise HTTPException(status_code=404, detail="Lesson not found")

    topics = curriculum_service.get_topics_by_lesson(lesson_id)
    return [TopicOut(**t) for t in topics]


@router.get("/topics/{topic_id}", response_model=TopicOut)
async def get_topic(
    topic_id: str,
    _current_user: dict = Depends(get_current_user),
) -> TopicOut:
    """Get a single topic."""
    topic = curriculum_service.get_topic_by_id(topic_id)
    if not topic:
        raise HTTPException(status_code=404, detail="Topic not found")
    return TopicOut(**topic)


@router.post("/topics", response_model=TopicOut, status_code=201)
async def create_topic(
    payload: TopicCreate,
    _current_user: dict = Depends(get_current_user),
) -> TopicOut:
    """Create a new topic."""
    lesson = curriculum_service.get_lesson_by_id(payload.lesson_id)
    if not lesson:
        raise HTTPException(status_code=404, detail="Lesson not found")

    try:
        topic = curriculum_service.create_topic(payload.model_dump())
        return TopicOut(**topic)
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.patch("/topics/{topic_id}", response_model=TopicOut)
async def update_topic(
    topic_id: str,
    payload: TopicUpdate,
    _current_user: dict = Depends(get_current_user),
) -> TopicOut:
    """Update a topic."""
    existing = curriculum_service.get_topic_by_id(topic_id)
    if not existing:
        raise HTTPException(status_code=404, detail="Topic not found")

    update_data = {k: v for k, v in payload.model_dump().items() if v is not None}
    try:
        topic = curriculum_service.update_topic(topic_id, update_data)
        return TopicOut(**topic)
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.delete("/topics/{topic_id}")
async def delete_topic(
    topic_id: str,
    _current_user: dict = Depends(get_current_user),
) -> dict:
    """Delete a topic."""
    existing = curriculum_service.get_topic_by_id(topic_id)
    if not existing:
        raise HTTPException(status_code=404, detail="Topic not found")

    curriculum_service.delete_topic(topic_id)
    return {"success": True, "message": "Topic deleted"}


# =============================================================================
# EXERCISES
# =============================================================================

@router.get("/topics/{topic_id}/exercises", response_model=list[ExerciseOut])
async def list_exercises(
    topic_id: str,
    _current_user: dict = Depends(get_current_user),
) -> list[ExerciseOut]:
    """Get all exercises for a topic."""
    topic = curriculum_service.get_topic_by_id(topic_id)
    if not topic:
        raise HTTPException(status_code=404, detail="Topic not found")

    exercises = curriculum_service.get_exercises_by_topic(topic_id)
    return [ExerciseOut(**e) for e in exercises]


@router.get("/exercises/{exercise_id}", response_model=ExerciseOut)
async def get_exercise(
    exercise_id: str,
    _current_user: dict = Depends(get_current_user),
) -> ExerciseOut:
    """Get a single exercise."""
    exercise = curriculum_service.get_exercise_by_id(exercise_id)
    if not exercise:
        raise HTTPException(status_code=404, detail="Exercise not found")
    return ExerciseOut(**exercise)


@router.post("/exercises", response_model=ExerciseOut, status_code=201)
async def create_exercise(
    payload: ExerciseCreate,
    _current_user: dict = Depends(get_current_user),
) -> ExerciseOut:
    """Create a new exercise."""
    topic = curriculum_service.get_topic_by_id(payload.topic_id)
    if not topic:
        raise HTTPException(status_code=404, detail="Topic not found")

    try:
        exercise = curriculum_service.create_exercise(payload.model_dump())
        return ExerciseOut(**exercise)
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.patch("/exercises/{exercise_id}", response_model=ExerciseOut)
async def update_exercise(
    exercise_id: str,
    payload: ExerciseUpdate,
    _current_user: dict = Depends(get_current_user),
) -> ExerciseOut:
    """Update an exercise."""
    existing = curriculum_service.get_exercise_by_id(exercise_id)
    if not existing:
        raise HTTPException(status_code=404, detail="Exercise not found")

    update_data = {k: v for k, v in payload.model_dump().items() if v is not None}
    try:
        exercise = curriculum_service.update_exercise(exercise_id, update_data)
        return ExerciseOut(**exercise)
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.delete("/exercises/{exercise_id}")
async def delete_exercise(
    exercise_id: str,
    _current_user: dict = Depends(get_current_user),
) -> dict:
    """Delete an exercise."""
    existing = curriculum_service.get_exercise_by_id(exercise_id)
    if not existing:
        raise HTTPException(status_code=404, detail="Exercise not found")

    curriculum_service.delete_exercise(exercise_id)
    return {"success": True, "message": "Exercise deleted"}


# =============================================================================
# USER PROGRESS
# =============================================================================

@router.get("/progress/{entity_type}/{entity_id}", response_model=UserProgressOut)
async def get_progress(
    entity_type: str,
    entity_id: str,
    current_user: dict = Depends(get_current_user),
) -> UserProgressOut:
    """Get user's progress for a specific entity."""
    user_id = current_user.get("id")
    if not user_id:
        raise HTTPException(status_code=401, detail="User not found")

    progress = curriculum_service.get_user_progress(user_id, entity_type, entity_id)
    if not progress:
        raise HTTPException(status_code=404, detail="Progress not found")

    return UserProgressOut(**progress)


@router.post("/progress/{entity_type}/{entity_id}")
async def update_progress(
    entity_type: str,
    entity_id: str,
    status: str = "in_progress",
    current_user: dict = Depends(get_current_user),
) -> dict:
    """Update user's progress for an entity."""
    user_id = current_user.get("id")
    if not user_id:
        raise HTTPException(status_code=401, detail="User not found")

    if status not in ["not_started", "in_progress", "completed"]:
        raise HTTPException(status_code=400, detail="Invalid status")

    try:
        progress = curriculum_service.update_user_progress(
            user_id, entity_type, entity_id, status
        )
        return progress
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/exercises/{exercise_id}/submit", response_model=ExerciseSubmitResponse)
async def submit_exercise(
    exercise_id: str,
    payload: ExerciseSubmit,
    current_user: dict = Depends(get_current_user),
) -> ExerciseSubmitResponse:
    """Submit an exercise and process XP/achievements."""
    user_id = current_user.get("id")
    if not user_id:
        raise HTTPException(status_code=401, detail="User not found")

    exercise = curriculum_service.get_exercise_by_id(exercise_id)
    if not exercise:
        raise HTTPException(status_code=404, detail="Exercise not found")

    # Increment attempt counter
    attempt_number = curriculum_service.increment_attempt(user_id, exercise_id)

    # Mark as completed and award XP
    curriculum_service.update_user_progress(
        user_id, "exercise", exercise_id, "completed"
    )

    # Award XP
    xp_reward = exercise.get("xp_reward", 10)
    result = gamification_service.complete_exercise(user_id, exercise_id, xp_reward)

    # Convert achievement dicts to AchievementOut
    from app.models.schemas import AchievementOut
    achievements = [AchievementOut(**a) for a in result.get("achievements_unlocked", [])]

    return ExerciseSubmitResponse(
        success=True,
        xp_earned=result.get("xp_awarded", xp_reward),
        message=f"Exercise completed! You earned {result.get('xp_awarded', xp_reward)} XP.",
        achievement_unlocked=achievements if achievements else None,
    )
