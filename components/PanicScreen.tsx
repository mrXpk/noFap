import { Audio } from 'expo-av';
import { CameraView, useCameraPermissions } from 'expo-camera';
import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useEffect, useRef, useState } from 'react';
import {
    Alert,
    Animated,
    Dimensions,
    StatusBar,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

interface PanicScreenProps {
  onBack: () => void;
}

const { width, height } = Dimensions.get('window');

const motivationalQuotes = [
  "You are stronger than this moment - keep fighting",
  "This feeling will pass, your strength is eternal",
  "Every 'no' you say now builds the person you want to become",
  "Your future self is counting on this decision",
  "Breathe deep, stay strong, you've got this",
  "You have overcome challenges before, you will overcome this too",
  "Discipline in this moment creates freedom in your life",
  "Your worth is not defined by your struggles",
  "Each moment of resistance makes you stronger",
  "You are in control of your choices and your destiny",
  "This is where champions are made - in moments like this",
  "Your voice is more powerful than any urge"
];

export default function PanicScreen({ onBack }: PanicScreenProps) {
  const [permission, requestPermission] = useCameraPermissions();
  const [isRecording, setIsRecording] = useState(false);
  const [currentQuote, setCurrentQuote] = useState(0);
  const [countdown, setCountdown] = useState(60); // Main video countdown
  const [videoCountdown, setVideoCountdown] = useState(60); // Separate video timer
  const [isActive, setIsActive] = useState(true);
  const [emergencyCountdown, setEmergencyCountdown] = useState(3);
  const [showEmergencyMode, setShowEmergencyMode] = useState(true);
  const [sound, setSound] = useState<Audio.Sound | null>(null);
  const [backgroundSound, setBackgroundSound] = useState<Audio.Sound | null>(null);
  
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const blinkAnim = useRef(new Animated.Value(1)).current;
  const quotePulseAnim = useRef(new Animated.Value(1)).current;
  const emergencyFadeAnim = useRef(new Animated.Value(1)).current;
  const emergencyScaleAnim = useRef(new Animated.Value(0.5)).current;
  const countdownPulseAnim = useRef(new Animated.Value(1)).current; // For countdown pulse
  const transitionAnim = useRef(new Animated.Value(0)).current;
  const cameraRef = useRef<CameraView>(null);

  useEffect(() => {
    initializeEmergencyMode();
    return () => {
      // Cleanup when component unmounts
      cleanupSound();
    };
  }, []);

  useEffect(() => {
    if (!showEmergencyMode) {
      startQuoteRotation();
      startVideoCountdown(); // Use video countdown instead
      startRecordingBlinkAnimation();
    }
  }, [showEmergencyMode]);



  const initializeEmergencyMode = async () => {
    try {
      // Trigger haptic feedback immediately
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
      
      // Load and play emergency sound at 40% volume
      try {
        const { sound: emergencySound } = await Audio.Sound.createAsync(
          require('../assets/sounds/emergency_panic.mp3'),
          { shouldPlay: true, volume: 0.4 } // Start at 40% volume
        );
        setSound(emergencySound);
        
        // Gradually reduce volume during countdown
        setTimeout(() => {
          emergencySound.setVolumeAsync(0.3); // 30% at 1 second
        }, 1000);
        
        setTimeout(() => {
          emergencySound.setVolumeAsync(0.2); // 20% at 2 seconds
        }, 2000);
        
        setTimeout(async () => {
          // Stop sound completely when countdown ends
          await emergencySound.stopAsync();
          await emergencySound.unloadAsync();
          setSound(null);
        }, 3000);
        
      } catch (audioError) {
        console.log('Emergency sound not found, continuing without audio:', audioError);
      }
      
      // Start countdown animations immediately
      startEmergencyCountdown();
      startCountdownPulse();
      
      // Animate emergency elements
      Animated.parallel([
        Animated.timing(emergencyScaleAnim, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.timing(emergencyFadeAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        })
      ]).start();
      
    } catch (error) {
      console.error('Failed to initialize emergency mode:', error);
      startEmergencyCountdown();
    }
  };

  const startEmergencyCountdown = () => {
    const timer = setInterval(() => {
      setEmergencyCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          transitionToMainScreen();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const cleanupSound = async () => {
    if (sound) {
      try {
        await sound.stopAsync();
        await sound.unloadAsync();
        setSound(null);
      } catch (error) {
        console.log('Error cleaning up sound:', error);
      }
    }
    if (backgroundSound) {
      try {
        await backgroundSound.stopAsync();
        await backgroundSound.unloadAsync();
        setBackgroundSound(null);
      } catch (error) {
        console.log('Error cleaning up background sound:', error);
      }
    }
  };

  const handleBackPress = async () => {
    await cleanupSound();
    onBack();
  };

  const transitionToMainScreen = async () => {
    // Don't stop sound here - let it continue playing during video recording
    
    Animated.timing(transitionAnim, {
      toValue: 1,
      duration: 800,
      useNativeDriver: true,
    }).start(() => {
      setShowEmergencyMode(false);
    });
  };

  const startCountdownPulse = () => {
    const pulse = () => {
      Animated.sequence([
        Animated.timing(countdownPulseAnim, {
          toValue: 1.1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(countdownPulseAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start(() => {
        if (emergencyCountdown > 0) {
          setTimeout(pulse, 400); // Pulse every second
        }
      });
    };
    pulse();
  };

  const startVideoCountdown = () => {
    const timer = setInterval(() => {
      setVideoCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          handleVideoComplete();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const handleVideoComplete = () => {
    handleStopRecording();
    Alert.alert(
      'Recording Complete',
      'Your 60-second session is complete. What would you like to do?',
      [
        { text: 'Discard', onPress: handleDiscardVideo, style: 'destructive' },
        { text: 'Save Video', onPress: handleSaveVideo, style: 'default' }
      ]
    );
  };

  const startQuoteRotation = () => {
    const interval = setInterval(() => {
      if (!isActive) {
        clearInterval(interval);
        return;
      }
      
      // Fade out with slide up
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 800,
        useNativeDriver: true,
      }).start(() => {
        // Change quote
        setCurrentQuote((prev) => (prev + 1) % motivationalQuotes.length);
        
        // Fade in with slide down
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }).start();
      });
    }, 6000); // Change every 6 seconds
    
    // Start gentle sacred breathing animation
    const startSacredBreathing = () => {
      Animated.sequence([
        Animated.timing(quotePulseAnim, {
          toValue: 1.02, // Very subtle scale
          duration: 3000, // Slow, meditative breathing
          useNativeDriver: true,
        }),
        Animated.timing(quotePulseAnim, {
          toValue: 1,
          duration: 3000, // Slow, meditative breathing
          useNativeDriver: true,
        }),
      ]).start(() => {
        if (isActive) startSacredBreathing();
      });
    };
    startSacredBreathing();
  };

  const startRecordingBlinkAnimation = () => {
    const blink = () => {
      Animated.sequence([
        Animated.timing(blinkAnim, {
          toValue: 0.3,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.timing(blinkAnim, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }),
      ]).start(() => {
        if (isActive) blink();
      });
    };
    blink();
  };

  const handleStartRecording = async () => {
    if (cameraRef.current && !isRecording) {
      try {
        setIsRecording(true);
        const video = await cameraRef.current.recordAsync({
          maxDuration: 60, // Auto-stop after 1 minute (60 seconds)
        });
        // Video recorded successfully
        if (video) {
          console.log('Video saved to:', video.uri);
          setIsRecording(false);
        }
      } catch (error) {
        console.error('Recording failed:', error);
        setIsRecording(false);
      }
    }
  };

  const handleStopRecording = () => {
    if (cameraRef.current && isRecording) {
      cameraRef.current.stopRecording();
      setIsRecording(false);
    }
  };

  const handleSaveVideo = async () => {
    handleStopRecording();
    // Stop the emergency sound when saving
    await cleanupSound();
    Alert.alert(
      'Session Saved',
      'Your strength session has been saved. You did great!',
      [{ text: 'Continue', onPress: onBack }]
    );
  };

  const handleDiscardVideo = async () => {
    handleStopRecording();
    // Stop the emergency sound when discarding
    await cleanupSound();
    Alert.alert(
      'Session Discarded',
      'That\'s okay. The important thing is you came here instead of giving in.',
      [{ text: 'Continue', onPress: onBack }]
    );
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (!permission) {
    return (
      <View style={styles.permissionContainer}>
        <Text style={styles.permissionText}>Requesting camera permission...</Text>
      </View>
    );
  }

  if (!permission.granted) {
    return (
      <View style={styles.permissionContainer}>
        <Text style={styles.permissionText}>Camera access is required for the panic session</Text>
        <TouchableOpacity style={styles.permissionButton} onPress={requestPermission}>
          <Text style={styles.permissionButtonText}>Grant Permission</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // Emergency Countdown Screen
  if (showEmergencyMode) {
    return (
      <View style={styles.emergencyContainer}>
        <StatusBar hidden />
        
        {/* Emergency Background - Cinematic Gradient */}
        <LinearGradient
          colors={['#F5DEB3', '#DEB887', '#CD853F', '#A0522D', '#8B0000']} // Parchment to crimson
          style={styles.emergencyGradient}
        >
          {/* Close Button */}
          <TouchableOpacity style={styles.emergencyCloseButton} onPress={handleBackPress}>
            <Text style={styles.emergencyCloseText}>✕</Text>
          </TouchableOpacity>
          
          {/* Emergency Content */}
          <View style={styles.emergencyContent}>
            {/* Main Countdown Number */}
            <Animated.View 
              style={[
                styles.countdownContainer,
                {
                  opacity: emergencyFadeAnim,
                  transform: [{ scale: Animated.multiply(emergencyScaleAnim, countdownPulseAnim) }]
                }
              ]}
            >
              <Text style={styles.cinematicCountdownNumber}>{emergencyCountdown}</Text>
            </Animated.View>
            
            {/* Sacred Motivational Text */}
            <Animated.View style={[styles.emergencyTextContainer, { opacity: emergencyFadeAnim }]}>
              <Text style={styles.cinematicTitle}>GET READY</Text>
              <View style={styles.titleUnderline} />
              <Text style={styles.cinematicSubtitle}>Your Strength is Sacred</Text>
              <Text style={styles.cinematicDescription}>✨ Divine intervention in progress ✨</Text>
            </Animated.View>
            
            {/* Gentle Pulse Indicator */}
            <Animated.View style={[styles.cinematicIndicator, { opacity: blinkAnim }]} />
          </View>
        </LinearGradient>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar hidden />
      
      {/* Camera Background */}
      <CameraView
        ref={cameraRef}
        style={styles.camera}
        facing="front"
        mode="video"
        onCameraReady={handleStartRecording}
      >
        {/* Dark Overlay for Better Text Visibility */}
        <View style={styles.overlay}>
          
          {/* Header Section */}
          <LinearGradient
            colors={['rgba(60, 36, 21, 0.9)', 'rgba(60, 36, 21, 0.7)', 'transparent']}
            style={styles.headerGradient}
          >
            <View style={styles.header}>
              <TouchableOpacity style={styles.backButton} onPress={handleBackPress}>
                <Text style={styles.backText}>✕</Text>
              </TouchableOpacity>
              
              <View style={styles.headerContent}>
                <Text style={styles.headerTitle}>Stay Strong, Speak Out Loud</Text>
                <View style={styles.timerContainer}>
                  <Text style={styles.timerText}>{formatTime(videoCountdown)}</Text>
                  <View style={[
                    styles.timerBar,
                    { width: `${(videoCountdown / 60) * 100}%` }
                  ]} />
                </View>
              </View>
            </View>
          </LinearGradient>

          {/* Enhanced Motivational Quotes - No Overlay Issues */}
          <View style={styles.modernQuoteContainer}>
            <Animated.View 
              style={[
                styles.modernQuoteCard, 
                { 
                  opacity: fadeAnim,
                  transform: [
                    {
                      translateY: fadeAnim.interpolate({
                        inputRange: [0, 1],
                        outputRange: [10, 0],
                      })
                    },
                    {
                      scale: quotePulseAnim,
                    }
                  ]
                }
              ]}
            >
              <Text style={styles.modernQuoteText}>
                {motivationalQuotes[currentQuote]}
              </Text>
            </Animated.View>
          </View>

          {/* Bottom Controls */}
          <LinearGradient
            colors={['transparent', 'rgba(60, 36, 21, 0.7)', 'rgba(60, 36, 21, 0.9)']}
            style={styles.bottomGradient}
          >
            <View style={styles.bottomControls}>
              
              {/* Recording Indicator */}
              <View style={styles.recordingIndicator}>
                <Animated.View style={[styles.recordingDot, { opacity: blinkAnim }]} />
                <Text style={styles.recordingText}>
                  {isRecording ? 'Recording...' : 'Ready to Record'}
                </Text>
              </View>

              {/* Action Buttons */}
              <View style={styles.actionButtons}>
                <TouchableOpacity 
                  style={styles.discardButton} 
                  onPress={handleDiscardVideo}
                  activeOpacity={0.7}
                >
                  <Text style={styles.discardText}>✗ Discard</Text>
                </TouchableOpacity>

                <TouchableOpacity 
                  style={styles.saveButton} 
                  onPress={handleSaveVideo}
                  activeOpacity={0.7}
                >
                  <LinearGradient
                    colors={['#228b22', '#32cd32']}
                    style={styles.saveGradient}
                  >
                    <Text style={styles.saveText}>✓ Save Video</Text>
                  </LinearGradient>
                </TouchableOpacity>
              </View>
            </View>
          </LinearGradient>

        </View>
      </CameraView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  camera: {
    flex: 1,
  },
  overlay: {
    flex: 1,
    justifyContent: 'space-between',
  },
  
  // Permission Styles
  permissionContainer: {
    flex: 1,
    backgroundColor: '#3c2415',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  permissionText: {
    fontSize: 18,
    color: '#f5f5dc',
    textAlign: 'center',
    marginBottom: 30,
    fontFamily: 'serif',
  },
  permissionButton: {
    backgroundColor: '#d4af37',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 25,
  },
  permissionButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
    fontFamily: 'serif',
  },
  
  // Header Styles
  headerGradient: {
    paddingTop: 60,
    paddingBottom: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(245, 245, 220, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 15,
  },
  backText: {
    color: '#f5f5dc',
    fontSize: 18,
    fontWeight: 'bold',
  },
  headerContent: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 20,
    fontFamily: 'serif',
    color: '#f5f5dc',
    fontWeight: 'bold',
    marginBottom: 8,
    textShadowColor: '#000000',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  timerContainer: {
    alignItems: 'flex-start',
  },
  timerText: {
    fontSize: 24,
    fontFamily: 'serif',
    color: '#d4af37',
    fontWeight: 'bold',
    marginBottom: 4,
    textShadowColor: '#000000',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  timerBar: {
    height: 4,
    backgroundColor: '#d4af37',
    borderRadius: 2,
    minWidth: 60,
  },
  
  // Modern Quote Styles - High Visibility, No Interference
  modernQuoteContainer: {
    position: 'absolute',
    bottom: 180, // Position above controls, away from timer
    left: 20,
    right: 20,
    zIndex: 2,
    pointerEvents: 'none',
  },
  modernQuoteCard: {
    backgroundColor: 'rgba(0, 0, 0, 0.7)', // Dark but visible background
    borderRadius: 20,
    paddingHorizontal: 25,
    paddingVertical: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    // Add subtle glow
    shadowColor: '#FFFFFF',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 8,
  },
  modernQuoteText: {
    fontSize: 22,
    fontWeight: '600',
    color: '#FFFFFF',
    textAlign: 'center',
    lineHeight: 32,
    fontFamily: 'serif',
    fontStyle: 'italic',
    // Strong text shadow for readability
    textShadowColor: '#000000',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  emergencyQuoteText: {
    fontSize: 42, // Very large, dominant text
    fontWeight: '900', // Maximum boldness
    color: '#FFFFFF', // High contrast white
    textAlign: 'center',
    lineHeight: 52,
    letterSpacing: 1,
    fontFamily: 'System', // Strong, modern system font
    // Powerful glowing effect
    textShadowColor: '#FFD700', // Bright yellow glow
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 15,
    // Additional shadow layers for intense glow
    elevation: 20,
    // Emergency urgency styling
    textTransform: 'uppercase' as const,
  },
  
  // Biblical Scripture-Style Quote - High Visibility
  biblicalQuoteText: {
    fontSize: 28, // Smaller to avoid interference
    fontWeight: '700',
    color: '#FFFFFF', // Pure white for maximum contrast
    textAlign: 'center',
    lineHeight: 36,
    letterSpacing: 0.5,
    fontFamily: 'serif',
    fontStyle: 'italic',
    // Strong contrast shadows
    textShadowColor: '#000000',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 8,
    elevation: 10,
  },
  
  // Bottom Controls
  bottomGradient: {
    paddingTop: 20,
    paddingBottom: 40,
  },
  bottomControls: {
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  recordingIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 25,
  },
  recordingDot: {
    width: 12,
    height: 12,
    backgroundColor: '#ff0000',
    borderRadius: 6,
    marginRight: 8,
    shadowColor: '#ff0000',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 4,
    elevation: 4,
  },
  recordingText: {
    fontSize: 16,
    fontFamily: 'serif',
    color: '#f5f5dc',
    fontWeight: '600',
    textShadowColor: '#000000',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    gap: 20,
  },
  discardButton: {
    flex: 1,
    paddingVertical: 15,
    backgroundColor: 'rgba(139, 0, 0, 0.8)',
    borderRadius: 25,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#8b0000',
  },
  discardText: {
    color: '#ffffff',
    fontSize: 16,
    fontFamily: 'serif',
    fontWeight: 'bold',
    textShadowColor: '#000000',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  saveButton: {
    flex: 1,
    borderRadius: 25,
    overflow: 'hidden',
  },
  saveGradient: {
    paddingVertical: 15,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#228b22',
  },
  saveText: {
    color: '#ffffff',
    fontSize: 16,
    fontFamily: 'serif',
    fontWeight: 'bold',
    textShadowColor: '#000000',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  
  // Emergency Countdown Styles - Cinematic & High Quality
  emergencyContainer: {
    flex: 1,
    backgroundColor: '#000000',
  },
  emergencyGradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    // Add subtle glow effect
    shadowColor: '#DAA520',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10,
  },
  emergencyCloseButton: {
    position: 'absolute',
    top: 60,
    right: 20,
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(139, 69, 19, 0.4)',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
    borderWidth: 1,
    borderColor: 'rgba(245, 222, 179, 0.3)',
  },
  emergencyCloseText: {
    color: '#F5DEB3',
    fontSize: 20,
    fontWeight: 'bold',
  },
  emergencyContent: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  countdownContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 50,
  },
  cinematicCountdownNumber: {
    fontSize: 220,
    fontWeight: '900',
    color: '#F5DEB3', // Ivory/golden color
    textShadowColor: '#DAA520', // Golden glow
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 25,
    fontFamily: 'serif',
    elevation: 20,
  },
  emergencyTextContainer: {
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  cinematicTitle: {
    fontSize: 42,
    fontWeight: '900',
    color: '#F5DEB3',
    textAlign: 'center',
    marginBottom: 8,
    textShadowColor: '#DAA520',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 15,
    fontFamily: 'serif',
    letterSpacing: 2,
  },
  titleUnderline: {
    width: 120,
    height: 2,
    backgroundColor: '#DAA520',
    marginBottom: 15,
    shadowColor: '#DAA520',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 8,
    elevation: 5,
  },
  cinematicSubtitle: {
    fontSize: 24,
    fontWeight: '600',
    color: '#DEB887',
    textAlign: 'center',
    marginBottom: 25,
    textShadowColor: '#8B4513',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 8,
    fontFamily: 'serif',
    fontStyle: 'italic',
  },
  cinematicDescription: {
    fontSize: 18,
    fontWeight: '500',
    color: '#DAA520',
    textAlign: 'center',
    opacity: 0.9,
    textShadowColor: '#8B4513',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 5,
    fontFamily: 'serif',
  },
  cinematicIndicator: {
    position: 'absolute',
    bottom: 80,
    width: 25,
    height: 25,
    backgroundColor: '#DAA520',
    borderRadius: 12,
    shadowColor: '#DAA520',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 20,
    elevation: 10,
  },
});