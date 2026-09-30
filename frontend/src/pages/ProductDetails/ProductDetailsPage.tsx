import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  ShieldCheck, 
  Truck, 
  Headphones, 
  Star, 
  CheckCircle2, 
  MessageCircle,
  HelpCircle,
  Sparkles
} from 'lucide-react';
import { getProductBySlug, getRelatedProducts } from '../../services/productService';
import { Product } from '../../types/product';
import { faqs } from '../../data/faqs';
import { ProductGalleryViewer } from '../../components/product/ProductGallery/ProductGalleryViewer';
import { ProductPurchasePanel } from '../../components/product/ProductPurchasePanel/ProductPurchasePanel';
import { ProductHighlights } from '../../components/product/ProductHighlights/ProductHighlights';
import { ProductSpecs } from '../../components/product/ProductSpecs/ProductSpecs';
import { ProductConnectivity } from '../../components/product/ProductConnectivity/ProductConnectivity';
import { ProductWhatsIncluded } from '../../components/product/ProductWhatsIncluded/ProductWhatsIncluded';
import { ProductCard } from '../../components/product/ProductCard/ProductCard';
import { Accordion } from '../../components/common/Accordion/Accordion';
import { siteConfig, getWhatsAppLink, getPhoneLink } from '../../data/siteContent';
import './ProductDetailsPage.css';

interface ProductDetailsPageProps {
  onOpenEnquiry: (productName?: string) => void;
}

