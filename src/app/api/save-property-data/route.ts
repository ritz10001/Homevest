import { NextRequest, NextResponse } from 'next/server';
import { savePropertyData } from '@/lib/dataStorage';

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    
    // Add timestamp
    const dataWithTimestamp = {
      ...data,
      timestamp: new Date().toISOString(),
    };
    
    await savePropertyData(dataWithTimestamp);
    
    return NextResponse.json({ 
      success: true, 
      message: 'Property data saved successfully' 
    });
  } catch (error: any) {
    console.error('Error saving property data:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
