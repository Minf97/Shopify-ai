# 项目配置指南

## 环境变量设置

请创建 `.env.local` 文件并配置以下环境变量：

```bash
# Shopify Configuration
SHOPIFY_STORE_DOMAIN=your-shop.myshopify.com
SHOPIFY_GRAPHQL_API_ENDPOINT=/api/2023-10/graphql.json
NEXT_PUBLIC_SHOPIFY_FRONTEND_ACCESS_TOKEN=your_storefront_access_token_here
SHOPIFY_ADMIN_API_ACCESS_TOKEN=your_admin_api_access_token_here

# Supabase Configuration  
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key_here

# App Configuration
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

## Shopify 设置

1. 登录 Shopify Admin
2. 前往 Apps > App and sales channel settings
3. 创建新的 Private app 或使用现有的
4. 获取 Storefront API access token
5. 配置权限：
   - Products: Read access
   - Cart: Read and write access
   - Customer: Read and write access

### 环境变量说明

- `SHOPIFY_STORE_DOMAIN`: 你的 Shopify 商店域名（例如：your-shop.myshopify.com）
- `SHOPIFY_GRAPHQL_API_ENDPOINT`: GraphQL API 端点路径（通常是：/api/2023-10/graphql.json）
- 这两个变量会在代码中被组合成完整的 API URL：`https://${SHOPIFY_STORE_DOMAIN}${SHOPIFY_GRAPHQL_API_ENDPOINT}`

## Supabase 设置

1. 创建新的 Supabase 项目
2. 获取项目 URL 和 API keys
3. 创建以下数据表：

### users 表
```sql
CREATE TABLE users (
  id UUID REFERENCES auth.users PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  locale TEXT DEFAULT 'en',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### user_carts 表
```sql
CREATE TABLE user_carts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  shopify_cart_id TEXT,
  cart_data JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### wishlists 表
```sql
CREATE TABLE wishlists (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  product_id TEXT NOT NULL,
  product_data JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

## 数据库策略设置

```sql
-- RLS policies
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_carts ENABLE ROW LEVEL SECURITY;
ALTER TABLE wishlists ENABLE ROW LEVEL SECURITY;

-- Users can only access their own data
CREATE POLICY "Users can view own profile" ON users FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON users FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can view own carts" ON user_carts FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can manage own carts" ON user_carts FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can view own wishlist" ON wishlists FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can manage own wishlist" ON wishlists FOR ALL USING (auth.uid() = user_id);
``` 