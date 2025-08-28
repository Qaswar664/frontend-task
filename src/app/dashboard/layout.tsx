'use client';

import Navbar from "@/components/Navbar";
import { useAuth } from "@/hooks/useAuth";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  useAuth(); 

  return (
    <div className="flex flex-col h-screen">
      <Navbar />
      <div className="flex flex-1">
        <main className="flex-1 p-4">{children}</main>
      </div>
    </div>
  );
}
