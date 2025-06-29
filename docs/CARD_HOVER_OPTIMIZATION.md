# 卡片Hover交互优化

## 问题描述
用户反馈首页卡片存在以下问题：
1. 卡片看起来有点模糊
2. hover时的动效不自然
3. 不希望使用scale缩放效果

## 解决方案

### 1. 移除所有Scale缩放效果
- 移除产品卡片图片的 `group-hover:scale-105` 效果
- 移除按钮的 `hover:scale-105` 效果  
- 移除全局 `.elite-hover:hover` 的 `transform: scale(1.02)` 效果

### 2. 优化交互状态
改为仅使用颜色变化表示三种状态：
- **普通状态**: 默认颜色
- **hover状态**: 颜色变浅（80%透明度）
- **active状态**: 颜色变深（70%透明度）

### 3. 移除模糊效果
- 移除 `backdrop-blur-[2px]` 效果
- 移除暗色模式下图片的 `filter: brightness(0.9)` 滤镜

### 4. 统一过渡时间
将所有动画过渡时间统一为 `200ms`，提供更流畅的用户体验。

## 修改的文件

### src/app/[locale]/page.tsx
- Hero按钮: 移除scale，添加active状态
- 产品卡片: 移除scale和模糊效果，优化颜色过渡
- 购物车按钮: 移除scale效果

### src/app/globals.css  
- 移除 `.elite-hover:hover` 的scale效果
- 移除暗色模式下图片的亮度滤镜

## 改进效果
✅ 卡片显示更清晰，无模糊效果
✅ 交互动效更自然，仅通过颜色变化
✅ 提供三种交互状态：普通、hover、active
✅ 统一的200ms过渡时间
✅ 更好的用户体验 