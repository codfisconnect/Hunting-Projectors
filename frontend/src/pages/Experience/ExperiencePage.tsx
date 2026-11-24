import React, { useState, useEffect, useMemo, useRef } from 'react';
import { Link } from 'react-router-dom';
import { 
  Sparkles, 
  ArrowRight, 
  ChevronLeft,
  ChevronRight,
  ShieldCheck, 
  CheckCircle2, 
  Layers,
  Volume2,
  Film,
  Gamepad2,
  Maximize,
  Compass,
  MessageSquare
} from 'lucide-react';
import { getProducts } from '../../services/productService';
import { Product } from '../../types/product';
import { SEOHead } from '../../components/common/SEOHead/SEOHead';
import { ProductCard } from '../../components/product/ProductCard/ProductCard';
import './ExperiencePage.css';

interface ExperiencePageProps {
  onOpenEnquiry: (productName?: string) => void;
}

// Curated dark cinematic lifestyle moments
const CINEMATIC_LIFESTYLE_MOMENTS = [
  {
    id: 'home-theatre',
    title: 'Private Home Theatre',
    subtitle: 'Reference Cinema Immersion',
    description: 'Transform any dedicated living room or media space into a private reference cinema with razor-sharp optics and deep contrast that draws you into every scene.',
    badge: 'CINEMATIC PURITY',
    image: 'https://images.unsplash.com/photo-1595769816263-9b910be24d5f?q=80&w=1600&auto=format&fit=crop',
    icon: Film
  },
  {
    id: 'movie-nights',
    title: 'Movie Nights Together',
    subtitle: 'Moments That Bring People Together',
    description: 'Bring family and friends together for movie nights, favourite shows, and shared moments on a bigger screen.',
    badge: 'WARMTH & CLARITY',
    image: 'https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?q=80&w=1600&auto=format&fit=crop',
    icon: Volume2
  },
  {
    id: 'gaming-sports',
    title: 'Sports & Gaming Nights',
    subtitle: 'Bring Everyone Into The Action',
    description: 'Gather around for live matches, tournaments, and gaming sessions with a large-screen viewing experience.',
    badge: 'GAME & MATCH NIGHTS',
    image: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=1600&auto=format&fit=crop',
    icon: Gamepad2
  },
  {
    id: 'grand-canvas',
    title: 'A Bigger-Screen Experience',
    subtitle: 'Freedom Beyond Traditional Television',
    description: 'Enjoy a flexible big-screen setup at home. Check each projector model’s specifications for its supported projection size and setup requirements.',
    badge: 'BIG-SCREEN VIEWING',
    image: 'https://images.unsplash.com/photo-1574375927938-d5a98e8ffe85?q=80&w=1600&auto=format&fit=crop',
    icon: Maximize
  }
];

