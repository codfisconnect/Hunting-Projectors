import React, { useState, useEffect, useMemo, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  CheckCircle, 
  MapPin, 
  ShieldCheck, 
  CreditCard, 
  ArrowRight, 
  Plus, 
  ShoppingBag,
  Package,
  AlertCircle,
  ChevronDown
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { addressService } from '../../services/addressService';
import { orderService } from '../../services/orderService';
import { paymentClient } from '../../services/paymentService';
import { Address, AddressInput } from '../../types/address';
import { CheckoutCalculation, Order } from '../../types/order';
import { 
  INDIAN_STATES_AND_CITIES, 
  ALL_INDIAN_STATES, 
  validateIndianPincode, 
  validateIndianPhone 
} from '../../data/indianLocations';
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
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [completedOrder, setCompletedOrder] = useState<Order | null>(null);

  // Address Form State
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

  // Autocomplete UI states
  const [stateSearch, setStateSearch] = useState('');
  const [isStateOpen, setIsStateOpen] = useState(false);
  const [citySearch, setCitySearch] = useState('');
  const [isCityOpen, setIsCityOpen] = useState(false);

  // Validation errors
  const [fieldErrors, setFieldErrors] = useState<{ [key: string]: string }>({});

  const stateDropdownRef = useRef<HTMLDivElement>(null);
  const cityDropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (stateDropdownRef.current && !stateDropdownRef.current.contains(e.target as Node)) {
        setIsStateOpen(false);
      }
      if (cityDropdownRef.current && !cityDropdownRef.current.contains(e.target as Node)) {
        setIsCityOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Filtered states list
  const filteredStates = useMemo(() => {
    if (!stateSearch) return ALL_INDIAN_STATES;
    return ALL_INDIAN_STATES.filter(s => s.toLowerCase().includes(stateSearch.toLowerCase()));
  }, [stateSearch]);

  // Cities for currently selected state
  const availableCities = useMemo(() => {
    const found = INDIAN_STATES_AND_CITIES.find(item => item.state.toLowerCase() === newAddr.state.toLowerCase());
    const list = found ? found.cities : [];
    if (!citySearch) return list;
    return list.filter(c => c.toLowerCase().includes(citySearch.toLowerCase()));
  }, [newAddr.state, citySearch]);

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
          // If backend returns cart empty or invalid, clear calculation and show user-friendly message
          if (err.message?.toLowerCase().includes('empty')) {
            setCalculation(null);
          } else {
            setError(err.message || 'Error calculating checkout totals.');
          }
        })
        .finally(() => setIsCalculating(false));
    }
  }, [isAuthenticated, cart.length, completedOrder]);

  const validateAddressForm = (): boolean => {
    const errors: { [key: string]: string } = {};

    if (!newAddr.fullName.trim()) {
      errors.fullName = 'Full Name is required.';
    }

    const phoneCheck = validateIndianPhone(newAddr.phoneNumber);
    if (!phoneCheck.isValid) {
      errors.phoneNumber = phoneCheck.message;
    }

    if (!newAddr.addressLine1.trim()) {
      errors.addressLine1 = 'Address Line 1 is required.';
    }

    if (!newAddr.state.trim()) {
      errors.state = 'Please select a State or Union Territory.';
    }

    if (!newAddr.city.trim()) {
      errors.city = 'City is required.';
    }

    const pinCheck = validateIndianPincode(newAddr.pincode);
    if (!pinCheck.isValid) {
      errors.pincode = pinCheck.message;
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleCreateNewAddress = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!validateAddressForm()) {
      return;
    }

    try {
      const added = await addressService.createAddress(newAddr);
      setAddresses(prev => [added, ...prev]);
      setSelectedAddressId(added.id);
      setIsAddingNewAddress(false);
      setFieldErrors({});
    } catch (err: any) {
      setError(err.message || 'Could not save address.');
    }
  };

  const handlePlaceOrder = async () => {
    if (cart.length === 0) {
      setError('Your shopping cart is empty.');
      return;
    }

    if (!selectedAddressId && !isAddingNewAddress) {
      setError('Please select or enter a delivery address.');
      return;
    }

    if (isAddingNewAddress && !validateAddressForm()) {
      setError('Please correct the errors in the delivery address form.');
      return;
    }

    setError(null);
    setIsSubmitting(true);

    try {
      const payload = selectedAddressId
        ? { addressId: selectedAddressId }
        : { shippingAddress: newAddr };

      // 1. Authoritative Order Creation in Database
      const order = await orderService.createOrder(payload);

      // 2. Authoritative Gateway Order Creation
      setIsProcessingPayment(true);
      const rzpData = await paymentClient.createPaymentOrder(order.id);

      // Check if Razorpay Checkout SDK is available in window
      const Razorpay = (window as any).Razorpay;
      if (typeof Razorpay !== 'function') {
        // Fallback if script blocked: Keep order reserved and let user view in orders
        setCompletedOrder(order);
        await clearCart();
        return;
      }

      // 3. Launch Razorpay Standard Checkout
      const options = {
        key: rzpData.keyId,
        amount: rzpData.amount,
        currency: rzpData.currency,
        name: 'Hunting Projector',
        description: `Order #${order.orderNumber} Optical System`,
        image: '/assets/hunting-projectors-og.png',
        order_id: rzpData.razorpayOrderId,
        prefill: {
          name: rzpData.customer.name,
          email: rzpData.customer.email,
          contact: rzpData.customer.phone,
        },
        theme: {
          color: '#12151D',
        },
        modal: {
          ondismiss: () => {
            setIsProcessingPayment(false);
            setIsSubmitting(false);
            setError(`Payment was cancelled or closed. Your order #${order.orderNumber} is reserved in your account. You can complete payment at any time.`);
          },
        },
        handler: async (response: any) => {
          try {
            // 4. Server-Side Cryptographic Signature Verification
            const verifyRes = await paymentClient.verifyPayment({
              orderId: order.id,
              razorpayOrderId: response.razorpay_order_id,
              razorpayPaymentId: response.razorpay_payment_id,
              razorpaySignature: response.razorpay_signature,
            });

            if (verifyRes.verified) {
              setCompletedOrder({
                ...order,
                paymentStatus: 'PAID',
                orderStatus: 'CONFIRMED',
              });
              await clearCart();
            } else {
              setError('Payment verification pending. Our team will verify your transaction.');
              setCompletedOrder(order);
              await clearCart();
            }
          } catch (verErr: any) {
            setError(verErr.message || 'Payment signature verification failed.');
            setCompletedOrder(order);
            await clearCart();
          } finally {
            setIsProcessingPayment(false);
            setIsSubmitting(false);
          }
        },
      };

      const rzpInstance = new Razorpay(options);
      rzpInstance.on('payment.failed', (resp: any) => {
        setIsProcessingPayment(false);
        setIsSubmitting(false);
        setError(`Payment failed: ${resp.error?.description || 'Transaction declined by bank.'}`);
      });
      rzpInstance.open();

    } catch (err: any) {
      setError(err.message || 'Failed to place order. Please review your details.');
      setIsSubmitting(false);
      setIsProcessingPayment(false);
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
              Thank you for ordering with Hunting Projector. Your hardware allocation is confirmed.
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

  // 2. Consistent Empty Cart Guard: Never display checkout form if cart is empty
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

  const calculatedSubtotal = calculation?.subtotal ?? cart.reduce((s, i) => s + i.product.price * i.quantity, 0);
  const calculatedTotal = calculation?.total ?? calculatedSubtotal;

  return (
    <div className="checkout-page-container">
      <div className="container">
        
        {/* Header */}
        <div className="checkout-header">
          <h1 className="checkout-title">Secure Checkout</h1>
          <p className="checkout-subtitle">Authoritative pan-India order placement with brand warranty registration.</p>
        </div>

        {error && (
          <div className="auth-error-banner" style={{ marginBottom: '24px' }} role="alert">
            <AlertCircle size={18} style={{ flexShrink: 0, marginTop: '2px' }} />
            <span>{error}</span>
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
                        <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                          📞 {addr.phoneNumber}
                        </div>
                      </div>
                    ))}
                  </div>

                  <button 
                    type="button" 
                    className="btn-add-address" 
                    onClick={() => {
                      setIsAddingNewAddress(true);
                      setSelectedAddressId(null);
                    }}
                  >
                    <Plus size={14} />
                    <span>Use a Different Address</span>
                  </button>
                </>
              )}

              {/* New Address Form with Indian State/City Search & 6-Digit PIN Code */}
              {(isAddingNewAddress || addresses.length === 0) && (
                <form className="auth-form" onSubmit={handleCreateNewAddress} noValidate>
                  <div className="checkout-form-row two-col">
                    <div className="auth-field">
                      <label className="auth-label">Full Name *</label>
                      <input 
                        type="text" 
                        required 
                        className={`auth-input ${fieldErrors.fullName ? 'input-error' : ''}`}
                        style={{ paddingLeft: '14px' }}
                        value={newAddr.fullName}
                        onChange={e => {
                          setNewAddr(prev => ({ ...prev, fullName: e.target.value }));
                          if (fieldErrors.fullName) setFieldErrors(prev => ({ ...prev, fullName: '' }));
                        }}
                        placeholder="Recipient Name"
                      />
                      {fieldErrors.fullName && <span className="field-error-text">{fieldErrors.fullName}</span>}
                    </div>

                    <div className="auth-field">
                      <label className="auth-label">Phone Number *</label>
                      <input 
                        type="tel" 
                        required 
                        maxLength={10}
                        className={`auth-input ${fieldErrors.phoneNumber ? 'input-error' : ''}`}
                        style={{ paddingLeft: '14px' }}
                        value={newAddr.phoneNumber}
                        onChange={e => {
                          const val = e.target.value.replace(/\D/g, '').slice(0, 10);
                          setNewAddr(prev => ({ ...prev, phoneNumber: val }));
                          if (fieldErrors.phoneNumber) setFieldErrors(prev => ({ ...prev, phoneNumber: '' }));
                        }}
                        placeholder="10-digit mobile number"
                      />
                      {fieldErrors.phoneNumber && <span className="field-error-text">{fieldErrors.phoneNumber}</span>}
                    </div>
                  </div>

                  <div className="auth-field">
                    <label className="auth-label">Address Line 1 (Flat / House / Street) *</label>
                    <input 
                      type="text" 
                      required 
                      className={`auth-input ${fieldErrors.addressLine1 ? 'input-error' : ''}`}
                      style={{ paddingLeft: '14px' }}
                      value={newAddr.addressLine1}
                      onChange={e => {
                        setNewAddr(prev => ({ ...prev, addressLine1: e.target.value }));
                        if (fieldErrors.addressLine1) setFieldErrors(prev => ({ ...prev, addressLine1: '' }));
                      }}
                      placeholder="e.g. 42 Optical Avenue, T. Nagar"
                    />
                    {fieldErrors.addressLine1 && <span className="field-error-text">{fieldErrors.addressLine1}</span>}
                  </div>

                  <div className="checkout-form-row three-col">
                    {/* Searchable State Dropdown */}
                    <div className="auth-field dropdown-parent" ref={stateDropdownRef}>
                      <label className="auth-label">State / UT *</label>
                      <div className="autocomplete-input-wrapper">
                        <input 
                          type="text" 
                          required 
                          className={`auth-input ${fieldErrors.state ? 'input-error' : ''}`}
                          style={{ paddingLeft: '14px', paddingRight: '36px' }}
                          value={isStateOpen ? stateSearch : newAddr.state}
                          onFocus={() => {
                            setStateSearch('');
                            setIsStateOpen(true);
                          }}
                          onChange={e => {
                            setStateSearch(e.target.value);
                            setNewAddr(prev => ({ ...prev, state: e.target.value }));
                            if (fieldErrors.state) setFieldErrors(prev => ({ ...prev, state: '' }));
                          }}
                          placeholder="Search state..."
                        />
                        <ChevronDown 
                          size={16} 
                          className="dropdown-chevron"
                          onClick={() => setIsStateOpen(prev => !prev)}
                        />
                      </div>

                      {isStateOpen && (
                        <ul className="autocomplete-dropdown-list">
                          {filteredStates.map(st => (
                            <li 
                              key={st}
                              className={`dropdown-item ${newAddr.state === st ? 'active' : ''}`}
                              onClick={() => {
                                setNewAddr(prev => ({ 
                                  ...prev, 
                                  state: st,
                                  // Clear city if previously selected city does not belong to new state
                                  city: '' 
                                }));
                                setIsStateOpen(false);
                                if (fieldErrors.state) setFieldErrors(prev => ({ ...prev, state: '' }));
                              }}
                            >
                              {st}
                            </li>
                          ))}
                          {filteredStates.length === 0 && (
                            <li className="dropdown-item no-match">No matching state</li>
                          )}
                        </ul>
                      )}
                      {fieldErrors.state && <span className="field-error-text">{fieldErrors.state}</span>}
                    </div>

                    {/* Searchable City Dropdown */}
                    <div className="auth-field dropdown-parent" ref={cityDropdownRef}>
                      <label className="auth-label">City *</label>
                      <div className="autocomplete-input-wrapper">
                        <input 
                          type="text" 
                          required 
                          className={`auth-input ${fieldErrors.city ? 'input-error' : ''}`}
                          style={{ paddingLeft: '14px', paddingRight: '36px' }}
                          value={isCityOpen ? citySearch : newAddr.city}
                          onFocus={() => {
                            setCitySearch('');
                            setIsCityOpen(true);
                          }}
                          onChange={e => {
                            setCitySearch(e.target.value);
                            setNewAddr(prev => ({ ...prev, city: e.target.value }));
                            if (fieldErrors.city) setFieldErrors(prev => ({ ...prev, city: '' }));
                          }}
                          placeholder={newAddr.state ? "Search city..." : "Select state first..."}
                        />
                        <ChevronDown 
                          size={16} 
                          className="dropdown-chevron"
                          onClick={() => setIsCityOpen(prev => !prev)}
                        />
                      </div>

                      {isCityOpen && (
                        <ul className="autocomplete-dropdown-list">
                          {availableCities.map(ct => (
                            <li 
                              key={ct}
                              className={`dropdown-item ${newAddr.city === ct ? 'active' : ''}`}
                              onClick={() => {
                                setNewAddr(prev => ({ ...prev, city: ct }));
                                setIsCityOpen(false);
                                if (fieldErrors.city) setFieldErrors(prev => ({ ...prev, city: '' }));
                              }}
                            >
                              {ct}
                            </li>
                          ))}
                          {availableCities.length === 0 && (
                            <li className="dropdown-item fallback-notice">
                              <span>Enter custom city above if not listed</span>
                            </li>
                          )}
                        </ul>
                      )}
                      {fieldErrors.city && <span className="field-error-text">{fieldErrors.city}</span>}
                    </div>

                    {/* 6-Digit PIN Code */}
                    <div className="auth-field">
                      <label className="auth-label">PIN Code *</label>
                      <input 
                        type="text" 
                        required 
                        maxLength={6}
                        className={`auth-input ${fieldErrors.pincode ? 'input-error' : ''}`}
                        style={{ paddingLeft: '14px' }}
                        value={newAddr.pincode}
                        onChange={e => {
                          const val = e.target.value.replace(/\D/g, '').slice(0, 6);
                          setNewAddr(prev => ({ ...prev, pincode: val }));
                          if (fieldErrors.pincode) setFieldErrors(prev => ({ ...prev, pincode: '' }));
                        }}
                        placeholder="6 digits (e.g. 600001)"
                      />
                      {fieldErrors.pincode && <span className="field-error-text">{fieldErrors.pincode}</span>}
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: '12px', marginTop: '8px' }}>
                    {addresses.length > 0 && (
                      <button 
                        type="button" 
                        className="btn-address-action" 
                        onClick={() => setIsAddingNewAddress(false)}
                      >
                        ← Back to saved addresses
                      </button>
                    )}
                    <button 
                      type="submit" 
                      className="btn-save-address"
                    >
                      Save & Use This Address
                    </button>
                  </div>
                </form>
              )}
            </div>

            {/* Payment Method Notice */}
            <div className="checkout-step-card">
              <h2 className="step-card-title">
                <span className="step-number-pip">2</span>
                Payment Gateway
              </h2>
              <div className="payment-method-card">
                <div className="payment-method-header">
                  <div className="payment-badge-group">
                    <CreditCard size={20} className="payment-icon" />
                    <span className="payment-title">Razorpay Secure Checkout</span>
                  </div>
                  <span className="payment-secure-pill">256-BIT ENCRYPTION</span>
                </div>
                <p className="payment-method-description">
                  Official pan-India gateway supporting Instant UPI (Google Pay, PhonePe, Paytm, BHIM), all major Credit/Debit Cards (Visa, MasterCard, RuPay), Net Banking across 50+ banks, and Cardless EMI.
                </p>
                <div className="payment-channel-badges">
                  <span className="channel-badge">⚡ UPI Auto-Pay & QR</span>
                  <span className="channel-badge">💳 Credit & Debit Cards</span>
                  <span className="channel-badge">🏦 Net Banking</span>
                  <span className="channel-badge">🛡️ Fraud Protection</span>
                </div>
              </div>
            </div>

          </div>

          {/* Right Column: Order Summary */}
          <div>
            <div className="checkout-summary-card">
              <h2 className="step-card-title" style={{ fontSize: '1.15rem' }}>
                Order Summary ({totalItems} {totalItems === 1 ? 'item' : 'items'})
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
                  <span>₹{calculatedSubtotal.toLocaleString('en-IN')}</span>
                </div>
                <div className="summary-line">
                  <span>Insured Shipping (Pan-India)</span>
                  <span style={{ color: 'var(--accent-acid-lime)', fontWeight: 700 }}>FREE</span>
                </div>
                <div className="summary-line total">
                  <span>Total Payable</span>
                  <span style={{ color: 'var(--accent-acid-lime)', fontSize: '1.25rem' }}>
                    ₹{calculatedTotal.toLocaleString('en-IN')}
                  </span>
                </div>
              </div>

              {/* High-Contrast Visible Submit CTA */}
              <button
                type="button"
                className="checkout-place-btn"
                onClick={handlePlaceOrder}
                disabled={isSubmitting || isCalculating || isProcessingPayment}
                aria-label="Pay & Confirm Order"
              >
                <span>
                  {isProcessingPayment ? 'Connecting Gateway...' : isSubmitting ? 'Placing Order...' : 'Pay & Confirm Order'}
                </span>
                <ArrowRight size={18} />
              </button>

              <div className="checkout-assurance-box">
                <ShieldCheck size={16} className="assurance-icon" />
                <span>Authoritative 2-Year Direct Brand Warranty & Insured Transit</span>
              </div>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
