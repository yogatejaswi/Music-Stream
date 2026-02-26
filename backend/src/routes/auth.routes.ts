import express from 'express';
import { register, login, logout, getMe, refreshToken, verifyOTP, resendOTP, verifyLoginOTP, googleAuth, googleCallback } from '../controllers/auth.controller';
import { protect } from '../middleware/auth.middleware';
import passport from '../config/passport';

const router = express.Router();

router.post('/register', register);
router.post('/verify-otp', verifyOTP);
router.post('/resend-otp', resendOTP);
router.post('/login', login);
router.post('/verify-login-otp', verifyLoginOTP);
router.post('/logout', logout);
router.get('/me', protect, getMe);
router.post('/refresh', refreshToken);

// Google OAuth routes
router.get('/google', googleAuth);
router.get('/google/callback', passport.authenticate('google', { session: false, failureRedirect: `${process.env.FRONTEND_URL || 'http://localhost:3000'}/login?error=auth_failed` }), googleCallback);

export default router;
