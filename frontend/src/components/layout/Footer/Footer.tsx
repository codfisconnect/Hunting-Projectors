import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Phone, Mail, MapPin, MessageCircle, ShieldCheck, Truck, Headphones, ChevronDown } from 'lucide-react';
import { siteConfig, getWhatsAppLink, getPhoneLink, getEmailLink } from '../../../data/siteContent';
import './Footer.css';

export const Footer: React.FC = () => {
  const [openSection, setOpenSection] = useState<string | null>(null);

  const toggleSection = (name: string) => {
    setOpenSection(prev => prev === name ? null : name);
  };
  return (
    <footer className="site-footer">
      {/* Streamlined Upper Value Proposition Bar */}
      <div className="footer-props-bar">
        <div className="container-wide footer-props-grid">
          <div className="prop-item">
            <ShieldCheck size={18} className="prop-icon" />
            <div className="prop-text-group">
              <span className="prop-title">DIRECT HUNTING WARRANTY</span>
              <span className="prop-sub">Official 2-Year brand warranty by Nap Computers Electronicss</span>
            </div>
          </div>
          <div className="prop-item">
            <Truck size={18} className="prop-icon" />
            <div className="prop-text-group">
              <span className="prop-title">PAN-INDIA INSURED DISPATCH</span>
              <span className="prop-sub">Express doorstep delivery with tracking across India</span>
            </div>
          </div>
          <div className="prop-item">
            <Headphones size={18} className="prop-icon" />
            <div className="prop-text-group">
              <span className="prop-title">DIRECT CHENNAI SPECIALISTS</span>
              <span className="prop-sub">Live video optical demos & expert consultation</span>
            </div>
          </div>
        </div>
      </div>

      {/* Compact Main Footer Links & Information */}
      <div className="container-wide footer-main">
        <div className="footer-columns-grid">
          
          {/* Column 1: Brand & Contact Info */}
          <div className="footer-col brand-col">
            <div className="footer-brand">
              <img
                src="/assets/hunting-projectors-logo-footer.png"
                alt="Hunting Projector Logo"
                className="footer-brand-logo"
                width="46"
                height="46"
              />
              <div className="footer-brand-text">
                <span className="brand-primary">HUNTING PROJECTOR</span>
                <span className="brand-secondary">by Nap Computers Electronicss</span>
              </div>
            </div>
            <p className="footer-brand-desc">
              Pioneering high-lumen optical projection systems engineered to transform homes into extraordinary private cinemas.
            </p>
            <div className="footer-brand-contact-pills">
              <a
                href={getWhatsAppLink()}
                target="_blank"
                rel="noopener noreferrer"
                className="contact-pill whatsapp"
              >
                <MessageCircle size={14} />
                <span>WhatsApp: {siteConfig.contact.whatsappDisplay}</span>
              </a>
              <a href={getPhoneLink()} className="contact-pill">
                <Phone size={13} />
                <span>Call: {siteConfig.contact.phoneDisplay}</span>
              </a>
              <a href={getEmailLink()} className="contact-pill">
                <Mail size={13} />
                <span>{siteConfig.contact.email}</span>
              </a>
            </div>
          </div>

          {/* Column 2: Shop & Categories */}
          <div className="footer-col">
            <button
              type="button"
              className="footer-accordion-header"
              onClick={() => toggleSection('projectors')}
              aria-expanded={openSection === 'projectors'}
            >
              <h4 className="footer-heading">PROJECTORS</h4>
              <ChevronDown size={14} className={`footer-accordion-arrow ${openSection === 'projectors' ? 'open' : ''}`} />
            </button>
            <ul className={`footer-links ${openSection === 'projectors' ? 'expanded' : ''}`}>
              <li><Link to="/products">All Projectors</Link></li>
              <li><Link to="/products?category=home-cinema">Home Cinema</Link></li>
              <li><Link to="/products?category=gaming">Gaming & High Refresh</Link></li>
              <li><Link to="/products?category=smart-projectors">Smart Projectors</Link></li>
              <li><Link to="/products?category=portable">Portable</Link></li>
              <li><Link to="/projector-finder">Projector Match Finder</Link></li>
              <li><Link to="/compare">Compare Models</Link></li>
            </ul>
          </div>

          {/* Column 3: Customer Care & Policies */}
          <div className="footer-col">
            <button
              type="button"
              className="footer-accordion-header"
              onClick={() => toggleSection('care')}
              aria-expanded={openSection === 'care'}
            >
              <h4 className="footer-heading">CUSTOMER CARE</h4>
              <ChevronDown size={14} className={`footer-accordion-arrow ${openSection === 'care' ? 'open' : ''}`} />
            </button>
            <ul className={`footer-links ${openSection === 'care' ? 'expanded' : ''}`}>
              <li><Link to="/support">Support Hub</Link></li>
              <li><Link to="/contact">Contact Specialists</Link></li>
              <li><Link to="/faq">Frequently Asked Questions</Link></li>
              <li><Link to="/warranty">Warranty Guidelines</Link></li>
              <li><Link to="/shipping">Shipping Policy</Link></li>
              <li><Link to="/refund">Returns & Replacements</Link></li>
              <li><Link to="/privacy">Privacy Policy</Link></li>
              <li><Link to="/terms">Terms of Service</Link></li>
            </ul>
          </div>

          {/* Column 4: Supplier Details */}
          <div className="footer-col company-col">
            <h4 className="footer-heading">BRAND OWNER & SUPPLIER</h4>
            <div className="entity-box">
              <span className="entity-tag">AUTHORITATIVE OWNER</span>
              <p className="entity-name">{siteConfig.entity.owner}</p>
              <div className="entity-address">
                <MapPin size={15} className="address-icon" />
                <div>
                  <span>{siteConfig.contact.address.line1}, {siteConfig.contact.address.line2}</span>
                  <span>{siteConfig.contact.address.city}, {siteConfig.contact.address.state} — {siteConfig.contact.address.pincode}</span>
                </div>
              </div>
              <div className="entity-hours">
                <span className="hours-label">Support Hours:</span>
                <span className="hours-value">{siteConfig.contact.supportHours}</span>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Compact Legal & Copyright Bar */}
      <div className="footer-legal-bar">
        <div className="container-wide footer-legal-container">
          <div className="legal-ownership-statement">
            <strong>{siteConfig.brand.name} {siteConfig.brand.subname}</strong> — {siteConfig.entity.relation}. {siteConfig.entity.panIndiaCoverage}.
          </div>

          <div className="copyright-text" aria-label="Copyright and ownership">
            <span>© 2026 Nap Computers Electronicss. All rights reserved.</span>
            <span className="copyright-separator">|</span>
            <span className="footer-highlight-gold">Nap Computers Electronicss</span>
            <span className="copyright-separator">|</span>
            <span>
              Web by{' '}
              <a
                href="https://www.codfis.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="footer-highlight-gold footer-link-gold"
              >
                Codfis Technologies
              </a>
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};
