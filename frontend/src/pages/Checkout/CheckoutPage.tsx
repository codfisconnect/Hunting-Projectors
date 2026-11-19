import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  CheckCircle, 
  MapPin, 
  ShieldCheck, 
  CreditCard, 
  ArrowRight, 
  Plus, 
  ShoppingBag,
  Package
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { addressService } from '../../services/addressService';
import { orderService } from '../../services/orderService';
import { Address, AddressInput } from '../../types/address';
import { CheckoutCalculation, Order } from '../../types/order';
import './Checkout.css';

export const CheckoutPage: React.FC = () => {
  const { user, isAuthenticated, isLoading: isAuthLoading } = useAuth();
  const { cart, totalItems, clearCart } = useCart();
  const navigate = useNavigate();

  const [addresses, setAddresses] = useState<Address[]>([]);
  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(null);
  const [isAddingNewAddress, setIsAddingNewAddress] = useState(false);
  const [calculation, setCalculation] = useState<CheckoutCalculation | null>(null);
  const [isCalculating, setIsCalculating] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [completedOrder, setCompletedOrder] = useState<Order | null>(null);

  const [newAddr, setNewAddr] = useState<AddressInput>({
    fullName: '',
    phoneNumber: '',
    addressLine1: '',
    addressLine2: '',
    landmark: '',
    city: '',
    state: '',
    pincode: '',
    country: 'India',
    addressType: 'HOME',
    isDefault: false,
  });

  // Guard: Redirect to login if not authenticated
  useEffect(() => {
    if (!isAuthLoading && !isAuthenticated) {
      navigate('/login', { state: { from: { pathname: '/checkout' } } });
      return;
    }

    if (isAuthenticated) {
      addressService.getAddresses()
        .then(list => {
          setAddresses(list);
          const defaultAddr = list.find(a => a.isDefault) || list[0];
          if (defaultAddr) {
            setSelectedAddressId(defaultAddr.id);
          } else {
            setIsAddingNewAddress(true);
          }
        })
        .catch(err => console.warn('Could not fetch addresses:', err));
    }
  }, [isAuthenticated, isAuthLoading, navigate]);

  // Recalculate authoritative prices on the backend
  useEffect(() => {
    if (isAuthenticated && cart.length > 0 && !completedOrder) {
      setIsCalculating(true);
      setError(null);
      orderService.calculateCheckout()
        .then(calc => {
          setCalculation(calc);
        })
        .catch(err => {
          setError(err.message || 'Error calculating checkout totals.');
        })
        .finally(() => setIsCalculating(false));
    }
  }, [isAuthenticated, cart.length, completedOrder]);

  const handleCreateNewAddress = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      const added = await addressService.createAddress(newAddr);
      setAddresses(prev => [added, ...prev]);
      setSelectedAddressId(added.id);
      setIsAddingNewAddress(false);
    } catch (err: any) {
      setError(err.message || 'Could not save address.');
    }
  };

  const handlePlaceOrder = async () => {
    if (!selectedAddressId && !isAddingNewAddress) {
      setError('Please select or enter a delivery address.');
      return;
    }

    setError(null);
    setIsSubmitting(true);

    try {
      const payload = selectedAddressId
        ? { addressId: selectedAddressId }
        : { shippingAddress: newAddr };

      const order = await orderService.createOrder(payload);
      setCompletedOrder(order);
      await clearCart();
    } catch (err: any) {
      setError(err.message || 'Failed to place order. Please review your details.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // 1. Order Confirmation View
  if (completedOrder) {
    return (
      <div className="checkout-page-container">
        <div className="container">
          <div className="confirmation-card">
            <div className="confirmation-icon-circle">
              <CheckCircle size={38} />
            </div>
            <h1 className="checkout-title" style={{ marginBottom: '8px' }}>Order Placed Successfully!</h1>
            <p className="checkout-subtitle">
              Thank you for ordering with Hunting Projectors. Your hardware allocation is confirmed.
            </p>
            <div className="confirmation-order-num">
              ORDER REFERENCE: #{completedOrder.orderNumber}
            </div>

            <div style={{ textAlign: 'left', background: 'var(--bg-surface-elevated)', padding: '20px', borderRadius: 'var(--radius-sm)', margin: '24px 0' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                <span style={{ color: 'var(--text-secondary)' }}>Fulfillment Status:</span>
                <span style={{ fontWeight: 700, color: 'var(--accent-ice-blue)' }}>{completedOrder.orderStatus}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                <span style={{ color: 'var(--text-secondary)' }}>Payment Status:</span>
                <span style={{ fontWeight: 700, color: 'var(--status-warning)' }}>{completedOrder.paymentStatus}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                <span style={{ color: 'var(--text-secondary)' }}>Delivery Location:</span>
                <span style={{ color: 'var(--text-primary)', textAlign: 'right' }}>
                  {completedOrder.city}, {completedOrder.state} - {completedOrder.pincode}
                </span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid var(--border-subtle)', paddingTop: '12px' }}>
                <span style={{ fontWeight: 700, color: 'var(--text-primary)' }}>Total Amount:</span>
                <span style={{ fontWeight: 800, color: 'var(--accent-acid-lime)', fontFamily: 'var(--font-mono)' }}>
                  ₹{Number(completedOrder.totalAmount).toLocaleString('en-IN')}
                </span>
              </div>
            </div>

            <div className="confirmation-actions">
              <Link to="/orders" className="auth-submit-btn" style={{ width: 'auto', padding: '14px 28px' }}>
                <Package size={16} />
                <span>View My Orders</span>
              </Link>
              <Link to="/products" className="auth-submit-btn" style={{ width: 'auto', padding: '14px 24px', background: 'transparent', color: 'var(--text-primary)', border: '1px solid var(--border-subtle)' }}>
                <span>Continue Shopping</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // 2. Empty Cart Guard
  if (cart.length === 0) {
    return (
      <div className="checkout-page-container text-center" style={{ padding: '120px 20px' }}>
        <ShoppingBag size={48} color="var(--text-muted)" style={{ margin: '0 auto 20px' }} />
        <h1 className="checkout-title">Your Cart is Empty</h1>
        <p className="checkout-subtitle" style={{ marginBottom: '28px' }}>
          Explore our reference 4K and smart projector systems before checking out.
        </p>
        <Link to="/products" className="auth-submit-btn" style={{ width: 'auto', display: 'inline-flex', padding: '12px 28px' }}>
          Browse Projectors
        </Link>
      </div>
    );
  }

  return (
    <div className="checkout-page-container">
      <div className="container">
        
        {/* Header */}
        <div className="checkout-header">
          <h1 className="checkout-title">Secure Checkout</h1>
          <p className="checkout-subtitle">Authoritative pan-India order placement with brand warranty registration.</p>
        </div>

        {error && (
          <div className="auth-error-banner" style={{ marginBottom: '24px' }}>
            {error}
          </div>
        )}

        <div className="checkout-layout">
          
          {/* Left Column: Delivery Address & Details */}
          <div className="checkout-steps-column">
            
            <div className="checkout-step-card">
              <h2 className="step-card-title">
                <span className="step-number-pip">1</span>
                Delivery Destination
              </h2>

              {/* Saved Address Selector */}
              {addresses.length > 0 && !isAddingNewAddress && (
                <>
                  <div className="checkout-address-selector">
                    {addresses.map(addr => (
                      <div 
                        key={addr.id} 
                        className={`selectable-address-box ${selectedAddressId === addr.id ? 'selected' : ''}`}
                        onClick={() => setSelectedAddressId(addr.id)}
                      >
                        <div style={{ fontWeight: 700, color: 'var(--text-primary)', marginBottom: '4px' }}>
                          {addr.fullName}
                        </div>
                        <div style={{ fontSize: '0.84rem', color: 'var(--text-secondary)', lineHeight: 1.4 }}>
                          {addr.addressLine1}
                          <br />
                          {addr.city}, {addr.state} - {addr.pincode}
                        </div>
                      </div>
                    ))}
                  </div>

                  <button 
                    type="button" 
                    className="btn-add-address" 
                    onClick={() => setIsAddingNewAddress(true)}
                  >
                    <Plus size={14} />
                    <span>Use a Different Address</span>
                  </button>
                </>
              )}

              {/* New Address Form */}
              {(isAddingNewAddress || addresses.length === 0) && (
                <form className="auth-form" onSubmit={handleCreateNewAddress}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                    <div className="auth-field">
                      <label className="auth-label">Full Name *</label>
                      <input 
                        type="text" 
                        required 
                        className="auth-input" 
                        style={{ paddingLeft: '14px' }}
                        value={newAddr.fullName}
                        onChange={e => setNewAddr(prev => ({ ...prev, fullName: e.target.value }))}
                        placeholder="Recipient Name"
                      />
                    </div>
                    <div className="auth-field">
                      <label className="auth-label">Phone *</label>
                      <input 
                        type="tel" 
                        required 
                        className="auth-input" 
                        style={{ paddingLeft: '14px' }}
                        value={newAddr.phoneNumber}
                        onChange={e => setNewAddr(prev => ({ ...prev, phoneNumber: e.target.value }))}
                        placeholder="10-digit mobile"
                      />
                    </div>
                  </div>

                  <div className="auth-field">
                    <label className="auth-label">Address Line 1 *</label>
                    <input 
                      type="text" 
                      required 
                      className="auth-input" 
                      style={{ paddingLeft: '14px' }}
                      value={newAddr.addressLine1}
                      onChange={e => setNewAddr(prev => ({ ...prev, addressLine1: e.target.value }))}
                      placeholder="House / Flat / Street"
                    />
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '14px' }}>
                    <div className="auth-field">
                      <label className="auth-label">City *</label>
                      <input 
                        type="text" 
                        required 
                        className="auth-input" 
                        style={{ paddingLeft: '14px' }}
                        value={newAddr.city}
                        onChange={e => setNewAddr(prev => ({ ...prev, city: e.target.value }))}
                      />
                    </div>
                    <div className="auth-field">
                      <label className="auth-label">State *</label>
                      <input 
                        type="text" 
                        required 
                        className="auth-input" 
                        style={{ paddingLeft: '14px' }}
                        value={newAddr.state}
                        onChange={e => setNewAddr(prev => ({ ...prev, state: e.target.value }))}
                      />
                    </div>
                    <div className="auth-field">
                      <label className="auth-label">PIN Code *</label>
                      <input 
                        type="text" 
                        required 
                        maxLength={6}
                        className="auth-input" 
                        style={{ paddingLeft: '14px' }}
                        value={newAddr.pincode}
                        onChange={e => setNewAddr(prev => ({ ...prev, pincode: e.target.value }))}
                      />
                    </div>
                  </div>

                  {addresses.length > 0 && (
                    <button 
                      type="button" 
                      className="btn-address-action" 
                      style={{ alignSelf: 'flex-start' }}
                      onClick={() => setIsAddingNewAddress(false)}
                    >
                      ← Back to saved addresses
                    </button>
                  )}
                </form>
              )}
            </div>

            {/* Payment Method Notice */}
            <div className="checkout-step-card">
              <h2 className="step-card-title">
                <span className="step-number-pip">2</span>
                Payment Method
              </h2>
              <div style={{ padding: '16px', background: 'var(--bg-surface-elevated)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--accent-ice-blue)', fontWeight: 700, marginBottom: '6px' }}>
                  <CreditCard size={18} />
                  <span>Direct Bank / Razorpay Development Mode</span>
                </div>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', margin: 0 }}>
                  Live Razorpay gateway integration is reserved for the next milestone. Your order will be created with status PENDING, reserving your inventory directly.
                </p>
              </div>
            </div>

          </div>

          {/* Right Column: Order Summary */}
          <div>
            <div className="checkout-summary-card">
              <h2 className="step-card-title" style={{ fontSize: '1.15rem' }}>
                Order Summary ({totalItems} items)
              </h2>

              {/* Items List */}
              <div className="summary-items-list">
                {cart.map(item => (
                  <div key={item.product.id} className="summary-item-row">
                    <img 
                      src={item.product.images.hero} 
                      alt={item.product.name} 
                      className="summary-item-img" 
                    />
                    <div className="summary-item-info">
                      <div className="summary-item-title">{item.product.name}</div>
                      <div className="summary-item-qty">Qty: {item.quantity}</div>
                    </div>
                    <div className="summary-item-price">
                      ₹{(item.product.price * item.quantity).toLocaleString('en-IN')}
                    </div>
                  </div>
                ))}
              </div>

              {/* Price Calculations */}
              <div className="summary-price-lines">
                <div className="summary-line">
                  <span>Subtotal</span>
                  <span>₹{(calculation?.subtotal ?? cart.reduce((s, i) => s + i.product.price * i.quantity, 0)).toLocaleString('en-IN')}</span>
                </div>
                <div className="summary-line">
                  <span>Shipping (Pan-India)</span>
                  <span style={{ color: 'var(--accent-acid-lime)' }}>FREE</span>
                </div>
                <div className="summary-line total">
                  <span>Total Amount</span>
                  <span style={{ color: 'var(--accent-acid-lime)' }}>
                    ₹{(calculation?.total ?? cart.reduce((s, i) => s + i.product.price * i.quantity, 0)).toLocaleString('en-IN')}
                  </span>
                </div>
              </div>

              {/* Submit CTA */}
              <button
                type="button"
                className="checkout-place-btn"
                onClick={handlePlaceOrder}
                disabled={isSubmitting || isCalculating}
              >
                <span>{isSubmitting ? 'Placing Order...' : 'Place Order'}</span>
                <ArrowRight size={16} />
              </button>

              <p style={{ textAlign: 'center', fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '14px', marginBottom: 0 }}>
                🔒 256-Bit SSL Secured Hardware Order & 2-Year Brand Warranty
              </p>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
