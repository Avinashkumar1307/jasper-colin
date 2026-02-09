'use client';

import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

export default function Navbar() {
  const { user, logout } = useAuth();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully');
    router.push('/login');
  };

  return (
    <nav className="sticky top-0 z-50 border-b border-white/10 bg-white/70 dark:bg-gray-950/70 backdrop-blur-xl">
      <div className="max-w-6xl mx-auto flex justify-between items-center px-6 py-4">
        <Link href="/products" className="flex items-center gap-2.5 group">
          <div className="w-8 h-8 rounded-lg bg-linear-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/25 group-hover:shadow-indigo-500/40 transition-shadow">
            <span className="text-white text-sm font-bold">P</span>
          </div>
          <span className="text-lg font-bold bg-linear-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400 bg-clip-text text-transparent">
            ProductHub
          </span>
        </Link>

        <div className="flex items-center gap-2">
          <Link
            href="/products"
            className="px-3.5 py-2 text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-all"
          >
            Products
          </Link>

          {user ? (
            <>
              <Link
                href="/products/new"
                className="px-3.5 py-2 text-sm font-medium bg-linear-to-r from-indigo-500 to-purple-600 text-white rounded-lg hover:from-indigo-600 hover:to-purple-700 shadow-md shadow-indigo-500/25 hover:shadow-lg hover:shadow-indigo-500/30 transition-all active:scale-[0.98]"
              >
                + New Product
              </Link>
              <div className="w-px h-6 bg-gray-200 dark:bg-gray-700 mx-1" />
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-full bg-linear-to-br from-emerald-400 to-teal-500 flex items-center justify-center">
                  <span className="text-white text-xs font-bold uppercase">
                    {user.username.charAt(0)}
                  </span>
                </div>
                <span className="text-sm font-medium text-gray-600 dark:text-gray-400 hidden sm:inline">
                  {user.username}
                </span>
              </div>
              <button
                onClick={handleLogout}
                className="px-3 py-2 text-sm font-medium text-gray-500 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-lg transition-all"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="px-3.5 py-2 text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-all"
              >
                Login
              </Link>
              <Link
                href="/register"
                className="px-3.5 py-2 text-sm font-medium bg-linear-to-r from-indigo-500 to-purple-600 text-white rounded-lg hover:from-indigo-600 hover:to-purple-700 shadow-md shadow-indigo-500/25 transition-all active:scale-[0.98]"
              >
                Get Started
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
