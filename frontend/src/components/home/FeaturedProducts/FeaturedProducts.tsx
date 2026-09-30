import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles } from 'lucide-react';
import { getProducts } from '../../../services/productService';
import { Product } from '../../../types/product';
import { ProductCard } from '../../product/ProductCard/ProductCard';
import './FeaturedProducts.css';

interface FeaturedProductsProps {
  onOpenEnquiry: (productName?: string) => void;
}

export const FeaturedProducts: React.FC<FeaturedProductsProps> = ({ onOpenEnquiry }) => {
  const [featuredList, setFeaturedList] = useState<Product[]>([]);

  useEffect(() => {
    let isMounted = true;
    getProducts({ limit: 6 })
      .then(res => {
        if (isMounted) {
          const sorted = [...res.products].sort((a, b) => (b.isFlagship ? 1 : 0) - (a.isFlagship ? 1 : 0));
          setFeaturedList(sorted.slice(0, 3));
        }
      })
      .catch(err => {
        console.warn('Failed to load featured products from API:', err);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <section className="featured-products-section" aria-label="Featured Hunting Projectors">
      <div className="container-wide featured-container">
        
        {/* Section Heading */}
        <div className="featured-header-row">
          <div className="featured-title-group">
            <span className="eyebrow">
              <Sparkles size={12} />
              FLAGSHIP COLLECTION
            </span>
            <h2 className="display-section">CHOOSE YOUR EXPERIENCE.</h2>
            <p className="featured-lead">
              Precision optical instruments engineered for distinct acoustic environments and cinematic scale.
            </p>
          </div>

          <Link to="/products" className="btn-secondary featured-all-link">
            <span>VIEW ALL MODELS</span>
            <ArrowRight size={16} />
          </Link>
        </div>

        {/* 3-Column Editorial Grid */}
        <div className="featured-cards-grid">
          {featuredList.map(product => (
            <ProductCard
              key={product.id}
              product={product}
              featured={product.isFlagship}
              onOpenEnquiry={onOpenEnquiry}
            />
          ))}
        </div>

        {/* Bottom Comparative Strip */}
        <div className="featured-bottom-strip">
          <div className="bottom-strip-text">
            <h4>Comparing multiple models for your home theater?</h4>
            <p>Inspect side-by-side throw ratios, ANSI lumens, input latency, and acoustic wattage.</p>
          </div>
          <Link to="/compare" className="btn-primary">
            <span>LAUNCH SPEC COMPARISON</span>
            <ArrowRight size={16} />
          </Link>
        </div>

      </div>
    </section>
  );
};
