import * as Notifications from 'expo-notifications';
import React, { createContext, useContext, useEffect, useState } from 'react';
import { DatabaseService } from '../lib/database.service';
import { NotificationService, NotificationSettings } from '../lib/notification.service';
import { useAuth } from './AuthContext';

interface NotificationContextType {
  settings: NotificationSettings | null;
  updateSettings: (settings: NotificationSettings) => Promise<void>;
  requestPermissions: () => Promise<boolean>;
  scheduleCheckInReminder: (time: string) => Promise<void>;
  scheduleMilestone: (days: number) => Promise<void>;
  scheduleEmergencySupport: () => Promise<void>;
  permissionGranted: boolean;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export function NotificationProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [settings, setSettings] = useState<NotificationSettings | null>(null);
  const [permissionGranted, setPermissionGranted] = useState(false);

  useEffect(() => {
    initializeNotifications();
    
    // Set up notification listener for auto-rescheduling
    const notificationListener = Notifications.addNotificationReceivedListener(notification => {
      // Handle auto-rescheduling
      NotificationService.handleNotificationReceived(notification);
    });

    return () => {
      notificationListener.remove();
    };
  }, [user]);

  const initializeNotifications = async () => {
    try {
      // Request permissions
      const granted = await NotificationService.requestPermissions();
      setPermissionGranted(granted);

      if (user && granted) {
        // Load user notification settings
        const { data: userSettings } = await DatabaseService.getUserSettings(user.id);
        if (userSettings?.notification_settings) {
          setSettings(userSettings.notification_settings);
          // Set up notifications based on saved settings
          await NotificationService.updateNotificationSettings(user.id, userSettings.notification_settings);
        } else {
          // Set default settings
          const defaultSettings: NotificationSettings = {
            enabled: true,
            dailyCheckInTime: "21:00", // 9PM default as per user preference
            motivationalEnabled: true,
            motivationalFrequency: 'daily',
            milestoneEnabled: true,
            weekendRemindersEnabled: true,
          };
          setSettings(defaultSettings);
        }
      }
    } catch (error) {
      // Error initializing notifications
    }
  };

  const updateSettings = async (newSettings: NotificationSettings) => {
    if (!user) return;
    
    try {
      setSettings(newSettings);
      await NotificationService.updateNotificationSettings(user.id, newSettings);
    } catch (error) {
      // Error updating notification settings
      throw error;
    }
  };

  const requestPermissions = async () => {
    const granted = await NotificationService.requestPermissions();
    setPermissionGranted(granted);
    return granted;
  };

  const scheduleCheckInReminder = async (time: string) => {
    await NotificationService.scheduleDailyCheckInReminder(time);
  };

  const scheduleMilestone = async (days: number) => {
    await NotificationService.scheduleStreakMilestoneNotification(days);
  };

  const scheduleEmergencySupport = async () => {
    await NotificationService.scheduleEmergencySupport();
  };

  const value: NotificationContextType = {
    settings,
    updateSettings,
    requestPermissions,
    scheduleCheckInReminder,
    scheduleMilestone,
    scheduleEmergencySupport,
    permissionGranted,
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotifications() {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
}