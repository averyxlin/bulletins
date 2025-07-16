'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import Image from 'next/image';
import { getSlideConfigForSignpost } from '@/config/signpostSlides';

interface SlideshowProps {
  isOpen: boolean;
  onClose: () => void;
  startSlide: number;
  endSlide: number;
  signpostId: number;
  currentSlide: number;
  onSlideChange: (signpostId: number, currentSlide: number) => void;
}

export default function Slideshow({ 
  isOpen, 
  onClose, 
  startSlide, 
  endSlide, 
  signpostId,
  currentSlide: initialCurrentSlide,
  onSlideChange
}: SlideshowProps) {
  const [currentSlide, setCurrentSlide] = useState(initialCurrentSlide);
  const [slideChangeTriggered, setSlideChangeTriggered] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [loadedImages, setLoadedImages] = useState<Set<number>>(new Set());
  const imageRef = useRef<HTMLImageElement>(null);

  // Preload images for better performance
  useEffect(() => {
    if (isOpen) {
      const preloadImages = async () => {
        const imagesToPreload = [];
        for (let i = startSlide; i <= endSlide; i++) {
          if (!loadedImages.has(i)) {
            imagesToPreload.push(i);
          }
        }

        // Preload images in batches to avoid overwhelming the browser
        const batchSize = 3;
        for (let i = 0; i < imagesToPreload.length; i += batchSize) {
          const batch = imagesToPreload.slice(i, i + batchSize);
          await Promise.all(
            batch.map(slideNum => {
              return new Promise<void>((resolve) => {
                const img = new window.Image();
                img.onload = () => {
                  setLoadedImages(prev => new Set([...prev, slideNum]));
                  resolve();
                };
                img.onerror = () => resolve(); // Continue even if image fails to load
                img.src = `/assets/slides/${slideNum}.png`;
              });
            })
          );
        }
      };

      preloadImages();
    }
  }, [isOpen, startSlide, endSlide, loadedImages]);

  // Update local state when the prop changes (when slideshow opens)
  useEffect(() => {
    if (isOpen) {
      setCurrentSlide(initialCurrentSlide);
      // Reset loading state when slideshow opens
      setIsLoading(false);
    } else {
      // Clear loaded images cache when slideshow closes to free memory
      setLoadedImages(new Set());
    }
  }, [isOpen, initialCurrentSlide]);

  // Reset loading state when switching between different signposts
  useEffect(() => {
    if (isOpen) {
      setLoadedImages(new Set());
      setIsLoading(true);
    }
  }, [signpostId, isOpen]);

  // Handle loading state when slide changes
  useEffect(() => {
    if (isOpen && !loadedImages.has(currentSlide)) {
      setIsLoading(true);
    } else {
      setIsLoading(false);
    }
  }, [currentSlide, loadedImages, isOpen]);

  // Call onSlideChange after state update to avoid setState during render
  useEffect(() => {
    if (slideChangeTriggered && isOpen) {
      onSlideChange(signpostId, currentSlide);
      setSlideChangeTriggered(false);
    }
  }, [slideChangeTriggered, currentSlide, signpostId, onSlideChange, isOpen]);

  const nextSlide = useCallback(() => {
    setCurrentSlide(prev => prev >= endSlide ? startSlide : prev + 1);
    setSlideChangeTriggered(true);
  }, [startSlide, endSlide]);

  const prevSlide = useCallback(() => {
    setCurrentSlide(prev => prev <= startSlide ? endSlide : prev - 1);
    setSlideChangeTriggered(true);
  }, [startSlide, endSlide]);

  const goToSlide = useCallback((slideNumber: number) => {
    if (slideNumber >= startSlide && slideNumber <= endSlide) {
      setCurrentSlide(slideNumber);
      setSlideChangeTriggered(true);
    }
  }, [startSlide, endSlide]);

  // Keyboard navigation
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      switch (event.key) {
        case 'ArrowRight':
        case ' ': // Spacebar
          event.preventDefault();
          nextSlide();
          break;
        case 'ArrowLeft':
          event.preventDefault();
          prevSlide();
          break;
        case 'Escape':
          event.preventDefault();
          onClose();
          break;
        // Number keys for direct navigation
        case '1':
        case '2':
        case '3':
        case '4':
        case '5':
        case '6':
        case '7':
        case '8':
        case '9':
          event.preventDefault();
          const slideNum = parseInt(event.key);
          const targetSlide = startSlide + slideNum - 1;
          goToSlide(targetSlide);
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, nextSlide, prevSlide, onClose, goToSlide, startSlide]);

  // Mouse navigation
  const handleClick = useCallback((event: React.MouseEvent) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const clickX = event.clientX - rect.left;
    const width = rect.width;
    
    // Left half = previous, right half = next
    if (clickX < width / 2) {
      prevSlide();
    } else {
      nextSlide();
    }
  }, [nextSlide, prevSlide]);

  // Right click for previous slide
  const handleContextMenu = useCallback((event: React.MouseEvent) => {
    event.preventDefault();
    prevSlide();
  }, [prevSlide]);

  if (!isOpen) return null;

  const totalSlides = endSlide - startSlide + 1;
  const currentIndex = currentSlide - startSlide + 1;
  const slideConfig = getSlideConfigForSignpost(signpostId);
  const title = slideConfig?.title || `Bulletin Board ${signpostId}`;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50">
      {/* Close button */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 text-white text-2xl hover:text-gray-300 z-10"
        aria-label="Close slideshow"
      >
        ✕
      </button>

      {/* Slideshow info */}
      <div className="absolute top-4 left-4 text-white z-10">
        <div className="text-base font-semibold">{title}</div>
        <div className="text-xs opacity-75">
          Slide {currentIndex} of {totalSlides} (#{currentSlide})
        </div>
      </div>

      {/* Navigation arrows */}
      <button
        onClick={prevSlide}
        className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white text-4xl hover:text-gray-300 z-10"
        aria-label="Previous slide"
      >
        ‹
      </button>

      <button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white text-4xl hover:text-gray-300 z-10"
        aria-label="Next slide"
      >
        ›
      </button>

      {/* Main slide display */}
      <div 
        className="relative max-w-6xl max-h-[85vh] cursor-pointer"
        onClick={handleClick}
        onContextMenu={handleContextMenu}
      >
        {isLoading ? (
          /* Loading screen - black background with loading indicator */
          <div className="flex items-center justify-center w-full h-full min-h-[400px] bg-black">
            <div className="text-white text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
              <div className="text-lg">Loading slide {currentSlide}...</div>
            </div>
          </div>
        ) : (
          /* Slide image with fade-in transition */
          <div className="transition-opacity duration-300 ease-in-out">
            <Image
              ref={imageRef}
              src={`/assets/slides/${currentSlide}.png`}
              alt={`Slide ${currentSlide}`}
              width={1200}
              height={900}
              className="object-contain max-w-full max-h-full"
              style={{ 
                imageRendering: 'pixelated',
              }}
              quality={100}
              unoptimized
              priority
              onLoad={() => {
                setLoadedImages(prev => new Set([...prev, currentSlide]));
                setIsLoading(false);
              }}
              onError={() => {
                setIsLoading(false);
              }}
            />
          </div>
        )}
      </div>

      {/* Slide indicators */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
        {Array.from({ length: Math.min(totalSlides, 10) }, (_, i) => {
          const slideNumber = startSlide + i;
          const isActive = slideNumber === currentSlide;
          return (
            <button
              key={slideNumber}
              onClick={() => goToSlide(slideNumber)}
              className={`w-3 h-3 rounded-full transition-colors ${
                isActive ? 'bg-white' : 'bg-gray-500 hover:bg-gray-300'
              }`}
              aria-label={`Go to slide ${slideNumber}`}
            />
          );
        })}
        {totalSlides > 10 && (
          <span className="text-white text-xs ml-2">
            +{totalSlides - 10} more
          </span>
        )}
      </div>

      
    </div>
  );
}
