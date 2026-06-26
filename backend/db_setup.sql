-- =============================================================================
-- Vision AI - Database Setup Script (Extended for Phase 5, 6 & 7)
-- =============================================================================
-- Run this script in your Supabase SQL Editor:
-- https://supabase.com/dashboard → Your Project → SQL Editor → New Query
-- =============================================================================

-- Enable UUID extension (required for gen_random_uuid())
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- =============================================================================
-- USERS TABLE
-- =============================================================================

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
-- COURSES TABLE
-- =============================================================================

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

-- =============================================================================
-- MODULES TABLE
-- =============================================================================

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

-- =============================================================================
-- LESSONS TABLE
-- =============================================================================

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

-- =============================================================================
-- TOPICS TABLE
-- =============================================================================

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

-- =============================================================================
-- EXERCISES TABLE
-- =============================================================================

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

-- =============================================================================
-- USER PROGRESS TABLE
-- =============================================================================

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
-- ACHIEVEMENTS TABLE
-- =============================================================================

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

-- =============================================================================
-- USER ACHIEVEMENTS MAPPING TABLE
-- =============================================================================

CREATE TABLE IF NOT EXISTS public.user_achievements (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    achievement_id UUID NOT NULL REFERENCES public.achievements(id) ON DELETE CASCADE,
    earned_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE(user_id, achievement_id)
);

CREATE INDEX IF NOT EXISTS idx_user_achievements_user_id ON public.user_achievements(user_id);

-- =============================================================================
-- USER STREAKS TABLE
-- =============================================================================

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

-- =============================================================================
-- XP TRANSACTION LOG
-- =============================================================================

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
    ('First Steps', 'Complete your first exercise', '1f3af', 'milestone', 10, 'exercises_completed', 1),
    ('Getting Started', 'Complete 10 exercises', '1f31f', 'milestone', 50, 'exercises_completed', 10),
    ('Code Warrior', 'Complete 50 exercises', '2694', 'milestone', 200, 'exercises_completed', 50),
    ('Python Novice', 'Earn 100 XP', '1f40d', 'xp', 25, 'total_xp', 100),
    ('Python Adept', 'Earn 500 XP', '1f40d', 'xp', 100, 'total_xp', 500),
    ('Python Expert', 'Earn 1000 XP', '1f40d', 'xp', 250, 'total_xp', 1000),
    ('Streak Starter', 'Maintain a 3-day streak', '1f525', 'streak', 25, 'streak_days', 3),
    ('Week Warrior', 'Maintain a 7-day streak', '1f4aa', 'streak', 75, 'streak_days', 7),
    ('Course Completer', 'Complete your first course', '1f4da', 'course', 100, 'courses_completed', 1)
ON CONFLICT (name) DO NOTHING;

-- =============================================================================
-- PHASE 7: ANALYTICS SYSTEM
-- =============================================================================

-- USER SKILL METRICS TABLE
CREATE TABLE IF NOT EXISTS public.user_skill_metrics (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    skill_name TEXT NOT NULL,
    skill_category TEXT NOT NULL DEFAULT 'general',
    proficiency_score INTEGER NOT NULL DEFAULT 0 CHECK (proficiency_score >= 0 AND proficiency_score <= 100),
    total_attempts INTEGER NOT NULL DEFAULT 0,
    successful_attempts INTEGER NOT NULL DEFAULT 0,
    last_practiced_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE(user_id, skill_name)
);

CREATE INDEX IF NOT EXISTS idx_user_skill_metrics_user_id ON public.user_skill_metrics(user_id);
CREATE INDEX IF NOT EXISTS idx_user_skill_metrics_skill_category ON public.user_skill_metrics(skill_category);

-- SKILL CATEGORIES SEED DATA
CREATE TABLE IF NOT EXISTS public.skill_categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL UNIQUE,
    description TEXT,
    parent_category TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

INSERT INTO public.skill_categories (name, description, parent_category) VALUES
    ('python_basics', 'Python Basics', NULL),
    ('variables', 'Variables & Data Types', 'python_basics'),
    ('control_flow', 'Control Flow', 'python_basics'),
    ('functions', 'Functions', 'python_basics'),
    ('data_structures', 'Data Structures', NULL),
    ('lists', 'Lists & Arrays', 'data_structures'),
    ('dictionaries', 'Dictionaries & Maps', 'data_structures'),
    ('algorithms', 'Algorithms', NULL),
    ('loops', 'Loops & Iteration', 'algorithms'),
    ('recursion', 'Recursion', 'algorithms'),
    ('debugging', 'Debugging & Errors', NULL)
ON CONFLICT (name) DO NOTHING;

-- DAILY ACTIVITY HEATMAP TABLE
CREATE TABLE IF NOT EXISTS public.daily_activity_heatmap (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    activity_date DATE NOT NULL,
    executions_count INTEGER NOT NULL DEFAULT 0,
    tutor_sessions_count INTEGER NOT NULL DEFAULT 0,
    xp_earned INTEGER NOT NULL DEFAULT 0,
    exercises_completed INTEGER NOT NULL DEFAULT 0,
    minutes_active INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE(user_id, activity_date)
);

CREATE INDEX IF NOT EXISTS idx_daily_activity_user_id ON public.daily_activity_heatmap(user_id);
CREATE INDEX IF NOT EXISTS idx_daily_activity_date ON public.daily_activity_heatmap(activity_date DESC);

