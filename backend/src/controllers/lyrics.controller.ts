import { Request, Response } from 'express';
import Lyrics from '../models/Lyrics';
import Song from '../models/Song';
import { asyncHandler, AppError } from '../middleware/error.middleware';
import { AuthRequest } from '../middleware/auth.middleware';

// @desc    Get lyrics for a song
// @route   GET /api/lyrics/song/:songId
// @access  Public
export const getSongLyrics = asyncHandler(async (req: Request, res: Response) => {
  const { songId } = req.params;

  const lyrics = await Lyrics.findOne({ songId }).populate('songId', 'title artist');

  if (!lyrics) {
    throw new AppError('Lyrics not found for this song', 404);
  }

  res.status(200).json({
    success: true,
    lyrics
  });
});

// @desc    Add lyrics to a song
// @route   POST /api/lyrics
// @access  Private (Admin only)
export const addLyrics = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { songId, lyrics, syncedLyrics, language, source } = req.body;

  // Check if song exists
  const song = await Song.findById(songId);
  if (!song) {
    throw new AppError('Song not found', 404);
  }

  // Check if lyrics already exist
  const existingLyrics = await Lyrics.findOne({ songId });
  if (existingLyrics) {
    throw new AppError('Lyrics already exist for this song', 400);
  }

  const newLyrics = await Lyrics.create({
    songId,
    lyrics,
    syncedLyrics,
    language: language || 'en',
    source: source || 'manual',
    verified: req.user?.role === 'admin'
  });

  await newLyrics.populate('songId', 'title artist');

  res.status(201).json({
    success: true,
    message: 'Lyrics added successfully',
    lyrics: newLyrics
  });
});

// @desc    Update lyrics
// @route   PUT /api/lyrics/:id
// @access  Private (Admin only)
export const updateLyrics = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  const { lyrics, syncedLyrics, language, verified } = req.body;

  const lyricsDoc = await Lyrics.findById(id);
  if (!lyricsDoc) {
    throw new AppError('Lyrics not found', 404);
  }

  lyricsDoc.lyrics = lyrics || lyricsDoc.lyrics;
  lyricsDoc.syncedLyrics = syncedLyrics || lyricsDoc.syncedLyrics;
  lyricsDoc.language = language || lyricsDoc.language;
  
  if (req.user?.role === 'admin') {
    lyricsDoc.verified = verified !== undefined ? verified : lyricsDoc.verified;
  }

  await lyricsDoc.save();
  await lyricsDoc.populate('songId', 'title artist');

  res.status(200).json({
    success: true,
    message: 'Lyrics updated successfully',
    lyrics: lyricsDoc
  });
});

// @desc    Delete lyrics
// @route   DELETE /api/lyrics/:id
// @access  Private (Admin only)
export const deleteLyrics = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;

  const lyrics = await Lyrics.findById(id);
  if (!lyrics) {
    throw new AppError('Lyrics not found', 404);
  }

  await Lyrics.findByIdAndDelete(id);

  res.status(200).json({
    success: true,
    message: 'Lyrics deleted successfully'
  });
});

// @desc    Search lyrics
// @route   GET /api/lyrics/search
// @access  Public
export const searchLyrics = asyncHandler(async (req: Request, res: Response) => {
  const { q, language } = req.query;

  if (!q) {
    throw new AppError('Search query is required', 400);
  }

  const searchQuery: any = {
    lyrics: { $regex: q, $options: 'i' }
  };

  if (language) {
    searchQuery.language = language;
  }

  const lyrics = await Lyrics.find(searchQuery)
    .populate('songId', 'title artist coverImage duration')
    .limit(20)
    .sort({ verified: -1, createdAt: -1 });

  res.status(200).json({
    success: true,
    count: lyrics.length,
    lyrics
  });
});

// @desc    Get all lyrics (admin)
// @route   GET /api/lyrics
// @access  Private (Admin only)
export const getAllLyrics = asyncHandler(async (req: Request, res: Response) => {
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 20;
  const skip = (page - 1) * limit;

  const { language, verified } = req.query;

  const query: any = {};
  if (language) query.language = language;
  if (verified !== undefined) query.verified = verified === 'true';

  const lyrics = await Lyrics.find(query)
    .populate('songId', 'title artist')
    .skip(skip)
    .limit(limit)
    .sort({ createdAt: -1 });

  const total = await Lyrics.countDocuments(query);

  res.status(200).json({
    success: true,
    count: lyrics.length,
    total,
    page,
    pages: Math.ceil(total / limit),
    lyrics
  });
});

// @desc    Auto-fetch lyrics from external API (placeholder)
// @route   POST /api/lyrics/fetch/:songId
// @access  Private (Admin only)
export const fetchLyrics = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { songId } = req.params;

  const song = await Song.findById(songId);
  if (!song) {
    throw new AppError('Song not found', 404);
  }

  // Check if lyrics already exist
  const existingLyrics = await Lyrics.findOne({ songId });
  if (existingLyrics) {
    throw new AppError('Lyrics already exist for this song', 400);
  }

  // Placeholder for external API integration (Genius, Musixmatch, etc.)
  // For now, we'll create a sample lyrics entry
  const sampleLyrics = `[Verse 1]
This is a sample lyrics for ${song.title}
By ${song.artist}
Auto-fetched from external source

[Chorus]
Sample lyrics, sample lyrics
This is just a placeholder
Until real API integration

[Verse 2]
More sample content here
To demonstrate the feature
Real lyrics would come from API

[Outro]
End of sample lyrics`;

  const newLyrics = await Lyrics.create({
    songId,
    lyrics: sampleLyrics,
    language: 'en',
    source: 'auto-fetch',
    verified: false
  });

  await newLyrics.populate('songId', 'title artist');

  res.status(201).json({
    success: true,
    message: 'Lyrics fetched and added successfully',
    lyrics: newLyrics
  });
});