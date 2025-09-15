import React from 'react';
import WhyReflectionScreen from '../components/WhyReflectionScreen';
import { router } from 'expo-router';

export default function WhyReflectionPage() {
  const handleSaveWhy = (whyText: string) => {
    // TODO: Save why text to AsyncStorage
    console.log('User why:', whyText);
    
    // Navigate to visualization screen
    router.push('./visualization');
  };

  return (
    <WhyReflectionScreen onSaveWhy={handleSaveWhy} />
  );
}