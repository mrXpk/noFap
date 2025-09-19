import { router } from 'expo-router';
import React from 'react';
import GetPremiumScreen from '../components/GetPremiumScreen';

export default function GetPremiumPage() {
  const handleGetPremium = (plan: 'monthly' | '3month' | 'yearly') => {
    // Handle premium subscription logic
    // Premium plan selected
    
    // After successful payment, navigate to dashboard
    router.replace('/dashboard');
  };

  const handleContinueFree = () => {
    // Navigate to dashboard with free account
    router.replace('/dashboard');
  };

  return (
    <GetPremiumScreen
      onGetPremium={handleGetPremium}
      onContinueFree={handleContinueFree}
    />
  );
}