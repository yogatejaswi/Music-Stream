import Stripe from 'stripe';
import User from '../models/User';
import Subscription from '../models/Subscription';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16' as any
});

export const createCheckoutSession = async (userId: string) => {
  // Check if Stripe is configured
  if (!process.env.STRIPE_SECRET_KEY || process.env.STRIPE_SECRET_KEY === 'sk_test_your-key') {
    throw new Error('Stripe is not configured. Please set up your Stripe API keys in the .env file.');
  }

  if (!process.env.STRIPE_PREMIUM_PRICE_ID || process.env.STRIPE_PREMIUM_PRICE_ID === 'price_your-price-id') {
    throw new Error('Stripe Premium Price ID is not configured. Please create a product in Stripe and add the price ID to .env file.');
  }

  const user = await User.findById(userId);
  
  if (!user) {
    throw new Error('User not found');
  }

  // Create or retrieve Stripe customer
  let customerId = user.subscription.stripeCustomerId;
  
  if (!customerId) {
    const customer = await stripe.customers.create({
      email: user.email,
      metadata: {
        userId: user._id.toString()
      }
    });
    customerId = customer.id;
    user.subscription.stripeCustomerId = customerId;
    await user.save();
  }

  // Create checkout session
  const session = await stripe.checkout.sessions.create({
    customer: customerId,
    payment_method_types: ['card'],
    line_items: [
      {
        price: process.env.STRIPE_PREMIUM_PRICE_ID,
        quantity: 1
      }
    ],
    mode: 'subscription',
    success_url: `${process.env.FRONTEND_URL}/subscription/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${process.env.FRONTEND_URL}/subscription/cancel`,
    metadata: {
      userId: user._id.toString()
    }
  });

  return session;
};

export const handleWebhook = async (event: Stripe.Event) => {
  switch (event.type) {
    case 'checkout.session.completed':
      await handleCheckoutComplete(event.data.object as Stripe.Checkout.Session);
      break;
      
    case 'customer.subscription.updated':
      await handleSubscriptionUpdate(event.data.object as Stripe.Subscription);
      break;
      
    case 'customer.subscription.deleted':
      await handleSubscriptionCancelled(event.data.object as Stripe.Subscription);
      break;
      
    default:
      console.log(`Unhandled event type: ${event.type}`);
  }
};

const handleCheckoutComplete = async (session: Stripe.Checkout.Session) => {
  const userId = session.metadata?.userId;
  
  if (!userId) return;

  const subscription = await stripe.subscriptions.retrieve(session.subscription as string);

  await User.findByIdAndUpdate(userId, {
    'subscription.plan': 'premium',
    'subscription.startDate': new Date(subscription.current_period_start * 1000),
    'subscription.endDate': new Date(subscription.current_period_end * 1000)
  });

  await Subscription.findOneAndUpdate(
    { user: userId },
    {
      user: userId,
      plan: 'premium',
      status: 'active',
      stripeSubscriptionId: subscription.id,
      currentPeriodStart: new Date(subscription.current_period_start * 1000),
      currentPeriodEnd: new Date(subscription.current_period_end * 1000),
      cancelAtPeriodEnd: false
    },
    { upsert: true, new: true }
  );
};

const handleSubscriptionUpdate = async (subscription: Stripe.Subscription) => {
  const userId = subscription.metadata?.userId;
  
  if (!userId) return;

  await User.findByIdAndUpdate(userId, {
    'subscription.endDate': new Date(subscription.current_period_end * 1000)
  });

  await Subscription.findOneAndUpdate(
    { stripeSubscriptionId: subscription.id },
    {
      currentPeriodEnd: new Date(subscription.current_period_end * 1000),
      cancelAtPeriodEnd: subscription.cancel_at_period_end
    }
  );
};

const handleSubscriptionCancelled = async (subscription: Stripe.Subscription) => {
  const userId = subscription.metadata?.userId;
  
  if (!userId) return;

  await User.findByIdAndUpdate(userId, {
    'subscription.plan': 'free'
  });

  await Subscription.findOneAndUpdate(
    { stripeSubscriptionId: subscription.id },
    {
      status: 'cancelled',
      plan: 'free'
    }
  );
};

export const cancelSubscription = async (userId: string) => {
  const subscription = await Subscription.findOne({ user: userId });
  
  if (!subscription || !subscription.stripeSubscriptionId) {
    throw new Error('No active subscription found');
  }

  await stripe.subscriptions.update(subscription.stripeSubscriptionId, {
    cancel_at_period_end: true
  });

  subscription.cancelAtPeriodEnd = true;
  await subscription.save();

  return subscription;
};

export default stripe;
