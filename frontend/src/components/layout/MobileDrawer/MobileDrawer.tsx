import React, { useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { X, Phone, MessageSquare, ArrowRight, ShieldCheck, MapPin } from 'lucide-react';
import { siteConfig, getWhatsAppLink, getPhoneLink } from '../../../data/siteContent';
import './MobileDrawer.css';

interface MobileDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenEnquiry: () => void;
}

export const MobileDrawer: React.FC<MobileDrawerProps> = ({
  isOpen,
  onClose,
  onOpenEnquiry,
}) => {
  const location = useLocation();

  // Close drawer on route change
  useEffect(() => {
    if (isOpen) {
      onClose();
    }
  }, [location.pathname]);

  // Lock body scroll when drawer is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const links = [
    { label: 'ALL PROJECTORS', path: '/products', tag: '5 Models' },
    { label: 'EXPERIENCE & SHOWROOM', path: '/experience', tag: 'Interactive' },
    { label: 'PROJECTOR FINDER', path: '/projector-finder', tag: 'Quiz' },
    { label: 'COMPARE SPECIFICATIONS', path: '/compare', tag: 'Side-by-side' },
    { label: 'ABOUT HUNTING', path: '/about' },
    { label: 'SUPPORT & SERVICE', path: '/support' },
    { label: 'CONTACT US', path: '/contact' },
    { label: 'FAQ', path: '/faq' },
  ];

  return (
    <div className="mobile-drawer-overlay" onClick={onClose} role="dialog" aria-modal="true">
      <div className="mobile-drawer-panel" onClick={e => e.stopPropagation()}>
        
        {/* Header */}
        <div className="mobile-drawer-header">
          <div className="drawer-brand">
            <span className="brand-primary">{siteConfig.brand.name}</span>
            <span className="brand-secondary">{siteConfig.brand.subname}</span>
          </div>
          <button 
            type="button" 
            className="drawer-close-btn" 
            onClick={onClose}
            aria-label="Close menu"
          >
            <X size={24} />
          </button>
        </div>

        {/* Navigation Links */}
        <div className="mobile-drawer-body">
          <div className="drawer-nav-section">
            <span className="drawer-section-label">NAVIGATION</span>
            <ul className="drawer-nav-list">
              {links.map(item => {
                const isActive = location.pathname === item.path;
                return (
                  <li key={item.path}>
                    <Link 
                      to={item.path} 
                      className={`drawer-nav-link ${isActive ? 'active' : ''}`}
                    >
                      <span className="drawer-link-title">{item.label}</span>
                      {item.tag && <span className="drawer-link-tag">{item.tag}</span>}
                      <ArrowRight size={16} className="drawer-link-arrow" />
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>

          {/* Quick Direct Actions */}
          <div className="drawer-actions-section">
            <button 
              type="button" 
              className="drawer-action-btn primary"
              onClick={() => {
                onClose();
                onOpenEnquiry();
              }}
            >
              <MessageSquare size={16} />
              <span>REQUEST PROJECTOR DEMO</span>
            </button>

            <a 
              href={getWhatsAppLink()} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="drawer-action-btn whatsapp"
            >
              <span className="dot-online" />
              <span>CHAT ON WHATSAPP</span>
            </a>

            <a 
              href={getPhoneLink()} 
              className="drawer-action-btn outline"
            >
              <Phone size={16} />
              <span>CALL HUNTING SPECIALIST</span>
            </a>
          </div>

          {/* Brand & Supplier Entity Details */}
          <div className="drawer-entity-card">
            <div className="entity-header">
              <ShieldCheck size={16} className="entity-icon" />
              <span>DIRECT BRAND SUPPLY</span>
            </div>
            <p className="entity-text">
              {siteConfig.entity.relation}
            </p>
            <p className="entity-location">
              <MapPin size={13} />
              <span>{siteConfig.entity.locationLabel}</span>
            </p>
          </div>
        </div>

      </div>
    </div>
  );
};
