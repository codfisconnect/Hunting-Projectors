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
    getProducts({ limit: 12 })
      .then(res => {
        if (isMounted) {
          // Strictly display exactly the 4 authentic consumer models: H900, H700, H500, H200 (exclude test fixtures)
          const genuineProducts = res.products.filter(p => !p.slug.toLowerCase().includes('test'));
          const sorted = [...genuineProducts].sort((a, b) => {
            if (a.isFlagship && !b.isFlagship) return -1;
            if (!a.isFlagship && b.isFlagship) return 1;
            return b.price - a.price;
          });
          setFeaturedList(sorted.slice(0, 4));
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
    <section id="featured-products-section" className="featured-products-section" aria-label="Featured Hunting Projector">
      <div className="container-wide featured-container">
        
        {/* Section Heading */}
        <div className="featured-header-row">
          <div className="featured-title-group">
            <span className="eyebrow">
              <Sparkles size={12} />
              FEATURED PROJECTORS
            </span>
            <h2 className="display-section">CHOOSE YOUR CINEMA.</h2>
            <p className="featured-lead">
              Precision 4K optical instruments engineered for distinct room acoustics and cinematic scale.
            </p>
          </div>

          <Link to="/products" className="btn-secondary featured-all-link">
            <span>VIEW ALL PROJECTORS</span>
            <ArrowRight size={16} />
          </Link>
        </div>

        {/* 4-Product Responsive Grid */}
        <div className="featured-cards-grid featured-cards-grid-4">
          {featuredList.map(product => (
            <ProductCard
              key={product.id}
              product={product}
              featured={product.isFlagship}
              onOpenEnquiry={onOpenEnquiry}
            />
          ))}
        </div>

        {/* View All Products Button */}
        <div className="featured-view-all-center">
          <Link to="/products" className="btn-primary featured-view-all-cta">
            <span>VIEW ALL PRODUCTS</span>
            <ArrowRight size={18} />
          </Link>
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
