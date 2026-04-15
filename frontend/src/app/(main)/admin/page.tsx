'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { adminAPI, songsAPI } from '@/lib/api';
import { useAuthStore } from '@/store/authStore';
import toast from 'react-hot-toast';
import {
  FaChartLine,
  FaChevronRight,
  FaTimes,
  FaCrown,
  FaHeart,
  FaMusic,
  FaPlay,
  FaUpload,
  FaUserShield,
  FaUsers
} from 'react-icons/fa';

interface Analytics {
  totalUsers: number;
  totalSongs: number;
  totalPlays: number;
  premiumUsers: number;
  freeUsers: number;
  topSongs: Array<{
    _id: string;
    title: string;
    artist: string;
    playCount: number;
    likes: number;
  }>;
}

interface AdminUser {
  _id: string;
  name: string;
  email: string;
  role: 'user' | 'admin';
  createdAt: string;
  subscription?: {
    plan?: 'free' | 'premium';
  };
}

interface AdminSong {
  _id: string;
  title: string;
  artist: string;
  playCount: number;
  likes: number;
  createdAt: string;
  isPremium?: boolean;
}

export default function AdminPage() {
  const router = useRouter();
  const user = useAuthStore((state) => state.user);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [analytics, setAnalytics] = useState<Analytics | null>(null);
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [songs, setSongs] = useState<AdminSong[]>([]);
  const [showUsersList, setShowUsersList] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    artist: '',
    albumId: '',
    genreInput: '',
    duration: '',
    isPremium: false,
  });
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [coverImage, setCoverImage] = useState<File | null>(null);

  useEffect(() => {
    if (!user) {
      return;
    }

    if (user.role !== 'admin') {
      router.replace('/dashboard');
      return;
    }

    fetchAdminData();
  }, [router, user]);

  const fetchAdminData = async () => {
    try {
      setLoading(true);

      const [analyticsResponse, usersResponse, songsResponse] = await Promise.all([
        adminAPI.getAnalytics(),
        adminAPI.getAllUsers({ limit: 6 }),
        songsAPI.getAll({ sort: '-createdAt', limit: 8 })
      ]);

      setAnalytics(analyticsResponse.data.data || null);
      setUsers(usersResponse.data.data || []);
      setSongs(songsResponse.data.data || []);
    } catch (error) {
      console.error('Error loading admin data:', error);
      toast.error('Failed to load admin dashboard');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!audioFile) {
      toast.error('Please select an audio file');
      return;
    }

    setSubmitting(true);

    try {
      const formDataToSend = new FormData();
      const genres = formData.genreInput
        .split(',')
        .map((genre) => genre.trim())
        .filter(Boolean);

      formDataToSend.append('title', formData.title);
      formDataToSend.append('artist', formData.artist);
      formDataToSend.append('duration', formData.duration);
      formDataToSend.append('genre', JSON.stringify(genres));
      formDataToSend.append('isPremium', String(formData.isPremium));
      formDataToSend.append('audio', audioFile);

      if (formData.albumId.trim()) {
        formDataToSend.append('albumId', formData.albumId.trim());
      }

      if (coverImage) {
        formDataToSend.append('cover', coverImage);
      }

      await adminAPI.uploadSong(formDataToSend);
      toast.success('Song uploaded successfully');

      setFormData({
        title: '',
        artist: '',
        albumId: '',
        genreInput: '',
        duration: '',
        isPremium: false,
      });
      setAudioFile(null);
      setCoverImage(null);

      await fetchAdminData();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to upload song');
    } finally {
      setSubmitting(false);
    }
  };

  if (!user || user.role !== 'admin') {
    return null;
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-dark-300 p-6">
        <div className="space-y-6 animate-pulse">
          <div className="h-36 rounded-3xl bg-dark-200" />
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((item) => (
              <div key={item} className="h-32 rounded-2xl bg-dark-200" />
            ))}
          </div>
          <div className="h-96 rounded-3xl bg-dark-200" />
        </div>
      </div>
    );
  }

  const premiumShare = analytics?.totalUsers
    ? Math.round(((analytics.premiumUsers || 0) / analytics.totalUsers) * 100)
    : 0;

  return (
    <div className="min-h-screen bg-dark-300 p-6 space-y-8">
      <section className="rounded-3xl border border-white/10 bg-gradient-to-br from-slate-900 via-emerald-950 to-slate-900 p-8">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl">
            <p className="mb-3 inline-flex items-center gap-2 rounded-full border border-emerald-400/30 bg-emerald-400/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.28em] text-emerald-200">
              <FaUserShield />
              Admin Control Room
            </p>
            <h1 className="text-4xl font-bold text-white">Platform dashboard for catalog, listeners, and growth.</h1>
            <p className="mt-4 text-sm text-slate-300">
              Track how the platform is performing, keep an eye on new signups, and publish fresh music without leaving this workspace.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
              <p className="text-xs uppercase tracking-[0.22em] text-slate-400">Premium Share</p>
              <p className="mt-2 text-3xl font-bold text-white">{premiumShare}%</p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
              <p className="text-xs uppercase tracking-[0.22em] text-slate-400">Premium Users</p>
              <p className="mt-2 text-3xl font-bold text-white">{analytics?.premiumUsers || 0}</p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4 col-span-2 sm:col-span-1">
              <p className="text-xs uppercase tracking-[0.22em] text-slate-400">Free Users</p>
              <p className="mt-2 text-3xl font-bold text-white">{analytics?.freeUsers || 0}</p>
            </div>
          </div>
        </div>
      </section>

      <section className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        <button
          type="button"
          onClick={() => setShowUsersList(true)}
          className="rounded-2xl bg-sky-600 p-6 text-white text-left transition hover:bg-sky-500"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-sky-100">Total Users</p>
              <p className="mt-2 text-3xl font-bold">{analytics?.totalUsers || 0}</p>
              <p className="mt-3 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-sky-100">
                View users
                <FaChevronRight />
              </p>
            </div>
            <FaUsers size={28} className="text-sky-100" />
          </div>
        </button>
        <div className="rounded-2xl bg-emerald-600 p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-emerald-100">Total Songs</p>
              <p className="mt-2 text-3xl font-bold">{analytics?.totalSongs || 0}</p>
            </div>
            <FaMusic size={28} className="text-emerald-100" />
          </div>
        </div>
        <div className="rounded-2xl bg-fuchsia-600 p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-fuchsia-100">Total Plays</p>
              <p className="mt-2 text-3xl font-bold">{analytics?.totalPlays || 0}</p>
            </div>
            <FaPlay size={28} className="text-fuchsia-100" />
          </div>
        </div>
        <div className="rounded-2xl bg-rose-600 p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-rose-100">Top Song Likes</p>
              <p className="mt-2 text-3xl font-bold">{analytics?.topSongs?.[0]?.likes || 0}</p>
            </div>
            <FaHeart size={28} className="text-rose-100" />
          </div>
        </div>
      </section>

      <section className="grid grid-cols-1 xl:grid-cols-[1.2fr_0.8fr] gap-6">
        <div className="rounded-3xl bg-dark-200 p-6">
          <div className="mb-5 flex items-center gap-3">
            <FaChartLine className="text-primary-500" />
            <h2 className="text-2xl font-semibold text-white">Top performing songs</h2>
          </div>
          <div className="space-y-3">
            {analytics?.topSongs?.length ? (
              analytics.topSongs.map((song, index) => (
                <div key={song._id} className="flex items-center gap-4 rounded-2xl border border-white/5 bg-dark-300 p-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary-500 font-bold text-white">
                    {index + 1}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-semibold text-white">{song.title}</p>
                    <p className="truncate text-sm text-gray-400">{song.artist}</p>
                  </div>
                  <div className="text-right text-sm text-gray-300">
                    <p>{song.playCount} plays</p>
                    <p>{song.likes} likes</p>
                  </div>
                </div>
              ))
            ) : (
              <div className="rounded-2xl border border-dashed border-white/10 p-6 text-sm text-gray-400">
                Upload a few songs and this performance board will start filling in.
              </div>
            )}
          </div>
        </div>

        <div className="rounded-3xl bg-dark-200 p-6">
          <div className="mb-5 flex items-center gap-3">
            <FaCrown className="text-amber-400" />
            <h2 className="text-2xl font-semibold text-white">Newest users</h2>
          </div>
          <div className="space-y-3">
            {users.length ? (
              users.map((member) => (
                <div key={member._id} className="rounded-2xl border border-white/5 bg-dark-300 p-4">
                  <div className="flex items-center justify-between gap-3">
                    <div className="min-w-0">
                      <p className="truncate font-semibold text-white">{member.name}</p>
                      <p className="truncate text-sm text-gray-400">{member.email}</p>
                    </div>
                    <span className="rounded-full bg-white/5 px-3 py-1 text-xs uppercase tracking-[0.18em] text-gray-300">
                      {member.subscription?.plan || 'free'}
                    </span>
                  </div>
                  <div className="mt-3 flex items-center justify-between text-xs text-gray-500">
                    <span>{member.role}</span>
                    <span>{new Date(member.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
              ))
            ) : (
              <div className="rounded-2xl border border-dashed border-white/10 p-6 text-sm text-gray-400">
                No user records are available yet.
              </div>
            )}
          </div>
        </div>
      </section>

      <section className="grid grid-cols-1 xl:grid-cols-[0.95fr_1.05fr] gap-6">
        <div className="rounded-3xl bg-dark-200 p-6">
          <div className="mb-5 flex items-center gap-3">
            <FaMusic className="text-emerald-400" />
            <h2 className="text-2xl font-semibold text-white">Latest catalog additions</h2>
          </div>
          <div className="space-y-3">
            {songs.length ? (
              songs.map((song) => (
                <div key={song._id} className="rounded-2xl border border-white/5 bg-dark-300 p-4">
                  <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0">
                      <p className="truncate font-semibold text-white">{song.title}</p>
                      <p className="truncate text-sm text-gray-400">{song.artist}</p>
                    </div>
                    {song.isPremium && (
                      <span className="rounded-full bg-amber-500/15 px-3 py-1 text-xs uppercase tracking-[0.18em] text-amber-300">
                        Premium
                      </span>
                    )}
                  </div>
                  <div className="mt-3 flex items-center justify-between text-xs text-gray-500">
                    <span>{song.playCount} plays</span>
                    <span>{new Date(song.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
              ))
            ) : (
              <div className="rounded-2xl border border-dashed border-white/10 p-6 text-sm text-gray-400">
                No songs have been uploaded yet.
              </div>
            )}
          </div>
        </div>

        <div id="upload" className="rounded-3xl bg-dark-200 p-6">
          <div className="mb-5 flex items-center gap-3">
            <FaUpload className="text-primary-500" />
            <h2 className="text-2xl font-semibold text-white">Upload a new song</h2>
          </div>

          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="mb-2 block text-sm font-medium text-gray-300">Song title</label>
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
              <label className="mb-2 block text-sm font-medium text-gray-300">Artist</label>
              <input
                type="text"
                required
                className="input"
                placeholder="Artist name"
                value={formData.artist}
                onChange={(e) => setFormData({ ...formData, artist: e.target.value })}
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-300">Duration in seconds</label>
              <input
                type="number"
                min="1"
                required
                className="input"
                placeholder="180"
                value={formData.duration}
                onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-300">Album ID</label>
              <input
                type="text"
                className="input"
                placeholder="Optional linked album id"
                value={formData.albumId}
                onChange={(e) => setFormData({ ...formData, albumId: e.target.value })}
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-300">Genres</label>
              <input
                type="text"
                className="input"
                placeholder="Pop, Telugu, Indie"
                value={formData.genreInput}
                onChange={(e) => setFormData({ ...formData, genreInput: e.target.value })}
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-300">Audio file</label>
              <input
                type="file"
                accept="audio/*"
                required
                className="input"
                onChange={(e) => setAudioFile(e.target.files?.[0] || null)}
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-300">Cover image</label>
              <input
                type="file"
                accept="image/*"
                className="input"
                onChange={(e) => setCoverImage(e.target.files?.[0] || null)}
              />
            </div>

            <label className="md:col-span-2 flex items-center gap-3 rounded-2xl border border-white/10 bg-dark-300 px-4 py-3 text-sm text-gray-300">
              <input
                type="checkbox"
                checked={formData.isPremium}
                onChange={(e) => setFormData({ ...formData, isPremium: e.target.checked })}
              />
              Restrict this song to premium listeners
            </label>

            <button
              type="submit"
              disabled={submitting}
              className="md:col-span-2 rounded-2xl bg-primary-500 px-5 py-3 font-semibold text-white transition hover:bg-primary-600 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {submitting ? 'Uploading...' : 'Upload song'}
            </button>
          </form>
        </div>
      </section>

      {showUsersList && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
          <div className="max-h-[85vh] w-full max-w-4xl overflow-hidden rounded-3xl border border-white/10 bg-dark-200 shadow-2xl">
            <div className="flex items-center justify-between border-b border-white/10 px-6 py-5">
              <div>
                <h2 className="text-2xl font-semibold text-white">All Users</h2>
                <p className="text-sm text-gray-400">Complete list of registered listeners and admins.</p>
              </div>
              <button
                type="button"
                onClick={() => setShowUsersList(false)}
                className="rounded-full p-3 text-gray-400 transition hover:bg-dark-300 hover:text-white"
              >
                <FaTimes />
              </button>
            </div>

            <div className="max-h-[calc(85vh-88px)] overflow-y-auto p-6">
              <div className="space-y-3">
                {users.length ? (
                  users.map((member) => (
                    <div key={member._id} className="rounded-2xl border border-white/5 bg-dark-300 p-4">
                      <div className="flex items-center justify-between gap-4">
                        <div className="min-w-0">
                          <p className="truncate font-semibold text-white">{member.name}</p>
                          <p className="truncate text-sm text-gray-400">{member.email}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="rounded-full bg-white/5 px-3 py-1 text-xs uppercase tracking-[0.18em] text-gray-300">
                            {member.subscription?.plan || 'free'}
                          </span>
                          <span className="rounded-full bg-primary-500/10 px-3 py-1 text-xs uppercase tracking-[0.18em] text-primary-300">
                            {member.role}
                          </span>
                        </div>
                      </div>
                      <div className="mt-3 text-xs text-gray-500">
                        Joined {new Date(member.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="rounded-2xl border border-dashed border-white/10 p-6 text-sm text-gray-400">
                    No users found.
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
