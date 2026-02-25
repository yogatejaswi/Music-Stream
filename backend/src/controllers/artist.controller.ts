import { Request, Response } from 'express';
import { asyncHandler, AppError } from '../middleware/error.middleware';
import { AuthRequest } from '../middleware/auth.middleware';
import Artist from '../models/Artist';
import Song from '../models/Song';
import User from '../models/User';

// @desc    Get all artists
// @route   GET /api/artists
// @access  Public
export const getArtists = asyncHandler(async (req: Request, res: Response) => {
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 20;
  const skip = (page - 1) * limit;
  const search = req.query.search as string;
  const genre = req.query.genre as string;

  let query: any = {};

  if (search) {
    query.$text = { $search: search };
  }

  if (genre) {
    query.genre = genre;
  }

  const artists = await Artist.find(query)
    .skip(skip)
    .limit(limit)
    .sort({ followers: -1 });

  const total = await Artist.countDocuments(query);

  res.status(200).json({
    success: true,
    data: artists,
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit)
    }
  });
});

// @desc    Get artist by ID
// @route   GET /api/artists/:id
// @access  Public
export const getArtistById = asyncHandler(async (req: Request, res: Response) => {
  const artist = await Artist.findById(req.params.id);

  if (!artist) {
    throw new AppError('Artist not found', 404);
  }

  // Get artist's songs
  const songs = await Song.find({ artistRef: artist._id }).sort({ playCount: -1 });

  // Get follower count
  const followerCount = artist.followers.length;

  res.status(200).json({
    success: true,
    data: {
      ...artist.toObject(),
      songs,
      followerCount
    }
  });
});

// @desc    Follow/unfollow artist
// @route   POST /api/artists/:id/follow
// @access  Private
export const toggleFollowArtist = asyncHandler(async (req: AuthRequest, res: Response) => {
  const artist = await Artist.findById(req.params.id);

  if (!artist) {
    throw new AppError('Artist not found', 404);
  }

  const user = await User.findById(req.user!._id);
  const isFollowing = user!.followingArtists.includes(artist._id);

  if (isFollowing) {
    // Unfollow
    await User.findByIdAndUpdate(req.user!._id, {
      $pull: { followingArtists: artist._id }
    });
    await Artist.findByIdAndUpdate(artist._id, {
      $pull: { followers: req.user!._id }
    });
  } else {
    // Follow
    await User.findByIdAndUpdate(req.user!._id, {
      $addToSet: { followingArtists: artist._id }
    });
    await Artist.findByIdAndUpdate(artist._id, {
      $addToSet: { followers: req.user!._id }
    });
  }

  res.status(200).json({
    success: true,
    message: isFollowing ? 'Artist unfollowed' : 'Artist followed',
    isFollowing: !isFollowing
  });
});

// @desc    Create artist (Admin)
// @route   POST /api/artists
// @access  Private/Admin
export const createArtist = asyncHandler(async (req: AuthRequest, res: Response) => {
  const artist = await Artist.create(req.body);

  res.status(201).json({
    success: true,
    data: artist
  });
});

// @desc    Update artist (Admin)
// @route   PUT /api/artists/:id
// @access  Private/Admin
export const updateArtist = asyncHandler(async (req: AuthRequest, res: Response) => {
  const artist = await Artist.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true, runValidators: true }
  );

  if (!artist) {
    throw new AppError('Artist not found', 404);
  }

  res.status(200).json({
    success: true,
    data: artist
  });
});

// @desc    Delete artist (Admin)
// @route   DELETE /api/artists/:id
// @access  Private/Admin
export const deleteArtist = asyncHandler(async (req: AuthRequest, res: Response) => {
  const artist = await Artist.findByIdAndDelete(req.params.id);

  if (!artist) {
    throw new AppError('Artist not found', 404);
  }

  res.status(200).json({
    success: true,
    message: 'Artist deleted successfully'
  });
});

// @desc    Get top artists
// @route   GET /api/artists/top
// @access  Public
export const getTopArtists = asyncHandler(async (req: Request, res: Response) => {
  const limit = parseInt(req.query.limit as string) || 10;

  const artists = await Artist.find()
    .sort({ followers: -1 })
    .limit(limit);

  res.status(200).json({
    success: true,
    data: artists
  });
});
