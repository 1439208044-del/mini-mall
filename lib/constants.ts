export const ORDER_STATUSES = [
  "PENDING",
  "PAID",
  "SHIPPED",
  "DELIVERED",
  "CANCELLED",
] as const;

export type OrderStatus = (typeof ORDER_STATUSES)[number];

export const STATUS_VARIANT: Record<OrderStatus, "default" | "success" | "warning" | "danger"> = {
  PENDING: "warning",
  PAID: "success",
  SHIPPED: "default",
  DELIVERED: "success",
  CANCELLED: "danger",
};

export const STATUS_LABEL: Record<OrderStatus, string> = {
  PENDING: "Pending",
  PAID: "Paid",
  SHIPPED: "Shipped",
  DELIVERED: "Delivered",
  CANCELLED: "Cancelled",
};
