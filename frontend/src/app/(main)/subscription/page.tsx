'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import {
  FaCheck,
  FaCrown,
  FaLock,
  FaRocket,
  FaShieldAlt,
  FaTimes,
} from 'react-icons/fa';
import toast from 'react-hot-toast';
import { subscriptionAPI } from '@/lib/api';
import { useAuthStore } from '@/store/authStore';

type SubscriptionStatus = {
  plan?: 'free' | 'premium';
  status?: string;
  currentPeriodEnd?: string;
  cancelAtPeriodEnd?: boolean;
};

const PREMIUM_PRICE = 9.99;

export default function SubscriptionPage() {
  const user = useAuthStore((state) => state.user);
  const [loading, setLoading] = useState(false);
  const [statusLoading, setStatusLoading] = useState(true);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [subscriptionStatus, setSubscriptionStatus] = useState<SubscriptionStatus | null>(null);

  const stripeEnabled = process.env.NEXT_PUBLIC_STRIPE_ENABLED === 'true';
  const currentPlan = subscriptionStatus?.plan || user?.subscription?.plan || 'free';
  const taxAmount = useMemo(() => Number((PREMIUM_PRICE * 0.18).toFixed(2)), []);
  const totalAmount = useMemo(() => Number((PREMIUM_PRICE + taxAmount).toFixed(2)), [taxAmount]);

  useEffect(() => {
    const loadStatus = async () => {
      try {
        const response = await subscriptionAPI.getStatus();
        setSubscriptionStatus(response.data.data || null);
      } catch (error) {
        console.error('Failed to load subscription status:', error);
      } finally {
        setStatusLoading(false);
      }
    };

    loadStatus();
  }, []);

  const openPaymentDetails = () => {
    if (currentPlan === 'premium') {
      toast.success('You are already on Premium.');
      return;
    }

    setShowPaymentModal(true);
  };

  const handleUpgrade = async () => {
    if (!stripeEnabled) {
      toast.error('Stripe is not configured yet. Add your Stripe keys to start payments.');
      return;
    }

    setLoading(true);
    try {
      const response = await subscriptionAPI.createCheckout();
      const checkoutUrl = response.data?.data?.url;

      if (!checkoutUrl) {
        throw new Error('Checkout URL was not returned');
      }

      window.location.href = checkoutUrl;
    } catch (error: any) {
      console.error('Checkout error:', error);
      toast.error(
        error.response?.data?.message ||
          error.message ||
          'Failed to create checkout session. Payment system may not be configured.'
      );
      setLoading(false);
    }
  };

  const features = {
    free: [
      'Ad-supported listening',
      'Standard audio quality',
      'Limited skips',
      'Shuffle play',
    ],
    premium: [
      'Ad-free listening',
      'High-quality audio (320kbps)',
      'Unlimited skips',
      'Play any song',
      'Offline downloads',
      'Exclusive content',
    ],
  };

  return (
    <div className="min-h-screen p-6">
      <div className="mx-auto max-w-6xl">
        <div className="mb-12 text-center">
          <h1 className="mb-4 text-5xl font-bold">Choose Your Plan</h1>
          <p className="text-xl text-gray-400">Upgrade to Premium for uninterrupted listening and faster access to all features.</p>
        </div>

        <div className="mb-8 rounded-2xl border border-primary-500/20 bg-primary-500/10 p-5">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.22em] text-primary-300">Subscription Status</p>
              <p className="mt-2 text-2xl font-bold text-white">
                {statusLoading ? 'Checking your plan...' : currentPlan === 'premium' ? 'Premium is active' : 'You are currently on Free'}
              </p>
              <p className="mt-1 text-sm text-gray-300">
                {subscriptionStatus?.currentPeriodEnd && currentPlan === 'premium'
                  ? `Current cycle ends on ${new Date(subscriptionStatus.currentPeriodEnd).toLocaleDateString()}.`
                  : 'Your payment summary will be shown before checkout starts.'}
              </p>
            </div>
            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-gray-200">
              <FaShieldAlt className="text-emerald-400" />
              Secure Stripe checkout
            </div>
          </div>
        </div>

        {!stripeEnabled && (
          <div className="mb-8 rounded-lg border border-yellow-500/30 bg-yellow-500/10 p-4 text-center">
            <p className="text-sm text-yellow-500">
              <strong>Note:</strong> Payment processing requires Stripe configuration.
              {' '}
              Contact the administrator or add the Stripe keys in your backend `.env` before testing live checkout.
            </p>
          </div>
        )}

        <div className="grid gap-8 md:grid-cols-2">
          <div className="rounded-3xl bg-dark-200 p-8">
            <h2 className="mb-2 text-2xl font-bold">Free</h2>
            <div className="mb-6 text-4xl font-bold">
              $0<span className="text-lg text-gray-400">/month</span>
            </div>

            <ul className="mb-8 space-y-3">
              {features.free.map((feature) => (
                <li key={feature} className="flex items-center gap-3">
                  <FaCheck className="text-gray-400" />
                  <span className="text-gray-300">{feature}</span>
                </li>
              ))}
            </ul>

            {currentPlan === 'free' ? (
              <div className="btn-secondary w-full cursor-default text-center">Current Plan</div>
            ) : (
              <div className="btn-secondary w-full cursor-default text-center">Downgrade from settings</div>
            )}
          </div>

          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary-500 to-green-400 p-8">
            <div className="absolute right-4 top-4">
              <FaCrown size={32} className="text-yellow-300" />
            </div>

            <h2 className="mb-2 text-2xl font-bold text-white">Premium</h2>
            <div className="mb-6 text-4xl font-bold text-white">
              ${PREMIUM_PRICE.toFixed(2)}<span className="text-lg text-white/80">/month</span>
            </div>

            <ul className="mb-8 space-y-3">
              {features.premium.map((feature) => (
                <li key={feature} className="flex items-center gap-3">
                  <FaCheck className="text-white" />
                  <span className="text-white">{feature}</span>
                </li>
              ))}
            </ul>

            {currentPlan === 'premium' ? (
              <div className="rounded-full bg-white py-3 px-6 text-center font-semibold text-primary-500">
                Current Plan
              </div>
            ) : (
              <button
                onClick={openPaymentDetails}
                className="w-full rounded-full bg-white px-6 py-3 font-semibold text-primary-500 transition hover:bg-gray-100"
              >
                Upgrade to Premium
              </button>
            )}
          </div>
        </div>
      </div>

      {showPaymentModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
          <div className="w-full max-w-2xl rounded-3xl border border-white/10 bg-dark-200 shadow-2xl">
            <div className="flex items-center justify-between border-b border-white/10 px-6 py-5">
              <div>
                <p className="text-xs uppercase tracking-[0.24em] text-primary-300">Payment Details</p>
                <h2 className="mt-2 text-2xl font-bold text-white">Review your Premium upgrade</h2>
              </div>
              <button
                type="button"
                onClick={() => setShowPaymentModal(false)}
                className="rounded-full p-3 text-gray-400 transition hover:bg-dark-300 hover:text-white"
              >
                <FaTimes />
              </button>
            </div>

            <div className="grid gap-6 px-6 py-6 md:grid-cols-[1fr_0.9fr]">
              <div className="rounded-2xl border border-white/10 bg-dark-300 p-5">
                <div className="mb-4 flex items-center gap-3">
                  <div className="rounded-2xl bg-primary-500/15 p-3 text-primary-300">
                    <FaRocket />
                  </div>
                  <div>
                    <h3 className="font-semibold text-white">Music Stream Premium</h3>
                    <p className="text-sm text-gray-400">Monthly recurring subscription</p>
                  </div>
                </div>

                <div className="space-y-3 text-sm text-gray-300">
                  <div className="flex items-center justify-between">
                    <span>Base plan</span>
                    <span>${PREMIUM_PRICE.toFixed(2)}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Estimated tax</span>
                    <span>${taxAmount.toFixed(2)}</span>
                  </div>
                  <div className="border-t border-white/10 pt-3">
                    <div className="flex items-center justify-between text-base font-semibold text-white">
                      <span>Total due now</span>
                      <span>${totalAmount.toFixed(2)}</span>
                    </div>
                  </div>
                </div>

                <div className="mt-5 rounded-2xl border border-white/10 bg-white/5 p-4 text-sm text-gray-300">
                  <div className="mb-2 flex items-center gap-2 font-medium text-white">
                    <FaLock className="text-emerald-400" />
                    Payment flow
                  </div>
                  <p>After you continue, you will be redirected to Stripe Checkout to enter your card details securely.</p>
                </div>
              </div>

              <div className="rounded-2xl border border-primary-500/20 bg-primary-500/10 p-5">
                <h3 className="text-lg font-semibold text-white">What you unlock</h3>
                <ul className="mt-4 space-y-3">
                  {features.premium.map((feature) => (
                    <li key={feature} className="flex items-center gap-3 text-sm text-gray-100">
                      <FaCheck className="text-emerald-300" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>

                <div className="mt-6 space-y-3">
                  <button
                    type="button"
                    onClick={handleUpgrade}
                    disabled={loading}
                    className="w-full rounded-2xl bg-white px-5 py-3 font-semibold text-primary-600 transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-70"
                  >
                    {loading ? 'Starting secure checkout...' : 'Proceed to payment'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowPaymentModal(false)}
                    className="w-full rounded-2xl border border-white/10 bg-white/5 px-5 py-3 font-semibold text-white transition hover:bg-white/10"
                  >
                    Cancel
                  </button>
                </div>

                <p className="mt-4 text-xs leading-5 text-gray-300">
                  By continuing, you authorize the payment process to start in Stripe Checkout. You can cancel before confirming payment there.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
