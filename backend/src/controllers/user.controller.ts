import { Response } from 'express';
import User from '../models/User';
import Song from '../models/Song';
import { asyncHandler, AppError } from '../middleware/error.middleware';
import { AuthRequest } from '../middleware/auth.middleware';

// @desc    Get user profile
// @route   GET /api/user/profile
// @access  Private
export const getUserProfile = asyncHandler(async (req: AuthRequest, res: Response) => {
  const user = await User.findById(req.user!._id)
    .select('-password')
    .populate('likedSongs')
    .populate('playlists');

  res.status(200).json({
    success: true,
    data: user
  });
});

// @desc    Update user profile
// @route   PUT /api/user/profile
// @access  Private
export const updateUserProfile = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { name, email, favoriteGenres } = req.body;

  const user = await User.findById(req.user!._id);

  if (!user) {
    throw new AppError('User not found', 404);
  }

  // Check if email is being changed and if it's already taken
  if (email && email !== user.email) {
    const emailExists = await User.findOne({ email });
    if (emailExists) {
      throw new AppError('Email already in use', 400);
    }
    user.email = email;
  }

  if (name) user.name = name;
  if (favoriteGenres) user.preferences.favoriteGenres = favoriteGenres;

  await user.save();

  res.status(200).json({
    success: true,
    message: 'Profile updated successfully',
    data: {
      id: user._id,
      email: user.email,
      name: user.name,
      preferences: user.preferences
    }
  });
});

// @desc    Get liked songs
// @route   GET /api/user/liked-songs
// @access  Private
export const getLikedSongs = asyncHandler(async (req: AuthRequest, res: Response) => {
  const user = await User.findById(req.user!._id).populate({
    path: 'likedSongs',
    populate: { path: 'album', select: 'title coverImage' }
  });

  res.status(200).json({
    success: true,
    data: user!.likedSongs
  });
});

// @desc    Get recently played songs
// @route   GET /api/user/recently-played
// @access  Private
export const getRecentlyPlayed = asyncHandler(async (req: AuthRequest, res: Response) => {
  const limit = parseInt(req.query.limit as string) || 20;

  const user = await User.findById(req.user!._id)
    .populate({
      path: 'recentlyPlayed.song',
      populate: { path: 'album', select: 'title coverImage' }
    })
    .select('recentlyPlayed');

  const recentlyPlayed = user!.recentlyPlayed.slice(0, limit);

  res.status(200).json({
    success: true,
    data: recentlyPlayed
  });
});

// @desc    Get personalized recommendations
// @route   GET /api/user/recommendations
// @access  Private
export const getRecommendations = asyncHandler(async (req: AuthRequest, res: Response) => {
  const limit = parseInt(req.query.limit as string) || 20;

  const user = await User.findById(req.user!._id)
    .populate('likedSongs')
    .populate('recentlyPlayed.song');

  if (!user) {
    throw new AppError('User not found', 404);
  }

  // Get genres from liked songs and recently played
  const likedGenres = new Set<string>();
  const likedArtists = new Set<string>();

  user.likedSongs.forEach((song: any) => {
    song.genre?.forEach((g: string) => likedGenres.add(g));
    likedArtists.add(song.artist);
  });

  user.recentlyPlayed.slice(0, 10).forEach((item: any) => {
    item.song?.genre?.forEach((g: string) => likedGenres.add(g));
    likedArtists.add(item.song?.artist);
  });

  // Build recommendation query
  const query: any = {
    _id: { $nin: user.likedSongs } // Exclude already liked songs
  };

  if (likedGenres.size > 0 || likedArtists.size > 0) {
    query.$or = [];
    
    if (likedGenres.size > 0) {
      query.$or.push({ genre: { $in: Array.from(likedGenres) } });
    }
    
    if (likedArtists.size > 0) {
      query.$or.push({ artist: { $in: Array.from(likedArtists) } });
    }
  }

  // Get recommended songs
  const recommendations = await Song.find(query)
    .sort('-playCount -likes')
    .limit(limit)
    .populate('album', 'title coverImage');

  res.status(200).json({
    success: true,
    data: recommendations
  });
});

// @desc    Search songs, artists, albums
// @route   GET /api/user/search
// @access  Private
export const searchContent = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { q } = req.query;

  if (!q || typeof q !== 'string') {
    throw new AppError('Search query is required', 400);
  }

  const songs = await Song.find({
    $or: [
      { title: { $regex: q, $options: 'i' } },
      { artist: { $regex: q, $options: 'i' } }
    ]
  })
    .limit(20)
    .populate('album', 'title coverImage');

  res.status(200).json({
    success: true,
    data: {
      songs
    }
  });
});
