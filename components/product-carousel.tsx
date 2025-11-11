'use client';

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import { ProductCard, type ProductCardProps } from '@/components/product-card';

export type ProductCarouselProps = {
  products: Array<ProductCardProps['product']>;
  onProductClick?: (product: ProductCardProps['product']) => void;
};

export function ProductCarousel({ onProductClick, products }: ProductCarouselProps) {
  if (!products || products.length === 0) {
    return null;
  }

  return (
    <div className="w-full" style={{ width: 'calc(100vw - var(--chat-padding) * 2)' }}>
      <Carousel
        opts={{
          align: 'start',
          loop: false,
        }}
        className="w-full"
      >
        <CarouselContent className="-ml-2">
          {products.map((product, index) => (
            <CarouselItem
              key={product.id || index}
              className="pl-2 basis-[160px] sm:basis-[180px] md:basis-[200px]"
            >
              <ProductCard product={product} onClick={onProductClick} />
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="left-0" />
        <CarouselNext className="right-0" />
      </Carousel>
    </div>
  );
}