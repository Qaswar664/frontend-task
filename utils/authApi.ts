import { setCredentials } from "../features/authSlice";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { toast } from "react-toastify";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

export const authApi = createApi({
  reducerPath: "authApi",
  baseQuery: fetchBaseQuery({ baseUrl: `${BASE_URL}/auth` }),
  endpoints: (builder) => ({
    register: builder.mutation({
      query: (body) => ({
        url: "/register",
        method: "POST",
        body,
      }),
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;

          // check if token exists
          if (data && data.access_token) {
            dispatch(setCredentials({ token: data.access_token }));
            toast.success("Registered successfully");
          } else {
            toast.error("Registration failed: token missing");
          }
        } catch (err: any) {
          // optional: show backend error message if exists
          toast.error(err?.error?.data?.message || "Registration failed");
        }
      },
    }),
    login: builder.mutation({
      query: (body) => ({
        url: "/login",
        method: "POST",
        body,
      }),
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;

          if (data && data.access_token) {
            dispatch(setCredentials({ token: data.access_token }));
            toast.success("Logged in successfully");
          } else {
            toast.error("Login failed: token missing");
          }
        } catch (err: any) {
          toast.error(err?.error?.data?.message || "Login failed");
        }
      },
    }),
  }),
});

export const { useRegisterMutation, useLoginMutation } = authApi;
