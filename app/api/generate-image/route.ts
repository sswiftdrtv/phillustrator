import { NextResponse } from 'next/server';
import { startImageGeneration } from '@/lib/replicate';

export const runtime = 'edge';

export async function POST(request: Request) {
  try {
    const { prompt } = await request.json();

    if (!prompt) {
      return NextResponse.json({ error: 'Prompt is required' }, { status: 400 });
    }

    const predictionId = await startImageGeneration(prompt);

    if (predictionId) {
      return NextResponse.json({ predictionId }, { status: 202 });
    } else {
      return NextResponse.json({ error: 'Failed to start image generation' }, { status: 500 });
    }
  } catch (error) {
    console.error('Error in generate-image API:', error);
    return NextResponse.json({ error: 'An unexpected error occurred' }, { status: 500 });
  }
}