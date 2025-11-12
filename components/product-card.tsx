'use client';

import type { KeyboardEvent, MouseEvent } from 'react';
import { useCallback } from 'react';

import type { Channel3Product } from '@/agent/tools/channel3';
import {
  Card,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { cn, formatCurrency } from '@/lib/utils';

export type ProductCardProps = {
  product: Channel3Product;
  onClick?: (product: Channel3Product) => void;
};

export function ProductCard({ onClick, product }: ProductCardProps) {
  const {
    title,
    brand_name,
    price: priceInfo,
    image_url,
  } = product;

  const isInteractive = typeof onClick === 'function';

  const handleCardClick = useCallback(
    (event: MouseEvent<HTMLDivElement>) => {
      if (!isInteractive) {
        return;
      }

      event.preventDefault();
      event.stopPropagation();
      onClick?.(product);
    },
    [isInteractive, onClick, product],
  );

  const handleKeyDown = useCallback(
    (event: KeyboardEvent<HTMLDivElement>) => {
      if (!isInteractive) {
        return;
      }

      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        onClick?.(product);
      }
    },
    [isInteractive, onClick, product],
  );

  return (
    <Card
      className={cn(
        'flex h-full flex-col transition-transform duration-200',
        isInteractive
          ? 'cursor-pointer hover:-translate-y-1 hover:shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2'
          : '',
      )}
      onClick={handleCardClick}
      onKeyDown={handleKeyDown}
      role={isInteractive ? 'button' : undefined}
      tabIndex={isInteractive ? 0 : undefined}
    >
      {image_url && (
        <div className="relative aspect-square overflow-hidden rounded-t-xl border-b">
          <img
            src={image_url}
            alt={title || 'Product image'}
            className="product-card-image"
          />
        </div>
      )}
      <CardHeader className="space-y-1 flex-1 p-3">
        {brand_name && (
          <p className="text-[10px] text-muted-foreground uppercase tracking-wide">
            {brand_name}
          </p>
        )}
        <CardTitle className="text-xs line-clamp-2">{title}</CardTitle>
        {priceInfo && (
          <p className="text-sm font-semibold">
            {formatCurrency(priceInfo.currency, priceInfo.price)}
          </p>
        )}
      </CardHeader>
    </Card>
  );
}