'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Button } from '@/components/ui/button';
import { Loader2, DollarSign, Home, TrendingUp, Clock } from 'lucide-react';

export default function HomebuyerOnboarding() {
  const { user, userProfile, loading } = useAuth();
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  
  const [formData, setFormData] = useState({
    annualIncome: '',
    monthlyDebt: '',
    availableSavings: '',
    downPayment: '',
    loanTerm: 30 as 15 | 30,
    interestRate: '7.0',
    creditScore: '',
    includePMI: true,
    maxMonthlyBudget: '',
    riskComfort: 'balanced' as 'very-safe' | 'balanced' | 'stretch-ok',
    timeHorizon: '5-10' as '<5' | '5-10' | '10+',
  });

  useEffect(() => {
    if (!loading && !user) {
      router.push('/auth/signin?mode=homebuyer&redirect=/homebuyer/onboarding');
    }
    if (userProfile?.onboardingComplete) {
      router.push('/homebuyer');
    }
  }, [user, userProfile, loading, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setSaving(true);
    try {
      await updateDoc(doc(db, 'users', user.uid), {
        mode: 'homebuyer',
        onboardingComplete: true,
        annualIncome: parseFloat(formData.annualIncome),
        monthlyDebt: parseFloat(formData.monthlyDebt),
        availableSavings: parseFloat(formData.availableSavings),
        downPayment: parseFloat(formData.downPayment),
        loanTerm: formData.loanTerm,
        interestRate: parseFloat(formData.interestRate),
        creditScore: formData.creditScore,
        includePMI: formData.includePMI,
        maxMonthlyBudget: parseFloat(formData.maxMonthlyBudget),
        riskComfort: formData.riskComfort,
        timeHorizon: formData.timeHorizon,
      });
      router.push('/homebuyer');
    } catch (error) {
      console.error('Error saving onboarding:', error);
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
              Let's Get Started, {userProfile?.displayName?.split(' ')[0]}!
            </h1>
            <p className="text-lg text-neutral-600">
              Tell us about your financial situation so Sarah can help you find the perfect home
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Financial Profile */}
            <div className="glass-strong rounded-2xl p-8">
              <div className="flex items-center gap-3 mb-6">
                <DollarSign className="w-6 h-6 text-primary" />
                <h2 className="text-2xl font-bold text-neutral-900">Financial Profile</h2>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    Annual Gross Income *
                  </label>
                  <input
                    type="number"
                    required
                    value={formData.annualIncome}
                    onChange={(e) => setFormData({ ...formData, annualIncome: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-neutral-200 focus:outline-none focus:ring-2 focus:ring-primary/30"
                    placeholder="$75,000"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    Monthly Debt Payments *
                  </label>
                  <input
                    type="number"
                    required
                    value={formData.monthlyDebt}
                    onChange={(e) => setFormData({ ...formData, monthlyDebt: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-neutral-200 focus:outline-none focus:ring-2 focus:ring-primary/30"
                    placeholder="$800"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    Available Savings *
                  </label>
                  <input
                    type="number"
                    required
                    value={formData.availableSavings}
                    onChange={(e) => setFormData({ ...formData, availableSavings: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-neutral-200 focus:outline-none focus:ring-2 focus:ring-primary/30"
                    placeholder="$30,000"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    Planned Down Payment *
                  </label>
                  <input
                    type="number"
                    required
                    value={formData.downPayment}
                    onChange={(e) => setFormData({ ...formData, downPayment: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-neutral-200 focus:outline-none focus:ring-2 focus:ring-primary/30"
                    placeholder="$25,000"
                  />
                </div>
              </div>
            </div>

            {/* Loan Preferences */}
            <div className="glass-strong rounded-2xl p-8">
              <div className="flex items-center gap-3 mb-6">
                <Home className="w-6 h-6 text-primary" />
                <h2 className="text-2xl font-bold text-neutral-900">Loan Preferences</h2>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    Loan Term *
                  </label>
                  <select
                    value={formData.loanTerm}
                    onChange={(e) => setFormData({ ...formData, loanTerm: parseInt(e.target.value) as 15 | 30 })}
                    className="w-full px-4 py-3 rounded-xl border border-neutral-200 focus:outline-none focus:ring-2 focus:ring-primary/30"
                  >
                    <option value={30}>30 years</option>
                    <option value={15}>15 years</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    Interest Rate (%) *
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    required
                    value={formData.interestRate}
                    onChange={(e) => setFormData({ ...formData, interestRate: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-neutral-200 focus:outline-none focus:ring-2 focus:ring-primary/30"
                    placeholder="7.0"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    Credit Score Range
                  </label>
                  <select
                    value={formData.creditScore}
                    onChange={(e) => setFormData({ ...formData, creditScore: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-neutral-200 focus:outline-none focus:ring-2 focus:ring-primary/30"
                  >
                    <option value="">Select range</option>
                    <option value="excellent">Excellent (750+)</option>
                    <option value="good">Good (700-749)</option>
                    <option value="fair">Fair (650-699)</option>
                    <option value="poor">Poor (&lt;650)</option>
                  </select>
                </div>

                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    id="pmi"
                    checked={formData.includePMI}
                    onChange={(e) => setFormData({ ...formData, includePMI: e.target.checked })}
                    className="w-5 h-5 rounded border-neutral-300 text-primary focus:ring-primary"
                  />
                  <label htmlFor="pmi" className="text-sm font-medium text-neutral-700">
                    Include PMI (if down payment &lt; 20%)
                  </label>
                </div>
              </div>
            </div>

            {/* Monthly Comfort Zone */}
            <div className="glass-strong rounded-2xl p-8">
              <div className="flex items-center gap-3 mb-6">
                <TrendingUp className="w-6 h-6 text-primary" />
                <h2 className="text-2xl font-bold text-neutral-900">Monthly Comfort Zone</h2>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    Max Comfortable Monthly Budget *
                  </label>
                  <input
                    type="number"
                    required
                    value={formData.maxMonthlyBudget}
                    onChange={(e) => setFormData({ ...formData, maxMonthlyBudget: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-neutral-200 focus:outline-none focus:ring-2 focus:ring-primary/30"
                    placeholder="$2,500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    Risk Comfort *
                  </label>
                  <select
                    value={formData.riskComfort}
                    onChange={(e) => setFormData({ ...formData, riskComfort: e.target.value as any })}
                    className="w-full px-4 py-3 rounded-xl border border-neutral-200 focus:outline-none focus:ring-2 focus:ring-primary/30"
                  >
                    <option value="very-safe">Very Safe</option>
                    <option value="balanced">Balanced</option>
                    <option value="stretch-ok">Stretch OK</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Time Horizon */}
            <div className="glass-strong rounded-2xl p-8">
              <div className="flex items-center gap-3 mb-6">
                <Clock className="w-6 h-6 text-primary" />
                <h2 className="text-2xl font-bold text-neutral-900">Time Horizon</h2>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  Planning to stay *
                </label>
                <select
                  value={formData.timeHorizon}
                  onChange={(e) => setFormData({ ...formData, timeHorizon: e.target.value as any })}
                  className="w-full px-4 py-3 rounded-xl border border-neutral-200 focus:outline-none focus:ring-2 focus:ring-primary/30"
                >
                  <option value="<5">&lt;5 years</option>
                  <option value="5-10">5–10 years</option>
                  <option value="10+">10+ years</option>
                </select>
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
