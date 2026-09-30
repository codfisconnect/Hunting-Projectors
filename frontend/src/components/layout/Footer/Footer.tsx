import React from 'react';
import { Link } from 'react-router-dom';
import { Phone, Mail, MapPin, MessageCircle, ShieldCheck, Truck, Headphones } from 'lucide-react';
import { siteConfig, getWhatsAppLink, getPhoneLink, getEmailLink } from '../../../data/siteContent';
import './Footer.css';

export const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="site-footer">
      {/* Upper Value Proposition Banner */}
      <div className="footer-props-bar">
        <div className="container-wide footer-props-grid">
          <div className="prop-item">
            <ShieldCheck size={20} className="prop-icon" />
            <div>
              <span className="prop-title">DIRECT HUNTING WARRANTY</span>
              <span className="prop-sub">Official brand warranty backed by NAP Computers</span>
            </div>
          </div>
          <div className="prop-item">
            <Truck size={20} className="prop-icon" />
            <div>
              <span className="prop-title">PAN-INDIA INSURED DISPATCH</span>
              <span className="prop-sub">Doorstep delivery to all Indian postal codes</span>
            </div>
          </div>
          <div className="prop-item">
            <Headphones size={20} className="prop-icon" />
            <div>
              <span className="prop-title">DIRECT CHENNAI SUPPORT</span>
              <span className="prop-sub">Dedicated optical specialists & live video demo</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links Columns */}
      <div className="container-wide footer-main">
        <div className="footer-columns-grid">
          
          {/* Column 1: Brand & Philosophy */}
          <div className="footer-col brand-col">
            <div className="footer-brand">
              <span className="brand-primary">{siteConfig.brand.name}</span>
              <span className="brand-secondary">{siteConfig.brand.subname}</span>
            </div>
            <p className="footer-brand-desc">
              Pioneering high-lumen optical projection systems engineered to transform residential and commercial spaces into extraordinary private cinemas.
            </p>
            <div className="footer-brand-contact-pills">
              <a 
                href={getWhatsAppLink()} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="contact-pill whatsapp"
              >
                <MessageCircle size={15} />
                <span>WhatsApp: {siteConfig.contact.whatsappDisplay}</span>
              </a>
              <a 
                href={getPhoneLink()} 
                className="contact-pill"
              >
                <Phone size={14} />
                <span>Direct: {siteConfig.contact.phoneDisplay}</span>
              </a>
            </div>
          </div>

          {/* Column 2: Explore */}
          <div className="footer-col">
            <h4 className="footer-heading">EXPLORE</h4>
            <ul className="footer-links">
              <li><Link to="/products">All Projectors</Link></li>
              <li><Link to="/products?category=laser-4k">4K Laser Cinema</Link></li>
              <li><Link to="/products?category=ultra-short-throw">Ultra Short Throw (UST)</Link></li>
              <li><Link to="/products?category=home-cinema">Home Cinema Master</Link></li>
              <li><Link to="/products?category=smart-portable">Smart Portable</Link></li>
              <li><Link to="/experience">Interactive Showroom</Link></li>
              <li><Link to="/projector-finder">Find Your Projector</Link></li>
              <li><Link to="/compare">Compare Models</Link></li>
            </ul>
          </div>

          {/* Column 3: Support */}
          <div className="footer-col">
            <h4 className="footer-heading">SUPPORT & SERVICE</h4>
            <ul className="footer-links">
              <li><Link to="/support">Support Hub</Link></li>
              <li><Link to="/contact">Contact Brand Specialists</Link></li>
              <li><Link to="/faq">Frequently Asked Questions</Link></li>
              <li><Link to="/warranty">Warranty Guidelines</Link></li>
              <li><Link to="/shipping">Pan-India Delivery Policy</Link></li>
              <li><Link to="/refund">Returns & Replacement</Link></li>
              <li><a href={getEmailLink()}>Technical Support Email</a></li>
            </ul>
          </div>

          {/* Column 4: Supplier / Operating Entity */}
          <div className="footer-col company-col">
            <h4 className="footer-heading">SUPPLIER & ENTITY</h4>
            <div className="entity-box">
              <span className="entity-tag">BRAND OWNER & SUPPLIER</span>
              <p className="entity-name">{siteConfig.entity.owner}</p>
              <div className="entity-address">
                <MapPin size={16} className="address-icon" />
                <div>
                  <span>{siteConfig.contact.address.line1}</span>
                  <span>{siteConfig.contact.address.line2}</span>
                  <span>{siteConfig.contact.address.city}, {siteConfig.contact.address.state} — {siteConfig.contact.address.pincode}</span>
                  <span>{siteConfig.contact.address.country}</span>
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

      {/* Legal & Ownership Bar */}
      <div className="footer-legal-bar">
        <div className="container-wide footer-legal-container">
          <div className="legal-ownership-statement">
            <strong>{siteConfig.brand.name} {siteConfig.brand.subname}</strong> — {siteConfig.entity.relation}. {siteConfig.entity.panIndiaCoverage}.
          </div>

          <div className="legal-nav">
            <Link to="/privacy">Privacy Policy</Link>
            <span className="divider">•</span>
            <Link to="/terms">Terms of Service</Link>
            <span className="divider">•</span>
            <Link to="/shipping">Shipping Policy</Link>
            <span className="divider">•</span>
            <Link to="/refund">Refund Policy</Link>
          </div>

          <div className="copyright-text">
            © {currentYear} Hunting Projectors. All Rights Reserved.
          </div>
        </div>
      </div>
    </footer>
  );
};
