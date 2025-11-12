'use client';

import { type ReactNode, useCallback, useMemo, useState } from 'react';
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
import { ImageIcon, SearchIcon, SquarePen } from 'lucide-react';
import { PoweredByChannel3 } from '@/components/powered-by-channel3';
import { ThemeToggle } from '@/components/theme-toggle';
import { ProductCarousel, type ProductCarouselProps } from '@/components/product-carousel';
import { ProductDetailsPanel } from '@/components/product-details-panel';
import type { Channel3Product } from '@/agent/tools/channel3';
import { Button } from '@ui/button';
import { Tooltip, TooltipContent, TooltipTrigger } from '@ui/tooltip';
import { appConfig } from './app-config';

function renderMessageParts(
  parts: UIMessage['parts'],
  onProductClick?: (product: Channel3Product) => void,
  isStreaming?: boolean,
): ReactNode[] {
  const renderedParts: ReactNode[] = [];
  const aggregatedProducts: ProductCarouselProps['products'] = [];
  const textAndOtherParts: ReactNode[] = [];

  parts.forEach((part, index) => {
  if (part.type === 'text') {
      textAndOtherParts.push(
        <MessageResponse key={`text-${index}`}>{part.text}</MessageResponse>,
      );
      return;
  }

  if (part.type === 'file') {
      textAndOtherParts.push(<MessageAttachment key={`file-${index}`} data={part} />);
      return;
  }

  if (part.type === 'tool-searchProducts') {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const input = part.input as any;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const output = part.output as any;
      
      const query = input?.query;
      const imageUrl = input?.imageUrl;
      
      // Determine if task should be open (during search) or collapsed (after results)
      const hasResults = part.state === 'output-available' && Array.isArray(output);
      const resultCount = hasResults ? output.length : 0;
      
      // Build title based on state
      let title = '';
      if (hasResults) {
        // After search completes, show result count
        if (query) {
          title = `Found ${resultCount} result${resultCount !== 1 ? 's' : ''} for "${query}"`;
        } else if (imageUrl) {
          title = `Found ${resultCount} result${resultCount !== 1 ? 's' : ''} by image`;
        } else {
          title = `Found ${resultCount} result${resultCount !== 1 ? 's' : ''}`;
        }
      } else {
        // While searching (any state before output-available), don't show result count
        if (query) {
          title = `Searching for "${query}"`;
        } else if (imageUrl) {
          title = 'Searching by image';
        } else {
          title = 'Searching products';
        }
      }
      
      textAndOtherParts.push(
        <div key={`task-${part.toolCallId}-${index}`} className="flex items-center gap-2 text-muted-foreground text-sm mb-2">
          <SearchIcon className="size-4" />
          <span>{title}</span>
        </div>
      );
      
      // Aggregate products for display at the beginning
      if (hasResults && output.length > 0) {
        aggregatedProducts.push(...output);
      }
      
      return;
    }
  });

  // Render all aggregated products in a single carousel at the beginning
  if (aggregatedProducts.length > 0) {
    const dedupedProducts: ProductCarouselProps['products'] = [];
    const seen = new Set<string>();

    aggregatedProducts.forEach((product: Channel3Product, productIndex: number) => {
      const identifier =
        product.id ?? `${product.title ?? 'product'}-${productIndex.toString()}`;
      if (seen.has(identifier)) {
        return;
      }
      seen.add(identifier);
      dedupedProducts.push(product);
    });

    renderedParts.push(
      <ProductCarousel
        key="all-products"
        products={dedupedProducts}
        onProductClick={onProductClick}
      />,
    );
  }

  // Add text and other parts after the carousel
  renderedParts.push(...textAndOtherParts);

  return renderedParts;
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
  const [selectedProduct, setSelectedProduct] = useState<Channel3Product | null>(null);
  const [isProductPanelOpen, setIsProductPanelOpen] = useState(false);

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
    setSelectedProduct(null);
    setIsProductPanelOpen(false);
  }, [setMessages]);

  const handleProductSelect = useCallback((product: Channel3Product) => {
    setSelectedProduct(product);
    setIsProductPanelOpen(true);
  }, []);

  const handleProductPanelClose = useCallback(() => {
    setIsProductPanelOpen(false);
  }, []);

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
          <p className="text-sm opacity-75">{appConfig.ui.header.subtitle}</p>
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
                {filteredMessages.map((message, messageIndex) => {
                  const isLastMessage = messageIndex === filteredMessages.length - 1;
                  const isMessageStreaming = isLoading && isLastMessage;
                  
                  return (
                    <Message key={`${message.id}-${messageIndex}`} from={message.role}>
                      <MessageContent>
                        {renderMessageParts(message.parts, handleProductSelect, isMessageStreaming)}
                      </MessageContent>
                    </Message>
                  );
                })}
                {shouldShowLoader && <Loader className="ml-2 text-muted-foreground" />}
                {error && <ErrorDisplay message={error.message} />}
              </>
            )}
          </ConversationContent>
        </Conversation>
      </div>
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
      <ProductDetailsPanel
        isOpen={isProductPanelOpen}
        onClose={handleProductPanelClose}
        productId={selectedProduct?.id ?? null}
        initialProduct={selectedProduct}
      />
    </div>
  );
}
