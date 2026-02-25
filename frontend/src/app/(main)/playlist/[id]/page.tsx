'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { playlistsAPI } from '@/lib/api';
import SongCard from '@/components/song/SongCard';
import { FaMusic } from 'react-icons/fa';
import toast from 'react-hot-toast';
import Image from 'next/image';

export default function PlaylistDetailPage() {
  const params = useParams();
  const [playlist, setPlaylist] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (params.id) {
      fetchPlaylist();
    }
  }, [params.id]);

  const fetchPlaylist = async () => {
    try {
      const response = await playlistsAPI.getById(params.id as string);
      setPlaylist(response.data.data);
    } catch (error) {
      toast.error('Failed to load playlist');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  if (!playlist) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-xl text-gray-400">Playlist not found</div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex items-center gap-6 mb-8">
        <div className="w-48 h-48 bg-dark-100 rounded flex items-center justify-center flex-shrink-0">
          {playlist.coverImage ? (
            <Image
              src={playlist.coverImage}
              alt={playlist.name}
              width={192}
              height={192}
              className="rounded"
            />
          ) : (
            <FaMusic size={64} className="text-gray-600" />
          )}
        </div>
        
        <div>
          <p className="text-sm font-semibold uppercase">Playlist</p>
          <h1 className="text-5xl font-bold mb-2">{playlist.name}</h1>
          {playlist.description && (
            <p className="text-gray-400 mb-2">{playlist.description}</p>
          )}
          <p className="text-sm text-gray-400">
            {playlist.owner?.name} • {playlist.songs?.length || 0} songs
          </p>
        </div>
      </div>

      {playlist.songs && playlist.songs.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {playlist.songs.map((song: any) => (
            <SongCard key={song._id} song={song} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <FaMusic size={64} className="text-gray-600 mx-auto mb-4" />
          <p className="text-xl text-gray-400">No songs in this playlist yet</p>
        </div>
      )}
    </div>
  );
}
