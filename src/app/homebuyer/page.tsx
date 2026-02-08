'use client';

import { motion } from 'framer-motion';
import { Sparkles, Heart, Shield, TrendingUp, Home, MessageCircle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { PropertySearch } from '@/components/landing/PropertySearch';
import { AnimatedMapBackground } from '@/components/ui/animated-map-background';
import { useRouter } from 'next/navigation';

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
    icon: Heart,
    title: 'Avoid Being House-Poor',
    description: 'Sarah helps you find homes that fit your budget without sacrificing your lifestyle.',
  },
  {
    icon: Shield,
    title: 'Safe Neighborhoods',
    description: 'Discover walkable communities with low crime rates and family-friendly amenities.',
  },
  {
    icon: TrendingUp,
    title: 'Smart Investment',
    description: 'Get AI-powered insights on property value trends and long-term appreciation.',
  },
  {
    icon: Home,
    title: 'Good Schools Nearby',
    description: 'Find homes near top-rated schools for your family\'s future.',
  },
];

export default function HomebuyerIntro() {
  const router = useRouter();

  const handleSearch = () => {
    // Navigate to map regardless of query
    router.push('/homebuyer/map');
  };

  return (
    <div className="min-h-screen">
      {/* Navigation */}
      <nav className="w-full px-6 md:px-12 py-4 glass-strong sticky top-0 z-50 border-b border-neutral-200 bg-white">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-hero rounded-xl flex items-center justify-center shadow-glow">
              <span className="text-primary-foreground font-bold text-xl font-display">
                H
              </span>
            </div>
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
              Homebuyer Mode
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
              Meet Homepilot,
              <br />
              <span className="bg-gradient-to-r from-neutral-900 to-green-600 bg-clip-text text-transparent">Your AI Home Advisor</span>
            </h1>
            <p className="text-lg md:text-xl text-neutral-700 max-w-2xl mx-auto leading-relaxed">
              Homepilot is your personal AI mentor for first-time homebuying. She helps you find homes
              that fit your budget, lifestyle, and dreams—without the stress.
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
            <PropertySearch mode="homebuyer" onSearch={handleSearch} />
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
              What Homepilot Helps You With
            </h2>
            <p className="text-lg text-neutral-600 max-w-2xl mx-auto">
              Your AI advisor understands what matters most to first-time buyers
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

        {/* Sarah AI Card */}
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
                  Sarah's Promise to You
                </h3>
                <p className="text-neutral-600">Your AI mentor for confident homebuying</p>
              </div>
            </div>
            <div className="space-y-4 text-neutral-700 leading-relaxed">
              <p>
                "Hi! I'm Sarah, your AI home advisor. I know buying your first home can feel
                overwhelming—there's so much to consider, and you want to make the right choice.
              </p>
              <p>
                That's where I come in. I'll help you understand what you can truly afford, find
                neighborhoods that match your lifestyle, and avoid common first-time buyer mistakes.
                Think of me as your knowledgeable friend who's been through this before.
              </p>
              <p className="font-semibold text-neutral-900">
                Let's find your perfect home together—one that fits your budget, your dreams, and
                your future."
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
              Ready to Start Your Journey?
            </h2>
            <p className="text-lg text-neutral-600 mb-8">
              Search for homes and let Sarah guide you to the perfect match
            </p>
          </motion.div>
        </div>
        </section>
      </main>
    </div>
  );
}
