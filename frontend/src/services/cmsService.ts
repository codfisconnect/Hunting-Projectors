import { fetchJson } from './api';

export interface CmsHero {
  headline?: string;
  subheadline?: string;
}

export interface CmsAnnouncement {
  text?: string;
}

export interface CmsBanner {
  active?: boolean;
  text?: string;
  link?: string;
}

export interface PublicCmsData {
  cms_hero?: CmsHero;
  cms_announcement?: CmsAnnouncement | string;
  cms_banners?: CmsBanner;
  cms_business_hours?: string;
  cms_social_links?: Record<string, string>;
  cms_seo?: { metaTitle?: string; metaDescription?: string };
  cms_faqs?: Array<{ q: string; a: string }>;
}

export async function getPublicCms(): Promise<PublicCmsData> {
  try {
    const res = await fetchJson<{ success: boolean; data: PublicCmsData }>('/cms');
    return res?.data || {};
  } catch (err) {
    // Malformed or failed CMS requests must never crash the frontend
    console.warn('Failed to load public CMS content, utilizing default fallback:', err);
    return {};
  }
}
