// src/app/page.tsx
'use client';

import Link from 'next/link';
import { useGetCategoriesQuery } from '@/utils/categoryApi';

export default function HomePage() {
  const { data: categories, isLoading, isFetching } = useGetCategoriesQuery();

  return (
    <div className="min-h-screen bg-gray-50 border-t border-gray-200">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-32  text-center">
        <h1 className="text-5xl font-bold mb-4">
          Welcome to the Car Management App
        </h1>
        <p className="text-lg max-w-2xl mx-auto mb-8">
          Manage categories and cars efficiently with a simple, modern interface built with MERN stack.
        </p>
        <Link
          href="/dashboard/cars"
          className="bg-white text-indigo-600 font-semibold px-6 py-3 rounded-lg shadow hover:bg-gray-100 transition"
        >
          Explore Cars
        </Link>
      </section>

      {/* Preview Section */}
      <section className="max-w-5xl mx-auto py-20 px-6">
        <h2 className="text-3xl font-semibold mb-6 text-center">Car Categories</h2>
        <p className="text-center text-gray-600 mb-10">
          Browse through different car categories and manage your vehicles.
        </p>

        {isLoading || isFetching ? (
          <div className="text-center text-gray-500">Loading categories...</div>
        ) : categories && categories.length > 0 ? (
          <div className="grid md:grid-cols-2 gap-6">
            {categories.map((cat) => (
              <Link
                key={cat.id}
                href={`/dashboard/cars?categoryId=${cat.id}`}
                className="p-6 bg-white rounded-xl shadow hover:shadow-lg transition"
              >
                <h3 className="text-xl font-bold mb-2">{cat.name}</h3>
                <p className="text-gray-600">Click to see all cars in this category.</p>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center text-gray-500">No categories available.</div>
        )}
      </section>

      {/* Footer */}
      <footer className="text-center py-6 text-gray-500 text-sm">
        © 2025 Car Management App. All rights reserved.
      </footer>
    </div>
  );
}
