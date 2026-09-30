export interface EnquiryInput {
  fullName: string;
  phoneNumber: string;
  email?: string;
  city: string;
  productId?: string;
  productName?: string;
  preferredContact?: string;
  enquiryType?: string;
  message?: string;
}

export interface StoredEnquiry extends EnquiryInput {
  id: string;
  referenceId: string;
  status: string;
  createdAt: string;
}
