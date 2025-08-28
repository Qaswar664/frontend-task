'use client';

import { useSelector } from 'react-redux';
import { RootState } from '../lib/store';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function Home() {
  const { token } = useSelector((state: RootState) => state.auth);
  const router = useRouter();

  useEffect(() => {
    if (token) {
      router.push('/dashboard');
    } else {
      router.push('/auth/login');
    }
  }, [token, router]);

  return <div>Loading...</div>;
}