import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useRef, useState } from 'react';
import {
    Alert,
    Dimensions,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import SignatureScreen from 'react-native-signature-canvas';

const { width, height } = Dimensions.get('window');

interface CommitmentAgreementScreenProps {
  onCommitmentSigned: (signature: string) => void;
}

const MANIFESTO_TEXT = `I, the undersigned, hereby commit to a journey of self-discipline and personal transformation.

I commit to respecting my body and mind as sacred vessels of my potential.

I commit to choosing long-term strength over short-term urges.

I commit to breaking free from destructive patterns that diminish my power.

I commit to daily check-ins as an act of accountability and mindfulness.

I commit to facing challenges with courage and seeking growth through discipline.

I commit to honoring this pledge not out of perfection, but out of dedication to becoming the person I am meant to be.

This commitment represents my conscious choice to reclaim control over my life and pursue the highest version of myself.

Today marks the beginning of my transformation.`;

export default function CommitmentAgreementScreen({ onCommitmentSigned }: CommitmentAgreementScreenProps) {
  const [signature, setSignature] = useState<string>('');
  const [hasScrolledToBottom, setHasScrolledToBottom] = useState(false);
  const signatureRef = useRef<any>(null);

  const handleOK = (signature: string) => {
    console.log('Signature received:', signature ? 'Valid signature' : 'Empty signature');
    setSignature(signature);
  };

  const handleEmpty = () => {
    console.log('Signature is empty');
    setSignature('');
  };

  const handleClear = () => {
    signatureRef.current?.clearSignature();
    setSignature('');
  };

  const handleConfirm = () => {
    console.log('handleConfirm called - signature:', signature ? 'exists' : 'missing');
    console.log('hasScrolledToBottom:', hasScrolledToBottom);
    
    // Only check if user has scrolled to bottom, signature is now optional
    if (!hasScrolledToBottom) {
      Alert.alert(
        'Read Complete Agreement',
        'Please read the entire commitment agreement before signing.',
        [{ text: 'OK' }]
      );
      return;
    }

    // Proceed directly without signature validation
    Alert.alert(
      'Confirm Your Commitment',
      'Are you ready to begin your journey? This represents your dedication to positive change.',
      [
        { text: 'Not Yet', style: 'cancel' },
        { 
          text: 'I Commit', 
          style: 'default',
          onPress: () => onCommitmentSigned(signature || 'commitment-accepted')
        }
      ]
    );
  };

  const handleScroll = (event: any) => {
    const { layoutMeasurement, contentOffset, contentSize } = event.nativeEvent;
    const paddingToBottom = 20;
    const isScrolledToBottom = layoutMeasurement.height + contentOffset.y >= 
      contentSize.height - paddingToBottom;
    
    if (isScrolledToBottom && !hasScrolledToBottom) {
      setHasScrolledToBottom(true);
    }
  };

  const style = `.m-signature-pad--footer
    .m-signature-pad--footer .clear {
      display: none;
    }
    .m-signature-pad--footer .save {
      display: none;
    }
    body,html {
      width: 100%; height: 100%;
    }`;

  return (
    <>
      <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent />
      <LinearGradient
        colors={['#faf0e6', '#f5f5dc', '#f0e68c']}
        style={styles.container}
      >
        <SafeAreaView style={styles.safeArea}>
          <View style={styles.content}>
            {/* Header */}
            <View style={styles.header}>
              <Text style={styles.title}>Sacred Covenant</Text>
              <Text style={styles.subtitle}>A holy pledge to yourself and your highest purpose</Text>
              <Text style={styles.bibleReference}>"Above all else, guard your heart" - Proverbs 4:23</Text>
            </View>

            {/* Manifesto Card */}
            <View style={styles.manifestoCard}>
              <ScrollView 
                style={styles.scrollView}
                showsVerticalScrollIndicator={true}
                onScroll={handleScroll}
                scrollEventThrottle={16}
              >
                <Text style={styles.manifestoText}>{MANIFESTO_TEXT}</Text>
                <View style={styles.scrollIndicator}>
                  {!hasScrolledToBottom && (
                    <Text style={styles.scrollHint}>Scroll to read complete agreement ↓</Text>
                  )}
                </View>
              </ScrollView>
            </View>

            {/* Signature Section */}
            <View style={styles.signatureSection}>
              <View style={styles.signatureHeader}>
                <Ionicons name="create-outline" size={20} color="#6b7280" />
                <Text style={styles.signatureLabel}>Digital Signature</Text>
                {signature && (
                  <Ionicons name="checkmark-circle" size={20} color="#228b22" style={{marginLeft: 8}} />
                )}
              </View>
              
              <View style={styles.signatureContainer}>
                <SignatureScreen
                  ref={signatureRef}
                  onOK={handleOK}
                  onEmpty={handleEmpty}
                  descriptionText="Sign here"
                  clearText="Clear"
                  confirmText="Done"
                  webStyle={style}
                  autoClear={false}
                  imageType="image/png"
                  penColor="#3c2415"
                  backgroundColor="#fdf5e6"
                  trimWhitespace={true}
                />
              </View>

              <TouchableOpacity
                style={styles.clearButton}
                onPress={handleClear}
              >
                <Text style={styles.clearButtonText}>Clear Signature</Text>
              </TouchableOpacity>
            </View>

            {/* Commit Button */}
            <View style={styles.bottomSection}>
              <TouchableOpacity
                style={[
                  styles.commitButton,
                  !hasScrolledToBottom && styles.commitButtonDisabled
                ]}
                onPress={handleConfirm}
                activeOpacity={0.8}
              >
                <Text style={[
                  styles.commitButtonText,
                  !hasScrolledToBottom && styles.commitButtonTextDisabled
                ]}>
                  I Sign & Commit
                </Text>
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
    paddingHorizontal: 20,
  },
  header: {
    paddingTop: 20,
    paddingBottom: 20,
    alignItems: 'center',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#3c2415',
    marginBottom: 8,
    textAlign: 'center',
    textShadowColor: '#d4af37',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  subtitle: {
    fontSize: 16,
    color: '#5d4037',
    fontStyle: 'italic',
    textAlign: 'center',
    marginBottom: 8,
  },
  bibleReference: {
    fontSize: 12,
    color: '#8d6e63',
    fontStyle: 'italic',
    textAlign: 'center',
    marginTop: 8,
  },
  manifestoCard: {
    flex: 1,
    backgroundColor: '#fdf5e6',
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#d4af37',
    marginBottom: 20,
    shadowColor: '#8b4513',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 5,
  },
  scrollView: {
    flex: 1,
    padding: 20,
  },
  manifestoText: {
    fontSize: 16,
    lineHeight: 26,
    color: '#3c2415',
    fontFamily: 'serif',
    textAlign: 'justify',
    textShadowColor: '#f5f5dc',
    textShadowOffset: { width: 0.5, height: 0.5 },
    textShadowRadius: 1,
  },
  scrollIndicator: {
    paddingTop: 20,
    alignItems: 'center',
  },
  scrollHint: {
    fontSize: 14,
    color: '#9ca3af',
    fontStyle: 'italic',
  },
  signatureSection: {
    marginBottom: 20,
  },
  signatureHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  signatureLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#3c2415',
    marginLeft: 8,
  },
  signatureContainer: {
    height: 120,
    borderWidth: 2,
    borderColor: '#d4af37',
    borderRadius: 8,
    backgroundColor: '#fdf5e6',
    overflow: 'hidden',
  },
  clearButton: {
    alignSelf: 'flex-end',
    marginTop: 8,
    paddingVertical: 4,
    paddingHorizontal: 12,
  },
  clearButtonText: {
    fontSize: 14,
    color: '#8d6e63',
    textDecorationLine: 'underline',
  },
  bottomSection: {
    paddingBottom: 20,
  },
  commitButton: {
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
    elevation: 8,
  },
  commitButtonDisabled: {
    backgroundColor: '#a1887f',
    borderColor: '#8d6e63',
    shadowOpacity: 0.1,
  },
  commitButtonText: {
    color: '#f5f5dc',
    fontSize: 18,
    fontWeight: 'bold',
    letterSpacing: 0.5,
    textShadowColor: '#3c2415',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 1,
  },
  commitButtonTextDisabled: {
    color: '#d2b48c',
  },
});