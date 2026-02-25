import express from 'express';
import {
  trackPlay,
  getHistory,
  getRecentlyPlayed,
  getListeningStats,
  clearHistory
} from '../controllers/history.controller';
import { protect } from '../middleware/auth.middleware';

const router = express.Router();

router.use(protect);

router.post('/track', trackPlay);
router.get('/', getHistory);
router.get('/recent', getRecentlyPlayed);
router.get('/stats', getListeningStats);
router.delete('/', clearHistory);

export default router;
