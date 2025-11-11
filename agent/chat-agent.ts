import { ToolLoopAgent } from 'ai';

import { appConfig } from '@/app/app-config';
import { getLanguageModel } from '@/lib/lm';

export const chatAgent = new ToolLoopAgent({
  model: getLanguageModel(process.env.LLM_MODEL!),
  instructions: appConfig.agent.instructions,
});

