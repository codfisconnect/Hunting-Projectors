import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Sparkles, 
  ArrowRight, 
  Tv, 
  Sun, 
  Clock, 
  BatteryCharging, 
  ShieldCheck, 
  Cpu, 
  CheckCircle2, 
  MapPin, 
  Eye, 
  SlidersHorizontal,
  ChevronRight,
  Maximize2
} from 'lucide-react';
import { SHOWROOM_WARRIOR_MODELS, ShowroomProduct } from '../../data/showroomProducts';
import { getProducts } from '../../services/productService';
import { Product } from '../../types/product';
import { siteConfig } from '../../data/siteContent';
import { CinemaExperience } from '../../components/home/CinemaExperience/CinemaExperience';
import './ExperiencePage.css';

interface ExperiencePageProps {
  onOpenEnquiry: (productName?: string) => void;
}

export const ExperiencePage: React.FC<ExperiencePageProps> = ({ onOpenEnquiry }) => {
  const [catalog, setCatalog] = useState<Product[]>([]);
  const [activeModelId, setActiveModelId] = useState<string>('warrior-001');
  const [viewMode, setViewMode] = useState<'clean' | 'poster'>('clean');

  useEffect(() => {
    document.title = 'Experience Cinema Differently — Hunting Projectors Showroom';
    window.scrollTo(0, 0);

    let isMounted = true;
    getProducts()
      .then(res => {
        if (isMounted) setCatalog(res.products);
      })
      .catch(err => {
        console.warn('Experience page catalog fetch:', err);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const activeShowroomProduct: ShowroomProduct = 
    SHOWROOM_WARRIOR_MODELS.find(p => p.id === activeModelId) || SHOWROOM_WARRIOR_MODELS[0];

  // Matched API product data
  const matchedCatalogProduct = catalog.find(p => p.slug === activeShowroomProduct.catalogSlug);

  return (
    <div className="experience-page">

      {/* 1. HERO SECTION */}
      <section className="experience-hero-cinematic">
        <div className="hero-radial-backdrop" aria-hidden="true" />
        <div className="container hero-content-grid">
          
          <div className="hero-text-block">
            <span className="eyebrow hero-eyebrow">
              <Sparkles size={13} className="eyebrow-sparkle" />
              THE HUNTING EXPERIENCE
            </span>
            <h1 className="hero-heading">Experience Cinema Differently.</h1>
            <p className="hero-subtext">
              Discover projectors designed to bring the big-screen experience home.
            </p>

            <div className="hero-cta-group">
              <Link to="/products" className="btn-primary hero-primary-btn">
                <span>Explore Projectors</span>
                <ArrowRight size={16} />
              </Link>
              <button
                type="button"
                className="btn-secondary hero-secondary-btn"
                onClick={() => {
                  const target = document.getElementById('warrior-showcase');
                  target?.scrollIntoView({ behavior: 'smooth' });
                }}
              >
                <span>View Warrior Series</span>
              </button>
            </div>

            <div className="hero-specs-strip">
              <div className="hero-spec-item">
                <span className="hero-spec-val">Up to 300"</span>
                <span className="hero-spec-lbl">Screen Scale</span>
              </div>
              <div className="hero-spec-divider" />
              <div className="hero-spec-item">
                <span className="hero-spec-val">True 4K & HDR10</span>
                <span className="hero-spec-lbl">Optical Engine</span>
              </div>
              <div className="hero-spec-divider" />
              <div className="hero-spec-item">
                <span className="hero-spec-val">Pan-India</span>
                <span className="hero-spec-lbl">Doorstep Delivery</span>
              </div>
            </div>
          </div>

          <div className="hero-visual-stage">
            <div className="hero-projector-frame">
              <img
                src="/assets/products/hunting-cinema-x4-hero.svg"
                alt="Hunting Flagship Cinema Projector"
                className="hero-projector-img"
                loading="eager"
              />
              <div className="hero-optical-beam" aria-hidden="true" />
              <div className="hero-chassis-shadow" aria-hidden="true" />
            </div>
            <div className="hero-lens-badge">
              <span className="lens-badge-dot" />
              <span>Precision Optical Glass • Laser Clarified</span>
            </div>
          </div>

        </div>
      </section>

      {/* 2. FEATURED PROJECTOR SHOWCASE */}
      <section id="warrior-showcase" className="showcase-section" aria-label="Featured Projector Showcase">
        <div className="container-wide">
          
          <div className="section-head-centered">
            <span className="eyebrow">FEATURED LINEUP</span>
            <h2 className="display-section">The Warrior Series Collection</h2>
            <p className="section-lead-text">
              Engineered with high-lumen optical engines, built-in battery options, and smart streaming capabilities.
            </p>
          </div>

          {/* Clean / Artwork Switcher */}
          <div className="showcase-view-controls">
            <span className="controls-label">Presentation View:</span>
            <div className="view-toggle-pills" role="group" aria-label="View mode selection">
              <button
                type="button"
                className={`toggle-pill-btn ${viewMode === 'clean' ? 'active' : ''}`}
                onClick={() => setViewMode('clean')}
              >
                <Eye size={13} />
                <span>Studio Hardware</span>
              </button>
              <button
                type="button"
                className={`toggle-pill-btn ${viewMode === 'poster' ? 'active' : ''}`}
                onClick={() => setViewMode('poster')}
              >
                <Maximize2 size={13} />
                <span>Campaign Artwork</span>
              </button>
            </div>
          </div>

          {/* Product Cards Grid */}
          <div className="warrior-cards-grid">
            {SHOWROOM_WARRIOR_MODELS.map((item) => {
              const matched = catalog.find(p => p.slug === item.catalogSlug);
              const price = matched?.price || (item.id === 'warrior-003' ? 55000 : 22000);
              const compareAt = matched?.compareAtPrice || (item.id === 'warrior-003' ? 65000 : 28000);
              const displayImg = viewMode === 'clean' ? item.cleanProductImage : item.posterArtwork;

              return (
                <div 
                  key={item.id} 
                  className={`warrior-product-card ${activeModelId === item.id ? 'card-focused' : ''}`}
                  onMouseEnter={() => setActiveModelId(item.id)}
                  style={{
                    '--card-theme': item.themeColor,
                    '--card-glow': item.ambientGlow
                  } as React.CSSProperties}
                >
                  <div className="card-badge-row">
                    <span className="card-badge-pill" style={{ color: item.themeColor, borderColor: item.themeColor }}>
                      {item.badge}
                    </span>
                    <span className="card-model-code">{item.code}</span>
                  </div>

                  {/* Product Visual Container with consistent dimensions */}
                  <div className={`card-image-stage ${viewMode === 'poster' ? 'stage-poster-aspect' : ''}`}>
                    <img
                      src={displayImg}
                      alt={item.name}
                      className={`card-product-img ${viewMode === 'poster' ? 'img-poster' : 'img-clean'}`}
                      loading="lazy"
                    />
                    <div className="card-ambient-disc" aria-hidden="true" />
                  </div>

                  {/* Product Details Header */}
                  <div className="card-body">
                    <div className="card-header-meta">
                      <h3 className="card-product-name">{item.name}</h3>
                      <p className="card-tagline">{item.headline}</p>
                    </div>

                    {/* Price Block */}
                    <div className="card-price-block">
                      <div className="price-main-row">
                        <span className="price-currency">₹</span>
                        <span className="price-amount">{price.toLocaleString('en-IN')}</span>
                        {compareAt && (
                          <span className="price-compare-at">₹{compareAt.toLocaleString('en-IN')}</span>
                        )}
                      </div>
                      <span className="price-inclusive-badge">Special Launch Price • Inc. GST</span>
                    </div>

                    {/* Verified Technical Specs Grid */}
                    <div className="card-specs-matrix">
                      <div className="spec-tile">
                        <Tv size={14} className="tile-icon" />
                        <div className="tile-info">
                          <span className="tile-label">Resolution</span>
                          <span className="tile-value">{item.specs.resolution.split('(')[0].trim()}</span>
                        </div>
                      </div>

                      <div className="spec-tile">
                        <Sun size={14} className="tile-icon" />
                        <div className="tile-info">
                          <span className="tile-label">Luminance</span>
                          <span className="tile-value">{item.specs.brightness}</span>
                        </div>
                      </div>

                      <div className="spec-tile">
                        <SlidersHorizontal size={14} className="tile-icon" />
                        <div className="tile-info">
                          <span className="tile-label">Max Canvas</span>
                          <span className="tile-value">{item.specs.screenScale}</span>
                        </div>
                      </div>

                      <div className="spec-tile">
                        <BatteryCharging size={14} className="tile-icon" />
                        <div className="tile-info">
                          <span className="tile-label">Runtime</span>
                          <span className="tile-value">{item.specs.soundOrBattery}</span>
                        </div>
                      </div>
                    </div>

                    {/* Smart Feature Pills */}
                    <div className="card-features-chips">
                      {item.specs.smartFeatures.slice(0, 3).map((feat, fIdx) => (
                        <span key={fIdx} className="feature-mini-pill">
                          <CheckCircle2 size={11} className="pill-check" />
                          <span>{feat}</span>
                        </span>
                      ))}
                    </div>

                    {/* Verified Warranty Label */}
                    <div className="card-warranty-note">
                      <ShieldCheck size={14} className="warranty-icon" />
                      <span>{item.specs.warranty}</span>
                    </div>

                    {/* Action Buttons */}
                    <div className="card-actions-row">
                      <Link
                        to={`/products/${item.catalogSlug}`}
                        className="btn-primary card-details-btn"
                      >
                        <span>View Details</span>
                        <ArrowRight size={14} />
                      </Link>

                      <button
                        type="button"
                        className="btn-secondary card-enquire-btn"
                        onClick={() => onOpenEnquiry(item.name)}
                      >
                        Enquire
                      </button>
                    </div>

                  </div>
                </div>
              );
            })}
          </div>

        </div>
      </section>

      {/* 3. CINEMA EXPERIENCE INTERACTIVE SCALE SECTION */}
      <section className="experience-cinema-section">
        <CinemaExperience onOpenEnquiry={() => onOpenEnquiry('Interactive Cinema Scale Consultation')} />
      </section>

      {/* 4. CHENNAI SHOWROOM & TRUST STRIP */}
      <section className="experience-showroom-invite">
        <div className="container">
          <div className="invite-card">
            <div className="invite-icon-wrapper">
              <MapPin size={28} />
            </div>
            <div className="invite-info">
              <span className="eyebrow invite-eyebrow">IN-PERSON SHOWROOM EXPERIENCE</span>
              <h3 className="invite-title">Visit Our Chennai Experience Center</h3>
              <p className="invite-desc">
                Witness side-by-side optical projections on ambient light rejecting screens. Our technical specialists provide hands-on room throw assessments and sound matching.
              </p>
              <div className="invite-badge">
                <ShieldCheck size={15} />
                <span>{siteConfig.entity.owner} • {siteConfig.entity.locationLabel}</span>
              </div>
            </div>
            <div className="invite-actions">
              <button 
                type="button" 
                className="btn-primary invite-btn"
                onClick={() => onOpenEnquiry('Chennai Showroom Private Appointment')}
              >
                <span>Schedule Visit</span>
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
};
