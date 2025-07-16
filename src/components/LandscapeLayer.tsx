'use client';

import Image from 'next/image';

interface LandscapeLayerProps {
  layerNum: number;
  position: number;
  className?: string;
  priority?: boolean;
}

export default function LandscapeLayer({ 
  layerNum, 
  position, 
  className = '',
  priority = false 
}: LandscapeLayerProps) {
  const imageWidth = 1920;

  return (
    <div className={`absolute inset-0 overflow-hidden ${className}`}>
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
            priority={priority}
            draggable={false}
            style={{ imageRendering: 'pixelated' }}
            quality={100}
            unoptimized
          />
        </div>
      ))}
    </div>
  );
}
