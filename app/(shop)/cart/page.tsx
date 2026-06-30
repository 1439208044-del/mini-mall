import Link from "next/link";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { getCartItems } from "@/lib/queries";
import { CartItemRow } from "@/components/shop/cart-item";
import { CartSummary } from "@/components/shop/cart-summary";
import { Button } from "@/components/ui/button";

export default async function CartPage() {
  const session = await getSession();
  if (!session?.user) {
    redirect("/login?callbackUrl=/cart");
  }

  const userId = (session.user as { id: string }).id;
  const items = await getCartItems(userId);

  if (items.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <div className="text-6xl mb-4">🛒</div>
        <h1 className="text-2xl font-bold mb-2">Your cart is empty</h1>
        <p className="text-(--color-muted) mb-6">
          Looks like you haven&apos;t added anything yet.
        </p>
        <Link href="/products">
          <Button>Continue Shopping</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Shopping Cart</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2">
          {/* Table Header */}
          <div className="hidden sm:flex items-center gap-4 pb-2 border-b border-(--color-border) text-sm font-medium text-(--color-muted)">
            <div className="w-20" />
            <div className="flex-1">Product</div>
            <div className="w-28 text-center">Quantity</div>
            <div className="w-24 text-right">Subtotal</div>
            <div className="w-8" />
          </div>

          {items.map((item) => (
            <CartItemRow key={item.id} item={item} />
          ))}

          <div className="mt-4">
            <Link href="/products">
              <Button variant="ghost" size="sm">
                &larr; Continue Shopping
              </Button>
            </Link>
          </div>
        </div>

        {/* Summary */}
        <div className="lg:col-span-1">
          <CartSummary items={items} />
        </div>
      </div>
    </div>
  );
}
