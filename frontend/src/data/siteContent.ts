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
    name: 'HUNTING',
    subname: 'PROJECTORS',
    tagline: 'See Beyond. Light Changes Everything.',
    heroHeadline: 'SEE BEYOND.',
    heroSubheadline: 'Premium projection technology designed to transform everyday spaces into extraordinary viewing experiences.',
  },
  entity: {
    owner: 'NAP Computers & Electronics',
    relation: 'Supplied / Owned / Operated by NAP Computers & Electronics',
    city: 'Chennai',
    state: 'Tamil Nadu',
    country: 'India',
    locationLabel: 'Chennai, Tamil Nadu, India',
    panIndiaCoverage: 'Direct brand supply and doorstep delivery across all Indian pin codes',
  },
  contact: {
    phone: '+919042292929',
    phoneDisplay: '+91 90422 92929',
    whatsapp: '919042292929',
    whatsappDisplay: '+91 90422 92929',
    whatsappDefaultMessage: 'Hello Hunting Projectors team, I am interested in experiencing a Hunting Projector demo and would like more information.',
    email: 'contact@huntingprojectors.in',
    salesEmail: 'sales@huntingprojectors.in',
    address: {
      line1: 'NAP Computers & Electronics',
      line2: 'Mount Road / Electronics District',
      city: 'Chennai',
      state: 'Tamil Nadu',
      pincode: '600002',
      country: 'India',
    },
    supportHours: 'Monday – Saturday: 10:00 AM – 7:30 PM IST',
  },
  announcement: {
    enabled: true,
    text: 'DIRECT HUNTING BRAND SUPPLY • PAN-INDIA DOORSTEP DISPATCH • CHENNAI SHOWROOM DEMO AVAILABLE',
    tag: 'NEW LAUNCH DEMO',
  },
};

export const getWhatsAppLink = (customMessage?: string, productSlug?: string) => {
  const base = `https://wa.me/${siteConfig.contact.whatsapp}`;
  const text = customMessage || (productSlug
    ? `Hello Hunting Projectors! I am interested in learning more about the Hunting Projector (${productSlug}). Could you share live demo pricing and delivery details?`
    : siteConfig.contact.whatsappDefaultMessage);
  return `${base}?text=${encodeURIComponent(text)}`;
};

export const getPhoneLink = () => `tel:${siteConfig.contact.phone}`;
export const getEmailLink = (subject = 'Enquiry: Hunting Projectors') => `mailto:${siteConfig.contact.email}?subject=${encodeURIComponent(subject)}`;
