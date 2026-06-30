"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";
import { z } from "zod";

const productSchema = z.object({
  name: z.string().min(1),
  slug: z.string().min(1),
  description: z.string().min(1),
  price: z.coerce.number().min(0),
  comparePrice: z.coerce.number().min(0).optional().nullable(),
  image: z.string().optional(),
  inventory: z.coerce.number().int().min(0),
  categoryId: z.string().min(1),
});

export async function createProduct(formData: FormData) {
  await requireAdmin();

  const raw = Object.fromEntries(formData.entries());
  const parsed = productSchema.safeParse(raw);

  if (!parsed.success) {
    return { error: parsed.error.flatten().fieldErrors };
  }

  // Check slug uniqueness
  const existing = await prisma.product.findUnique({
    where: { slug: parsed.data.slug },
  });
  if (existing) {
    return { error: "A product with this slug already exists" };
  }

  await prisma.product.create({
    data: {
      ...parsed.data,
      comparePrice: parsed.data.comparePrice || null,
      image: parsed.data.image || "/placeholder.svg",
    },
  });

  revalidatePath("/admin/products");
  revalidatePath("/products");
  return { success: true };
}

export async function updateProduct(formData: FormData) {
  await requireAdmin();

  const id = formData.get("id") as string;
  if (!id) return { error: "Product ID is required" };

  const raw = Object.fromEntries(formData.entries());
  const parsed = productSchema.safeParse(raw);

  if (!parsed.success) {
    return { error: parsed.error.flatten().fieldErrors };
  }

  const isActive = formData.get("isActive") === "on";

  // Check slug uniqueness (exclude current product)
  const existing = await prisma.product.findFirst({
    where: { slug: parsed.data.slug, NOT: { id } },
  });
  if (existing) {
    return { error: "A product with this slug already exists" };
  }

  await prisma.product.update({
    where: { id },
    data: {
      ...parsed.data,
      comparePrice: parsed.data.comparePrice || null,
      image: parsed.data.image || "/placeholder.svg",
      isActive,
    },
  });

  revalidatePath("/admin/products");
  revalidatePath("/products");
  return { success: true };
}

export async function deleteProduct(id: string) {
  await requireAdmin();

  await prisma.product.delete({ where: { id } });

  revalidatePath("/admin/products");
  revalidatePath("/products");
  return { success: true };
}
