import Link from "next/link";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { getOrders } from "@/lib/queries";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { STATUS_VARIANT, STATUS_LABEL } from "@/lib/constants";
import type { OrderStatus } from "@/lib/constants";

export default async function OrdersPage() {
  const session = await getSession();
  if (!session?.user) {
    redirect("/login");
  }

  const userId = (session.user as { id: string }).id;
  const orders = await getOrders(userId);

  if (orders.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <div className="text-6xl mb-4">📦</div>
        <h1 className="text-2xl font-bold mb-2">No orders yet</h1>
        <p className="text-(--color-muted) mb-6">
          You haven&apos;t placed any orders. Start shopping!
        </p>
        <Link href="/products">
          <Button>Browse Products</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">My Orders</h1>

      <div className="flex flex-col gap-4">
        {orders.map((order) => (
          <Link key={order.id} href={`/orders/${order.id}`}>
            <Card className="hover:shadow-md transition-shadow">
              <CardContent className="flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-3 mb-1">
                    <span className="text-sm text-(--color-muted) font-mono">
                      #{order.id.slice(-8)}
                    </span>
                    <Badge variant={STATUS_VARIANT[order.status as OrderStatus] || "default"}>
                      {STATUS_LABEL[order.status as OrderStatus] || order.status}
                    </Badge>
                  </div>
                  <p className="text-sm text-(--color-muted)">
                    {order.items.length} item
                    {order.items.length !== 1 ? "s" : ""}
                    {" · "}
                    {new Date(order.createdAt).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-bold">${order.total.toFixed(2)}</p>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    className="inline-block text-(--color-muted)"
                  >
                    <path d="m9 18 6-6-6-6" />
                  </svg>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
