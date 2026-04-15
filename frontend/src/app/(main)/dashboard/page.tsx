'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { songsAPI, userAPI } from '@/lib/api';
import SongCard from '@/components/song/SongCard';
import Link from 'next/link';
import Image from 'next/image';
import { useAuthStore } from '@/store/authStore';

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

const formatPlayedAt = (value?: string) => {
  if (!value) return 'Played recently';

  const playedDate = new Date(value);
  const diffMs = Date.now() - playedDate.getTime();
  const diffHours = Math.round(diffMs / (1000 * 60 * 60));

  if (diffHours <= 1) return 'Played within the last hour';
  if (diffHours < 24) return `Played ${diffHours}h ago`;

  const diffDays = Math.round(diffHours / 24);
  if (diffDays === 1) return 'Played yesterday';

  return `Played ${diffDays} days ago`;
};

export default function DashboardPage() {
  const router = useRouter();
  const user = useAuthStore((state) => state.user);
  const [trendingSongs, setTrendingSongs] = useState<any[]>([]);
  const [recentSongs, setRecentSongs] = useState<any[]>([]);
  const [recommendations, setRecommendations] = useState<any[]>([]);
  const [continueListening, setContinueListening] = useState<any[]>([]);
  const [artists, setArtists] = useState<any[]>([]);
  const [albums, setAlbums] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?.role === 'admin') {
      router.replace('/admin');
      return;
    }

    fetchData();
  }, [router, user?.role]);

  const fetchData = async () => {
    try {
      const [trending, recent, recommended, recentlyPlayed, artistsData] = await Promise.all([
        songsAPI.getAll({ sort: '-playCount', limit: 10 }),
        songsAPI.getAll({ sort: '-createdAt', limit: 10 }),
        userAPI.getRecommendations().catch(() => ({ data: { data: [] } })),
        userAPI.getRecentlyPlayed({ limit: 6 }).catch(() => ({ data: { data: [] } })),
        fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'}/artists`).then(r => r.json()).catch(() => ({ data: [] }))
      ]);

      setTrendingSongs(trending.data.data || []);
      setRecentSongs(recent.data.data || []);
      setRecommendations(recommended.data.data || []);
      setContinueListening(
        (recentlyPlayed.data.data || []).filter((item: any) => item.song?._id)
      );
      setArtists(artistsData.data || []);
      
      // Extract unique albums from songs and populated album objects
      const allSongs = [...(trending.data.data || []), ...(recent.data.data || [])];
      const albumMap = new Map();

      allSongs.forEach((song: any) => {
        if (!song.album) return;

        const album = typeof song.album === 'object'
          ? song.album
          : { _id: song.album, title: song.album };

        if (!albumMap.has(album._id)) {
          albumMap.set(album._id, {
            _id: album._id,
            name: album.title || 'Unknown Album',
            coverImage: album.coverImage || song.coverImage,
            artist: song.artist,
          });
        }
      });

      const uniqueAlbums = Array.from(albumMap.values());
      setAlbums(uniqueAlbums);
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

  if (user?.role === 'admin') {
    return null;
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
          {continueListening.length > 0 && (
            <section>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold text-white">Continue Listening</h2>
                <Link href="/history" className="text-sm text-primary-400 hover:text-primary-300 transition">
                  View history
                </Link>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                {continueListening.map((entry: any) => (
                  <div key={`${entry.song._id}-${entry.playedAt}`} className="bg-dark-200 rounded-2xl p-4 border border-white/5">
                    <div className="flex items-center gap-4">
                      <div className="relative h-20 w-20 overflow-hidden rounded-xl flex-shrink-0">
                        <Image
                          src={entry.song.coverImage || 'https://via.placeholder.com/300'}
                          alt={entry.song.title}
                          fill
                          className="object-cover"
                          unoptimized
                        />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-xs uppercase tracking-[0.2em] text-primary-400 mb-2">Pick up where you left off</p>
                        <Link
                          href={`/song/${entry.song._id}`}
                          className="block text-lg font-semibold text-white truncate hover:text-primary-300 transition"
                        >
                          {entry.song.title}
                        </Link>
                        <p className="text-sm text-gray-400 truncate">{entry.song.artist}</p>
                        <p className="text-xs text-gray-500 mt-2">{formatPlayedAt(entry.playedAt)}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Popular Artists */}
          {artists.length > 0 && (
            <section>
              <h2 className="text-2xl font-bold mb-4 text-white">Popular Artists</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                {artists.slice(0, 6).map((artist: any) => (
                  <Link
                    key={artist._id}
                    href={`/artist/${artist._id}`}
                    className="group"
                  >
                    <div className="bg-dark-200 rounded-lg p-4 hover:bg-dark-100 transition-all hover:scale-105">
                      <div className="relative w-full aspect-square mb-3 rounded-full overflow-hidden">
                        <Image
                          src={artist.image || `https://ui-avatars.com/api/?name=${encodeURIComponent(artist.name)}&size=200&background=random`}
                          alt={artist.name}
                          width={200}
                          height={200}
                          className="w-full h-full object-cover"
                          unoptimized
                        />
                      </div>
                      <h3 className="font-semibold text-center truncate text-white">{artist.name}</h3>
                      <p className="text-sm text-gray-400 text-center">{artist.genre || 'Artist'}</p>
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          )}

          {/* Popular Albums */}
          {albums.length > 0 && (
            <section>
              <h2 className="text-2xl font-bold mb-4 text-white">Popular Albums</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                {albums.slice(0, 5).map((album: any) => (
                  <Link
                    key={album._id}
                    href={`/search?q=${encodeURIComponent(album.name)}`}
                    className="group"
                  >
                    <div className="bg-dark-200 rounded-lg p-4 hover:bg-dark-100 transition-all hover:scale-105">
                      <div className="relative w-full aspect-square mb-3 rounded-lg overflow-hidden">
                        <Image
                          src={album.coverImage || 'https://via.placeholder.com/300'}
                          alt={album.name}
                          width={300}
                          height={300}
                          className="w-full h-full object-cover"
                          unoptimized
                        />
                      </div>
                      <h3 className="font-semibold truncate text-white">{album.name}</h3>
                      <p className="text-sm text-gray-400 truncate">{album.artist}</p>
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          )}

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
