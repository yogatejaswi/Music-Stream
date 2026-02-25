'use client';

import { useState } from 'react';
import { FaChevronDown, FaChevronUp } from 'react-icons/fa';

interface LyricsProps {
  lyrics?: string;
  songTitle: string;
}

export default function Lyrics({ lyrics, songTitle }: LyricsProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  if (!lyrics || lyrics.trim() === '') {
    return null;
  }

  return (
    <div className="fixed bottom-24 right-4 w-96 bg-dark-300 rounded-lg shadow-2xl border border-gray-800 z-40">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between p-4 hover:bg-dark-200 transition rounded-t-lg"
      >
        <div className="flex items-center gap-2">
          <span className="text-lg font-semibold">Lyrics</span>
          <span className="text-sm text-gray-400">- {songTitle}</span>
        </div>
        {isExpanded ? <FaChevronDown /> : <FaChevronUp />}
      </button>
      
      {isExpanded && (
        <div className="p-4 max-h-96 overflow-y-auto">
          <div className="text-sm leading-relaxed whitespace-pre-line text-gray-300">
            {lyrics}
          </div>
        </div>
      )}
    </div>
  );
}
