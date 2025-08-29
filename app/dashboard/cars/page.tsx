"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useGetCategoriesQuery } from "@/utils/categoryApi";
import { useCreateCarMutation } from "@/utils/carApi";
import type { Category } from "@/types";
import Modal from "@/components/Modal";
import FormInput from "@/components/FormInput";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";

// Form type matching backend payload
type CarForm = {
  make: string;
  model: string;
  year: number;
  color: string;
  categoryId: string;
};

export default function CarsPage() {
  const { data: categories, isLoading } = useGetCategoriesQuery();
  const [createCar] = useCreateCarMutation();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(
    null
  );

  const { register, handleSubmit, reset } = useForm<CarForm>();

  const openAddModal = (category: Category) => {
    setSelectedCategory(category);
    setIsModalOpen(true);
    reset({ categoryId: category.id }); 
  };

  const onSubmit = async (data: CarForm) => {
    if (!selectedCategory) return;

    try {
      await createCar(data).unwrap(); 
      setIsModalOpen(false);
      reset();
    } catch (err: any) {
      console.error(err);
      alert(err?.data?.message || "Failed to create car");
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold">Pick a Category</h1>
        <button
          onClick={() => {
            if (categories && categories.length > 0)
              openAddModal(categories[0]);
          }}
          className="bg-green-600 cursor-pointer hover:bg-green-700 text-white px-4 py-2 rounded-md shadow"
        >
          + Add Car
        </button>
      </div>

      {/* Category cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {isLoading
          ? Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="animate-pulse h-36 bg-gray-200 rounded-lg"
              />
            ))
          : categories?.map((cat) => (
              <div
                key={cat.id}
                className="bg-white rounded-lg shadow p-4 flex flex-col justify-between"
              >
                <div>
                  <h3 className="text-lg font-semibold">{cat.name}</h3>
                  <p className="text-sm text-gray-500">{cat.description}</p>
                </div>
                <div className="mt-4 flex gap-2">
                  <Link
                    href={`/dashboard/cars/${cat.id}`}
                    className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                  >
                    View Cars
                  </Link>
                  <button
                    onClick={() => openAddModal(cat)}
                    className="text-green-600 cursor-pointer hover:text-green-800 text-sm font-medium"
                  >
                    + Add Car
                  </button>
                </div>
              </div>
            ))}
      </div>

      {/* Add Car Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Add Car"
      >
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <FormInput id="make" label="Car Make" register={register} required />
          <FormInput id="model" label="Model" register={register} required />
          <FormInput
            id="year"
            label="Year"
            type="number"
            register={register}
            required
            options={{
              min: 2000,
              max: new Date().getFullYear(),
              valueAsNumber: true,
            }}
          />
          <FormInput id="color" label="Color" register={register} required />

          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="px-4 py-2 border rounded-md hover:bg-gray-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-green-600 cursor-pointer hover:bg-green-700 text-white px-5 py-2 rounded-lg shadow-md transition-all"
            >
              Add Car
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
