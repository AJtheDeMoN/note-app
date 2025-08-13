// src/components/HydrationManager.tsx
'use client';

import { useAuthStore } from '@/store/authStore';
import { useEffect } from 'react';

function HydrationManager() {
  useEffect(() => {
    useAuthStore.getState().setHasHydrated(true);
  }, []);

  return null;
}

export default HydrationManager;