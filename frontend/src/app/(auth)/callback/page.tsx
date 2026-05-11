'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import toast from 'react-hot-toast';
import {
  FaArrowRight,
  FaCheckCircle,
  FaCompactDisc,
  FaExclamationTriangle,
  FaHeadphones,
  FaLock,
  FaMusic,
  FaRedoAlt,
  FaSignInAlt,
} from 'react-icons/fa';
import { authAPI } from '@/lib/api';
import { useAuthStore } from '@/store/authStore';

type AuthStatus = 'loading' | 'success' | 'error';

export default function AuthCallbackPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const setUser = useAuthStore((state) => state.setUser);

  const [status, setStatus] = useState<AuthStatus>('loading');
  const [message, setMessage] = useState('Finalizing your secure sign-in.');
  const [details, setDetails] = useState('We are verifying your session and preparing your dashboard.');
  const [countdown, setCountdown] = useState(4);
  const [isRetrying, setIsRetrying] = useState(false);

  const success = searchParams.get('success');
  const error = searchParams.get('error');

  const steps = useMemo(
    () => [
      {
        label: 'Provider approved',
        done: success === 'true' || Boolean(error),
      },
      {
        label: 'Session verified',
        done: status === 'success',
      },
      {
        label: 'Dashboard redirect',
        done: status === 'success' && countdown <= 1,
      },
    ],
    [countdown, error, status, success]
  );

  useEffect(() => {
    let isMounted = true;

    const handleCallback = async () => {
      setStatus('loading');
      setMessage('Finalizing your secure sign-in.');
      setDetails('We are verifying your session and preparing your dashboard.');
      setCountdown(4);

      if (error) {
        if (!isMounted) return;
        setStatus('error');
        setMessage('Authentication could not be completed.');
        setDetails('The provider returned an error or the login session expired before verification finished.');
        toast.error('Authentication failed. Please try again.');
        return;
      }

      if (success !== 'true') {
        if (!isMounted) return;
        setStatus('error');
        setMessage('No valid authentication result was found.');
        setDetails('This callback URL was opened without a successful provider response.');
        return;
      }

      try {
        const response = await authAPI.getMe();

        if (!isMounted) return;

        setUser(response.data.user);
        setStatus('success');
        setMessage(`Welcome, ${response.data.user?.name || 'music lover'}!`);
        setDetails('Your account is connected. We will send you to the dashboard in a moment.');
        toast.success('Successfully logged in!');
      } catch (err) {
        console.error('Failed to fetch user:', err);

        if (!isMounted) return;

        setStatus('error');
        setMessage('Login succeeded, but your account session was not loaded.');
        setDetails('This usually happens when the dev server refreshes mid-flow, cookies are blocked, or the backend is temporarily unavailable.');
        toast.error('Failed to complete authentication');
      }
    };

    handleCallback();

    return () => {
      isMounted = false;
    };
  }, [error, router, setUser, success]);

  useEffect(() => {
    if (status !== 'success') return;
    if (countdown <= 0) {
      router.push('/dashboard');
      return;
    }

    const timer = window.setTimeout(() => {
      setCountdown((current) => current - 1);
    }, 1000);

    return () => window.clearTimeout(timer);
  }, [countdown, router, status]);

  const handleRetry = async () => {
    setIsRetrying(true);

    try {
      const response = await authAPI.getMe();
      setUser(response.data.user);
      setStatus('success');
      setMessage(`Welcome, ${response.data.user?.name || 'music lover'}!`);
      setDetails('Your session is active now. Redirecting you to the dashboard.');
      setCountdown(2);
      toast.success('Session restored successfully!');
    } catch (err) {
      console.error('Retry failed:', err);
      toast.error('Session is still unavailable');
    } finally {
      setIsRetrying(false);
    }
  };

  const statusIcon =
    status === 'success' ? (
      <FaCheckCircle className="text-4xl text-emerald-400" />
    ) : status === 'error' ? (
      <FaExclamationTriangle className="text-4xl text-amber-400" />
    ) : (
      <div className="h-12 w-12 rounded-full border-4 border-white/15 border-t-cyan-400 animate-spin" />
    );

  const statusBadgeClass =
    status === 'success'
      ? 'border-emerald-400/30 bg-emerald-500/15 text-emerald-200'
      : status === 'error'
        ? 'border-amber-400/30 bg-amber-500/15 text-amber-200'
        : 'border-cyan-400/30 bg-cyan-500/15 text-cyan-100';

  return (
    <div className="relative min-h-screen overflow-hidden bg-[radial-gradient(circle_at_top,#1d4ed8_0%,#111827_35%,#020617_100%)] text-white">
      <div className="absolute inset-0 opacity-30">
        <div className="absolute left-10 top-16 h-32 w-32 rounded-full bg-cyan-400/30 blur-3xl" />
        <div className="absolute right-12 top-24 h-40 w-40 rounded-full bg-fuchsia-500/20 blur-3xl" />
        <div className="absolute bottom-10 left-1/2 h-56 w-56 -translate-x-1/2 rounded-full bg-emerald-400/10 blur-3xl" />
      </div>

      <div className="relative mx-auto flex min-h-screen max-w-6xl flex-col justify-center px-6 py-12">
        <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
          <section className="rounded-3xl border border-white/10 bg-white/10 p-8 shadow-2xl shadow-black/30 backdrop-blur-xl sm:p-10">
            <div className="mb-8 flex items-center justify-between gap-4">
              <div>
                <p className="mb-3 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-3 py-1 text-xs uppercase tracking-[0.3em] text-cyan-100">
                  <FaMusic className="text-cyan-300" />
                  Auth Callback
                </p>
                <h1 className="text-3xl font-bold sm:text-4xl">Signing you into Music Stream</h1>
              </div>
              <div className="hidden rounded-2xl border border-white/10 bg-white/5 p-4 sm:block">
                <FaCompactDisc className="text-4xl text-cyan-300 animate-spin" style={{ animationDuration: '6s' }} />
              </div>
            </div>

            <div className="mb-8 grid gap-4 sm:grid-cols-3">
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <p className="text-sm text-slate-300">Security</p>
                <p className="mt-2 flex items-center gap-2 text-lg font-semibold">
                  <FaLock className="text-cyan-300" />
                  Verified flow
                </p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <p className="text-sm text-slate-300">Experience</p>
                <p className="mt-2 flex items-center gap-2 text-lg font-semibold">
                  <FaHeadphones className="text-fuchsia-300" />
                  Fast redirect
                </p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <p className="text-sm text-slate-300">Status</p>
                <p className="mt-2 text-lg font-semibold">
                  {status === 'loading' ? 'Connecting account' : status === 'success' ? 'Ready to go' : 'Needs attention'}
                </p>
              </div>
            </div>

            <div className="rounded-3xl border border-white/10 bg-slate-950/40 p-6">
              <div className="mb-5 flex items-start gap-4">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/10">
                  {statusIcon}
                </div>
                <div className="min-w-0 flex-1">
                  <div className={`inline-flex rounded-full border px-3 py-1 text-xs font-medium ${statusBadgeClass}`}>
                    {status === 'loading' ? 'Processing' : status === 'success' ? 'Successful' : 'Action Needed'}
                  </div>
                  <h2 className="mt-3 text-2xl font-semibold">{message}</h2>
                  <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-300">{details}</p>
                </div>
              </div>

              <div className="mb-6 space-y-3">
                {steps.map((step, index) => (
                  <div
                    key={step.label}
                    className={`flex items-center justify-between rounded-2xl border px-4 py-3 ${
                      step.done ? 'border-emerald-400/20 bg-emerald-500/10' : 'border-white/10 bg-white/5'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-semibold ${
                          step.done ? 'bg-emerald-400 text-slate-950' : 'bg-white/10 text-slate-300'
                        }`}
                      >
                        {step.done ? <FaCheckCircle /> : index + 1}
                      </div>
                      <span className="font-medium">{step.label}</span>
                    </div>
                    <span className="text-sm text-slate-300">{step.done ? 'Done' : 'Pending'}</span>
                  </div>
                ))}
              </div>

              <div className="flex flex-wrap gap-3">
                {status === 'success' ? (
                  <>
                    <button
                      type="button"
                      onClick={() => router.push('/dashboard')}
                      className="inline-flex items-center gap-2 rounded-xl bg-cyan-400 px-5 py-3 font-semibold text-slate-950 transition hover:bg-cyan-300"
                    >
                      Open dashboard
                      <FaArrowRight />
                    </button>
                    <p className="inline-flex items-center rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-slate-200">
                      Redirecting automatically in {countdown}s
                    </p>
                  </>
                ) : status === 'error' ? (
                  <>
                    <button
                      type="button"
                      onClick={handleRetry}
                      disabled={isRetrying}
                      className="inline-flex items-center gap-2 rounded-xl bg-amber-400 px-5 py-3 font-semibold text-slate-950 transition hover:bg-amber-300 disabled:cursor-not-allowed disabled:opacity-70"
                    >
                      <FaRedoAlt className={isRetrying ? 'animate-spin' : ''} />
                      {isRetrying ? 'Retrying session' : 'Retry session check'}
                    </button>
                    <button
                      type="button"
                      onClick={() => router.push('/login')}
                      className="inline-flex items-center gap-2 rounded-xl border border-white/20 bg-white/5 px-5 py-3 font-semibold text-white transition hover:bg-white/10"
                    >
                      <FaSignInAlt />
                      Back to login
                    </button>
                  </>
                ) : (
                  <p className="inline-flex items-center rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-slate-200">
                    Please keep this tab open while we finish connecting your account.
                  </p>
                )}
              </div>
            </div>
          </section>

          <aside className="rounded-3xl border border-white/10 bg-slate-950/40 p-8 shadow-2xl shadow-black/20 backdrop-blur-xl">
            <h2 className="text-xl font-semibold">What happens here</h2>
            <p className="mt-3 text-sm leading-6 text-slate-300">
              After Google or another provider sends you back, we confirm your session, fetch your account, and restore your signed-in state before opening the main app.
            </p>

            <div className="mt-6 space-y-4">
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <p className="text-sm font-semibold text-white">Better polish</p>
                <p className="mt-1 text-sm text-slate-300">
                  Added richer loading, success, and error states so the callback route feels like part of the product.
                </p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <p className="text-sm font-semibold text-white">Extra recovery</p>
                <p className="mt-1 text-sm text-slate-300">
                  Users can retry session loading without manually refreshing or starting the login flow from scratch.
                </p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <p className="text-sm font-semibold text-white">Smarter redirect</p>
                <p className="mt-1 text-sm text-slate-300">
                  Successful login now shows a short countdown and still lets users jump straight to the dashboard immediately.
                </p>
              </div>
            </div>

            <div className="mt-8 rounded-2xl border border-cyan-400/20 bg-cyan-400/10 p-4">
              <p className="text-sm font-semibold text-cyan-100">Quick fallback</p>
              <p className="mt-1 text-sm text-cyan-50/90">
                If you still hit chunk loading issues in dev mode, restart the frontend server and clear the Next cache before retrying sign-in.
              </p>
            </div>

            <div className="mt-6 text-sm text-slate-400">
              Need a different path?
              {' '}
              <Link href="/login" className="text-cyan-300 underline decoration-cyan-400/40 underline-offset-4 hover:text-cyan-200">
                Return to login
              </Link>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
