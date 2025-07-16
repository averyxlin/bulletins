'use client';

import Image from 'next/image';

interface RailsProps {
  position: number;
  className?: string;
}

export default function Rails({ position, className = '' }: RailsProps) {
  const railWidth = 80;
  const railHeight = 40;
  const screenWidth = 1920;
  const railsNeeded = Math.ceil(screenWidth / railWidth) + 10;
  const sectionWidth = railWidth * railsNeeded;
  const normalizedPosition = ((position % sectionWidth) + sectionWidth) % sectionWidth;

  return (
    <div className={`absolute inset-0 overflow-hidden ${className}`}>
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
}
