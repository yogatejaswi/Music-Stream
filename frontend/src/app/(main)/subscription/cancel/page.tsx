'use client';

import Link from 'next/link';
import { FaArrowLeft, FaCreditCard, FaTimesCircle } from 'react-icons/fa';

export default function SubscriptionCancelPage() {
  return (
    <div className="min-h-screen bg-dark-300 p-6">
      <div className="mx-auto flex min-h-[80vh] max-w-3xl items-center justify-center">
        <div className="w-full rounded-3xl border border-amber-400/20 bg-amber-500/10 p-10 text-center">
          <div className="mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-full bg-amber-500/15 text-amber-300">
            <FaTimesCircle size={34} />
          </div>
          <p className="text-xs uppercase tracking-[0.24em] text-amber-300">Checkout Cancelled</p>
          <h1 className="mt-3 text-4xl font-bold text-white">Payment was not completed</h1>
          <p className="mx-auto mt-4 max-w-xl text-sm leading-6 text-gray-300">
            No worries. Your plan has not changed, and no subscription upgrade was completed. You can review the payment details again whenever you are ready.
          </p>

          <div className="mt-8 rounded-2xl border border-white/10 bg-dark-200 p-5 text-left">
            <div className="mb-3 flex items-center gap-2 text-primary-300">
              <FaCreditCard />
              <span className="font-semibold text-white">Need to try again?</span>
            </div>
            <p className="text-sm text-gray-300">
              Return to the subscription page, review the payment summary, and restart checkout when you are ready.
            </p>
          </div>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/subscription"
              className="rounded-2xl bg-primary-500 px-5 py-3 font-semibold text-white transition hover:bg-primary-600"
            >
              Try again
            </Link>
            <Link
              href="/dashboard"
              className="rounded-2xl border border-white/10 bg-white/5 px-5 py-3 font-semibold text-white transition hover:bg-white/10"
            >
              <span className="inline-flex items-center gap-2">
                <FaArrowLeft />
                Back to dashboard
              </span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
