import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors } from '../constants/theme';

interface MainDashboardProps {
  onSignToday: () => void;
  onPanicPress: () => void;
  onCalendarPress: () => void;
  onHistoryPress: () => void;
  onYourWhyPress: () => void;
}

const { width } = Dimensions.get('window');

export default function MainDashboard({
  onSignToday,
  onPanicPress,
  onCalendarPress,
  onHistoryPress,
  onYourWhyPress,
}: MainDashboardProps) {
  const [currentStreak, setCurrentStreak] = useState(0);

  useEffect(() => {
    // TODO: Load actual streak data from storage
    // For now, using demo data
    setCurrentStreak(15);
  }, []);

  return (
    <LinearGradient
      colors={[Colors.sacred.parchment, Colors.sacred.lightWood]}
      style={styles.container}
    >
      <ScrollView 
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* Header Section */}
        <View style={styles.header}>
          <View style={styles.streakContainer}>
            <Text style={styles.streakNumber}>Day {currentStreak}</Text>
            <Text style={styles.streakSubtitle}>Your journey so far</Text>
          </View>
        </View>

        {/* Main Content Area */}
        <View style={styles.mainContent}>
          {/* Sign Today Button - Placeholder for now */}
          <TouchableOpacity style={styles.signTodayButton} onPress={onSignToday}>
            <LinearGradient
              colors={[Colors.sacred.darkWood, Colors.sacred.mediumWood]}
              style={styles.signTodayGradient}
            >
              <Text style={styles.signTodayText}>✠ Sign Today ✠</Text>
            </LinearGradient>
          </TouchableOpacity>

          {/* Motivational Message */}
          <View style={styles.messageContainer}>
            <Text style={styles.messageText}>
              "Be strong and courageous! Do not be afraid or discouraged, 
              for the Lord your God is with you wherever you go."
            </Text>
            <Text style={styles.verseReference}>- Joshua 1:9</Text>
          </View>
        </View>

        {/* Bottom Navigation Placeholder */}
        <View style={styles.bottomNavigation}>
          <TouchableOpacity style={styles.navButton} onPress={onCalendarPress}>
            <Text style={styles.navButtonText}>📅</Text>
            <Text style={styles.navButtonLabel}>Calendar</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.navButton} onPress={onHistoryPress}>
            <Text style={styles.navButtonText}>📚</Text>
            <Text style={styles.navButtonLabel}>History</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.navButton} onPress={onYourWhyPress}>
            <Text style={styles.navButtonText}>💭</Text>
            <Text style={styles.navButtonLabel}>Your WHY</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Panic Button - Floating */}
      <TouchableOpacity style={styles.panicButton} onPress={onPanicPress}>
        <LinearGradient
          colors={['#8b0000', '#dc143c']}
          style={styles.panicButtonGradient}
        >
          <Text style={styles.panicButtonText}>🚨</Text>
        </LinearGradient>
      </TouchableOpacity>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 100,
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  streakContainer: {
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 20,
    padding: 24,
    borderWidth: 3,
    borderColor: Colors.sacred.goldLeaf,
    shadowColor: Colors.sacred.darkWood,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 10,
  },
  streakNumber: {
    fontSize: 48,
    fontWeight: 'bold',
    color: Colors.sacred.goldLeaf,
    fontFamily: 'serif',
    textShadowColor: Colors.sacred.darkWood,
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 4,
  },
  streakSubtitle: {
    fontSize: 18,
    color: Colors.sacred.bronze,
    fontFamily: 'serif',
    fontStyle: 'italic',
    marginTop: 8,
  },
  mainContent: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  signTodayButton: {
    width: width * 0.8,
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 32,
    shadowColor: Colors.sacred.darkWood,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 10,
  },
  signTodayGradient: {
    paddingVertical: 20,
    paddingHorizontal: 32,
    alignItems: 'center',
  },
  signTodayText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.sacred.goldLeaf,
    fontFamily: 'serif',
    textShadowColor: '#000000',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  messageContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    borderRadius: 12,
    padding: 20,
    marginHorizontal: 16,
    borderLeftWidth: 4,
    borderLeftColor: Colors.sacred.goldLeaf,
  },
  messageText: {
    fontSize: 16,
    color: Colors.sacred.darkWood,
    fontStyle: 'italic',
    lineHeight: 24,
    textAlign: 'center',
    marginBottom: 8,
  },
  verseReference: {
    fontSize: 14,
    color: Colors.sacred.bronze,
    fontWeight: '600',
    textAlign: 'center',
  },
  bottomNavigation: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 16,
    marginTop: 32,
    borderWidth: 2,
    borderColor: Colors.sacred.bronze,
  },
  navButton: {
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  navButtonText: {
    fontSize: 24,
    marginBottom: 4,
  },
  navButtonLabel: {
    fontSize: 12,
    color: Colors.sacred.darkWood,
    fontWeight: '600',
    fontFamily: 'serif',
  },
  panicButton: {
    position: 'absolute',
    bottom: 30,
    right: 20,
    borderRadius: 35,
    overflow: 'hidden',
    shadowColor: '#dc143c',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.6,
    shadowRadius: 8,
    elevation: 12,
  },
  panicButtonGradient: {
    width: 70,
    height: 70,
    borderRadius: 35,
    alignItems: 'center',
    justifyContent: 'center',
  },
  panicButtonText: {
    fontSize: 28,
  },
});