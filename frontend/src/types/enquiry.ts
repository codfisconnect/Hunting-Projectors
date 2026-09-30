export interface EnquiryFormData {
  fullName: string;
  phoneNumber: string;
  email: string;
  city: string;
  productId?: string;
  productName?: string;
  preferredContact: 'whatsapp' | 'phone' | 'email';
  message: string;
  enquiryType: 'product-demo' | 'price-quote' | 'bulk-order' | 'dealership' | 'technical-support';
}

export interface EnquirySubmissionResult {
  success: boolean;
  message: string;
  referenceId?: string;
  timestamp: string;
}
