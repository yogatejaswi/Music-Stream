'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useThemeStore } from '@/store/themeStore';
import toast from 'react-hot-toast';
import { FaMusic, FaArrowLeft, FaMoon, FaSun, FaEnvelope } from 'react-icons/fa';

export default function ForgotPasswordPage() {
  const { theme, toggleTheme } = useThemeStore();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Simulate API call
    setTimeout(() => {
      setEmailSent(true);
      setLoading(false);
      toast.success('Password reset email sent!');
    }, 2000);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-dark-300 px-4">
      <div className="w-full max-w-md">
        {/* Theme Toggle */}
        <div className="flex justify-end mb-6">
          <button
            onClick={toggleTheme}
            className="p-2 rounded-full bg-gray-200 dark:bg-dark-200 hover:bg-gray-300 dark:hover:bg-dark-100 transition-colors"
          >
            {theme === 'dark' ? (
              <FaSun className="text-yellow-500" size={20} />
            ) : (
              <FaMoon className="text-gray-600" size={20} />
            )}
          </button>
        </div>

        <div className="bg-white dark:bg-dark-200 rounded-2xl shadow-xl p-8">
          {!emailSent ? (
            <>
              <div className="text-center mb-8">
                <div className="flex items-center justify-center mb-4">
                  <FaMusic className="text-primary-500 mr-3" size={32} />
                  <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Reset Password</h1>
                </div>
                <p className="text-gray-600 dark:text-gray-400">
                  Enter your email address and we'll send you a link to reset your password.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                    Email Address
                  </label>
                  <input
                    type="email"
                    required
                    className="w-full bg-white dark:bg-dark-100 border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-3 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-primary-500 hover:bg-primary-600 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 transform hover:scale-105"
                >
                  {loading ? (
                    <div className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                      Sending...
                    </div>
                  ) : (
                    'Send Reset Link'
                  )}
                </button>
              </form>
            </>
          ) : (
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto mb-4">
                <FaEnvelope className="text-green-600 dark:text-green-400" size={24} />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Check Your Email</h2>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                We've sent a password reset link to <strong>{email}</strong>
              </p>
              <div className="bg-blue-50 dark:bg-blue-900 border border-blue-200 dark:border-blue-700 rounded-lg p-4 mb-6">
                <p className="text-blue-800 dark:text-blue-200 text-sm">
                  Didn't receive the email? Check your spam folder or try again in a few minutes.
                </p>
              </div>
            </div>
          )}

          <div className="mt-8 text-center">
            <Link
              href="/login"
              className="inline-flex items-center text-primary-500 hover:text-primary-600 font-medium hover:underline"
            >
              <FaArrowLeft className="mr-2" size={14} />
              Back to Login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}