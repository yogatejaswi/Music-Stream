'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { authAPI } from '@/lib/api';
import { useAuthStore } from '@/store/authStore';
import { useThemeStore } from '@/store/themeStore';
import toast from 'react-hot-toast';
import { FaEye, FaEyeSlash, FaMusic, FaMoon, FaSun } from 'react-icons/fa';
import SocialLoginSection from '@/components/auth/SocialLoginSection';

export default function LoginPage() {
  const router = useRouter();
  const setUser = useAuthStore(state => state.setUser);
  const { theme, toggleTheme } = useThemeStore();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [formData, setFormData] = useState({
    email: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await authAPI.login(formData);
      console.log('Login response:', response.data);
      
      // Check if OTP is required
      if (response.data.requiresOTP) {
        // Save login state if remember me is checked
        if (rememberMe) {
          localStorage.setItem('rememberLogin', 'true');
        }
        
        toast.success('OTP sent to your email! 📧');
        
        // Redirect to OTP verification page with userId and email
        router.push(`/verify-otp?userId=${response.data.userId}&email=${response.data.email}&type=login`);
      } else {
        // Direct login (fallback for old flow)
        setUser(response.data.user);
        toast.success('Welcome back! 🎵');
        router.push('/dashboard');
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = async () => {
    setFormData({
      email: 'prasanna@gmail.com'
    });
    toast.success('Demo email loaded! Click Send OTP to continue.');
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Side - Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-primary-500 via-purple-600 to-pink-500 relative overflow-hidden">
        <div className="absolute inset-0 bg-black bg-opacity-20"></div>
        <div className="relative z-10 flex flex-col justify-center items-center text-white p-12">
          <div className="text-center mb-8">
            <FaMusic size={80} className="mx-auto mb-6 animate-pulse" />
            <h1 className="text-5xl font-bold mb-4">Music Stream</h1>
            <p className="text-xl opacity-90 mb-8">Your world of music awaits</p>
          </div>
          
          <div className="grid grid-cols-2 gap-6 text-center">
            <div className="bg-white bg-opacity-10 rounded-lg p-4 backdrop-blur-sm">
              <h3 className="text-2xl font-bold">10M+</h3>
              <p className="text-sm opacity-80">Songs</p>
            </div>
            <div className="bg-white bg-opacity-10 rounded-lg p-4 backdrop-blur-sm">
              <h3 className="text-2xl font-bold">1M+</h3>
              <p className="text-sm opacity-80">Artists</p>
            </div>
            <div className="bg-white bg-opacity-10 rounded-lg p-4 backdrop-blur-sm">
              <h3 className="text-2xl font-bold">50M+</h3>
              <p className="text-sm opacity-80">Users</p>
            </div>
            <div className="bg-white bg-opacity-10 rounded-lg p-4 backdrop-blur-sm">
              <h3 className="text-2xl font-bold">24/7</h3>
              <p className="text-sm opacity-80">Streaming</p>
            </div>
          </div>
        </div>
        
        {/* Floating music notes animation */}
        <div className="absolute top-20 left-20 text-white opacity-20 animate-bounce">♪</div>
        <div className="absolute top-40 right-32 text-white opacity-20 animate-bounce delay-1000">♫</div>
        <div className="absolute bottom-32 left-16 text-white opacity-20 animate-bounce delay-500">♪</div>
        <div className="absolute bottom-20 right-20 text-white opacity-20 animate-bounce delay-1500">♫</div>
      </div>

      {/* Right Side - Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-gray-50 dark:bg-dark-300">
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

          <div className="text-center mb-8">
            <div className="flex items-center justify-center mb-4">
              <FaMusic className="text-primary-500 mr-3" size={32} />
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Welcome Back</h1>
            </div>
            <p className="text-gray-600 dark:text-gray-400">Enter your email to receive a login code</p>
          </div>

          {/* Demo Login Button */}
          <button
            onClick={handleDemoLogin}
            className="w-full mb-6 py-3 px-4 bg-gradient-to-r from-green-500 to-blue-500 text-white rounded-lg hover:from-green-600 hover:to-blue-600 transition-all duration-200 font-medium"
          >
            🎵 Try Demo Account
          </button>

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
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
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
                  Sending OTP...
                </div>
              ) : (
                'Send Login Code'
              )}
            </button>
          </form>

          {/* Social Login */}
          <SocialLoginSection mode="login" />

          <p className="text-center mt-8 text-gray-600 dark:text-gray-400">
            Don't have an account?{' '}
            <Link href="/register" className="text-primary-500 hover:text-primary-600 font-medium hover:underline">
              Create one now
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
