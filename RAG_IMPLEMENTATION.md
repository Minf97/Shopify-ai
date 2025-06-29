# RAG 聊天机器人实现

基于AI SDK的检索增强生成(RAG)聊天机器人实现，可以学习和记住用户提供的信息。

## 已完成任务

- [x] 创建数据库迁移文件
- [x] 创建向量匹配函数
- [x] 实现嵌入逻辑
- [x] 创建资源管理操作
- [x] 创建RAG聊天API路由
- [x] 添加多语言翻译支持
- [x] 创建客户端UI组件
- [x] 创建页面结构
- [x] 更新导航菜单

## 下一步任务

- [ ] 运行数据库迁移
- [ ] 配置环境变量
- [ ] 测试RAG功能

## 相关文件

- ✅ `supabase/migrations/001_create_rag_tables.sql`
- ✅ `supabase/migrations/002_create_match_function.sql`
- ✅ `src/lib/ai/embedding.ts`
- ✅ `src/lib/actions/resources.ts`
- ✅ `src/app/api/rag-chat/route.ts`
- ✅ `src/app/[locale]/test_rag/`目录下所有文件
- ✅ 翻译文件更新
- ✅ `src/components/Header.tsx`

## 环境配置

需要设置：
```
OPENAI_API_KEY=your_openai_api_key
SUPABASE_URL=your_supabase_url
SUPABASE_ANON_KEY=your_supabase_anon_key
``` 