"use client";

import Link from "next/link";
import { useState } from "react";
import { useForm } from "react-hook-form";
import FormInput from "@/components/FormInput";
import Modal from "@/components/Modal";
import Spinner from "@/components/Spinner";
import type { Car, Category } from "@/types";
import {
  useCreateCarMutation,
  useGetAllCarsQuery,
  useUpdateCarMutation,
} from "@/utils/carApi";
import { useGetCategoriesQuery } from "@/utils/categoryApi";

// Form type matching backend payload
type CarForm = {
  make: string;
  model: string;
  year: number;
  color: string;
  categoryId: string;
};

export default function CarsPage() {
  const { data: categories } = useGetCategoriesQuery();
  const { data: cars, isLoading: carsLoading } = useGetAllCarsQuery();
  const [createCar] = useCreateCarMutation();
  const [updateCar] = useUpdateCarMutation();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(
    null
  );
  const [editingCar, setEditingCar] = useState<Car | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const { register, handleSubmit, reset, setValue } = useForm<CarForm>();

  const openAddModal = (category: Category) => {
    setSelectedCategory(category);
    setIsModalOpen(true);
    reset({ categoryId: category.id });
  };

  const openEditModal = (car: Car) => {
    setEditingCar(car);
    setValue("make", car.make);
    setValue("model", car.model);
    setValue("year", car.year);
    setValue("color", car.color);
    setValue("categoryId", car.categoryId);
    setIsEditModalOpen(true);
  };

  const onSubmit = async (data: CarForm) => {
    if (!selectedCategory) return;

    setIsSubmitting(true);
    try {
      await createCar(data).unwrap();
      setIsModalOpen(false);
      reset();
    } catch (err: unknown) {
      const error = err as { data?: { message?: string } };
      console.error(err);
      alert(error?.data?.message || "Failed to create car");
    } finally {
      setIsSubmitting(false);
    }
  };

  const onUpdateSubmit = async (data: CarForm) => {
    if (!editingCar) return;

    setIsEditing(true);
    try {
      await updateCar({ id: editingCar.id, body: data }).unwrap();
      setIsEditModalOpen(false);
      reset();
      setEditingCar(null);
    } catch (err: unknown) {
      const error = err as { data?: { message?: string } };
      console.error(err);
      alert(error?.data?.message || "Failed to update car");
    } finally {
      setIsEditing(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold">All Cars</h2>

        <button
          onClick={() => {
            if (categories && categories.length > 0)
              openAddModal(categories[0]);
          }}
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md shadow flex items-center justify-center cursor-pointer"
        >
          + Add Car
        </button>
      </div>

      {/* All Cars Section */}
      <div className="mt-12">
        {carsLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="animate-pulse h-48 bg-gray-200 rounded-lg"
              />
            ))}
          </div>
        ) : cars && cars.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {cars.map((car) => (
              <div
                key={car.id}
                className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow"
              >
                <div className="mb-4">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    {car.make} {car.model}
                  </h3>
                  <div className="space-y-2 text-sm text-gray-600">
                    <p>
                      <span className="font-medium">Year:</span> {car.year}
                    </p>
                    <p>
                      <span className="font-medium">Color:</span> {car.color}
                    </p>
                    <p>
                      <span className="font-medium">Category:</span>{" "}
                      {car.category?.name || "Unknown"}
                    </p>
                    <p>
                      <span className="font-medium">Created:</span>{" "}
                      {new Date(car.createdAt).toLocaleDateString()}
                    </p>
                    <p>
                      <span className="font-medium">Updated:</span>{" "}
                      {new Date(car.updatedAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <div className="flex justify-between">
                  <Link
                    href={`/dashboard/cars/${car.categoryId}`}
                    className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                  >
                    View Category
                  </Link>
                  <button
                    onClick={() => openEditModal(car)}
                    className="text-green-600 cursor-pointer hover:text-green-800 text-sm font-medium"
                  >
                    Edit
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center text-gray-500 py-8">
            No cars available.
          </div>
        )}
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

          {/* Category Dropdown */}
          <div>
            <label
              htmlFor="categoryId"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Category *
            </label>
            <select
              {...register("categoryId", { required: true })}
              className="w-full px-3 cursor-pointer py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="">Select a category</option>
              {categories?.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>

          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              disabled={isSubmitting}
              className="px-4 py-2 border rounded-md hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded-lg shadow-md transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center min-w-[100px] cursor-pointer"
            >
              {isSubmitting ? (
                <>
                  <Spinner size="sm" className="mr-2" />
                  Adding...
                </>
              ) : (
                "Add Car"
              )}
            </button>
          </div>
        </form>
      </Modal>

      {/* Edit Car Modal */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        title="Edit Car"
      >
        <form onSubmit={handleSubmit(onUpdateSubmit)} className="space-y-4">
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

          {/* Category Dropdown */}
          <div>
            <label
              htmlFor="categoryId"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Category *
            </label>
            <select
              {...register("categoryId", { required: true })}
              className="w-full px-3 cursor-pointer py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="">Select a category</option>
              {categories?.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>

          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={() => setIsEditModalOpen(false)}
              disabled={isEditing}
              className="px-4 py-2 border rounded-md hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isEditing}
              className="bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded-lg shadow-md transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center min-w-[100px] cursor-pointer"
            >
              {isEditing ? (
                <>
                  <Spinner size="sm" className="mr-2" />
                  Updating...
                </>
              ) : (
                "Update Car"
              )}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
