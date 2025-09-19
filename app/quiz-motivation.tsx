import { router } from 'expo-router';
import React from 'react';
import QuizMotivationScreen from '../components/QuizMotivationScreen';

export default function QuizMotivationPage() {
  const handleContinue = (selectedMotivations: string[]) => {
    // Navigate to struggle quiz
    router.push('./quiz-struggle');
  };

  return (
    <QuizMotivationScreen onContinue={handleContinue} />
  );
}