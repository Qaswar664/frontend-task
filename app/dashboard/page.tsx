// src/app/page.tsx
"use client";

import Link from "next/link";
import { useGetCategoriesQuery } from "../../utils/categoryApi";
import { useGetAllCarsQuery } from "../../utils/carApi";
import { Car } from "../../types";

export default function HomePage() {
  const {
    data: categories,
    isLoading: categoriesLoading,
    isFetching: categoriesFetching,
  } = useGetCategoriesQuery();
  const {
    data: cars,
    isLoading: carsLoading,
    isFetching: carsFetching,
  } = useGetAllCarsQuery();

  // Get the 5 most recently added cars (assuming cars are returned in order of creation)
  const recentCars = cars ? cars.slice(0, 5) : [];

  const getCategoryName = (categoryId: string) => {
    const category = categories?.find((cat) => cat.id === categoryId);
    return category ? category.name : "Unknown Category";
  };

  return (
    <div className="min-h-screen bg-gray-50 border-t border-gray-200">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-32  text-center">
        <h1 className="text-5xl font-bold mb-4">
          Welcome to the Car Management App
        </h1>
        <p className="text-lg max-w-2xl mx-auto mb-8">
          Manage categories and cars efficiently with a simple, modern interface
          built with MERN stack.
        </p>
        <Link
          href="/dashboard/cars"
          className="bg-white text-indigo-600 font-semibold px-6 py-3 rounded-lg shadow hover:bg-gray-100 transition"
        >
          Explore Cars
        </Link>
      </section>

      {/* Recently Added Cars Section */}
      <section className="max-w-5xl mx-auto py-20 px-6">
        <h2 className="text-3xl font-semibold mb-6 text-center">
          Recently Added Cars
        </h2>
        <p className="text-center text-gray-600 mb-10">
          Check out the latest cars added to our collection.
        </p>

        {carsLoading || carsFetching ? (
          <div className="text-center text-gray-500">
            Loading recent cars...
          </div>
        ) : recentCars && recentCars.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {recentCars.map((car: Car) => (
              <Link key={car.id} href="/dashboard/cars" className="block">
                <div className="p-6 bg-white rounded-xl shadow hover:shadow-lg transition cursor-pointer">
                  <h3 className="text-xl font-bold mb-2">
                    {car.make} {car.model}
                  </h3>
                  <p className="text-gray-600 mb-2">Year: {car.year}</p>
                  <p className="text-gray-600 mb-2">
                    Category: {getCategoryName(car.categoryId)}
                  </p>
                  <span className="inline-block mt-3 text-indigo-600 hover:text-indigo-800 font-medium">
                    View Cars →
                  </span>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center text-gray-500">No cars available.</div>
        )}
      </section>
      {/* Preview Section */}
      <section className="max-w-5xl mx-auto py-20 px-6">
        <h2 className="text-3xl font-semibold mb-6 text-center">
          Car Categories
        </h2>
        <p className="text-center text-gray-600 mb-10">
          Browse through different car categories and manage your vehicles.
        </p>

        {categoriesLoading || categoriesFetching ? (
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
                <p className="text-gray-600">
                  Click to see all cars in this category.
                </p>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center text-gray-500">
            No categories available.
          </div>
        )}
      </section>

      {/* Footer */}
      <footer className="text-center py-6 text-gray-500 text-sm">
        © 2025 Car Management App. All rights reserved.
      </footer>
    </div>
  );
}
