import { router } from 'expo-router';
import React from 'react';
import QuizStruggleScreen from '../components/QuizStruggleScreen';

export default function QuizStrugglePage() {
  const handleNext = (selectedStruggles: string[]) => {
    // TODO: Save struggles to AsyncStorage
    console.log('User struggles:', selectedStruggles);
    
    // Navigate to why reflection screen
    router.push('./why-reflection');
  };

  return (
    <QuizStruggleScreen onNext={handleNext} />
  );
}