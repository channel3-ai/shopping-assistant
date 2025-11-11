import { NextResponse } from 'next/server';
import Channel3 from '@channel3/sdk';

// Initialize Channel3 SDK client (uses CHANNEL3_API_KEY from environment)
const channel3Client = new Channel3();

export const runtime = 'edge';

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;

  if (!id) {
    return NextResponse.json({ error: 'Product ID is required.' }, { status: 400 });
  }

  try {
    const product = await channel3Client.products.retrieve(id);
    return NextResponse.json(product);
  } catch (error) {
    console.error('Channel3 product detail fetch failed:', error);
    
    if (error instanceof Channel3.APIError) {
      return NextResponse.json(
        { error: 'Failed to fetch product details.', message: error.message },
        { status: error.status || 500 },
      );
    }

    return NextResponse.json(
      { error: 'Unexpected error fetching product details.' },
      { status: 500 },
    );
  }
}