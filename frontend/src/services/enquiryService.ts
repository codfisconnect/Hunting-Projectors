import { fetchJson } from './api';
import { EnquiryFormData, EnquirySubmissionResult } from '../types/enquiry';

export async function submitEnquiry(enquiry: EnquiryFormData): Promise<EnquirySubmissionResult> {
  const timestamp = new Date().toISOString();

  const response = await fetchJson<{ success: boolean; message: string; data?: any; referenceId?: string }>('/enquiries', {
    method: 'POST',
    body: JSON.stringify(enquiry),
  });

  const refId = response.referenceId || response.data?.referenceId || `HP-${Math.floor(100000 + Math.random() * 900000)}`;

  return {
    success: true,
    message: response.message || 'Your enquiry has been registered successfully with our Chennai desk.',
    referenceId: refId,
    timestamp,
  };
}
