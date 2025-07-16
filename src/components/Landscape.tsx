'use client';

import { useEffect, useState, useCallback } from 'react';
import Image from 'next/image';
import SmokeAnimation from './SmokeAnimation';

interface LandscapeProps {
  className?: string;
}

export default function Landscape({ className = '' }: LandscapeProps) {
  const [positions, setPositions] = useState({
    layer1: 0,
    layer2: 0,
    layer3: 0,
    layer4: 0,
  });

  const [isMoving, setIsMoving] = useState(false);

  const speeds = {
    layer1: 2,    // Slowest (background) - increased from 0.5
    layer2: 4,    // Slow - increased from 1
    layer3: 12,   // Fast - increased from 4
    layer4: 6,    // Medium - increased from 2
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
  }, [speeds.layer1, speeds.layer2, speeds.layer3, speeds.layer4]);

  const moveRight = useCallback(() => {
    // Train moving right = landscape moves left
    setPositions(prev => ({
      layer1: (prev.layer1 - speeds.layer1) % imageWidth,
      layer2: (prev.layer2 - speeds.layer2) % imageWidth,
      layer3: (prev.layer3 - speeds.layer3) % imageWidth,
      layer4: (prev.layer4 - speeds.layer4) % imageWidth,
    }));
    setIsMoving(true);
  }, [speeds.layer1, speeds.layer2, speeds.layer3, speeds.layer4]);

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

  const renderLayer = (layerNum: number, position: number, zIndex: number) => {
    return (
      <div
        key={layerNum}
        className="absolute inset-0 overflow-hidden"
        style={{ zIndex }}
      >
        {/* Render multiple copies for seamless looping */}
        {[-1, 0, 1].map((offset) => (
          <div
            key={offset}
            className="absolute top-0 h-full"
            style={{
              left: `${position + offset * imageWidth}px`,
              width: `${imageWidth}px`,
            }}
          >
            <Image
              src={`/assets/landscape/${layerNum}.png`}
              alt={`Landscape layer ${layerNum}`}
              fill
              className="object-cover object-bottom"
              priority={layerNum <= 2}
              draggable={false}
              style={{ imageRendering: 'pixelated' }}
              quality={100}
              unoptimized
            />
          </div>
        ))}
      </div>
    );
  };

  const renderRailsLayer = (position: number, zIndex: number) => {
    const railWidth = 80; 
    const railHeight = 40; 

    const screenWidth = 1920; // Fixed width to ensure consistent SSR/client rendering
    const railsNeeded = Math.ceil(screenWidth / railWidth) + 10; // Extra rails for buffer
    const sectionWidth = railWidth * railsNeeded;
    const normalizedPosition = ((position % sectionWidth) + sectionWidth) % sectionWidth;
    
    return (
      <div
        key="rails"
        className="absolute inset-0 overflow-hidden"
        style={{ zIndex }}
      >
        {/* Render enough sections to ensure continuous coverage */}
        {[-2, -1, 0, 1, 2].map((offset) => (
          <div
            key={offset}
            className="absolute"
            style={{
              left: `${-normalizedPosition + offset * sectionWidth}px`,
              bottom: '32%', 
              height: `${railHeight}px`,
              width: `${sectionWidth}px`,
              display: 'flex',
            }}
          >
            {Array.from({ length: railsNeeded }, (_, i) => (
              <div
                key={i}
                style={{
                  width: `${railWidth}px`,
                  height: `${railHeight}px`,
                  position: 'relative',
                  flexShrink: 0,
                }}
              >
                <Image
                  src="/assets/rails.png"
                  alt="Railway tracks"
                  fill
                  className="object-cover"
                  style={{ 
                    imageRendering: 'pixelated',
                    transform: 'rotate(0deg)', 
                  }}
                  quality={100}
                  unoptimized
                  sizes={`${railWidth}px`}
                />
              </div>
            ))}
          </div>
        ))}
      </div>
    );
  };

  const renderTrainLayer = (zIndex: number) => {
    const trainWidth = 480;
    const trainHeight = 240; 
    
    return (
      <div
        key="train"
        className="absolute inset-0 overflow-hidden"
        style={{ zIndex }}
      >
        <div
          className="absolute"
          style={{
            left: '50%',
            bottom: '26.7%',
            width: `${trainWidth}px`,
            height: `${trainHeight}px`,
            transform: 'translateX(-50%)', 
          }}
        >
          <Image
            src={isMoving ? "/assets/trains/train_v18.gif" : "/assets/trains/train_v18.png"}
            alt="Train"
            fill
            className="object-contain"
            style={{ 
              imageRendering: 'pixelated',
            }}
            quality={100}
            unoptimized
            sizes={`${trainWidth}px`}
          />
          {/* Smoke animation positioned at the train's chimney */}
          <SmokeAnimation
            isActive={isMoving}
            className="-top-7 left-91 z-10"
          />
        </div>
      </div>
    );
  };

  return (
    <div className={`relative w-full h-screen overflow-hidden ${className}`}>
      {/* Layer 1 - Background (slowest) */}
      {renderLayer(1, positions.layer1, 10)}
      
      {/* Layer 2 - Far background */}
      {renderLayer(2, positions.layer2, 20)}
      
      {/* Layer 4 - Mid-ground */}
      {renderLayer(4, positions.layer4, 30)}
      
      {/* Rails layer - moves with layer 4 */}
      {renderRailsLayer(positions.layer4, 35)}
      
      {/* Train layer - centered, shows GIF when moving */}
      {renderTrainLayer(37)}
      
      {/* Layer 3 - Foreground (fastest) */}
      {renderLayer(3, positions.layer3, 40)}
    </div>
  );
}
