import { createAgentUIStreamResponse } from 'ai';

import { chatAgent } from '@/agent/chat-agent';

export const runtime = 'edge';

type ChatRequestBody = {
  messages: Array<unknown>;
  model?: string;
  data?: {
    model?: string;
    [key: string]: unknown;
  };
};

export async function POST(request: Request) {
  const body = (await request.json()) as ChatRequestBody;
  const { messages = [] } = body;

  if (!Array.isArray(messages)) {
    return new Response('Invalid request body.', { status: 400 });
  }

  return createAgentUIStreamResponse({
    agent: chatAgent,
    messages,
  });
}

