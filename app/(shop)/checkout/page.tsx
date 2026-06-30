import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { getCartItems } from "@/lib/queries";
import { calcSubtotal, calcShipping, calcTax, calcTotal } from "@/lib/utils";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { CheckoutForm } from "./checkout-form";

export default async function CheckoutPage() {
  const session = await getSession();
  if (!session?.user) {
    redirect("/login?callbackUrl=/checkout");
  }

  const userId = (session.user as { id: string }).id;
  const items = await getCartItems(userId);

  if (items.length === 0) {
    redirect("/cart");
  }

  const subtotal = calcSubtotal(items);
  const shipping = calcShipping(subtotal);
  const tax = calcTax(subtotal);
  const total = calcTotal(items);

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Checkout</h1>

      <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
        {/* Shipping Form */}
        <div className="md:col-span-3">
          <Card>
            <CardHeader>
              <h2 className="font-bold">Shipping Information</h2>
            </CardHeader>
            <CardContent>
              <CheckoutForm />
            </CardContent>
          </Card>
        </div>

        {/* Order Summary */}
        <div className="md:col-span-2">
          <Card>
            <CardHeader>
              <h2 className="font-bold">Order Summary</h2>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col gap-3">
                {items.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between text-sm"
                  >
                    <span className="flex-1 min-w-0 truncate mr-2">
                      {item.product.name}
                      <span className="text-(--color-muted)">
                        {" "}
                        x{item.quantity}
                      </span>
                    </span>
                    <span className="font-medium">
                      ${(item.product.price * item.quantity).toFixed(2)}
                    </span>
                  </div>
                ))}

                <div className="border-t border-(--color-border) pt-3 mt-2 flex flex-col gap-1.5 text-sm">
                  <div className="flex justify-between">
                    <span className="text-(--color-muted)">Subtotal</span>
                    <span>${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-(--color-muted)">Shipping</span>
                    <span>
                      {shipping === 0 ? "Free" : `$${shipping.toFixed(2)}`}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-(--color-muted)">Tax (8%)</span>
                    <span>${tax.toFixed(2)}</span>
                  </div>
                  <div className="border-t border-(--color-border) pt-2 flex justify-between font-bold">
                    <span>Total</span>
                    <span>${total.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
