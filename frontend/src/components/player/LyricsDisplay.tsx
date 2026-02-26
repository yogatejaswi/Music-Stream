'use client';

import { useState, useEffect } from 'react';
import { usePlayerStore } from '@/store/playerStore';
import { lyricsAPI } from '@/lib/api';
import { FaMusic, FaSpinner, FaEye, FaEyeSlash } from 'react-icons/fa';

interface LyricsLine {
  time: number;
  text: string;
}

interface Lyrics {
  _id: string;
  songId: string;
  lyrics: string;
  syncedLyrics?: LyricsLine[];
  language: string;
  verified: boolean;
}

export default function LyricsDisplay() {
  const { currentSong, isPlaying, currentTime } = usePlayerStore();
  const [lyrics, setLyrics] = useState<Lyrics | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showLyrics, setShowLyrics] = useState(true);
  const [currentLineIndex, setCurrentLineIndex] = useState(-1);

  // Fetch lyrics when song changes
  useEffect(() => {
    if (!currentSong?._id) {
      setLyrics(null);
      return;
    }

    const fetchLyrics = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const response = await lyricsAPI.getSongLyrics(currentSong._id);
        setLyrics(response.data.lyrics);
      } catch (err: any) {
        setError(err.response?.data?.message || 'Lyrics not available');
        setLyrics(null);
      } finally {
        setLoading(false);
      }
    };

    fetchLyrics();
  }, [currentSong?._id]);

  // Update current line for synced lyrics
  useEffect(() => {
    if (!lyrics?.syncedLyrics || !isPlaying) return;

    const updateCurrentLine = () => {
      const currentTimeSeconds = currentTime;
      let lineIndex = -1;

      for (let i = 0; i < lyrics.syncedLyrics.length; i++) {
        if (currentTimeSeconds >= lyrics.syncedLyrics[i].time) {
          lineIndex = i;
        } else {
          break;
        }
      }

      setCurrentLineIndex(lineIndex);
    };

    updateCurrentLine();
  }, [currentTime, lyrics?.syncedLyrics, isPlaying]);

  if (!currentSong) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-gray-500 dark:text-gray-400">
        <FaMusic size={48} className="mb-4 opacity-50" />
        <p>No song playing</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-full">
        <FaSpinner className="animate-spin text-primary-500 mb-4" size={32} />
        <p className="text-gray-600 dark:text-gray-400">Loading lyrics...</p>
      </div>
    );
  }

  if (error || !lyrics) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-gray-500 dark:text-gray-400">
        <FaMusic size={48} className="mb-4 opacity-50" />
        <p className="text-center mb-2">
          {error || 'No lyrics available'}
        </p>
        <p className="text-sm text-center">
          for "{currentSong.title}" by {currentSong.artist}
        </p>
      </div>
    );
  }

  const toggleLyrics = () => {
    setShowLyrics(!showLyrics);
  };

  const renderSyncedLyrics = () => {
    if (!lyrics.syncedLyrics) return null;

    return (
      <div className="space-y-2">
        {lyrics.syncedLyrics.map((line, index) => (
          <div
            key={index}
            className={`transition-all duration-300 p-2 rounded ${
              index === currentLineIndex
                ? 'text-primary-500 font-semibold bg-primary-50 dark:bg-primary-900/20 scale-105'
                : index < currentLineIndex
                ? 'text-gray-400 dark:text-gray-500'
                : 'text-gray-700 dark:text-gray-300'
            }`}
          >
            {line.text}
          </div>
        ))}
      </div>
    );
  };

  const renderStaticLyrics = () => {
    return (
      <div className="whitespace-pre-line text-gray-700 dark:text-gray-300 leading-relaxed">
        {lyrics.lyrics}
      </div>
    );
  };

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
        <div>
          <h3 className="font-semibold text-gray-900 dark:text-white">
            {currentSong.title}
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            by {currentSong.artist}
          </p>
        </div>
        <div className="flex items-center space-x-2">
          {lyrics.verified && (
            <span className="text-xs bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 px-2 py-1 rounded">
              Verified
            </span>
          )}
          <button
            onClick={toggleLyrics}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            title={showLyrics ? 'Hide lyrics' : 'Show lyrics'}
          >
            {showLyrics ? (
              <FaEyeSlash className="text-gray-600 dark:text-gray-400" />
            ) : (
              <FaEye className="text-gray-600 dark:text-gray-400" />
            )}
          </button>
        </div>
      </div>

      {/* Lyrics Content */}
      {showLyrics && (
        <div className="flex-1 overflow-y-auto p-4">
          {lyrics.syncedLyrics ? renderSyncedLyrics() : renderStaticLyrics()}
        </div>
      )}

      {!showLyrics && (
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center text-gray-500 dark:text-gray-400">
            <FaEyeSlash size={48} className="mx-auto mb-4 opacity-50" />
            <p>Lyrics hidden</p>
            <button
              onClick={toggleLyrics}
              className="mt-2 text-primary-500 hover:text-primary-600 text-sm"
            >
              Click to show
            </button>
          </div>
        </div>
      )}

      {/* Footer */}
      <div className="p-2 border-t border-gray-200 dark:border-gray-700">
        <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
          Language: {lyrics.language.toUpperCase()} • 
          {lyrics.syncedLyrics ? ' Synced lyrics' : ' Static lyrics'}
        </p>
      </div>
    </div>
  );
}