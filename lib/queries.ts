import "server-only";

import { prisma } from "@/lib/prisma";
import { cache } from "react";

export const getCategories = cache(async () => {
  return prisma.category.findMany({
    orderBy: { name: "asc" },
  });
});

export const getFeaturedProducts = cache(async (limit = 8) => {
  return prisma.product.findMany({
    where: { isActive: true, inventory: { gt: 0 } },
    include: { category: true },
    orderBy: { createdAt: "desc" },
    take: limit,
  });
});

export const getProducts = cache(
  async ({
    search,
    categoryId,
    page = 1,
    limit = 12,
  }: {
    search?: string;
    categoryId?: string;
    page?: number;
    limit?: number;
  }) => {
    const where: Record<string, unknown> = {
      isActive: true,
    };

    if (search) {
      where.OR = [
        { name: { contains: search } },
        { description: { contains: search } },
      ];
    }

    if (categoryId) {
      where.categoryId = categoryId;
    }

    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        include: { category: true },
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.product.count({ where }),
    ]);

    return {
      products,
      total,
      pages: Math.ceil(total / limit),
      page,
    };
  }
);

export const getProductBySlug = cache(async (slug: string) => {
  return prisma.product.findUnique({
    where: { slug },
    include: {
      category: true,
      reviews: {
        include: {
          user: { select: { name: true } },
        },
        orderBy: { createdAt: "desc" },
      },
    },
  });
});

export const getCartItems = cache(async (userId: string) => {
  return prisma.cartItem.findMany({
    where: { userId },
    include: {
      product: {
        select: {
          id: true,
          name: true,
          slug: true,
          price: true,
          image: true,
          inventory: true,
        },
      },
    },
  });
});

export const getCartItemCount = cache(async (userId: string) => {
  const result = await prisma.cartItem.aggregate({
    where: { userId },
    _sum: { quantity: true },
  });
  return result._sum.quantity || 0;
});

export const getOrders = cache(async (userId: string) => {
  return prisma.order.findMany({
    where: { userId },
    include: {
      items: {
        include: {
          product: {
            select: {
              id: true,
              name: true,
              slug: true,
              image: true,
            },
          },
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });
});

export const getOrderById = cache(async (orderId: string) => {
  return prisma.order.findUnique({
    where: { id: orderId },
    include: {
      user: { select: { id: true, name: true, email: true } },
      items: {
        include: {
          product: {
            select: {
              id: true,
              name: true,
              slug: true,
              image: true,
            },
          },
        },
      },
      reviews: true,
    },
  });
});

// Admin queries
export const getAdminProducts = cache(async () => {
  return prisma.product.findMany({
    include: { category: true },
    orderBy: { createdAt: "desc" },
  });
});

export const getAdminOrders = cache(async () => {
  return prisma.order.findMany({
    include: {
      user: { select: { name: true, email: true } },
      items: {
        include: {
          product: { select: { name: true } },
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });
});

export const getAdminStats = cache(async () => {
  const [totalProducts, totalOrders, totalUsers, revenueResult] =
    await Promise.all([
      prisma.product.count(),
      prisma.order.count(),
      prisma.user.count({ where: { role: "CUSTOMER" } }),
      prisma.order.aggregate({
        _sum: { total: true },
        where: { status: { not: "CANCELLED" } },
      }),
    ]);

  return {
    totalProducts,
    totalOrders,
    totalUsers,
    totalRevenue: revenueResult._sum.total || 0,
  };
});
