"use client";

import Link from "next/link";
import { useState } from "react";
import { useForm } from "react-hook-form";
import FormInput from "@/components/FormInput";
import Modal from "@/components/Modal";
import Spinner from "@/components/Spinner";
import {
  useCreateCategoryMutation,
  useDeleteCategoryMutation,
  useGetCategoriesQuery,
} from "@/utils/categoryApi";

export default function Categories() {
  const { data: categories, isLoading } = useGetCategoriesQuery();
  const [createCategory] = useCreateCategoryMutation();
  const [deleteCategory] = useDeleteCategoryMutation();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deletingIds, setDeletingIds] = useState<string[]>([]);
  const { register, handleSubmit, reset } = useForm<{
    name: string;
    description?: string;
  }>();

  const onSubmit = async (data: { name: string; description?: string }) => {
    setIsSubmitting(true);
    try {
      await createCategory(data);
      setIsModalOpen(false);
      reset();
    } catch (error) {
      console.error("Failed to create category:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    setDeletingIds((prev) => [...prev, id]);
    try {
      await deleteCategory(id);
    } catch (error) {
      console.error("Failed to delete category:", error);
    } finally {
      setDeletingIds((prev) => prev.filter((deletingId) => deletingId !== id));
    }
  };

  if (isLoading)
    return <div className="text-center text-lg font-semibold">Loading...</div>;

  return (
    <div className="p-6 max-w-5xl mx-auto">
      {/* Page Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Categories</h2>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg shadow-md transition-all flex items-center justify-center cursor-pointer"
        >
          + Create Category
        </button>
      </div>

      {/* Table */}
      <div className="overflow-x-auto shadow-lg rounded-lg border border-gray-200 bg-white">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-100 text-gray-700 uppercase text-sm">
              <th className="p-4">Name</th>
              <th className="p-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {categories?.map((cat) => (
              <tr
                key={cat.id}
                className="border-b last:border-none hover:bg-gray-50 transition-colors"
              >
                <td className="p-4 font-medium text-gray-800">{cat.name}</td>
                <td className="p-4 flex gap-3">
                  <Link
                    href={`/dashboard/categories/${cat.id}`}
                    className="text-blue-600 hover:text-blue-800 font-medium"
                  >
                    Edit
                  </Link>
                  <button
                    onClick={() => handleDelete(cat.id)}
                    disabled={deletingIds.includes(cat.id)}
                    className="text-red-500 hover:text-red-700 font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center cursor-pointer"
                  >
                    {deletingIds.includes(cat.id) ? (
                      <>
                        <Spinner size="sm" className="mr-1" />
                        Deleting...
                      </>
                    ) : (
                      "Delete"
                    )}
                  </button>
                </td>
              </tr>
            ))}
            {categories?.length === 0 && (
              <tr>
                <td colSpan={2} className="p-6 text-center text-gray-500">
                  No categories found. Try creating one!
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Create Category"
      >
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <FormInput id="name" label="Name" register={register} required />
          <FormInput id="description" label="Description" register={register} />

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
                  Creating...
                </>
              ) : (
                "Create"
              )}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
