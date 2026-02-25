import { Response } from 'express';
import { asyncHandler, AppError } from '../middleware/error.middleware';
import { AuthRequest } from '../middleware/auth.middleware';
import { createCheckoutSession, cancelSubscription, handleWebhook } from '../services/stripe.service';
import Subscription from '../models/Subscription';
import Stripe from 'stripe';

// @desc    Create checkout session
// @route   POST /api/subscription/checkout
// @access  Private
export const createCheckout = asyncHandler(async (req: AuthRequest, res: Response) => {
  const session = await createCheckoutSession(req.user!._id.toString());

  res.status(200).json({
    success: true,
    data: {
      sessionId: session.id,
      url: session.url
    }
  });
});

// @desc    Get subscription status
// @route   GET /api/subscription/status
// @access  Private
export const getSubscriptionStatus = asyncHandler(async (req: AuthRequest, res: Response) => {
  const subscription = await Subscription.findOne({ user: req.user!._id });

  res.status(200).json({
    success: true,
    data: subscription || {
      plan: 'free',
      status: 'active'
    }
  });
});

// @desc    Cancel subscription
// @route   POST /api/subscription/cancel
// @access  Private
export const cancelUserSubscription = asyncHandler(async (req: AuthRequest, res: Response) => {
  const subscription = await cancelSubscription(req.user!._id.toString());

  res.status(200).json({
    success: true,
    message: 'Subscription will be cancelled at the end of the billing period',
    data: subscription
  });
});

// @desc    Stripe webhook handler
// @route   POST /api/subscription/webhook
// @access  Public (Stripe)
export const stripeWebhook = asyncHandler(async (req: any, res: Response) => {
  const sig = req.headers['stripe-signature'];
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

  let event: Stripe.Event;

  try {
    event = Stripe.webhooks.constructEvent(req.body, sig, webhookSecret);
  } catch (err: any) {
    throw new AppError(`Webhook Error: ${err.message}`, 400);
  }

  await handleWebhook(event);

  res.status(200).json({ received: true });
});
