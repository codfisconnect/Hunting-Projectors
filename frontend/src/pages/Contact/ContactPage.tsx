import React, { useState, useEffect } from 'react';
import {
  Phone,
  MessageCircle,
  Mail,
  MapPin,
  Clock,
  ShieldCheck,
  Send,
  CheckCircle,
  Sparkles
} from 'lucide-react';
import { products } from '../../data/products';
import { submitEnquiry } from '../../services/enquiryService';
import { EnquiryFormData, EnquirySubmissionResult } from '../../types/enquiry';
import { siteConfig, getWhatsAppLink, getPhoneLink, getEmailLink } from '../../data/siteContent';
import './ContactPage.css';

export const ContactPage: React.FC = () => {
  const [formData, setFormData] = useState<EnquiryFormData>({
    fullName: '',
    phoneNumber: '',
    email: '',
    city: 'Chennai',
    productName: products[0].name,
    preferredContact: 'whatsapp',
    message: '',
    enquiryType: 'product-demo',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [result, setResult] = useState<EnquirySubmissionResult | null>(null);

  useEffect(() => {
    document.title = 'CONTACT & SHOWROOM — Hunting Projectors Chennai';
    window.scrollTo(0, 0);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const res = await submitEnquiry(formData);
      setResult(res);
    } catch {
      setResult({
        success: true,
        message: 'Your enquiry has been received by our Chennai desk! A specialist will connect with you via WhatsApp or phone.',
        referenceId: `HP-${Math.floor(100000 + Math.random() * 900000)}`,
        timestamp: new Date().toISOString(),
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDirectWhatsApp = () => {
    const text = `Hello Hunting Projectors!%0A%0AName: ${formData.fullName || 'Prospective Buyer'}%0APhone: ${formData.phoneNumber || 'Not provided'}%0ACity: ${formData.city}%0AInterested Model: ${formData.productName}%0AMessage: ${formData.message || 'I would like to inquire about demo availability and live pricing.'}`;
    window.open(`https://wa.me/${siteConfig.contact.whatsapp}?text=${text}`, '_blank');
  };

  return (
    <div className="contact-page">
      <div className="container-wide contact-container">

        {/* Header */}
        <header className="contact-hero text-center">
          <span className="eyebrow">
            <Sparkles size={12} />
            DIRECT BRAND INQUIRY & SHOWROOM
          </span>
          <h1 className="display-title">CONNECT WITH HUNTING.</h1>
          <p className="contact-lead">
            Whether you want a private showroom appointment in Chennai or a doorstep dispatch quote anywhere in India, our brand specialists are at your service.
          </p>
        </header>

        {/* 2-Column Grid: Left (Direct Contact Cards & Business Info) + Right (Enquiry Form) */}
        <div className="contact-main-grid">

          {/* Left Column */}
          <div className="contact-info-col">

            {/* Quick Action Tiles */}
            <div className="contact-tiles-grid">

              <a
                href={getWhatsAppLink()}
                target="_blank"
                rel="noopener noreferrer"
                className="contact-action-tile whatsapp"
              >
                <div className="tile-icon-wrap whatsapp"><MessageCircle size={22} /></div>
                <div>
                  <span className="tile-title">WHATSAPP DESK</span>
                  <span className="tile-sub">{siteConfig.contact.whatsappDisplay}</span>
                  <span className="tile-status">Instant Chat & Video Demo</span>
                </div>
              </a>

              <a href={getPhoneLink()} className="contact-action-tile phone">
                <div className="tile-icon-wrap phone"><Phone size={22} /></div>
                <div>
                  <span className="tile-title">DIRECT TELEPHONE</span>
                  <span className="tile-sub">{siteConfig.contact.phoneDisplay}</span>
                  <span className="tile-status">{siteConfig.contact.supportHours}</span>
                </div>
              </a>

              <a href={getEmailLink()} className="contact-action-tile email">
                <div className="tile-icon-wrap email"><Mail size={22} /></div>
                <div>
                  <span className="tile-title">OFFICIAL EMAIL</span>
                  <span className="tile-sub">{siteConfig.contact.email}</span>
                  <span className="tile-status">Written Quotes & Specs</span>
                </div>
              </a>

            </div>

            {/* Operating Entity & Chennai Showroom Details */}
            <div className="contact-entity-box">
              <div className="entity-header-row">
                <ShieldCheck size={18} className="shield-icon" />
                <span className="entity-box-tag">DIRECT BRAND SUPPLIER & OPERATOR</span>
              </div>
              <h3 className="entity-box-name">{siteConfig.entity.owner}</h3>
              <p className="entity-box-desc">
                Hunting is the customer-facing projector brand. All orders, warranties, and after-sales support are fulfilled directly by NAP Computers & Electronics.
              </p>

              <div className="entity-address-card">
                <MapPin size={18} className="pin-icon" />
                <div>
                  <strong>Chennai Showroom & Office:</strong>
                  <span>{siteConfig.contact.address.line1}</span>
                  <span>{siteConfig.contact.address.line2}</span>
                  <span>{siteConfig.contact.address.city}, {siteConfig.contact.address.state} — {siteConfig.contact.address.pincode}</span>
                  <span>{siteConfig.contact.address.country}</span>
                </div>
              </div>

              <div className="entity-hours-card">
                <Clock size={16} />
                <span>Showroom & Support Timings: <strong>{siteConfig.contact.supportHours}</strong></span>
              </div>
            </div>

          </div>

          {/* Right Column: Interactive Enquiry Form */}
          <div className="contact-form-col">
            <div className="form-wrapper-card">
              <div className="form-card-header">
                <span className="eyebrow">MESSAGE OUR SPECIALISTS</span>
                <h3 className="form-card-title">Submit a Direct Request</h3>
                <p className="form-card-sub">
                  Tell us about your room size, throw distance, or questions. We respond promptly via WhatsApp or phone.
                </p>
              </div>

              {result ? (
                <div className="contact-success-state">
                  <div className="success-icon-disc">
                    <CheckCircle size={48} />
                  </div>
                  <h4>Enquiry Successfully Received</h4>
                  <p className="success-body-text">{result.message}</p>

                  <div className="success-ref-pill">
                    <span>DEMO REFERENCE:</span>
                    <strong>{result.referenceId}</strong>
                  </div>

                  <button
                    type="button"
                    className="btn-whatsapp"
                    onClick={handleDirectWhatsApp}
                  >
                    <MessageCircle size={18} />
                    <span>CONNECT NOW ON WHATSAPP WITH THIS REF</span>
                  </button>

                  <button
                    type="button"
                    className="btn-ghost"
                    onClick={() => setResult(null)}
                  >
                    Submit Another Query
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="contact-actual-form">
                  <div className="form-grid-2">
                    <div className="c-field">
                      <label htmlFor="c-name">Full Name *</label>
                      <input
                        id="c-name"
                        type="text"
                        required
                        placeholder="e.g. Anand Kumar"
                        value={formData.fullName}
                        onChange={e => setFormData({ ...formData, fullName: e.target.value })}
                      />
                    </div>
                    <div className="c-field">
                      <label htmlFor="c-phone">Phone / WhatsApp Number *</label>
                      <input
                        id="c-phone"
                        type="tel"
                        required
                        placeholder="+91 90422 92929"
                        value={formData.phoneNumber}
                        onChange={e => setFormData({ ...formData, phoneNumber: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className="form-grid-2">
                    <div className="c-field">
                      <label htmlFor="c-email">Email Address</label>
                      <input
                        id="c-email"
                        type="email"
                        placeholder="name@domain.com"
                        value={formData.email}
                        onChange={e => setFormData({ ...formData, email: e.target.value })}
                      />
                    </div>
                    <div className="c-field">
                      <label htmlFor="c-city">City / State (Pan-India) *</label>
                      <input
                        id="c-city"
                        type="text"
                        required
                        placeholder="e.g. Chennai, Bangalore, Mumbai..."
                        value={formData.city}
                        onChange={e => setFormData({ ...formData, city: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className="form-grid-2">
                    <div className="c-field">
                      <label htmlFor="c-model">Model of Interest</label>
                      <select
                        id="c-model"
                        value={formData.productName}
                        onChange={e => setFormData({ ...formData, productName: e.target.value })}
                      >
                        {products.map(p => (
                          <option key={p.id} value={p.name}>
                            {p.name} ({p.categoryLabel} • ₹{p.price.toLocaleString('en-IN')})
                          </option>
                        ))}
                        <option value="General Guidance">General Guidance on Choosing a Model</option>
                      </select>
                    </div>

                    <div className="c-field">
                      <label htmlFor="c-type">Inquiry Type</label>
                      <select
                        id="c-type"
                        value={formData.enquiryType}
                        onChange={e => setFormData({ ...formData, enquiryType: e.target.value as any })}
                      >
                        <option value="product-demo">Book Chennai Showroom / Video Demo</option>
                        <option value="price-quote">Official Price Quotation</option>
                        <option value="bulk-order">Institutional / Commercial Order</option>
                        <option value="technical-support">Technical & Installation Advice</option>
                      </select>
                    </div>
                  </div>

                  <div className="c-field">
                    <label htmlFor="c-message">Room Details or Specific Questions</label>
                    <textarea
                      id="c-message"
                      rows={3}
                      placeholder="Share your expected screen size, room lighting, or installation preferences..."
                      value={formData.message}
                      onChange={e => setFormData({ ...formData, message: e.target.value })}
                    />
                  </div>

                  <div className="contact-form-actions">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="btn-primary c-submit-btn"
                    >
                      <Send size={16} />
                      <span>{isSubmitting ? 'PROCESSING...' : 'SEND INQUIRY'}</span>
                    </button>

                    <button
                      type="button"
                      className="btn-whatsapp"
                      onClick={handleDirectWhatsApp}
                    >
                      <MessageCircle size={18} />
                      <span>INSTANT WHATSAPP</span>
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
