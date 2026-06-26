from __future__ import annotations

from datetime import datetime, date
from typing import Optional, Any
from pydantic import BaseModel, EmailStr, Field


# ── Auth ──────────────────────────────────────────────────────────────────────
class UserCreate(BaseModel):
    username: str
    email: EmailStr
    password: str = Field(..., min_length=8, max_length=128)


class UserOut(BaseModel):
    id: str
    username: str
    email: EmailStr
    xp: int = 0
    current_streak: int = 0
    longest_streak: int = 0

    model_config = {"from_attributes": True}


class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"


# ── Code Execution ────────────────────────────────────────────────────────────
class ExecuteRequest(BaseModel):
    language: str
    code: str
    stdin: str | None = None


class ExecuteResponse(BaseModel):
    status: str
    stdout: str | None = None
    stderr: str | None = None
    execution_time_ms: int | None = None


# ── Sandbox Code Execution ─────────────────────────────────────────────────────
class CodeExecutionRequest(BaseModel):
    language: str = Field(default="python")
    code: str = Field(...)


class CodeExecutionResponse(BaseModel):
    status: str
    stdout: str = Field(default="")
    stderr: str = Field(default="")
    execution_time_ms: int = Field(default=0)


# ── AI Tutor ──────────────────────────────────────────────────────────────────
class TutorRequest(BaseModel):
    message: str
    code_context: str | None = None
    language: str | None = None


class TutorChatRequest(BaseModel):
    user_message: str = Field(...)
    code_context: str | None = None
    language: str = Field(default="python")


class TutorDebugRequest(BaseModel):
    code: str = Field(...)
    error_message: str = Field(...)


class TutorHintRequest(BaseModel):
    code: str = Field(...)
    language: str = Field(default="python")


class TutorResponse(BaseModel):
    reply: str = Field(...)
    suggested_fix: str | None = Field(None)
    status: str = Field(default="ok")


# ── Leaderboard ───────────────────────────────────────────────────────────────
class LeaderboardEntry(BaseModel):
    rank: int
    username: str
    xp: int


# ── Visual Code Tracker ───────────────────────────────────────────────────────
class VisualizeRequest(BaseModel):
    language: str = Field(default="python")
    code: str = Field(...)


class VisualizeResponse(BaseModel):
    status: str = Field(default="ok")
    timeline: list[dict] = Field(default_factory=list)
    total_steps: int = Field(default=0)


# =============================================================================
# PHASE 5: CURRICULUM SYSTEM SCHEMAS
# =============================================================================

# ── Course ───────────────────────────────────────────────────────────────────
class CourseCreate(BaseModel):
    title: str = Field(..., min_length=1, max_length=255)
    description: str | None = None
    slug: str = Field(..., min_length=1, max_length=100)
    difficulty: str = Field(default="beginner")
    estimated_hours: int = Field(default=1, ge=1)
    xp_reward: int = Field(default=100, ge=0)
    is_published: bool = Field(default=False)


class CourseUpdate(BaseModel):
    title: str | None = None
    description: str | None = None
    difficulty: str | None = None
    estimated_hours: int | None = None
    xp_reward: int | None = None
    is_published: bool | None = None


class CourseOut(BaseModel):
    id: str
    title: str
    description: str | None
    slug: str
    difficulty: str
    estimated_hours: int
    xp_reward: int
    is_published: bool
    created_at: datetime
    updated_at: datetime

    model_config = {"from_attributes": True}


class CourseWithModules(CourseOut):
    modules: list["ModuleOut"] = Field(default_factory=list)


# ── Module ─────────────────────────────────────────────────────────────────────
class ModuleCreate(BaseModel):
    course_id: str = Field(...)
    title: str = Field(..., min_length=1, max_length=255)
    description: str | None = None
    order_index: int = Field(default=0, ge=0)
    xp_reward: int = Field(default=50, ge=0)


class ModuleUpdate(BaseModel):
    title: str | None = None
    description: str | None = None
    order_index: int | None = None
    xp_reward: int | None = None


class ModuleOut(BaseModel):
    id: str
    course_id: str
    title: str
    description: str | None
    order_index: int
    xp_reward: int
    created_at: datetime
    updated_at: datetime

    model_config = {"from_attributes": True}


