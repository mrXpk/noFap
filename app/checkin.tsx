import { router, useLocalSearchParams } from 'expo-router';
import React from 'react';
import CheckInScreen from '../components/CheckInScreen';

interface CheckInData {
  date: string;
  fapped: boolean;
  signature: string;
  reflection: string;
}

export default function CheckInPage() {
  const { date } = useLocalSearchParams<{ date?: string }>();

  const handleBack = () => {
    router.back();
  };

  const handleSave = (data: CheckInData) => {
    // Save check-in data
    // Check-in saved successfully
    
    // Show success message and navigate back
    // For now, just go back to previous screen
    router.back();
  };

  return (
    <CheckInScreen 
      onBack={handleBack}
      onSave={handleSave}
      selectedDate={date}
    />
  );
}