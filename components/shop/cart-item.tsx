"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { SafeImage } from "@/components/ui/safe-image";

interface CartItemProps {
  item: {
    id: string;
    quantity: number;
    product: {
      id: string;
      name: string;
      slug: string;
      price: number;
      image: string;
      inventory: number;
    };
  };
}

export function CartItemRow({ item }: CartItemProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function updateQuantity(newQty: number) {
    setLoading(true);
    const { updateCartQuantity } = await import("@/lib/actions/cart");
    await updateCartQuantity(item.id, newQty);
    router.refresh();
    setLoading(false);
  }

  async function removeItem() {
    setLoading(true);
    const { removeFromCart } = await import("@/lib/actions/cart");
    await removeFromCart(item.id);
    router.refresh();
    setLoading(false);
  }

  return (
    <div className="flex items-center gap-4 py-4 border-b border-(--color-border)">
      {/* Image */}
      <Link
        href={`/products/${item.product.slug}`}
        className="w-20 h-20 bg-gray-100 rounded-lg flex-shrink-0 flex items-center justify-center text-2xl overflow-hidden"
      >
        <SafeImage
          src={item.product.image}
          alt={item.product.name}
          className="w-full h-full object-cover"
        />
      </Link>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <Link
          href={`/products/${item.product.slug}`}
          className="font-medium text-sm hover:text-(--color-primary) transition-colors line-clamp-1"
        >
          {item.product.name}
        </Link>
        <p className="text-sm font-bold mt-1">
          ${item.product.price.toFixed(2)}
        </p>
      </div>

      {/* Quantity */}
      <div className="flex items-center gap-1">
        <button
          onClick={() => updateQuantity(item.quantity - 1)}
          disabled={loading}
          className="w-8 h-8 rounded-lg border border-(--color-border) flex items-center justify-center hover:bg-gray-50 disabled:opacity-50 transition-colors text-sm"
        >
          -
        </button>
        <span className="w-10 text-center text-sm font-medium">
          {item.quantity}
        </span>
        <button
          onClick={() => updateQuantity(item.quantity + 1)}
          disabled={loading || item.quantity >= item.product.inventory}
          className="w-8 h-8 rounded-lg border border-(--color-border) flex items-center justify-center hover:bg-gray-50 disabled:opacity-50 transition-colors text-sm"
        >
          +
        </button>
      </div>

      {/* Subtotal */}
      <div className="hidden sm:block w-24 text-right">
        <span className="font-medium text-sm">
          ${(item.product.price * item.quantity).toFixed(2)}
        </span>
      </div>

      {/* Remove */}
      <button
        onClick={removeItem}
        disabled={loading}
        className="p-2 text-(--color-muted) hover:text-(--color-danger) transition-colors disabled:opacity-50"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path d="M3 6h18" />
          <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
          <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
        </svg>
      </button>
    </div>
  );
}
