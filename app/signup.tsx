import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import React, { useState } from 'react';
import {
    Alert,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
    ActivityIndicator,
} from 'react-native';
import { Colors } from '../constants/theme';
import { useAuth } from '../contexts/AuthContext';

export default function SignupScreen() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { signUp } = useAuth();

  const handleSignup = async () => {
    if (!name || !email || !password || !confirmPassword) {
      Alert.alert('Missing Information', 'Please fill in all fields.');
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert('Password Mismatch', 'Passwords do not match.');
      return;
    }

    if (password.length < 6) {
      Alert.alert('Weak Password', 'Password must be at least 6 characters long.');
      return;
    }

    setIsLoading(true);
    
    const { error } = await signUp(email, password, name);
    
    setIsLoading(false);
    
    if (error) {
      Alert.alert(
        'Signup Failed',
        error.message || 'Unable to create account. Please try again.'
      );
      return;
    }

    Alert.alert(
      'Account Created Successfully!',
      'Welcome to your transformation journey!\n\nPlease check your email to verify your account.',
      [
        {
          text: 'Continue',
          onPress: () => {
            router.replace('/dashboard');
          },
        },
      ]
    );
  };

  const handleBackToOnboarding = () => {
    router.back();
  };

  const handleGoToLogin = () => {
    router.push('/login');
  };

  return (
    <LinearGradient
      colors={[Colors.sacred.parchment, Colors.sacred.lightWood]}
      style={styles.container}
    >
      <ScrollView 
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Create Your Account</Text>
          <Text style={styles.subtitle}>Lock In Your Commitment</Text>
          <Text style={styles.verse}>"I can do all things through Christ" - Philippians 4:13</Text>
        </View>

        {/* Signup Form */}
        <View style={styles.formContainer}>
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Full Name</Text>
            <TextInput
              style={styles.input}
              value={name}
              onChangeText={setName}
              placeholder="Enter your full name"
              placeholderTextColor={Colors.sacred.bronze}
              autoCapitalize="words"
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Email Address</Text>
            <TextInput
              style={styles.input}
              value={email}
              onChangeText={setEmail}
              placeholder="Enter your email"
              placeholderTextColor={Colors.sacred.bronze}
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Password</Text>
            <TextInput
              style={styles.input}
              value={password}
              onChangeText={setPassword}
              placeholder="Create a strong password"
              placeholderTextColor={Colors.sacred.bronze}
              secureTextEntry
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Confirm Password</Text>
            <TextInput
              style={styles.input}
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              placeholder="Confirm your password"
              placeholderTextColor={Colors.sacred.bronze}
              secureTextEntry
            />
          </View>

          <View style={styles.agreementContainer}>
            <Text style={styles.agreementText}>
              By creating an account, your commitment agreement, personal reflections, 
              and progress will be saved securely. You can access them anytime to 
              stay motivated on your journey.
            </Text>
          </View>

          <TouchableOpacity 
            style={[styles.signupButton, isLoading && styles.disabledButton]} 
            onPress={handleSignup}
            disabled={isLoading}
          >
            <LinearGradient
              colors={[Colors.sacred.darkWood, Colors.sacred.mediumWood]}
              style={styles.buttonGradient}
            >
              {isLoading ? (
                <ActivityIndicator color={Colors.sacred.goldLeaf} size="small" />
              ) : (
                <Text style={styles.signupButtonText}>✠ Create Account ✠</Text>
              )}
            </LinearGradient>
          </TouchableOpacity>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>Already have an account?</Text>
          <TouchableOpacity onPress={handleGoToLogin}>
            <Text style={styles.loginLink}>Log In</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.backButton} onPress={handleBackToOnboarding}>
          <Text style={styles.backButtonText}>← Back to Onboarding</Text>
        </TouchableOpacity>
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 24,
  },
  header: {
    alignItems: 'center',
    marginBottom: 32,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: Colors.sacred.darkWood,
    fontFamily: 'serif',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 18,
    color: Colors.sacred.bronze,
    fontFamily: 'serif',
    textAlign: 'center',
    marginBottom: 16,
  },
  verse: {
    fontSize: 14,
    color: Colors.sacred.bronze,
    fontStyle: 'italic',
    textAlign: 'center',
  },
  formContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 12,
    padding: 24,
    marginBottom: 24,
    borderWidth: 2,
    borderColor: Colors.sacred.goldLeaf,
    shadowColor: Colors.sacred.darkWood,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.sacred.darkWood,
    marginBottom: 8,
    fontFamily: 'serif',
  },
  input: {
    borderWidth: 1,
    borderColor: Colors.sacred.bronze,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: Colors.sacred.darkWood,
    backgroundColor: Colors.sacred.parchment,
  },
  agreementContainer: {
    backgroundColor: Colors.sacred.lightWood,
    borderRadius: 8,
    padding: 16,
    marginBottom: 24,
    borderLeftWidth: 4,
    borderLeftColor: Colors.sacred.goldLeaf,
  },
  agreementText: {
    fontSize: 14,
    color: Colors.sacred.darkWood,
    lineHeight: 20,
    fontStyle: 'italic',
  },
  signupButton: {
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 16,
  },
  disabledButton: {
    opacity: 0.6,
  },
  buttonGradient: {
    paddingVertical: 16,
    paddingHorizontal: 24,
    alignItems: 'center',
  },
  signupButtonText: {
    color: Colors.sacred.goldLeaf,
    fontSize: 18,
    fontWeight: 'bold',
    fontFamily: 'serif',
  },
  footer: {
    alignItems: 'center',
    marginBottom: 24,
  },
  footerText: {
    color: Colors.sacred.bronze,
    fontSize: 16,
    marginBottom: 8,
  },
  loginLink: {
    color: Colors.sacred.darkWood,
    fontSize: 16,
    fontWeight: 'bold',
    textDecorationLine: 'underline',
  },
  backButton: {
    alignItems: 'center',
    padding: 12,
  },
  backButtonText: {
    color: Colors.sacred.bronze,
    fontSize: 16,
  },
});