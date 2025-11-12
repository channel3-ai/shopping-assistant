import { nanoid } from 'nanoid';

/**
 * Image Attachment Utility
 * 
 * Workaround for AI SDK limitation where tool parameters containing large strings
 * (like base64 images) get truncated to ~40-50 characters when passed to tools.
 * 
 * This utility stores image data server-side and uses short pointer strings
 * that can be safely passed through tool calls and resolved back to full data.
 */

declare global {
  // eslint-disable-next-line no-var
  var __imageAttachmentStore: Map<string, string> | undefined;
}

const imageStore = (globalThis.__imageAttachmentStore ??= new Map<string, string>());

/**
 * Convert file parts from messages into pointer text that the LLM can use
 */
export function augmentMessageWithImagePointers(message: any) {
  if (!message?.parts || !Array.isArray(message.parts)) {
    return message;
  }

  const fileParts = message.parts.filter(
    (part: any) => part?.type === 'file' && typeof part?.url === 'string'
  );

  if (fileParts.length === 0) {
    return message;
  }

  const pointerParts = fileParts
    .map((part: any, index: number) => {
      const url: string = part.url;
      const commaIndex = url.indexOf(',');
      if (commaIndex === -1) return null;

      const base64Data = url.substring(commaIndex + 1);
      if (!base64Data) return null;

      const imageId = nanoid();
      imageStore.set(imageId, base64Data);

      const mediaType = part.mediaType ?? 'unknown';
      return {
        type: 'text',
        text: `Attachment ${index + 1} (${mediaType}) is available as base64Image "image:${imageId}". Pass that value to the searchProducts tool's base64Image argument to search by this image.`,
      };
    })
    .filter(Boolean);

  return pointerParts.length
    ? {
        ...message,
        parts: [...message.parts, ...pointerParts],
      }
    : message;
}

/**
 * Resolve a base64Image parameter that might be a pointer, data URL, or raw base64
 */
export function resolveBase64Image(base64Image?: string): string | undefined {
  if (!base64Image) return undefined;

  // Handle pointer format: "image:abc123"
  if (base64Image.startsWith('image:')) {
    const pointer = base64Image.slice('image:'.length);
    const stored = imageStore.get(pointer);
    if (stored) {
      imageStore.delete(pointer); // Clean up after use
      return stored;
    }
    throw new Error(`No image found for pointer: ${pointer}`);
  }

  // Handle data URL format: "data:image/png;base64,..."
  if (base64Image.startsWith('data:')) {
    const commaIndex = base64Image.indexOf(',');
    return commaIndex !== -1 ? base64Image.substring(commaIndex + 1) : base64Image;
  }

  // Already clean base64
  return base64Image;
}

