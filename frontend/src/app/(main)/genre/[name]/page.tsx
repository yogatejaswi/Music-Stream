'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { searchAPI } from '@/lib/api';
import SongCard from '@/components/song/SongCard';
import { FaMusic } from 'react-icons/fa';
import toast from 'react-hot-toast';

const genreColors: { [key: string]: string } = {
  'Pop': 'from-pink-500 to-purple-500',
  'Rock': 'from-red-500 to-orange-500',
  'Hip Hop': 'from-yellow-500 to-green-500',
  'Jazz': 'from-blue-500 to-indigo-500',
  'Classical': 'from-purple-500 to-pink-500',
  'Electronic': 'from-cyan-500 to-blue-500',
  'Country': 'from-orange-500 to-red-500',
  'R&B': 'from-purple-500 to-red-500',
};

export default function GenrePage() {
  const params = useParams();
  const [songs, setSongs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const genreName = decodeURIComponent(params.name as string);
  const gradientClass = genreColors[genreName] || 'from-primary-500 to-green-500';

  useEffect(() => {
    fetchGenreSongs();
  }, [params.name]);

  const fetchGenreSongs = async () => {
    try {
      const response = await searchAPI.byGenre(genreName, { limit: 50 });
      setSongs(response.data.data || []);
    } catch (error) {
      console.error('Error fetching genre songs:', error);
      toast.error('Failed to load songs');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Genre Header */}
      <div className={`bg-gradient-to-b ${gradientClass} p-8 pb-16`}>
        <div className="max-w-7xl mx-auto">
          <h1 className="text-7xl font-bold mb-4">{genreName}</h1>
          <p className="text-xl opacity-90">{songs.length} songs</p>
        </div>
      </div>

      {/* Songs Grid */}
      <div className="px-8 py-6 -mt-8">
        {songs.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {songs.map((song, index) => (
              <SongCard
                key={song._id}
                song={song}
                allSongs={songs}
                songIndex={index}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <FaMusic size={64} className="mx-auto mb-4 text-gray-600" />
            <h2 className="text-2xl font-bold mb-2">No songs found</h2>
            <p className="text-gray-400">No songs in this genre yet</p>
          </div>
        )}
      </div>
    </div>
  );
}
