'use client';

import { useState, useEffect } from 'react';
import { FaRadio, FaPlay, FaPause, FaHeart, FaRegHeart, FaGlobe, FaMusic } from 'react-icons/fa';
import Image from 'next/image';

interface RadioStation {
  _id: string;
  name: string;
  description: string;
  genre: string;
  country: string;
  language: string;
  streamUrl: string;
  logoUrl: string;
  website?: string;
  listeners: number;
  bitrate: number;
  isLive: boolean;
  tags: string[];
  currentSong?: {
    title: string;
    artist: string;
  };
}

export default function RadioPage() {
  const [stations, setStations] = useState<RadioStation[]>([]);
  const [currentStation, setCurrentStation] = useState<RadioStation | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [loading, setLoading] = useState(true);
  const [selectedGenre, setSelectedGenre] = useState<string>('');
  const [selectedCountry, setSelectedCountry] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState('');

  const genres = [
    'Pop', 'Rock', 'Jazz', 'Classical', 'Electronic', 'Hip Hop', 
    'Country', 'R&B', 'Reggae', 'Folk', 'Blues', 'Indie'
  ];

  const countries = [
    'United States', 'United Kingdom', 'Canada', 'Australia', 
    'Germany', 'France', 'Japan', 'Brazil', 'India', 'Mexico'
  ];

  useEffect(() => {
    fetchRadioStations();
  }, [selectedGenre, selectedCountry, searchQuery]);

  const fetchRadioStations = async () => {
    setLoading(true);
    try {
      // Mock radio stations data
      const mockStations: RadioStation[] = [
        {
          _id: '1',
          name: 'Global Pop Radio',
          description: 'The biggest pop hits from around the world, 24/7',
          genre: 'Pop',
          country: 'United States',
          language: 'English',
          streamUrl: 'https://example.com/stream1',
          logoUrl: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=100&h=100&fit=crop',
          website: 'https://globalpopradio.com',
          listeners: 15420,
          bitrate: 128,
          isLive: true,
          tags: ['pop', 'hits', 'top40'],
          currentSong: {
            title: 'Blinding Lights',
            artist: 'The Weeknd'
          }
        },
        {
          _id: '2',
          name: 'Jazz Café',
          description: 'Smooth jazz and contemporary sounds for relaxation',
          genre: 'Jazz',
          country: 'United States',
          language: 'English',
          streamUrl: 'https://example.com/stream2',
          logoUrl: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=100&h=100&fit=crop',
          listeners: 8930,
          bitrate: 192,
          isLive: true,
          tags: ['jazz', 'smooth', 'instrumental'],
          currentSong: {
            title: 'Take Five',
            artist: 'Dave Brubeck'
          }
        },
        {
          _id: '3',
          name: 'Electronic Pulse',
          description: 'Electronic, EDM, and dance music non-stop',
          genre: 'Electronic',
          country: 'Germany',
          language: 'English',
          streamUrl: 'https://example.com/stream3',
          logoUrl: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=100&h=100&fit=crop',
          listeners: 12340,
          bitrate: 256,
          isLive: true,
          tags: ['electronic', 'edm', 'dance'],
          currentSong: {
            title: 'Levels',
            artist: 'Avicii'
          }
        },
        {
          _id: '4',
          name: 'Classic Rock Central',
          description: 'The greatest rock anthems from the 70s, 80s, and 90s',
          genre: 'Rock',
          country: 'United Kingdom',
          language: 'English',
          streamUrl: 'https://example.com/stream4',
          logoUrl: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=100&h=100&fit=crop',
          listeners: 18750,
          bitrate: 128,
          isLive: true,
          tags: ['rock', 'classic', 'anthems'],
          currentSong: {
            title: 'Bohemian Rhapsody',
            artist: 'Queen'
          }
        },
        {
          _id: '5',
          name: 'Classical Harmony',
          description: 'Beautiful classical music from the masters',
          genre: 'Classical',
          country: 'Austria',
          language: 'German',
          streamUrl: 'https://example.com/stream5',
          logoUrl: 'https://images.unsplash.com/photo-1507838153414-b4b713384a76?w=100&h=100&fit=crop',
          listeners: 5670,
          bitrate: 320,
          isLive: true,
          tags: ['classical', 'orchestra', 'symphony'],
          currentSong: {
            title: 'Symphony No. 9',
            artist: 'Beethoven'
          }
        },
        {
          _id: '6',
          name: 'Hip Hop Nation',
          description: 'The hottest hip hop and rap tracks',
          genre: 'Hip Hop',
          country: 'United States',
          language: 'English',
          streamUrl: 'https://example.com/stream6',
          logoUrl: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=100&h=100&fit=crop',
          listeners: 22100,
          bitrate: 128,
          isLive: true,
          tags: ['hiphop', 'rap', 'urban'],
          currentSong: {
            title: 'God\'s Plan',
            artist: 'Drake'
          }
        }
      ];

      // Apply filters
      let filtered = mockStations;
      if (selectedGenre) {
        filtered = filtered.filter(station => station.genre === selectedGenre);
      }
      if (selectedCountry) {
        filtered = filtered.filter(station => station.country === selectedCountry);
      }
      if (searchQuery) {
        filtered = filtered.filter(station =>
          station.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          station.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
          station.genre.toLowerCase().includes(searchQuery.toLowerCase())
        );
      }

      setStations(filtered);
    } catch (error) {
      console.error('Failed to fetch radio stations:', error);
    } finally {
      setLoading(false);
    }
  };

  const playStation = (station: RadioStation) => {
    if (currentStation?._id === station._id && isPlaying) {
      setIsPlaying(false);
    } else {
      setCurrentStation(station);
      setIsPlaying(true);
    }
  };

  const formatListeners = (count: number): string => {
    if (count >= 1000000) return `${(count / 1000000).toFixed(1)}M`;
    if (count >= 1000) return `${(count / 1000).toFixed(1)}K`;
    return count.toString();
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
                  <div className="flex items-center space-x-3">
                    <div className="w-16 h-16 bg-gray-200 dark:bg-gray-700 rounded"></div>
                    <div className="flex-1 space-y-2">
                      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
                      <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
                    </div>
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
            <FaRadio className="text-primary-500" size={32} />
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                Radio Stations
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                Listen to live radio from around the world
              </p>
            </div>
          </div>

          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <input
              type="text"
              placeholder="Search stations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
            <select
              value={selectedGenre}
              onChange={(e) => setSelectedGenre(e.target.value)}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              <option value="">All Genres</option>
              {genres.map(genre => (
                <option key={genre} value={genre}>{genre}</option>
              ))}
            </select>
            <select
              value={selectedCountry}
              onChange={(e) => setSelectedCountry(e.target.value)}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              <option value="">All Countries</option>
              {countries.map(country => (
                <option key={country} value={country}>{country}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Current Playing Station */}
        {currentStation && (
          <div className="bg-gradient-to-r from-primary-500 to-purple-600 text-white rounded-lg p-6 mb-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <Image
                    src={currentStation.logoUrl}
                    alt={currentStation.name}
                    width={80}
                    height={80}
                    className="rounded-lg"
                  />
                  {isPlaying && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30 rounded-lg">
                      <div className="flex space-x-1">
                        <div className="w-1 h-4 bg-white animate-pulse"></div>
                        <div className="w-1 h-6 bg-white animate-pulse" style={{ animationDelay: '0.1s' }}></div>
                        <div className="w-1 h-3 bg-white animate-pulse" style={{ animationDelay: '0.2s' }}></div>
                        <div className="w-1 h-5 bg-white animate-pulse" style={{ animationDelay: '0.3s' }}></div>
                      </div>
                    </div>
                  )}
                </div>
                <div>
                  <h3 className="text-xl font-bold">{currentStation.name}</h3>
                  <p className="opacity-90">{currentStation.genre} • {currentStation.country}</p>
                  {currentStation.currentSong && (
                    <p className="text-sm opacity-75 mt-1">
                      🎵 Now Playing: {currentStation.currentSong.title} - {currentStation.currentSong.artist}
                    </p>
                  )}
                  <div className="flex items-center space-x-4 mt-2 text-sm opacity-75">
                    <span>👥 {formatListeners(currentStation.listeners)} listeners</span>
                    <span>📡 {currentStation.bitrate}kbps</span>
                    {currentStation.isLive && <span className="text-green-300">🔴 LIVE</span>}
                  </div>
                </div>
              </div>
              <button
                onClick={() => playStation(currentStation)}
                className="bg-white bg-opacity-20 hover:bg-opacity-30 p-4 rounded-full transition-colors"
              >
                {isPlaying ? <FaPause size={24} /> : <FaPlay size={24} />}
              </button>
            </div>
          </div>
        )}

        {/* Stations Grid */}
        {stations.length === 0 ? (
          <div className="text-center py-12">
            <FaRadio className="mx-auto text-gray-400 mb-4" size={48} />
            <p className="text-gray-600 dark:text-gray-400">
              No radio stations found matching your criteria
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {stations.map((station) => (
              <div
                key={station._id}
                className={`bg-white dark:bg-gray-800 rounded-lg p-4 border transition-all hover:shadow-md ${
                  currentStation?._id === station._id
                    ? 'border-primary-500 ring-2 ring-primary-200 dark:ring-primary-800'
                    : 'border-gray-200 dark:border-gray-700'
                }`}
              >
                <div className="flex items-start space-x-3 mb-3">
                  <div className="relative">
                    <Image
                      src={station.logoUrl}
                      alt={station.name}
                      width={64}
                      height={64}
                      className="rounded-lg"
                    />
                    {station.isLive && (
                      <div className="absolute -top-1 -right-1 bg-red-500 text-white text-xs px-1 py-0.5 rounded">
                        LIVE
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-gray-900 dark:text-white truncate">
                      {station.name}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                      {station.genre} • {station.country}
                    </p>
                    <div className="flex items-center space-x-2 text-xs text-gray-500 dark:text-gray-500">
                      <span>👥 {formatListeners(station.listeners)}</span>
                      <span>📡 {station.bitrate}kbps</span>
                    </div>
                  </div>
                </div>

                <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 line-clamp-2">
                  {station.description}
                </p>

                {station.currentSong && (
                  <div className="bg-gray-50 dark:bg-gray-700 rounded p-2 mb-3">
                    <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Now Playing:</p>
                    <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                      {station.currentSong.title}
                    </p>
                    <p className="text-xs text-gray-600 dark:text-gray-400 truncate">
                      by {station.currentSong.artist}
                    </p>
                  </div>
                )}

                <div className="flex items-center justify-between">
                  <div className="flex space-x-1">
                    {station.tags.slice(0, 2).map((tag) => (
                      <span
                        key={tag}
                        className="text-xs bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 px-2 py-1 rounded"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                  <div className="flex items-center space-x-2">
                    <button className="p-2 text-gray-400 hover:text-red-500 transition-colors">
                      <FaRegHeart size={16} />
                    </button>
                    {station.website && (
                      <button className="p-2 text-gray-400 hover:text-blue-500 transition-colors">
                        <FaGlobe size={16} />
                      </button>
                    )}
                    <button
                      onClick={() => playStation(station)}
                      className={`p-2 rounded-lg transition-colors ${
                        currentStation?._id === station._id && isPlaying
                          ? 'bg-primary-500 text-white'
                          : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-primary-500 hover:text-white'
                      }`}
                    >
                      {currentStation?._id === station._id && isPlaying ? (
                        <FaPause size={16} />
                      ) : (
                        <FaPlay size={16} />
                      )}
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