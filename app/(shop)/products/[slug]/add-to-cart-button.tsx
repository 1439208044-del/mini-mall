"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";

interface AddToCartButtonProps {
  productId: string;
  disabled: boolean;
}

export function AddToCartButton({
  productId,
  disabled,
}: AddToCartButtonProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleAddToCart() {
    setLoading(true);
    const { addToCart } = await import("@/lib/actions/cart");
    const result = await addToCart(productId);

    if (result.error) {
      if (result.error === "Unauthorized") {
        router.push("/login");
      } else {
        alert(result.error);
      }
    } else {
      router.refresh();
      // Quick visual feedback
      const btn = document.activeElement as HTMLElement;
      btn?.blur();
    }

    setLoading(false);
  }

  return (
    <Button
      onClick={handleAddToCart}
      disabled={disabled || loading}
      size="lg"
      className="w-full sm:w-auto"
    >
      {loading ? (
        <span className="flex items-center gap-2">
          <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
          Adding...
        </span>
      ) : disabled ? (
        "Unavailable"
      ) : (
        "Add to Cart"
      )}
    </Button>
  );
}
