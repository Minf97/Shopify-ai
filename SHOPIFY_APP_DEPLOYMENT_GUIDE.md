# Shopify 应用发布指南

## 概述
将您的 Next.js + Shopify 应用发布到 Shopify App Store 需要经过几个重要步骤，包括应用部署、配置、审核和分发。

## 发布流程总览

### 1. 选择分发方式
您需要在 Partner Dashboard 中选择应用的分发方式：

#### Public Distribution (公开分发)
- **适用场景**: 希望在 Shopify App Store 上销售给多个商家
- **优势**: 可以触达数百万商家，使用 Billing API 收费
- **要求**: 需要通过 Shopify 审核
- **限制**: 必须与 Shopify 同步特定数据

#### Custom Distribution (自定义分发)
- **适用场景**: 为特定商家或 Plus 组织开发的应用
- **优势**: 无需审核，可快速部署
- **限制**: 无法使用 Billing API 收费

## 详细步骤

### 第一步：准备应用部署

#### 1.1 配置生产环境
```bash
# 创建生产环境配置
shopify app config link

# 获取环境变量
shopify app env show
```

记录以下重要信息：
- `SHOPIFY_API_KEY`
- `SHOPIFY_API_SECRET`  
- `SCOPES`

#### 1.2 选择托管服务
推荐的托管平台：
- **Fly.io**: 官方推荐，专门为 Shopify 应用优化
- **Render**: 简单易用，支持自动部署
- **Vercel**: 适合 Next.js 应用
- **手动部署**: 任何支持 Node.js 的平台

#### 1.3 设置环境变量
在生产环境中配置：
```env
SHOPIFY_APP_URL=https://your-deployed-app.com
SHOPIFY_API_KEY=your_api_key
SHOPIFY_API_SECRET=your_api_secret  
SCOPES=your_app_scopes
PORT=3000
```

### 第二步：构建和部署应用

#### 2.1 构建应用
```bash
# 安装依赖
npm ci

# 构建应用
npm run build

# 设置数据库
npm run setup

# 启动生产服务器
npm run start
```

#### 2.2 更新应用配置
在 `shopify.app.toml` 文件中：
```toml
application_url = "https://your-deployed-app.com"

[auth]
redirect_urls = [
  "https://your-deployed-app.com/auth/callback",
]
```

#### 2.3 部署配置到 Shopify
```bash
shopify app deploy
```

### 第三步：配置 Partner Dashboard

#### 3.1 设置应用信息
在 Partner Dashboard 中完成：
- **应用 URL**: 部署后的应用地址
- **合规 Webhooks**: 订阅必需的 webhooks
- **应用图标**: 1200x1200 像素的 JPEG 或 PNG
- **API 联系邮箱**: 紧急联系方式

#### 3.2 创建应用列表页面
- **主要语言**: 选择应用的主要语言
- **应用描述**: 详细描述应用功能和价值
- **截图和视频**: 展示应用界面和功能
- **定价信息**: 如果是付费应用

### 第四步：测试应用

#### 4.1 在开发商店测试
```bash
# 创建开发商店（如果还没有）
# 在 Partner Dashboard 中安装应用到开发商店

# 测试所有功能
- OAuth 安装流程
- 应用核心功能
- 计费系统（如果适用）
- 卸载流程
```

#### 4.2 运行自动检查
在 Partner Dashboard 的 App Store 审核页面运行自动检查，确保：
- 应用 URL 正确工作
- OAuth 流程正常
- 无致命错误
- 符合基本要求

### 第五步：提交审核（公开分发）

#### 5.1 满足审核要求
确保应用满足所有要求：
- ✅ 完整的应用功能
- ✅ 正确的计费集成
- ✅ 清晰的用户界面
- ✅ 符合安全标准
- ✅ 完整的应用列表信息

#### 5.2 提交审核
1. 在 Partner Dashboard 中点击 "Submit your app"
2. 填写测试说明和凭据
3. 等待审核团队反馈

#### 5.3 审核状态
- **Draft**: 草稿状态
- **Submitted**: 已提交审核  
- **Reviewed**: 需要修改
- **Published**: 已发布

### 第六步：发布后管理

#### 6.1 监控应用性能
- 查看安装数据
- 监控错误日志
- 收集用户反馈

#### 6.2 版本管理
```bash
# 创建新版本
shopify app deploy --version="v1.1.0" --message="Added new features"

# 不立即发布
shopify app deploy --no-release

# 发布特定版本
shopify app release --version="v1.1.0"
```

#### 6.3 维护应用质量
- 及时回复用户评论
- 修复发现的 bug
- 定期更新功能
- 申请 Built for Shopify 认证

## 常见问题和解决方案

### 安装问题
- **OAuth 重定向失败**: 检查应用 URL 和重定向 URL 配置
- **应用无法加载**: 验证 HTTPS 证书和域名配置

### 审核问题
- **功能不完整**: 确保应用是完成的产品，不是测试版本
- **UI 错误**: 修复所有 404、500 等错误
- **计费问题**: 确保使用 Shopify Billing API

### 性能问题
- **加载速度慢**: 优化应用性能和数据库查询
- **内存使用过高**: 优化代码和资源使用

## 最佳实践

### 开发最佳实践
- 使用 Shopify CLI 进行开发
- 遵循 Shopify 设计规范
- 实现完整的错误处理
- 添加适当的日志记录

### 安全最佳实践
- 验证所有 webhook 签名
- 安全存储敏感数据
- 使用 HTTPS 连接
- 定期更新依赖项

### 用户体验最佳实践
- 提供清晰的安装指导
- 实现流畅的用户界面
- 添加帮助文档
- 提供客户支持

## 获得 Built for Shopify 认证

Built for Shopify 是 Shopify 的最高质量认证，可以获得：
- 搜索排名提升
- 专门的营销推广
- 优先审核权
- 更多曝光机会

### 认证要求
- 优秀的应用评分和评论
- 最少安装数量
- 符合性能标准
- 提供出色的用户体验
- 使用最新的 Shopify 技术

## 持续改进

### 收集反馈
- 监控应用评论
- 分析使用数据
- 与用户直接沟通
- 关注市场趋势

### 功能迭代
- 定期更新应用
- 添加新功能
- 优化现有功能
- 修复用户报告的问题

### 营销推广
- 优化应用商店列表
- 创建内容营销
- 参与社区活动
- 建立合作伙伴关系

## 总结

将应用发布到 Shopify App Store 是一个系统性的过程，需要：
1. 精心准备和测试应用
2. 选择合适的分发方式
3. 通过严格的审核流程
4. 持续维护和改进

成功的关键在于关注用户体验、遵循最佳实践，并持续改进应用质量。

## 相关资源
- [Shopify App Store 要求清单](https://shopify.dev/apps/launch/app-requirements-checklist)
- [Partner Dashboard](https://partners.shopify.com)
- [Shopify CLI 文档](https://shopify.dev/apps/tools/cli)
- [Built for Shopify 指南](https://shopify.dev/apps/launch/built-for-shopify) 