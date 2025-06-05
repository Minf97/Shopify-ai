import { openai } from '@ai-sdk/openai';
import { streamText } from 'ai';

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

export async function POST(req: Request) {
  const { messages } = await req.json();

  console.log(messages, "messages");
  

  const result = streamText({
    model: openai('gpt-4o'),
    messages,
  });
  console.log(result, "result");

  return result.toDataStreamResponse();
}