import express from 'express';
import { protect } from '../middleware/auth.middleware';
import {
  getAllSongs,
  getSongById,
  playSong,
  toggleLikeSong,
  getTrendingSongs,
  getSongsByGenre,
  getRecentSongs,
  advancedSearch,
  getSongsByMood
} from '../controllers/song.controller';

const router = express.Router();

router.get('/search/advanced', advancedSearch);
router.get('/trending', getTrendingSongs);
router.get('/recent', getRecentSongs);
router.get('/genre/:genre', getSongsByGenre);
router.get('/mood/:mood', getSongsByMood);
router.get('/', getAllSongs);
router.get('/:id', getSongById);
router.post('/:id/play', protect, playSong);
router.post('/:id/like', protect, toggleLikeSong);

export default router;
