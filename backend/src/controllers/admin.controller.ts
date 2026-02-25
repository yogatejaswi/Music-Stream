import { Response } from 'express';
import Song from '../models/Song';
import Album from '../models/Album';
import User from '../models/User';
import { asyncHandler, AppError } from '../middleware/error.middleware';
import { AuthRequest } from '../middleware/auth.middleware';
import { uploadToCloudinary, deleteFromCloudinary } from '../config/cloudinary';

// @desc    Upload new song
// @route   POST /api/admin/songs
// @access  Admin
export const uploadSong = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { title, artist, duration, genre, albumId, isPremium } = req.body;
  const files = req.files as { [fieldname: string]: Express.Multer.File[] };

  if (!title || !artist || !duration) {
    throw new AppError('Title, artist, and duration are required', 400);
  }

  if (!files?.audio || !files.audio[0]) {
    throw new AppError('Audio file is required', 400);
  }

  // Upload audio to Cloudinary
  const audioUpload = await uploadToCloudinary(files.audio[0], 'music/audio', 'video');

  // Upload cover image if provided
  let coverImageUrl = 'https://via.placeholder.com/300';
  if (files?.cover && files.cover[0]) {
    const coverUpload = await uploadToCloudinary(files.cover[0], 'music/covers', 'image');
    coverImageUrl = coverUpload.url;
  }

  const song = await Song.create({
    title,
    artist,
    duration: parseInt(duration),
    audioUrl: audioUpload.url,
    coverImage: coverImageUrl,
    genre: genre ? JSON.parse(genre) : [],
    album: albumId || null,
    isPremium: isPremium === 'true',
    uploadedBy: req.user!._id
  });

  res.status(201).json({
    success: true,
    message: 'Song uploaded successfully',
    data: song
  });
});

// @desc    Update song
// @route   PUT /api/admin/songs/:id
// @access  Admin
export const updateSong = asyncHandler(async (req: AuthRequest, res: Response) => {
  const song = await Song.findById(req.params.id);

  if (!song) {
    throw new AppError('Song not found', 404);
  }

  const { title, artist, genre, isPremium } = req.body;

  if (title) song.title = title;
  if (artist) song.artist = artist;
  if (genre) song.genre = JSON.parse(genre);
  if (isPremium !== undefined) song.isPremium = isPremium === 'true';

  await song.save();

  res.status(200).json({
    success: true,
    message: 'Song updated successfully',
    data: song
  });
});

// @desc    Delete song
// @route   DELETE /api/admin/songs/:id
// @access  Admin
export const deleteSong = asyncHandler(async (req: AuthRequest, res: Response) => {
  const song = await Song.findById(req.params.id);

  if (!song) {
    throw new AppError('Song not found', 404);
  }

  await song.deleteOne();

  res.status(200).json({
    success: true,
    message: 'Song deleted successfully'
  });
});

// @desc    Create album
// @route   POST /api/admin/albums
// @access  Admin
export const createAlbum = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { title, artist, genre, releaseDate } = req.body;

  if (!title || !artist) {
    throw new AppError('Title and artist are required', 400);
  }

  const album = await Album.create({
    title,
    artist,
    genre: genre || [],
    releaseDate: releaseDate || new Date(),
    songs: []
  });

  res.status(201).json({
    success: true,
    message: 'Album created successfully',
    data: album
  });
});

// @desc    Get all users
// @route   GET /api/admin/users
// @access  Admin
export const getAllUsers = asyncHandler(async (req: AuthRequest, res: Response) => {
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 20;
  const skip = (page - 1) * limit;

  const [users, total] = await Promise.all([
    User.find().select('-password').skip(skip).limit(limit).sort('-createdAt'),
    User.countDocuments()
  ]);

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

// @desc    Get platform analytics
// @route   GET /api/admin/analytics
// @access  Admin
export const getAnalytics = asyncHandler(async (req: AuthRequest, res: Response) => {
  const [
    totalUsers,
    totalSongs,
    totalPlays,
    premiumUsers,
    topSongs
  ] = await Promise.all([
    User.countDocuments(),
    Song.countDocuments(),
    Song.aggregate([{ $group: { _id: null, total: { $sum: '$playCount' } } }]),
    User.countDocuments({ 'subscription.plan': 'premium' }),
    Song.find().sort('-playCount').limit(10).select('title artist playCount likes')
  ]);

  res.status(200).json({
    success: true,
    data: {
      totalUsers,
      totalSongs,
      totalPlays: totalPlays[0]?.total || 0,
      premiumUsers,
      freeUsers: totalUsers - premiumUsers,
      topSongs
    }
  });
});
