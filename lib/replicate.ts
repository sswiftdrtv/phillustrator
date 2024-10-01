export async function generateImage(prompt: string): Promise<string[] | null> {
    const apiUrl = 'https://api.replicate.com/v1/predictions';
    
    console.log('Starting image generation with prompt:', prompt);
    
    // The hidden consistent part of the prompt
    const hiddenPromptPart = "Make sure it is a cinematic shot with very high-quality that includes 'PHIL' face.";

    // Combine the random part of the prompt with the hidden rules
    const fullPrompt = `${prompt}. ${hiddenPromptPart}`;

    const data = {
      version: "4190a2c4c56b3621853dae5e47bd9b7096aa52f1f17ad13db8c09f1f1976a380", 
      input: {
        prompt: fullPrompt,  // Use the combined prompt
        aspect_ratio: "16:9", 
        num_outputs: 2,
        guidance_scale: 5,
        num_inference_steps: 20,
        output_format: "png",
      }
    };

    try {
      const startResponse = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Authorization': `Token ${process.env.REPLICATE_API_TOKEN}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!startResponse.ok) {
        const errorDetails = await startResponse.text();
        console.error(`Failed to start image generation: ${startResponse.status} - ${errorDetails}`);
        return null;
      }

      const startResult = await startResponse.json();
      const getStatusUrl = startResult.urls.get;

      console.log('Initial response from Replicate:', startResult);

      let predictionResult;
      let status = 'starting';
      while (status !== 'succeeded' && status !== 'failed') {
        await new Promise((resolve) => setTimeout(resolve, 2000));

        const statusResponse = await fetch(getStatusUrl, {
          headers: {
            'Authorization': `Token ${process.env.REPLICATE_API_TOKEN}`,
          },
        });

        predictionResult = await statusResponse.json();
        status = predictionResult.status;

        console.log('Polling Replicate API status:', predictionResult);
      }

      if (status === 'succeeded' && predictionResult.output && Array.isArray(predictionResult.output)) {
        return predictionResult.output;
      } else {
        console.error('Image generation failed or no output returned');
        return null;
      }
    } catch (error) {
      console.error("Error generating image:", error);
      if (error instanceof Error) {
        console.error("Error message:", error.message);
        console.error("Error stack:", error.stack);
      }
      return null;
    }
}