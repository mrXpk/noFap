import { LinearGradient } from 'expo-linear-gradient';
import React, { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    Dimensions,
    PanResponder,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import { useAuth } from '../contexts/AuthContext';
import { DatabaseService } from '../lib/database.service';

interface CheckInScreenProps {
  onBack: () => void;
  onSave: (data: CheckInData) => void;
  selectedDate?: string; // Format: YYYY-MM-DD
}

interface CheckInData {
  date: string;
  fapped: boolean;
  signature: string;
  reflection: string;
  moodRating: number; // 1-10 scale
}

const { width } = Dimensions.get('window');

export default function CheckInScreen({ 
  onBack, 
  onSave, 
  selectedDate 
}: CheckInScreenProps) {
  const { user } = useAuth();
  const [step, setStep] = useState(1); // 1: Question, 2: Mood, 3: Signature, 4: Reflection
  const [fapped, setFapped] = useState<boolean | null>(null);
  const [moodRating, setMoodRating] = useState<number>(5);
  const [signature, setSignature] = useState('');
  const [reflection, setReflection] = useState('');
  const [signaturePaths, setSignaturePaths] = useState<string[]>([]);
  const [currentPath, setCurrentPath] = useState('');
  const [isDrawing, setIsDrawing] = useState(false);
  const [hasDrawnSignature, setHasDrawnSignature] = useState(false);
  const [loading, setLoading] = useState(false);
  const [existingCheckin, setExistingCheckin] = useState(false);

  const currentDate = selectedDate || new Date().toISOString().split('T')[0];
  const displayDate = new Date(currentDate).toLocaleDateString('en-US', { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });

  useEffect(() => {
    checkExistingCheckin();
  }, [user, currentDate]);

  const checkExistingCheckin = async () => {
    if (!user) return;
    
    try {
      const { data } = await DatabaseService.getTodayCheckin(user.id);
      if (data) {
        setExistingCheckin(true);
        // Load existing data
        setFapped(data.mood_rating ? data.mood_rating < 7 : false);
        setMoodRating(data.mood_rating || 5);
        setReflection(data.notes || '');
        setSignature('existing_signature');
        setHasDrawnSignature(true);
      }
    } catch (error) {
      // Error checking existing check-in
    }
  };

  const handleQuestionAnswer = (answer: boolean) => {
    setFapped(answer);
    setStep(2); // Go to mood rating
  };

  const handleMoodNext = () => {
    setStep(3); // Go to signature
  };

  const handleSignatureNext = () => {
    if (!hasDrawnSignature) {
      Alert.alert('Signature Required', 'Please draw your signature to continue.');
      return;
    }
    setSignature('signature_drawn'); // Mark as completed
    setStep(4); // Go to reflection
  };

  const clearSignature = () => {
    setSignaturePaths([]);
    setCurrentPath('');
    setHasDrawnSignature(false);
  };

  // Create PanResponder for signature drawing
  const panResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onMoveShouldSetPanResponder: () => true,
    onPanResponderGrant: (event) => {
      const { locationX, locationY } = event.nativeEvent;
      setCurrentPath(`M${locationX},${locationY}`);
      setIsDrawing(true);
    },
    onPanResponderMove: (event) => {
      const { locationX, locationY } = event.nativeEvent;
      setCurrentPath(prev => `${prev} L${locationX},${locationY}`);
    },
    onPanResponderRelease: () => {
      if (currentPath && currentPath.length > 10) { // Only save if there's actual drawing
        setSignaturePaths(prev => {
          const newPaths = [...prev, currentPath];
          // Mark as drawn only if we have substantial drawing
          if (newPaths.length >= 1 && newPaths.some(path => path.length > 20)) {
            setHasDrawnSignature(true);
          }
          return newPaths;
        });
        setCurrentPath('');
      }
      setIsDrawing(false);
    },
  });

  const handleSaveCheckIn = async () => {
    if (fapped === null || !user) return;
    
    setLoading(true);
    
    try {
      const checkInData: CheckInData = {
        date: currentDate,
        fapped,
        signature: signature.trim(),
        reflection: reflection.trim(),
        moodRating,
      };

      // Save to database
      if (existingCheckin) {
        // Update existing check-in
        const { data: existingData } = await DatabaseService.getTodayCheckin(user.id);
        if (existingData) {
          await DatabaseService.updateCheckin(existingData.id, {
            mood_rating: moodRating,
            notes: reflection.trim(),
          });
        }
      } else {
        // Create new check-in
        await DatabaseService.createCheckin(user.id, {
          date: currentDate,
          mood_rating: moodRating,
          notes: reflection.trim(),
        });
      }

      // Update user streak if needed
      await updateUserStreak();

      Alert.alert(
        'Check-in Saved!', 
        existingCheckin ? 'Your check-in has been updated.' : 'Your daily check-in has been recorded.',
        [{ text: 'OK', onPress: () => onSave(checkInData) }]
      );
      
    } catch (error) {
      // Error saving check-in
      Alert.alert('Error', 'Failed to save your check-in. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const updateUserStreak = async () => {
    if (!user) return;
    
    try {
      const { data: currentStreak } = await DatabaseService.getCurrentStreak(user.id);
      
      if (fapped) {
        // End current streak if relapsed
        if (currentStreak) {
          await DatabaseService.updateStreak(currentStreak.id, {
            is_active: false,
            end_date: currentDate,
          });
        }
        
        // Start new streak from tomorrow
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        await DatabaseService.createStreak(user.id, {
          start_date: tomorrow.toISOString().split('T')[0],
          end_date: null,
          is_active: true,
          days_count: 0,
        });
      } else {
        // Update current streak count
        if (currentStreak) {
          const startDate = new Date(currentStreak.start_date);
          const today = new Date(currentDate);
          const diffTime = Math.abs(today.getTime() - startDate.getTime());
          const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
          
          await DatabaseService.updateStreak(currentStreak.id, {
            days_count: diffDays,
          });
        }
      }
    } catch (error) {
      // Error updating streak
    }
  };

  const renderQuestionStep = () => (
    <View style={styles.stepContainer}>
      <Text style={styles.stepTitle}>Daily Check-in</Text>
      <Text style={styles.questionText}>
        {existingCheckin ? 'Update your check-in for today:' : 'Did you fap today?'}
      </Text>
      
      <View style={styles.optionsContainer}>
        <TouchableOpacity 
          style={[styles.optionButton, styles.noButton, fapped === false && styles.selectedOption]}
          onPress={() => handleQuestionAnswer(false)}
        >
          <Text style={[styles.optionText, styles.noText]}>No</Text>
          <Text style={styles.optionSubtext}>I stayed strong</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.optionButton, styles.yesButton, fapped === true && styles.selectedOption]}
          onPress={() => handleQuestionAnswer(true)}
        >
          <Text style={[styles.optionText, styles.yesText]}>Yes</Text>
          <Text style={styles.optionSubtext}>I relapsed</Text>
        </TouchableOpacity>
      </View>
      
      {existingCheckin && (
        <Text style={styles.updateNote}>
          You already checked in today. You can update your response.
        </Text>
      )}
    </View>
  );

  const renderMoodStep = () => (
    <View style={styles.stepContainer}>
      <Text style={styles.stepTitle}>How are you feeling?</Text>
      <Text style={styles.instructionText}>
        Rate your overall mood and energy today (1-10):
      </Text>
      
      <View style={styles.moodContainer}>
        <Text style={styles.moodLabel}>1 (Low)</Text>
        <View style={styles.moodSlider}>
          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((rating) => (
            <TouchableOpacity
              key={rating}
              style={[
                styles.moodButton,
                moodRating === rating && styles.selectedMood
              ]}
              onPress={() => setMoodRating(rating)}
            >
              <Text style={[
                styles.moodButtonText,
                moodRating === rating && styles.selectedMoodText
              ]}>
                {rating}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
        <Text style={styles.moodLabel}>10 (High)</Text>
      </View>
      
      <Text style={styles.moodDescription}>
        {moodRating <= 3 && "It's okay to have tough days. Tomorrow is a new opportunity."}
        {moodRating >= 4 && moodRating <= 6 && "You're doing great. Keep pushing forward."}
        {moodRating >= 7 && moodRating <= 8 && "Excellent! Your strength is showing."}
        {moodRating >= 9 && "Amazing energy! You're conquering this journey."}
      </Text>
      
      <View style={styles.stepButtons}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => setStep(1)}
        >
          <Text style={styles.backButtonText}>Back</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.nextButton}
          onPress={handleMoodNext}
        >
          <LinearGradient
            colors={['#d4af37', '#b8860b']}
            style={styles.nextGradient}
          >
            <Text style={styles.nextButtonText}>Next</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderSignatureStep = () => (
    <View style={styles.stepContainer}>
      <Text style={styles.stepTitle}>Sign Your Commitment</Text>
      <Text style={styles.instructionText}>
        Please draw your signature below with your finger:
      </Text>
      
      <View style={styles.signatureContainer}>
        <View 
          style={styles.signatureCanvas}
          {...panResponder.panHandlers}
        >
          {/* Drawing Instructions */}
          <Text style={styles.signatureInstructions}>
            {!hasDrawnSignature ? 'Draw your signature here' : ''}
          </Text>
          
          {/* Visual feedback for drawn signature */}
          {hasDrawnSignature && (
            <View style={styles.signaturePreview}>
              <Text style={styles.signatureText}>Signature Complete ✓</Text>
            </View>
          )}
          
          {/* Show drawing indicator while drawing */}
          {isDrawing && (
            <View style={styles.drawingIndicator}>
              <Text style={styles.drawingText}>Drawing...</Text>
            </View>
          )}
        </View>
        
        <TouchableOpacity 
          style={styles.clearButton}
          onPress={clearSignature}
        >
          <Text style={styles.clearButtonText}>Clear</Text>
        </TouchableOpacity>
      </View>
      
      <View style={styles.stepButtons}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => setStep(2)}
        >
          <Text style={styles.backButtonText}>Back</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.nextButton}
          onPress={handleSignatureNext}
        >
          <LinearGradient
            colors={['#d4af37', '#b8860b']}
            style={styles.nextGradient}
          >
            <Text style={styles.nextButtonText}>Next</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderReflectionStep = () => (
    <View style={styles.stepContainer}>
      <Text style={styles.stepTitle}>Your Reflection</Text>
      <Text style={styles.instructionText}>
        Share your thoughts and feelings about today:
      </Text>
      
      <TextInput
        style={styles.reflectionInput}
        value={reflection}
        onChangeText={setReflection}
        placeholder="How are you feeling? What did you learn? What motivates you?"
        placeholderTextColor="#8b4513"
        multiline
        textAlignVertical="top"
      />
      
      <View style={styles.stepButtons}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => setStep(3)}
        >
          <Text style={styles.backButtonText}>Back</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.saveButton, loading && styles.disabledButton]}
          onPress={handleSaveCheckIn}
          disabled={loading}
        >
          <LinearGradient
            colors={['#228b22', '#32cd32']}
            style={styles.saveGradient}
          >
            {loading ? (
              <ActivityIndicator color="white" size="small" />
            ) : (
              <Text style={styles.saveButtonText}>
                {existingCheckin ? 'Update Check-in' : 'Save Check-in'}
              </Text>
            )}
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <LinearGradient
      colors={['#3c2415', '#5d4037', '#8d6e63']}
      style={styles.container}
    >
      <View style={styles.parchmentOverlay}>
        <ScrollView 
          contentContainerStyle={styles.scrollContainer}
          showsVerticalScrollIndicator={false}
        >
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity style={styles.headerBackButton} onPress={onBack}>
              <Text style={styles.headerBackText}>←</Text>
            </TouchableOpacity>
            <View style={styles.headerContent}>
              <Text style={styles.headerTitle}>Check-in</Text>
              <Text style={styles.headerDate}>{displayDate}</Text>
            </View>
          </View>

          {/* Progress Indicator */}
          <View style={styles.progressContainer}>
            <View style={styles.progressBar}>
              <View style={[
                styles.progressFill, 
                { width: `${(step / 4) * 100}%` }
              ]} />
            </View>
            <Text style={styles.progressText}>Step {step} of 4</Text>
          </View>

          {/* Step Content */}
          <View style={styles.contentContainer}>
            {step === 1 && renderQuestionStep()}
            {step === 2 && renderMoodStep()}
            {step === 3 && renderSignatureStep()}
            {step === 4 && renderReflectionStep()}
          </View>

          {/* Sacred Banner */}
          <View style={styles.sacredBanner}>
            <LinearGradient
              colors={['#3c2415', '#5d4037', '#3c2415']}
              style={styles.bannerGradient}
            >
              <Text style={styles.bannerText}>
                Honesty is the foundation of growth
              </Text>
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
    paddingTop: 60,
    paddingBottom: 40,
  },
  
  // Header Styles
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 30,
  },
  headerBackButton: {
    marginRight: 16,
  },
  headerBackText: {
    fontSize: 24,
    color: '#d4af37',
    fontWeight: 'bold',
  },
  headerContent: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 24,
    fontFamily: 'serif',
    color: '#d4af37',
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  headerDate: {
    fontSize: 14,
    fontFamily: 'serif',
    color: '#f5f5dc',
    fontStyle: 'italic',
    marginTop: 4,
  },
  
  // Progress Styles
  progressContainer: {
    alignItems: 'center',
    marginBottom: 30,
  },
  progressBar: {
    width: width * 0.8,
    height: 6,
    backgroundColor: 'rgba(245, 245, 220, 0.3)',
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#d4af37',
    borderRadius: 3,
  },
  progressText: {
    fontSize: 12,
    fontFamily: 'serif',
    color: '#f5f5dc',
    marginTop: 8,
    fontStyle: 'italic',
  },
  
  // Content Styles
  contentContainer: {
    backgroundColor: 'rgba(245, 245, 220, 0.95)',
    borderRadius: 16,
    padding: 24,
    marginBottom: 30,
    borderWidth: 2,
    borderColor: '#cd7f32',
    shadowColor: '#3c2415',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  stepContainer: {
    alignItems: 'center',
  },
  stepTitle: {
    fontSize: 22,
    fontFamily: 'serif',
    color: '#3c2415',
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
    letterSpacing: 1,
  },
  
  // Question Step Styles
  questionText: {
    fontSize: 20,
    fontFamily: 'serif',
    color: '#3c2415',
    textAlign: 'center',
    marginBottom: 32,
    fontWeight: '600',
  },
  optionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    gap: 16,
  },
  optionButton: {
    flex: 1,
    paddingVertical: 24,
    paddingHorizontal: 16,
    borderRadius: 12,
    borderWidth: 2,
    alignItems: 'center',
  },
  noButton: {
    backgroundColor: 'rgba(34, 139, 34, 0.1)',
    borderColor: '#228b22',
  },
  yesButton: {
    backgroundColor: 'rgba(139, 0, 0, 0.1)',
    borderColor: '#8b0000',
  },
  optionText: {
    fontSize: 18,
    fontFamily: 'serif',
    fontWeight: 'bold',
    marginBottom: 4,
  },
  noText: {
    color: '#228b22',
  },
  yesText: {
    color: '#8b0000',
  },
  optionSubtext: {
    fontSize: 12,
    fontFamily: 'serif',
    fontStyle: 'italic',
    color: '#8b4513',
  },
  selectedOption: {
    backgroundColor: 'rgba(212, 175, 55, 0.2)',
    borderColor: '#d4af37',
    borderWidth: 3,
  },
  updateNote: {
    fontSize: 14,
    fontFamily: 'serif',
    color: '#8b4513',
    textAlign: 'center',
    marginTop: 16,
    fontStyle: 'italic',
  },
  
  // Mood Rating Styles
  moodContainer: {
    alignItems: 'center',
    marginBottom: 24,
  },
  moodLabel: {
    fontSize: 14,
    fontFamily: 'serif',
    color: '#3c2415',
    fontWeight: '600',
  },
  moodSlider: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginVertical: 16,
  },
  moodButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(139, 69, 19, 0.1)',
    borderWidth: 2,
    borderColor: '#8b4513',
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 2,
  },
  selectedMood: {
    backgroundColor: '#d4af37',
    borderColor: '#cd7f32',
  },
  moodButtonText: {
    fontSize: 14,
    fontFamily: 'serif',
    color: '#3c2415',
    fontWeight: 'bold',
  },
  selectedMoodText: {
    color: '#ffffff',
  },
  moodDescription: {
    fontSize: 16,
    fontFamily: 'serif',
    color: '#3c2415',
    textAlign: 'center',
    marginTop: 12,
    fontStyle: 'italic',
  },
  
  // Signature Step Styles
  instructionText: {
    fontSize: 16,
    fontFamily: 'serif',
    color: '#5d4037',
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 22,
  },
  signatureContainer: {
    width: '100%',
    marginBottom: 32,
  },
  signatureCanvas: {
    width: '100%',
    height: 150, // Increased height for better drawing space
    backgroundColor: '#ffffff',
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#deb887',
    borderStyle: 'dashed',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
    position: 'relative', // For absolute positioned elements
  },
  signatureInstructions: {
    fontSize: 14,
    fontFamily: 'serif',
    color: '#999999',
    fontStyle: 'italic',
  },
  signaturePreview: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  signatureText: {
    fontSize: 16,
    fontFamily: 'serif',
    color: '#228b22',
    fontWeight: 'bold',
  },
  drawingIndicator: {
    position: 'absolute',
    top: 10,
    left: 10,
    backgroundColor: 'rgba(212, 175, 55, 0.9)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  drawingText: {
    fontSize: 12,
    fontFamily: 'serif',
    color: '#ffffff',
    fontWeight: '600',
  },
  clearButton: {
    alignSelf: 'center',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#8b4513',
  },
  clearButtonText: {
    fontSize: 14,
    fontFamily: 'serif',
    color: '#8b4513',
    fontWeight: '600',
  },
  signatureInput: {
    fontSize: 24,
    fontFamily: 'serif',
    color: '#3c2415',
    textAlign: 'center',
    paddingVertical: 16,
    fontStyle: 'italic',
  },
  signatureLine: {
    height: 2,
    backgroundColor: '#8b4513',
    marginHorizontal: 20,
  },
  
  // Reflection Step Styles
  reflectionInput: {
    width: '100%',
    minHeight: 120,
    backgroundColor: '#ffffff',
    borderRadius: 8,
    padding: 16,
    fontSize: 16,
    fontFamily: 'serif',
    color: '#3c2415',
    borderWidth: 2,
    borderColor: '#deb887',
    marginBottom: 32,
    textAlignVertical: 'top',
  },
  
  // Button Styles
  stepButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    gap: 16,
  },
  backButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#8b4513',
    alignItems: 'center',
  },
  backButtonText: {
    fontSize: 16,
    fontFamily: 'serif',
    color: '#8b4513',
    fontWeight: '600',
  },
  nextButton: {
    flex: 1,
    borderRadius: 8,
    overflow: 'hidden',
  },
  nextGradient: {
    paddingVertical: 12,
    alignItems: 'center',
  },
  nextButtonText: {
    fontSize: 16,
    fontFamily: 'serif',
    color: '#ffffff',
    fontWeight: 'bold',
  },
  saveButton: {
    flex: 1,
    borderRadius: 8,
    overflow: 'hidden',
  },
  saveGradient: {
    paddingVertical: 12,
    alignItems: 'center',
  },
  saveButtonText: {
    fontSize: 16,
    fontFamily: 'serif',
    color: '#ffffff',
    fontWeight: 'bold',
  },
  disabledButton: {
    opacity: 0.6,
  },
  
  // Sacred Banner
  sacredBanner: {
    borderRadius: 8,
    overflow: 'hidden',
  },
  bannerGradient: {
    paddingVertical: 16,
    paddingHorizontal: 24,
    alignItems: 'center',
  },
  bannerText: {
    fontSize: 14,
    fontFamily: 'serif',
    color: '#d4af37',
    fontWeight: '600',
    letterSpacing: 1,
    textAlign: 'center',
    fontStyle: 'italic',
  },
});