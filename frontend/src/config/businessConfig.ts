/**
 * Centralized Business Contact & Identity Configuration
 * NAP Computers & Electronics / Hunting Projectors
 */
export const BUSINESS_CONFIG = {
  brandName: 'Hunting Projectors',
  companyName: 'NAP Computers Electronics',
  brandAttribution: 'Hunting Projectors by NAP Computers Electronics',
  shortBrand: 'Hunting Projectors',
  subname: 'Electronics',
  tagline: 'See Beyond. Light Changes Everything.',
  phone: '+91 88256 24537',
  phoneRaw: '+918825624537',
  phoneDisplay: '+91 88256 24537',
  whatsappNumber: '+918825624537',
  whatsappRaw: '918825624537',
  whatsappDisplay: '+91 88256 24537',
  email: 'huntingprojectors@gmail.com',
  adminEmail: 'huntingprojectors@gmail.com',
  location: 'Chennai, Tamil Nadu, India',
  address: {
    line1: 'NAP Computers Electronics',
    line2: 'Mount Road / Electronics District',
    city: 'Chennai',
    state: 'Tamil Nadu',
    pincode: '600002',
    country: 'India'
  },
  supportHours: 'Monday – Saturday: 10:00 AM – 7:30 PM IST',
  panIndiaCoverage: 'Direct brand supply and doorstep delivery across all Indian pin codes',
  ownershipStatement: 'Hunting Projectors is the customer-facing projector brand. All orders, warranties, and after-sales support are fulfilled directly by NAP Computers Electronics.'
} as const;

export type BusinessConfig = typeof BUSINESS_CONFIG;
