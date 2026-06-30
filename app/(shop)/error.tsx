"use client";

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4">
      <div className="text-center">
        <div className="text-6xl mb-4">⚠️</div>
        <h1 className="text-2xl font-bold mb-2">Something went wrong</h1>
        <p className="text-(--color-muted) mb-6 max-w-md">
          {error.message || "An unexpected error occurred. Please try again."}
        </p>
        <button
          onClick={reset}
          className="px-6 py-2.5 bg-(--color-primary) text-white rounded-lg font-medium hover:bg-(--color-primary-dark) transition-colors"
        >
          Try Again
        </button>
      </div>
    </div>
  );
}
