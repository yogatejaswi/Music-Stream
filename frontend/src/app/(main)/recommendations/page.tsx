'use client';

import { useState, useEffect } from 'react';
import { FaFire, FaChartLine, FaMusic } from 'react-icons/fa';
import { songsAPI, userAPI } from '@/lib/api';
import SongCard from '@/components/song/SongCard';
import toast from 'react-hot-toast';

export default function RecommendationsPage() {
  const [recommendations, setRecommendations] = useState<any[]>([]);
  const [trending, setTrending] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRecommendations();
  }, []);

  const fetchRecommendations = async () => {
    try {
      setLoading(true);

      const [trendingRes, recommendationsRes] = await Promise.all([
        songsAPI.getAll({ sort: '-playCount', limit: 10 }),
        userAPI.getRecommendations().catch(() => songsAPI.getAll({ sort: '-createdAt', limit: 10 }))
      ]);

      setTrending(trendingRes.data.data || []);
      setRecommendations(recommendationsRes.data.data || []);
    } catch (error) {
      console.error('Error fetching recommendations:', error);
      toast.error('Failed to load recommendations');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-8">
          {[1, 2].map(i => (
            <div key={i}>
              <div className="h-8 bg-dark-300 rounded w-1/4 mb-4"></div>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                {[1, 2, 3, 4, 5].map(j => (
                  <div key={j} className="h-40 bg-dark-300 rounded-lg"></div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-12">
      <div>
        <h1 className="text-4xl font-bold mb-2">Recommendations For You</h1>
        <p className="text-gray-400">Discover music based on your listening habits</p>
      </div>

      {/* Trending Section */}
      {trending.length > 0 && (
        <div>
          <div className="flex items-center gap-3 mb-6">
            <FaFire className="text-red-500" size={28} />
            <h2 className="text-2xl font-bold">Trending Now</h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {trending.slice(0, 10).map(song => (
              <SongCard key={song._id} song={song} />
            ))}
          </div>
        </div>
      )}

      {/* Recent Recommendations */}
      {recommendations.length > 0 && (
        <div>
          <div className="flex items-center gap-3 mb-6">
            <FaChartLine className="text-green-500" size={28} />
            <h2 className="text-2xl font-bold">Recently Added</h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {recommendations.slice(0, 10).map(song => (
              <SongCard key={song._id} song={song} />
            ))}
          </div>
        </div>
      )}

      {/* Empty State */}
      {trending.length === 0 && recommendations.length === 0 && (
        <div className="text-center py-12">
          <FaMusic size={64} className="mx-auto mb-4 text-gray-600" />
          <p className="text-xl text-gray-400">No recommendations available yet</p>
          <p className="text-gray-500 mt-2">Start listening to songs to get personalized recommendations</p>
        </div>
      )}
    </div>
  );
}
