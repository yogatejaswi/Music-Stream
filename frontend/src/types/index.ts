// User types
export interface User {
  _id: string;
  id: string;
  email: string;
  name: string;
  role: 'user' | 'admin';
  subscription: {
    plan: 'free' | 'premium';
    startDate?: Date;
    endDate?: Date;
    stripeCustomerId?: string;
  };
  likedSongs: string[];
  playlists: string[];
  recentlyPlayed: RecentlyPlayed[];
  preferences: {
    favoriteGenres: string[];
  };
  createdAt: Date;
  updatedAt: Date;
}

// Song types
export interface Song {
  _id: string;
  title: string;
  artist: string;
  album?: Album;
  duration: number;
  audioUrl: string;
  coverImage: string;
  genre: string[];
  releaseDate?: Date;
  playCount: number;
  likes: number;
  isPremium: boolean;
  uploadedBy: string;
  createdAt: Date;
  updatedAt: Date;
}

// Playlist types
export interface Playlist {
  _id: string;
  name: string;
  description?: string;
  owner: User | string;
  songs: Song[];
  coverImage?: string;
  isPublic: boolean;
  followers: string[];
  createdAt: Date;
  updatedAt: Date;
}

// Album types
export interface Album {
  _id: string;
  title: string;
  artist: string;
  coverImage?: string;
  releaseDate?: Date;
  songs: string[];
  genre: string[];
  createdAt: Date;
  updatedAt: Date;
}

// Subscription types
export interface Subscription {
  _id: string;
  user: string;
  plan: 'free' | 'premium';
  status: 'active' | 'cancelled' | 'expired';
  stripeSubscriptionId?: string;
  currentPeriodStart?: Date;
  currentPeriodEnd?: Date;
  cancelAtPeriodEnd: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// Recently played
export interface RecentlyPlayed {
  song: Song | string;
  playedAt: Date;
}

// API Response types
export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
  error?: string;
}

export interface PaginatedResponse<T = any> {
  success: boolean;
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

// Player types
export interface PlayerSong {
  id: string;
  title: string;
  artist: string;
  audioUrl: string;
  coverImage: string;
  duration: number;
}

// Analytics types
export interface Analytics {
  totalUsers: number;
  totalSongs: number;
  totalPlays: number;
  premiumUsers: number;
  freeUsers: number;
  topSongs: Song[];
}
