"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import FormInput from "@/components/FormInput";
import Spinner from "@/components/Spinner";
import {
  useGetCategoryByIdQuery,
  useUpdateCategoryMutation,
} from "@/utils/categoryApi";

export default function CategoryDetail() {
  const { id } = useParams();
  const { data: category, isLoading } = useGetCategoryByIdQuery(id as string);
  const [updateCategory] = useUpdateCategoryMutation();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { register, handleSubmit, reset } = useForm<{
    name: string;
    description?: string;
  }>();

  useEffect(() => {
    if (category) reset(category);
  }, [category, reset]);

  const onSubmit = async (data: { name: string; description?: string }) => {
    setIsSubmitting(true);
    try {
      await updateCategory({ id: id as string, body: data });
    } catch (error) {
      console.error("Failed to update category:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <p className="text-gray-500 animate-pulse">
          Loading category details...
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto mt-10">
      {/* Card */}
      <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
          Edit Category
        </h2>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <FormInput
            id="name"
            label="Category Name"
            register={register}
            required
          />
          <FormInput id="description" label="Description" register={register} />

          {/* Action Buttons */}
          <div className="flex justify-end gap-3">
            <button
              type="button"
              disabled={isSubmitting}
              className="px-4 py-2 rounded-lg bg-gray-100 text-gray-600 hover:bg-gray-200 transition disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
              onClick={() => reset(category)}
            >
              Reset
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700 shadow transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center min-w-[140px] cursor-pointer"
            >
              {isSubmitting ? (
                <>
                  <Spinner size="sm" className="mr-2" />
                  Saving...
                </>
              ) : (
                "Save Changes"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
