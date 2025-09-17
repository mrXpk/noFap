import { LinearGradient } from 'expo-linear-gradient';
import React, { useEffect, useState } from 'react';
import {
  Alert,
  Animated,
  Dimensions,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useAuth } from '../contexts/AuthContext';
import { DatabaseService } from '../lib/database.service';

interface MainDashboardProps {
  onCheckInToday: () => void;
  onPanicPress: () => void;
  onCalendarPress: () => void;
  onHistoryPress: () => void;
  onYourWhyPress: () => void;
  onProfilePress?: () => void;
}

const { width } = Dimensions.get('window');

export default function MainDashboard({
  onCheckInToday,
  onPanicPress,
  onCalendarPress,
  onHistoryPress,
  onYourWhyPress,
  onProfilePress = () => {},
}: MainDashboardProps) {
  const [currentStreak, setCurrentStreak] = useState(0);
  const [currentQuoteIndex, setCurrentQuoteIndex] = useState(0);
  const [activeTab, setActiveTab] = useState('Dashboard');
  const [loading, setLoading] = useState(true);
  const ringAnimation = new Animated.Value(0);
  const { user } = useAuth();

  const inspirationalQuotes = [
    "You are stronger than yesterday.",
    "Every day is a victory in your sacred journey.",
    "Discipline is the bridge between goals and accomplishment.",
    "Your strength comes from within, guided by purpose.",
    "Today you choose greatness over temptation.",
    "Progress, not perfection, defines your journey.",
    "Your future self is counting on this moment.",
    "Courage is not the absence of fear, but action despite it.",
    "Every choice is a chance to become who you're meant to be.",
    "The path of discipline leads to lasting freedom."
  ];

  useEffect(() => {
    loadUserData();
    
    // Start ring animation
    Animated.loop(
      Animated.timing(ringAnimation, {
        toValue: 1,
        duration: 3000,
        useNativeDriver: true,
      })
    ).start();
    
    // Auto-rotate quotes every 8 seconds
    const quoteInterval = setInterval(() => {
      setCurrentQuoteIndex((prev) => (prev + 1) % inspirationalQuotes.length);
    }, 8000);
    
    return () => clearInterval(quoteInterval);
  }, [user]);

  const loadUserData = async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      
      // Get current streak from database
      const { data: currentStreakData } = await DatabaseService.getCurrentStreak(user.id);
      
      if (currentStreakData) {
        // Calculate current streak days
        const startDate = new Date(currentStreakData.start_date);
        const today = new Date();
        const diffTime = Math.abs(today.getTime() - startDate.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        setCurrentStreak(diffDays);
      } else {
        // No active streak found, start a new one
        await createInitialStreak();
      }
    } catch (error) {
      console.error('Error loading user data:', error);
      Alert.alert('Error', 'Failed to load your progress data.');
    } finally {
      setLoading(false);
    }
  };

  const createInitialStreak = async () => {
    if (!user) return;
    
    try {
      const today = new Date().toISOString().split('T')[0];
      const { data, error } = await DatabaseService.createStreak(user.id, {
        start_date: today,
        end_date: null,
        is_active: true,
        days_count: 1,
      });
      
      if (data) {
        setCurrentStreak(1);
      } else if (error) {
        console.error('Error creating initial streak:', error);
      }
    } catch (error) {
      console.error('Error creating initial streak:', error);
    }
  };

  const ringRotation = ringAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  const progressPercentage = Math.min((currentStreak / 100) * 100, 100);

  const handleQuoteSwipe = (direction: 'left' | 'right') => {
    if (direction === 'left') {
      setCurrentQuoteIndex((prev) => (prev + 1) % inspirationalQuotes.length);
    } else {
      setCurrentQuoteIndex((prev) => 
        prev === 0 ? inspirationalQuotes.length - 1 : prev - 1
      );
    }
  };

  const handleTabPress = (tab: string) => {
    setActiveTab(tab);
    switch (tab) {
      case 'Calendar':
        onCalendarPress();
        break;
      case 'History':
        onHistoryPress();
        break;
      case 'Motivation':
        onYourWhyPress();
        break;
    }
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#F5DEB3', '#DEB887', '#CD853F']} // Parchment to warm brown
        style={styles.background}
      >
        {/* Profile Avatar - Top Right */}
        <TouchableOpacity style={styles.profileButton} onPress={onProfilePress}>
          <LinearGradient
            colors={['#DAA520', '#B8860B']}
            style={styles.profileGradient}
          >
            <Text style={styles.profileIcon}>👤</Text>
          </LinearGradient>
        </TouchableOpacity>

        <ScrollView 
          contentContainerStyle={styles.scrollContainer}
          showsVerticalScrollIndicator={false}
        >
          {/* Glowing Streak Ring Counter */}
          <View style={styles.streakSection}>
            <View style={styles.ringContainer}>
              {/* Animated Glow Ring */}
              <Animated.View 
                style={[
                  styles.glowRing,
                  {
                    transform: [{ rotate: ringRotation }],
                  }
                ]}
              >
                <LinearGradient
                  colors={['#DAA520', 'transparent', '#DAA520', 'transparent']}
                  style={styles.ringGradient}
                />
              </Animated.View>
              
              {/* Progress Ring */}
              <View style={styles.progressRing}>
                <View 
                  style={[
                    styles.progressArc,
                    { 
                      transform: [{ rotate: `${(progressPercentage / 100) * 360}deg` }] 
                    }
                  ]} 
                />
              </View>
              
              {/* Counter Content */}
              <View style={styles.counterContent}>
                <Text style={styles.dayLabel}>Day</Text>
                <Text style={styles.streakNumber}>{currentStreak}</Text>
                <Text style={styles.journeyText}>Sacred Journey</Text>
              </View>
            </View>
          </View>

          {/* Swipeable Daily Inspiration Card */}
          <View style={styles.inspirationSection}>
            <Text style={styles.inspirationTitle}>Daily Inspiration</Text>
            <View style={styles.inspirationCard}>
              <LinearGradient
                colors={['rgba(255, 255, 255, 0.9)', 'rgba(245, 245, 220, 0.8)']}
                style={styles.cardGradient}
              >
                <Text style={styles.inspirationText}>
                  "{inspirationalQuotes[currentQuoteIndex]}"
                </Text>
                <View style={styles.swipeIndicator}>
                  <TouchableOpacity 
                    onPress={() => handleQuoteSwipe('right')}
                    style={styles.swipeButton}
                  >
                    <Text style={styles.swipeArrow}>‹</Text>
                  </TouchableOpacity>
                  <View style={styles.quoteDots}>
                    {inspirationalQuotes.map((_, index) => (
                      <View 
                        key={index}
                        style={[
                          styles.dot,
                          index === currentQuoteIndex && styles.activeDot
                        ]} 
                      />
                    ))}
                  </View>
                  <TouchableOpacity 
                    onPress={() => handleQuoteSwipe('left')}
                    style={styles.swipeButton}
                  >
                    <Text style={styles.swipeArrow}>›</Text>
                  </TouchableOpacity>
                </View>
              </LinearGradient>
            </View>
          </View>

          {/* Enhanced Action Buttons */}
          <View style={styles.actionsSection}>
            {/* Check In Button with Golden Gradient */}
            <TouchableOpacity style={styles.checkInButton} onPress={onCheckInToday}>
              <LinearGradient
                colors={['#DAA520', '#B8860B', '#CD853F']}
                style={styles.checkInGradient}
              >
                <View style={styles.checkInContent}>
                  <Text style={styles.checkInIcon}>✓</Text>
                  <Text style={styles.checkInText}>Check In Today</Text>
                </View>
              </LinearGradient>
            </TouchableOpacity>

            {/* Subtle Panic Button with Crimson Glow */}
            <TouchableOpacity style={styles.panicButton} onPress={onPanicPress}>
              <LinearGradient
                colors={['#A0522D', '#CD5C5C', '#DC143C']}
                style={styles.panicGradient}
              >
                <View style={styles.panicContent}>
                  <Text style={styles.panicIcon}>🆘</Text>
                  <Text style={styles.panicText}>Emergency Support</Text>
                </View>
              </LinearGradient>
            </TouchableOpacity>
          </View>

          {/* Sacred Footer */}
          <View style={styles.footerSection}>
            <Text style={styles.footerText}>Your journey is sacred. Stay true.</Text>
          </View>
        </ScrollView>

        {/* Bottom Navigation Bar */}
        <View style={styles.bottomNavigation}>
          <LinearGradient
            colors={['rgba(139, 69, 19, 0.95)', 'rgba(160, 82, 45, 0.95)']}
            style={styles.navGradient}
          >
            {['Dashboard', 'Calendar', 'History', 'Motivation'].map((tab) => (
              <TouchableOpacity
                key={tab}
                style={[
                  styles.navTab,
                  activeTab === tab && styles.activeNavTab
                ]}
                onPress={() => handleTabPress(tab)}
              >
                <Text style={styles.navIcon}>
                  {tab === 'Dashboard' && '🏠'}
                  {tab === 'Calendar' && '📅'}
                  {tab === 'History' && '📚'}
                  {tab === 'Motivation' && '💭'}
                </Text>
                <Text style={[
                  styles.navLabel,
                  activeTab === tab && styles.activeNavLabel
                ]}>
                  {tab}
                </Text>
                {activeTab === tab && <View style={styles.activeIndicator} />}
              </TouchableOpacity>
            ))}
          </LinearGradient>
        </View>
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
  profileButton: {
    position: 'absolute',
    top: 60,
    right: 20,
    zIndex: 10,
    borderRadius: 25,
    overflow: 'hidden',
    shadowColor: '#8B4513',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  profileGradient: {
    width: 50,
    height: 50,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#F5DEB3',
  },
  profileIcon: {
    fontSize: 24,
    color: '#FFFFFF',
  },
  scrollContainer: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingTop: 120,
    paddingBottom: 100, // Space for bottom nav
  },
  
  // Glowing Streak Ring Styles
  streakSection: {
    alignItems: 'center',
    marginBottom: 40,
  },
  ringContainer: {
    position: 'relative',
    width: width * 0.65,
    height: width * 0.65,
    alignItems: 'center',
    justifyContent: 'center',
  },
  glowRing: {
    position: 'absolute',
    width: width * 0.65,
    height: width * 0.65,
    borderRadius: (width * 0.65) / 2,
  },
  ringGradient: {
    width: '100%',
    height: '100%',
    borderRadius: (width * 0.65) / 2,
    borderWidth: 3,
    borderColor: 'transparent',
  },
  progressRing: {
    position: 'absolute',
    width: width * 0.62,
    height: width * 0.62,
    borderRadius: (width * 0.62) / 2,
    borderWidth: 4,
    borderColor: 'rgba(218, 165, 32, 0.3)',
  },
  progressArc: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    borderRadius: (width * 0.62) / 2,
    borderWidth: 4,
    borderColor: '#DAA520',
    borderRightColor: 'transparent',
    borderBottomColor: 'transparent',
  },
  counterContent: {
    backgroundColor: 'rgba(245, 245, 220, 0.95)',
    borderRadius: (width * 0.5) / 2,
    width: width * 0.5,
    height: width * 0.5,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#DAA520',
    shadowColor: '#8B4513',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 10,
  },
  dayLabel: {
    fontSize: 18,
    fontFamily: 'serif',
    color: '#8B4513',
    fontWeight: '600',
    letterSpacing: 2,
  },
  streakNumber: {
    fontSize: 64,
    fontFamily: 'serif',
    fontWeight: '900',
    color: '#DAA520',
    textShadowColor: '#8B4513',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 4,
    lineHeight: 64,
  },
  journeyText: {
    fontSize: 14,
    fontFamily: 'serif',
    color: '#A0522D',
    fontStyle: 'italic',
    letterSpacing: 1,
  },
  
  // Swipeable Inspiration Card Styles
  inspirationSection: {
    marginBottom: 40,
  },
  inspirationTitle: {
    fontSize: 20,
    fontFamily: 'serif',
    color: '#8B4513',
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 16,
    letterSpacing: 1,
  },
  inspirationCard: {
    borderRadius: 20,
    overflow: 'hidden',
    marginHorizontal: 10,
    shadowColor: '#8B4513',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 8,
  },
  cardGradient: {
    paddingVertical: 28,
    paddingHorizontal: 24,
    borderWidth: 1,
    borderColor: 'rgba(218, 165, 32, 0.3)',
  },
  inspirationText: {
    fontSize: 20,
    fontFamily: 'serif',
    color: '#8B4513',
    lineHeight: 28,
    textAlign: 'center',
    fontStyle: 'italic',
    letterSpacing: 0.5,
    marginBottom: 20,
  },
  swipeIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  swipeButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: 'rgba(218, 165, 32, 0.2)',
  },
  swipeArrow: {
    fontSize: 24,
    color: '#DAA520',
    fontWeight: 'bold',
  },
  quoteDots: {
    flexDirection: 'row',
    gap: 6,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(218, 165, 32, 0.3)',
  },
  activeDot: {
    backgroundColor: '#DAA520',
  },
  
  // Enhanced Action Buttons Styles
  actionsSection: {
    gap: 16,
    marginBottom: 40,
  },
  checkInButton: {
    borderRadius: 20,
    overflow: 'hidden',
    shadowColor: '#DAA520',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 15,
    elevation: 12,
  },
  checkInGradient: {
    paddingVertical: 20,
    paddingHorizontal: 32,
    borderWidth: 2,
    borderColor: '#F5DEB3',
  },
  checkInContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
  },
  checkInIcon: {
    fontSize: 26,
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  checkInText: {
    fontSize: 22,
    fontFamily: 'serif',
    fontWeight: '700',
    color: '#FFFFFF',
    letterSpacing: 1,
    textShadowColor: '#8B4513',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  panicButton: {
    borderRadius: 20,
    overflow: 'hidden',
    shadowColor: '#DC143C',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 8,
  },
  panicGradient: {
    paddingVertical: 18,
    paddingHorizontal: 32,
    borderWidth: 1,
    borderColor: 'rgba(220, 20, 60, 0.3)',
  },
  panicContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },
  panicIcon: {
    fontSize: 22,
    color: '#FFFFFF',
  },
  panicText: {
    fontSize: 18,
    fontFamily: 'serif',
    fontWeight: '600',
    color: '#FFFFFF',
    letterSpacing: 0.5,
    textShadowColor: '#8B0000',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  
  // Sacred Footer
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

  // Bottom Navigation Styles
  bottomNavigation: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    overflow: 'hidden',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 15,
  },
  navGradient: {
    flexDirection: 'row',
    paddingTop: 12,
    paddingBottom: 20,
    paddingHorizontal: 8,
    borderTopWidth: 1,
    borderTopColor: 'rgba(245, 222, 179, 0.3)',
  },
  navTab: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 4,
    position: 'relative',
  },
  activeNavTab: {
    backgroundColor: 'rgba(218, 165, 32, 0.2)',
    borderRadius: 16,
  },
  navIcon: {
    fontSize: 20,
    marginBottom: 4,
  },
  navLabel: {
    fontSize: 11,
    fontFamily: 'serif',
    color: '#F5DEB3',
    fontWeight: '500',
    textAlign: 'center',
  },
  activeNavLabel: {
    color: '#DAA520',
    fontWeight: '700',
  },
  activeIndicator: {
    position: 'absolute',
    top: 0,
    width: 30,
    height: 3,
    backgroundColor: '#DAA520',
    borderRadius: 2,
  },
});