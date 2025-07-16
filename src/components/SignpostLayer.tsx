'use client';

import Signpost from './Signpost';

interface SignpostLayerProps {
  position: number;
  className?: string;
  onSignpostClick?: (id: number) => void;
}

export default function SignpostLayer({ 
  position, 
  className = '',
  onSignpostClick = (id) => console.log(`Signpost ${id} clicked!`)
}: SignpostLayerProps) {
  const screenWidth = 1920;
  const signpostGap = screenWidth / 3; // ~1/3 of screen width gap between signposts
  const totalSignposts = 9;
  
  // Calculate the total width needed for all signposts with gaps
  const totalWidth = signpostGap * totalSignposts;
  
  // Normalize position for seamless looping
  const normalizedPosition = ((position % totalWidth) + totalWidth) % totalWidth;

  return (
    <div className={`absolute inset-0 overflow-hidden ${className}`}>
      {/* Render multiple sections to ensure continuous coverage during scrolling */}
      {[-1, 0, 1].map((sectionOffset) => (
        <div key={sectionOffset}>
          {Array.from({ length: totalSignposts }, (_, i) => {
            const signpostId = i;
            const baseX = i * signpostGap;
            const adjustedX = -normalizedPosition + baseX + (sectionOffset * totalWidth);
            
            return (
              <div
                key={`${sectionOffset}-${i}`}
                className="absolute"
                style={{
                  left: `${adjustedX}px`,
                  bottom: '24%', // Same y position as the current signpost in Scene
                  width: '240px', // Same width as individual signpost
                  height: '380px', // Increased height to accommodate grass
                  transform: 'translateX(-50%)', // Center the signpost
                }}
              >
                <Signpost
                  onClick={() => onSignpostClick(signpostId)}
                  position={{ x: '50%', y: '0%' }} // Center within the positioned container
                  className=""
                  signpostId={signpostId}
                />
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
}
