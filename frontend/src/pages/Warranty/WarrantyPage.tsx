import React, { useEffect } from 'react';
import { ShieldCheck, CheckCircle2, AlertCircle, Wrench, Phone, MessageCircle } from 'lucide-react';
import { siteConfig, getWhatsAppLink, getPhoneLink } from '../../data/siteContent';
import './WarrantyPage.css';

export const WarrantyPage: React.FC = () => {
  useEffect(() => {
    document.title = 'WARRANTY GUIDELINES — Hunting Projectors Brand Policy';
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="policy-page">
      <div className="container policy-container">
        
        <header className="policy-header">
          <span className="eyebrow">
            <ShieldCheck size={14} />
            DIRECT BRAND PROTECTION
          </span>
          <h1 className="display-title">WARRANTY POLICY.</h1>
          <p className="policy-meta">
            Operated & serviced directly by <strong>{siteConfig.entity.owner}</strong>, {siteConfig.entity.locationLabel}.
          </p>
        </header>

        <div className="policy-content-card">
          
          <section className="policy-section-block">
            <h2>1. Direct Brand Coverage</h2>
            <p>
              All Hunting projection systems purchased through our official website or authorized Chennai showroom are covered by the official direct brand warranty. Because you are acquiring hardware directly from the brand entity without intermediary resellers, your warranty records are maintained in our direct serial database.
            </p>
            <p>
              Official warranty terms and specified durations are recorded on the physical Warranty Certificate card delivered inside your projector flight case.
            </p>
          </section>

          <section className="policy-section-block">
            <h2>2. What is Protected</h2>
            <ul className="policy-bullets">
              <li>
                <CheckCircle2 size={16} className="bullet-icon" />
                <span><strong>Optical Engine & Laser Source:</strong> Protection against optical sensor misalignment, defective DMD micromirror pixels, and premature laser diode degradation.</span>
              </li>
              <li>
                <CheckCircle2 size={16} className="bullet-icon" />
                <span><strong>Main Logic Board & Power Supply:</strong> Failure of internal circuitry, HDMI controller ICs, Bluetooth/Wi-Fi modules, or internal power transformation units under normal residential usage.</span>
              </li>
              <li>
                <CheckCircle2 size={16} className="bullet-icon" />
                <span><strong>Liquid Vapor Cooling & Fan Systems:</strong> Defective cooling fans, abnormal bearing vibration, or thermal protection tripping.</span>
              </li>
              <li>
                <CheckCircle2 size={16} className="bullet-icon" />
                <span><strong>Integrated Acoustics:</strong> Internal neodymium speaker drivers and audio amplifier boards.</span>
              </li>
            </ul>
          </section>

          <section className="policy-section-block">
            <h2>3. Exclusions from Warranty</h2>
            <p>
              To maintain fair and rigorous quality standards, warranty coverage does not extend to:
            </p>
            <ul className="policy-bullets muted-bullets">
              <li>Physical impact damage, drops, dents, cracked chassis, or shattered optical lenses resulting from mishandling.</li>
              <li>Water ingress, liquid spills, or exposure to open weather rain during outdoor operation.</li>
              <li>Severe electrical power surges or lightning strikes without appropriate surge protection.</li>
              <li>Unauthorized opening of the sealed optical chamber or repairs attempted by unauthorized third-party workshops.</li>
            </ul>
          </section>

          <section className="policy-section-block">
            <h2>4. Step-by-Step Claim Procedure</h2>
            <div className="claim-steps-grid">
              <div className="claim-step-box">
                <span className="step-badge">STEP 01</span>
                <h4>Locate Serial Number</h4>
                <p>Find the serial number label on the bottom of your projector or your invoice.</p>
              </div>
              <div className="claim-step-box">
                <span className="step-badge">STEP 02</span>
                <h4>Connect via WhatsApp</h4>
                <p>Send a short video of the issue to our dedicated technical desk at {siteConfig.contact.whatsappDisplay}.</p>
              </div>
              <div className="claim-step-box">
                <span className="step-badge">STEP 03</span>
                <h4>Direct Resolution</h4>
                <p>Our engineers will troubleshoot via video call or arrange insured reverse pickup to Chennai.</p>
              </div>
            </div>
          </section>

          <section className="policy-section-block">
            <h2>5. Service Facility & Entity Details</h2>
            <div className="policy-entity-notice">
              <strong>Warranty Fulfilled By:</strong> {siteConfig.entity.owner}<br />
              <strong>Facility Address:</strong> {siteConfig.contact.address.line1}, {siteConfig.contact.address.city}, {siteConfig.contact.address.state} — {siteConfig.contact.address.pincode}, India.<br />
              <strong>Support Hotline:</strong> {siteConfig.contact.phoneDisplay} | <strong>Email:</strong> {siteConfig.contact.email}
            </div>
          </section>

        </div>

      </div>
    </div>
  );
};
