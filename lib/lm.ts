import { createAnthropic } from '@ai-sdk/anthropic';

const anthropic = createAnthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export function getLanguageModel(modelId: string) {
  return anthropic(modelId);
}

