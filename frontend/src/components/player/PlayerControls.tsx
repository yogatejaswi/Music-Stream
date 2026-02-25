'use client';

import { useState } from 'react';
import { usePlayerStore } from '@/store/playerStore';
import { FaPlay, FaPause, FaStepBackward, FaStepForward, FaRandom, FaRedoAlt, FaList } from 'react-icons/fa';
import QueuePanel from '../queue/QueuePanel';

interface PlayerControlsProps {
  audioRef: React.RefObject<HTMLAudioElement>;
}

export default function PlayerControls({ audioRef }: PlayerControlsProps) {
  const [showQueue, setShowQueue] = useState(false);
  const {
    isPlaying,
    shuffle,
    repeat,
    togglePlay,
    playNext,
    playPrevious,
    toggleShuffle,
    toggleRepeat,
  } = usePlayerStore();

  return (
    <>
      <div className="flex items-center gap-4">
        {/* Shuffle */}
        <button
          onClick={toggleShuffle}
          className={`hover:text-white transition ${shuffle ? 'text-primary-500' : 'text-gray-400'}`}
          title={shuffle ? 'Shuffle: On' : 'Shuffle: Off'}
        >
          <FaRandom size={16} />
        </button>

        {/* Previous */}
        <button
          onClick={playPrevious}
          className="text-gray-400 hover:text-white transition"
          title="Previous"
        >
          <FaStepBackward size={20} />
        </button>

        {/* Play/Pause */}
        <button
          onClick={togglePlay}
          className="bg-white text-black rounded-full p-2 hover:scale-105 transition"
          title={isPlaying ? 'Pause' : 'Play'}
        >
          {isPlaying ? <FaPause size={20} /> : <FaPlay size={20} className="ml-0.5" />}
        </button>

        {/* Next */}
        <button
          onClick={playNext}
          className="text-gray-400 hover:text-white transition"
          title="Next"
        >
          <FaStepForward size={20} />
        </button>

        {/* Repeat */}
        <button
          onClick={toggleRepeat}
          className={`hover:text-white transition flex items-center ${repeat !== 'off' ? 'text-primary-500' : 'text-gray-400'}`}
          title={`Repeat: ${repeat === 'off' ? 'Off' : repeat === 'one' ? 'One' : 'All'}`}
        >
          <FaRedoAlt size={16} />
          {repeat === 'one' && <span className="text-xs ml-1">1</span>}
        </button>

        {/* Queue */}
        <button
          onClick={() => setShowQueue(true)}
          className="text-gray-400 hover:text-white transition ml-2"
          title="View Queue"
        >
          <FaList size={16} />
        </button>
      </div>

      <QueuePanel isOpen={showQueue} onClose={() => setShowQueue(false)} />
    </>
  );
}
