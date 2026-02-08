import { NextRequest, NextResponse } from 'next/server';
import { deletePropertyData } from '@/lib/dataStorage';

export async function DELETE(request: NextRequest) {
  try {
    await deletePropertyData();
    
    return NextResponse.json({ 
      success: true, 
      message: 'Property data deleted successfully' 
    });
  } catch (error: any) {
    console.error('Error deleting property data:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
