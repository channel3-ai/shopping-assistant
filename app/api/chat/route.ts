import { ToolLoopAgent, createAgentUIStreamResponse } from 'ai';

import { appConfig } from '@/app/app-config';
import { chatAgent } from '@/agent/chat-agent';
import { getLanguageModel } from '@/lib/lm';

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
  const { messages = [], model, data } = body;

  if (!Array.isArray(messages)) {
    return new Response('Invalid request body.', { status: 400 });
  }

  const requestedModel = model ?? data?.model ?? process.env.LLM_MODEL;

  if (!requestedModel) {
    return new Response('Model not configured.', { status: 500 });
  }

  const agent =
    requestedModel === process.env.LLM_MODEL
      ? chatAgent
      : new ToolLoopAgent({
          model: getLanguageModel(requestedModel),
          instructions: appConfig.agent.instructions,
        });

  return createAgentUIStreamResponse({
    agent,
    messages,
  });
}

