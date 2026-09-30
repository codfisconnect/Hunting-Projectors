import { EnquiryInput, StoredEnquiry } from '../types/enquiry.js';

const mockEnquiries: StoredEnquiry[] = [];

export class EnquiryService {
  async createEnquiry(input: EnquiryInput): Promise<StoredEnquiry> {
    const referenceId = `HP-${Math.floor(100000 + Math.random() * 900000)}`;
    const stored: StoredEnquiry = {
      id: `enq_${Date.now()}`,
      referenceId,
      ...input,
      status: 'NEW',
      createdAt: new Date().toISOString(),
    };

    mockEnquiries.push(stored);
    console.log(`[EnquiryService] New demo enquiry received: ${referenceId} from ${input.fullName} (${input.city})`);
    return stored;
  }
}

export const enquiryService = new EnquiryService();
