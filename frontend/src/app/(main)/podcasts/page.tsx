'use client';

import { useState, useEffect } from 'react';
import { FaPodcast, FaPlay, FaHeart, FaDownload, FaFilter, FaSearch } from 'react-icons/fa';
import Image from 'next/image';

interface Podcast {
  _id: string;
  title: string;
  description: string;
  host: string;
  category: string;
  coverImage: string;
  language: string;
  isExplicit: boolean;
  totalEpisodes: number;
  subscribers: number;
  rating: number;
  ratingCount: number;
  tags: string[];
}

interface Episode {
  _id: string;
  title: string;
  description: string;
  audioUrl: string;
  duration: number;
  episodeNumber: number;
  season?: number;
  publishDate: string;
  playCount: number;
  likes: number;
}

export default function PodcastsPage() {
  const [podcasts, setPodcasts] = useState<Podcast[]>([]);
  const [categories, setCategories] = useState<Array<{ name: string; count: number }>>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    fetchPodcasts();
    fetchCategories();
  }, [selectedCategory, searchQuery]);

  const fetchPodcasts = async () => {
    setLoading(true);
    try {
      // Mock data for now - replace with actual API call
      const mockPodcasts: Podcast[] = [
        {
          _id: '1',
          title: 'Tech Talk Daily',
          description: 'Daily discussions about the latest in technology, startups, and innovation.',
          host: 'Sarah Johnson',
          category: 'Technology',
          coverImage: 'https://images.unsplash.com/photo-1478737270239-2f02b77fc618?w=300&h=300&fit=crop',
          language: 'en',
          isExplicit: false,
          totalEpisodes: 245,
          subscribers: 15420,
          rating: 4.8,
          ratingCount: 892,
          tags: ['tech', 'startups', 'innovation']
        },
        {
          _id: '2',
          title: 'Business Insights',
          description: 'Weekly deep dives into business strategy, leadership, and entrepreneurship.',
          host: 'Michael Chen',
          category: 'Business',
          coverImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&fit=crop',
          language: 'en',
          isExplicit: false,
          totalEpisodes: 128,
          subscribers: 8930,
          rating: 4.6,
          ratingCount: 456,
          tags: ['business', 'strategy', 'leadership']
        },
        {
          _id: '3',
          title: 'Comedy Central',
          description: 'Hilarious conversations and comedy sketches to brighten your day.',
          host: 'Emma Rodriguez',
          category: 'Comedy',
          coverImage: 'https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=300&h=300&fit=crop',
          language: 'en',
          isExplicit: true,
          totalEpisodes: 89,
          subscribers: 12340,
          rating: 4.9,
          ratingCount: 678,
          tags: ['comedy', 'humor', 'entertainment']
        }
      ];

      // Filter by category and search
      let filtered = mockPodcasts;
      if (selectedCategory) {
        filtered = filtered.filter(p => p.category === selectedCategory);
      }
      if (searchQuery) {
        filtered = filtered.filter(p => 
          p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.host.toLowerCase().includes(searchQuery.toLowerCase())
        );
      }

      setPodcasts(filtered);
    } catch (error) {
      console.error('Failed to fetch podcasts:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      // Mock categories
      setCategories([
        { name: 'Technology', count: 45 },
        { name: 'Business', count: 32 },
        { name: 'Comedy', count: 28 },
        { name: 'Education', count: 24 },
        { name: 'Health', count: 19 },
        { name: 'Science', count: 16 }
      ]);
    } catch (error) {
      console.error('Failed to fetch categories:', error);
    }
  };

  const formatDuration = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return hours > 0 ? `${hours}h ${minutes}m` : `${minutes}m`;
  };

  const formatNumber = (num: number): string => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/4"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="bg-white dark:bg-gray-800 rounded-lg p-4 space-y-4">
                  <div className="w-full aspect-square bg-gray-200 dark:bg-gray-700 rounded"></div>
                  <div className="space-y-2">
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
                    <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-3 mb-4">
            <FaPodcast className="text-primary-500" size={32} />
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                Podcasts
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                Discover and listen to your favorite podcasts
              </p>
            </div>
          </div>

          {/* Search and Filters */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search podcasts, hosts, or topics..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center space-x-2 px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
            >
              <FaFilter />
              <span>Filters</span>
            </button>
          </div>

          {/* Category Filters */}
          {showFilters && (
            <div className="mt-4 p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-3">Categories</h3>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setSelectedCategory('')}
                  className={`px-3 py-1 rounded-full text-sm transition-colors ${
                    selectedCategory === ''
                      ? 'bg-primary-500 text-white'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                  }`}
                >
                  All
                </button>
                {categories.map((category) => (
                  <button
                    key={category.name}
                    onClick={() => setSelectedCategory(category.name)}
                    className={`px-3 py-1 rounded-full text-sm transition-colors ${
                      selectedCategory === category.name
                        ? 'bg-primary-500 text-white'
                        : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                    }`}
                  >
                    {category.name} ({category.count})
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Podcasts Grid */}
        {podcasts.length === 0 ? (
          <div className="text-center py-12">
            <FaPodcast className="mx-auto text-gray-400 mb-4" size={48} />
            <p className="text-gray-600 dark:text-gray-400">
              No podcasts found matching your criteria
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {podcasts.map((podcast) => (
              <div
                key={podcast._id}
                className="bg-white dark:bg-gray-800 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow border border-gray-200 dark:border-gray-700"
              >
                {/* Cover Image */}
                <div className="relative aspect-square">
                  <Image
                    src={podcast.coverImage}
                    alt={podcast.title}
                    fill
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-30 transition-all duration-200 flex items-center justify-center">
                    <button className="opacity-0 hover:opacity-100 transition-opacity bg-primary-500 text-white p-3 rounded-full">
                      <FaPlay size={20} />
                    </button>
                  </div>
                  {podcast.isExplicit && (
                    <div className="absolute top-2 right-2 bg-red-500 text-white text-xs px-2 py-1 rounded">
                      EXPLICIT
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="p-4">
                  <div className="mb-2">
                    <h3 className="font-semibold text-gray-900 dark:text-white text-lg mb-1 line-clamp-1">
                      {podcast.title}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                      by {podcast.host}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                      {podcast.description}
                    </p>
                  </div>

                  {/* Stats */}
                  <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 mb-3">
                    <span>{podcast.totalEpisodes} episodes</span>
                    <span>{formatNumber(podcast.subscribers)} subscribers</span>
                    <div className="flex items-center space-x-1">
                      <span>★</span>
                      <span>{podcast.rating}</span>
                    </div>
                  </div>

                  {/* Category and Tags */}
                  <div className="mb-3">
                    <span className="inline-block bg-primary-100 dark:bg-primary-900 text-primary-800 dark:text-primary-200 text-xs px-2 py-1 rounded mr-2">
                      {podcast.category}
                    </span>
                    {podcast.tags.slice(0, 2).map((tag) => (
                      <span
                        key={tag}
                        className="inline-block bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 text-xs px-2 py-1 rounded mr-1"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>

                  {/* Actions */}
                  <div className="flex items-center space-x-2">
                    <button className="flex-1 bg-primary-500 text-white py-2 px-4 rounded-lg hover:bg-primary-600 transition-colors text-sm font-medium">
                      Subscribe
                    </button>
                    <button className="p-2 text-gray-400 hover:text-red-500 transition-colors">
                      <FaHeart />
                    </button>
                    <button className="p-2 text-gray-400 hover:text-green-500 transition-colors">
                      <FaDownload />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}