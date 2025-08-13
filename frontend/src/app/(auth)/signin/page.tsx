// src/app/(auth)/signin/page.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import axiosInstance from '@/lib/axios';
import { useAuthStore } from '@/store/authStore';

export default function SignInPage() {
  const router = useRouter();
  const { setToken, setUser } = useAuthStore();
  const [formData, setFormData] = useState({
    username: '', // FastAPI's OAuth2 expects 'username' and 'password'
    password: '',
  });
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    // FastAPI's standard token endpoint expects form data
    const params = new URLSearchParams();
    params.append('username', formData.username);
    params.append('password', formData.password);

    try {
      // Get the token
      const tokenResponse = await axiosInstance.post('/auth/login', params);
      const { access_token } = tokenResponse.data;
      setToken(access_token);

      // Use the new token to get user info (we'll create this endpoint)
      // For now, let's assume a placeholder user or decode from token
      // A proper way is to have a /users/me endpoint
      setUser({
        user_id: '', // You would get this from a /me endpoint or token
        user_name: 'User',
        user_email: formData.username,
      });

      // On success, redirect to the home page
      router.push('/');
    } catch (err: any) {
      setError(err.response?.data?.detail || 'An unexpected error occurred.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-full flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900">
          Sign in to your account
        </h2>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <Input
              id="username"
              name="username"
              type="email"
              label="Email address"
              autoComplete="email"
              required
              value={formData.username}
              onChange={handleChange}
            />
            <Input
              id="password"
              name="password"
              type="password"
              label="Password"
              autoComplete="current-password"
              required
              value={formData.password}
              onChange={handleChange}
            />

            {error && <p className="text-sm text-red-600">{error}</p>}

            <div>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? 'Signing in...' : 'Sign in'}
              </Button>
            </div>
          </form>

          <p className="mt-6 text-center text-sm text-gray-600">
            Not a member?{' '}
            <Link href="/signup" className="font-medium text-indigo-600 hover:text-indigo-500">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}