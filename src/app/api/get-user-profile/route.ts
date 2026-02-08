import { NextRequest, NextResponse } from 'next/server';
import { getUserProfile } from '@/lib/userProfile';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const uid = searchParams.get('uid');
    
    if (!uid) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      );
    }
    
    const userProfile = await getUserProfile(uid);
    
    if (!userProfile) {
      return NextResponse.json(
        { error: 'User profile not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(userProfile);
  } catch (error: any) {
    console.error('❌ Error fetching user profile:', error);
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}
