'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { authAPI } from '@/lib/api';
import { useAuthStore } from '@/store/authStore';
import { useThemeStore } from '@/store/themeStore';
import toast from 'react-hot-toast';
import { FaMusic, FaArrowLeft, FaMoon, FaSun, FaEnvelope, FaRedo } from 'react-icons/fa';

export default function VerifyOTPPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const setUser = useAuthStore(state => state.setUser);
  const { theme, toggleTheme } = useThemeStore();
  
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [timeLeft, setTimeLeft] = useState(600); // 10 minutes in seconds
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const userId = searchParams.get('userId');
  const email = searchParams.get('email');
  const type = searchParams.get('type') || 'register'; // 'register' or 'login'

  useEffect(() => {
    if (!userId || !email) {
      toast.error('Invalid verification link');
      router.push(type === 'login' ? '/login' : '/register');
    }
  }, [userId, email, type, router]);

  // Timer countdown
  useEffect(() => {
    if (timeLeft <= 0) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleChange = (index: number, value: string) => {
    if (value.length > 1) {
      value = value[0];
    }

    if (!/^\d*$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').slice(0, 6);
    
    if (!/^\d+$/.test(pastedData)) {
      toast.error('Please paste only numbers');
      return;
    }

    const newOtp = pastedData.split('').concat(Array(6 - pastedData.length).fill(''));
    setOtp(newOtp);

    // Focus last filled input or first empty
    const nextIndex = Math.min(pastedData.length, 5);
    inputRefs.current[nextIndex]?.focus();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const otpString = otp.join('');
    if (otpString.length !== 6) {
      toast.error('Please enter complete OTP');
      return;
    }

    setLoading(true);

    try {
      let response;
      
      if (type === 'login') {
        // Verify login OTP
        response = await authAPI.verifyLoginOTP({
          userId: userId!,
          otp: otpString
        });
        toast.success('Login successful! Welcome back! 🎵');
      } else {
        // Verify registration OTP
        response = await authAPI.verifyOTP({
          userId: userId!,
          otp: otpString
        });
        toast.success('Email verified successfully! Welcome! 🎉');
      }
      
      setUser(response.data.user);
      router.push('/dashboard');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Invalid OTP');
      setOtp(['', '', '', '', '', '']);
      inputRefs.current[0]?.focus();
    } finally {
      setLoading(false);
    }
  };

  const handleResendOTP = async () => {
    setResending(true);

    try {
      await authAPI.resendOTP({ userId: userId! });
      toast.success('New OTP sent to your email!');
      setTimeLeft(600); // Reset timer
      setOtp(['', '', '', '', '', '']);
      inputRefs.current[0]?.focus();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to resend OTP');
    } finally {
      setResending(false);
    }
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
          <div className="text-center mb-8">
            <div className="flex items-center justify-center mb-4">
              <div className="w-16 h-16 bg-primary-500 rounded-full flex items-center justify-center">
                <FaEnvelope className="text-white" size={24} />
              </div>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              {type === 'login' ? 'Verify Login' : 'Verify Your Email'}
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              {type === 'login' 
                ? 'Enter the 6-digit code sent to' 
                : 'We\'ve sent a 6-digit code to'}
            </p>
            <p className="text-primary-500 font-medium mt-1">{email}</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* OTP Input */}
            <div>
              <label className="block text-sm font-medium mb-3 text-center text-gray-700 dark:text-gray-300">
                Enter OTP Code
              </label>
              <div className="flex gap-2 justify-center" onPaste={handlePaste}>
                {otp.map((digit, index) => (
                  <input
                    key={index}
                    ref={(el) => { inputRefs.current[index] = el; }}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleChange(index, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(index, e)}
                    className="w-12 h-14 text-center text-2xl font-bold bg-white dark:bg-dark-100 border-2 border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all text-gray-900 dark:text-white"
                    disabled={loading}
                  />
                ))}
              </div>
            </div>

            {/* Timer */}
            <div className="text-center">
              {timeLeft > 0 ? (
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Code expires in{' '}
                  <span className="font-semibold text-primary-500">
                    {formatTime(timeLeft)}
                  </span>
                </p>
              ) : (
                <p className="text-sm text-red-500 font-medium">
                  OTP has expired. Please request a new one.
                </p>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading || otp.join('').length !== 6}
              className="w-full bg-primary-500 hover:bg-primary-600 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 transform hover:scale-105"
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Verifying...
                </div>
              ) : (
                type === 'login' ? 'Verify & Login' : 'Verify Email'
              )}
            </button>
          </form>

          {/* Resend OTP */}
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
              Didn't receive the code?
            </p>
            <button
              onClick={handleResendOTP}
              disabled={resending || timeLeft > 540} // Can resend after 1 minute
              className="inline-flex items-center text-primary-500 hover:text-primary-600 font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <FaRedo className="mr-2" size={14} />
              {resending ? 'Sending...' : 'Resend OTP'}
            </button>
            {timeLeft > 540 && (
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                You can resend in {formatTime(timeLeft - 540)}
              </p>
            )}
          </div>

          {/* Help Text */}
          <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900 border border-blue-200 dark:border-blue-700 rounded-lg">
            <p className="text-sm text-blue-800 dark:text-blue-200">
              💡 <strong>Tip:</strong> Check your spam folder if you don't see the email.
              The code is valid for 10 minutes.
            </p>
          </div>

          {/* Back Link */}
          <div className="mt-8 text-center">
            <Link
              href={type === 'login' ? '/login' : '/register'}
              className="inline-flex items-center text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
            >
              <FaArrowLeft className="mr-2" size={14} />
              {type === 'login' ? 'Back to Login' : 'Back to Registration'}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}