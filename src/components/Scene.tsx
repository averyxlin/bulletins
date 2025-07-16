'use client';

import { useEffect, useState, useCallback } from 'react';
import LandscapeLayer from './LandscapeLayer';
import Rails from './Rails';
import Train from './Train';
import SignpostLayer from './SignpostLayer';

interface SceneProps {
  className?: string;
}

export default function Scene({ className = '' }: SceneProps) {
  const [positions, setPositions] = useState({
    layer1: 0,
    layer2: 0,
    layer3: 0,
    layer4: 0,
  });

  const [isMoving, setIsMoving] = useState(false);

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
      layer1: (prev.layer1 + speeds.layer1) % imageWidth,
      layer2: (prev.layer2 + speeds.layer2) % imageWidth,
      layer3: (prev.layer3 + speeds.layer3) % imageWidth,
      layer4: (prev.layer4 + speeds.layer4) % imageWidth,
    }));
    setIsMoving(true);
  }, []);

  const moveRight = useCallback(() => {
    // Train moving right = landscape moves left
    setPositions(prev => ({
      layer1: (prev.layer1 - speeds.layer1) % imageWidth,
      layer2: (prev.layer2 - speeds.layer2) % imageWidth,
      layer3: (prev.layer3 - speeds.layer3) % imageWidth,
      layer4: (prev.layer4 - speeds.layer4) % imageWidth,
    }));
    setIsMoving(true);
  }, []);

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
    console.log(`Signpost ${id} clicked! Welcome to bulletin board ${id}!`);
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
      <div style={{ zIndex: 35 }}>
        <Rails 
          position={positions.layer4} 
          className=""
        />
      </div>
      
      {/* Train layer - centered, shows GIF when moving */}
      <div style={{ zIndex: 37 }}>
        <Train 
          isMoving={isMoving} 
          className=""
        />
      </div>
      
      {/* Layer 3 - Foreground (fastest) */}
      <div style={{ zIndex: 40 }}>
        <LandscapeLayer 
          layerNum={3} 
          position={positions.layer3} 
          className=""
        />
      </div>
      
      
      </div>
    </div>
  );
}
