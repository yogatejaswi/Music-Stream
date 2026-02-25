'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { FaHome, FaSearch, FaMusic, FaHeart, FaCrown, FaSignOutAlt, FaUserShield, FaHistory, FaTrophy, FaCog, FaRss } from 'react-icons/fa';
import { useAuthStore } from '@/store/authStore';
import { authAPI } from '@/lib/api';
import toast from 'react-hot-toast';

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuthStore();

  console.log('Sidebar user data:', user);

  const handleLogout = async () => {
    try {
      await authAPI.logout();
      logout();
      toast.success('Logged out successfully');
      router.push('/');
    } catch (error) {
      toast.error('Logout failed');
    }
  };

  const navItems = [
    { icon: FaHome, label: 'Home', href: '/dashboard' },
    { icon: FaSearch, label: 'Search', href: '/search' },
    { icon: FaMusic, label: 'Library', href: '/library' },
    { icon: FaHeart, label: 'Liked Songs', href: '/liked' },
    { icon: FaRss, label: 'Activity Feed', href: '/feed' },
  ];

  // Add history and charts for all users
  navItems.push(
    { icon: FaHistory, label: 'History', href: '/history' },
    { icon: FaTrophy, label: 'Charts', href: '/charts' },
    { icon: FaCog, label: 'Settings', href: '/settings' }
  );

  // Add admin link if user is admin
  if (user?.role === 'admin') {
    navItems.push({ icon: FaUserShield, label: 'Admin', href: '/admin' });
  }

  return (
    <aside className="w-64 bg-dark-400 flex flex-col h-screen">
      <div className="p-6 flex-shrink-0">
        <h1 className="text-2xl font-bold text-primary-500">Music Stream</h1>
      </div>

      <nav className="flex-1 px-3 overflow-y-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-4 px-4 py-3 rounded-lg mb-2 transition ${
                isActive
                  ? 'bg-dark-200 text-white'
                  : 'text-gray-400 hover:text-white hover:bg-dark-200'
              }`}
            >
              <Icon size={20} />
              <span className="font-medium">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-gray-800 space-y-3 flex-shrink-0">
        {user?.subscription?.plan === 'free' && (
          <Link
            href="/subscription"
            className="flex items-center gap-3 px-4 py-3 bg-gradient-to-r from-primary-500 to-green-400 rounded-lg hover:opacity-90 transition"
          >
            <FaCrown size={20} />
            <span className="font-semibold">Upgrade to Premium</span>
          </Link>
        )}

        <div className="px-4 py-3 bg-dark-200 rounded-lg">
          <p className="font-semibold text-white text-sm mb-1">{user?.name || 'User'}</p>
          <p className="text-xs text-gray-400 truncate">{user?.email || 'No email'}</p>
        </div>

        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-4 py-2 text-gray-400 hover:text-white transition w-full rounded-lg hover:bg-dark-200"
        >
          <FaSignOutAlt size={18} />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
}
