import express from 'express';
import {
  getDashboardStats,
  getCharts,
  getGenreStats,
  getUserAnalytics,
  getSongAnalytics
} from '../controllers/analytics.controller';
import { protect, restrictTo } from '../middleware/auth.middleware';

const router = express.Router();

router.get('/charts', getCharts);
router.get('/genres', getGenreStats);

// Admin routes
router.use(protect, restrictTo('admin'));

router.get('/dashboard', getDashboardStats);
router.get('/users', getUserAnalytics);
router.get('/songs/:songId', getSongAnalytics);

export default router;
