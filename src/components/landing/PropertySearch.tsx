'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

type Mode = 'homebuyer' | 'investor';

interface PropertySearchProps {
  mode?: Mode;
  onSearch?: (query: string) => void;
}

export function PropertySearch({ mode = 'homebuyer', onSearch }: PropertySearchProps) {
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = () => {
    if (onSearch) {
      onSearch(searchQuery);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="glass-strong rounded-2xl p-6 shadow-card"
    >
      <p className="text-sm text-neutral-600 mb-4 font-medium">
        {mode === 'homebuyer'
          ? 'Find your dream home with AI-powered recommendations'
          : 'Discover high-return investment properties'}
      </p>
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400 pointer-events-none z-10" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={
              mode === 'homebuyer'
                ? 'Enter city, neighborhood, or ZIP code...'
                : 'Enter market or property address...'
            }
            className="w-full pl-11 pr-4 py-3 rounded-xl bg-white border border-neutral-200 text-sm text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
          />
        </div>
        <Button
          variant="hero"
          size="default"
          className="shrink-0 rounded-xl gap-2 px-6"
          onClick={handleSearch}
        >
          {mode === 'homebuyer' ? 'Search Homes' : 'Analyze Market'}
          <ArrowRight className="w-4 h-4" />
        </Button>
      </div>
    </motion.div>
  );
}
