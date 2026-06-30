import Link from "next/link";
import { notFound } from "next/navigation";
import { getProductBySlug } from "@/lib/queries";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { SafeImage } from "@/components/ui/safe-image";
import { AddToCartButton } from "./add-to-cart-button";
import { Card, CardContent } from "@/components/ui/card";

interface ProductPageProps {
  params: Promise<{ slug: string }>;
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) {
    notFound();
  }

  const discount = product.comparePrice
    ? Math.round(
        ((product.comparePrice - product.price) / product.comparePrice) * 100
      )
    : 0;

  const inStock = product.inventory > 0;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <nav className="mb-6">
        <ol className="flex items-center gap-2 text-sm text-(--color-muted)">
          <li>
            <Link href="/" className="hover:text-(--color-primary)">
              Home
            </Link>
          </li>
          <li>/</li>
          <li>
            <Link href="/products" className="hover:text-(--color-primary)">
              Products
            </Link>
          </li>
          <li>/</li>
          <li>
            <Link
              href={`/products?category=${product.categoryId}`}
              className="hover:text-(--color-primary)"
            >
              {product.category.name}
            </Link>
          </li>
          <li>/</li>
          <li className="text-(--color-foreground) font-medium truncate">
            {product.name}
          </li>
        </ol>
      </nav>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        {/* Image */}
        <div className="aspect-square bg-gray-100 rounded-xl overflow-hidden flex items-center justify-center text-8xl">
          <SafeImage
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Details */}
        <div>
          <Badge>{product.category.name}</Badge>

          <h1 className="text-3xl font-bold mt-3 mb-2">{product.name}</h1>

          <div className="flex items-baseline gap-3 mt-4">
            <span className="text-3xl font-bold text-(--color-foreground)">
              ${product.price.toFixed(2)}
            </span>
            {product.comparePrice && (
              <>
                <span className="text-lg text-(--color-muted) line-through">
                  ${product.comparePrice.toFixed(2)}
                </span>
                <Badge variant="danger">Save {discount}%</Badge>
              </>
            )}
          </div>

          <p className="mt-6 text-(--color-foreground)/80 leading-relaxed">
            {product.description}
          </p>

          <div className="mt-6 flex items-center gap-3">
            <Badge variant={inStock ? "success" : "danger"}>
              {inStock
                ? `In Stock (${product.inventory} available)`
                : "Out of Stock"}
            </Badge>
          </div>

          <div className="mt-8">
            <AddToCartButton
              productId={product.id}
              disabled={!product.isActive || !inStock}
            />
          </div>

          {/* Back link */}
          <div className="mt-8 pt-6 border-t border-(--color-border)">
            <Link
              href="/products"
              className="text-sm text-(--color-primary) hover:underline"
            >
              &larr; Back to products
            </Link>
          </div>
        </div>
      </div>

      <div className="mt-12">
        <h2 className="text-2xl font-bold mb-4">Customer reviews</h2>
        {product.reviews.length === 0 ? (
          <Card>
            <CardContent>
              <p className="text-(--color-muted)">No reviews yet.</p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {product.reviews.map((review) => (
              <Card key={review.id}>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-semibold">{review.user.name}</p>
                      <p className="text-sm text-(--color-muted)">
                        {"★".repeat(review.rating)}{"☆".repeat(5 - review.rating)}
                      </p>
                    </div>
                    <p className="text-sm text-(--color-muted)">
                      {new Date(review.createdAt).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </p>
                  </div>
                  <p className="mt-3 text-(--color-foreground)/80">{review.comment}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
