'use client';

import { useMemo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useOfflineStore } from '@/store/offlineStore';
import { usePlayerStore } from '@/store/playerStore';
import DownloadButton from '@/components/offline/DownloadButton';
import { FaDownload, FaMusic, FaPlay, FaTrash } from 'react-icons/fa';
import toast from 'react-hot-toast';

const formatDuration = (seconds: number) => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
};

const formatBytes = (value: number) => {
  if (value === 0) return '0 B';

  const units = ['B', 'KB', 'MB', 'GB'];
  const index = Math.min(Math.floor(Math.log(value) / Math.log(1024)), units.length - 1);
  const size = value / Math.pow(1024, index);
  return `${size.toFixed(index === 0 ? 0 : 1)} ${units[index]}`;
};

export default function DownloadsPage() {
  const { downloadedSongs, clearAllDownloads, getStorageInfo } = useOfflineStore();
  const { setQueue, setCurrentSong } = usePlayerStore();

  const storage = getStorageInfo();
  const sortedSongs = useMemo(
    () =>
      [...downloadedSongs].sort(
        (a, b) => new Date(b.downloadedAt).getTime() - new Date(a.downloadedAt).getTime()
      ),
    [downloadedSongs]
  );

  const handlePlay = (songId: string) => {
    const queue = sortedSongs
      .filter((song) => song.audioUrl)
      .map((song) => ({
        id: song._id,
        title: song.title,
        artist: song.artist,
        audioUrl: song.audioUrl,
        coverImage: song.coverImage,
        duration: song.duration,
      }));

    const startIndex = queue.findIndex((song) => song.id === songId);

    if (startIndex === -1) {
      const selectedSong = sortedSongs.find((song) => song._id === songId);
      if (!selectedSong?.audioUrl) {
        toast.error('This download needs to be downloaded again before it can play offline.');
        return;
      }

      setCurrentSong({
        id: selectedSong._id,
        title: selectedSong.title,
        artist: selectedSong.artist,
        audioUrl: selectedSong.audioUrl,
        coverImage: selectedSong.coverImage,
        duration: selectedSong.duration,
      });
      return;
    }

    setQueue(queue, startIndex);
  };

  const handleClearAll = () => {
    clearAllDownloads();
    toast.success('All downloads cleared');
  };

  return (
    <div className="p-6 space-y-8">
      <section className="rounded-3xl bg-gradient-to-r from-sky-600 via-cyan-500 to-emerald-500 p-8 text-white">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-white/80">Offline Library</p>
            <h1 className="mt-2 text-4xl font-bold">Downloaded Songs</h1>
            <p className="mt-3 max-w-2xl text-sm text-white/85">
              All the tracks you saved for offline listening appear here in one place.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
            <div className="rounded-2xl bg-black/15 p-4 backdrop-blur-sm">
              <p className="text-xs uppercase tracking-[0.2em] text-white/70">Songs</p>
              <p className="mt-2 text-3xl font-bold">{sortedSongs.length}</p>
            </div>
            <div className="rounded-2xl bg-black/15 p-4 backdrop-blur-sm">
              <p className="text-xs uppercase tracking-[0.2em] text-white/70">Used</p>
              <p className="mt-2 text-3xl font-bold">{formatBytes(storage.used)}</p>
            </div>
            <div className="rounded-2xl bg-black/15 p-4 backdrop-blur-sm col-span-2 sm:col-span-1">
              <p className="text-xs uppercase tracking-[0.2em] text-white/70">Available</p>
              <p className="mt-2 text-3xl font-bold">{formatBytes(storage.available)}</p>
            </div>
          </div>
        </div>
      </section>

      <section className="rounded-3xl bg-dark-300 p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-2xl font-semibold text-white">Your offline collection</h2>
            <p className="text-sm text-gray-400">
              Storage usage: {storage.percentage.toFixed(1)}% of your offline limit
            </p>
          </div>

          {sortedSongs.length > 0 && (
            <button
              onClick={handleClearAll}
              className="inline-flex items-center gap-2 rounded-xl border border-red-400/30 bg-red-500/10 px-4 py-3 text-sm font-semibold text-red-300 transition hover:bg-red-500/20"
            >
              <FaTrash />
              Clear All Downloads
            </button>
          )}
        </div>
      </section>

      {sortedSongs.length === 0 ? (
        <section className="rounded-3xl bg-dark-300 p-10 text-center">
          <FaDownload className="mx-auto mb-4 text-gray-500" size={48} />
          <h2 className="text-2xl font-semibold text-white">No downloads yet</h2>
          <p className="mt-2 text-gray-400">Use the download button on any song and it will show up here.</p>
          <Link
            href="/dashboard"
            className="mt-6 inline-flex rounded-xl bg-primary-500 px-5 py-3 font-semibold text-white transition hover:bg-primary-600"
          >
            Browse songs
          </Link>
        </section>
      ) : (
        <section className="grid grid-cols-1 gap-4">
          {sortedSongs.map((song) => (
            <div
              key={song._id}
              className="flex flex-col gap-4 rounded-3xl bg-dark-300 p-4 md:flex-row md:items-center md:justify-between"
            >
              <div className="flex min-w-0 items-center gap-4">
                <div className="relative h-20 w-20 overflow-hidden rounded-2xl">
                  <Image
                    src={song.coverImage || 'https://via.placeholder.com/300'}
                    alt={song.title}
                    fill
                    className="object-cover"
                    unoptimized
                  />
                </div>

                <div className="min-w-0">
                  <Link href={`/song/${song._id}`} className="block truncate text-lg font-semibold text-white hover:text-primary-400">
                    {song.title}
                  </Link>
                  <p className="truncate text-sm text-gray-400">{song.artist}</p>
                  <div className="mt-2 flex flex-wrap items-center gap-3 text-xs text-gray-500">
                    <span>{formatDuration(song.duration)}</span>
                    <span>{formatBytes(song.size)}</span>
                    <span>Saved {new Date(song.downloadedAt).toLocaleDateString()}</span>
                    {!song.audioUrl && <span className="text-amber-400">Download again after refresh to play offline</span>}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => handlePlay(song._id)}
                  disabled={!song.audioUrl}
                  className="inline-flex items-center gap-2 rounded-xl bg-primary-500 px-4 py-3 text-sm font-semibold text-white transition hover:bg-primary-600 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <FaPlay />
                  Play
                </button>
                <DownloadButton
                  song={{
                    _id: song._id,
                    title: song.title,
                    artist: song.artist,
                    coverImage: song.coverImage,
                    duration: song.duration,
                    audioUrl: song.sourceAudioUrl || song.audioUrl,
                  }}
                  size="md"
                  showLabel
                />
              </div>
            </div>
          ))}
        </section>
      )}

      <section className="rounded-3xl bg-dark-300 p-6">
        <div className="flex items-start gap-4">
          <div className="rounded-2xl bg-primary-500/10 p-3 text-primary-400">
            <FaMusic size={22} />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-white">Where to find downloads</h3>
            <p className="mt-2 text-sm text-gray-400">
              You can open this page anytime from the sidebar using the new <span className="font-semibold text-white">Downloads</span> item.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
