"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { signIn } from "next-auth/react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface RegisterForm {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export default function RegisterPage() {
  const router = useRouter();
  const [serverError, setServerError] = useState("");

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<RegisterForm>();

  const password = watch("password");

  async function onSubmit(data: RegisterForm) {
    setServerError("");

    if (data.password !== data.confirmPassword) {
      return;
    }

    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("email", data.email);
    formData.append("password", data.password);
    formData.append("confirmPassword", data.confirmPassword);

    const { registerUser } = await import("@/lib/actions/auth");
    const result = await registerUser(formData);

    if (result.error) {
      const firstError = Object.values(result.error).flat()[0];
      setServerError(firstError || "Registration failed");
      return;
    }

    // Auto-login after register
    await signIn("credentials", {
      email: data.email,
      password: data.password,
      redirect: false,
    });

    router.push("/");
    router.refresh();
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="text-3xl font-bold text-(--color-primary)">
            Mini Mall
          </Link>
          <p className="mt-2 text-(--color-muted)">Create your account</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-(--color-border) p-8">
          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
            {serverError && (
              <div className="bg-red-50 text-(--color-danger) text-sm rounded-lg px-4 py-3">
                {serverError}
              </div>
            )}

            <Input
              label="Full Name"
              placeholder="John Doe"
              error={errors.name?.message}
              {...register("name", {
                required: "Name is required",
                minLength: {
                  value: 2,
                  message: "Name must be at least 2 characters",
                },
              })}
            />

            <Input
              label="Email"
              type="email"
              placeholder="you@example.com"
              error={errors.email?.message}
              {...register("email", {
                required: "Email is required",
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: "Invalid email address",
                },
              })}
            />

            <Input
              label="Password"
              type="password"
              placeholder="••••••"
              error={errors.password?.message}
              {...register("password", {
                required: "Password is required",
                minLength: {
                  value: 6,
                  message: "Password must be at least 6 characters",
                },
              })}
            />

            <Input
              label="Confirm Password"
              type="password"
              placeholder="••••••"
              error={errors.confirmPassword?.message}
              {...register("confirmPassword", {
                required: "Please confirm your password",
                validate: (value) =>
                  value === password || "Passwords do not match",
              })}
            />

            <Button type="submit" disabled={isSubmitting} className="w-full mt-2">
              {isSubmitting ? "Creating account..." : "Create Account"}
            </Button>
          </form>

          <p className="text-center text-sm text-(--color-muted) mt-6">
            Already have an account?{" "}
            <Link
              href="/login"
              className="text-(--color-primary) font-medium hover:underline"
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
