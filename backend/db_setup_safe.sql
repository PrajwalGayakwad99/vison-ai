-- =============================================================================
-- Vision AI - Safe Database Setup (Run Multiple Times Safe)
-- =============================================================================
-- IMPORTANT: This script safely DROPS existing tables before recreating
-- Run this ONLY if you want to reset your database completely
-- =============================================================================

-- ── SAFE DROP (uncomment the following if you want to reset) ──────────────────────

-- Drop tables in reverse dependency order (CASCADE handles FK constraints)
DROP TABLE IF EXISTS public.skill_assessments CASCADE;
DROP TABLE IF EXISTS public.github_repos CASCADE;
DROP TABLE IF EXISTS public.portfolios CASCADE;
DROP TABLE IF EXISTS public.daily_activity_heatmap CASCADE;
DROP TABLE IF EXISTS public.user_error_logs CASCADE;
DROP TABLE IF EXISTS public.user_skill_metrics CASCADE;
DROP TABLE IF EXISTS public.skill_categories CASCADE;
DROP TABLE IF EXISTS public.xp_transactions CASCADE;
DROP TABLE IF EXISTS public.user_achievements CASCADE;
DROP TABLE IF EXISTS public.achievements CASCADE;
DROP TABLE IF EXISTS public.user_streaks CASCADE;
DROP TABLE IF EXISTS public.user_progress CASCADE;
DROP TABLE IF EXISTS public.exercises CASCADE;
DROP TABLE IF EXISTS public.topics CASCADE;
DROP TABLE IF EXISTS public.lessons CASCADE;
DROP TABLE IF EXISTS public.modules CASCADE;
DROP TABLE IF EXISTS public.courses CASCADE;
DROP TABLE IF EXISTS public.tutor_sessions CASCADE;
DROP TABLE IF EXISTS public.execution_logs CASCADE;
DROP TABLE IF EXISTS public.users CASCADE;

-- Drop enum if exists
DROP TYPE IF EXISTS user_role CASCADE;

-- =============================================================================
-- NOW RUN YOUR db_setup.sql CONTENT AFTER THIS LINE
-- =============================================================================
