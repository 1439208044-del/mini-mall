import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { SafeImage } from "@/components/ui/safe-image";

interface ProductCardProps {
  product: {
    id: string;
    name: string;
    slug: string;
    price: number;
    comparePrice: number | null;
    image: string;
    category: { name: string };
  };
}

export function ProductCard({ product }: ProductCardProps) {
  const discount = product.comparePrice
    ? Math.round(
        ((product.comparePrice - product.price) / product.comparePrice) * 100
      )
    : 0;

  return (
    <Link href={`/products/${product.slug}`} className="group block">
      <Card className="h-full overflow-hidden hover:shadow-md transition-shadow">
        <div className="aspect-square bg-gray-100 relative overflow-hidden">
          <div className="w-full h-full flex items-center justify-center text-6xl">
            <SafeImage
              src={product.image}
              alt={product.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 text-6xl"
            />
          </div>
          {discount > 0 && (
            <Badge variant="danger" className="absolute top-2 left-2">
              -{discount}%
            </Badge>
          )}
        </div>
        <CardContent>
          <p className="text-xs text-(--color-muted) mb-1">
            {product.category.name}
          </p>
          <h3 className="font-medium text-sm mb-2 line-clamp-2 group-hover:text-(--color-primary) transition-colors">
            {product.name}
          </h3>
          <div className="flex items-center gap-2">
            <span className="text-lg font-bold text-(--color-foreground)">
              ${product.price.toFixed(2)}
            </span>
            {product.comparePrice && (
              <span className="text-sm text-(--color-muted) line-through">
                ${product.comparePrice.toFixed(2)}
              </span>
            )}
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
