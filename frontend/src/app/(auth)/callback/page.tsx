'use client';

import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import { authAPI } from '@/lib/api';
import toast from 'react-hot-toast';

export default function AuthCallbackPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const setUser = useAuthStore(state => state.setUser);

  useEffect(() => {
    const handleCallback = async () => {
      const success = searchParams.get('success');
      const error = searchParams.get('error');

      if (error) {
        toast.error('Authentication failed. Please try again.');
        router.push('/login');
        return;
      }

      if (success === 'true') {
        try {
          // Fetch user data from backend
          const response = await authAPI.getMe();
          setUser(response.data.user);
          toast.success('Successfully logged in! 🎉');
          router.push('/dashboard');
        } catch (err) {
          console.error('Failed to fetch user:', err);
          toast.error('Failed to complete authentication');
          router.push('/login');
        }
      } else {
        router.push('/login');
      }
    };

    handleCallback();
  }, [searchParams, router, setUser]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-dark-300">
      <div className="text-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary-500 mx-auto mb-4"></div>
        <p className="text-gray-600 dark:text-gray-400">Completing authentication...</p>
      </div>
    </div>
  );
}
