'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Button } from '@/components/ui/button';
import { Loader2, DollarSign, TrendingUp, Target, Clock } from 'lucide-react';

export default function InvestorOnboarding() {
  const { user, userProfile, loading } = useAuth();
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  
  const [formData, setFormData] = useState({
    availableCapital: '',
    downPaymentPercent: '20',
    targetLoanTerm: 30 as 15 | 30,
    estimatedInterestRate: '7.0',
    targetCashFlow: '',
    targetROI: '',
    holdPeriod: '5',
    riskTolerance: 'moderate' as 'conservative' | 'moderate' | 'aggressive',
  });

  useEffect(() => {
    if (!loading && !user) {
      router.push('/auth/signin?mode=investor&redirect=/investor/onboarding');
    }
    if (userProfile?.onboardingComplete && !isComplete) {
      router.push('/investor');
    }
  }, [user, userProfile, loading, router, isComplete]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setSaving(true);
    setIsComplete(true); // Prevent redirect loop
    try {
      await updateDoc(doc(db, 'users', user.uid), {
        mode: 'investor',
        onboardingComplete: true,
        availableCapital: parseFloat(formData.availableCapital),
        downPaymentPercent: parseFloat(formData.downPaymentPercent),
        targetLoanTerm: formData.targetLoanTerm,
        estimatedInterestRate: parseFloat(formData.estimatedInterestRate),
        targetCashFlow: formData.targetCashFlow ? parseFloat(formData.targetCashFlow) : null,
        targetROI: formData.targetROI ? parseFloat(formData.targetROI) : null,
        holdPeriod: parseInt(formData.holdPeriod),
        riskTolerance: formData.riskTolerance,
      });
      // Force navigation after successful save
      window.location.href = '/investor';
    } catch (error) {
      console.error('Error saving onboarding:', error);
      setIsComplete(false);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="w-full px-6 md:px-12 py-4 glass-strong sticky top-0 z-50 border-b border-neutral-200 bg-white">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-hero rounded-xl flex items-center justify-center shadow-glow">
              <span className="text-primary-foreground font-bold text-xl font-display">H</span>
            </div>
            <span className="text-2xl font-bold font-display text-gradient-primary">Homevest</span>
          </div>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-6 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-neutral-900 mb-4">
              Welcome, {userProfile?.displayName?.split(' ')[0]}!
            </h1>
            <p className="text-lg text-neutral-600">
              Let's set up your investment profile to find the best opportunities
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Financial Capacity */}
            <div className="glass-strong rounded-2xl p-8">
              <div className="flex items-center gap-3 mb-6">
                <DollarSign className="w-6 h-6 text-primary" />
                <h2 className="text-2xl font-bold text-neutral-900">Financial Capacity</h2>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    Available Capital *
                  </label>
                  <input
                    type="number"
                    required
                    value={formData.availableCapital}
                    onChange={(e) => setFormData({ ...formData, availableCapital: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-neutral-200 focus:outline-none focus:ring-2 focus:ring-primary/30"
                    placeholder="$100,000"
                  />
                  <p className="text-xs text-neutral-500 mt-1">Total funds available for investment</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    Expected Down Payment % *
                  </label>
                  <input
                    type="number"
                    step="1"
                    required
                    value={formData.downPaymentPercent}
                    onChange={(e) => setFormData({ ...formData, downPaymentPercent: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-neutral-200 focus:outline-none focus:ring-2 focus:ring-primary/30"
                    placeholder="20"
                  />
                  <p className="text-xs text-neutral-500 mt-1">Typical: 20-25% for investment properties</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    Target Loan Term *
                  </label>
                  <select
                    value={formData.targetLoanTerm}
                    onChange={(e) => setFormData({ ...formData, targetLoanTerm: parseInt(e.target.value) as 15 | 30 })}
                    className="w-full px-4 py-3 rounded-xl border border-neutral-200 focus:outline-none focus:ring-2 focus:ring-primary/30"
                  >
                    <option value={30}>30 years</option>
                    <option value={15}>15 years</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    Estimated Interest Rate (%) *
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    required
                    value={formData.estimatedInterestRate}
                    onChange={(e) => setFormData({ ...formData, estimatedInterestRate: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-neutral-200 focus:outline-none focus:ring-2 focus:ring-primary/30"
                    placeholder="7.0"
                  />
                  <p className="text-xs text-neutral-500 mt-1">Investment property rates are typically 0.5-1% higher</p>
                </div>
              </div>
            </div>

            {/* Investment Strategy */}
            <div className="glass-strong rounded-2xl p-8">
              <div className="flex items-center gap-3 mb-6">
                <Target className="w-6 h-6 text-primary" />
                <h2 className="text-2xl font-bold text-neutral-900">Investment Strategy</h2>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    Target Monthly Cash Flow
                  </label>
                  <input
                    type="number"
                    value={formData.targetCashFlow}
                    onChange={(e) => setFormData({ ...formData, targetCashFlow: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-neutral-200 focus:outline-none focus:ring-2 focus:ring-primary/30"
                    placeholder="$500"
                  />
                  <p className="text-xs text-neutral-500 mt-1">Optional: Minimum monthly profit target</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    Target ROI %
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    value={formData.targetROI}
                    onChange={(e) => setFormData({ ...formData, targetROI: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-neutral-200 focus:outline-none focus:ring-2 focus:ring-primary/30"
                    placeholder="8.0"
                  />
                  <p className="text-xs text-neutral-500 mt-1">Optional: Annual return on investment target</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    Hold Period (years) *
                  </label>
                  <input
                    type="number"
                    required
                    value={formData.holdPeriod}
                    onChange={(e) => setFormData({ ...formData, holdPeriod: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-neutral-200 focus:outline-none focus:ring-2 focus:ring-primary/30"
                    placeholder="5"
                  />
                  <p className="text-xs text-neutral-500 mt-1">How long do you plan to hold the property?</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    Risk Tolerance *
                  </label>
                  <select
                    value={formData.riskTolerance}
                    onChange={(e) => setFormData({ ...formData, riskTolerance: e.target.value as any })}
                    className="w-full px-4 py-3 rounded-xl border border-neutral-200 focus:outline-none focus:ring-2 focus:ring-primary/30"
                  >
                    <option value="conservative">Conservative</option>
                    <option value="moderate">Moderate</option>
                    <option value="aggressive">Aggressive</option>
                  </select>
                  <p className="text-xs text-neutral-500 mt-1">Your comfort level with investment risk</p>
                </div>
              </div>
            </div>

            {/* Info Box */}
            <div className="bg-primary/5 border border-primary/20 rounded-2xl p-6">
              <div className="flex gap-3">
                <TrendingUp className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-semibold text-neutral-900 mb-2">What's Next?</h3>
                  <p className="text-sm text-neutral-700">
                    Based on your investment profile, Sarah will help you analyze properties for cash flow potential, 
                    ROI projections, and market opportunities. You'll get detailed financial breakdowns and investment 
                    recommendations tailored to your goals.
                  </p>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex justify-center">
              <Button
                type="submit"
                variant="hero"
                size="xl"
                disabled={saving}
                className="rounded-xl min-w-[280px]"
              >
                {saving ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Saving...
                  </>
                ) : (
                  'Complete Onboarding'
                )}
              </Button>
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  );
}
