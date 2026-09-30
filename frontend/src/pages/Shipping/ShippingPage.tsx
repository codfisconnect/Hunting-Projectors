import React, { useEffect } from 'react';
import { Truck, PackageCheck, ShieldCheck, MapPin, Video, CheckCircle2 } from 'lucide-react';
import { siteConfig } from '../../data/siteContent';
import '../Warranty/WarrantyPage.css';

export const ShippingPage: React.FC = () => {
  useEffect(() => {
    document.title = 'SHIPPING & PAN-INDIA DELIVERY — Hunting Projectors';
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="policy-page">
      <div className="container policy-container">
        
        <header className="policy-header">
          <span className="eyebrow">
            <Truck size={14} />
            DOORSTEP LOGISTICS
          </span>
          <h1 className="display-title">SHIPPING & DELIVERY POLICY.</h1>
          <p className="policy-meta">
            Directly dispatched from our central facility: <strong>{siteConfig.entity.owner}</strong>, {siteConfig.entity.locationLabel}.
          </p>
        </header>

        <div className="policy-content-card">
          
          <section className="policy-section-block">
            <h2>1. Pan-India Delivery Scope</h2>
            <p>
              Hunting Projectors provides insured door-to-door delivery across all serviceable pin codes in India. Every shipment originates directly from our central fulfillment and testing facility in Chennai, Tamil Nadu.
            </p>
            <p>
              Before dispatch, each optical engine undergoes a 20-minute burn-in test, sensor alignment inspection, and firmware check to ensure zero DOA (dead-on-arrival) occurrences.
            </p>
          </section>

          <section className="policy-section-block">
            <h2>2. Optical-Grade Packaging Standards</h2>
            <p>
              High-precision glass elements require superior shock dampening compared to ordinary consumer electronics. Our packaging architecture includes:
            </p>
            <ul className="policy-bullets">
              <li>
                <CheckCircle2 size={16} className="bullet-icon" />
                <span><strong>Multi-Density EPE Foam Molding:</strong> Custom laser-cut foam blocks suspend the projector chassis without pressure points on the lens housing.</span>
              </li>
              <li>
                <CheckCircle2 size={16} className="bullet-icon" />
                <span><strong>Reinforced Outer Flight Box:</strong> Heavy-duty corrugated container with tamper-evident security tape.</span>
              </li>
              <li>
                <CheckCircle2 size={16} className="bullet-icon" />
                <span><strong>Lens Optical Shield:</strong> Hard-shell magnetic or click-lock cap protecting the glass surface during transit.</span>
              </li>
            </ul>
          </section>

          <section className="policy-section-block">
            <h2>3. Tracking & Delivery Notifications</h2>
            <p>
              Once your order is staged and picked up by our express courier logistics partner in Chennai, you will receive an automatic dispatch notification containing:
            </p>
            <ul className="policy-bullets muted-bullets">
              <li>Air Waybill (AWB) Tracking Number and carrier link.</li>
              <li>Serial Number Certificate linked to your invoice.</li>
              <li>Direct WhatsApp contact for delivery coordination.</li>
            </ul>
          </section>

          <section className="policy-section-block">
            <h2>4. Unboxing Video Recommendation</h2>
            <p>
              For your complete peace of mind, we strongly recommend recording a continuous 60-second video while opening the outer courier carton. In the rare event of transit mishandling or physical carton breach, this video ensures immediate, priority replacement dispatch.
            </p>
          </section>

          <section className="policy-section-block">
            <h2>5. Operating Entity & Warehouse Dispatch Address</h2>
            <div className="policy-entity-notice">
              <strong>Fulfillment Entity:</strong> {siteConfig.entity.owner}<br />
              <strong>Facility Address:</strong> {siteConfig.contact.address.line1}, {siteConfig.contact.address.city}, {siteConfig.contact.address.state} — {siteConfig.contact.address.pincode}, India.<br />
              <strong>Logistics Desk:</strong> {siteConfig.contact.phoneDisplay} | <strong>Email:</strong> {siteConfig.contact.email}
            </div>
          </section>

        </div>

      </div>
    </div>
  );
};
