'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { User, onAuthStateChanged, signInWithPopup, signOut as firebaseSignOut } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { auth, googleProvider, db } from '@/lib/firebase';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
  userProfile: UserProfile | null;
}

export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  photoURL: string;
  mode: 'homebuyer' | 'investor' | null;
  onboardingComplete: boolean;
  createdAt: Date;
  // Homebuyer fields
  annualIncome?: number;
  monthlyDebt?: number;
  availableSavings?: number;
  downPayment?: number;
  loanTerm?: 15 | 30;
  interestRate?: number;
  creditScore?: string;
  includePMI?: boolean;
  maxMonthlyBudget?: number;
  riskComfort?: 'very-safe' | 'balanced' | 'stretch-ok';
  timeHorizon?: '<5' | '5-10' | '10+';
  // Investor fields
  availableCapital?: number;
  downPaymentPercent?: number;
  targetLoanTerm?: 15 | 30;
  estimatedInterestRate?: number;
  targetCashFlow?: number;
  targetROI?: number;
  holdPeriod?: number;
  riskTolerance?: 'conservative' | 'moderate' | 'aggressive';
  useZillowRent?: boolean;
  vacancyRate?: number;
  maintenancePercent?: number;
  experienceLevel?: 'beginner' | 'intermediate' | 'advanced';
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  signInWithGoogle: async () => {},
  signOut: async () => {},
  userProfile: null,
});

export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setUser(user);
      
      if (user) {
        // Fetch user profile from Firestore
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        if (userDoc.exists()) {
          setUserProfile(userDoc.data() as UserProfile);
        } else {
          // Create initial profile
          const newProfile: UserProfile = {
            uid: user.uid,
            email: user.email || '',
            displayName: user.displayName || '',
            photoURL: user.photoURL || '',
            mode: null,
            onboardingComplete: false,
            createdAt: new Date(),
          };
          await setDoc(doc(db, 'users', user.uid), newProfile);
          setUserProfile(newProfile);
        }
      } else {
        setUserProfile(null);
      }
      
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const signInWithGoogle = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (error: any) {
      console.error('Error signing in with Google:', error);
      throw error;
    }
  };

  const signOut = async () => {
    try {
      await firebaseSignOut(auth);
    } catch (error) {
      console.error('Error signing out:', error);
      throw error;
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, signInWithGoogle, signOut, userProfile }}>
      {children}
    </AuthContext.Provider>
  );
}
