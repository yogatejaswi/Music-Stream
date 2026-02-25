import express from 'express';
import { protect } from '../middleware/auth.middleware';
import {
  getUserPlaylists,
  createPlaylist,
  getPlaylistById,
  updatePlaylist,
  deletePlaylist,
  addSongToPlaylist,
  removeSongFromPlaylist,
  toggleFollowPlaylist
} from '../controllers/playlist.controller';

const router = express.Router();

// All playlist routes require authentication
router.use(protect);

router.get('/', getUserPlaylists);
router.post('/', createPlaylist);
router.get('/:id', getPlaylistById);
router.put('/:id', updatePlaylist);
router.delete('/:id', deletePlaylist);
router.post('/:id/songs', addSongToPlaylist);
router.delete('/:id/songs/:songId', removeSongFromPlaylist);
router.post('/:id/follow', toggleFollowPlaylist);

export default router;
