'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Send, Sparkles, MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import dynamic from 'next/dynamic';

// Dynamically import map to avoid SSR issues
const DynamicPropertyMap = dynamic(
  () => import('@/components/homebuyer/PropertyMap').then((mod) => mod.PropertyMap),
  { ssr: false }
);

interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

interface ComparisonData {
  timestamp: string;
  userData: any;
  propertyCount: number;
  properties: Array<{
    propertyData: any;
    aiInsights: any;
  }>;
}

export default function ComparisonPage() {
  const router = useRouter();
  const [comparisonData, setComparisonData] = useState<ComparisonData | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [initialAnalysis, setInitialAnalysis] = useState<string>('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Load comparison data
  useEffect(() => {
    fetch('/api/get-comparison-data')
      .then(res => res.json())
      .then(data => {
        setComparisonData(data);
        // Generate initial analysis
        generateInitialAnalysis(data);
      })
      .catch(err => {
        console.error('Failed to load comparison data:', err);
        alert('No comparison data found. Please select properties to compare first.');
        router.push('/homebuyer/map');
      });
  }, [router]);

  const generateInitialAnalysis = async (data: ComparisonData) => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/compare-properties', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ comparisonData: data, isInitial: true }),
      });

      const result = await response.json();
      setInitialAnalysis(result.analysis);
      
      // Add as first message
      setMessages([{
        role: 'assistant',
        content: result.analysis,
        timestamp: new Date(),
      }]);
    } catch (error) {
      console.error('Failed to generate initial analysis:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || !comparisonData) return;

    const userMessage: Message = {
      role: 'user',
      content: inputMessage,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/compare-properties', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          comparisonData,
          userMessage: inputMessage,
          conversationHistory: messages,
        }),
      });

      const result = await response.json();
      
      const assistantMessage: Message = {
        role: 'assistant',
        content: result.analysis,
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Failed to get response:', error);
      const errorMessage: Message = {
        role: 'assistant',
        content: 'Sorry, I encountered an error. Please try again.',
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  if (!comparisonData) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-neutral-600">Loading comparison data...</p>
        </div>
      </div>
    );
  }

  // Transform properties for map
  const mapProperties = comparisonData.properties.map(p => ({
    id: parseInt(p.propertyData.zpid),
    address: p.propertyData.address,
    price: p.propertyData.price,
    bedrooms: p.propertyData.bedrooms,
    bathrooms: p.propertyData.bathrooms,
    sqft: p.propertyData.sqft,
    lat: p.propertyData.lat,
    lng: p.propertyData.lng,
    zpid: p.propertyData.zpid,
  }));

  // Calculate center of selected properties
  const centerLat = mapProperties.reduce((sum, p) => sum + p.lat, 0) / mapProperties.length;
  const centerLng = mapProperties.reduce((sum, p) => sum + p.lng, 0) / mapProperties.length;

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Header */}
      <nav className="w-full px-6 py-4 bg-white border-b border-neutral-200 sticky top-0 z-50">
        <div className="max-w-full mx-auto flex items-center justify-between">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.push('/homebuyer/map')}
            className="gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Map
          </Button>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-hero rounded-xl flex items-center justify-center shadow-glow">
              <span className="text-primary-foreground font-bold text-xl">H</span>
            </div>
            <div>
              <h1 className="text-xl font-bold text-neutral-900">Property Comparison</h1>
              <p className="text-xs text-neutral-600">Comparing {comparisonData.propertyCount} properties</p>
            </div>
          </div>
          <div className="w-24" /> {/* Spacer for centering */}
        </div>
      </nav>

      {/* Main Content */}
      <div className="flex-1 flex">
        {/* Left Side - Map */}
        <div className="w-1/2 border-r border-neutral-200 relative">
          <DynamicPropertyMap
            properties={mapProperties}
            onPropertySelect={() => {}}
            selectedProperty={null}
            compareMode={true}
            selectedForCompare={mapProperties}
          />
          
          {/* Property Cards Overlay */}
          <div className="absolute bottom-6 left-6 right-6 space-y-3 max-h-[40%] overflow-y-auto">
            {comparisonData.properties.map((property, index) => (
              <div
                key={property.propertyData.zpid}
                className="bg-white/95 backdrop-blur-sm rounded-xl p-4 shadow-lg border-2 border-green-500"
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="w-6 h-6 bg-green-500 text-white rounded-full flex items-center justify-center text-xs font-bold">
                        {index + 1}
                      </span>
                      <p className="text-lg font-bold text-neutral-900">
                        ${property.propertyData.price.toLocaleString()}
                      </p>
                    </div>
                    <p className="text-sm text-neutral-600 line-clamp-1">
                      {property.propertyData.address}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-4 text-xs text-neutral-600">
                  <span>{property.propertyData.bedrooms} beds</span>
                  <span>•</span>
                  <span>{property.propertyData.bathrooms} baths</span>
                  <span>•</span>
                  <span>{property.propertyData.sqft.toLocaleString()} sqft</span>
                </div>
                <div className="mt-2 pt-2 border-t border-neutral-200">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-neutral-600">Affordability:</span>
                    <span className={`font-semibold ${
                      property.aiInsights.affordabilityLevel === 'Affordable' ? 'text-green-600' :
                      property.aiInsights.affordabilityLevel === 'Stretch' ? 'text-orange-600' :
                      'text-red-600'
                    }`}>
                      {property.aiInsights.affordabilityScore}/100 - {property.aiInsights.affordabilityLevel}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Side - AI Analysis Chat */}
        <div className="w-1/2 flex flex-col bg-neutral-50">
          {/* Chat Header */}
          <div className="p-6 border-b border-neutral-200 bg-gradient-to-r from-primary/10 via-primary/5 to-transparent">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-12 h-12 bg-gradient-to-br from-primary to-primary/70 rounded-full flex items-center justify-center shadow-lg">
                  <MessageCircle className="w-6 h-6 text-white" />
                </div>
                <span className="absolute bottom-0 right-0 block w-3.5 h-3.5 rounded-full bg-emerald-400 ring-2 ring-white" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-neutral-900">Sarah's Comparison Analysis</h3>
                <p className="text-sm text-neutral-600 flex items-center gap-1.5">
                  <Sparkles className="w-3 h-3 text-primary" />
                  AI-Powered Property Advisor
                </p>
              </div>
            </div>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[85%] rounded-2xl px-4 py-3 ${
                    message.role === 'user'
                      ? 'bg-primary text-white'
                      : 'bg-white border border-neutral-200 text-neutral-900'
                  }`}
                >
                  <p className="text-sm whitespace-pre-wrap leading-relaxed">{message.content}</p>
                  <p className={`text-xs mt-2 ${
                    message.role === 'user' ? 'text-white/70' : 'text-neutral-500'
                  }`}>
                    {message.timestamp.toLocaleTimeString()}
                  </p>
                </div>
              </div>
            ))}
            
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-white border border-neutral-200 rounded-2xl px-4 py-3">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-primary rounded-full animate-bounce" />
                    <div className="w-2 h-2 bg-primary rounded-full animate-bounce [animation-delay:0.2s]" />
                    <div className="w-2 h-2 bg-primary rounded-full animate-bounce [animation-delay:0.4s]" />
                  </div>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="p-6 border-t border-neutral-200 bg-white">
            <div className="flex gap-2">
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSendMessage();
                  }
                }}
                placeholder="Ask follow-up questions about these properties..."
                className="flex-1 px-4 py-3 rounded-xl border border-neutral-200 text-sm text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
                disabled={isLoading}
              />
              <Button
                onClick={handleSendMessage}
                disabled={!inputMessage.trim() || isLoading}
                className="rounded-xl px-6"
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>
            <p className="text-xs text-neutral-500 mt-2 text-center">
              Ask about affordability, investment potential, or request detailed comparisons
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
