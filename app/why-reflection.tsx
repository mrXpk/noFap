import { router } from 'expo-router';
import React from 'react';
import WhyReflectionScreen from '../components/WhyReflectionScreen';

export default function WhyReflectionPage() {
  const handleSaveWhy = (whyText: string) => {
    // Navigate to visualization screen
    router.push('./visualization');
  };

  return (
    <WhyReflectionScreen onSaveWhy={handleSaveWhy} />
  );
}