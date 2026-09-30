import React, { useEffect } from 'react';
import { FileText, ShieldCheck, Scale } from 'lucide-react';
import { siteConfig } from '../../data/siteContent';
import '../Warranty/WarrantyPage.css';

export const TermsPage: React.FC = () => {
  useEffect(() => {
    document.title = 'TERMS OF SERVICE — Hunting Projectors & NAP Computers';
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="policy-page">
      <div className="container policy-container">
        
        <header className="policy-header">
          <span className="eyebrow">
            <Scale size={14} />
            LEGAL FRAMEWORK
          </span>
          <h1 className="display-title">TERMS OF SERVICE.</h1>
          <p className="policy-meta">
            Operated by <strong>{siteConfig.entity.owner}</strong>, {siteConfig.entity.locationLabel}.
          </p>
        </header>

        <div className="policy-content-card">
          
          <section className="policy-section-block">
            <h2>1. Acceptance of Terms</h2>
            <p>
              By accessing and browsing the Hunting Projectors website, digital showroom, and interactive tools, you agree to comply with and be bound by the terms, conditions, and notices stated herein.
            </p>
          </section>

          <section className="policy-section-block">
            <h2>2. Client Demo & Pre-Release Notice</h2>
            <p>
              This digital platform serves as a client demonstration and preview experience for the Hunting Projectors brand portfolio. Technical specifications, prices, and features are representative demo parameters engineered for showcase evaluation. Final commercial quotations and production firmware specifications will be confirmed upon formal order placement.
            </p>
          </section>

          <section className="policy-section-block">
            <h2>3. Intellectual Property Rights</h2>
            <p>
              The names "HUNTING", "HUNTING PROJECTORS", optical diagrams, 3D interactive models, UI components, typography systems, and branding identity are the intellectual property of the brand owner and operating entity: NAP Computers & Electronics. Unauthorized reproduction, scraping, or commercial imitation is prohibited.
            </p>
          </section>

          <section className="policy-section-block">
            <h2>4. Direct Brand Supply & Commercial Scope</h2>
            <p>
              Hunting Projectors operates as a direct brand line under NAP Computers & Electronics. Communications, invoicing, warranty servicing, and dispatch logistics are executed directly by NAP Computers & Electronics without third-party commission brokers.
            </p>
          </section>

          <section className="policy-section-block">
            <h2>5. Governing Law & Jurisdiction</h2>
            <p>
              These terms and all commercial transactions shall be governed by and construed in accordance with the laws of India. Any disputes arising in connection with these terms shall be subject to the exclusive jurisdiction of the competent courts in Chennai, Tamil Nadu, India.
            </p>
          </section>

          <section className="policy-section-block">
            <h2>6. Operating Entity Contact Information</h2>
            <div className="policy-entity-notice">
              <strong>Corporate Entity:</strong> {siteConfig.entity.owner}<br />
              <strong>Registered Office:</strong> {siteConfig.contact.address.line1}, {siteConfig.contact.address.city}, {siteConfig.contact.address.state} — {siteConfig.contact.address.pincode}, India.<br />
              <strong>Contact Line:</strong> {siteConfig.contact.phoneDisplay} | <strong>Email:</strong> {siteConfig.contact.email}
            </div>
          </section>

        </div>

      </div>
    </div>
  );
};
