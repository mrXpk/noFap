import { Session, User } from '@supabase/supabase-js';
import React, { createContext, useContext, useEffect, useState } from 'react';
import { DatabaseService } from '../lib/database.service';
import { UserProfile } from '../lib/database.types';
import { supabase } from '../lib/supabase';

interface AuthContextType {
  // Authentication state
  user: User | null;
  userProfile: UserProfile | null;
  session: Session | null;
  loading: boolean;
  hasCompletedOnboarding: boolean;
  
  // Authentication methods
  signUp: (email: string, password: string, username: string) => Promise<{ error?: any }>;
  signIn: (email: string, password: string) => Promise<{ error?: any }>;
  signOut: () => Promise<{ error?: any }>;
  resetPassword: (email: string) => Promise<{ error?: any }>;
  
  // Profile methods
  updateProfile: (updates: Partial<UserProfile>) => Promise<{ error?: any }>;
  refreshProfile: () => Promise<void>;
  
  // Onboarding methods
  markOnboardingComplete: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [hasCompletedOnboarding, setHasCompletedOnboarding] = useState(false);

  useEffect(() => {
    let mounted = true;
    let initTimeout: any;
    
    const initializeAuth = async () => {
      try {
        // Set a timeout to prevent infinite loading
        initTimeout = setTimeout(() => {
          if (mounted) {
            console.warn('Auth initialization timeout');
            setLoading(false);
          }
        }, 10000);
        
        // Get initial session with timeout
        const { data: { session }, error } = await Promise.race([
          supabase.auth.getSession(),
          new Promise((_, reject) => 
            setTimeout(() => reject(new Error('Session check timeout')), 5000)
          )
        ]) as any;
        
        if (!mounted) return;
        
        // Clear the timeout since we got a response
        if (initTimeout) clearTimeout(initTimeout);
        
        if (error) {
          console.warn('Session check error:', error);
          setLoading(false);
          return;
        }
        
        console.log('🔐 Initial session check:', !!session, session?.user?.email);
        console.log('📱 User authenticated:', !!session?.user);
        setSession(session);
        setUser(session?.user ?? null);
        
        if (session?.user) {
          await loadUserProfile(session.user.id);
        } else {
          setLoading(false);
        }
      } catch (error) {
        console.warn('Auth initialization error:', error);
        if (mounted) {
          setLoading(false);
        }
      }
    };
    
    initializeAuth();

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (!mounted) return;
      
      console.log('🔄 Auth state changed:', event, !!session, session?.user?.email);
      console.log('👤 Current user:', !!session?.user);
      
      setSession(session);
      setUser(session?.user ?? null);
      
      if (session?.user) {
        await loadUserProfile(session.user.id);
      } else {
        setUserProfile(null);
        setHasCompletedOnboarding(false);
        setLoading(false);
      }
    });

    return () => {
      mounted = false;
      if (initTimeout) clearTimeout(initTimeout);
      subscription.unsubscribe();
    };
  }, []);

  const signUp = async (email: string, password: string, username: string) => {
    try {
      setLoading(true);
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            username,
          },
          emailRedirectTo: 'https://mrxpk.github.io/nofap-verification/verification-success.html',
        },
      });

      if (error) {
        return { error };
      }

      return { data };
    } catch (error) {
      return { error };
    } finally {
      setLoading(false);
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      setLoading(true);
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        return { error };
      }

      return { data };
    } catch (error) {
      return { error };
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    try {
      setLoading(true);
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        return { error };
      }

      return {};
    } catch (error) {
      return { error };
    } finally {
      setLoading(false);
    }
  };

  const resetPassword = async (email: string) => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email);
      
      if (error) {
        return { error };
      }

      return {};
    } catch (error) {
      return { error };
    }
  };

  const loadUserProfile = async (userId: string) => {
    try {
      const { data, error } = await DatabaseService.getUserProfile(userId);
      if (data) {
        setUserProfile(data);
        // Check if user has completed onboarding
        setHasCompletedOnboarding(!!data.onboarding_completed);
      } else if (error) {
        console.warn('Error loading user profile:', error);
        // If profile doesn't exist, create one
        const { data: newProfile } = await DatabaseService.updateUserProfile(userId, {
          username: null,
          tagline: null,
          avatar_url: null,
          your_why: null,
          onboarding_completed: false,
        });
        if (newProfile) {
          setUserProfile(newProfile);
          setHasCompletedOnboarding(false);
        }
      }
    } catch (error) {
      console.warn('Exception loading user profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async (updates: Partial<UserProfile>) => {
    if (!user) {
      return { error: { message: 'No user logged in' } };
    }

    try {
      const { data, error } = await DatabaseService.updateUserProfile(user.id, updates);
      if (data) {
        setUserProfile(data);
        return { data };
      }
      return { error };
    } catch (error) {
      return { error };
    }
  };

  const refreshProfile = async () => {
    if (user) {
      await loadUserProfile(user.id);
    }
  };

  const markOnboardingComplete = async () => {
    if (user) {
      try {
        // Update user profile to mark onboarding as complete
        await updateProfile({ onboarding_completed: true });
        setHasCompletedOnboarding(true);
      } catch (error) {
        console.warn('Failed to mark onboarding complete:', error);
      }
    }
  };

  const value: AuthContextType = {
    user,
    userProfile,
    session,
    loading,
    hasCompletedOnboarding,
    signUp,
    signIn,
    signOut,
    resetPassword,
    updateProfile,
    refreshProfile,
    markOnboardingComplete,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}