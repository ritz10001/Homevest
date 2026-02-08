import { doc, getDoc } from 'firebase/firestore';
import { db } from './firebase';
import { UserProfile } from './propertyAnalysis';

/**
 * Fetch user profile from Firestore
 */
export async function getUserProfile(uid: string): Promise<UserProfile | null> {
  try {
    const userDoc = await getDoc(doc(db, 'users', uid));
    
    if (!userDoc.exists()) {
      console.error('User profile not found');
      return null;
    }
    
    const data = userDoc.data();
    console.log('🔥 getUserProfile - Full Firestore data:', data);
    
    return {
      uid: data.uid,
      email: data.email,
      displayName: data.displayName,
      mode: data.mode,
      // Homebuyer fields
      annualIncome: data.annualIncome,
      monthlyDebt: data.monthlyDebt,
      availableSavings: data.availableSavings,
      maxMonthlyBudget: data.maxMonthlyBudget,
      downPayment: data.downPayment,
      interestRate: data.interestRate,
      loanTerm: data.loanTerm,
      includePMI: data.includePMI,
      creditScore: data.creditScore,
      riskComfort: data.riskComfort,
      timeHorizon: data.timeHorizon,
      // Investor fields
      availableCapital: data.availableCapital,
      downPaymentPercent: data.downPaymentPercent,
      targetLoanTerm: data.targetLoanTerm,
      estimatedInterestRate: data.estimatedInterestRate,
      targetCashFlow: data.targetCashFlow,
      targetROI: data.targetROI,
      holdPeriod: data.holdPeriod,
      riskTolerance: data.riskTolerance,
      // Common fields
      onboardingComplete: data.onboardingComplete,
      photoURL: data.photoURL,
      createdAt: data.createdAt,
      familySize: data.familySize,
      workLocation: data.workLocation,
      preferences: data.preferences,
    };
  } catch (error) {
    console.error('Error fetching user profile:', error);
    return null;
  }
}

/**
 * Get mock user profile for testing
 */
export function getMockUserProfile(): UserProfile {
  return {
    uid: 'JLh4SmwnfKSkOc9mpEFZmylgZNh2',
    email: 'ritvik11prakash@gmail.com',
    displayName: 'Ritvik Prakash',
    mode: 'homebuyer',
    annualIncome: 100000,
    monthlyDebt: 1000,
    availableSavings: 50000,
    maxMonthlyBudget: 2000,
    downPayment: 2000, // This seems like it should be a percentage or larger amount
    interestRate: 7,
    loanTerm: 30,
    includePMI: true,
    creditScore: 'good',
    riskComfort: 'balanced',
    timeHorizon: '10+',
    onboardingComplete: true,
    photoURL: 'https://lh3.googleusercontent.com/a/ACg8ocLLeOD0iFRbQ1DC6nzrE1oZ0KD_d9r-fTXKskJFlmmMdcBf3rlf=s96-c',
  };
}
