"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { submitReview } from "@/lib/actions/reviews";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

interface ReviewFormProps {
  productId: string;
  orderId: string;
  existingReview?: boolean;
}

export function ReviewForm({ productId, orderId, existingReview }: ReviewFormProps) {
  const router = useRouter();
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setSuccess(false);

    const formData = new FormData();
    formData.append("productId", productId);
    formData.append("orderId", orderId);
    formData.append("rating", String(rating));
    formData.append("comment", comment);

    const result = await submitReview(formData);
    if (result?.error) {
      setError(typeof result.error === "string" ? result.error : "Please check your input");
      return;
    }

    setSuccess(true);
    setComment("");
    setRating(5);
    router.refresh();
  }

  if (existingReview) {
    return null;
  }

  return (
    <Card className="mt-4">
      <CardContent>
        <h3 className="font-semibold mb-3">Write a review</h3>
        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label className="text-sm text-(--color-muted)">Rating</label>
            <select
              value={rating}
              onChange={(e) => setRating(Number(e.target.value))}
              className="mt-1 w-full rounded-lg border border-(--color-border) px-3 py-2"
            >
              <option value={5}>5 stars</option>
              <option value={4}>4 stars</option>
              <option value={3}>3 stars</option>
              <option value={2}>2 stars</option>
              <option value={1}>1 star</option>
            </select>
          </div>
          <div>
            <label className="text-sm text-(--color-muted)">Comment</label>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              rows={4}
              placeholder="Share your experience"
              className="mt-1 w-full rounded-lg border border-(--color-border) px-3 py-2"
              required
            />
          </div>
          {error && <p className="text-sm text-red-600">{error}</p>}
          {success && <p className="text-sm text-green-600">Review submitted successfully.</p>}
          <Button type="submit">Submit review</Button>
        </form>
      </CardContent>
    </Card>
  );
}
