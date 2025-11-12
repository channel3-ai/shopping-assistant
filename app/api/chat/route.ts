import { createAgentUIStreamResponse } from 'ai';

import { chatAgent } from '@/agent/chat-agent';
import { augmentMessageWithImagePointers } from '@/lib/image-attachments';

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

  // Filter out empty assistant messages (workaround for AI SDK beta issue)
  // Claude API rejects empty assistant messages
  const filteredMessages = messages.filter((msg: any) => {
    if (msg.role === 'assistant') {
      // Keep assistant messages that have content
      const hasContent = msg.content && (
        (Array.isArray(msg.content) && msg.content.length > 0) ||
        (typeof msg.content === 'string' && msg.content.trim().length > 0)
      );
      return hasContent;
    }
    return true;
  });

  const augmentedMessages = filteredMessages.map(augmentMessageWithImagePointers);

  return createAgentUIStreamResponse({
    agent: chatAgent,
    messages: augmentedMessages,
  });
}

