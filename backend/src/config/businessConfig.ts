/**
 * Centralized Business Contact & Identity Configuration
 * NAP Computers & Electronics / Hunting Projector
 */
export const BUSINESS_CONFIG = {
  brandName: 'Hunting Projector',
  companyName: 'Nap Computers Electronicss',
  brandAttribution: 'Hunting Projector by Nap Computers Electronicss',
  shortBrand: 'Hunting Projector',
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
    line1: 'Nap Computers Electronicss',
    line2: 'Mount Road / Electronics District',
    city: 'Chennai',
    state: 'Tamil Nadu',
    pincode: '600002',
    country: 'India'
  },
  supportHours: 'Monday – Saturday: 10:00 AM – 7:30 PM IST',
  panIndiaCoverage: 'Direct brand supply and doorstep delivery across all Indian pin codes',
  ownershipStatement: 'Hunting Projector is the customer-facing projector brand. All orders, warranties, and after-sales support are fulfilled directly by Nap Computers Electronicss.'
} as const;

export type BusinessConfig = typeof BUSINESS_CONFIG;
