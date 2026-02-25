import { Response } from 'express';
import { asyncHandler } from '../middleware/error.middleware';
import { AuthRequest } from '../middleware/auth.middleware';
import ListenHistory from '../models/ListenHistory';
import User from '../models/User';
import Song from '../models/Song';

// @desc    Track song play
// @route   POST /api/history/track
// @access  Private
export const trackPlay = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { songId, duration, completed } = req.body;

  // Create history entry
  await ListenHistory.create({
    user: req.user!._id,
    song: songId,
    duration,
    completed
  });

  // Update song play count
  await Song.findByIdAndUpdate(songId, { $inc: { playCount: 1 } });

  // Update user's recently played
  await User.findByIdAndUpdate(req.user!._id, {
    $pull: { recentlyPlayed: { song: songId } }
  });

  await User.findByIdAndUpdate(req.user!._id, {
    $push: {
      recentlyPlayed: {
        $each: [{ song: songId, playedAt: new Date() }],
        $position: 0,
        $slice: 50 // Keep only last 50
      }
    }
  });

  res.status(200).json({
    success: true,
    message: 'Play tracked successfully'
  });
});

// @desc    Get user listen history
// @route   GET /api/history
// @access  Private
export const getHistory = asyncHandler(async (req: AuthRequest, res: Response) => {
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 50;
  const skip = (page - 1) * limit;

  const history = await ListenHistory.find({ user: req.user!._id })
    .populate('song')
    .sort({ playedAt: -1 })
    .skip(skip)
    .limit(limit);

  const total = await ListenHistory.countDocuments({ user: req.user!._id });

  res.status(200).json({
    success: true,
    data: history,
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit)
    }
  });
});

// @desc    Get recently played songs
// @route   GET /api/history/recent
// @access  Private
export const getRecentlyPlayed = asyncHandler(async (req: AuthRequest, res: Response) => {
  const limit = parseInt(req.query.limit as string) || 20;

  const user = await User.findById(req.user!._id)
    .populate({
      path: 'recentlyPlayed.song',
      model: 'Song'
    })
    .select('recentlyPlayed');

  const recentSongs = user?.recentlyPlayed.slice(0, limit) || [];

  res.status(200).json({
    success: true,
    data: recentSongs
  });
});

// @desc    Get listening statistics
// @route   GET /api/history/stats
// @access  Private
export const getListeningStats = asyncHandler(async (req: AuthRequest, res: Response) => {
  const userId = req.user!._id;

  // Total listening time
  const totalStats = await ListenHistory.aggregate([
    { $match: { user: userId } },
    {
      $group: {
        _id: null,
        totalPlays: { $sum: 1 },
        totalDuration: { $sum: '$duration' }
      }
    }
  ]);

  // Top songs
  const topSongs = await ListenHistory.aggregate([
    { $match: { user: userId } },
    { $group: { _id: '$song', playCount: { $sum: 1 } } },
    { $sort: { playCount: -1 } },
    { $limit: 10 },
    {
      $lookup: {
        from: 'songs',
        localField: '_id',
        foreignField: '_id',
        as: 'song'
      }
    },
    { $unwind: '$song' }
  ]);

  // Top artists
  const topArtists = await ListenHistory.aggregate([
    { $match: { user: userId } },
    {
      $lookup: {
        from: 'songs',
        localField: 'song',
        foreignField: '_id',
        as: 'songData'
      }
    },
    { $unwind: '$songData' },
    { $group: { _id: '$songData.artist', playCount: { $sum: 1 } } },
    { $sort: { playCount: -1 } },
    { $limit: 10 }
  ]);

  // Listening by day of week
  const byDayOfWeek = await ListenHistory.aggregate([
    { $match: { user: userId } },
    {
      $group: {
        _id: { $dayOfWeek: '$playedAt' },
        count: { $sum: 1 }
      }
    },
    { $sort: { _id: 1 } }
  ]);

  res.status(200).json({
    success: true,
    data: {
      total: totalStats[0] || { totalPlays: 0, totalDuration: 0 },
      topSongs,
      topArtists,
      byDayOfWeek
    }
  });
});

// @desc    Clear listen history
// @route   DELETE /api/history
// @access  Private
export const clearHistory = asyncHandler(async (req: AuthRequest, res: Response) => {
  await ListenHistory.deleteMany({ user: req.user!._id });

  await User.findByIdAndUpdate(req.user!._id, {
    recentlyPlayed: []
  });

  res.status(200).json({
    success: true,
    message: 'History cleared successfully'
  });
});
