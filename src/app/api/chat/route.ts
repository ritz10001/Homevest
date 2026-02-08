import { NextRequest, NextResponse } from 'next/server';
import { sendChatMessage, buildSystemPrompt, ChatMessage } from '@/lib/featherlessChat';
import fs from 'fs';
import path from 'path';

export async function POST(request: NextRequest) {
  try {
    const { message, conversationHistory } = await request.json();

    // Load property analysis from important-data folder
    const analysisPath = path.join(process.cwd(), 'important-data', 'property-analysis.json');
    
    let propertyAnalysis = null;
    try {
      const analysisData = fs.readFileSync(analysisPath, 'utf-8');
      propertyAnalysis = JSON.parse(analysisData);
    } catch (error) {
      console.error('No property analysis found:', error);
      return NextResponse.json(
        { error: 'No property analysis available. Please analyze a property first.' },
        { status: 400 }
      );
    }

    // Load Houston housing market data
    let marketData = null;
    try {
      const marketPath = path.join(process.cwd(), 'data', 'houston_housing_market_2024_100.json');
      const marketDataRaw = fs.readFileSync(marketPath, 'utf-8');
      marketData = JSON.parse(marketDataRaw);
      console.log(`Loaded ${marketData.length} properties from Houston market data`);
    } catch (error) {
      console.warn('Could not load market data:', error);
      // Continue without market data
    }

    // Build system prompt with property context and market data
    const systemPrompt = buildSystemPrompt(propertyAnalysis, marketData);

    // Build messages array
    const messages: ChatMessage[] = [
      { role: 'system', content: systemPrompt },
      ...conversationHistory,
      { role: 'user', content: message },
    ];

    // Send to Featherless API
    const response = await sendChatMessage(messages);

    return NextResponse.json({ response });
  } catch (error: any) {
    console.error('Chat API error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to get response from Sarah' },
      { status: 500 }
    );
  }
}
