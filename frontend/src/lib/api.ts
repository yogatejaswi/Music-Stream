import axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  async (error: AxiosError) => {
    const originalRequest = error.config as AxiosRequestConfig & { _retry?: boolean };

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        await api.post('/auth/refresh');
        return api(originalRequest);
      } catch (refreshError) {
        if (typeof window !== 'undefined') {
          window.location.href = '/login';
        }
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  register: (data: { email: string; password: string; name: string }) =>
    api.post('/auth/register', data),
  
  verifyOTP: (data: { userId: string; otp: string }) =>
    api.post('/auth/verify-otp', data),
  
  resendOTP: (data: { userId: string }) =>
    api.post('/auth/resend-otp', data),
  
  login: (data: { email: string }) =>
    api.post('/auth/login', data),
  
  verifyLoginOTP: (data: { userId: string; otp: string }) =>
    api.post('/auth/verify-login-otp', data),
  
  logout: () => api.post('/auth/logout'),
  
  getMe: () => api.get('/auth/me'),
};

// Songs API
export const songsAPI = {
  getAll: (params?: any) => api.get('/songs', { params }),
  
  getById: (id: string) => api.get(`/songs/${id}`),
  
  play: (id: string) => api.post(`/songs/${id}/play`),
  
  like: (id: string) => api.post(`/songs/${id}/like`),
};

// Playlists API
export const playlistsAPI = {
  getAll: () => api.get('/playlists'),
  
  create: (data: { name: string; description?: string }) =>
    api.post('/playlists', data),
  
  getById: (id: string) => api.get(`/playlists/${id}`),
  
  update: (id: string, data: any) => api.put(`/playlists/${id}`, data),
  
  delete: (id: string) => api.delete(`/playlists/${id}`),
  
  addSong: (id: string, songId: string) =>
    api.post(`/playlists/${id}/songs`, { songId }),
  
  removeSong: (id: string, songId: string) =>
    api.delete(`/playlists/${id}/songs/${songId}`),
};

// User API
export const userAPI = {
  getProfile: () => api.get('/user/profile'),
  
  updateProfile: (data: any) => api.put('/user/profile', data),
  
  getLikedSongs: () => api.get('/user/liked-songs'),
  
  getRecentlyPlayed: () => api.get('/user/recently-played'),
  
  getRecommendations: () => api.get('/user/recommendations'),
  
  search: (query: string) => api.get('/user/search', { params: { q: query } }),
};

// Subscription API
export const subscriptionAPI = {
  createCheckout: () => api.post('/subscription/checkout'),
  
  getStatus: () => api.get('/subscription/status'),
  
  cancel: () => api.post('/subscription/cancel'),
};

// Admin API
export const adminAPI = {
  uploadSong: (formData: FormData) => 
    api.post('/admin/songs', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }),
  
  updateSong: (id: string, data: any) => api.put(`/admin/songs/${id}`, data),
  
  deleteSong: (id: string) => api.delete(`/admin/songs/${id}`),
  
  createAlbum: (data: any) => api.post('/admin/albums', data),
  
  getAllUsers: (params?: any) => api.get('/admin/users', { params }),
  
  getAnalytics: () => api.get('/admin/analytics'),
};

// History API
export const historyAPI = {
  track: (data: { songId: string; duration: number; completed: boolean }) =>
    api.post('/history/track', data),
  
  getHistory: (params?: any) => api.get('/history', { params }),
  
  getRecent: (params?: any) => api.get('/history/recent', { params }),
  
  getStats: () => api.get('/history/stats'),
  
  clear: () => api.delete('/history'),
};

// Artists API
export const artistsAPI = {
  getAll: (params?: any) => api.get('/artists', { params }),
  
  getById: (id: string) => api.get(`/artists/${id}`),
  
  getTop: (params?: any) => api.get('/artists/top', { params }),
  
  follow: (id: string) => api.post(`/artists/${id}/follow`),
};

// Albums API
export const albumsAPI = {
  getAll: (params?: any) => api.get('/albums', { params }),
  
  getById: (id: string) => api.get(`/albums/${id}`),
};

// Comments API
export const commentsAPI = {
  getSongComments: (songId: string, params?: any) =>
    api.get(`/comments/song/${songId}`, { params }),
  
  create: (data: { songId: string; text: string }) =>
    api.post('/comments', data),
  
  update: (id: string, text: string) =>
    api.put(`/comments/${id}`, { text }),
  
  delete: (id: string) => api.delete(`/comments/${id}`),
  
  like: (id: string) => api.post(`/comments/${id}/like`),
};

// Social API
export const socialAPI = {
  followUser: (userId: string) => api.post(`/social/follow/${userId}`),
  
  getFollowers: (userId: string) => api.get(`/social/followers/${userId}`),
  
  getFollowing: (userId: string) => api.get(`/social/following/${userId}`),
  
  getFeed: () => api.get('/social/feed'),
  
  getProfile: (userId: string) => api.get(`/social/profile/${userId}`),
  
  updateProfile: (data: any) => api.put('/social/profile', data),
  
  searchUsers: (query: string, params?: any) =>
    api.get('/social/search', { params: { q: query, ...params } }),
};

// Analytics API
export const analyticsAPI = {
  getDashboard: () => api.get('/analytics/dashboard'),
  
  getCharts: (period?: string) =>
    api.get('/analytics/charts', { params: { period } }),
  
  getGenres: () => api.get('/analytics/genres'),
  
  getUserAnalytics: () => api.get('/analytics/users'),
  
  getSongAnalytics: (songId: string) =>
    api.get(`/analytics/songs/${songId}`),
};

// Enhanced Songs API
export const searchAPI = {
  advanced: (params: any) => api.get('/songs/search/advanced', { params }),
  
  byMood: (mood: string, params?: any) =>
    api.get(`/songs/mood/${mood}`, { params }),
  
  byGenre: (genre: string, params?: any) =>
    api.get(`/songs/genre/${genre}`, { params }),
};

// Lyrics API
export const lyricsAPI = {
  getSongLyrics: (songId: string) => api.get(`/lyrics/song/${songId}`),
  
  searchLyrics: (query: string, language?: string) =>
    api.get('/lyrics/search', { params: { q: query, language } }),
  
  addLyrics: (data: {
    songId: string;
    lyrics: string;
    syncedLyrics?: Array<{ time: number; text: string }>;
    language?: string;
    source?: string;
  }) => api.post('/lyrics', data),
  
  updateLyrics: (id: string, data: any) => api.put(`/lyrics/${id}`, data),
  
  deleteLyrics: (id: string) => api.delete(`/lyrics/${id}`),
  
  getAllLyrics: (params?: any) => api.get('/lyrics', { params }),
  
  fetchLyrics: (songId: string) => api.post(`/lyrics/fetch/${songId}`),
};
