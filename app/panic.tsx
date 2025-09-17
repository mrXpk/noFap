import { router } from 'expo-router';
import React from 'react';
import PanicScreen from '../components/PanicScreen';

export default function PanicPage() {
  const handleBack = () => {
    router.back();
  };

  return (
    <PanicScreen onBack={handleBack} />
  );
}