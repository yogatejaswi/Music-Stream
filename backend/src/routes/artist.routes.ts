import express from 'express';
import {
  getArtists,
  getArtistById,
  toggleFollowArtist,
  createArtist,
  updateArtist,
  deleteArtist,
  getTopArtists
} from '../controllers/artist.controller';
import { protect, restrictTo } from '../middleware/auth.middleware';

const router = express.Router();

router.get('/', getArtists);
router.get('/top', getTopArtists);
router.get('/:id', getArtistById);

router.use(protect);

router.post('/:id/follow', toggleFollowArtist);

// Admin routes
router.post('/', restrictTo('admin'), createArtist);
router.put('/:id', restrictTo('admin'), updateArtist);
router.delete('/:id', restrictTo('admin'), deleteArtist);

export default router;
