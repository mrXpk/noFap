import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import React from 'react';
import {
  Dimensions,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const { width, height } = Dimensions.get('window');

interface WelcomeScreenProps {
  onReady: () => void;
}

export default function WelcomeScreen({ onReady }: WelcomeScreenProps) {
  return (
    <>
      <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent />
      <LinearGradient
        colors={['#faf0e6', '#f5deb3', '#deb887']}
        style={styles.container}
      >
        <SafeAreaView style={styles.safeArea}>
          {/* Main Content */}
          <View style={styles.content}>
            {/* Header Section */}
            <View style={styles.headerSection}>
              <Text style={styles.mainTitle}>Welcome to NoFap</Text>
              <Text style={styles.subtitle}>A Sacred Journey of Discipline & Freedom</Text>
              <Text style={styles.bibleVerse}>"He who conquers himself is the mightiest warrior"</Text>
            </View>

            {/* Illustration Section */}
            <View style={styles.illustrationSection}>
              {/* Sacred symbols illustration */}
              <View style={styles.sunriseContainer}>
                <View style={styles.sacredSymbols}>
                  <Text style={styles.crossIcon}>✠</Text>
                  <Text style={[styles.starIcon, styles.star1]}>✦</Text>
                  <Text style={[styles.starIcon, styles.star2]}>✦</Text>
                </View>
                <View style={styles.sun}>
                  <Text style={styles.sunIcon}>☀️</Text>
                </View>
                <View style={styles.rays}>
                  <Text style={styles.rayIcon}>✧</Text>
                  <Text style={[styles.rayIcon, styles.ray2]}>✧</Text>
                  <Text style={[styles.rayIcon, styles.ray3]}>✧</Text>
                </View>
                <Text style={styles.sacredText}>"Be strong and courageous"</Text>
              </View>
            </View>

            {/* Bottom Section */}
            <View style={styles.bottomSection}>
              <TouchableOpacity
                style={styles.readyButton}
                onPress={onReady}
                activeOpacity={0.8}
              >
                <Text style={styles.buttonText}>I'm Ready</Text>
              </TouchableOpacity>
              
              {/* Temporary Dashboard Test Button */}
              <TouchableOpacity
                style={[styles.readyButton, { backgroundColor: '#cd7f32', marginTop: 16 }]}
                onPress={() => router.push('/dashboard')}
                activeOpacity={0.8}
              >
                <Text style={styles.buttonText}>🏠 Test Dashboard</Text>
              </TouchableOpacity>
              
              {/* Temporary Get Premium Test Button */}
              <TouchableOpacity
                style={[styles.readyButton, { backgroundColor: '#d4af37', marginTop: 8 }]}
                onPress={() => router.push('/get-premium')}
                activeOpacity={0.8}
              >
                <Text style={styles.buttonText}>💎 Test Get Premium</Text>
              </TouchableOpacity>
            </View>
          </View>
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
  headerSection: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 60,
  },
  mainTitle: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#3c2415',
    textAlign: 'center',
    marginBottom: 16,
    letterSpacing: 1,
    textShadowColor: '#d4af37',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  subtitle: {
    fontSize: 18,
    color: '#5d4037',
    textAlign: 'center',
    fontWeight: '500',
    lineHeight: 26,
    marginBottom: 8,
  },
  bibleVerse: {
    fontSize: 14,
    color: '#8d6e63',
    textAlign: 'center',
    fontStyle: 'italic',
    marginTop: 12,
    paddingHorizontal: 20,
  },
  illustrationSection: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sunriseContainer: {
    width: 200,
    height: 150,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  sacredSymbols: {
    position: 'absolute',
    top: 10,
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: 20,
  },
  crossIcon: {
    fontSize: 24,
    color: '#d4af37',
    opacity: 0.8,
  },
  starIcon: {
    fontSize: 16,
    color: '#b8860b',
    opacity: 0.7,
  },
  star1: {
    transform: [{ rotate: '15deg' }],
  },
  star2: {
    transform: [{ rotate: '-15deg' }],
  },
  clouds: {
    position: 'absolute',
    top: 20,
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
  },
  cloudIcon: {
    fontSize: 32,
    opacity: 0.7,
  },
  cloudRight: {
    transform: [{ scaleX: -1 }],
  },
  sun: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
  sunIcon: {
    fontSize: 64,
    color: '#ffa500',
  },
  rays: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  rayIcon: {
    fontSize: 16,
    position: 'absolute',
    color: '#d4af37',
  },
  ray2: {
    top: 40,
    left: 40,
  },
  ray3: {
    top: 40,
    right: 40,
  },
  sacredText: {
    position: 'absolute',
    bottom: -20,
    fontSize: 12,
    color: '#8d6e63',
    fontStyle: 'italic',
    textAlign: 'center',
  },
  bottomSection: {
    flex: 0.3,
    justifyContent: 'flex-end',
    paddingBottom: 40,
  },
  readyButton: {
    backgroundColor: '#5d4037',
    paddingVertical: 18,
    paddingHorizontal: 60,
    borderRadius: 12,
    alignItems: 'center',
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
  buttonText: {
    color: '#f5f5dc',
    fontSize: 20,
    fontWeight: 'bold',
    letterSpacing: 0.5,
    textShadowColor: '#3c2415',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 1,
  },
});