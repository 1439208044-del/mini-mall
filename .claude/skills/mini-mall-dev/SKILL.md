---
name: mini-mall-dev
description: Mini Mall 电商小程序开发助手。当用户提到 mini-mall、电商、商品、订单、购物车、后台管理等关键词时自动触发。提供项目结构指引、开发规范、常用命令和调试帮助。
---

# Mini Mall 开发助手

## 常用命令

| 命令 | 用途 |
|------|------|
| `npm run dev` | 启动开发服务器 (localhost:3000) |
| `npx prisma studio` | 打开数据库可视化管理 |
| `npx prisma db seed` | 重置并导入种子数据 |
| `npx prisma db push` | 同步数据库结构 |
| `npm run build` | 构建生产版本 |

## 测试账号

| 角色 | 邮箱 | 密码 |
|------|------|------|
| 管理员 | admin@minimall.com | admin123 |
| 普通用户 | user@minimall.com | user123 |

## 数据模型

- **User**: 用户（CUSTOMER / ADMIN）
- **Category**: 商品分类
- **Product**: 商品（含价格、库存、上下架）
- **CartItem**: 购物车（用户+商品唯一约束）
- **Order**: 订单（PENDING → PAID → SHIPPED → DELIVERED / CANCELLED）
- **OrderItem**: 订单项（下单时价格快照）

## 开发规范

1. **前台页面**放在 `app/(shop)/` 下，路由组共享布局
2. **后台页面**放在 `app/admin/` 下，需要 ADMIN 角色
3. **数据查询**统一写在 `lib/queries.ts`，使用 React `cache()` 去重
4. **新增页面**时先在 `prisma/schema.prisma` 确认数据模型，再写查询，最后写页面
5. **表单验证**使用 zod + react-hook-form
6. **认证检查**：用户用 `requireAuth()`，管理员用 `requireAdmin()`

## 路由一览

| 路由 | 页面 | 认证 |
|------|------|------|
| `/` | 首页 | 无 |
| `/products` | 商品列表 | 无 |
| `/products/[slug]` | 商品详情 | 无 |
| `/cart` | 购物车 | 需登录 |
| `/checkout` | 结算 | 需登录 |
| `/orders` | 我的订单 | 需登录 |
| `/login` | 登录 | 无 |
| `/register` | 注册 | 无 |
| `/admin` | 后台仪表盘 | ADMIN |
| `/admin/products` | 商品管理 | ADMIN |
| `/admin/categories` | 分类管理 | ADMIN |
| `/admin/orders` | 订单管理 | ADMIN |

## 调试技巧

- 数据库问题 → 先跑 `npx prisma studio` 看数据
- 认证问题 → 检查 `lib/auth.ts` 的 session callback
- 页面 500 → 看终端报错，常见原因是 Prisma 查询字段名拼错
- 样式问题 → 确认 TailwindCSS 4 的类名语法（v4 有变动）