class ModuleWithLessons(ModuleOut):
    lessons: list["LessonOut"] = Field(default_factory=list)


# ── Lesson ─────────────────────────────────────────────────────────────────────
class LessonCreate(BaseModel):
    module_id: str = Field(...)
    title: str = Field(..., min_length=1, max_length=255)
    content: str | None = None
    content_type: str = Field(default="text")
    order_index: int = Field(default=0, ge=0)
    xp_reward: int = Field(default=25, ge=0)


class LessonUpdate(BaseModel):
    title: str | None = None
    content: str | None = None
    content_type: str | None = None
    order_index: int | None = None
    xp_reward: int | None = None


class LessonOut(BaseModel):
    id: str
    module_id: str
    title: str
    content: str | None
    content_type: str
    order_index: int
    xp_reward: int
    created_at: datetime
    updated_at: datetime

    model_config = {"from_attributes": True}


class LessonWithTopics(LessonOut):
    topics: list["TopicOut"] = Field(default_factory=list)


# ── Topic ─────────────────────────────────────────────────────────────────────
class TopicCreate(BaseModel):
    lesson_id: str = Field(...)
    title: str = Field(..., min_length=1, max_length=255)
    content: str | None = None
    order_index: int = Field(default=0, ge=0)


class TopicUpdate(BaseModel):
    title: str | None = None
    content: str | None = None
    order_index: int | None = None


class TopicOut(BaseModel):
    id: str
    lesson_id: str
    title: str
    content: str | None
    order_index: int
    created_at: datetime
    updated_at: datetime

    model_config = {"from_attributes": True}


class TopicWithExercises(TopicOut):
    exercises: list["ExerciseOut"] = Field(default_factory=list)


# ── Exercise ──────────────────────────────────────────────────────────────────
class ExerciseCreate(BaseModel):
    topic_id: str = Field(...)
    title: str = Field(..., min_length=1, max_length=255)
    description: str | None = None
    starter_code: str | None = None
    solution_code: str | None = None
    test_cases: list[dict] = Field(default_factory=list)
    hints: list[str] = Field(default_factory=list)
    difficulty: str = Field(default="easy")
    xp_reward: int = Field(default=10, ge=0)
    order_index: int = Field(default=0, ge=0)


class ExerciseUpdate(BaseModel):
    title: str | None = None
    description: str | None = None
    starter_code: str | None = None
    solution_code: str | None = None
    test_cases: list[dict] | None = None
    hints: list[str] | None = None
    difficulty: str | None = None
    xp_reward: int | None = None
    order_index: int | None = None


class ExerciseOut(BaseModel):
    id: str
    topic_id: str
    title: str
    description: str | None
    starter_code: str | None
    solution_code: str | None
    test_cases: list[dict]
    hints: list[str]
    difficulty: str
    xp_reward: int
    order_index: int
    created_at: datetime
    updated_at: datetime

    model_config = {"from_attributes": True}


class ExerciseSubmit(BaseModel):
    exercise_id: str = Field(...)
    code: str = Field(...)
    execution_time_ms: int | None = None


class ExerciseSubmitResponse(BaseModel):
    success: bool
    xp_earned: int
    message: str
    achievement_unlocked: list["AchievementOut"] | None = None


# ── User Progress ─────────────────────────────────────────────────────────────
class UserProgressOut(BaseModel):
    id: str
    user_id: str
    course_id: str | None
    module_id: str | None
    lesson_id: str | None
    exercise_id: str | None
    status: str
    completed_at: datetime | None
    attempts: int
    best_score: int | None
    created_at: datetime
    updated_at: datetime

    model_config = {"from_attributes": True}


# =============================================================================
# PHASE 6: GAMIFICATION SYSTEM SCHEMAS
# =============================================================================

# ── Achievement ────────────────────────────────────────────────────────────────
class AchievementOut(BaseModel):
    id: str
    name: str
    description: str
    icon: str | None
    category: str
    xp_bonus: int
    earned: bool = False
    earned_at: datetime | None = None

    model_config = {"from_attributes": True}


