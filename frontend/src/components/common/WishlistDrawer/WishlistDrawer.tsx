import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { X, Heart, Trash2, ShoppingBag, ArrowRight } from 'lucide-react';
import { useWishlist } from '../../../context/WishlistContext';
import { useCart } from '../../../context/CartContext';
import './WishlistDrawer.css';

interface WishlistDrawerProps {
  onOpenEnquiry: (productName?: string) => void;
}

export const WishlistDrawer: React.FC<WishlistDrawerProps> = () => {
  const { wishlist, isWishlistOpen, setIsWishlistOpen, toggleWishlist } = useWishlist();
  const { addToCart } = useCart();

  useEffect(() => {
    if (isWishlistOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isWishlistOpen]);

  if (!isWishlistOpen) return null;

  return (
    <div className="wishlist-drawer-overlay" onClick={() => setIsWishlistOpen(false)} role="dialog" aria-modal="true">
      <div className="wishlist-drawer-panel" onClick={e => e.stopPropagation()}>
        
        {/* Header */}
        <div className="wishlist-drawer-header">
          <div className="wishlist-header-title">
            <Heart size={20} className="wishlist-header-icon" />
            <h3>SAVED PROJECTORS</h3>
            <span className="wishlist-count-pill">{wishlist.length}</span>
          </div>
          <button 
            type="button" 
            className="wishlist-close-btn" 
            onClick={() => setIsWishlistOpen(false)}
            aria-label="Close wishlist"
          >
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <div className="wishlist-drawer-body">
          {wishlist.length === 0 ? (
            <div className="wishlist-empty-state">
              <div className="empty-wishlist-icon">
                <Heart size={44} strokeWidth={1.5} />
              </div>
              <h4>No Saved Projectors</h4>
              <p>Click the heart icon on any Hunting model to save it to your shortlist for side-by-side comparison.</p>
              <button 
                type="button" 
                className="btn-primary"
                onClick={() => setIsWishlistOpen(false)}
              >
                BROWSE CATALOG
              </button>
            </div>
          ) : (
            <div className="wishlist-items-list">
              {wishlist.map(product => (
                <div key={product.id} className="wishlist-item-card">
                  <div className="wishlist-item-img">
                    <img src={product.images.hero} alt={product.name} />
                  </div>
                  <div className="wishlist-item-details">
                    <span className="wishlist-item-cat">{product.categoryLabel}</span>
                    <h4 className="wishlist-item-name">{product.name}</h4>
                    <p className="wishlist-item-res">{product.specifications.resolution} • {product.specifications.brightness}</p>
                    <div className="wishlist-item-price">
                      ₹{product.price.toLocaleString('en-IN')}
                    </div>

                    <div className="wishlist-item-actions">
                      <button 
                        type="button" 
                        className="wishlist-btn-cart"
                        onClick={() => {
                          addToCart(product);
                          setIsWishlistOpen(false);
                        }}
                      >
                        <ShoppingBag size={14} />
                        <span>ADD TO CART</span>
                      </button>

                      <Link 
                        to={`/products/${product.slug}`} 
                        className="wishlist-btn-view"
                        onClick={() => setIsWishlistOpen(false)}
                      >
                        <span>VIEW</span>
                        <ArrowRight size={13} />
                      </Link>

                      <button 
                        type="button" 
                        className="wishlist-btn-remove" 
                        onClick={() => toggleWishlist(product)}
                        title="Remove from wishlist"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
