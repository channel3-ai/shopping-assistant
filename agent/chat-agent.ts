import { ToolLoopAgent } from 'ai';

import { getLanguageModel } from '@/lib/lm';

export const chatAgentInstructions =
  'You are a concise, friendly shopping assistant. Help users discover products, compare options, and make confident decisions.';

export const chatAgent = new ToolLoopAgent({
  model: getLanguageModel(process.env.LLM_MODEL!),
  instructions: chatAgentInstructions,
});

