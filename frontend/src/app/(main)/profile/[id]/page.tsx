'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import { socialAPI } from '@/lib/api';
import { FaUserPlus, FaUserCheck, FaMusic, FaHeart, FaUsers } from 'react-icons/fa';
import SongCard from '@/components/song/SongCard';
import PlaylistCard from '@/components/playlist/PlaylistCard';
import toast from 'react-hot-toast';

export default function ProfilePage() {
  const params = useParams();
  const [profile, setProfile] = useState<any>(null);
  const [isFollowing, setIsFollowing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'playlists' | 'liked'>('playlists');

  useEffect(() => {
    fetchProfile();
  }, [params.id]);

  const fetchProfile = async () => {
    try {
      const response = await socialAPI.getProfile(params.id as string);
      setProfile(response.data.data);
    } catch (error) {
      console.error('Error fetching profile:', error);
      toast.error('Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  const handleFollow = async () => {
    try {
      const response = await socialAPI.followUser(params.id as string);
      setIsFollowing(response.data.isFollowing);
      toast.success(response.data.message);
      // Refresh profile to update follower count
      fetchProfile();
    } catch (error) {
      toast.error('Failed to follow user');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-xl">User not found</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Profile Header */}
      <div className="bg-gradient-to-b from-primary-500/20 to-dark-300 p-8">
        <div className="flex items-end gap-6 max-w-7xl mx-auto">
          <Image
            src={profile.profileImage || 'https://via.placeholder.com/200'}
            alt={profile.name}
            width={200}
            height={200}
            className="rounded-full shadow-2xl"
          />
          
          <div className="flex-1 pb-4">
            <p className="text-sm font-semibold mb-2">PROFILE</p>
            <h1 className="text-6xl font-bold mb-4">{profile.name}</h1>
            
            {profile.username && (
              <p className="text-lg text-gray-400 mb-2">@{profile.username}</p>
            )}
            
            {profile.bio && (
              <p className="text-gray-300 mb-4 max-w-2xl">{profile.bio}</p>
            )}
            
            <div className="flex items-center gap-4 text-sm">
              <span className="flex items-center gap-2">
                <FaMusic />
                {profile.stats?.playlistsCount || 0} playlists
              </span>
              <span className="flex items-center gap-2">
                <FaUsers />
                {profile.stats?.followersCount || 0} followers
              </span>
              <span className="flex items-center gap-2">
                <FaUsers />
                {profile.stats?.followingCount || 0} following
              </span>
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

      {/* Tabs */}
      <div className="px-8 py-4 border-b border-gray-800">
        <div className="flex gap-6">
          <button
            onClick={() => setActiveTab('playlists')}
            className={`pb-2 font-semibold transition ${
              activeTab === 'playlists'
                ? 'text-white border-b-2 border-primary-500'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            Playlists
          </button>
          <button
            onClick={() => setActiveTab('liked')}
            className={`pb-2 font-semibold transition ${
              activeTab === 'liked'
                ? 'text-white border-b-2 border-primary-500'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            Liked Songs
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="px-8 py-6">
        {activeTab === 'playlists' && (
          <div>
            {profile.playlists && profile.playlists.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                {profile.playlists.map((playlist: any) => (
                  <PlaylistCard key={playlist._id} playlist={playlist} />
                ))}
              </div>
            ) : (
              <div className="text-center py-20">
                <FaMusic size={64} className="mx-auto mb-4 text-gray-600" />
                <p className="text-xl text-gray-400">No public playlists</p>
              </div>
            )}
          </div>
        )}

        {activeTab === 'liked' && (
          <div>
            {profile.likedSongs && profile.likedSongs.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                {profile.likedSongs.map((song: any, index: number) => (
                  <SongCard
                    key={song._id}
                    song={song}
                    allSongs={profile.likedSongs}
                    songIndex={index}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-20">
                <FaHeart size={64} className="mx-auto mb-4 text-gray-600" />
                <p className="text-xl text-gray-400">No liked songs</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
