import { Suspense } from "react";
import Link from "next/link";
import { getCategories, getProducts } from "@/lib/queries";
import { ProductGrid } from "@/components/shop/product-grid";
import { SearchBar } from "@/components/shop/search-bar";
import { CategoryFilter } from "@/components/shop/category-filter";

interface ProductsPageProps {
  searchParams: Promise<{
    search?: string;
    category?: string;
    page?: string;
  }>;
}

export default async function ProductsPage({
  searchParams,
}: ProductsPageProps) {
  const params = await searchParams;
  const search = params.search;
  const categoryId = params.category;
  const page = Number(params.page) || 1;

  const [categories, result] = await Promise.all([
    getCategories(),
    getProducts({ search, categoryId, page }),
  ]);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Products</h1>

      {/* Search */}
      <div className="mb-6">
        <Suspense fallback={<div className="h-11 bg-gray-100 rounded-lg animate-pulse" />}>
          <SearchBar />
        </Suspense>
      </div>

      <div className="flex gap-8">
        {/* Category Sidebar */}
        <aside className="hidden md:block w-56 shrink-0">
          <div className="sticky top-20">
            <Suspense
              fallback={
                <div className="space-y-2">
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className="h-8 bg-gray-100 rounded-lg animate-pulse" />
                  ))}
                </div>
              }
            >
              <CategoryFilter categories={categories} />
            </Suspense>
          </div>
        </aside>

        {/* Product Grid */}
        <div className="flex-1 min-w-0">
          <p className="text-sm text-(--color-muted) mb-4">
            {result.total} product{result.total !== 1 ? "s" : ""} found
          </p>
          <ProductGrid products={result.products} />

          {/* Pagination */}
          {result.pages > 1 && (
            <div className="flex items-center justify-center gap-2 mt-8">
              {page > 1 && (
                <Link
                  href={`/products?${new URLSearchParams({
                    ...(search && { search }),
                    ...(categoryId && { category: categoryId }),
                    page: String(page - 1),
                  }).toString()}`}
                  className="px-4 py-2 rounded-lg border border-(--color-border) text-sm font-medium hover:bg-gray-50 transition-colors"
                >
                  Previous
                </Link>
              )}
              <span className="text-sm text-(--color-muted) px-4">
                Page {page} of {result.pages}
              </span>
              {page < result.pages && (
                <Link
                  href={`/products?${new URLSearchParams({
                    ...(search && { search }),
                    ...(categoryId && { category: categoryId }),
                    page: String(page + 1),
                  }).toString()}`}
                  className="px-4 py-2 rounded-lg border border-(--color-border) text-sm font-medium hover:bg-gray-50 transition-colors"
                >
                  Next
                </Link>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
