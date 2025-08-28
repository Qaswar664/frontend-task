// src/app/api/categoryApi.ts
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { RootState } from '@/lib/store';
import { Category } from '@/types';
import { toast } from 'react-toastify';

export const categoryApi = createApi({
  reducerPath: 'categoryApi',
  baseQuery: fetchBaseQuery({
    baseUrl: 'http://localhost:3000/category',
    prepareHeaders: (headers, { getState }) => {
      const token = (getState() as RootState).auth.token;
      if (token) {
        headers.set('Authorization', `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ['Category'],
  endpoints: (builder) => ({
    getCategories: builder.query<Category[], void>({
      query: () => '/',
      providesTags: ['Category'],
    }),
    getCategoryById: builder.query<Category, string>({
      query: (id) => `/${id}`,
      providesTags: ['Category'],
    }),
    createCategory: builder.mutation<Category, Partial<Category>>({
      query: (body) => ({
        url: '/',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Category'],
      async onQueryStarted(arg, { queryFulfilled }) {
        try {
          await queryFulfilled;
          toast.success('Category created');
        } catch (err) {
          toast.error('Failed to create category');
        }
      },
    }),
    updateCategory: builder.mutation<Category, { id: string; body: Partial<Category> }>({
      query: ({ id, body }) => ({
        url: `/${id}`,
        method: 'PATCH',
        body,
      }),
      invalidatesTags: ['Category'],
      async onQueryStarted(arg, { queryFulfilled }) {
        try {
          await queryFulfilled;
          toast.success('Category updated');
        } catch (err) {
          toast.error('Failed to update category');
        }
      },
    }),
    deleteCategory: builder.mutation<void, string>({
      query: (id) => ({
        url: `/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Category'],
      async onQueryStarted(arg, { queryFulfilled }) {
        try {
          await queryFulfilled;
          toast.success('Category deleted');
        } catch (err) {
          toast.error('Failed to delete category');
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