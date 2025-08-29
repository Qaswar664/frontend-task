"use client";

import { useSelector } from "react-redux";
import { RootState } from "../lib/store";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Spinner from "../components/Spinner";

export default function Home() {
  const { token } = useSelector((state: RootState) => state.auth);
  const router = useRouter();

  useEffect(() => {
    if (token) {
      router.push("/dashboard");
    } else {
      router.push("/auth/login");
    }
  }, [token, router]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <Spinner size="xl" />
    </div>
  );
}
