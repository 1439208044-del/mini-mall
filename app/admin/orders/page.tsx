import Link from "next/link";
import { getAdminOrders } from "@/lib/queries";
import { Badge } from "@/components/ui/badge";
import { DataTable } from "@/components/admin/data-table";
import { STATUS_VARIANT } from "@/lib/constants";
import type { OrderStatus } from "@/lib/constants";

export default async function AdminOrdersPage() {
  const orders = await getAdminOrders();

  const columns = [
    {
      header: "Order ID",
      accessor: (o: (typeof orders)[0]) => (
        <span className="font-mono text-xs">#{o.id.slice(-8)}</span>
      ),
    },
    {
      header: "Customer",
      accessor: (o: (typeof orders)[0]) => (
        <div>
          <p className="font-medium">{o.user.name}</p>
          <p className="text-xs text-(--color-muted)">{o.user.email}</p>
        </div>
      ),
    },
    {
      header: "Items",
      accessor: (o: (typeof orders)[0]) => (
        <span className="text-sm">{o.items.length} item{o.items.length !== 1 ? "s" : ""}</span>
      ),
    },
    {
      header: "Total",
      accessor: (o: (typeof orders)[0]) => (
        <span className="font-medium">${o.total.toFixed(2)}</span>
      ),
    },
    {
      header: "Status",
      accessor: (o: (typeof orders)[0]) => (
        <Badge variant={STATUS_VARIANT[o.status as OrderStatus] || "default"}>{o.status}</Badge>
      ),
    },
    {
      header: "Date",
      accessor: (o: (typeof orders)[0]) =>
        new Date(o.createdAt).toLocaleDateString(),
    },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Orders</h1>

      <div className="bg-white rounded-xl border border-(--color-border)">
        <DataTable
          columns={columns}
          data={orders}
          keyField="id"
          actions={(order) => (
            <Link
              href={`/admin/orders/${order.id}`}
              className="text-sm text-(--color-primary) hover:underline"
            >
              View
            </Link>
          )}
        />
      </div>
    </div>
  );
}
