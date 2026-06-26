-- =============================================================================
-- Vision AI - Database Setup Script
-- =============================================================================
-- Run this script in your Supabase SQL Editor:
-- https://supabase.com/dashboard → Your Project → SQL Editor → New Query
-- =============================================================================

-- Enable UUID extension (required for gen_random_uuid())
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- =============================================================================
-- USERS TABLE
-- =============================================================================
-- Stores registered user accounts for authentication and gamification

CREATE TABLE IF NOT EXISTS public.users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    username TEXT NOT NULL UNIQUE,
    email TEXT NOT NULL UNIQUE,
    password_hash TEXT NOT NULL,
    xp INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Index for fast email lookups (login)
CREATE INDEX IF NOT EXISTS idx_users_email ON public.users(email);

-- Index for leaderboard queries
CREATE INDEX IF NOT EXISTS idx_users_xp ON public.users(xp DESC);

-- =============================================================================
-- EXECUTION LOGS TABLE (Optional - for analytics)
-- =============================================================================
-- Tracks code execution history for each user

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

-- Index for user's execution history
CREATE INDEX IF NOT EXISTS idx_execution_logs_user_id ON public.execution_logs(user_id);

-- =============================================================================
-- TUTOR SESSIONS TABLE (Optional - for conversation history)
-- =============================================================================
-- Stores AI tutor conversation history per user

CREATE TABLE IF NOT EXISTS public.tutor_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    language TEXT,
    code_context TEXT,
    user_message TEXT NOT NULL,
    tutor_reply TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Index for user's tutor history
CREATE INDEX IF NOT EXISTS idx_tutor_sessions_user_id ON public.tutor_sessions(user_id);

-- =============================================================================
-- ROW LEVEL SECURITY (RLS)
-- =============================================================================
-- IMPORTANT: RLS is DISABLED on all tables.
-- Access control is handled by FastAPI using JWT tokens.
-- Supabase RLS is bypassed for server-side operations.

ALTER TABLE public.users DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.execution_logs DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.tutor_sessions DISABLE ROW LEVEL SECURITY;

-- =============================================================================
-- VERIFICATION
-- =============================================================================
-- Run this to verify tables were created:

-- SELECT table_name FROM information_schema.tables WHERE table_schema = 'public';
-- SELECT * FROM pg_policies WHERE tablename = 'users';

-- =============================================================================
-- SAMPLE DATA (Optional - for testing)
-- =============================================================================

-- INSERT INTO public.users (username, email, password_hash, xp)
-- VALUES ('demo', 'demo@example.com', '$2b$12$...', 100);
