export async function startImageGeneration(prompt: string): Promise<string | null> {
    const apiUrl = 'https://api.replicate.com/v1/predictions';
    
    console.log('Starting image generation with prompt:', prompt);
    
    const hiddenPromptPart = "Make sure it is a cinematic shot with very high-quality that includes 'PHIL' face.";
    const fullPrompt = `${prompt}. ${hiddenPromptPart}`;

    const data = {
        version: "4190a2c4c56b3621853dae5e47bd9b7096aa52f1f17ad13db8c09f1f1976a380",
        input: {
            prompt: fullPrompt,
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
        console.log('Initial response from Replicate:', startResult);

        return startResult.id;
    } catch (error) {
        console.error("Error starting image generation:", error);
        return null;
    }
}

export async function checkImageGenerationStatus(id: string): Promise<string[] | null> {
    const getStatusUrl = `https://api.replicate.com/v1/predictions/${id}`;

    try {
        const statusResponse = await fetch(getStatusUrl, {
            headers: {
                'Authorization': `Token ${process.env.REPLICATE_API_TOKEN}`,
            },
        });

        const predictionResult = await statusResponse.json();
        console.log('Polling Replicate API status:', predictionResult);

        if (predictionResult.status === 'succeeded' && predictionResult.output && Array.isArray(predictionResult.output)) {
            return predictionResult.output;
        } else if (predictionResult.status === 'failed') {
            console.error('Image generation failed');
            return null;
        } else {
            return null; // Still processing
        }
    } catch (error) {
        console.error("Error checking image generation status:", error);
        return null;
    }
}