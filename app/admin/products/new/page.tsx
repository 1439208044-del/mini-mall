import { getCategories } from "@/lib/queries";
import { ProductForm } from "@/components/admin/product-form";

export default async function NewProductPage() {
  const categories = await getCategories();

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Add New Product</h1>
      <div className="bg-white rounded-xl border border-(--color-border) p-6">
        <ProductForm categories={categories} />
      </div>
    </div>
  );
}
