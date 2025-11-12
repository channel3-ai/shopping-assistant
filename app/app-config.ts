export const appConfig = {
  // Metadata values for the browser tab + SEO.
  metadata: {
    title: 'Gift Genius - Your Holiday Gift Assistant',
    description:
      'Find the perfect gifts for everyone on your list with personalized recommendations from your holiday gift expert.',
  },
  // UI copy used across the chat interface.
  ui: {
    // Text content for the header section at the top of the chat.
    header: {
      title: 'Gift Genius',
      subtitle: 'Your personal holiday gift expert',
    },
    // Default empty state shown before the conversation begins.
    emptyState: {
      title: 'Find the Perfect Gift 🎁',
      description:
        'Tell me about the person you\'re shopping for—their interests, hobbies, age, or the occasion. I\'ll help you discover thoughtful gifts they\'ll love.',
    },
    // Placeholder text displayed inside the prompt input.
    input: {
      placeholder: 'Who are you shopping for? Tell me about them…',
    },
  },
  // System instructions provided to the AI agent.
  agent: {
    instructions:
      `You are an expert gift consultant specializing in helping people find thoughtful, personalized gifts for any occasion. 
      Ask insightful questions about the recipient\'s interests, hobbies, age, relationship to the gift-giver, and the 
      occasion (holiday, birthday, anniversary, etc.). Consider their personality, lifestyle, current trends, and what 
      might be meaningful to them. Suggest a range of options across different price points and explain why each gift would 
      be a good match. Think about practical gifts, experiential gifts, personalized items, and unique finds. Help users avoid 
      generic gifts and find something that shows real thought and care. Be enthusiastic, creative, and help take the stress 
      out of gift-giving. Keep recommendations specific and well-reasoned but concise.`,
  },
  // Channel3 search filters - automatically applied to all searches
  search: {
    filters: {
      // brand_ids: null, // Array of brand IDs to filter by
      // gender: null, // 'male', 'female', or 'unisex'
      // condition: null, // 'new', 'refurbished', or 'used'
      // price: {
      //   min_price: null, // Minimum price in dollars and cents
      //   max_price: null, // Maximum price in dollars and cents
      // },
      availability: ['InStock', 'LimitedAvailability', 'PreOrder'], // Only show available products
      // website_ids: null, // Array of website IDs to filter by
      // category_ids: null, // Array of category IDs to filter by
      // exclude_product_ids: null, // Array of product IDs to exclude
    },
  },
  // Theme colors, light vs dark matches the user's system preference
  theme: {
    light: {
      background: '#f0f9ff',
      foreground: '#0c4a6e',
      card: '#ffffff',
      cardForeground: '#0c4a6e',
      primary: '#0284c7',
      primaryForeground: '#f0f9ff',
      secondary: '#e0f2fe',
      secondaryForeground: '#075985',
      accent: '#bae6fd',
      accentForeground: '#075985',
      muted: '#f1f5f9',
      mutedForeground: '#64748b',
      border: '#bae6fd',
      input: '#e0f2fe',
      inputBackground: '#ffffff',
      ring: '#0ea5e9',
      header: '#ffffff',
      headerForeground: '#0c4a6e',
      headerBorder: '#bae6fd',
    },
    dark: {
      background: '#020617',
      foreground: '#e0f2fe',
      card: '#0f172a',
      cardForeground: '#e0f2fe',
      primary: '#38bdf8',
      primaryForeground: '#020617',
      secondary: '#1e293b',
      secondaryForeground: '#e0f2fe',
      accent: '#334155',
      accentForeground: '#bae6fd',
      muted: '#1e293b',
      mutedForeground: '#94a3b8',
      border: '#334155',
      input: '#1e293b',
      inputBackground: '#0f172a',
      ring: '#38bdf8',
      header: '#0f172a',
      headerForeground: '#e0f2fe',
      headerBorder: '#334155',
    },
  },
} as const;

export type AppConfig = typeof appConfig;

