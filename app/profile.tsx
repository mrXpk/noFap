import { router } from 'expo-router';
import * as Sharing from 'expo-sharing';
import React from 'react';
import ProfileScreen from '../components/ProfileScreen';

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

  const handleShareApp = async () => {
    try {
      // Check if sharing is available
      if (!(await Sharing.isAvailableAsync())) {
        alert('Sharing is not available on your device');
        return;
      }

      // Share message
      await Sharing.shareAsync('Check out the NoFap app - transform your life and build discipline!', {
        mimeType: 'text/plain',
        dialogTitle: 'Share NoFap App',
      });
    } catch (error) {
      console.error('Error sharing app:', error);
      alert('Unable to share app at this time');
    }
  };

  const handleSignUp = () => {
    // Navigate to signup screen
    router.push('./signup');
  };

  return (
    <ProfileScreen
      onBack={handleBack}
      onUpgradeToPro={handleUpgradeToPro}
      onYourWhyEdit={handleYourWhyEdit}
      onMediaLogPress={handleMediaLogPress}
      onShareApp={handleShareApp}
      onSignUp={handleSignUp}
    />
  );
}