import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ChevronDown, Sparkles } from 'lucide-react';
import { getProducts } from '../../../services/productService';
import { getPublicCms } from '../../../services/cmsService';
import { Product } from '../../../types/product';
import './HeroExperience.css';

interface HeroExperienceProps {
  onOpenEnquiry: () => void;
}

export const HeroExperience: React.FC<HeroExperienceProps> = ({ onOpenEnquiry }) => {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [flagship, setFlagship] = useState<Product | null>(null);
  const [headline, setHeadline] = useState<string>('SEE BEYOND.');
  const [subheadline, setSubheadline] = useState<string>(
    'Laser-sharp 4K optical projection engineered for cinematic immersion and breathtaking scale at home.'
  );
  const [promoBanner, setPromoBanner] = useState<{ active: boolean; text: string; link: string } | null>(null);

  const heroRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let isMounted = true;
    getProducts({ flagship: true, limit: 1 })
      .then(res => {
        if (isMounted && res.products.length > 0) {
          setFlagship(res.products[0]);
        }
      })
      .catch(err => {
        console.warn('HeroExperience flagship fetch fallback:', err);
      });

    // Fetch dynamic CMS configurations
    getPublicCms()
      .then(cms => {
        if (!isMounted) return;
        if (cms.cms_hero) {
          if (cms.cms_hero.headline && cms.cms_hero.headline.trim()) {
            setHeadline(cms.cms_hero.headline.trim());
          }
          if (cms.cms_hero.subheadline && cms.cms_hero.subheadline.trim()) {
            setSubheadline(cms.cms_hero.subheadline.trim());
          }
        }
        if (cms.cms_banners && cms.cms_banners.active && cms.cms_banners.text) {
          setPromoBanner({
            active: true,
            text: cms.cms_banners.text,
            link: cms.cms_banners.link || '/contact',
          });
        }
      })
      .catch(() => {});

    return () => {
      isMounted = false;
    };
  }, []);

  // Track mouse for ambient subtle glow
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!heroRef.current) return;
      const rect = heroRef.current.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
      const y = ((e.clientY - rect.top) / rect.height - 0.5) * 2;
      setMousePos({ x, y });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const scrollToNext = () => {
    const nextEl = document.getElementById('featured-products-section');
    if (nextEl) {
      nextEl.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section ref={heroRef} className="hero-experience-section" aria-label="Hero Launch Experience">
      {/* Full-bleed responsive background image */}
      <div className="hero-background">
        <picture>
          {/* Mobile-specific portrait hero: exact supplied cinematic projector home theater setup */}
          <source media="(max-width: 768px)" srcSet="/images/mobile-hero-projector.webp" type="image/webp" />
          <source media="(max-width: 768px)" srcSet="/images/mobile-hero-projector.png" type="image/png" />
          {/* Desktop high-res cinematic hero */}
          <source srcSet="/assets/hero/hunting-luxury-home-cinema-hero-2400.webp" type="image/webp" />
          <img
            src="/assets/hero/hunting-luxury-home-cinema-hero-2400.jpg"
            alt="Hunting Projectors cinematic 4K home theater setup"
            className="hero-background-img"
            fetchPriority="high"
            loading="eager"
            decoding="async"
            draggable={false}
          />
        </picture>
        <div className="hero-gradient" />
      </div>

      {/* Volumetric lighting effects */}
      <div className="hero-light-cone" />
      <div
        className="hero-ambient-glow"
        style={{
          transform: `translate(${mousePos.x * 20}px, ${mousePos.y * 15}px)`,
        }}
      />

      {/* Hero Content Overlay positioned cleanly in the upper-left */}
      <div className="hero-container">
        <div className="hero-card-panel">
          <div className="hero-eyebrow-row">
            <div className="hero-badge">
              <Sparkles size={12} className="hero-badge-icon" />
              <span>PREMIUM HOME CINEMA</span>
            </div>
          </div>

          <div className="hero-title-area">
            <h1 className="hero-main-title">{headline}</h1>
            <p className="hero-subtitle">{subheadline}</p>
          </div>

          {/* Dynamic Promotional Banner (if enabled in Admin CMS) */}
          {promoBanner && promoBanner.active && (
            <div className="hero-promo-banner-pill" style={{
              margin: '12px 0 16px 0',
              padding: '8px 14px',
              background: 'rgba(212, 160, 23, 0.15)',
              border: '1px solid rgba(212, 160, 23, 0.4)',
              borderRadius: '6px',
              fontSize: '0.85rem',
              color: '#FAD02C',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              maxWidth: 'fit-content'
            }}>
              <Sparkles size={14} />
              <span>{promoBanner.text}</span>
              {promoBanner.link && (
                <Link to={promoBanner.link} style={{ color: '#fff', textDecoration: 'underline', marginLeft: '6px', fontWeight: 600 }}>
                  Details
                </Link>
              )}
            </div>
          )}

          <div className="hero-cta-group">
            <Link to="/projector-finder" className="btn-primary hero-btn-main">
              <span>FIND YOUR PROJECTOR</span>
              <ArrowRight size={15} />
            </Link>
            <Link to="/products" className="btn-secondary hero-btn-sub">
              <span>EXPLORE PROJECTORS</span>
            </Link>
          </div>
        </div>

        <button
          type="button"
          className="hero-scroll-indicator"
          onClick={scrollToNext}
          aria-label="Scroll to featured projectors"
        >
          <span className="scroll-text">DISCOVER</span>
          <div className="scroll-chevron-wrap">
            <ChevronDown size={18} className="scroll-chevron" />
          </div>
        </button>
      </div>
    </section>
  );
};
