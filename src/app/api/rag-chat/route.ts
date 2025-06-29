import { createResource } from '@/lib/actions/resources';
import { createOpenAI } from '@ai-sdk/openai';
import { streamText, tool } from 'ai';
import { z } from 'zod';
import { findRelevantContent } from '@/lib/ai/embedding';

// 允许流式响应最多30秒
export const maxDuration = 30;

const openai = createOpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  baseURL: process.env.AI_BASE_URL
});

export async function POST(req: Request) {
  try {
    console.log('RAG Chat API called');
    
    if (!process.env.OPENAI_API_KEY) {
      console.error('OPENAI_API_KEY is not configured');
      throw new Error('OpenAI API key is not configured');
    }

    const { messages } = await req.json();
    console.log('Messages received:', messages);

    const result = streamText({
      model: openai('gpt-4o-mini'),
      messages,
      system: `你是一个有用的助手。在回答任何问题之前请先检查你的知识库。
      只使用工具调用中的信息来回答问题。
      如果在工具调用中没有找到相关信息，请回答"抱歉，我不知道。"`,
      maxSteps: 3,
    tools: {
      addResource: tool({
        description: `向你的知识库添加资源。
          如果用户主动提供了一些知识，请使用此工具而无需询问确认。`,
        parameters: z.object({
          content: z
            .string()
            .describe('要添加到知识库的内容或资源'),
        }),
        execute: async ({ content }) => {
          try {
            console.log('Adding resource:', content.substring(0, 100) + '...');
            const result = await createResource({ content });
            if (result.success) {
              console.log('Resource added successfully');
              return '资源已成功添加到知识库。';
            } else {
              console.error('Failed to add resource:', result.error);
              return '添加资源失败：' + result.error;
            }
          } catch (error) {
            console.error('Error in addResource tool:', error);
            return '添加资源时发生错误。';
          }
        },
      }),
      getInformation: tool({
        description: `从你的知识库获取信息来回答问题。`,
        parameters: z.object({
          question: z.string().describe('用户的问题'),
        }),
        execute: async ({ question }) => {
          try {
            console.log('Searching for:', question);
            const relevantContent = await findRelevantContent(question);
            console.log('Found', relevantContent.length, 'relevant items');
            if (relevantContent.length === 0) {
              return '没有找到相关信息。';
            }
            return relevantContent.map((item: any) => item.content).join('\n');
          } catch (error) {
            console.error('Error in getInformation tool:', error);
            return '搜索信息时发生错误。';
          }
        },
      }),
    },
    });

    return result.toDataStreamResponse();
  } catch (error) {
    console.error('RAG Chat API Error:', error);
    return new Response(JSON.stringify({ error: 'Internal Server Error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
} 