import { tool } from 'ai';
import { z } from 'zod';
import Channel3 from '@channel3/sdk';
import { appConfig } from '@/app/app-config';

/**
 * Channel3 API Type Definitions
 * Based on: https://docs.trychannel3.com/api-reference/endpoint/search
 */

export interface Channel3Price {
  price: number;
  compare_at_price?: number | null;
  currency: string;
}

export type ProductAvailability =
  | 'InStock'
  | 'LimitedAvailability'
  | 'PreOrder'
  | 'BackOrder'
  | 'SoldOut'
  | 'OutOfStock'
  | 'Discontinued'
  | 'Unknown';

export type Gender = 'male' | 'female' | 'unisex';

// Internal type for Channel3 API - matches the filters structure from appConfig
interface SearchFilters {
  brand_ids?: string[] | null;
  gender?: Gender | null;
  condition?: 'new' | 'refurbished' | 'used' | null;
  price?: {
    min_price?: number | null;
    max_price?: number | null;
  } | null;
  availability?: ProductAvailability[] | null;
  website_ids?: string[] | null;
  category_ids?: string[] | null;
  exclude_product_ids?: string[] | null;
}

export interface Channel3Variant {
  product_id: string;
  title: string;
  image_url: string;
}

export interface Channel3Product {
  id: string;
  score?: number; // Only in search results
  url: string;
  title: string;
  description?: string | null;
  brand_id?: string | null;
  brand_name?: string | null;
  image_url?: string; // For search results compatibility
  image_urls?: string[]; // Product detail uses image_urls (plural)
  price: Channel3Price;
  categories?: string[];
  availability?: ProductAvailability;
  gender?: Gender | null;
  materials?: string[] | null;
  key_features?: string[] | null;
  variants?: Channel3Variant[];
}

// Initialize Channel3 SDK client (uses CHANNEL3_API_KEY from environment)
const channel3Client = new Channel3();

export const searchProducts = tool({
  description:
    'Search for fashion and apparel products using text or image URL. Returns ranked matches.',
  inputSchema: z
    .object({
      query: z.string().optional().describe('Search query text'),
      imageUrl: z.url().optional().describe('Image URL for visual search'),
      limit: z.number().int().min(1).max(50).optional().describe('Maximum number of results to return'),
    })
    .refine(
      (data) => data.query || data.imageUrl,
      'Provide either query or imageUrl',
    ),
  execute: async ({ 
    query, 
    imageUrl, 
    limit = 20,
  }) => {
    // Build filters object from config - these are automatically applied to all searches
    const filters: SearchFilters = {
      ...appConfig.search.filters,
      // Cast readonly arrays from config to mutable arrays
      availability: appConfig.search.filters.availability ? [...appConfig.search.filters.availability] : undefined,
    };

    const response = await channel3Client.search.perform({
        query,
        image_url: imageUrl,
        limit,
        filters,
    });

    return response;
  },
});