export type Role = "ADMIN" | "CUSTOMER";

export type { OrderStatus } from "@/lib/constants";

export interface ShippingAddress {
  name: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  zip: string;
}

export interface CartItemWithProduct {
  id: string;
  quantity: number;
  product: {
    id: string;
    name: string;
    slug: string;
    price: number;
    image: string;
    inventory: number;
  };
}

export interface OrderWithItems {
  id: string;
  status: string;
  total: number;
  shippingAddress: string;
  createdAt: Date;
  items: {
    id: string;
    quantity: number;
    price: number;
    product: {
      id: string;
      name: string;
      slug: string;
      image: string;
    };
  }[];
}
