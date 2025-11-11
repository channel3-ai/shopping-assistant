import { tool } from 'ai';
import { z } from 'zod';
import Channel3 from '@channel3/sdk';

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
      query: z.string().optional(),
      imageUrl: z.url().optional(),
      limit: z.number().int().min(1).max(50).optional(),
    })
    .refine(
      (data) => data.query || data.imageUrl,
      'Provide either query or imageUrl',
    ),
  execute: async ({ query, imageUrl, limit = 20 }) => {
    const response = await channel3Client.search.perform({
        query,
        image_url: imageUrl,
        limit,
    });

    return response;
  },
});