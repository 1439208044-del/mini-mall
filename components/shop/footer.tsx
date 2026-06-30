import Link from "next/link";

export function Footer() {
  return (
    <footer className="bg-gray-50 border-t border-(--color-border) mt-auto">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <Link
            href="/"
            className="text-lg font-bold text-(--color-primary)"
          >
            Mini Mall
          </Link>
          <nav className="flex items-center gap-6">
            <Link
              href="/products"
              className="text-sm text-(--color-muted) hover:text-(--color-foreground) transition-colors"
            >
              Products
            </Link>
            <Link
              href="/cart"
              className="text-sm text-(--color-muted) hover:text-(--color-foreground) transition-colors"
            >
              Cart
            </Link>
          </nav>
          <p className="text-sm text-(--color-muted)">
            &copy; {new Date().getFullYear()} Mini Mall. Demo project.
          </p>
        </div>
      </div>
    </footer>
  );
}
