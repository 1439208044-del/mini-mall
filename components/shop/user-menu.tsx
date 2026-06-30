"use client";

import { useState, useRef, useEffect } from "react";
import { signOut } from "next-auth/react";
import Link from "next/link";
import { Session } from "next-auth";

export function UserMenu({ session }: { session: Session | null }) {
  const user = session?.user as { id?: string; name?: string; role?: string };
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  if (!session) {
    return (
      <Link
        href="/login"
        className="text-sm font-medium px-4 py-2 rounded-lg bg-(--color-primary) text-white hover:bg-(--color-primary-dark) transition-colors"
      >
        Sign In
      </Link>
    );
  }

  return (
    <div className="flex items-center gap-3">
      {user?.role === "ADMIN" && (
        <Link
          href="/admin"
          className="text-sm font-medium px-3 py-2 rounded-lg border border-(--color-primary) text-(--color-primary) hover:bg-(--color-primary-light) transition-colors"
        >
          Admin
        </Link>
      )}
      <div className="relative" ref={ref}>
        <button
          onClick={() => setOpen(!open)}
          className="flex items-center gap-2 text-sm font-medium text-(--color-foreground) hover:text-(--color-primary) transition-colors"
        >
          <span className="hidden sm:inline">{user?.name}</span>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="m6 9 6 6 6-6" />
          </svg>
        </button>
        <div
          className={`absolute right-0 top-full mt-1 w-48 bg-white border border-(--color-border) rounded-lg shadow-lg transition-all ${
            open ? "opacity-100 visible" : "opacity-0 invisible"
          }`}
        >
          <div className="p-2">
            <Link
              href="/orders"
              onClick={() => setOpen(false)}
              className="block px-3 py-2 text-sm rounded-md hover:bg-gray-100 transition-colors"
            >
              My Orders
            </Link>
            <button
              onClick={() => {
                setOpen(false);
                signOut({ callbackUrl: "/" });
              }}
              className="w-full text-left px-3 py-2 text-sm rounded-md hover:bg-gray-100 text-(--color-danger) transition-colors"
            >
              Sign Out
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
