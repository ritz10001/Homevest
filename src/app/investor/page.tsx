'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Sparkles, TrendingUp, Shield, DollarSign, BarChart3, MessageCircle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Logo } from '@/components/ui/logo';
import { PropertySearch } from '@/components/landing/PropertySearch';
import { useAuth } from '@/contexts/AuthContext';
import { LoadingScreen } from '@/components/ui/loading-screen';

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.1,
      duration: 0.6,
      ease: [0.22, 1, 0.36, 1] as [number, number, number, number],
    },
  }),
};

const features = [
  {
    icon: DollarSign,
    title: 'Maximize Cash Flow',
    description: 'William helps you identify properties with strong rental income potential and positive cash flow.',
  },
  {
    icon: TrendingUp,
    title: 'ROI Analysis',
    description: 'Get detailed return on investment calculations and long-term appreciation forecasts.',
  },
  {
    icon: BarChart3,
    title: 'Market Intelligence',
    description: 'Access AI-powered market trends, comparable sales, and investment opportunity scoring.',
  },
  {
    icon: Shield,
    title: 'Risk Assessment',
    description: 'Understand potential risks and mitigation strategies for each investment property.',
  },
];

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

  const handleSearch = () => {
    // Navigate to map (will be investor map in future)
    router.push('/homebuyer/map'); // TODO: Create /investor/map
  };

  if (loading) {
    return <LoadingScreen message="Loading your investor dashboard..." />;
  }

  return (
    <div className="min-h-screen">
      {/* Navigation */}
      <nav className="w-full px-6 md:px-12 py-4 glass-strong sticky top-0 z-50 border-b border-neutral-200 bg-white">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Logo size="sm" />
            <span className="text-2xl font-bold font-display text-gradient-primary">
              Homevest
            </span>
          </div>
          <div className="hidden md:flex items-center gap-1">
            <Button variant="ghost" size="sm" asChild>
              <a href="/">Home</a>
            </Button>
            <Button variant="ghost" size="sm">
              About
            </Button>
            <Button variant="ghost" size="sm">
              Features
            </Button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="relative">
        {/* Hero Section with Map Background */}
        <section className="relative overflow-hidden min-h-screen">
          {/* Map Background Layer */}
          <div className="absolute inset-0 -z-20">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d221841.45324024116!2d-95.55971639453125!3d29.817178799999998!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8640b8b4488d8501%3A0xca0d02def365053b!2sHouston%2C%20TX!5e0!3m2!1sen!2sus!4v1234567890"
              width="100%"
              height="100%"
              style={{ border: 0, filter: "grayscale(100%) brightness(0.6)" }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>

          {/* Gradient overlay */}
          <div className="absolute inset-0 -z-10 bg-gradient-to-b from-background/80 via-background/40 to-background/80" />

        {/* Hero Section */}
        <div className="relative z-10 max-w-6xl mx-auto px-6 md:px-12 pt-8 md:pt-12 pb-12">
          {/* Badge */}
          <motion.div
            initial="hidden"
            animate="visible"
            custom={0}
            variants={fadeIn}
            className="flex justify-center mb-10"
          >
            <Badge variant="glow" className="gap-2 text-sm py-2.5 px-5">
              <Sparkles className="w-4 h-4" />
              Investor Mode
            </Badge>
          </motion.div>

          {/* Headline */}
          <motion.div
            initial="hidden"
            animate="visible"
            custom={1}
            variants={fadeIn}
            className="text-center mb-8 space-y-6"
          >
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight leading-[1.1] font-display text-neutral-900">
              Meet William,
              <br />
              <span className="bg-gradient-to-r from-neutral-900 to-green-600 bg-clip-text text-transparent">Your AI Investment Advisor</span>
            </h1>
            <p className="text-lg md:text-xl text-neutral-700 max-w-2xl mx-auto leading-relaxed">
              William is your personal AI mentor for real estate investing. He helps you analyze properties,
              maximize returns, and build wealth through strategic real estate investments.
            </p>
          </motion.div>
        </div>

        {/* Search Section */}
        <div className="relative z-10 max-w-3xl mx-auto px-6 md:px-12 pb-12">
          <motion.div
            initial="hidden"
            animate="visible"
            custom={2}
            variants={fadeIn}
          >
            <PropertySearch mode="investor" onSearch={handleSearch} />
          </motion.div>
        </div>

        {/* Features Grid */}
        <div className="relative z-10 max-w-6xl mx-auto px-6 md:px-12 py-16">
          <motion.div
            initial="hidden"
            animate="visible"
            custom={3}
            variants={fadeIn}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-neutral-900 mb-4">
              What William Helps You With
            </h2>
            <p className="text-lg text-neutral-600 max-w-2xl mx-auto">
              Your AI advisor understands what matters most to real estate investors
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {features.map((feature, i) => (
              <motion.div
                key={feature.title}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: '-50px' }}
                custom={i + 4}
                variants={fadeIn}
                className="group flex gap-4 p-6 rounded-2xl glass shadow-card hover:shadow-card-hover transition-all duration-300 hover:-translate-y-1"
              >
                <div className="w-12 h-12 rounded-xl bg-gradient-hero flex items-center justify-center shadow-glow group-hover:scale-110 transition-transform duration-300 shrink-0">
                  <feature.icon className="w-6 h-6 text-primary-foreground" />
                </div>
                <div>
                  <h3 className="font-semibold text-neutral-900 text-lg mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-sm text-neutral-600 leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* William AI Card */}
        <div className="relative z-10 max-w-4xl mx-auto px-6 md:px-12 py-16">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            custom={8}
            variants={fadeIn}
            className="glass-strong rounded-2xl p-8 md:p-12 border-2 border-primary-200 shadow-xl"
          >
            <div className="flex items-start gap-4 mb-6">
              <div className="w-16 h-16 bg-gradient-hero rounded-full flex items-center justify-center shadow-glow shrink-0">
                <MessageCircle className="w-8 h-8 text-white" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-neutral-900 mb-2">
                  William's Promise to You
                </h3>
                <p className="text-neutral-600">Your AI mentor for strategic investing</p>
              </div>
            </div>
            <div className="space-y-4 text-neutral-700 leading-relaxed">
              <p>
                "Hello! I'm William, your AI investment advisor. I understand that real estate investing
                requires careful analysis, strategic thinking, and data-driven decision making.
              </p>
              <p>
                I'm here to help you evaluate properties based on cash flow potential, ROI projections,
                market trends, and risk factors. Whether you're buying your first rental property or
                expanding your portfolio, I'll provide the insights you need to make confident investment decisions.
              </p>
              <p className="font-semibold text-neutral-900">
                Let's build your real estate portfolio together—with data, strategy, and smart analysis."
              </p>
            </div>
          </motion.div>
        </div>

        {/* CTA Section */}
        <div className="relative z-10 max-w-4xl mx-auto px-6 md:px-12 py-16 text-center">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            custom={9}
            variants={fadeIn}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-neutral-900 mb-4">
              Ready to Find Your Next Investment?
            </h2>
            <p className="text-lg text-neutral-600 mb-8">
              Search for properties and let William analyze the investment potential
            </p>
          </motion.div>
        </div>
        </section>
      </main>
    </div>
  );
}
