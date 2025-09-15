import { LinearGradient } from 'expo-linear-gradient';
import React, { useState } from 'react';
import {
    Dimensions,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

interface GetPremiumScreenProps {
  onGetPremium: (plan: 'monthly' | '3month' | 'yearly') => void;
  onContinueFree: () => void;
}

const { width, height } = Dimensions.get('window');

const subscriptionPlans = [
  {
    id: 'yearly',
    name: 'Yearly',
    tag: 'Best Value',
    tagColor: '#ff6b35',
    price: '$60',
    originalPrice: '$120',
    billing: 'Yearly',
    savings: 'Save 50%',
    freeTrialText: 'Get 7 Days Free',
    isHighlighted: true,
  },
  {
    id: '3month',
    name: '3 Months',
    tag: 'Most Popular',
    tagColor: '#ff8c00',
    price: '$24',
    originalPrice: null,
    billing: 'Quarter',
    savings: 'Save 20%',
    freeTrialText: 'Get 3 Days Free',
    isHighlighted: false,
  },
  {
    id: 'monthly',
    name: '1 Month',
    tag: null,
    tagColor: null,
    price: '$8.4',
    originalPrice: null,
    billing: 'Monthly',
    savings: 'Save 14%',
    freeTrialText: null,
    isHighlighted: false,
  },
];

export default function GetPremiumScreen({
  onGetPremium,
  onContinueFree,
}: GetPremiumScreenProps) {
  const [selectedPlan, setSelectedPlan] = useState<'monthly' | '3month' | 'yearly'>('yearly');

  const handleGetPremium = () => {
    onGetPremium(selectedPlan);
  };

  return (
    <LinearGradient
      colors={['#2c1810', '#3d2317', '#4a2c1a']}
      style={styles.container}
    >
      <ScrollView 
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.backButton}>←</Text>
          <Text style={styles.headerTitle}>Choose your plan</Text>
        </View>

        {/* Subtitle */}
        <Text style={styles.subtitle}>
          You already have subscription.{"\n"}
          You can now upgrade your subscription or choose a different plan at any time and click the "Subscribe" button.
        </Text>

        {/* Subscription Plans */}
        <View style={styles.plansContainer}>
          {subscriptionPlans.map((plan) => (
            <TouchableOpacity
              key={plan.id}
              style={[
                styles.planCard,
                plan.isHighlighted && styles.highlightedCard,
                selectedPlan === plan.id && styles.selectedCard,
              ]}
              onPress={() => setSelectedPlan(plan.id as any)}
            >
              {/* Tag Badge */}
              {plan.tag && (
                <View style={[styles.tagBadge, { backgroundColor: plan.tagColor }]}>
                  <Text style={styles.tagText}>{plan.tag}</Text>
                </View>
              )}

              {/* Plan Content */}
              <View style={styles.planContent}>
                <View style={styles.planLeft}>
                  <Text style={styles.planName}>{plan.name}</Text>
                  <View style={styles.benefitsContainer}>
                    <Text style={styles.benefitText}>• {plan.savings}</Text>
                    {plan.freeTrialText && (
                      <Text style={styles.benefitText}>• {plan.freeTrialText}</Text>
                    )}
                  </View>
                </View>
                
                <View style={styles.planRight}>
                  <View style={styles.priceContainer}>
                    {plan.originalPrice && (
                      <Text style={styles.originalPrice}>{plan.originalPrice}</Text>
                    )}
                    <Text style={styles.price}>{plan.price}</Text>
                  </View>
                  <Text style={styles.billing}>{plan.billing}</Text>
                </View>
              </View>

              {/* Checkmark */}
              <View style={[
                styles.checkmark,
                selectedPlan === plan.id && styles.selectedCheckmark
              ]}>
                {selectedPlan === plan.id && (
                  <Text style={styles.checkmarkIcon}>✓</Text>
                )}
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* Legal Text */}
        <Text style={styles.legalText}>
          If you choose to purchase a subscription, payment will be charged to your iTunes account. Your subscription will automatically renew unless auto-renewal is turned off at least 24 hours before the end of the current period. Your account will be charged for renewal within 24 hours prior to the end of the current period.
        </Text>

        {/* Trial Info */}
        <Text style={styles.trialInfo}>
          Free 7-day trial. Annual plan $9.99/month
        </Text>

        {/* CTA Button */}
        <TouchableOpacity style={styles.ctaButton} onPress={handleGetPremium}>
          <LinearGradient
            colors={['#ff6b35', '#ff8c00', '#ffa500']}
            style={styles.ctaGradient}
          >
            <Text style={styles.ctaText}>Start free trial</Text>
          </LinearGradient>
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
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 40,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 30,
  },
  backButton: {
    fontSize: 24,
    color: '#ffffff',
    marginRight: 16,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#ffffff',
  },
  subtitle: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.7)',
    lineHeight: 20,
    marginBottom: 30,
  },
  plansContainer: {
    marginBottom: 30,
  },
  planCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    position: 'relative',
  },
  highlightedCard: {
    borderColor: '#ff6b35',
    borderWidth: 2,
    shadowColor: '#ff6b35',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 10,
  },
  selectedCard: {
    borderColor: '#ff6b35',
    borderWidth: 2,
  },
  tagBadge: {
    position: 'absolute',
    top: -8,
    left: 20,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  tagText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '700',
  },
  planContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
  },
  planLeft: {
    flex: 1,
  },
  planName: {
    fontSize: 18,
    fontWeight: '700',
    color: '#ffffff',
    marginBottom: 8,
  },
  benefitsContainer: {
    gap: 4,
  },
  benefitText: {
    fontSize: 13,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  planRight: {
    alignItems: 'flex-end',
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  originalPrice: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.5)',
    textDecorationLine: 'line-through',
  },
  price: {
    fontSize: 24,
    fontWeight: '700',
    color: '#ffffff',
  },
  billing: {
    fontSize: 13,
    color: 'rgba(255, 255, 255, 0.7)',
    marginTop: 2,
  },
  checkmark: {
    position: 'absolute',
    top: 20,
    right: 20,
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  selectedCheckmark: {
    backgroundColor: '#ff6b35',
    borderColor: '#ff6b35',
  },
  checkmarkIcon: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  legalText: {
    fontSize: 11,
    color: 'rgba(255, 255, 255, 0.5)',
    lineHeight: 16,
    marginBottom: 16,
  },
  trialInfo: {
    fontSize: 14,
    color: '#ffffff',
    textAlign: 'center',
    marginBottom: 24,
  },
  ctaButton: {
    borderRadius: 25,
    overflow: 'hidden',
    shadowColor: '#ff6b35',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 20,
    elevation: 20,
  },
  ctaGradient: {
    paddingVertical: 18,
    paddingHorizontal: 32,
    alignItems: 'center',
  },
  ctaText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#ffffff',
    letterSpacing: 0.5,
  },
});