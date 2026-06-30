"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

export function PayButton({ orderId }: { orderId: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handlePay() {
    setLoading(true);
    const { simulatePayment } = await import("@/lib/actions/checkout");
    const result = await simulatePayment(orderId);

    if (result.error) {
      alert(result.error);
      setLoading(false);
    } else {
      router.refresh();
    }
  }

  return (
    <Button onClick={handlePay} disabled={loading} className="w-full mt-4">
      {loading ? (
        <span className="flex items-center gap-2">
          <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
          Processing Payment...
        </span>
      ) : (
        "💳 Pay Now (Simulate)"
      )}
    </Button>
  );
}
