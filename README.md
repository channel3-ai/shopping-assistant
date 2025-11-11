# Shopping Assistant Chatbot

Minimal, forkable chatbot built with Next.js, Vercel AI SDK 6 (beta), and Vercel AI Gateway. The UI reuses AI Elements (`@ai-elements/*`) and shadcn/ui (`@ui/*`) components so teams can extend the experience without rebuilding core primitives.

- Streaming chat powered by a configurable OpenAI-compatible model (default: `gpt-5-chat-latest`)
- Optional routing through Vercel AI Gateway via `OPENAI_BASE_URL`
- Runs on the Edge (`app/api/chat/route.ts`) for low-latency responses
- No auth or persistent history—state lives in the browser session

## Prerequisites

- Node.js 18.18+ (the project targets the version range required by Next.js 16)
- [`pnpm`](https://pnpm.io/) (recommended) or another Node package manager
- An API key for an OpenAI-compatible provider (e.g., Vercel AI Gateway)

## Setup

1. Install dependencies:

   ```bash
   pnpm install
   ```

2. Copy the example env file and fill in your values:

   ```bash
   cp .env.example .env.local
   ```

   | Variable            | Required | Description                                                                 |
   | ------------------- | -------- | --------------------------------------------------------------------------- |
   | `ANTHROPIC_API_KEY` | ✅       | Your Anthropic API key for Claude models.                                  |
   | `LLM_MODEL`         | ✅       | Claude model id (e.g., `claude-3-5-sonnet-latest`, `claude-opus-4-1`).    |

3. Start the dev server:

   ```bash
   pnpm dev
   ```

4. Visit [http://localhost:3000](http://localhost:3000) and start chatting.

## How It Works

- `lib/lm.ts` wraps the Anthropic adapter from AI SDK, pulling credentials from environment variables.
- `agent/chat-agent.ts` defines a `ToolLoopAgent` with a concise shopping assistant system prompt. Swap the prompt or provide tools as needed.
- `app/api/chat/route.ts` handles POST requests using `createAgentUIStreamResponse`, enabling streamed UI updates and runtime model overrides.
- `app/page.tsx` composes AI Elements (Panel, PromptInput, Message, ModelSelector, Loader) with shadcn/ui primitives (Card, ScrollArea, Separator, Button) to render the chat experience.

## Customization Tips

- **Update default instructions**: edit `chatAgentInstructions` in `agent/chat-agent.ts`.
- **Change the model list**: modify the `MODELS` array in `app/page.tsx`. Setting `LLM_MODEL` ensures the server-side agent matches the selected default.
- **Add tools or structured output**: extend `chatAgent` with AI SDK 6 features like tool calling, approval, or `Output.object`.
- **Persist conversations**: wire `useChat` up to your own storage or add middleware in the API route. The template currently keeps messages in memory only.

## Deployment

Deploy to Vercel for the best Gateway + Edge support:

```bash
pnpm run build
```

Ensure the production environment is configured with the same variables (`ANTHROPIC_API_KEY`, `LLM_MODEL`).
