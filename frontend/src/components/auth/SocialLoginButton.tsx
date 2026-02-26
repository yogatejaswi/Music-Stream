'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import toast from 'react-hot-toast';
import { FaGoogle, FaFacebook, FaTwitter, FaGithub, FaSpinner } from 'react-icons/fa';

interface SocialLoginButtonProps {
  provider: 'google' | 'facebook' | 'twitter' | 'github';
  mode: 'login' | 'register';
  className?: string;
}

const providerConfig = {
  google: {
    icon: FaGoogle,
    color: 'text-red-500',
    name: 'Google',
    bgColor: 'hover:bg-red-50 dark:hover:bg-red-900/20'
  },
  facebook: {
    icon: FaFacebook,
    color: 'text-blue-600',
    name: 'Facebook',
    bgColor: 'hover:bg-blue-50 dark:hover:bg-blue-900/20'
  },
  twitter: {
    icon: FaTwitter,
    color: 'text-blue-400',
    name: 'Twitter',
    bgColor: 'hover:bg-blue-50 dark:hover:bg-blue-900/20'
  },
  github: {
    icon: FaGithub,
    color: 'text-gray-800 dark:text-gray-200',
    name: 'GitHub',
    bgColor: 'hover:bg-gray-50 dark:hover:bg-gray-800/20'
  }
};

export default function SocialLoginButton({ provider, mode, className = '' }: SocialLoginButtonProps) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const setUser = useAuthStore(state => state.setUser);
  
  const config = providerConfig[provider];
  const Icon = config.icon;

  const handleSocialAuth = async () => {
    setLoading(true);
    
    try {
      // For Google OAuth, redirect to backend OAuth endpoint
      if (provider === 'google') {
        const backendUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
        window.location.href = `${backendUrl}/auth/google`;
        return;
      }
      
      // For other providers (demo implementation)
      const loadingToast = toast.loading(`Connecting to ${config.name}...`);
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const mockUser = {
        id: `${provider}_user_${Date.now()}`,
        _id: `${provider}_user_${Date.now()}`,
        name: `${config.name} User`,
        email: `user@${provider}demo.com`,
        role: 'user' as const,
        subscription: { plan: 'free' as const },
        avatar: `https://ui-avatars.com/api/?name=${config.name}&background=10b981&color=fff`,
        provider: provider,
        createdAt: new Date().toISOString()
      };
      
      toast.dismiss(loadingToast);
      setUser(mockUser);
      
      const action = mode === 'login' ? 'logged in' : 'registered';
      toast.success(`Successfully ${action} with ${config.name}! 🎉`);
      
      router.push('/dashboard');
      
    } catch (error) {
      toast.dismiss();
      toast.error(`Failed to ${mode} with ${config.name}. Please try again.`);
    } finally {
      setLoading(false);
    }
  };

  // For production OAuth implementation
  const handleProductionOAuth = () => {
    handleSocialAuth();
  };

  return (
    <button
      onClick={handleProductionOAuth}
      disabled={loading}
      data-provider={provider}
      className={`
        relative w-full inline-flex items-center justify-center py-3 px-4 
        border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm 
        bg-white dark:bg-dark-200 text-sm font-medium 
        text-gray-700 dark:text-gray-300 
        ${config.bgColor}
        hover:shadow-md transition-all duration-200 
        disabled:opacity-50 disabled:cursor-not-allowed
        focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2
        ${className}
      `}
    >
      {loading ? (
        <FaSpinner className="animate-spin mr-2" size={18} />
      ) : (
        <Icon className={`${config.color} mr-2`} size={18} />
      )}
      
      <span>
        {loading 
          ? 'Connecting...' 
          : `${mode === 'login' ? 'Sign in' : 'Sign up'} with ${config.name}`
        }
      </span>
    </button>
  );
}