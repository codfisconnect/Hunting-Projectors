import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ShieldCheck, Cpu, Eye, Sparkles } from 'lucide-react';
import { siteConfig } from '../../../data/siteContent';
import './BrandStory.css';

export const BrandStory: React.FC = () => {
  return (
    <section className="brand-story-section" aria-label="Brand Philosophy and Story">
      <div className="container brand-story-container">
        
        {/* Massive Editorial Headline */}
        <div className="story-header text-center">
          <span className="eyebrow">
            <Sparkles size={12} />
            THE HUNTING MANIFESTO
          </span>

          <h2 className="story-huge-title">
            WE DON'T JUST<br />SELL PROJECTORS.<br />
            <span className="story-glow-text">WE CREATE BIGGER EXPERIENCES.</span>
          </h2>
        </div>

        {/* Narrative & Pillars Grid */}
        <div className="story-narrative-grid">
          
          <div className="story-lead-col">
            <p className="story-lead-para">
              We started Hunting with a singular obsession: to liberate the human visual experience from the rigid confines of glossy television glass.
            </p>
            <p className="story-body-para">
              A television is furniture that commands your room even when powered off. A Hunting projector is invisible until the lights dim — expanding into a colossal 120" or 150" optical canvas that mirrors the magic of reference commercial cinemas.
            </p>
            <div className="story-link-wrap">
              <Link to="/about" className="btn-secondary">
                <span>READ COMPLETE BRAND STORY</span>
                <ArrowRight size={15} />
              </Link>
            </div>
          </div>

          <div className="story-pillars-col">
            <div className="story-pillar-item">
              <div className="story-pillar-icon">
                <Cpu size={20} />
              </div>
              <div>
                <h4 className="story-pillar-title">OPTICAL PRECISION FIRST</h4>
                <p className="story-pillar-text">
                  We refuse plastic lenses. Every Hunting system is engineered with multi-element, low-dispersion optical glass for razor corner sharpness.
                </p>
              </div>
            </div>

            <div className="story-pillar-item">
              <div className="story-pillar-icon">
                <Eye size={20} />
              </div>
              <div>
                <h4 className="story-pillar-title">HEALTHIER REFLECTED LIGHT</h4>
                <p className="story-pillar-text">
                  Unlike back-lit LED televisions that beam intense light straight into your retina, projected light reflects naturally off screens, eliminating eye fatigue during marathon viewing.
                </p>
              </div>
            </div>

            <div className="story-pillar-item">
              <div className="story-pillar-icon">
                <ShieldCheck size={20} />
              </div>
              <div>
                <h4 className="story-pillar-title">DIRECT FACTORY INTEGRITY</h4>
                <p className="story-pillar-text">
                  Supplied, owned, and serviced directly by NAP Computers & Electronics, Chennai. Honest pricing, genuine optical engineering, and dedicated Indian service support.
                </p>
              </div>
            </div>
          </div>

        </div>

        {/* Brand Ownership Statement Card */}
        <div className="story-ownership-card">
          <div className="ownership-left">
            <span className="ownership-tag">BRAND IDENTITY & PROVENANCE</span>
            <h3 className="ownership-title">{siteConfig.brand.name} {siteConfig.brand.subname}</h3>
            <p className="ownership-desc">
              Customer-facing projection brand engineered for connoisseurs, creators, and cinema spaces.
            </p>
          </div>
          <div className="ownership-right">
            <span className="ownership-tag">OPERATING ENTITY</span>
            <h4 className="operating-name">{siteConfig.entity.owner}</h4>
            <p className="operating-loc">{siteConfig.entity.locationLabel}</p>
            <span className="operating-note">Direct Brand Supply & Doorstep Delivery Across India</span>
          </div>
        </div>

      </div>
    </section>
  );
};
