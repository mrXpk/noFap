import { router } from 'expo-router';
import React from 'react';
import ProfileScreen from '../components/ProfileScreen';
import ProtectedRoute from '../components/ProtectedRoute';

export default function ProfilePage() {
  const handleBack = () => {
    router.back();
  };

  const handleUpgradeToPro = () => {
    router.push('./get-premium');
  };

  const handleYourWhyEdit = () => {
    // Navigate to why reflection screen for editing
    router.push('./why-reflection');
  };

  const handleMediaLogPress = () => {
    // Navigate to media log screen
    // Navigate to media log
  };

  return (
    <ProtectedRoute>
      <ProfileScreen
        onBack={handleBack}
        onUpgradeToPro={handleUpgradeToPro}
        onYourWhyEdit={handleYourWhyEdit}
        onMediaLogPress={handleMediaLogPress}
      />
    </ProtectedRoute>
  );
}