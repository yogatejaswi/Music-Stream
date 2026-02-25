'use client';

import { useEffect, useState } from 'react';
import { historyAPI } from '@/lib/api';
import SongCard from '@/components/song/SongCard';
import { FaHistory, FaTrash, FaChartBar } from 'react-icons/fa';
import toast from 'react-hot-toast';

export default function HistoryPage() {
  const [history, setHistory] = useState<any[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState<'history' | 'stats'>('history');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [historyRes, statsRes] = await Promise.all([
        historyAPI.getRecent({ limit: 50 }).catch(() => ({ data: { data: [] } })),
        historyAPI.getStats().catch(() => ({ data: { data: null } }))
      ]);
      
      setHistory(historyRes.data.data || []);
      setStats(statsRes.data.data);
    } catch (error) {
      console.error('Error fetching history:', error);
      // Don't show error toast for empty history
    } finally {
      setLoading(false);
    }
  };

  const handleClearHistory = async () => {
    if (!confirm('Are you sure you want to clear your listening history?')) {
      return;
    }

    try {
      await historyAPI.clear();
      setHistory([]);
      toast.success('History cleared');
    } catch (error) {
      toast.error('Failed to clear history');
    }
  };

  const formatDuration = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    
    if (hours > 0) {
      return `${hours}h ${mins}m`;
    }
    return `${mins}m`;
  };

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
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold mb-2">Listening History</h1>
          <p className="text-gray-400">Track your music journey</p>
        </div>
        
        <div className="flex gap-3">
          <button
            onClick={() => setView('history')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition ${
              view === 'history'
                ? 'bg-primary-500 text-white'
                : 'bg-dark-200 text-gray-400 hover:text-white'
            }`}
          >
            <FaHistory />
            History
          </button>
          
          <button
            onClick={() => setView('stats')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition ${
              view === 'stats'
                ? 'bg-primary-500 text-white'
                : 'bg-dark-200 text-gray-400 hover:text-white'
            }`}
          >
            <FaChartBar />
            Stats
          </button>
          
          {history.length > 0 && (
            <button
              onClick={handleClearHistory}
              className="flex items-center gap-2 px-4 py-2 bg-red-500/20 text-red-500 hover:bg-red-500/30 rounded-lg transition"
            >
              <FaTrash />
              Clear
            </button>
          )}
        </div>
      </div>

      {/* Content */}
      {view === 'history' ? (
        <div>
          {history.length === 0 ? (
            <div className="text-center py-20">
              <FaHistory size={64} className="mx-auto mb-4 text-gray-600" />
              <h2 className="text-2xl font-bold mb-2">No listening history yet</h2>
              <p className="text-gray-400">Start playing some music!</p>
            </div>
          ) : (
            <div className="space-y-4">
              {history.map((item: any, index: number) => (
                <div
                  key={index}
                  className="flex items-center gap-4 p-4 bg-dark-200 rounded-lg hover:bg-dark-100 transition"
                >
                  <img
                    src={item.song.coverImage}
                    alt={item.song.title}
                    className="w-16 h-16 rounded"
                  />
                  
                  <div className="flex-1">
                    <h3 className="font-semibold">{item.song.title}</h3>
                    <p className="text-sm text-gray-400">{item.song.artist}</p>
                  </div>
                  
                  <div className="text-sm text-gray-400">
                    {new Date(item.playedAt).toLocaleDateString()}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      ) : (
        <div className="space-y-6">
          {/* Overview Stats */}
          {stats && (
            <>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="card">
                  <h3 className="text-sm text-gray-400 mb-2">Total Plays</h3>
                  <p className="text-3xl font-bold">{stats.total?.totalPlays || 0}</p>
                </div>
                
                <div className="card">
                  <h3 className="text-sm text-gray-400 mb-2">Listening Time</h3>
                  <p className="text-3xl font-bold">
                    {formatDuration(stats.total?.totalDuration || 0)}
                  </p>
                </div>
                
                <div className="card">
                  <h3 className="text-sm text-gray-400 mb-2">Unique Songs</h3>
                  <p className="text-3xl font-bold">{stats.topSongs?.length || 0}</p>
                </div>
              </div>

              {/* Top Songs */}
              {stats.topSongs && stats.topSongs.length > 0 && (
                <div>
                  <h2 className="text-2xl font-bold mb-4">Your Top Songs</h2>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                    {stats.topSongs.slice(0, 10).map((item: any) => (
                      <SongCard key={item.song._id} song={item.song} />
                    ))}
                  </div>
                </div>
              )}

              {/* Top Artists */}
              {stats.topArtists && stats.topArtists.length > 0 && (
                <div>
                  <h2 className="text-2xl font-bold mb-4">Your Top Artists</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {stats.topArtists.slice(0, 10).map((item: any, index: number) => (
                      <div key={index} className="flex items-center justify-between p-4 bg-dark-200 rounded-lg">
                        <div>
                          <p className="font-semibold">{item._id}</p>
                          <p className="text-sm text-gray-400">{item.playCount} plays</p>
                        </div>
                        <div className="text-2xl font-bold text-primary-500">
                          #{index + 1}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
}
