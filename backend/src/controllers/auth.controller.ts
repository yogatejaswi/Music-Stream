import { Request, Response } from 'express';
import User from '../models/User';
import { asyncHandler, AppError } from '../middleware/error.middleware';
import { generateAccessToken, generateRefreshToken, setTokenCookies, clearTokenCookies } from '../utils/jwt.utils';
import { AuthRequest } from '../middleware/auth.middleware';
import { generateOTP, sendOTPEmail, sendWelcomeEmail, sendLoginOTPEmail } from '../services/email.service';

// @desc    Register new user (Step 1: Send OTP)
// @route   POST /api/auth/register
// @access  Public
export const register = asyncHandler(async (req: Request, res: Response) => {
  const { email, password, name } = req.body;

  // Check if user exists
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new AppError('User already exists with this email', 400);
  }

  // Generate OTP
  const otp = generateOTP();
  const otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

  // Create user with unverified email
  const user = await User.create({
    email,
    password,
    name,
    otp,
    otpExpiry,
    emailVerified: false
  });

  // Send OTP email
  await sendOTPEmail(email, otp, name);

  res.status(201).json({
    success: true,
    message: 'OTP sent to your email. Please verify to complete registration.',
    userId: user._id,
    email: user.email
  });
});

// @desc    Verify OTP and complete registration
// @route   POST /api/auth/verify-otp
// @access  Public
export const verifyOTP = asyncHandler(async (req: Request, res: Response) => {
  const { userId, otp } = req.body;

  if (!userId || !otp) {
    throw new AppError('Please provide user ID and OTP', 400);
  }

  // Find user with OTP
  const user = await User.findById(userId).select('+otp +otpExpiry');

  if (!user) {
    throw new AppError('User not found', 404);
  }

  if (user.emailVerified) {
    throw new AppError('Email already verified', 400);
  }

  // Check if OTP is valid
  if (!user.otp || !user.otpExpiry) {
    throw new AppError('No OTP found. Please request a new one.', 400);
  }

  if (user.otp !== otp) {
    throw new AppError('Invalid OTP', 400);
  }

  if (new Date() > user.otpExpiry) {
    throw new AppError('OTP has expired. Please request a new one.', 400);
  }

  // Mark email as verified and clear OTP
  user.emailVerified = true;
  user.otp = undefined;
  user.otpExpiry = undefined;
  await user.save();

  // Send welcome email
  await sendWelcomeEmail(user.email, user.name);

  // Generate tokens
  const accessToken = generateAccessToken(user._id.toString());
  const refreshToken = generateRefreshToken(user._id.toString());

  // Set cookies
  setTokenCookies(res, accessToken, refreshToken);

  res.status(200).json({
    success: true,
    message: 'Email verified successfully! Welcome to Music Stream!',
    user: {
      id: user._id,
      email: user.email,
      name: user.name,
      role: user.role,
      subscription: user.subscription,
      emailVerified: user.emailVerified
    }
  });
});

// @desc    Resend OTP
// @route   POST /api/auth/resend-otp
// @access  Public
export const resendOTP = asyncHandler(async (req: Request, res: Response) => {
  const { userId } = req.body;

  if (!userId) {
    throw new AppError('Please provide user ID', 400);
  }

  const user = await User.findById(userId);

  if (!user) {
    throw new AppError('User not found', 404);
  }

  if (user.emailVerified) {
    throw new AppError('Email already verified', 400);
  }

  // Generate new OTP
  const otp = generateOTP();
  const otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

  user.otp = otp;
  user.otpExpiry = otpExpiry;
  await user.save();

  // Send OTP email
  await sendOTPEmail(user.email, otp, user.name);

  res.status(200).json({
    success: true,
    message: 'New OTP sent to your email'
  });
});

// @desc    Login user (Step 1: Send OTP - Passwordless)
// @route   POST /api/auth/login
// @access  Public
export const login = asyncHandler(async (req: Request, res: Response) => {
  const { email } = req.body;

  // Check if email provided
  if (!email) {
    throw new AppError('Please provide email address', 400);
  }

  // Find user
  const user = await User.findOne({ email });

  if (!user) {
    throw new AppError('No account found with this email', 404);
  }

  // Check if email is verified
  if (!user.emailVerified) {
    throw new AppError('Please verify your email first', 401);
  }

  // Generate OTP for login
  const otp = generateOTP();
  const otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

  user.otp = otp;
  user.otpExpiry = otpExpiry;
  await user.save();

  // Send OTP email for login
  await sendLoginOTPEmail(user.email, otp, user.name);

  res.status(200).json({
    success: true,
    message: 'OTP sent to your email. Please verify to complete login.',
    userId: user._id,
    email: user.email,
    requiresOTP: true
  });
});

// @desc    Verify login OTP
// @route   POST /api/auth/verify-login-otp
// @access  Public
export const verifyLoginOTP = asyncHandler(async (req: Request, res: Response) => {
  const { userId, otp } = req.body;

  if (!userId || !otp) {
    throw new AppError('Please provide user ID and OTP', 400);
  }

  // Find user with OTP
  const user = await User.findById(userId).select('+otp +otpExpiry');

  if (!user) {
    throw new AppError('User not found', 404);
  }

  // Check if OTP is valid
  if (!user.otp || !user.otpExpiry) {
    throw new AppError('No OTP found. Please request a new one.', 400);
  }

  if (user.otp !== otp) {
    throw new AppError('Invalid OTP', 400);
  }

  if (new Date() > user.otpExpiry) {
    throw new AppError('OTP has expired. Please request a new one.', 400);
  }

  // Clear OTP and update last login
  user.otp = undefined;
  user.otpExpiry = undefined;
  user.lastLogin = new Date();
  await user.save();

  // Generate tokens
  const accessToken = generateAccessToken(user._id.toString());
  const refreshToken = generateRefreshToken(user._id.toString());

  // Set cookies
  setTokenCookies(res, accessToken, refreshToken);

  res.status(200).json({
    success: true,
    message: 'Login successful',
    user: {
      id: user._id,
      email: user.email,
      name: user.name,
      role: user.role,
      subscription: user.subscription
    }
  });
});

// @desc    Logout user
// @route   POST /api/auth/logout
// @access  Private
export const logout = asyncHandler(async (_req: Request, res: Response) => {
  clearTokenCookies(res);

  res.status(200).json({
    success: true,
    message: 'Logout successful'
  });
});

// @desc    Get current user
// @route   GET /api/auth/me
// @access  Private
export const getMe = asyncHandler(async (req: AuthRequest, res: Response) => {
  const user = await User.findById(req.user!._id)
    .populate('likedSongs')
    .populate('playlists');

  res.status(200).json({
    success: true,
    user
  });
});

// @desc    Refresh access token
// @route   POST /api/auth/refresh
// @access  Public
export const refreshToken = asyncHandler(async (req: Request, res: Response) => {
  const { refreshToken: token } = req.cookies;

  if (!token) {
    throw new AppError('No refresh token provided', 401);
  }

  // Verify refresh token
  const jwt = require('jsonwebtoken');
  const decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET!) as { id: string };

  // Generate new access token
  const accessToken = generateAccessToken(decoded.id);

  res.cookie('accessToken', accessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 15 * 60 * 1000
  });

  res.status(200).json({
    success: true,
    message: 'Token refreshed successfully'
  });
});
