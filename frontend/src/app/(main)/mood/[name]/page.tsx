'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { searchAPI } from '@/lib/api';
import SongCard from '@/components/song/SongCard';
import { FaMusic, FaHeart, FaSmile, FaSadTear, FaFire, FaLeaf, FaBolt, FaMoon } from 'react-icons/fa';

const moodIcons: { [key: string]: any } = {
  happy: FaSmile,
  sad: FaSadTear,
  energetic: FaBolt,
  chill: FaLeaf,
  romantic: FaHeart,
  party: FaFire,
  relaxing: FaMoon,
  default: FaMusic
};

const moodColors: { [key: string]: string } = {
  happy: 'from-yellow-400 to-orange-500',
  sad: 'from-blue-500 to-indigo-600',
  energetic: 'from-red-500 to-pink-500',
  chill: 'from-green-400 to-blue-500',
  romantic: 'from-pink-500 to-red-500',
  party: 'from-purple-500 to-pink-500',
  relaxing: 'from-indigo-500 to-purple-600',
  default: 'from-gray-500 to-gray-600'
};

export default function MoodPage() {
  const params = useParams();
  const moodName = decodeURIComponent(params.name as string);
  const [songs, setSongs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMoodSongs();
  }, [moodName]);

  const fetchMoodSongs = async () => {
    try {
      const response = await searchAPI.byMood(moodName.toLowerCase());
      setSongs(response.data.data || []);
    } catch (error) {
      console.error('Error fetching mood songs:', error);
    } finally {
      setLoading(false);
    }
  };

  const getMoodIcon = () => {
    const IconComponent = moodIcons[moodName.toLowerCase()] || moodIcons.default;
    return IconComponent;
  };

  const getMoodColor = () => {
    return moodColors[moodName.toLowerCase()] || moodColors.default;
  };

  const getMoodDescription = () => {
    const descriptions: { [key: string]: string } = {
      happy: 'Uplifting songs to brighten your day',
      sad: 'Melancholic tunes for reflective moments',
      energetic: 'High-energy tracks to get you moving',
      chill: 'Laid-back vibes for relaxation',
      romantic: 'Love songs for special moments',
      party: 'Dance hits to get the party started',
      relaxing: 'Peaceful melodies for unwinding'
    };
    return descriptions[moodName.toLowerCase()] || `Songs that match the ${moodName} mood`;
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse">
          <div className="h-32 bg-dark-300 rounded-lg mb-6"></div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(i => (
              <div key={i} className="aspect-square bg-dark-300 rounded-lg"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  const Icon = getMoodIcon();

  return (
    <div className="p-6">
      {/* Mood Header */}
      <div className={`bg-gradient-to-r ${getMoodColor()} rounded-lg p-8 mb-8 text-white`}>
        <div className="flex items-center gap-6">
          <div className="w-24 h-24 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
            <Icon size={48} />
          </div>
          <div>
            <h1 className="text-5xl font-bold capitalize mb-2">{moodName}</h1>
            <p className="text-xl opacity-90">{getMoodDescription()}</p>
            <p className="text-lg opacity-75 mt-2">{songs.length} songs</p>
          </div>
        </div>
      </div>

      {/* Songs Grid */}
      {songs.length === 0 ? (
        <div className="text-center py-12">
          <Icon size={64} className="mx-auto text-gray-400 mb-4" />
          <h2 className="text-2xl font-bold mb-2">No {moodName} Songs Found</h2>
          <p className="text-gray-400 mb-6">
            We couldn't find any songs matching the {moodName} mood.
          </p>
          <div className="flex gap-4 justify-center">
            <button
              onClick={fetchMoodSongs}
              className="px-6 py-3 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition"
            >
              Try Again
            </button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {songs.map((song: any, index: number) => (
            <SongCard 
              key={song._id} 
              song={song} 
              allSongs={songs} 
              songIndex={index} 
            />
          ))}
        </div>
      )}

      {/* Related Moods */}
      <div className="mt-12">
        <h2 className="text-2xl font-bold mb-6">Explore Other Moods</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {Object.entries(moodIcons)
            .filter(([mood]) => mood !== 'default' && mood !== moodName.toLowerCase())
            .slice(0, 6)
            .map(([mood, IconComp]) => (
              <a
                key={mood}
                href={`/mood/${mood}`}
                className={`bg-gradient-to-br ${moodColors[mood]} rounded-lg p-6 hover:scale-105 transition-transform cursor-pointer text-white`}
              >
                <IconComp size={32} className="mb-3" />
                <h3 className="text-lg font-bold capitalize">{mood}</h3>
              </a>
            ))}
        </div>
      </div>
    </div>
  );
}