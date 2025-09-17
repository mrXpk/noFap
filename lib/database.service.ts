import {
    CreateDailyCheckin,
    CreateJournalEntry,
    CreatePanicSession,
    CreateUserStreak,
    DailyCheckin,
    DatabaseResponse,
    JournalEntry,
    PanicSession,
    UpdateDailyCheckin,
    UpdatePanicSession,
    UpdateUserProfile,
    UpdateUserStreak,
    UserProfile,
    UserSettings,
    UserStreak
} from './database.types';
import { supabase } from './supabase';

export class DatabaseService {
  // =====================================================
  // USER PROFILE OPERATIONS
  // =====================================================
  
  static async getUserProfile(userId: string): Promise<DatabaseResponse<UserProfile>> {
    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('id', userId)
        .single();
      
      return { data, error };
    } catch (error: any) {
      return { data: null, error: { message: error.message } };
    }
  }

  static async updateUserProfile(userId: string, updates: UpdateUserProfile): Promise<DatabaseResponse<UserProfile>> {
    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .update(updates)
        .eq('id', userId)
        .select()
        .single();
      
      return { data, error };
    } catch (error: any) {
      return { data: null, error: { message: error.message } };
    }
  }

  // =====================================================
  // USER STREAK OPERATIONS
  // =====================================================
  
  static async getCurrentStreak(userId: string): Promise<DatabaseResponse<UserStreak>> {
    try {
      const { data, error } = await supabase
        .from('user_streaks')
        .select('*')
        .eq('user_id', userId)
        .eq('is_active', true)
        .order('created_at', { ascending: false })
        .limit(1)
        .single();
      
      return { data, error };
    } catch (error: any) {
      return { data: null, error: { message: error.message } };
    }
  }

  static async getUserStreaks(userId: string): Promise<DatabaseResponse<UserStreak[]>> {
    try {
      const { data, error } = await supabase
        .from('user_streaks')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });
      
      return { data, error };
    } catch (error: any) {
      return { data: null, error: { message: error.message } };
    }
  }

  static async createStreak(userId: string, streakData: Omit<CreateUserStreak, 'user_id'>): Promise<DatabaseResponse<UserStreak>> {
    try {
      // First, end any existing active streaks
      await supabase
        .from('user_streaks')
        .update({ is_active: false, end_date: new Date().toISOString().split('T')[0] })
        .eq('user_id', userId)
        .eq('is_active', true);

      // Create new streak
      const { data, error } = await supabase
        .from('user_streaks')
        .insert({
          user_id: userId,
          ...streakData,
        })
        .select()
        .single();
      
      return { data, error };
    } catch (error: any) {
      return { data: null, error: { message: error.message } };
    }
  }

  static async updateStreak(streakId: string, updates: UpdateUserStreak): Promise<DatabaseResponse<UserStreak>> {
    try {
      const { data, error } = await supabase
        .from('user_streaks')
        .update(updates)
        .eq('id', streakId)
        .select()
        .single();
      
      return { data, error };
    } catch (error: any) {
      return { data: null, error: { message: error.message } };
    }
  }

  // =====================================================
  // DAILY CHECK-IN OPERATIONS
  // =====================================================
  
  static async getTodayCheckin(userId: string): Promise<DatabaseResponse<DailyCheckin>> {
    try {
      const today = new Date().toISOString().split('T')[0];
      const { data, error } = await supabase
        .from('daily_checkins')
        .select('*')
        .eq('user_id', userId)
        .eq('date', today)
        .single();
      
      return { data, error };
    } catch (error: any) {
      return { data: null, error: { message: error.message } };
    }
  }

  static async createCheckin(userId: string, checkinData: Omit<CreateDailyCheckin, 'user_id'>): Promise<DatabaseResponse<DailyCheckin>> {
    try {
      const { data, error } = await supabase
        .from('daily_checkins')
        .upsert({
          user_id: userId,
          ...checkinData,
        }, {
          onConflict: 'user_id,date'
        })
        .select()
        .single();
      
      return { data, error };
    } catch (error: any) {
      return { data: null, error: { message: error.message } };
    }
  }

  static async updateCheckin(checkinId: string, updates: UpdateDailyCheckin): Promise<DatabaseResponse<DailyCheckin>> {
    try {
      const { data, error } = await supabase
        .from('daily_checkins')
        .update(updates)
        .eq('id', checkinId)
        .select()
        .single();
      
      return { data, error };
    } catch (error: any) {
      return { data: null, error: { message: error.message } };
    }
  }

  static async updateCheckinByDate(userId: string, date: string, updates: UpdateDailyCheckin): Promise<DatabaseResponse<DailyCheckin>> {
    try {
      const { data, error } = await supabase
        .from('daily_checkins')
        .update(updates)
        .eq('user_id', userId)
        .eq('date', date)
        .select()
        .single();
      
      return { data, error };
    } catch (error: any) {
      return { data: null, error: { message: error.message } };
    }
  }

  static async getUserCheckins(userId: string): Promise<DatabaseResponse<DailyCheckin[]>> {
    try {
      const { data, error } = await supabase
        .from('daily_checkins')
        .select('*')
        .eq('user_id', userId)
        .order('date', { ascending: false });
      
      return { data, error };
    } catch (error: any) {
      return { data: null, error: { message: error.message } };
    }
  }

  // =====================================================
  // PANIC SESSION OPERATIONS
  // =====================================================
  
  static async createPanicSession(userId: string, sessionData: Omit<CreatePanicSession, 'user_id'>): Promise<DatabaseResponse<PanicSession>> {
    try {
      const { data, error } = await supabase
        .from('panic_sessions')
        .insert({
          user_id: userId,
          ...sessionData,
        })
        .select()
        .single();
      
      return { data, error };
    } catch (error: any) {
      return { data: null, error: { message: error.message } };
    }
  }

  static async updatePanicSession(sessionId: string, updates: UpdatePanicSession): Promise<DatabaseResponse<PanicSession>> {
    try {
      const { data, error } = await supabase
        .from('panic_sessions')
        .update(updates)
        .eq('id', sessionId)
        .select()
        .single();
      
      return { data, error };
    } catch (error: any) {
      return { data: null, error: { message: error.message } };
    }
  }

  static async getUserPanicSessions(userId: string): Promise<DatabaseResponse<PanicSession[]>> {
    try {
      const { data, error } = await supabase
        .from('panic_sessions')
        .select('*')
        .eq('user_id', userId)
        .order('started_at', { ascending: false });
      
      return { data, error };
    } catch (error: any) {
      return { data: null, error: { message: error.message } };
    }
  }

  // =====================================================
  // USER SETTINGS OPERATIONS
  // =====================================================
  
  static async getUserSettings(userId: string): Promise<DatabaseResponse<UserSettings>> {
    try {
      const { data, error } = await supabase
        .from('user_settings')
        .select('*')
        .eq('user_id', userId)
        .single();
      
      return { data, error };
    } catch (error: any) {
      return { data: null, error: { message: error.message } };
    }
  }

  static async updateUserSettings(userId: string, updates: Partial<UserSettings>): Promise<DatabaseResponse<UserSettings>> {
    try {
      const { data, error } = await supabase
        .from('user_settings')
        .update(updates)
        .eq('user_id', userId)
        .select()
        .single();
      
      return { data, error };
    } catch (error: any) {
      return { data: null, error: { message: error.message } };
    }
  }

  // =====================================================
  // JOURNAL ENTRY OPERATIONS
  // =====================================================
  
  static async createJournalEntry(userId: string, entryData: Omit<CreateJournalEntry, 'user_id'>): Promise<DatabaseResponse<JournalEntry>> {
    try {
      const { data, error } = await supabase
        .from('journal_entries')
        .insert({
          user_id: userId,
          ...entryData,
        })
        .select()
        .single();
      
      return { data, error };
    } catch (error: any) {
      return { data: null, error: { message: error.message } };
    }
  }

  static async getUserJournalEntries(userId: string): Promise<DatabaseResponse<JournalEntry[]>> {
    try {
      const { data, error } = await supabase
        .from('journal_entries')
        .select('*')
        .eq('user_id', userId)
        .order('entry_date', { ascending: false });
      
      return { data, error };
    } catch (error: any) {
      return { data: null, error: { message: error.message } };
    }
  }

  // =====================================================
  // ANALYTICS & STATS
  // =====================================================
  
  static async getUserStats(userId: string) {
    try {
      // Get all user streaks to calculate stats
      const { data: streaks, error: streaksError } = await supabase
        .from('user_streaks')
        .select('*')
        .eq('user_id', userId);

      if (streaksError) {
        return { data: null, error: streaksError };
      }

      // Calculate stats
      const currentStreak = streaks?.find(s => s.is_active)?.days_count || 0;
      const longestStreak = Math.max(...(streaks?.map(s => s.days_count) || [0]));
      const totalRelapses = streaks?.filter(s => !s.is_active).length || 0;

      // Get panic session count
      const { count: panicSessionCount } = await supabase
        .from('panic_sessions')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', userId);

      return {
        data: {
          currentStreak,
          longestStreak,
          totalRelapses,
          panicSessionCount: panicSessionCount || 0,
        },
        error: null,
      };
    } catch (error: any) {
      return { data: null, error: { message: error.message } };
    }
  }
}