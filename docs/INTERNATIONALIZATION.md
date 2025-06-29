# 国际化 (i18n) 使用指南

## 概述

本项目已集成多语言支持，支持以下语言：
- 🇺🇸 English (en) - 默认语言
- 🇨🇳 简体中文 (zh)
- 🇹🇼 繁體中文 (zh-TW)
- 🇯🇵 日本語 (ja)
- 🇰🇷 한국어 (ko)

## 安装依赖

首先需要安装多语言相关的依赖包：

```bash
npm install next-i18next react-i18next i18next
```

## 项目结构

```
src/
├── lib/
│   └── i18n/
│       ├── config.ts          # 多语言配置
│       ├── index.ts           # 工具函数
│       └── dictionaries/      # 翻译文件目录
│           ├── en.json        # 英文翻译
│           ├── zh.json        # 中文翻译
│           └── ja.json        # 日文翻译
├── app/
│   └── [locale]/              # 多语言路由
│       ├── layout.tsx         # 多语言布局
│       └── page.tsx           # 多语言主页
└── components/
    ├── language-switcher.tsx  # 语言切换器
    └── Header-i18n.tsx       # 多语言Header组件
```

## URL 结构

多语言项目采用以下URL结构：

- `/en` - 英文页面（默认语言）
- `/zh` - 中文页面
- `/ja` - 日文页面
- `/zh-TW` - 繁体中文页面
- `/ko` - 韩文页面

例如：
- `/en/products` - 英文产品页面
- `/zh/products` - 中文产品页面

## 配置说明

### 1. 多语言配置 (`src/lib/i18n/config.ts`)

```typescript
export const i18nConfig = {
  locales: ['en', 'zh', 'zh-TW', 'ja', 'ko'],
  defaultLocale: 'en',
  localeDomains: [
    {
      domain: 'elitestore.com',
      defaultLocale: 'en',
    },
    {
      domain: 'elitestore.cn',
      defaultLocale: 'zh',
    },
  ],
}
```

### 2. 翻译文件结构

翻译文件采用嵌套JSON结构：

```json
{
  "nav": {
    "products": "产品",
    "categories": "分类",
    "about": "关于我们"
  },
  "hero": {
    "title": "精英商店",
    "description": "为品味非凡的少数人精心策划"
  }
}
```

## 使用方法

### 1. 在组件中使用翻译

```typescript
import { getDictionary } from "@/lib/i18n"
import { type Locale } from "@/lib/i18n/config"

export default function MyComponent({ locale }: { locale: Locale }) {
  const [dict, setDict] = useState(null)

  useEffect(() => {
    getDictionary(locale).then(setDict)
  }, [locale])

  return (
    <div>
      <h1>{dict?.hero?.title}</h1>
      <p>{dict?.hero?.description}</p>
    </div>
  )
}
```

### 2. 语言切换器

项目包含一个语言切换器组件，可以在任何地方使用：

```typescript
import { LanguageSwitcher } from "@/components/language-switcher"

export function MyHeader() {
  return (
    <header>
      {/* 其他内容 */}
      <LanguageSwitcher />
    </header>
  )
}
```

### 3. 链接处理

在多语言环境中，需要为链接添加语言前缀：

```typescript
// 正确的方式
<Link href={`/${locale}/products`}>产品</Link>

// 错误的方式
<Link href="/products">产品</Link>
```

## 中间件配置

中间件会自动处理语言路由：

1. 检测URL中的语言前缀
2. 如果没有语言前缀，重定向到默认语言
3. 验证语言参数的有效性

## 添加新语言

1. 在 `src/lib/i18n/config.ts` 中添加新的语言代码
2. 在 `src/lib/i18n/dictionaries/` 中创建对应的翻译文件
3. 在 `src/lib/i18n/index.ts` 中添加字典导入
4. 更新 `localeNames` 对象

例如，添加法语支持：

```typescript
// config.ts
export const i18nConfig = {
  locales: ['en', 'zh', 'zh-TW', 'ja', 'ko', 'fr'], // 添加 'fr'
  // ...
}

export const localeNames = {
  en: 'English',
  zh: '简体中文',
  'zh-TW': '繁體中文',
  ja: '日本語',
  ko: '한국어',
  fr: 'Français', // 添加法语
}
```

## 最佳实践

1. **保持翻译文件结构一致** - 所有语言的翻译文件应该有相同的键结构
2. **使用有意义的键名** - 键名应该清楚地表示内容的含义
3. **避免硬编码文本** - 所有用户可见的文本都应该通过翻译系统
4. **测试所有语言** - 确保每种语言的页面都能正常显示
5. **考虑文本长度** - 不同语言的文本长度可能差异很大，需要考虑UI适配

## 故障排除

### 常见问题

1. **翻译不显示** - 检查翻译文件路径和键名是否正确
2. **路由错误** - 确保所有链接都包含语言前缀
3. **中间件问题** - 检查中间件配置和语言验证逻辑

### 调试技巧

1. 在浏览器控制台查看翻译数据
2. 检查网络请求是否正确加载翻译文件
3. 验证URL结构是否符合预期

## 性能优化

1. **懒加载翻译** - 翻译文件只在需要时加载
2. **缓存翻译** - 避免重复加载相同的翻译文件
3. **静态生成** - 为每种语言预生成静态页面

这样就完成了多语言功能的集成，您的项目现在支持多种语言，用户可以通过语言切换器轻松切换界面语言。 