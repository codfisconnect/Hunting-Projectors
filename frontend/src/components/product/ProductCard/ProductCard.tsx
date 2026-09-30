import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, ArrowRight, ShoppingBag, Eye, Sliders } from 'lucide-react';
import { Product } from '../../../types/product';
import { useWishlist } from '../../../context/WishlistContext';
import { useCart } from '../../../context/CartContext';
import './ProductCard.css';

interface ProductCardProps {
  product: Product;
  onOpenEnquiry?: (productName: string) => void;
  featured?: boolean;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onOpenEnquiry,
  featured = false,
}) => {
  const { isInWishlist, toggleWishlist } = useWishlist();
  const { addToCart } = useCart();
  const isWishlisted = isInWishlist(product.id);

  return (
    <article className={`editorial-product-card ${featured ? 'card-featured' : ''}`}>
      
      {/* Top Meta Bar */}
      <div className="card-top-bar">
        <div className="card-badges">
          <span className="card-category-badge">{product.categoryLabel}</span>
          {product.badge && <span className="card-highlight-badge">{product.badge}</span>}
        </div>

        <button
          type="button"
          className={`card-wishlist-btn ${isWishlisted ? 'wishlisted' : ''}`}
          onClick={() => toggleWishlist(product)}
          aria-label={isWishlisted ? 'Remove from wishlist' : 'Save to wishlist'}
          title="Save to Wishlist"
        >
          <Heart size={16} fill={isWishlisted ? '#FF5A79' : 'none'} />
        </button>
      </div>

      {/* Center Image Showcase */}
      <Link to={`/products/${product.slug}`} className="card-image-stage">
        <div className="card-glow" />
        <img 
          src={product.images.hero} 
          alt={product.name} 
          className="card-projector-img"
          loading="lazy"
        />
        <div className="card-360-hint">
          <Sliders size={12} />
          <span>360° READY</span>
        </div>
      </Link>

      {/* Product Content & Typography */}
      <div className="card-content-area">
        <div className="card-header-group">
          <h3 className="card-title">
            <Link to={`/products/${product.slug}`}>{product.name}</Link>
          </h3>
          <p className="card-subtitle">{product.subtitle}</p>
        </div>

        {/* Selected Technical Highlights Strip */}
        <div className="card-specs-strip">
          <div className="spec-pill">
            <span className="spec-pill-label">RESOLUTION</span>
            <span className="spec-pill-val">{product.specifications.resolution.split(' ')[0]}</span>
          </div>
          <div className="spec-pill">
            <span className="spec-pill-label">LUMENS</span>
            <span className="spec-pill-val">{product.specifications.brightness.split(' ')[0]}</span>
          </div>
          <div className="spec-pill">
            <span className="spec-pill-label">MAX SCREEN</span>
            <span className="spec-pill-val">{product.specifications.projectionSize.split('–')[1] || '200"'}</span>
          </div>
        </div>

        {/* Price & Action Row */}
        <div className="card-bottom-row">
          <div className="card-price-block">
            <span className="price-label">DIRECT DEMO PRICING</span>
            <div className="price-values">
              <span className="current-price">₹{product.price.toLocaleString('en-IN')}</span>
              {product.compareAtPrice && (
                <span className="compare-price">₹{product.compareAtPrice.toLocaleString('en-IN')}</span>
              )}
            </div>
          </div>

          <div className="card-actions-group">
            <button
              type="button"
              className="card-quick-cart-btn"
              onClick={() => addToCart(product)}
              title="Add to Cart"
            >
              <ShoppingBag size={16} />
            </button>

            {onOpenEnquiry && (
              <button
                type="button"
                className="card-enquire-btn"
                onClick={() => onOpenEnquiry(product.name)}
                title="Enquire"
              >
                ENQUIRE
              </button>
            )}

            <Link 
              to={`/products/${product.slug}`} 
              className="card-view-btn"
              title="View Product"
            >
              <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </div>

    </article>
  );
};
