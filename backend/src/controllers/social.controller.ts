import { Response } from 'express';
import { asyncHandler, AppError } from '../middleware/error.middleware';
import { AuthRequest } from '../middleware/auth.middleware';
import User from '../models/User';
import ListenHistory from '../models/ListenHistory';

// @desc    Follow/unfollow user
// @route   POST /api/social/follow/:userId
// @access  Private
export const toggleFollowUser = asyncHandler(async (req: AuthRequest, res: Response) => {
  const targetUserId = req.params.userId;

  if (targetUserId === req.user!._id.toString()) {
    throw new AppError('You cannot follow yourself', 400);
  }

  const targetUser = await User.findById(targetUserId);
  if (!targetUser) {
    throw new AppError('User not found', 404);
  }

  const currentUser = await User.findById(req.user!._id);
  const isFollowing = currentUser!.following.includes(targetUser._id);

  if (isFollowing) {
    // Unfollow
    await User.findByIdAndUpdate(req.user!._id, {
      $pull: { following: targetUserId }
    });
    await User.findByIdAndUpdate(targetUserId, {
      $pull: { followers: req.user!._id }
    });
  } else {
    // Follow
    await User.findByIdAndUpdate(req.user!._id, {
      $addToSet: { following: targetUserId }
    });
    await User.findByIdAndUpdate(targetUserId, {
      $addToSet: { followers: req.user!._id }
    });
  }

  res.status(200).json({
    success: true,
    message: isFollowing ? 'User unfollowed' : 'User followed',
    isFollowing: !isFollowing
  });
});

// @desc    Get user followers
// @route   GET /api/social/followers/:userId
// @access  Public
export const getUserFollowers = asyncHandler(async (req: AuthRequest, res: Response) => {
  const user = await User.findById(req.params.userId)
    .populate('followers', 'name username profileImage')
    .select('followers');

  if (!user) {
    throw new AppError('User not found', 404);
  }

  res.status(200).json({
    success: true,
    data: user.followers
  });
});

// @desc    Get user following
// @route   GET /api/social/following/:userId
// @access  Public
export const getUserFollowing = asyncHandler(async (req: AuthRequest, res: Response) => {
  const user = await User.findById(req.params.userId)
    .populate('following', 'name username profileImage')
    .select('following');

  if (!user) {
    throw new AppError('User not found', 404);
  }

  res.status(200).json({
    success: true,
    data: user.following
  });
});

// @desc    Get activity feed
// @route   GET /api/social/feed
// @access  Private
export const getActivityFeed = asyncHandler(async (req: AuthRequest, res: Response) => {
  const user = await User.findById(req.user!._id).select('following');
  const followingIds = user!.following;

  // Get recent activity from followed users
  const recentActivity = await ListenHistory.find({
    user: { $in: followingIds }
  })
    .populate('user', 'name username profileImage')
    .populate('song')
    .sort({ playedAt: -1 })
    .limit(50);

  res.status(200).json({
    success: true,
    data: recentActivity
  });
});

// @desc    Get user profile
// @route   GET /api/social/profile/:userId
// @access  Public
export const getUserProfile = asyncHandler(async (req: AuthRequest, res: Response) => {
  const user = await User.findById(req.params.userId)
    .select('-password')
    .populate('playlists')
    .populate('likedSongs');

  if (!user) {
    throw new AppError('User not found', 404);
  }

  // Get user stats
  const totalPlays = await ListenHistory.countDocuments({ user: user._id });
  const followersCount = user.followers.length;
  const followingCount = user.following.length;

  res.status(200).json({
    success: true,
    data: {
      ...user.toObject(),
      stats: {
        totalPlays,
        followersCount,
        followingCount,
        playlistsCount: user.playlists.length
      }
    }
  });
});

// @desc    Update user profile
// @route   PUT /api/social/profile
// @access  Private
export const updateProfile = asyncHandler(async (req: AuthRequest, res: Response) => {
  const allowedFields = ['name', 'username', 'bio', 'profileImage'];
  const updates: any = {};

  Object.keys(req.body).forEach(key => {
    if (allowedFields.includes(key)) {
      updates[key] = req.body[key];
    }
  });

  const user = await User.findByIdAndUpdate(
    req.user!._id,
    updates,
    { new: true, runValidators: true }
  ).select('-password');

  res.status(200).json({
    success: true,
    data: user
  });
});

// @desc    Search users
// @route   GET /api/social/search
// @access  Public
export const searchUsers = asyncHandler(async (req: AuthRequest, res: Response) => {
  const search = req.query.q as string;
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 20;
  const skip = (page - 1) * limit;

  if (!search) {
    throw new AppError('Search query is required', 400);
  }

  const users = await User.find({
    $or: [
      { name: { $regex: search, $options: 'i' } },
      { username: { $regex: search, $options: 'i' } }
    ]
  })
    .select('name username profileImage bio')
    .skip(skip)
    .limit(limit);

  const total = await User.countDocuments({
    $or: [
      { name: { $regex: search, $options: 'i' } },
      { username: { $regex: search, $options: 'i' } }
    ]
  });

  res.status(200).json({
    success: true,
    data: users,
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit)
    }
  });
});
