'use server';

import { createClient } from '@/lib/supabase/server';
import { generateEmbeddings } from '@/lib/ai/embedding';

export const createResource = async ({ content }: { content: string }) => {
  try {
    const supabase = await createClient();

    // 首先创建资源记录
    const { data: resource, error: resourceError } = await supabase
      .from('resources')
      .insert({ content })
      .select()
      .single();

    if (resourceError) {
      console.error('Error creating resource:', resourceError);
      throw new Error('Failed to create resource');
    }

    // 生成嵌入
    const embeddings = await generateEmbeddings(content);

    // 插入嵌入数据
    const embeddingInserts = embeddings.map(({ content: chunk, embedding }) => ({
      resource_id: resource.id,
      content: chunk,
      embedding: embedding,
    }));

    const { error: embeddingError } = await supabase
      .from('embeddings')
      .insert(embeddingInserts);

    if (embeddingError) {
      console.error('Error creating embeddings:', embeddingError);
      // 如果嵌入创建失败，删除资源
      await supabase.from('resources').delete().eq('id', resource.id);
      throw new Error('Failed to create embeddings');
    }

    return { success: true, resourceId: resource.id };
  } catch (error) {
    console.error('Error in createResource:', error);
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
  }
}; 