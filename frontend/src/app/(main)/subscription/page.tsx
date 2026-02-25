'use client';

import { useState } from 'react';
import { subscriptionAPI } from '@/lib/api';
import { FaCheck, FaCrown } from 'react-icons/fa';
import toast from 'react-hot-toast';
import { useAuthStore } from '@/store/authStore';

export default function SubscriptionPage() {
  const [loading, setLoading] = useState(false);
  const user = useAuthStore(state => state.user);

  const handleUpgrade = async () => {
    // Check if Stripe is configured
    if (!process.env.NEXT_PUBLIC_STRIPE_ENABLED) {
      toast.error('Payment system is not configured. Please contact administrator.');
      return;
    }
    
    setLoading(true);
    try {
      const response = await subscriptionAPI.createCheckout();
      window.location.href = response.data.data.url;
    } catch (error: any) {
      console.error('Checkout error:', error);
      toast.error(error.response?.data?.message || 'Failed to create checkout session. Payment system may not be configured.');
      setLoading(false);
    }
  };

  const features = {
    free: [
      'Ad-supported listening',
      'Standard audio quality',
      'Limited skips',
      'Shuffle play'
    ],
    premium: [
      'Ad-free listening',
      'High-quality audio (320kbps)',
      'Unlimited skips',
      'Play any song',
      'Offline downloads',
      'Exclusive content'
    ]
  };

  return (
    <div className="min-h-screen p-6 flex items-center justify-center">
      <div className="max-w-6xl w-full">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold mb-4">Choose Your Plan</h1>
          <p className="text-xl text-gray-400">Upgrade to Premium for the best experience</p>
        </div>

        {/* Stripe Configuration Notice */}
        <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4 mb-8 text-center">
          <p className="text-yellow-500 text-sm">
            <strong>Note:</strong> Payment processing requires Stripe configuration. 
            Contact the administrator to set up payment processing.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Free Plan */}
          <div className="bg-dark-200 rounded-lg p-8">
            <h2 className="text-2xl font-bold mb-2">Free</h2>
            <div className="text-4xl font-bold mb-6">$0<span className="text-lg text-gray-400">/month</span></div>
            
            <ul className="space-y-3 mb-8">
              {features.free.map((feature, index) => (
                <li key={index} className="flex items-center gap-3">
                  <FaCheck className="text-gray-400" />
                  <span className="text-gray-300">{feature}</span>
                </li>
              ))}
            </ul>

            {user?.subscription?.plan === 'free' && (
              <div className="btn-secondary w-full text-center cursor-default">
                Current Plan
              </div>
            )}
          </div>

          {/* Premium Plan */}
          <div className="bg-gradient-to-br from-primary-500 to-green-400 rounded-lg p-8 relative overflow-hidden">
            <div className="absolute top-4 right-4">
              <FaCrown size={32} className="text-yellow-300" />
            </div>

            <h2 className="text-2xl font-bold mb-2 text-white">Premium</h2>
            <div className="text-4xl font-bold mb-6 text-white">
              $9.99<span className="text-lg text-white/80">/month</span>
            </div>
            
            <ul className="space-y-3 mb-8">
              {features.premium.map((feature, index) => (
                <li key={index} className="flex items-center gap-3">
                  <FaCheck className="text-white" />
                  <span className="text-white">{feature}</span>
                </li>
              ))}
            </ul>

            {user?.subscription?.plan === 'premium' ? (
              <div className="bg-white text-primary-500 font-semibold py-3 px-6 rounded-full text-center">
                Current Plan
              </div>
            ) : (
              <button
                onClick={handleUpgrade}
                disabled={loading}
                className="bg-white text-primary-500 hover:bg-gray-100 font-semibold py-3 px-6 rounded-full w-full transition"
              >
                {loading ? 'Processing...' : 'Upgrade to Premium'}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
