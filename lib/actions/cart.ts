"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth";

export async function addToCart(productId: string) {
  try {
    const user = await requireAuth();
    const userId = user.id;

    // Check product exists and is in stock
    const product = await prisma.product.findUnique({
      where: { id: productId },
    });

    if (!product || !product.isActive) {
      return { error: "Product not available" };
    }

    if (product.inventory < 1) {
      return { error: "Product out of stock" };
    }

    // 原子 upsert，避免竞态条件
    await prisma.$transaction(async (tx) => {
      const existing = await tx.cartItem.findUnique({
        where: {
          userId_productId: { userId, productId },
        },
      });

      if (existing) {
        if (existing.quantity >= product.inventory) {
          throw new Error("STOCK_LIMIT");
        }
        await tx.cartItem.update({
          where: { id: existing.id },
          data: { quantity: { increment: 1 } },
        });
      } else {
        await tx.cartItem.create({
          data: { userId, productId, quantity: 1 },
        });
      }
    });

    revalidatePath("/cart");
    if (product?.slug) {
      revalidatePath(`/products/${product.slug}`);
    }
    return { success: true };
  } catch (error) {
    if ((error as Error).message === "Unauthorized") {
      return { error: "Unauthorized" };
    }
    if ((error as Error).message === "STOCK_LIMIT") {
      return { error: "Cannot add more - max inventory reached" };
    }
    return { error: "Failed to add to cart" };
  }
}

export async function removeFromCart(cartItemId: string) {
  try {
    const user = await requireAuth();

    const item = await prisma.cartItem.findUnique({
      where: { id: cartItemId },
    });

    if (!item || item.userId !== user.id) {
      return { error: "Item not found" };
    }

    await prisma.cartItem.delete({ where: { id: cartItemId } });
    revalidatePath("/cart");
    return { success: true };
  } catch {
    return { error: "Failed to remove item" };
  }
}

export async function updateCartQuantity(cartItemId: string, quantity: number) {
  try {
    const user = await requireAuth();

    const item = await prisma.cartItem.findUnique({
      where: { id: cartItemId },
      include: { product: true },
    });

    if (!item || item.userId !== user.id) {
      return { error: "Item not found" };
    }

    if (quantity < 1) {
      await prisma.cartItem.delete({ where: { id: cartItemId } });
    } else {
      if (quantity > item.product.inventory) {
        return { error: "Cannot exceed available inventory" };
      }
      await prisma.cartItem.update({
        where: { id: cartItemId },
        data: { quantity },
      });
    }

    revalidatePath("/cart");
    return { success: true };
  } catch {
    return { error: "Failed to update quantity" };
  }
}
