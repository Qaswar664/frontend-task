
'use client';

import { useSelector } from 'react-redux';
import { RootState } from '../lib/store';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export const useAuth = () => {
  const { token } = useSelector((state: RootState) => state.auth);
  const router = useRouter();

  useEffect(() => {
    if (!token) {
      router.push('/auth/login');
    }
  }, [token, router]);

  return { isAuthenticated: !!token };
};