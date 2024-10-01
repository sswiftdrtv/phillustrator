// app/api/generate-image/route.ts
import { NextResponse } from 'next/server';
import { generateImage } from '@/lib/replicate';

export async function POST(request: Request) {
  const { prompt } = await request.json();

  if (!prompt) {
    return NextResponse.json({ error: 'Prompt is required' }, { status: 400 });
  }

  const imageUrls = await generateImage(prompt);

  if (imageUrls && imageUrls.length > 0) {
    return NextResponse.json({ imageUrls }, { status: 200 });
  } else {
    return NextResponse.json({ error: 'Failed to generate images' }, { status: 500 });
  }
}