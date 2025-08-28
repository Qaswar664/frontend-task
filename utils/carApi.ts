// src/app/api/carApi.ts
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { RootState } from '../lib/store';
import { Car } from '../types';
import { toast } from 'react-toastify';

export const carApi = createApi({
  reducerPath: 'carApi',
  baseQuery: fetchBaseQuery({
    baseUrl: 'http://localhost:3000/car',
    prepareHeaders: (headers, { getState }) => {
      const token = (getState() as RootState).auth.token;
      if (token) {
        headers.set('Authorization', `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ['Car'],
  endpoints: (builder) => ({
    getCarsByCategory: builder.query<Car[], string>({
      query: (categoryId) => `/${categoryId}`,
      providesTags: ['Car'],
    }),
    getCarById: builder.query<Car, string>({
      query: (id) => `/car-by-id/${id}`,
      providesTags: ['Car'],
    }),
    createCar: builder.mutation<Car, Partial<Car>>({
      query: (body) => ({
        url: '/',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Car'],
      async onQueryStarted(arg, { queryFulfilled }) {
        try {
          await queryFulfilled;
          toast.success('Car created');
        } catch (err) {
          toast.error('Failed to create car');
        }
      },
    }),
    updateCar: builder.mutation<Car, { id: string; body: Partial<Car> }>({
      query: ({ id, body }) => ({
        url: `/${id}`,
        method: 'PATCH',
        body,
      }),
      invalidatesTags: ['Car'],
      async onQueryStarted(arg, { queryFulfilled }) {
        try {
          await queryFulfilled;
          toast.success('Car updated');
        } catch (err) {
          toast.error('Failed to update car');
        }
      },
    }),
    deleteCar: builder.mutation<void, string>({
      query: (id) => ({
        url: `/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Car'],
      async onQueryStarted(arg, { queryFulfilled }) {
        try {
          await queryFulfilled;
          toast.success('Car deleted');
        } catch (err) {
          toast.error('Failed to delete car');
        }
      },
    }),
  }),
});

export const {
  useGetCarsByCategoryQuery,
  useGetCarByIdQuery,
  useCreateCarMutation,
  useUpdateCarMutation,
  useDeleteCarMutation,
} = carApi;