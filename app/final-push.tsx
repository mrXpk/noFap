import { router } from 'expo-router';
import React from 'react';
import FinalPushScreen from '../components/FinalPushScreen';

export default function FinalPushPage() {
  const handleCreateAccount = () => {
    // Navigate to account creation screen
    // For now, navigate to placeholder signup
    router.push('/signup');
  };

  const handleLogin = () => {
    // Navigate to login screen
    // For now, navigate to placeholder login
    router.push('/login');
  };

  return (
    <FinalPushScreen 
      onCreateAccount={handleCreateAccount}
      onLogin={handleLogin}
    />
  );
}