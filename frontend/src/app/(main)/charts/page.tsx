'use client';

import { useEffect, useState } from 'react';
import { analyticsAPI } from '@/lib/api';
import SongCard from '@/components/song/SongCard';
import { FaTrophy, FaFire, FaClock } from 'react-icons/fa';
import toast from 'react-hot-toast';

export default function ChartsPage() {
  const [charts, setCharts] = useState<any>(null);
  const [period, setPeriod] = useState<'day' | 'week' | 'month' | 'all'>('week');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCharts();
  }, [period]);

  const fetchCharts = async () => {
    setLoading(true);
    try {
      const response = await analyticsAPI.getCharts(period);
      setCharts(response.data.data);
    } catch (error) {
      console.error('Error fetching charts:', error);
      // Set empty charts instead of showing error
      setCharts({ topSongs: [], topArtists: [] });
    } finally {
      setLoading(false);
    }
  };

  const periods = [
    { value: 'day', label: 'Today', icon: FaClock },
    { value: 'week', label: 'This Week', icon: FaFire },
    { value: 'month', label: 'This Month', icon: FaTrophy },
    { value: 'all', label: 'All Time', icon: FaTrophy }
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-4xl font-bold mb-2">Top Charts</h1>
        <p className="text-gray-400">The most popular music right now</p>
      </div>

      {/* Period Selector */}
      <div className="flex gap-3">
        {periods.map((p) => {
          const Icon = p.icon;
          return (
            <button
              key={p.value}
              onClick={() => setPeriod(p.value as any)}
              className={`flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition ${
                period === p.value
                  ? 'bg-primary-500 text-white'
                  : 'bg-dark-200 text-gray-400 hover:text-white hover:bg-dark-100'
              }`}
            >
              <Icon />
              {p.label}
            </button>
          );
        })}
      </div>

      {/* Top Songs */}
      {charts && charts.topSongs && charts.topSongs.length > 0 && (
        <div>
          <h2 className="text-2xl font-bold mb-4">Top Songs</h2>
          
          {/* Top 3 - Featured */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            {charts.topSongs.slice(0, 3).map((song: any, index: number) => (
              <div
                key={song._id}
                className="relative bg-gradient-to-br from-primary-500/20 to-dark-200 rounded-lg p-6 hover:from-primary-500/30 transition"
              >
                <div className="absolute top-4 right-4 text-6xl font-bold text-primary-500/20">
                  #{index + 1}
                </div>
                
                <img
                  src={song.coverImage}
                  alt={song.title}
                  className="w-full aspect-square object-cover rounded mb-4"
                />
                
                <h3 className="font-bold text-lg mb-1 truncate">{song.title}</h3>
                <p className="text-gray-400 text-sm truncate">{song.artist}</p>
                <p className="text-primary-500 text-sm mt-2">{song.playCount} plays</p>
              </div>
            ))}
          </div>

          {/* Rest of Top 50 */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {charts.topSongs.slice(3, 50).map((song: any, index: number) => (
              <div key={song._id} className="relative">
                <div className="absolute top-2 left-2 bg-dark-400/90 text-white text-xs font-bold px-2 py-1 rounded z-10">
                  #{index + 4}
                </div>
                <SongCard
                  song={{
                    _id: song._id,
                    title: song.title,
                    artist: song.artist,
                    coverImage: song.coverImage,
                    audioUrl: song.audioUrl || '',
                    duration: song.duration || 0
                  }}
                  allSongs={charts.topSongs.map((s: any) => ({
                    _id: s._id,
                    title: s.title,
                    artist: s.artist,
                    coverImage: s.coverImage,
                    audioUrl: s.audioUrl || '',
                    duration: s.duration || 0
                  }))}
                  songIndex={index + 3}
                />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Top Artists */}
      {charts && charts.topArtists && charts.topArtists.length > 0 && (
        <div className="mt-12">
          <h2 className="text-2xl font-bold mb-4">Top Artists</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {charts.topArtists.slice(0, 20).map((artist: any, index: number) => (
              <div
                key={index}
                className="flex items-center gap-4 p-4 bg-dark-200 rounded-lg hover:bg-dark-100 transition"
              >
                <div className="text-2xl font-bold text-primary-500 w-12 text-center">
                  #{index + 1}
                </div>
                
                <div className="flex-1">
                  <h3 className="font-semibold">{artist._id}</h3>
                  <p className="text-sm text-gray-400">{artist.playCount} plays</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {(!charts || (charts.topSongs?.length === 0 && charts.topArtists?.length === 0)) && (
        <div className="text-center py-20">
          <FaTrophy size={64} className="mx-auto mb-4 text-gray-600" />
          <h2 className="text-2xl font-bold mb-2">No chart data available</h2>
          <p className="text-gray-400">Start listening to music to see the charts!</p>
        </div>
      )}
    </div>
  );
}
