import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getCategories } from "@/lib/queries";
import { ProductForm } from "@/components/admin/product-form";

interface EditProductPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditProductPage({ params }: EditProductPageProps) {
  const { id } = await params;
  const [product, categories] = await Promise.all([
    prisma.product.findUnique({ where: { id } }),
    getCategories(),
  ]);

  if (!product) {
    notFound();
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Edit Product</h1>
      <div className="bg-white rounded-xl border border-(--color-border) p-6">
        <ProductForm categories={categories} initialData={product} />
      </div>
    </div>
  );
}
