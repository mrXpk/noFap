import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import ProtectedRoute from '../components/ProtectedRoute';

export default function SacredPathPage() {
  return (
    <ProtectedRoute>
      <LinearGradient
        colors={['#F5DEB3', '#DEB887', '#CD853F']}
        style={styles.container}
      >
        <View style={styles.content}>
          <Text style={styles.title}>🛡️ Sacred Path</Text>
          <Text style={styles.subtitle}>Your Journey of Transformation</Text>
          <Text style={styles.placeholder}>
            🏆 Milestones & Rewards Screen{'\n'}
            Coming Soon...
          </Text>
        </View>
      </LinearGradient>
    </ProtectedRoute>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 32,
    fontFamily: 'serif',
    fontWeight: 'bold',
    color: '#8B4513',
    marginBottom: 16,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 18,
    fontFamily: 'serif',
    color: '#A0522D',
    marginBottom: 32,
    textAlign: 'center',
    fontStyle: 'italic',
  },
  placeholder: {
    fontSize: 16,
    fontFamily: 'serif',
    color: '#8B4513',
    textAlign: 'center',
    lineHeight: 24,
  },
});