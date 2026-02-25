import express from 'express';
import { protect } from '../middleware/auth.middleware';
import {
  createCheckout,
  getSubscriptionStatus,
  cancelUserSubscription,
  stripeWebhook
} from '../controllers/subscription.controller';

const router = express.Router();

// Webhook route (must be before body parser)
router.post('/webhook', express.raw({ type: 'application/json' }), stripeWebhook);

// Protected routes
router.post('/checkout', protect, createCheckout);
router.get('/status', protect, getSubscriptionStatus);
router.post('/cancel', protect, cancelUserSubscription);

export default router;
