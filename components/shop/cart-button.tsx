"use client";

import Link from "next/link";

export function CartButton({ count }: { count: number }) {
  return (
    <Link
      href="/cart"
      className="relative p-2 rounded-lg hover:bg-(--color-primary-light) transition-colors"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="text-(--color-foreground)"
      >
        <circle cx="8" cy="21" r="1" />
        <circle cx="19" cy="21" r="1" />
        <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12" />
      </svg>
      {count > 0 && (
        <span className="absolute -top-0.5 -right-0.5 bg-(--color-danger) text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-medium">
          {count > 99 ? "99+" : count}
        </span>
      )}
    </Link>
  );
}
