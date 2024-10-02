import { NextResponse } from 'next/server';
import { checkImageGenerationStatus } from '@/lib/replicate';

export const runtime = 'edge';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');

  if (!id) {
    return NextResponse.json({ error: 'Prediction ID is required' }, { status: 400 });
  }

  try {
    const imageUrls = await checkImageGenerationStatus(id);
    
    if (imageUrls) {
      return NextResponse.json({ imageUrls }, { status: 200 });
    } else {
      return NextResponse.json({ status: 'processing' }, { status: 202 });
    }
  } catch (error) {
    console.error('Error checking image status:', error);
    return NextResponse.json({ error: 'An unexpected error occurred' }, { status: 500 });
  }
}