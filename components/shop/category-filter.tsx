"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useTransition } from "react";

interface CategoryFilterProps {
  categories: { id: string; name: string; slug: string }[];
}

export function CategoryFilter({ categories }: CategoryFilterProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();
  const activeCategory = searchParams.get("category");

  function handleFilter(categoryId: string | null) {
    const params = new URLSearchParams(searchParams.toString());
    if (categoryId) {
      params.set("category", categoryId);
    } else {
      params.delete("category");
    }
    params.delete("page");
    startTransition(() => {
      router.push(`/products?${params.toString()}`);
    });
  }

  return (
    <div>
      <h3 className="font-medium text-sm mb-3">Categories</h3>
      <div className="flex flex-col gap-1">
        <button
          onClick={() => handleFilter(null)}
          className={`text-left px-3 py-2 rounded-lg text-sm transition-colors ${
            !activeCategory
              ? "bg-(--color-primary-light) text-(--color-primary) font-medium"
              : "text-(--color-foreground) hover:bg-gray-100"
          }`}
        >
          All Products
        </button>
        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => handleFilter(category.id)}
            className={`text-left px-3 py-2 rounded-lg text-sm transition-colors ${
              activeCategory === category.id
                ? "bg-(--color-primary-light) text-(--color-primary) font-medium"
                : "text-(--color-foreground) hover:bg-gray-100"
            }`}
          >
            {category.name}
          </button>
        ))}
      </div>
      {isPending && (
        <div className="mt-2 flex justify-center">
          <div className="w-4 h-4 border-2 border-(--color-primary) border-t-transparent rounded-full animate-spin" />
        </div>
      )}
    </div>
  );
}
