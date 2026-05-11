'use client';

import Link from 'next/link';
import { FaCheckCircle, FaCrown, FaArrowRight } from 'react-icons/fa';

export default function SubscriptionSuccessPage() {
  return (
    <div className="min-h-screen bg-dark-300 p-6">
      <div className="mx-auto flex min-h-[80vh] max-w-3xl items-center justify-center">
        <div className="w-full rounded-3xl border border-emerald-400/20 bg-emerald-500/10 p-10 text-center">
          <div className="mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-full bg-emerald-500/15 text-emerald-300">
            <FaCheckCircle size={34} />
          </div>
          <p className="text-xs uppercase tracking-[0.24em] text-emerald-300">Payment Received</p>
          <h1 className="mt-3 text-4xl font-bold text-white">Premium checkout completed</h1>
          <p className="mx-auto mt-4 max-w-xl text-sm leading-6 text-gray-300">
            Your payment process has finished successfully. If the subscription badge does not update immediately, give the webhook a moment and then refresh your account.
          </p>

          <div className="mt-8 grid gap-4 md:grid-cols-2">
            <div className="rounded-2xl border border-white/10 bg-dark-200 p-5 text-left">
              <div className="mb-3 flex items-center gap-2 text-amber-300">
                <FaCrown />
                <span className="font-semibold text-white">Premium benefits</span>
              </div>
              <p className="text-sm text-gray-300">Ad-free listening, offline downloads, higher quality audio, and unlimited skips.</p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-dark-200 p-5 text-left">
              <div className="mb-3 flex items-center gap-2 text-primary-300">
                <FaArrowRight />
                <span className="font-semibold text-white">Next step</span>
              </div>
              <p className="text-sm text-gray-300">Head back to the dashboard and start using the upgraded experience.</p>
            </div>
          </div>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/dashboard"
              className="rounded-2xl bg-primary-500 px-5 py-3 font-semibold text-white transition hover:bg-primary-600"
            >
              Go to dashboard
            </Link>
            <Link
              href="/subscription"
              className="rounded-2xl border border-white/10 bg-white/5 px-5 py-3 font-semibold text-white transition hover:bg-white/10"
            >
              View subscription
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
