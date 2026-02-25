'use client';

import { useEffect, useState } from 'react';
import { userAPI } from '@/lib/api';
import SongCard from '@/components/song/SongCard';
import { FaHeart } from 'react-icons/fa';
import toast from 'react-hot-toast';

export default function LikedSongsPage() {
  const [songs, setSongs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLikedSongs();
  }, []);

  const fetchLikedSongs = async () => {
    setLoading(true);
    try {
      const response = await userAPI.getLikedSongs();
      setSongs(response.data.data || []);
    } catch (error) {
      console.error('Failed to load liked songs:', error);
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

  return (
    <div className="p-6">
      <div className="flex items-center gap-4 mb-8">
        <div className="bg-gradient-to-br from-purple-500 to-primary-500 p-6 rounded-lg">
          <FaHeart size={48} className="text-white" />
        </div>
        <div>
          <p className="text-sm font-semibold uppercase">Playlist</p>
          <h1 className="text-5xl font-bold mb-2">Liked Songs</h1>
          <p className="text-gray-400">{songs.length} songs</p>
        </div>
      </div>

      {songs.length === 0 ? (
        <div className="text-center py-12">
          <FaHeart size={64} className="text-gray-600 mx-auto mb-4" />
          <p className="text-xl text-gray-400 mb-2">No liked songs yet</p>
          <p className="text-gray-500">Songs you like will appear here</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {songs.map((song: any) => (
            <SongCard key={song._id} song={song} />
          ))}
        </div>
      )}
    </div>
  );
}
