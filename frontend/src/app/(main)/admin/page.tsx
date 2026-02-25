'use client';

import { useState, useEffect } from 'react';
import { adminAPI, analyticsAPI } from '@/lib/api';
import toast from 'react-hot-toast';
import { FaUsers, FaMusic, FaPlay, FaHeart, FaChartLine, FaTrendingUp } from 'react-icons/fa';

interface Analytics {
  totalUsers: number;
  totalSongs: number;
  totalPlays: number;
  totalLikes: number;
  recentUsers: any[];
  topSongs: any[];
  genreStats: any[];
}

export default function AdminPage() {
  const [loading, setLoading] = useState(false);
  const [analytics, setAnalytics] = useState<Analytics | null>(null);
  const [analyticsLoading, setAnalyticsLoading] = useState(true);
  const [formData, setFormData] = useState({
    title: '',
    artist: '',
    album: '',
    genre: '',
    duration: 0,
    lyrics: '',
  });
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [coverImage, setCoverImage] = useState<File | null>(null);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      const response = await adminAPI.getAnalytics();
      setAnalytics(response.data.data);
    } catch (error) {
      console.error('Error fetching analytics:', error);
    } finally {
      setAnalyticsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!audioFile) {
      toast.error('Please select an audio file');
      return;
    }

    setLoading(true);

    try {
      const formDataToSend = new FormData();
      formDataToSend.append('title', formData.title);
      formDataToSend.append('artist', formData.artist);
      formDataToSend.append('album', formData.album);
      formDataToSend.append('genre', formData.genre);
      formDataToSend.append('duration', formData.duration.toString());
      formDataToSend.append('lyrics', formData.lyrics);
      formDataToSend.append('audioFile', audioFile);
      if (coverImage) {
        formDataToSend.append('coverImage', coverImage);
      }

      await adminAPI.uploadSong(formDataToSend);
      toast.success('Song uploaded successfully!');
      
      // Reset form
      setFormData({
        title: '',
        artist: '',
        album: '',
        genre: '',
        duration: 0,
        lyrics: '',
      });
      setAudioFile(null);
      setCoverImage(null);
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to upload song');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 space-y-8">
      <h1 className="text-3xl font-bold">Admin Dashboard</h1>
      
      {/* Analytics Overview */}
      {analyticsLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="bg-dark-300 rounded-lg p-6 animate-pulse">
              <div className="h-4 bg-dark-200 rounded w-1/2 mb-2"></div>
              <div className="h-8 bg-dark-200 rounded w-3/4"></div>
            </div>
          ))}
        </div>
      ) : analytics && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg p-6 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-100 text-sm">Total Users</p>
                  <p className="text-3xl font-bold">{analytics.totalUsers}</p>
                </div>
                <FaUsers size={32} className="text-blue-200" />
              </div>
            </div>

            <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-lg p-6 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-100 text-sm">Total Songs</p>
                  <p className="text-3xl font-bold">{analytics.totalSongs}</p>
                </div>
                <FaMusic size={32} className="text-green-200" />
              </div>
            </div>

            <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg p-6 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-100 text-sm">Total Plays</p>
                  <p className="text-3xl font-bold">{analytics.totalPlays}</p>
                </div>
                <FaPlay size={32} className="text-purple-200" />
              </div>
            </div>

            <div className="bg-gradient-to-r from-red-500 to-red-600 rounded-lg p-6 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-red-100 text-sm">Total Likes</p>
                  <p className="text-3xl font-bold">{analytics.totalLikes}</p>
                </div>
                <FaHeart size={32} className="text-red-200" />
              </div>
            </div>
          </div>

          {/* Charts and Tables */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Top Songs */}
            <div className="bg-dark-300 rounded-lg p-6">
              <div className="flex items-center gap-2 mb-4">
                <FaTrendingUp className="text-primary-500" />
                <h2 className="text-xl font-semibold">Top Songs</h2>
              </div>
              <div className="space-y-3">
                {analytics.topSongs?.slice(0, 5).map((song: any, index: number) => (
                  <div key={song._id} className="flex items-center gap-3 p-3 bg-dark-200 rounded-lg">
                    <div className="w-8 h-8 bg-primary-500 rounded-full flex items-center justify-center text-sm font-bold">
                      {index + 1}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate">{song.title}</p>
                      <p className="text-sm text-gray-400 truncate">{song.artist}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold">{song.playCount}</p>
                      <p className="text-xs text-gray-400">plays</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Users */}
            <div className="bg-dark-300 rounded-lg p-6">
              <div className="flex items-center gap-2 mb-4">
                <FaUsers className="text-blue-500" />
                <h2 className="text-xl font-semibold">Recent Users</h2>
              </div>
              <div className="space-y-3">
                {analytics.recentUsers?.slice(0, 5).map((user: any) => (
                  <div key={user._id} className="flex items-center gap-3 p-3 bg-dark-200 rounded-lg">
                    <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-sm font-semibold">
                      {user.name?.charAt(0).toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate">{user.name}</p>
                      <p className="text-sm text-gray-400 truncate">{user.email}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-gray-400">
                        {new Date(user.createdAt).toLocaleDateString()}
                      </p>
                      <p className="text-xs text-primary-400 capitalize">{user.role}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Genre Statistics */}
          {analytics.genreStats && analytics.genreStats.length > 0 && (
            <div className="bg-dark-300 rounded-lg p-6">
              <div className="flex items-center gap-2 mb-4">
                <FaChartLine className="text-green-500" />
                <h2 className="text-xl font-semibold">Genre Distribution</h2>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {analytics.genreStats.map((genre: any) => (
                  <div key={genre._id} className="bg-dark-200 rounded-lg p-4 text-center">
                    <p className="font-semibold text-lg">{genre.count}</p>
                    <p className="text-sm text-gray-400 capitalize">{genre._id}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}
      
      {/* Upload Song Form */}
      <div className="max-w-2xl bg-dark-300 rounded-lg p-6">
        <h2 className="text-2xl font-semibold mb-6">Upload New Song</h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Song Title</label>
            <input
              type="text"
              required
              className="input"
              placeholder="Enter song title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Artist</label>
            <input
              type="text"
              required
              className="input"
              placeholder="Enter artist name"
              value={formData.artist}
              onChange={(e) => setFormData({ ...formData, artist: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Album</label>
            <input
              type="text"
              className="input"
              placeholder="Enter album name (optional)"
              value={formData.album}
              onChange={(e) => setFormData({ ...formData, album: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Genre</label>
            <input
              type="text"
              required
              className="input"
              placeholder="e.g., Pop, Rock, Hip-Hop"
              value={formData.genre}
              onChange={(e) => setFormData({ ...formData, genre: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Duration (seconds)</label>
            <input
              type="number"
              required
              className="input"
              placeholder="e.g., 180"
              value={formData.duration || ''}
              onChange={(e) => setFormData({ ...formData, duration: parseInt(e.target.value) || 0 })}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Audio File (MP3)</label>
            <input
              type="file"
              accept="audio/*"
              required
              className="input"
              onChange={(e) => setAudioFile(e.target.files?.[0] || null)}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Cover Image (Optional)</label>
            <input
              type="file"
              accept="image/*"
              className="input"
              onChange={(e) => setCoverImage(e.target.files?.[0] || null)}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Lyrics (Optional)</label>
            <textarea
              className="input min-h-[150px]"
              placeholder="Enter song lyrics (one line per verse)"
              value={formData.lyrics}
              onChange={(e) => setFormData({ ...formData, lyrics: e.target.value })}
              rows={8}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn-primary w-full"
          >
            {loading ? 'Uploading...' : 'Upload Song'}
          </button>
        </form>
      </div>
    </div>
  );
}
