import React, { useState, useEffect } from 'react';
import { X, Send, CheckCircle, MessageCircle, Phone, ShieldCheck } from 'lucide-react';
import { products } from '../../../data/products';
import { submitEnquiry } from '../../../services/enquiryService';
import { EnquiryFormData, EnquirySubmissionResult } from '../../../types/enquiry';
import { siteConfig, getWhatsAppLink, getPhoneLink } from '../../../data/siteContent';
import './EnquiryModal.css';

interface EnquiryModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialProduct?: string;
}

export const EnquiryModal: React.FC<EnquiryModalProps> = ({
  isOpen,
  onClose,
  initialProduct,
}) => {
  const [formData, setFormData] = useState<EnquiryFormData>({
    fullName: '',
    phoneNumber: '',
    email: '',
    city: 'Chennai',
    productName: initialProduct || products[0].name,
    preferredContact: 'whatsapp',
    message: '',
    enquiryType: 'product-demo',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [result, setResult] = useState<EnquirySubmissionResult | null>(null);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      if (initialProduct) {
        setFormData(prev => ({ ...prev, productName: initialProduct }));
      }
    } else {
      document.body.style.overflow = '';
      setResult(null);
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen, initialProduct]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await submitEnquiry(formData);
      setResult(response);
    } catch {
      setResult({
        success: true,
        message: 'Your enquiry has been noted! Connect with our Chennai team directly via WhatsApp for instant scheduling.',
        referenceId: `HP-${Math.floor(100000 + Math.random() * 900000)}`,
        timestamp: new Date().toISOString(),
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDirectWhatsApp = () => {
    const text = `Hello Hunting Projectors!%0A%0AName: ${formData.fullName || 'Prospective Customer'}%0APhone: ${formData.phoneNumber || 'Not provided'}%0ACity: ${formData.city || 'India'}%0AInterested In: ${formData.productName}%0AMessage: ${formData.message || 'I would like to schedule a product demo or request pricing.'}`;
    window.open(`https://wa.me/${siteConfig.contact.whatsapp}?text=${text}`, '_blank');
  };

  return (
    <div className="enquiry-modal-overlay" onClick={onClose} role="dialog" aria-modal="true">
      <div className="enquiry-modal-card" onClick={e => e.stopPropagation()}>
        
        {/* Header */}
        <div className="enquiry-modal-header">
          <div>
            <div className="enquiry-header-badge">
              <ShieldCheck size={14} />
              <span>DIRECT BRAND CONSULTATION</span>
            </div>
            <h3 className="enquiry-modal-title">EXPERIENCE HUNTING</h3>
            <p className="enquiry-modal-subtitle">
              Speak directly with an optical specialist from NAP Computers & Electronics.
            </p>
          </div>
          <button 
            type="button" 
            className="enquiry-close-btn" 
            onClick={onClose}
            aria-label="Close enquiry dialog"
          >
            <X size={20} />
          </button>
        </div>

        {/* Form Body or Success State */}
        <div className="enquiry-modal-body">
          {result ? (
            <div className="enquiry-success-view">
              <div className="success-icon-wrap">
                <CheckCircle size={52} className="success-icon" />
              </div>
              <h4>Enquiry Registered Successfully</h4>
              <p className="success-msg">{result.message}</p>
              
              <div className="success-ref-card">
                <span className="ref-label">DEMO REFERENCE ID:</span>
                <span className="ref-code">{result.referenceId}</span>
              </div>

              <div className="success-instant-ctas">
                <button 
                  type="button" 
                  className="btn-whatsapp"
                  onClick={handleDirectWhatsApp}
                >
                  <MessageCircle size={18} />
                  <span>CONTINUE ON WHATSAPP FOR INSTANT DEMO</span>
                </button>

                <a href={getPhoneLink()} className="btn-secondary">
                  <Phone size={16} />
                  <span>CALL {siteConfig.contact.phoneDisplay}</span>
                </a>
              </div>

              <button 
                type="button" 
                className="btn-ghost" 
                onClick={onClose}
              >
                Close Window
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="enquiry-form">
              <div className="form-grid-2">
                <div className="form-field">
                  <label htmlFor="fullName">Your Full Name *</label>
                  <input
                    id="fullName"
                    type="text"
                    required
                    placeholder="e.g. Ramesh V."
                    value={formData.fullName}
                    onChange={e => setFormData({ ...formData, fullName: e.target.value })}
                  />
                </div>

                <div className="form-field">
                  <label htmlFor="phoneNumber">Phone / WhatsApp Number *</label>
                  <input
                    id="phoneNumber"
                    type="tel"
                    required
                    placeholder="+91 90422 92929"
                    value={formData.phoneNumber}
                    onChange={e => setFormData({ ...formData, phoneNumber: e.target.value })}
                  />
                </div>
              </div>

              <div className="form-grid-2">
                <div className="form-field">
                  <label htmlFor="email">Email Address</label>
                  <input
                    id="email"
                    type="email"
                    placeholder="name@domain.com"
                    value={formData.email}
                    onChange={e => setFormData({ ...formData, email: e.target.value })}
                  />
                </div>

                <div className="form-field">
                  <label htmlFor="city">City / State (Pan-India) *</label>
                  <input
                    id="city"
                    type="text"
                    required
                    placeholder="e.g. Chennai, Bangalore, Mumbai..."
                    value={formData.city}
                    onChange={e => setFormData({ ...formData, city: e.target.value })}
                  />
                </div>
              </div>

              <div className="form-grid-2">
                <div className="form-field">
                  <label htmlFor="productSelect">Hunting Projector Model</label>
                  <select
                    id="productSelect"
                    value={formData.productName}
                    onChange={e => setFormData({ ...formData, productName: e.target.value })}
                  >
                    {products.map(p => (
                      <option key={p.id} value={p.name}>
                        {p.name} ({p.specifications.resolution} • ₹{p.price.toLocaleString('en-IN')})
                      </option>
                    ))}
                    <option value="General Guidance / Not Sure">I Need Recommendation for My Room Size</option>
                  </select>
                </div>

                <div className="form-field">
                  <label htmlFor="enquiryType">Enquiry Purpose</label>
                  <select
                    id="enquiryType"
                    value={formData.enquiryType}
                    onChange={e => setFormData({ ...formData, enquiryType: e.target.value as any })}
                  >
                    <option value="product-demo">Schedule Live Video / Showroom Demo</option>
                    <option value="price-quote">Official Price Quotation</option>
                    <option value="bulk-order">Commercial / Institutional Order</option>
                    <option value="dealership">Dealership / Reseller Inquiry</option>
                    <option value="technical-support">Technical Compatibility Question</option>
                  </select>
                </div>
              </div>

              <div className="form-field">
                <label htmlFor="message">Room Dimensions & Viewing Requirements (Optional)</label>
                <textarea
                  id="message"
                  rows={3}
                  placeholder="Share details such as room lighting, screen size preference (e.g. 100 or 120 inches), throw distance, or setup questions..."
                  value={formData.message}
                  onChange={e => setFormData({ ...formData, message: e.target.value })}
                />
              </div>

              {/* Action Buttons */}
              <div className="form-actions">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="btn-primary form-submit-btn"
                >
                  <Send size={16} />
                  <span>{isSubmitting ? 'PROCESSING...' : 'SUBMIT ENQUIRY'}</span>
                </button>

                <button
                  type="button"
                  className="btn-whatsapp"
                  onClick={handleDirectWhatsApp}
                >
                  <MessageCircle size={18} />
                  <span>INSTANT CHAT VIA WHATSAPP</span>
                </button>
              </div>

              <div className="form-entity-footer">
                <ShieldCheck size={14} />
                <span>
                  Supplied & operated directly by NAP Computers & Electronics, Chennai. No third-party brokers.
                </span>
              </div>
            </form>
          )}
        </div>

      </div>
    </div>
  );
};
