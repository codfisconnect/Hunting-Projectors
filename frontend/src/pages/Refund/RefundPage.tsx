import React, { useEffect } from 'react';
import { RefreshCw, CheckCircle2, AlertTriangle, ShieldCheck } from 'lucide-react';
import { siteConfig } from '../../data/siteContent';
import '../Warranty/WarrantyPage.css';

export const RefundPage: React.FC = () => {
  useEffect(() => {
    document.title = 'REFUND & REPLACEMENT POLICY — Hunting Projectors';
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="policy-page">
      <div className="container policy-container">
        
        <header className="policy-header">
          <span className="eyebrow">
            <RefreshCw size={14} />
            BUYER ASSURANCE
          </span>
          <h1 className="display-title">REFUND & REPLACEMENT POLICY.</h1>
          <p className="policy-meta">
            Managed directly by <strong>{siteConfig.entity.owner}</strong>, {siteConfig.entity.locationLabel}.
          </p>
        </header>

        <div className="policy-content-card">
          
          <section className="policy-section-block">
            <h2>1. Policy Overview</h2>
            <p>
              At Hunting Projectors, customer satisfaction and trust in our optical craftsmanship are paramount. Because all projection units are high-precision optoelectronic devices calibrated at our Chennai facility, we provide clear, transparent guidelines regarding replacements and refunds.
            </p>
          </section>

          <section className="policy-section-block">
            <h2>2. Replacement Eligibility</h2>
            <p>
              A unit is eligible for immediate priority brand replacement if:
            </p>
            <ul className="policy-bullets">
              <li>
                <CheckCircle2 size={16} className="bullet-icon" />
                <span><strong>Dead on Arrival (DOA):</strong> The unit fails to power on, displays vertical sensor lines, or fails to focus out of the box upon delivery.</span>
              </li>
              <li>
                <CheckCircle2 size={16} className="bullet-icon" />
                <span><strong>Transit Damage:</strong> The packaging or internal projector chassis suffered documented physical impact during courier handling.</span>
              </li>
              <li>
                <CheckCircle2 size={16} className="bullet-icon" />
                <span><strong>Specification Discrepancy:</strong> The delivered unit model does not match the product confirmed on your invoice.</span>
              </li>
            </ul>
          </section>

          <section className="policy-section-block">
            <h2>3. Return Guidelines & Condition Requirements</h2>
            <p>
              To process a return or replacement, the product must be returned with:
            </p>
            <ul className="policy-bullets muted-bullets">
              <li>All original packaging materials, EPE foam blocks, cables, and remote control.</li>
              <li>The original printed Warranty Registration Card and serial number tags intact.</li>
              <li>No evidence of unauthorized disassembling, third-party screws removed, or physical drop marks.</li>
            </ul>
          </section>

          <section className="policy-section-block">
            <h2>4. Refund Processing Timeframe</h2>
            <p>
              Upon receipt of the returned item at our Chennai facility, our optical QA engineers inspect the serial number and internal diagnostics. Approved refunds are credited directly to the customer’s original source account or NEFT/RTGS bank transfer within 5 to 7 working business days.
            </p>
          </section>

          <section className="policy-section-block">
            <h2>5. Contact for Returns & Claims</h2>
            <div className="policy-entity-notice">
              <strong>Support Department:</strong> {siteConfig.entity.owner} — Claims Desk<br />
              <strong>Facility Address:</strong> {siteConfig.contact.address.line1}, {siteConfig.contact.address.city}, {siteConfig.contact.address.state} — {siteConfig.contact.address.pincode}, India.<br />
              <strong>WhatsApp Claims:</strong> {siteConfig.contact.whatsappDisplay} | <strong>Email:</strong> {siteConfig.contact.salesEmail}
            </div>
          </section>

        </div>

      </div>
    </div>
  );
};
