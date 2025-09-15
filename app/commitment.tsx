import { router } from 'expo-router';
import React from 'react';
import CommitmentAgreementScreen from '../components/CommitmentAgreementScreen';

export default function CommitmentPage() {
  const handleCommitmentSigned = (signature: string) => {
    // TODO: Save signature to AsyncStorage
    console.log('Commitment signed with signature:', signature);
    
    // Navigate to quiz motivation screen
    router.push('./quiz-motivation');
  };

  return (
    <CommitmentAgreementScreen onCommitmentSigned={handleCommitmentSigned} />
  );
}