'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import axiosInstance from '@/lib/axios';

export default function SignUpPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    user_name: '',
    user_email: '',
    password: '',
    confirm_password: '',
  });
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    // ✅ Password match check before sending to backend
    if (formData.password !== formData.confirm_password) {
      setError('Passwords do not match.');
      return;
    }

    setIsLoading(true);

    try {
      await axiosInstance.post('/auth/register', {
        user_name: formData.user_name,
        user_email: formData.user_email,
        password: formData.password,
      });
      router.push('/signin');
    } catch (err: any) {
      setError(err.response?.data?.detail || 'An unexpected error occurred.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="border border-2 border-[#d9a066] rounded-xl w-[340px] shadow-lg mb-40">
        
        {/* Title bar */}
        <div className="bg-[#f2b37f] px-3 py-1 flex items-center justify-between rounded-t-lg border-b-2 border-[#d9a066]">
          <span className="text-sm font-medium text-gray-700">Sign Up</span>
          <div className="flex space-x-1">
            <span className="w-3 h-3 rounded-full bg-green-500" />
            <span className="w-3 h-3 rounded-full bg-yellow-500" />
            <span className="w-3 h-3 rounded-full bg-red-500" />
          </div>
        </div>

        {/* Content */}
        <div className="px-6 py-6">
          <h2 className="text-center text-2xl font-bold text-[#3b2f2f] mb-6">Create Account</h2>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-[#3b2f2f] mb-1">Username</label>
              <input
                type="text"
                name="user_name"
                placeholder="Username"
                value={formData.user_name}
                onChange={handleChange}
                className="w-full rounded border-2 bg-white border-[#d9a066] text-gray-700 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-300"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-[#3b2f2f] mb-1">Email</label>
              <input
                type="email"
                name="user_email"
                placeholder="Email"
                value={formData.user_email}
                onChange={handleChange}
                className="w-full rounded border-2 bg-white border-[#d9a066] text-gray-700 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-300"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-[#3b2f2f] mb-1">Password</label>
              <input
                type="password"
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
                className="w-full rounded border-2 bg-white border-[#d9a066] text-gray-700 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-300"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-[#3b2f2f] mb-1">Confirm Password</label>
              <input
                type="password"
                name="confirm_password"
                placeholder="Confirm Password"
                value={formData.confirm_password}
                onChange={handleChange}
                className="w-full rounded border-2 bg-white border-[#d9a066] text-gray-700 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-300"
              />
            </div>

            {error && <p className="text-sm text-red-600">{error}</p>}

            {/* Buttons */}
            <div className="flex space-x-4 pt-2">
              <button
                type="submit"
                disabled={isLoading}
                className="flex-1 bg-[#74c7d3] hover:bg-[#66b9c5] text-[#04313d] font-semibold py-2 rounded transition"
              >
                {isLoading ? 'Creating...' : 'Sign Up'}
              </button>
              <Link
                href="/signin"
                className="flex-1 text-center bg-[#f2a65a] hover:bg-[#e5964d] text-[#3b2f2f] font-semibold py-2 rounded transition"
              >
                Login
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
