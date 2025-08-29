"use client";

import React from "react";
import { useParams, useRouter } from "next/navigation";
import { useGetCarsByCategoryQuery } from "../../../../utils/carApi";
import Link from "next/link";

export default function CategoryCarsPage() {
  const { categoryId } = useParams();
  const router = useRouter();
  const { data: cars, isLoading } = useGetCarsByCategoryQuery(
    categoryId as string
  );

  if (isLoading) return <p>Loading cars...</p>;
  if (!cars || cars.length === 0) return <p>No cars found in this category.</p>;

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-2xl font-semibold mb-4">Cars in this Category</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {cars.map((car) => (
          <div
            key={car.id}
            className="bg-white rounded-lg shadow p-4 flex flex-col justify-between"
          >
            <div>
              <h3 className="text-lg font-semibold">{car.name}</h3>
              <p className="text-sm text-gray-500">Model: {car.model}</p>
            </div>
            <div className="mt-4 flex gap-2">
              <Link
                href={`/dashboard/cars/${categoryId}/${car.id}`}
                className="text-blue-600 hover:text-blue-800 text-sm font-medium"
              >
                Details
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
