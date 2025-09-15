import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  ScrollView,
  Dimensions,
  Animated,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

interface Testimonial {
  day: number;
  quote: string;
  achievement: string;
}

interface FinalPushScreenProps {
  onCreateAccount: () => void;
  onLogin: () => void;
}

const TESTIMONIALS: Testimonial[] = [
  {
    day: 7,
    quote: "First week completed. I feel a new sense of clarity and purpose.",
    achievement: "Mental clarity returning"
  },
  {
    day: 30,
    quote: "One month strong! My confidence has skyrocketed and I'm more productive than ever.",
    achievement: "Confidence & productivity boost"
  },
  {
    day: 60,
    quote: "Two months in. My relationships are deeper and I have genuine energy for life.",
    achievement: "Better relationships & energy"
  },
  {
    day: 90,
    quote: "90 days of freedom! I've become the man I always knew I could be.",
    achievement: "Complete transformation"
  },
  {
    day: 100,
    quote: "Day 100: I've never felt more confident, alive, and in control of my destiny.",
    achievement: "Ultimate self-mastery"
  },
  {
    day: 365,
    quote: "One year later: This journey changed everything. I'm living my best life.",
    achievement: "Life mastery achieved"
  }
];

export default function FinalPushScreen({ onCreateAccount, onLogin }: FinalPushScreenProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [fadeAnim] = useState(new Animated.Value(1));
  const [slideAnim] = useState(new Animated.Value(0));

  useEffect(() => {
    const interval = setInterval(() => {
      // Fade out
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start(() => {
        // Change testimonial
        setCurrentIndex((prev) => (prev + 1) % TESTIMONIALS.length);
        // Fade in
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }).start();
      });
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    // Entrance animation
    Animated.timing(slideAnim, {
      toValue: 1,
      duration: 800,
      useNativeDriver: true,
    }).start();
  }, []);

  const currentTestimonial = TESTIMONIALS[currentIndex];

  return (
    <>
      <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent />
      <LinearGradient
        colors={['#faf0e6', '#f5deb3', '#deb887']}
        style={styles.container}
      >
        <SafeAreaView style={styles.safeArea}>
          <Animated.View 
            style={[
              styles.content,
              {
                opacity: slideAnim,
                transform: [{
                  translateY: slideAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [50, 0],
                  }),
                }],
              },
            ]}
          >
            {/* Header */}
            <View style={styles.header}>
              <View style={styles.celebrationContainer}>
                <Text style={styles.crossIcon}>✠</Text>
                <Text style={styles.readyTitle}>You're Ready</Text>
                <Text style={styles.crossIcon}>✠</Text>
              </View>
              <Text style={styles.subtitle}>
                Your sacred journey awaits. Preserve your progress with us.
              </Text>
            </View>

            {/* Testimonial Manuscript */}
            <View style={styles.testimonialContainer}>
              <Animated.View 
                style={[
                  styles.manuscriptCard,
                  { opacity: fadeAnim }
                ]}
              >
                <View style={styles.manuscriptHeader}>
                  <View style={styles.dayBadge}>
                    <Text style={styles.dayText}>Day {currentTestimonial.day}</Text>
                  </View>
                  <View style={styles.achievementContainer}>
                    <Text style={styles.achievementText}>{currentTestimonial.achievement}</Text>
                  </View>
                </View>
                
                <View style={styles.quoteContainer}>
                  <Text style={styles.quoteIcon}>"</Text>
                  <Text style={styles.quoteText}>{currentTestimonial.quote}</Text>
                  <Text style={styles.quoteIcon}>"</Text>
                </View>
                
                <View style={styles.authorContainer}>
                  <Text style={styles.authorText}>- A fellow warrior of faith</Text>
                </View>
              </Animated.View>

              {/* Progress Dots */}
              <View style={styles.dotsContainer}>
                {TESTIMONIALS.map((_, index) => (
                  <View
                    key={index}
                    style={[
                      styles.dot,
                      index === currentIndex && styles.activeDot,
                    ]}
                  />
                ))}
              </View>
            </View>

            {/* Account Creation Section */}
            <View style={styles.accountSection}>
              <Text style={styles.secureText}>Save your streaks and progress securely</Text>
              
              <View style={styles.buttonsContainer}>
                {/* Create Account Button */}
                <TouchableOpacity
                  style={styles.createAccountButton}
                  onPress={onCreateAccount}
                  activeOpacity={0.8}
                >
                  <View style={styles.woodenButtonContent}>
                    <Ionicons name="shield-checkmark" size={20} color="#f5f5dc" />
                    <Text style={styles.createAccountText}>Create Account</Text>
                  </View>
                </TouchableOpacity>

                {/* Login Button */}
                <TouchableOpacity
                  style={styles.loginButton}
                  onPress={onLogin}
                  activeOpacity={0.8}
                >
                  <View style={styles.loginButtonContent}>
                    <Ionicons name="log-in-outline" size={20} color="#5d4037" />
                    <Text style={styles.loginText}>Log In</Text>
                  </View>
                </TouchableOpacity>
              </View>
            </View>

            {/* Sacred Footer */}
            <View style={styles.footer}>
              <Text style={styles.footerText}>
                "Where your treasure is, there your heart will be also"
              </Text>
              <Text style={styles.footerVerse}>- Matthew 6:21</Text>
            </View>
          </Animated.View>
        </SafeAreaView>
      </LinearGradient>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    justifyContent: 'space-between',
  },
  header: {
    flex: 0.15,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 20,
  },
  celebrationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  crossIcon: {
    fontSize: 28,
    color: '#d4af37',
    marginHorizontal: 12,
  },
  readyTitle: {
    fontSize: 42,
    fontWeight: 'bold',
    color: '#3c2415',
    fontFamily: 'serif',
    textShadowColor: '#d4af37',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 4,
  },
  subtitle: {
    fontSize: 16,
    color: '#5d4037',
    textAlign: 'center',
    fontWeight: '500',
    fontStyle: 'italic',
  },
  testimonialContainer: {
    flex: 0.4,
    justifyContent: 'center',
    alignItems: 'center',
  },
  manuscriptCard: {
    backgroundColor: '#fdf5e6',
    borderRadius: 12,
    padding: 24,
    marginHorizontal: 16,
    marginBottom: 24,
    borderWidth: 3,
    borderColor: '#d4af37',
    shadowColor: '#8b4513',
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 10,
    minHeight: 180,
  },
  manuscriptHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  dayBadge: {
    backgroundColor: '#5d4037',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderWidth: 1,
    borderColor: '#d4af37',
  },
  dayText: {
    color: '#f5f5dc',
    fontSize: 12,
    fontWeight: 'bold',
  },
  achievementContainer: {
    flex: 1,
    alignItems: 'flex-end',
  },
  achievementText: {
    fontSize: 11,
    color: '#8d6e63',
    fontWeight: '600',
    fontStyle: 'italic',
  },
  quoteContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  quoteIcon: {
    fontSize: 24,
    color: '#d4af37',
    fontWeight: 'bold',
    lineHeight: 24,
  },
  quoteText: {
    flex: 1,
    fontSize: 16,
    color: '#3c2415',
    lineHeight: 24,
    textAlign: 'center',
    fontStyle: 'italic',
    marginHorizontal: 8,
    fontFamily: 'serif',
  },
  authorContainer: {
    alignItems: 'flex-end',
  },
  authorText: {
    fontSize: 14,
    color: '#8d6e63',
    fontWeight: '500',
    fontStyle: 'italic',
  },
  dotsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#d2b48c',
    marginHorizontal: 4,
  },
  activeDot: {
    backgroundColor: '#d4af37',
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  accountSection: {
    flex: 0.3,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 20,
  },
  secureText: {
    fontSize: 14,
    color: '#8d6e63',
    textAlign: 'center',
    marginBottom: 24,
    fontStyle: 'italic',
  },
  buttonsContainer: {
    width: '100%',
    gap: 16,
  },
  createAccountButton: {
    backgroundColor: '#5d4037',
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderWidth: 2,
    borderColor: '#d4af37',
    shadowColor: '#3c2415',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 8,
  },
  woodenButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  createAccountText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#f5f5dc',
    marginLeft: 8,
    letterSpacing: 0.5,
    textShadowColor: '#3c2415',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 1,
  },
  loginButton: {
    backgroundColor: 'transparent',
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderWidth: 2,
    borderColor: '#8d6e63',
  },
  loginButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  loginText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#5d4037',
    marginLeft: 8,
    letterSpacing: 0.5,
  },
  footer: {
    flex: 0.15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  footerText: {
    fontSize: 14,
    color: '#8d6e63',
    textAlign: 'center',
    fontStyle: 'italic',
    marginBottom: 4,
  },
  footerVerse: {
    fontSize: 12,
    color: '#a1887f',
    textAlign: 'center',
    fontWeight: '500',
  },
});