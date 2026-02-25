'use client';

import { useState } from 'react';
import { usePlayerStore } from '@/store/playerStore';
import { FaTimes, FaPlay, FaTrash, FaRandom } from 'react-icons/fa';
import Image from 'next/image';

interface QueuePanelProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function QueuePanel({ isOpen, onClose }: QueuePanelProps) {
  const { queue, currentSong, setQueue } = usePlayerStore();
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  if (!isOpen) return null;

  const currentIndex = queue.findIndex(s => s.id === currentSong?.id);
  const upNext = queue.slice(currentIndex + 1);
  const history = queue.slice(0, currentIndex);

  const handlePlaySong = (index: number) => {
    const newQueue = [...queue];
    setQueue(newQueue, index);
  };

  const handleRemoveSong = (index: number) => {
    const newQueue = queue.filter((_, i) => i !== index);
    setQueue(newQueue, currentIndex >= index ? currentIndex - 1 : currentIndex);
  };

  const handleClearQueue = () => {
    if (confirm('Clear the entire queue?')) {
      setQueue(currentSong ? [currentSong] : [], 0);
    }
  };

  const handleShuffle = () => {
    if (queue.length <= 1) return;
    
    const current = currentSong;
    const remaining = queue.filter(s => s.id !== current?.id);
    
    // Fisher-Yates shuffle
    for (let i = remaining.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [remaining[i], remaining[j]] = [remaining[j], remaining[i]];
    }
    
    const newQueue = current ? [current, ...remaining] : remaining;
    setQueue(newQueue, 0);
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-end justify-end">
      <div className="bg-dark-300 w-full md:w-96 h-[80vh] flex flex-col shadow-2xl">
        {/* Header */}
        <div className="p-4 border-b border-gray-800 flex items-center justify-between">
          <h2 className="text-xl font-bold">Queue</h2>
          <div className="flex gap-2">
            <button
              onClick={handleShuffle}
              className="p-2 hover:bg-dark-200 rounded-lg transition"
              title="Shuffle queue"
            >
              <FaRandom />
            </button>
            <button
              onClick={handleClearQueue}
              className="p-2 hover:bg-dark-200 rounded-lg transition"
              title="Clear queue"
            >
              <FaTrash />
            </button>
            <button
              onClick={onClose}
              className="p-2 hover:bg-dark-200 rounded-lg transition"
            >
              <FaTimes />
            </button>
          </div>
        </div>

        {/* Queue Content */}
        <div className="flex-1 overflow-y-auto">
          {queue.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-gray-400">
              <p>No songs in queue</p>
            </div>
          ) : (
            <div>
              {/* Now Playing */}
              {currentSong && (
                <div className="p-4 border-b border-gray-800">
                  <p className="text-xs text-gray-400 mb-2">NOW PLAYING</p>
                  <div className="flex items-center gap-3 bg-primary-500/20 p-3 rounded-lg">
                    <Image
                      src={currentSong.coverImage}
                      alt={currentSong.title}
                      width={48}
                      height={48}
                      className="rounded"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold truncate">{currentSong.title}</p>
                      <p className="text-sm text-gray-400 truncate">{currentSong.artist}</p>
                    </div>
                    <span className="text-sm text-gray-400">
                      {formatDuration(currentSong.duration)}
                    </span>
                  </div>
                </div>
              )}

              {/* Up Next */}
              {upNext.length > 0 && (
                <div className="p-4">
                  <p className="text-xs text-gray-400 mb-2">UP NEXT ({upNext.length})</p>
                  <div className="space-y-1">
                    {upNext.map((song, idx) => {
                      const actualIndex = currentIndex + 1 + idx;
                      return (
                        <div
                          key={`${song.id}-${actualIndex}`}
                          className="flex items-center gap-3 p-2 rounded-lg hover:bg-dark-200 transition group"
                          onMouseEnter={() => setHoveredIndex(actualIndex)}
                          onMouseLeave={() => setHoveredIndex(null)}
                        >
                          <div className="relative w-10 h-10 flex-shrink-0">
                            <Image
                              src={song.coverImage}
                              alt={song.title}
                              width={40}
                              height={40}
                              className="rounded"
                            />
                            {hoveredIndex === actualIndex && (
                              <button
                                onClick={() => handlePlaySong(actualIndex)}
                                className="absolute inset-0 bg-black/60 flex items-center justify-center rounded"
                              >
                                <FaPlay size={12} />
                              </button>
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium truncate">{song.title}</p>
                            <p className="text-xs text-gray-400 truncate">{song.artist}</p>
                          </div>
                          <span className="text-xs text-gray-400">
                            {formatDuration(song.duration)}
                          </span>
                          <button
                            onClick={() => handleRemoveSong(actualIndex)}
                            className="opacity-0 group-hover:opacity-100 p-1 hover:text-red-500 transition"
                          >
                            <FaTimes size={12} />
                          </button>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* History */}
              {history.length > 0 && (
                <div className="p-4 border-t border-gray-800">
                  <p className="text-xs text-gray-400 mb-2">PREVIOUSLY PLAYED ({history.length})</p>
                  <div className="space-y-1 opacity-60">
                    {history.reverse().map((song, idx) => {
                      const actualIndex = history.length - 1 - idx;
                      return (
                        <div
                          key={`${song.id}-${actualIndex}`}
                          className="flex items-center gap-3 p-2 rounded-lg hover:bg-dark-200 transition"
                        >
                          <Image
                            src={song.coverImage}
                            alt={song.title}
                            width={40}
                            height={40}
                            className="rounded"
                          />
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium truncate">{song.title}</p>
                            <p className="text-xs text-gray-400 truncate">{song.artist}</p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
