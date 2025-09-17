import { createClient } from '@supabase/supabase-js';
import 'react-native-url-polyfill/auto';

// ⚠️ IMPORTANT: Replace these with your actual Supabase project details
// You can find these in your Supabase dashboard → Settings → API
const supabaseUrl = 'https://vsegvatscvfxlggfmwzl.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZzZWd2YXRzY3ZmeGxnZ2Ztd3psIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTgxMjQ0NDUsImV4cCI6MjA3MzcwMDQ0NX0.wUxlzNpl_BDa9qQOSNLmAC0zxqVZ-kXG7QumolffkNY';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    // Enable automatic session refresh
    autoRefreshToken: true,
    // Persist session in AsyncStorage
    persistSession: true,
    // Detect session changes (login/logout)
    detectSessionInUrl: false,
  },
});

// Types for our authentication
export interface AuthUser {
  id: string;
  email: string;
  username?: string;
  created_at: string;
}

export interface AuthSession {
  user: AuthUser;
  access_token: string;
  refresh_token: string;
}