import { Response } from 'express';
import { asyncHandler, AppError } from '../middleware/error.middleware';
import { AuthRequest } from '../middleware/auth.middleware';
import Comment from '../models/Comment';

// @desc    Get comments for a song
// @route   GET /api/comments/song/:songId
// @access  Public
export const getSongComments = asyncHandler(async (req: AuthRequest, res: Response) => {
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 20;
  const skip = (page - 1) * limit;

  const comments = await Comment.find({ song: req.params.songId })
    .populate('user', 'name profileImage')
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);

  const total = await Comment.countDocuments({ song: req.params.songId });

  res.status(200).json({
    success: true,
    data: comments,
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit)
    }
  });
});

// @desc    Create comment
// @route   POST /api/comments
// @access  Private
export const createComment = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { songId, text } = req.body;

  const comment = await Comment.create({
    user: req.user!._id,
    song: songId,
    text
  });

  await comment.populate('user', 'name profileImage');

  res.status(201).json({
    success: true,
    data: comment
  });
});

// @desc    Update comment
// @route   PUT /api/comments/:id
// @access  Private
export const updateComment = asyncHandler(async (req: AuthRequest, res: Response) => {
  let comment = await Comment.findById(req.params.id);

  if (!comment) {
    throw new AppError('Comment not found', 404);
  }

  // Check ownership
  if (comment.user.toString() !== req.user!._id.toString()) {
    throw new AppError('Not authorized to update this comment', 403);
  }

  comment = await Comment.findByIdAndUpdate(
    req.params.id,
    { text: req.body.text },
    { new: true, runValidators: true }
  ).populate('user', 'name profileImage');

  res.status(200).json({
    success: true,
    data: comment
  });
});

// @desc    Delete comment
// @route   DELETE /api/comments/:id
// @access  Private
export const deleteComment = asyncHandler(async (req: AuthRequest, res: Response) => {
  const comment = await Comment.findById(req.params.id);

  if (!comment) {
    throw new AppError('Comment not found', 404);
  }

  // Check ownership or admin
  if (comment.user.toString() !== req.user!._id.toString() && req.user!.role !== 'admin') {
    throw new AppError('Not authorized to delete this comment', 403);
  }

  await comment.deleteOne();

  res.status(200).json({
    success: true,
    message: 'Comment deleted successfully'
  });
});

// @desc    Like/unlike comment
// @route   POST /api/comments/:id/like
// @access  Private
export const toggleLikeComment = asyncHandler(async (req: AuthRequest, res: Response) => {
  const comment = await Comment.findById(req.params.id);

  if (!comment) {
    throw new AppError('Comment not found', 404);
  }

  const isLiked = comment.likes.includes(req.user!._id);

  if (isLiked) {
    comment.likes = comment.likes.filter(id => id.toString() !== req.user!._id.toString());
  } else {
    comment.likes.push(req.user!._id);
  }

  await comment.save();

  res.status(200).json({
    success: true,
    message: isLiked ? 'Comment unliked' : 'Comment liked',
    isLiked: !isLiked,
    likesCount: comment.likes.length
  });
});
