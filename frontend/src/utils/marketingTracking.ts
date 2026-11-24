/**
 * Marketing Tracking & UTM Utility
 * Supports Google Analytics 4, Google Ads, Meta Pixel, and persistent UTM parameters.
 */

export interface UtmParams {
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  utm_term?: string;
  utm_content?: string;
  gclid?: string;
  fbclid?: string;
}

const STORAGE_KEY = 'hunting_marketing_attribution';

/**
 * Captures UTM parameters from current URL and persists in session/local storage
 */
export function captureMarketingAttribution(): UtmParams {
  if (typeof window === 'undefined') return {};

  try {
    const searchParams = new URLSearchParams(window.location.search);
    const captured: UtmParams = {};

    const keys: (keyof UtmParams)[] = [
      'utm_source',
      'utm_medium',
      'utm_campaign',
      'utm_term',
      'utm_content',
      'gclid',
      'fbclid'
    ];

    let hasParam = false;
    keys.forEach(key => {
      const val = searchParams.get(key);
      if (val) {
        captured[key] = val;
        hasParam = true;
      }
    });

    if (hasParam) {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(captured));
      localStorage.setItem(STORAGE_KEY, JSON.stringify(captured));
      return captured;
    }

    // Fallback to stored attribution
    const stored = sessionStorage.getItem(STORAGE_KEY) || localStorage.getItem(STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (err) {
    console.debug('Attribution capture skipped:', err);
  }

  return {};
}

/**
 * Appends current or stored UTM parameters to a destination URL
 */
export function appendUtmParams(url: string): string {
  try {
    const attribution = captureMarketingAttribution();
    const keys = Object.keys(attribution) as (keyof UtmParams)[];
    if (keys.length === 0) return url;

    const [baseUrl, queryStr] = url.split('?');
    const params = new URLSearchParams(queryStr || '');

    keys.forEach(key => {
      if (attribution[key] && !params.has(key)) {
        params.set(key, attribution[key]!);
      }
    });

    const finalQuery = params.toString();
    return finalQuery ? `${baseUrl}?${finalQuery}` : baseUrl;
  } catch {
    return url;
  }
}

/**
 * Event Tracking Dispatcher
 * Safely forwards events to window.gtag (GA4/Google Ads) and window.fbq (Meta) if initialized.
 */
export function trackMarketingEvent(eventName: string, params: Record<string, any> = {}) {
  if (typeof window === 'undefined') return;

  const attribution = captureMarketingAttribution();
  const enrichedParams = {
    ...params,
    ...attribution,
    timestamp: new Date().toISOString(),
  };

  // Google Analytics / Google Ads
  if (typeof (window as any).gtag === 'function') {
    try {
      (window as any).gtag('event', eventName, enrichedParams);
    } catch (e) {
      console.debug('gtag event failed:', e);
    }
  }

  // Meta Pixel
  if (typeof (window as any).fbq === 'function') {
    try {
      (window as any).fbq('trackCustom', eventName, enrichedParams);
    } catch (e) {
      console.debug('fbq event failed:', e);
    }
  }

  // Dispatch custom DOM event for custom listeners/GTM
  window.dispatchEvent(new CustomEvent('hunting_marketing_event', {
    detail: { eventName, params: enrichedParams }
  }));
}

/**
 * Specific Marketing Conversion Trackers
 */
export const MarketingTracker = {
  trackPageView: (pageName: string) => {
    trackMarketingEvent('page_view', { page_title: pageName, page_location: window.location.href });
  },
  trackEnquirySubmit: (data: { enquiryType: string; productName?: string; referenceId?: string }) => {
    trackMarketingEvent('generate_lead', {
      event_category: 'Enquiry',
      event_label: data.productName || 'General',
      enquiry_type: data.enquiryType,
      reference_id: data.referenceId
    });
  },
  trackWhatsAppClick: (source: string, productName?: string) => {
    trackMarketingEvent('contact', {
      method: 'whatsapp',
      contact_source: source,
      product_name: productName
    });
  },
  trackProductClick: (productName: string, price: number) => {
    trackMarketingEvent('select_item', {
      item_name: productName,
      price: price
    });
  }
};
