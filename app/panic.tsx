import { router } from 'expo-router';
import React from 'react';
import PanicScreen from '../components/PanicScreen';
import ProtectedRoute from '../components/ProtectedRoute';

export default function PanicPage() {
  const handleBack = () => {
    router.back();
  };

  return (
    <ProtectedRoute>
      <PanicScreen onBack={handleBack} />
    </ProtectedRoute>
  );
}