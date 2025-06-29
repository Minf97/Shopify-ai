-- 启用pgvector扩展
CREATE EXTENSION IF NOT EXISTS vector;

-- 创建resources表用于存储原始内容
CREATE TABLE IF NOT EXISTS resources (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- 创建embeddings表用于存储向量嵌入
CREATE TABLE IF NOT EXISTS embeddings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  resource_id UUID REFERENCES resources(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  embedding vector(1536) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- 创建向量搜索索引
CREATE INDEX IF NOT EXISTS embeddings_embedding_idx ON embeddings 
USING ivfflat (embedding vector_cosine_ops)
WITH (lists = 100);

-- 创建RLS策略
ALTER TABLE resources ENABLE ROW LEVEL SECURITY;
ALTER TABLE embeddings ENABLE ROW LEVEL SECURITY;

-- 允许匿名用户读取和插入（对于演示目的）
CREATE POLICY "Allow anonymous access to resources" ON resources
  FOR ALL USING (true);

CREATE POLICY "Allow anonymous access to embeddings" ON embeddings  
  FOR ALL USING (true); 