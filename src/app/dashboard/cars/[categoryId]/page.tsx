'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { useGetCarByIdQuery, useUpdateCarMutation } from '@/utils/carApi';
import FormInput from '@/components/FormInput';
import type { Car } from '@/types';
import Link from 'next/link';

export default function CarDetail() {
  const { id } = useParams();
  const router = useRouter();
  const { data: car, isLoading } = useGetCarByIdQuery(id as string);
  const [updateCar, { isLoading: isUpdating }] = useUpdateCarMutation();
  const {
    register,
    handleSubmit,
    reset,
    formState: { isSubmitting, isDirty },
  } = useForm<Car>({ defaultValues: undefined });

  // small local preview image state (static placeholder for now)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  useEffect(() => {
    if (car) {
      reset(car);
      // example: derive a placeholder image based on category or id
      setPreviewUrl(
        `https://images.unsplash.com/photo-1552519507-da3b142c6e3d?q=80&w=1200&auto=format&fit=crop&crop=faces&sat=-30&mark=auto&ixlib=rb-4.0.3&ixid=car-${encodeURIComponent(
          car.id
        )}`
      );
    }
  }, [car, reset]);

  const onSubmit = async (data: Car) => {
    try {
      await updateCar({ id: id as string, body: data }).unwrap?.();
      // show simple UX feedback
      router.refresh(); // refresh cache / data
      alert('Car updated successfully.');
    } catch (err: any) {
      console.error(err);
      alert('Failed to update car. See console for details.');
    }
  };

  if (isLoading) {
    return (
      <div className="max-w-5xl mx-auto p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 w-1/3 bg-gray-200 rounded" />
          <div className="flex gap-6">
            <div className="h-48 w-48 bg-gray-200 rounded" />
            <div className="flex-1 space-y-3">
              <div className="h-6 bg-gray-200 rounded" />
              <div className="h-6 bg-gray-200 rounded w-3/4" />
              <div className="h-6 bg-gray-200 rounded w-1/2" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!car) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="rounded-md border border-dashed border-gray-200 p-6 text-center">
          <h3 className="text-lg font-semibold">Car not found</h3>
          <p className="text-sm text-gray-500 mt-2">Unable to find the car with the provided id.</p>
          <div className="mt-4 flex justify-center gap-3">
            <Link href="/dashboard/cars" className="px-4 py-2 bg-gray-100 rounded-md">Back to categories</Link>
            <button onClick={() => router.back()} className="px-4 py-2 bg-blue-600 text-white rounded-md">Go back</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="mb-6">
        <nav className="text-sm text-gray-500">
          <Link href="/dashboard" className="hover:underline">Dashboard</Link>
          <span className="mx-2">/</span>
          <Link href="/dashboard/cars" className="hover:underline">Cars</Link>
          <span className="mx-2">/</span>
          <span className="text-gray-700">{car.name}</span>
        </nav>
        <h1 className="text-2xl font-semibold mt-2">Edit Car</h1>
        <p className="text-sm text-gray-500">Modify car details and save changes</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* LEFT: car preview card */}
        <aside className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow p-5">
            <div className="h-48 w-full rounded-md overflow-hidden bg-gray-100 flex items-center justify-center">
              {previewUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={previewUrl} alt={car.name} className="object-cover w-full h-full" />
              ) : (
                <div className="text-gray-400">No image</div>
              )}
            </div>

            <div className="mt-4">
              <h2 className="text-lg font-semibold">{car.name}</h2>
              <p className="text-sm text-gray-500 mt-1">Model: <span className="text-gray-700 font-medium">{car.model}</span></p>

              <div className="mt-3 text-sm text-gray-600 space-y-1">
                <div>Year: <span className="font-medium text-gray-800">{car.year}</span></div>
                <div>Category ID: <span className="font-medium text-gray-800">{car.categoryId}</span></div>
                <div className="text-xs mt-2 text-gray-400">ID: {car.id}</div>
              </div>

              <div className="mt-4 flex gap-2">
                <Link href={`/dashboard/cars`} className="flex-1 inline-flex justify-center items-center gap-2 px-3 py-2 border rounded-md text-sm hover:bg-gray-50">
                  ← Back
                </Link>
                <button
                  onClick={() => {
                    // quick example action: set preview to null to simulate remove
                    setPreviewUrl(null);
                    alert('Preview cleared (example action).');
                  }}
                  className="px-3 py-2 bg-red-50 text-red-600 rounded-md text-sm border border-red-100"
                >
                  Clear Image
                </button>
              </div>
            </div>
          </div>
        </aside>

        {/* RIGHT: edit form */}
        <main className="lg:col-span-2">
          <form onSubmit={handleSubmit(onSubmit)} className="bg-white rounded-lg shadow p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormInput id="name" label="Name" register={register} required />
              <FormInput id="model" label="Model" register={register} required />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormInput id="year" label="Year" type="number" register={register} required />
              <FormInput id="categoryId" label="Category ID" register={register} />
            </div>

            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <button
                  type="submit"
                  disabled={isSubmitting || isUpdating}
                  className="inline-flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-md shadow hover:bg-blue-700 disabled:opacity-60"
                >
                  {isUpdating || isSubmitting ? (
                    <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" strokeOpacity="0.25" /></svg>
                  ) : null}
                  Save changes
                </button>

                <button
                  type="button"
                  onClick={() => reset(car)}
                  className="px-4 py-2 border rounded-md text-sm hover:bg-gray-50"
                >
                  Reset
                </button>
              </div>

              <div className="text-sm text-gray-500">
                {isDirty ? <span className="text-yellow-600">Unsaved changes</span> : <span>Saved</span>}
              </div>
            </div>
          </form>
        </main>
      </div>
    </div>
  );
}
