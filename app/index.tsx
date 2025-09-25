import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import React, { useEffect } from 'react';
import { ActivityIndicator } from 'react-native';
import WelcomeScreen from '../components/WelcomeScreen';
import { useAuth } from '../contexts/AuthContext';

export default function Index() {
  const { user, loading, hasCompletedOnboarding } = useAuth();

  useEffect(() => {
    if (!loading) {
      if (user) {
        // User is authenticated
        if (hasCompletedOnboarding) {
          // User has completed onboarding, go to dashboard
          router.replace('/dashboard');
        } else {
          // User needs to complete onboarding, but skip welcome
          router.replace('/commitment');
        }
      }
      // If no user, stay on welcome screen
    }
  }, [user, loading, hasCompletedOnboarding]);

  const handleReady = () => {
    // Navigate to commitment agreement screen
    router.push('/commitment');
  };

  // Show loading while checking auth state
  if (loading) {
    return (
      <LinearGradient
        colors={['#F5DEB3', '#DEB887', '#CD853F']}
        style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}
      >
        <ActivityIndicator size="large" color="#DAA520" />
      </LinearGradient>
    );
  }

  // If user is authenticated, don't show welcome (redirect will happen)
  if (user) {
    return null;
  }

  return (
    <WelcomeScreen onReady={handleReady} />
  );
}
