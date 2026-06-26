-- =============================================================================
-- Vision AI - Database Setup Script (Extended for Phase 5 & 6)
-- =============================================================================
-- Run this script in your Supabase SQL Editor:
-- https://supabase.com/dashboard → Your Project → SQL Editor → New Query
-- =============================================================================

-- Enable UUID extension (required for gen_random_uuid())
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- =============================================================================
-- USERS TABLE (already exists - adding xp columns)
-- =============================================================================
-- Stores registered user accounts for authentication and gamification

CREATE TABLE IF NOT EXISTS public.users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    username TEXT NOT NULL UNIQUE,
    email TEXT NOT NULL UNIQUE,
    password_hash TEXT NOT NULL,
    xp INTEGER NOT NULL DEFAULT 0,
    current_streak INTEGER NOT NULL DEFAULT 0,
    longest_streak INTEGER NOT NULL DEFAULT 0,
    last_activity_date DATE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_users_email ON public.users(email);
CREATE INDEX IF NOT EXISTS idx_users_xp ON public.users(xp DESC);

-- =============================================================================
-- EXECUTION LOGS TABLE
-- =============================================================================

CREATE TABLE IF NOT EXISTS public.execution_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    language TEXT NOT NULL,
    code TEXT NOT NULL,
    status TEXT NOT NULL,
    stdout TEXT,
    stderr TEXT,
    execution_time_ms INTEGER,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_execution_logs_user_id ON public.execution_logs(user_id);

-- =============================================================================
-- TUTOR SESSIONS TABLE
-- =============================================================================

CREATE TABLE IF NOT EXISTS public.tutor_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    language TEXT,
    code_context TEXT,
    user_message TEXT NOT NULL,
    tutor_reply TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_tutor_sessions_user_id ON public.tutor_sessions(user_id);

-- =============================================================================
-- PHASE 5: CURRICULUM SYSTEM
-- =============================================================================

-- COURSES TABLE
CREATE TABLE IF NOT EXISTS public.courses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    description TEXT,
    slug TEXT NOT NULL UNIQUE,
    difficulty TEXT NOT NULL DEFAULT 'beginner',
    estimated_hours INTEGER NOT NULL DEFAULT 1,
    xp_reward INTEGER NOT NULL DEFAULT 100,
    is_published BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_courses_slug ON public.courses(slug);
CREATE INDEX IF NOT EXISTS idx_courses_published ON public.courses(is_published);

