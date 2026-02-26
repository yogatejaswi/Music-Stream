'use client';

import { useState, useEffect } from 'react';
import { analyticsAPI } from '@/lib/api';
import { FaMusic, FaClock, FaCalendarAlt, FaHeadphones, FaChartLine, FaTrophy } from 'react-icons/fa';

interface ListeningStatsProps {
  userId?: string;
  timeRange?: 'week' | 'month' | 'year' | 'all';
}

interface StatsData {
  totalListeningTime: number;
  songsPlayed: number;
  uniqueArtists: number;
  uniqueAlbums: number;
  topGenres: Array<{ name: string; count: number; percentage: number }>;
  topArtists: Array<{ name: string; playCount: number; totalTime: number }>;
  topSongs: Array<{ title: string; artist: string; playCount: number; totalTime: number }>;
  listeningByHour: Array<{ hour: number; count: number }>;
  listeningByDay: Array<{ day: string; count: number }>;
  streakDays: number;
  averageSessionLength: number;
}

export default function ListeningStats({ userId, timeRange = 'month' }: ListeningStatsProps) {
  const [stats, setStats] = useState<StatsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchStats();
  }, [userId, timeRange]);

  const fetchStats = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await analyticsAPI.getUserStats(userId, { timeRange });
      setStats(response.data.stats);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to load stats');
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    
    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }
    return `${minutes}m`;
  };

  const formatTimeRange = (range: string): string => {
    switch (range) {
      case 'week': return 'This Week';
      case 'month': return 'This Month';
      case 'year': return 'This Year';
      case 'all': return 'All Time';
      default: return 'This Month';
    }
  };

  if (loading) {
    return (
      <div className="animate-pulse space-y-4">
        <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/3"></div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-24 bg-gray-200 dark:bg-gray-700 rounded"></div>
          ))}
        </div>
      </div>
    );
  }

  if (error || !stats) {
    return (
      <div className="text-center py-8">
        <FaChartLine className="mx-auto text-gray-400 mb-4" size={48} />
        <p className="text-gray-600 dark:text-gray-400">
          {error || 'No listening data available'}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          Listening Stats
        </h2>
        <span className="text-sm text-gray-600 dark:text-gray-400">
          {formatTimeRange(timeRange)}
        </span>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
              <FaClock className="text-blue-600 dark:text-blue-400" size={20} />
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Total Time</p>
              <p className="text-xl font-bold text-gray-900 dark:text-white">
                {formatTime(stats.totalListeningTime)}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-green-100 dark:bg-green-900 rounded-lg">
              <FaMusic className="text-green-600 dark:text-green-400" size={20} />
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Songs Played</p>
              <p className="text-xl font-bold text-gray-900 dark:text-white">
                {stats.songsPlayed.toLocaleString()}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-purple-100 dark:bg-purple-900 rounded-lg">
              <FaHeadphones className="text-purple-600 dark:text-purple-400" size={20} />
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Artists</p>
              <p className="text-xl font-bold text-gray-900 dark:text-white">
                {stats.uniqueArtists}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-orange-100 dark:bg-orange-900 rounded-lg">
              <FaTrophy className="text-orange-600 dark:text-orange-400" size={20} />
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Streak</p>
              <p className="text-xl font-bold text-gray-900 dark:text-white">
                {stats.streakDays} days
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Artists */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Top Artists
          </h3>
          <div className="space-y-3">
            {stats.topArtists.slice(0, 5).map((artist, index) => (
              <div key={artist.name} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <span className="text-sm font-medium text-gray-500 dark:text-gray-400 w-4">
                    {index + 1}
                  </span>
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">
                      {artist.name}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {artist.playCount} plays
                    </p>
                  </div>
                </div>
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  {formatTime(artist.totalTime)}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Top Songs */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Top Songs
          </h3>
          <div className="space-y-3">
            {stats.topSongs.slice(0, 5).map((song, index) => (
              <div key={`${song.title}-${song.artist}`} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <span className="text-sm font-medium text-gray-500 dark:text-gray-400 w-4">
                    {index + 1}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="font-medium text-gray-900 dark:text-white truncate">
                      {song.title}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400 truncate">
                      {song.artist}
                    </p>
                  </div>
                </div>
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  {song.playCount} plays
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Listening Patterns */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Listening by Hour */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Listening by Hour
          </h3>
          <div className="space-y-2">
            {stats.listeningByHour.map((item) => {
              const maxCount = Math.max(...stats.listeningByHour.map(h => h.count));
              const percentage = maxCount > 0 ? (item.count / maxCount) * 100 : 0;
              
              return (
                <div key={item.hour} className="flex items-center space-x-3">
                  <span className="text-sm text-gray-600 dark:text-gray-400 w-8">
                    {item.hour.toString().padStart(2, '0')}:00
                  </span>
                  <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div
                      className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                  <span className="text-sm text-gray-600 dark:text-gray-400 w-8">
                    {item.count}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Top Genres */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Top Genres
          </h3>
          <div className="space-y-3">
            {stats.topGenres.slice(0, 5).map((genre, index) => (
              <div key={genre.name} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <span className="text-sm font-medium text-gray-500 dark:text-gray-400 w-4">
                    {index + 1}
                  </span>
                  <div className="flex-1">
                    <p className="font-medium text-gray-900 dark:text-white">
                      {genre.name}
                    </p>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mt-1">
                      <div
                        className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${genre.percentage}%` }}
                      />
                    </div>
                  </div>
                </div>
                <span className="text-sm text-gray-600 dark:text-gray-400 ml-3">
                  {genre.percentage.toFixed(1)}%
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Additional Stats */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Additional Insights
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center">
            <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
              {formatTime(stats.averageSessionLength)}
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Average Session
            </p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-green-600 dark:text-green-400">
              {stats.uniqueAlbums}
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Albums Explored
            </p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">
              {Math.round(stats.totalListeningTime / 3600 / 24 * 10) / 10}
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Days of Music
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}