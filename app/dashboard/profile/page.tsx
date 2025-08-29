"use client";

import { useGetProfileQuery } from "@/utils/userApi";

export default function Profile() {
  const { data: user, isLoading } = useGetProfileQuery();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-40">
        <p className="text-gray-500 animate-pulse">Loading profile...</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-6 py-20">
      <div className="bg-white shadow-md rounded-xl p-6 border border-gray-200 py-20">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Profile</h2>
        <div className="space-y-3">
          <div className="flex justify-between border-b pb-2">
            <span className="font-semibold text-gray-600">Email</span>
            <span className="text-gray-800">{user?.email}</span>
          </div>
          <div className="flex justify-between border-b pb-2">
            <span className="font-semibold text-gray-600">Name</span>
            <span className="text-gray-800">{user?.name}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
