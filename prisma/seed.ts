import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  // 清除旧数据
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.cartItem.deleteMany();
  await prisma.product.deleteMany();
  await prisma.category.deleteMany();
  await prisma.user.deleteMany();

  // 创建管理员
  const adminPassword = await bcrypt.hash("admin123", 10);
  await prisma.user.create({
    data: {
      email: "admin@minimall.com",
      name: "管理员",
      password: adminPassword,
      role: "ADMIN",
    },
  });

  // 创建测试用户
  const userPassword = await bcrypt.hash("user123", 10);
  await prisma.user.create({
    data: {
      email: "user@minimall.com",
      name: "测试用户",
      password: userPassword,
      role: "CUSTOMER",
    },
  });

  // 创建分类
  const categories = await Promise.all([
    prisma.category.create({ data: { name: "手机数码", slug: "electronics" } }),
    prisma.category.create({ data: { name: "服装鞋帽", slug: "clothing" } }),
    prisma.category.create({ data: { name: "家居用品", slug: "home" } }),
    prisma.category.create({ data: { name: "图书音像", slug: "books" } }),
    prisma.category.create({ data: { name: "食品饮料", slug: "food" } }),
  ]);

  // 创建商品
  const products = [
    // 手机数码
    { name: "iPhone 16 Pro Max", slug: "iphone-16-pro-max", description: "苹果最新旗舰手机，A18 Pro 芯片，4800 万像素相机系统，钛金属边框", price: 9999, comparePrice: 10999, image: "/uploads/iphone.jpg", inventory: 50, categoryId: categories[0].id },
    { name: "华为 Mate 70 Pro", slug: "huawei-mate-70-pro", description: "麒麟 9100 芯片，鸿蒙 HarmonyOS，超感知 XMAGE 影像系统", price: 6999, comparePrice: 7999, image: "/uploads/huawei.jpg", inventory: 40, categoryId: categories[0].id },
    { name: "小米 15 Ultra", slug: "xiaomi-15-ultra", description: "骁龙 8 Gen 4，徕卡全焦段四摄，5000mAh 大电池", price: 5999, comparePrice: 6499, image: "/uploads/xiaomi.jpg", inventory: 60, categoryId: categories[0].id },
    // 服装鞋帽
    { name: "经典款羊绒大衣", slug: "cashmere-coat", description: "100% 纯羊绒，中长款设计，双排扣，适合秋冬季节", price: 1299, comparePrice: 1899, image: "/uploads/coat.jpg", inventory: 30, categoryId: categories[1].id },
    { name: "Nike Air Max 2025", slug: "nike-air-max-2025", description: "全新气垫科技，轻质透气网面，经典街头风格", price: 899, comparePrice: 1099, image: "/uploads/nike.jpg", inventory: 80, categoryId: categories[1].id },
    // 家居用品
    { name: "北欧风台灯", slug: "nordic-lamp", description: "简约设计，三档调光，护眼 LED 光源，适合书房卧室", price: 199, comparePrice: 299, image: "/uploads/lamp.jpg", inventory: 100, categoryId: categories[2].id },
    { name: "四件套纯棉床品", slug: "cotton-bedding", description: "60 支长绒棉，亲肤透气，多色可选，1.8m 大床适用", price: 299, comparePrice: 399, image: "/uploads/bedding.jpg", inventory: 70, categoryId: categories[2].id },
    // 图书
    { name: "深入理解计算机系统", slug: "csapp-book", description: "CSAPP 经典教材，程序员必读，涵盖硬件、操作系统、网络", price: 139, comparePrice: 169, image: "/uploads/csapp.jpg", inventory: 200, categoryId: categories[3].id },
    // 食品饮料
    { name: "云南古树普洱茶饼", slug: "puer-tea", description: "357g 古树春茶，手工石磨压制，陈香馥郁", price: 268, comparePrice: 358, image: "/uploads/tea.jpg", inventory: 90, categoryId: categories[4].id },
    { name: "瑞士莲特醇黑巧克力", slug: "chocolate", description: "70% 可可含量，丝滑口感，礼盒装 200g", price: 89, comparePrice: null, image: "/uploads/chocolate.jpg", inventory: 150, categoryId: categories[4].id },
  ];

  for (const product of products) {
    await prisma.product.create({ data: product });
  }

  console.log("种子数据导入成功！");
  console.log(`${products.length} 件商品，${categories.length} 个分类`);
  console.log("管理员：admin@minimall.com / admin123");
  console.log("用户：user@minimall.com / user123");
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });
