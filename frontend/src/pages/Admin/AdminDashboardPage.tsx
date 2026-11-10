import React, { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  ShoppingBag,
  Package,
  Users,
  Layers,
  FolderTree,
  HelpCircle,
  Bell,
  Settings,
  LogOut,
  TrendingUp,
  AlertCircle,
  CheckCircle,
  Clock,
  RefreshCw,
  Search,
  ExternalLink,
  Plus,
  Edit,
  Trash2,
  Eye,
  RotateCcw,
  PowerOff,
  UploadCloud,
  X
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { adminService, AdminStats } from '../../services/adminService';
import { Product } from '../../types/product';
import { ProductForm } from '../../components/admin/ProductForm';
import './AdminDashboardPage.css';

type AdminTab = 'overview' | 'orders' | 'products' | 'categories' | 'inventory' | 'customers' | 'enquiries' | 'notifications' | 'settings';

export const AdminDashboardPage: React.FC = () => {
  const { user, logout, isAuthenticated, isLoading: authLoading } = useAuth();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState<AdminTab>('overview');
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [recentData, setRecentData] = useState<any>({ orders: [], customers: [], enquiries: [] });
  const [loading, setLoading] = useState<boolean>(true);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [actionSuccessMsg, setActionSuccessMsg] = useState<string | null>(null);

  // Tab-specific state
  const [orders, setOrders] = useState<any[]>([]);
  const [orderFilter, setOrderFilter] = useState({ status: 'all', search: '' });
  const [customers, setCustomers] = useState<any[]>([]);
  const [customerSearch, setCustomerSearch] = useState('');
  const [inventory, setInventory] = useState<any[]>([]);
  const [enquiries, setEnquiries] = useState<any[]>([]);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [unreadNotificationsCount, setUnreadNotificationsCount] = useState<number>(0);
  const [settingsData, setSettingsData] = useState<any>(null);

  // Product Management States
  const [productsList, setProductsList] = useState<Product[]>([]);
  const [productSearch, setProductSearch] = useState('');
  const [productCategoryFilter, setProductCategoryFilter] = useState('all');
  const [productStatusFilter, setProductStatusFilter] = useState<'all' | 'active' | 'inactive'>('all');
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isProductFormOpen, setIsProductFormOpen] = useState(false);

  // Categories / Collections Management
  const [categoriesList, setCategoriesList] = useState<any[]>([]);
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<any | null>(null);
  const [catName, setCatName] = useState('');
  const [catSlug, setCatSlug] = useState('');
  const [catSubtitle, setCatSubtitle] = useState('');
  const [catDesc, setCatDesc] = useState('');

  // Selected item modal states
  const [selectedOrder, setSelectedOrder] = useState<any | null>(null);
  const [selectedCustomer, setSelectedCustomer] = useState<any | null>(null);
  const [statusUpdateVal, setStatusUpdateVal] = useState<string>('');
  const [statusNotes, setStatusNotes] = useState<string>('');
  const [trackingNumber, setTrackingNumber] = useState<string>('');
  const [carrierName, setCarrierName] = useState<string>('');

  // Stock modal
  const [stockModalProduct, setStockModalProduct] = useState<any | null>(null);
  const [stockAdjustment, setStockAdjustment] = useState<number>(0);
  const [stockReason, setStockReason] = useState<string>('RESTOCK');

  // Verify Admin authorization
  useEffect(() => {
    if (!authLoading) {
      if (!isAuthenticated) {
        navigate('/login?redirect=/admin');
      } else if (user?.role !== 'ADMIN') {
        setError('Unauthorized: You require administrator credentials to access /admin.');
      }
    }
  }, [authLoading, isAuthenticated, user, navigate]);

  const loadDashboardData = async () => {
    setRefreshing(true);
    setError(null);
    try {
      const overview = await adminService.getOverview();
      setStats(overview.stats);
      setRecentData(overview.recent);
      setUnreadNotificationsCount(overview.stats.unreadNotifications);

      // Load products for products tab
      const prodsRes = await adminService.getAdminProducts({ limit: 100 });
      setProductsList(prodsRes.products);

      // Load categories
      const cats = await adminService.getCategories();
      setCategoriesList(cats);
    } catch (err: any) {
      console.warn('Admin overview fetch note:', err);
      setError(err.message || 'Unable to connect to database API.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    if (user?.role === 'ADMIN') {
      loadDashboardData();
    }
  }, [user]);

  // Load Tab specific data on change
  useEffect(() => {
    if (user?.role !== 'ADMIN') return;

    if (activeTab === 'orders') {
      adminService.getOrders({ status: orderFilter.status, search: orderFilter.search })
        .then(res => setOrders(res.orders))
        .catch(() => setOrders(recentData.orders || []));
    } else if (activeTab === 'customers') {
      adminService.getCustomers({ search: customerSearch })
        .then(res => setCustomers(res.customers))
        .catch(() => setCustomers(recentData.customers || []));
    } else if (activeTab === 'categories') {
      adminService.getCategories(true)
        .then(res => setCategoriesList(res))
        .catch(err => console.warn('Categories load error:', err));
    } else if (activeTab === 'inventory') {
      adminService.getInventory()
        .then(res => setInventory(res))
        .catch(() => setInventory([]));
    } else if (activeTab === 'enquiries') {
      adminService.getEnquiries()
        .then(res => setEnquiries(res))
        .catch(() => setEnquiries(recentData.enquiries || []));
    } else if (activeTab === 'notifications') {
      adminService.getNotifications()
        .then(res => {
          setNotifications(res.items);
          setUnreadNotificationsCount(res.unreadCount);
        })
        .catch(() => setNotifications([]));
    } else if (activeTab === 'settings') {
      adminService.getSettings()
        .then(res => setSettingsData(res))
        .catch(() => setSettingsData({
          store: { name: 'Hunting Projectors', company: 'NAP Computers & Electronics', location: 'Chennai, India' },
          integrations: {
            email: { configured: false, sender: 'orders@huntingprojectors.com' },
            whatsapp: { configured: false, businessNumber: '+91 94440 12345' },
            storage: { provider: 'Local Assets / Public Uploads', active: true }
          }
        }));
    }
  }, [activeTab, orderFilter, customerSearch, user]);

  const handleUpdateOrderStatus = async () => {
    if (!selectedOrder || !statusUpdateVal) return;
    try {
      await adminService.updateOrderStatus(selectedOrder.id, {
        status: statusUpdateVal,
        notes: statusNotes,
        trackingCarrier: carrierName,
        trackingNumber: trackingNumber
      });
      setActionSuccessMsg(`Order ${selectedOrder.orderNumber} updated to ${statusUpdateVal}`);
      setSelectedOrder(null);
      loadDashboardData();
      if (activeTab === 'orders') {
        const res = await adminService.getOrders(orderFilter);
        setOrders(res.orders);
      }
    } catch (err: any) {
      alert(`Error updating order: ${err.message}`);
    }
  };

  const handleAdjustStock = async () => {
    if (!stockModalProduct || !stockAdjustment) return;
    try {
      await adminService.adjustStock(stockModalProduct.id, stockAdjustment, stockReason);
      setActionSuccessMsg(`Stock adjusted for ${stockModalProduct.name}`);
      setStockModalProduct(null);
      setStockAdjustment(0);
      const res = await adminService.getInventory();
      setInventory(res);
    } catch (err: any) {
      alert(`Stock adjustment error: ${err.message}`);
    }
  };

  const handleDeactivateProduct = async (p: Product) => {
    if (!confirm(`Are you sure you want to deactivate '${p.name}'? It will be hidden from the public storefront.`)) return;
    try {
      await adminService.deactivateProduct(p.id);
      setActionSuccessMsg(`Product '${p.name}' deactivated successfully.`);
      const prodsRes = await adminService.getAdminProducts({ limit: 100 });
      setProductsList(prodsRes.products);
    } catch (err: any) {
      alert(`Failed to deactivate product: ${err.message}`);
    }
  };

  const handleReactivateProduct = async (p: Product) => {
    try {
      await adminService.reactivateProduct(p.id);
      setActionSuccessMsg(`Product '${p.name}' reactivated successfully.`);
      const prodsRes = await adminService.getAdminProducts({ limit: 100 });
      setProductsList(prodsRes.products);
    } catch (err: any) {
      alert(`Failed to reactivate product: ${err.message}`);
    }
  };

  const handleProductFormSave = async (saved: Product) => {
    setIsProductFormOpen(false);
    setEditingProduct(null);
    setActionSuccessMsg(`Product '${saved.name}' saved successfully.`);
    const prodsRes = await adminService.getAdminProducts({ limit: 100 });
    setProductsList(prodsRes.products);
    loadDashboardData();
  };

  const handleSaveCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingCategory) {
        await adminService.updateCategory(editingCategory.id, {
          name: catName,
          slug: catSlug,
          subtitle: catSubtitle,
          description: catDesc,
        });
        setActionSuccessMsg(`Collection '${catName}' updated.`);
      } else {
        await adminService.createCategory({
          name: catName,
          slug: catSlug,
          subtitle: catSubtitle,
          description: catDesc,
        });
        setActionSuccessMsg(`Collection '${catName}' created.`);
      }
      setIsCategoryModalOpen(false);
      setEditingCategory(null);
      const cats = await adminService.getCategories(true);
      setCategoriesList(cats);
    } catch (err: any) {
      alert(`Failed to save collection: ${err.message}`);
    }
  };

  const handleDeleteCategory = async (cat: any) => {
    if (!confirm(`Delete collection '${cat.name}'?`)) return;
    try {
      await adminService.deleteCategory(cat.id);
      setActionSuccessMsg(`Collection '${cat.name}' deleted.`);
      const cats = await adminService.getCategories(true);
      setCategoriesList(cats);
    } catch (err: any) {
      alert(`Error deleting collection: ${err.message}`);
    }
  };

  const handleMarkAllNotifications = async () => {
    try {
      await adminService.markNotificationAsRead('all');
      setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
      setUnreadNotificationsCount(0);
    } catch (err: any) {
      console.warn('Notifications read error:', err);
    }
  };

  // Filtered products list
  const filteredProducts = productsList.filter(p => {
    const matchesSearch = !productSearch || p.name.toLowerCase().includes(productSearch.toLowerCase()) || p.slug.toLowerCase().includes(productSearch.toLowerCase());
    const matchesCategory = productCategoryFilter === 'all' || p.categoryId === productCategoryFilter || p.categoryLabel.toLowerCase() === productCategoryFilter.toLowerCase();
    const matchesStatus = productStatusFilter === 'all' || (productStatusFilter === 'active' ? p.isActive : !p.isActive);
    return matchesSearch && matchesCategory && matchesStatus;
  });

  if (authLoading) {
    return (
      <div className="admin-loading-screen">
        <div className="spinner-gold" />
        <p>Verifying Administrator Privileges...</p>
      </div>
    );
  }

  if (error && user?.role !== 'ADMIN') {
    return (
      <div className="admin-loading-screen">
        <AlertCircle size={44} className="text-red-500 mb-4" />
        <h2 className="text-xl font-bold text-white mb-2">Access Restricted</h2>
        <p className="text-muted text-sm max-w-md text-center mb-6">{error}</p>
        <Link to="/login?redirect=/admin" className="btn-primary">
          Sign In with Admin Account
        </Link>
      </div>
    );
  }

  return (
    <div className="admin-layout">
      {/* SIDEBAR NAVIGATION */}
      <aside className="admin-sidebar">
        <div className="admin-sidebar-branding">
          <span className="branding-title">HUNTING 4K</span>
          <span className="branding-subtitle">ADMIN CONSOLE</span>
        </div>

        <div className="admin-profile-card">
          <div className="profile-avatar">
            {user?.fullName?.charAt(0).toUpperCase() || 'A'}
          </div>
          <div className="profile-info">
            <span className="profile-name" title={user?.fullName || 'Administrator'}>
              {user?.fullName || 'Administrator'}
            </span>
            <span className="profile-badge">VERIFIED ADMIN</span>
          </div>
        </div>

        <nav className="admin-nav-menu" aria-label="Administrator Navigation">
          <button
            type="button"
            className={`admin-nav-item ${activeTab === 'overview' ? 'active' : ''}`}
            onClick={() => setActiveTab('overview')}
          >
            <LayoutDashboard size={18} />
            <span className="nav-label">Overview</span>
          </button>

          <button
            type="button"
            className={`admin-nav-item ${activeTab === 'orders' ? 'active' : ''}`}
            onClick={() => setActiveTab('orders')}
          >
            <ShoppingBag size={18} />
            <span className="nav-label">Orders</span>
            {stats && stats.pendingOrders > 0 && (
              <span className="nav-counter-pill">{stats.pendingOrders}</span>
            )}
          </button>

          <button
            type="button"
            className={`admin-nav-item ${activeTab === 'products' ? 'active' : ''}`}
            onClick={() => setActiveTab('products')}
          >
            <Package size={18} />
            <span className="nav-label">Products</span>
          </button>

          <button
            type="button"
            className={`admin-nav-item ${activeTab === 'categories' ? 'active' : ''}`}
            onClick={() => setActiveTab('categories')}
          >
            <FolderTree size={18} />
            <span className="nav-label">Collections</span>
          </button>

          <button
            type="button"
            className={`admin-nav-item ${activeTab === 'inventory' ? 'active' : ''}`}
            onClick={() => setActiveTab('inventory')}
          >
            <Layers size={18} />
            <span className="nav-label">Inventory</span>
            {stats && stats.lowStockProducts > 0 && (
              <span className="nav-counter-pill warning">{stats.lowStockProducts}</span>
            )}
          </button>

          <button
            type="button"
            className={`admin-nav-item ${activeTab === 'customers' ? 'active' : ''}`}
            onClick={() => setActiveTab('customers')}
          >
            <Users size={18} />
            <span className="nav-label">Customers</span>
          </button>

          <button
            type="button"
            className={`admin-nav-item ${activeTab === 'enquiries' ? 'active' : ''}`}
            onClick={() => setActiveTab('enquiries')}
          >
            <HelpCircle size={18} />
            <span className="nav-label">Demo Enquiries</span>
            {stats && stats.pendingEnquiries > 0 && (
              <span className="nav-counter-pill gold">{stats.pendingEnquiries}</span>
            )}
          </button>

          <button
            type="button"
            className={`admin-nav-item ${activeTab === 'notifications' ? 'active' : ''}`}
            onClick={() => setActiveTab('notifications')}
          >
            <Bell size={18} />
            <span className="nav-label">Alerts</span>
            {unreadNotificationsCount > 0 && (
              <span className="nav-counter-pill red">{unreadNotificationsCount}</span>
            )}
          </button>

          <button
            type="button"
            className={`admin-nav-item ${activeTab === 'settings' ? 'active' : ''}`}
            onClick={() => setActiveTab('settings')}
          >
            <Settings size={18} />
            <span className="nav-label">Settings</span>
          </button>
        </nav>

        <div className="admin-sidebar-footer">
          <button
            type="button"
            className="admin-logout-btn"
            onClick={() => logout().then(() => navigate('/login'))}
            title="Log out of admin session"
          >
            <LogOut size={16} />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* MAIN VIEWPORT */}
      <main className="admin-main">
        {/* TOP HEADER */}
        <header className="admin-header">
          <div className="header-left">
            <h1 className="admin-page-title">
              {activeTab === 'overview' && 'Operational Overview'}
              {activeTab === 'orders' && 'Order Management'}
              {activeTab === 'products' && 'Product Catalog Management'}
              {activeTab === 'categories' && 'Collections & Categories'}
              {activeTab === 'inventory' && 'Inventory & Stock Movements'}
              {activeTab === 'customers' && 'Customer Directory'}
              {activeTab === 'enquiries' && 'Customer Enquiries & Demo Bookings'}
              {activeTab === 'notifications' && 'System Notifications & Alerts'}
              {activeTab === 'settings' && 'Store & Integration Settings'}
            </h1>
            <span className="admin-store-tag">NAP Computers & Electronics • Chennai Fulfillment Hub</span>
          </div>

          <div className="header-actions">
            <button
              type="button"
              className="admin-refresh-btn"
              onClick={loadDashboardData}
              disabled={refreshing}
              title="Refresh database metrics"
            >
              <RefreshCw size={15} className={refreshing ? 'spinning' : ''} />
              <span>{refreshing ? 'Syncing...' : 'Sync'}</span>
            </button>
          </div>
        </header>

        {actionSuccessMsg && (
          <div className="admin-alert-banner success">
            <CheckCircle size={16} />
            <span>{actionSuccessMsg}</span>
            <button type="button" className="close-alert-btn" onClick={() => setActionSuccessMsg(null)}>✕</button>
          </div>
        )}

        {/* TAB CONTENT: 1. OVERVIEW */}
        {activeTab === 'overview' && stats && (
          <div className="admin-content-view">

            {/* KPI Metrics Cards */}
            <div className="kpi-metrics-grid">

              {/* Card 1: Verified Revenue (Only shown when valid paid order revenue exists) */}
              <div className="kpi-card highlight">
                <div className="kpi-header">
                  <span className="kpi-title">Verified Revenue (Paid)</span>
                  <TrendingUp size={16} className="kpi-icon" />
                </div>
                <div className="kpi-value-row">
                  <span className="kpi-currency">₹</span>
                  <span className="kpi-number">{stats.totalRevenue.toLocaleString('en-IN')}</span>
                </div>
                <span className="kpi-subtext">Distinguishes paid orders from pending/cancelled</span>
              </div>

              {/* Card 2: Total Orders */}
              <div className="kpi-card">
                <div className="kpi-header">
                  <span className="kpi-title">Total Orders</span>
                  <ShoppingBag size={16} className="kpi-icon" />
                </div>
                <div className="kpi-value-row">
                  <span className="kpi-number">{stats.totalOrders}</span>
                  <span className="kpi-badge">Today: {stats.todayOrders}</span>
                </div>
                <span className="kpi-subtext">Pending: {stats.pendingOrders} • In Progress: {stats.processingOrders}</span>
              </div>

              {/* Card 3: Registered Customers */}
              <div className="kpi-card">
                <div className="kpi-header">
                  <span className="kpi-title">Total Customers</span>
                  <Users size={16} className="kpi-icon" />
                </div>
                <div className="kpi-value-row">
                  <span className="kpi-number">{stats.totalCustomers}</span>
                </div>
                <span className="kpi-subtext">Registered customer accounts in database</span>
              </div>

              {/* Card 4: Total Products */}
              <div className="kpi-card">
                <div className="kpi-header">
                  <span className="kpi-title">Total Products</span>
                  <Package size={16} className="kpi-icon" />
                </div>
                <div className="kpi-value-row">
                  <span className="kpi-number">{stats.totalProducts ?? stats.activeProducts}</span>
                  <span className="kpi-badge">{stats.activeProducts} Active</span>
                </div>
                <span className="kpi-subtext">{stats.lowStockProducts > 0 ? `${stats.lowStockProducts} Low Stock alert` : 'Catalog inventory healthy'}</span>
              </div>

              {/* Card 5: Total Categories */}
              <div className="kpi-card">
                <div className="kpi-header">
                  <span className="kpi-title">Total Categories</span>
                  <FolderTree size={16} className="kpi-icon" />
                </div>
                <div className="kpi-value-row">
                  <span className="kpi-number">{stats.totalCategories ?? categoriesList.length}</span>
                </div>
                <span className="kpi-subtext">Active showroom projector collections</span>
              </div>

            </div>

            {/* Recent Orders & Enquiries Table */}
            <div className="admin-split-grid">

              {/* Recent Orders */}
              <div className="admin-panel-card">
                <div className="panel-card-head">
                  <h3 className="panel-card-title">Recent Order Submissions</h3>
                  <button type="button" className="panel-action-btn" onClick={() => setActiveTab('orders')}>View All</button>
                </div>

                <div className="table-responsive">
                  <table className="admin-table">
                    <thead>
                      <tr>
                        <th>Order #</th>
                        <th>Customer</th>
                        <th>Amount</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {recentData.orders?.length > 0 ? (
                        recentData.orders.map((o: any) => (
                          <tr key={o.id}>
                            <td className="font-mono text-gold">{o.orderNumber}</td>
                            <td>{o.customerName}</td>
                            <td className="font-bold">₹{Number(o.totalAmount).toLocaleString('en-IN')}</td>
                            <td><span className={`status-badge ${o.orderStatus?.toLowerCase()}`}>{o.orderStatus}</span></td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={4} className="text-center py-4 text-muted">No orders in database.</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Recent Demo Enquiries */}
              <div className="admin-panel-card">
                <div className="panel-card-head">
                  <h3 className="panel-card-title">Live Demo Enquiries</h3>
                  <button type="button" className="panel-action-btn" onClick={() => setActiveTab('enquiries')}>View All</button>
                </div>

                <div className="table-responsive">
                  <table className="admin-table">
                    <thead>
                      <tr>
                        <th>Ref</th>
                        <th>Client</th>
                        <th>Location</th>
                        <th>Model</th>
                      </tr>
                    </thead>
                    <tbody>
                      {recentData.enquiries?.length > 0 ? (
                        recentData.enquiries.map((e: any) => (
                          <tr key={e.id}>
                            <td className="font-mono text-gold">{e.referenceId}</td>
                            <td>{e.fullName}</td>
                            <td>{e.city || 'Chennai'}</td>
                            <td className="text-muted text-xs">{e.productName}</td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={4} className="text-center py-4 text-muted">No demo enquiries recorded.</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

            </div>

          </div>
        )}

        {/* TAB CONTENT: 2. ORDERS */}
        {activeTab === 'orders' && (
          <div className="admin-content-view">
            <div className="admin-panel-card">
              <div className="panel-card-head flex-between">
                <div>
                  <h3 className="panel-card-title">Customer Order Fulfillment</h3>
                  <p className="text-muted text-sm">Review orders, update fulfillment states, and assign shipping tracking numbers.</p>
                </div>
              </div>

              <div className="admin-filter-bar">
                <div className="search-input-wrap">
                  <Search size={15} />
                  <input
                    type="text"
                    placeholder="Search by order #, customer name, email or phone..."
                    value={orderFilter.search}
                    onChange={e => setOrderFilter(prev => ({ ...prev, search: e.target.value }))}
                  />
                </div>

                <div className="filter-select-group">
                  <label>Status Filter:</label>
                  <select
                    value={orderFilter.status}
                    onChange={e => setOrderFilter(prev => ({ ...prev, status: e.target.value }))}
                  >
                    <option value="all">All Statuses</option>
                    <option value="PENDING">Pending Verification</option>
                    <option value="CONFIRMED">Confirmed</option>
                    <option value="PROCESSING">Processing</option>
                    <option value="DISPATCHED">Dispatched</option>
                    <option value="DELIVERED">Delivered</option>
                    <option value="CANCELLED">Cancelled</option>
                  </select>
                </div>
              </div>

              <div className="table-responsive">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Order ID</th>
                      <th>Placed Date</th>
                      <th>Customer Details</th>
                      <th>Items</th>
                      <th>Total Amount</th>
                      <th>Order Status</th>
                      <th>Payment</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.length > 0 ? (
                      orders.map(o => (
                        <tr key={o.id}>
                          <td className="font-mono text-gold font-bold">{o.orderNumber}</td>
                          <td className="text-muted text-xs">{new Date(o.createdAt).toLocaleDateString('en-IN')}</td>
                          <td>
                            <div className="customer-cell">
                              <span className="font-bold">{o.customerName}</span>
                              <span className="text-muted text-xs">{o.customerPhone}</span>
                            </div>
                          </td>
                          <td>
                            <span className="text-xs">{o.items?.length || 1} product(s)</span>
                          </td>
                          <td className="font-mono font-bold">₹{Number(o.totalAmount).toLocaleString('en-IN')}</td>
                          <td>
                            <span className={`status-badge ${o.orderStatus?.toLowerCase()}`}>
                              {o.orderStatus}
                            </span>
                          </td>
                          <td>
                            <span className={`payment-badge ${o.paymentStatus?.toLowerCase()}`}>
                              {o.paymentStatus}
                            </span>
                          </td>
                          <td>
                            <button
                              type="button"
                              className="table-action-btn"
                              onClick={() => {
                                setSelectedOrder(o);
                                setStatusUpdateVal(o.orderStatus);
                                setCarrierName(o.trackingCarrier || '');
                                setTrackingNumber(o.trackingNumber || '');
                              }}
                            >
                              Manage
                            </button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={8} className="text-center py-6 text-muted">No orders match the selected filters.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB CONTENT: 3. PRODUCTS */}
        {activeTab === 'products' && (
          <div className="admin-content-view">
            <div className="admin-panel-card">
              <div className="panel-card-head flex-between">
                <div>
                  <h3 className="panel-card-title">Live Projector Catalog</h3>
                  <p className="text-muted text-sm">Add, edit, deactivate, reactivate and manage product specifications across the store.</p>
                </div>
                <button
                  type="button"
                  className="btn-primary"
                  onClick={() => {
                    setEditingProduct(null);
                    setIsProductFormOpen(true);
                  }}
                >
                  <Plus size={16} />
                  <span>Add New Product</span>
                </button>
              </div>

              {/* Product Filters */}
              <div className="admin-filter-bar">
                <div className="search-input-wrap">
                  <Search size={15} />
                  <input
                    type="text"
                    placeholder="Search products by name or slug..."
                    value={productSearch}
                    onChange={e => setProductSearch(e.target.value)}
                  />
                </div>

                <div className="filter-select-group">
                  <label>Status:</label>
                  <select
                    value={productStatusFilter}
                    onChange={e => setProductStatusFilter(e.target.value as any)}
                  >
                    <option value="all">All Models</option>
                    <option value="active">Active Only</option>
                    <option value="inactive">Inactive Only</option>
                  </select>
                </div>

                <div className="filter-select-group">
                  <label>Category:</label>
                  <select
                    value={productCategoryFilter}
                    onChange={e => setProductCategoryFilter(e.target.value)}
                  >
                    <option value="all">All Collections</option>
                    {categoriesList.map(c => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="table-responsive">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Image</th>
                      <th>Product Name</th>
                      <th>Category</th>
                      <th>Price</th>
                      <th>Stock</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredProducts.length > 0 ? (
                      filteredProducts.map(p => (
                        <tr key={p.id}>
                          <td>
                            <img src={p.images.hero} alt={p.name} className="product-thumb-table" />
                          </td>
                          <td>
                            <div className="product-cell">
                              <span className="font-bold">{p.name}</span>
                              <span className="text-muted text-xs">{p.subtitle}</span>
                            </div>
                          </td>
                          <td>{p.categoryLabel}</td>
                          <td className="font-mono font-bold">₹{p.price.toLocaleString('en-IN')}</td>
                          <td>
                            <span className={`stock-badge ${p.availability === 'in-stock' ? 'in-stock' : 'out-of-stock'}`}>
                              {p.stock} in stock
                            </span>
                          </td>
                          <td>
                            <span className={`status-badge ${p.isActive ? 'active' : 'inactive'}`}>
                              {p.isActive ? 'Active' : 'Inactive'}
                            </span>
                          </td>
                          <td>
                            <div className="table-actions-row">
                              <button
                                type="button"
                                className="table-btn-icon edit"
                                title="Edit Product Specifications"
                                onClick={() => {
                                  setEditingProduct(p);
                                  setIsProductFormOpen(true);
                                }}
                              >
                                <Edit size={14} />
                              </button>

                              {p.isActive ? (
                                <button
                                  type="button"
                                  className="table-btn-icon deactivate"
                                  title="Deactivate Product"
                                  onClick={() => handleDeactivateProduct(p)}
                                >
                                  <PowerOff size={14} />
                                </button>
                              ) : (
                                <button
                                  type="button"
                                  className="table-btn-icon reactivate"
                                  title="Reactivate Product"
                                  onClick={() => handleReactivateProduct(p)}
                                >
                                  <RotateCcw size={14} />
                                </button>
                              )}

                              <Link to={`/products/${p.slug}`} target="_blank" className="table-btn-icon view" title="View Storefront Page">
                                <ExternalLink size={14} />
                              </Link>
                            </div>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={7} className="text-center py-6 text-muted">No products found matching criteria.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB CONTENT: COLLECTIONS & CATEGORIES */}
        {activeTab === 'categories' && (
          <div className="admin-content-view">
            <div className="admin-panel-card">
              <div className="panel-card-head flex-between">
                <div>
                  <h3 className="panel-card-title">Projector Collections & Categories</h3>
                  <p className="text-muted text-sm">Manage category groupings, subtitles, descriptions, and linked products.</p>
                </div>
                <button
                  type="button"
                  className="btn-primary"
                  onClick={() => {
                    setEditingCategory(null);
                    setCatName('');
                    setCatSlug('');
                    setCatSubtitle('');
                    setCatDesc('');
                    setIsCategoryModalOpen(true);
                  }}
                >
                  <Plus size={16} />
                  <span>Add Collection</span>
                </button>
              </div>

              <div className="table-responsive">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Collection Name</th>
                      <th>Slug</th>
                      <th>Subtitle</th>
                      <th>Linked Products</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {categoriesList.length > 0 ? (
                      categoriesList.map(cat => (
                        <tr key={cat.id}>
                          <td className="font-bold text-white">{cat.name}</td>
                          <td className="font-mono text-gold">{cat.slug}</td>
                          <td className="text-muted text-xs">{cat.subtitle}</td>
                          <td>
                            <span className="font-mono font-bold">{cat.productsCount ?? 0} models</span>
                          </td>
                          <td>
                            <span className={`status-badge ${cat.isActive !== false ? 'active' : 'inactive'}`}>
                              {cat.isActive !== false ? 'Active' : 'Inactive'}
                            </span>
                          </td>
                          <td>
                            <div className="table-actions-row">
                              <button
                                type="button"
                                className="table-btn-icon edit"
                                title="Edit Collection"
                                onClick={() => {
                                  setEditingCategory(cat);
                                  setCatName(cat.name);
                                  setCatSlug(cat.slug);
                                  setCatSubtitle(cat.subtitle || '');
                                  setCatDesc(cat.description || '');
                                  setIsCategoryModalOpen(true);
                                }}
                              >
                                <Edit size={14} />
                              </button>
                              <button
                                type="button"
                                className="table-btn-icon deactivate"
                                title="Delete Collection"
                                onClick={() => handleDeleteCategory(cat)}
                              >
                                <Trash2 size={14} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={6} className="text-center py-6 text-muted">No collections recorded in database.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB CONTENT: 4. INVENTORY */}
        {activeTab === 'inventory' && (
          <div className="admin-content-view">
            <div className="admin-panel-card">
              <div className="panel-card-head">
                <div>
                  <h3 className="panel-card-title">Inventory Quantities & Stock Adjustment</h3>
                  <p className="text-muted text-sm">Atomically adjust quantities and audit stock movements.</p>
                </div>
              </div>

              <div className="table-responsive">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>SKU</th>
                      <th>Product</th>
                      <th>Current Units</th>
                      <th>Status</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {inventory.map(item => (
                      <tr key={item.id}>
                        <td className="font-mono text-gold">{item.sku || 'HP-SKU'}</td>
                        <td className="font-bold">{item.name}</td>
                        <td className="font-mono font-bold text-lg">{item.stock}</td>
                        <td>
                          <span className={`stock-badge ${item.stock > 5 ? 'in-stock' : 'out-of-stock'}`}>
                            {item.stock > 5 ? 'Adequate' : 'Low Stock'}
                          </span>
                        </td>
                        <td>
                          <button
                            type="button"
                            className="table-action-btn"
                            onClick={() => {
                              setStockModalProduct(item);
                              setStockAdjustment(0);
                            }}
                          >
                            Adjust Stock
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB CONTENT: 5. CUSTOMERS */}
        {activeTab === 'customers' && (
          <div className="admin-content-view">
            <div className="admin-panel-card">
              <div className="panel-card-head">
                <div>
                  <h3 className="panel-card-title">Registered Customer Directory</h3>
                  <p className="text-muted text-sm">Inspect verified client accounts, orders history, and delivery contacts.</p>
                </div>
              </div>

              <div className="table-responsive">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Customer Name</th>
                      <th>Email Address</th>
                      <th>Phone Number</th>
                      <th>Total Orders</th>
                      <th>Total Spent</th>
                      <th>Registered</th>
                    </tr>
                  </thead>
                  <tbody>
                    {customers.map(c => (
                      <tr key={c.id}>
                        <td className="font-bold">{c.fullName}</td>
                        <td>{c.email}</td>
                        <td>{c.phoneNumber || '—'}</td>
                        <td className="font-mono">{c.totalOrders ?? 0}</td>
                        <td className="font-mono font-bold">₹{Number(c.totalSpent || 0).toLocaleString('en-IN')}</td>
                        <td className="text-muted text-xs">{new Date(c.createdAt).toLocaleDateString('en-IN')}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB CONTENT: 6. ENQUIRIES */}
        {activeTab === 'enquiries' && (
          <div className="admin-content-view">
            <div className="admin-panel-card">
              <div className="panel-card-head">
                <div>
                  <h3 className="panel-card-title">Demo & Throw Calculation Requests</h3>
                  <p className="text-muted text-sm">Manage VIP showroom demonstration requests and direct customer enquiries.</p>
                </div>
              </div>

              <div className="table-responsive">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Ref ID</th>
                      <th>Customer Name</th>
                      <th>Contact</th>
                      <th>Product</th>
                      <th>City</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {enquiries.map(enq => (
                      <tr key={enq.id}>
                        <td className="font-mono text-gold font-bold">{enq.referenceId}</td>
                        <td>{enq.fullName}</td>
                        <td>{enq.phoneNumber || enq.email}</td>
                        <td>{enq.product?.name || enq.productName}</td>
                        <td>{enq.city}</td>
                        <td>
                          <span className={`status-badge ${enq.status?.toLowerCase()}`}>
                            {enq.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB CONTENT: 7. NOTIFICATIONS */}
        {activeTab === 'notifications' && (
          <div className="admin-content-view">
            <div className="admin-panel-card">
              <div className="panel-card-head flex-between">
                <div>
                  <h3 className="panel-card-title">Fulfillment Alerts & System Notifications</h3>
                  <p className="text-muted text-sm">Low stock triggers, email bounces, and new transaction notices.</p>
                </div>
                <button type="button" className="btn-secondary" onClick={handleMarkAllNotifications}>
                  Mark All Read
                </button>
              </div>

              <div className="notifications-list">
                {notifications.map(notif => (
                  <div key={notif.id} className={`notification-item ${!notif.isRead ? 'unread' : ''}`}>
                    <div className="notif-indicator" />
                    <div className="notif-content">
                      <h4 className="notif-title">{notif.title}</h4>
                      <p className="notif-desc">{notif.message}</p>
                      <span className="notif-time">{new Date(notif.createdAt).toLocaleString('en-IN')}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB CONTENT: 8. SETTINGS */}
        {activeTab === 'settings' && (
          <div className="admin-content-view">
            <div className="admin-panel-card">
              <div className="panel-card-head">
                <h3 className="panel-card-title">Production Integrations & Hub Configuration</h3>
              </div>
              <div className="settings-grid">
                <div className="setting-box">
                  <h4 className="setting-title">SMTP Mailgun / Nodemailer</h4>
                  <p className="setting-desc">Status: {settingsData?.integrations?.email?.configured ? '✅ Active' : '⚠️ Awaiting SMTP Credentials'}</p>
                  <p className="text-xs text-muted">Sender: {settingsData?.integrations?.email?.sender}</p>
                </div>
                <div className="setting-box">
                  <h4 className="setting-title">Meta WhatsApp Cloud API</h4>
                  <p className="setting-desc">Status: {settingsData?.integrations?.whatsapp?.configured ? '✅ Active' : '⚠️ Awaiting Meta Token'}</p>
                  <p className="text-xs text-muted">Hub Line: {settingsData?.integrations?.whatsapp?.businessNumber}</p>
                </div>
              </div>
            </div>
          </div>
        )}

      </main>

      {/* MOUNTED PRODUCT FORM MODAL */}
      {isProductFormOpen && (
        <ProductForm
          product={editingProduct}
          onSave={handleProductFormSave}
          onCancel={() => {
            setIsProductFormOpen(false);
            setEditingProduct(null);
          }}
        />
      )}

      {/* CATEGORY ADD/EDIT MODAL */}
      {isCategoryModalOpen && (
        <div className="admin-modal-overlay" onClick={() => setIsCategoryModalOpen(false)}>
          <div className="admin-modal-card" onClick={e => e.stopPropagation()}>
            <div className="modal-head">
              <h3>{editingCategory ? 'Edit Collection' : 'Add New Collection'}</h3>
              <button type="button" className="modal-close" onClick={() => setIsCategoryModalOpen(false)}>✕</button>
            </div>

            <form onSubmit={handleSaveCategory}>
              <div className="modal-form-group">
                <label>Collection Name:</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Ultra Short Throw"
                  value={catName}
                  onChange={e => {
                    setCatName(e.target.value);
                    if (!editingCategory) {
                      setCatSlug(e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, ''));
                    }
                  }}
                />
              </div>

              <div className="modal-form-group">
                <label>Slug:</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. ultra-short-throw"
                  value={catSlug}
                  onChange={e => setCatSlug(e.target.value)}
                />
              </div>

              <div className="modal-form-group">
                <label>Subtitle:</label>
                <input
                  type="text"
                  placeholder="e.g. Laser TV Immersion for Daylight Living"
                  value={catSubtitle}
                  onChange={e => setCatSubtitle(e.target.value)}
                />
              </div>

              <div className="modal-form-group">
                <label>Description:</label>
                <textarea
                  rows={3}
                  placeholder="Brief overview of projectors in this collection..."
                  value={catDesc}
                  onChange={e => setCatDesc(e.target.value)}
                />
              </div>

              <div className="modal-actions">
                <button type="button" className="btn-secondary" onClick={() => setIsCategoryModalOpen(false)}>Cancel</button>
                <button type="submit" className="btn-primary">Save Collection</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ORDER MANAGEMENT MODAL */}
      {selectedOrder && (
        <div className="admin-modal-overlay" onClick={() => setSelectedOrder(null)}>
          <div className="admin-modal-card" onClick={e => e.stopPropagation()}>
            <div className="modal-head">
              <h3>Manage Order: {selectedOrder.orderNumber}</h3>
              <button type="button" className="modal-close" onClick={() => setSelectedOrder(null)}>✕</button>
            </div>

            <div className="modal-body">
              <div className="order-details-summary">
                <p><strong>Customer:</strong> {selectedOrder.customerName} ({selectedOrder.customerPhone})</p>
                <p><strong>Address:</strong> {selectedOrder.addressLine}, {selectedOrder.city}, {selectedOrder.state} - {selectedOrder.pincode}</p>
                <p><strong>Total Amount:</strong> ₹{Number(selectedOrder.totalAmount).toLocaleString('en-IN')}</p>
                <p><strong>Current Status:</strong> <span className="status-badge">{selectedOrder.orderStatus}</span></p>
                <p><strong>Payment Status:</strong> <span className="payment-badge">{selectedOrder.paymentStatus}</span></p>
              </div>

              <div className="modal-form-group">
                <label>Change Order Status:</label>
                <select value={statusUpdateVal} onChange={e => setStatusUpdateVal(e.target.value)}>
                  <option value="PENDING">Pending</option>
                  <option value="CONFIRMED">Confirmed</option>
                  <option value="PROCESSING">Processing</option>
                  <option value="DISPATCHED">Dispatched</option>
                  <option value="DELIVERED">Delivered</option>
                  <option value="CANCELLED">Cancelled</option>
                </select>
              </div>

              <div className="modal-form-row">
                <div className="modal-form-group">
                  <label>Courier / Carrier Name:</label>
                  <input
                    type="text"
                    placeholder="e.g. Blue Dart, Delhivery, DTDC"
                    value={carrierName}
                    onChange={e => setCarrierName(e.target.value)}
                  />
                </div>
                <div className="modal-form-group">
                  <label>Tracking Number:</label>
                  <input
                    type="text"
                    placeholder="e.g. BD948294821IN"
                    value={trackingNumber}
                    onChange={e => setTrackingNumber(e.target.value)}
                  />
                </div>
              </div>

              <div className="modal-form-group">
                <label>Internal Administrator Notes:</label>
                <textarea
                  rows={3}
                  placeholder="Record fulfillment notes, customer communication, or payment reconciliation..."
                  value={statusNotes}
                  onChange={e => setStatusNotes(e.target.value)}
                />
              </div>
            </div>

            <div className="modal-actions">
              <button type="button" className="btn-secondary" onClick={() => setSelectedOrder(null)}>Cancel</button>
              <button type="button" className="btn-primary" onClick={handleUpdateOrderStatus}>Save & Notify Customer</button>
            </div>
          </div>
        </div>
      )}

      {/* STOCK ADJUSTMENT MODAL */}
      {stockModalProduct && (
        <div className="admin-modal-overlay" onClick={() => setStockModalProduct(null)}>
          <div className="admin-modal-card" onClick={e => e.stopPropagation()}>
            <div className="modal-head">
              <h3>Adjust Stock: {stockModalProduct.name}</h3>
              <button type="button" className="modal-close" onClick={() => setStockModalProduct(null)}>✕</button>
            </div>

            <div className="modal-body">
              <p>Current In-Stock Quantity: <strong>{stockModalProduct.stock} units</strong></p>

              <div className="modal-form-group">
                <label>Stock Adjustment Quantity (use negative to reduce, positive to add):</label>
                <input
                  type="number"
                  value={stockAdjustment}
                  onChange={e => setStockAdjustment(Number(e.target.value))}
                />
              </div>

              <div className="modal-form-group">
                <label>Adjustment Reason:</label>
                <select value={stockReason} onChange={e => setStockReason(e.target.value)}>
                  <option value="RESTOCK">Supplier Restock / Production Shipment</option>
                  <option value="MANUAL_CORRECTION">Physical Inventory Audit Correction</option>
                  <option value="DAMAGED_RETURN">Damaged / RMA Transit</option>
                  <option value="PROMO_SAMPLE">Showroom Demonstration Allocation</option>
                </select>
              </div>
            </div>

            <div className="modal-actions">
              <button type="button" className="btn-secondary" onClick={() => setStockModalProduct(null)}>Cancel</button>
              <button type="button" className="btn-primary" onClick={handleAdjustStock}>Commit Adjustment</button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
