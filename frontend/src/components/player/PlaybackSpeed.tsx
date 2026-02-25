'use client';

import { useState, useRef, useEffect } from 'react';
import { FaTachometerAlt } from 'react-icons/fa';

interface PlaybackSpeedProps {
  audioRef: React.RefObject<HTMLAudioElement>;
}

const speeds = [0.25, 0.5, 0.75, 1, 1.25, 1.5, 1.75, 2];

export default function PlaybackSpeed({ audioRef }: PlaybackSpeedProps) {
  const [speed, setSpeed] = useState(1);
  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSpeedChange = (newSpeed: number) => {
    setSpeed(newSpeed);
    if (audioRef.current) {
      audioRef.current.playbackRate = newSpeed;
    }
    setShowMenu(false);
  };

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setShowMenu(!showMenu)}
        className={`flex items-center gap-2 px-3 py-1 rounded-lg transition ${
          speed !== 1 ? 'text-primary-500' : 'text-gray-400 hover:text-white'
        }`}
        title="Playback speed"
      >
        <FaTachometerAlt size={16} />
        <span className="text-sm font-medium">{speed}x</span>
      </button>

      {showMenu && (
        <div className="absolute bottom-full right-0 mb-2 bg-dark-200 rounded-lg shadow-xl border border-gray-800 py-2 min-w-[120px]">
          <div className="px-3 py-1 text-xs text-gray-400 font-semibold">SPEED</div>
          {speeds.map((s) => (
            <button
              key={s}
              onClick={() => handleSpeedChange(s)}
              className={`w-full px-4 py-2 text-left hover:bg-dark-100 transition ${
                speed === s ? 'text-primary-500 font-semibold' : 'text-white'
              }`}
            >
              {s}x {s === 1 && '(Normal)'}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
