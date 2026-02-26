'use client';

import { useState } from 'react';
import { FaShare, FaFacebook, FaTwitter, FaInstagram, FaWhatsapp, FaCopy, FaSpotify } from 'react-icons/fa';
import { SiTelegram, SiDiscord } from 'react-icons/si';
import toast from 'react-hot-toast';

interface MusicSharingProps {
  song: {
    _id: string;
    title: string;
    artist: string;
    coverImage: string;
    duration: number;
  };
  isOpen: boolean;
  onClose: () => void;
}

export default function MusicSharing({ song, isOpen, onClose }: MusicSharingProps) {
  const [customMessage, setCustomMessage] = useState('');

  if (!isOpen) return null;

  const shareUrl = `${window.location.origin}/song/${song._id}`;
  const defaultMessage = `🎵 Check out "${song.title}" by ${song.artist} on Music Stream!`;
  const fullMessage = customMessage || defaultMessage;

  const shareOptions = [
    {
      name: 'Facebook',
      icon: FaFacebook,
      color: 'bg-blue-600',
      action: () => {
        const url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}&quote=${encodeURIComponent(fullMessage)}`;
        window.open(url, '_blank', 'width=600,height=400');
      }
    },
    {
      name: 'Twitter',
      icon: FaTwitter,
      color: 'bg-blue-400',
      action: () => {
        const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(fullMessage)}&url=${encodeURIComponent(shareUrl)}`;
        window.open(url, '_blank', 'width=600,height=400');
      }
    },
    {
      name: 'WhatsApp',
      icon: FaWhatsapp,
      color: 'bg-green-500',
      action: () => {
        const url = `https://wa.me/?text=${encodeURIComponent(`${fullMessage} ${shareUrl}`)}`;
        window.open(url, '_blank');
      }
    },
    {
      name: 'Telegram',
      icon: SiTelegram,
      color: 'bg-blue-500',
      action: () => {
        const url = `https://t.me/share/url?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(fullMessage)}`;
        window.open(url, '_blank');
      }
    },
    {
      name: 'Discord',
      icon: SiDiscord,
      color: 'bg-indigo-600',
      action: () => {
        // Copy to clipboard for Discord
        navigator.clipboard.writeText(`${fullMessage} ${shareUrl}`);
        toast.success('Copied to clipboard! Paste in Discord');
      }
    },
    {
      name: 'Instagram',
      icon: FaInstagram,
      color: 'bg-gradient-to-r from-purple-500 to-pink-500',
      action: () => {
        // Instagram doesn't support direct sharing, so copy to clipboard
        navigator.clipboard.writeText(fullMessage);
        toast.success('Message copied! Share manually on Instagram');
      }
    }
  ];

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(`${fullMessage} ${shareUrl}`);
      toast.success('Link copied to clipboard!');
    } catch (error) {
      toast.error('Failed to copy link');
    }
  };

  const generateSpotifyStyleCard = () => {
    // Create a shareable image-like text format
    const cardText = `
🎵 Now Playing
${song.title}
by ${song.artist}

Listen on Music Stream: ${shareUrl}
    `.trim();
    
    navigator.clipboard.writeText(cardText);
    toast.success('Music card copied to clipboard!');
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md mx-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Share Music
          </h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
          >
            ✕
          </button>
        </div>

        {/* Song Info */}
        <div className="flex items-center space-x-3 mb-4 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
          <img
            src={song.coverImage}
            alt={song.title}
            className="w-12 h-12 rounded object-cover"
          />
          <div className="flex-1 min-w-0">
            <p className="font-medium text-gray-900 dark:text-white truncate">
              {song.title}
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400 truncate">
              {song.artist}
            </p>
          </div>
        </div>

        {/* Custom Message */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Custom Message (Optional)
          </label>
          <textarea
            value={customMessage}
            onChange={(e) => setCustomMessage(e.target.value)}
            placeholder={defaultMessage}
            className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white resize-none"
            rows={3}
          />
        </div>

        {/* Share Options */}
        <div className="grid grid-cols-3 gap-3 mb-4">
          {shareOptions.map((option) => (
            <button
              key={option.name}
              onClick={option.action}
              className={`${option.color} text-white p-3 rounded-lg flex flex-col items-center space-y-1 hover:opacity-90 transition-opacity`}
            >
              <option.icon size={20} />
              <span className="text-xs">{option.name}</span>
            </button>
          ))}
        </div>

        {/* Additional Actions */}
        <div className="space-y-2">
          <button
            onClick={copyToClipboard}
            className="w-full flex items-center justify-center space-x-2 p-3 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          >
            <FaCopy className="text-gray-600 dark:text-gray-400" />
            <span className="text-gray-700 dark:text-gray-300">Copy Link</span>
          </button>

          <button
            onClick={generateSpotifyStyleCard}
            className="w-full flex items-center justify-center space-x-2 p-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
          >
            <FaSpotify />
            <span>Copy Music Card</span>
          </button>
        </div>

        {/* Preview */}
        <div className="mt-4 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
          <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Preview:</p>
          <p className="text-sm text-gray-800 dark:text-gray-200">
            {fullMessage}
          </p>
          <p className="text-xs text-blue-600 dark:text-blue-400 mt-1 break-all">
            {shareUrl}
          </p>
        </div>
      </div>
    </div>
  );
}