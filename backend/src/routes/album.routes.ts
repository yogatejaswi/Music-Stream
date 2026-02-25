import express from 'express';
import {
  getAlbums,
  getAlbumById,
  createAlbum,
  updateAlbum,
  deleteAlbum,
  addSongToAlbum,
  removeSongFromAlbum
} from '../controllers/album.controller';
import { protect, restrictTo } from '../middleware/auth.middleware';

const router = express.Router();

router.get('/', getAlbums);
router.get('/:id', getAlbumById);

// Admin routes
router.use(protect, restrictTo('admin'));

router.post('/', createAlbum);
router.put('/:id', updateAlbum);
router.delete('/:id', deleteAlbum);
router.post('/:id/songs', addSongToAlbum);
router.delete('/:id/songs/:songId', removeSongFromAlbum);

export default router;
