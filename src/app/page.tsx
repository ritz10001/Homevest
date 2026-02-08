import { Metadata } from 'next';
import { LandingPageClient } from '@/components/landing/LandingPageClient';

export const metadata: Metadata = {
  title: 'Homevest - AI-Powered Real Estate for Homebuyers & Investors',
  description:
    "Make smarter real estate decisions with AI-powered insights. Whether you're buying your first home or investing in properties, Homevest guides you every step of the way.",
  keywords: [
    'real estate',
    'homebuyer',
    'investor',
    'AI',
    'property analysis',
    'home buying',
    'real estate investment',
  ],
  openGraph: {
    title: 'Homevest - AI-Powered Real Estate',
    description: 'Make smarter real estate decisions with AI-powered insights',
    type: 'website',
  },
};

export default function LandingPage() {
  return <LandingPageClient />;
}
