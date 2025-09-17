import { LinearGradient } from 'expo-linear-gradient';
import React, { useState } from 'react';
import {
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
}

const { width } = Dimensions.get('window');

export default function CheckInScreen({ 
  onBack, 
  onSave, 
  selectedDate 
}: CheckInScreenProps) {
  const [step, setStep] = useState(1); // 1: Question, 2: Signature, 3: Reflection
  const [fapped, setFapped] = useState<boolean | null>(null);
  const [signature, setSignature] = useState('');
  const [reflection, setReflection] = useState('');
  const [signaturePaths, setSignaturePaths] = useState<string[]>([]);
  const [currentPath, setCurrentPath] = useState('');
  const [isDrawing, setIsDrawing] = useState(false);
  const [hasDrawnSignature, setHasDrawnSignature] = useState(false);

  const currentDate = selectedDate || new Date().toISOString().split('T')[0];
  const displayDate = new Date(currentDate).toLocaleDateString('en-US', { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });

  const handleQuestionAnswer = (answer: boolean) => {
    setFapped(answer);
    setStep(2);
  };

  const handleSignatureNext = () => {
    if (!hasDrawnSignature) {
      Alert.alert('Signature Required', 'Please draw your signature to continue.');
      return;
    }
    setSignature('signature_drawn'); // Mark as completed
    setStep(3);
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

  const handleSaveCheckIn = () => {
    if (fapped === null) return;
    
    const checkInData: CheckInData = {
      date: currentDate,
      fapped,
      signature: signature.trim(),
      reflection: reflection.trim(),
    };

    onSave(checkInData);
  };

  const renderQuestionStep = () => (
    <View style={styles.stepContainer}>
      <Text style={styles.stepTitle}>Daily Check-in</Text>
      <Text style={styles.questionText}>Did you fap today?</Text>
      
      <View style={styles.optionsContainer}>
        <TouchableOpacity 
          style={[styles.optionButton, styles.noButton]}
          onPress={() => handleQuestionAnswer(false)}
        >
          <Text style={[styles.optionText, styles.noText]}>No</Text>
          <Text style={styles.optionSubtext}>I stayed strong</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.optionButton, styles.yesButton]}
          onPress={() => handleQuestionAnswer(true)}
        >
          <Text style={[styles.optionText, styles.yesText]}>Yes</Text>
          <Text style={styles.optionSubtext}>I relapsed</Text>
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
          onPress={() => setStep(1)}
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
          onPress={() => setStep(2)}
        >
          <Text style={styles.backButtonText}>Back</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.saveButton}
          onPress={handleSaveCheckIn}
        >
          <LinearGradient
            colors={['#228b22', '#32cd32']}
            style={styles.saveGradient}
          >
            <Text style={styles.saveButtonText}>Save Check-in</Text>
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
                { width: `${(step / 3) * 100}%` }
              ]} />
            </View>
            <Text style={styles.progressText}>Step {step} of 3</Text>
          </View>

          {/* Step Content */}
          <View style={styles.contentContainer}>
            {step === 1 && renderQuestionStep()}
            {step === 2 && renderSignatureStep()}
            {step === 3 && renderReflectionStep()}
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