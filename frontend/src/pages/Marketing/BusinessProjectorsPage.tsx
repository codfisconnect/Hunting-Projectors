import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Building2, 
  Presentation, 
  GraduationCap, 
  Briefcase, 
  ShieldCheck, 
  Truck, 
  Sparkles, 
  CheckCircle, 
  MessageCircle, 
  ChevronDown, 
  ChevronUp, 
  ArrowRight,
  FileText,
  Clock,
  Layers
} from 'lucide-react';
import { getProducts } from '../../services/productService';
import { Product } from '../../types/product';
import { MarketingEnquiryForm } from '../../components/marketing/MarketingEnquiryForm';
import { MarketingTracker, appendUtmParams } from '../../utils/marketingTracking';
import { getWhatsAppLink } from '../../data/siteContent';
import './MarketingLandingPage.css';

interface BusinessProjectorsPageProps {
  onOpenEnquiry?: (productName?: string) => void;
}

export const BusinessProjectorsPage: React.FC<BusinessProjectorsPageProps> = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  useEffect(() => {
    MarketingTracker.trackPageView('Business Projectors Landing Page');

    // Fetch verified business & multi-purpose projectors
    getProducts({ limit: 12 })
      .then(res => {
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

  const useCases = [
    {
      icon: <Briefcase size={26} />,
      title: 'Corporate Meeting Rooms',
      desc: 'High-clarity optical projection for PowerPoint presentations, financial spreadsheets, and video conferences without eye fatigue.'
    },
    {
      icon: <Presentation size={26} />,
      title: 'Boardrooms & Conference Spaces',
      desc: 'Wide-angle throw and expansive 120" to 200" projection canvases for large executive seating and multi-source inputs.'
    },
    {
      icon: <GraduationCap size={26} />,
      title: 'Institutions & Classrooms',
      desc: 'Reliable solid-state lamp life up to 20,000–30,000 hours with minimal periodic filter maintenance for daily curriculum use.'
    },
    {
      icon: <Building2 size={26} />,
      title: 'Commercial & Training Hubs',
      desc: 'Instant HDMI, USB, and wireless casting from staff laptops, tablets, and mobile devices with zero driver installation.'
    }
  ];

  const faqs = [
    {
      q: 'Do you issue commercial purchase invoices for businesses and institutions?',
      a: 'Yes. All purchases are supplied with commercial purchase invoices issued by Nap Computers Electronicss, Chennai.'
    },
    {
      q: 'Can we request a quote for multiple units or institutional requirements?',
      a: 'Yes. For institutional purchases, schools, universities, training centers, and offices, our Chennai commercial desk prepares customized quotations and delivery timelines based on requested quantities.'
    },
    {
      q: 'How does ambient lighting affect projector selection for meeting spaces?',
      a: 'Projector clarity in meeting rooms depends on room lighting and screen size. Models with higher ANSI brightness (such as 750 ANSI lumens up to high-output optical systems) provide better clarity. We recommend discussing your specific room dimensions and lighting with our team for guidance.'
    },
    {
      q: 'What warranty is provided for hardware?',
      a: 'Each product carries official warranty coverage according to its individual product record. Service and genuine parts support are fulfilled from our Chennai technical headquarters (remote controls excluded).'
    },
    {
      q: 'Can we connect multiple video and audio sources?',
      a: 'Our projectors include HDMI inputs, USB ports for media drives or presentation dongles, and audio output for external sound systems.'
    }
  ];

  return (
    <div className="mkt-landing-page mkt-business-page">
      {/* 1. Hero Section */}
      <section className="mkt-hero-section">
        <div className="mkt-hero-glow mkt-hero-glow-biz"></div>
        <div className="container-wide mkt-hero-content">
          <div className="mkt-hero-badge">
            <Briefcase size={14} />
            <span>COMMERCIAL & INSTITUTIONAL OPTICS • CHENNAI</span>
          </div>

          <h1 className="mkt-hero-title">
            PROJECTOR SOLUTIONS FOR <span className="text-gold">YOUR BUSINESS.</span>
          </h1>

          <p className="mkt-hero-lead">
            Explore projector options for presentations, meetings and institutional requirements. Contact our team for product guidance.
          </p>

          <div className="mkt-hero-cta-group">
            <a href="#quote" className="btn-primary mkt-cta-btn">
              <span>REQUEST A QUOTE</span>
              <ArrowRight size={18} />
            </a>

            <a href="#options" className="btn-secondary mkt-cta-btn">
              <span>EXPLORE PRODUCTS</span>
            </a>
          </div>

          <div className="mkt-hero-highlights-strip">
            <div className="mkt-hero-pill">
              <FileText size={16} />
              <span>Commercial Tax Invoices</span>
            </div>
            <div className="mkt-hero-pill">
              <ShieldCheck size={16} />
              <span>Official Hardware Warranty</span>
            </div>
            <div className="mkt-hero-pill">
              <Truck size={16} />
              <span>Pan-India Courier Dispatch</span>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Business Use Cases */}
      <section className="mkt-section mkt-use-cases-section">
        <div className="container-wide">
          <div className="mkt-section-header">
            <span className="eyebrow">COMMERCIAL APPLICATIONS</span>
            <h2 className="display-section">TAILORED FOR PROFESSIONAL ENVIRONMENTS</h2>
            <p className="mkt-section-sub">
              Engineered for presentation readability, meeting collaboration, and reliable daily operation.
            </p>
          </div>

          <div className="mkt-use-cases-grid">
            {useCases.map((uc, i) => (
              <div key={i} className="mkt-use-case-card">
                <div className="mkt-use-case-icon">{uc.icon}</div>
                <h3>{uc.title}</h3>
                <p>{uc.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. Selected Product Options */}
      <section id="options" className="mkt-section mkt-products-section">
        <div className="container-wide">
          <div className="mkt-section-header">
            <span className="eyebrow">EQUIPMENT OPTIONS</span>
            <h2 className="display-section">SELECTED PRODUCT OPTIONS</h2>
            <p className="mkt-section-sub">
              Verified specifications from our current catalog. Contact our team for bulk pricing or specific room requirements.
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
                      <span className="mkt-badge-category">{product.categoryLabel || 'Business & Cinema'}</span>
                      {product.badge && <span className="mkt-badge-highlight">{product.badge}</span>}
                    </div>

                    <div className="mkt-card-media">
                      <img 
                        src={heroImg} 
                        alt={product.name} 
                        className="mkt-product-img"
                        loading="lazy"
                        onError={(e) => {
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
                        {product.specifications?.lampLifeHours && (
                          <div className="mkt-spec-tag">
                            <span className="mkt-spec-k">Lamp Life:</span>
                            <span className="mkt-spec-v">{product.specifications.lampLifeHours}</span>
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
                          <span>VIEW SPECS</span>
                          <ArrowRight size={15} />
                        </Link>

                        <a
                          href={getWhatsAppLink(`Hello Hunting Projector, I need a corporate quotation for ${product.name} (Unit price: ₹${currentPrice.toLocaleString('en-IN')}).`)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="btn-whatsapp mkt-card-wa-btn"
                          onClick={() => handleWhatsApp('business_card', product.name)}
                          title="Ask for Corporate Quote on WhatsApp"
                        >
                          <MessageCircle size={16} />
                          <span>QUOTE</span>
                        </a>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* 4. Why Choose Hunting Projector for Business */}
      <section className="mkt-section mkt-trust-section">
        <div className="container-wide">
          <div className="mkt-section-header">
            <span className="eyebrow">INSTITUTIONAL RELIABILITY</span>
            <h2 className="display-section">WHY BUSINESSES TRUST HUNTING PROJECTOR</h2>
          </div>

          <div className="mkt-trust-grid">
            <div className="mkt-trust-card">
              <CheckCircle size={22} className="text-gold" />
              <div>
                <h4>Direct Brand Supply</h4>
                <p>Nap Computers Electronicss supplies hardware directly from Chennai, backed by dedicated technical support.</p>
              </div>
            </div>

            <div className="mkt-trust-card">
              <CheckCircle size={22} className="text-gold" />
              <div>
                <h4>Commercial Invoicing</h4>
                <p>Official commercial purchase invoices issued with complete order documentation for institutional records.</p>
              </div>
            </div>

            <div className="mkt-trust-card">
              <CheckCircle size={22} className="text-gold" />
              <div>
                <h4>Pan-India Dispatch</h4>
                <p>Reliable courier dispatch with tracking to campuses, training centers, and offices nationwide.</p>
              </div>
            </div>

            <div className="mkt-trust-card">
              <CheckCircle size={22} className="text-gold" />
              <div>
                <h4>Dedicated Chennai Support</h4>
                <p>Technical service center located in Chennai with genuine optical parts and direct telephone guidance.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Business Enquiry & Quote Request */}
      <section id="quote" className="mkt-section mkt-enquiry-section">
        <div className="container-wide">
          <div className="mkt-enquiry-split">
            <div className="mkt-enquiry-copy">
              <span className="eyebrow">CORPORATE PROCUREMENT</span>
              <h2 className="display-section">REQUEST A FORMAL BUSINESS QUOTE</h2>
              <p className="mkt-enquiry-desc">
                Submit your project specifications or estimated quantity. Our commercial team will contact you within 1 business day with official quotation details, throw recommendations, and delivery timelines.
              </p>

              <div className="mkt-specialist-box">
                <h4>Need an immediate quotation?</h4>
                <p>Connect with our commercial desk on WhatsApp for prompt response during business hours.</p>
                <a
                  href={getWhatsAppLink("Hello! I am requesting a formal quotation for commercial/institutional projectors.")}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-whatsapp mkt-wa-big-btn"
                  onClick={() => handleWhatsApp('business_enquiry_sidebar')}
                >
                  <MessageCircle size={20} />
                  <span>WHATSAPP COMMERCIAL DESK</span>
                </a>
              </div>
            </div>

            <div className="mkt-enquiry-form-container">
              <MarketingEnquiryForm pageType="business" defaultRequirement="Bulk / Institutional Quote" />
            </div>
          </div>
        </div>
      </section>

      {/* 6. Frequently Asked Questions */}
      <section className="mkt-section mkt-faq-section">
        <div className="container-wide mkt-faq-container">
          <div className="mkt-section-header">
            <span className="eyebrow">FREQUENTLY ASKED QUESTIONS</span>
            <h2 className="display-section">COMMERCIAL PROCUREMENT QUESTIONS</h2>
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

      {/* 7. Final Action Strip */}
      <section className="mkt-final-cta-section">
        <div className="container-wide mkt-final-cta-inner">
          <h2>READY TO UPGRADE YOUR MEETING SPACES?</h2>
          <p>Get in touch with our Chennai optical team for volume quotes and room recommendations.</p>
          <div className="mkt-final-btn-row">
            <a href="#quote" className="btn-primary">
              <span>SUBMIT QUOTE REQUEST</span>
              <ArrowRight size={18} />
            </a>
            <a href="#options" className="btn-secondary">
              <span>EXPLORE ALL HARDWARE</span>
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};
