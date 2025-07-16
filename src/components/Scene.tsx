'use client';

import { useEffect, useState, useCallback, useRef } from 'react';
import LandscapeLayer from './LandscapeLayer';
import Rails from './Rails';
import Train from './Train';
import SignpostLayer from './SignpostLayer';
import Slideshow from './Slideshow';
import { getSlideConfigForSignpost } from '../config/signpostSlides';

interface SceneProps {
  className?: string;
}

export default function Scene({ className = '' }: SceneProps) {
  const [positions, setPositions] = useState({
    layer1: -650, 
    layer2: -650, 
    layer3: -650, 
    layer4: -650,
  });

  const [isMoving, setIsMoving] = useState(false);
  const [direction, setDirection] = useState<'left' | 'right'>('right'); // Default facing right
  const [speedMultiplier, setSpeedMultiplier] = useState(1); // Speed control
  
  // Slideshow state
  const [slideshowState, setSlideshowState] = useState<{
    isOpen: boolean;
    signpostId: number;
    startSlide: number;
    endSlide: number;
  }>({
    isOpen: false,
    signpostId: 0,
    startSlide: 1,
    endSlide: 1,
  });

  // Persist current slide for each signpost
  const [signpostSlideStates, setSignpostSlideStates] = useState<Record<number, number>>({});

  // Use ref to track slideshow state for event handlers
  const slideshowStateRef = useRef(slideshowState);
  slideshowStateRef.current = slideshowState;

  const speeds = {
    layer1: 2,    // Slowest (background)
    layer2: 4,    // Slow
    layer3: 12,   // Fast
    layer4: 6,    // Medium
  };

  // Image widths for looping calculation
  const imageWidth = 1920;

  const moveLeft = useCallback(() => {
    // Train moving left = landscape moves right
    setPositions(prev => ({
      layer1: (prev.layer1 - speeds.layer1 * speedMultiplier) % imageWidth,
      layer2: (prev.layer2 - speeds.layer2 * speedMultiplier) % imageWidth,
      layer3: (prev.layer3 - speeds.layer3 * speedMultiplier) % imageWidth,
      layer4: prev.layer4 - speeds.layer4 * speedMultiplier, // Remove modulo for continuous signpost progression
    }));
    setDirection('left');
    setIsMoving(true);
  }, [speedMultiplier]);

  const moveRight = useCallback(() => {
    // Train moving right = landscape moves left
    setPositions(prev => ({
      layer1: (prev.layer1 + speeds.layer1 * speedMultiplier) % imageWidth,
      layer2: (prev.layer2 + speeds.layer2 * speedMultiplier) % imageWidth,
      layer3: (prev.layer3 + speeds.layer3 * speedMultiplier) % imageWidth,
      layer4: prev.layer4 + speeds.layer4 * speedMultiplier, // Remove modulo for continuous signpost progression
    }));
    setDirection('right');
    setIsMoving(true);
  }, [speedMultiplier]);

  // Reset moving state after a short delay
  useEffect(() => {
    if (isMoving) {
      const timeout = setTimeout(() => {
        setIsMoving(false);
      }, 300); // Reset after 300ms of no movement
      
      return () => clearTimeout(timeout);
    }
  }, [isMoving]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Don't handle scene navigation when slideshow is open
      if (slideshowStateRef.current.isOpen) return;
      
      switch (event.key.toLowerCase()) {
        case 'a':
        case 'arrowleft':
          event.preventDefault();
          moveLeft();
          break;
        case 'd':
        case 'arrowright':
          event.preventDefault();
          moveRight();
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [moveLeft, moveRight]);

  const handleSignpostClick = (id: number) => {
    const slideConfig = getSlideConfigForSignpost(id);
    
    if (slideConfig) {
      setSlideshowState({
        isOpen: true,
        signpostId: id,
        startSlide: slideConfig.startSlide,
        endSlide: slideConfig.endSlide,
      });
    } else {
      console.warn(`No slide configuration found for signpost ${id}`);
    }
  };

  const closeSlideshowHandler = useCallback(() => {
    setSlideshowState(prev => ({ ...prev, isOpen: false }));
  }, []);

  const handleSlideChange = useCallback((signpostId: number, currentSlide: number) => {
    setSignpostSlideStates(prev => ({
      ...prev,
      [signpostId]: currentSlide
    }));
  }, []);

  // Get the current slide for a signpost, defaulting to startSlide if not set
  const getCurrentSlideForSignpost = (signpostId: number, startSlide: number) => {
    return signpostSlideStates[signpostId] ?? startSlide;
  };

  return (
    <div className={`relative w-full h-screen overflow-hidden ${className}`}>
      {/* Layer 1 - Background (slowest) */}
      <div style={{ zIndex: 10 }}>
        <LandscapeLayer 
          layerNum={1} 
          position={positions.layer1} 
          className=""
          priority={true}
        />
      </div>
      
      {/* Layer 2 - Far background */}
      <div style={{ zIndex: 20 }}>
        <LandscapeLayer 
          layerNum={2} 
          position={positions.layer2} 
          className=""
          priority={true}
        />
      </div>
      
      {/* Layer 4 - Mid-ground */}
      <div style={{ zIndex: 30 }}>
        <LandscapeLayer 
          layerNum={4} 
          position={positions.layer4} 
          className=""
        />
      </div>

      {/* Signpost Layer - Interactive elements that move with layer 4 */}
      <div style={{ zIndex: 32 }}>
        <SignpostLayer 
          position={positions.layer4}
          onSignpostClick={handleSignpostClick}
          className=""
        />
      
      {/* Rails layer - moves with layer 4 */}
      <div style={{ zIndex: 35, pointerEvents: 'none' }}>
        <Rails 
          position={positions.layer4} 
          className=""
        />
      </div>
      
      {/* Train layer - centered, shows GIF when moving */}
      <div style={{ zIndex: 37, pointerEvents: 'none' }}>
        <Train 
          isMoving={isMoving} 
          className=""
        />
      </div>
      
      {/* Layer 3 - Foreground (fastest) */}
      <div style={{ zIndex: 40, pointerEvents: 'none' }}>
        <LandscapeLayer 
          layerNum={3} 
          position={positions.layer3} 
          className=""
        />
      </div>
      
      {/* Speed Dial Overlay - Upper left corner */}
      <div 
        className="fixed top-4 left-4 z-50 bg-black bg-opacity-5 rounded-lg p-3"
        style={{ pointerEvents: 'auto' }}
      >
        <div className="text-white text-sm font-medium mb-2">Speed</div>
        <div className="flex flex-row gap-2">
          {[1, 2, 4, 8].map((speed) => (
            <button
              key={speed}
              onClick={() => setSpeedMultiplier(speed)}
              className={`px-3 py-1 text-sm rounded transition-colors ${
                speedMultiplier === speed
                  ? 'bg-blue-500 bg-opacity-70 text-white'
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              {speed}x
            </button>
          ))}
        </div>
      </div>

      {/* Slideshow - Highest z-index to appear above everything */}
      <Slideshow
        isOpen={slideshowState.isOpen}
        onClose={closeSlideshowHandler}
        startSlide={slideshowState.startSlide}
        endSlide={slideshowState.endSlide}
        signpostId={slideshowState.signpostId}
        currentSlide={getCurrentSlideForSignpost(slideshowState.signpostId, slideshowState.startSlide)}
        onSlideChange={handleSlideChange}
      />
      
      </div>
    </div>
  );
}
