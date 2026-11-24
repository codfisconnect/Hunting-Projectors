import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Tv, 
  Film, 
  ShieldCheck, 
  Truck, 
  Sparkles, 
  CheckCircle, 
  MessageCircle, 
  ChevronDown, 
  ChevronUp, 
  ArrowRight,
  Maximize2,
  Volume2,
  Wifi,
  Sliders
} from 'lucide-react';
import { getProducts } from '../../services/productService';
import { Product } from '../../types/product';
import { MarketingEnquiryForm } from '../../components/marketing/MarketingEnquiryForm';
import { MarketingTracker, appendUtmParams } from '../../utils/marketingTracking';
import { getWhatsAppLink } from '../../data/siteContent';
import './MarketingLandingPage.css';

interface HomeProjectorsPageProps {
  onOpenEnquiry?: (productName?: string) => void;
}

export const HomeProjectorsPage: React.FC<HomeProjectorsPageProps> = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  useEffect(() => {
    MarketingTracker.trackPageView('Home Projectors Landing Page');

    // Fetch verified home projectors
    getProducts({ limit: 12 })
      .then(res => {
        // Filter active home cinema / smart consumer models
        const genuine = res.products.filter(p => !p.slug.toLowerCase().includes('test'));
        setProducts(genuine);
      })
      .catch(err => {
        console.warn('Catalog fetch notice:', err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const handleWhatsApp = (source: string, modelName?: string) => {
    MarketingTracker.trackWhatsAppClick(source, modelName);
  };

  const faqs = [
    {
      q: 'Can I project directly onto a white wall or do I need a dedicated screen?',
      a: 'Hunting Projectors feature high-contrast optical engines that work well on smooth, matte off-white walls. However, pairing with an ALR (Ambient Light Rejecting) or high-gain projection screen maximizes black levels, contrast, and ambient light resistance for true home cinema quality.'
    },
    {
      q: 'How does the hardware warranty and service support work?',
      a: 'Every model comes backed by official hardware coverage fulfilled directly from our Chennai technical headquarters. For example, HY260 Pro includes a 6-month spare replacement guarantee and 6-month service warranty, while Warrior 004 includes a 1-year spare replacement guarantee and 2-year service warranty (remote controls excluded). Please check each individual product card for exact model coverage.'
    },
    {
      q: 'What is the difference between Native Resolution and Supported Resolution?',
      a: 'Native resolution represents the physical optical hardware pixel grid inside the projector (e.g. 1080p Full HD or 4K DMD chips). Supported resolution refers to the signal decoder that allows 4K streaming sticks or gaming consoles to play smoothly.'
    },
    {
      q: 'Can I connect my smartphone, Fire TV Stick, or soundbar?',
      a: 'Yes. Our projectors include multi-port HDMI inputs, USB playback, screen mirroring (wireless casting from Android & iOS), Bluetooth 5.0/5.2 for wireless soundbars, and auxiliary audio out.'
    },
    {
      q: 'How does doorstep delivery work across India?',
      a: 'We provide direct pan-India courier dispatch from Chennai to all serviceable PIN codes with doorstep tracking.'
    }
  ];

  return (
    <div className="mkt-landing-page">
      {/* 1. Hero Section */}
      <section className="mkt-hero-section">
        <div className="mkt-hero-glow"></div>
        <div className="container-wide mkt-hero-content">
          <div className="mkt-hero-badge">
            <Sparkles size={14} />
            <span>HOME CINEMA OPTICS • DIRECT FROM CHENNAI</span>
          </div>

          <h1 className="mkt-hero-title">
            BRING THE BIG SCREEN <span className="text-gold">HOME.</span>
          </h1>

          <p className="mkt-hero-lead">
            Explore projector options for your home entertainment experience. Find a projector that suits your space and budget.
          </p>

          <div className="mkt-hero-cta-group">
            <a href="#selection" className="btn-primary mkt-cta-btn">
              <span>SHOP PROJECTORS</span>
              <ArrowRight size={18} />
            </a>

            <a href="#enquiry" className="btn-secondary mkt-cta-btn">
              <span>GET EXPERT ASSISTANCE</span>
            </a>
          </div>

          <div className="mkt-hero-highlights-strip">
            <div className="mkt-hero-pill">
              <Film size={16} />
              <span>Cinematic 60"–250" Scaling</span>
            </div>
            <div className="mkt-hero-pill">
              <ShieldCheck size={16} />
              <span>Official Warranty Support</span>
            </div>
            <div className="mkt-hero-pill">
              <Truck size={16} />
              <span>Pan-India Doorstep Dispatch</span>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Product Selection Section */}
      <section id="selection" className="mkt-section mkt-products-section">
        <div className="container-wide">
          <div className="mkt-section-header">
            <span className="eyebrow">VERIFIED CATALOGUE</span>
            <h2 className="display-section">POPULAR HOME PROJECTOR OPTIONS</h2>
            <p className="mkt-section-sub">
              Actual hardware specifications and verified pricing. Choose the ideal optical model for your bedroom, living room, or dedicated cinema.
            </p>
          </div>

          {loading ? (
            <div className="mkt-loading-box">Loading product catalog...</div>
          ) : (
            <div className="mkt-products-grid">
              {products.map(product => {
                const heroImg = product.images?.hero || product.rawImages?.[0]?.url || '/assets/products/hunting-vision-x1-hero.svg';
                const currentPrice = Number(product.price);
                const comparePrice = product.mrp ? Number(product.mrp) : (product.compareAtPrice ? Number(product.compareAtPrice) : null);

                return (
                  <article key={product.id} className="mkt-product-card">
                    <div className="mkt-card-badge-row">
                      <span className="mkt-badge-category">{product.categoryLabel || 'Home Cinema'}</span>
                      {product.badge && <span className="mkt-badge-highlight">{product.badge}</span>}
                    </div>

                    <div className="mkt-card-media">
                      <img 
                        src={heroImg} 
                        alt={product.name} 
                        className="mkt-product-img"
                        loading="lazy"
                        onError={(e) => {
                          // Fallback placeholder
                          (e.target as HTMLElement).setAttribute('src', '/assets/products/hunting-vision-x1-hero.svg');
                        }}
                      />
                    </div>

                    <div className="mkt-card-details">
                      <h3 className="mkt-product-name">{product.name}</h3>
                      {product.subtitle && (
                        <p className="mkt-product-sub">{product.subtitle}</p>
                      )}

                      {/* Verified Spec Pills */}
                      <div className="mkt-card-specs-row">
                        {product.specifications?.resolution && (
                          <div className="mkt-spec-tag">
                            <span className="mkt-spec-k">Resolution:</span>
                            <span className="mkt-spec-v">{product.specifications.resolution}</span>
                          </div>
                        )}
                        {product.specifications?.brightness && (
                          <div className="mkt-spec-tag">
                            <span className="mkt-spec-k">Brightness:</span>
                            <span className="mkt-spec-v">{product.specifications.brightness}</span>
                          </div>
                        )}
                        {product.specifications?.projectionSize && (
                          <div className="mkt-spec-tag">
                            <span className="mkt-spec-k">Screen:</span>
                            <span className="mkt-spec-v">{product.specifications.projectionSize}</span>
                          </div>
                        )}
                      </div>

                      {/* Pricing */}
                      <div className="mkt-card-pricing">
                        <span className="mkt-current-price">₹{currentPrice.toLocaleString('en-IN')}</span>
                        {comparePrice && comparePrice > currentPrice && (
                          <span className="mkt-mrp-price">MRP ₹{comparePrice.toLocaleString('en-IN')}</span>
                        )}
                      </div>

                      {/* Verified Product Warranty Badge */}
                      {product.warranty && (
                        <div className="mkt-card-warranty-pill" style={{
                          fontSize: '0.74rem',
                          color: '#f5e4b8',
                          background: 'rgba(212, 175, 55, 0.08)',
                          border: '1px solid rgba(212, 175, 55, 0.25)',
                          padding: '4px 8px',
                          borderRadius: '4px',
                          marginBottom: '14px',
                          lineHeight: '1.3'
                        }}>
                          <strong>Warranty:</strong> {product.warranty}
                        </div>
                      )}

                      {/* Card Action CTAs */}
                      <div className="mkt-card-actions">
                        <Link
                          to={appendUtmParams(`/products/${product.slug}`)}
                          className="btn-primary mkt-card-btn"
                          onClick={() => MarketingTracker.trackProductClick(product.name, currentPrice)}
                        >
                          <span>VIEW DETAILS</span>
                          <ArrowRight size={15} />
                        </Link>

                        <a
                          href={getWhatsAppLink(`Hi Hunting Projectors, I am interested in ${product.name} (₹${currentPrice.toLocaleString('en-IN')}) from the home projector campaign.`)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="btn-whatsapp mkt-card-wa-btn"
                          onClick={() => handleWhatsApp('product_card', product.name)}
                          title="Enquire on WhatsApp"
                        >
                          <MessageCircle size={16} />
                          <span>WHATSAPP</span>
                        </a>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          )}

          <div className="mkt-explore-all-box">
            <p>Looking for a model not listed here or need help matching your throw ratio?</p>
            <Link to={appendUtmParams('/products')} className="btn-secondary">
              <span>EXPLORE COMPLETE CATALOGUE</span>
              <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* 3. Key Feature Pillars */}
      <section className="mkt-section mkt-features-section">
        <div className="container-wide">
          <div className="mkt-section-header">
            <span className="eyebrow">OPTICAL ADVANTAGES</span>
            <h2 className="display-section">BUILT FOR EVERYDAY HOME ENTERTAINMENT</h2>
          </div>

          <div className="mkt-features-grid">
            <div className="mkt-feature-box">
              <div className="mkt-feature-icon"><Maximize2 size={24} /></div>
              <h3>Immersive Screen Scale</h3>
              <p>Turn any blank room into a 100" to 200" theater screen at a fraction of large panel television prices.</p>
            </div>

            <div className="mkt-feature-box">
              <div className="mkt-feature-icon"><Wifi size={24} /></div>
              <h3>Wireless Casting & Streaming</h3>
              <p>Dual-band Wi-Fi and Bluetooth allow effortless streaming from Fire TV sticks, smartphones, and consoles.</p>
            </div>

            <div className="mkt-feature-box">
              <div className="mkt-feature-icon"><Volume2 size={24} /></div>
              <h3>Integrated Sound & AUX Out</h3>
              <p>Built-in acoustic chamber speakers with HDMI ARC/eARC and optical audio out for home theater amplifiers.</p>
            </div>

            <div className="mkt-feature-box">
              <div className="mkt-feature-icon"><Sliders size={24} /></div>
              <h3>Autofocus & Keystone Correction</h3>
              <p>Quick geometry setup allows flexible corner, ceiling, or bedside projection without manual trapezoid distortion.</p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Why Choose Hunting Projector */}
      <section className="mkt-section mkt-trust-section">
        <div className="container-wide">
          <div className="mkt-section-header">
            <span className="eyebrow">THE HUNTING ADVANTAGE</span>
            <h2 className="display-section">WHY CHOOSE HUNTING PROJECTOR?</h2>
          </div>

          <div className="mkt-trust-grid">
            <div className="mkt-trust-card">
              <CheckCircle size={22} className="text-gold" />
              <div>
                <h4>Direct Brand Supply</h4>
                <p>Fulfilled directly by Nap Computers Electronics, cutting out extra distributor tiers to deliver factory value.</p>
              </div>
            </div>

            <div className="mkt-trust-card">
              <CheckCircle size={22} className="text-gold" />
              <div>
                <h4>Chennai Technical Headquarters</h4>
                <p>Real optical specialists located on Mount Road, Chennai, ready to help with throw math and installation support.</p>
              </div>
            </div>

            <div className="mkt-trust-card">
              <CheckCircle size={22} className="text-gold" />
              <div>
                <h4>Pan-India Delivery</h4>
                <p>Each unit ships in multi-layer protective packaging with courier tracking across all serviceable Indian PIN codes.</p>
              </div>
            </div>

            <div className="mkt-trust-card">
              <CheckCircle size={22} className="text-gold" />
              <div>
                <h4>Official Warranty & Spares</h4>
                <p>Transparent warranty documentation with certified optical parts, power units, and brand maintenance support.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Warranty Terms & Information */}
      <section className="mkt-section mkt-warranty-strip-section">
        <div className="container-wide">
          <div className="mkt-warranty-banner">
            <div className="mkt-warranty-badge">
              <ShieldCheck size={28} />
            </div>
            <div className="mkt-warranty-info">
              <h3>OFFICIAL HARDWARE WARRANTY & CHENNAI SERVICE DESK</h3>
              <p>
                Every projector includes official warranty protection as specified on its product record. Replacement guarantees and service terms are fulfilled directly by Nap Computers Electronics from our Chennai technical headquarters (remote controls excluded).
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 6. Customer Enquiry Form */}
      <section id="enquiry" className="mkt-section mkt-enquiry-section">
        <div className="container-wide">
          <div className="mkt-enquiry-split">
            <div className="mkt-enquiry-copy">
              <span className="eyebrow">DIRECT SPECIALIST CONSULTATION</span>
              <h2 className="display-section">NOT SURE WHICH PROJECTOR SUITS YOUR ROOM?</h2>
              <p className="mkt-enquiry-desc">
                Share your room dimensions or budget expectation. Our optical technicians will recommend the exact throw ratio, brightness level, and connection setup for your home entertainment needs.
              </p>

              <div className="mkt-specialist-box">
                <h4>Prefer instant discussion?</h4>
                <p>Message our Chennai engineers on WhatsApp for instant throw calculations and demo clips.</p>
                <a
                  href={getWhatsAppLink("Hello! I'm looking for a home cinema projector and would like some guidance.")}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-whatsapp mkt-wa-big-btn"
                  onClick={() => handleWhatsApp('enquiry_sidebar')}
                >
                  <MessageCircle size={20} />
                  <span>CONSULT SPECIALIST ON WHATSAPP</span>
                </a>
              </div>
            </div>

            <div className="mkt-enquiry-form-container">
              <MarketingEnquiryForm pageType="home" defaultRequirement="Need Specialist Guidance" />
            </div>
          </div>
        </div>
      </section>

      {/* 7. Frequently Asked Questions */}
      <section className="mkt-section mkt-faq-section">
        <div className="container-wide mkt-faq-container">
          <div className="mkt-section-header">
            <span className="eyebrow">COMMON QUESTIONS</span>
            <h2 className="display-section">FREQUENTLY ASKED QUESTIONS</h2>
          </div>

          <div className="mkt-faq-list">
            {faqs.map((faq, idx) => (
              <div 
                key={idx} 
                className={`mkt-faq-item ${openFaq === idx ? 'mkt-faq-open' : ''}`}
                onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
              >
                <div className="mkt-faq-q">
                  <span>{faq.q}</span>
                  {openFaq === idx ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                </div>
                {openFaq === idx && (
                  <div className="mkt-faq-a">
                    <p>{faq.a}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 8. Final Purchase / Action Banner */}
      <section className="mkt-final-cta-section">
        <div className="container-wide mkt-final-cta-inner">
          <h2>READY TO ELEVATE YOUR HOME CINEMA?</h2>
          <p>Browse our in-stock hardware or request a direct callback from our Chennai technical center.</p>
          <div className="mkt-final-btn-row">
            <a href="#selection" className="btn-primary">
              <span>EXPLORE HOME MODELS</span>
              <ArrowRight size={18} />
            </a>
            <a href="#enquiry" className="btn-secondary">
              <span>REQUEST CALLBACK</span>
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};
