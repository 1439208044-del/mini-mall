import Link from "next/link";
import { getFeaturedProducts } from "@/lib/queries";
import { ProductCard } from "@/components/shop/product-card";
import { Button } from "@/components/ui/button";

export default async function HomePage() {
  const products = await getFeaturedProducts(8);

  return (
    <div>
      {/* Hero */}
      <section className="bg-gradient-to-br from-(--color-primary) to-(--color-primary-dark) text-white">
        <div className="max-w-7xl mx-auto px-4 py-20 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Welcome to Mini Mall
          </h1>
          <p className="text-lg md:text-xl text-white/80 mb-8 max-w-2xl mx-auto">
            Discover amazing products at unbeatable prices. From electronics to
            fashion, we have everything you need.
          </p>
          <div className="flex items-center justify-center gap-4">
            <Link href="/products">
              <Button
                variant="secondary"
                size="lg"
                className="bg-white text-(--color-primary) hover:bg-gray-100"
              >
                Shop Now
              </Button>
            </Link>
            <Link href="/register">
              <Button
                variant="ghost"
                size="lg"
                className="border border-white/30 text-white hover:bg-white/10"
              >
                Create Account
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="max-w-7xl mx-auto px-4 py-16">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold">Featured Products</h2>
            <p className="text-(--color-muted) mt-1">
              Check out our latest arrivals
            </p>
          </div>
          <Link
            href="/products"
            className="text-sm font-medium text-(--color-primary) hover:underline"
          >
            View All
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>
    </div>
  );
}
