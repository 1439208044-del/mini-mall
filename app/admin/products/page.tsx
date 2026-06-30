import Link from "next/link";
import { getAdminProducts } from "@/lib/queries";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/admin/data-table";
import { DeleteProductButton } from "./delete-button";

export default async function AdminProductsPage() {
  const products = await getAdminProducts();

  const columns = [
    {
      header: "Product",
      accessor: (p: (typeof products)[0]) => (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gray-100 rounded flex items-center justify-center text-lg">
            📦
          </div>
          <div>
            <p className="font-medium">{p.name}</p>
            <p className="text-xs text-(--color-muted)">{p.slug}</p>
          </div>
        </div>
      ),
    },
    {
      header: "Category",
      accessor: (p: (typeof products)[0]) => p.category.name,
    },
    {
      header: "Price",
      accessor: (p: (typeof products)[0]) => (
        <span className="font-medium">${p.price.toFixed(2)}</span>
      ),
    },
    {
      header: "Stock",
      accessor: (p: (typeof products)[0]) => (
        <Badge variant={p.inventory > 0 ? "success" : "danger"}>
          {p.inventory}
        </Badge>
      ),
    },
    {
      header: "Status",
      accessor: (p: (typeof products)[0]) => (
        <Badge variant={p.isActive ? "default" : "danger"}>
          {p.isActive ? "Active" : "Inactive"}
        </Badge>
      ),
    },
  ];

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Products</h1>
        <Link href="/admin/products/new">
          <Button>+ Add Product</Button>
        </Link>
      </div>

      <div className="bg-white rounded-xl border border-(--color-border)">
        <DataTable
          columns={columns}
          data={products}
          keyField="id"
          actions={(product) => (
            <div className="flex items-center gap-2 justify-end">
              <Link href={`/admin/products/${product.id}/edit`}>
                <Button variant="ghost" size="sm">
                  Edit
                </Button>
              </Link>
              <DeleteProductButton productId={product.id} productName={product.name} />
            </div>
          )}
        />
      </div>
    </div>
  );
}
