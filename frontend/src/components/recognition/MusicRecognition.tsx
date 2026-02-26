'use client';

import { useState, useRef, useEffect } from 'react';
import { FaMicrophone, FaStop, FaMusic, FaSpinner } from 'react-icons/fa';
import toast from 'react-hot-toast';

interface RecognitionResult {
  title: string;
  artist: string;
  album?: string;
  coverImage?: string;
  confidence: number;
  duration?: number;
  genre?: string;
  releaseYear?: number;
  spotifyUrl?: string;
  youtubeUrl?: string;
}

interface MusicRecognitionProps {
  onSongFound?: (song: RecognitionResult) => void;
  className?: string;
}

export default function MusicRecognition({ onSongFound, className = '' }: MusicRecognitionProps) {
  const [isListening, setIsListening] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [result, setResult] = useState<RecognitionResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [audioLevel, setAudioLevel] = useState(0);
  const [timeRemaining, setTimeRemaining] = useState(0);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const animationRef = useRef<number | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const RECORDING_DURATION = 10; // seconds

  useEffect(() => {
    return () => {
      cleanup();
    };
  }, []);

  const cleanup = () => {
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
    }
    if (audioContextRef.current) {
      audioContextRef.current.close();
    }
  };

  const startListening = async () => {
    try {
      setError(null);
      setResult(null);
      setIsListening(true);
      setTimeRemaining(RECORDING_DURATION);

      // Get microphone access
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          sampleRate: 44100
        } 
      });
      streamRef.current = stream;

      // Setup audio analysis for visual feedback
      const audioContext = new AudioContext();
      const analyser = audioContext.createAnalyser();
      const source = audioContext.createMediaStreamSource(stream);
      
      analyser.fftSize = 256;
      source.connect(analyser);
      
      audioContextRef.current = audioContext;
      analyserRef.current = analyser;

      // Start visual feedback
      updateAudioLevel();

      // Setup media recorder
      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: 'audio/webm;codecs=opus'
      });
      mediaRecorderRef.current = mediaRecorder;

      const audioChunks: Blob[] = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunks.push(event.data);
        }
      };

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunks, { type: 'audio/webm' });
        await processAudio(audioBlob);
      };

      // Start recording
      mediaRecorder.start();

      // Start countdown timer
      let remaining = RECORDING_DURATION;
      timerRef.current = setInterval(() => {
        remaining -= 1;
        setTimeRemaining(remaining);
        
        if (remaining <= 0) {
          stopListening();
        }
      }, 1000);

      toast.success('Listening to music... Keep the device close to the audio source');
    } catch (error) {
      console.error('Failed to start listening:', error);
      setError('Failed to access microphone. Please check permissions.');
      setIsListening(false);
      toast.error('Failed to access microphone');
    }
  };

  const stopListening = () => {
    setIsListening(false);
    setIsProcessing(true);
    
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
      mediaRecorderRef.current.stop();
    }
    
    cleanup();
  };

  const updateAudioLevel = () => {
    if (!analyserRef.current) return;

    const dataArray = new Uint8Array(analyserRef.current.frequencyBinCount);
    analyserRef.current.getByteFrequencyData(dataArray);
    
    // Calculate average volume
    const average = dataArray.reduce((sum, value) => sum + value, 0) / dataArray.length;
    setAudioLevel(average / 255);

    if (isListening) {
      animationRef.current = requestAnimationFrame(updateAudioLevel);
    }
  };

  const processAudio = async (audioBlob: Blob) => {
    try {
      // Simulate music recognition API call
      // In a real app, you'd send the audio to a service like ACRCloud, Shazam API, or AudD
      
      // Mock processing delay
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Mock recognition result
      const mockResults: RecognitionResult[] = [
        {
          title: "Blinding Lights",
          artist: "The Weeknd",
          album: "After Hours",
          coverImage: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=300&h=300&fit=crop",
          confidence: 0.95,
          duration: 200,
          genre: "Pop",
          releaseYear: 2019,
          spotifyUrl: "https://open.spotify.com/track/example",
          youtubeUrl: "https://youtube.com/watch?v=example"
        },
        {
          title: "Shape of You",
          artist: "Ed Sheeran",
          album: "÷ (Divide)",
          coverImage: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=300&h=300&fit=crop",
          confidence: 0.88,
          duration: 233,
          genre: "Pop",
          releaseYear: 2017
        },
        {
          title: "Bohemian Rhapsody",
          artist: "Queen",
          album: "A Night at the Opera",
          coverImage: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=300&h=300&fit=crop",
          confidence: 0.92,
          duration: 355,
          genre: "Rock",
          releaseYear: 1975
        }
      ];

      // Randomly select a result for demo
      const randomResult = mockResults[Math.floor(Math.random() * mockResults.length)];
      
      setResult(randomResult);
      setIsProcessing(false);
      
      if (onSongFound) {
        onSongFound(randomResult);
      }
      
      toast.success(`Found: ${randomResult.title} by ${randomResult.artist}`);
    } catch (error) {
      console.error('Failed to process audio:', error);
      setError('Failed to recognize the song. Please try again.');
      setIsProcessing(false);
      toast.error('Failed to recognize the song');
    }
  };

  const formatDuration = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className={`bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700 ${className}`}>
      {/* Header */}
      <div className="text-center mb-6">
        <div className="flex items-center justify-center space-x-2 mb-2">
          <FaMusic className="text-primary-500" size={24} />
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
            Music Recognition
          </h3>
        </div>
        <p className="text-gray-600 dark:text-gray-400 text-sm">
          Identify any song playing around you
        </p>
      </div>

      {/* Recognition Button */}
      <div className="text-center mb-6">
        {!isListening && !isProcessing ? (
          <button
            onClick={startListening}
            className="relative bg-primary-500 hover:bg-primary-600 text-white p-8 rounded-full transition-all duration-200 transform hover:scale-105 shadow-lg"
          >
            <FaMicrophone size={32} />
          </button>
        ) : isListening ? (
          <div className="relative">
            <button
              onClick={stopListening}
              className="relative bg-red-500 hover:bg-red-600 text-white p-8 rounded-full transition-all duration-200 shadow-lg"
              style={{
                transform: `scale(${1 + audioLevel * 0.2})`,
                boxShadow: `0 0 ${audioLevel * 30}px rgba(239, 68, 68, 0.5)`
              }}
            >
              <FaStop size={32} />
            </button>
            
            {/* Audio Level Rings */}
            <div 
              className="absolute inset-0 border-2 border-red-400 rounded-full animate-ping"
              style={{ opacity: audioLevel }}
            />
            <div 
              className="absolute inset-0 border border-red-300 rounded-full animate-pulse"
              style={{ 
                opacity: audioLevel * 0.7,
                transform: `scale(${1.2 + audioLevel * 0.3})`
              }}
            />
            
            {/* Timer */}
            <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2">
              <span className="text-sm font-mono text-gray-600 dark:text-gray-400">
                {timeRemaining}s
              </span>
            </div>
          </div>
        ) : (
          <div className="bg-gray-100 dark:bg-gray-700 p-8 rounded-full">
            <FaSpinner className="animate-spin text-primary-500" size={32} />
          </div>
        )}
      </div>

      {/* Status */}
      <div className="text-center mb-4">
        {isListening && (
          <p className="text-primary-600 dark:text-primary-400 font-medium">
            🎵 Listening... Keep device close to audio source
          </p>
        )}
        {isProcessing && (
          <p className="text-blue-600 dark:text-blue-400 font-medium">
            🔍 Analyzing audio...
          </p>
        )}
        {error && (
          <p className="text-red-600 dark:text-red-400 font-medium">
            ❌ {error}
          </p>
        )}
      </div>

      {/* Result */}
      {result && (
        <div className="bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20 rounded-lg p-4 border border-green-200 dark:border-green-800">
          <div className="flex items-center space-x-4">
            {result.coverImage && (
              <img
                src={result.coverImage}
                alt={result.title}
                className="w-16 h-16 rounded-lg object-cover"
              />
            )}
            <div className="flex-1 min-w-0">
              <h4 className="font-semibold text-gray-900 dark:text-white truncate">
                {result.title}
              </h4>
              <p className="text-gray-600 dark:text-gray-400 truncate">
                by {result.artist}
              </p>
              {result.album && (
                <p className="text-sm text-gray-500 dark:text-gray-500 truncate">
                  from {result.album}
                </p>
              )}
              <div className="flex items-center space-x-4 mt-2 text-xs text-gray-500 dark:text-gray-500">
                <span>Confidence: {Math.round(result.confidence * 100)}%</span>
                {result.duration && <span>{formatDuration(result.duration)}</span>}
                {result.genre && <span>{result.genre}</span>}
                {result.releaseYear && <span>{result.releaseYear}</span>}
              </div>
            </div>
          </div>
          
          {/* Action Buttons */}
          <div className="flex space-x-2 mt-4">
            <button className="flex-1 bg-primary-500 text-white py-2 px-4 rounded-lg hover:bg-primary-600 transition-colors text-sm font-medium">
              Play on Music Stream
            </button>
            {result.spotifyUrl && (
              <button className="bg-green-500 text-white py-2 px-4 rounded-lg hover:bg-green-600 transition-colors text-sm font-medium">
                Spotify
              </button>
            )}
            {result.youtubeUrl && (
              <button className="bg-red-500 text-white py-2 px-4 rounded-lg hover:bg-red-600 transition-colors text-sm font-medium">
                YouTube
              </button>
            )}
          </div>
        </div>
      )}

      {/* Instructions */}
      {!result && !isListening && !isProcessing && (
        <div className="text-center text-sm text-gray-500 dark:text-gray-500">
          <p className="mb-2">🎵 Tap the microphone to identify music</p>
          <p>Works best in quiet environments with clear audio</p>
        </div>
      )}
    </div>
  );
}