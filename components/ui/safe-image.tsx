"use client";

import { useState } from "react";

interface SafeImageProps {
  src: string;
  alt: string;
  className?: string;
  fallback?: React.ReactNode;
}

export function SafeImage({
  src,
  alt,
  className = "",
  fallback,
}: SafeImageProps) {
  const [error, setError] = useState(false);

  if (error || !src || src === "/placeholder.svg") {
    return (
      <span className={`flex items-center justify-center ${className}`}>
        {fallback || "📦"}
      </span>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      className={className}
      onError={() => setError(true)}
    />
  );
}
