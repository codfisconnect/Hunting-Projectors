import React, { useEffect } from 'react';
import { ShieldCheck, Lock, Eye, FileText } from 'lucide-react';
import { siteConfig } from '../../data/siteContent';
import '../Warranty/WarrantyPage.css';

export const PrivacyPage: React.FC = () => {
  useEffect(() => {
    document.title = 'PRIVACY POLICY — Hunting Projectors & NAP Computers';
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="policy-page">
      <div className="container policy-container">
        
        <header className="policy-header">
          <span className="eyebrow">
            <Lock size={14} />
            DATA INTEGRITY
          </span>
          <h1 className="display-title">PRIVACY POLICY.</h1>
          <p className="policy-meta">
            Governed by <strong>{siteConfig.entity.owner}</strong>, {siteConfig.entity.locationLabel}.
          </p>
        </header>

        <div className="policy-content-card">
          
          <section className="policy-section-block">
            <h2>1. Information We Collect</h2>
            <p>
              When you browse our digital showroom, configure a projector using the Projector Finder, or submit an inquiry for a live demo, we collect only the necessary contact information required to serve you:
            </p>
            <ul className="policy-bullets muted-bullets">
              <li>Contact details: Full Name, Phone / WhatsApp number, Email address, and City/State.</li>
              <li>Preferences: Preferred projector model, room dimensions, throw distance requirements, and message inquiries.</li>
              <li>Local storage state: Cart items and saved wishlist models stored locally in your browser storage.</li>
            </ul>
          </section>

          <section className="policy-section-block">
            <h2>2. How Your Information is Utilized</h2>
            <p>
              Your information is utilized solely for legitimate business purposes:
            </p>
            <ul className="policy-bullets muted-bullets">
              <li>Coordinating live showroom appointments and virtual video demonstrations over WhatsApp.</li>
              <li>Providing customized optical throw calculations, quotations, and dispatch updates.</li>
              <li>Registering your official direct brand warranty serial numbers upon purchase.</li>
            </ul>
          </section>

          <section className="policy-section-block">
            <h2>3. Zero Data Sale Guarantee</h2>
            <p>
              We do not sell, rent, monetize, or trade your personal data to third-party telemarketers, advertising networks, or lead aggregators. Communication is conducted strictly between you and authorized product specialists from NAP Computers & Electronics.
            </p>
          </section>

          <section className="policy-section-block">
            <h2>4. Data Controller & Inquiries</h2>
            <div className="policy-entity-notice">
              <strong>Data Controller:</strong> {siteConfig.entity.owner}<br />
              <strong>Official Address:</strong> {siteConfig.contact.address.line1}, {siteConfig.contact.address.city}, {siteConfig.contact.address.state} — {siteConfig.contact.address.pincode}, India.<br />
              <strong>Privacy Contact:</strong> {siteConfig.contact.email}
            </div>
          </section>

        </div>

      </div>
    </div>
  );
};
