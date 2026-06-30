"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ORDER_STATUSES, STATUS_LABEL } from "@/lib/constants";
import type { OrderStatus } from "@/lib/constants";

const statuses = ORDER_STATUSES.map((s) => ({ value: s, label: STATUS_LABEL[s] }));

export function UpdateStatusButton({
  orderId,
  currentStatus,
}: {
  orderId: string;
  currentStatus: string;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState<string | null>(null);

  async function handleUpdate(status: string) {
    setLoading(status);
    const { updateOrderStatus } = await import("@/lib/actions/checkout");
    const result = await updateOrderStatus(orderId, status);

    if (result?.error) {
      alert(result.error);
    } else {
      router.refresh();
    }
    setLoading(null);
  }

  return (
    <div className="flex flex-col gap-2">
      {statuses.map((s) => (
        <Button
          key={s.value}
          variant={s.value === currentStatus ? "secondary" : "ghost"}
          size="sm"
          disabled={loading === s.value}
          onClick={() => handleUpdate(s.value)}
          className="justify-start"
        >
          {loading === s.value ? (
            <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-2" />
          ) : null}
          {s.label}
          {s.value === currentStatus && (
            <span className="ml-auto text-(--color-success)">✓</span>
          )}
        </Button>
      ))}
    </div>
  );
}
