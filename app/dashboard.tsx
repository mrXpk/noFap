import React from 'react';
import MainDashboard from '../components/MainDashboard';

export default function DashboardPage() {
  const handleSignToday = () => {
    // TODO: Navigate to daily ritual/check-in screen
    console.log('Sign Today pressed');
  };

  const handlePanicPress = () => {
    // TODO: Navigate to panic/emergency motivation screen
    console.log('Panic button pressed');
  };

  const handleCalendarPress = () => {
    // TODO: Navigate to calendar view
    console.log('Calendar pressed');
  };

  const handleHistoryPress = () => {
    // TODO: Navigate to history/journal view
    console.log('History pressed');
  };

  const handleYourWhyPress = () => {
    // TODO: Navigate to user's WHY reflection
    console.log('Your WHY pressed');
  };

  return (
    <MainDashboard
      onSignToday={handleSignToday}
      onPanicPress={handlePanicPress}
      onCalendarPress={handleCalendarPress}
      onHistoryPress={handleHistoryPress}
      onYourWhyPress={handleYourWhyPress}
    />
  );
}