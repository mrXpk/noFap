import { LinearGradient } from 'expo-linear-gradient';
import React, { useState } from 'react';
import {
    Alert,
    Animated,
    Dimensions,
    ScrollView,
    StyleSheet,
    Switch,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import { useAuth } from '../contexts/AuthContext';
import { DatabaseService } from '../lib/database.service';
import { UserSettings } from '../lib/database.types';

interface ProfileScreenProps {
  onBack: () => void;
  onUpgradeToPro: () => void;
  onYourWhyEdit: () => void;
  onMediaLogPress: () => void;
}

const { width } = Dimensions.get('window');

export default function ProfileScreen({
  onBack,
  onUpgradeToPro,
  onYourWhyEdit,
  onMediaLogPress,
}: ProfileScreenProps) {
  const { user, userProfile, updateProfile } = useAuth();
  const [username, setUsername] = useState('Sacred Warrior');
  const [tagline, setTagline] = useState('Walking the path of discipline');
  const [yourWhy, setYourWhy] = useState('I choose this journey to become the best version of myself, to honor my body as a temple, and to live with purpose and integrity.');
  const [isEditingWhy, setIsEditingWhy] = useState(false);
  const [loading, setLoading] = useState(true);
  
  // Settings toggles
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [privacyMode, setPrivacyMode] = useState(false);
  
  // Real stats from database
  const [currentStreak, setCurrentStreak] = useState(0);
  const [longestStreak, setLongestStreak] = useState(0);
  const [totalRelapses, setTotalRelapses] = useState(0);
  const progressPercentage = Math.min((currentStreak / 100) * 100, 100);

  const pulseAnim = new Animated.Value(1);

  React.useEffect(() => {
    loadUserData();
    
    const pulse = () => {
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.05,
          duration: 2000,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 2000,
          useNativeDriver: true,
        }),
      ]).start(pulse);
    };
    pulse();
  }, [user]);

  const loadUserData = async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      
      // Load user profile data
      if (userProfile) {
        setUsername(userProfile.username || 'Sacred Warrior');
        setTagline(userProfile.tagline || 'Walking the path of discipline');
        setYourWhy(userProfile.your_why || 'I choose this journey to become the best version of myself, to honor my body as a temple, and to live with purpose and integrity.');
      }
      
      // Load user stats
      const { data: stats } = await DatabaseService.getUserStats(user.id);
      if (stats) {
        setCurrentStreak(stats.currentStreak);
        setLongestStreak(stats.longestStreak);
        setTotalRelapses(stats.totalRelapses);
      }
      
      // Load user settings
      const { data: settings } = await DatabaseService.getUserSettings(user.id);
      if (settings) {
        setNotificationsEnabled(settings.notifications_enabled);
        setPrivacyMode(settings.privacy_mode);
      }
    } catch (error) {
      console.error('Error loading user data:', error);
      Alert.alert('Error', 'Failed to load profile data.');
    } finally {
      setLoading(false);
    }
  };

  const handleWhyEdit = async () => {
    if (isEditingWhy) {
      // Save the changes
      if (user && updateProfile) {
        const { error } = await updateProfile({ your_why: yourWhy });
        if (error) {
          Alert.alert('Error', 'Failed to save your WHY.');
          return;
        }
      }
      setIsEditingWhy(false);
    } else {
      setIsEditingWhy(true);
    }
  };

  const handleSettingsChange = async (setting: 'notifications' | 'privacy', value: boolean) => {
    if (!user) return;
    
    try {
      const updates: Partial<UserSettings> = {};
      if (setting === 'notifications') {
        updates.notifications_enabled = value;
        setNotificationsEnabled(value);
      } else {
        updates.privacy_mode = value;
        setPrivacyMode(value);
      }
      
      await DatabaseService.updateUserSettings(user.id, updates);
    } catch (error) {
      console.error('Error updating settings:', error);
      Alert.alert('Error', 'Failed to update settings.');
    }
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#F5DEB3', '#DEB887', '#CD853F']} // Parchment to warm brown
        style={styles.background}
      >
        {/* Header with Back Button */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={onBack}>
            <Text style={styles.backIcon}>‹</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Profile</Text>
          <View style={styles.headerSpacer} />
        </View>

        <ScrollView 
          contentContainerStyle={styles.scrollContainer}
          showsVerticalScrollIndicator={false}
        >
          {/* Profile Avatar Section */}
          <View style={styles.profileSection}>
            <TouchableOpacity style={styles.avatarContainer}>
              <LinearGradient
                colors={['#DAA520', '#B8860B']}
                style={styles.avatarGradient}
              >
                <Text style={styles.avatarIcon}>👤</Text>
              </LinearGradient>
              <View style={styles.editBadge}>
                <Text style={styles.editIcon}>✏️</Text>
              </View>
            </TouchableOpacity>
            
            <Text style={styles.username}>{username}</Text>
            <Text style={styles.tagline}>{tagline}</Text>
          </View>

          {/* Ornamental Divider */}
          <View style={styles.ornamentalDivider}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerSymbol}>✦</Text>
            <View style={styles.dividerLine} />
          </View>

          {/* Upgrade to Pro Section */}
          <View style={styles.proSection}>
            <LinearGradient
              colors={['rgba(218, 165, 32, 0.15)', 'rgba(184, 134, 11, 0.1)']}
              style={styles.proCard}
            >
              <View style={styles.proContent}>
                <Text style={styles.proIcon}>👑</Text>
                <View style={styles.proText}>
                  <Text style={styles.proTitle}>Upgrade to Sacred Pro</Text>
                  <Text style={styles.proSubtitle}>Unlock advanced insights, unlimited entries & premium features</Text>
                </View>
                <TouchableOpacity style={styles.proButton} onPress={onUpgradeToPro}>
                  <LinearGradient
                    colors={['#DAA520', '#B8860B']}
                    style={styles.proButtonGradient}
                  >
                    <Text style={styles.proButtonText}>Upgrade</Text>
                  </LinearGradient>
                </TouchableOpacity>
              </View>
            </LinearGradient>
          </View>

          {/* Progress Overview */}
          <View style={styles.progressSection}>
            <Text style={styles.sectionTitle}>Sacred Progress</Text>
            
            {/* Main Progress Ring */}
            <View style={styles.progressRingContainer}>
              <Animated.View style={[styles.progressRing, { transform: [{ scale: pulseAnim }] }]}>
                <View style={styles.progressTrack}>
                  <View 
                    style={[
                      styles.progressFill,
                      { 
                        transform: [{ rotate: `${(progressPercentage / 100) * 360}deg` }] 
                      }
                    ]} 
                  />
                </View>
                <View style={styles.progressCenter}>
                  <Text style={styles.progressNumber}>{currentStreak}</Text>
                  <Text style={styles.progressLabel}>Days</Text>
                </View>
              </Animated.View>
            </View>

            {/* Stats Grid */}
            <View style={styles.statsGrid}>
              <View style={styles.statCard}>
                <Text style={styles.statNumber}>{longestStreak}</Text>
                <Text style={styles.statLabel}>Longest Streak</Text>
              </View>
              <View style={styles.statCard}>
                <Text style={styles.statNumber}>{totalRelapses}</Text>
                <Text style={styles.statLabel}>Total Relapses</Text>
              </View>
            </View>
          </View>

          {/* Your WHY Section */}
          <View style={styles.whySection}>
            <View style={styles.whyHeader}>
              <Text style={styles.sectionTitle}>Your WHY</Text>
              <TouchableOpacity style={styles.editButton} onPress={handleWhyEdit}>
                <Text style={styles.editButtonText}>
                  {isEditingWhy ? 'Save' : 'Edit'}
                </Text>
              </TouchableOpacity>
            </View>
            
            <View style={styles.whyCard}>
              <LinearGradient
                colors={['rgba(245, 245, 220, 0.9)', 'rgba(222, 184, 135, 0.8)']}
                style={styles.whyCardGradient}
              >
                {isEditingWhy ? (
                  <TextInput
                    style={styles.whyInput}
                    value={yourWhy}
                    onChangeText={setYourWhy}
                    multiline
                    placeholder="Write your sacred purpose..."
                    placeholderTextColor="#A0522D"
                  />
                ) : (
                  <Text style={styles.whyText}>"{yourWhy}"</Text>
                )}
              </LinearGradient>
            </View>
          </View>

          {/* Media Log Section */}
          <View style={styles.mediaSection}>
            <Text style={styles.sectionTitle}>Sacred Archive</Text>
            <TouchableOpacity style={styles.mediaCard} onPress={onMediaLogPress}>
              <LinearGradient
                colors={['rgba(139, 69, 19, 0.1)', 'rgba(160, 82, 45, 0.05)']}
                style={styles.mediaCardGradient}
              >
                <View style={styles.mediaContent}>
                  <View style={styles.mediaIconContainer}>
                    <Text style={styles.mediaIcon}>📱</Text>
                  </View>
                  <View style={styles.mediaText}>
                    <Text style={styles.mediaTitle}>Panic Recordings & Journals</Text>
                    <Text style={styles.mediaSubtitle}>Access your strength sessions and reflections</Text>
                  </View>
                  <Text style={styles.mediaArrow}>›</Text>
                </View>
              </LinearGradient>
            </TouchableOpacity>
          </View>

          {/* Settings Section */}
          <View style={styles.settingsSection}>
            <Text style={styles.sectionTitle}>Sacred Settings</Text>
            
            <View style={styles.settingsCard}>
              <LinearGradient
                colors={['rgba(245, 245, 220, 0.9)', 'rgba(222, 184, 135, 0.8)']}
                style={styles.settingsCardGradient}
              >
                {/* Notifications Toggle */}
                <View style={styles.settingItem}>
                  <View style={styles.settingContent}>
                    <Text style={styles.settingIcon}>🔔</Text>
                    <View style={styles.settingText}>
                      <Text style={styles.settingTitle}>Daily Reminders</Text>
                      <Text style={styles.settingSubtitle}>Gentle notifications for check-ins</Text>
                    </View>
                  </View>
                  <Switch
                    value={notificationsEnabled}
                    onValueChange={(value) => handleSettingsChange('notifications', value)}
                    trackColor={{ false: '#A0522D', true: '#DAA520' }}
                    thumbColor={notificationsEnabled ? '#F5DEB3' : '#DEB887'}
                  />
                </View>

                <View style={styles.settingDivider} />

                {/* Privacy Toggle */}
                <View style={styles.settingItem}>
                  <View style={styles.settingContent}>
                    <Text style={styles.settingIcon}>🔒</Text>
                    <View style={styles.settingText}>
                      <Text style={styles.settingTitle}>Privacy Mode</Text>
                      <Text style={styles.settingSubtitle}>Hide sensitive information</Text>
                    </View>
                  </View>
                  <Switch
                    value={privacyMode}
                    onValueChange={(value) => handleSettingsChange('privacy', value)}
                    trackColor={{ false: '#A0522D', true: '#DAA520' }}
                    thumbColor={privacyMode ? '#F5DEB3' : '#DEB887'}
                  />
                </View>
              </LinearGradient>
            </View>
          </View>

          {/* Sacred Footer */}
          <View style={styles.footerSection}>
            <View style={styles.ornamentalDivider}>
              <View style={styles.dividerLine} />
              <Text style={styles.dividerSymbol}>✦</Text>
              <View style={styles.dividerLine} />
            </View>
            <Text style={styles.footerText}>Stay true to your path.</Text>
          </View>
        </ScrollView>
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  background: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(139, 69, 19, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  backIcon: {
    fontSize: 24,
    color: '#8B4513',
    fontWeight: 'bold',
  },
  headerTitle: {
    fontSize: 24,
    fontFamily: 'serif',
    color: '#8B4513',
    fontWeight: '700',
    letterSpacing: 1,
  },
  headerSpacer: {
    width: 40,
  },
  scrollContainer: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingBottom: 40,
  },

  // Profile Avatar Section
  profileSection: {
    alignItems: 'center',
    marginBottom: 30,
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: 16,
  },
  avatarGradient: {
    width: 120,
    height: 120,
    borderRadius: 60,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: '#F5DEB3',
    shadowColor: '#8B4513',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 10,
  },
  avatarIcon: {
    fontSize: 48,
    color: '#FFFFFF',
  },
  editBadge: {
    position: 'absolute',
    bottom: 8,
    right: 8,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#DAA520',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#F5DEB3',
  },
  editIcon: {
    fontSize: 16,
  },
  username: {
    fontSize: 26,
    fontFamily: 'serif',
    color: '#8B4513',
    fontWeight: '700',
    marginBottom: 4,
    letterSpacing: 1,
  },
  tagline: {
    fontSize: 16,
    fontFamily: 'serif',
    color: '#A0522D',
    fontStyle: 'italic',
    textAlign: 'center',
    letterSpacing: 0.5,
  },

  // Ornamental Divider
  ornamentalDivider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 20,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: 'rgba(139, 69, 19, 0.3)',
  },
  dividerSymbol: {
    fontSize: 16,
    color: '#DAA520',
    marginHorizontal: 16,
    fontFamily: 'serif',
  },

  // Upgrade to Pro Section
  proSection: {
    marginBottom: 30,
  },
  proCard: {
    borderRadius: 16,
    padding: 2,
    borderWidth: 1,
    borderColor: 'rgba(218, 165, 32, 0.3)',
  },
  proContent: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 20,
    backgroundColor: 'rgba(245, 245, 220, 0.95)',
    borderRadius: 14,
  },
  proIcon: {
    fontSize: 32,
    marginRight: 16,
  },
  proText: {
    flex: 1,
  },
  proTitle: {
    fontSize: 18,
    fontFamily: 'serif',
    color: '#8B4513',
    fontWeight: '700',
    marginBottom: 4,
  },
  proSubtitle: {
    fontSize: 14,
    fontFamily: 'serif',
    color: '#A0522D',
    lineHeight: 18,
  },
  proButton: {
    borderRadius: 20,
    overflow: 'hidden',
  },
  proButtonGradient: {
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  proButtonText: {
    fontSize: 14,
    fontFamily: 'serif',
    color: '#FFFFFF',
    fontWeight: '600',
  },

  // Progress Section
  progressSection: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 20,
    fontFamily: 'serif',
    color: '#8B4513',
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 20,
    letterSpacing: 1,
  },
  progressRingContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  progressRing: {
    width: 150,
    height: 150,
    alignItems: 'center',
    justifyContent: 'center',
  },
  progressTrack: {
    position: 'absolute',
    width: 150,
    height: 150,
    borderRadius: 75,
    borderWidth: 8,
    borderColor: 'rgba(218, 165, 32, 0.2)',
  },
  progressFill: {
    position: 'absolute',
    width: 150,
    height: 150,
    borderRadius: 75,
    borderWidth: 8,
    borderColor: '#DAA520',
    borderRightColor: 'transparent',
    borderBottomColor: 'transparent',
  },
  progressCenter: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: 'rgba(245, 245, 220, 0.95)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#DAA520',
  },
  progressNumber: {
    fontSize: 32,
    fontFamily: 'serif',
    color: '#DAA520',
    fontWeight: '700',
  },
  progressLabel: {
    fontSize: 14,
    fontFamily: 'serif',
    color: '#8B4513',
    fontWeight: '600',
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statCard: {
    backgroundColor: 'rgba(245, 245, 220, 0.9)',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(218, 165, 32, 0.3)',
    shadowColor: '#8B4513',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  statNumber: {
    fontSize: 24,
    fontFamily: 'serif',
    color: '#DAA520',
    fontWeight: '700',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    fontFamily: 'serif',
    color: '#8B4513',
    textAlign: 'center',
    fontWeight: '600',
  },

  // Your WHY Section
  whySection: {
    marginBottom: 30,
  },
  whyHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  editButton: {
    backgroundColor: 'rgba(218, 165, 32, 0.2)',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 16,
  },
  editButtonText: {
    fontSize: 14,
    fontFamily: 'serif',
    color: '#8B4513',
    fontWeight: '600',
  },
  whyCard: {
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(218, 165, 32, 0.3)',
  },
  whyCardGradient: {
    padding: 20,
  },
  whyInput: {
    fontSize: 16,
    fontFamily: 'serif',
    color: '#8B4513',
    lineHeight: 24,
    textAlignVertical: 'top',
    minHeight: 80,
  },
  whyText: {
    fontSize: 16,
    fontFamily: 'serif',
    color: '#8B4513',
    lineHeight: 24,
    fontStyle: 'italic',
  },

  // Media Log Section
  mediaSection: {
    marginBottom: 30,
  },
  mediaCard: {
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(139, 69, 19, 0.2)',
  },
  mediaCardGradient: {
    padding: 1,
  },
  mediaContent: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(245, 245, 220, 0.95)',
    borderRadius: 15,
    paddingVertical: 16,
    paddingHorizontal: 20,
  },
  mediaIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(218, 165, 32, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  mediaIcon: {
    fontSize: 24,
  },
  mediaText: {
    flex: 1,
  },
  mediaTitle: {
    fontSize: 16,
    fontFamily: 'serif',
    color: '#8B4513',
    fontWeight: '600',
    marginBottom: 4,
  },
  mediaSubtitle: {
    fontSize: 14,
    fontFamily: 'serif',
    color: '#A0522D',
    lineHeight: 18,
  },
  mediaArrow: {
    fontSize: 24,
    color: '#DAA520',
    fontWeight: 'bold',
  },

  // Settings Section
  settingsSection: {
    marginBottom: 30,
  },
  settingsCard: {
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(218, 165, 32, 0.3)',
  },
  settingsCardGradient: {
    padding: 20,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 8,
  },
  settingContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  settingIcon: {
    fontSize: 24,
    marginRight: 16,
  },
  settingText: {
    flex: 1,
  },
  settingTitle: {
    fontSize: 16,
    fontFamily: 'serif',
    color: '#8B4513',
    fontWeight: '600',
    marginBottom: 2,
  },
  settingSubtitle: {
    fontSize: 13,
    fontFamily: 'serif',
    color: '#A0522D',
  },
  settingDivider: {
    height: 1,
    backgroundColor: 'rgba(139, 69, 19, 0.2)',
    marginVertical: 12,
  },

  // Footer Section
  footerSection: {
    alignItems: 'center',
    marginTop: 20,
  },
  footerText: {
    fontSize: 16,
    fontFamily: 'serif',
    color: '#A0522D',
    fontWeight: '500',
    letterSpacing: 1,
    textAlign: 'center',
    fontStyle: 'italic',
    opacity: 0.8,
  },
});