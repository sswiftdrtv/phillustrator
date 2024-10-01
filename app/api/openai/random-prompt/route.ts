export const dynamic = 'force-dynamic';
export const revalidate = 0;
export const fetchCache = 'force-no-store';
export const runtime = 'edge';

import { OpenAI } from 'openai';
import { NextResponse } from 'next/server';

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function GET() {
  try {
    // Log the start of the API call with timestamp
    const requestTime = new Date().toISOString();
    console.log(`API Request initiated at: ${requestTime}`);

    // Log the API key being used (you can remove this in production for security)
    console.log('OpenAI API Key:', process.env.OPENAI_API_KEY);

    // Use GPT-4 to generate the random/funny part of the prompt for PHIL with a timestamp
    const response = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        {
          role: 'user',
          content: `
            Generate one visually striking and detailed prompt for a custom cinematic high-quality image of 'PHIL'. Always include apostrophes around 'PHIL'. Alternate between epic and cinematic focusing on one iconic idea at a time. The scene should be grand and awe-inspiring placing 'PHIL' in a larger-than-life situation. Ensure the prompt is no more than 40 words, concise, and provides clear visual direction with a single focal point of 'PHIL'. Focus on dynamic, cinematic, or photorealistic scenes depicting the mood, composition, and description of the scene. Here are some example prompts:
            - A cinematic scene of 'PHIL' adjusting his bowtie in a lavish casino, confidently striding toward a high-stakes poker table, a glint of mischief in his eye.
            - 'PHIL', in shining armor, marches through a storm-ravaged battlefield, sword raised to the darkened sky.
            - A cinematic shot featuring 'PHIL' in a rugged vest, leaning against a spaceship with a blaster at his side, smirking as he engages in banter with aliens in a bustling spaceport.
            - A cinematic pose of 'PHIL' standing atop a skyscraper, clad in a blue suit with a flowing red cape, looking out over the city at sunset, ready to leap into action.
            - 'PHIL' stands at the helm of a grand warship, waves crashing as a storm brews on the horizon.
            - A cinematic battle charge led by 'PHIL' in a star-spangled costume, raising a large shield high as he leads rebels against an overwhelming enemy.`, // Missing closing backtick and quote previously
        },
      ],
    });

    // Log the response from OpenAI
    console.log('OpenAI API response:', response);

    // Check if response and choices are valid
    if (response && response.choices && response.choices[0]?.message?.content) {
      const generatedPrompt = response.choices[0].message.content.trim();

      // Log the generated prompt for debugging
      console.log('Generated prompt:', generatedPrompt);

      // Explicitly set cache control headers in the response
      const headers = new Headers({
        'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0',
        'Surrogate-Control': 'no-store',
      });

      return new NextResponse(JSON.stringify({ prompt: generatedPrompt }), { headers });
    } else {
      throw new Error('Invalid response from OpenAI');
    }
  } catch (error) {
    console.error('Error generating random prompt:', error);
    return NextResponse.json({ error: 'Failed to generate prompt' });
  }
}
