import { router } from 'expo-router';
import React from 'react';
import CommitmentAgreementScreen from '../components/CommitmentAgreementScreen';

export default function CommitmentPage() {
  const handleCommitmentSigned = (signature: string) => {
    // Save signature to storage
    // Commitment signed successfully
    
    // Navigate to quiz motivation screen
    router.push('./quiz-motivation');
  };

  return (
    <CommitmentAgreementScreen onCommitmentSigned={handleCommitmentSigned} />
  );
}