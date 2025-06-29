import { embed, embedMany } from 'ai';
import { createOpenAI } from '@ai-sdk/openai';
import { createClient } from '@/lib/supabase/server';

const openai = createOpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const embeddingModel = openai.embedding('text-embedding-ada-002');

// 将文本分割成块
const generateChunks = (input: string): string[] => {
  return input
    .trim()
    .split('.')
    .filter(i => i !== '');
};

// 生成多个文本块的嵌入
export const generateEmbeddings = async (
  value: string,
): Promise<Array<{ embedding: number[]; content: string }>> => {
  const chunks = generateChunks(value);
  const { embeddings } = await embedMany({
    model: embeddingModel,
    values: chunks,
  });
  return embeddings.map((e, i) => ({ content: chunks[i], embedding: e }));
};

// 生成单个文本的嵌入
export const generateEmbedding = async (value: string): Promise<number[]> => {
  const input = value.replaceAll('\\n', ' ');
  const { embedding } = await embed({
    model: embeddingModel,
    value: input,
  });
  return embedding;
};

// 查找相关内容
export const findRelevantContent = async (userQuery: string) => {
  const supabase = await createClient();
  const userQueryEmbedded = await generateEmbedding(userQuery);

  // 使用Supabase的向量搜索功能
  const { data: similarEmbeddings, error } = await supabase.rpc(
    'match_embeddings',
    {
      query_embedding: userQueryEmbedded,
      match_threshold: 0.5,
      match_count: 4,
    }
  );

  if (error) {
    console.error('Error finding relevant content:', error);
    return [];
  }

  return similarEmbeddings || [];
}; 