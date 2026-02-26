'use client';

import { useState, useEffect, useRef } from 'react';
import { usePlayerStore } from '@/store/playerStore';
import { FaMicrophone, FaMicrophoneSlash, FaVolumeUp, FaVolumeDown } from 'react-icons/fa';
import { songsAPI } from '@/lib/api';
import toast from 'react-hot-toast';

interface VoiceControlProps {
  className?: string;
}

export default function VoiceControl({ className = '' }: VoiceControlProps) {
  const [isListening, setIsListening] = useState(false);
  const [isSupported, setIsSupported] = useState(false);
  const [transcript, setTranscript] = useState('');
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const {
    isPlaying,
    currentSong,
    volume,
    togglePlay,
    playNext,
    playPrevious,
    setVolume,
    setShuffle,
    setRepeat,
    shuffle,
    repeat
  } = usePlayerStore();

  // Initialize speech recognition
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      
      if (SpeechRecognition) {
        setIsSupported(true);
        const recognition = new SpeechRecognition();
        
        recognition.continuous = false;
        recognition.interimResults = false;
        recognition.lang = 'en-US';

        recognition.onstart = () => {
          setIsListening(true);
          setTranscript('Listening...');
        };

        recognition.onresult = (event) => {
          const result = event.results[0][0].transcript.toLowerCase();
          setTranscript(result);
          processVoiceCommand(result);
        };

        recognition.onerror = (event) => {
          console.error('Speech recognition error:', event.error);
          setIsListening(false);
          setTranscript('');
          toast.error('Voice recognition failed');
        };

        recognition.onend = () => {
          setIsListening(false);
          // Clear transcript after a delay
          timeoutRef.current = setTimeout(() => {
            setTranscript('');
          }, 3000);
        };

        recognitionRef.current = recognition;
      }
    }

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const processVoiceCommand = async (command: string) => {
    console.log('Processing voice command:', command);

    try {
      // Play/Pause commands
      if (command.includes('play') && !command.includes('playlist')) {
        if (!isPlaying) {
          togglePlay();
          toast.success('Playing music');
        }
      } else if (command.includes('pause') || command.includes('stop')) {
        if (isPlaying) {
          togglePlay();
          toast.success('Music paused');
        }
      }
      
      // Navigation commands
      else if (command.includes('next') || command.includes('skip')) {
        playNext();
        toast.success('Playing next song');
      } else if (command.includes('previous') || command.includes('back')) {
        playPrevious();
        toast.success('Playing previous song');
      }
      
      // Volume commands
      else if (command.includes('volume up') || command.includes('louder')) {
        const newVolume = Math.min(1, volume + 0.1);
        setVolume(newVolume);
        toast.success(`Volume: ${Math.round(newVolume * 100)}%`);
      } else if (command.includes('volume down') || command.includes('quieter')) {
        const newVolume = Math.max(0, volume - 0.1);
        setVolume(newVolume);
        toast.success(`Volume: ${Math.round(newVolume * 100)}%`);
      } else if (command.includes('mute')) {
        setVolume(0);
        toast.success('Muted');
      } else if (command.includes('unmute')) {
        setVolume(0.5);
        toast.success('Unmuted');
      }
      
      // Shuffle and repeat commands
      else if (command.includes('shuffle on') || command.includes('enable shuffle')) {
        setShuffle(true);
        toast.success('Shuffle enabled');
      } else if (command.includes('shuffle off') || command.includes('disable shuffle')) {
        setShuffle(false);
        toast.success('Shuffle disabled');
      } else if (command.includes('repeat on') || command.includes('enable repeat')) {
        setRepeat('all');
        toast.success('Repeat enabled');
      } else if (command.includes('repeat off') || command.includes('disable repeat')) {
        setRepeat('none');
        toast.success('Repeat disabled');
      } else if (command.includes('repeat one') || command.includes('repeat this song')) {
        setRepeat('one');
        toast.success('Repeat one enabled');
      }
      
      // Search commands
      else if (command.includes('play') && (command.includes('song') || command.includes('track'))) {
        // Extract song name from command
        const songQuery = command
          .replace(/play|song|track/g, '')
          .trim();
        
        if (songQuery) {
          await searchAndPlaySong(songQuery);
        }
      } else if (command.includes('search for') || command.includes('find')) {
        const searchQuery = command
          .replace(/search for|find/g, '')
          .trim();
        
        if (searchQuery) {
          await searchAndPlaySong(searchQuery);
        }
      }
      
      // Information commands
      else if (command.includes('what') && (command.includes('playing') || command.includes('song'))) {
        if (currentSong) {
          toast.success(`Now playing: ${currentSong.title} by ${currentSong.artist}`);
        } else {
          toast.success('No song is currently playing');
        }
      }
      
      // Unknown command
      else {
        toast.error('Command not recognized. Try "play", "pause", "next", "volume up", etc.');
      }
    } catch (error) {
      console.error('Error processing voice command:', error);
      toast.error('Failed to process voice command');
    }
  };

  const searchAndPlaySong = async (query: string) => {
    try {
      const response = await songsAPI.search(query, { limit: 1 });
      const songs = response.data.data;
      
      if (songs.length > 0) {
        // This would need to be implemented in the player store
        // For now, just show a success message
        toast.success(`Found: ${songs[0].title} by ${songs[0].artist}`);
      } else {
        toast.error(`No songs found for "${query}"`);
      }
    } catch (error) {
      toast.error('Failed to search for song');
    }
  };

  const startListening = () => {
    if (recognitionRef.current && !isListening) {
      try {
        recognitionRef.current.start();
      } catch (error) {
        console.error('Failed to start voice recognition:', error);
        toast.error('Failed to start voice recognition');
      }
    }
  };

  const stopListening = () => {
    if (recognitionRef.current && isListening) {
      recognitionRef.current.stop();
    }
  };

  if (!isSupported) {
    return null;
  }

  return (
    <div className={`relative ${className}`}>
      <button
        onClick={isListening ? stopListening : startListening}
        className={`p-2 rounded-lg transition-all duration-200 ${
          isListening
            ? 'bg-red-500 text-white animate-pulse'
            : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600'
        }`}
        title={isListening ? 'Stop listening' : 'Start voice control'}
      >
        {isListening ? (
          <FaMicrophone size={16} />
        ) : (
          <FaMicrophoneSlash size={16} />
        )}
      </button>

      {/* Transcript Display */}
      {transcript && (
        <div className="absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 bg-black text-white text-xs px-2 py-1 rounded whitespace-nowrap">
          {transcript}
        </div>
      )}

      {/* Voice Commands Help */}
      {isListening && (
        <div className="absolute top-full mt-2 left-1/2 transform -translate-x-1/2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-3 shadow-lg z-50 w-64">
          <h4 className="font-semibold text-sm mb-2 text-gray-900 dark:text-white">
            Voice Commands:
          </h4>
          <div className="text-xs text-gray-600 dark:text-gray-400 space-y-1">
            <p>• "Play" / "Pause"</p>
            <p>• "Next" / "Previous"</p>
            <p>• "Volume up" / "Volume down"</p>
            <p>• "Shuffle on/off"</p>
            <p>• "Repeat on/off"</p>
            <p>• "What's playing?"</p>
            <p>• "Play [song name]"</p>
          </div>
        </div>
      )}
    </div>
  );
}

// Extend Window interface for TypeScript
declare global {
  interface Window {
    SpeechRecognition: typeof SpeechRecognition;
    webkitSpeechRecognition: typeof SpeechRecognition;
  }
}