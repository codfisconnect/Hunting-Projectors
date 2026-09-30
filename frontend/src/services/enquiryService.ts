import { fetchJson } from './api';
import { EnquiryFormData, EnquirySubmissionResult } from '../types/enquiry';

export async function submitEnquiry(enquiry: EnquiryFormData): Promise<EnquirySubmissionResult> {
  const timestamp = new Date().toISOString();
  const mockRefId = `HP-${Math.floor(100000 + Math.random() * 900000)}`;

  try {
    const response = await fetchJson<{ success: boolean; message: string; referenceId?: string }>('/enquiries', {
      method: 'POST',
      body: JSON.stringify(enquiry),
    });

    return {
      success: true,
      message: response.message || 'Your enquiry has been received. Our Hunting specialist will reach out shortly.',
      referenceId: response.referenceId || mockRefId,
      timestamp,
    };
  } catch {
    // Demo mode: Return friendly structured success state without throwing an artificial error
    return {
      success: true,
      message: 'Demo Enquiry Received: Thank you! In this client demo, our specialists will assist you directly via WhatsApp or phone call.',
      referenceId: mockRefId,
      timestamp,
    };
  }
}