export const ExperiencePage: React.FC<ExperiencePageProps> = ({ onOpenEnquiry }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [activeSlideIndex, setActiveSlideIndex] = useState<number>(0);
  const slideTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    window.scrollTo(0, 0);

    let isMounted = true;
    getProducts({ limit: 50 })
      .then(res => {
        if (isMounted) {
          setProducts(res.products || []);
          setLoading(false);
        }
      })
      .catch(err => {
        console.warn('Experience page catalog fetch error:', err);
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  // Filter ONLY active Warrior Series products dynamically from live catalog
  const warriorProducts = useMemo(() => {
    return products.filter(p => {
      if (!p.isActive) return false;
      const nameMatch = p.name.toLowerCase().includes('warrior');
      const slugMatch = p.slug.toLowerCase().includes('warrior');
      const categoryMatch = p.category?.toLowerCase?.().includes('warrior') || p.categoryLabel?.toLowerCase?.().includes('warrior');
      return nameMatch || slugMatch || categoryMatch;
    });
  }, [products]);

  // Helper to ensure transparent cutout for projector showcase
  const getCutoutImageUrl = (url: string) => {
    if (!url) return '';
    // If it's a Cloudinary image that isn't already png or doesn't have transparency param
    if (url.includes('res.cloudinary.com') && url.includes('/image/upload/')) {
      if (url.endsWith('.jpg') || url.endsWith('.jpeg')) {
        return url.replace('/image/upload/', '/image/upload/e_make_transparent:20/').replace(/\.(jpg|jpeg)$/i, '.png');
      }
    }
    return url;
  };

  // Slideshow slides built directly from real Warrior product images and metadata
  const heroSlides = useMemo(() => {
    if (warriorProducts.length === 0) return [];
    
    return warriorProducts.map(p => {
      const rawImg = p.images.hero || p.gallery?.[0] || '';
      return {
        product: p,
        image: getCutoutImageUrl(rawImg),
        name: p.name,
        tagline: p.subtitle || p.tagline || 'Experience the Warrior optical difference',
        slug: p.slug,
        price: p.price,
        mrp: p.mrp || p.compareAtPrice,
        resolution: p.specifications?.resolution || 'See product specifications',
        brightness: p.specifications?.brightness || 'See product specifications',
        canvas: p.specifications?.projectionSize || 'See product specifications'
      };
    }).filter(s => !!s.image);
  }, [warriorProducts]);

  // Automatic slideshow transition timer: every 4.5 seconds
  useEffect(() => {
    if (heroSlides.length <= 1) return;

    if (slideTimerRef.current) clearInterval(slideTimerRef.current);

    slideTimerRef.current = setInterval(() => {
      setActiveSlideIndex(prev => (prev + 1) % heroSlides.length);
    }, 4500);

    return () => {
      if (slideTimerRef.current) clearInterval(slideTimerRef.current);
    };
  }, [heroSlides.length]);

  const handlePrevSlide = () => {
    if (heroSlides.length <= 1) return;
    setActiveSlideIndex(prev => (prev - 1 + heroSlides.length) % heroSlides.length);
  };

  const handleNextSlide = () => {
    if (heroSlides.length <= 1) return;
    setActiveSlideIndex(prev => (prev + 1) % heroSlides.length);
  };

  const currentSlide = heroSlides[activeSlideIndex] || heroSlides[0];

  return (
    <div className="experience-page">
      <SEOHead
        title="Experience Cinema Differently — Hunting Projectors Warrior Series"
        description="Explore the active Hunting Projectors Warrior Series lineup through a cinematic product showcase and discover the models available in our catalogue."
        canonicalPath="/experience"
      />

      {/* 1. HERO SECTION – FULL-WIDTH CINEMATIC SLIDESHOW */}
      <section className="experience-hero-slideshow" aria-label="Cinematic Slideshow">
        {/* Dynamic Background Slides with Zoom Crossfade */}
        <div className="hero-slides-viewport">
          {heroSlides.map((slide, idx) => {
            const isActive = idx === activeSlideIndex;
            return (
              <div
                key={slide.product.id || idx}
                className={`hero-slide-layer ${isActive ? 'is-active' : ''}`}
                aria-hidden={!isActive}
              >
                <div className="hero-slide-img-stage">
                  {/* Subtle warm radial spotlight behind the projector */}
                  <div className="hero-projector-spotlight" aria-hidden="true" />
                  <img
                    src={slide.image}
                    alt={slide.name}
                    className="hero-slide-real-img"
                    loading={idx === 0 ? 'eager' : 'lazy'}
                  />
                  {/* Subtle ground reflection / shadow */}
                  <div className="hero-projector-shadow" aria-hidden="true" />
                </div>
              </div>
            );
          })}
        </div>

        {/* Cinematic atmospheric overlays for readability */}
        <div className="hero-slides-overlay-vignette" aria-hidden="true" />
        <div className="hero-slides-overlay-gradient" aria-hidden="true" />
        <div className="hero-radial-glow" aria-hidden="true" />

        {/* Foreground Content */}
        <div className="container hero-slideshow-container">
          <div className="hero-slideshow-content">
            <div className="hero-eyebrow-pill">
              <Sparkles size={13} className="eyebrow-sparkle" />
              <span>THE WARRIOR CINEMA SHOWCASE</span>
            </div>

            <h1 className="hero-title-main">
              EXPERIENCE CINEMA DIFFERENTLY.
            </h1>

            <p className="hero-lead-text">
              Discover the Warrior Series. Bring the big-screen experience home.
            </p>

            <div className="hero-actions-row">
              <a
                href="#warrior-collection"
                className="btn-primary hero-btn-gold"
                onClick={(e) => {
                  e.preventDefault();
                  document.getElementById('warrior-collection')?.scrollIntoView({ behavior: 'smooth' });
                }}
              >
                <span>Explore Warrior Series</span>
                <ArrowRight size={16} />
              </a>

              <Link to="/projector-finder" className="btn-secondary hero-btn-outline">
                <Compass size={16} />
                <span>Find Your Projector</span>
              </Link>
            </div>

            {/* Live Active Product Quick Badge (Synced with current slide) */}
            {currentSlide && (
              <div className="hero-active-product-pill">
                <span className="live-pill-tag">ACTIVE SHOWCASE</span>
                <Link to={`/products/${currentSlide.slug}`} className="live-pill-name">
                  {currentSlide.name}
                </Link>
                <span className="live-pill-divider">•</span>
                <span className="live-pill-price">₹{currentSlide.price.toLocaleString('en-IN')}</span>
                <span className="live-pill-divider">•</span>
                <span className="live-pill-spec">{currentSlide.resolution.split('(')[0].trim()}</span>
              </div>
            )}
          </div>

          {/* Slideshow Navigation Controls */}
          {heroSlides.length > 1 && (
            <div className="hero-slideshow-controls">
              <button
                type="button"
                className="slide-arrow-btn"
                onClick={handlePrevSlide}
                aria-label="Previous projector"
              >
                <ChevronLeft size={20} />
              </button>

              <div className="slide-indicators">
                {heroSlides.map((_, dotIdx) => (
                  <button
                    key={dotIdx}
                    type="button"
                    className={`slide-indicator-dot ${dotIdx === activeSlideIndex ? 'active' : ''}`}
                    onClick={() => setActiveSlideIndex(dotIdx)}
                    aria-label={`Jump to slide ${dotIdx + 1}`}
                  />
                ))}
              </div>

              <button
                type="button"
                className="slide-arrow-btn"
                onClick={handleNextSlide}
                aria-label="Next projector"
              >
                <ChevronRight size={20} />
              </button>
            </div>
          )}
        </div>
      </section>

      {/* 2. WARRIOR SERIES – DYNAMIC PRODUCT COLLECTION */}
      <section id="warrior-collection" className="warrior-collection-section" aria-label="Warrior Series Lineup">
        <div className="container-wide">
          <div className="section-header-editorial">
            <span className="section-tag-gold">WARRIOR SERIES</span>
            <h2 className="section-heading-lg">Precision Optics. Uncompromising Scale.</h2>
            <p className="section-description-text">
              Each Warrior model is powered by dedicated optical engines, high-lumen clarity, and smart streaming capabilities for unmatched immersion.
            </p>
          </div>

          {/* Dynamic Grid: Uses exact existing ProductCard components & single source of truth */}
          {loading ? (
            <div className="warrior-loading-state">
              <div className="loading-spinner-ring" />
              <p>Loading the active Warrior Series collection...</p>
            </div>
          ) : warriorProducts.length > 0 ? (
            <div className="warrior-products-grid">
              {warriorProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onOpenEnquiry={onOpenEnquiry}
                  featured={product.isFlagship || product.isBestSeller}
                />
              ))}
            </div>
          ) : (
            <div className="warrior-empty-state">
              <p>No active Warrior Series models are currently available.</p>
              <Link to="/products" className="btn-primary" style={{ marginTop: '16px' }}>
                Browse All Projectors
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* 3. CINEMATIC LIFESTYLE SECTION */}
      <section className="cinematic-lifestyle-section" aria-label="Cinematic Lifestyle Moments">
        <div className="container-wide">
          <div className="section-header-editorial">
            <span className="section-tag-gold">HOME CINEMA LIFESTYLE</span>
            <h2 className="section-heading-lg">Moments Elevated By Big-Screen Immersion</h2>
            <p className="section-description-text">
              Whether streaming film masterpieces, hosting match-day gatherings, or gaming on a panoramic scale, Hunting Projectors turn every room into an unforgettable venue.
            </p>
          </div>

          <div className="lifestyle-mosaic-grid">
            {CINEMATIC_LIFESTYLE_MOMENTS.map((moment) => {
              const IconComponent = moment.icon;
              return (
                <div key={moment.id} className="lifestyle-card">
                  <div className="lifestyle-card-visual">
                    <img
                      src={moment.image}
                      alt={moment.title}
                      className="lifestyle-img"
                      loading="lazy"
                    />
                    <div className="lifestyle-card-scrim" />
                    <span className="lifestyle-badge">
                      <IconComponent size={12} />
                      <span>{moment.badge}</span>
                    </span>
                  </div>

                  <div className="lifestyle-card-body">
                    <span className="lifestyle-subtitle">{moment.subtitle}</span>
                    <h3 className="lifestyle-title">{moment.title}</h3>
                    <p className="lifestyle-desc">{moment.description}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 4. FINAL CALL TO ACTION */}
      <section className="experience-final-cta-section" aria-label="Experience Call to Action">
        <div className="container">
          <div className="final-cta-card">
            <div className="final-cta-halo" aria-hidden="true" />
            <span className="final-cta-tag">THE HUNTING GUARANTEE</span>
            <h2 className="final-cta-title">READY TO EXPERIENCE THE DIFFERENCE?</h2>
            <p className="final-cta-text">
              Explore our full projector catalog or speak directly with our optics specialists for room throw recommendations and personalized quotes.
            </p>

            <div className="final-cta-buttons">
              <Link to="/products" className="btn-primary final-btn-primary">
                <span>Explore All Projectors</span>
                <ArrowRight size={16} />
              </Link>

              <button
                type="button"
                className="btn-secondary final-btn-secondary"
                onClick={() => onOpenEnquiry('Warrior Series Experience Inquiry')}
              >
                <MessageSquare size={16} />
                <span>Enquire Now</span>
              </button>
            </div>

            <div className="final-trust-strip">
              <div className="trust-item">
                <CheckCircle2 size={15} className="trust-icon" />
                <span>Pan-India Doorstep Delivery</span>
              </div>
              <div className="trust-dot">•</div>
              <div className="trust-item">
                <ShieldCheck size={15} className="trust-icon" />
                <span>Official Brand Warranty</span>
              </div>
              <div className="trust-dot">•</div>
              <div className="trust-item">
                <Layers size={15} className="trust-icon" />
                <span>Dedicated Technical Support</span>
              </div>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
};