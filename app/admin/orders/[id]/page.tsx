import Link from "next/link";
import { notFound } from "next/navigation";
import { getOrderById } from "@/lib/queries";
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { UpdateStatusButton } from "./update-status-button";
import type { ShippingAddress } from "@/types";
import { STATUS_VARIANT } from "@/lib/constants";
import type { OrderStatus } from "@/lib/constants";

interface AdminOrderDetailProps {
  params: Promise<{ id: string }>;
}

export default async function AdminOrderDetailPage({
  params,
}: AdminOrderDetailProps) {
  const { id } = await params;
  const order = await getOrderById(id);

  if (!order) {
    notFound();
  }

  let shippingAddress: ShippingAddress | null = null;
  try {
    shippingAddress = JSON.parse(order.shippingAddress);
  } catch {
    // keep null
  }

  return (
    <div>
      <Link
        href="/admin/orders"
        className="text-sm text-(--color-primary) hover:underline mb-4 inline-block"
      >
        &larr; Back to orders
      </Link>

      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">
          Order{" "}
          <span className="text-(--color-muted) font-mono">
            #{order.id.slice(-8)}
          </span>
        </h1>
        <Badge variant={STATUS_VARIANT[order.status as OrderStatus] || "default"}>
          {order.status}
        </Badge>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Items */}
        <div className="md:col-span-2">
          <Card>
            <CardHeader>
              <h2 className="font-bold">Items</h2>
            </CardHeader>
            <CardContent>
              {order.items.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between py-3 border-b border-(--color-border) last:border-0"
                >
                  <div>
                    <p className="font-medium text-sm">{item.product.name}</p>
                    <p className="text-xs text-(--color-muted)">
                      Qty: {item.quantity} × ${item.price.toFixed(2)}
                    </p>
                  </div>
                  <span className="font-medium text-sm">
                    ${(item.price * item.quantity).toFixed(2)}
                  </span>
                </div>
              ))}
              <div className="flex justify-between font-bold text-lg pt-4 mt-2 border-t border-(--color-border)">
                <span>Total</span>
                <span>${order.total.toFixed(2)}</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="flex flex-col gap-4">
          {/* Customer */}
          <Card>
            <CardHeader>
              <h2 className="font-bold">Customer</h2>
            </CardHeader>
            <CardContent>
              <p className="font-medium">{order.user.name}</p>
              <p className="text-sm text-(--color-muted)">{order.user.email}</p>
            </CardContent>
          </Card>

          {/* Shipping */}
          {shippingAddress && (
            <Card>
              <CardHeader>
                <h2 className="font-bold">Shipping Address</h2>
              </CardHeader>
              <CardContent>
                <div className="text-sm">
                  <p className="font-medium">{shippingAddress.name}</p>
                  <p className="text-(--color-muted)">{shippingAddress.phone}</p>
                  <p className="text-(--color-muted) mt-1">
                    {shippingAddress.address}
                  </p>
                  <p className="text-(--color-muted)">
                    {shippingAddress.city}, {shippingAddress.state}{" "}
                    {shippingAddress.zip}
                  </p>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Status Update */}
          <Card>
            <CardHeader>
              <h2 className="font-bold">Update Status</h2>
            </CardHeader>
            <CardContent>
              <UpdateStatusButton orderId={order.id} currentStatus={order.status} />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
