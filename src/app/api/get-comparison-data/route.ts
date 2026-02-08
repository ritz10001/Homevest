import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const DATA_FOLDER = path.join(process.cwd(), 'Important Data');
const COMPARISON_FILE = path.join(DATA_FOLDER, 'comparison_data.json');

export async function GET(request: NextRequest) {
  try {
    if (!fs.existsSync(COMPARISON_FILE)) {
      return NextResponse.json(
        { error: 'No comparison data found' },
        { status: 404 }
      );
    }
    
    const data = fs.readFileSync(COMPARISON_FILE, 'utf-8');
    const comparisonData = JSON.parse(data);
    
    return NextResponse.json(comparisonData);
  } catch (error: any) {
    console.error('❌ Error reading comparison data:', error);
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}
