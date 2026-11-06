import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ChevronDown, Sparkles } from 'lucide-react';
import { getProducts } from '../../../services/productService';
import { Product } from '../../../types/product';
import { siteConfig } from '../../../data/siteContent';
import './HeroExperience.css';

interface HeroExperienceProps {
  onOpenEnquiry: () => void;
}

export const HeroExperience: React.FC<HeroExperienceProps> = ({ onOpenEnquiry }) => {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [flagship, setFlagship] = useState<Product | null>(null);
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

    return () => {
      isMounted = false;
    };
  }, []);

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
      
      {/* Background Volumetric Lighting Beams */}
      <div className="hero-light-cone" />
      <div 
        className="hero-ambient-glow"
        style={{
          transform: `translate(${mousePos.x * 20}px, ${mousePos.y * 15}px)`
        }}
      />

      {/* Main Content Container */}
      <div className="container hero-container">
        
        {/* Top Eyebrow Metadata */}
        <div className="hero-eyebrow-row">
          <div className="hero-badge">
            <Sparkles size={13} className="hero-badge-icon" />
            <span>NEW 4K OPTICAL BENCHMARK</span>
          </div>
          <span className="hero-brand-tag">
            {siteConfig.brand.name} {siteConfig.brand.subname} • CHENNAI, INDIA
          </span>
        </div>

        {/* Large Editorial Headline */}
        <div className="hero-title-area">
          <h1 className="hero-main-title">
            <span className="title-line">SEE</span>
            <span className="title-line highlight">BEYOND.</span>
          </h1>
          <p className="hero-subtitle">
            Laser-sharp 4K optical projection engineered for cinematic immersion at home.
          </p>
        </div>

        {/* Centerpiece Luxury Hero Cinema Stage */}
        <div className="hero-projector-stage">
          <div className="hero-cinema-viewport">
            <picture>
              <source 
                media="(max-width: 768px)" 
                srcSet="/assets/hero/hunting-luxury-home-cinema-hero-mobile.webp" 
                type="image/webp" 
              />
              <source 
                media="(max-width: 768px)" 
                srcSet="/assets/hero/hunting-luxury-home-cinema-hero-mobile.jpg" 
                type="image/jpeg" 
              />
              <source 
                srcSet="/assets/hero/hunting-luxury-home-cinema-hero-2400.webp" 
                type="image/webp" 
              />
              <img 
                src="/assets/hero/hunting-luxury-home-cinema-hero-2400.jpg" 
                alt="Hunting 4K Laser Cinema Projector in Luxury Living Room" 
                className="hero-cinema-img"
                fetchPriority="high"
                loading="eager"
                decoding="async"
                draggable={false}
              />
            </picture>

            {/* Subtle atmospheric vignette */}
            <div className="hero-visual-vignette" />

            {/* Editorial Glass Overlay Badges */}
            <div className="hero-glass-pill pill-bottom-left">
              <span className="pill-dot" />
              <div className="pill-content">
                <span className="pill-title">HUNTING OPTICAL ENGINE</span>
                <span className="pill-meta">Direct Laser • Precision Glass</span>
              </div>
            </div>

            <div className="hero-glass-pill pill-top-right">
              <div className="pill-content align-right">
                <span className="pill-title">UP TO 150" CINEMATIC SCALE</span>
                <span className="pill-meta">Ambient Light Rejecting Display</span>
              </div>
            </div>
          </div>
        </div>

        {/* Minimal Hero CTAs */}
        <div className="hero-cta-group">
          <Link to="/products" className="btn-primary hero-btn-main">
            <span>EXPLORE PROJECTORS</span>
            <ArrowRight size={17} />
          </Link>

          <Link to="/projector-finder" className="btn-secondary hero-btn-sub">
            <span>FIND YOUR PROJECTOR</span>
          </Link>
        </div>

        {/* Minimal Scroll Indicator */}
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
