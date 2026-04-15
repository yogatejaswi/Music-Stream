'use client';

import { useState, useEffect } from 'react';
import { FaPlus, FaPlay, FaTrash, FaEdit, FaMusic } from 'react-icons/fa';
import { playlistAPI } from '@/lib/api';
import toast from 'react-hot-toast';
import Link from 'next/link';

interface Playlist {
  _id: string;
  name: string;
  description: string;
  songs: any[];
  createdAt: string;
  updatedAt: string;
}

export default function PlaylistsPage() {
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: ''
  });

  useEffect(() => {
    fetchPlaylists();
  }, []);

  const fetchPlaylists = async () => {
    try {
      const response = await playlistAPI.getAll();
      setPlaylists(response.data.data || []);
    } catch (error) {
      console.error('Error fetching playlists:', error);
      toast.error('Failed to load playlists');
    } finally {
      setLoading(false);
    }
  };

  const handleCreatePlaylist = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim()) {
      toast.error('Playlist name is required');
      return;
    }

    try {
      await playlistAPI.create({
        name: formData.name,
        description: formData.description
      });
      
      toast.success('Playlist created successfully!');
      setFormData({ name: '', description: '' });
      setShowCreateForm(false);
      fetchPlaylists();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to create playlist');
    }
  };

  const handleDeletePlaylist = async (id: string) => {
    if (!confirm('Are you sure you want to delete this playlist?')) return;

    try {
      await playlistAPI.delete(id);
      toast.success('Playlist deleted');
      fetchPlaylists();
    } catch (error: any) {
      toast.error('Failed to delete playlist');
    }
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-4">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-24 bg-dark-300 rounded-lg"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">My Playlists</h1>
        <button
          onClick={() => setShowCreateForm(!showCreateForm)}
          className="btn-primary flex items-center gap-2"
        >
          <FaPlus />
          Create Playlist
        </button>
      </div>

      {/* Create Playlist Form */}
      {showCreateForm && (
        <div className="bg-dark-300 rounded-lg p-6 max-w-md">
          <h2 className="text-xl font-bold mb-4">Create New Playlist</h2>
          <form onSubmit={handleCreatePlaylist} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Playlist Name</label>
              <input
                type="text"
                className="input"
                placeholder="My Awesome Playlist"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Description (Optional)</label>
              <textarea
                className="input"
                placeholder="Add a description..."
                rows={3}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              />
            </div>
            <div className="flex gap-2">
              <button type="submit" className="btn-primary flex-1">Create</button>
              <button
                type="button"
                onClick={() => setShowCreateForm(false)}
                className="btn-secondary flex-1"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Playlists Grid */}
      {playlists.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {playlists.map(playlist => (
            <Link
              key={playlist._id}
              href={`/playlist/${playlist._id}`}
              className="group bg-dark-300 rounded-lg p-6 hover:bg-dark-200 transition cursor-pointer"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="w-16 h-16 bg-gradient-to-br from-primary-500 to-purple-600 rounded-lg flex items-center justify-center group-hover:scale-110 transition">
                  <FaMusic size={32} className="text-white" />
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      // Play playlist
                      toast.info('Playing playlist');
                    }}
                    className="p-2 bg-primary-500 rounded-full hover:bg-primary-600 transition"
                  >
                    <FaPlay size={16} />
                  </button>
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      handleDeletePlaylist(playlist._id);
                    }}
                    className="p-2 bg-red-500 rounded-full hover:bg-red-600 transition"
                  >
                    <FaTrash size={16} />
                  </button>
                </div>
              </div>
              
              <h3 className="text-lg font-bold mb-1 truncate">{playlist.name}</h3>
              <p className="text-sm text-gray-400 mb-3 line-clamp-2">{playlist.description}</p>
              <p className="text-xs text-gray-500">{playlist.songs?.length || 0} songs</p>
            </Link>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <FaMusic size={64} className="mx-auto mb-4 text-gray-600" />
          <p className="text-xl text-gray-400 mb-4">No playlists yet</p>
          <button
            onClick={() => setShowCreateForm(true)}
            className="btn-primary inline-flex items-center gap-2"
          >
            <FaPlus />
            Create Your First Playlist
          </button>
        </div>
      )}
    </div>
  );
}
