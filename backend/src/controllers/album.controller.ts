import { Request, Response } from 'express';
import { asyncHandler, AppError } from '../middleware/error.middleware';
import { AuthRequest } from '../middleware/auth.middleware';
import Album from '../models/Album';
import Song from '../models/Song';

// @desc    Get all albums
// @route   GET /api/albums
// @access  Public
export const getAlbums = asyncHandler(async (req: Request, res: Response) => {
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 20;
  const skip = (page - 1) * limit;
  const search = req.query.search as string;
  const genre = req.query.genre as string;
  const year = req.query.year as string;

  let query: any = {};

  if (search) {
    query.$text = { $search: search };
  }

  if (genre) {
    query.genre = genre;
  }

  if (year) {
    query.releaseYear = parseInt(year);
  }

  const albums = await Album.find(query)
    .populate('songs')
    .skip(skip)
    .limit(limit)
    .sort({ releaseYear: -1 });

  const total = await Album.countDocuments(query);

  res.status(200).json({
    success: true,
    data: albums,
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit)
    }
  });
});

// @desc    Get album by ID
// @route   GET /api/albums/:id
// @access  Public
export const getAlbumById = asyncHandler(async (req: Request, res: Response) => {
  const album = await Album.findById(req.params.id).populate('songs');

  if (!album) {
    throw new AppError('Album not found', 404);
  }

  res.status(200).json({
    success: true,
    data: album
  });
});

// @desc    Create album (Admin)
// @route   POST /api/albums
// @access  Private/Admin
export const createAlbum = asyncHandler(async (req: AuthRequest, res: Response) => {
  const album = await Album.create(req.body);

  res.status(201).json({
    success: true,
    data: album
  });
});

// @desc    Update album (Admin)
// @route   PUT /api/albums/:id
// @access  Private/Admin
export const updateAlbum = asyncHandler(async (req: AuthRequest, res: Response) => {
  const album = await Album.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true, runValidators: true }
  );

  if (!album) {
    throw new AppError('Album not found', 404);
  }

  res.status(200).json({
    success: true,
    data: album
  });
});

// @desc    Delete album (Admin)
// @route   DELETE /api/albums/:id
// @access  Private/Admin
export const deleteAlbum = asyncHandler(async (req: AuthRequest, res: Response) => {
  const album = await Album.findByIdAndDelete(req.params.id);

  if (!album) {
    throw new AppError('Album not found', 404);
  }

  res.status(200).json({
    success: true,
    message: 'Album deleted successfully'
  });
});

// @desc    Add song to album (Admin)
// @route   POST /api/albums/:id/songs
// @access  Private/Admin
export const addSongToAlbum = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { songId } = req.body;

  const album = await Album.findByIdAndUpdate(
    req.params.id,
    { $addToSet: { songs: songId } },
    { new: true }
  );

  if (!album) {
    throw new AppError('Album not found', 404);
  }

  await Song.findByIdAndUpdate(songId, { album: album._id });

  res.status(200).json({
    success: true,
    data: album
  });
});

// @desc    Remove song from album (Admin)
// @route   DELETE /api/albums/:id/songs/:songId
// @access  Private/Admin
export const removeSongFromAlbum = asyncHandler(async (req: AuthRequest, res: Response) => {
  const album = await Album.findByIdAndUpdate(
    req.params.id,
    { $pull: { songs: req.params.songId } },
    { new: true }
  );

  if (!album) {
    throw new AppError('Album not found', 404);
  }

  await Song.findByIdAndUpdate(req.params.songId, { $unset: { album: 1 } });

  res.status(200).json({
    success: true,
    data: album
  });
});
