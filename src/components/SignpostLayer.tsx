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
  const baseSignposts = 9; // The core 9 signposts (0-8)
  
  // Calculate how many signposts have "passed" based on position
  // This creates a continuous incrementing sequence
  const signpostOffset = Math.floor(position / signpostGap);
  
  // Render enough signposts to cover the screen plus some buffer
  const signpostsToRender = 10; // Render 10 signposts to ensure screen coverage
  
  return (
    <div className={`absolute inset-0 overflow-hidden ${className}`}>
      {Array.from({ length: signpostsToRender }, (_, i) => {
        // Calculate the actual signpost index in the world
        const worldSignpostIndex = signpostOffset + i - 3; // Start 3 signposts before current position
        
        // Map to base signpost ID (0-8) for slideshow functionality
        const signpostId = ((worldSignpostIndex % baseSignposts) + baseSignposts) % baseSignposts;
        
        // Calculate display number (cycles 1-9, then restarts at 1)
        const displayNumber = ((worldSignpostIndex % baseSignposts) + baseSignposts) % baseSignposts + 1;
        
        // Calculate position
        const baseX = worldSignpostIndex * signpostGap;
        const adjustedX = -position + baseX;
        
        return (
          <div
            key={worldSignpostIndex}
            className="absolute"
            style={{
              left: `${adjustedX}px`,
              bottom: '24%',
              width: '240px',
              height: '380px',
              transform: 'translateX(-50%)',
            }}
          >
            <Signpost
              onClick={() => onSignpostClick(signpostId)}
              position={{ x: '50%', y: '0%' }}
              className=""
              signpostId={signpostId}
              displayNumber={displayNumber} // Pass the continuous display number
            />
          </div>
        );
      })}
    </div>
  );
}
