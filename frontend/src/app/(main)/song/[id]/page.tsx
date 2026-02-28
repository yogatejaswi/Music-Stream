'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { songsAPI } from '@/lib/api';
import { usePlayerStore } from '@/store/playerStore';
import { FaPlay, FaPause, FaHeart, FaRegHeart, FaClock, FaMusic } from 'react-icons/fa';
import Image from 'next/image';
import Link from 'next/link';
import toast from 'react-hot-toast';
import CommentsSection from '@/components/song/CommentsSection';

interface Song {
  _id: string;
  title: string;
  artist: string;
  album?: string;
  genre: string;
  duration: number;
  coverImage: string;
  audioUrl: string;
  playCount: number;
  likes: number;
  createdAt: string;
  lyrics?: string;
}

export default function SongPage() {
  const params = useParams();
  const songId = params.id as string;
  const [song, setSong] = useState<Song | null>(null);
  const [loading, setLoading] = useState(true);
  const [isLiked, setIsLiked] = useState(false);
  const [lyrics, setLyrics] = useState<string>('');
  const { currentSong, isPlaying, setCurrentSong, togglePlay } = usePlayerStore();

  const isCurrentSong = currentSong?.id === songId;

  useEffect(() => {
    if (songId) {
      fetchSong();
      fetchLyrics();
    }
  }, [songId]);

  const fetchSong = async () => {
    try {
      const response = await songsAPI.getById(songId);
      setSong(response.data.data);
    } catch (error) {
      console.error('Error fetching song:', error);
      toast.error('Failed to load song');
    } finally {
      setLoading(false);
    }
  };

  const fetchLyrics = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'}/lyrics/song/${songId}`);
      if (response.ok) {
        const data = await response.json();
        setLyrics(data.lyrics.lyrics);
      }
    } catch (error) {
      console.log('No lyrics available for this song');
    }
  };

  const handlePlay = () => {
    if (!song) return;

    if (isCurrentSong) {
      togglePlay();
    } else {
      setCurrentSong({
        id: song._id,
        title: song.title,
        artist: song.artist,
        audioUrl: song.audioUrl,
        coverImage: song.coverImage,
        duration: song.duration
      });
    }
  };

  const handleLike = async () => {
    if (!song) return;

    try {
      await songsAPI.like(song._id);
      setIsLiked(!isLiked);
      setSong({
        ...song,
        likes: isLiked ? song.likes - 1 : song.likes + 1
      });
      toast.success(isLiked ? 'Removed from liked songs' : 'Added to liked songs');
    } catch (error) {
      toast.error('Failed to update liked songs');
    }
  };

  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse">
          <div className="flex flex-col lg:flex-row gap-8 mb-8">
            <div className="w-full lg:w-80 h-80 bg-dark-300 rounded-lg"></div>
            <div className="flex-1 space-y-4">
              <div className="h-8 bg-dark-300 rounded w-3/4"></div>
              <div className="h-6 bg-dark-300 rounded w-1/2"></div>
              <div className="h-4 bg-dark-300 rounded w-1/4"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!song) {
    return (
      <div className="p-6 text-center">
        <h1 className="text-2xl font-bold mb-4">Song Not Found</h1>
        <p className="text-gray-400 mb-6">The song you're looking for doesn't exist.</p>
        <Link
          href="/dashboard"
          className="px-6 py-3 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition"
        >
          Back to Dashboard
        </Link>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-8">
      {/* Song Header */}
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Cover Image */}
        <div className="w-full lg:w-80 h-80 relative flex-shrink-0">
          <Image
            src={song.coverImage}
            alt={song.title}
            fill
            className="object-cover rounded-lg shadow-2xl"
          />
        </div>

        {/* Song Info */}
        <div className="flex-1 flex flex-col justify-end">
          <div className="mb-4">
            <p className="text-sm text-gray-400 uppercase tracking-wide mb-2">Song</p>
            <h1 className="text-4xl lg:text-6xl font-bold mb-4">{song.title}</h1>
            <div className="flex items-center gap-2 text-lg">
              <Link
                href={`/artist/${encodeURIComponent(song.artist)}`}
                className="font-semibold hover:text-primary-400 transition"
              >
                {song.artist}
              </Link>
              {song.album && (
                <>
                  <span className="text-gray-400">•</span>
                  <Link
                    href={`/album/${encodeURIComponent(song.album)}`}
                    className="hover:text-primary-400 transition"
                  >
                    {song.album}
                  </Link>
                </>
              )}
              <span className="text-gray-400">•</span>
              <span className="text-gray-400">{formatDate(song.createdAt)}</span>
            </div>
          </div>

          {/* Controls */}
          <div className="flex items-center gap-6">
            <button
              onClick={handlePlay}
              className="w-16 h-16 bg-primary-500 hover:bg-primary-600 rounded-full flex items-center justify-center transition shadow-lg"
            >
              {isCurrentSong && isPlaying ? (
                <FaPause size={24} className="text-white" />
              ) : (
                <FaPlay size={24} className="text-white ml-1" />
              )}
            </button>

            <button
              onClick={handleLike}
              className="p-3 hover:bg-dark-300 rounded-full transition"
            >
              {isLiked ? (
                <FaHeart size={24} className="text-primary-500" />
              ) : (
                <FaRegHeart size={24} className="text-gray-400 hover:text-white" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Song Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-dark-300 rounded-lg p-4 text-center">
          <FaMusic className="mx-auto mb-2 text-primary-500" size={24} />
          <p className="text-2xl font-bold">{song.playCount.toLocaleString()}</p>
          <p className="text-sm text-gray-400">Plays</p>
        </div>
        <div className="bg-dark-300 rounded-lg p-4 text-center">
          <FaHeart className="mx-auto mb-2 text-red-500" size={24} />
          <p className="text-2xl font-bold">{song.likes.toLocaleString()}</p>
          <p className="text-sm text-gray-400">Likes</p>
        </div>
        <div className="bg-dark-300 rounded-lg p-4 text-center">
          <FaClock className="mx-auto mb-2 text-blue-500" size={24} />
          <p className="text-2xl font-bold">{formatDuration(song.duration)}</p>
          <p className="text-sm text-gray-400">Duration</p>
        </div>
        <div className="bg-dark-300 rounded-lg p-4 text-center">
          <FaMusic className="mx-auto mb-2 text-green-500" size={24} />
          <p className="text-2xl font-bold capitalize">{song.genre}</p>
          <p className="text-sm text-gray-400">Genre</p>
        </div>
      </div>

      {/* Lyrics */}
      {lyrics && (
        <div className="bg-dark-300 rounded-lg p-6">
          <h2 className="text-2xl font-semibold mb-4">Lyrics</h2>
          <div className="whitespace-pre-line text-gray-300 leading-relaxed">
            {lyrics}
          </div>
        </div>
      )}

      {/* Comments Section */}
      <CommentsSection songId={song._id} />
    </div>
  );
}