import { createOpenAI } from '@ai-sdk/openai';
import { streamText, tool } from 'ai';
import { z } from 'zod';

// Allow streaming responses up to 30 seconds
export const maxDuration = 10;

const openai = createOpenAI({
    apiKey: process.env.OPENAI_API_KEY,
    baseURL: process.env.AI_BASE_URL
  });

export async function POST(req: Request) {
  const { messages } = await req.json();

  const result = streamText({
    model: openai('gpt-4o-mini'),
    messages,
    tools:{
        weather: tool({
            description: "Get the weather in a given location",
            parameters: z.object({
                location: z.string().describe("The location to get the weather for")
            }),
            execute: async ({ location }) => {
                console.log(location, "location");
                
                const temperature = Math.round(Math.random() * (90 - 32) + 32);
                return {
                    location,
                    temperature
                }
            }
        })
    }
  });

  return result.toDataStreamResponse();
}