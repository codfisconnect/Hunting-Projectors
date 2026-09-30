import { Request, Response, NextFunction } from 'express';
import { enquiryService } from '../services/enquiryService.js';
import { sendSuccess, sendError } from '../utils/response.js';

export async function createEnquiry(req: Request, res: Response, next: NextFunction) {
  try {
    const { fullName, phoneNumber, email, city, productId, productName, preferredContact, enquiryType, message } = req.body;

    if (!fullName || !phoneNumber || !city) {
      return sendError(res, 'Full name, phone number, and city are required fields', 400);
    }

    const enquiry = await enquiryService.createEnquiry({
      fullName,
      phoneNumber,
      email,
      city,
      productId,
      productName,
      preferredContact: preferredContact || 'whatsapp',
      enquiryType: enquiryType || 'product-demo',
      message,
    });

    return sendSuccess(res, enquiry, 'Enquiry registered successfully', 201);
  } catch (error) {
    next(error);
  }
}
