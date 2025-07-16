'use client';

import { useEffect, useState, useCallback } from 'react';
import Image from 'next/image';

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

  // Movement speeds for each layer (pixels per keypress)
  const speeds = {
    layer1: 0.5,  // Slowest (background)
    layer2: 1,    // Slow
    layer3: 4,    // Fast
    layer4: 2,    // Medium
  };

  // Image widths for looping calculation
  const imageWidth = 1920; // Assuming standard width, adjust if needed

  const moveLeft = useCallback(() => {
    setPositions(prev => ({
      layer1: (prev.layer1 - speeds.layer1) % imageWidth,
      layer2: (prev.layer2 - speeds.layer2) % imageWidth,
      layer3: (prev.layer3 - speeds.layer3) % imageWidth,
      layer4: (prev.layer4 - speeds.layer4) % imageWidth,
    }));
  }, []);

  const moveRight = useCallback(() => {
    setPositions(prev => ({
      layer1: (prev.layer1 + speeds.layer1) % imageWidth,
      layer2: (prev.layer2 + speeds.layer2) % imageWidth,
      layer3: (prev.layer3 + speeds.layer3) % imageWidth,
      layer4: (prev.layer4 + speeds.layer4) % imageWidth,
    }));
  }, []);

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

  return (
    <div className={`relative w-full h-screen overflow-hidden ${className}`}>
      {/* Layer 1 - Background (slowest) */}
      {renderLayer(1, positions.layer1, 10)}
      
      {/* Layer 2 - Far background */}
      {renderLayer(2, positions.layer2, 20)}
      
      {/* Layer 4 - Mid-ground */}
      {renderLayer(4, positions.layer4, 30)}
      
      {/* Layer 3 - Foreground (fastest) */}
      {renderLayer(3, positions.layer3, 40)}

      {/* Controls hint */}
      <div className="absolute bottom-4 left-4 bg-black/50 text-white px-3 py-2 rounded text-sm z-50">
        Use A/D or ←/→ to move
      </div>
    </div>
  );
}
