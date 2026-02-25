import express from 'express';
import { protect } from '../middleware/auth.middleware';
import {
  getUserProfile,
  updateUserProfile,
  getLikedSongs,
  getRecentlyPlayed,
  getRecommendations,
  searchContent
} from '../controllers/user.controller';

const router = express.Router();

// All user routes require authentication
router.use(protect);

router.get('/profile', getUserProfile);
router.put('/profile', updateUserProfile);
router.get('/liked-songs', getLikedSongs);
router.get('/recently-played', getRecentlyPlayed);
router.get('/recommendations', getRecommendations);
router.get('/search', searchContent);

export default router;
