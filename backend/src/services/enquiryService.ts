import { EnquiryInput, StoredEnquiry } from '../types/enquiry.js';
import { prisma } from '../config/database.js';
import { emailService } from './emailService.js';
import { notificationService } from './notificationService.js';

export class EnquiryService {
  async createEnquiry(input: EnquiryInput): Promise<StoredEnquiry> {
    const referenceId = `HP-${Math.floor(100000 + Math.random() * 900000)}`;

    try {
      const enquiry = await prisma.enquiry.create({
        data: {
          referenceId,
          fullName: input.fullName,
          phoneNumber: input.phoneNumber,
          email: input.email || null,
          city: input.city,
          productId: input.productId || null,
          productName: input.productName || null,
          preferredContact: input.preferredContact || 'whatsapp',
          enquiryType: input.enquiryType || 'product-demo',
          message: input.message || null,
          status: 'NEW',
        },
      });

      console.log(`[EnquiryService] New demo enquiry saved to DB: ${referenceId} from ${input.fullName} (${input.city})`);

      // 1. Create in-app admin notification
      notificationService.createNotification({
        type: 'NEW_ENQUIRY',
        title: `New Enquiry (${enquiry.enquiryType}): ${enquiry.fullName}`,
        message: `${enquiry.fullName} from ${enquiry.city} enquired for ${enquiry.productName || 'General'} via ${enquiry.preferredContact}.`,
        linkUrl: `/admin/enquiries?search=${encodeURIComponent(enquiry.referenceId)}`
      }).catch(e => console.warn('[Enquiry Notification Warning]:', e.message));

      // 2. Dispatch Customer Confirmation Email (if email provided)
      if (enquiry.email) {
        emailService.sendEnquiryConfirmation({
          referenceId: enquiry.referenceId,
          fullName: enquiry.fullName,
          email: enquiry.email,
          city: enquiry.city,
          productName: enquiry.productName,
          preferredContact: enquiry.preferredContact,
          enquiryType: enquiry.enquiryType,
          message: enquiry.message
        }).catch(e => console.warn('[Customer Enquiry Email Warning]:', e.message));
      }

      // 3. Dispatch Admin Alert Email
      emailService.sendAdminEnquiryNotification({
        referenceId: enquiry.referenceId,
        fullName: enquiry.fullName,
        phoneNumber: enquiry.phoneNumber,
        email: enquiry.email,
        city: enquiry.city,
        productName: enquiry.productName,
        preferredContact: enquiry.preferredContact,
        enquiryType: enquiry.enquiryType,
        message: enquiry.message
      }).catch(e => console.warn('[Admin Enquiry Email Warning]:', e.message));

      return {
        id: enquiry.id,
        referenceId: enquiry.referenceId,
        fullName: enquiry.fullName,
        phoneNumber: enquiry.phoneNumber,
        email: enquiry.email || undefined,
        city: enquiry.city,
        productId: enquiry.productId || undefined,
        productName: enquiry.productName || undefined,
        preferredContact: enquiry.preferredContact,
        enquiryType: enquiry.enquiryType,
        message: enquiry.message || undefined,
        status: enquiry.status,
        createdAt: enquiry.createdAt.toISOString(),
      };
    } catch (err: any) {
      console.warn(`[EnquiryService] Database persist fallback to in-memory:`, err.message);
      const stored: StoredEnquiry = {
        id: `enq_${Date.now()}`,
        referenceId,
        ...input,
        status: 'NEW',
        createdAt: new Date().toISOString(),
      };
      return stored;
    }
  }
}

export const enquiryService = new EnquiryService();
