import React, { useState } from 'react';
import { 
  ShoppingBag, 
  MessageCircle, 
  Phone, 
  Heart, 
  ShieldCheck, 
  Truck, 
  Check, 
  Plus, 
  Minus,
  Sparkles
} from 'lucide-react';
import { Product } from '../../../types/product';
import { useCart } from '../../../context/CartContext';
import { useWishlist } from '../../../context/WishlistContext';
import { siteConfig, getWhatsAppLink, getPhoneLink } from '../../../data/siteContent';
import './ProductPurchasePanel.css';

interface ProductPurchasePanelProps {
  product: Product;
  onOpenEnquiry: (productName: string) => void;
}

export const ProductPurchasePanel: React.FC<ProductPurchasePanelProps> = ({
  product,
  onOpenEnquiry,
}) => {
  const [quantity, setQuantity] = useState(1);
  const { addToCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const isWishlisted = isInWishlist(product.id);

  const handleAddToCart = () => {
    addToCart(product, quantity);
  };

  return (
    <div className="product-purchase-panel">
      
      {/* Brand & Category Heading */}
      <div className="purchase-header">
        <div className="purchase-badge-row">
          <span className="purchase-brand-name">HUNTING PROJECTORS</span>
          <span className="purchase-category-badge">{product.categoryLabel}</span>
          {product.badge && <span className="purchase-model-badge">{product.badge}</span>}
        </div>

        <h1 className="purchase-title">{product.name}</h1>
        <p className="purchase-subtitle">{product.subtitle}</p>
      </div>

      {/* Pricing & Stock Status */}
      <div className="purchase-pricing-box">
        <div className="price-details">
          <span className="demo-price-label">DIRECT BRAND DEMO PRICING</span>
          <div className="price-figure-row">
            <span className="purchase-current-price">
              ₹{product.price.toLocaleString('en-IN')}
            </span>
            {product.compareAtPrice && (
              <span className="purchase-strike-price">
                ₹{product.compareAtPrice.toLocaleString('en-IN')}
              </span>
            )}
          </div>
          <span className="price-inclusive-tax">
            Includes all statutory taxes • Pan-India door delivery included
          </span>
        </div>

        <div className="stock-status-pill">
          <span className="status-dot-green" />
          <span>IN STOCK / DEMO READY</span>
        </div>
      </div>

      {/* Short Summary Description */}
      <p className="purchase-summary-text">
        {product.shortDescription}
      </p>

      {/* Quantity & Cart Action Row */}
      <div className="purchase-interaction-row">
        <div className="quantity-stepper">
          <button
            type="button"
            className="qty-btn"
            onClick={() => setQuantity(Math.max(1, quantity - 1))}
            aria-label="Decrease quantity"
          >
            <Minus size={14} />
          </button>
          <span className="qty-number">{quantity}</span>
          <button
            type="button"
            className="qty-btn"
            onClick={() => setQuantity(quantity + 1)}
            aria-label="Increase quantity"
          >
            <Plus size={14} />
          </button>
        </div>

        <button
          type="button"
          className="btn-primary purchase-add-cart-btn"
          onClick={handleAddToCart}
        >
          <ShoppingBag size={18} />
          <span>ADD TO CART</span>
        </button>

        <button
          type="button"
          className={`purchase-wishlist-toggle ${isWishlisted ? 'active' : ''}`}
          onClick={() => toggleWishlist(product)}
          aria-label={isWishlisted ? 'Remove from wishlist' : 'Save to wishlist'}
          title="Save to Wishlist"
        >
          <Heart size={18} fill={isWishlisted ? '#FF5A79' : 'none'} />
        </button>
      </div>

      {/* Direct Contact CTAs */}
      <div className="purchase-direct-ctas">
        <button
          type="button"
          className="purchase-btn-enquire"
          onClick={() => onOpenEnquiry(product.name)}
        >
          <Sparkles size={16} />
          <span>BUY / REQUEST SHOWROOM DEMO</span>
        </button>

        <a
          href={getWhatsAppLink(undefined, product.name)}
          target="_blank"
          rel="noopener noreferrer"
          className="purchase-btn-whatsapp"
        >
          <MessageCircle size={18} />
          <span>DIRECT WHATSAPP CONSULTATION</span>
        </a>

        <a href={getPhoneLink()} className="purchase-btn-phone">
          <Phone size={16} />
          <span>CALL CHENNAI SPECIALIST: {siteConfig.contact.phoneDisplay}</span>
        </a>
      </div>

      {/* Value Trust Badges */}
      <div className="purchase-trust-card">
        <div className="trust-row">
          <ShieldCheck size={18} className="trust-icon" />
          <div>
            <span className="trust-title">DIRECT HUNTING BRAND WARRANTY</span>
            <span className="trust-desc">Operated & fulfilled by NAP Computers & Electronics, Chennai</span>
          </div>
        </div>

        <div className="trust-row">
          <Truck size={18} className="trust-icon" />
          <div>
            <span className="trust-title">PAN-INDIA INSURED TRANSIT</span>
            <span className="trust-desc">Shock-resistant optical transit box with tracking</span>
          </div>
        </div>
      </div>

    </div>
  );
};
