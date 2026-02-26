'use client';

import { useState, useEffect } from 'react';
import { songsAPI } from '@/lib/api';
import SongCard from '@/components/song/SongCard';
import { FaRobot, FaRefresh, FaHeart, FaClock, FaMusic, FaTrendingUp } from 'react-icons/fa';

interface Song {
  _id: string;
  title: string;
  artist: string;
  coverImage: string;
  duration: number;
  genre: string;
  audioUrl: string;
}

interface RecommendationCategory {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType<any>;
  color: string;
  songs: Song[];
}

export default function SmartRecommendations() {
  const [categories, setCategories] = useState<RecommendationCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchRecommendations();
  }, []);

  const fetchRecommendations = async (refresh = false) => {
    if (refresh) {
      setRefreshing(true);
    } else {
      setLoading(true);
    }
    setError(null);

    try {
      // Fetch different types of recommendations
      const [
        basedOnHistory,
        similarToLiked,
        trending,
        newReleases,
        genreRecommendations
      ] = await Promise.all([
        songsAPI.getRecommendations('history', { limit: 8 }),
        songsAPI.getRecommendations('liked', { limit: 8 }),
        songsAPI.getRecommendations('trending', { limit: 8 }),
        songsAPI.getRecommendations('new', { limit: 8 }),
        songsAPI.getRecommendations('genre', { limit: 8 })
      ]);

      const recommendationCategories: RecommendationCategory[] = [
        {
          id: 'history',
          title: 'Based on Your Listening',
          description: 'Songs similar to what you\'ve been playing',
          icon: FaClock,
          color: 'text-blue-500',
          songs: basedOnHistory.data.data || []
        },
        {
          id: 'liked',
          title: 'More Like Your Favorites',
          description: 'Similar to songs you\'ve liked',
          icon: FaHeart,
          color: 'text-red-500',
          songs: similarToLiked.data.data || []
        },
        {
          id: 'trending',
          title: 'Trending Now',
          description: 'Popular songs everyone is listening to',
          icon: FaTrendingUp,
          color: 'text-green-500',
          songs: trending.data.data || []
        },
        {
          id: 'new',
          title: 'Fresh Discoveries',
          description: 'New releases you might enjoy',
          icon: FaMusic,
          color: 'text-purple-500',
          songs: newReleases.data.data || []
        },
        {
          id: 'genre',
          title: 'Your Genre Mix',
          description: 'Based on your favorite genres',
          icon: FaRobot,
          color: 'text-orange-500',
          songs: genreRecommendations.data.data || []
        }
      ];

      // Filter out empty categories
      setCategories(recommendationCategories.filter(cat => cat.songs.length > 0));
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to load recommendations');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const refreshRecommendations = () => {
    fetchRecommendations(true);
  };

  if (loading) {
    return (
      <div className="space-y-8">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="space-y-4">
            <div className="flex items-center space-x-3">
              <div className="w-6 h-6 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
              <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-48 animate-pulse"></div>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {[...Array(6)].map((_, j) => (
                <div key={j} className="space-y-2">
                  <div className="aspect-square bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                  <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-3/4 animate-pulse"></div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <FaRobot className="mx-auto text-gray-400 mb-4" size={48} />
        <p className="text-gray-600 dark:text-gray-400 mb-4">{error}</p>
        <button
          onClick={() => fetchRecommendations()}
          className="px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors"
        >
          Try Again
        </button>
      </div>
    );
  }

  if (categories.length === 0) {
    return (
      <div className="text-center py-12">
        <FaRobot className="mx-auto text-gray-400 mb-4" size={48} />
        <p className="text-gray-600 dark:text-gray-400 mb-2">
          No recommendations available yet
        </p>
        <p className="text-sm text-gray-500 dark:text-gray-500 mb-4">
          Listen to more songs to get personalized recommendations
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <FaRobot className="text-primary-500" size={24} />
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              Smart Recommendations
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              Personalized music suggestions powered by AI
            </p>
          </div>
        </div>
        <button
          onClick={refreshRecommendations}
          disabled={refreshing}
          className="flex items-center space-x-2 px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors disabled:opacity-50"
        >
          <FaRefresh className={refreshing ? 'animate-spin' : ''} />
          <span>Refresh</span>
        </button>
      </div>

      {/* Recommendation Categories */}
      {categories.map((category) => (
        <div key={category.id} className="space-y-4">
          {/* Category Header */}
          <div className="flex items-center space-x-3">
            <category.icon className={category.color} size={20} />
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                {category.title}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {category.description}
              </p>
            </div>
          </div>

          {/* Songs Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-4">
            {category.songs.map((song) => (
              <SongCard
                key={song._id}
                song={song}
                showArtist={true}
                compact={true}
              />
            ))}
          </div>

          {/* Show More Button */}
          {category.songs.length >= 8 && (
            <div className="text-center">
              <button className="text-primary-500 hover:text-primary-600 text-sm font-medium">
                Show more from this category →
              </button>
            </div>
          )}
        </div>
      ))}

      {/* Recommendation Insights */}
      <div className="bg-gradient-to-r from-primary-50 to-purple-50 dark:from-primary-900/20 dark:to-purple-900/20 p-6 rounded-lg border border-primary-200 dark:border-primary-800">
        <div className="flex items-start space-x-4">
          <div className="p-2 bg-primary-100 dark:bg-primary-900 rounded-lg">
            <FaRobot className="text-primary-600 dark:text-primary-400" size={24} />
          </div>
          <div>
            <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
              How We Create Your Recommendations
            </h4>
            <div className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
              <p>• <strong>Listening History:</strong> Songs similar to what you play most</p>
              <p>• <strong>Liked Songs:</strong> Music that matches your favorites</p>
              <p>• <strong>Genre Preferences:</strong> Based on your most-played genres</p>
              <p>• <strong>Trending:</strong> Popular songs from users with similar taste</p>
              <p>• <strong>Discovery:</strong> New releases in your preferred styles</p>
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-500 mt-3">
              Recommendations update based on your listening activity. The more you listen, the better they get!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}