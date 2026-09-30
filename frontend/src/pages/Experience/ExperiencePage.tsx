import React, { useEffect } from 'react';
import { HuntingShowroom } from '../../components/showroom/HuntingShowroom/HuntingShowroom';
import { CinemaExperience } from '../../components/home/CinemaExperience/CinemaExperience';
import { ProductViewer360 } from '../../components/product/ProductViewer/ProductViewer360';
import { products } from '../../data/products';
import { Sparkles, Eye, ShieldCheck, MapPin } from 'lucide-react';
import { siteConfig } from '../../data/siteContent';
import './ExperiencePage.css';

interface ExperiencePageProps {
  onOpenEnquiry: (productName?: string) => void;
}

export const ExperiencePage: React.FC<ExperiencePageProps> = ({ onOpenEnquiry }) => {
  useEffect(() => {
    document.title = 'EXPERIENCE HUNTING — Interactive Digital Showroom & 360 Cinema Simulation';
    window.scrollTo(0, 0);
  }, []);

  const flagship = products[0]; // Hunting Vision X1

  return (
    <div className="experience-page">
      {/* Experience Hero */}
      <section className="experience-hero text-center">
        <div className="container">
          <span className="eyebrow">
            <Sparkles size={12} />
            IMMERSIVE VIRTUAL SHOWROOM
          </span>
          <h1 className="display-title">EXPERIENCE HUNTING.</h1>
          <p className="experience-hero-desc">
            Explore how Hunting projection systems perform under dynamic ambient lighting, expand across 80" to 150" canvases, and inspect 360° hardware engineering.
          </p>
        </div>
      </section>

      {/* 1. Interactive 360 Product Inspection Lab */}
      <section className="experience-360-section">
        <div className="container-wide">
          <div className="exp-360-header">
            <div>
              <span className="eyebrow">LABORATORY INSPECTION</span>
              <h2 className="display-section">360° OPTICAL INSPECTION LAB</h2>
              <p className="exp-sub">
                Drag to inspect aerospace anodized chassis tolerances, optical glass coating rings, knurled focus rings, and cooling heat-sink vents.
              </p>
            </div>
            <button 
              type="button" 
              className="btn-primary"
              onClick={() => onOpenEnquiry(flagship.name)}
            >
              REQUEST LIVE CHENNAI DEMO
            </button>
          </div>

          <div className="exp-360-wrapper">
            <ProductViewer360 product={flagship} />
          </div>
        </div>
      </section>

      {/* 2. Room Environments Switcher (Living Room, Home Cinema, Gaming) */}
      <HuntingShowroom onOpenEnquiry={() => onOpenEnquiry()} />

      {/* 3. Screen Scale Expansion Simulation (80" to 150") */}
      <CinemaExperience onOpenEnquiry={() => onOpenEnquiry()} />

      {/* In-Person Chennai Showroom Invitation */}
      <section className="experience-visit-section">
        <div className="container">
          <div className="visit-card">
            <div className="visit-icon-box">
              <MapPin size={28} />
            </div>
            <div className="visit-content">
              <span className="eyebrow">IN-PERSON SHOWROOM EXPERIENCE</span>
              <h3 className="visit-title">Experience the Real Lenses in Chennai</h3>
              <p className="visit-desc">
                Nothing compares to witnessing 4K optical contrast on an ambient light rejecting screen with your own eyes. Visit our Chennai showroom for side-by-side projector comparisons.
              </p>
              <div className="visit-location-badge">
                <ShieldCheck size={16} />
                <span>{siteConfig.entity.owner} • {siteConfig.entity.locationLabel}</span>
              </div>
            </div>
            <div className="visit-actions">
              <button 
                type="button" 
                className="btn-primary" 
                onClick={() => onOpenEnquiry('Chennai Showroom Visit Booking')}
              >
                SCHEDULE PRIVATE VISIT
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
