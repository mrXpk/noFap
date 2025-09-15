import { router } from 'expo-router';
import React from 'react';
import WelcomeScreen from '../components/WelcomeScreen';

export default function Index() {
  const handleReady = () => {
    // Navigate to commitment agreement screen
    router.push('/commitment');
  };

  return (
    <WelcomeScreen onReady={handleReady} />
  );
}
