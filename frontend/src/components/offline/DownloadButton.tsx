'use client';

import { useState } from 'react';
import { useOfflineStore } from '@/store/offlineStore';
import { FaDownload, FaCheck, FaSpinner, FaTrash } from 'react-icons/fa';
import toast from 'react-hot-toast';

interface DownloadButtonProps {
  song: {
    _id: string;
    title: string;
    artist: string;
    coverImage: string;
    duration: number;
    audioUrl: string;
  };
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
}

export default function DownloadButton({ 
  song, 
  size = 'md', 
  showLabel = false 
}: DownloadButtonProps) {
  const {
    downloadSong,
    removeSong,
    isDownloaded,
    downloadProgress,
    isDownloading,
    downloadQueue
  } = useOfflineStore();

  const [isProcessing, setIsProcessing] = useState(false);
  
  const downloaded = isDownloaded(song._id);
  const inQueue = downloadQueue.includes(song._id);
  const progress = downloadProgress[song._id] || 0;

  const handleDownload = async () => {
    if (downloaded) {
      // Remove download
      try {
        removeSong(song._id);
        toast.success('Removed from offline storage');
      } catch (error) {
        toast.error('Failed to remove download');
      }
      return;
    }

    if (inQueue || isProcessing) {
      return;
    }

    setIsProcessing(true);
    try {
      await downloadSong(song);
      toast.success('Downloaded for offline listening');
    } catch (error: any) {
      toast.error(error.message || 'Download failed');
    } finally {
      setIsProcessing(false);
    }
  };

  const getButtonSize = () => {
    switch (size) {
      case 'sm':
        return 'w-6 h-6 text-xs';
      case 'lg':
        return 'w-10 h-10 text-lg';
      default:
        return 'w-8 h-8 text-sm';
    }
  };

  const getIconSize = () => {
    switch (size) {
      case 'sm':
        return 12;
      case 'lg':
        return 20;
      default:
        return 16;
    }
  };

  const renderIcon = () => {
    if (downloaded) {
      return <FaCheck size={getIconSize()} className="text-green-500" />;
    }

    if (inQueue || isProcessing) {
      return <FaSpinner size={getIconSize()} className="animate-spin text-blue-500" />;
    }

    return <FaDownload size={getIconSize()} className="text-gray-600 dark:text-gray-400" />;
  };

  const getTooltip = () => {
    if (downloaded) return 'Remove from offline storage';
    if (inQueue) return `Downloading... ${Math.round(progress)}%`;
    return 'Download for offline listening';
  };

  return (
    <div className="flex items-center space-x-2">
      <button
        onClick={handleDownload}
        disabled={inQueue || isProcessing}
        className={`
          ${getButtonSize()}
          flex items-center justify-center
          rounded-full
          hover:bg-gray-100 dark:hover:bg-gray-700
          transition-colors
          disabled:opacity-50 disabled:cursor-not-allowed
          relative
        `}
        title={getTooltip()}
      >
        {renderIcon()}
        
        {/* Progress ring for downloading */}
        {(inQueue || isProcessing) && progress > 0 && (
          <svg
            className="absolute inset-0 w-full h-full -rotate-90"
            viewBox="0 0 36 36"
          >
            <path
              className="text-gray-300 dark:text-gray-600"
              stroke="currentColor"
              strokeWidth="3"
              fill="none"
              d="M18 2.0845
                a 15.9155 15.9155 0 0 1 0 31.831
                a 15.9155 15.9155 0 0 1 0 -31.831"
            />
            <path
              className="text-blue-500"
              stroke="currentColor"
              strokeWidth="3"
              strokeDasharray={`${progress}, 100`}
              strokeLinecap="round"
              fill="none"
              d="M18 2.0845
                a 15.9155 15.9155 0 0 1 0 31.831
                a 15.9155 15.9155 0 0 1 0 -31.831"
            />
          </svg>
        )}
      </button>

      {showLabel && (
        <span className="text-sm text-gray-600 dark:text-gray-400">
          {downloaded ? 'Downloaded' : inQueue ? `${Math.round(progress)}%` : 'Download'}
        </span>
      )}
    </div>
  );
}