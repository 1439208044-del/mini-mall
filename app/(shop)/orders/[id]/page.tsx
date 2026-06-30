import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { getOrderById } from "@/lib/queries";
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { SafeImage } from "@/components/ui/safe-image";
import { Button } from "@/components/ui/button";
import { PayButton } from "./pay-button";
import { ReviewForm } from "@/components/shop/review-form";
import type { ShippingAddress } from "@/types";
import { STATUS_VARIANT, STATUS_LABEL } from "@/lib/constants";
import type { OrderStatus } from "@/lib/constants";

interface OrderDetailProps {
  params: Promise<{ id: string }>;
}

export default async function OrderDetailPage({ params }: OrderDetailProps) {
  const { id } = await params;
  const session = await getSession();
  if (!session?.user) {
    redirect("/login");
  }

  const userId = (session.user as { id: string }).id;
  const order = await getOrderById(id);

  if (!order || (order.userId !== userId && (session.user as { role: string }).role !== "ADMIN")) {
    notFound();
  }

  let shippingAddress: ShippingAddress | null = null;
  try {
    shippingAddress = JSON.parse(order.shippingAddress);
  } catch {
    // keep null
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <Link
        href="/orders"
        className="text-sm text-(--color-primary) hover:underline mb-4 inline-block"
      >
        &larr; Back to orders
      </Link>

      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">
          Order <span className="text-(--color-muted) font-mono">#{order.id.slice(-8)}</span>
        </h1>
        <Badge variant={STATUS_VARIANT[order.status as OrderStatus] || "default"}>
          {STATUS_LABEL[order.status as OrderStatus] || order.status}
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
                  className="flex items-center gap-4 py-3 border-b border-(--color-border) last:border-0"
                >
                  <Link
                    href={`/products/${item.product.slug}`}
                    className="w-16 h-16 bg-gray-100 rounded-lg flex-shrink-0 flex items-center justify-center text-xl overflow-hidden"
                  >
                    {item.product.image && item.product.image !== "/placeholder.svg" ? (
                      <SafeImage
                        src={item.product.image}
                        alt={item.product.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span>📦</span>
                    )}
                  </Link>
                  <div className="flex-1">
                    <Link
                      href={`/products/${item.product.slug}`}
                      className="font-medium text-sm hover:text-(--color-primary)"
                    >
                      {item.product.name}
                    </Link>
                    <p className="text-sm text-(--color-muted)">
                      Qty: {item.quantity} × ${item.price.toFixed(2)}
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="font-medium block">
                      ${(item.price * item.quantity).toFixed(2)}
                    </span>
                    {order.status === "DELIVERED" && (
                      <ReviewForm
                        productId={item.product.id}
                        orderId={order.id}
                        existingReview={order.reviews.some((review) => review.productId === item.product.id)}
                      />
                    )}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Details */}
        <div className="flex flex-col gap-4">
          {/* Payment */}
          <Card>
            <CardHeader>
              <h2 className="font-bold">Payment</h2>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col gap-2 text-sm">
                <div className="flex justify-between font-bold text-lg">
                  <span>Total</span>
                  <span>${order.total.toFixed(2)}</span>
                </div>
              </div>
              {order.status === "PENDING" && (
                <PayButton orderId={order.id} />
              )}
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

          {/* Timeline */}
          <Card>
            <CardHeader>
              <h2 className="font-bold">Timeline</h2>
            </CardHeader>
            <CardContent>
              <div className="text-sm text-(--color-muted)">
                <p>Order placed: {new Date(order.createdAt).toLocaleString()}</p>
                <p>Last updated: {new Date(order.updatedAt).toLocaleString()}</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
