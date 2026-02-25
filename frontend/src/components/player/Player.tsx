'use client';

import { useEffect, useRef, useState } from 'react';
import { usePlayerStore } from '@/store/playerStore';
import PlayerControls from './PlayerControls';
import ProgressBar from './ProgressBar';
import VolumeControl from './VolumeControl';
import PlaybackSpeed from './PlaybackSpeed';
import SleepTimer from './SleepTimer';
import Lyrics from './Lyrics';
import Image from 'next/image';
import { FaHeart, FaRegHeart } from 'react-icons/fa';
import { songsAPI, historyAPI } from '@/lib/api';
import toast from 'react-hot-toast';

export default function Player() {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isLiked, setIsLiked] = useState(false);
  const [songLyrics, setSongLyrics] = useState<string>('');
  const [playStartTime, setPlayStartTime] = useState<number>(0);
  const [hasTracked, setHasTracked] = useState(false);
  const {
    currentSong,
    isPlaying,
    volume,
    setCurrentTime,
    setDuration,
    playNext,
    repeat,
  } = usePlayerStore();

  // Handle play/pause
  useEffect(() => {
    if (!audioRef.current) return;

    if (isPlaying) {
      const playPromise = audioRef.current.play();
      
      if (playPromise !== undefined) {
        playPromise.catch(error => {
          console.log('Playback prevented:', error);
        });
      }
    } else {
      audioRef.current.pause();
    }
  }, [isPlaying]);

  // Handle volume
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  // Handle song change
  useEffect(() => {
    if (audioRef.current && currentSong) {
      console.log('Song changed to:', currentSong.title);
      
      // Reset tracking
      setHasTracked(false);
      setPlayStartTime(Date.now());
      
      // Reset audio element
      audioRef.current.pause();
      audioRef.current.src = currentSong.audioUrl;
      audioRef.current.load();
      
      // Fetch song details including lyrics
      const fetchSongDetails = async () => {
        try {
          const response = await songsAPI.getById(currentSong.id);
          setSongLyrics(response.data.data.lyrics || '');
        } catch (error) {
          console.error('Failed to fetch song details:', error);
        }
      };
      
      fetchSongDetails();
      
      // Play when ready
      if (isPlaying) {
        const playWhenReady = () => {
          const playPromise = audioRef.current?.play();
          
          if (playPromise !== undefined) {
            playPromise.catch(error => {
              console.log('Playback prevented:', error);
            });
          }
        };
        
        // Wait for audio to be ready
        audioRef.current.addEventListener('canplay', playWhenReady, { once: true });
      }
    }
  }, [currentSong, isPlaying]);

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
      
      // Track play after 30 seconds or 50% completion
      if (!hasTracked && currentSong) {
        const duration = audioRef.current.duration;
        const currentTime = audioRef.current.currentTime;
        
        if (currentTime > 30 || (duration > 0 && currentTime / duration > 0.5)) {
          trackPlay(false);
          setHasTracked(true);
        }
      }
    }
  };

  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration);
    }
  };

  const handleEnded = () => {
    // Track as completed
    if (currentSong && !hasTracked) {
      trackPlay(true);
    }
    
    if (repeat === 'one') {
      audioRef.current?.play();
    } else {
      playNext();
    }
  };

  const trackPlay = async (completed: boolean) => {
    if (!currentSong) return;
    
    try {
      const duration = Math.floor((Date.now() - playStartTime) / 1000);
      await historyAPI.track({
        songId: currentSong.id,
        duration,
        completed
      });
    } catch (error) {
      console.error('Failed to track play:', error);
    }
  };

  const handleError = (e: React.SyntheticEvent<HTMLAudioElement, Event>) => {
    console.error('Audio error:', e);
  };

  const handleLike = async () => {
    if (!currentSong) return;
    
    try {
      await songsAPI.like(currentSong.id);
      setIsLiked(!isLiked);
      toast.success(isLiked ? 'Removed from liked songs' : 'Added to liked songs');
    } catch (error) {
      toast.error('Failed to update liked songs');
    }
  };

  if (!currentSong) return null;

  return (
    <>
      <Lyrics lyrics={songLyrics} songTitle={currentSong.title} />
      
      <div className="fixed bottom-0 left-0 right-0 bg-dark-200 border-t border-gray-800 px-4 py-3 z-50">
      <audio
        ref={audioRef}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onEnded={handleEnded}
        onError={handleError}
      />

      <div className="flex items-center justify-between gap-4">
        {/* Song Info */}
        <div className="flex items-center gap-3 min-w-0 flex-1">
          <Image
            src={currentSong.coverImage}
            alt={currentSong.title}
            width={56}
            height={56}
            className="rounded"
          />
          <div className="min-w-0 flex-1">
            <p className="font-semibold truncate">{currentSong.title}</p>
            <p className="text-sm text-gray-400 truncate">{currentSong.artist}</p>
          </div>
          <button
            onClick={handleLike}
            className="text-gray-400 hover:text-primary-500 transition"
          >
            {isLiked ? (
              <FaHeart size={20} className="text-primary-500" />
            ) : (
              <FaRegHeart size={20} />
            )}
          </button>
        </div>

        {/* Player Controls */}
        <div className="flex flex-col items-center gap-2 flex-1 max-w-2xl">
          <PlayerControls audioRef={audioRef} />
          <ProgressBar audioRef={audioRef} />
        </div>

        {/* Volume Control */}
        <div className="flex items-center justify-end gap-3 flex-1">
          <SleepTimer />
          <PlaybackSpeed audioRef={audioRef} />
          <VolumeControl />
        </div>
      </div>
    </div>
    </>
  );
}
