'use client'

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Wand2, Dice6, Download, Loader2 } from 'lucide-react';
import Image from 'next/image';

const backgroundImages = [
  "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/replicate-prediction-b3wrgt94x1rj00cj8q7sxresdm-lpPCqVQP9cFrPjs5DANMzPenm9oZHr.webp",
  "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/phil_president-JtCOIWMAImGZ0xz4TNtf0UE1czZltz.png",
  "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/phil_cowboy-BTVTVEIHWj45doVYl6gOPVcWM9OEpj.png",
  "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/phil_superman-jpgNGgjuJOssCWHU5hh7CQ0vXPLEnF.png"
];

export default function Component() {
  const [prompt, setPrompt] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isRandomizing, setIsRandomizing] = useState(false);
  const [currentBackgroundIndex, setCurrentBackgroundIndex] = useState(0);
  const [showLightbox, setShowLightbox] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [displayedPrompt, setDisplayedPrompt] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [generatedImages, setGeneratedImages] = useState<string[]>([]);

  const placeholderText = "Bring Phil Swift to life in any scene with AI! Type your idea or roll the dice to get started...";

  const changeBackgroundImage = useCallback(() => {
    setCurrentBackgroundIndex((prevIndex) => (prevIndex + 1) % backgroundImages.length);
  }, []);

  useEffect(() => {
    const intervalId = setInterval(changeBackgroundImage, 10000);
    return () => clearInterval(intervalId);
  }, [changeBackgroundImage]);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [prompt, displayedPrompt]);

  useEffect(() => {
    console.log('Loading state:', isLoading);
    console.log('Show lightbox:', showLightbox);
  }, [isLoading, showLightbox]);

  useEffect(() => {
    if (isTyping) {
      if (displayedPrompt.length < prompt.length) {
        const timeoutId = setTimeout(() => {
          const charsToAdd = Math.min(5, prompt.length - displayedPrompt.length);
          setDisplayedPrompt(prompt.slice(0, displayedPrompt.length + charsToAdd));
        }, 10); // Reduced to 10ms for even faster typing
        return () => clearTimeout(timeoutId);
      } else {
        setIsTyping(false);
      }
    }
  }, [displayedPrompt, prompt, isTyping]);

  const handleRandomize = async () => {
    setIsRandomizing(true);
    setPrompt('Randomizing...');
    try {
      const response = await fetch(`/api/openai/random-prompt?${Date.now()}`);
      const data = await response.json();

      if (data.prompt) {
        setPrompt(data.prompt);
        setDisplayedPrompt('');
        setIsTyping(true);
      } else {
        console.error('Failed to generate prompt:', data.error);
        setPrompt('Failed to generate prompt');
      }
    } catch (error) {
      console.error('Error fetching random prompt:', error);
      setPrompt('Error generating prompt');
    }
    setIsRandomizing(false);
  };

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      alert("Please enter a prompt or use the randomize button to generate one.");
      return;
    }

    setIsLoading(true);
    setShowLightbox(true);
    setGeneratedImages([]);
    console.log('Generate clicked: Loading started');

    try {
      const response = await fetch('/api/generate-image', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt }),
      });

      const data = await response.json();
      if (data.imageUrls && Array.isArray(data.imageUrls)) {
        setGeneratedImages(data.imageUrls);
      } else {
        console.error('Unexpected response format:', data);
      }
    } catch (error) {
      console.error('Error generating images:', error);
    }

    setIsLoading(false);
    console.log('Generate completed: Loading finished');
  };

  const handlePromptChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setPrompt(e.target.value);
    setDisplayedPrompt(e.target.value);
    setIsTyping(false);
  };

  const closeLightbox = () => {
    setShowLightbox(false);
    setGeneratedImages([]);
  };

  const handleDownload = (imageUrl: string, index: number) => {
    // Download logic here
    console.log(`Downloading image ${index + 1}: ${imageUrl}`);
    // Implement actual download functionality
  };

  return (
    <div ref={containerRef} className="relative w-full h-screen overflow-hidden">
      <style jsx>{`
        @keyframes borderAnimation {
          0% {
            border-color: rgba(255, 255, 255, 0.1);
          }
          50% {
            border-color: rgba(255, 255, 255, 0.5);
          }
          100% {
            border-color: rgba(255, 255, 255, 0.1);
          }
        }
        .animated-border {
          border: 2px solid rgba(255, 255, 255, 0.1);
          animation: borderAnimation 4s infinite;
        }
      `}</style>
      {backgroundImages.map((image, index) => (
        <div
          key={index}
          className={`absolute inset-0 w-full h-full transition-opacity duration-2000 ${
            index === currentBackgroundIndex ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <Image 
            src={image}
            alt={`Background slideshow ${index + 1}`}
            layout="fill"
            objectFit="cover"
            objectPosition="center"
            quality={100}
            priority={index === 0}
            className="w-full h-full object-cover"
          />
        </div>
      ))}
      <div className="absolute inset-0 bg-black bg-opacity-30 flex flex-col justify-between p-6">
        <header className="container mx-auto text-center pt-4">
          <div className="relative w-full max-w-[400px] h-[100px] mx-auto">
            <Image 
              src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Phillustrate-ai-9-30-2024-MzlKgZlZIdPnyXOJzkgU03VP0UE0g1.png" 
              alt="Phillustrate.AI Logo" 
              layout="fill"
              objectFit="contain"
              priority
            />
          </div>
        </header>

        <main className="container mx-auto flex flex-col items-center justify-end flex-grow">
          <div className="relative w-full max-w-[400px] mb-8">
            <div className="bg-white bg-opacity-10 backdrop-filter backdrop-blur-lg rounded-lg overflow-hidden p-4 animated-border">
              <div className="relative min-h-[80px]">
                <textarea
                  ref={textareaRef}
                  value={isTyping ? displayedPrompt : prompt}
                  onChange={handlePromptChange}
                  placeholder={placeholderText}
                  className="w-full bg-transparent border-none focus:outline-none focus:ring-0 text-white placeholder-white placeholder-opacity-70 text-left text-lg resize-none overflow-hidden"
                  style={{
                    minHeight: '80px',
                    height: 'auto',
                  }}
                  readOnly={isTyping}
                  disabled={isRandomizing || isLoading}
                />
              </div>
              <div className="flex justify-between mt-2">
                <button
                  onClick={handleRandomize}
                  className="w-12 h-12 flex items-center justify-center bg-white bg-opacity-10 hover:bg-opacity-20 transition-colors duration-200 rounded-lg"
                  disabled={isRandomizing || isLoading || isTyping}
                >
                  <Dice6 size={24} className="text-white" />
                </button>
                <button
                  onClick={handleGenerate}
                  disabled={isLoading || prompt.trim() === '' || isTyping}
                  className="w-12 h-12 flex items-center justify-center bg-white bg-opacity-10 hover:bg-opacity-20 transition-colors duration-200 rounded-lg"
                >
                  {isLoading ? (
                    <Loader2 className="w-6 h-6 animate-spin" />
                  ) : (
                    <Wand2 size={24} className="text-white" />
                  )}
                </button>
              </div>
            </div>
          </div>
        </main>
      </div>

      {showLightbox && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
          <div className="relative w-full h-full max-w-[800px] bg-white bg-opacity-10 backdrop-filter backdrop-blur-lg overflow-y-auto border border-white border-opacity-20">
            <button
              onClick={closeLightbox}
              className="absolute top-3 right-3 text-white hover:text-gray-300 transition-colors duration-200 z-10"
              aria-label="Close lightbox"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            
            {isLoading ? (
              <>
                <div className="flex items-center justify-center space-x-2 p-4 border-b border-white border-opacity-20">
                  <div className="w-5 h-5 border-t-2 border-white border-solid rounded-full animate-spin"></div>
                  <h2 className="text-xl font-semibold text-white">Generating Images...</h2>
                </div>

                <div className="p-6">
                  <div className="aspect-video w-full mb-6 rounded-lg overflow-hidden shadow-lg">
                    <iframe
                      src="https://www.youtube.com/embed/H-HOI5a75t0?autoplay=1&cc_load_policy=1&cc_lang_pref=en"
                      title="YouTube video player"
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      className="w-full h-full"
                    ></iframe>
                  </div>
                  
                  <p className="text-white text-sm text-center bg-black bg-opacity-30 rounded-lg p-3">
                    Images take 30-60 seconds to generate. Check out our new commercial while you wait...
                  </p>
                </div>
              </>
            ) : (
              <div className="p-4 sm:p-6">
                <h2 className="text-xl font-semibold text-white mb-4">Generated Images</h2>
                <div className="grid grid-cols-1 gap-4">
                  {generatedImages.map((imageUrl, index) => (
                    <div key={index} className="relative">
                      <Image
                        src={imageUrl}
                        alt={`Generated image ${index + 1}`}
                        width={800}
                        height={800}
                        layout="responsive"
                        className="rounded-lg"
                      />
                      <button
                        onClick={() => handleDownload(imageUrl, index)}
                        className="absolute bottom-3 right-3 bg-black bg-opacity-50 p-3 rounded-full text-white transition-all duration-200 active:scale-95"
                      >
                        <Download size={24} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}