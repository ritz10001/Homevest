import { NextRequest, NextResponse } from 'next/server';
import { generateUniversalAnalysis } from '@/lib/aiAnalysis';

export async function POST(request: NextRequest) {
  try {
    const { propertyData, userData } = await request.json();
    
    console.log('🤖 API: Starting AI analysis...');
    console.log('User mode:', userData.mode);
    
    // Use universal analysis function that routes to Sarah or William
    const analysis = await generateUniversalAnalysis(propertyData, userData);
    
    console.log('✅ API: Analysis complete');
    return NextResponse.json(analysis);
  } catch (error: any) {
    console.error('❌ API: Error generating AI analysis:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to generate AI analysis. Please try again.' },
      { status: 500 }
    );
  }
}
