import React from 'react';
import VisualizationScreen from '../components/VisualizationScreen';
import { router } from 'expo-router';

export default function VisualizationPage() {
  const handleBegin = () => {
    // Navigate to final push screen
    router.push('./final-push');
  };

  return (
    <VisualizationScreen onBegin={handleBegin} />
  );
}