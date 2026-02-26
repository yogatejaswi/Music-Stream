import express from 'express';
import {
  getSongLyrics,
  addLyrics,
  updateLyrics,
  deleteLyrics,
  searchLyrics,
  getAllLyrics,
  fetchLyrics
} from '../controllers/lyrics.controller';
import { protect, restrictTo } from '../middleware/auth.middleware';

const router = express.Router();

// Public routes
router.get('/song/:songId', getSongLyrics);
router.get('/search', searchLyrics);

// Protected routes
router.use(protect);

// Admin only routes
router.post('/', restrictTo('admin'), addLyrics);
router.get('/', restrictTo('admin'), getAllLyrics);
router.put('/:id', restrictTo('admin'), updateLyrics);
router.delete('/:id', restrictTo('admin'), deleteLyrics);
router.post('/fetch/:songId', restrictTo('admin'), fetchLyrics);

export default router;