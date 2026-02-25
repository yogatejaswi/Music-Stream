'use client';

import { useState, useEffect } from 'react';
import { useAuthStore } from '@/store/authStore';
import { useThemeStore } from '@/store/themeStore';
import { socialAPI } from '@/lib/api';
import { FaMoon, FaSun, FaUser, FaBell, FaLock, FaMusic, FaCog } from 'react-icons/fa';
import toast from 'react-hot-toast';
import CrossfadeSettings from '@/components/player/CrossfadeSettings';

export default function SettingsPage() {
  const { user, setUser } = useAuthStore();
  const { theme, toggleTheme } = useThemeStore();
  const [activeTab, setActiveTab] = useState('profile');
  const [showCrossfadeSettings, setShowCrossfadeSettings] = useState(false);
  
  // Profile settings
  const [profileData, setProfileData] = useState({
    name: user?.name || '',
    username: user?.username || '',
    bio: user?.bio || '',
    profileImage: user?.profileImage || ''
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      setProfileData({
        name: user.name || '',
        username: user.username || '',
        bio: user.bio || '',
        profileImage: user.profileImage || ''
      });
    }
  }, [user]);

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await socialAPI.updateProfile(profileData);
      setUser(response.data.data);
      toast.success('Profile updated successfully');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const tabs = [
    { id: 'profile', label: 'Profile', icon: FaUser },
    { id: 'appearance', label: 'Appearance', icon: FaSun },
    { id: 'notifications', label: 'Notifications', icon: FaBell },
    { id: 'privacy', label: 'Privacy', icon: FaLock },
    { id: 'playback', label: 'Playback', icon: FaMusic }
  ];

  return (
    <div className="p-6">
      <h1 className="text-4xl font-bold mb-6">Settings</h1>

      <div className="flex gap-6">
        {/* Sidebar */}
        <div className="w-64 space-y-2">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition ${
                  activeTab === tab.id
                    ? 'bg-primary-500 text-white'
                    : 'bg-dark-200 text-gray-400 hover:text-white hover:bg-dark-100'
                }`}
              >
                <Icon size={20} />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Content */}
        <div className="flex-1 bg-dark-200 rounded-lg p-6">
          {/* Profile Tab */}
          {activeTab === 'profile' && (
            <div>
              <h2 className="text-2xl font-bold mb-6">Profile Settings</h2>
              
              <form onSubmit={handleProfileUpdate} className="space-y-4 max-w-2xl">
                <div>
                  <label className="block text-sm font-medium mb-2">Name</label>
                  <input
                    type="text"
                    className="input"
                    value={profileData.name}
                    onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Username</label>
                  <input
                    type="text"
                    className="input"
                    value={profileData.username}
                    onChange={(e) => setProfileData({ ...profileData, username: e.target.value })}
                    placeholder="Choose a unique username"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Bio</label>
                  <textarea
                    className="input"
                    rows={4}
                    value={profileData.bio}
                    onChange={(e) => setProfileData({ ...profileData, bio: e.target.value })}
                    placeholder="Tell us about yourself..."
                    maxLength={500}
                  />
                  <p className="text-xs text-gray-400 mt-1">
                    {profileData.bio.length}/500 characters
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Profile Image URL</label>
                  <input
                    type="url"
                    className="input"
                    value={profileData.profileImage}
                    onChange={(e) => setProfileData({ ...profileData, profileImage: e.target.value })}
                    placeholder="https://example.com/image.jpg"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="btn-primary"
                >
                  {loading ? 'Saving...' : 'Save Changes'}
                </button>
              </form>
            </div>
          )}

          {/* Appearance Tab */}
          {activeTab === 'appearance' && (
            <div>
              <h2 className="text-2xl font-bold mb-6">Appearance</h2>
              
              <div className="space-y-6 max-w-2xl">
                <div>
                  <h3 className="text-lg font-semibold mb-3">Theme</h3>
                  <div className="flex gap-4">
                    <button
                      onClick={() => theme === 'light' && toggleTheme()}
                      className={`flex-1 p-6 rounded-lg border-2 transition ${
                        theme === 'dark'
                          ? 'border-primary-500 bg-dark-300'
                          : 'border-gray-700 bg-dark-400'
                      }`}
                    >
                      <FaMoon size={32} className="mx-auto mb-3" />
                      <p className="font-semibold">Dark Mode</p>
                      <p className="text-sm text-gray-400">Easy on the eyes</p>
                    </button>

                    <button
                      onClick={() => theme === 'dark' && toggleTheme()}
                      className={`flex-1 p-6 rounded-lg border-2 transition ${
                        theme === 'light'
                          ? 'border-primary-500 bg-gray-100 text-dark-400'
                          : 'border-gray-700 bg-dark-400'
                      }`}
                    >
                      <FaSun size={32} className="mx-auto mb-3" />
                      <p className="font-semibold">Light Mode</p>
                      <p className="text-sm text-gray-400">Classic look</p>
                    </button>
                  </div>
                </div>

                <div className="p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
                  <p className="text-sm text-yellow-500">
                    <strong>Note:</strong> Light mode is coming soon! Currently only dark mode is fully supported.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Notifications Tab */}
          {activeTab === 'notifications' && (
            <div>
              <h2 className="text-2xl font-bold mb-6">Notifications</h2>
              
              <div className="space-y-4 max-w-2xl">
                <div className="flex items-center justify-between p-4 bg-dark-300 rounded-lg">
                  <div>
                    <p className="font-semibold">New Releases</p>
                    <p className="text-sm text-gray-400">Get notified about new music from artists you follow</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" defaultChecked />
                    <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-500"></div>
                  </label>
                </div>

                <div className="flex items-center justify-between p-4 bg-dark-300 rounded-lg">
                  <div>
                    <p className="font-semibold">Playlist Updates</p>
                    <p className="text-sm text-gray-400">When someone adds to your collaborative playlists</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" defaultChecked />
                    <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-500"></div>
                  </label>
                </div>

                <div className="flex items-center justify-between p-4 bg-dark-300 rounded-lg">
                  <div>
                    <p className="font-semibold">Social Activity</p>
                    <p className="text-sm text-gray-400">When someone follows you or likes your playlist</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" />
                    <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-500"></div>
                  </label>
                </div>
              </div>
            </div>
          )}

          {/* Privacy Tab */}
          {activeTab === 'privacy' && (
            <div>
              <h2 className="text-2xl font-bold mb-6">Privacy & Security</h2>
              
              <div className="space-y-4 max-w-2xl">
                <div className="flex items-center justify-between p-4 bg-dark-300 rounded-lg">
                  <div>
                    <p className="font-semibold">Private Profile</p>
                    <p className="text-sm text-gray-400">Only people you approve can see your profile</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" />
                    <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-500"></div>
                  </label>
                </div>

                <div className="flex items-center justify-between p-4 bg-dark-300 rounded-lg">
                  <div>
                    <p className="font-semibold">Show Listening Activity</p>
                    <p className="text-sm text-gray-400">Let others see what you're listening to</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" defaultChecked />
                    <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-500"></div>
                  </label>
                </div>

                <div className="flex items-center justify-between p-4 bg-dark-300 rounded-lg">
                  <div>
                    <p className="font-semibold">Explicit Content</p>
                    <p className="text-sm text-gray-400">Allow playback of explicit content</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" defaultChecked />
                    <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-500"></div>
                  </label>
                </div>
              </div>
            </div>
          )}

          {/* Playback Tab */}
          {activeTab === 'playback' && (
            <div>
              <h2 className="text-2xl font-bold mb-6">Playback Settings</h2>
              
              <div className="space-y-6 max-w-2xl">
                <div>
                  <label className="block text-sm font-medium mb-2">Audio Quality</label>
                  <select className="input">
                    <option>Low (96 kbps)</option>
                    <option>Normal (160 kbps)</option>
                    <option selected>High (320 kbps)</option>
                  </select>
                </div>

                <div className="flex items-center justify-between p-4 bg-dark-300 rounded-lg">
                  <div>
                    <p className="font-semibold">Crossfade</p>
                    <p className="text-sm text-gray-400">Smooth transition between songs</p>
                  </div>
                  <button
                    onClick={() => setShowCrossfadeSettings(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition"
                  >
                    <FaCog size={14} />
                    Configure
                  </button>
                </div>

                <div className="flex items-center justify-between p-4 bg-dark-300 rounded-lg">
                  <div>
                    <p className="font-semibold">Gapless Playback</p>
                    <p className="text-sm text-gray-400">No silence between tracks</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" defaultChecked />
                    <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-500"></div>
                  </label>
                </div>

                <div className="flex items-center justify-between p-4 bg-dark-300 rounded-lg">
                  <div>
                    <p className="font-semibold">Normalize Volume</p>
                    <p className="text-sm text-gray-400">Set the same volume level for all songs</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" defaultChecked />
                    <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-500"></div>
                  </label>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Crossfade Settings Modal */}
      <CrossfadeSettings
        isOpen={showCrossfadeSettings}
        onClose={() => setShowCrossfadeSettings(false)}
      />
    </div>
  );
}
