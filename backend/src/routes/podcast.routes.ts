import express from 'express';
import {
  getPodcasts,
  getPodcastById,
  getPodcastEpisodes,
  getEpisodeById,
  subscribeToPodcast,
  unsubscribeFromPodcast,
  likeEpisode,
  getTrendingPodcasts,
  getPodcastCategories
} from '../controllers/podcast.controller';
import { protect } from '../middleware/auth.middleware';

const router = express.Router();

// Public routes
router.get('/', getPodcasts);
router.get('/trending', getTrendingPodcasts);
router.get('/categories', getPodcastCategories);
router.get('/:id', getPodcastById);
router.get('/:id/episodes', getPodcastEpisodes);
router.get('/episodes/:episodeId', getEpisodeById);

// Protected routes
router.post('/:id/subscribe', protect, subscribeToPodcast);
router.delete('/:id/subscribe', protect, unsubscribeFromPodcast);
router.post('/episodes/:episodeId/like', protect, likeEpisode);

export default router;