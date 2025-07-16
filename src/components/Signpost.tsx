'use client';

import Image from 'next/image';

interface SignpostProps {
  onClick: () => void;
  className?: string;
  position?: { x: string; y: string };
}

export default function Signpost({ 
  onClick, 
  className = '',
  position = { x: '20%', y: '60%' }
}: SignpostProps) {
  const signpostWidth = 240;
  const signpostHeight = 320;

  return (
    <div className={`absolute inset-0 overflow-hidden ${className}`}>
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
      </div>
    </div>
  );
}
