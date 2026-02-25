import { Response } from 'express';
import { asyncHandler } from '../middleware/error.middleware';
import { AuthRequest } from '../middleware/auth.middleware';
import User from '../models/User';
import Song from '../models/Song';
import ListenHistory from '../models/ListenHistory';
import Playlist from '../models/Playlist';

// @desc    Get admin dashboard stats
// @route   GET /api/analytics/dashboard
// @access  Private/Admin
export const getDashboardStats = asyncHandler(async (req: AuthRequest, res: Response) => {
  // Total counts
  const totalUsers = await User.countDocuments();
  const totalSongs = await Song.countDocuments();
  const totalPlaylists = await Playlist.countDocuments();
  const totalPlays = await ListenHistory.countDocuments();

  // Premium users
  const premiumUsers = await User.countDocuments({ 'subscription.plan': 'premium' });

  // New users this month
  const startOfMonth = new Date();
  startOfMonth.setDate(1);
  startOfMonth.setHours(0, 0, 0, 0);

  const newUsersThisMonth = await User.countDocuments({
    createdAt: { $gte: startOfMonth }
  });

  // Top songs
  const topSongs = await Song.find()
    .sort({ playCount: -1 })
    .limit(10)
    .select('title artist playCount likes');

  // Recent users
  const recentUsers = await User.find()
    .sort({ createdAt: -1 })
    .limit(10)
    .select('name email createdAt subscription.plan');

  // Plays by day (last 30 days)
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  const playsByDay = await ListenHistory.aggregate([
    {
      $match: {
        playedAt: { $gte: thirtyDaysAgo }
      }
    },
    {
      $group: {
        _id: {
          $dateToString: { format: '%Y-%m-%d', date: '$playedAt' }
        },
        count: { $sum: 1 }
      }
    },
    { $sort: { _id: 1 } }
  ]);

  // User growth (last 12 months)
  const twelveMonthsAgo = new Date();
  twelveMonthsAgo.setMonth(twelveMonthsAgo.getMonth() - 12);

  const userGrowth = await User.aggregate([
    {
      $match: {
        createdAt: { $gte: twelveMonthsAgo }
      }
    },
    {
      $group: {
        _id: {
          $dateToString: { format: '%Y-%m', date: '$createdAt' }
        },
        count: { $sum: 1 }
      }
    },
    { $sort: { _id: 1 } }
  ]);

  res.status(200).json({
    success: true,
    data: {
      overview: {
        totalUsers,
        totalSongs,
        totalPlaylists,
        totalPlays,
        premiumUsers,
        newUsersThisMonth
      },
      topSongs,
      recentUsers,
      playsByDay,
      userGrowth
    }
  });
});

// @desc    Get top charts
// @route   GET /api/analytics/charts
// @access  Public
export const getCharts = asyncHandler(async (req: AuthRequest, res: Response) => {
  const period = req.query.period as string || 'week'; // day, week, month, all
  
  let dateFilter: any = {};
  const now = new Date();

  switch (period) {
    case 'day':
      dateFilter = { playedAt: { $gte: new Date(now.setDate(now.getDate() - 1)) } };
      break;
    case 'week':
      dateFilter = { playedAt: { $gte: new Date(now.setDate(now.getDate() - 7)) } };
      break;
    case 'month':
      dateFilter = { playedAt: { $gte: new Date(now.setMonth(now.getMonth() - 1)) } };
      break;
    default:
      dateFilter = {};
  }

  // Top songs by plays
  const topSongs = await ListenHistory.aggregate([
    { $match: dateFilter },
    { $group: { _id: '$song', playCount: { $sum: 1 } } },
    { $sort: { playCount: -1 } },
    { $limit: 50 },
    {
      $lookup: {
        from: 'songs',
        localField: '_id',
        foreignField: '_id',
        as: 'song'
      }
    },
    { $unwind: '$song' },
    {
      $project: {
        _id: '$song._id',
        title: '$song.title',
        artist: '$song.artist',
        coverImage: '$song.coverImage',
        playCount: 1
      }
    }
  ]);

  // Top artists
  const topArtists = await ListenHistory.aggregate([
    { $match: dateFilter },
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
    { $limit: 20 }
  ]);

  res.status(200).json({
    success: true,
    data: {
      period,
      topSongs,
      topArtists
    }
  });
});

// @desc    Get genre statistics
// @route   GET /api/analytics/genres
// @access  Public
export const getGenreStats = asyncHandler(async (req: AuthRequest, res: Response) => {
  const genreStats = await Song.aggregate([
    { $unwind: '$genre' },
    { $group: { _id: '$genre', count: { $sum: 1 }, totalPlays: { $sum: '$playCount' } } },
    { $sort: { totalPlays: -1 } }
  ]);

  res.status(200).json({
    success: true,
    data: genreStats
  });
});

// @desc    Get user analytics
// @route   GET /api/analytics/users
// @access  Private/Admin
export const getUserAnalytics = asyncHandler(async (req: AuthRequest, res: Response) => {
  // Active users (played in last 7 days)
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

  const activeUsers = await ListenHistory.distinct('user', {
    playedAt: { $gte: sevenDaysAgo }
  });

  // User distribution by subscription
  const subscriptionDistribution = await User.aggregate([
    { $group: { _id: '$subscription.plan', count: { $sum: 1 } } }
  ]);

  // Average songs per user
  const avgSongsPerUser = await User.aggregate([
    {
      $project: {
        likedSongsCount: { $size: '$likedSongs' }
      }
    },
    {
      $group: {
        _id: null,
        avgLikedSongs: { $avg: '$likedSongsCount' }
      }
    }
  ]);

  res.status(200).json({
    success: true,
    data: {
      activeUsersCount: activeUsers.length,
      subscriptionDistribution,
      avgLikedSongs: avgSongsPerUser[0]?.avgLikedSongs || 0
    }
  });
});

// @desc    Get song analytics
// @route   GET /api/analytics/songs/:songId
// @access  Private/Admin
export const getSongAnalytics = asyncHandler(async (req: AuthRequest, res: Response) => {
  const songId = req.params.songId;

  // Total plays
  const totalPlays = await ListenHistory.countDocuments({ song: songId });

  // Unique listeners
  const uniqueListeners = await ListenHistory.distinct('user', { song: songId });

  // Plays over time (last 30 days)
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  const playsOverTime = await ListenHistory.aggregate([
    {
      $match: {
        song: songId,
        playedAt: { $gte: thirtyDaysAgo }
      }
    },
    {
      $group: {
        _id: {
          $dateToString: { format: '%Y-%m-%d', date: '$playedAt' }
        },
        count: { $sum: 1 }
      }
    },
    { $sort: { _id: 1 } }
  ]);

  // Completion rate
  const completionStats = await ListenHistory.aggregate([
    { $match: { song: songId } },
    {
      $group: {
        _id: null,
        totalPlays: { $sum: 1 },
        completedPlays: {
          $sum: { $cond: ['$completed', 1, 0] }
        }
      }
    }
  ]);

  const completionRate = completionStats[0]
    ? (completionStats[0].completedPlays / completionStats[0].totalPlays) * 100
    : 0;

  res.status(200).json({
    success: true,
    data: {
      totalPlays,
      uniqueListeners: uniqueListeners.length,
      playsOverTime,
      completionRate: completionRate.toFixed(2)
    }
  });
});
