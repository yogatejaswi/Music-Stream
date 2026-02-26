import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface OfflineSong {
  _id: string;
  title: string;
  artist: string;
  coverImage: string;
  duration: number;
  audioUrl: string;
  downloadedAt: Date;
  size: number; // in bytes
}

interface OfflineStore {
  // State
  downloadedSongs: OfflineSong[];
  downloadQueue: string[]; // song IDs
  isDownloading: boolean;
  downloadProgress: { [songId: string]: number };
  isOfflineMode: boolean;
  totalStorageUsed: number;
  maxStorageLimit: number; // in bytes (default 1GB)

  // Actions
  downloadSong: (song: any) => Promise<void>;
  removeSong: (songId: string) => void;
  clearAllDownloads: () => void;
  toggleOfflineMode: () => void;
  getDownloadedSong: (songId: string) => OfflineSong | null;
  isDownloaded: (songId: string) => boolean;
  getStorageInfo: () => { used: number; available: number; percentage: number };
  setMaxStorageLimit: (limit: number) => void;
}

export const useOfflineStore = create<OfflineStore>()(
  persist(
    (set, get) => ({
      // Initial state
      downloadedSongs: [],
      downloadQueue: [],
      isDownloading: false,
      downloadProgress: {},
      isOfflineMode: false,
      totalStorageUsed: 0,
      maxStorageLimit: 1024 * 1024 * 1024, // 1GB

      // Download a song for offline use
      downloadSong: async (song: any) => {
        const { downloadedSongs, downloadQueue, maxStorageLimit, totalStorageUsed } = get();
        
        // Check if already downloaded
        if (downloadedSongs.some(s => s._id === song._id)) {
          return;
        }

        // Check if already in queue
        if (downloadQueue.includes(song._id)) {
          return;
        }

        // Add to queue
        set(state => ({
          downloadQueue: [...state.downloadQueue, song._id]
        }));

        try {
          set(state => ({
            isDownloading: true,
            downloadProgress: { ...state.downloadProgress, [song._id]: 0 }
          }));

          // Simulate download with progress
          // In a real app, you'd fetch the actual audio file
          const response = await fetch(song.audioUrl);
          
          if (!response.ok) {
            throw new Error('Failed to download song');
          }

          const contentLength = response.headers.get('content-length');
          const total = contentLength ? parseInt(contentLength, 10) : 0;

          // Check storage limit
          if (totalStorageUsed + total > maxStorageLimit) {
            throw new Error('Storage limit exceeded');
          }

          const reader = response.body?.getReader();
          const chunks: Uint8Array[] = [];
          let receivedLength = 0;

          if (reader) {
            while (true) {
              const { done, value } = await reader.read();
              
              if (done) break;
              
              chunks.push(value);
              receivedLength += value.length;

              // Update progress
              const progress = total > 0 ? (receivedLength / total) * 100 : 0;
              set(state => ({
                downloadProgress: { ...state.downloadProgress, [song._id]: progress }
              }));
            }
          }

          // Convert chunks to blob
          const audioBlob = new Blob(chunks, { type: 'audio/mpeg' });
          const audioUrl = URL.createObjectURL(audioBlob);

          // Create offline song object
          const offlineSong: OfflineSong = {
            _id: song._id,
            title: song.title,
            artist: song.artist,
            coverImage: song.coverImage,
            duration: song.duration,
            audioUrl: audioUrl,
            downloadedAt: new Date(),
            size: receivedLength
          };

          // Add to downloaded songs
          set(state => ({
            downloadedSongs: [...state.downloadedSongs, offlineSong],
            downloadQueue: state.downloadQueue.filter(id => id !== song._id),
            totalStorageUsed: state.totalStorageUsed + receivedLength,
            downloadProgress: { ...state.downloadProgress, [song._id]: 100 }
          }));

          // Clean up progress after a delay
          setTimeout(() => {
            set(state => {
              const newProgress = { ...state.downloadProgress };
              delete newProgress[song._id];
              return { downloadProgress: newProgress };
            });
          }, 2000);

        } catch (error) {
          console.error('Download failed:', error);
          
          // Remove from queue on error
          set(state => ({
            downloadQueue: state.downloadQueue.filter(id => id !== song._id)
          }));

          // Clean up progress
          set(state => {
            const newProgress = { ...state.downloadProgress };
            delete newProgress[song._id];
            return { downloadProgress: newProgress };
          });

          throw error;
        } finally {
          // Check if any downloads are still in progress
          const { downloadQueue } = get();
          if (downloadQueue.length === 0) {
            set({ isDownloading: false });
          }
        }
      },

      // Remove a downloaded song
      removeSong: (songId: string) => {
        set(state => {
          const song = state.downloadedSongs.find(s => s._id === songId);
          if (song) {
            // Revoke the blob URL to free memory
            URL.revokeObjectURL(song.audioUrl);
          }

          return {
            downloadedSongs: state.downloadedSongs.filter(s => s._id !== songId),
            totalStorageUsed: state.totalStorageUsed - (song?.size || 0)
          };
        });
      },

      // Clear all downloads
      clearAllDownloads: () => {
        const { downloadedSongs } = get();
        
        // Revoke all blob URLs
        downloadedSongs.forEach(song => {
          URL.revokeObjectURL(song.audioUrl);
        });

        set({
          downloadedSongs: [],
          totalStorageUsed: 0,
          downloadProgress: {}
        });
      },

      // Toggle offline mode
      toggleOfflineMode: () => {
        set(state => ({ isOfflineMode: !state.isOfflineMode }));
      },

      // Get a downloaded song
      getDownloadedSong: (songId: string) => {
        const { downloadedSongs } = get();
        return downloadedSongs.find(song => song._id === songId) || null;
      },

      // Check if a song is downloaded
      isDownloaded: (songId: string) => {
        const { downloadedSongs } = get();
        return downloadedSongs.some(song => song._id === songId);
      },

      // Get storage information
      getStorageInfo: () => {
        const { totalStorageUsed, maxStorageLimit } = get();
        return {
          used: totalStorageUsed,
          available: maxStorageLimit - totalStorageUsed,
          percentage: (totalStorageUsed / maxStorageLimit) * 100
        };
      },

      // Set maximum storage limit
      setMaxStorageLimit: (limit: number) => {
        set({ maxStorageLimit: limit });
      }
    }),
    {
      name: 'offline-store',
      // Don't persist blob URLs as they become invalid after page reload
      partialize: (state) => ({
        downloadedSongs: state.downloadedSongs.map(song => ({
          ...song,
          audioUrl: '' // Will need to be re-downloaded
        })),
        isOfflineMode: state.isOfflineMode,
        totalStorageUsed: state.totalStorageUsed,
        maxStorageLimit: state.maxStorageLimit
      })
    }
  )
);