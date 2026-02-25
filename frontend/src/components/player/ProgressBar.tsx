'use client';

import { usePlayerStore } from '@/store/playerStore';

interface ProgressBarProps {
  audioRef: React.RefObject<HTMLAudioElement>;
}

const formatTime = (seconds: number): string => {
  if (isNaN(seconds)) return '0:00';
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
};

export default function ProgressBar({ audioRef }: ProgressBarProps) {
  const { currentTime, duration, setCurrentTime } = usePlayerStore();

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTime = parseFloat(e.target.value);
    setCurrentTime(newTime);
    if (audioRef.current) {
      audioRef.current.currentTime = newTime;
    }
  };

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <div className="flex items-center gap-2 w-full">
      <span className="text-xs text-gray-400 w-10 text-right">
        {formatTime(currentTime)}
      </span>
      
      <div className="relative flex-1 group">
        <input
          type="range"
          min="0"
          max={duration || 0}
          value={currentTime}
          onChange={handleSeek}
          className="w-full h-1 bg-gray-600 rounded-lg appearance-none cursor-pointer"
          style={{
            background: `linear-gradient(to right, #1db954 0%, #1db954 ${progress}%, #4b5563 ${progress}%, #4b5563 100%)`
          }}
        />
      </div>

      <span className="text-xs text-gray-400 w-10">
        {formatTime(duration)}
      </span>
    </div>
  );
}
