"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";

export async function createCategory(formData: FormData) {
  await requireAdmin();

  const name = formData.get("name") as string;
  const slug = formData.get("slug") as string;

  if (!name || !slug) {
    return { error: "Name and slug are required" };
  }

  const existing = await prisma.category.findFirst({
    where: { OR: [{ name }, { slug }] },
  });
  if (existing) {
    return { error: "Category name or slug already exists" };
  }

  await prisma.category.create({ data: { name, slug } });

  revalidatePath("/admin/categories");
  return { success: true };
}

export async function updateCategory(formData: FormData) {
  await requireAdmin();

  const id = formData.get("id") as string;
  const name = formData.get("name") as string;
  const slug = formData.get("slug") as string;

  if (!id || !name || !slug) {
    return { error: "ID, name, and slug are required" };
  }

  const existing = await prisma.category.findFirst({
    where: { OR: [{ name }, { slug }], NOT: { id } },
  });
  if (existing) {
    return { error: "Category name or slug already exists" };
  }

  await prisma.category.update({
    where: { id },
    data: { name, slug },
  });

  revalidatePath("/admin/categories");
  return { success: true };
}

export async function deleteCategory(id: string) {
  await requireAdmin();

  // Check if category has products
  const productCount = await prisma.product.count({
    where: { categoryId: id },
  });
  if (productCount > 0) {
    return { error: "Cannot delete category with existing products" };
  }

  await prisma.category.delete({ where: { id } });

  revalidatePath("/admin/categories");
  return { success: true };
}
