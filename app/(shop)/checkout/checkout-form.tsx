"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function CheckoutForm() {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const formData = new FormData(e.currentTarget);
    const { placeOrder } = await import("@/lib/actions/checkout");

    try {
      const result = await placeOrder(formData);
      if (result?.error) {
        const msg = typeof result.error === "string"
          ? result.error
          : Object.values(result.error).flat().join(", ");
        setError(msg);
        setLoading(false);
      }
    } catch (err) {
      // Redirect throws NEXT_REDIRECT — re-throw to let Next.js handle it
      if (err instanceof Error && err.message === "NEXT_REDIRECT") {
        throw err;
      }
      setError("Failed to place order. Please try again.");
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      {error && (
        <div className="bg-red-50 text-(--color-danger) text-sm rounded-lg px-4 py-3">
          {error}
        </div>
      )}

      <Input label="Full Name" name="name" placeholder="John Doe" required />
      <Input label="Phone" name="phone" type="tel" placeholder="+1 (555) 000-0000" required />
      <Input label="Address" name="address" placeholder="123 Main St" required />
      <div className="grid grid-cols-3 gap-4">
        <Input label="City" name="city" placeholder="New York" required />
        <Input label="State" name="state" placeholder="NY" required />
        <Input label="ZIP Code" name="zip" placeholder="10001" required />
      </div>

      <Button type="submit" disabled={loading} size="lg" className="mt-4 w-full">
        {loading ? (
          <span className="flex items-center gap-2">
            <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            Processing...
          </span>
        ) : (
          "Place Order"
        )}
      </Button>
    </form>
  );
}
