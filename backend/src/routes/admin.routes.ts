import express from 'express';
import { protect, restrictTo } from '../middleware/auth.middleware';
import { uploadSong as uploadMiddleware } from '../middleware/upload.middleware';
import {
  uploadSong,
  updateSong,
  deleteSong,
  createAlbum,
  getAllUsers,
  getAnalytics
} from '../controllers/admin.controller';

const router = express.Router();

// All admin routes require authentication and admin role
router.use(protect);
router.use(restrictTo('admin'));

router.post('/songs', uploadMiddleware, uploadSong);
router.put('/songs/:id', updateSong);
router.delete('/songs/:id', deleteSong);
router.post('/albums', createAlbum);
router.get('/users', getAllUsers);
router.get('/analytics', getAnalytics);

export default router;
