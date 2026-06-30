import Link from "next/link";
import { getSession } from "@/lib/auth";
import { getCartItemCount } from "@/lib/queries";
import { CartButton } from "./cart-button";
import { UserMenu } from "./user-menu";

export async function Header() {
  const session = await getSession();
  const userId = (session?.user as { id?: string })?.id;
  const cartCount = userId ? await getCartItemCount(userId) : 0;

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-(--color-border) shadow-sm">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-8">
          <Link
            href="/"
            className="text-xl font-bold text-(--color-primary) tracking-tight"
          >
            Mini Mall
          </Link>
          <nav className="hidden md:flex items-center gap-6">
            <Link
              href="/products"
              className="text-sm font-medium text-(--color-foreground) hover:text-(--color-primary) transition-colors"
            >
              All Products
            </Link>
          </nav>
        </div>

        <div className="flex items-center gap-4">
          <CartButton count={cartCount} />
          <UserMenu session={session} />
        </div>
      </div>
    </header>
  );
}
