import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  Dimensions,
  Animated,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

const { width, height } = Dimensions.get('window');

interface VisualizationScreenProps {
  onBegin: () => void;
}

export default function VisualizationScreen({ onBegin }: VisualizationScreenProps) {
  const [fadeAnim] = useState(new Animated.Value(0));
  const [scaleAnim] = useState(new Animated.Value(0.8));
  const [slideAnim] = useState(new Animated.Value(50));

  useEffect(() => {
    // Cinematic entrance animation
    Animated.sequence([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.parallel([
        Animated.timing(scaleAnim, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 800,
          useNativeDriver: true,
        }),
      ]),
    ]).start();
  }, []);

  return (
    <>
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
      <LinearGradient
        colors={['#ff6b35', '#f7931e', '#ffd700', '#87ceeb', '#4682b4']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.container}
      >
        <SafeAreaView style={styles.safeArea}>
          <Animated.View 
            style={[
              styles.content,
              {
                opacity: fadeAnim,
                transform: [{ translateY: slideAnim }],
              },
            ]}
          >
            {/* Header */}
            <View style={styles.header}>
              <Text style={styles.visionText}>Imagine yourself 90 days from now...</Text>
            </View>

            {/* Central Visualization */}
            <Animated.View 
              style={[
                styles.visualizationContainer,
                {
                  transform: [{ scale: scaleAnim }],
                },
              ]}
            >
              {/* Broken Chain Symbol */}
              <View style={styles.chainContainer}>
                <View style={styles.chainLeft}>
                  <Text style={styles.chainIcon}>⛓️</Text>
                </View>
                <View style={styles.breakEffect}>
                  <Text style={styles.sparkleIcon}>✨</Text>
                  <Text style={styles.sparkleIcon}>💥</Text>
                  <Text style={styles.sparkleIcon}>✨</Text>
                </View>
                <View style={styles.chainRight}>
                  <Text style={styles.chainIcon}>⛓️</Text>
                </View>
              </View>

              {/* Sunrise Symbol */}
              <View style={styles.sunriseContainer}>
                <View style={styles.sunGlow}>
                  <Text style={styles.sunIcon}>🌅</Text>
                </View>
                <View style={styles.raysContainer}>
                  <Text style={[styles.rayIcon, styles.ray1]}>✨</Text>
                  <Text style={[styles.rayIcon, styles.ray2]}>⭐</Text>
                  <Text style={[styles.rayIcon, styles.ray3]}>✨</Text>
                  <Text style={[styles.rayIcon, styles.ray4]}>⭐</Text>
                  <Text style={[styles.rayIcon, styles.ray5]}>✨</Text>
                </View>
              </View>

              {/* Freedom Symbol */}
              <View style={styles.freedomContainer}>
                <Text style={styles.eagleIcon}>🦅</Text>
                <Text style={styles.mountainIcon}>🏔️</Text>
              </View>
            </Animated.View>

            {/* Inspirational Text */}
            <View style={styles.inspirationContainer}>
              <Text style={styles.mainInspiration}>Stronger, disciplined, and free.</Text>
              <Text style={styles.subInspiration}>
                "The man who conquers himself is greater than he who conquers a thousand men in battle."
              </Text>
              <Text style={styles.attribution}>- Buddha</Text>
            </View>

            {/* Call to Action */}
            <View style={styles.ctaContainer}>
              <TouchableOpacity
                style={styles.beginButton}
                onPress={onBegin}
                activeOpacity={0.9}
              >
                <LinearGradient
                  colors={['#4682b4', '#1e40af', '#1e3a8a']}
                  style={styles.buttonGradient}
                >
                  <View style={styles.buttonContent}>
                    <Text style={styles.beginButtonText}>Let's Begin</Text>
                    <Ionicons name="arrow-forward" size={24} color="#ffffff" />
                  </View>
                </LinearGradient>
              </TouchableOpacity>
            </View>

            {/* Motivational Footer */}
            <View style={styles.footer}>
              <Text style={styles.footerText}>Your transformation starts now</Text>
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
    paddingHorizontal: 30,
    justifyContent: 'space-between',
  },
  header: {
    flex: 0.15,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 30,
  },
  visionText: {
    fontSize: 24,
    fontWeight: '600',
    color: '#ffffff',
    textAlign: 'center',
    textShadowColor: 'rgba(0,0,0,0.3)',
    textShadowOffset: { width: 1, height: 2 },
    textShadowRadius: 4,
    letterSpacing: 0.5,
  },
  visualizationContainer: {
    flex: 0.4,
    justifyContent: 'center',
    alignItems: 'center',
  },
  chainContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 30,
  },
  chainLeft: {
    transform: [{ rotate: '-15deg' }],
  },
  chainRight: {
    transform: [{ rotate: '15deg' }],
  },
  chainIcon: {
    fontSize: 32,
    opacity: 0.7,
  },
  breakEffect: {
    flexDirection: 'row',
    marginHorizontal: 20,
    alignItems: 'center',
  },
  sparkleIcon: {
    fontSize: 24,
    marginHorizontal: 5,
  },
  sunriseContainer: {
    position: 'relative',
    alignItems: 'center',
    marginVertical: 20,
  },
  sunGlow: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 60,
    padding: 20,
    shadowColor: '#ffd700',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 20,
    elevation: 10,
  },
  sunIcon: {
    fontSize: 80,
  },
  raysContainer: {
    position: 'absolute',
    width: 200,
    height: 200,
    justifyContent: 'center',
    alignItems: 'center',
  },
  rayIcon: {
    position: 'absolute',
    fontSize: 20,
  },
  ray1: {
    top: 20,
    left: 90,
  },
  ray2: {
    top: 40,
    right: 30,
  },
  ray3: {
    bottom: 40,
    left: 30,
  },
  ray4: {
    bottom: 20,
    right: 90,
  },
  ray5: {
    left: 20,
    top: 90,
  },
  freedomContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 30,
  },
  eagleIcon: {
    fontSize: 48,
    marginRight: 20,
  },
  mountainIcon: {
    fontSize: 48,
  },
  inspirationContainer: {
    flex: 0.25,
    justifyContent: 'center',
    alignItems: 'center',
  },
  mainInspiration: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#ffffff',
    textAlign: 'center',
    marginBottom: 20,
    textShadowColor: 'rgba(0,0,0,0.4)',
    textShadowOffset: { width: 2, height: 3 },
    textShadowRadius: 6,
    letterSpacing: 1,
  },
  subInspiration: {
    fontSize: 16,
    color: '#ffffff',
    textAlign: 'center',
    lineHeight: 24,
    fontStyle: 'italic',
    marginBottom: 8,
    textShadowColor: 'rgba(0,0,0,0.3)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  attribution: {
    fontSize: 14,
    color: '#e6f3ff',
    textAlign: 'center',
    fontWeight: '500',
  },
  ctaContainer: {
    flex: 0.15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  beginButton: {
    borderRadius: 30,
    overflow: 'hidden',
    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 12,
  },
  buttonGradient: {
    paddingVertical: 18,
    paddingHorizontal: 60,
    borderRadius: 30,
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  beginButtonText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ffffff',
    marginRight: 12,
    letterSpacing: 1,
    textShadowColor: 'rgba(0,0,0,0.2)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  footer: {
    flex: 0.05,
    justifyContent: 'center',
    alignItems: 'center',
  },
  footerText: {
    fontSize: 14,
    color: '#e6f3ff',
    textAlign: 'center',
    fontWeight: '500',
    opacity: 0.9,
  },
});