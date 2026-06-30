---
name: api-crud-generator
version: 1.0
description: 根据 Prisma 模型生成标准的 Next.js API Route + 前端管理页面
trigger: ["生成CRUD", "生成接口", "生成管理页面"]
---

# API CRUD 生成器

## 功能说明

根据指定的 Prisma 模型，自动生成标准的后台管理 CRUD 代码：
1. API Routes（5 个）：GET 列表、GET 详情、POST 创建、PUT 更新、DELETE 删除
2. 前端页面：数据列表页、创建/编辑表单

## 执行步骤

### 第 1 步：确认模型信息

询问用户：
- 要生成的模型名称（如：Product、Category）
- API 路径（如 /api/admin/products）
- 页面路由（如 /admin/products）

### 第 2 步：生成 API Route Handlers

按照标准模板生成以下文件：
- `app/api/admin/[model]/route.ts` — GET 列表 + POST 创建
- `app/api/admin/[model]/[id]/route.ts` — GET 详情 + PUT 更新 + DELETE 删除

每个 API 必须包含：
- Prisma 查询逻辑
- 错误处理（try/catch）
- 参数验证（zod）
- 权限检查（requireAdmin）

### 第 3 步：生成前端管理页面

- `app/admin/[model]/page.tsx` — 数据列表页（表格 + 搜索 + 分页 + 删除）
- `app/admin/[model]/new/page.tsx` — 创建表单页
- `app/admin/[model]/[id]/edit/page.tsx` — 编辑表单页

表单必须使用：
- react-hook-form + zod 验证
- TailwindCSS 4 样式
- 提交后跳转回列表页

## 代码规范

- TypeScript 严格类型
- Prisma 查询使用 include 关联数据
- 删除操作使用软删除或确认弹窗
- 列表页支持搜索和分页
