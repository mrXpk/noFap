import { router } from 'expo-router';
import React from 'react';
import CalendarScreen from '../components/CalendarScreen';

export default function CalendarPage() {
  const handleBack = () => {
    router.back();
  };

  const handleNavigateToCheckIn = (date: string) => {
    router.push(`./checkin?date=${date}`);
  };

  return (
    <CalendarScreen 
      onBack={handleBack} 
      onNavigateToCheckIn={handleNavigateToCheckIn}
    />
  );
}