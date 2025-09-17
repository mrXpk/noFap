import { LinearGradient } from 'expo-linear-gradient';
import React, { useEffect, useState } from 'react';
import {
  Dimensions,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';

interface MainDashboardProps {
  onCheckInToday: () => void;
  onPanicPress: () => void;
  onCalendarPress: () => void;
  onHistoryPress: () => void;
  onYourWhyPress: () => void;
}

const { width } = Dimensions.get('window');

export default function MainDashboard({
  onCheckInToday,
  onPanicPress,
  onCalendarPress,
  onHistoryPress,
  onYourWhyPress,
}: MainDashboardProps) {
  const [currentStreak, setCurrentStreak] = useState(0);
  const [dailyQuote, setDailyQuote] = useState('');

  const quotes = [
    "You are stronger than yesterday.",
    "Every day is a victory in your sacred journey.",
    "Discipline is the bridge between goals and accomplishment.",
    "Your strength comes from within, guided by divine purpose.",
    "Today you choose greatness over temptation."
  ];

  useEffect(() => {
    // TODO: Load actual streak data from storage
    // For now, using demo data
    setCurrentStreak(24);
    
    // Set daily quote (could be based on date for consistency)
    const today = new Date().getDate();
    setDailyQuote(quotes[today % quotes.length]);
  }, []);

  return (
    <LinearGradient
      colors={['#3c2415', '#5d4037', '#8d6e63']}
      style={styles.container}
    >
      {/* Parchment overlay */}
      <View style={styles.parchmentOverlay}>
        <ScrollView 
          contentContainerStyle={styles.scrollContainer}
          showsVerticalScrollIndicator={false}
        >
          {/* Sacred Streak Counter */}
          <View style={styles.streakSection}>
            <View style={styles.ornamentalFrame}>
              <LinearGradient
                colors={['#d4af37', '#b8860b', '#d4af37']}
                style={styles.frameGradient}
              >
                <View style={styles.streakContainer}>
                  <Text style={styles.streakLabel}>Day</Text>
                  <Text style={styles.streakNumber}>{currentStreak}</Text>
                  <Text style={styles.streakSubtitle}>Of Sacred Journey</Text>
                </View>
              </LinearGradient>
            </View>
          </View>

          {/* Daily Quote Card */}
          <View style={styles.quoteCard}>
            <View style={styles.parchmentCard}>
              <Text style={styles.quoteText}>"{dailyQuote}"</Text>
              <View style={styles.quillLine} />
            </View>
          </View>

          {/* Action Buttons */}
          <View style={styles.actionsSection}>
            {/* Check In Today Button */}
            <TouchableOpacity style={styles.checkInButton} onPress={onCheckInToday}>
              <LinearGradient
                colors={['#f5f5dc', '#deb887']}
                style={styles.checkInGradient}
              >
                <View style={styles.buttonContent}>
                  <Text style={styles.checkInIcon}>✓</Text>
                  <Text style={styles.checkInText}>Check In Today</Text>
                </View>
              </LinearGradient>
            </TouchableOpacity>

            {/* Panic Button */}
            <TouchableOpacity style={styles.panicButton} onPress={onPanicPress}>
              <LinearGradient
                colors={['#8b0000', '#dc143c', '#ff6b6b']}
                style={styles.panicGradient}
              >
                <View style={styles.panicContent}>
                  <Text style={styles.panicIcon}>🚨</Text>
                  <Text style={styles.panicText}>Panic Button</Text>
                </View>
              </LinearGradient>
            </TouchableOpacity>
          </View>

          {/* Navigation Section */}
          <View style={styles.navigationSection}>
            <Text style={styles.navigationTitle}>Explore Your Journey</Text>
            <View style={styles.navGrid}>
              <TouchableOpacity style={styles.navCard} onPress={onCalendarPress}>
                <View style={styles.navIconContainer}>
                  <Text style={styles.navIcon}>📅</Text>
                </View>
                <Text style={styles.navLabel}>Calendar</Text>
                <Text style={styles.navSubtext}>View your progress</Text>
              </TouchableOpacity>
              
              <TouchableOpacity style={styles.navCard} onPress={onHistoryPress}>
                <View style={styles.navIconContainer}>
                  <Text style={styles.navIcon}>📚</Text>
                </View>
                <Text style={styles.navLabel}>History</Text>
                <Text style={styles.navSubtext}>Track your journey</Text>
              </TouchableOpacity>
              
              <TouchableOpacity style={styles.navCard} onPress={onYourWhyPress}>
                <View style={styles.navIconContainer}>
                  <Text style={styles.navIcon}>💭</Text>
                </View>
                <Text style={styles.navLabel}>Your WHY</Text>
                <Text style={styles.navSubtext}>Remember your purpose</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Sacred Banner */}
          <View style={styles.sacredBanner}>
            <LinearGradient
              colors={['#3c2415', '#5d4037', '#3c2415']}
              style={styles.bannerGradient}
            >
              <Text style={styles.bannerText}>Your journey is sacred. Stay true.</Text>
            </LinearGradient>
          </View>
        </ScrollView>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  parchmentOverlay: {
    flex: 1,
    backgroundColor: 'rgba(245, 245, 220, 0.15)',
  },
  scrollContainer: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingTop: 80,
    paddingBottom: 40,
  },
  
  // Sacred Streak Counter Styles
  streakSection: {
    alignItems: 'center',
    marginBottom: 40,
  },
  ornamentalFrame: {
    padding: 6,
    borderRadius: 120,
  },
  frameGradient: {
    borderRadius: 120,
    padding: 3,
    shadowColor: '#d4af37',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6,
    shadowRadius: 15,
    elevation: 15,
  },
  streakContainer: {
    width: width * 0.6,
    height: width * 0.6,
    backgroundColor: '#faf0e6',
    borderRadius: 120,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#d4af37',
  },
  streakLabel: {
    fontSize: 18,
    fontFamily: 'serif',
    color: '#8b4513',
    fontWeight: '600',
    letterSpacing: 2,
  },
  streakNumber: {
    fontSize: 72,
    fontFamily: 'serif',
    fontWeight: 'bold',
    color: '#d4af37',
    textShadowColor: '#3c2415',
    textShadowOffset: { width: 3, height: 3 },
    textShadowRadius: 6,
    lineHeight: 72,
  },
  streakSubtitle: {
    fontSize: 14,
    fontFamily: 'serif',
    color: '#cd7f32',
    fontStyle: 'italic',
    letterSpacing: 1,
    marginTop: 4,
  },
  
  // Quote Card Styles
  quoteCard: {
    marginHorizontal: 20,
    marginBottom: 40,
  },
  parchmentCard: {
    backgroundColor: '#faf0e6',
    borderRadius: 12,
    padding: 24,
    borderWidth: 1,
    borderColor: '#deb887',
    shadowColor: '#3c2415',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 6,
    position: 'relative',
  },
  quoteText: {
    fontSize: 18,
    fontFamily: 'serif',
    color: '#3c2415',
    lineHeight: 26,
    textAlign: 'center',
    fontStyle: 'italic',
    letterSpacing: 0.5,
  },
  quillLine: {
    width: 60,
    height: 2,
    backgroundColor: '#cd7f32',
    alignSelf: 'center',
    marginTop: 16,
    borderRadius: 1,
  },
  
  // Action Buttons Styles
  actionsSection: {
    gap: 20,
    marginBottom: 40,
  },
  checkInButton: {
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#8b4513',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  checkInGradient: {
    paddingVertical: 18,
    paddingHorizontal: 32,
    borderWidth: 2,
    borderColor: '#d4af37',
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
  },
  checkInIcon: {
    fontSize: 24,
    color: '#228b22',
    fontWeight: 'bold',
  },
  checkInText: {
    fontSize: 20,
    fontFamily: 'serif',
    fontWeight: 'bold',
    color: '#3c2415',
    letterSpacing: 1,
  },
  
  panicButton: {
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#8b0000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 10,
  },
  panicGradient: {
    paddingVertical: 18,
    paddingHorizontal: 32,
  },
  panicContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
  },
  panicIcon: {
    fontSize: 24,
  },
  panicText: {
    fontSize: 20,
    fontFamily: 'serif',
    fontWeight: 'bold',
    color: '#ffffff',
    letterSpacing: 1,
    textShadowColor: '#000000',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  
  // Sacred Banner Styles
  sacredBanner: {
    borderRadius: 8,
    overflow: 'hidden',
    marginTop: 20,
  },
  bannerGradient: {
    paddingVertical: 16,
    paddingHorizontal: 24,
    alignItems: 'center',
  },
  bannerText: {
    fontSize: 16,
    fontFamily: 'serif',
    color: '#d4af37',
    fontWeight: '600',
    letterSpacing: 1.5,
    textAlign: 'center',
    textShadowColor: '#000000',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  
  // Navigation Section Styles
  navigationSection: {
    marginBottom: 30,
  },
  navigationTitle: {
    fontSize: 18,
    fontFamily: 'serif',
    color: '#d4af37',
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 20,
    letterSpacing: 1,
  },
  navGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    flexWrap: 'wrap',
    gap: 16,
  },
  navCard: {
    backgroundColor: 'rgba(245, 245, 220, 0.9)',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    width: (width - 80) / 3,
    minWidth: 90,
    borderWidth: 1,
    borderColor: '#deb887',
    shadowColor: '#3c2415',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  navIconContainer: {
    backgroundColor: '#f5f5dc',
    borderRadius: 20,
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#cd7f32',
  },
  navIcon: {
    fontSize: 20,
  },
  navLabel: {
    fontSize: 12,
    fontFamily: 'serif',
    color: '#3c2415',
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 2,
  },
  navSubtext: {
    fontSize: 10,
    fontFamily: 'serif',
    color: '#8b4513',
    textAlign: 'center',
    fontStyle: 'italic',
  },
});