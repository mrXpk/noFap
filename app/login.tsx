import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import React, { useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import { Colors } from '../constants/theme';
import { useAuth } from '../contexts/AuthContext';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { signIn, markOnboardingComplete } = useAuth();

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Missing Information', 'Please fill in all fields.');
      return;
    }

    setIsLoading(true);
    
    const { error } = await signIn(email, password);
    
    setIsLoading(false);
    
    if (error) {
      Alert.alert(
        'Login Failed',
        error.message || 'Please check your credentials and try again.'
      );
      return;
    }

    // Mark onboarding as complete for returning users
    await markOnboardingComplete();
    
    // Success! Navigation will be handled by auth state change in index.tsx
    // Don't manually navigate here - let the auth context handle routing
  };

  const handleForgotPassword = () => {
    if (!email) {
      Alert.alert('Email Required', 'Please enter your email address first.');
      return;
    }
    
    // Implement password reset
    Alert.alert('Password Reset', 'Password reset functionality will be implemented soon.');
  };

  const handleBackToOnboarding = () => {
    router.back();
  };

  const handleGoToSignup = () => {
    router.push('/signup');
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
          <Text style={styles.title}>Welcome Back</Text>
          <Text style={styles.subtitle}>Continue Your Journey</Text>
          <Text style={styles.verse}>"Be strong and courageous!" - Joshua 1:9</Text>
        </View>

        {/* Login Form */}
        <View style={styles.formContainer}>
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
            <View style={styles.passwordContainer}>
              <TextInput
                style={styles.passwordInput}
                value={password}
                onChangeText={setPassword}
                placeholder="Enter your password"
                placeholderTextColor={Colors.sacred.bronze}
                secureTextEntry={!showPassword}
              />
              <TouchableOpacity 
                style={styles.eyeButton}
                onPress={() => setShowPassword(!showPassword)}
              >
                <Text style={styles.eyeIcon}>{showPassword ? '👁️' : '👁️‍🗨️'}</Text>
              </TouchableOpacity>
            </View>
          </View>

          <TouchableOpacity style={styles.forgotPassword} onPress={handleForgotPassword}>
            <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.loginButton, isLoading && styles.disabledButton]} 
            onPress={handleLogin}
            disabled={isLoading}
          >
            <LinearGradient
              colors={[Colors.sacred.darkWood, Colors.sacred.mediumWood]}
              style={styles.buttonGradient}
            >
              {isLoading ? (
                <ActivityIndicator color={Colors.sacred.goldLeaf} size="small" />
              ) : (
                <Text style={styles.loginButtonText}>✠ Log In ✠</Text>
              )}
            </LinearGradient>
          </TouchableOpacity>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>Don't have an account?</Text>
          <TouchableOpacity onPress={handleGoToSignup}>
            <Text style={styles.signupLink}>Create Account</Text>
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
    marginBottom: 40,
  },
  title: {
    fontSize: 32,
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
  passwordContainer: {
    position: 'relative',
  },
  passwordInput: {
    borderWidth: 1,
    borderColor: Colors.sacred.bronze,
    borderRadius: 8,
    padding: 12,
    paddingRight: 50,
    fontSize: 16,
    color: Colors.sacred.darkWood,
    backgroundColor: Colors.sacred.parchment,
  },
  eyeButton: {
    position: 'absolute',
    right: 12,
    top: 12,
    padding: 4,
  },
  eyeIcon: {
    fontSize: 18,
    color: Colors.sacred.bronze,
  },
  forgotPassword: {
    alignItems: 'flex-end',
    marginBottom: 24,
  },
  forgotPasswordText: {
    color: Colors.sacred.bronze,
    fontSize: 14,
    textDecorationLine: 'underline',
  },
  loginButton: {
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
  loginButtonText: {
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
  signupLink: {
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