// src/store/authStore.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type User = {
  user_id: string;
  user_name: string;
  user_email: string;
};

type AuthState = {
  token: string | null;
  user: User | null;
  isAuthenticated: boolean;
  _hasHydrated: boolean;
  setHasHydrated: (state: boolean) => void; // Add this action
  setToken: (token: string) => void;
  setUser: (user: User) => void;
  logout: () => void;
};

export const useAuthStore = create(
  persist<AuthState>(
    (set) => ({
      token: null,
      user: null,
      isAuthenticated: false,
      _hasHydrated: false,
      setHasHydrated: (state) => { // Implement the action
        set({
          _hasHydrated: state,
        });
      },
      setToken: (token: string) => {
        set({ token, isAuthenticated: !!token });
      },
      setUser: (user: User) => {
        set({ user });
      },
      logout: () => {
        set({ token: null, user: null, isAuthenticated: false });
      },
    }),
    {
      name: 'auth-storage', // This is the only option we need now
    }
  )
);