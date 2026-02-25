'use client';

import { useState, useEffect } from 'react';
import { FaMusic, FaCog } from 'react-icons/fa';

interface CrossfadeSettingsProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CrossfadeSettings({ isOpen, onClose }: CrossfadeSettingsProps) {
  const [crossfadeDuration, setCrossfadeDuration] = useState(3);
  const [isEnabled, setIsEnabled] = useState(false);

  useEffect(() => {
    // Load settings from localStorage
    const savedDuration = localStorage.getItem('crossfadeDuration');
    const savedEnabled = localStorage.getItem('crossfadeEnabled');
    
    if (savedDuration) setCrossfadeDuration(parseInt(savedDuration));
    if (savedEnabled) setIsEnabled(savedEnabled === 'true');
  }, []);

  const handleDurationChange = (duration: number) => {
    setCrossfadeDuration(duration);
    localStorage.setItem('crossfadeDuration', duration.toString());
  };

  const handleEnabledChange = (enabled: boolean) => {
    setIsEnabled(enabled);
    localStorage.setItem('crossfadeEnabled', enabled.toString());
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-dark-300 rounded-lg p-6 w-full max-w-md mx-4">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <FaMusic className="text-primary-500" />
            <h2 className="text-xl font-semibold">Crossfade Settings</h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition"
          >
            ✕
          </button>
        </div>

        <div className="space-y-6">
          {/* Enable/Disable Crossfade */}
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium">Enable Crossfade</h3>
              <p className="text-sm text-gray-400">
                Smoothly transition between songs
              </p>
            </div>
            <button
              onClick={() => handleEnabledChange(!isEnabled)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                isEnabled ? 'bg-primary-500' : 'bg-gray-600'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  isEnabled ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>

          {/* Crossfade Duration */}
          {isEnabled && (
            <div>
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-medium">Crossfade Duration</h3>
                <span className="text-sm text-gray-400">{crossfadeDuration}s</span>
              </div>
              
              <div className="space-y-3">
                <input
                  type="range"
                  min="1"
                  max="12"
                  value={crossfadeDuration}
                  onChange={(e) => handleDurationChange(parseInt(e.target.value))}
                  className="w-full h-2 bg-gray-600 rounded-lg appearance-none cursor-pointer slider"
                />
                
                <div className="flex justify-between text-xs text-gray-400">
                  <span>1s</span>
                  <span>6s</span>
                  <span>12s</span>
                </div>
              </div>

              {/* Preset Buttons */}
              <div className="grid grid-cols-4 gap-2 mt-4">
                {[1, 3, 6, 12].map((duration) => (
                  <button
                    key={duration}
                    onClick={() => handleDurationChange(duration)}
                    className={`py-2 px-3 rounded text-sm transition ${
                      crossfadeDuration === duration
                        ? 'bg-primary-500 text-white'
                        : 'bg-dark-200 text-gray-300 hover:bg-dark-100'
                    }`}
                  >
                    {duration}s
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Preview */}
          {isEnabled && (
            <div className="bg-dark-200 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <FaCog size={14} className="text-gray-400" />
                <span className="text-sm font-medium">Preview</span>
              </div>
              <p className="text-xs text-gray-400">
                Songs will fade out over the last {crossfadeDuration} seconds while the next song fades in.
                This creates a smooth, seamless listening experience.
              </p>
            </div>
          )}
        </div>

        <div className="flex gap-3 mt-6">
          <button
            onClick={onClose}
            className="flex-1 py-2 px-4 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition"
          >
            Close
          </button>
        </div>
      </div>

      <style jsx>{`
        .slider::-webkit-slider-thumb {
          appearance: none;
          height: 16px;
          width: 16px;
          border-radius: 50%;
          background: #10b981;
          cursor: pointer;
        }
        
        .slider::-moz-range-thumb {
          height: 16px;
          width: 16px;
          border-radius: 50%;
          background: #10b981;
          cursor: pointer;
          border: none;
        }
      `}</style>
    </div>
  );
}