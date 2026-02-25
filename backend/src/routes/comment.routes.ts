import express from 'express';
import {
  getSongComments,
  createComment,
  updateComment,
  deleteComment,
  toggleLikeComment
} from '../controllers/comment.controller';
import { protect } from '../middleware/auth.middleware';

const router = express.Router();

router.get('/song/:songId', getSongComments);

router.use(protect);

router.post('/', createComment);
router.put('/:id', updateComment);
router.delete('/:id', deleteComment);
router.post('/:id/like', toggleLikeComment);

export default router;
