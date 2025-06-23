# API 集成说明

## 概述

我们已经成功集成了 Shopify 和 Supabase API，实现了完整的电商功能。

## 已实现的功能

### 🛒 Shopify 集成

#### API 路由
- `POST /api/shopify/cart` - 创建新购物车
- `POST /api/shopify/cart/add` - 添加商品到购物车
- `GET /api/shopify/cart/[cartId]` - 获取购物车详情
- `POST /api/shopify/cart/update` - 更新购物车商品数量
- `POST /api/shopify/cart/remove` - 从购物车移除商品

#### 功能特性
- ✅ 商品列表获取
- ✅ 购物车创建和管理
- ✅ 商品添加/移除/更新
- ✅ 价格和库存信息
- ✅ 结账流程准备

### 👤 Supabase 用户认证

#### API 路由
- `POST /api/auth/signin` - 用户登录
- `POST /api/auth/signup` - 用户注册
- `GET /api/user/cart` - 获取用户购物车
- `POST /api/user/cart` - 同步购物车到用户
- `GET /api/user/wishlist` - 获取用户心愿单
- `POST /api/user/wishlist` - 添加到心愿单
- `DELETE /api/user/wishlist` - 从心愿单移除

#### 功能特性
- ✅ 邮箱/密码注册登录
- ✅ 用户资料管理
- ✅ 购物车同步
- ✅ 心愿单功能
- ✅ 行级安全策略

### 📱 前端集成

#### 组件更新
- ✅ 首页产品展示（使用真实 Shopify 数据）
- ✅ 购物车抽屉组件
- ✅ 多语言支持
- ✅ 响应式设计

## 数据流程

### 购物车流程
1. **游客用户**：
   - 在本地存储购物车
   - 使用 Shopify Cart API
   - 数据存储在浏览器

2. **登录用户**：
   - 购物车同步到 Supabase
   - 跨设备同步
   - 持久化存储

### 用户认证流程
1. 用户注册/登录
2. Supabase 处理身份验证
3. 自动创建用户档案
4. 设置行级安全策略
5. 同步购物车和心愿单

## 环境配置

### 必需的环境变量
```bash
# Shopify
NEXT_PUBLIC_SHOPIFY_API_URL=https://your-shop.myshopify.com/api/2023-10/graphql.json
NEXT_PUBLIC_SHOPIFY_FRONTEND_ACCESS_TOKEN=your_token
SHOPIFY_ADMIN_API_ACCESS_TOKEN=your_admin_token

# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_key

# App
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

## 架构优势

### Shopify 负责
- 🛍️ 商品管理
- 💳 支付处理
- 📦 订单管理
- 🚚 配送跟踪
- 📊 库存管理

### Supabase 负责
- 👤 用户认证
- 🛒 购物车同步
- ❤️ 心愿单管理
- 📝 用户偏好
- 💬 评论系统

## 下一步计划

### 即将实现
- [ ] 商品详情页面
- [ ] 订单历史查看
- [ ] 支付集成完善
- [ ] 邮件通知系统
- [ ] 商品评论功能

### 优化计划
- [ ] 缓存策略优化
- [ ] 图片优化和 CDN
- [ ] SEO 优化
- [ ] 性能监控
- [ ] 错误处理完善

## 使用说明

### 开发环境启动
1. 配置环境变量（参考 `docs/SETUP.md`）
2. 安装依赖：`npm install`
3. 启动开发服务器：`npm run dev`
4. 访问：`http://localhost:3000`

### 测试购物车功能
1. 访问首页查看商品
2. 点击"加入购物车"
3. 查看右上角购物车图标
4. 注册/登录体验同步功能

### 测试多语言
1. 点击语言切换器
2. 体验中文/英文/日文界面
3. 所有文案自动切换

## 技术栈

- **前端**：Next.js 15, React, TypeScript
- **样式**：Tailwind CSS, shadcn/ui
- **后端**：Next.js API Routes
- **数据库**：Supabase (PostgreSQL)
- **电商**：Shopify Storefront API
- **认证**：Supabase Auth
- **国际化**：自定义 i18n 系统

## 安全考虑

- ✅ 环境变量保护敏感信息
- ✅ Supabase 行级安全策略
- ✅ API 路由认证检查
- ✅ 前端表单验证
- ✅ CORS 配置
- ✅ SQL 注入防护（使用 ORM）

恭喜！您的 Grace 电商平台已经成功集成了 Shopify 和 Supabase，具备了完整的现代电商功能！🎉 