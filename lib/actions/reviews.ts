"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth";

const reviewSchema = z.object({
  productId: z.string().min(1),
  orderId: z.string().min(1),
  rating: z.coerce.number().int().min(1).max(5),
  comment: z.string().min(1).max(1000),
});

export async function submitReview(formData: FormData) {
  try {
    const user = await requireAuth();
    const raw = Object.fromEntries(formData.entries());
    const parsed = reviewSchema.safeParse(raw);

    if (!parsed.success) {
      return { error: parsed.error.flatten().fieldErrors };
    }

    const { productId, orderId, rating, comment } = parsed.data;

    const order = await prisma.order.findFirst({
      where: {
        id: orderId,
        userId: user.id,
        status: "DELIVERED",
      },
    });

    if (!order) {
      return { error: "Only delivered orders can be reviewed" };
    }

    const existingReview = await prisma.review.findUnique({
      where: {
        userId_productId: {
          userId: user.id,
          productId,
        },
      },
    });

    if (existingReview) {
      return { error: "You have already reviewed this product" };
    }

    const product = await prisma.product.findUnique({
      where: { id: productId },
    });

    if (!product) {
      return { error: "Product not found" };
    }

    await prisma.review.create({
      data: {
        rating,
        comment,
        userId: user.id,
        productId,
        orderId,
      },
    });

    revalidatePath(`/products/${product.slug}`);
    revalidatePath(`/orders/${orderId}`);
    return { success: true };
  } catch (error) {
    if ((error as Error).message === "Unauthorized") {
      return { error: "Unauthorized" };
    }
    return { error: "Failed to submit review" };
  }
}
