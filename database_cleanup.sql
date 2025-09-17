-- =====================================================
-- NoFap App Database Cleanup & Setup Script
-- =====================================================
-- This script will safely check and recreate your database schema

-- First, let's check what tables already exist
-- Run this query to see existing tables:
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
ORDER BY table_name;

-- =====================================================
-- SAFE CLEANUP: Drop existing tables if they exist
-- =====================================================
-- Run these DROP statements one by one to clean up existing tables
-- This will remove all data, so only do this if you're starting fresh

-- Drop tables in reverse dependency order (children first, then parents)
DROP TABLE IF EXISTS public.journal_entries CASCADE;
DROP TABLE IF EXISTS public.panic_sessions CASCADE;
DROP TABLE IF EXISTS public.daily_checkins CASCADE;
DROP TABLE IF EXISTS public.user_streaks CASCADE;
DROP TABLE IF EXISTS public.user_settings CASCADE;
DROP TABLE IF EXISTS public.user_profiles CASCADE;

-- Drop functions and triggers if they exist
DROP FUNCTION IF EXISTS public.handle_new_user() CASCADE;
DROP FUNCTION IF EXISTS public.get_current_streak(UUID) CASCADE;
DROP FUNCTION IF EXISTS update_updated_at_column() CASCADE;

-- =====================================================
-- Now run the complete schema from database_schema.sql
-- =====================================================
-- After running the cleanup above, you can safely run
-- the complete database_schema.sql file without errors