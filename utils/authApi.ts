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
      query: (body) => {
        console.log("🚀 LOGIN REQUEST STARTED");
        console.log("📤 Request Body:", body);
        console.log("🌐 Request URL:", `${BASE_URL}/auth/login`);
        console.log("🔧 Request Method: POST");
        
        return {
          url: "/login",
          method: "POST",
          body,
        };
      },
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          console.log("⏳ Waiting for login response...");
          const { data } = await queryFulfilled;
          
          console.log("✅ LOGIN RESPONSE RECEIVED");
          console.log("📥 Full Response Data:", data);
          console.log("🔑 Access Token:", data?.access_token);
          console.log("📊 Response Type:", typeof data);
          console.log("🔍 Response Keys:", Object.keys(data || {}));
          
          if (data && data.access_token) {
            console.log("🎯 Token found, dispatching to Redux store...");
            console.log("🔐 Token Length:", data.access_token.length);
            console.log("🔐 Token Preview:", data.access_token.substring(0, 50) + "...");
            
            dispatch(setCredentials({ token: data.access_token }));
            console.log("✅ Token successfully stored in Redux store");
            toast.success("Logged in successfully");
          } else {
            console.error("❌ No access token found in response");
            console.error("🚫 Response data:", data);
            toast.error("Login failed: token missing");
          }
        } catch (err: any) {
          console.error("💥 LOGIN ERROR OCCURRED");
          console.error("❌ Error object:", err);
          console.error("📝 Error message:", err?.error?.data?.message);
          console.error("🔍 Full error details:", JSON.stringify(err, null, 2));
          toast.error(err?.error?.data?.message || "Login failed");
        }
      },
    }),
  }),
});

export const { useRegisterMutation, useLoginMutation } = authApi;
