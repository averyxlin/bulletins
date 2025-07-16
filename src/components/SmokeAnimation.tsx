'use client';

import { useEffect, useState, useRef } from 'react';
import Image from 'next/image';

interface SmokeAnimationProps {
  isActive: boolean;
  className?: string;
}

interface SmokeFrame {
  x: number;
  y: number;
  w: number;
  h: number;
  duration: number;
}

export default function SmokeAnimation({ isActive, className = '' }: SmokeAnimationProps) {
  const [currentFrame, setCurrentFrame] = useState(0);
  const [animationPhase, setAnimationPhase] = useState<'fadeIn' | 'idle' | 'fadeOut' | 'stopped'>('stopped');
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const phaseTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Smoke v8 spritesheet data - 25 frames (0-24)
  const frames: SmokeFrame[] = [
    // Fade in frames (0-4)
    { x: 0, y: 0, w: 64, h: 64, duration: 100 },
    { x: 64, y: 0, w: 64, h: 64, duration: 100 },
    { x: 128, y: 0, w: 64, h: 64, duration: 100 },
    { x: 192, y: 0, w: 64, h: 64, duration: 100 },
    { x: 256, y: 0, w: 64, h: 64, duration: 100 },
    // Idle frames (5-16)
    { x: 0, y: 64, w: 64, h: 64, duration: 100 },
    { x: 64, y: 64, w: 64, h: 64, duration: 100 },
    { x: 128, y: 64, w: 64, h: 64, duration: 100 },
    { x: 192, y: 64, w: 64, h: 64, duration: 100 },
    { x: 256, y: 64, w: 64, h: 64, duration: 100 },
    { x: 0, y: 128, w: 64, h: 64, duration: 100 },
    { x: 64, y: 128, w: 64, h: 64, duration: 100 },
    { x: 128, y: 128, w: 64, h: 64, duration: 100 },
    { x: 192, y: 128, w: 64, h: 64, duration: 100 },
    { x: 256, y: 128, w: 64, h: 64, duration: 100 },
    { x: 0, y: 192, w: 64, h: 64, duration: 100 },
    { x: 64, y: 192, w: 64, h: 64, duration: 100 },
    // Fade out frames (17-24)
    { x: 128, y: 192, w: 64, h: 64, duration: 100 },
    { x: 192, y: 192, w: 64, h: 64, duration: 100 },
    { x: 256, y: 192, w: 64, h: 64, duration: 100 },
    { x: 0, y: 256, w: 64, h: 64, duration: 100 },
    { x: 64, y: 256, w: 64, h: 64, duration: 100 },
    { x: 128, y: 256, w: 64, h: 64, duration: 100 },
    { x: 192, y: 256, w: 64, h: 64, duration: 100 },
    { x: 256, y: 256, w: 64, h: 64, duration: 100 },
  ];

  // Animation phases
  const phases = {
    fadeIn: { start: 0, end: 4 },
    idle: { start: 5, end: 16 },
    fadeOut: { start: 17, end: 24 }
  };

  // Clear intervals and timeouts
  const clearAnimations = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    if (phaseTimeoutRef.current) {
      clearTimeout(phaseTimeoutRef.current);
      phaseTimeoutRef.current = null;
    }
  };

  // Start animation
  const startAnimation = () => {
    clearAnimations();
    setAnimationPhase('fadeIn');
    setCurrentFrame(0);

    intervalRef.current = setInterval(() => {
      setCurrentFrame(prevFrame => {
        let nextFrame = prevFrame + 1;
        
        // Handle phase transitions based on current frame
        if (prevFrame === phases.fadeIn.end) {
          setAnimationPhase('idle');
          nextFrame = phases.idle.start;
        } else if (prevFrame === phases.idle.end) {
          // Loop back to start of idle phase
          nextFrame = phases.idle.start;
        } else if (prevFrame === phases.fadeOut.end) {
          setAnimationPhase('stopped');
          clearAnimations();
          nextFrame = 0;
        }
        
        // Ensure frame is within bounds
        return Math.max(0, Math.min(nextFrame, frames.length - 1));
      });
    }, 100); // 100ms per frame as specified in the JSON
  };

  // Start fade out animation
  const startFadeOut = () => {
    if (animationPhase === 'stopped') return;
    
    clearAnimations();
    setAnimationPhase('fadeOut');
    setCurrentFrame(phases.fadeOut.start);

    intervalRef.current = setInterval(() => {
      setCurrentFrame(prevFrame => {
        let nextFrame = prevFrame + 1;
        
        if (prevFrame === phases.fadeOut.end) {
          setAnimationPhase('stopped');
          clearAnimations();
          nextFrame = 0;
        }
        
        // Ensure frame is within bounds
        return Math.max(0, Math.min(nextFrame, frames.length - 1));
      });
    }, 100);
  };

  // Handle isActive changes
  useEffect(() => {
    if (isActive && animationPhase === 'stopped') {
      startAnimation();
    } else if (!isActive && (animationPhase === 'fadeIn' || animationPhase === 'idle')) {
      startFadeOut();
    }
  }, [isActive, animationPhase]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      clearAnimations();
    };
  }, []);

  // Don't render if stopped
  if (animationPhase === 'stopped') {
    return null;
  }

  const currentFrameData = frames[currentFrame];

  // Safety check to prevent undefined access
  if (!currentFrameData) {
    return null;
  }

  return (
    <div className={`absolute ${className}`}>
      <div
        className="relative"
        style={{
          width: '80px', 
          height: '80px', 
          backgroundImage: 'url(/assets/smoke/SpriteSheets/Smoke_v8/All_frame/Smoke_v8.png)',
          backgroundPosition: `-${currentFrameData.x * 1.25}px -${currentFrameData.y * 1.25}px`,
          backgroundSize: '400px 400px', 
          backgroundRepeat: 'no-repeat',
          imageRendering: 'pixelated' as any,
        }}
      />
    </div>
  );
}
