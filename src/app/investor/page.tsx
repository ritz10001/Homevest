'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { ArrowLeft, TrendingUp, Loader2 } from 'lucide-react';

export default function InvestorDashboard() {
  const { user, userProfile, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (!user) {
        router.push('/auth/signin?mode=investor&redirect=/investor');
      } else if (!userProfile?.onboardingComplete) {
        router.push('/investor/onboarding');
      }
    }
  }, [user, userProfile, loading, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-primary-50 to-white flex items-center justify-center p-6">
      <div className="max-w-2xl w-full bg-white rounded-2xl shadow-xl p-12 text-center border border-primary-100">
        <div className="w-20 h-20 bg-linear-to-br from-primary-500 to-primary-700 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-primary-500/30">
          <TrendingUp className="w-10 h-10 text-white" />
        </div>
        <h1 className="text-4xl md:text-5xl font-bold text-neutral-900 mb-4">
          Welcome, {userProfile?.displayName?.split(' ')[0]}!
        </h1>
        <p className="text-xl text-primary-600 mb-6 font-semibold">
          Investor Dashboard Coming Soon
        </p>
        <p className="text-neutral-600 mb-8 leading-relaxed">
          Your investment profile is set up! The full investor dashboard with property analysis, 
          ROI calculations, and portfolio management tools will be available in the next release.
        </p>
        <Button asChild size="lg">
          <a href="/">
            <ArrowLeft className="w-5 h-5" />
            Back to Home
          </a>
        </Button>
      </div>
    </div>
  );
}
