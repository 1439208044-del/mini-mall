"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface ProductFormProps {
  categories: { id: string; name: string }[];
  initialData?: {
    id: string;
    name: string;
    slug: string;
    description: string;
    price: number;
    comparePrice?: number | null;
    image: string;
    inventory: number;
    isActive: boolean;
    categoryId: string;
  };
}

export function ProductForm({ categories, initialData }: ProductFormProps) {
  const router = useRouter();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const isEdit = !!initialData;

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const formData = new FormData(e.currentTarget);

    if (isEdit) {
      formData.append("id", initialData!.id);
      const { updateProduct } = await import("@/lib/actions/products");
      const result = await updateProduct(formData);
      if (result?.error) {
        setError(typeof result.error === "string" ? result.error : "Failed to update");
        setLoading(false);
        return;
      }
    } else {
      const { createProduct } = await import("@/lib/actions/products");
      const result = await createProduct(formData);
      if (result?.error) {
        setError(typeof result.error === "string" ? result.error : "Failed to create");
        setLoading(false);
        return;
      }
    }

    router.push("/admin/products");
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 max-w-2xl">
      {error && (
        <div className="bg-red-50 text-(--color-danger) text-sm rounded-lg px-4 py-3">{error}</div>
      )}

      <Input
        label="Product Name"
        name="name"
        defaultValue={initialData?.name}
        required
      />
      <Input
        label="Slug"
        name="slug"
        defaultValue={initialData?.slug}
        required
        placeholder="product-slug-name"
      />

      <div className="flex flex-col gap-1">
        <label className="text-sm font-medium">Description</label>
        <textarea
          name="description"
          defaultValue={initialData?.description}
          required
          rows={4}
          className="rounded-lg border border-(--color-border) px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-(--color-primary)"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Input
          label="Price ($)"
          name="price"
          type="number"
          step="0.01"
          min="0"
          defaultValue={initialData?.price}
          required
        />
        <Input
          label="Compare Price ($)"
          name="comparePrice"
          type="number"
          step="0.01"
          min="0"
          defaultValue={initialData?.comparePrice || ""}
          placeholder="Optional"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Input
          label="Inventory"
          name="inventory"
          type="number"
          min="0"
          defaultValue={initialData?.inventory}
          required
        />
        <Input
          label="Image URL"
          name="image"
          defaultValue={initialData?.image || ""}
          placeholder="/uploads/product.jpg"
        />
      </div>

      <div>
        <label className="text-sm font-medium">Category</label>
        <select
          name="categoryId"
          defaultValue={initialData?.categoryId}
          required
          className="w-full mt-1 rounded-lg border border-(--color-border) px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-(--color-primary)"
        >
          <option value="">Select category</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.name}
            </option>
          ))}
        </select>
      </div>

      {isEdit && (
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            name="isActive"
            defaultChecked={initialData?.isActive}
            className="rounded"
          />
          Active (visible to customers)
        </label>
      )}

      <div className="flex gap-3 mt-4">
        <Button type="submit" disabled={loading}>
          {loading ? "Saving..." : isEdit ? "Update Product" : "Create Product"}
        </Button>
        <Button
          type="button"
          variant="ghost"
          onClick={() => router.push("/admin/products")}
        >
          Cancel
        </Button>
      </div>
    </form>
  );
}
