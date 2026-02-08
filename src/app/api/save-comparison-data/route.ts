import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const DATA_FOLDER = path.join(process.cwd(), 'Important Data');
const COMPARISON_FILE = path.join(DATA_FOLDER, 'comparison_data.json');

export async function POST(request: NextRequest) {
  try {
    const { userData, properties } = await request.json();
    
    // Ensure folder exists
    if (!fs.existsSync(DATA_FOLDER)) {
      fs.mkdirSync(DATA_FOLDER, { recursive: true });
    }
    
    // Prepare comparison data with timestamp
    const comparisonData = {
      timestamp: new Date().toISOString(),
      userData: userData,
      propertyCount: properties.length,
      properties: properties,
    };
    
    // Write to file
    fs.writeFileSync(COMPARISON_FILE, JSON.stringify(comparisonData, null, 2), 'utf-8');
    
    console.log('✅ Comparison data saved to Important Data folder');
    console.log(`   - User: ${userData.displayName}`);
    console.log(`   - Properties: ${properties.length}`);
    
    return NextResponse.json({ 
      success: true, 
      message: 'Comparison data saved successfully',
      propertyCount: properties.length,
    });
  } catch (error: any) {
    console.error('❌ Error saving comparison data:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
