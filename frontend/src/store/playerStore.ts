import { create } from 'zustand';
import { createRef } from 'react';

interface Song {
  _id?: string;
  id: string;
  title: string;
  artist: string;
  audioUrl: string;
  coverImage: string;
  duration: number;
}

type RepeatMode = 'off' | 'one' | 'all';

interface PlayerState {
  currentSong: Song | null;
  isPlaying: boolean;
  volume: number;
  currentTime: number;
  duration: number;
  queue: Song[];
  shuffle: boolean;
  repeat: RepeatMode;
  audioRef: React.RefObject<HTMLAudioElement>;
  
  // Actions
  setCurrentSong: (song: Song | null) => void;
  setQueue: (songs: Song[], startIndex?: number) => void;
  togglePlay: () => void;
  setVolume: (volume: number) => void;
  setCurrentTime: (time: number) => void;
  setDuration: (duration: number) => void;
  playNext: () => void;
  playPrevious: () => void;
  toggleShuffle: () => void;
  setShuffle: (shuffle: boolean) => void;
  toggleRepeat: () => void;
  setRepeat: (repeat: RepeatMode) => void;
  addToQueue: (song: Song) => void;
  clearQueue: () => void;
  nextSong: () => void;
  previousSong: () => void;
}

export const usePlayerStore = create<PlayerState>((set, get) => ({
  currentSong: null,
  isPlaying: false,
  volume: 0.7,
  currentTime: 0,
  duration: 0,
  queue: [],
  shuffle: false,
  repeat: 'off',
  audioRef: createRef<HTMLAudioElement>(),

  setCurrentSong: (song: Song | null) => set({ currentSong: song, isPlaying: !!song }),
  
  setQueue: (songs: Song[], startIndex = 0) => set({ 
    queue: songs, 
    currentSong: songs[startIndex] || null,
    isPlaying: true 
  }),
  
  togglePlay: () => set((state) => ({ isPlaying: !state.isPlaying })),
  
  setVolume: (volume: number) => set({ volume }),
  
  setCurrentTime: (time: number) => set({ currentTime: time }),
  
  setDuration: (duration: number) => set({ duration }),
  
  playNext: () => {
    const { queue, currentSong, shuffle, repeat } = get();
    
    console.log('playNext called', { queueLength: queue.length, currentSong: currentSong?.title });
    
    if (queue.length === 0) {
      console.log('No queue available');
      return;
    }
    
    const currentIndex = queue.findIndex(s => s.id === currentSong?.id);
    console.log('Current index:', currentIndex);
    
    let nextIndex = currentIndex + 1;
    
    if (shuffle) {
      nextIndex = Math.floor(Math.random() * queue.length);
    }
    
    if (nextIndex >= queue.length) {
      if (repeat === 'all') {
        nextIndex = 0;
      } else {
        console.log('End of queue reached');
        return;
      }
    }
    
    console.log('Next index:', nextIndex, 'Next song:', queue[nextIndex]?.title);
    set({ currentSong: queue[nextIndex], isPlaying: true, currentTime: 0 });
  },
  
  playPrevious: () => {
    const { queue, currentSong } = get();
    
    console.log('playPrevious called', { queueLength: queue.length, currentSong: currentSong?.title });
    
    if (queue.length === 0) {
      console.log('No queue available');
      return;
    }
    
    const currentIndex = queue.findIndex(s => s.id === currentSong?.id);
    console.log('Current index:', currentIndex);
    
    const prevIndex = currentIndex - 1 < 0 ? queue.length - 1 : currentIndex - 1;
    
    console.log('Previous index:', prevIndex, 'Previous song:', queue[prevIndex]?.title);
    set({ currentSong: queue[prevIndex], isPlaying: true, currentTime: 0 });
  },
  
  toggleShuffle: () => set((state) => ({ shuffle: !state.shuffle })),
  setShuffle: (shuffle: boolean) => set({ shuffle }),
  
  toggleRepeat: () => set((state) => {
    const modes: RepeatMode[] = ['off', 'all', 'one'];
    const currentIndex = modes.indexOf(state.repeat);
    const nextIndex = (currentIndex + 1) % modes.length;
    return { repeat: modes[nextIndex] };
  }),
  setRepeat: (repeat: RepeatMode) => set({ repeat }),
  
  addToQueue: (song: Song) => set((state) => ({ queue: [...state.queue, song] })),
  
  clearQueue: () => set({ queue: [] }),

  nextSong: () => get().playNext(),
  previousSong: () => get().playPrevious(),
}));
