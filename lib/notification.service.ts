import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';
import { DatabaseService } from './database.service';

// Configure notification behavior
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

export interface NotificationSettings {
  enabled: boolean;
  dailyCheckInTime: string; // Format: "HH:MM"
  motivationalEnabled: boolean;
  motivationalFrequency: 'daily' | 'twice_daily' | 'weekly';
  milestoneEnabled: boolean;
  weekendRemindersEnabled: boolean;
}

export class NotificationService {
  // =====================================================
  // PERMISSION & SETUP
  // =====================================================
  
  static async requestPermissions(): Promise<boolean> {
    try {
      if (!Device.isDevice) {
        // Must use physical device for Push Notifications
        return false;
      }

      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;
      
      if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }
      
      if (finalStatus !== 'granted') {
        // Failed to get push token for push notification
        return false;
      }

      // Configure notification channels for Android
      if (Platform.OS === 'android') {
        await Notifications.setNotificationChannelAsync('default', {
          name: 'Default',
          importance: Notifications.AndroidImportance.MAX,
          vibrationPattern: [0, 250, 250, 250],
          lightColor: '#FF231F7C',
        });

        await Notifications.setNotificationChannelAsync('daily-checkin', {
          name: 'Daily Evening Reflection',
          importance: Notifications.AndroidImportance.HIGH,
          description: 'Evening reminders to complete your daily reflection and check-in',
          vibrationPattern: [0, 300, 200, 300],
          sound: 'default',
          lightColor: '#FFD700', // Golden color matching logo
          enableLights: true,
          enableVibrate: true,
          showBadge: true,
        });

        await Notifications.setNotificationChannelAsync('motivational', {
          name: 'Motivational Messages',
          importance: Notifications.AndroidImportance.DEFAULT,
          description: 'Inspiring messages to keep you motivated',
          vibrationPattern: [0, 150],
          sound: 'default',
        });

        await Notifications.setNotificationChannelAsync('milestones', {
          name: 'Milestone Celebrations',
          importance: Notifications.AndroidImportance.HIGH,
          description: 'Celebrate your achievements and streaks',
          vibrationPattern: [0, 500, 250, 500],
          sound: 'default',
        });
      }

      return true;
    } catch (error) {
      // Error requesting notification permissions
      return false;
    }
  }

  // =====================================================
  // DAILY CHECK-IN REMINDERS
  // =====================================================
  
  static async scheduleDailyCheckInReminder(time: string = '21:00'): Promise<void> {
    try {
      // Cancel existing daily reminder
      await this.cancelNotificationsByIdentifier('daily-checkin');
      
      const [hours, minutes] = time.split(':').map(Number);
      
      // Calculate seconds until the specified time
      const now = new Date();
      const scheduledTime = new Date();
      scheduledTime.setHours(hours, minutes, 0, 0);
      
      // If the time has passed today, schedule for tomorrow
      if (scheduledTime <= now) {
        scheduledTime.setDate(scheduledTime.getDate() + 1);
      }
      
      const secondsUntilTrigger = Math.floor((scheduledTime.getTime() - now.getTime()) / 1000);
      
      // Use time interval trigger for Android compatibility
      const trigger: Notifications.TimeIntervalTriggerInput = {
        type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
        seconds: secondsUntilTrigger,
        repeats: false, // We'll reschedule after each notification
      };

      const eveningReminderMessages = [
        "🌙 End your day with purpose - time for your evening check-in!",
        "✨ Reflect on today's victories, no matter how small",
        "🎯 Before you sleep, let's celebrate today's progress",
        "🌟 How did you grow today? Complete your daily reflection",
        "💪 You made it through another day - time to check in!",
        "🌅 Tomorrow starts tonight - complete your daily review",
        "🔥 Another day of strength - document your journey!",
        "⭐ Your daily accountability moment has arrived",
        "🎊 Time to acknowledge today's wins, big or small",
        "🧘 End your day mindfully - complete your check-in"
      ];

      const randomMessage = eveningReminderMessages[Math.floor(Math.random() * eveningReminderMessages.length)];

      await Notifications.scheduleNotificationAsync({
        identifier: 'daily-checkin',
        content: {
          title: '🌙 Evening Reflection Time',
          body: randomMessage,
          data: { 
            type: 'daily-checkin',
            action: 'open-checkin',
            timestamp: Date.now(),
            reschedule: true // Flag to reschedule after firing
          },
          sound: 'default',
          priority: Notifications.AndroidNotificationPriority.HIGH,
          // Enhanced styling for better visibility
          color: '#8B4513', // Rich brown matching logo
          badge: 1,
          categoryIdentifier: 'DAILY_CHECKIN',
        },
        trigger,
      });

      // Daily evening check-in reminder scheduled successfully
    } catch (error) {
      // Error scheduling daily check-in reminder
    }
  }

  // =====================================================
  // MOTIVATIONAL NOTIFICATIONS
  // =====================================================
  
  // =====================================================
  // AUTOMATIC RESCHEDULING HELPER
  // =====================================================
  
  static async handleNotificationReceived(notification: any): Promise<void> {
    try {
      // Check if this notification needs rescheduling
      if (notification.request.content.data?.reschedule && 
          notification.request.content.data?.type === 'daily-checkin') {
        
        // Schedule next day's notification
        await this.scheduleDailyCheckInReminder('21:00');
        // Daily reminder rescheduled for next day
      }
    } catch (error) {
      // Error handling notification rescheduling
    }
  }
  
  // =====================================================
  // MOTIVATIONAL NOTIFICATIONS (UPDATED)
  // =====================================================
  
  static async scheduleMotivationalNotifications(frequency: 'daily' | 'twice_daily' | 'weekly'): Promise<void> {
    try {
      await this.cancelNotificationsByIdentifier('motivational');
      
      const motivationalMessages = [
        "🎯 You're stronger than your urges. Keep going!",
        "💎 Every day of discipline builds the diamond of your character",
        "🌱 Growth happens in the moments you choose discipline",
        "🔥 Your future self is counting on the choices you make today",
        "⚡ Channel that energy into something productive today",
        "🏆 Champions are made in moments of choice, not chance",
        "🧠 Master your mind, master your life",
        "🌟 You're not just avoiding something - you're becoming someone",
        "💪 Discipline is doing what needs to be done, even when you don't want to",
        "🎨 You're sculpting the masterpiece of your life - stay focused",
        "🌅 Each sunrise is a new opportunity to be better than yesterday",
        "🎁 Self-control is the gift you give to your future self",
      ];

      let schedules: { hour: number; minute: number }[] = [];
      
      switch (frequency) {
        case 'daily':
          schedules = [{ hour: 10, minute: 0 }]; // 10:00 AM
          break;
        case 'twice_daily':
          schedules = [
            { hour: 9, minute: 0 },   // 9:00 AM
            { hour: 15, minute: 0 }   // 3:00 PM
          ];
          break;
        case 'weekly':
          schedules = [{ hour: 10, minute: 0 }]; // Will set different logic for weekly
          break;
      }

      for (let i = 0; i < schedules.length; i++) {
        const schedule = schedules[i];
        const message = motivationalMessages[Math.floor(Math.random() * motivationalMessages.length)];
        
        // Calculate seconds until the scheduled time (for today or tomorrow)
        const now = new Date();
        const scheduledTime = new Date();
        scheduledTime.setHours(schedule.hour, schedule.minute, 0, 0);
        
        // If time has passed today, schedule for tomorrow
        if (scheduledTime <= now) {
          scheduledTime.setDate(scheduledTime.getDate() + 1);
        }
        
        const secondsUntilTrigger = Math.floor((scheduledTime.getTime() - now.getTime()) / 1000);
        
        const trigger: Notifications.TimeIntervalTriggerInput = {
          type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
          seconds: secondsUntilTrigger,
          repeats: false, // Will be rescheduled after firing
        };

        await Notifications.scheduleNotificationAsync({
          identifier: `motivational-${i}`,
          content: {
            title: 'Stay Strong 💪',
            body: message,
            data: { 
              type: 'motivational',
              action: 'open-app',
              reschedule: frequency, // Store frequency for rescheduling
              scheduleIndex: i
            },
            sound: 'default',
          },
          trigger,
        });
      }

      // Motivational notifications scheduled successfully
    } catch (error) {
      // Error scheduling motivational notifications
    }
  }

  // =====================================================
  // MILESTONE & CELEBRATION NOTIFICATIONS
  // =====================================================
  
  static async scheduleStreakMilestoneNotification(days: number): Promise<void> {
    try {
      const milestoneMessages = {
        1: "🎉 Day 1 complete! You've taken the first step on your journey!",
        3: "🔥 3 days strong! You're building momentum!",
        7: "⭐ One week achieved! Your discipline is showing!",
        14: "💎 Two weeks of strength! You're becoming unstoppable!",
        30: "🏆 30 days! You've reached a major milestone! You're a champion!",
        60: "👑 60 days of mastery! Your transformation is incredible!",
        90: "🎊 90 days! You've completed the legendary 90-day challenge!",
        180: "🌟 180 days! Half a year of discipline - you're extraordinary!",
        365: "🎆 ONE FULL YEAR! You are living proof that transformation is possible!",
      };

      const message = milestoneMessages[days as keyof typeof milestoneMessages];
      
      if (message) {
        await Notifications.scheduleNotificationAsync({
          identifier: `milestone-${days}`,
          content: {
            title: `🎉 ${days} Day Milestone!`,
            body: message,
            data: { 
              type: 'milestone',
              days: days,
              action: 'celebrate'
            },
            sound: 'default',
            priority: Notifications.AndroidNotificationPriority.HIGH,
          },
          trigger: null, // Immediate notification
        });
      }
    } catch (error) {
      // Error scheduling milestone notification
    }
  }

  // =====================================================
  // EMERGENCY SUPPORT NOTIFICATIONS
  // =====================================================
  
  static async scheduleEmergencySupport(): Promise<void> {
    try {
      const supportMessages = [
        "🆘 Feeling triggered? Take 3 deep breaths and remember your WHY",
        "💪 This urge will pass. You're stronger than this moment",
        "🧘 Try the 5-4-3-2-1 grounding technique: 5 things you see, 4 you hear...",
        "🚶 Go for a walk, do push-ups, or call a friend. You've got this!",
        "🎯 Remember: You're not fighting against something, you're fighting FOR something",
        "⚡ Channel this energy into something positive right now!",
        "🌟 You've overcome this before, you can do it again",
        "🔥 Your future self is counting on this moment of strength"
      ];

      const message = supportMessages[Math.floor(Math.random() * supportMessages.length)];

      await Notifications.scheduleNotificationAsync({
        identifier: 'emergency-support',
        content: {
          title: '🆘 You Can Do This! 💪',
          body: message,
          data: { 
            type: 'emergency-support',
            action: 'open-panic-screen',
            urgent: true
          },
          sound: 'default',
          priority: Notifications.AndroidNotificationPriority.MAX,
          color: '#FF6B35', // Urgent orange-red color
          badge: 1,
          categoryIdentifier: 'EMERGENCY_SUPPORT',
        },
        trigger: null, // Immediate
      });
    } catch (error) {
      // Error scheduling emergency support notification
    }
  }

  // =====================================================
  // UTILITY FUNCTIONS
  // =====================================================
  
  static async cancelNotificationsByIdentifier(identifier: string): Promise<void> {
    try {
      const scheduledNotifications = await Notifications.getAllScheduledNotificationsAsync();
      const toCancel = scheduledNotifications
        .filter(notification => notification.identifier.startsWith(identifier))
        .map(notification => notification.identifier);
      
      if (toCancel.length > 0) {
        for (const identifier of toCancel) {
          await Notifications.cancelScheduledNotificationAsync(identifier);
        }
        // Notifications cancelled successfully
      }
    } catch (error) {
      // Error cancelling notifications
    }
  }

  static async cancelAllNotifications(): Promise<void> {
    try {
      await Notifications.cancelAllScheduledNotificationsAsync();
      // All notifications cancelled
    } catch (error) {
      // Error cancelling all notifications
    }
  }

  static async getScheduledNotifications(): Promise<Notifications.NotificationRequest[]> {
    try {
      return await Notifications.getAllScheduledNotificationsAsync();
    } catch (error) {
      // Error getting scheduled notifications
      return [];
    }
  }

  // =====================================================
  // USER SETTINGS INTEGRATION
  // =====================================================
  
  static async updateNotificationSettings(userId: string, settings: NotificationSettings): Promise<void> {
    try {
      // Cancel all existing notifications
      await this.cancelAllNotifications();

      if (!settings.enabled) {
        // Notifications disabled by user settings
        return;
      }

      // Schedule daily check-in reminder (default to 9PM if not specified)
      const checkInTime = settings.dailyCheckInTime || '21:00';
      await this.scheduleDailyCheckInReminder(checkInTime);

      // Schedule motivational notifications
      if (settings.motivationalEnabled) {
        await this.scheduleMotivationalNotifications(settings.motivationalFrequency);
      }

      // Save settings to database
      const { data: currentSettings } = await DatabaseService.getUserSettings(userId);
      await DatabaseService.updateUserSettings(userId, {
        ...currentSettings,
        notification_settings: settings,
      });

      // Notification settings updated successfully
    } catch (error) {
      // Error updating notification settings
    }
  }

  // =====================================================
  // ADAPTIVE NOTIFICATIONS BASED ON USER BEHAVIOR
  // =====================================================
  
  static async scheduleAdaptiveNotifications(userId: string): Promise<void> {
    try {
      // Get user's check-in history to determine optimal notification times
      const { data: checkins } = await DatabaseService.getUserCheckins(userId);
      const { data: streak } = await DatabaseService.getCurrentStreak(userId);

      if (!checkins || checkins.length === 0) return;

      // Analyze check-in patterns
      const checkInTimes = checkins.map(checkin => new Date(checkin.completed_at).getHours());
      const avgCheckInTime = checkInTimes.reduce((a, b) => a + b, 0) / checkInTimes.length;

      // Schedule reminder 2 hours before typical check-in time
      const reminderTime = Math.max(8, Math.floor(avgCheckInTime) - 2);
      await this.scheduleDailyCheckInReminder(`${reminderTime}:00`);

      // Schedule motivational boost if streak is struggling
      if (streak && streak.days_count < 7) {
        await this.scheduleMotivationalNotifications('twice_daily');
      } else {
        await this.scheduleMotivationalNotifications('daily');
      }

    } catch (error) {
      // Error scheduling adaptive notifications
    }
  }

  // =====================================================
  // CONVENIENCE METHODS
  // =====================================================
  
  static async setupDefault9PMReminder(): Promise<void> {
    try {
      await this.scheduleDailyCheckInReminder('21:00');
      // Default 9PM evening reminder has been set up successfully
    } catch (error) {
      // Error setting up default 9PM reminder
    }
  }
}