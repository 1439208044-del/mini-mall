"use client";

import { useState, Suspense } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/";
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const formData = new FormData(e.currentTarget);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    if (result?.error) {
      setError("Invalid email or password");
      setLoading(false);
    } else {
      router.push(callbackUrl);
      router.refresh();
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="text-3xl font-bold text-(--color-primary)">
            Mini Mall
          </Link>
          <p className="mt-2 text-(--color-muted)">Sign in to your account</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-(--color-border) p-8">
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            {error && (
              <div className="bg-red-50 text-(--color-danger) text-sm rounded-lg px-4 py-3">
                {error}
              </div>
            )}

            <Input
              label="Email"
              name="email"
              type="email"
              placeholder="admin@minimall.com"
              required
            />

            <Input
              label="Password"
              name="password"
              type="password"
              placeholder="••••••"
              required
            />

            <Button type="submit" disabled={loading} className="w-full mt-2">
              {loading ? "Signing in..." : "Sign In"}
            </Button>
          </form>

          <p className="text-center text-sm text-(--color-muted) mt-6">
            Don&apos;t have an account?{" "}
            <Link
              href="/register"
              className="text-(--color-primary) font-medium hover:underline"
            >
              Create one
            </Link>
          </p>
        </div>

        <div className="mt-4 bg-blue-50 rounded-lg p-4 text-sm text-(--color-primary)">
          <p className="font-medium mb-1">Demo Accounts:</p>
          <p>Admin: admin@minimall.com / admin123</p>
          <p>Customer: user@minimall.com / user123</p>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  );
}
