'use client';

import { motion } from 'framer-motion';
import { Zap, Shield, TrendingUp, ArrowRight, Sparkles, LogOut } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ModeSelector } from '@/components/landing/ModeSelector';
import { AnimatedMapBackground } from '@/components/ui/animated-map-background';
import { LoadingScreen } from '@/components/ui/loading-screen';
import { Logo } from '@/components/ui/logo';
import { useAuth } from '@/contexts/AuthContext';
import Image from 'next/image';

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { 
      delay: i * 0.1, 
      duration: 0.6, 
      ease: [0.22, 1, 0.36, 1] as [number, number, number, number]
    },
  }),
};

const trustCards = [
  {
    icon: Zap,
    title: 'Instant Analysis',
    description: 'Get property insights in seconds with our advanced AI engine',
  },
  {
    icon: Shield,
    title: 'Trusted Platform',
    description: 'Secure and reliable real estate intelligence you can count on',
  },
  {
    icon: TrendingUp,
    title: 'Smart Decisions',
    description: 'Data-driven insights for confident investing and buying',
  },
];

export function LandingPageClient() {
  const { user, loading, signOut } = useAuth();

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  // Show loading screen while checking auth status
  if (loading) {
    return <LoadingScreen message="Welcome to Homevest..." />;
  }

  return (
    <div className="min-h-screen font-body">
      {/* Navigation */}
      <nav className="w-full px-6 md:px-12 py-4 glass-strong sticky top-0 z-50 bg-white">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Logo size="sm" />
            <span className="text-2xl font-bold font-display text-gradient-primary">
              Homevest
            </span>
          </div>
          <div className="hidden md:flex items-center gap-1">
            <Button variant="ghost" size="sm">
              Home
            </Button>
            <Button variant="ghost" size="sm">
              About
            </Button>
            <Button variant="ghost" size="sm">
              Features
            </Button>
            {user ? (
              <div className="ml-4">
                <Button variant="ghost" size="sm" onClick={handleSignOut}>
                  <LogOut className="w-4 h-4" />
                  Sign Out
                </Button>
              </div>
            ) : (
              <div className="ml-4">
                <Button variant="hero" size="sm">
                  Get Started
                  <ArrowRight className="w-3.5 h-3.5" />
                </Button>
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main role="main" className="relative">
        {/* Hero Section with Map Background */}
        <section className="relative overflow-hidden min-h-screen">
          {/* Map Background Layer - Direct iframe test */}
          <div className="absolute inset-0 -z-20">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d189474.0!2d-71.05773268455701!3d42.36008797918487!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f11.5!3m3!1m2!1s0x89e370a5cb30cc5f%3A0xc53a8e6489686c87!2sBoston%2C%20MA!5e0!3m2!1sen!2sus!4v1234567890"
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

          {/* Hero Content */}
          <div className="relative z-10 max-w-6xl mx-auto px-6 md:px-12 pt-16 md:pt-24 pb-20 md:pb-32">
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
                AI-Powered Investment Analysis
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
                Find Your Perfect Home
                <br />
                <span className="bg-gradient-to-r from-neutral-900 to-green-600 bg-clip-text text-transparent">In Seconds</span>
              </h1>
              <p className="text-lg md:text-xl text-neutral-700 max-w-2xl mx-auto leading-relaxed font-body">
                Get instant AI-powered insights for real estate decisions. Whether you're a
                first-time homebuyer or seasoned investor, we guide you every step of the way.
              </p>
            </motion.div>

            {/* Mode Selector CTAs */}
            <motion.div
              initial="hidden"
              animate="visible"
              custom={2}
              variants={fadeIn}
              className="mb-20"
            >
              <ModeSelector />
            </motion.div>

            {/* Hero Image */}
            <motion.div
              initial="hidden"
              animate="visible"
              custom={3}
              variants={fadeIn}
              className="relative"
            >
              <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-border/50">
                <Image
                  src="/hero-real-estate.jpg"
                  alt="Beautiful luxury neighborhood with modern homes at golden hour"
                  width={1200}
                  height={420}
                  className="w-full h-[300px] md:h-[420px] object-cover"
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                <div className="absolute bottom-6 left-6 right-6 flex items-end justify-between">
                  <div>
                    <p className="text-sm font-medium text-white/80 mb-1">Featured Properties</p>
                    <p className="text-2xl font-bold font-display text-white">
                      1,000+ Homes Analyzed
                    </p>
                  </div>
                  <Button variant="gold" size="sm" className="rounded-xl">
                    Explore <ArrowRight className="w-3.5 h-3.5" />
                  </Button>
                </div>
              </div>
            </motion.div>

            {/* Trust Indicators */}
            <div className="mt-24 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
              {trustCards.map((card, i) => (
                <motion.div
                  key={card.title}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, margin: '-50px' }}
                  custom={i}
                  variants={fadeIn}
                  className="group flex flex-col items-center text-center gap-4 p-8 rounded-2xl glass shadow-card hover:shadow-card-hover transition-all duration-300 hover:-translate-y-1"
                >
                  <div className="w-14 h-14 rounded-2xl bg-gradient-hero flex items-center justify-center shadow-glow group-hover:scale-110 transition-transform duration-300">
                    <card.icon className="w-6 h-6 text-primary-foreground" />
                  </div>
                  <h3 className="font-semibold text-neutral-900 text-lg font-display">
                    {card.title}
                  </h3>
                  <p className="text-sm text-neutral-700 leading-relaxed">
                    {card.description}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="border-t border-border/50 py-8 px-6 md:px-12">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <Logo size="sm" className="w-7 h-7" />
              <span className="font-semibold font-display text-neutral-900">Homevest</span>
            </div>
            <p className="text-sm text-neutral-700">
              © 2026 Homevest. All rights reserved.
            </p>
          </div>
        </footer>
      </main>
    </div>
  );
}
