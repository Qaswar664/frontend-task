'use client';

import Link from 'next/link';
import { useDispatch } from 'react-redux';
import { logout } from '@/features/authSlice';
import { useRouter } from 'next/navigation';

export default function Navbar() {
  const dispatch = useDispatch();
  const router = useRouter();

  const handleLogout = () => {
    dispatch(logout());
    router.push('/auth/login');
  };

  const links = [
    { name: 'Home', href: '/dashboard' },
    { name: 'Cars', href: '/dashboard/cars' },
    { name: 'Categories', href: '/dashboard/categories' },
    { name: 'Profile', href: '/dashboard/profile' },
  ];

  return (
    <nav className="bg-blue-600 p-4 text-white flex items-center justify-between relative">
      <h1 className="text-2xl font-bold">Car Management</h1>

      <div className="absolute left-1/2 transform -translate-x-1/2 hidden md:flex space-x-8 lg:space-x-24">
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="hover:text-gray-200 text-base transition"
          >
            {link.name}
          </Link>
        ))}
      </div>

      <button
        onClick={handleLogout}
        className="bg-red-500 hover:bg-red-600 transition px-4 py-2 rounded"
      >
        Logout
      </button>
    </nav>
  );
}
