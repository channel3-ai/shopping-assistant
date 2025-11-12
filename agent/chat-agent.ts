import { ToolLoopAgent } from 'ai';

import { appConfig } from '@/app/app-config';
import { searchProducts } from '@/agent/tools/channel3';
import { systemPrompt } from './system-prompt';

export const chatAgent = new ToolLoopAgent({
  model: appConfig.model,
  instructions: appConfig.agent.instructions + systemPrompt,
  tools: {
    searchProducts,
  },
  
});
