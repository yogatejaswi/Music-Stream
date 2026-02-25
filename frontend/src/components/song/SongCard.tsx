'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { usePlayerStore } from '@/store/playerStore';
import { FaPlay, FaPause, FaHeart, FaRegHeart } from 'react-icons/fa';
import { songsAPI } from '@/lib/api';
import toast from 'react-hot-toast';

interface SongCardProps {
  song: {
    _id: string;
    title: string;
    artist: string;
    coverImage: string;
    audioUrl: string;
    duration: number;
  };
  allSongs?: any[];
  songIndex?: number;
}

export default function SongCard({ song, allSongs = [], songIndex = 0 }: SongCardProps) {
  const { currentSong, isPlaying, setCurrentSong, setQueue, togglePlay } = usePlayerStore();
  const [isLiked, setIsLiked] = useState(false);
  const isCurrentSong = currentSong?.id === song._id;

  const handlePlay = () => {
    if (isCurrentSong) {
      togglePlay();
    } else {
      // If we have a list of songs, set the queue
      if (allSongs.length > 0) {
        const queue = allSongs.map(s => ({
          id: s._id,
          title: s.title,
          artist: s.artist,
          audioUrl: s.audioUrl,
          coverImage: s.coverImage,
          duration: s.duration
        }));
        setQueue(queue, songIndex);
      } else {
        // Otherwise just play this single song
        setCurrentSong({
          id: song._id,
          title: song.title,
          artist: song.artist,
          audioUrl: song.audioUrl,
          coverImage: song.coverImage,
          duration: song.duration
        });
      }
    }
  };

  const handleLike = async (e: React.MouseEvent) => {
    e.stopPropagation();
    
    try {
      await songsAPI.like(song._id);
      setIsLiked(!isLiked);
      toast.success(isLiked ? 'Removed from liked songs' : 'Added to liked songs');
    } catch (error) {
      toast.error('Failed to update liked songs');
    }
  };

  return (
    <div className="card group cursor-pointer relative">
      <Link href={`/song/${song._id}`}>
        <div className="relative aspect-square mb-3">
          <Image
            src={song.coverImage}
            alt={song.title}
            fill
            className="object-cover rounded"
          />
        </div>
      </Link>
      
      <button
        onClick={handlePlay}
        className="absolute bottom-16 right-2 bg-primary-500 rounded-full p-3 opacity-0 group-hover:opacity-100 transition-all transform translate-y-2 group-hover:translate-y-0 shadow-lg"
      >
        {isCurrentSong && isPlaying ? (
          <FaPause size={16} className="text-white" />
        ) : (
          <FaPlay size={16} className="text-white ml-0.5" />
        )}
      </button>
      
      <button
        onClick={handleLike}
        className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
      >
        {isLiked ? (
          <FaHeart size={20} className="text-primary-500" />
        ) : (
          <FaRegHeart size={20} className="text-white drop-shadow-lg" />
        )}
      </button>
      
      <Link href={`/song/${song._id}`}>
        <h3 className="font-semibold truncate hover:text-primary-400 transition">{song.title}</h3>
        <p className="text-sm text-gray-400 truncate hover:text-gray-300 transition">{song.artist}</p>
      </Link>
    </div>
  );
}
