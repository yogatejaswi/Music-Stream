'use client';

import { useState } from 'react';
import Image from 'next/image';
import { usePlayerStore } from '@/store/playerStore';
import { FaPlay, FaPause, FaStepForward, FaStepBackward, FaExpand, FaCompress } from 'react-icons/fa';

export default function MiniPlayer() {
  const [isExpanded, setIsExpanded] = useState(false);
  const { 
    currentSong, 
    isPlaying, 
    currentTime, 
    duration,
    togglePlay, 
    nextSong, 
    previousSong 
  } = usePlayerStore();

  if (!currentSong) return null;

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  if (isExpanded) {
    return (
      <div className="fixed bottom-0 left-0 right-0 bg-dark-400 border-t border-gray-700 p-4 z-50">
        <div className="flex items-center justify-between max-w-6xl mx-auto">
          {/* Song Info */}
          <div className="flex items-center gap-4 flex-1 min-w-0">
            <div className="relative w-16 h-16 flex-shrink-0">
              <Image
                src={currentSong.coverImage}
                alt={currentSong.title}
                fill
                className="object-cover rounded"
              />
            </div>
            <div className="min-w-0 flex-1">
              <h3 className="font-semibold truncate">{currentSong.title}</h3>
              <p className="text-sm text-gray-400 truncate">{currentSong.artist}</p>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-xs text-gray-500">{formatTime(currentTime)}</span>
                <div className="flex-1 bg-gray-600 rounded-full h-1">
                  <div 
                    className="bg-primary-500 h-1 rounded-full transition-all duration-300"
                    style={{ width: `${progress}%` }}
                  />
                </div>
                <span className="text-xs text-gray-500">{formatTime(duration)}</span>
              </div>
            </div>
          </div>

          {/* Controls */}
          <div className="flex items-center gap-4 mx-8">
            <button
              onClick={previousSong}
              className="p-2 hover:bg-dark-300 rounded-full transition"
            >
              <FaStepBackward size={16} />
            </button>
            <button
              onClick={togglePlay}
              className="p-3 bg-primary-500 hover:bg-primary-600 rounded-full transition"
            >
              {isPlaying ? (
                <FaPause size={16} className="text-white" />
              ) : (
                <FaPlay size={16} className="text-white ml-0.5" />
              )}
            </button>
            <button
              onClick={nextSong}
              className="p-2 hover:bg-dark-300 rounded-full transition"
            >
              <FaStepForward size={16} />
            </button>
          </div>

          {/* Collapse Button */}
          <button
            onClick={() => setIsExpanded(false)}
            className="p-2 hover:bg-dark-300 rounded-full transition"
          >
            <FaCompress size={16} />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed bottom-4 right-4 bg-dark-400 rounded-lg shadow-lg border border-gray-700 p-3 z-50 max-w-xs">
      <div className="flex items-center gap-3">
        {/* Song Info */}
        <div className="relative w-12 h-12 flex-shrink-0">
          <Image
            src={currentSong.coverImage}
            alt={currentSong.title}
            fill
            className="object-cover rounded"
          />
        </div>
        <div className="min-w-0 flex-1">
          <h4 className="font-medium text-sm truncate">{currentSong.title}</h4>
          <p className="text-xs text-gray-400 truncate">{currentSong.artist}</p>
          
          {/* Progress Bar */}
          <div className="mt-1 bg-gray-600 rounded-full h-1">
            <div 
              className="bg-primary-500 h-1 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-1">
          <button
            onClick={togglePlay}
            className="p-2 bg-primary-500 hover:bg-primary-600 rounded-full transition"
          >
            {isPlaying ? (
              <FaPause size={12} className="text-white" />
            ) : (
              <FaPlay size={12} className="text-white ml-0.5" />
            )}
          </button>
          <button
            onClick={() => setIsExpanded(true)}
            className="p-2 hover:bg-dark-300 rounded-full transition"
          >
            <FaExpand size={12} />
          </button>
        </div>
      </div>
    </div>
  );
}