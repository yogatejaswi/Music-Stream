'use client';

import { useEffect, useState } from 'react';
import { playlistsAPI } from '@/lib/api';
import PlaylistCard from '@/components/playlist/PlaylistCard';
import CreatePlaylistModal from '@/components/playlist/CreatePlaylistModal';
import { FaPlus } from 'react-icons/fa';
import toast from 'react-hot-toast';

export default function LibraryPage() {
  const [playlists, setPlaylists] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPlaylists();
  }, []);

  const fetchPlaylists = async () => {
    try {
      const response = await playlistsAPI.getAll();
      setPlaylists(response.data.data);
    } catch (error) {
      toast.error('Failed to load playlists');
    } finally {
      setLoading(false);
    }
  };

  const handleCreatePlaylist = async (name: string, description: string) => {
    try {
      await playlistsAPI.create({ name, description });
      toast.success('Playlist created!');
      fetchPlaylists();
      setShowModal(false);
    } catch (error) {
      toast.error('Failed to create playlist');
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
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Your Library</h1>
        <button
          onClick={() => setShowModal(true)}
          className="btn-primary flex items-center gap-2"
        >
          <FaPlus /> Create Playlist
        </button>
      </div>

      {playlists.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-xl text-gray-400 mb-4">No playlists yet</p>
          <button onClick={() => setShowModal(true)} className="btn-primary">
            Create Your First Playlist
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {playlists.map((playlist: any) => (
            <PlaylistCard key={playlist._id} playlist={playlist} />
          ))}
        </div>
      )}

      {showModal && (
        <CreatePlaylistModal
          onClose={() => setShowModal(false)}
          onCreate={handleCreatePlaylist}
        />
      )}
    </div>
  );
}
