import { ToolLoopAgent } from 'ai';

import { appConfig } from '@/app/app-config';
import { searchProducts } from '@/agent/tools/channel3';
import { getLanguageModel } from '@/lib/lm';
import { systemPrompt } from './system-prompt';

export const chatAgent = new ToolLoopAgent({
  model: getLanguageModel(process.env.LLM_MODEL!),
  instructions: appConfig.agent.instructions + systemPrompt,
  tools: {
    searchProducts,
  },
  
});
