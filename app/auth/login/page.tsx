"use client";
import { useForm } from "react-hook-form";
import { useLoginMutation } from "@/utils/authApi";
import { useRouter } from "next/navigation";
import FormInput from "@/components/FormInput";
import Spinner from "@/components/Spinner";
import Link from "next/link";
import { useState } from "react";

interface LoginFormData {
  email: string;
  password: string;
}

export default function Login() {
  const { register, handleSubmit } = useForm<LoginFormData>();
  const [login] = useLoginMutation();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const onSubmit = async (data: LoginFormData) => {
    console.log("🚀 LOGIN FORM SUBMITTED");
    console.log("📝 Form Data:", data);
    console.log("📧 Email:", data.email);
    console.log("🔒 Password:", data.password);
    console.log("⏰ Timestamp:", new Date().toISOString());

    setIsLoading(true);
    try {
      console.log("🔄 Calling login mutation...");
      await login(data);
      console.log("✅ Login mutation completed successfully");
      console.log("🚀 Redirecting to dashboard...");
      router.push("/dashboard");
    } catch (error) {
      console.error("💥 Login error in component:", error);
    } finally {
      console.log("🏁 Login process finished, setting loading to false");
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-indigo-500 to-purple-600">
      <div className="bg-white rounded-xl shadow-lg p-10 w-full max-w-md">
        {/* Optional Logo or Hero */}
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold text-indigo-600">
            Car Management App
          </h1>
          <p className="text-gray-500 mt-2">
            Login to manage your cars and categories
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <FormInput id="email" label="Email" register={register} required />
          <FormInput
            id="password"
            label="Password"
            type="password"
            register={register}
            required
          />

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-indigo-600 cursor-pointer text-white py-2 rounded-lg font-semibold shadow hover:bg-indigo-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
          >
            {isLoading ? (
              <>
                <Spinner size="sm" className="mr-2" />
                Logging in...
              </>
            ) : (
              "Login"
            )}
          </button>
        </form>

        <div className="text-center mt-6 text-gray-500 text-sm">
          Don&apos;t have an account?{" "}
          <Link
            href="/auth/register"
            className="text-indigo-600 hover:underline"
          >
            Register
          </Link>
        </div>
      </div>
    </div>
  );
}
