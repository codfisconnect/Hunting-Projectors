import nodemailer, { Transporter } from 'nodemailer';
import dotenv from 'dotenv';
import { BUSINESS_CONFIG } from '../config/businessConfig.js';

export interface EmailOptions {
  to: string;
  subject: string;
  html: string;
  text?: string;
}

const clean = (val?: string | null): string => {
  if (!val) return '';
  return val.trim().replace(/^["']|["']$/g, '');
};

export class EmailService {
  private transporter: Transporter | null = null;
  private isConfigured = false;
  private senderEmail: string;
  private adminEmail: string;

  constructor() {
    this.senderEmail = clean(process.env.SMTP_FROM) || clean(process.env.EMAIL_FROM) || BUSINESS_CONFIG.email;
    this.adminEmail = clean(process.env.ADMIN_NOTIFICATION_EMAIL) || clean(process.env.ADMIN_EMAIL) || BUSINESS_CONFIG.adminEmail;
    this.initTransporter();
  }

  private initTransporter() {
    // If not configured, try loading from .env if running standalone
    if (!process.env.SMTP_HOST) {
      try {
        dotenv.config();
      } catch {}
    }

    const host = clean(process.env.SMTP_HOST);
    const port = parseInt(clean(process.env.SMTP_PORT) || '587', 10);
    const secureEnv = clean(process.env.SMTP_SECURE);
    const isSecure = secureEnv === 'true' || port === 465;
    const user = clean(process.env.SMTP_USER);
    const pass = clean(process.env.SMTP_PASS);

    if (host && user && pass) {
      this.transporter = nodemailer.createTransport({
        host,
        port,
        secure: isSecure, // false for 587 (uses STARTTLS)
        auth: { user, pass },
        tls: {
          rejectUnauthorized: true
        }
      });
      this.isConfigured = true;
    } else {
      this.isConfigured = false;
      this.transporter = null;
    }
  }

  public getStatus() {
    const host = clean(process.env.SMTP_HOST);
    const port = clean(process.env.SMTP_PORT) || '587';
    const user = clean(process.env.SMTP_USER);

    return {
      configured: this.isConfigured,
      host: host || 'Not configured',
      port,
      secure: clean(process.env.SMTP_SECURE) === 'true' || port === '465',
      user: user ? `${user.substring(0, 3)}***@${user.split('@')[1] || ''}` : 'Not configured',
      sender: this.senderEmail,
      adminNotificationEmail: this.adminEmail,
      officialBusinessEmail: BUSINESS_CONFIG.email
    };
  }

  public async verifyConnection(): Promise<{ success: boolean; error?: string }> {
    if (!this.isConfigured || !this.transporter) {
      return {
        success: false,
        error: 'SMTP provider not configured. Please supply SMTP_HOST, SMTP_USER, and SMTP_PASS in backend environment.'
      };
    }

    try {
      await this.transporter.verify();
      return { success: true };
    } catch (err: any) {
      console.error('[EmailService Verification Error]:', err.message);
      return { success: false, error: err.message };
    }
  }

  public async sendEmail(options: EmailOptions): Promise<{ success: boolean; messageId?: string; error?: string }> {
    if (!this.isConfigured || !this.transporter) {
      console.log(`[Email Mock/Unconfigured] To: ${options.to} | Subject: ${options.subject}`);
      return {
        success: false,
        error: 'SMTP provider not configured. Please supply SMTP_HOST, SMTP_USER, and SMTP_PASS in backend environment.'
      };
    }

    try {
      const info = await this.transporter.sendMail({
        from: this.senderEmail.includes('<') ? this.senderEmail : `"${BUSINESS_CONFIG.brandName}" <${this.senderEmail}>`,
        to: options.to,
        subject: options.subject,
        html: options.html,
        text: options.text || options.html.replace(/<[^>]*>/g, '')
      });

      return { success: true, messageId: info.messageId };
    } catch (error: any) {
      console.error('[EmailService Error]:', error.message);
      return { success: false, error: error.message };
    }
  }

  // Template: Customer Enquiry / Contact Form Confirmation
  public async sendEnquiryConfirmation(enquiry: any): Promise<{ success: boolean; error?: string }> {
    const isDemo = enquiry.enquiryType === 'product-demo';
    const title = isDemo ? 'Projector Demonstration Request Received' : 'Enquiry Confirmation';

    const html = `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; background: #0A0C10; color: #FFFFFF; padding: 32px; border-radius: 8px;">
        <div style="text-align: center; margin-bottom: 24px;">
          <h2 style="color: #D4AF37; margin: 0; font-size: 24px; letter-spacing: 2px;">${BUSINESS_CONFIG.brandName.toUpperCase()}</h2>
          <p style="color: #8E95A5; font-size: 13px; margin-top: 4px;">Cinematic Optical Engineering</p>
        </div>
        <div style="background: #141721; padding: 24px; border-radius: 6px; border: 1px solid #222736; margin-bottom: 20px;">
          <h3 style="color: #FFFFFF; margin-top: 0;">${title} (${enquiry.referenceId})</h3>
          <p style="color: #A0AEC0; font-size: 14px;">Hello ${enquiry.fullName},</p>
          <p style="color: #A0AEC0; font-size: 14px;">
            Thank you for reaching out to ${BUSINESS_CONFIG.brandName}. Your request has been assigned to our Chennai optical specialists.
          </p>
          <div style="border-top: 1px solid #222736; margin: 16px 0; padding-top: 16px;">
            <p style="margin: 4px 0; font-size: 14px;"><strong>Reference ID:</strong> ${enquiry.referenceId}</p>
            ${enquiry.productName ? `<p style="margin: 4px 0; font-size: 14px;"><strong>Model of Interest:</strong> ${enquiry.productName}</p>` : ''}
            <p style="margin: 4px 0; font-size: 14px;"><strong>City:</strong> ${enquiry.city}</p>
            <p style="margin: 4px 0; font-size: 14px;"><strong>Preferred Contact:</strong> ${enquiry.preferredContact.toUpperCase()}</p>
            ${enquiry.message ? `<p style="margin: 4px 0; font-size: 14px;"><strong>Your Note:</strong> ${enquiry.message}</p>` : ''}
          </div>
          <p style="color: #A0AEC0; font-size: 13px; margin-top: 16px;">
            Our specialist will connect with you via ${enquiry.preferredContact === 'phone' ? 'telephone' : 'WhatsApp'} within regular business hours (${BUSINESS_CONFIG.supportHours}).
          </p>
        </div>
        <p style="color: #718096; font-size: 12px; text-align: center;">
          Supplied & operated by ${BUSINESS_CONFIG.companyName}, ${BUSINESS_CONFIG.location}.<br/>
          Direct Phone / WhatsApp: ${BUSINESS_CONFIG.phoneDisplay} | Email: ${BUSINESS_CONFIG.email}
        </p>
      </div>
    `;

    return this.sendEmail({
      to: enquiry.email,
      subject: `${title} — ${enquiry.referenceId} | ${BUSINESS_CONFIG.brandName}`,
      html
    });
  }

  // Template: Admin Notification for New Enquiry / Demo Booking
  public async sendAdminEnquiryNotification(enquiry: any): Promise<{ success: boolean; error?: string }> {
    const isDemo = enquiry.enquiryType === 'product-demo';
    const typeLabel = isDemo ? 'NEW DEMO BOOKING' : 'NEW CUSTOMER ENQUIRY';

    const html = `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; background: #0A0C10; color: #FFFFFF; padding: 32px; border-radius: 8px;">
        <div style="border-bottom: 2px solid #D4AF37; padding-bottom: 12px; margin-bottom: 20px;">
          <h2 style="color: #D4AF37; margin: 0;">${typeLabel}</h2>
          <span style="color: #8E95A5; font-size: 12px;">Admin Notification | ${BUSINESS_CONFIG.brandName}</span>
        </div>
        <div style="background: #141721; padding: 20px; border-radius: 6px; border: 1px solid #222736;">
          <p><strong>Reference:</strong> ${enquiry.referenceId}</p>
          <p><strong>Customer Name:</strong> ${enquiry.fullName}</p>
          <p><strong>Phone:</strong> ${enquiry.phoneNumber}</p>
          <p><strong>Email:</strong> ${enquiry.email || 'Not provided'}</p>
          <p><strong>City:</strong> ${enquiry.city}</p>
          <p><strong>Product:</strong> ${enquiry.productName || 'General Inquiry'}</p>
          <p><strong>Channel:</strong> ${enquiry.preferredContact}</p>
          <p><strong>Message / Notes:</strong> ${enquiry.message || 'None'}</p>
        </div>
        <p style="color: #718096; font-size: 12px; margin-top: 16px;">
          View and manage in Admin Console: <a href="http://localhost:5173/admin" style="color: #D4AF37;">Admin Dashboard</a>
        </p>
      </div>
    `;

    return this.sendEmail({
      to: this.adminEmail,
      subject: `[ADMIN ALERT] ${typeLabel} (${enquiry.referenceId}) - ${enquiry.fullName}`,
      html
    });
  }

  // Template: Order Placed
  public async sendOrderConfirmation(order: any): Promise<{ success: boolean; error?: string }> {
    const html = `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; background: #0A0C10; color: #FFFFFF; padding: 32px; border-radius: 8px;">
        <div style="text-align: center; margin-bottom: 24px;">
          <h2 style="color: #D4AF37; margin: 0; font-size: 24px; letter-spacing: 2px;">${BUSINESS_CONFIG.brandName.toUpperCase()}</h2>
          <p style="color: #8E95A5; font-size: 13px; margin-top: 4px;">Cinematic Optical Engineering</p>
        </div>
        <div style="background: #141721; padding: 24px; border-radius: 6px; border: 1px solid #222736; margin-bottom: 20px;">
          <h3 style="color: #FFFFFF; margin-top: 0;">Order Confirmed: ${order.orderNumber}</h3>
          <p style="color: #A0AEC0; font-size: 14px;">Hello ${order.customerName},</p>
          <p style="color: #A0AEC0; font-size: 14px;">Thank you for choosing ${BUSINESS_CONFIG.brandName}. Your order has been placed successfully and is being prepped for dispatch by ${BUSINESS_CONFIG.companyName}.</p>
          <div style="border-top: 1px solid #222736; margin: 16px 0; padding-top: 16px;">
            <p style="margin: 4px 0; font-size: 14px;"><strong>Order Total:</strong> ₹${Number(order.totalAmount).toLocaleString('en-IN')}</p>
            <p style="margin: 4px 0; font-size: 14px;"><strong>Status:</strong> ${order.orderStatus}</p>
            <p style="margin: 4px 0; font-size: 14px;"><strong>Payment Method:</strong> ${order.paymentMethod}</p>
          </div>
        </div>
        <p style="color: #718096; font-size: 12px; text-align: center;">
          For support or throw-distance assistance, WhatsApp ${BUSINESS_CONFIG.phoneDisplay} or email ${BUSINESS_CONFIG.email}.
        </p>
      </div>
    `;

    return this.sendEmail({
      to: order.customerEmail,
      subject: `Order Confirmed — ${order.orderNumber} | ${BUSINESS_CONFIG.brandName}`,
      html
    });
  }

  // Template: Admin Notification for New Order
  public async sendAdminOrderNotification(order: any): Promise<{ success: boolean; error?: string }> {
    const html = `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; background: #0A0C10; color: #FFFFFF; padding: 32px; border-radius: 8px;">
        <div style="border-bottom: 2px solid #D4AF37; padding-bottom: 12px; margin-bottom: 20px;">
          <h2 style="color: #D4AF37; margin: 0;">NEW CUSTOMER ORDER RECEIVED</h2>
          <span style="color: #8E95A5; font-size: 12px;">Order #${order.orderNumber}</span>
        </div>
        <div style="background: #141721; padding: 20px; border-radius: 6px; border: 1px solid #222736;">
          <p><strong>Customer:</strong> ${order.customerName} (${order.customerEmail})</p>
          <p><strong>Phone:</strong> ${order.customerPhone || 'Not provided'}</p>
          <p><strong>Total Amount:</strong> ₹${Number(order.totalAmount).toLocaleString('en-IN')}</p>
          <p><strong>Payment Status:</strong> ${order.paymentStatus}</p>
          <p><strong>Order Status:</strong> ${order.orderStatus}</p>
        </div>
      </div>
    `;

    return this.sendEmail({
      to: this.adminEmail,
      subject: `[ADMIN ALERT] New Order #${order.orderNumber} - ₹${Number(order.totalAmount).toLocaleString('en-IN')}`,
      html
    });
  }

  // Template: Order Status Changed
  public async sendOrderStatusUpdate(order: any, newStatus: string, trackingInfo?: { carrier?: string; trackingNumber?: string }): Promise<{ success: boolean; error?: string }> {
    const trackingHtml = trackingInfo?.trackingNumber ? `
      <div style="margin: 16px 0; padding: 12px; background: #1A1F2E; border-left: 3px solid #D4AF37;">
        <p style="margin: 0; font-size: 13px; color: #D4AF37;"><strong>Tracking Information:</strong></p>
        <p style="margin: 4px 0 0 0; font-size: 13px; color: #FFFFFF;">Carrier: ${trackingInfo.carrier || 'Express Courier'} | Tracking #: ${trackingInfo.trackingNumber}</p>
      </div>
    ` : '';

    const html = `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; background: #0A0C10; color: #FFFFFF; padding: 32px; border-radius: 8px;">
        <div style="text-align: center; margin-bottom: 24px;">
          <h2 style="color: #D4AF37; margin: 0; font-size: 24px; letter-spacing: 2px;">${BUSINESS_CONFIG.brandName.toUpperCase()}</h2>
        </div>
        <div style="background: #141721; padding: 24px; border-radius: 6px; border: 1px solid #222736;">
          <h3 style="color: #FFFFFF; margin-top: 0;">Order Status Updated</h3>
          <p style="color: #A0AEC0; font-size: 14px;">Hello ${order.customerName},</p>
          <p style="color: #A0AEC0; font-size: 14px;">Your order <strong>${order.orderNumber}</strong> has been updated to: <span style="color: #38EF7D; font-weight: bold;">${newStatus}</span>.</p>
          ${trackingHtml}
        </div>
        <p style="color: #718096; font-size: 12px; text-align: center; margin-top: 20px;">
          Questions? Contact us on WhatsApp: ${BUSINESS_CONFIG.phoneDisplay} or email ${BUSINESS_CONFIG.email}
        </p>
      </div>
    `;

    return this.sendEmail({
      to: order.customerEmail,
      subject: `Order Update: ${newStatus} — ${order.orderNumber} | ${BUSINESS_CONFIG.brandName}`,
      html
    });
  }
}

export const emailService = new EmailService();
