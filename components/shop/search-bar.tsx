"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useTransition } from "react";

export function SearchBar() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  function handleSearch(value: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set("search", value);
    } else {
      params.delete("search");
    }
    params.delete("page");
    startTransition(() => {
      router.push(`/products?${params.toString()}`);
    });
  }

  return (
    <div className="relative">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        className="absolute left-3 top-1/2 -translate-y-1/2 text-(--color-muted)"
      >
        <circle cx="11" cy="11" r="8" />
        <path d="m21 21-4.3-4.3" />
      </svg>
      <input
        type="text"
        placeholder="Search products..."
        defaultValue={searchParams.get("search") || ""}
        onChange={(e) => handleSearch(e.target.value)}
        className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-(--color-border) bg-white text-sm focus:outline-none focus:ring-2 focus:ring-(--color-primary) focus:border-transparent"
      />
      {isPending && (
        <div className="absolute right-3 top-1/2 -translate-y-1/2">
          <div className="w-4 h-4 border-2 border-(--color-primary) border-t-transparent rounded-full animate-spin" />
        </div>
      )}
    </div>
  );
}
