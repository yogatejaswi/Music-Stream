'use client';

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import { FaArrowRight, FaClock, FaCompactDisc, FaHeart, FaMusic, FaRedoAlt } from 'react-icons/fa';
import toast from 'react-hot-toast';
import SongCard from '@/components/song/SongCard';
import { userAPI } from '@/lib/api';

interface LikedSong {
  _id: string;
  title: string;
  artist: string;
  coverImage: string;
  audioUrl: string;
  duration: number;
  likes?: number;
}

export default function LikedSongsPage() {
  const [songs, setSongs] = useState<LikedSong[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const totalDuration = useMemo(() => {
    const seconds = songs.reduce((sum, song) => sum + (song.duration || 0), 0);
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);

    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }

    return `${minutes}m`;
  }, [songs]);

  const fetchLikedSongs = async (showLoader = true) => {
    if (showLoader) {
      setLoading(true);
    } else {
      setRefreshing(true);
    }

    try {
      const response = await userAPI.getLikedSongs();
      setSongs(response.data.data || []);
    } catch (error) {
      console.error('Failed to load liked songs:', error);
      toast.error('Failed to load liked songs');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchLikedSongs();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-dark-300 p-6">
        <div className="animate-pulse space-y-6">
          <div className="h-56 rounded-3xl bg-dark-200" />
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <div className="h-28 rounded-2xl bg-dark-200" />
            <div className="h-28 rounded-2xl bg-dark-200" />
            <div className="h-28 rounded-2xl bg-dark-200" />
          </div>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-5">
            {Array.from({ length: 10 }).map((_, index) => (
              <div key={index} className="aspect-[0.8] rounded-2xl bg-dark-200" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-dark-300 p-6 space-y-8">
      <section className="rounded-3xl border border-white/10 bg-gradient-to-br from-rose-950 via-fuchsia-950 to-slate-950 p-8">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl">
            <p className="mb-3 inline-flex items-center gap-2 rounded-full border border-rose-400/20 bg-rose-500/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.28em] text-rose-200">
              <FaHeart />
              Personal Collection
            </p>
            <h1 className="text-4xl font-bold text-white">Your liked songs, all in one place.</h1>
            <p className="mt-4 text-sm text-slate-300">
              Revisit the tracks you loved most, jump back into your favorites, and keep building your personal taste profile.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() => fetchLikedSongs(false)}
              disabled={refreshing}
              className="inline-flex items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-70"
            >
              <FaRedoAlt className={refreshing ? 'animate-spin' : ''} />
              {refreshing ? 'Refreshing' : 'Refresh'}
            </button>
            <Link
              href="/search"
              className="inline-flex items-center gap-2 rounded-2xl bg-primary-500 px-5 py-3 text-sm font-semibold text-white transition hover:bg-primary-600"
            >
              Discover more songs
              <FaArrowRight />
            </Link>
          </div>
        </div>
      </section>

      <section className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <div className="rounded-2xl border border-white/10 bg-dark-200 p-5">
          <p className="text-xs uppercase tracking-[0.18em] text-gray-500">Liked tracks</p>
          <p className="mt-2 text-3xl font-bold text-white">{songs.length}</p>
          <p className="mt-2 text-sm text-gray-400">Tracks you can jump into instantly.</p>
        </div>
        <div className="rounded-2xl border border-white/10 bg-dark-200 p-5">
          <p className="text-xs uppercase tracking-[0.18em] text-gray-500">Listening time</p>
          <p className="mt-2 flex items-center gap-2 text-3xl font-bold text-white">
            <FaClock className="text-primary-400" />
            {songs.length ? totalDuration : '0m'}
          </p>
          <p className="mt-2 text-sm text-gray-400">Estimated total playtime for this collection.</p>
        </div>
        <div className="rounded-2xl border border-white/10 bg-dark-200 p-5">
          <p className="text-xs uppercase tracking-[0.18em] text-gray-500">Mood</p>
          <p className="mt-2 flex items-center gap-2 text-3xl font-bold text-white">
            <FaCompactDisc className="text-rose-400" />
            Favorites
          </p>
          <p className="mt-2 text-sm text-gray-400">A curated set based on what you actively liked.</p>
        </div>
      </section>

      {songs.length === 0 ? (
        <section className="rounded-3xl border border-dashed border-white/10 bg-dark-200 p-12 text-center">
          <div className="mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-full bg-rose-500/10 text-rose-300">
            <FaHeart size={30} />
          </div>
          <h2 className="text-2xl font-semibold text-white">No liked songs yet</h2>
          <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-gray-400">
            Tap the heart on any song card or player to build your personal favorites collection. Once you like songs, they will show up here automatically.
          </p>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/discover"
              className="inline-flex items-center gap-2 rounded-2xl bg-primary-500 px-5 py-3 font-semibold text-white transition hover:bg-primary-600"
            >
              <FaMusic />
              Explore discovery
            </Link>
            <Link
              href="/charts"
              className="inline-flex items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-5 py-3 font-semibold text-white transition hover:bg-white/10"
            >
              Trending tracks
              <FaArrowRight />
            </Link>
          </div>
        </section>
      ) : (
        <section className="rounded-3xl border border-white/10 bg-dark-200 p-6">
          <div className="mb-6 flex items-center justify-between gap-4">
            <div>
              <h2 className="text-2xl font-semibold text-white">Saved favorites</h2>
              <p className="mt-1 text-sm text-gray-400">Play, revisit, and keep growing your collection.</p>
            </div>
            <div className="rounded-full bg-white/5 px-4 py-2 text-xs uppercase tracking-[0.18em] text-gray-400">
              Updated live from your likes
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-5">
            {songs.map((song, index) => (
              <SongCard key={song._id} song={song} allSongs={songs} songIndex={index} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
