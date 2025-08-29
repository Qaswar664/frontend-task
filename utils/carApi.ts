import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { RootState } from "../lib/store";
import { Car } from "../types";
import { toast } from "react-toastify";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

export const carApi = createApi({
  reducerPath: "carApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${BASE_URL}/cars`,
    prepareHeaders: (headers, { getState }) => {
      const token = (getState() as RootState).auth.token;
      if (token) headers.set("Authorization", `Bearer ${token}`);
      return headers;
    },
  }),
  tagTypes: ["Car"],
  endpoints: (builder) => ({
    getCarsByCategory: builder.query<Car[], string>({
      query: (categoryId) => `/category/${categoryId}`,
      providesTags: ["Car"],
    }),
    getCarById: builder.query<Car, string>({
      query: (id) => `/${id}`,
      providesTags: ["Car"],
    }),
    createCar: builder.mutation<Car, Partial<Car>>({
      query: (body) => ({
        url: "/",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Car"],
      async onQueryStarted(arg, { queryFulfilled }) {
        try {
          await queryFulfilled;
          toast.success("Car created");
        } catch (err: any) {
          toast.error(err?.error?.data?.message || "Failed to create car");
        }
      },
    }),
    updateCar: builder.mutation<Car, { id: string; body: Partial<Car> }>({
      query: ({ id, body }) => ({
        url: `/${id}`,
        method: "PUT",
        body,
      }),
      invalidatesTags: ["Car"],
      async onQueryStarted(arg, { queryFulfilled }) {
        try {
          await queryFulfilled;
          toast.success("Car updated");
        } catch (err: any) {
          toast.error(err?.error?.data?.message || "Failed to update car");
        }
      },
    }),
    deleteCar: builder.mutation<void, string>({
      query: (id) => ({
        url: `/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Car"],
      async onQueryStarted(arg, { queryFulfilled }) {
        try {
          await queryFulfilled;
          toast.success("Car deleted");
        } catch (err: any) {
          toast.error(err?.error?.data?.message || "Failed to delete car");
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
