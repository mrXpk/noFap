// Database Types for NoFap App
// These match the Supabase database schema

export interface UserProfile {
  id: string;
  username: string | null;
  tagline: string | null;
  avatar_url: string | null;
  your_why: string | null;
  created_at: string;
  updated_at: string;
}

export interface UserStreak {
  id: string;
  user_id: string;
  start_date: string;
  end_date: string | null;
  is_active: boolean;
  days_count: number;
  created_at: string;
  updated_at: string;
}

export interface DailyCheckin {
  id: string;
  user_id: string;
  date: string;
  mood_rating: number | null;
  notes: string | null;
  completed_at: string;
  created_at: string;
}

export interface PanicSession {
  id: string;
  user_id: string;
  started_at: string;
  ended_at: string | null;
  duration_seconds: number;
  recording_url: string | null;
  outcome: 'success' | 'relapse' | 'incomplete';
  notes: string | null;
  created_at: string;
}

export interface UserSettings {
  user_id: string;
  notifications_enabled: boolean;
  privacy_mode: boolean;
  reminder_times: any[]; // JSONB array
  theme_preference: string;
  created_at: string;
  updated_at: string;
}

export interface JournalEntry {
  id: string;
  user_id: string;
  title: string | null;
  content: string;
  mood_rating: number | null;
  entry_date: string;
  created_at: string;
  updated_at: string;
}

// Database response types
export interface DatabaseError {
  message: string;
  details?: string;
  hint?: string;
  code?: string;
}

export interface DatabaseResponse<T> {
  data: T | null;
  error: DatabaseError | null;
}

// Utility types
export type CreateUserProfile = Omit<UserProfile, 'id' | 'created_at' | 'updated_at'>;
export type UpdateUserProfile = Partial<CreateUserProfile>;

export type CreateUserStreak = Omit<UserStreak, 'id' | 'created_at' | 'updated_at'>;
export type UpdateUserStreak = Partial<CreateUserStreak>;

export type CreateDailyCheckin = Omit<DailyCheckin, 'id' | 'completed_at' | 'created_at'>;
export type UpdateDailyCheckin = Partial<CreateDailyCheckin>;

export type CreatePanicSession = Omit<PanicSession, 'id' | 'created_at'>;
export type UpdatePanicSession = Partial<CreatePanicSession>;

export type CreateJournalEntry = Omit<JournalEntry, 'id' | 'created_at' | 'updated_at'>;
export type UpdateJournalEntry = Partial<CreateJournalEntry>;