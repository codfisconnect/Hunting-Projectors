export interface WhatsAppMessagePayload {
  toPhone: string;
  templateName?: string;
  parameters?: Record<string, string>;
  textFallback: string;
}

export class WhatsAppService {
  private isConfigured = false;
  private phoneNumberId: string | null = null;
  private accessToken: string | null = null;
  private businessNumber: string;

  constructor() {
    this.phoneNumberId = process.env.WHATSAPP_PHONE_NUMBER_ID || null;
    this.accessToken = process.env.WHATSAPP_ACCESS_TOKEN || null;
    this.businessNumber = process.env.WHATSAPP_BUSINESS_NUMBER || '+919444012345';
    this.isConfigured = !!(this.phoneNumberId && this.accessToken);
  }

  public getStatus() {
    return {
      configured: this.isConfigured,
      phoneNumberId: this.phoneNumberId ? `${this.phoneNumberId.slice(0, 4)}...` : 'Not configured',
      businessNumber: this.businessNumber,
      provider: 'Meta WhatsApp Cloud API'
    };
  }

  public async sendMessage(payload: WhatsAppMessagePayload): Promise<{ success: boolean; messageId?: string; error?: string }> {
    if (!this.isConfigured || !this.phoneNumberId || !this.accessToken) {
      console.log(`[WhatsApp Unconfigured] To: ${payload.toPhone} | Message: ${payload.textFallback}`);
      return {
        success: false,
        error: 'WhatsApp Business API not configured. Please supply WHATSAPP_PHONE_NUMBER_ID and WHATSAPP_ACCESS_TOKEN.'
      };
    }

    try {
      // Normalize recipient phone to E.164 without symbols
      const cleanPhone = payload.toPhone.replace(/[^0-9]/g, '');

      const response = await fetch(`https://graph.facebook.com/v19.0/${this.phoneNumberId}/messages`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.accessToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          messaging_product: 'whatsapp',
          recipient_type: 'individual',
          to: cleanPhone,
          type: 'text',
          text: { preview_url: false, body: payload.textFallback }
        })
      });

      const data = await response.json() as any;

      if (!response.ok) {
        return {
          success: false,
          error: data.error?.message || `WhatsApp API error: ${response.status}`
        };
      }

      return {
        success: true,
        messageId: data.messages?.[0]?.id
      };
    } catch (err: any) {
      return { success: false, error: err.message };
    }
  }

  public generateManualLink(phone: string, message: string): string {
    const cleanPhone = phone.replace(/[^0-9]/g, '');
    const encoded = encodeURIComponent(message);
    return `https://wa.me/${cleanPhone}?text=${encoded}`;
  }
}

export const whatsappService = new WhatsAppService();