-- USER ERROR LOG TABLE
CREATE TABLE IF NOT EXISTS public.user_error_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    error_type TEXT NOT NULL,
    error_message TEXT,
    language TEXT,
    frequency INTEGER NOT NULL DEFAULT 1,
    last_occurred_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE(user_id, error_type, language)
);

CREATE INDEX IF NOT EXISTS idx_user_error_logs_user_id ON public.user_error_logs(user_id);

-- =============================================================================
-- SQL FUNCTIONS FOR ANALYTICS
-- =============================================================================

-- Function to get user's activity heatmap for the last N days
CREATE OR REPLACE FUNCTION get_user_heatmap(p_user_id UUID, p_days INTEGER DEFAULT 365)
RETURNS TABLE (
    activity_date DATE,
    executions_count BIGINT,
    tutor_sessions_count BIGINT,
    xp_earned BIGINT,
    exercises_completed BIGINT,
    minutes_active BIGINT
) AS $$
BEGIN
    RETURN QUERY
    SELECT
        d.activity_date,
        COALESCE(d.executions_count, 0)::BIGINT,
        COALESCE(d.tutor_sessions_count, 0)::BIGINT,
        COALESCE(d.xp_earned, 0)::BIGINT,
        COALESCE(d.exercises_completed, 0)::BIGINT,
        COALESCE(d.minutes_active, 0)::BIGINT
    FROM (
        SELECT generate_series(
            CURRENT_DATE - (p_days - 1)::INTEGER,
            CURRENT_DATE,
            '1 day'::INTERVAL
        )::DATE AS activity_date
    ) dates
    LEFT JOIN daily_activity_heatmap d ON d.activity_date = dates.activity_date AND d.user_id = p_user_id
    ORDER BY dates.activity_date;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to calculate skill proficiency
CREATE OR REPLACE FUNCTION calculate_skill_proficiency(p_user_id UUID, p_skill_name TEXT)
RETURNS INTEGER AS $$
DECLARE
    total INTEGER;
    successful INTEGER;
    proficiency INTEGER;
BEGIN
    SELECT COUNT(*)::INTEGER, COUNT(*) FILTER (WHERE status = 'success')::INTEGER
    INTO total, successful
    FROM execution_logs
    WHERE user_id = p_user_id
    AND LOWER(code) LIKE '%' || LOWER(p_skill_name) || '%';

    IF total = 0 THEN RETURN 0; END IF;

    proficiency := (successful::FLOAT / total * 100)::INTEGER;
    proficiency := proficiency + LEAST(total / 10, 20);
    RETURN GREATEST(0, LEAST(100, proficiency));
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get weekly activity pattern
CREATE OR REPLACE FUNCTION get_weekly_pattern(p_user_id UUID)
RETURNS TABLE (
    day_of_week INTEGER,
    day_name TEXT,
    avg_executions DECIMAL,
    avg_xp DECIMAL,
    total_sessions BIGINT
) AS $$
BEGIN
    RETURN QUERY
    SELECT
        EXTRACT(DOW FROM activity_date)::INTEGER as day_of_week,
        TO_CHAR(activity_date, 'Day') as day_name,
        AVG(executions_count)::DECIMAL(10,2),
        AVG(xp_earned)::DECIMAL(10,2),
        SUM(tutor_sessions_count)::BIGINT
    FROM daily_activity_heatmap
    WHERE user_id = p_user_id
    AND activity_date >= CURRENT_DATE - INTERVAL '90 days'
    GROUP BY EXTRACT(DOW FROM activity_date), TO_CHAR(activity_date, 'Day')
    ORDER BY day_of_week;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get top errors
CREATE OR REPLACE FUNCTION get_top_errors(p_user_id UUID, p_limit INTEGER DEFAULT 10)
RETURNS TABLE (
    error_type TEXT,
    frequency BIGINT,
    last_occurred_at TIMESTAMPTZ
) AS $$
BEGIN
    RETURN QUERY
    SELECT e.error_type, e.frequency, e.last_occurred_at
    FROM user_error_logs e
    WHERE e.user_id = p_user_id
    ORDER BY e.frequency DESC
    LIMIT p_limit;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to update daily activity
CREATE OR REPLACE FUNCTION update_daily_activity(p_user_id UUID, p_activity_type TEXT)
RETURNS VOID AS $$
DECLARE
    today_date DATE := CURRENT_DATE;
    current_record RECORD;
BEGIN
    SELECT * INTO current_record
    FROM daily_activity_heatmap
    WHERE user_id = p_user_id AND activity_date = today_date;

    IF current_record.id IS NULL THEN
        INSERT INTO daily_activity_heatmap (user_id, activity_date, executions_count, tutor_sessions_count, xp_earned, exercises_completed, minutes_active)
        VALUES (
            p_user_id, today_date,
            CASE WHEN p_activity_type = 'execution' THEN 1 ELSE 0 END,
            CASE WHEN p_activity_type = 'tutor' THEN 1 ELSE 0 END,
            0, 0, 0
        );
    ELSE
        UPDATE daily_activity_heatmap SET
            executions_count = executions_count + CASE WHEN p_activity_type = 'execution' THEN 1 ELSE 0 END,
            tutor_sessions_count = tutor_sessions_count + CASE WHEN p_activity_type = 'tutor' THEN 1 ELSE 0 END,
            updated_at = NOW()
        WHERE id = current_record.id;
    END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =============================================================================
-- DISABLE RLS ON ALL TABLES
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
ALTER TABLE public.user_skill_metrics DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.skill_categories DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.daily_activity_heatmap DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_error_logs DISABLE ROW LEVEL SECURITY;
