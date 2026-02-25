'use client';

import { useState, useEffect, useRef } from 'react';
import { FaMoon, FaTimes } from 'react-icons/fa';
import { usePlayerStore } from '@/store/playerStore';
import toast from 'react-hot-toast';

const presets = [
  { label: '15 min', minutes: 15 },
  { label: '30 min', minutes: 30 },
  { label: '45 min', minutes: 45 },
  { label: '1 hour', minutes: 60 },
];

export default function SleepTimer() {
  const [showMenu, setShowMenu] = useState(false);
  const [timeLeft, setTimeLeft] = useState<number | null>(null);
  const [customMinutes, setCustomMinutes] = useState('');
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const { setCurrentSong, isPlaying } = usePlayerStore();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (timeLeft !== null && timeLeft > 0) {
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev === null || prev <= 1) {
            stopPlayback();
            return null;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [timeLeft]);

  const stopPlayback = () => {
    setCurrentSong(null);
    toast.success('Sleep timer ended - playback stopped');
  };

  const startTimer = (minutes: number) => {
    setTimeLeft(minutes * 60);
    setShowMenu(false);
    toast.success(`Sleep timer set for ${minutes} minutes`);
  };

  const cancelTimer = () => {
    setTimeLeft(null);
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    toast.success('Sleep timer cancelled');
  };

  const handleCustomTimer = () => {
    const minutes = parseInt(customMinutes);
    if (isNaN(minutes) || minutes <= 0) {
      toast.error('Please enter a valid number');
      return;
    }
    startTimer(minutes);
    setCustomMinutes('');
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setShowMenu(!showMenu)}
        className={`flex items-center gap-2 px-3 py-1 rounded-lg transition ${
          timeLeft !== null ? 'text-primary-500' : 'text-gray-400 hover:text-white'
        }`}
        title="Sleep timer"
      >
        <FaMoon size={16} />
        {timeLeft !== null && (
          <span className="text-sm font-medium">{formatTime(timeLeft)}</span>
        )}
      </button>

      {showMenu && (
        <div className="absolute bottom-full right-0 mb-2 bg-dark-200 rounded-lg shadow-xl border border-gray-800 py-2 min-w-[200px]">
          <div className="px-3 py-1 text-xs text-gray-400 font-semibold">SLEEP TIMER</div>
          
          {timeLeft === null ? (
            <>
              {presets.map((preset) => (
                <button
                  key={preset.minutes}
                  onClick={() => startTimer(preset.minutes)}
                  className="w-full px-4 py-2 text-left hover:bg-dark-100 transition text-white"
                >
                  {preset.label}
                </button>
              ))}
              
              <div className="px-4 py-2 border-t border-gray-800 mt-2">
                <p className="text-xs text-gray-400 mb-2">Custom</p>
                <div className="flex gap-2">
                  <input
                    type="number"
                    placeholder="Minutes"
                    className="flex-1 bg-dark-100 border border-gray-700 rounded px-2 py-1 text-sm text-white"
                    value={customMinutes}
                    onChange={(e) => setCustomMinutes(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleCustomTimer()}
                  />
                  <button
                    onClick={handleCustomTimer}
                    className="bg-primary-500 hover:bg-primary-600 text-white px-3 py-1 rounded text-sm"
                  >
                    Set
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div className="px-4 py-2">
              <p className="text-sm text-white mb-2">
                Playback will stop in {formatTime(timeLeft)}
              </p>
              <button
                onClick={cancelTimer}
                className="w-full bg-red-500 hover:bg-red-600 text-white px-3 py-2 rounded flex items-center justify-center gap-2"
              >
                <FaTimes />
                Cancel Timer
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
