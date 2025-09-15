import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useState } from 'react';
import {
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import ProgressIndicator from './ProgressIndicator';

interface QuizOption {
  id: string;
  title: string;
  icon: keyof typeof Ionicons.glyphMap;
  description: string;
}

interface QuizStruggleScreenProps {
  onNext: (selectedOptions: string[]) => void;
}

const STRUGGLE_OPTIONS: QuizOption[] = [
  {
    id: 'nighttime',
    title: 'Nighttime Urges',
    icon: 'moon-outline',
    description: 'Late hours when willpower is weakest',
  },
  {
    id: 'anxiety',
    title: 'Stress & Anxiety',
    icon: 'cloud-outline',
    description: 'Using it as an escape from pressure',
  },
  {
    id: 'boredom',
    title: 'Boredom & Idle Time',
    icon: 'book-outline',
    description: 'Nothing meaningful to occupy the mind',
  },
  {
    id: 'loneliness',
    title: 'Loneliness',
    icon: 'heart-dislike-outline',
    description: 'Seeking connection and comfort',
  },
  {
    id: 'discipline',
    title: 'Lack of Self-Control',
    icon: 'time-outline',
    description: 'Difficulty maintaining long-term goals',
  },
];

export default function QuizStruggleScreen({ onNext }: QuizStruggleScreenProps) {
  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);

  const handleOptionSelect = (optionId: string) => {
    if (selectedOptions.includes(optionId)) {
      // Remove if already selected
      setSelectedOptions(selectedOptions.filter(id => id !== optionId));
    } else {
      // Add to selection
      setSelectedOptions([...selectedOptions, optionId]);
    }
  };

  const handleNext = () => {
    if (selectedOptions.length > 0) {
      onNext(selectedOptions);
    }
  };

  return (
    <>
      <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent />
      <LinearGradient
        colors={['#f5deb3', '#deb887', '#d2b48c']}
        style={styles.container}
      >
        <SafeAreaView style={styles.safeArea}>
          <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
            {/* Progress Indicator */}
            <ProgressIndicator currentStep={2} totalSteps={3} style={styles.progress} />

            {/* Header */}
            <View style={styles.header}>
              <Text style={styles.title}>What's your biggest struggle?</Text>
              <Text style={styles.subtitle}>Understanding your challenges helps us provide better support</Text>
              <Text style={styles.subtitle}>Select all that apply</Text>
            </View>

            {/* Options */}
            <View style={styles.optionsContainer}>
              {STRUGGLE_OPTIONS.map((option) => {
                const isSelected = selectedOptions.includes(option.id);
                return (
                  <TouchableOpacity
                    key={option.id}
                    style={[
                      styles.optionCard,
                      isSelected && styles.optionCardSelected,
                    ]}
                    onPress={() => handleOptionSelect(option.id)}
                    activeOpacity={0.8}
                  >
                    <View style={styles.optionContent}>
                      <View style={[
                        styles.iconContainer,
                        isSelected && styles.iconContainerSelected,
                      ]}>
                        <Ionicons
                          name={option.icon}
                          size={32}
                          color={isSelected ? '#f5f5dc' : '#8d6e63'}
                        />
                      </View>
                      <View style={styles.textContainer}>
                        <Text style={[
                          styles.optionTitle,
                          isSelected && styles.optionTitleSelected,
                        ]}>
                          {option.title}
                        </Text>
                        <Text style={[
                          styles.optionDescription,
                          isSelected && styles.optionDescriptionSelected,
                        ]}>
                          {option.description}
                        </Text>
                      </View>
                      <View style={styles.checkContainer}>
                        {isSelected && (
                          <Ionicons name="checkmark-circle" size={24} color="#d4af37" />
                        )}
                      </View>
                    </View>
                  </TouchableOpacity>
                );
              })}
            </View>

            {/* Next Button */}
            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={[
                  styles.nextButton,
                  selectedOptions.length === 0 && styles.nextButtonDisabled,
                ]}
                onPress={handleNext}
                disabled={selectedOptions.length === 0}
                activeOpacity={0.8}
              >
                <Text style={[
                  styles.nextButtonText,
                  selectedOptions.length === 0 && styles.nextButtonTextDisabled,
                ]}>
                  Next {selectedOptions.length > 0 && `(${selectedOptions.length} selected)`}
                </Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
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
  },
  progress: {
    marginTop: 20,
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  title: {
    fontSize: 28,
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
    paddingHorizontal: 20,
  },
  optionsContainer: {
    marginBottom: 40,
  },
  optionCard: {
    backgroundColor: '#fdf5e6',
    borderRadius: 16,
    borderWidth: 2,
    borderColor: '#e6ddd4',
    marginBottom: 16,
    shadowColor: '#8b4513',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 4,
  },
  optionCardSelected: {
    borderColor: '#b8860b',
    backgroundColor: '#6d4c41',
  },
  optionContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
  },
  iconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#f0e6d2',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  iconContainerSelected: {
    backgroundColor: '#8d6e63',
  },
  textContainer: {
    flex: 1,
    marginRight: 12,
  },
  optionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#3c2415',
    marginBottom: 4,
  },
  optionTitleSelected: {
    color: '#f5f5dc',
  },
  optionDescription: {
    fontSize: 14,
    color: '#8d6e63',
    lineHeight: 20,
  },
  optionDescriptionSelected: {
    color: '#d2b48c',
  },
  checkContainer: {
    width: 24,
    alignItems: 'center',
  },
  buttonContainer: {
    paddingBottom: 30,
  },
  nextButton: {
    backgroundColor: '#6d4c41',
    paddingVertical: 16,
    paddingHorizontal: 40,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#b8860b',
    shadowColor: '#3c2415',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 6,
  },
  nextButtonDisabled: {
    backgroundColor: '#a1887f',
    borderColor: '#8d6e63',
    shadowOpacity: 0.1,
  },
  nextButtonText: {
    color: '#f5f5dc',
    fontSize: 18,
    fontWeight: 'bold',
    letterSpacing: 0.5,
    textShadowColor: '#3c2415',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 1,
  },
  nextButtonTextDisabled: {
    color: '#d2b48c',
  },
});