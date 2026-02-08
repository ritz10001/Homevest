'use client';

import { useState, useRef, useEffect } from 'react';
import { Send, MessageCircle, Sparkles, Home, ShieldCheck, GraduationCap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const quickActions = [
  { icon: Home, label: 'Property details' },
  { icon: ShieldCheck, label: 'Neighborhood safety' },
  { icon: GraduationCap, label: 'School ratings' },
];

export function ChatInterface() {
  const [message, setMessage] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <div className="h-full flex flex-col bg-background rounded-2xl overflow-hidden border border-border shadow-xl">
      {/* Chat Header */}
      <div className="p-6 border-b border-border bg-gradient-to-r from-primary/10 via-primary/5 to-transparent backdrop-blur-sm">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-12 h-12 bg-gradient-to-br from-primary to-primary/70 rounded-full flex items-center justify-center shadow-lg shadow-primary/25">
              <MessageCircle className="w-6 h-6 text-primary-foreground" />
            </div>
            {/* Online indicator */}
            <span className="absolute bottom-0 right-0 block w-3.5 h-3.5 rounded-full bg-emerald-400 ring-2 ring-background" />
            <span className="absolute bottom-0 right-0 block w-3.5 h-3.5 rounded-full bg-emerald-400 animate-pulse-ring" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-foreground tracking-tight">Chat with Sarah</h3>
            <p className="text-sm text-muted-foreground flex items-center gap-1.5">
              <Sparkles className="w-3 h-3 text-primary" />
              Your AI Home Advisor
            </p>
          </div>
        </div>
      </div>

      {/* Chat Messages Area */}
      <div className="flex-1 p-6 overflow-y-auto bg-gradient-to-b from-muted/30 to-background">
        <div className="flex flex-col items-center justify-center h-full text-center">
          {/* Floating animated icon */}
          <div className="w-16 h-16 bg-gradient-to-br from-primary/20 to-primary/5 rounded-full flex items-center justify-center mb-4 animate-float ring-1 ring-primary/10">
            <MessageCircle className="w-8 h-8 text-primary" />
          </div>

          <h4 className="text-lg font-semibold text-foreground mb-2 animate-fade-in-up">
            Ask Sarah Anything
          </h4>
          <p className="text-sm text-muted-foreground max-w-sm leading-relaxed animate-fade-in-up [animation-delay:100ms]">
            Get personalized insights about this property, neighborhood safety, school ratings,
            and more.
          </p>

          {/* Quick action chips */}
          <div className="flex flex-wrap justify-center gap-2 mt-6 animate-fade-in-up [animation-delay:200ms]">
            {quickActions.map((action) => (
              <button
                key={action.label}
                type="button"
                onClick={() => {
                  setMessage(action.label);
                  inputRef.current?.focus();
                }}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium
                  bg-muted text-muted-foreground border border-border
                  hover:bg-primary/10 hover:text-primary hover:border-primary/30
                  transition-all duration-200 cursor-pointer"
              >
                <action.icon className="w-3 h-3" />
                {action.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Chat Input */}
      <div className="p-6 border-t border-border bg-background">
        <div
          className={cn(
            'flex gap-2 p-1.5 rounded-xl border transition-all duration-300',
            isFocused
              ? 'border-primary/50 shadow-[0_0_0_3px_hsl(var(--primary)/0.1)] bg-background'
              : 'border-border bg-muted/50'
          )}
        >
          <input
            ref={inputRef}
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            placeholder="Ask about this property..."
            className="flex-1 px-4 py-3 bg-transparent text-sm text-foreground placeholder:text-muted-foreground focus:outline-none"
            onKeyDown={(e) => {
              if (e.key === 'Enter' && message.trim()) {
                setMessage('');
              }
            }}
          />
          <Button
            variant="default"
            size="default"
            className={cn(
              'rounded-xl px-4 transition-all duration-300 shrink-0',
              message.trim()
                ? 'bg-primary text-primary-foreground shadow-md shadow-primary/25 hover:shadow-lg hover:shadow-primary/30 scale-100'
                : 'opacity-50 scale-95'
            )}
            disabled={!message.trim()}
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
        <p className="text-xs text-muted-foreground mt-2 text-center">
          Powered by AI &middot; Responses may vary
        </p>
      </div>
    </div>
  );
}
