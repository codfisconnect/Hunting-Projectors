import { BUSINESS_CONFIG } from '../config/businessConfig';

export interface SiteConfig {
  brand: {
    name: string;
    subname: string;
    tagline: string;
    heroHeadline: string;
    heroSubheadline: string;
  };
  entity: {
    owner: string;
    relation: string;
    city: string;
    state: string;
    country: string;
    locationLabel: string;
    panIndiaCoverage: string;
  };
  contact: {
    phone: string;
    phoneDisplay: string;
    whatsapp: string;
    whatsappDisplay: string;
    whatsappDefaultMessage: string;
    email: string;
    salesEmail: string;
    address: {
      line1: string;
      line2: string;
      city: string;
      state: string;
      pincode: string;
      country: string;
    };
    supportHours: string;
  };
  announcement: {
    enabled: boolean;
    text: string;
    tag: string;
  };
}

export const siteConfig: SiteConfig = {
  brand: {
    name: 'Hunting Projector',
    subname: 'by Nap Computers Electronicss',
    tagline: BUSINESS_CONFIG.tagline,
    heroHeadline: 'SEE BEYOND.',
    heroSubheadline: 'Premium projection technology designed to transform everyday spaces into extraordinary viewing experiences.',
  },
  entity: {
    owner: BUSINESS_CONFIG.companyName,
    relation: `Supplied / Owned / Operated by ${BUSINESS_CONFIG.companyName}`,
    city: BUSINESS_CONFIG.address.city,
    state: BUSINESS_CONFIG.address.state,
    country: BUSINESS_CONFIG.address.country,
    locationLabel: BUSINESS_CONFIG.location,
    panIndiaCoverage: BUSINESS_CONFIG.panIndiaCoverage,
  },
  contact: {
    phone: BUSINESS_CONFIG.phoneRaw,
    phoneDisplay: BUSINESS_CONFIG.phoneDisplay,
    whatsapp: BUSINESS_CONFIG.whatsappRaw,
    whatsappDisplay: BUSINESS_CONFIG.whatsappDisplay,
    whatsappDefaultMessage: 'Hello Hunting Projector, I would like to know more about your projector products and services.',
    email: BUSINESS_CONFIG.email,
    salesEmail: BUSINESS_CONFIG.email,
    address: {
      line1: BUSINESS_CONFIG.address.line1,
      line2: BUSINESS_CONFIG.address.line2,
      city: BUSINESS_CONFIG.address.city,
      state: BUSINESS_CONFIG.address.state,
      pincode: BUSINESS_CONFIG.address.pincode,
      country: BUSINESS_CONFIG.address.country,
    },
    supportHours: BUSINESS_CONFIG.supportHours,
  },
  announcement: {
    enabled: false,
    text: '',
    tag: '',
  },
};

/**
 * Standardized WhatsApp click-to-chat links
 * Number: +918825624537
 */
export const getWhatsAppLink = (customMessage?: string, productName?: string) => {
  const base = `https://wa.me/${BUSINESS_CONFIG.whatsappRaw}`;
  let text = customMessage;
  if (!text) {
    if (productName) {
      text = `Hello Hunting Projector, I am interested in ${productName}. Please share more details, availability and pricing.`;
    } else {
      text = 'Hello Hunting Projector, I would like to know more about your projector products and services.';
    }
  }
  return `${base}?text=${encodeURIComponent(text)}`;
};

/**
 * Demo booking WhatsApp link
 */
export const getWhatsAppDemoLink = (productName?: string) => {
  const base = `https://wa.me/${BUSINESS_CONFIG.whatsappRaw}`;
  const text = productName
    ? `Hello Hunting Projector, I would like to schedule a demonstration for ${productName}. Please contact me to arrange a suitable time.`
    : 'Hello Hunting Projector, I would like to schedule a projector demonstration. Please contact me to arrange a suitable time.';
  return `${base}?text=${encodeURIComponent(text)}`;
};

export const getPhoneLink = () => `tel:${BUSINESS_CONFIG.phoneRaw}`;
export const getEmailLink = (subject = 'Enquiry: Hunting Projector by Nap Computers Electronicss') =>
  `mailto:${BUSINESS_CONFIG.email}?subject=${encodeURIComponent(subject)}`;
