// src/components/ui/Navbar.tsx
'use client';

import Link from 'next/link';
import { useAuthStore } from '../../store/authStore';

const Navbar = () => {
  // Note: This won't be reactive immediately due to hydration.
  // We'll fix this reactivity later with a dedicated client component.
  const { isAuthenticated, logout } = useAuthStore();

  return (
    <nav className="bg-white shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center">
            <Link href="/" className="text-xl font-bold text-indigo-600">
              NotesApp
            </Link>
          </div>
          <div className="flex items-center space-x-4">
            {isAuthenticated ? (
              <button onClick={logout} className="text-gray-600 hover:text-indigo-600">
                Logout
              </button>
            ) : (
              <>
                <Link href="/signin" className="text-gray-600 hover:text-indigo-600">
                  Sign In
                </Link>
                <Link
                  href="/signup"
                  className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;