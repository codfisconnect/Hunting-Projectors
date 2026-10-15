import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Sparkles, 
  ChevronLeft, 
  ChevronRight, 
  CheckCircle2, 
  ShieldCheck, 
  ArrowRight, 
  Sliders, 
  Tv, 
  Sun, 
  Clock, 
  Maximize, 
  BatteryCharging, 
  Cpu, 
  MapPin, 
  Info,
  Layers,
  ZoomIn
} from 'lucide-react';
import { SHOWROOM_WARRIOR_MODELS, ShowroomProduct } from '../../data/showroomProducts';
import { getProducts } from '../../services/productService';
import { Product } from '../../types/product';
import { siteConfig } from '../../data/siteContent';
import './ExperiencePage.css';

interface ExperiencePageProps {
  onOpenEnquiry: (productName?: string) => void;
}

export const ExperiencePage: React.FC<ExperiencePageProps> = ({ onOpenEnquiry }) => {
  const [selectedId, setSelectedId] = useState<string>('warrior-001');
  const [catalog, setCatalog] = useState<Product[]>([]);
  const [isPosterEnlarged, setIsPosterEnlarged] = useState<boolean>(false);

  useEffect(() => {
    document.title = 'THE HUNTING SHOWROOM — Explore Model Warrior 001, 002 & 003';
    window.scrollTo(0, 0);

    let isMounted = true;
    getProducts()
      .then(res => {
        if (isMounted) setCatalog(res.products);
      })
      .catch(err => {
        console.warn('Showroom catalog fetch warning:', err);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const currentIndex = SHOWROOM_WARRIOR_MODELS.findIndex(p => p.id === selectedId);
  const activeProduct: ShowroomProduct = SHOWROOM_WARRIOR_MODELS[currentIndex] || SHOWROOM_WARRIOR_MODELS[0];

  // Look up matched catalog product if available
  const matchedCatalogProduct = catalog.find(p => p.slug === activeProduct.catalogSlug);

  const handlePrev = () => {
    const nextIdx = (currentIndex - 1 + SHOWROOM_WARRIOR_MODELS.length) % SHOWROOM_WARRIOR_MODELS.length;
    setSelectedId(SHOWROOM_WARRIOR_MODELS[nextIdx].id);
  };

  const handleNext = () => {
    const nextIdx = (currentIndex + 1) % SHOWROOM_WARRIOR_MODELS.length;
    setSelectedId(SHOWROOM_WARRIOR_MODELS[nextIdx].id);
  };

  return (
    <div className="experience-page showroom-page">
      
      {/* SECTION A — Compact Showroom Hero */}
      <section className="showroom-hero-section text-center">
        <div className="container">
          <span className="eyebrow showroom-eyebrow">
            <Sparkles size={13} className="eyebrow-icon" />
            THE HUNTING SHOWROOM
          </span>
          <h1 className="showroom-main-headline">Meet your next projector.</h1>
          <p className="showroom-hero-desc">
            Explore the flagship Warrior series engineered for immense cinematic scale, vivid high-contrast optics, and seamless wireless entertainment.
          </p>

          {/* Compact Product Quick Switcher Pill Bar */}
          <div className="showroom-quick-pills" role="tablist" aria-label="Projector model selector">
            {SHOWROOM_WARRIOR_MODELS.map((item, idx) => {
              const isSelected = item.id === activeProduct.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  role="tab"
                  aria-selected={isSelected}
                  className={`showroom-pill-btn ${isSelected ? 'active' : ''}`}
                  onClick={() => setSelectedId(item.id)}
                  style={{
                    '--pill-accent': item.themeColor
                  } as React.CSSProperties}
                >
                  <span className="pill-index">0{idx + 1}</span>
                  <span className="pill-name">{item.name}</span>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* SECTION B — Main Interactive Product Stage */}
      <section 
        className="showroom-stage-section" 
        style={{
          '--stage-ambient': activeProduct.ambientGlow,
          '--stage-accent': activeProduct.themeColor
        } as React.CSSProperties}
      >
        <div className="container-wide">
          
          <div className="showroom-stage-wrapper">
            
            {/* Stage Backdrop & Subtle Radial Glow */}
            <div className="stage-ambient-glow" aria-hidden="true" />

            {/* Stage Header Info Bar */}
            <div className="stage-top-meta">
              <div className="stage-meta-left">
                <span className="stage-badge-pill" style={{ borderColor: activeProduct.themeColor, color: activeProduct.themeColor }}>
                  {activeProduct.badge}
                </span>
                <span className="stage-model-code">{activeProduct.code}</span>
              </div>

              <div className="stage-navigation-arrows">
                <button
                  type="button"
                  className="stage-nav-btn"
                  onClick={handlePrev}
                  aria-label="Previous projector"
                  title="Previous model"
                >
                  <ChevronLeft size={18} />
                </button>
                <span className="stage-nav-counter">
                  0{currentIndex + 1} / 0{SHOWROOM_WARRIOR_MODELS.length}
                </span>
                <button
                  type="button"
                  className="stage-nav-btn"
                  onClick={handleNext}
                  aria-label="Next projector"
                  title="Next model"
                >
                  <ChevronRight size={18} />
                </button>
              </div>
            </div>

            {/* Center Stage Presentation Canvas */}
            <div className="stage-center-display">
              
              <div className="stage-artwork-frame">
                <img
                  src={activeProduct.posterImage}
                  alt={`${activeProduct.name} official artwork`}
                  className="stage-poster-img"
                  loading="eager"
                  onClick={() => setIsPosterEnlarged(true)}
                  title="Click to view full poster artwork"
                />

                <button
                  type="button"
                  className="stage-artwork-zoom-trigger"
                  onClick={() => setIsPosterEnlarged(true)}
                  aria-label="Enlarge campaign artwork"
                >
                  <ZoomIn size={15} />
                  <span>Enlarge Artwork</span>
                </button>
              </div>

              {/* Stage Identity Panel */}
              <div className="stage-identity-card">
                <div className="stage-identity-header">
                  <h2 className="stage-product-title">{activeProduct.name}</h2>
                  <p className="stage-product-headline">{activeProduct.headline}</p>
                </div>

                {/* API Price or Verified Launch Price */}
                <div className="stage-pricing-block">
                  <div className="stage-price-group">
                    <span className="price-tag-label">SPECIAL LAUNCH PRICE</span>
                    <div className="price-amount-row">
                      <span className="price-currency">₹</span>
                      <span className="price-value">
                        {matchedCatalogProduct?.price 
                          ? matchedCatalogProduct.price.toLocaleString('en-IN') 
                          : (activeProduct.id === 'warrior-003' ? '55,000' : '22,000')}
                      </span>
                      <span className="price-tax-badge">INC. GST</span>
                    </div>
                  </div>
                  <div className="stage-stock-status">
                    <span className="stock-dot" />
                    <span>In Stock • Ready to Ship</span>
                  </div>
                </div>

                {/* Quick Key Metrics Ticker */}
                <div className="stage-key-metrics-grid">
                  <div className="metric-chip">
                    <Tv size={16} className="metric-icon" />
                    <div className="metric-text-group">
                      <span className="metric-label">Max Canvas</span>
                      <span className="metric-val">{activeProduct.specs.screenScale}</span>
                    </div>
                  </div>

                  <div className="metric-chip">
                    <Sun size={16} className="metric-icon" />
                    <div className="metric-text-group">
                      <span className="metric-label">Luminance</span>
                      <span className="metric-val">{activeProduct.specs.brightness}</span>
                    </div>
                  </div>

                  <div className="metric-chip">
                    <Clock size={16} className="metric-icon" />
                    <div className="metric-text-group">
                      <span className="metric-label">Lamp Reliability</span>
                      <span className="metric-val">{activeProduct.specs.lampLife}</span>
                    </div>
                  </div>

                  <div className="metric-chip">
                    <BatteryCharging size={16} className="metric-icon" />
                    <div className="metric-text-group">
                      <span className="metric-label">Continuous Runtime</span>
                      <span className="metric-val">{activeProduct.specs.soundOrBattery}</span>
                    </div>
                  </div>
                </div>

                {/* Primary Action Buttons */}
                <div className="stage-actions-row">
                  {matchedCatalogProduct ? (
                    <Link
                      to={`/products/${matchedCatalogProduct.slug}`}
                      className="btn-primary stage-cta-btn"
                    >
                      <span>VIEW FULL SPECIFICATIONS</span>
                      <ArrowRight size={16} />
                    </Link>
                  ) : (
                    <Link
                      to="/products"
                      className="btn-primary stage-cta-btn"
                    >
                      <span>EXPLORE PROJECTOR CATALOG</span>
                      <ArrowRight size={16} />
                    </Link>
                  )}

                  <button
                    type="button"
                    className="btn-secondary stage-enquiry-btn"
                    onClick={() => onOpenEnquiry(activeProduct.name)}
                  >
                    ENQUIRE ABOUT {activeProduct.name.toUpperCase()}
                  </button>
                </div>

                {/* Honest Catalog Matching Notice */}
                <div className="stage-disclaimer-note">
                  <Info size={13} className="info-icon" />
                  <span>
                    Official Hunting campaign artwork. {matchedCatalogProduct ? `Cross-referenced with catalog model ${matchedCatalogProduct.name}.` : 'Verified manufacturer technical specifications shown below.'}
                  </span>
                </div>

              </div>

            </div>

          </div>

        </div>
      </section>

      {/* SECTION C — Product Selector Cards */}
      <section className="showroom-selector-section" aria-label="Selectable product collection">
        <div className="container-wide">
          <div className="section-header-compact">
            <div>
              <span className="eyebrow">COLLECTION OVERVIEW</span>
              <h2 className="display-section">Choose Your Warrior Edition</h2>
            </div>
            <p className="selector-section-lead">
              Select any model to preview its optical profile, hardware features, and verified warranty package.
            </p>
          </div>

          <div className="showroom-cards-grid">
            {SHOWROOM_WARRIOR_MODELS.map((item, idx) => {
              const isSelected = item.id === activeProduct.id;
              const matched = catalog.find(p => p.slug === item.catalogSlug);
              const priceDisplay = matched?.price 
                ? `₹${matched.price.toLocaleString('en-IN')}` 
                : (item.id === 'warrior-003' ? '₹55,000' : '₹22,000');

              return (
                <div
                  key={item.id}
                  className={`showroom-card ${isSelected ? 'selected' : ''}`}
                  onClick={() => setSelectedId(item.id)}
                  tabIndex={0}
                  role="button"
                  aria-pressed={isSelected}
                  onKeyDown={e => e.key === 'Enter' && setSelectedId(item.id)}
                  style={{
                    '--card-theme': item.themeColor
                  } as React.CSSProperties}
                >
                  <div className="card-artwork-thumb">
                    <img 
                      src={item.posterImage} 
                      alt={item.name} 
                      className="card-thumb-img" 
                      loading="lazy"
                    />
                    <div className="card-thumb-overlay" />
                    <span className="card-index-pill">0{idx + 1}</span>
                    {isSelected && (
                      <span className="card-active-pill">
                        <CheckCircle2 size={12} />
                        ACTIVE PREVIEW
                      </span>
                    )}
                  </div>

                  <div className="card-details-body">
                    <div className="card-title-row">
                      <h3 className="card-name">{item.name}</h3>
                      <span className="card-price">{priceDisplay}</span>
                    </div>
                    
                    <p className="card-headline-snippet">{item.headline}</p>

                    <div className="card-specs-mini">
                      <span>{item.specs.resolution.split('(')[0].trim()}</span>
                      <span className="dot-divider">•</span>
                      <span>{item.specs.brightness}</span>
                      <span className="dot-divider">•</span>
                      <span>{item.specs.screenScale}</span>
                    </div>

                    <button
                      type="button"
                      className={`btn-secondary card-explore-btn ${isSelected ? 'active-btn' : ''}`}
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedId(item.id);
                      }}
                    >
                      {isSelected ? 'Currently Viewing' : 'Explore Product'}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* SECTION D — Verified Product Highlights & Specifications */}
      <section className="showroom-specs-section">
        <div className="container">
          
          <div className="specs-card-container">
            
            <div className="specs-card-header">
              <div>
                <span className="eyebrow" style={{ color: activeProduct.themeColor }}>
                  VERIFIED HARDWARE SPECIFICATIONS
                </span>
                <h3 className="specs-title">{activeProduct.name} Technical Sheet</h3>
              </div>
              <div className="specs-warranty-badge">
                <ShieldCheck size={18} />
                <span>{activeProduct.specs.warranty}</span>
              </div>
            </div>

            {/* Spec Matrix Grid */}
            <div className="specs-matrix-grid">
              
              <div className="spec-item">
                <span className="spec-label">Optical Resolution</span>
                <span className="spec-value">{activeProduct.specs.resolution}</span>
              </div>

              <div className="spec-item">
                <span className="spec-label">ANSI Luminance</span>
                <span className="spec-value">{activeProduct.specs.brightness}</span>
              </div>

              <div className="spec-item">
                <span className="spec-label">Dynamic Contrast</span>
                <span className="spec-value">{activeProduct.specs.contrast}</span>
              </div>

              <div className="spec-item">
                <span className="spec-label">Projection Canvas</span>
                <span className="spec-value">{activeProduct.specs.screenScale}</span>
              </div>

              <div className="spec-item">
                <span className="spec-label">Light Engine Life</span>
                <span className="spec-value">{activeProduct.specs.lampLife}</span>
              </div>

              <div className="spec-item">
                <span className="spec-label">Battery / Continuous Use</span>
                <span className="spec-value">{activeProduct.specs.soundOrBattery}</span>
              </div>

            </div>

            {/* Smart Software & Connectivity Capabilities */}
            <div className="specs-features-block">
              <h4 className="features-block-heading">Core Smart Features & Connectivity</h4>
              <div className="features-chips-cloud">
                {activeProduct.specs.smartFeatures.map((feat, idx) => (
                  <span key={idx} className="feature-pill">
                    <CheckCircle2 size={13} className="feature-check" />
                    <span>{feat}</span>
                  </span>
                ))}
              </div>
            </div>

            {/* Editorial Technical Summary */}
            {activeProduct.note && (
              <div className="specs-editorial-note">
                <Cpu size={16} className="note-icon" />
                <p>{activeProduct.note}</p>
              </div>
            )}

          </div>

        </div>
      </section>

      {/* SECTION E — Direct Visit / In-Person Demo Support */}
      <section className="showroom-visit-section">
        <div className="container">
          <div className="visit-card">
            <div className="visit-icon-box">
              <MapPin size={28} />
            </div>
            <div className="visit-content">
              <span className="eyebrow">IN-PERSON CHENNAI SHOWROOM</span>
              <h3 className="visit-title">Experience the Real Lenses Side-by-Side</h3>
              <p className="visit-desc">
                Witness 1500 to 6500 ANSI lumen optical brightness on ambient light rejecting screens at our Chennai flagship studio. Get customized room throw consultations directly from our audio-visual engineers.
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
                onClick={() => onOpenEnquiry('Chennai Showroom Private Booking')}
              >
                SCHEDULE PRIVATE VISIT
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Poster Enlarge Modal */}
      {isPosterEnlarged && (
        <div 
          className="poster-modal-overlay" 
          onClick={() => setIsPosterEnlarged(false)}
          role="dialog"
          aria-modal="true"
        >
          <div className="poster-modal-content" onClick={e => e.stopPropagation()}>
            <button 
              type="button" 
              className="poster-modal-close"
              onClick={() => setIsPosterEnlarged(false)}
              aria-label="Close enlarged view"
            >
              ✕
            </button>
            <img 
              src={activeProduct.posterImage} 
              alt={`${activeProduct.name} full artwork`} 
              className="poster-modal-image"
            />
            <div className="poster-modal-caption">
              <strong>{activeProduct.name}</strong> — {activeProduct.headline}
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
