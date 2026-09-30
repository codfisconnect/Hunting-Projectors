import React, { useEffect } from 'react';
import { X, Trash2, Plus, Minus, ArrowRight, MessageCircle, ShoppingBag } from 'lucide-react';
import { useCart } from '../../../context/CartContext';
import { siteConfig } from '../../../data/siteContent';
import './CartDrawer.css';

interface CartDrawerProps {
  onOpenEnquiry: (productName?: string) => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({ onOpenEnquiry }) => {
  const {
    cart,
    isCartOpen,
    setIsCartOpen,
    removeFromCart,
    updateQuantity,
    clearCart,
    totalItems,
    subtotal,
  } = useCart();

  useEffect(() => {
    if (isCartOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isCartOpen]);

  if (!isCartOpen) return null;

  const handleWhatsAppCheckout = () => {
    const itemsList = cart.map(item => `• ${item.product.name} (Qty: ${item.quantity}) - ₹${(item.product.price * item.quantity).toLocaleString('en-IN')}`).join('%0A');
    const message = `Hello Hunting Projectors! I would like to place an order enquiry for the following equipment:%0A%0A${itemsList}%0A%0ATotal Estimated Amount: ₹${subtotal.toLocaleString('en-IN')}%0A%0APlease share delivery schedule and bank transfer/payment instructions.`;
    window.open(`https://wa.me/${siteConfig.contact.whatsapp}?text=${message}`, '_blank');
  };

  const handleEnquiryCheckout = () => {
    const summary = cart.map(i => `${i.product.name} (x${i.quantity})`).join(', ');
    setIsCartOpen(false);
    onOpenEnquiry(summary);
  };

  return (
    <div className="cart-drawer-overlay" onClick={() => setIsCartOpen(false)} role="dialog" aria-modal="true">
      <div className="cart-drawer-panel" onClick={e => e.stopPropagation()}>
        
        {/* Header */}
        <div className="cart-drawer-header">
          <div className="cart-header-title">
            <ShoppingBag size={20} className="cart-header-icon" />
            <h3>YOUR PROJECTOR CART</h3>
            <span className="cart-count-pill">{totalItems}</span>
          </div>
          <button 
            type="button" 
            className="cart-close-btn" 
            onClick={() => setIsCartOpen(false)}
            aria-label="Close cart"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="cart-drawer-body">
          {cart.length === 0 ? (
            <div className="cart-empty-state">
              <div className="empty-cart-icon">
                <ShoppingBag size={48} strokeWidth={1.5} />
              </div>
              <h4>Your Cart is Empty</h4>
              <p>Explore our premium 4K laser and cinema projectors to begin configuring your home theater.</p>
              <button 
                type="button" 
                className="btn-primary" 
                onClick={() => setIsCartOpen(false)}
              >
                EXPLORE PROJECTORS
              </button>
            </div>
          ) : (
            <div className="cart-items-list">
              {cart.map(item => (
                <div key={item.product.id} className="cart-item-card">
                  <div className="cart-item-img-wrapper">
                    <img src={item.product.images.hero} alt={item.product.name} />
                  </div>
                  <div className="cart-item-info">
                    <div className="cart-item-top">
                      <span className="cart-item-category">{item.product.categoryLabel}</span>
                      <h4 className="cart-item-name">{item.product.name}</h4>
                      <div className="cart-item-price">
                        ₹{(item.product.price * item.quantity).toLocaleString('en-IN')}
                      </div>
                    </div>
                    
                    <div className="cart-item-bottom">
                      <div className="cart-qty-controls">
                        <button 
                          type="button" 
                          onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                          aria-label="Decrease quantity"
                        >
                          <Minus size={13} />
                        </button>
                        <span>{item.quantity}</span>
                        <button 
                          type="button" 
                          onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                          aria-label="Increase quantity"
                        >
                          <Plus size={13} />
                        </button>
                      </div>

                      <button 
                        type="button" 
                        className="cart-remove-btn" 
                        onClick={() => removeFromCart(item.product.id)}
                        aria-label="Remove item"
                        title="Remove"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer Summary & Checkout */}
        {cart.length > 0 && (
          <div className="cart-drawer-footer">
            <div className="cart-subtotal-row">
              <span className="subtotal-label">Subtotal (Demo Pricing)</span>
              <span className="subtotal-value">₹{subtotal.toLocaleString('en-IN')}</span>
            </div>
            
            <p className="cart-demo-notice">
              Demo Checkout: Direct brand fulfillment from NAP Computers & Electronics, Chennai.
            </p>

            <div className="cart-action-buttons">
              <button 
                type="button" 
                className="cart-btn-whatsapp" 
                onClick={handleWhatsAppCheckout}
              >
                <MessageCircle size={18} />
                <span>ORDER VIA WHATSAPP</span>
              </button>

              <button 
                type="button" 
                className="cart-btn-enquire" 
                onClick={handleEnquiryCheckout}
              >
                <span>ENQUIRE TO PURCHASE</span>
                <ArrowRight size={16} />
              </button>
            </div>

            <button 
              type="button" 
              className="cart-clear-btn" 
              onClick={clearCart}
            >
              Clear Entire Cart
            </button>
          </div>
        )}

      </div>
    </div>
  );
};