-- MODULES TABLE
CREATE TABLE IF NOT EXISTS public.modules (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    course_id UUID NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    order_index INTEGER NOT NULL DEFAULT 0,
    xp_reward INTEGER NOT NULL DEFAULT 50,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_modules_course_id ON public.modules(course_id);

-- LESSONS TABLE
CREATE TABLE IF NOT EXISTS public.lessons (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    module_id UUID NOT NULL REFERENCES public.modules(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    content TEXT,
    content_type TEXT NOT NULL DEFAULT 'text',
    order_index INTEGER NOT NULL DEFAULT 0,
    xp_reward INTEGER NOT NULL DEFAULT 25,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_lessons_module_id ON public.lessons(module_id);

-- TOPICS TABLE
CREATE TABLE IF NOT EXISTS public.topics (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    lesson_id UUID NOT NULL REFERENCES public.lessons(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    content TEXT,
    order_index INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_topics_lesson_id ON public.topics(lesson_id);

-- EXERCISES TABLE
CREATE TABLE IF NOT EXISTS public.exercises (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    topic_id UUID NOT NULL REFERENCES public.topics(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    starter_code TEXT,
    solution_code TEXT,
    test_cases JSONB DEFAULT '[]'::jsonb,
    hints JSONB DEFAULT '[]'::jsonb,
    difficulty TEXT NOT NULL DEFAULT 'easy',
    xp_reward INTEGER NOT NULL DEFAULT 10,
    order_index INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_exercises_topic_id ON public.exercises(topic_id);
CREATE INDEX IF NOT EXISTS idx_exercises_difficulty ON public.exercises(difficulty);

-- USER PROGRESS TABLE
CREATE TABLE IF NOT EXISTS public.user_progress (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    course_id UUID REFERENCES public.courses(id) ON DELETE CASCADE,
    module_id UUID REFERENCES public.modules(id) ON DELETE CASCADE,
    lesson_id UUID REFERENCES public.lessons(id) ON DELETE CASCADE,
    exercise_id UUID REFERENCES public.exercises(id) ON DELETE CASCADE,
    status TEXT NOT NULL DEFAULT 'not_started',
    completed_at TIMESTAMPTZ,
    attempts INTEGER NOT NULL DEFAULT 0,
    best_score INTEGER,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE(user_id, course_id),
    UNIQUE(user_id, module_id),
    UNIQUE(user_id, lesson_id),
    UNIQUE(user_id, exercise_id)
);

CREATE INDEX IF NOT EXISTS idx_user_progress_user_id ON public.user_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_user_progress_course_id ON public.user_progress(course_id);

-- =============================================================================
-- PHASE 6: GAMIFICATION SYSTEM
-- =============================================================================

-- ACHIEVEMENTS TABLE
CREATE TABLE IF NOT EXISTS public.achievements (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL UNIQUE,
    description TEXT NOT NULL,
    icon TEXT,
    category TEXT NOT NULL DEFAULT 'general',
    xp_bonus INTEGER NOT NULL DEFAULT 0,
    criteria_type TEXT NOT NULL,
    criteria_value INTEGER NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_achievements_category ON public.achievements(category);

-- USER ACHIEVEMENTS MAPPING TABLE
CREATE TABLE IF NOT EXISTS public.user_achievements (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    achievement_id UUID NOT NULL REFERENCES public.achievements(id) ON DELETE CASCADE,
    earned_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE(user_id, achievement_id)
);

CREATE INDEX IF NOT EXISTS idx_user_achievements_user_id ON public.user_achievements(user_id);

-- USER STREAKS TABLE (enhanced tracking)
CREATE TABLE IF NOT EXISTS public.user_streaks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL UNIQUE REFERENCES public.users(id) ON DELETE CASCADE,
    current_streak INTEGER NOT NULL DEFAULT 0,
    longest_streak INTEGER NOT NULL DEFAULT 0,
    last_activity_date DATE,
    weekly_goal INTEGER NOT NULL DEFAULT 7,
    weekly_progress INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- XP TRANSACTION LOG (audit trail)
CREATE TABLE IF NOT EXISTS public.xp_transactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    amount INTEGER NOT NULL,
    reason TEXT NOT NULL,
    source_type TEXT,
    source_id UUID,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_xp_transactions_user_id ON public.xp_transactions(user_id);
CREATE INDEX IF NOT EXISTS idx_xp_transactions_created_at ON public.xp_transactions(created_at DESC);

-- =============================================================================
-- SEED DATA: ACHIEVEMENTS
-- =============================================================================

INSERT INTO public.achievements (name, description, icon, category, xp_bonus, criteria_type, criteria_value) VALUES
    ('First Steps', 'Complete your first exercise', '🎯', 'milestone', 10, 'exercises_completed', 1),
    ('Getting Started', 'Complete 10 exercises', '🌟', 'milestone', 50, 'exercises_completed', 10),
    ('Code Warrior', 'Complete 50 exercises', '⚔️', 'milestone', 200, 'exercises_completed', 50),
    ('Code Master', 'Complete 100 exercises', '👑', 'milestone', 500, 'exercises_completed', 100),
    ('Streak Starter', 'Maintain a 3-day streak', '🔥', 'streak', 25, 'streak_days', 3),
    ('Week Warrior', 'Maintain a 7-day streak', '💪', 'streak', 75, 'streak_days', 7),
    ('Month Master', 'Maintain a 30-day streak', '🏆', 'streak', 300, 'streak_days', 30),
    ('Python Novice', 'Earn 100 XP', '🐍', 'xp', 25, 'total_xp', 100),
    ('Python Adept', 'Earn 500 XP', '🐍', 'xp', 100, 'total_xp', 500),
    ('Python Expert', 'Earn 1000 XP', '🐍', 'xp', 250, 'total_xp', 1000),
    ('Python Legend', 'Earn 5000 XP', '🐍', 'xp', 1000, 'total_xp', 5000),
    ('Course Completer', 'Complete your first course', '📚', 'course', 100, 'courses_completed', 1),
    ('Learning Machine', 'Complete 5 courses', '🤖', 'course', 300, 'courses_completed', 5),
    ('Bug Squasher', 'Pass 10 exercises on first try', '🐛', 'special', 75, 'first_try_success', 10),
    ('Speed Demon', 'Complete an exercise in under 30 seconds', '⚡', 'special', 50, 'speed_exercise', 1)
ON CONFLICT (name) DO NOTHING;

-- =============================================================================
-- SEED DATA: SAMPLE CURRICULUM
-- =============================================================================

-- Insert a sample course
INSERT INTO public.courses (title, description, slug, difficulty, estimated_hours, xp_reward, is_published)
VALUES (
    'Python Fundamentals',
    'Learn the basics of Python programming from scratch.',
    'python-fundamentals',
    'beginner',
    10,
    500,
    true
) ON CONFLICT (slug) DO NOTHING;

-- Insert sample modules
WITH course AS (
    SELECT id FROM public.courses WHERE slug = 'python-fundamentals'
)
INSERT INTO public.modules (course_id, title, description, order_index, xp_reward)
SELECT course.id, title, description, order_index, xp_reward
FROM course
CROSS JOIN (VALUES
    ('Getting Started with Python', 'Your first steps into programming', 1, 50),
    ('Variables and Data Types', 'Understanding how to store and use data', 2, 75),
    ('Control Flow', 'Making decisions in your code', 3, 100),
    ('Functions', 'Writing reusable code blocks', 4, 100)
) AS t(title, description, order_index, xp_reward)
ON CONFLICT DO NOTHING;

-- =============================================================================
-- ROW LEVEL SECURITY (RLS) - DISABLED
-- =============================================================================
ALTER TABLE public.users DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.execution_logs DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.tutor_sessions DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.courses DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.modules DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.lessons DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.topics DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.exercises DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_progress DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.achievements DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_achievements DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_streaks DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.xp_transactions DISABLE ROW LEVEL SECURITY;
