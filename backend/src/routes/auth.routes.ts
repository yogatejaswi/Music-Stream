import express from 'express';
import { register, login, logout, getMe, refreshToken, verifyOTP, resendOTP, verifyLoginOTP } from '../controllers/auth.controller';
import { protect } from '../middleware/auth.middleware';

const router = express.Router();

router.post('/register', register);
router.post('/verify-otp', verifyOTP);
router.post('/resend-otp', resendOTP);
router.post('/login', login);
router.post('/verify-login-otp', verifyLoginOTP);
router.post('/logout', logout);
router.get('/me', protect, getMe);
router.post('/refresh', refreshToken);

export default router;
