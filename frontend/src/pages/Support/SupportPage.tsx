import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Headphones, 
  ShieldCheck, 
  Wrench, 
  FileText, 
  Truck, 
  MessageCircle, 
  Phone, 
  Download, 
  ArrowRight,
  Search,
  CheckCircle2
} from 'lucide-react';
import { faqs } from '../../data/faqs';
import { Accordion } from '../../components/common/Accordion/Accordion';
import { siteConfig, getWhatsAppLink, getPhoneLink, getEmailLink } from '../../data/siteContent';
import './SupportPage.css';

interface SupportPageProps {
  onOpenEnquiry: (productName?: string) => void;
}

export const SupportPage: React.FC<SupportPageProps> = ({ onOpenEnquiry }) => {
  const [trackInput, setTrackInput] = useState('');
  const [trackFeedback, setTrackFeedback] = useState<string | null>(null);

  useEffect(() => {
    document.title = 'SUPPORT & SERVICE — Hunting Projectors Direct Help';
    window.scrollTo(0, 0);
  }, []);

  const handleTrackSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!trackInput.trim()) return;
    setTrackFeedback(
      `Demo Tracking Status: Order #${trackInput.trim()} is staged for dispatch from our Chennai fulfillment hub. For live courier airway bill updates, connect with our support desk on WhatsApp.`
    );
  };

  const downloads = [
    { title: 'Hunting Vision X1 Owner Guide & Throw Calculator', format: 'PDF (3.4 MB)', type: 'Manual' },
    { title: 'Hunting Cinema X4 ALPD Laser Calibration Profiles', format: 'PDF (4.8 MB)', type: 'Calibration' },
    { title: 'Hunting Ultra Pro UST Wall Installation Stencil', format: 'PDF (2.1 MB)', type: 'Template' },
    { title: 'Hunting Horizon Max 240Hz Pro Firmware Update v2.4', format: 'ZIP (184 MB)', type: 'Firmware' },
    { title: 'Universal Bluetooth Remote Voice Pairing Guide', format: 'PDF (1.2 MB)', type: 'Guide' },
  ];

  const supportFaqs = faqs.slice(4, 9).map(f => ({
    id: f.id,
    title: f.question,
    content: f.answer,
  }));

  return (
    <div className="support-page">
      <div className="container-wide support-container">
        
        {/* Support Hero */}
        <header className="support-hero text-center">
          <span className="eyebrow">
            <Headphones size={13} />
            DIRECT BRAND ASSISTANCE
          </span>
          <h1 className="display-title">SUPPORT & SERVICE HUB.</h1>
          <p className="support-hero-desc">
            Direct after-sales service, warranty registration, optical technical guidance, and pan-India dispatch support operated by NAP Computers & Electronics.
          </p>

          <div className="support-quick-contact-pills">
            <a 
              href={getWhatsAppLink()} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="quick-pill whatsapp"
            >
              <MessageCircle size={15} />
              <span>WhatsApp: {siteConfig.contact.whatsappDisplay}</span>
            </a>
            <a href={getPhoneLink()} className="quick-pill">
              <Phone size={14} />
              <span>Call: {siteConfig.contact.phoneDisplay}</span>
            </a>
          </div>
        </header>

        {/* 4 Support Pillars Grid */}
        <div className="support-pillars-grid">
          
          <div className="support-pillar-card">
            <div className="sp-icon-box"><ShieldCheck size={22} /></div>
            <h3 className="sp-title">WARRANTY REGISTRATION</h3>
            <p className="sp-desc">Official brand warranty coverage backed by NAP Computers. Register your serial number within 15 days of delivery.</p>
            <Link to="/warranty" className="sp-link">
              <span>Warranty Guidelines</span>
              <ArrowRight size={14} />
            </Link>
          </div>

          <div className="support-pillar-card">
            <div className="sp-icon-box"><Wrench size={22} /></div>
            <h3 className="sp-title">FACTORY SERVICE</h3>
            <p className="sp-desc">Access authorized optical servicing, lens cleaning, dust-free chamber restoration, and OEM spare replacement in Chennai.</p>
            <button type="button" className="sp-link-btn" onClick={() => onOpenEnquiry('Service Request')}>
              <span>Request Service</span>
              <ArrowRight size={14} />
            </button>
          </div>

          <div className="support-pillar-card">
            <div className="sp-icon-box"><Headphones size={22} /></div>
            <h3 className="sp-title">VIDEO CONSULTATION</h3>
            <p className="sp-desc">Schedule a live video walkthrough to inspect projector focus, throw ratio calculation, or picture settings calibration.</p>
            <a href={getWhatsAppLink()} target="_blank" rel="noopener noreferrer" className="sp-link">
              <span>Book Video Slot</span>
              <ArrowRight size={14} />
            </a>
          </div>

          <div className="support-pillar-card">
            <div className="sp-icon-box"><Truck size={22} /></div>
            <h3 className="sp-title">PAN-INDIA DISPATCH</h3>
            <p className="sp-desc">Express doorstep delivery across all Indian pin codes with shock-resistant flight crate packaging and transit insurance.</p>
            <Link to="/shipping" className="sp-link">
              <span>Shipping Policy</span>
              <ArrowRight size={14} />
            </Link>
          </div>

        </div>

        {/* Track Order Simulation Box */}
        <section className="track-order-card">
          <div className="track-left">
            <span className="eyebrow">ORDER LOGISTICS</span>
            <h3 className="track-title">Track Your Shipment</h3>
            <p className="track-desc">
              Enter your Hunting demo reference number or order tracking ID to inspect dispatch status from our Chennai facility.
            </p>
          </div>

          <form onSubmit={handleTrackSubmit} className="track-form">
            <div className="track-input-wrap">
              <input
                type="text"
                placeholder="e.g. HP-948201 or AWB number"
                value={trackInput}
                onChange={e => setTrackInput(e.target.value)}
                className="track-input"
              />
              <button type="submit" className="btn-primary track-btn">
                <span>INSPECT STATUS</span>
              </button>
            </div>
            {trackFeedback && (
              <div className="track-feedback-box">
                <CheckCircle2 size={16} className="track-ok-icon" />
                <p>{trackFeedback}</p>
              </div>
            )}
          </form>
        </section>

        {/* Downloads & User Manuals Section */}
        <section className="downloads-section">
          <div className="downloads-header">
            <span className="eyebrow">DOCUMENTATION & RESOURCES</span>
            <h2 className="display-section">MANUALS & DOWNLOADS</h2>
            <p className="downloads-sub">
              Official technical user guides, optical throw templates, and firmware files.
            </p>
          </div>

          <div className="downloads-list-grid">
            {downloads.map((item, i) => (
              <div key={i} className="download-row-card">
                <div className="download-type-pill">{item.type}</div>
                <div className="download-info">
                  <h4 className="download-item-title">{item.title}</h4>
                  <span className="download-meta">{item.format} • Direct Download</span>
                </div>
                <a 
                  href="#download" 
                  onClick={e => {
                    e.preventDefault();
                    alert(`Demo Download: In production, ${item.title} (${item.format}) will be served directly from the Hunting CDN.`);
                  }}
                  className="download-btn-pill"
                >
                  <Download size={14} />
                  <span>DOWNLOAD</span>
                </a>
              </div>
            ))}
          </div>
        </section>

        {/* FAQ Section */}
        <section className="support-faq-section">
          <div className="support-faq-header text-center">
            <span className="eyebrow">TROUBLESHOOTING</span>
            <h2 className="display-section">COMMON SUPPORT QUESTIONS</h2>
          </div>
          <div className="support-faq-box">
            <Accordion items={supportFaqs} />
          </div>
        </section>

      </div>
    </div>
  );
};
