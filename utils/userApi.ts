import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { RootState } from "../lib/store";
import { User } from "../types";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL; // dynamic base URL

export const userApi = createApi({
  reducerPath: "userApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${BASE_URL}/user`, // dynamic base URL + /user
    prepareHeaders: (headers, { getState }) => {
      const token = (getState() as RootState).auth.token;
      console.log("User API Token:", token); // Debug log
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }),
  endpoints: (builder) => ({
    getProfile: builder.query<User, void>({
      query: () => "/profile",
    }),
  }),
});

export const { useGetProfileQuery } = userApi;
