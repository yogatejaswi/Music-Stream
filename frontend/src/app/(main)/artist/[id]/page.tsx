'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import { artistsAPI } from '@/lib/api';
import SongCard from '@/components/song/SongCard';
import { FaCheckCircle, FaUserPlus, FaUserCheck } from 'react-icons/fa';
import toast from 'react-hot-toast';

export default function ArtistPage() {
  const params = useParams();
  const [artist, setArtist] = useState<any>(null);
  const [songs, setSongs] = useState<any[]>([]);
  const [isFollowing, setIsFollowing] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchArtist();
  }, [params.id]);

  const fetchArtist = async () => {
    try {
      const response = await artistsAPI.getById(params.id as string);
      setArtist(response.data.data);
      setSongs(response.data.data.songs || []);
    } catch (error) {
      console.error('Error fetching artist:', error);
      toast.error('Failed to load artist');
    } finally {
      setLoading(false);
    }
  };

  const handleFollow = async () => {
    try {
      const response = await artistsAPI.follow(params.id as string);
      setIsFollowing(response.data.isFollowing);
      toast.success(response.data.message);
    } catch (error) {
      toast.error('Failed to follow artist');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  if (!artist) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-xl">Artist not found</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Artist Header */}
      <div className="relative h-96 bg-gradient-to-b from-primary-500/20 to-dark-300">
        {artist.coverImage && (
          <Image
            src={artist.coverImage}
            alt={artist.name}
            fill
            className="object-cover opacity-30"
          />
        )}
        
        <div className="absolute inset-0 flex items-end">
          <div className="p-8 w-full">
            <div className="flex items-end gap-6">
              <Image
                src={artist.profileImage}
                alt={artist.name}
                width={200}
                height={200}
                className="rounded-full shadow-2xl"
              />
              
              <div className="flex-1 pb-4">
                <div className="flex items-center gap-2 mb-2">
                  {artist.verified && (
                    <FaCheckCircle className="text-primary-500" size={24} />
                  )}
                  <span className="text-sm font-semibold">Verified Artist</span>
                </div>
                
                <h1 className="text-6xl font-bold mb-4">{artist.name}</h1>
                
                <div className="flex items-center gap-4 text-sm">
                  <span>{artist.followerCount || 0} followers</span>
                  {artist.genre && artist.genre.length > 0 && (
                    <span>• {artist.genre.join(', ')}</span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="px-8 py-6 bg-dark-300/50">
        <button
          onClick={handleFollow}
          className={`flex items-center gap-2 px-6 py-3 rounded-full font-semibold transition ${
            isFollowing
              ? 'bg-dark-200 text-white hover:bg-dark-100'
              : 'bg-primary-500 text-white hover:bg-primary-600'
          }`}
        >
          {isFollowing ? (
            <>
              <FaUserCheck size={20} />
              Following
            </>
          ) : (
            <>
              <FaUserPlus size={20} />
              Follow
            </>
          )}
        </button>
      </div>

      {/* Bio */}
      {artist.bio && (
        <div className="px-8 py-6">
          <h2 className="text-2xl font-bold mb-4">About</h2>
          <p className="text-gray-300 max-w-3xl">{artist.bio}</p>
        </div>
      )}

      {/* Social Links */}
      {artist.socialLinks && Object.keys(artist.socialLinks).length > 0 && (
        <div className="px-8 py-6">
          <h2 className="text-2xl font-bold mb-4">Connect</h2>
          <div className="flex gap-4">
            {artist.socialLinks.website && (
              <a
                href={artist.socialLinks.website}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary-500 hover:underline"
              >
                Website
              </a>
            )}
            {artist.socialLinks.twitter && (
              <a
                href={artist.socialLinks.twitter}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary-500 hover:underline"
              >
                Twitter
              </a>
            )}
            {artist.socialLinks.instagram && (
              <a
                href={artist.socialLinks.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary-500 hover:underline"
              >
                Instagram
              </a>
            )}
          </div>
        </div>
      )}

      {/* Popular Songs */}
      <div className="px-8 py-6">
        <h2 className="text-2xl font-bold mb-6">Popular Tracks</h2>
        
        {songs.length === 0 ? (
          <p className="text-gray-400">No songs available</p>
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
      </div>
    </div>
  );
}
