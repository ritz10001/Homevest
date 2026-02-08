'use client';

import { useRouter } from 'next/navigation';
import { Home, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';

export function ModeSelector() {
  const router = useRouter();
  const { user, loading } = useAuth();

  const handleModeSelection = (mode: 'homebuyer' | 'investor') => {
    if (!user && !loading) {
      // Redirect to sign-in with mode parameter
      router.push(`/auth/signin?mode=${mode}&redirect=/${mode}/onboarding`);
      return;
    }

    if (mode === 'homebuyer') {
      try {
        router.push('/homebuyer/onboarding');
      } catch (error) {
        console.error('Client-side navigation failed:', error);
        window.location.href = '/homebuyer/onboarding';
      }
    } else if (mode === 'investor') {
      try {
        router.push('/investor/onboarding');
      } catch (error) {
        console.error('Client-side navigation failed:', error);
        window.location.href = '/investor/onboarding';
      }
    }
  };

  return (
    <nav aria-label="Mode selection" className="flex flex-col sm:flex-row justify-center gap-4">
      {/* Homebuyer CTA - Primary, Functional */}
      <Button
        variant="hero"
        size="xl"
        className="rounded-xl gap-2 min-w-[280px]"
        onClick={() => handleModeSelection('homebuyer')}
        aria-label="Select homebuyer mode to access first-time homebuyer features"
        disabled={loading}
      >
        <Home className="w-5 h-5" />
        I'm Buying My First Home
      </Button>

      {/* Investor CTA - Now Functional */}
      <Button
        variant="hero-outline"
        size="xl"
        className="rounded-xl gap-2 min-w-[280px]"
        onClick={() => handleModeSelection('investor')}
        aria-label="Select investor mode to access investment features"
        disabled={loading}
      >
        <TrendingUp className="w-5 h-5" />
        I'm an Investor
      </Button>
    </nav>
  );
}
