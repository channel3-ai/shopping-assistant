import { createAnthropic } from '@ai-sdk/anthropic';
import { createOpenAI } from '@ai-sdk/openai';
import { xai } from '@ai-sdk/xai';
import { groq } from '@ai-sdk/groq';

/*
Comment out the model you want to use. 
Make sure you have the corresponding API Key in your environment variables.
For all model options, see: https://ai-sdk.dev/providers/ai-sdk-providers
*/

export function getLanguageModel(modelId: string) {
  // return groq(modelId);
  // const xai = createXai({
  // return createOpenAI({
  return createAnthropic({
    apiKey: process.env.LLM_API_KEY,
  })(modelId);
}
