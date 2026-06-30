"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

export function DeleteProductButton({
  productId,
  productName,
}: {
  productId: string;
  productName: string;
}) {
  const router = useRouter();
  const [confirming, setConfirming] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleDelete() {
    setLoading(true);
    const { deleteProduct } = await import("@/lib/actions/products");
    await deleteProduct(productId);
    router.refresh();
  }

  if (confirming) {
    return (
      <div className="flex items-center gap-1">
        <Button variant="danger" size="sm" onClick={handleDelete} disabled={loading}>
          {loading ? "..." : "Confirm"}
        </Button>
        <Button variant="ghost" size="sm" onClick={() => setConfirming(false)}>
          Cancel
        </Button>
      </div>
    );
  }

  return (
    <Button variant="ghost" size="sm" onClick={() => setConfirming(true)}>
      <span className="text-(--color-danger)">Delete</span>
    </Button>
  );
}
