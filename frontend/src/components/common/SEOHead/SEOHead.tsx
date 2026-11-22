import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export interface SEOHeadProps {
  title: string;
  description: string;
  canonicalPath?: string;
  ogType?: 'website' | 'article' | 'product';
  ogImage?: string;
  noindex?: boolean;
  structuredData?: Record<string, any> | Array<Record<string, any>>;
}

const PRIMARY_ORIGIN = 'https://huntingprojector.in';
const DEFAULT_OG_IMAGE = 'https://huntingprojector.in/assets/hunting-projectors-og.png';

/**
 * Lightweight, zero-dependency SEO manager for React 19 & React Router.
 * Dynamically synchronizes document title, meta description, canonical link,
 * OpenGraph, Twitter card, robots, and JSON-LD structured data on route changes.
 *
 * Rules:
 * - Always canonicalizes to https://huntingprojector.in + canonicalPath.
 * - Enforces noindex on Vercel preview environments (*.vercel.app).
 * - Avoids duplicate tags by managing a single dedicated element for each property.
 */
export const SEOHead: React.FC<SEOHeadProps> = ({
  title,
  description,
  canonicalPath,
  ogType = 'website',
  ogImage = DEFAULT_OG_IMAGE,
  noindex = false,
  structuredData
}) => {
  const location = useLocation();

  useEffect(() => {
    // 1. Update Document Title
    document.title = title;

    // Helper to get or create a <meta> element by name or property
    const setMetaTag = (attribute: 'name' | 'property', attrValue: string, content: string) => {
      let element = document.head.querySelector(`meta[${attribute}="${attrValue}"]`) as HTMLMetaElement | null;
      if (!element) {
        element = document.createElement('meta');
        element.setAttribute(attribute, attrValue);
        document.head.appendChild(element);
      }
      element.setAttribute('content', content);
    };

    // Helper to set or create <link rel="..."> element
    const setLinkTag = (rel: string, href: string) => {
      let element = document.head.querySelector(`link[rel="${rel}"]`) as HTMLLinkElement | null;
      if (!element) {
        element = document.createElement('link');
        element.setAttribute('rel', rel);
        document.head.appendChild(element);
      }
      element.setAttribute('href', href);
    };

    // 2. Set Meta Description
    setMetaTag('name', 'description', description);

    // 3. Compute Canonical URL strictly on PRIMARY_ORIGIN + canonicalPath (or pathname)
    // Strip query parameters to avoid duplicate content on filtered views
    const cleanPath = (canonicalPath !== undefined ? canonicalPath : location.pathname).split('?')[0];
    const normalizedPath = cleanPath.startsWith('/') ? cleanPath : `/${cleanPath}`;
    const canonicalUrl = `${PRIMARY_ORIGIN}${normalizedPath === '/' ? '' : normalizedPath}`;
    setLinkTag('canonical', canonicalUrl);

    // 4. Multi-domain and Preview Robots Handling
    // Detect whether running on Vercel preview deployment
    const isVercelPreview = typeof window !== 'undefined' &&
      window.location.hostname.endsWith('.vercel.app');

    const shouldNoindex = noindex || isVercelPreview;
    setMetaTag('name', 'robots', shouldNoindex ? 'noindex, nofollow' : 'index, follow');

    // 5. OpenGraph Tags
    setMetaTag('property', 'og:title', title);
    setMetaTag('property', 'og:description', description);
    setMetaTag('property', 'og:url', canonicalUrl);
    setMetaTag('property', 'og:type', ogType);
    setMetaTag('property', 'og:image', ogImage);
    setMetaTag('property', 'og:site_name', 'Hunting Projector');

    // 6. Twitter Card Tags
    setMetaTag('name', 'twitter:card', 'summary_large_image');
    setMetaTag('name', 'twitter:title', title);
    setMetaTag('name', 'twitter:description', description);
    setMetaTag('name', 'twitter:image', ogImage);

    // 7. Structured Data (JSON-LD)
    const scriptId = 'hunting-seo-structured-data';
    let scriptElement = document.getElementById(scriptId) as HTMLScriptElement | null;

    if (structuredData && !shouldNoindex) {
      if (!scriptElement) {
        scriptElement = document.createElement('script');
        scriptElement.id = scriptId;
        scriptElement.type = 'application/ld+json';
        document.head.appendChild(scriptElement);
      }
      scriptElement.textContent = JSON.stringify(structuredData);
    } else if (scriptElement) {
      // Remove stale JSON-LD if not provided on this page or if noindexed
      scriptElement.remove();
    }

    return () => {
      // Cleanup structured data when unmounting to prevent pollution across pages
      const el = document.getElementById(scriptId);
      if (el) el.remove();
    };
  }, [title, description, canonicalPath, ogType, ogImage, noindex, structuredData, location.pathname]);

  return null;
};
