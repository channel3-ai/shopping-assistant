'use client';

import { type ReactNode, useCallback, useMemo } from 'react';
import { DefaultChatTransport, type UIMessage } from 'ai';
import { useChat } from '@ai-sdk/react';

import {
  Conversation,
  ConversationContent,
  ConversationEmptyState,
} from '@ai-elements/conversation';
import { Loader } from '@ai-elements/loader';
import {
  Message,
  MessageContent,
  MessageResponse,
} from '@ai-elements/message';
import {
  PromptInput,
  PromptInputBody,
  PromptInputFooter,
  PromptInputSubmit,
  PromptInputTextarea,
} from '@ai-elements/prompt-input';

function renderMessagePart(part: UIMessage['parts'][number], index: number): ReactNode {
  if (part.type === 'text') {
    return <MessageResponse key={index}>{part.text}</MessageResponse>;
  }
  return null;
}

function ErrorDisplay({ message }: { message: string }) {
  return <div className="error-message">{message}</div>;
}

export default function Page() {
  const { messages, sendMessage, status, error } = useChat({
    transport: new DefaultChatTransport({ api: '/api/chat' }),
  });

  const filteredMessages = useMemo(
    () => messages.filter((message) => message.role !== 'system'),
    [messages],
  );

  const handleSubmit = useCallback(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    async (message: any) => {
      const hasText = message.text?.trim();
      const hasFiles = message.files;

      if (!hasText && !hasFiles) {
        return;
      }

      await sendMessage(message);
    },
    [sendMessage],
  );

  const isLoading = status === 'streaming' || status === 'submitted';

  return (
    <div className="chat-container">
      <header className="chat-header">
        <h1 className="text-xl font-semibold tracking-tight">Shopping Assistant</h1>
        <p className="text-sm text-muted-foreground">
          Ask for product ideas, comparisons, or gift inspiration.
        </p>
      </header>
      <div className="chat-body">
        <Conversation>
          <ConversationContent>
            {filteredMessages.length === 0 ? (
              <ConversationEmptyState
                title="Welcome! 👋"
                description="Start the conversation with a shopping question or ask for recommendations."
              />
            ) : (
              <>
                {filteredMessages.map((message) => (
                  <Message key={message.id} from={message.role}>
                    <MessageContent>
                      {message.parts.map(renderMessagePart)}
                    </MessageContent>
                  </Message>
                ))}
                {isLoading && <Loader className="ml-2 text-muted-foreground" />}
                {error && <ErrorDisplay message={error.message} />}
              </>
            )}
          </ConversationContent>
        </Conversation>
        <div className="chat-input-wrapper">
          <PromptInput onSubmit={handleSubmit}>
            <PromptInputBody>
              <PromptInputTextarea placeholder="Ask for advice on what to buy…" />
            </PromptInputBody>
            <PromptInputFooter>
              <PromptInputSubmit status={status} />
            </PromptInputFooter>
          </PromptInput>
        </div>
      </div>
    </div>
  );
}
