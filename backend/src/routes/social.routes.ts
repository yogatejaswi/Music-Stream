import express from 'express';
import {
  toggleFollowUser,
  getUserFollowers,
  getUserFollowing,
  getActivityFeed,
  getUserProfile,
  updateProfile,
  searchUsers
} from '../controllers/social.controller';
import { protect } from '../middleware/auth.middleware';

const router = express.Router();

router.get('/search', searchUsers);
router.get('/profile/:userId', getUserProfile);
router.get('/followers/:userId', getUserFollowers);
router.get('/following/:userId', getUserFollowing);

router.use(protect);

router.post('/follow/:userId', toggleFollowUser);
router.get('/feed', getActivityFeed);
router.put('/profile', updateProfile);

export default router;
