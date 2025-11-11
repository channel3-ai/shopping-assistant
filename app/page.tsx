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
  MessageAttachment,
  MessageContent,
  MessageResponse,
} from '@ai-elements/message';
import {
  PromptInput,
  PromptInputAttachment,
  PromptInputAttachments,
  PromptInputBody,
  PromptInputButton,
  PromptInputFooter,
  PromptInputSubmit,
  PromptInputTextarea,
  PromptInputTools,
  usePromptInputAttachments,
} from '@ai-elements/prompt-input';
import { ImageIcon, SquarePen } from 'lucide-react';
import { PoweredByChannel3 } from '@/components/powered-by-channel3';
import { ThemeToggle } from '@/components/theme-toggle';
import { Button } from '@ui/button';
import { Tooltip, TooltipContent, TooltipTrigger } from '@ui/tooltip';
import { appConfig } from './app-config';

function renderMessagePart(part: UIMessage['parts'][number], index: number): ReactNode {
  if (part.type === 'text') {
    return <MessageResponse key={index}>{part.text}</MessageResponse>;
  }
  if (part.type === 'file') {
    return <MessageAttachment key={index} data={part} />;
  }
  return null;
}

function ErrorDisplay({ message }: { message: string }) {
  return <div className="error-message">{message}</div>;
}

function ImageUploadButton() {
  const attachments = usePromptInputAttachments();

  return (
    <PromptInputButton onClick={attachments.openFileDialog} aria-label="Add image">
      <ImageIcon className="size-4" />
    </PromptInputButton>
  );
}

export default function Page() {
  const { messages, sendMessage, status, error, setMessages } = useChat({
    transport: new DefaultChatTransport({ api: '/api/chat' }),
  });

  const filteredMessages = useMemo(
    () => messages.filter((message) => message.role !== 'system'),
    [messages],
  );

  const handleSubmit = useCallback(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (message: any) => {
      const hasText = message.text?.trim();
      const hasFiles = message.files;

      if (!hasText && !hasFiles) {
        return;
      }

      // Send message without awaiting to avoid delay in clearing attachments
      sendMessage(message);
    },
    [sendMessage],
  );

  const handleNewChat = useCallback(() => {
    // Clear all messages to start a new chat
    setMessages([]);
  }, [setMessages]);

  const isLoading = status === 'streaming' || status === 'submitted';
  const shouldShowLoader = useMemo(() => {
    if (!isLoading) return false;
    const lastMessage = filteredMessages[filteredMessages.length - 1];
    return !lastMessage?.parts?.length;
  }, [isLoading, filteredMessages]);

  return (
    <div className="chat-container">
      <header className="chat-header">
        <PoweredByChannel3 />
        <div className="chat-header-center">
          <h1 className="text-xl font-semibold tracking-tight">{appConfig.ui.header.title}</h1>
          <p className="text-sm text-muted-foreground">{appConfig.ui.header.subtitle}</p>
        </div>
        <div className="chat-header-actions">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                onClick={handleNewChat}
                disabled={isLoading}
                aria-label="New chat"
              >
                <SquarePen className="size-5" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>New chat</p>
            </TooltipContent>
          </Tooltip>
          <ThemeToggle />
        </div>
      </header>
      <div className="chat-body">
        <Conversation>
          <ConversationContent>
            {filteredMessages.length === 0 ? (
              <ConversationEmptyState
                title={appConfig.ui.emptyState.title}
                description={appConfig.ui.emptyState.description}
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
                {shouldShowLoader && <Loader className="ml-2 text-muted-foreground" />}
                {error && <ErrorDisplay message={error.message} />}
              </>
            )}
          </ConversationContent>
        </Conversation>
        <div className="chat-input-wrapper">
          <PromptInput onSubmit={handleSubmit} accept="image/*" multiple>
            <PromptInputBody>
              <PromptInputAttachments>
                {(attachment) => <PromptInputAttachment data={attachment} />}
              </PromptInputAttachments>
              <PromptInputTextarea placeholder={appConfig.ui.input.placeholder} />
            </PromptInputBody>
            <PromptInputFooter>
              <PromptInputTools>
                <ImageUploadButton />
              </PromptInputTools>
              <PromptInputSubmit status={status} />
            </PromptInputFooter>
          </PromptInput>
        </div>
      </div>
    </div>
  );
}
