'use client';

import { useState } from 'react';
import SmartRecommendations from '@/components/discovery/SmartRecommendations';
import ListeningStats from '@/components/analytics/ListeningStats';
import { FaRobot, FaChartLine, FaCompass, FaFire } from 'react-icons/fa';

export default function DiscoverPage() {
  const [activeTab, setActiveTab] = useState<'recommendations' | 'stats' | 'trending'>('recommendations');

  const tabs = [
    {
      id: 'recommendations' as const,
      label: 'For You',
      icon: FaRobot,
      description: 'Personalized recommendations'
    },
    {
      id: 'stats' as const,
      label: 'Your Stats',
      icon: FaChartLine,
      description: 'Listening analytics'
    },
    {
      id: 'trending' as const,
      label: 'Trending',
      icon: FaFire,
      description: 'What\'s popular now'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-3 mb-4">
            <FaCompass className="text-primary-500" size={32} />
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                Discover
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                Explore new music and insights about your listening habits
              </p>
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="flex space-x-1 bg-gray-100 dark:bg-gray-800 p-1 rounded-lg">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-md transition-all ${
                  activeTab === tab.id
                    ? 'bg-white dark:bg-gray-700 text-primary-600 dark:text-primary-400 shadow-sm'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
                }`}
              >
                <tab.icon size={16} />
                <span className="font-medium">{tab.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        <div className="space-y-8">
          {activeTab === 'recommendations' && (
            <div>
              <SmartRecommendations />
            </div>
          )}

          {activeTab === 'stats' && (
            <div>
              <ListeningStats timeRange="month" />
            </div>
          )}

          {activeTab === 'trending' && (
            <div>
              <TrendingContent />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function TrendingContent() {
  return (
    <div className="space-y-6">
      <div className="text-center py-12">
        <FaFire className="mx-auto text-orange-500 mb-4" size={48} />
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
          Trending Music
        </h3>
        <p className="text-gray-600 dark:text-gray-400 mb-4">
          Discover what's hot right now
        </p>
        <div className="bg-gradient-to-r from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20 p-6 rounded-lg border border-orange-200 dark:border-orange-800 max-w-md mx-auto">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Trending content will be populated based on:
          </p>
          <ul className="text-sm text-gray-600 dark:text-gray-400 mt-2 space-y-1">
            <li>• Most played songs today</li>
            <li>• Viral tracks on social media</li>
            <li>• New releases gaining traction</li>
            <li>• Regional trending music</li>
          </ul>
        </div>
      </div>
    </div>
  );
}