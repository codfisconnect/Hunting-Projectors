import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ChevronDown, Sparkles } from 'lucide-react';
import { getProducts } from '../../../services/productService';
import { Product } from '../../../types/product';
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
      {/* Full-bleed background image */}
      <div className="hero-background">
        <picture>
          <source media="(max-width: 768px)" srcSet="/assets/hero/hunting-luxury-home-cinema-hero-mobile.webp" type="image/webp" />
          <source media="(max-width: 768px)" srcSet="/assets/hero/hunting-luxury-home-cinema-hero-mobile.jpg" type="image/jpeg" />
          <source srcSet="/assets/hero/hunting-luxury-home-cinema-hero-2400.webp" type="image/webp" />
          <img
            src="/assets/hero/hunting-luxury-home-cinema-hero-2400.jpg"
            alt="Premium home cinema with projector and screen"
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
            <h1 className="hero-main-title">SEE BEYOND.</h1>
            <p className="hero-subtitle">
              Laser-sharp 4K optical projection engineered for cinematic immersion at home.
            </p>
          </div>

          <div className="hero-cta-group">
            <Link to="/products" className="btn-primary hero-btn-main">
              <span>EXPLORE PROJECTORS</span>
              <ArrowRight size={15} />
            </Link>
            <Link to="/projector-finder" className="btn-secondary hero-btn-sub">
              <span>FIND YOUR PROJECTOR</span>
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
