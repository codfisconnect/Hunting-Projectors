import React, { useState, useEffect } from 'react';
import { Send, CheckCircle2, AlertCircle, Phone, User, Mail, MessageSquare, Building2 } from 'lucide-react';
import { submitEnquiry } from '../../services/enquiryService';
import { getProducts } from '../../services/productService';
import { Product } from '../../types/product';
import { MarketingTracker } from '../../utils/marketingTracking';
import './MarketingEnquiryForm.css';

interface MarketingEnquiryFormProps {
  pageType: 'home' | 'business';
  defaultRequirement?: string;
  onSuccess?: () => void;
}

export const MarketingEnquiryForm: React.FC<MarketingEnquiryFormProps> = ({
  pageType,
  defaultRequirement = '',
  onSuccess
}) => {
  const [fullName, setFullName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [email, setEmail] = useState('');
  const [customerType, setCustomerType] = useState(pageType === 'business' ? 'Business / Office' : 'Home User');
  const [requirement, setRequirement] = useState(defaultRequirement);
  const [city, setCity] = useState('');
  const [message, setMessage] = useState('');

  const [availableProducts, setAvailableProducts] = useState<Product[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [successResult, setSuccessResult] = useState<{ referenceId?: string; message: string } | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    let isMounted = true;
    getProducts({ limit: 20 })
      .then(res => {
        if (!isMounted) return;
        const active = (res.products || []).filter(p => !p.slug.toLowerCase().includes('test'));
        setAvailableProducts(active);
      })
      .catch(err => {
        console.warn('Enquiry form products load warning:', err);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const validate = () => {
    const errors: Record<string, string> = {};

    if (!fullName.trim() || fullName.trim().length < 2) {
      errors.fullName = 'Please enter your full name (at least 2 characters).';
    }

    // Clean phone number: remove non-digits
    const cleanPhone = phoneNumber.replace(/\D/g, '');
    if (!cleanPhone || cleanPhone.length < 10) {
      errors.phoneNumber = 'Please enter a valid 10-digit mobile number.';
    }

    if (email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      errors.email = 'Please enter a valid email address.';
    }

    if (!city.trim()) {
      errors.city = 'Please enter your city/location.';
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!validate()) {
      return;
    }

    setSubmitting(true);
    try {
      const detailedMessage = [
        `[${pageType.toUpperCase()} LANDING PAGE LEAD]`,
        `Customer Type: ${customerType}`,
        requirement ? `Requirement: ${requirement}` : '',
        message ? `Notes: ${message}` : '',
      ].filter(Boolean).join('\n');

      const result = await submitEnquiry({
        fullName: fullName.trim(),
        phoneNumber: phoneNumber.trim(),
        email: email.trim() || 'not-provided@customer.in',
        city: city.trim(),
        preferredContact: 'phone',
        enquiryType: pageType === 'business' ? 'bulk-order' : 'product-demo',
        productName: requirement || (pageType === 'business' ? 'Commercial Projector' : 'Home Cinema Projector'),
        message: detailedMessage
      });

      if (result.success) {
        setSuccessResult({
          referenceId: result.referenceId,
          message: result.message
        });
        MarketingTracker.trackEnquirySubmit({
          enquiryType: pageType === 'business' ? 'business_quote' : 'home_consultation',
          productName: requirement,
          referenceId: result.referenceId
        });
        if (onSuccess) onSuccess();
      } else {
        setErrorMessage(result.message || 'Unable to submit enquiry. Please try again.');
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'An error occurred while submitting your enquiry. Please reach us on WhatsApp.');
    } finally {
      setSubmitting(false);
    }
  };

  if (successResult) {
    return (
      <div className="mkt-enquiry-success-card">
        <div className="mkt-success-icon-wrap">
          <CheckCircle2 size={40} className="mkt-success-icon" />
        </div>
        <h3 className="mkt-success-title">Enquiry Registered Successfully</h3>
        <p className="mkt-success-desc">
          Thank you, <strong>{fullName}</strong>. Our Chennai technical team has received your request.
        </p>
        {successResult.referenceId && (
          <div className="mkt-success-ref">
            <span>Reference ID:</span>
            <strong>{successResult.referenceId}</strong>
          </div>
        )}
        <p className="mkt-success-hint">
          We will contact you shortly via phone or WhatsApp during support hours (10:00 AM – 7:30 PM IST).
        </p>
      </div>
    );
  }

  return (
    <form className="mkt-enquiry-form" onSubmit={handleSubmit} noValidate>
      {errorMessage && (
        <div className="mkt-form-error-banner">
          <AlertCircle size={16} />
          <span>{errorMessage}</span>
        </div>
      )}

      <div className="mkt-form-row-2">
        <div className="mkt-input-group">
          <label className="mkt-label">
            Your Name <span className="mkt-req">*</span>
          </label>
          <div className="mkt-input-wrap">
            <User size={16} className="mkt-field-icon" />
            <input
              type="text"
              value={fullName}
              onChange={e => {
                setFullName(e.target.value);
                setFieldErrors(prev => ({ ...prev, fullName: '' }));
              }}
              placeholder="e.g. Ramesh Kumar"
              className={`mkt-input ${fieldErrors.fullName ? 'mkt-input-error' : ''}`}
            />
          </div>
          {fieldErrors.fullName && <span className="mkt-error-text">{fieldErrors.fullName}</span>}
        </div>

        <div className="mkt-input-group">
          <label className="mkt-label">
            Mobile Number <span className="mkt-req">*</span>
          </label>
          <div className="mkt-input-wrap">
            <Phone size={16} className="mkt-field-icon" />
            <input
              type="tel"
              value={phoneNumber}
              onChange={e => {
                setPhoneNumber(e.target.value);
                setFieldErrors(prev => ({ ...prev, phoneNumber: '' }));
              }}
              placeholder="10-digit mobile number"
              className={`mkt-input ${fieldErrors.phoneNumber ? 'mkt-input-error' : ''}`}
            />
          </div>
          {fieldErrors.phoneNumber && <span className="mkt-error-text">{fieldErrors.phoneNumber}</span>}
        </div>
      </div>

      <div className="mkt-form-row-2">
        <div className="mkt-input-group">
          <label className="mkt-label">
            Email Address <span className="mkt-opt">(Optional)</span>
          </label>
          <div className="mkt-input-wrap">
            <Mail size={16} className="mkt-field-icon" />
            <input
              type="email"
              value={email}
              onChange={e => {
                setEmail(e.target.value);
                setFieldErrors(prev => ({ ...prev, email: '' }));
              }}
              placeholder="name@example.com"
              className={`mkt-input ${fieldErrors.email ? 'mkt-input-error' : ''}`}
            />
          </div>
          {fieldErrors.email && <span className="mkt-error-text">{fieldErrors.email}</span>}
        </div>

        <div className="mkt-input-group">
          <label className="mkt-label">
            City / Location <span className="mkt-req">*</span>
          </label>
          <div className="mkt-input-wrap">
            <Building2 size={16} className="mkt-field-icon" />
            <input
              type="text"
              value={city}
              onChange={e => {
                setCity(e.target.value);
                setFieldErrors(prev => ({ ...prev, city: '' }));
              }}
              placeholder="e.g. Chennai, Bangalore, Hyderabad"
              className={`mkt-input ${fieldErrors.city ? 'mkt-input-error' : ''}`}
            />
          </div>
          {fieldErrors.city && <span className="mkt-error-text">{fieldErrors.city}</span>}
        </div>
      </div>

      <div className="mkt-form-row-2">
        <div className="mkt-input-group">
          <label className="mkt-label">Customer Type</label>
          <select
            value={customerType}
            onChange={e => setCustomerType(e.target.value)}
            className="mkt-input mkt-select"
          >
            {pageType === 'home' ? (
              <>
                <option value="Home User">Home User / Family Cinema</option>
                <option value="Living Room Setup">Living Room Entertainment</option>
                <option value="Dedicated Home Theater">Dedicated Home Theater</option>
                <option value="Architect / Interior Designer">Architect / Interior Designer</option>
              </>
            ) : (
              <>
                <option value="Business / Office">Business / Office</option>
                <option value="Conference / Boardroom">Conference / Boardroom</option>
                <option value="Educational Institution">Educational Institution / College</option>
                <option value="Training Center">Training Center</option>
                <option value="Commercial / Hospitality">Commercial / Hospitality</option>
              </>
            )}
          </select>
        </div>

        <div className="mkt-input-group">
          <label className="mkt-label">Projector Requirement</label>
          <select
            value={requirement}
            onChange={e => setRequirement(e.target.value)}
            className="mkt-input mkt-select"
          >
            <option value="">Select a model or requirement</option>
            {availableProducts.length > 0 ? (
              availableProducts.map(prod => (
                <option key={prod.id} value={`${prod.name} (₹${Number(prod.price).toLocaleString('en-IN')})`}>
                  {prod.name} (₹{Number(prod.price).toLocaleString('en-IN')})
                </option>
              ))
            ) : (
              <>
                <option value="HY 320 (₹10,500)">HY 320 (₹10,500)</option>
                <option value="HY260 Pro (₹13,500)">HY260 Pro (₹13,500)</option>
                <option value="Warrior A002 (₹18,500)">Warrior A002 (₹18,500)</option>
                <option value="Warrior 004 (₹25,000)">Warrior 004 (₹25,000)</option>
              </>
            )}
            <option value="Need Specialist Guidance">Need Specialist Guidance for Room Size</option>
            {pageType === 'business' && (
              <option value="Bulk / Institutional Quote">Bulk / Institutional Order Quote</option>
            )}
          </select>
        </div>
      </div>

      <div className="mkt-input-group">
        <label className="mkt-label">
          Message / Room Details <span className="mkt-opt">(Optional)</span>
        </label>
        <div className="mkt-input-wrap mkt-textarea-wrap">
          <MessageSquare size={16} className="mkt-field-icon mkt-textarea-icon" />
          <textarea
            rows={3}
            value={message}
            onChange={e => setMessage(e.target.value)}
            placeholder={
              pageType === 'business'
                ? 'Tell us about your room size, ambient light, screen size required, or number of units...'
                : 'Tell us about your screen size expectation, room lighting, or throw distance...'
            }
            className="mkt-input mkt-textarea"
          />
        </div>
      </div>

      <button
        type="submit"
        disabled={submitting}
        className="btn-primary mkt-submit-btn"
      >
        <Send size={16} />
        <span>{submitting ? 'Submitting Enquiry...' : pageType === 'business' ? 'Request Business Quote' : 'Get Free Expert Assistance'}</span>
      </button>

      <p className="mkt-privacy-note">
        Direct brand contact by Nap Computers Electronics, Chennai. Zero spam. Your phone number is strictly used for product consultation.
      </p>
    </form>
  );
};
