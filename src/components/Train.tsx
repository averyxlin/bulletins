'use client';

import Image from 'next/image';
import SmokeAnimation from './SmokeAnimation';

interface TrainProps {
  isMoving: boolean;
  className?: string;
}

export default function Train({ isMoving, className = '' }: TrainProps) {
  const trainWidth = 480;
  const trainHeight = 240;

  return (
    <div className={`absolute inset-0 overflow-hidden ${className}`}>
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
}
