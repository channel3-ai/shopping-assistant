export const appConfig = {
  // Metadata values for the browser tab + SEO.
  metadata: {
    title: 'Style Studio - Personal Fashion Advisor',
    description:
      'Get expert fashion advice and personalized styling recommendations from your personal fashion advisor.',
  },
  // UI copy used across the chat interface.
  ui: {
    // Text content for the header section at the top of the chat.
    header: {
      title: 'Style Studio',
      subtitle: 'Your personal fashion advisor',
    },
    // Default empty state shown before the conversation begins.
    emptyState: {
      title: 'Welcome to Your Style Studio ✨',
      description:
        'Tell me about your style preferences, the occasion, or what you\'re looking for. I\'m here to help you find pieces that match your aesthetic.',
    },
    // Placeholder text displayed inside the prompt input.
    input: {
      placeholder: 'Describe your style or what you\'re looking for…',
    },
  },
  // System instructions provided to the AI agent.
  agent: {
    instructions:
      'You are an experienced fashion stylist and personal shopping advisor. You have expertise in clothing, accessories, trends, fabrics, fit, and style aesthetics. Ask thoughtful questions about body type, style preferences (minimalist, maximalist, classic, trendy, etc.), occasions, and budget. Provide specific recommendations with reasoning about why pieces work together, how to style them, and what makes them versatile. Consider factors like seasonality, color palettes, silhouettes, and quality. Be encouraging and help clients develop confidence in their personal style. Keep responses insightful but concise.',
  },
  // Theme colors, light vs dark matches the user's system preference
  theme: {
    light: {
      background: '#fafafa',
      foreground: '#18181b',
      card: '#ffffff',
      cardForeground: '#18181b',
      primary: '#18181b',
      primaryForeground: '#fafafa',
      secondary: '#f4f4f5',
      secondaryForeground: '#18181b',
      accent: '#e4e4e7',
      accentForeground: '#18181b',
      muted: '#f4f4f5',
      mutedForeground: '#71717a',
      border: '#e4e4e7',
      input: '#e4e4e7',
      ring: '#18181b',
    },
    dark: {
      background: '#09090b',
      foreground: '#fafafa',
      card: '#18181b',
      cardForeground: '#fafafa',
      primary: '#fafafa',
      primaryForeground: '#09090b',
      secondary: '#27272a',
      secondaryForeground: '#fafafa',
      accent: '#3f3f46',
      accentForeground: '#fafafa',
      muted: '#27272a',
      mutedForeground: '#a1a1aa',
      border: '#27272a',
      input: '#27272a',
      ring: '#fafafa',
    },
  },
} as const;

export type AppConfig = typeof appConfig;

