import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Package, 
  Clock, 
  MapPin, 
  AlertCircle, 
  CheckCircle, 
  XCircle, 
  ArrowRight,
  ShieldCheck,
  CreditCard
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { orderService } from '../../services/orderService';
import { Order } from '../../types/order';
import './Orders.css';

export const OrdersPage: React.FC = () => {
  const { user, isAuthenticated, isLoading: isAuthLoading } = useAuth();
  const navigate = useNavigate();

  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actionMessage, setActionMessage] = useState<string | null>(null);

  useEffect(() => {
    if (!isAuthLoading && !isAuthenticated) {
      navigate('/login', { state: { from: { pathname: '/orders' } } });
      return;
    }

    if (isAuthenticated) {
      setIsLoading(true);
      orderService.getOrders()
        .then(list => setOrders(list))
        .catch(err => setError(err.message || 'Failed to load your orders.'))
        .finally(() => setIsLoading(false));
    }
  }, [isAuthenticated, isAuthLoading, navigate]);

  const handleCancelOrder = async (orderId: string, orderNumber: string) => {
    if (!window.confirm(`Are you sure you want to cancel order #${orderNumber}? Inventory will be released back to the catalog.`)) {
      return;
    }

    try {
      const updated = await orderService.cancelOrder(orderId, 'Customer requested cancellation via portal');
      setOrders(prev => prev.map(o => o.id === orderId ? updated : o));
      setActionMessage(`Order #${orderNumber} has been successfully cancelled.`);
    } catch (err: any) {
      alert(err.message || 'Could not cancel order.');
    }
  };

  const handleConfirmTestPayment = async (orderId: string, orderNumber: string) => {
    try {
      const updated = await orderService.confirmTestPayment(orderId);
      setOrders(prev => prev.map(o => o.id === orderId ? updated : o));
      setActionMessage(`Test payment confirmed for order #${orderNumber}. Status is now PAID & CONFIRMED.`);
    } catch (err: any) {
      alert(err.message || 'Payment confirmation failed.');
    }
  };

  if (isAuthLoading || isLoading) {
    return (
      <div className="orders-page-container text-center" style={{ padding: '120px 20px' }}>
        <p style={{ color: 'var(--text-secondary)' }}>Loading your hardware orders...</p>
      </div>
    );
  }

  return (
    <div className="orders-page-container">
      <div className="container">
        
        {/* Header */}
        <div className="orders-header">
          <div>
            <h1 className="orders-title">My Orders & Allocations</h1>
            <p className="orders-subtitle">Track hardware fulfillment, shipping dispatch, and official brand warranties.</p>
          </div>
        </div>

        {actionMessage && (
          <div style={{ padding: '12px 16px', background: 'rgba(52, 199, 89, 0.12)', border: '1px solid rgba(52, 199, 89, 0.3)', borderRadius: 'var(--radius-sm)', color: 'var(--status-success)', marginBottom: '24px' }}>
            {actionMessage}
          </div>
        )}

        {error && (
          <div className="auth-error-banner" style={{ marginBottom: '24px' }}>
            {error}
          </div>
        )}

        {/* Empty Orders State */}
        {orders.length === 0 ? (
          <div className="text-center" style={{ padding: '80px 20px', background: 'var(--bg-surface)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
            <Package size={48} color="var(--text-muted)" style={{ margin: '0 auto 16px' }} />
            <h2 style={{ fontSize: '1.3rem', color: 'var(--text-primary)', marginBottom: '8px' }}>No Orders Found</h2>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '24px' }}>You haven't placed any projector hardware orders yet.</p>
            <Link to="/products" className="auth-submit-btn" style={{ width: 'auto', display: 'inline-flex', padding: '12px 24px' }}>
              Explore Projectors
            </Link>
          </div>
        ) : (
          <div className="orders-list">
            {orders.map(order => {
              const isCancellable = order.orderStatus === 'PENDING' || order.orderStatus === 'CONFIRMED';
              const isPaymentPending = order.paymentStatus === 'PENDING';
              const formattedDate = new Date(order.createdAt).toLocaleDateString('en-IN', {
                year: 'numeric',
                month: 'short',
                day: 'numeric'
              });

              return (
                <div key={order.id} className="order-card">
                  
                  {/* Order Top Meta Strip */}
                  <div className="order-card-header">
                    <div className="order-meta-group">
                      <div className="order-meta-item">
                        <span className="order-meta-label">ORDER NUMBER</span>
                        <span className="order-meta-val" style={{ fontFamily: 'var(--font-mono)', color: 'var(--accent-ice-blue)' }}>
                          #{order.orderNumber}
                        </span>
                      </div>
                      <div className="order-meta-item">
                        <span className="order-meta-label">DATE PLACED</span>
                        <span className="order-meta-val">{formattedDate}</span>
                      </div>
                      <div className="order-meta-item">
                        <span className="order-meta-label">TOTAL AMOUNT</span>
                        <span className="order-meta-val" style={{ color: 'var(--accent-acid-lime)', fontFamily: 'var(--font-mono)' }}>
                          ₹{Number(order.totalAmount).toLocaleString('en-IN')}
                        </span>
                      </div>
                    </div>

                    <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                      <span className={`order-status-badge status-${order.orderStatus.toLowerCase()}`}>
                        {order.orderStatus}
                      </span>
                      <span className={`order-status-badge status-${order.paymentStatus.toLowerCase()}`}>
                        {order.paymentStatus === 'PAID' ? 'PAID' : 'PAYMENT PENDING'}
                      </span>
                    </div>
                  </div>

                  {/* Order Items */}
                  <div className="order-card-body">
                    <div className="order-items-grid">
                      {order.items.map(item => {
                        const heroImg = item.product?.images?.[0]?.url || '/assets/products/hunting-h900-hero.svg';
                        return (
                          <div key={item.id} className="order-item-tile">
                            <img src={heroImg} alt={item.productName || 'Projector'} className="order-item-img" />
                            <div className="order-item-details">
                              <div className="order-item-name">{item.productName || item.product?.name}</div>
                              <div className="order-item-sub">
                                Quantity: {item.quantity} × ₹{Number(item.unitPrice).toLocaleString('en-IN')}
                              </div>
                            </div>
                            <div style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, color: 'var(--text-primary)' }}>
                              ₹{(Number(item.unitPrice) * item.quantity).toLocaleString('en-IN')}
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    {/* Delivery Destination Snapshot */}
                    <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', background: 'var(--bg-surface-elevated)', padding: '12px 16px', borderRadius: 'var(--radius-sm)' }}>
                      <span style={{ fontWeight: 700, color: 'var(--text-primary)' }}>Delivery Destination: </span>
                      {order.customerName} ({order.customerPhone}) — {order.addressLine}, {order.city}, {order.state} - {order.pincode}
                    </div>
                  </div>

                  {/* Order Actions Strip */}
                  <div className="order-card-footer">
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                      Payment Method: {order.paymentMethod}
                    </span>

                    <div style={{ display: 'flex', gap: '10px' }}>
                      {isPaymentPending && order.orderStatus !== 'CANCELLED' && (
                        <button
                          type="button"
                          className="btn-order-action btn-order-pay-test"
                          onClick={() => handleConfirmTestPayment(order.id, order.orderNumber)}
                          title="Simulate successful payment for development"
                        >
                          <CreditCard size={13} style={{ marginRight: '5px' }} />
                          Simulate Payment
                        </button>
                      )}

                      {isCancellable && (
                        <button
                          type="button"
                          className="btn-order-action btn-order-cancel"
                          onClick={() => handleCancelOrder(order.id, order.orderNumber)}
                        >
                          Cancel Order
                        </button>
                      )}
                    </div>
                  </div>

                </div>
              );
            })}
          </div>
        )}

      </div>
    </div>
  );
};
