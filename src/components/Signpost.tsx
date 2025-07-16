'use client';

import Image from 'next/image';
import { useMemo } from 'react';

interface SignpostProps {
  onClick: () => void;
  className?: string;
  position?: { x: string; y: string };
  signpostId?: number;
  displayNumber?: number;
}

export default function Signpost({ 
  onClick, 
  className = '',
  position = { x: '20%', y: '60%' },
  signpostId = 0,
  displayNumber
}: SignpostProps) {
  const signpostWidth = 240;
  const signpostHeight = 320;
  const grassWidth = 120;
  const grassHeight = 60;

  // Use signpostId to deterministically select a grass image (1-32, excluding 1 and 19)
  const grassImage = useMemo(() => {
    const availableNumbers = [];
    for (let i = 1; i <= 32; i++) {
      if (i !== 1 && i !== 19) {
        availableNumbers.push(i);
      }
    }
    const grassNumber = availableNumbers[signpostId % availableNumbers.length];
    return `/assets/grass/grassandflowers${grassNumber}.png`;
  }, [signpostId]);

  // Use the passed displayNumber or calculate from signpostId as fallback
  const finalDisplayNumber = displayNumber ?? (signpostId + 1);

  return (
    <div className={`absolute inset-0 overflow-hidden ${className}`}>
      {/* Signpost container */}
      <div
        className="absolute cursor-pointer transition-transform duration-200"
        style={{
          left: position.x,
          bottom: position.y,
          width: `${signpostWidth}px`,
          height: `${signpostHeight}px`,
          transform: 'translateX(-50%)',
        }}
        onClick={onClick}
      >
        <Image
          src="/assets/signpost/signpost3.png"
          alt="Signpost"
          fill
          className="object-contain"
          style={{ 
            imageRendering: 'pixelated',
          }}
          quality={100}
          unoptimized
          sizes={`${signpostWidth}px`}
        />
        
        {/* White pixelated number in the 2nd, lower gray square */}
        <div
          className="absolute flex items-center justify-center"
          style={{
            left: '43.5%',
            top: '42.75%', 
            width: '5px',
            height: '5px',
            transform: 'translateX(-50%)',
            zIndex: 10,
          }}
        >
          <span
            className="font-bold select-none"
            style={{
              fontSize: '18px',
              fontFamily: 'var(--font-tiny5)',
              color: '#FFFFFF',
              imageRendering: 'pixelated',
              textShadow: '1px 1px 0px #000000, -1px -1px 0px #000000, 1px -1px 0px #000000, -1px 1px 0px #000000',
              lineHeight: '1',
            }}
          >
            {finalDisplayNumber}
          </span>
        </div>
      </div>
      
      {/* Grass at the base of the signpost - positioned relative to the same parent */}
      <div
        className="absolute"
        style={{
          left: `calc(${position.x} - 5px)`,
          bottom: `calc(${position.y} + 86px)`,
          width: `${grassWidth}px`,
          height: `${grassHeight}px`,
          transform: 'translateX(-50%)',
          zIndex: 1,
        }}
      >
        <Image
          src={grassImage}
          alt="Grass"
          fill
          className="object-contain"
          style={{ 
            imageRendering: 'pixelated',
          }}
          quality={100}
          unoptimized
          sizes={`${grassWidth}px`}
        />
      </div>
    </div>
  );
}