# ── XP Award ──────────────────────────────────────────────────────────────────
class XPAwardRequest(BaseModel):
    user_id: str = Field(...)
    amount: int = Field(..., ge=1, le=1000)
    reason: str = Field(...)
    source_type: str | None = None
    source_id: str | None = None


class XPAwardResponse(BaseModel):
    success: bool
    new_xp_total: int
    xp_awarded: int
    achievement_unlocked: list[AchievementOut] | None = None
    new_streak: int | None = None


# ── User Stats ────────────────────────────────────────────────────────────────
class UserStats(BaseModel):
    user_id: str
    username: str
    xp: int
    current_streak: int
    longest_streak: int
    exercises_completed: int
    courses_completed: int
    achievements_earned: int
    rank: int


class UserStreak(BaseModel):
    current_streak: int
    longest_streak: int
    last_activity_date: date | None
    weekly_goal: int
    weekly_progress: int


class XPTransaction(BaseModel):
    id: str
    user_id: str
    amount: int
    reason: str
    source_type: str | None
    source_id: str | None
    created_at: datetime

    model_config = {"from_attributes": True}


# ── Leaderboard Extended ──────────────────────────────────────────────────────
class LeaderboardEntryExtended(BaseModel):
    rank: int
    user_id: str
    username: str
    xp: int
    current_streak: int
    achievements_count: int


# Forward references resolution
CourseWithModules.model_rebuild()
ModuleWithLessons.model_rebuild()
LessonWithTopics.model_rebuild()
TopicWithExercises.model_rebuild()


# =============================================================================
# PHASE 7: ANALYTICS SYSTEM SCHEMAS
# =============================================================================

# ── Heatmap ──────────────────────────────────────────────────────────────────
class HeatmapEntry(BaseModel):
    date: date
    count: int = Field(..., description="Activity count for the day")
    level: int = Field(..., ge=0, le=4, description="Intensity level 0-4")


class HeatmapResponse(BaseModel):
    user_id: str
    days: int = Field(default=365, description="Number of days in heatmap")
    entries: list[HeatmapEntry]
    total_contributions: int
    longest_streak: int
    current_streak: int


# ── Skill Radar ────────────────────────────────────────────────────────────────
class SkillData(BaseModel):
    skill_name: str
    category: str
    proficiency: int = Field(..., ge=0, le=100)
    total_attempts: int
    successful_attempts: int
    last_practiced: datetime | None = None


class SkillRadarResponse(BaseModel):
    user_id: str
    skills: list[SkillData]
    overall_score: float = Field(..., ge=0, le=100)
    strongest_skill: str | None = None
    weakest_skill: str | None = None


# ── Learning Stats ───────────────────────────────────────────────────────────
class WeeklyPatternEntry(BaseModel):
    day_of_week: int = Field(..., ge=0, le=6)
    day_name: str
    avg_executions: float
    avg_xp: float
    total_sessions: int


class ErrorEntry(BaseModel):
    error_type: str
    frequency: int
    last_occurred: datetime | None = None


class LearningStatsResponse(BaseModel):
    user_id: str
    total_executions: int
    successful_executions: int
    success_rate: float = Field(..., ge=0, le=100)
    total_tutor_sessions: int
    total_xp_earned: int
    hours_coded: float = Field(..., ge=0)
    avg_session_length_minutes: float
    most_active_day: str | None
    weekly_pattern: list[WeeklyPatternEntry]
    top_errors: list[ErrorEntry]
    strongest_topics: list[str]
    areas_for_improvement: list[str]


# ── General Analytics ─────────────────────────────────────────────────────────
class UserActivitySummary(BaseModel):
    user_id: str
    period_start: date
    period_end: date
    total_days_active: int
    total_executions: int
    total_xp: int
    exercises_completed: int
    tutor_sessions: int


class ProgressOverTime(BaseModel):
    date: date
    cumulative_xp: int
    cumulative_exercises: int
    cumulative_hours: float


class AnalyticsDashboard(BaseModel):
    heatmap: HeatmapResponse
    skill_radar: SkillRadarResponse
    learning_stats: LearningStatsResponse
    recent_activity: list[UserActivitySummary]
    progress_trend: list[ProgressOverTime]
