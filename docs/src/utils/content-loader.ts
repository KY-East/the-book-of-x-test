import { Content } from '../types/content';

interface ContentCache {
  [key: string]: {
    [language: string]: Content;
  };
}

// Content cache
const contentCache: ContentCache = {};

/**
 * Load content by ID and language
 * @param contentId Content ID
 * @param language Language code
 * @returns Content object
 */
export const loadContent = async (contentId: string, language: string = 'zh'): Promise<Content> => {
  // Check cache
  if (contentCache[contentId]?.[language]) {
    console.log(`[ContentLoader] Loading from cache: ${contentId}, language: ${language}`);
    return contentCache[contentId][language];
  }

  try {
    console.log(`[ContentLoader] Loading from file: ${contentId}, language: ${language}`);
    // Load content from JSON file
    const url = `/src/content/${language}/${contentId}.json`;
    console.log(`[ContentLoader] Request URL: ${url}`);
    
    const response = await fetch(url);
    if (!response.ok) {
      console.error(`[ContentLoader] Request failed: ${response.status} ${response.statusText}`);
      throw new Error(`Failed to load content: ${contentId}, language: ${language}, status: ${response.status}`);
    }

    const content: Content = await response.json();
    console.log(`[ContentLoader] Content loaded successfully: ${contentId}, title: ${content.title[language as keyof typeof content.title]}`);
    
    // Cache content
    if (!contentCache[contentId]) {
      contentCache[contentId] = {};
    }
    contentCache[contentId][language] = content;
    
    return content;
  } catch (error) {
    console.error('[ContentLoader] Failed to load content:', error);
    throw error;
  }
};

/**
 * Get all available content IDs
 * @param language Language code
 * @returns List of content IDs
 */
export const getAvailableContentIds = async (language: string = 'zh'): Promise<string[]> => {
  try {
    // This needs to be implemented with an API or static file to get all available content IDs
    // This is just an example, actual implementation may need to be adjusted based on your backend API or file structure
    const response = await fetch(`/src/content/${language}/index.json`);
    if (!response.ok) {
      throw new Error(`Failed to load content index, language: ${language}`);
    }

    const index = await response.json();
    return index.contentIds || [];
  } catch (error) {
    console.error('Failed to load content index:', error);
    // If unable to load index, return empty array
    return [];
  }
};

/**
 * Get supported languages
 * @returns List of language codes
 */
export const getSupportedLanguages = (): string[] => {
  return ['zh', 'en', 'ko', 'ja'];
};

/**
 * Get language name
 * @param language Language code
 * @returns Language name
 */
export const getLanguageName = (language: string): string => {
  const languageNames: { [key: string]: string } = {
    zh: '中文',
    en: 'English',
    ko: '한국어',
    ja: '日本語'
  };
  
  return languageNames[language] || language;
}; 