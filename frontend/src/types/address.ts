export interface Address {
  id: string;
  userId: string;
  fullName: string;
  phoneNumber: string;
  addressLine1: string;
  addressLine2?: string | null;
  landmark?: string | null;
  city: string;
  state: string;
  pincode: string;
  country: string;
  addressType: 'HOME' | 'WORK' | 'OTHER' | string;
  isDefault: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface AddressInput {
  fullName: string;
  phoneNumber: string;
  addressLine1: string;
  addressLine2?: string;
  landmark?: string;
  city: string;
  state: string;
  pincode: string;
  country?: string;
  addressType?: 'HOME' | 'WORK' | 'OTHER' | string;
  isDefault?: boolean;
}
