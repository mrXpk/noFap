import React from 'react';
import FinalPushScreen from '../components/FinalPushScreen';
import { router } from 'expo-router';

export default function FinalPushPage() {
  const handleCreateAccount = () => {
    // TODO: Navigate to account creation screen
    // For now, navigate to placeholder signup
    router.push('/signup');
  };

  const handleLogin = () => {
    // TODO: Navigate to login screen
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