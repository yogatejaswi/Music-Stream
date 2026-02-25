'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import { albumsAPI } from '@/lib/api';
import { usePlayerStore } from '@/store/playerStore';
import { FaPlay, FaClock } from 'react-icons/fa';
import toast from 'react-hot-toast';

export default function AlbumPage() {
  const params = useParams();
  const [album, setAlbum] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const { setQueue } = usePlayerStore();

  useEffect(() => {
    fetchAlbum();
  }, [params.id]);

  const fetchAlbum = async () => {
    try {
      const response = await albumsAPI.getById(params.id as string);
      setAlbum(response.data.data);
    } catch (error) {
      console.error('Error fetching album:', error);
      toast.error('Failed to load album');
    } finally {
      setLoading(false);
    }
  };

  const handlePlayAlbum = () => {
    if (album && album.songs && album.songs.length > 0) {
      const queue = album.songs.map((song: any) => ({
        id: song._id,
        title: song.title,
        artist: song.artist,
        audioUrl: song.audioUrl,
        coverImage: song.coverImage,
        duration: song.duration
      }));
      setQueue(queue, 0);
      toast.success('Playing album');
    }
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getTotalDuration = () => {
    if (!album || !album.songs) return '0:00';
    const total = album.songs.reduce((acc: number, song: any) => acc + song.duration, 0);
    const hours = Math.floor(total / 3600);
    const mins = Math.floor((total % 3600) / 60);
    return hours > 0 ? `${hours} hr ${mins} min` : `${mins} min`;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  if (!album) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-xl">Album not found</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Album Header */}
      <div className="bg-gradient-to-b from-primary-500/20 to-dark-300 p-8">
        <div className="flex items-end gap-6 max-w-7xl mx-auto">
          <Image
            src={album.coverImage}
            alt={album.title}
            width={250}
            height={250}
            className="rounded shadow-2xl"
          />
          
          <div className="flex-1 pb-4">
            <p className="text-sm font-semibold mb-2">ALBUM</p>
            <h1 className="text-5xl font-bold mb-4">{album.title}</h1>
            
            <div className="flex items-center gap-2 text-sm">
              <span className="font-semibold">{album.artist}</span>
              <span>•</span>
              <span>{album.releaseYear}</span>
              <span>•</span>
              <span>{album.songs?.length || 0} songs</span>
              <span>•</span>
              <span>{getTotalDuration()}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="px-8 py-6 bg-dark-300/50">
        <button
          onClick={handlePlayAlbum}
          className="flex items-center gap-3 bg-primary-500 hover:bg-primary-600 text-white px-8 py-3 rounded-full font-semibold transition"
        >
          <FaPlay size={16} />
          Play Album
        </button>
      </div>

      {/* Track List */}
      <div className="px-8 py-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="grid grid-cols-[40px_1fr_1fr_60px] gap-4 px-4 py-2 text-sm text-gray-400 border-b border-gray-800">
            <div>#</div>
            <div>Title</div>
            <div>Artist</div>
            <div className="text-right">
              <FaClock />
            </div>
          </div>

          {/* Songs */}
          {album.songs && album.songs.length > 0 ? (
            <div>
              {album.songs.map((song: any, index: number) => (
                <div
                  key={song._id}
                  className="grid grid-cols-[40px_1fr_1fr_60px] gap-4 px-4 py-3 hover:bg-dark-200 rounded cursor-pointer group"
                  onClick={() => {
                    const queue = album.songs.map((s: any) => ({
                      id: s._id,
                      title: s.title,
                      artist: s.artist,
                      audioUrl: s.audioUrl,
                      coverImage: s.coverImage,
                      duration: s.duration
                    }));
                    setQueue(queue, index);
                  }}
                >
                  <div className="flex items-center text-gray-400 group-hover:text-white">
                    {index + 1}
                  </div>
                  <div className="flex items-center">
                    <div>
                      <p className="font-medium group-hover:text-primary-500">
                        {song.title}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center text-gray-400">
                    {song.artist}
                  </div>
                  <div className="flex items-center justify-end text-gray-400">
                    {formatDuration(song.duration)}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-400 py-8 text-center">No songs in this album</p>
          )}
        </div>
      </div>
    </div>
  );
}
