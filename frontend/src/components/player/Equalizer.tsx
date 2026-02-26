'use client';

import { useState, useEffect, useRef } from 'react';
import { usePlayerStore } from '@/store/playerStore';
import { FaSliders, FaTimes, FaUndo } from 'react-icons/fa';

interface EqualizerProps {
  isOpen: boolean;
  onClose: () => void;
}

interface EqualizerBand {
  frequency: number;
  gain: number;
  label: string;
}

const defaultBands: EqualizerBand[] = [
  { frequency: 60, gain: 0, label: '60Hz' },
  { frequency: 170, gain: 0, label: '170Hz' },
  { frequency: 310, gain: 0, label: '310Hz' },
  { frequency: 600, gain: 0, label: '600Hz' },
  { frequency: 1000, gain: 0, label: '1kHz' },
  { frequency: 3000, gain: 0, label: '3kHz' },
  { frequency: 6000, gain: 0, label: '6kHz' },
  { frequency: 12000, gain: 0, label: '12kHz' },
  { frequency: 14000, gain: 0, label: '14kHz' },
  { frequency: 16000, gain: 0, label: '16kHz' }
];

const presets = {
  flat: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  rock: [5, 4, -1, -1, 0, 1, 3, 4, 4, 4],
  pop: [2, 1, 0, -1, -1, 0, 1, 2, 2, 2],
  jazz: [4, 3, 1, 2, -1, -1, 0, 1, 2, 3],
  classical: [5, 4, 3, 2, -1, -1, 0, 1, 2, 3],
  electronic: [5, 4, 1, 0, -1, 1, 0, 1, 4, 5],
  hiphop: [5, 4, 1, 3, -1, -1, 1, 2, 3, 4],
  vocal: [2, 1, -1, -2, -1, 2, 4, 4, 3, 2],
  bass: [7, 6, 4, 2, 0, -1, -2, -2, -1, 0],
  treble: [0, -1, -2, -2, -1, 1, 3, 4, 5, 6]
};

export default function Equalizer({ isOpen, onClose }: EqualizerProps) {
  const [bands, setBands] = useState<EqualizerBand[]>(defaultBands);
  const [selectedPreset, setSelectedPreset] = useState<string>('flat');
  const [isEnabled, setIsEnabled] = useState(false);
  const audioContextRef = useRef<AudioContext | null>(null);
  const filtersRef = useRef<BiquadFilterNode[]>([]);
  const { audioRef } = usePlayerStore();

  // Initialize audio context and filters
  useEffect(() => {
    if (!audioRef?.current || !isEnabled) return;

    const initializeEqualizer = async () => {
      try {
        // Create audio context
        const context = new (window.AudioContext || (window as any).webkitAudioContext)();
        
        // Create source from audio element
        const source = context.createMediaElementSource(audioRef.current!);
        
        // Create filters for each band
        const filters = bands.map((band, index) => {
          const filter = context.createBiquadFilter();
          
          if (index === 0) {
            filter.type = 'lowshelf';
          } else if (index === bands.length - 1) {
            filter.type = 'highshelf';
          } else {
            filter.type = 'peaking';
            filter.Q.value = 1;
          }
          
          filter.frequency.value = band.frequency;
          filter.gain.value = band.gain;
          
          return filter;
        });

        // Connect filters in series
        let previousNode: AudioNode = source;
        filters.forEach(filter => {
          previousNode.connect(filter);
          previousNode = filter;
        });

        // Connect to destination
        previousNode.connect(context.destination);

        audioContextRef.current = context;
        filtersRef.current = filters;

        // Resume context if suspended
        if (context.state === 'suspended') {
          await context.resume();
        }
      } catch (error) {
        console.error('Error initializing equalizer:', error);
      }
    };

    initializeEqualizer();

    return () => {
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
    };
  }, [audioRef, isEnabled, bands]);

  // Update filter gains when bands change
  useEffect(() => {
    if (filtersRef.current.length > 0) {
      bands.forEach((band, index) => {
        if (filtersRef.current[index]) {
          filtersRef.current[index].gain.value = band.gain;
        }
      });
    }
  }, [bands]);

  const handleBandChange = (index: number, gain: number) => {
    setBands(prev => prev.map((band, i) => 
      i === index ? { ...band, gain } : band
    ));
    setSelectedPreset('custom');
  };

  const applyPreset = (presetName: string) => {
    if (presets[presetName as keyof typeof presets]) {
      const presetGains = presets[presetName as keyof typeof presets];
      setBands(prev => prev.map((band, index) => ({
        ...band,
        gain: presetGains[index]
      })));
      setSelectedPreset(presetName);
    }
  };

  const resetEqualizer = () => {
    setBands(defaultBands);
    setSelectedPreset('flat');
  };

  const toggleEqualizer = () => {
    setIsEnabled(!isEnabled);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-4xl mx-4 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <FaSliders className="text-primary-500" size={24} />
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
              Equalizer
            </h2>
            <button
              onClick={toggleEqualizer}
              className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                isEnabled
                  ? 'bg-primary-500 text-white'
                  : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
              }`}
            >
              {isEnabled ? 'ON' : 'OFF'}
            </button>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
          >
            <FaTimes className="text-gray-600 dark:text-gray-400" />
          </button>
        </div>

        {/* Presets */}
        <div className="mb-6">
          <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
            Presets
          </h3>
          <div className="flex flex-wrap gap-2">
            {Object.keys(presets).map(preset => (
              <button
                key={preset}
                onClick={() => applyPreset(preset)}
                className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                  selectedPreset === preset
                    ? 'bg-primary-500 text-white'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                }`}
              >
                {preset.charAt(0).toUpperCase() + preset.slice(1)}
              </button>
            ))}
            <button
              onClick={resetEqualizer}
              className="px-3 py-1 rounded text-sm font-medium bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors flex items-center space-x-1"
            >
              <FaUndo size={12} />
              <span>Reset</span>
            </button>
          </div>
        </div>

        {/* Equalizer Bands */}
        <div className="mb-6">
          <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
            Frequency Bands
          </h3>
          <div className="flex items-end justify-between space-x-2 bg-gray-50 dark:bg-gray-900 p-4 rounded-lg">
            {bands.map((band, index) => (
              <div key={band.frequency} className="flex flex-col items-center space-y-2">
                {/* Gain Display */}
                <div className="text-xs font-mono text-gray-600 dark:text-gray-400 w-8 text-center">
                  {band.gain > 0 ? '+' : ''}{band.gain}dB
                </div>
                
                {/* Slider */}
                <div className="relative h-32">
                  <input
                    type="range"
                    min="-12"
                    max="12"
                    step="0.5"
                    value={band.gain}
                    onChange={(e) => handleBandChange(index, parseFloat(e.target.value))}
                    className="slider-vertical h-32 w-4 appearance-none bg-gray-200 dark:bg-gray-700 rounded-lg cursor-pointer"
                    style={{
                      writingMode: 'bt-lr',
                      WebkitAppearance: 'slider-vertical'
                    }}
                    disabled={!isEnabled}
                  />
                </div>
                
                {/* Frequency Label */}
                <div className="text-xs text-gray-600 dark:text-gray-400 text-center w-12">
                  {band.label}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Info */}
        <div className="text-xs text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-900 p-3 rounded">
          <p className="mb-1">
            <strong>Tip:</strong> Adjust frequency bands to enhance your listening experience.
          </p>
          <p>
            Positive values boost frequencies, negative values reduce them. 
            Use presets for quick setup or create your custom sound profile.
          </p>
        </div>
      </div>
    </div>
  );
}