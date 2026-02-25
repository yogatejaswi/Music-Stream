import { create } from 'zustand';

interface Song {
  id: string;
  title: string;
  artist: string;
  audioUrl: string;
  coverImage: string;
  duration: number;
}

interface QueueState {
  queue: Song[];
  history: Song[];
  currentIndex: number;
  isQueueVisible: boolean;
  
  // Actions
  setQueue: (songs: Song[], startIndex?: number) => void;
  addToQueue: (song: Song) => void;
  addNext: (song: Song) => void;
  removeFromQueue: (index: number) => void;
  clearQueue: () => void;
  reorderQueue: (startIndex: number, endIndex: number) => void;
  toggleQueueVisibility: () => void;
  setCurrentIndex: (index: number) => void;
}

export const useQueueStore = create<QueueState>((set, get) => ({
  queue: [],
  history: [],
  currentIndex: 0,
  isQueueVisible: false,

  setQueue: (songs, startIndex = 0) => set({
    queue: songs,
    currentIndex: startIndex
  }),

  addToQueue: (song) => set((state) => ({
    queue: [...state.queue, song]
  })),

  addNext: (song) => set((state) => {
    const newQueue = [...state.queue];
    newQueue.splice(state.currentIndex + 1, 0, song);
    return { queue: newQueue };
  }),

  removeFromQueue: (index) => set((state) => {
    const newQueue = state.queue.filter((_, i) => i !== index);
    let newIndex = state.currentIndex;
    
    if (index < state.currentIndex) {
      newIndex = state.currentIndex - 1;
    } else if (index === state.currentIndex && index >= newQueue.length) {
      newIndex = newQueue.length - 1;
    }
    
    return {
      queue: newQueue,
      currentIndex: Math.max(0, newIndex)
    };
  }),

  clearQueue: () => set({
    queue: [],
    currentIndex: 0
  }),

  reorderQueue: (startIndex, endIndex) => set((state) => {
    const newQueue = [...state.queue];
    const [removed] = newQueue.splice(startIndex, 1);
    newQueue.splice(endIndex, 0, removed);
    
    let newIndex = state.currentIndex;
    if (startIndex === state.currentIndex) {
      newIndex = endIndex;
    } else if (startIndex < state.currentIndex && endIndex >= state.currentIndex) {
      newIndex = state.currentIndex - 1;
    } else if (startIndex > state.currentIndex && endIndex <= state.currentIndex) {
      newIndex = state.currentIndex + 1;
    }
    
    return {
      queue: newQueue,
      currentIndex: newIndex
    };
  }),

  toggleQueueVisibility: () => set((state) => ({
    isQueueVisible: !state.isQueueVisible
  })),

  setCurrentIndex: (index) => set({ currentIndex: index }),
}));
