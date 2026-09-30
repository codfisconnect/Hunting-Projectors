import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Play, ChevronDown, Sparkles } from 'lucide-react';
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
    const nextEl = document.getElementById('product-reveal-section');
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

        {/* Massive Editorial Headline */}
        <div className="hero-title-area">
          <h1 className="hero-main-title">
            <span className="title-line">SEE</span>
            <span className="title-line highlight">BEYOND.</span>
          </h1>
          <p className="hero-subtitle">
            {siteConfig.brand.heroSubheadline}
          </p>
        </div>

        {/* Centerpiece Hero Projector with Dynamic Pointer Tilt */}
        <div className="hero-projector-stage">
          <div 
            className="hero-projector-parallax-box"
            style={{
              transform: `perspective(1000px) rotateY(${mousePos.x * 9}deg) rotateX(${-mousePos.y * 6}deg) translateY(${mousePos.y * -8}px)`
            }}
          >
            <img 
              src={flagship?.images?.hero || '/assets/products/hunting-vision-x1-hero.svg'} 
              alt={flagship?.name || "Hunting Flagship Projector"} 
              className="hero-projector-img"
              draggable={false}
            />
            {/* Projected beam glow simulation */}
            <div className="hero-lens-flare" />
          </div>

          {/* Technical Specs Floating Micro-cards */}
          <div className="hero-spec-pill left">
            <span className="pill-metric">4K UHD</span>
            <span className="pill-desc">Edge-to-edge optical glass</span>
          </div>
          <div className="hero-spec-pill right">
            <span className="pill-metric">2,600 ANSI</span>
            <span className="pill-desc">Solid-state high luminance</span>
          </div>
        </div>

        {/* CTAs */}
        <div className="hero-cta-group">
          <Link to="/products" className="btn-primary hero-btn-main">
            <span>EXPLORE PROJECTORS</span>
            <ArrowRight size={17} />
          </Link>

          <Link to="/experience" className="btn-secondary hero-btn-sub">
            <Play size={15} fill="currentColor" />
            <span>EXPERIENCE HUNTING</span>
          </Link>

          <button 
            type="button" 
            className="hero-enquiry-link"
            onClick={onOpenEnquiry}
          >
            Request Private Demo In Chennai
          </button>
        </div>

        {/* Bottom Scroll Indicator */}
        <button 
          type="button" 
          className="hero-scroll-indicator" 
          onClick={scrollToNext}
          aria-label="Scroll to interactive product reveal"
        >
          <span className="scroll-text">SCROLL TO EXPERIENCE</span>
          <div className="scroll-chevron-wrap">
            <ChevronDown size={18} className="scroll-chevron" />
          </div>
        </button>

      </div>
    </section>
  );
};
