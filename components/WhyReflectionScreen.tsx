import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useState } from 'react';
import {
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import ProgressIndicator from './ProgressIndicator';

interface WhyReflectionScreenProps {
  onSaveWhy: (whyText: string) => void;
}

export default function WhyReflectionScreen({ onSaveWhy }: WhyReflectionScreenProps) {
  const [whyText, setWhyText] = useState('');

  const handleSave = () => {
    if (whyText.trim()) {
      onSaveWhy(whyText.trim());
    }
  };

  return (
    <>
      <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent />
      <LinearGradient
        colors={['#faf0e6', '#f5f5dc', '#fff8dc']}
        style={styles.container}
      >
        <SafeAreaView style={styles.safeArea}>
          <KeyboardAvoidingView 
            style={styles.keyboardAvoid}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          >
            <ScrollView 
              style={styles.content} 
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.scrollContent}
            >
              {/* Progress Indicator */}
              <ProgressIndicator currentStep={3} totalSteps={3} style={styles.progress} />

              {/* Header */}
              <View style={styles.header}>
                <Text style={styles.title}>Write down your WHY</Text>
                <Text style={styles.subtitle}>
                  This will appear whenever you need motivation
                </Text>
                <View style={styles.quoteContainer}>
                  <Ionicons name="book-outline" size={20} color="#8d6e63" />
                  <Text style={styles.bibleQuote}>
                    "Write the vision and make it plain" - Habakkuk 2:2
                  </Text>
                </View>
              </View>

              {/* Journal Input */}
              <View style={styles.journalContainer}>
                <View style={styles.journalPage}>
                  {/* Paper lines effect */}
                  <View style={styles.paperLines}>
                    {Array.from({ length: 15 }).map((_, index) => (
                      <View key={index} style={styles.paperLine} />
                    ))}
                  </View>
                  
                  {/* Left margin line */}
                  <View style={styles.marginLine} />
                  
                  {/* Text Input */}
                  <TextInput
                    style={styles.journalInput}
                    placeholder="I want to quit because..."
                    placeholderTextColor="#a1887f"
                    value={whyText}
                    onChangeText={setWhyText}
                    multiline
                    textAlignVertical="top"
                    maxLength={500}
                    autoFocus
                  />
                </View>
                
                {/* Character counter */}
                <View style={styles.counterContainer}>
                  <Text style={styles.characterCounter}>
                    {whyText.length}/500
                  </Text>
                </View>
              </View>

              {/* Motivational Note */}
              <View style={styles.motivationContainer}>
                <View style={styles.motivationCard}>
                  <Ionicons name="heart" size={16} color="#d4af37" />
                  <Text style={styles.motivationText}>
                    Your "why" will be your anchor in difficult moments. Be honest and heartfelt.
                  </Text>
                </View>
              </View>

              {/* Save Button */}
              <View style={styles.buttonContainer}>
                <TouchableOpacity
                  style={[
                    styles.saveButton,
                    !whyText.trim() && styles.saveButtonDisabled,
                  ]}
                  onPress={handleSave}
                  disabled={!whyText.trim()}
                  activeOpacity={0.8}
                >
                  <View style={styles.buttonContent}>
                    <Ionicons 
                      name="bookmark" 
                      size={20} 
                      color={whyText.trim() ? '#f5f5dc' : '#d2b48c'} 
                      style={styles.buttonIcon}
                    />
                    <Text style={[
                      styles.saveButtonText,
                      !whyText.trim() && styles.saveButtonTextDisabled,
                    ]}>
                      Save My Why
                    </Text>
                  </View>
                </TouchableOpacity>
              </View>
            </ScrollView>
          </KeyboardAvoidingView>
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
  keyboardAvoid: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 20,
  },
  progress: {
    marginTop: 20,
  },
  header: {
    alignItems: 'center',
    marginBottom: 30,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#3c2415',
    textAlign: 'center',
    marginBottom: 12,
    textShadowColor: '#d4af37',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  subtitle: {
    fontSize: 16,
    color: '#5d4037',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 16,
    paddingHorizontal: 20,
  },
  quoteContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  bibleQuote: {
    fontSize: 12,
    color: '#8d6e63',
    fontStyle: 'italic',
    marginLeft: 8,
  },
  journalContainer: {
    flex: 1,
    marginBottom: 20,
  },
  journalPage: {
    backgroundColor: '#fdf5e6',
    borderRadius: 12,
    padding: 20,
    minHeight: 280,
    borderWidth: 2,
    borderColor: '#d4af37',
    position: 'relative',
    shadowColor: '#8b4513',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 6,
  },
  paperLines: {
    position: 'absolute',
    top: 20,
    left: 20,
    right: 20,
    bottom: 20,
    zIndex: 0,
  },
  paperLine: {
    height: 1,
    backgroundColor: '#e6ddd4',
    marginBottom: 23,
    opacity: 0.6,
  },
  marginLine: {
    position: 'absolute',
    left: 50,
    top: 20,
    bottom: 20,
    width: 1,
    backgroundColor: '#d4af37',
    opacity: 0.4,
    zIndex: 0,
  },
  journalInput: {
    flex: 1,
    fontSize: 16,
    color: '#3c2415',
    lineHeight: 24,
    paddingLeft: 40,
    paddingTop: 0,
    fontFamily: Platform.OS === 'ios' ? 'Georgia' : 'serif',
    zIndex: 1,
  },
  counterContainer: {
    alignItems: 'flex-end',
    marginTop: 8,
  },
  characterCounter: {
    fontSize: 12,
    color: '#8d6e63',
  },
  motivationContainer: {
    marginBottom: 30,
  },
  motivationCard: {
    backgroundColor: 'rgba(212, 175, 55, 0.1)',
    borderRadius: 8,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'flex-start',
    borderLeftWidth: 4,
    borderLeftColor: '#d4af37',
  },
  motivationText: {
    fontSize: 14,
    color: '#5d4037',
    lineHeight: 20,
    marginLeft: 12,
    flex: 1,
    fontStyle: 'italic',
  },
  buttonContainer: {
    paddingBottom: 10,
  },
  saveButton: {
    backgroundColor: '#5d4037',
    paddingVertical: 16,
    paddingHorizontal: 40,
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
    elevation: 6,
  },
  saveButtonDisabled: {
    backgroundColor: '#a1887f',
    borderColor: '#8d6e63',
    shadowOpacity: 0.1,
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  buttonIcon: {
    marginRight: 8,
  },
  saveButtonText: {
    color: '#f5f5dc',
    fontSize: 18,
    fontWeight: 'bold',
    letterSpacing: 0.5,
    textShadowColor: '#3c2415',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 1,
  },
  saveButtonTextDisabled: {
    color: '#d2b48c',
  },
});