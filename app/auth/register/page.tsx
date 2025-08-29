"use client";

import { useForm } from "react-hook-form";
import { useRegisterMutation } from "@/utils/authApi";
import { useRouter } from "next/navigation";
import FormInput from "@/components/FormInput";
import Spinner from "@/components/Spinner";
import Link from "next/link";
import { useState } from "react";

interface RegisterFormData {
  name: string;
  email: string;
  password: string;
}

export default function Register() {
  const { register, handleSubmit } = useForm<RegisterFormData>();
  const [registerUser] = useRegisterMutation();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const onSubmit = async (data: RegisterFormData) => {
    setIsLoading(true);
    try {
      await registerUser(data);
      router.push("/dashboard");
    } catch (error) {
      console.error("Registration failed:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-indigo-500 to-purple-600">
      <div className="bg-white rounded-xl shadow-lg p-10 w-full max-w-md">
        {/* Optional Logo / Hero */}
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold text-indigo-600">
            Car Management App
          </h1>
          <p className="text-gray-500 mt-2">
            Create an account to manage cars and categories
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <FormInput id="name" label="Name" register={register} required />
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
                Creating account...
              </>
            ) : (
              "Register"
            )}
          </button>
        </form>

        <div className="text-center mt-6 text-gray-500 text-sm">
          Already have an account?{" "}
          <Link href="/auth/login" className="text-indigo-600 hover:underline">
            Login
          </Link>
        </div>
      </div>
    </div>
  );
}
