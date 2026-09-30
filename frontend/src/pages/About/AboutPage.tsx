import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  ShieldCheck, 
  MapPin, 
  Cpu, 
  Eye, 
  Sparkles, 
  Check, 
  ArrowRight,
  Truck,
  Phone
} from 'lucide-react';
import { siteConfig, getWhatsAppLink, getPhoneLink } from '../../data/siteContent';
import './AboutPage.css';

interface AboutPageProps {
  onOpenEnquiry: (productName?: string) => void;
}

export const AboutPage: React.FC<AboutPageProps> = ({ onOpenEnquiry }) => {
  useEffect(() => {
    document.title = 'ABOUT HUNTING — The Direct Optical Projection Philosophy';
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="about-page">
      
      {/* Editorial Hero */}
      <section className="about-hero-section text-center">
        <div className="container">
          <span className="eyebrow">
            <Sparkles size={12} />
            BRAND PHILOSOPHY & PROVENANCE
          </span>
          <h1 className="about-hero-headline">
            WE DON'T JUST<br />SELL PROJECTORS.<br />
            <span className="about-gradient-line">WE CREATE BIGGER EXPERIENCES.</span>
          </h1>
          <p className="about-hero-lead">
            Born from an uncompromising obsession with cinematic optics, acoustic integrity, and direct factory craftsmanship in Chennai, Tamil Nadu.
          </p>
        </div>
      </section>

      {/* Brand Narrative Section */}
      <section className="about-narrative-section">
        <div className="container">
          <div className="about-narrative-grid">
            
            <div className="about-narrative-block">
              <span className="about-block-tag">01 / THE CONVICTION</span>
              <h2 className="about-block-title">Beyond the Glass Television</h2>
              <p>
                Modern residential living spaces deserve better than monolithic black glass rectangles hanging lifelessly on feature walls. A television is passive furniture. A Hunting projector is architectural freedom.
              </p>
              <p>
                When activated, our optical engines transform ordinary rooms into private theaters with 100", 120", or 150" displays. When turned off, your room returns to an uncluttered, elegant sanctuary.
              </p>
            </div>

            <div className="about-narrative-block">
              <span className="about-block-tag">02 / OPTICAL PURITY</span>
              <h2 className="about-block-title">Glass, Precision, & Laser Phosphor</h2>
              <p>
                We do not compromise with cheap resin or plastic lenses that warp under heat and blur corner focus. Every Hunting system is engineered around high-precision optical glass assemblies, advanced solid-state LED, and ALPD laser light sources.
              </p>
              <p>
                From 4K digital micromirror devices (DMD) to low-noise liquid vapor cooling, our hardware is designed for decades of daily family entertainment.
              </p>
            </div>

            <div className="about-narrative-block">
              <span className="about-block-tag">03 / HEALTHIER VIEWING</span>
              <h2 className="about-block-title">Reflected Natural Light</h2>
              <p>
                Direct-view LED screens fire bright, harsh backlights straight into your eyes. Reflected light from a projection screen scatters naturally before reaching your pupils.
              </p>
              <p>
                Children and adults can enjoy marathon cricket matches or cinematic trilogies without the eye strain, headaches, and fatigue associated with conventional monitors.
              </p>
            </div>

            <div className="about-narrative-block">
              <span className="about-block-tag">04 / THE INDIA FOCUS</span>
              <h2 className="about-block-title">Engineered for Indian Homes</h2>
              <p>
                Indian living rooms feature unique ambient lighting, dust considerations, and diverse power environments. Our projectors integrate dust-sealed optical blocks, wide voltage tolerance, and high ANSI lumen engines that overcome ambient light.
              </p>
              <p>
                Supported by direct pan-India doorstep shipping and localized technical specialists in Chennai.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* NAP Computers Operating Entity Section */}
      <section className="about-entity-section">
        <div className="container">
          <div className="about-entity-card">
            <div className="entity-left-col">
              <span className="eyebrow">DIRECT BUSINESS ENTITY</span>
              <h2 className="display-section">THE BUSINESS BEHIND HUNTING</h2>
              <p className="entity-desc">
                Hunting Projectors is the dedicated consumer brand line supplied, owned, and operated by:
              </p>

              <div className="entity-formal-box">
                <h3 className="formal-name">{siteConfig.entity.owner}</h3>
                <p className="formal-loc">{siteConfig.entity.locationLabel}</p>
                <div className="formal-address-lines">
                  <span>{siteConfig.contact.address.line1}</span>
                  <span>{siteConfig.contact.address.line2}</span>
                  <span>{siteConfig.contact.address.city}, {siteConfig.contact.address.state} — {siteConfig.contact.address.pincode}</span>
                  <span>{siteConfig.contact.address.country}</span>
                </div>
              </div>
            </div>

            <div className="entity-right-col">
              <h4 className="entity-right-heading">WHAT DIRECT BRAND SUPPLY MEANS FOR YOU:</h4>
              <ul className="entity-benefits-list">
                <li>
                  <Check size={18} className="b-icon" />
                  <div>
                    <strong>Direct Factory Pricing</strong>
                    <span>No multi-tier wholesale markups or third-party retailer surcharges.</span>
                  </div>
                </li>
                <li>
                  <Check size={18} className="b-icon" />
                  <div>
                    <strong>Official Direct Brand Warranty</strong>
                    <span>Repairs and servicing handled directly by authorized technicians in Chennai.</span>
                  </div>
                </li>
                <li>
                  <Check size={18} className="b-icon" />
                  <div>
                    <strong>Genuine Optical Components</strong>
                    <span>Guaranteed availability of OEM replacement lamps, fans, and optical lenses.</span>
                  </div>
                </li>
                <li>
                  <Check size={18} className="b-icon" />
                  <div>
                    <strong>Personalized Video Consultations</strong>
                    <span>Schedule 1-on-1 optical consultations over WhatsApp with technical specialists.</span>
                  </div>
                </li>
              </ul>

              <div className="entity-actions-group">
                <a 
                  href={getWhatsAppLink()} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="btn-whatsapp"
                >
                  <span>CONNECT ON WHATSAPP</span>
                </a>
                <button
                  type="button"
                  className="btn-secondary"
                  onClick={() => onOpenEnquiry()}
                >
                  REQUEST BRAND BROCHURE
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
};
