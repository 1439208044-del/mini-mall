import Link from "next/link";
import { Button } from "@/components/ui/button";
import { calcSubtotal, calcShipping, calcTax, calcTotal } from "@/lib/utils";

interface CartSummaryProps {
  items: {
    quantity: number;
    product: { price: number };
  }[];
}

export function CartSummary({ items }: CartSummaryProps) {
  const subtotal = calcSubtotal(items);
  const shipping = calcShipping(subtotal);
  const tax = calcTax(subtotal);
  const total = calcTotal(items);

  return (
    <div className="bg-gray-50 rounded-xl p-6 border border-(--color-border)">
      <h2 className="text-lg font-bold mb-4">Order Summary</h2>

      <div className="flex flex-col gap-2 text-sm">
        <div className="flex justify-between">
          <span className="text-(--color-muted)">Subtotal</span>
          <span>${subtotal.toFixed(2)}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-(--color-muted)">Shipping</span>
          <span>{shipping === 0 ? "Free" : `$${shipping.toFixed(2)}`}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-(--color-muted)">Tax (8%)</span>
          <span>${tax.toFixed(2)}</span>
        </div>
        <div className="border-t border-(--color-border) pt-2 mt-1">
          <div className="flex justify-between font-bold text-base">
            <span>Total</span>
            <span>${total.toFixed(2)}</span>
          </div>
        </div>
      </div>

      <Link href="/checkout">
        <Button className="w-full mt-4" size="lg">
          Proceed to Checkout
        </Button>
      </Link>
    </div>
  );
}
