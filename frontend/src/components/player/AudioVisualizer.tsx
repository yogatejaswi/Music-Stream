'use client';

import { useEffect, useRef, useState } from 'react';
import { usePlayerStore } from '@/store/playerStore';

interface VisualizerProps {
  width?: number;
  height?: number;
  barCount?: number;
  barColor?: string;
  backgroundColor?: string;
  style?: 'bars' | 'wave' | 'circle';
}

export default function AudioVisualizer({
  width = 400,
  height = 200,
  barCount = 64,
  barColor = '#3b82f6',
  backgroundColor = 'transparent',
  style = 'bars'
}: VisualizerProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();
  const analyserRef = useRef<AnalyserNode | null>(null);
  const dataArrayRef = useRef<Uint8Array | null>(null);
  const { isPlaying, audioRef } = usePlayerStore();
  const [audioContext, setAudioContext] = useState<AudioContext | null>(null);

  // Initialize audio context and analyser
  useEffect(() => {
    if (!audioRef?.current || !isPlaying) return;

    const initializeAudioContext = async () => {
      try {
        // Create audio context
        const context = new (window.AudioContext || (window as any).webkitAudioContext)();
        
        // Create analyser node
        const analyser = context.createAnalyser();
        analyser.fftSize = barCount * 2;
        analyser.smoothingTimeConstant = 0.8;

        // Create media source from audio element
        const source = context.createMediaElementSource(audioRef.current!);
        
        // Connect nodes
        source.connect(analyser);
        analyser.connect(context.destination);

        // Create data array
        const bufferLength = analyser.frequencyBinCount;
        const dataArray = new Uint8Array(bufferLength);

        setAudioContext(context);
        analyserRef.current = analyser;
        dataArrayRef.current = dataArray;

        // Resume context if suspended
        if (context.state === 'suspended') {
          await context.resume();
        }
      } catch (error) {
        console.error('Error initializing audio context:', error);
      }
    };

    initializeAudioContext();

    return () => {
      if (audioContext) {
        audioContext.close();
      }
    };
  }, [audioRef, isPlaying, barCount]);

  // Animation loop
  useEffect(() => {
    if (!isPlaying || !analyserRef.current || !dataArrayRef.current) {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      return;
    }

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const animate = () => {
      if (!analyserRef.current || !dataArrayRef.current) return;

      // Get frequency data
      analyserRef.current.getByteFrequencyData(dataArrayRef.current);

      // Clear canvas
      ctx.fillStyle = backgroundColor;
      ctx.fillRect(0, 0, width, height);

      // Draw visualization based on style
      switch (style) {
        case 'bars':
          drawBars(ctx, dataArrayRef.current);
          break;
        case 'wave':
          drawWave(ctx, dataArrayRef.current);
          break;
        case 'circle':
          drawCircle(ctx, dataArrayRef.current);
          break;
      }

      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isPlaying, width, height, barColor, backgroundColor, style]);

  const drawBars = (ctx: CanvasRenderingContext2D, dataArray: Uint8Array) => {
    const barWidth = width / barCount;
    let x = 0;

    for (let i = 0; i < barCount; i++) {
      const barHeight = (dataArray[i] / 255) * height;
      
      // Create gradient
      const gradient = ctx.createLinearGradient(0, height, 0, height - barHeight);
      gradient.addColorStop(0, barColor);
      gradient.addColorStop(1, barColor + '80');
      
      ctx.fillStyle = gradient;
      ctx.fillRect(x, height - barHeight, barWidth - 2, barHeight);
      
      x += barWidth;
    }
  };

  const drawWave = (ctx: CanvasRenderingContext2D, dataArray: Uint8Array) => {
    ctx.lineWidth = 2;
    ctx.strokeStyle = barColor;
    ctx.beginPath();

    const sliceWidth = width / dataArray.length;
    let x = 0;

    for (let i = 0; i < dataArray.length; i++) {
      const v = dataArray[i] / 128.0;
      const y = (v * height) / 2;

      if (i === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }

      x += sliceWidth;
    }

    ctx.lineTo(width, height / 2);
    ctx.stroke();
  };

  const drawCircle = (ctx: CanvasRenderingContext2D, dataArray: Uint8Array) => {
    const centerX = width / 2;
    const centerY = height / 2;
    const radius = Math.min(width, height) / 4;

    ctx.lineWidth = 2;
    ctx.strokeStyle = barColor;

    for (let i = 0; i < barCount; i++) {
      const angle = (i / barCount) * Math.PI * 2;
      const barHeight = (dataArray[i] / 255) * radius;
      
      const x1 = centerX + Math.cos(angle) * radius;
      const y1 = centerY + Math.sin(angle) * radius;
      const x2 = centerX + Math.cos(angle) * (radius + barHeight);
      const y2 = centerY + Math.sin(angle) * (radius + barHeight);

      ctx.beginPath();
      ctx.moveTo(x1, y1);
      ctx.lineTo(x2, y2);
      ctx.stroke();
    }

    // Draw center circle
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
    ctx.stroke();
  };

  return (
    <div className="flex items-center justify-center">
      <canvas
        ref={canvasRef}
        width={width}
        height={height}
        className="rounded-lg"
        style={{ maxWidth: '100%', height: 'auto' }}
      />
      {!isPlaying && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center text-gray-500 dark:text-gray-400">
            <div className="w-16 h-16 mx-auto mb-2 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center">
              <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.617.816L4.5 13.5H2a1 1 0 01-1-1V7.5a1 1 0 011-1h2.5l3.883-3.316a1 1 0 011.617.816zM14.657 2.929a1 1 0 011.414 0A9.972 9.972 0 0119 10a9.972 9.972 0 01-2.929 7.071 1 1 0 01-1.414-1.414A7.971 7.971 0 0017 10c0-2.21-.894-4.208-2.343-5.657a1 1 0 010-1.414zm-2.829 2.828a1 1 0 011.415 0A5.983 5.983 0 0115 10a5.984 5.984 0 01-1.757 4.243 1 1 0 01-1.415-1.414A3.984 3.984 0 0013 10a3.983 3.983 0 00-1.172-2.828 1 1 0 010-1.415z" clipRule="evenodd" />
              </svg>
            </div>
            <p className="text-sm">Play music to see visualizer</p>
          </div>
        </div>
      )}
    </div>
  );
}