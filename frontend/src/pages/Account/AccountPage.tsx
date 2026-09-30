import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  User as UserIcon, 
  MapPin, 
  Package, 
  LogOut, 
  Plus, 
  Check, 
  Trash2, 
  ShieldCheck, 
  ArrowRight,
  Phone,
  Mail
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { addressService } from '../../services/addressService';
import { Address, AddressInput } from '../../types/address';
import './Account.css';

export const AccountPage: React.FC = () => {
  const { user, isAuthenticated, isLoading, logout } = useAuth();
  const navigate = useNavigate();

  const [addresses, setAddresses] = useState<Address[]>([]);
  const [isAddingAddress, setIsAddingAddress] = useState(false);
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
  const [addrError, setAddrError] = useState<string | null>(null);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      navigate('/login', { state: { from: { pathname: '/account' } } });
      return;
    }

    if (isAuthenticated) {
      addressService.getAddresses()
        .then(setAddresses)
        .catch(err => console.warn('Could not load addresses:', err));
    }
  }, [isAuthenticated, isLoading, navigate]);

  const handleAddAddress = async (e: React.FormEvent) => {
    e.preventDefault();
    setAddrError(null);
    try {
      const added = await addressService.createAddress(newAddr);
      setAddresses(prev => [added, ...prev.map(a => added.isDefault ? { ...a, isDefault: false } : a)]);
      setIsAddingAddress(false);
      setNewAddr({
        fullName: user?.fullName || '',
        phoneNumber: user?.phoneNumber || '',
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
    } catch (err: any) {
      setAddrError(err.message || 'Failed to save address.');
    }
  };

  const handleSetDefault = async (id: string) => {
    try {
      await addressService.setDefaultAddress(id);
      setAddresses(prev => prev.map(a => ({
        ...a,
        isDefault: a.id === id,
      })));
    } catch (err) {
      console.warn('Set default address failed:', err);
    }
  };

  const handleDeleteAddress = async (id: string) => {
    if (!window.confirm('Are you sure you want to remove this address?')) return;
    try {
      await addressService.deleteAddress(id);
      setAddresses(prev => prev.filter(a => a.id !== id));
    } catch (err) {
      console.warn('Delete address failed:', err);
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  if (isLoading || !user) {
    return (
      <div className="account-page-container text-center" style={{ padding: '100px 0' }}>
        <p style={{ color: 'var(--text-secondary)' }}>Loading client account...</p>
      </div>
    );
  }

  const initials = user.fullName
    ? user.fullName.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
    : 'H';

  return (
    <div className="account-page-container">
      <div className="container">
        
        {/* Header */}
        <div className="account-header">
          <div>
            <h1 className="account-title">Client Account</h1>
            <p className="account-subtitle">Manage your personal credentials, addresses, and projector orders.</p>
          </div>
          <button 
            type="button" 
            className="account-logout-btn" 
            onClick={handleLogout}
            title="Sign out of your Hunting account"
          >
            <LogOut size={16} />
            <span>SIGN OUT</span>
          </button>
        </div>

        {/* Content Grid */}
        <div className="account-grid">
          
          {/* Sidebar */}
          <div className="account-sidebar-card">
            <div className="profile-avatar-circle">{initials}</div>
            <h2 className="profile-name">{user.fullName}</h2>
            <p className="profile-email">{user.email}</p>
            <span className="profile-role-badge">{user.role}</span>

            {user.phoneNumber && (
              <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '8px', margin: '0 0 16px' }}>
                <Phone size={14} />
                <span>{user.phoneNumber}</span>
              </p>
            )}

            <div className="account-nav-list">
              <Link to="/orders" className="account-nav-item">
                <span style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <Package size={17} color="var(--accent-ice-blue)" />
                  My Orders & Hardware
                </span>
                <ArrowRight size={15} color="var(--text-muted)" />
              </Link>
              <Link to="/products" className="account-nav-item">
                <span style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <ShieldCheck size={17} color="var(--accent-acid-lime)" />
                  Explore Catalog
                </span>
                <ArrowRight size={15} color="var(--text-muted)" />
              </Link>
            </div>
          </div>

          {/* Main Pane */}
          <div className="account-content-pane">
            
            {/* Address Management Section */}
            <div className="section-card">
              <div className="section-card-header">
                <h2 className="section-card-title">
                  <MapPin size={20} color="var(--accent-ice-blue)" />
                  Delivery Addresses ({addresses.length})
                </h2>
                {!isAddingAddress && (
                  <button 
                    type="button" 
                    className="btn-add-address" 
                    onClick={() => setIsAddingAddress(true)}
                  >
                    <Plus size={15} />
                    <span>ADD NEW ADDRESS</span>
                  </button>
                )}
              </div>

              {/* Add Address Form */}
              {isAddingAddress && (
                <form className="auth-form" onSubmit={handleAddAddress} style={{ marginBottom: '28px', padding: '20px', background: 'var(--bg-surface-elevated)', borderRadius: 'var(--radius-sm)' }}>
                  <h3 style={{ margin: '0 0 16px', fontSize: '1rem', color: 'var(--text-primary)' }}>New Delivery Address</h3>
                  
                  {addrError && (
                    <div className="auth-error-banner" style={{ marginBottom: '16px' }}>{addrError}</div>
                  )}

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                    <div className="auth-field">
                      <label className="auth-label">Full Name *</label>
                      <input 
                        type="text" 
                        required 
                        className="auth-input" 
                        style={{ paddingLeft: '14px' }}
                        value={newAddr.fullName}
                        onChange={e => setNewAddr(prev => ({ ...prev, fullName: e.target.value }))}
                        placeholder="Recipient full name"
                      />
                    </div>
                    <div className="auth-field">
                      <label className="auth-label">Phone Number *</label>
                      <input 
                        type="tel" 
                        required 
                        className="auth-input" 
                        style={{ paddingLeft: '14px' }}
                        value={newAddr.phoneNumber}
                        onChange={e => setNewAddr(prev => ({ ...prev, phoneNumber: e.target.value }))}
                        placeholder="10-digit mobile number"
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
                      placeholder="Flat, House no., Building, Apartment"
                    />
                  </div>

                  <div className="auth-field">
                    <label className="auth-label">Address Line 2 (Optional)</label>
                    <input 
                      type="text" 
                      className="auth-input" 
                      style={{ paddingLeft: '14px' }}
                      value={newAddr.addressLine2 || ''}
                      onChange={e => setNewAddr(prev => ({ ...prev, addressLine2: e.target.value }))}
                      placeholder="Area, Street, Sector, Village"
                    />
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px' }}>
                    <div className="auth-field">
                      <label className="auth-label">City *</label>
                      <input 
                        type="text" 
                        required 
                        className="auth-input" 
                        style={{ paddingLeft: '14px' }}
                        value={newAddr.city}
                        onChange={e => setNewAddr(prev => ({ ...prev, city: e.target.value }))}
                        placeholder="City / District"
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
                        placeholder="State"
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
                        placeholder="6-digit PIN"
                      />
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: '12px', marginTop: '10px' }}>
                    <button type="submit" className="auth-submit-btn" style={{ width: 'auto', padding: '10px 24px' }}>
                      Save Address
                    </button>
                    <button 
                      type="button" 
                      className="auth-submit-btn" 
                      style={{ width: 'auto', padding: '10px 20px', background: 'transparent', color: 'var(--text-secondary)', border: '1px solid var(--border-subtle)' }}
                      onClick={() => setIsAddingAddress(false)}
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              )}

              {/* Address Cards */}
              {addresses.length === 0 ? (
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                  No saved addresses yet. Add your primary shipping address for swift pan-India checkout.
                </p>
              ) : (
                <div className="address-cards-grid">
                  {addresses.map(addr => (
                    <div key={addr.id} className={`address-card ${addr.isDefault ? 'default-address' : ''}`}>
                      {addr.isDefault && <span className="default-chip">DEFAULT</span>}
                      <div>
                        <div className="address-name">{addr.fullName}</div>
                        <div className="address-lines">
                          {addr.addressLine1}
                          {addr.addressLine2 && `, ${addr.addressLine2}`}
                          <br />
                          {addr.city}, {addr.state} - {addr.pincode}
                          <br />
                          Phone: {addr.phoneNumber}
                        </div>
                      </div>
                      <div className="address-actions">
                        {!addr.isDefault && (
                          <button 
                            type="button" 
                            className="btn-address-action" 
                            onClick={() => handleSetDefault(addr.id)}
                          >
                            Set Default
                          </button>
                        )}
                        <button 
                          type="button" 
                          className="btn-address-action delete" 
                          onClick={() => handleDeleteAddress(addr.id)}
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

          </div>

        </div>

      </div>
    </div>
  );
};
