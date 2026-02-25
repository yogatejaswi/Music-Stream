import { Response } from 'express';
import Song from '../models/Song';
import User from '../models/User';
import { asyncHandler, AppError } from '../middleware/error.middleware';
import { AuthRequest } from '../middleware/auth.middleware';

// @desc    Get all songs with pagination and filters
// @route   GET /api/songs
// @access  Public
export const getAllSongs = asyncHandler(async (req: AuthRequest, res: Response) => {
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 20;
  const genre = req.query.genre as string;
  const search = req.query.search as string;
  const sort = req.query.sort as string || '-createdAt';

  const query: any = {};

  // Filter by genre
  if (genre) {
    query.genre = genre;
  }

  // Search by title or artist
  if (search) {
    query.$or = [
      { title: { $regex: search, $options: 'i' } },
      { artist: { $regex: search, $options: 'i' } }
    ];
  }

  const skip = (page - 1) * limit;

  const [songs, total] = await Promise.all([
    Song.find(query)
      .sort(sort)
      .skip(skip)
      .limit(limit)
      .populate('album', 'title coverImage'),
    Song.countDocuments(query)
  ]);

  res.status(200).json({
    success: true,
    data: songs,
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit)
    }
  });
});

// @desc    Get song by ID
// @route   GET /api/songs/:id
// @access  Public
export const getSongById = asyncHandler(async (req: AuthRequest, res: Response) => {
  const song = await Song.findById(req.params.id).populate('album');

  if (!song) {
    throw new AppError('Song not found', 404);
  }

  res.status(200).json({
    success: true,
    data: song
  });
});

// @desc    Increment play count
// @route   POST /api/songs/:id/play
// @access  Private
export const playSong = asyncHandler(async (req: AuthRequest, res: Response) => {
  const song = await Song.findByIdAndUpdate(
    req.params.id,
    { $inc: { playCount: 1 } },
    { new: true }
  );

  if (!song) {
    throw new AppError('Song not found', 404);
  }

  // Add to user's recently played
  await User.findByIdAndUpdate(req.user!._id, {
    $push: {
      recentlyPlayed: {
        $each: [{ song: song._id, playedAt: new Date() }],
        $position: 0,
        $slice: 50 // Keep only last 50 played songs
      }
    }
  });

  res.status(200).json({
    success: true,
    data: song
  });
});

// @desc    Like/Unlike song
// @route   POST /api/songs/:id/like
// @access  Private
export const toggleLikeSong = asyncHandler(async (req: AuthRequest, res: Response) => {
  const song = await Song.findById(req.params.id);

  if (!song) {
    throw new AppError('Song not found', 404);
  }

  const user = await User.findById(req.user!._id);
  const isLiked = user!.likedSongs.includes(song._id);

  if (isLiked) {
    // Unlike
    await User.findByIdAndUpdate(req.user!._id, {
      $pull: { likedSongs: song._id }
    });
    await Song.findByIdAndUpdate(song._id, {
      $inc: { likes: -1 }
    });
  } else {
    // Like
    await User.findByIdAndUpdate(req.user!._id, {
      $addToSet: { likedSongs: song._id }
    });
    await Song.findByIdAndUpdate(song._id, {
      $inc: { likes: 1 }
    });
  }

  res.status(200).json({
    success: true,
    message: isLiked ? 'Song unliked' : 'Song liked',
    isLiked: !isLiked
  });
});

// @desc    Get trending songs
// @route   GET /api/songs/trending
// @access  Public
export const getTrendingSongs = asyncHandler(async (req: AuthRequest, res: Response) => {
  const limit = parseInt(req.query.limit as string) || 10;

  const songs = await Song.find()
    .sort('-playCount -likes')
    .limit(limit)
    .populate('album', 'title coverImage');

  res.status(200).json({
    success: true,
    data: songs
  });
});



// @desc    Get recently added songs
// @route   GET /api/songs/recent
// @access  Public
export const getRecentSongs = asyncHandler(async (req: AuthRequest, res: Response) => {
  const limit = parseInt(req.query.limit as string) || 20;

  const songs = await Song.find()
    .sort('-createdAt')
    .limit(limit)
    .populate('album', 'title coverImage');

  res.status(200).json({
    success: true,
    data: songs
  });
});


// @desc    Enhanced search with filters
// @route   GET /api/songs/search/advanced
// @access  Public
export const advancedSearch = asyncHandler(async (req: AuthRequest, res: Response) => {
  const {
    q,
    genre,
    mood,
    language,
    year,
    explicit,
    minDuration,
    maxDuration,
    sort = '-playCount',
    page = 1,
    limit = 20
  } = req.query;

  const query: any = {};

  // Text search
  if (q) {
    query.$or = [
      { title: { $regex: q, $options: 'i' } },
      { artist: { $regex: q, $options: 'i' } }
    ];
  }

  // Genre filter
  if (genre) {
    query.genre = genre;
  }

  // Mood filter
  if (mood) {
    query.mood = mood;
  }

  // Language filter
  if (language) {
    query.language = language;
  }

  // Year filter
  if (year) {
    query.releaseYear = parseInt(year as string);
  }

  // Explicit content filter
  if (explicit !== undefined) {
    query.explicit = explicit === 'true';
  }

  // Duration filter
  if (minDuration || maxDuration) {
    query.duration = {};
    if (minDuration) query.duration.$gte = parseInt(minDuration as string);
    if (maxDuration) query.duration.$lte = parseInt(maxDuration as string);
  }

  const skip = (parseInt(page as string) - 1) * parseInt(limit as string);

  const [songs, total] = await Promise.all([
    Song.find(query)
      .sort(sort as string)
      .skip(skip)
      .limit(parseInt(limit as string))
      .populate('album', 'title coverImage')
      .populate('artistRef', 'name profileImage'),
    Song.countDocuments(query)
  ]);

  res.status(200).json({
    success: true,
    data: songs,
    pagination: {
      page: parseInt(page as string),
      limit: parseInt(limit as string),
      total,
      pages: Math.ceil(total / parseInt(limit as string))
    }
  });
});

// @desc    Get songs by mood
// @route   GET /api/songs/mood/:mood
// @access  Public
export const getSongsByMood = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { mood } = req.params;
  const limit = parseInt(req.query.limit as string) || 20;

  const songs = await Song.find({ mood })
    .sort({ playCount: -1 })
    .limit(limit);

  res.status(200).json({
    success: true,
    data: songs
  });
});

// @desc    Get songs by genre
// @route   GET /api/songs/genre/:genre
// @access  Public
export const getSongsByGenre = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { genre } = req.params;
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 20;
  const skip = (page - 1) * limit;

  const [songs, total] = await Promise.all([
    Song.find({ genre })
      .sort({ playCount: -1 })
      .skip(skip)
      .limit(limit),
    Song.countDocuments({ genre })
  ]);

  res.status(200).json({
    success: true,
    data: songs,
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit)
    }
  });
});
