"use client";

import Link from "next/link";
import { useDispatch } from "react-redux";
import { logout } from "../features/authSlice";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Spinner from "./Spinner";

export default function Navbar() {
  const dispatch = useDispatch();
  const router = useRouter();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      dispatch(logout());
      router.push("/auth/login");
    } catch (error) {
      console.error("Logout failed:", error);
    } finally {
      setIsLoggingOut(false);
    }
  };

  const links = [
    { name: "Home", href: "/dashboard" },
    { name: "Cars", href: "/dashboard/cars" },
    { name: "Categories", href: "/dashboard/categories" },
    { name: "Profile", href: "/dashboard/profile" },
  ];

  return (
    <nav className="bg-blue-600 p-4 text-white flex items-center justify-between relative">
      <h1 className="text-2xl font-bold">Car Management</h1>

      <div className="absolute left-1/2 transform -translate-x-1/2 hidden md:flex space-x-8 lg:space-x-24">
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="hover:text-gray-200 text-base transition"
          >
            {link.name}
          </Link>
        ))}
      </div>

      <button
        onClick={handleLogout}
        disabled={isLoggingOut}
        className="bg-red-500 cursor-pointer hover:bg-red-600 transition px-4 py-2 rounded disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center min-w-[80px]"
      >
        {isLoggingOut ? (
          <>
            <Spinner size="sm" className="mr-2" />
            Logging out...
          </>
        ) : (
          "Logout"
        )}
      </button>
    </nav>
  );
}
