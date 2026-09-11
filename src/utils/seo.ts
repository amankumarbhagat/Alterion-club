import { useEffect } from 'react';

interface SEOProps {
  title?: string;
  description?: string;
  noindex?: boolean;
}

const DEFAULT_TITLE = 'ALTERINO | BMSIT&M — Engineering Innovation & Development Club';
const DEFAULT_DESC =
  'Official website of ALTERINO, the premier Engineering Innovation & Development club at BMSIT&M. Curating Ideas. Building Impact. App Development & R&D.';

export function useSEO({ title, description, noindex = false }: SEOProps) {
  useEffect(() => {
    // 1. Document Title
    const formattedTitle = title ? `${title} | ALTERINO Club` : DEFAULT_TITLE;
    document.title = formattedTitle;

    // Helper to safely set or create meta content
    const setMetaTag = (attribute: string, key: string, content: string) => {
      let element = document.querySelector(`meta[${attribute}="${key}"]`) as HTMLMetaElement | null;
      if (!element) {
        element = document.createElement('meta');
        element.setAttribute(attribute, key);
        document.head.appendChild(element);
      }
      element.content = content;
    };

    // 2. Meta Descriptions & Social Sharing
    const descContent = description || DEFAULT_DESC;
    setMetaTag('name', 'description', descContent);
    setMetaTag('property', 'og:title', formattedTitle);
    setMetaTag('property', 'og:description', descContent);
    setMetaTag('name', 'twitter:title', formattedTitle);
    setMetaTag('name', 'twitter:description', descContent);

    // 3. Robots indexing
    const robotsContent = noindex ? 'noindex, nofollow' : 'index, follow';
    setMetaTag('name', 'robots', robotsContent);

    return () => {
      // Revert on unmount
      document.title = DEFAULT_TITLE;
      setMetaTag('name', 'robots', 'index, follow');
    };
  }, [title, description, noindex]);
}
