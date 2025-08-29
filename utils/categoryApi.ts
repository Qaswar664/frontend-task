import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { RootState } from "../lib/store";
import { Category } from "../types";
import { toast } from "react-toastify";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL; // dynamic base URL

export const categoryApi = createApi({
  reducerPath: "categoryApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${BASE_URL}/categories`, // <-- plural to match NestJS controller
    prepareHeaders: (headers, { getState }) => {
      const token = (getState() as RootState).auth.token;
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ["Category"],
  endpoints: (builder) => ({
    getCategories: builder.query<Category[], void>({
      query: () => "/", // GET /categories
      providesTags: ["Category"],
    }),
    getCategoryById: builder.query<Category, string>({
      query: (id) => `/${id}`, // GET /categories/:id
      providesTags: ["Category"],
    }),
    createCategory: builder.mutation<Category, Partial<Category>>({
      query: (body) => ({
        url: "/", // POST /categories
        method: "POST",
        body,
      }),
      invalidatesTags: ["Category"],
      async onQueryStarted(arg, { queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          if (data) toast.success("Category created");
        } catch (err: any) {
          toast.error(err?.error?.data?.message || "Failed to create category");
        }
      },
    }),
    updateCategory: builder.mutation<
      Category,
      { id: string; body: Partial<Category> }
    >({
      query: ({ id, body }) => ({
        url: `/${id}`, // PUT /categories/:id
        method: "PUT",
        body,
      }),
      invalidatesTags: ["Category"],
      async onQueryStarted(arg, { queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          if (data) toast.success("Category updated");
        } catch (err: any) {
          toast.error(err?.error?.data?.message || "Failed to update category");
        }
      },
    }),
    deleteCategory: builder.mutation<void, string>({
      query: (id) => ({
        url: `/${id}`, // DELETE /categories/:id
        method: "DELETE",
      }),
      invalidatesTags: ["Category"],
      async onQueryStarted(arg, { queryFulfilled }) {
        try {
          await queryFulfilled;
          toast.success("Category deleted");
        } catch (err: any) {
          toast.error(err?.error?.data?.message || "Failed to delete category");
        }
      },
    }),
  }),
});

export const {
  useGetCategoriesQuery,
  useGetCategoryByIdQuery,
  useCreateCategoryMutation,
  useUpdateCategoryMutation,
  useDeleteCategoryMutation,
} = categoryApi;
