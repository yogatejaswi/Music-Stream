'use client';

import { useState } from 'react';
import { usePlayerStore } from '@/store/playerStore';
import { FaVolumeUp, FaVolumeMute } from 'react-icons/fa';

export default function VolumeControl() {
  const { volume, setVolume } = usePlayerStore();
  const [isMuted, setIsMuted] = useState(false);
  const [previousVolume, setPreviousVolume] = useState(volume);

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    if (newVolume > 0) setIsMuted(false);
  };

  const toggleMute = () => {
    if (isMuted) {
      setVolume(previousVolume);
      setIsMuted(false);
    } else {
      setPreviousVolume(volume);
      setVolume(0);
      setIsMuted(true);
    }
  };

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={toggleMute}
        className="text-gray-400 hover:text-white transition"
      >
        {isMuted || volume === 0 ? (
          <FaVolumeMute size={20} />
        ) : (
          <FaVolumeUp size={20} />
        )}
      </button>

      <input
        type="range"
        min="0"
        max="1"
        step="0.01"
        value={volume}
        onChange={handleVolumeChange}
        className="w-24 h-1 bg-gray-600 rounded-lg appearance-none cursor-pointer"
        style={{
          background: `linear-gradient(to right, #1db954 0%, #1db954 ${volume * 100}%, #4b5563 ${volume * 100}%, #4b5563 100%)`
        }}
      />
    </div>
  );
}
