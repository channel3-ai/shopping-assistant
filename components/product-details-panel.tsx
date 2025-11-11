'use client';

import type { MouseEvent } from 'react';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { Loader2 } from 'lucide-react';

import type { Channel3Product, Channel3Variant } from '@/agent/tools/channel3';
import { Button } from '@/components/ui/button';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import { cn } from '@/lib/utils';

type ProductDetailsPanelProps = {
  productId: string | null;
  initialProduct?: Channel3Product | null;
  isOpen: boolean;
  onClose: () => void;
};

type PanelState = 'idle' | 'loading' | 'success' | 'error';

export function ProductDetailsPanel({
  initialProduct,
  isOpen,
  onClose,
  productId,
}: ProductDetailsPanelProps) {
  const [panelState, setPanelState] = useState<PanelState>('idle');
  const [product, setProduct] = useState<Channel3Product | null>(
    initialProduct ?? null,
  );
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [shouldRender, setShouldRender] = useState(isOpen);

  useEffect(() => {
    if (isOpen) {
      setShouldRender(true);
    }
  }, [isOpen]);

  useEffect(() => {
    if (!shouldRender) {
      setProduct(null);
      setPanelState('idle');
      setErrorMessage(null);
    }
  }, [shouldRender]);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    setProduct(initialProduct ?? null);
  }, [initialProduct, isOpen, productId]);

  useEffect(() => {
    if (!isOpen || !productId) {
      return;
    }

    const id = productId; // Capture for closure
    let cancelled = false;

    async function loadProductDetail() {
      setPanelState('loading');
      setErrorMessage(null);

      try {
        const response = await fetch(`/api/product/${encodeURIComponent(id)}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
          cache: 'no-store',
        });

        if (!response.ok) {
          const message = await response.text();
          throw new Error(message || 'Failed to load product details.');
        }

        const detail = await response.json();
        if (cancelled) return;

        setProduct((previous) => ({
          ...(previous ?? {}),
          ...detail,
        }));
        setPanelState('success');
      } catch (error) {
        if (cancelled) return;

        setPanelState('error');
        setErrorMessage(
          error instanceof Error
            ? error.message
            : 'Failed to load product details.',
        );
      }
    }

    void loadProductDetail();

    return () => {
      cancelled = true;
    };
  }, [isOpen, productId]);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  const handleBackdropClick = useCallback(
    (event: MouseEvent<HTMLDivElement>) => {
      event.stopPropagation();
      onClose();
    },
    [onClose],
  );

  const handlePanelTransitionEnd = useCallback(() => {
    if (!isOpen) {
      setShouldRender(false);
    }
  }, [isOpen]);

  const handleVariantClick = useCallback(
    async (variant: Channel3Variant) => {
      // Open the variant as a new product detail view
      setProduct(null);
      setPanelState('loading');
      
      try {
        const response = await fetch(`/api/product/${encodeURIComponent(variant.product_id)}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
          cache: 'no-store',
        });

        if (!response.ok) {
          const message = await response.text();
          throw new Error(message || 'Failed to load variant details.');
        }

        const detail = await response.json();
        setProduct(detail);
        setPanelState('success');
      } catch (error) {
        setPanelState('error');
        setErrorMessage(
          error instanceof Error
            ? error.message
            : 'Failed to load variant details.',
        );
      }
    },
    [],
  );

  const displayImages = useMemo(() => {
    if (!product) {
      return [];
    }

    const images: string[] = [];

    // Product detail API returns image_urls (plural)
    if (Array.isArray(product.image_urls)) {
      images.push(...product.image_urls.filter((image): image is string => !!image));
    }

    // Fallback to image_url (singular) from search results
    if (product.image_url && !images.includes(product.image_url)) {
      images.unshift(product.image_url);
    }

    return images;
  }, [product]);

  if (!shouldRender) {
    return null;
  }

  const isLoading = panelState === 'loading';
  const isError = panelState === 'error';

  return (
    <div className="fixed inset-0 z-50 pointer-events-none">
      <div
        className={cn(
          'absolute inset-0 bg-background/70 backdrop-blur-sm transition-opacity duration-300 ease-out pointer-events-auto',
          isOpen ? 'opacity-100' : 'opacity-0',
        )}
        onClick={handleBackdropClick}
      />
      <aside
        className={cn(
          'pointer-events-auto absolute inset-y-0 right-0 flex h-full w-full max-w-[440px] transform flex-col bg-background shadow-2xl transition-transform duration-300 ease-out sm:max-w-[480px]',
          isOpen ? 'translate-x-0' : 'translate-x-full',
        )}
        onTransitionEnd={handlePanelTransitionEnd}
        role="dialog"
        aria-modal="true"
        aria-labelledby="product-details-title"
      >
        {/* Image Carousel at Top */}
        {displayImages.length > 0 && (
          <div className="shrink-0 border-b border-border/70">
            {displayImages.length === 1 ? (
              <div className="relative aspect-square overflow-hidden bg-muted">
                <img
                  src={displayImages[0]}
                  alt={product?.title ?? 'Product image'}
                  className="size-full object-cover"
                />
              </div>
            ) : (
              <Carousel
                opts={{
                  align: 'start',
                  loop: true,
                }}
                className="w-full"
              >
                <CarouselContent>
                  {displayImages.map((image, index) => (
                    <CarouselItem key={`${image}-${index}`}>
                      <div className="relative aspect-square overflow-hidden bg-muted">
                        <img
                          src={image}
                          alt={`${product?.title ?? 'Product'} image ${index + 1}`}
                          className="size-full object-cover"
                        />
                      </div>
                    </CarouselItem>
                  ))}
                </CarouselContent>
                <CarouselPrevious className="left-2" />
                <CarouselNext className="right-2" />
              </Carousel>
            )}
          </div>
        )}

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto">
          <div className="p-6 space-y-6">
            {/* Header Info */}
            <div className="space-y-2">
              {product?.brand_name && (
                <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
                  {product.brand_name}
                </p>
              )}
              <h2
                id="product-details-title"
                className="text-xl font-semibold leading-tight text-foreground"
              >
                {product?.title ?? 'Product details'}
              </h2>
              <div className="flex items-center gap-3 text-sm">
                {product?.price && (
                  <>
                    <span className="text-2xl font-bold text-foreground">
                      {product.price.currency}{product.price.price.toFixed(2)}
                    </span>
                    {product.price.compare_at_price &&
                      product.price.compare_at_price > product.price.price && (
                        <span className="text-sm text-muted-foreground line-through">
                          {product.price.currency}{product.price.compare_at_price.toFixed(2)}
                        </span>
                      )}
                  </>
                )}
              </div>
              <div className="flex flex-wrap gap-2">
                {product?.availability && (
                  <span className="inline-flex items-center rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-xs font-medium text-emerald-600 dark:text-emerald-400">
                    {product.availability}
                  </span>
                )}
                {product?.gender && (
                  <span className="inline-flex items-center rounded-full bg-muted px-2.5 py-0.5 text-xs font-medium capitalize">
                    {product.gender}
                  </span>
                )}
              </div>
            </div>

            {isLoading && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Loader2 className="size-4 animate-spin" />
                Loading product details...
              </div>
            )}

            {isError && (
              <div className="rounded-md border border-destructive/40 bg-destructive/10 p-3 text-sm text-destructive">
                {errorMessage ?? 'Unable to load product information.'}
              </div>
            )}

            {/* Description */}
            {product?.description && (
              <section className="space-y-2">
                <h3 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                  Description
                </h3>
                <p className="text-sm leading-relaxed text-foreground/80">
                  {product.description}
                </p>
              </section>
            )}

            {/* Categories */}
            {Array.isArray(product?.categories) && product.categories.length > 0 && (
              <section className="space-y-2">
                <h3 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                  Categories
                </h3>
                <div className="flex flex-wrap gap-2">
                  {product.categories.map((category, index) => (
                    <span
                      key={`category-${index}`}
                      className="inline-flex items-center rounded-full bg-muted px-3 py-1 text-xs font-medium"
                    >
                      {category}
                    </span>
                  ))}
                </div>
              </section>
            )}

            {/* Materials */}
            {Array.isArray(product?.materials) && product.materials.length > 0 && (
              <section className="space-y-2">
                <h3 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                  Materials
                </h3>
                <ul className="space-y-1 text-sm text-foreground/80">
                  {product.materials.map((material, index) => (
                    <li key={`material-${index}`} className="flex items-start gap-2">
                      <span className="mt-1.5 size-1.5 rounded-full bg-primary/70 shrink-0" />
                      <span>{material}</span>
                    </li>
                  ))}
                </ul>
              </section>
            )}

            {/* Key Features */}
            {Array.isArray(product?.key_features) && product.key_features.length > 0 && (
              <section className="space-y-2">
                <h3 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                  Key Features
                </h3>
                <ul className="space-y-1 text-sm text-foreground/80">
                  {product.key_features.map((feature, index) => (
                    <li key={`feature-${index}`} className="flex items-start gap-2">
                      <span className="mt-1.5 size-1.5 rounded-full bg-primary/70 shrink-0" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </section>
            )}

            {/* Variants */}
            {Array.isArray(product?.variants) && product.variants.length > 0 && (
              <section className="space-y-3">
                <h3 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                  Variants
                </h3>
                <div className="grid grid-cols-2 gap-3">
                  {product.variants.map((variant, index) => (
                    <button
                      key={index}
                      type="button"
                      onClick={() => handleVariantClick(variant)}
                      className={cn(
                        'group relative flex flex-col gap-2 overflow-hidden rounded-lg border border-border/60 bg-card p-2 transition-all',
                        'hover:border-primary hover:shadow-md',
                        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
                      )}
                    >
                      <div className="relative aspect-square overflow-hidden rounded bg-muted">
                        <img
                          src={variant.image_url}
                          alt={variant.title}
                          className="size-full object-cover transition-transform group-hover:scale-105"
                        />
                      </div>
                      <div className="text-xs font-medium text-foreground line-clamp-2">
                        {variant.title}
                      </div>
                    </button>
                  ))}
                </div>
              </section>
            )}
          </div>
        </div>

        {/* Footer with CTA */}
        <div className="shrink-0 border-t border-border/70 p-6">
          {product?.url && (
            <Button asChild size="lg" className="w-full">
              <a
                href={product.url}
                target="_blank"
                rel="noopener noreferrer"
              >
                View Product
              </a>
            </Button>
          )}
        </div>
      </aside>
    </div>
  );
}