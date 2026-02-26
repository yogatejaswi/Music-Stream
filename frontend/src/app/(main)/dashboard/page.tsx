'use client';

import { useEffect, useState } from 'react';
import { songsAPI, userAPI } from '@/lib/api';
import SongCard from '@/components/song/SongCard';
import Link from 'next/link';
import toast from 'react-hot-toast';

const genres = [
  { name: 'Pop', color: 'from-pink-500 to-purple-500' },
  { name: 'Rock', color: 'from-red-500 to-orange-500' },
  { name: 'Hip Hop', color: 'from-yellow-500 to-green-500' },
  { name: 'Jazz', color: 'from-blue-500 to-indigo-500' },
  { name: 'Classical', color: 'from-purple-500 to-pink-500' },
  { name: 'Electronic', color: 'from-cyan-500 to-blue-500' },
  { name: 'Country', color: 'from-orange-500 to-red-500' },
  { name: 'R&B', color: 'from-purple-500 to-red-500' },
];

export default function DashboardPage() {
  const [trendingSongs, setTrendingSongs] = useState([]);
  const [recentSongs, setRecentSongs] = useState([]);
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [trending, recent, recommended] = await Promise.all([
        songsAPI.getAll({ sort: '-playCount', limit: 10 }),
        songsAPI.getAll({ sort: '-createdAt', limit: 10 }),
        userAPI.getRecommendations().catch(() => ({ data: { data: [] } }))
      ]);

      setTrendingSongs(trending.data.data || []);
      setRecentSongs(recent.data.data || []);
      setRecommendations(recommended.data.data || []);
    } catch (error: any) {
      console.error('Error loading content:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-xl text-white">Loading...</div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-8 min-h-screen bg-dark-300">
      {/* Browse Genres */}
      <section>
        <h2 className="text-2xl font-bold mb-4 text-white">Browse by Genre</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {genres.map((genre) => (
            <Link
              key={genre.name}
              href={`/genre/${encodeURIComponent(genre.name)}`}
              className={`bg-gradient-to-br ${genre.color} rounded-lg p-6 hover:scale-105 transition-transform cursor-pointer`}
            >
              <h3 className="text-2xl font-bold text-white">{genre.name}</h3>
            </Link>
          ))}
        </div>
      </section>

      {trendingSongs.length === 0 && recentSongs.length === 0 && recommendations.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-96 text-center">
          <h2 className="text-3xl font-bold mb-4 text-white">No Songs Yet</h2>
          <p className="text-gray-400 mb-6">
            Upload your first song from the Admin dashboard to get started!
          </p>
          <Link 
            href="/admin" 
            className="bg-primary-500 hover:bg-primary-600 text-white px-6 py-3 rounded-lg font-semibold transition"
          >
            Go to Admin Dashboard
          </Link>
        </div>
      ) : (
        <>
          {trendingSongs.length > 0 && (
            <section>
              <h2 className="text-2xl font-bold mb-4 text-white">Trending Now</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                {trendingSongs.map((song: any, index: number) => (
                  <SongCard key={song._id} song={song} allSongs={trendingSongs} songIndex={index} />
                ))}
              </div>
            </section>
          )}

          {recentSongs.length > 0 && (
            <section>
              <h2 className="text-2xl font-bold mb-4 text-white">Recently Added</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                {recentSongs.map((song: any, index: number) => (
                  <SongCard key={song._id} song={song} allSongs={recentSongs} songIndex={index} />
                ))}
              </div>
            </section>
          )}

          {recommendations.length > 0 && (
            <section>
              <h2 className="text-2xl font-bold mb-4 text-white">Recommended for You</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                {recommendations.map((song: any, index: number) => (
                  <SongCard key={song._id} song={song} allSongs={recommendations} songIndex={index} />
                ))}
              </div>
            </section>
          )}
        </>
      )}
    </div>
  );
}
