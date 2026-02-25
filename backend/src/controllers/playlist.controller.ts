import { Response } from 'express';
import Playlist from '../models/Playlist';
import { asyncHandler, AppError } from '../middleware/error.middleware';
import { AuthRequest } from '../middleware/auth.middleware';

// @desc    Get user playlists
// @route   GET /api/playlists
// @access  Private
export const getUserPlaylists = asyncHandler(async (req: AuthRequest, res: Response) => {
  const playlists = await Playlist.find({ owner: req.user!._id })
    .populate('songs', 'title artist coverImage duration')
    .sort('-createdAt');

  res.status(200).json({
    success: true,
    data: playlists
  });
});

// @desc    Create playlist
// @route   POST /api/playlists
// @access  Private
export const createPlaylist = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { name, description, isPublic } = req.body;

  if (!name) {
    throw new AppError('Playlist name is required', 400);
  }

  const playlist = await Playlist.create({
    name,
    description,
    isPublic: isPublic !== undefined ? isPublic : true,
    owner: req.user!._id,
    songs: []
  });

  res.status(201).json({
    success: true,
    message: 'Playlist created successfully',
    data: playlist
  });
});

// @desc    Get playlist by ID
// @route   GET /api/playlists/:id
// @access  Public
export const getPlaylistById = asyncHandler(async (req: AuthRequest, res: Response) => {
  const playlist = await Playlist.findById(req.params.id)
    .populate('songs')
    .populate('owner', 'name');

  if (!playlist) {
    throw new AppError('Playlist not found', 404);
  }

  // Check if playlist is private and user is not owner
  if (!playlist.isPublic && playlist.owner._id.toString() !== req.user?._id.toString()) {
    throw new AppError('You do not have access to this playlist', 403);
  }

  res.status(200).json({
    success: true,
    data: playlist
  });
});

// @desc    Update playlist
// @route   PUT /api/playlists/:id
// @access  Private
export const updatePlaylist = asyncHandler(async (req: AuthRequest, res: Response) => {
  const playlist = await Playlist.findById(req.params.id);

  if (!playlist) {
    throw new AppError('Playlist not found', 404);
  }

  // Check ownership
  if (playlist.owner.toString() !== req.user!._id.toString()) {
    throw new AppError('You can only update your own playlists', 403);
  }

  const { name, description, isPublic, coverImage } = req.body;

  if (name) playlist.name = name;
  if (description !== undefined) playlist.description = description;
  if (isPublic !== undefined) playlist.isPublic = isPublic;
  if (coverImage) playlist.coverImage = coverImage;

  await playlist.save();

  res.status(200).json({
    success: true,
    message: 'Playlist updated successfully',
    data: playlist
  });
});

// @desc    Delete playlist
// @route   DELETE /api/playlists/:id
// @access  Private
export const deletePlaylist = asyncHandler(async (req: AuthRequest, res: Response) => {
  const playlist = await Playlist.findById(req.params.id);

  if (!playlist) {
    throw new AppError('Playlist not found', 404);
  }

  // Check ownership
  if (playlist.owner.toString() !== req.user!._id.toString()) {
    throw new AppError('You can only delete your own playlists', 403);
  }

  await playlist.deleteOne();

  res.status(200).json({
    success: true,
    message: 'Playlist deleted successfully'
  });
});

// @desc    Add song to playlist
// @route   POST /api/playlists/:id/songs
// @access  Private
export const addSongToPlaylist = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { songId } = req.body;

  if (!songId) {
    throw new AppError('Song ID is required', 400);
  }

  const playlist = await Playlist.findById(req.params.id);

  if (!playlist) {
    throw new AppError('Playlist not found', 404);
  }

  // Check ownership
  if (playlist.owner.toString() !== req.user!._id.toString()) {
    throw new AppError('You can only modify your own playlists', 403);
  }

  // Check if song already in playlist
  if (playlist.songs.includes(songId)) {
    throw new AppError('Song already in playlist', 400);
  }

  playlist.songs.push(songId);
  await playlist.save();

  await playlist.populate('songs');

  res.status(200).json({
    success: true,
    message: 'Song added to playlist',
    data: playlist
  });
});

// @desc    Remove song from playlist
// @route   DELETE /api/playlists/:id/songs/:songId
// @access  Private
export const removeSongFromPlaylist = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { id, songId } = req.params;

  const playlist = await Playlist.findById(id);

  if (!playlist) {
    throw new AppError('Playlist not found', 404);
  }

  // Check ownership
  if (playlist.owner.toString() !== req.user!._id.toString()) {
    throw new AppError('You can only modify your own playlists', 403);
  }

  playlist.songs = playlist.songs.filter(s => s.toString() !== songId);
  await playlist.save();

  res.status(200).json({
    success: true,
    message: 'Song removed from playlist',
    data: playlist
  });
});

// @desc    Follow/Unfollow playlist
// @route   POST /api/playlists/:id/follow
// @access  Private
export const toggleFollowPlaylist = asyncHandler(async (req: AuthRequest, res: Response) => {
  const playlist = await Playlist.findById(req.params.id);

  if (!playlist) {
    throw new AppError('Playlist not found', 404);
  }

  if (!playlist.isPublic) {
    throw new AppError('Cannot follow private playlist', 403);
  }

  const isFollowing = playlist.followers.includes(req.user!._id);

  if (isFollowing) {
    playlist.followers = playlist.followers.filter(
      f => f.toString() !== req.user!._id.toString()
    );
  } else {
    playlist.followers.push(req.user!._id);
  }

  await playlist.save();

  res.status(200).json({
    success: true,
    message: isFollowing ? 'Playlist unfollowed' : 'Playlist followed',
    isFollowing: !isFollowing
  });
});
