"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { requireAuth, requireAdmin } from "@/lib/auth";
import { calcTotal } from "@/lib/utils";
import { ORDER_STATUSES } from "@/lib/constants";
import { z } from "zod";

const shippingSchema = z.object({
  name: z.string().min(1, "Name is required"),
  phone: z.string().min(1, "Phone is required"),
  address: z.string().min(1, "Address is required"),
  city: z.string().min(1, "City is required"),
  state: z.string().min(1, "State is required"),
  zip: z.string().min(1, "ZIP code is required"),
});

export async function placeOrder(formData: FormData) {
  try {
    const user = await requireAuth();

    const raw = {
      name: formData.get("name"),
      phone: formData.get("phone"),
      address: formData.get("address"),
      city: formData.get("city"),
      state: formData.get("state"),
      zip: formData.get("zip"),
    };

    const parsed = shippingSchema.safeParse(raw);
    if (!parsed.success) {
      return { error: parsed.error.flatten().fieldErrors };
    }

    // Get cart items
    const cartItems = await prisma.cartItem.findMany({
      where: { userId: user.id },
      include: { product: true },
    });

    if (cartItems.length === 0) {
      return { error: { _form: ["Cart is empty"] } };
    }

    // Validate stock
    for (const item of cartItems) {
      if (item.product.inventory < item.quantity) {
        return {
          error: {
            _form: [
              `Insufficient stock for "${item.product.name}". Available: ${item.product.inventory}`,
            ],
          },
        };
      }
    }

    // Calculate totals
    const total = calcTotal(cartItems as { quantity: number; product: { price: number } }[]);

    // Create order inside transaction
    const order = await prisma.$transaction(async (tx) => {
      // Create order
      const newOrder = await tx.order.create({
        data: {
          userId: user.id,
          status: "PENDING",
          total,
          shippingAddress: JSON.stringify(parsed.data),
          items: {
            create: cartItems.map((item) => ({
              productId: item.productId,
              quantity: item.quantity,
              price: item.product.price,
            })),
          },
        },
      });

      // Decrement inventory for each product
      for (const item of cartItems) {
        await tx.product.update({
          where: { id: item.productId },
          data: { inventory: { decrement: item.quantity } },
        });
      }

      // Clear cart
      await tx.cartItem.deleteMany({
        where: { userId: user.id },
      });

      return newOrder;
    });

    revalidatePath("/cart");
    revalidatePath("/orders");
    redirect(`/orders/${order.id}`);
  } catch (error) {
    if ((error as Error).message === "Unauthorized") {
      return { error: { _form: ["Please log in to checkout"] } };
    }
    throw error;
  }
}

export async function simulatePayment(orderId: string) {
  const user = await requireAuth();

  const order = await prisma.order.findUnique({ where: { id: orderId } });

  if (!order || order.userId !== user.id) {
    return { error: "Order not found" };
  }

  if (order.status !== "PENDING") {
    return { error: "Order cannot be paid" };
  }

  // Simulate a short delay for payment processing
  await new Promise((resolve) => setTimeout(resolve, 1000));

  await prisma.order.update({
    where: { id: orderId },
    data: { status: "PAID" },
  });

  revalidatePath(`/orders/${orderId}`);
  return { success: true };
}

export async function updateOrderStatus(orderId: string, status: string) {
  await requireAdmin();

  if (!(ORDER_STATUSES as readonly string[]).includes(status)) {
    return { error: "Invalid status" };
  }

  await prisma.order.update({
    where: { id: orderId },
    data: { status },
  });

  revalidatePath(`/admin/orders`);
  revalidatePath(`/admin/orders/${orderId}`);
  return { success: true };
}