export const ProductDetailsPage: React.FC<ProductDetailsPageProps> = ({ onOpenEnquiry }) => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();

  const [product, setProduct] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!slug) return;
    let isMounted = true;
    setLoading(true);
    setError(null);
    window.scrollTo(0, 0);

    getProductBySlug(slug)
      .then(async (prod) => {
        if (!isMounted) return;
        setProduct(prod);
        document.title = `${prod.name} — Hunting Projectors`;
        try {
          const related = await getRelatedProducts(slug, 3);
          if (isMounted) setRelatedProducts(related);
        } catch {
          // non-critical related products failure
        }
      })
      .catch((err) => {
        if (!isMounted) return;
        console.error('Failed to load product by slug:', err);
        setError(err instanceof Error ? err.message : 'Projector model not found');
        setProduct(null);
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [slug]);

  if (loading) {
    return (
      <div className="product-not-found-container">
        <h2>Loading Projector Specifications...</h2>
        <p>Connecting to Hunting database for optical hardware specifications.</p>
      </div>
    );
  }

  if (!product || error) {
    return (
      <div className="product-not-found-container">
        <h2>Projector Model Not Found</h2>
        <p>{error || 'The requested Hunting model may have been moved or updated.'}</p>
        <Link to="/products" className="btn-primary">
          BROWSE ALL PROJECTORS
        </Link>
      </div>
    );
  }

  // Relevant Product FAQs
  const productFaqs = faqs.slice(2, 7).map(f => ({
    id: f.id,
    title: f.question,
    content: f.answer,
  }));

  return (
    <div className="product-details-page">
      <div className="container-wide details-container">
        
        {/* Breadcrumb Navigation */}
        <nav className="details-breadcrumb" aria-label="Breadcrumb">
          <button 
            type="button" 
            className="back-catalog-btn"
            onClick={() => navigate('/products')}
          >
            <ArrowLeft size={16} />
            <span>BACK TO ALL PROJECTORS</span>
          </button>
          <span className="breadcrumb-divider">/</span>
          <span className="breadcrumb-category">{product.categoryLabel}</span>
          <span className="breadcrumb-divider">/</span>
          <span className="breadcrumb-current">{product.name}</span>
        </nav>

        {/* Top Product Showcase Grid: LEFT (Gallery & 360) + RIGHT (Purchase Panel) */}
        <div className="details-showcase-grid">
          
          <div className="details-left-visual">
            <ProductGalleryViewer product={product} />
          </div>

          <div className="details-right-purchase">
            <ProductPurchasePanel
              product={product}
              onOpenEnquiry={() => onOpenEnquiry(product.name)}
            />
          </div>

        </div>

        {/* Key Optical Highlights Metric Callouts */}
        <ProductHighlights highlights={product.highlights} />

        {/* Narrative Description & Features */}
        <section className="details-narrative-section">
          <div className="narrative-grid">
            <div className="narrative-desc-col">
              <span className="eyebrow">OPTICAL ENGINEERING STORY</span>
              <h2 className="display-section">BUILT FOR PURE IMMERSION</h2>
              {product.description.map((paragraph, i) => (
                <p key={i} className="narrative-para">{paragraph}</p>
              ))}

              <div className="narrative-recommend-box">
                <span className="rec-box-title">RECOMMENDED VIEWING APPLICATIONS</span>
                <div className="rec-tags-cloud">
                  {product.recommendedUse.map((use, idx) => (
                    <span key={idx} className="rec-use-chip">{use}</span>
                  ))}
                </div>
              </div>
            </div>

            <div className="narrative-features-col">
              <span className="eyebrow">INTELLIGENT SYSTEMS</span>
              <h3 className="features-col-title">ADVANCED FIRMWARE & OPTICS</h3>
              <div className="features-items-stack">
                {product.features.map((feat, idx) => (
                  <div key={idx} className="feature-item-card">
                    <div className="feature-icon-bullet">
                      <Sparkles size={14} />
                    </div>
                    <div>
                      <h4 className="feature-item-title">{feat.title}</h4>
                      <p className="feature-item-desc">{feat.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Structured Technical Specifications */}
        <ProductSpecs specifications={product.specifications} />

        {/* Visual Rear Connectivity Ports Diagram */}
        <ProductConnectivity connectivity={product.specifications.connectivity} />

        {/* What is Included Checklist */}
        <ProductWhatsIncluded whatsIncluded={product.whatsIncluded} />

        {/* Warranty & NAP Computers Direct Support Banner */}
        <section className="details-warranty-support-banner">
          <div className="warranty-banner-grid">
            <div className="warranty-banner-content">
              <span className="eyebrow">OFFICIAL BRAND GUARANTEE</span>
              <h2 className="display-section">DIRECT CHENNAI SUPPORT & WARRANTY</h2>
              <p className="warranty-banner-desc">
                When you choose Hunting, you purchase directly from the brand owner: NAP Computers & Electronics. Every unit is tested, inspected, and serialized at our Chennai facility before express dispatch.
              </p>
              
              <div className="warranty-checklist">
                <div className="w-check-item">
                  <CheckCircle2 size={16} className="w-icon" />
                  <span>Official Direct Brand Warranty Included</span>
                </div>
                <div className="w-check-item">
                  <CheckCircle2 size={16} className="w-icon" />
                  <span>Doorstep Pickup & Factory Service Across India</span>
                </div>
                <div className="w-check-item">
                  <CheckCircle2 size={16} className="w-icon" />
                  <span>Direct WhatsApp Video Demo & Screen Consultation</span>
                </div>
              </div>

              <div className="warranty-actions-row">
                <a 
                  href={getWhatsAppLink(undefined, product.name)} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="btn-whatsapp"
                >
                  <MessageCircle size={18} />
                  <span>WHATSAPP SUPPORT FOR {product.name.toUpperCase()}</span>
                </a>
                <button
                  type="button"
                  className="btn-secondary"
                  onClick={() => onOpenEnquiry(product.name)}
                >
                  BOOK CHENNAI SHOWROOM DEMO
                </button>
              </div>
            </div>

            <div className="warranty-entity-card">
              <span className="w-entity-label">SUPPLIED / OPERATED BY:</span>
              <h4 className="w-entity-name">{siteConfig.entity.owner}</h4>
              <p className="w-entity-loc">{siteConfig.entity.locationLabel}</p>
              <div className="w-hours-block">
                <span>Working Hours:</span>
                <strong>{siteConfig.contact.supportHours}</strong>
              </div>
              <div className="w-contact-phone">
                <span>Direct Line:</span>
                <strong>{siteConfig.contact.phoneDisplay}</strong>
              </div>
            </div>
          </div>
        </section>

        {/* Product FAQs Accordion */}
        <section className="details-faqs-section">
          <div className="details-faq-header text-center">
            <span className="eyebrow">COMMON QUESTIONS</span>
            <h2 className="display-section">FREQUENTLY ASKED ABOUT {product.name.toUpperCase()}</h2>
          </div>
          <div className="details-faq-wrapper">
            <Accordion items={productFaqs} />
          </div>
        </section>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <section className="details-related-section">
            <div className="related-header">
              <span className="eyebrow">COMPARE ALTERNATIVES</span>
              <h2 className="display-section">RELATED HUNTING MODELS</h2>
            </div>
            <div className="related-cards-grid">
              {relatedProducts.map(rel => (
                <ProductCard
                  key={rel.id}
                  product={rel}
                  featured={rel.isFlagship}
                  onOpenEnquiry={onOpenEnquiry}
                />
              ))}
            </div>
          </section>
        )}

      </div>
    </div>
  );
};
