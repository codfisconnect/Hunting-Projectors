import nodemailer, { Transporter } from 'nodemailer';

export interface EmailOptions {
  to: string;
  subject: string;
  html: string;
  text?: string;
}

export class EmailService {
  private transporter: Transporter | null = null;
  private isConfigured = false;
  private senderEmail: string;

  constructor() {
    this.senderEmail = process.env.SMTP_FROM || 'orders@huntingprojectors.com';
    this.initTransporter();
  }

  private initTransporter() {
    const host = process.env.SMTP_HOST;
    const port = Number(process.env.SMTP_PORT) || 587;
    const user = process.env.SMTP_USER;
    const pass = process.env.SMTP_PASS;

    if (host && user && pass) {
      this.transporter = nodemailer.createTransport({
        host,
        port,
        secure: port === 465,
        auth: { user, pass }
      });
      this.isConfigured = true;
    } else {
      this.isConfigured = false;
      this.transporter = null;
    }
  }

  public getStatus() {
    return {
      configured: this.isConfigured,
      host: process.env.SMTP_HOST || 'Not configured',
      port: process.env.SMTP_PORT || '587',
      sender: this.senderEmail
    };
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
        from: `"Hunting Projectors" <${this.senderEmail}>`,
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

  // Template: Order Placed
  public async sendOrderConfirmation(order: any): Promise<{ success: boolean; error?: string }> {
    const html = `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; background: #0A0C10; color: #FFFFFF; padding: 32px; border-radius: 8px;">
        <div style="text-align: center; margin-bottom: 24px;">
          <h2 style="color: #D4AF37; margin: 0; font-size: 24px; letter-spacing: 2px;">HUNTING PROJECTORS</h2>
          <p style="color: #8E95A5; font-size: 13px; margin-top: 4px;">Cinematic Optical Engineering</p>
        </div>
        <div style="background: #141721; padding: 24px; border-radius: 6px; border: 1px solid #222736; margin-bottom: 20px;">
          <h3 style="color: #FFFFFF; margin-top: 0;">Order Confirmed: ${order.orderNumber}</h3>
          <p style="color: #A0AEC0; font-size: 14px;">Hello ${order.customerName},</p>
          <p style="color: #A0AEC0; font-size: 14px;">Thank you for choosing Hunting Projectors. Your order has been placed successfully and is being prepped for dispatch by NAP Computers & Electronics.</p>
          <div style="border-top: 1px solid #222736; margin: 16px 0; padding-top: 16px;">
            <p style="margin: 4px 0; font-size: 14px;"><strong>Order Total:</strong> ₹${Number(order.totalAmount).toLocaleString('en-IN')}</p>
            <p style="margin: 4px 0; font-size: 14px;"><strong>Status:</strong> ${order.orderStatus}</p>
            <p style="margin: 4px 0; font-size: 14px;"><strong>Payment Method:</strong> ${order.paymentMethod}</p>
          </div>
        </div>
        <p style="color: #718096; font-size: 12px; text-align: center;">
          For support or throw-distance assistance, WhatsApp +91 94440 12345 or reply directly to this email.
        </p>
      </div>
    `;

    return this.sendEmail({
      to: order.customerEmail,
      subject: `Order Confirmed — ${order.orderNumber} | Hunting Projectors`,
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
          <h2 style="color: #D4AF37; margin: 0; font-size: 24px; letter-spacing: 2px;">HUNTING PROJECTORS</h2>
        </div>
        <div style="background: #141721; padding: 24px; border-radius: 6px; border: 1px solid #222736;">
          <h3 style="color: #FFFFFF; margin-top: 0;">Order Status Updated</h3>
          <p style="color: #A0AEC0; font-size: 14px;">Hello ${order.customerName},</p>
          <p style="color: #A0AEC0; font-size: 14px;">Your order <strong>${order.orderNumber}</strong> has been updated to: <span style="color: #38EF7D; font-weight: bold;">${newStatus}</span>.</p>
          ${trackingHtml}
        </div>
      </div>
    `;

    return this.sendEmail({
      to: order.customerEmail,
      subject: `Order Update: ${newStatus} — ${order.orderNumber} | Hunting Projectors`,
      html
    });
  }
}

export const emailService = new EmailService();
