import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Sliders, Check } from 'lucide-react';
import { products } from '../../../data/products';
import './ProductReveal.css';

export const ProductReveal: React.FC = () => {
  const [activeFrame, setActiveFrame] = useState(0);
  const sectionRef = useRef<HTMLDivElement>(null);
  const flagship = products[0]; // Hunting Vision X1

  const frames = [
    {
      id: 0,
      title: 'SEE MORE.',
      subtitle: '8.3 Million Pixel Surgical Detail',
      desc: 'High-purity multi-element optical glass lenses eliminate spherical aberration for razor-sharp corners.',
      image: flagship.images.hero,
      badge: 'OPTICAL ARCHITECTURE',
      angle: '0° FRONT FACING',
    },
    {
      id: 1,
      title: 'FEEL MORE.',
      subtitle: 'Acoustically Tuned Neodymium Cavity',
      desc: 'Dual 12W stereo drivers housed in an unibody anodized aluminum chamber for room-filling low-end rumble.',
      image: flagship.images.angled || flagship.images.hero,
      badge: 'SPATIAL ACOUSTICS',
      angle: '30° OBLIQUE',
    },
    {
      id: 2,
      title: 'LIVE MORE.',
      subtitle: 'Lossless HDMI 2.1 & Gigabit Streaming',
      desc: 'Full bandwidth eARC pass-through, high-speed USB 3.0, and optical Toslink audio bypass for flagship home theaters.',
      image: flagship.images.backPorts || flagship.images.hero,
      badge: 'CONNECTIVITY SUITE',
      angle: '180° REAR PORTS',
    },
    {
      id: 3,
      title: 'HUNTING.',
      subtitle: 'The Direct Brand Philosophy',
      desc: 'Direct manufacturer and brand supply from Chennai, Tamil Nadu. Designed without compromise for India’s finest spaces.',
      image: flagship.images.ambient || flagship.images.hero,
      badge: 'BRAND CREED',
      angle: '315° AMBIENT CINEMA',
    },
  ];

  // Scroll spy / frame changer
  useEffect(() => {
    const handleScroll = () => {
      if (!sectionRef.current) return;
      const rect = sectionRef.current.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      
      // Calculate progress through section
      if (rect.top <= windowHeight * 0.4 && rect.bottom >= windowHeight * 0.2) {
        const totalHeight = rect.height - windowHeight;
        const currentY = Math.max(0, -rect.top);
        const progress = Math.min(0.99, Math.max(0, currentY / (totalHeight || 1)));
        const frameIndex = Math.min(3, Math.floor(progress * 4));
        setActiveFrame(frameIndex);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const current = frames[activeFrame];

  return (
    <section 
      id="product-reveal-section" 
      ref={sectionRef} 
      className="product-reveal-section" 
      aria-label="Interactive Product Reveal"
    >
      <div className="container product-reveal-container">
        
        {/* Step Progress Tabs Bar */}
        <div className="reveal-step-indicator-bar">
          {frames.map((f, idx) => (
            <button
              key={f.id}
              type="button"
              className={`reveal-step-tab ${activeFrame === idx ? 'active-step' : ''}`}
              onClick={() => setActiveFrame(idx)}
            >
              <span className="step-num">0{idx + 1}</span>
              <span className="step-label">{f.title}</span>
            </button>
          ))}
        </div>

        {/* Dynamic Launch Viewport */}
        <div className="reveal-content-grid">
          
          {/* Left: Huge Editorial Headline & Technical Narrative */}
          <div className="reveal-text-column">
            <span className="eyebrow">{current.badge}</span>
            <h2 className="reveal-headline">{current.title}</h2>
            <h3 className="reveal-subheadline">{current.subtitle}</h3>
            <p className="reveal-desc">{current.desc}</p>

            <div className="reveal-spec-features-list">
              <div className="spec-feature-item">
                <Check size={16} className="spec-check-icon" />
                <span>Dual-chamber solid-state vapor cooling</span>
              </div>
              <div className="spec-feature-item">
                <Check size={16} className="spec-check-icon" />
                <span>Dynamic laser frame-by-frame tone mapping</span>
              </div>
              <div className="spec-feature-item">
                <Check size={16} className="spec-check-icon" />
                <span>Sub-15ms low-lag dedicated game mode</span>
              </div>
            </div>

            <div className="reveal-action-row">
              <Link to={`/products/${flagship.slug}`} className="btn-primary">
                <span>VIEW {flagship.name.toUpperCase()}</span>
                <ArrowRight size={16} />
              </Link>
              <Link to="/products" className="btn-secondary">
                <span>ALL MODELS</span>
              </Link>
            </div>
          </div>

          {/* Right: Changing Projector Angle Showcase */}
          <div className="reveal-visual-column">
            <div className="reveal-image-stage">
              <div className="reveal-lens-ambient" />
              
              <img 
                key={current.image}
                src={current.image} 
                alt={`Hunting Projector ${current.title}`} 
                className="reveal-projector-img"
              />

              <div className="reveal-angle-pill">
                <Sliders size={13} />
                <span>PERSPECTIVE: {current.angle}</span>
              </div>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
