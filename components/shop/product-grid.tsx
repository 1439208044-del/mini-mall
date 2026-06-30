import { ProductCard } from "./product-card";

interface ProductGridProps {
  products: {
    id: string;
    name: string;
    slug: string;
    price: number;
    comparePrice: number | null;
    image: string;
    category: { name: string };
  }[];
}

export function ProductGrid({ products }: ProductGridProps) {
  if (products.length === 0) {
    return (
      <div className="text-center py-16">
        <p className="text-(--color-muted) text-lg">No products found</p>
        <p className="text-(--color-muted) text-sm mt-1">
          Try adjusting your search or filter
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
