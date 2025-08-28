'use client';

import React, { useMemo, useState } from 'react';
import Link from 'next/link';
import { useGetCategoriesQuery } from '@/utils/categoryApi';
import type { Category } from '@/types';

export default function CarsPage() {
  const { data: categories, isLoading, isFetching } = useGetCategoriesQuery();
  const [q, setQ] = useState('');
  const [sort, setSort] = useState<'name' | 'new' | 'az'>('name');

  const filtered = useMemo(() => {
    if (!categories) return [] as Category[];
    const term = q.trim().toLowerCase();
    let list = categories.slice();
    if (term) list = list.filter((c) => c.name.toLowerCase().includes(term));
    if (sort === 'az') list.sort((a, b) => a.name.localeCompare(b.name));
    if (sort === 'new') list.reverse();
    return list;
  }, [categories, q, sort]);

  return (
    <div className="max-w-6xl mx-auto p-6">
      <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-semibold">Pick a Category</h1>
          <p className="text-sm text-gray-500">Choose a category to view and add cars</p>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative">
            <input
              aria-label="Search categories"
              placeholder="Search categories..."
              value={q}
              onChange={(e) => setQ(e.target.value)}
              className="w-64 sm:w-80 rounded-md border border-gray-200 px-3 py-2 shadow-sm focus:ring-2 focus:ring-blue-300 focus:outline-none"
            />
            {isFetching && (
              <span className="absolute right-2 top-1/2 -translate-y-1/2 text-sm text-gray-400">Refreshing…</span>
            )}
          </div>

          <select
            value={sort}
            onChange={(e) => setSort(e.target.value as any)}
            className="rounded-md border border-gray-200 px-3 py-2 shadow-sm"
          >
            <option value="name">Default</option>
            <option value="az">A → Z</option>
            <option value="new">Newest</option>
          </select>

          <Link href="/dashboard/cars/new" className="inline-flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-md shadow hover:bg-blue-700">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Add Car
          </Link>
        </div>
      </header>

      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="animate-pulse bg-white rounded-lg shadow p-4 h-36" />
          ))}
        </div>
      ) : (
        <section>
          {filtered.length === 0 ? (
            <div className="rounded-lg border border-dashed border-gray-200 p-6 text-center">
              <h3 className="text-lg font-medium">No categories found</h3>
              <p className="text-sm text-gray-500 mt-2">Try adjusting your search or add a new category.</p>
              <div className="mt-4">
                <Link href="/dashboard/categories/new" className="inline-block px-4 py-2 bg-green-600 text-white rounded-md shadow hover:bg-green-700">Create Category</Link>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filtered.map((cat) => (
                <CategoryCard key={cat.id} category={cat} />
              ))}
            </div>
          )}
        </section>
      )}
    </div>
  );
}

function CategoryCard({ category }: { category: Category }) {
  return (
    <Link
      href={`/dashboard/cars?categoryId=${encodeURIComponent(category.id)}`}
      className="group block bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow border border-transparent hover:border-gray-100 p-5"
    >
      <div className="flex items-start gap-4">
        <div className="flex-shrink-0 bg-gradient-to-br from-indigo-500 to-purple-500 text-white rounded-lg w-14 h-14 flex items-center justify-center text-xl font-bold">
          {category.name.slice(0, 2).toUpperCase()}
        </div>
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-800 group-hover:text-blue-600">{category.name}</h3>
          <p className="text-sm text-gray-500 mt-1 line-clamp-2">{category.description ?? 'No description provided.'}</p>
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between">
        <span className="text-xs text-gray-400">Category ID: {category.id}</span>
        <span className="text-sm text-blue-600 font-medium">View cars →</span>
      </div>
    </Link>
  );
}
