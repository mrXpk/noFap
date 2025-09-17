import { router } from 'expo-router';
import React from 'react';
import MainDashboard from '../components/MainDashboard';
import ProtectedRoute from '../components/ProtectedRoute';

export default function DashboardPage() {
  const handleCheckInToday = () => {
    // Navigate to check-in screen with today's date
    const today = new Date().toISOString().split('T')[0];
    router.push(`./checkin?date=${today}`);
  };

  const handlePanicPress = () => {
    // Navigate to panic screen immediately
    router.push('./panic');
  };

  const handleCalendarPress = () => {
    // Navigate to calendar view
    router.push('./calendar');
  };

  const handleHistoryPress = () => {
    // TODO: Navigate to history/journal view
    console.log('History pressed');
  };

  const handleYourWhyPress = () => {
    // Navigate to user's WHY reflection
    router.push('./why-reflection');
  };

  const handleProfilePress = () => {
    // Navigate to profile screen
    router.push('./profile');
  };

  return (
    <ProtectedRoute>
      <MainDashboard
        onCheckInToday={handleCheckInToday}
        onPanicPress={handlePanicPress}
        onCalendarPress={handleCalendarPress}
        onHistoryPress={handleHistoryPress}
        onYourWhyPress={handleYourWhyPress}
        onProfilePress={handleProfilePress}
      />
    </ProtectedRoute>
  );
}