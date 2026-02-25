'use client';

import { useState, useEffect } from 'react';
import { socialAPI } from '@/lib/api';
import { useAuthStore } from '@/store/authStore';
import { FaMusic, FaHeart, FaUserPlus, FaPlay } from 'react-icons/fa';
import { usePlayerStore } from '@/store/playerStore';
import Link from 'next/link';
import Image from 'next/image';

interface FeedItem {
  _id: string;
  type: 'play' | 'like' | 'follow' | 'playlist_create';
  user: {
    _id: string;
    name: string;
    avatar?: string;
  };
  song?: {
    _id: string;
    title: string;
    artist: string;
    coverImage: string;
    audioUrl: string;
    duration: number;
  };
  playlist?: {
    _id: string;
    name: string;
    description?: string;
  };
  targetUser?: {
    _id: string;
    name: string;
  };
  createdAt: string;
}

export default function FeedPage() {
  const [feedItems, setFeedItems] = useState<FeedItem[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuthStore();
  const { setCurrentSong } = usePlayerStore();

  useEffect(() => {
    fetchFeed();
  }, []);

  const fetchFeed = async () => {
    try {
      const response = await socialAPI.getFeed();
      setFeedItems(response.data.data || []);
    } catch (error) {
      console.error('Error fetching feed:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePlaySong = (song: any) => {
    setCurrentSong({
      id: song._id,
      title: song.title,
      artist: song.artist,
      audioUrl: song.audioUrl,
      coverImage: song.coverImage,
      duration: song.duration
    });
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString();
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'play':
        return <FaMusic className="text-green-400" />;
      case 'like':
        return <FaHeart className="text-red-400" />;
      case 'follow':
        return <FaUserPlus className="text-blue-400" />;
      case 'playlist_create':
        return <FaMusic className="text-purple-400" />;
      default:
        return <FaMusic className="text-gray-400" />;
    }
  };

  const getActivityText = (item: FeedItem) => {
    switch (item.type) {
      case 'play':
        return `played "${item.song?.title}" by ${item.song?.artist}`;
      case 'like':
        return `liked "${item.song?.title}" by ${item.song?.artist}`;
      case 'follow':
        return `started following ${item.targetUser?.name}`;
      case 'playlist_create':
        return `created playlist "${item.playlist?.name}"`;
      default:
        return 'had some activity';
    }
  };

  if (loading) {
    return (
      <div className="p-6">
        <h1 className="text-3xl font-bold mb-6">Activity Feed</h1>
        <div className="space-y-4">
          {[1, 2, 3, 4, 5].map(i => (
            <div key={i} className="bg-dark-300 rounded-lg p-4 animate-pulse">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-dark-200 rounded-full"></div>
                <div className="flex-1">
                  <div className="h-4 bg-dark-200 rounded w-3/4 mb-2"></div>
                  <div className="h-3 bg-dark-200 rounded w-1/2"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Activity Feed</h1>
        <button
          onClick={fetchFeed}
          className="px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition"
        >
          Refresh
        </button>
      </div>

      {feedItems.length === 0 ? (
        <div className="text-center py-12">
          <FaMusic size={48} className="mx-auto text-gray-400 mb-4" />
          <h2 className="text-xl font-semibold mb-2">No Activity Yet</h2>
          <p className="text-gray-400 mb-6">
            Follow some users and artists to see their activity here!
          </p>
          <div className="flex gap-4 justify-center">
            <Link
              href="/search"
              className="px-6 py-3 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition"
            >
              Discover Users
            </Link>
            <Link
              href="/dashboard"
              className="px-6 py-3 bg-dark-300 text-white rounded-lg hover:bg-dark-200 transition"
            >
              Browse Music
            </Link>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {feedItems.map((item) => (
            <div key={item._id} className="bg-dark-300 rounded-lg p-4 hover:bg-dark-200 transition">
              <div className="flex items-start gap-3">
                {/* User Avatar */}
                <div className="w-10 h-10 bg-primary-500 rounded-full flex items-center justify-center text-sm font-semibold flex-shrink-0">
                  {item.user.name?.charAt(0).toUpperCase()}
                </div>

                <div className="flex-1 min-w-0">
                  {/* Activity Header */}
                  <div className="flex items-center gap-2 mb-2">
                    {getActivityIcon(item.type)}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm">
                        <Link
                          href={`/profile/${item.user._id}`}
                          className="font-semibold hover:text-primary-400 transition"
                        >
                          {item.user.name}
                        </Link>
                        <span className="text-gray-400 ml-1">
                          {getActivityText(item)}
                        </span>
                      </p>
                      <p className="text-xs text-gray-500">{formatDate(item.createdAt)}</p>
                    </div>
                  </div>

                  {/* Activity Content */}
                  {item.song && (
                    <div className="flex items-center gap-3 bg-dark-400 rounded-lg p-3 mt-2">
                      <div className="relative w-12 h-12 flex-shrink-0">
                        <Image
                          src={item.song.coverImage}
                          alt={item.song.title}
                          fill
                          className="object-cover rounded"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium truncate">{item.song.title}</h4>
                        <p className="text-sm text-gray-400 truncate">{item.song.artist}</p>
                      </div>
                      <button
                        onClick={() => handlePlaySong(item.song)}
                        className="p-2 bg-primary-500 rounded-full hover:bg-primary-600 transition flex-shrink-0"
                      >
                        <FaPlay size={12} className="text-white ml-0.5" />
                      </button>
                    </div>
                  )}

                  {item.playlist && (
                    <div className="bg-dark-400 rounded-lg p-3 mt-2">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded flex items-center justify-center flex-shrink-0">
                          <FaMusic className="text-white" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <Link
                            href={`/playlist/${item.playlist._id}`}
                            className="font-medium hover:text-primary-400 transition block truncate"
                          >
                            {item.playlist.name}
                          </Link>
                          {item.playlist.description && (
                            <p className="text-sm text-gray-400 truncate">
                              {item.playlist.description}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  )}

                  {item.targetUser && (
                    <div className="bg-dark-400 rounded-lg p-3 mt-2">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center text-sm font-semibold flex-shrink-0">
                          {item.targetUser.name?.charAt(0).toUpperCase()}
                        </div>
                        <div className="flex-1 min-w-0">
                          <Link
                            href={`/profile/${item.targetUser._id}`}
                            className="font-medium hover:text-primary-400 transition block truncate"
                          >
                            {item.targetUser.name}
                          </Link>
                          <p className="text-sm text-gray-400">User</p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}