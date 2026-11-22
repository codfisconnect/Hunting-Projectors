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
  X,
  MessageSquareQuote,
  Star,
  Calendar,
  FileText,
  BarChart3,
  History,
  Globe,
  ShieldCheck,
  Download,
  Printer,
  ChevronRight,
  Filter,
  ReceiptText,
  FileSignature,
  Wrench,
  ChevronLeft
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { adminService, AdminStats } from '../../services/adminService';
import { Product } from '../../types/product';
import { ProductForm } from '../../components/admin/ProductForm';
import './AdminDashboardPage.css';

type AdminTab =
  | 'overview'
  | 'orders'
  | 'products'
  | 'categories'
  | 'inventory'
  | 'customers'
  | 'enquiries'
  | 'calendar'
  | 'reviews'
  | 'reports'
  | 'cms'
  | 'warranty'
  | 'quotations'
  | 'audit'
  | 'notifications'
  | 'settings';

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

  // Reviews Moderation State
  const [reviewsList, setReviewsList] = useState<any[]>([]);
  const [reviewFilter, setReviewFilter] = useState<'all' | 'approved' | 'pending'>('all');
  const [moderatingReviewId, setModeratingReviewId] = useState<string | null>(null);

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

  // Invoice view modal
  const [viewingInvoice, setViewingInvoice] = useState<any | null>(null);

  // Calendar State
  const [calendarFilter, setCalendarFilter] = useState<'all' | 'today' | 'upcoming'>('all');
  const [calendarViewMode, setCalendarViewMode] = useState<'month' | 'week' | 'day' | 'list'>('month');
  const [calendarCurrentDate, setCalendarCurrentDate] = useState<Date>(new Date());
  const [selectedDemoModal, setSelectedDemoModal] = useState<any | null>(null);

  // CMS Extended State
  const [cmsContent, setCmsContent] = useState<Record<string, any>>({});
  const [cmsHeadline, setCmsHeadline] = useState<string>('Step Into The Future of Home Cinema');
  const [cmsSubheadline, setCmsSubheadline] = useState<string>('Discover true 4K ultra-short-throw projectors, daylight ALR screens, and THX-calibrated surround sound engineered for discerning homes.');
  const [cmsAnnouncement, setCmsAnnouncement] = useState<string>('Experience 150-inch 4K HDR Laser TV in person. Schedule a private demonstration in our Chennai showroom.');
  const [cmsPromoBanner, setCmsPromoBanner] = useState<{ active: boolean; text: string; link: string }>({ active: true, text: 'Special Showroom Bundle: Free 120" Fresnel ALR Screen with Flagship UST orders.', link: '/contact' });
  const [cmsBusinessHours, setCmsBusinessHours] = useState<string>('Monday – Saturday: 10:00 AM – 7:30 PM IST (Sunday by Appointment)');
  const [cmsSocialLinks, setCmsSocialLinks] = useState<{ instagram: string; youtube: string; whatsapp: string }>({ instagram: 'https://instagram.com/huntingprojectors', youtube: 'https://youtube.com/@huntingprojectors', whatsapp: 'https://wa.me/918825624537' });
  const [cmsSeo, setCmsSeo] = useState<{ metaTitle: string; metaDescription: string }>({ metaTitle: 'Hunting Projector | Luxury Home Cinema & Laser TV Systems Chennai', metaDescription: 'India’s premier destination for ultra-short-throw 4K home theater projectors, daylight ALR screens, and THX-certified installations.' });
  const [cmsFaqs, setCmsFaqs] = useState<Array<{ q: string; a: string }>>([
    { q: 'What makes Ultra Short Throw projectors superior to standard TVs?', a: 'UST projectors sit just 6 to 12 inches from the wall to project a cinematic 100 to 150-inch image without casting shadows or requiring ceiling mounting.' },
    { q: 'Can I watch in daylight with ambient room light?', a: 'Yes, when paired with an Ambient Light Rejecting (ALR) Fresnel screen, ambient ceiling light is deflected while laser brightness is reflected directly to viewers.' }
  ]);
  const [cmsActiveTab, setCmsActiveTab] = useState<'hero' | 'promo' | 'faqs' | 'hours' | 'seo' | 'social'>('hero');
  const [cmsPreviewOpen, setCmsPreviewOpen] = useState<boolean>(false);

  // Reports & Analytics Extended State
  const [analyticsData, setAnalyticsData] = useState<any>(null);
  const [analyticsRange, setAnalyticsRange] = useState<string>('all');
  const [analyticsLoading, setAnalyticsLoading] = useState<boolean>(false);

  // Warranty & Service Tickets State
  const [warrantyRecords, setWarrantyRecords] = useState<any[]>([]);
  const [serviceTickets, setServiceTickets] = useState<any[]>([]);
  const [warrantySearch, setWarrantySearch] = useState<string>('');
  const [isRegisterWarrantyOpen, setIsRegisterWarrantyOpen] = useState<boolean>(false);
  const [isCreateRmaOpen, setIsCreateRmaOpen] = useState<boolean>(false);
  const [warrantyForm, setWarrantyForm] = useState<any>({ customerName: '', customerPhone: '', customerEmail: '', productName: '', productSku: '', serialNumber: '', warrantyMonths: 24, notes: '' });
  const [rmaForm, setRmaForm] = useState<any>({ customerName: '', customerPhone: '', customerEmail: '', productName: '', serialNumber: '', issueType: 'HARDWARE', issueDescription: '', priority: 'NORMAL' });

  // Quotations State
  const [quotationsList, setQuotationsList] = useState<any[]>([]);
  const [isCreateQuoteOpen, setIsCreateQuoteOpen] = useState<boolean>(false);
  const [viewingQuote, setViewingQuote] = useState<any | null>(null);
  const [quoteForm, setQuoteForm] = useState<any>({
    customerName: '', customerPhone: '', customerEmail: '', companyName: '',
    city: 'Chennai', state: 'Tamil Nadu', validDays: 15, discountAmount: 0,
    shippingAmount: 0, taxAmount: 0, notes: '',
    items: [{ productId: '', productName: '', sku: '', quantity: 1, unitPrice: 0 }]
  });

  // Audit Logs State
  const [auditLogs, setAuditLogs] = useState<any[]>([]);

  // Bulk Product CSV Import Modal State
  const [isBulkImportOpen, setIsBulkImportOpen] = useState<boolean>(false);
  const [bulkCsvText, setBulkCsvText] = useState<string>('');
  const [bulkImportResults, setBulkImportResults] = useState<{ createdCount: number; errors: any[] } | null>(null);

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
    } else if (activeTab === 'enquiries' || activeTab === 'calendar') {
      adminService.getEnquiries()
        .then(res => setEnquiries(res))
        .catch(() => setEnquiries(recentData.enquiries || []));
    } else if (activeTab === 'reviews') {
      adminService.getReviews()
        .then(res => setReviewsList(res))
        .catch(err => console.warn('Reviews load error:', err));
    } else if (activeTab === 'audit') {
      adminService.getAuditLogs()
        .then(res => setAuditLogs(res))
        .catch(() => setAuditLogs([]));
    } else if (activeTab === 'reports') {
      setAnalyticsLoading(true);
      adminService.getAnalytics(analyticsRange)
        .then(setAnalyticsData)
        .catch(err => console.warn('Analytics fetch error:', err))
        .finally(() => setAnalyticsLoading(false));
    } else if (activeTab === 'warranty') {
      adminService.getWarranties({ q: warrantySearch })
        .then(setWarrantyRecords)
        .catch(() => setWarrantyRecords([]));
      adminService.getServiceTickets({ q: warrantySearch })
        .then(setServiceTickets)
        .catch(() => setServiceTickets([]));
    } else if (activeTab === 'quotations') {
      adminService.getQuotations()
        .then(setQuotationsList)
        .catch(() => setQuotationsList([]));
    } else if (activeTab === 'cms') {
      adminService.getCmsContent()
        .then(res => {
          setCmsContent(res);
          if (res.cms_hero) {
            setCmsHeadline(res.cms_hero.headline || 'Step Into The Future of Home Cinema');
            setCmsSubheadline(res.cms_hero.subheadline || 'Discover true 4K ultra-short-throw projectors, daylight ALR screens, and THX-calibrated surround sound engineered for discerning homes.');
          }
          if (res.cms_announcement) {
            setCmsAnnouncement(res.cms_announcement.text || res.cms_announcement);
          }
          if (res.cms_banners) {
            setCmsPromoBanner(res.cms_banners);
          }
          if (res.cms_business_hours) {
            setCmsBusinessHours(res.cms_business_hours);
          }
          if (res.cms_social_links) {
            setCmsSocialLinks(res.cms_social_links);
          }
          if (res.cms_seo) {
            setCmsSeo(res.cms_seo);
          }
          if (res.cms_faqs && Array.isArray(res.cms_faqs)) {
            setCmsFaqs(res.cms_faqs);
          }
        })
        .catch(err => console.warn('CMS load error:', err));
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
          store: { name: 'Hunting Projector', company: 'Nap Computers Electronicss', location: 'Chennai, India' },
          integrations: {
            email: { configured: false, sender: 'huntingprojectors@gmail.com' },
            whatsapp: { configured: false, businessNumber: '+91 88256 24537' },
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

  const handleUpdateEnquiryStatus = async (enquiryId: string, newStatus: string) => {
    try {
      await adminService.updateEnquiryStatus(enquiryId, newStatus);
      setEnquiries(prev => prev.map(e => e.id === enquiryId ? { ...e, status: newStatus } : e));
      setActionSuccessMsg(`Enquiry status updated to ${newStatus}`);
    } catch (err: any) {
      alert(`Error updating enquiry: ${err.message}`);
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
          <img
            src="/assets/hunting-projectors-logo-nav.png"
            alt="Hunting Projector Logo"
            className="admin-sidebar-logo"
            width="38"
            height="38"
          />
          <div className="admin-sidebar-brand-text">
            <span className="branding-title">HUNTING PROJECTOR</span>
            <span className="branding-subtitle">by Nap Computers Electronicss</span>
          </div>
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
            <span className="nav-label">CRM Enquiries</span>
            {stats && stats.pendingEnquiries > 0 && (
              <span className="nav-counter-pill gold">{stats.pendingEnquiries}</span>
            )}
          </button>

          <button
            type="button"
            className={`admin-nav-item ${activeTab === 'calendar' ? 'active' : ''}`}
            onClick={() => setActiveTab('calendar')}
          >
            <Calendar size={18} />
            <span className="nav-label">Demo Calendar</span>
          </button>

          <button
            type="button"
            className={`admin-nav-item ${activeTab === 'reviews' ? 'active' : ''}`}
            onClick={() => setActiveTab('reviews')}
          >
            <MessageSquareQuote size={18} />
            <span className="nav-label">Reviews</span>
          </button>

          <button
            type="button"
            className={`admin-nav-item ${activeTab === 'reports' ? 'active' : ''}`}
            onClick={() => setActiveTab('reports')}
          >
            <BarChart3 size={18} />
            <span className="nav-label">Reports & Exports</span>
          </button>

          <button
            type="button"
            className={`admin-nav-item ${activeTab === 'cms' ? 'active' : ''}`}
            onClick={() => setActiveTab('cms')}
          >
            <Globe size={18} />
            <span className="nav-label">Website CMS</span>
          </button>

          <button
            type="button"
            className={`admin-nav-item ${activeTab === 'warranty' ? 'active' : ''}`}
            onClick={() => setActiveTab('warranty')}
          >
            <ShieldCheck size={18} />
            <span className="nav-label">Warranty & RMA</span>
          </button>

          <button
            type="button"
            className={`admin-nav-item ${activeTab === 'quotations' ? 'active' : ''}`}
            onClick={() => setActiveTab('quotations')}
          >
            <FileSignature size={18} />
            <span className="nav-label">Quotations</span>
          </button>

          <button
            type="button"
            className={`admin-nav-item ${activeTab === 'audit' ? 'active' : ''}`}
            onClick={() => setActiveTab('audit')}
          >
            <History size={18} />
            <span className="nav-label">Activity Log</span>
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
              {activeTab === 'orders' && 'Order Management & Invoicing'}
              {activeTab === 'products' && 'Product Catalog Management'}
              {activeTab === 'categories' && 'Collections & Categories'}
              {activeTab === 'inventory' && 'Inventory & Stock Movements'}
              {activeTab === 'customers' && 'Customer Directory'}
              {activeTab === 'enquiries' && 'CRM Enquiries & Follow-ups'}
              {activeTab === 'calendar' && 'Showroom Demo Booking Calendar'}
              {activeTab === 'reviews' && 'Customer Reviews & Testimonial Moderation'}
              {activeTab === 'reports' && 'Business Intelligence & Graphical Analytics'}
              {activeTab === 'cms' && 'Website CMS, Banners, FAQs & SEO'}
              {activeTab === 'warranty' && 'Warranty Records & RMA Service Tickets'}
              {activeTab === 'quotations' && 'Commercial Quotation Drafting & Conversion'}
              {activeTab === 'audit' && 'Security & Operational Activity Log'}
              {activeTab === 'notifications' && 'System Notifications & Alerts'}
              {activeTab === 'settings' && 'Store & Integration Settings'}
            </h1>
            <span className="admin-store-tag">Nap Computers Electronicss • Chennai Fulfillment Hub</span>
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
                            <div style={{ display: 'flex', gap: '6px' }}>
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
                              <button
                                type="button"
                                className="table-action-btn"
                                style={{ background: '#252936', border: '1px solid #3c4254' }}
                                onClick={async () => {
                                  try {
                                    const inv = await adminService.getOrderInvoice(o.id);
                                    setViewingInvoice(inv);
                                  } catch (err: any) {
                                    alert('Failed to load invoice: ' + err.message);
                                  }
                                }}
                                title="Generate GST Tax Invoice"
                              >
                                Invoice
                              </button>
                            </div>
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
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button
                    type="button"
                    className="btn-secondary"
                    onClick={() => {
                      setIsBulkImportOpen(true);
                      setBulkImportResults(null);
                    }}
                  >
                    <UploadCloud size={16} />
                    <span>Bulk Import CSV</span>
                  </button>
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
                      <th>Update Status</th>
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
                        <td>
                          <select
                            value={enq.status}
                            onChange={e => handleUpdateEnquiryStatus(enq.id, e.target.value)}
                            style={{
                              padding: '4px 8px',
                              background: '#141721',
                              border: '1px solid #333',
                              color: '#FFF',
                              borderRadius: '4px',
                              fontSize: '11px'
                            }}
                          >
                            <option value="NEW">NEW</option>
                            <option value="CONTACTED">CONTACTED</option>
                            <option value="DEMO_SCHEDULED">DEMO_SCHEDULED</option>
                            <option value="CONVERTED">CONVERTED</option>
                            <option value="CLOSED">CLOSED</option>
                          </select>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB CONTENT: 6b. REVIEWS MODERATION */}
        {activeTab === 'reviews' && (
          <div className="admin-content-view">
            <div className="admin-panel-card">
              <div className="panel-card-head flex-between">
                <div>
                  <h3 className="panel-card-title">Customer Reviews & Experience Testimonials</h3>
                  <p className="text-muted text-sm">Moderate, approve, or hide customer reviews before they appear publicly on storefront.</p>
                </div>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button
                    type="button"
                    className={`btn-secondary ${reviewFilter === 'all' ? 'active' : ''}`}
                    onClick={() => setReviewFilter('all')}
                  >
                    All ({reviewsList.length})
                  </button>
                  <button
                    type="button"
                    className={`btn-secondary ${reviewFilter === 'approved' ? 'active' : ''}`}
                    onClick={() => setReviewFilter('approved')}
                  >
                    Approved ({reviewsList.filter(r => r.isVerifiedDemo).length})
                  </button>
                  <button
                    type="button"
                    className={`btn-secondary ${reviewFilter === 'pending' ? 'active' : ''}`}
                    onClick={() => setReviewFilter('pending')}
                  >
                    Pending ({reviewsList.filter(r => !r.isVerifiedDemo).length})
                  </button>
                </div>
              </div>

              <div className="table-responsive">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Author</th>
                      <th>Product</th>
                      <th>Rating</th>
                      <th>Review Title & Comment</th>
                      <th>Environment</th>
                      <th>Status</th>
                      <th>Moderation Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {reviewsList
                      .filter(r => {
                        if (reviewFilter === 'approved') return r.isVerifiedDemo;
                        if (reviewFilter === 'pending') return !r.isVerifiedDemo;
                        return true;
                      })
                      .map(rev => (
                        <tr key={rev.id}>
                          <td>
                            <strong>{rev.authorName}</strong>
                            <div className="text-xs text-muted">{rev.location || 'India'}</div>
                          </td>
                          <td>
                            <strong>{rev.product?.name || 'Projector'}</strong>
                          </td>
                          <td>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#D4AF37' }}>
                              <Star size={14} fill="#D4AF37" />
                              <span>{rev.rating}/5</span>
                            </div>
                          </td>
                          <td style={{ maxWidth: '350px' }}>
                            <div style={{ fontWeight: 600, color: '#FFFFFF', marginBottom: '2px' }}>{rev.title}</div>
                            <div className="text-xs text-muted" style={{ lineHeight: '1.4' }}>{rev.comment}</div>
                          </td>
                          <td>
                            <span className="type-tag">{rev.environment || 'Living Room'}</span>
                          </td>
                          <td>
                            <span className={`status-badge ${rev.isVerifiedDemo ? 'delivered' : 'pending'}`}>
                              {rev.isVerifiedDemo ? 'APPROVED' : 'PENDING'}
                            </span>
                          </td>
                          <td>
                            <div style={{ display: 'flex', gap: '6px' }}>
                              {!rev.isVerifiedDemo ? (
                                <button
                                  type="button"
                                  className="btn-primary"
                                  style={{ padding: '4px 10px', fontSize: '11px' }}
                                  onClick={async () => {
                                    try {
                                      setModeratingReviewId(rev.id);
                                      await adminService.moderateReview(rev.id, 'approve');
                                      setReviewsList(prev => prev.map(r => r.id === rev.id ? { ...r, isVerifiedDemo: true } : r));
                                      setActionSuccessMsg(`Review by ${rev.authorName} approved`);
                                    } catch (err: any) {
                                      setError(err.message || 'Failed to approve review');
                                    } finally {
                                      setModeratingReviewId(null);
                                    }
                                  }}
                                  disabled={moderatingReviewId === rev.id}
                                >
                                  Approve
                                </button>
                              ) : (
                                <button
                                  type="button"
                                  className="btn-secondary"
                                  style={{ padding: '4px 10px', fontSize: '11px', color: '#FF6B6B' }}
                                  onClick={async () => {
                                    try {
                                      setModeratingReviewId(rev.id);
                                      await adminService.moderateReview(rev.id, 'hide');
                                      setReviewsList(prev => prev.map(r => r.id === rev.id ? { ...r, isVerifiedDemo: false } : r));
                                      setActionSuccessMsg(`Review by ${rev.authorName} hidden`);
                                    } catch (err: any) {
                                      setError(err.message || 'Failed to hide review');
                                    } finally {
                                      setModeratingReviewId(null);
                                    }
                                  }}
                                  disabled={moderatingReviewId === rev.id}
                                >
                                  Hide
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                    {reviewsList.length === 0 && (
                      <tr>
                        <td colSpan={7} style={{ textAlign: 'center', padding: '32px', color: '#8E95A5' }}>
                          No customer reviews submitted yet.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB CONTENT: CALENDAR (INTERACTIVE MONTH / AGENDA / DAY / LIST) */}
        {activeTab === 'calendar' && (
          <div className="admin-content-view">
            <div className="admin-panel-card">
              <div className="panel-card-head flex-between">
                <div>
                  <h3 className="panel-card-title">VIP Demo & Showroom Booking Calendar</h3>
                  <p className="text-muted text-sm">Interactive appointment matrix, overlap warnings, and direct customer concierge in Asia/Kolkata timezone.</p>
                </div>
                <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                  <div style={{ display: 'flex', background: '#141721', borderRadius: '6px', padding: '2px', border: '1px solid #2a2f3f' }}>
                    <button
                      type="button"
                      className={`btn-secondary ${calendarViewMode === 'month' ? 'active' : ''}`}
                      style={{ padding: '4px 10px', fontSize: '11px', border: 'none' }}
                      onClick={() => setCalendarViewMode('month')}
                    >
                      Month Grid
                    </button>
                    <button
                      type="button"
                      className={`btn-secondary ${calendarViewMode === 'week' ? 'active' : ''}`}
                      style={{ padding: '4px 10px', fontSize: '11px', border: 'none' }}
                      onClick={() => setCalendarViewMode('week')}
                    >
                      Week Agenda
                    </button>
                    <button
                      type="button"
                      className={`btn-secondary ${calendarViewMode === 'list' ? 'active' : ''}`}
                      style={{ padding: '4px 10px', fontSize: '11px', border: 'none' }}
                      onClick={() => setCalendarViewMode('list')}
                    >
                      Bookings Ledger ({enquiries.length})
                    </button>
                  </div>
                </div>
              </div>

              {/* Month Navigation Header */}
              {calendarViewMode !== 'list' && (
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', margin: '16px 0', padding: '12px 16px', background: '#141721', borderRadius: '8px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <button
                      type="button"
                      className="table-action-btn"
                      onClick={() => {
                        const d = new Date(calendarCurrentDate);
                        d.setMonth(d.getMonth() - 1);
                        setCalendarCurrentDate(d);
                      }}
                    >
                      <ChevronLeft size={16} />
                    </button>
                    <strong style={{ fontSize: '16px', color: '#D4AF37' }}>
                      {calendarCurrentDate.toLocaleString('en-IN', { month: 'long', year: 'numeric' })}
                    </strong>
                    <button
                      type="button"
                      className="table-action-btn"
                      onClick={() => {
                        const d = new Date(calendarCurrentDate);
                        d.setMonth(d.getMonth() + 1);
                        setCalendarCurrentDate(d);
                      }}
                    >
                      <ChevronRight size={16} />
                    </button>
                  </div>
                  <button
                    type="button"
                    className="table-action-btn"
                    onClick={() => setCalendarCurrentDate(new Date())}
                  >
                    Today
                  </button>
                </div>
              )}

              {/* MONTHLY GRID VIEW */}
              {calendarViewMode === 'month' && (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '8px', margin: '16px 0' }}>
                  {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                    <div key={day} style={{ textAlign: 'center', fontWeight: 'bold', fontSize: '12px', color: '#8E95A5', paddingBottom: '6px' }}>
                      {day}
                    </div>
                  ))}
                  {Array.from({ length: 35 }).map((_, i) => {
                    const year = calendarCurrentDate.getFullYear();
                    const month = calendarCurrentDate.getMonth();
                    const firstDay = new Date(year, month, 1).getDay();
                    const dayNum = i - firstDay + 1;
                    const daysInMonth = new Date(year, month + 1, 0).getDate();
                    const isValidDay = dayNum > 0 && dayNum <= daysInMonth;
                    const dateObj = new Date(year, month, dayNum);
                    const dateStr = isValidDay ? dateObj.toISOString().slice(0, 10) : '';

                    const dayBookings = isValidDay ? enquiries.filter(e => {
                      const bDate = new Date(e.createdAt).toISOString().slice(0, 10);
                      return bDate === dateStr;
                    }) : [];

                    const hasOverlap = dayBookings.length > 2;

                    return (
                      <div
                        key={i}
                        style={{
                          minHeight: '90px',
                          background: isValidDay ? '#181b26' : '#0e111a',
                          border: isValidDay ? '1px solid #282d3c' : '1px solid #141721',
                          borderRadius: '6px',
                          padding: '6px',
                          opacity: isValidDay ? 1 : 0.4
                        }}
                      >
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: '#888', marginBottom: '4px' }}>
                          <span style={{ fontWeight: isValidDay ? 'bold' : 'normal', color: isValidDay ? '#fff' : '#666' }}>
                            {isValidDay ? dayNum : ''}
                          </span>
                          {hasOverlap && (
                            <span style={{ color: '#FFB800', fontSize: '10px' }} title="Multiple booking slots allocated">⚠️ High Density</span>
                          )}
                        </div>

                        {dayBookings.map((b, bIdx) => (
                          <div
                            key={bIdx}
                            onClick={() => setSelectedDemoModal(b)}
                            style={{
                              background: b.status === 'CONVERTED' ? '#10392b' : b.status === 'DEMO_SCHEDULED' ? '#1c2e4a' : '#2d2415',
                              border: `1px solid ${b.status === 'CONVERTED' ? '#1b8a5a' : b.status === 'DEMO_SCHEDULED' ? '#2e6da4' : '#8c6b23'}`,
                              borderRadius: '4px',
                              padding: '2px 4px',
                              fontSize: '10px',
                              marginBottom: '3px',
                              cursor: 'pointer',
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              whiteSpace: 'nowrap'
                            }}
                          >
                            <strong>{b.fullName}</strong> ({b.city || 'Chennai'})
                          </div>
                        ))}
                      </div>
                    );
                  })}
                </div>
              )}

              {/* LIST / LEDGER VIEW */}
              {(calendarViewMode === 'list' || calendarViewMode === 'week') && (
                <div className="table-responsive">
                  <table className="admin-table">
                    <thead>
                      <tr>
                        <th>Booking Ref</th>
                        <th>Client Name</th>
                        <th>Phone / WhatsApp</th>
                        <th>Preferred Channel</th>
                        <th>Model of Interest</th>
                        <th>Location</th>
                        <th>Current Stage</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {enquiries
                        .filter(e => {
                          if (calendarFilter === 'upcoming') return e.status === 'NEW' || e.status === 'DEMO_SCHEDULED';
                          return true;
                        })
                        .map(demo => (
                          <tr key={demo.id}>
                            <td className="font-mono text-gold font-bold">{demo.referenceId}</td>
                            <td><strong>{demo.fullName}</strong></td>
                            <td>
                              <div>{demo.phoneNumber}</div>
                              {demo.email && <div className="text-xs text-muted">{demo.email}</div>}
                            </td>
                            <td>
                              <span className="type-tag">{demo.preferredContact || 'whatsapp'}</span>
                            </td>
                            <td>
                              <strong>{demo.product?.name || demo.productName || 'Ultra Short Throw Demo'}</strong>
                            </td>
                            <td>{demo.city}</td>
                            <td>
                              <span className={`status-badge ${demo.status?.toLowerCase()}`}>
                                {demo.status}
                              </span>
                            </td>
                            <td>
                              <div style={{ display: 'flex', gap: '6px' }}>
                                <button
                                  type="button"
                                  className="table-action-btn"
                                  onClick={() => setSelectedDemoModal(demo)}
                                >
                                  Details
                                </button>
                                <a
                                  href={`https://wa.me/${(demo.phoneNumber || '').replace(/[^0-9]/g, '')}?text=Hello%20${encodeURIComponent(demo.fullName)},%20confirming%20your%20Hunting%20Projectors%20VIP%20demo%20session.`}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="table-action-btn"
                                  style={{ background: '#25D366', color: '#000', fontWeight: 'bold' }}
                                >
                                  WhatsApp
                                </a>
                              </div>
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}

        {/* DEMO BOOKING DETAILS / RESCHEDULING MODAL */}
        {selectedDemoModal && (
          <div className="admin-modal-overlay" onClick={() => setSelectedDemoModal(null)}>
            <div className="admin-modal-card" onClick={e => e.stopPropagation()}>
              <div className="modal-head">
                <h3>VIP Demo Details: {selectedDemoModal.referenceId}</h3>
                <button type="button" className="modal-close" onClick={() => setSelectedDemoModal(null)}>✕</button>
              </div>

              <div className="modal-body">
                <div style={{ background: '#141721', padding: '14px', borderRadius: '6px', marginBottom: '16px' }}>
                  <p style={{ margin: '0 0 6px 0' }}><strong>Client Name:</strong> {selectedDemoModal.fullName}</p>
                  <p style={{ margin: '0 0 6px 0' }}><strong>Phone Number:</strong> {selectedDemoModal.phoneNumber}</p>
                  <p style={{ margin: '0 0 6px 0' }}><strong>Location:</strong> {selectedDemoModal.city || 'Chennai Hub'}</p>
                  <p style={{ margin: '0 0 6px 0' }}><strong>Projector Model:</strong> {selectedDemoModal.product?.name || selectedDemoModal.productName}</p>
                  <p style={{ margin: '0 0 6px 0' }}><strong>Preferred Contact:</strong> {selectedDemoModal.preferredContact || 'WhatsApp'}</p>
                  <p style={{ margin: '0' }}><strong>Booked Timestamp:</strong> {new Date(selectedDemoModal.createdAt).toLocaleString('en-IN')}</p>
                </div>

                <div className="modal-form-group">
                  <label>Update Booking Status:</label>
                  <select
                    value={selectedDemoModal.status}
                    onChange={async e => {
                      const newSt = e.target.value;
                      await handleUpdateEnquiryStatus(selectedDemoModal.id, newSt);
                      setSelectedDemoModal({ ...selectedDemoModal, status: newSt });
                    }}
                  >
                    <option value="NEW">NEW (Awaiting Initial Contact)</option>
                    <option value="CONTACTED">CONTACTED (Follow-up In Progress)</option>
                    <option value="DEMO_SCHEDULED">DEMO_SCHEDULED (Showroom Time Confirmed)</option>
                    <option value="CONVERTED">CONVERTED (Lead Accepted & Order Placed)</option>
                    <option value="CLOSED">CLOSED (Archived / Cancelled)</option>
                  </select>
                </div>

                <div className="modal-form-group">
                  <label>Showroom Client Requirements / Notes:</label>
                  <textarea
                    rows={3}
                    defaultValue={selectedDemoModal.message || 'Customer requested private 4K UST demonstration with ALR daylight ambient screen.'}
                  />
                </div>
              </div>

              <div className="modal-actions">
                <button type="button" className="btn-secondary" onClick={() => setSelectedDemoModal(null)}>Close</button>
                <a
                  href={`https://wa.me/${(selectedDemoModal.phoneNumber || '').replace(/[^0-9]/g, '')}?text=Hello%20${encodeURIComponent(selectedDemoModal.fullName)},%20confirming%20your%20Hunting%20Projectors%20demo%20schedule.`}
                  target="_blank"
                  rel="noreferrer"
                  className="btn-primary"
                  style={{ background: '#25D366', color: '#000', fontWeight: 'bold' }}
                >
                  Send Confirmation WhatsApp
                </a>
              </div>
            </div>
          </div>
        )}

        {/* TAB CONTENT: COMPLETE REPORTS & GRAPHICAL ANALYTICS */}
        {activeTab === 'reports' && (
          <div className="admin-content-view">
            <div className="admin-panel-card">
              <div className="panel-card-head flex-between">
                <div>
                  <h3 className="panel-card-title">Business Intelligence & Graphical Performance Analytics</h3>
                  <p className="text-muted text-sm">Real-time revenue reconciliation, order status distribution, and daily/monthly trends computed from Neon PostgreSQL.</p>
                </div>
                <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                  <label style={{ fontSize: '12px', color: '#888' }}>Date Filter:</label>
                  <select
                    value={analyticsRange}
                    onChange={e => {
                      setAnalyticsRange(e.target.value);
                      adminService.getAnalytics(e.target.value).then(setAnalyticsData);
                    }}
                    style={{ padding: '6px 12px', background: '#141721', color: '#fff', border: '1px solid #2a2f3f', borderRadius: '4px', fontSize: '12px' }}
                  >
                    <option value="all">All Time (Full Ledger)</option>
                    <option value="today">Today Only</option>
                    <option value="7d">Last 7 Days</option>
                    <option value="30d">Last 30 Days</option>
                    <option value="this_month">This Month</option>
                    <option value="prev_month">Previous Month</option>
                  </select>
                </div>
              </div>

              {/* Financial Summary Cards */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', margin: '20px 0' }}>
                <div style={{ background: '#141721', padding: '16px', borderRadius: '8px', border: '1px solid #1b4d3e' }}>
                  <span style={{ fontSize: '12px', color: '#4ECCA3', fontWeight: 'bold' }}>VERIFIED PAID REVENUE</span>
                  <h3 style={{ margin: '8px 0', fontSize: '24px', color: '#4ECCA3' }}>
                    ₹{Number(analyticsData?.summary?.paidRevenue || 0).toLocaleString('en-IN')}
                  </h3>
                  <span className="text-xs text-muted">Strictly genuine paid transactions</span>
                </div>

                <div style={{ background: '#141721', padding: '16px', borderRadius: '8px', border: '1px solid #4a3818' }}>
                  <span style={{ fontSize: '12px', color: '#D4AF37', fontWeight: 'bold' }}>PENDING ORDERS TOTAL</span>
                  <h3 style={{ margin: '8px 0', fontSize: '24px', color: '#D4AF37' }}>
                    ₹{Number(analyticsData?.summary?.pendingRevenue || 0).toLocaleString('en-IN')}
                  </h3>
                  <span className="text-xs text-muted">Awaiting NEFT or WhatsApp verify</span>
                </div>

                <div style={{ background: '#141721', padding: '16px', borderRadius: '8px', border: '1px solid #252936' }}>
                  <span style={{ fontSize: '12px', color: '#8E95A5', fontWeight: 'bold' }}>TOTAL ORDERS RECORDED</span>
                  <h3 style={{ margin: '8px 0', fontSize: '24px', color: '#FFF' }}>
                    {analyticsData?.summary?.totalOrders || orders.length}
                  </h3>
                  <span className="text-xs text-muted">Cancelled: {analyticsData?.summary?.cancelledOrders || 0} orders</span>
                </div>

                <div style={{ background: '#141721', padding: '16px', borderRadius: '8px', border: '1px solid #1d3354' }}>
                  <span style={{ fontSize: '12px', color: '#5dade2', fontWeight: 'bold' }}>ENQUIRY CONVERSION RATE</span>
                  <h3 style={{ margin: '8px 0', fontSize: '24px', color: '#5dade2' }}>
                    {analyticsData?.summary?.conversionRate || '0%'}
                  </h3>
                  <span className="text-xs text-muted">Converted: {analyticsData?.summary?.convertedEnquiries || 0} of {analyticsData?.summary?.totalEnquiries || 0} leads</span>
                </div>
              </div>

              {/* Graphical Charts Section (SVG-Rendered Data Visualizations) */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '20px', margin: '24px 0' }}>
                {/* Chart 1: Order Status Distribution */}
                <div style={{ background: '#141721', padding: '20px', borderRadius: '8px', border: '1px solid #252936' }}>
                  <h4 style={{ color: '#fff', margin: '0 0 16px 0', fontSize: '14px' }}>📊 Order Fulfillment Status Breakdown</h4>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    {analyticsData?.orderStatusDistribution && Object.entries(analyticsData.orderStatusDistribution).map(([st, cnt]: any) => {
                      const total = analyticsData.summary.totalOrders || 1;
                      const pct = Math.round((Number(cnt) / total) * 100);
                      return (
                        <div key={st}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '4px' }}>
                            <span>{st}</span>
                            <span><strong>{cnt}</strong> ({pct}%)</span>
                          </div>
                          <div style={{ background: '#0e111a', height: '8px', borderRadius: '4px', overflow: 'hidden' }}>
                            <div style={{ width: `${pct}%`, height: '100%', background: st === 'DELIVERED' ? '#4ECCA3' : st === 'CANCELLED' ? '#FF6B6B' : '#D4AF37' }} />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Chart 2: Inventory Stock Breakdown */}
                <div style={{ background: '#141721', padding: '20px', borderRadius: '8px', border: '1px solid #252936' }}>
                  <h4 style={{ color: '#fff', margin: '0 0 16px 0', fontSize: '14px' }}>📦 Real-time Warehouse Inventory Health</h4>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '16px' }}>
                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '4px' }}>
                        <span style={{ color: '#4ECCA3' }}>Healthy Stock (&gt; 5 units)</span>
                        <strong>{analyticsData?.inventoryDistribution?.adequate ?? 0} SKUs</strong>
                      </div>
                      <div style={{ background: '#0e111a', height: '8px', borderRadius: '4px', overflow: 'hidden' }}>
                        <div style={{ width: '80%', height: '100%', background: '#4ECCA3' }} />
                      </div>
                    </div>

                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '4px' }}>
                        <span style={{ color: '#D4AF37' }}>Low Stock (&le; 5 units)</span>
                        <strong>{analyticsData?.inventoryDistribution?.lowStock ?? 0} SKUs</strong>
                      </div>
                      <div style={{ background: '#0e111a', height: '8px', borderRadius: '4px', overflow: 'hidden' }}>
                        <div style={{ width: '15%', height: '100%', background: '#D4AF37' }} />
                      </div>
                    </div>

                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '4px' }}>
                        <span style={{ color: '#FF6B6B' }}>Out of Stock</span>
                        <strong>{analyticsData?.inventoryDistribution?.outOfStock ?? 0} SKUs</strong>
                      </div>
                      <div style={{ background: '#0e111a', height: '8px', borderRadius: '4px', overflow: 'hidden' }}>
                        <div style={{ width: '5%', height: '100%', background: '#FF6B6B' }} />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Product-wise Sales Performance Table */}
              <div style={{ marginTop: '24px' }}>
                <h4 style={{ color: '#fff', marginBottom: '12px' }}>🏆 Top Performing Projector Models</h4>
                <div className="table-responsive">
                  <table className="admin-table">
                    <thead>
                      <tr>
                        <th>Product Model</th>
                        <th>SKU</th>
                        <th>Units Sold</th>
                        <th>Total Gross Revenue</th>
                      </tr>
                    </thead>
                    <tbody>
                      {analyticsData?.productPerformance?.length > 0 ? (
                        analyticsData.productPerformance.map((p: any, i: number) => (
                          <tr key={i}>
                            <td><strong>{p.name}</strong></td>
                            <td className="font-mono text-gold">{p.sku}</td>
                            <td>{p.unitsSold} units</td>
                            <td className="font-mono font-bold">₹{Number(p.revenue).toLocaleString('en-IN')}</td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={4} className="text-center py-4 text-muted">No sales orders recorded in this time range.</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Data Exports (Preserved CSV Download Utilities) */}
              <h4 style={{ color: '#fff', marginTop: '32px', marginBottom: '12px' }}>📥 Download Sanitized CSV Ledger Extracts</h4>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px' }}>
                <button
                  type="button"
                  className="btn-primary"
                  onClick={() => {
                    const headers = ['Order Number', 'Date', 'Customer Name', 'Phone', 'Email', 'City', 'State', 'Amount', 'Status', 'Payment Status'];
                    const rows = orders.map(o => [
                      `'${o.orderNumber}`,
                      new Date(o.createdAt).toLocaleDateString('en-IN'),
                      `"${(o.customerName || '').replace(/"/g, '""')}"`,
                      `'${o.customerPhone || ''}`,
                      `"${(o.customerEmail || '').replace(/"/g, '""')}"`,
                      `"${(o.city || '').replace(/"/g, '""')}"`,
                      `"${(o.state || '').replace(/"/g, '""')}"`,
                      o.totalAmount,
                      o.orderStatus,
                      o.paymentStatus
                    ]);
                    const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
                    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
                    const a = document.createElement('a');
                    a.href = URL.createObjectURL(blob);
                    a.download = `napcomputers_orders_${new Date().toISOString().slice(0, 10)}.csv`;
                    a.click();
                  }}
                >
                  <Download size={15} />
                  <span>Download Orders CSV</span>
                </button>

                <button
                  type="button"
                  className="btn-primary"
                  onClick={() => {
                    const headers = ['SKU', 'Product Name', 'Category', 'Price', 'MRP', 'Stock Units', 'Active'];
                    const rows = productsList.map(p => [
                      `'${p.sku || ''}`,
                      `"${(p.name || '').replace(/"/g, '""')}"`,
                      p.category,
                      p.price,
                      p.mrp || p.compareAtPrice || p.price,
                      p.stock,
                      p.isActive ? 'YES' : 'NO'
                    ]);
                    const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
                    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
                    const a = document.createElement('a');
                    a.href = URL.createObjectURL(blob);
                    a.download = `napcomputers_products_${new Date().toISOString().slice(0, 10)}.csv`;
                    a.click();
                  }}
                >
                  <Download size={15} />
                  <span>Download Catalog CSV</span>
                </button>

                <button
                  type="button"
                  className="btn-primary"
                  onClick={() => {
                    const headers = ['Reference ID', 'Date', 'Full Name', 'Phone', 'City', 'Product', 'Status'];
                    const rows = enquiries.map(e => [
                      `'${e.referenceId}`,
                      new Date(e.createdAt).toLocaleDateString('en-IN'),
                      `"${(e.fullName || '').replace(/"/g, '""')}"`,
                      `'${e.phoneNumber || ''}`,
                      `"${(e.city || '').replace(/"/g, '""')}"`,
                      `"${(e.product?.name || e.productName || '').replace(/"/g, '""')}"`,
                      e.status
                    ]);
                    const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
                    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
                    const a = document.createElement('a');
                    a.href = URL.createObjectURL(blob);
                    a.download = `napcomputers_enquiries_${new Date().toISOString().slice(0, 10)}.csv`;
                    a.click();
                  }}
                >
                  <Download size={15} />
                  <span>Download Enquiries CSV</span>
                </button>

                <button
                  type="button"
                  className="btn-primary"
                  onClick={() => {
                    const headers = ['Name', 'Email', 'Phone', 'Total Orders', 'Total Spent'];
                    const rows = customers.map(c => [
                      `"${(c.fullName || '').replace(/"/g, '""')}"`,
                      `"${(c.email || '').replace(/"/g, '""')}"`,
                      `'${c.phoneNumber || ''}`,
                      c.totalOrders ?? 0,
                      c.totalSpent ?? 0
                    ]);
                    const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
                    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
                    const a = document.createElement('a');
                    a.href = URL.createObjectURL(blob);
                    a.download = `napcomputers_customers_${new Date().toISOString().slice(0, 10)}.csv`;
                    a.click();
                  }}
                >
                  <Download size={15} />
                  <span>Download Customers CSV</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* TAB CONTENT: COMPLETE WEBSITE CMS */}
        {activeTab === 'cms' && (
          <div className="admin-content-view">
            <div className="admin-panel-card">
              <div className="panel-card-head flex-between">
                <div>
                  <h3 className="panel-card-title">Homepage & Storefront CMS Suite</h3>
                  <p className="text-muted text-sm">Control announcements, promotional hero banners, FAQs, business hours, and SEO metadata with instant persistence.</p>
                </div>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button
                    type="button"
                    className="btn-secondary"
                    onClick={() => setCmsPreviewOpen(true)}
                  >
                    <Eye size={15} />
                    <span>Live Preview</span>
                  </button>
                </div>
              </div>

              {/* Sub-Tabs for CMS Sections */}
              <div style={{ display: 'flex', gap: '8px', borderBottom: '1px solid #252936', paddingBottom: '12px', margin: '16px 0' }}>
                <button
                  type="button"
                  className={`btn-secondary ${cmsActiveTab === 'hero' ? 'active' : ''}`}
                  onClick={() => setCmsActiveTab('hero')}
                >
                  Hero & Announcement
                </button>
                <button
                  type="button"
                  className={`btn-secondary ${cmsActiveTab === 'promo' ? 'active' : ''}`}
                  onClick={() => setCmsActiveTab('promo')}
                >
                  Promotional Banners
                </button>
                <button
                  type="button"
                  className={`btn-secondary ${cmsActiveTab === 'faqs' ? 'active' : ''}`}
                  onClick={() => setCmsActiveTab('faqs')}
                >
                  Store FAQs
                </button>
                <button
                  type="button"
                  className={`btn-secondary ${cmsActiveTab === 'hours' ? 'active' : ''}`}
                  onClick={() => setCmsActiveTab('hours')}
                >
                  Operating Hours
                </button>
                <button
                  type="button"
                  className={`btn-secondary ${cmsActiveTab === 'seo' ? 'active' : ''}`}
                  onClick={() => setCmsActiveTab('seo')}
                >
                  Search Engine SEO
                </button>
                <button
                  type="button"
                  className={`btn-secondary ${cmsActiveTab === 'social' ? 'active' : ''}`}
                  onClick={() => setCmsActiveTab('social')}
                >
                  Social Handles
                </button>
              </div>

              {/* Sub-Tab 1: Hero & Announcement */}
              {cmsActiveTab === 'hero' && (
                <div style={{ maxWidth: '750px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <div className="modal-form-group">
                    <label>Store Top Announcement Notice:</label>
                    <input
                      type="text"
                      value={cmsAnnouncement}
                      onChange={e => setCmsAnnouncement(e.target.value)}
                    />
                  </div>

                  <div className="modal-form-group">
                    <label>Homepage Hero Main Headline:</label>
                    <input
                      type="text"
                      value={cmsHeadline}
                      onChange={e => setCmsHeadline(e.target.value)}
                    />
                  </div>

                  <div className="modal-form-group">
                    <label>Homepage Hero Sub-Headline:</label>
                    <textarea
                      rows={3}
                      value={cmsSubheadline}
                      onChange={e => setCmsSubheadline(e.target.value)}
                    />
                  </div>

                  <button
                    type="button"
                    className="btn-primary"
                    style={{ alignSelf: 'flex-start' }}
                    onClick={async () => {
                      try {
                        await adminService.updateCmsContent('cms_hero', { headline: cmsHeadline, subheadline: cmsSubheadline });
                        await adminService.updateCmsContent('cms_announcement', { text: cmsAnnouncement });
                        setActionSuccessMsg('Hero and announcement content published successfully!');
                      } catch (err: any) { setError(err.message); }
                    }}
                  >
                    Publish Hero Changes
                  </button>
                </div>
              )}

              {/* Sub-Tab 2: Promotional Banners */}
              {cmsActiveTab === 'promo' && (
                <div style={{ maxWidth: '750px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <input
                      type="checkbox"
                      id="promoActive"
                      checked={cmsPromoBanner.active}
                      onChange={e => setCmsPromoBanner({ ...cmsPromoBanner, active: e.target.checked })}
                    />
                    <label htmlFor="promoActive" style={{ color: '#fff', cursor: 'pointer' }}>
                      Enable Showcase Promotional Banner on Storefront
                    </label>
                  </div>

                  <div className="modal-form-group">
                    <label>Promotional Banner Message:</label>
                    <input
                      type="text"
                      value={cmsPromoBanner.text}
                      onChange={e => setCmsPromoBanner({ ...cmsPromoBanner, text: e.target.value })}
                    />
                  </div>

                  <div className="modal-form-group">
                    <label>Action Destination Link:</label>
                    <input
                      type="text"
                      value={cmsPromoBanner.link}
                      onChange={e => setCmsPromoBanner({ ...cmsPromoBanner, link: e.target.value })}
                    />
                  </div>

                  <button
                    type="button"
                    className="btn-primary"
                    style={{ alignSelf: 'flex-start' }}
                    onClick={async () => {
                      try {
                        await adminService.updateCmsContent('cms_banners', cmsPromoBanner);
                        setActionSuccessMsg('Promotional banner settings updated!');
                      } catch (err: any) { setError(err.message); }
                    }}
                  >
                    Save Promotional Banner
                  </button>
                </div>
              )}

              {/* Sub-Tab 3: FAQs */}
              {cmsActiveTab === 'faqs' && (
                <div style={{ maxWidth: '800px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                    <span className="text-sm text-muted">Customer-facing projector and screen purchase questions.</span>
                    <button
                      type="button"
                      className="btn-secondary"
                      onClick={() => setCmsFaqs([...cmsFaqs, { q: 'New Projector FAQ Question', a: 'Detailed answer regarding home cinema acoustics or throw ratio...' }])}
                    >
                      <Plus size={14} />
                      <span>Add FAQ Item</span>
                    </button>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    {cmsFaqs.map((faq, idx) => (
                      <div key={idx} style={{ background: '#141721', padding: '16px', borderRadius: '6px', border: '1px solid #282d3c' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                          <strong style={{ color: '#D4AF37' }}>FAQ #{idx + 1}</strong>
                          <button
                            type="button"
                            className="table-action-btn"
                            style={{ color: '#FF6B6B' }}
                            onClick={() => setCmsFaqs(cmsFaqs.filter((_, i) => i !== idx))}
                          >
                            Remove
                          </button>
                        </div>
                        <input
                          type="text"
                          value={faq.q}
                          style={{ marginBottom: '8px' }}
                          onChange={e => {
                            const updated = [...cmsFaqs];
                            updated[idx].q = e.target.value;
                            setCmsFaqs(updated);
                          }}
                        />
                        <textarea
                          rows={2}
                          value={faq.a}
                          onChange={e => {
                            const updated = [...cmsFaqs];
                            updated[idx].a = e.target.value;
                            setCmsFaqs(updated);
                          }}
                        />
                      </div>
                    ))}
                  </div>

                  <button
                    type="button"
                    className="btn-primary"
                    style={{ marginTop: '16px' }}
                    onClick={async () => {
                      try {
                        await adminService.updateCmsContent('cms_faqs', cmsFaqs);
                        setActionSuccessMsg('Store FAQs successfully published!');
                      } catch (err: any) { setError(err.message); }
                    }}
                  >
                    Publish All FAQs
                  </button>
                </div>
              )}

              {/* Sub-Tab 4: Business Hours */}
              {cmsActiveTab === 'hours' && (
                <div style={{ maxWidth: '650px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <div className="modal-form-group">
                    <label>Showroom & Concierge Support Hours:</label>
                    <input
                      type="text"
                      value={cmsBusinessHours}
                      onChange={e => setCmsBusinessHours(e.target.value)}
                    />
                    <span className="text-xs text-muted">Displayed on the Contact page, footer, and quotation letters.</span>
                  </div>

                  <button
                    type="button"
                    className="btn-primary"
                    style={{ alignSelf: 'flex-start' }}
                    onClick={async () => {
                      try {
                        await adminService.updateCmsContent('cms_business_hours', cmsBusinessHours);
                        setActionSuccessMsg('Business hours updated successfully!');
                      } catch (err: any) { setError(err.message); }
                    }}
                  >
                    Save Business Hours
                  </button>
                </div>
              )}

              {/* Sub-Tab 5: SEO Metadata */}
              {cmsActiveTab === 'seo' && (
                <div style={{ maxWidth: '650px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <div className="modal-form-group">
                    <label>Storefront Meta Title:</label>
                    <input
                      type="text"
                      value={cmsSeo.metaTitle}
                      onChange={e => setCmsSeo({ ...cmsSeo, metaTitle: e.target.value })}
                    />
                  </div>

                  <div className="modal-form-group">
                    <label>Search Engine Meta Description:</label>
                    <textarea
                      rows={3}
                      value={cmsSeo.metaDescription}
                      onChange={e => setCmsSeo({ ...cmsSeo, metaDescription: e.target.value })}
                    />
                  </div>

                  <button
                    type="button"
                    className="btn-primary"
                    style={{ alignSelf: 'flex-start' }}
                    onClick={async () => {
                      try {
                        await adminService.updateCmsContent('cms_seo', cmsSeo);
                        setActionSuccessMsg('SEO metadata saved successfully!');
                      } catch (err: any) { setError(err.message); }
                    }}
                  >
                    Save SEO Metadata
                  </button>
                </div>
              )}

              {/* Sub-Tab 6: Social Links */}
              {cmsActiveTab === 'social' && (
                <div style={{ maxWidth: '650px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <div className="modal-form-group">
                    <label>Instagram URL:</label>
                    <input
                      type="text"
                      value={cmsSocialLinks.instagram}
                      onChange={e => setCmsSocialLinks({ ...cmsSocialLinks, instagram: e.target.value })}
                    />
                  </div>

                  <div className="modal-form-group">
                    <label>YouTube Channel URL:</label>
                    <input
                      type="text"
                      value={cmsSocialLinks.youtube}
                      onChange={e => setCmsSocialLinks({ ...cmsSocialLinks, youtube: e.target.value })}
                    />
                  </div>

                  <div className="modal-form-group">
                    <label>WhatsApp Link:</label>
                    <input
                      type="text"
                      value={cmsSocialLinks.whatsapp}
                      onChange={e => setCmsSocialLinks({ ...cmsSocialLinks, whatsapp: e.target.value })}
                    />
                  </div>

                  <button
                    type="button"
                    className="btn-primary"
                    style={{ alignSelf: 'flex-start' }}
                    onClick={async () => {
                      try {
                        await adminService.updateCmsContent('cms_social_links', cmsSocialLinks);
                        setActionSuccessMsg('Social media handles saved!');
                      } catch (err: any) { setError(err.message); }
                    }}
                  >
                    Save Social Links
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* CMS LIVE PREVIEW MODAL */}
        {cmsPreviewOpen && (
          <div className="admin-modal-overlay" onClick={() => setCmsPreviewOpen(false)}>
            <div className="admin-modal-card" style={{ maxWidth: '850px' }} onClick={e => e.stopPropagation()}>
              <div className="modal-head">
                <h3>Storefront Preview Mode</h3>
                <button type="button" className="modal-close" onClick={() => setCmsPreviewOpen(false)}>✕</button>
              </div>

              <div className="modal-body" style={{ background: '#0a0d14', padding: '24px', borderRadius: '8px' }}>
                {/* Announcement Bar */}
                <div style={{ background: '#D4AF37', color: '#000', padding: '8px 16px', borderRadius: '4px', textAlign: 'center', fontWeight: 'bold', fontSize: '12px', marginBottom: '16px' }}>
                  {cmsAnnouncement}
                </div>

                {/* Promo Banner if active */}
                {cmsPromoBanner.active && (
                  <div style={{ background: '#1c2438', border: '1px solid #2e4d8a', color: '#88a4e6', padding: '10px 16px', borderRadius: '4px', textAlign: 'center', fontSize: '13px', marginBottom: '20px' }}>
                    ✨ {cmsPromoBanner.text}
                  </div>
                )}

                {/* Hero Showcase */}
                <div style={{ textAlign: 'center', padding: '40px 20px', border: '1px dashed #282d3c', borderRadius: '8px' }}>
                  <h1 style={{ fontSize: '28px', color: '#fff', marginBottom: '12px' }}>{cmsHeadline}</h1>
                  <p style={{ color: '#8E95A5', maxWidth: '600px', margin: '0 auto', fontSize: '14px', lineHeight: 1.6 }}>{cmsSubheadline}</p>
                </div>

                {/* Business Hours Footer Notice */}
                <div style={{ marginTop: '24px', padding: '12px', background: '#141721', borderRadius: '6px', fontSize: '12px', color: '#888', textAlign: 'center' }}>
                  Official Hours: <strong>{cmsBusinessHours}</strong>
                </div>
              </div>

              <div className="modal-actions">
                <button type="button" className="btn-secondary" onClick={() => setCmsPreviewOpen(false)}>Close Preview</button>
              </div>
            </div>
          </div>
        )}

        {/* TAB CONTENT: DEDICATED WARRANTY & RMA MANAGEMENT */}
        {activeTab === 'warranty' && (
          <div className="admin-content-view">
            <div className="admin-panel-card">
              <div className="panel-card-head flex-between">
                <div>
                  <h3 className="panel-card-title">Official Warranty & RMA Service Management</h3>
                  <p className="text-muted text-sm">Register customer product serials, calculate expiry timelines, and track after-sales service RMA tickets.</p>
                </div>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button
                    type="button"
                    className="btn-secondary"
                    onClick={() => setIsCreateRmaOpen(true)}
                  >
                    <Wrench size={15} />
                    <span>Create RMA Ticket</span>
                  </button>
                  <button
                    type="button"
                    className="btn-primary"
                    onClick={() => setIsRegisterWarrantyOpen(true)}
                  >
                    <ShieldCheck size={15} />
                    <span>Register Warranty Certificate</span>
                  </button>
                </div>
              </div>

              {/* Warranty Search Bar */}
              <div className="admin-filter-bar">
                <div className="search-input-wrap">
                  <Search size={15} />
                  <input
                    type="text"
                    placeholder="Search by serial #, customer phone, order # or model..."
                    value={warrantySearch}
                    onChange={e => {
                      setWarrantySearch(e.target.value);
                      adminService.getWarranties({ q: e.target.value }).then(setWarrantyRecords);
                    }}
                  />
                </div>
              </div>

              {/* Active Warranty Records Table */}
              <h4 style={{ color: '#fff', margin: '16px 0 10px 0' }}>Registered Warranties ({warrantyRecords.length})</h4>
              <div className="table-responsive">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Serial #</th>
                      <th>Customer Name</th>
                      <th>Contact Phone</th>
                      <th>Projector Model</th>
                      <th>Purchase Date</th>
                      <th>Warranty Expiry</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {warrantyRecords.map(w => (
                      <tr key={w.id}>
                        <td className="font-mono text-gold font-bold">{w.serialNumber || 'HP-UNASSIGNED'}</td>
                        <td><strong>{w.customerName}</strong></td>
                        <td>{w.customerPhone}</td>
                        <td>{w.productName}</td>
                        <td className="text-xs text-muted">{new Date(w.purchaseDate).toLocaleDateString('en-IN')}</td>
                        <td className="text-xs font-bold" style={{ color: new Date(w.warrantyExpiry) < new Date() ? '#FF6B6B' : '#4ECCA3' }}>
                          {new Date(w.warrantyExpiry).toLocaleDateString('en-IN')}
                        </td>
                        <td>
                          <span className={`status-badge ${w.status?.toLowerCase()}`}>
                            {w.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                    {warrantyRecords.length === 0 && (
                      <tr>
                        <td colSpan={7} className="text-center py-6 text-muted">No warranty serial numbers registered yet. Click &quot;Register Warranty Certificate&quot; to issue one.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {/* Active RMA / Service Requests Table */}
              <h4 style={{ color: '#fff', margin: '28px 0 10px 0' }}>RMA Service & Repair Tickets ({serviceTickets.length})</h4>
              <div className="table-responsive">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Ticket #</th>
                      <th>Client</th>
                      <th>Phone</th>
                      <th>Model / Serial</th>
                      <th>Issue Description</th>
                      <th>Status</th>
                      <th>Update Stage</th>
                    </tr>
                  </thead>
                  <tbody>
                    {serviceTickets.map(ticket => (
                      <tr key={ticket.id}>
                        <td className="font-mono text-gold font-bold">{ticket.ticketNumber}</td>
                        <td><strong>{ticket.customerName}</strong></td>
                        <td>{ticket.customerPhone}</td>
                        <td>
                          <div>{ticket.productName}</div>
                          <span className="text-xs text-muted font-mono">{ticket.serialNumber || 'No Serial'}</span>
                        </td>
                        <td style={{ maxWidth: '300px' }} className="text-xs">{ticket.issueDescription}</td>
                        <td>
                          <span className={`status-badge ${ticket.status?.toLowerCase()}`}>
                            {ticket.status}
                          </span>
                        </td>
                        <td>
                          <select
                            value={ticket.status}
                            onChange={async e => {
                              const newSt = e.target.value;
                              await adminService.updateServiceTicketStatus(ticket.id, newSt);
                              setServiceTickets(prev => prev.map(t => t.id === ticket.id ? { ...t, status: newSt } : t));
                              setActionSuccessMsg(`RMA ${ticket.ticketNumber} marked as ${newSt}`);
                            }}
                            style={{ padding: '4px', background: '#141721', color: '#fff', border: '1px solid #333', borderRadius: '4px', fontSize: '11px' }}
                          >
                            <option value="OPEN">OPEN</option>
                            <option value="UNDER_REVIEW">UNDER_REVIEW</option>
                            <option value="AWAITING_CUSTOMER">AWAITING_CUSTOMER</option>
                            <option value="IN_PROGRESS">IN_PROGRESS</option>
                            <option value="RESOLVED">RESOLVED</option>
                            <option value="REJECTED">REJECTED</option>
                          </select>
                        </td>
                      </tr>
                    ))}
                    {serviceTickets.length === 0 && (
                      <tr>
                        <td colSpan={7} className="text-center py-6 text-muted">No open RMA tickets recorded.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* REGISTER WARRANTY MODAL */}
        {isRegisterWarrantyOpen && (
          <div className="admin-modal-overlay" onClick={() => setIsRegisterWarrantyOpen(false)}>
            <div className="admin-modal-card" onClick={e => e.stopPropagation()}>
              <div className="modal-head">
                <h3>Register Customer Warranty Certificate</h3>
                <button type="button" className="modal-close" onClick={() => setIsRegisterWarrantyOpen(false)}>✕</button>
              </div>

              <form onSubmit={async e => {
                e.preventDefault();
                try {
                  await adminService.createWarranty(warrantyForm);
                  setIsRegisterWarrantyOpen(false);
                  setActionSuccessMsg(`Warranty registered for ${warrantyForm.customerName}`);
                  adminService.getWarranties().then(setWarrantyRecords);
                } catch (err: any) { alert(err.message); }
              }}>
                <div className="modal-form-row">
                  <div className="modal-form-group">
                    <label>Customer Name:</label>
                    <input
                      type="text"
                      required
                      value={warrantyForm.customerName}
                      onChange={ev => setWarrantyForm({ ...warrantyForm, customerName: ev.target.value })}
                    />
                  </div>
                  <div className="modal-form-group">
                    <label>Customer Phone:</label>
                    <input
                      type="text"
                      required
                      value={warrantyForm.customerPhone}
                      onChange={ev => setWarrantyForm({ ...warrantyForm, customerPhone: ev.target.value })}
                    />
                  </div>
                </div>

                <div className="modal-form-row">
                  <div className="modal-form-group">
                    <label>Projector Model Name:</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Hunting Horizon Pro 4K"
                      value={warrantyForm.productName}
                      onChange={ev => setWarrantyForm({ ...warrantyForm, productName: ev.target.value })}
                    />
                  </div>
                  <div className="modal-form-group">
                    <label>Product Serial Number:</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. SN-HPT-849204"
                      value={warrantyForm.serialNumber}
                      onChange={ev => setWarrantyForm({ ...warrantyForm, serialNumber: ev.target.value })}
                    />
                  </div>
                </div>

                <div className="modal-form-group">
                  <label>Warranty Duration (Months):</label>
                  <select
                    value={warrantyForm.warrantyMonths}
                    onChange={ev => setWarrantyForm({ ...warrantyForm, warrantyMonths: Number(ev.target.value) })}
                  >
                    <option value={12}>12 Months (1 Year Standard)</option>
                    <option value={24}>24 Months (2 Years Official Brand Warranty)</option>
                    <option value={36}>36 Months (3 Years Laser TV Premium)</option>
                  </select>
                </div>

                <div className="modal-actions">
                  <button type="button" className="btn-secondary" onClick={() => setIsRegisterWarrantyOpen(false)}>Cancel</button>
                  <button type="submit" className="btn-primary">Register Certificate</button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* CREATE RMA TICKET MODAL */}
        {isCreateRmaOpen && (
          <div className="admin-modal-overlay" onClick={() => setIsCreateRmaOpen(false)}>
            <div className="admin-modal-card" onClick={e => e.stopPropagation()}>
              <div className="modal-head">
                <h3>Open RMA Service Ticket</h3>
                <button type="button" className="modal-close" onClick={() => setIsCreateRmaOpen(false)}>✕</button>
              </div>

              <form onSubmit={async e => {
                e.preventDefault();
                try {
                  await adminService.createServiceTicket(rmaForm);
                  setIsCreateRmaOpen(false);
                  setActionSuccessMsg(`RMA ticket initiated for ${rmaForm.customerName}`);
                  adminService.getServiceTickets().then(setServiceTickets);
                } catch (err: any) { alert(err.message); }
              }}>
                <div className="modal-form-row">
                  <div className="modal-form-group">
                    <label>Customer Name:</label>
                    <input
                      type="text"
                      required
                      value={rmaForm.customerName}
                      onChange={ev => setRmaForm({ ...rmaForm, customerName: ev.target.value })}
                    />
                  </div>
                  <div className="modal-form-group">
                    <label>Customer Phone:</label>
                    <input
                      type="text"
                      required
                      value={rmaForm.customerPhone}
                      onChange={ev => setRmaForm({ ...rmaForm, customerPhone: ev.target.value })}
                    />
                  </div>
                </div>

                <div className="modal-form-row">
                  <div className="modal-form-group">
                    <label>Product Model:</label>
                    <input
                      type="text"
                      required
                      value={rmaForm.productName}
                      onChange={ev => setRmaForm({ ...rmaForm, productName: ev.target.value })}
                    />
                  </div>
                  <div className="modal-form-group">
                    <label>Product Serial Number (if known):</label>
                    <input
                      type="text"
                      value={rmaForm.serialNumber}
                      onChange={ev => setRmaForm({ ...rmaForm, serialNumber: ev.target.value })}
                    />
                  </div>
                </div>

                <div className="modal-form-group">
                  <label>Issue Description:</label>
                  <textarea
                    rows={3}
                    required
                    placeholder="Describe issue (e.g. optical engine dust particle, firmware HDMI handshake error...)"
                    value={rmaForm.issueDescription}
                    onChange={ev => setRmaForm({ ...rmaForm, issueDescription: ev.target.value })}
                  />
                </div>

                <div className="modal-actions">
                  <button type="button" className="btn-secondary" onClick={() => setIsCreateRmaOpen(false)}>Cancel</button>
                  <button type="submit" className="btn-primary">Generate RMA Ticket</button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* TAB CONTENT: QUOTATIONS SECTION */}
        {activeTab === 'quotations' && (
          <div className="admin-content-view">
            <div className="admin-panel-card">
              <div className="panel-card-head flex-between">
                <div>
                  <h3 className="panel-card-title">Commercial Quotation Management</h3>
                  <p className="text-muted text-sm">Draft commercial proposals, send WhatsApp / PDF estimates, and convert accepted quotes to orders (unpaid pending).</p>
                </div>
                <button
                  type="button"
                  className="btn-primary"
                  onClick={() => setIsCreateQuoteOpen(true)}
                >
                  <Plus size={16} />
                  <span>Draft New Quotation</span>
                </button>
              </div>

              <div className="table-responsive">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Quote #</th>
                      <th>Customer Name</th>
                      <th>Phone</th>
                      <th>Valid Until</th>
                      <th>Total Amount</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {quotationsList.map(q => (
                      <tr key={q.id}>
                        <td className="font-mono text-gold font-bold">{q.quotationNumber}</td>
                        <td><strong>{q.customerName}</strong> {q.companyName ? `(${q.companyName})` : ''}</td>
                        <td>{q.customerPhone}</td>
                        <td className="text-xs text-muted">{new Date(q.validUntil).toLocaleDateString('en-IN')}</td>
                        <td className="font-mono font-bold">₹{Number(q.totalAmount).toLocaleString('en-IN')}</td>
                        <td>
                          <span className={`status-badge ${q.status?.toLowerCase()}`}>
                            {q.status}
                          </span>
                        </td>
                        <td>
                          <div style={{ display: 'flex', gap: '6px' }}>
                            <button
                              type="button"
                              className="table-action-btn"
                              onClick={() => setViewingQuote(q)}
                            >
                              Preview
                            </button>
                            {q.status !== 'CONVERTED' ? (
                              <button
                                type="button"
                                className="table-action-btn"
                                style={{ background: '#1c3d2e', color: '#4ECCA3' }}
                                onClick={async () => {
                                  if (confirm(`Convert quotation ${q.quotationNumber} to an official order? Note: payment will remain PENDING.`)) {
                                    try {
                                      await adminService.convertQuotationToOrder(q.id);
                                      setActionSuccessMsg(`Quotation converted to Order (Payment PENDING)`);
                                      adminService.getQuotations().then(setQuotationsList);
                                      loadDashboardData();
                                    } catch (err: any) { alert(err.message); }
                                  }
                                }}
                              >
                                Convert to Order
                              </button>
                            ) : (
                              <span className="text-xs text-muted">Converted</span>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                    {quotationsList.length === 0 && (
                      <tr>
                        <td colSpan={7} className="text-center py-6 text-muted">No commercial quotations drafted yet.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* QUOTATION PREVIEW & PRINT MODAL */}
        {viewingQuote && (
          <div className="admin-modal-overlay" onClick={() => setViewingQuote(null)}>
            <div className="admin-modal-card" style={{ maxWidth: '800px', background: '#FFFFFF', color: '#111827' }} onClick={e => e.stopPropagation()}>
              <div className="modal-head" style={{ borderBottom: '2px solid #E5E7EB', paddingBottom: '16px' }}>
                <div>
                  <h3 style={{ color: '#111827', margin: 0, fontSize: '20px' }}>COMMERCIAL PROPOSAL / QUOTATION</h3>
                  <span style={{ fontSize: '12px', color: '#6B7280' }}>
                    Quote #{viewingQuote.quotationNumber} • Valid Until: {new Date(viewingQuote.validUntil).toLocaleDateString('en-IN')}
                  </span>
                </div>
                <button type="button" className="modal-close" style={{ color: '#111827' }} onClick={() => setViewingQuote(null)}>✕</button>
              </div>

              <div className="modal-body" style={{ maxHeight: '70vh', overflowY: 'auto', padding: '20px 0', fontSize: '13px', lineHeight: 1.6 }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginBottom: '24px' }}>
                  <div style={{ background: '#F9FAFB', padding: '16px', borderRadius: '6px', border: '1px solid #E5E7EB' }}>
                    <h4 style={{ margin: '0 0 6px 0', color: '#111827', fontSize: '14px' }}>Prepared By:</h4>
                    <strong>Hunting Projector</strong><br />
                    Nap Computers Electronicss<br />
                    Mount Road, Chennai, Tamil Nadu - 600002<br />
                    huntingprojectors@gmail.com | +91 88256 24537
                  </div>

                  <div style={{ background: '#F9FAFB', padding: '16px', borderRadius: '6px', border: '1px solid #E5E7EB' }}>
                    <h4 style={{ margin: '0 0 6px 0', color: '#111827', fontSize: '14px' }}>Proposal For:</h4>
                    <strong>{viewingQuote.customerName}</strong><br />
                    {viewingQuote.companyName && <>{viewingQuote.companyName}<br /></>}
                    {viewingQuote.customerPhone} | {viewingQuote.customerEmail || 'No email provided'}<br />
                    {viewingQuote.city}, {viewingQuote.state}
                  </div>
                </div>

                <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '20px', border: '1px solid #E5E7EB' }}>
                  <thead>
                    <tr style={{ background: '#F3F4F6', textAlign: 'left', borderBottom: '2px solid #E5E7EB' }}>
                      <th style={{ padding: '8px 12px' }}>Product Description</th>
                      <th style={{ padding: '8px 12px' }}>Qty</th>
                      <th style={{ padding: '8px 12px', textAlign: 'right' }}>Unit Price</th>
                      <th style={{ padding: '8px 12px', textAlign: 'right' }}>Subtotal</th>
                    </tr>
                  </thead>
                  <tbody>
                    {viewingQuote.items?.map((it: any, idx: number) => (
                      <tr key={idx} style={{ borderBottom: '1px solid #E5E7EB' }}>
                        <td style={{ padding: '8px 12px' }}>
                          <strong>{it.productName}</strong>
                          {it.sku && <div style={{ fontSize: '11px', color: '#6B7280' }}>SKU: {it.sku}</div>}
                        </td>
                        <td style={{ padding: '8px 12px' }}>{it.quantity}</td>
                        <td style={{ padding: '8px 12px', textAlign: 'right' }}>₹{Number(it.unitPrice).toLocaleString('en-IN')}</td>
                        <td style={{ padding: '8px 12px', textAlign: 'right', fontWeight: 600 }}>₹{Number(it.total).toLocaleString('en-IN')}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                  <div style={{ width: '300px', lineHeight: 1.8 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span>Subtotal:</span>
                      <span>₹{Number(viewingQuote.subtotal).toLocaleString('en-IN')}</span>
                    </div>
                    {Number(viewingQuote.discountAmount) > 0 && (
                      <div style={{ display: 'flex', justifyContent: 'space-between', color: '#16a34a' }}>
                        <span>Negotiated Discount:</span>
                        <span>-₹{Number(viewingQuote.discountAmount).toLocaleString('en-IN')}</span>
                      </div>
                    )}
                    <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '2px solid #111827', paddingTop: '6px', fontWeight: 'bold', fontSize: '15px' }}>
                      <span>Total Net Payable:</span>
                      <span>₹{Number(viewingQuote.totalAmount).toLocaleString('en-IN')}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="modal-actions" style={{ borderTop: '1px solid #E5E7EB', paddingTop: '16px' }}>
                <button type="button" className="btn-secondary" onClick={() => setViewingQuote(null)}>Close</button>
                <a
                  href={`https://wa.me/${(viewingQuote.customerPhone || '').replace(/[^0-9]/g, '')}?text=Hello%20${encodeURIComponent(viewingQuote.customerName)},%20here%20is%20your%20Hunting%20Projectors%20quotation%20${viewingQuote.quotationNumber}%20for%20₹${Number(viewingQuote.totalAmount).toLocaleString('en-IN')}.`}
                  target="_blank"
                  rel="noreferrer"
                  className="table-action-btn"
                  style={{ background: '#25D366', color: '#000', fontWeight: 'bold' }}
                >
                  Share via WhatsApp
                </a>
                <button
                  type="button"
                  className="btn-primary"
                  onClick={() => window.print()}
                >
                  <Printer size={15} />
                  <span>Print Quotation</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* CREATE QUOTATION DRAFT MODAL */}
        {isCreateQuoteOpen && (
          <div className="admin-modal-overlay" onClick={() => setIsCreateQuoteOpen(false)}>
            <div className="admin-modal-card" style={{ maxWidth: '750px' }} onClick={e => e.stopPropagation()}>
              <div className="modal-head">
                <h3>Draft Commercial Quotation</h3>
                <button type="button" className="modal-close" onClick={() => setIsCreateQuoteOpen(false)}>✕</button>
              </div>

              <form onSubmit={async e => {
                e.preventDefault();
                try {
                  await adminService.createQuotation(quoteForm);
                  setIsCreateQuoteOpen(false);
                  setActionSuccessMsg('Quotation drafted successfully!');
                  adminService.getQuotations().then(setQuotationsList);
                } catch (err: any) { alert(err.message); }
              }}>
                <div className="modal-form-row">
                  <div className="modal-form-group">
                    <label>Customer Name:</label>
                    <input
                      type="text"
                      required
                      value={quoteForm.customerName}
                      onChange={ev => setQuoteForm({ ...quoteForm, customerName: ev.target.value })}
                    />
                  </div>
                  <div className="modal-form-group">
                    <label>Customer Phone:</label>
                    <input
                      type="text"
                      required
                      value={quoteForm.customerPhone}
                      onChange={ev => setQuoteForm({ ...quoteForm, customerPhone: ev.target.value })}
                    />
                  </div>
                </div>

                <div className="modal-form-row">
                  <div className="modal-form-group">
                    <label>Customer Email:</label>
                    <input
                      type="email"
                      value={quoteForm.customerEmail}
                      onChange={ev => setQuoteForm({ ...quoteForm, customerEmail: ev.target.value })}
                    />
                  </div>
                  <div className="modal-form-group">
                    <label>Company / Organization (Optional):</label>
                    <input
                      type="text"
                      value={quoteForm.companyName}
                      onChange={ev => setQuoteForm({ ...quoteForm, companyName: ev.target.value })}
                    />
                  </div>
                </div>

                <h4 style={{ color: '#fff', margin: '16px 0 8px 0' }}>Quotation Line Items</h4>
                {quoteForm.items.map((item: any, i: number) => (
                  <div key={i} style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 40px', gap: '8px', marginBottom: '8px' }}>
                    <input
                      type="text"
                      required
                      placeholder="Projector Model Description"
                      value={item.productName}
                      onChange={ev => {
                        const items = [...quoteForm.items];
                        items[i].productName = ev.target.value;
                        setQuoteForm({ ...quoteForm, items });
                      }}
                    />
                    <input
                      type="number"
                      required
                      placeholder="Quantity"
                      value={item.quantity}
                      onChange={ev => {
                        const items = [...quoteForm.items];
                        items[i].quantity = Number(ev.target.value);
                        setQuoteForm({ ...quoteForm, items });
                      }}
                    />
                    <input
                      type="number"
                      required
                      placeholder="Unit Price ₹"
                      value={item.unitPrice}
                      onChange={ev => {
                        const items = [...quoteForm.items];
                        items[i].unitPrice = Number(ev.target.value);
                        setQuoteForm({ ...quoteForm, items });
                      }}
                    />
                    <button
                      type="button"
                      className="table-action-btn"
                      style={{ color: '#FF6B6B' }}
                      onClick={() => {
                        if (quoteForm.items.length > 1) {
                          setQuoteForm({ ...quoteForm, items: quoteForm.items.filter((_: any, idx: number) => idx !== i) });
                        }
                      }}
                    >
                      ✕
                    </button>
                  </div>
                ))}

                <button
                  type="button"
                  className="table-action-btn"
                  style={{ marginBottom: '16px' }}
                  onClick={() => setQuoteForm({
                    ...quoteForm,
                    items: [...quoteForm.items, { productId: '', productName: '', sku: '', quantity: 1, unitPrice: 0 }]
                  })}
                >
                  + Add Line Item
                </button>

                <div className="modal-form-row">
                  <div className="modal-form-group">
                    <label>Discount Amount (₹):</label>
                    <input
                      type="number"
                      value={quoteForm.discountAmount}
                      onChange={ev => setQuoteForm({ ...quoteForm, discountAmount: Number(ev.target.value) })}
                    />
                  </div>
                  <div className="modal-form-group">
                    <label>Validity (Days):</label>
                    <input
                      type="number"
                      value={quoteForm.validDays}
                      onChange={ev => setQuoteForm({ ...quoteForm, validDays: Number(ev.target.value) })}
                    />
                  </div>
                </div>

                <div className="modal-actions">
                  <button type="button" className="btn-secondary" onClick={() => setIsCreateQuoteOpen(false)}>Cancel</button>
                  <button type="submit" className="btn-primary">Generate Quotation</button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* TAB CONTENT: 7. NOTIFICATIONS */}
        {activeTab === 'notifications' && (
          <div className="admin-content-view">
            <div className="admin-panel-card">
              <div className="panel-card-head flex-between">
                <div>
                  <h3 className="panel-card-title">VIP Demo & Showroom Booking Calendar</h3>
                  <p className="text-muted text-sm">Organized view of customer demonstration sessions, schedule slots, and follow-ups.</p>
                </div>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button
                    type="button"
                    className={`btn-secondary ${calendarFilter === 'all' ? 'active' : ''}`}
                    onClick={() => setCalendarFilter('all')}
                  >
                    All Bookings ({enquiries.length})
                  </button>
                  <button
                    type="button"
                    className={`btn-secondary ${calendarFilter === 'upcoming' ? 'active' : ''}`}
                    onClick={() => setCalendarFilter('upcoming')}
                  >
                    Scheduled / New ({enquiries.filter(e => e.status === 'NEW' || e.status === 'DEMO_SCHEDULED').length})
                  </button>
                </div>
              </div>

              <div className="table-responsive">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Booking Ref</th>
                      <th>Client Name</th>
                      <th>Phone / WhatsApp</th>
                      <th>Preferred Channel</th>
                      <th>Model of Interest</th>
                      <th>Location</th>
                      <th>Current Stage</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {enquiries
                      .filter(e => {
                        if (calendarFilter === 'upcoming') return e.status === 'NEW' || e.status === 'DEMO_SCHEDULED';
                        return true;
                      })
                      .map(demo => (
                        <tr key={demo.id}>
                          <td className="font-mono text-gold font-bold">{demo.referenceId}</td>
                          <td><strong>{demo.fullName}</strong></td>
                          <td>
                            <div>{demo.phoneNumber}</div>
                            {demo.email && <div className="text-xs text-muted">{demo.email}</div>}
                          </td>
                          <td>
                            <span className="type-tag">{demo.preferredContact || 'whatsapp'}</span>
                          </td>
                          <td>
                            <strong>{demo.product?.name || demo.productName || 'Ultra Short Throw Demo'}</strong>
                          </td>
                          <td>{demo.city}</td>
                          <td>
                            <span className={`status-badge ${demo.status?.toLowerCase()}`}>
                              {demo.status}
                            </span>
                          </td>
                          <td>
                            <div style={{ display: 'flex', gap: '6px' }}>
                              <a
                                href={`https://wa.me/${(demo.phoneNumber || '').replace(/[^0-9]/g, '')}?text=Hello%20${encodeURIComponent(demo.fullName)},%20confirming%20your%20Hunting%20Projectors%20demo.`}
                                target="_blank"
                                rel="noreferrer"
                                className="table-action-btn"
                                style={{ background: '#25D366', color: '#000', fontWeight: 'bold' }}
                              >
                                WhatsApp
                              </a>
                              <select
                                value={demo.status}
                                onChange={e => handleUpdateEnquiryStatus(demo.id, e.target.value)}
                                style={{ padding: '4px', background: '#1c1f2b', color: '#fff', border: '1px solid #333', borderRadius: '4px', fontSize: '11px' }}
                              >
                                <option value="NEW">NEW</option>
                                <option value="CONTACTED">CONTACTED</option>
                                <option value="DEMO_SCHEDULED">DEMO_SCHEDULED</option>
                                <option value="CONVERTED">CONVERTED</option>
                                <option value="CLOSED">CLOSED</option>
                              </select>
                            </div>
                          </td>
                        </tr>
                      ))}
                    {enquiries.length === 0 && (
                      <tr>
                        <td colSpan={8} style={{ textAlign: 'center', padding: '32px', color: '#8E95A5' }}>
                          No demo bookings recorded yet.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB CONTENT: REPORTS & EXPORTS */}
        {activeTab === 'reports' && (
          <div className="admin-content-view">
            <div className="admin-panel-card">
              <div className="panel-card-head flex-between">
                <div>
                  <h3 className="panel-card-title">Business Analytics & Data Exports</h3>
                  <p className="text-muted text-sm">Download safe sanitized CSV extracts and review operational performance metrics.</p>
                </div>
              </div>

              {/* Export Buttons Grid */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '16px', margin: '20px 0' }}>
                <div style={{ background: '#141721', padding: '16px', borderRadius: '8px', border: '1px solid #252936' }}>
                  <h4 style={{ color: '#fff', marginBottom: '8px' }}>📦 Orders Export</h4>
                  <p className="text-xs text-muted" style={{ marginBottom: '12px' }}>Complete order history with customer contact, GSTIN, amount, and payment status.</p>
                  <button
                    type="button"
                    className="btn-primary"
                    style={{ width: '100%', justifyContent: 'center' }}
                    onClick={() => {
                      const headers = ['Order Number', 'Date', 'Customer Name', 'Phone', 'Email', 'City', 'State', 'Amount', 'Status', 'Payment Status'];
                      const rows = orders.map(o => [
                        `'${o.orderNumber}`,
                        new Date(o.createdAt).toLocaleDateString('en-IN'),
                        `"${(o.customerName || '').replace(/"/g, '""')}"`,
                        `'${o.customerPhone || ''}`,
                        `"${(o.customerEmail || '').replace(/"/g, '""')}"`,
                        `"${(o.city || '').replace(/"/g, '""')}"`,
                        `"${(o.state || '').replace(/"/g, '""')}"`,
                        o.totalAmount,
                        o.orderStatus,
                        o.paymentStatus
                      ]);
                      const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
                      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
                      const url = URL.createObjectURL(blob);
                      const a = document.createElement('a');
                      a.href = url;
                      a.download = `napcomputers_orders_${new Date().toISOString().slice(0, 10)}.csv`;
                      a.click();
                    }}
                  >
                    <Download size={15} />
                    <span>Download Orders CSV</span>
                  </button>
                </div>

                <div style={{ background: '#141721', padding: '16px', borderRadius: '8px', border: '1px solid #252936' }}>
                  <h4 style={{ color: '#fff', marginBottom: '8px' }}>📽️ Products Catalog Export</h4>
                  <p className="text-xs text-muted" style={{ marginBottom: '12px' }}>Inventory stock levels, retail pricing, MRP, SKU codes, and activation status.</p>
                  <button
                    type="button"
                    className="btn-primary"
                    style={{ width: '100%', justifyContent: 'center' }}
                    onClick={() => {
                      const headers = ['SKU', 'Product Name', 'Category', 'Price', 'MRP', 'Stock Units', 'Active', 'Rating'];
                      const rows = productsList.map(p => [
                        `'${p.sku || ''}`,
                        `"${(p.name || '').replace(/"/g, '""')}"`,
                        p.category,
                        p.price,
                        p.mrp || p.compareAtPrice || p.price,
                        p.stock,
                        p.isActive ? 'YES' : 'NO',
                        p.rating || 5
                      ]);
                      const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
                      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
                      const url = URL.createObjectURL(blob);
                      const a = document.createElement('a');
                      a.href = url;
                      a.download = `napcomputers_products_${new Date().toISOString().slice(0, 10)}.csv`;
                      a.click();
                    }}
                  >
                    <Download size={15} />
                    <span>Download Catalog CSV</span>
                  </button>
                </div>

                <div style={{ background: '#141721', padding: '16px', borderRadius: '8px', border: '1px solid #252936' }}>
                  <h4 style={{ color: '#fff', marginBottom: '8px' }}>💬 Enquiries & Leads Export</h4>
                  <p className="text-xs text-muted" style={{ marginBottom: '12px' }}>VIP showroom leads, demonstration queries, cities, and current conversion stage.</p>
                  <button
                    type="button"
                    className="btn-primary"
                    style={{ width: '100%', justifyContent: 'center' }}
                    onClick={() => {
                      const headers = ['Reference ID', 'Date', 'Full Name', 'Phone', 'Email', 'City', 'Product', 'Status'];
                      const rows = enquiries.map(e => [
                        `'${e.referenceId}`,
                        new Date(e.createdAt).toLocaleDateString('en-IN'),
                        `"${(e.fullName || '').replace(/"/g, '""')}"`,
                        `'${e.phoneNumber || ''}`,
                        `"${(e.email || '').replace(/"/g, '""')}"`,
                        `"${(e.city || '').replace(/"/g, '""')}"`,
                        `"${(e.product?.name || e.productName || '').replace(/"/g, '""')}"`,
                        e.status
                      ]);
                      const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
                      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
                      const url = URL.createObjectURL(blob);
                      const a = document.createElement('a');
                      a.href = url;
                      a.download = `napcomputers_enquiries_${new Date().toISOString().slice(0, 10)}.csv`;
                      a.click();
                    }}
                  >
                    <Download size={15} />
                    <span>Download Enquiries CSV</span>
                  </button>
                </div>

                <div style={{ background: '#141721', padding: '16px', borderRadius: '8px', border: '1px solid #252936' }}>
                  <h4 style={{ color: '#fff', marginBottom: '8px' }}>👥 Verified Customers Export</h4>
                  <p className="text-xs text-muted" style={{ marginBottom: '12px' }}>Customer phone numbers, emails, order count, and lifetime value spend.</p>
                  <button
                    type="button"
                    className="btn-primary"
                    style={{ width: '100%', justifyContent: 'center' }}
                    onClick={() => {
                      const headers = ['Name', 'Email', 'Phone', 'Total Orders', 'Total Spent INR', 'Registered Date'];
                      const rows = customers.map(c => [
                        `"${(c.fullName || '').replace(/"/g, '""')}"`,
                        `"${(c.email || '').replace(/"/g, '""')}"`,
                        `'${c.phoneNumber || ''}`,
                        c.totalOrders ?? 0,
                        c.totalSpent ?? 0,
                        new Date(c.createdAt).toLocaleDateString('en-IN')
                      ]);
                      const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
                      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
                      const url = URL.createObjectURL(blob);
                      const a = document.createElement('a');
                      a.href = url;
                      a.download = `napcomputers_customers_${new Date().toISOString().slice(0, 10)}.csv`;
                      a.click();
                    }}
                  >
                    <Download size={15} />
                    <span>Download Customers CSV</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB CONTENT: WEBSITE CMS */}
        {activeTab === 'cms' && (
          <div className="admin-content-view">
            <div className="admin-panel-card">
              <div className="panel-card-head">
                <h3 className="panel-card-title">Homepage & Storefront CMS</h3>
                <p className="text-muted text-sm">Update customer-facing announcements, hero headlines, and store notices without code deployment.</p>
              </div>

              <div style={{ maxWidth: '700px', display: 'flex', flexDirection: 'column', gap: '20px', marginTop: '16px' }}>
                <div className="modal-form-group">
                  <label>Store Announcement Bar:</label>
                  <input
                    type="text"
                    value={cmsAnnouncement}
                    onChange={e => setCmsAnnouncement(e.target.value)}
                    placeholder="Notice bar text at the top of the storefront..."
                  />
                  <span className="text-xs text-muted">Displayed prominently to all site visitors.</span>
                </div>

                <div className="modal-form-group">
                  <label>Homepage Hero Main Headline:</label>
                  <input
                    type="text"
                    value={cmsHeadline}
                    onChange={e => setCmsHeadline(e.target.value)}
                    placeholder="e.g. Step Into The Future of Home Cinema"
                  />
                </div>

                <div className="modal-form-group">
                  <label>Homepage Hero Sub-Headline:</label>
                  <textarea
                    rows={3}
                    value={cmsSubheadline}
                    onChange={e => setCmsSubheadline(e.target.value)}
                    placeholder="Supporting value proposition..."
                  />
                </div>

                <button
                  type="button"
                  className="btn-primary"
                  style={{ alignSelf: 'flex-start' }}
                  onClick={async () => {
                    try {
                      await adminService.updateCmsContent('cms_hero', { headline: cmsHeadline, subheadline: cmsSubheadline });
                      await adminService.updateCmsContent('cms_announcement', { text: cmsAnnouncement });
                      setActionSuccessMsg('Storefront CMS content saved successfully!');
                    } catch (err: any) {
                      setError(err.message || 'Failed to update CMS');
                    }
                  }}
                >
                  Save Storefront CMS Settings
                </button>
              </div>
            </div>
          </div>
        )}

        {/* TAB CONTENT: WARRANTY & SERVICE */}
        {activeTab === 'warranty' && (
          <div className="admin-content-view">
            <div className="admin-panel-card">
              <div className="panel-card-head">
                <div>
                  <h3 className="panel-card-title">Official Brand Warranty & Service Coverage</h3>
                  <p className="text-muted text-sm">Standard 2-3 Year NAP Computers warranty policies and customer support SLAs.</p>
                </div>
              </div>

              <div className="table-responsive">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Product Model</th>
                      <th>SKU</th>
                      <th>Official Warranty Policy</th>
                      <th>Coverage Details</th>
                      <th>Service Center Support</th>
                    </tr>
                  </thead>
                  <tbody>
                    {productsList.map(prod => (
                      <tr key={prod.id}>
                        <td><strong>{prod.name}</strong></td>
                        <td className="font-mono text-gold">{prod.sku}</td>
                        <td>
                          <span className="type-tag" style={{ background: '#1c2438', color: '#68B0AB' }}>
                            {prod.warranty || '2 Years Official Brand Warranty'}
                          </span>
                        </td>
                        <td className="text-xs text-muted">
                          On-site installation support & Laser engine coverage
                        </td>
                        <td className="text-xs">
                          Chennai Hub • +91 88256 24537
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB CONTENT: AUDIT LOG */}
        {activeTab === 'audit' && (
          <div className="admin-content-view">
            <div className="admin-panel-card">
              <div className="panel-card-head flex-between">
                <div>
                  <h3 className="panel-card-title">Security & Operational Activity Audit Log</h3>
                  <p className="text-muted text-sm">Real-time audit trail of administrator actions, inventory adjustments, status updates, and CMS modifications.</p>
                </div>
                <button
                  type="button"
                  className="btn-secondary"
                  onClick={() => adminService.getAuditLogs().then(setAuditLogs)}
                >
                  <RefreshCw size={14} />
                  <span>Refresh Log</span>
                </button>
              </div>

              <div className="table-responsive">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Timestamp</th>
                      <th>Action</th>
                      <th>Target Entity</th>
                      <th>Admin User</th>
                      <th>Audit Details</th>
                    </tr>
                  </thead>
                  <tbody>
                    {auditLogs.map((log: any) => (
                      <tr key={log.id}>
                        <td className="text-xs text-muted font-mono">{new Date(log.createdAt).toLocaleString('en-IN')}</td>
                        <td><span className="type-tag">{log.action}</span></td>
                        <td><strong>{log.entity}</strong> {log.entityId ? `(#${log.entityId.slice(0, 8)})` : ''}</td>
                        <td>{log.adminEmail || 'admin@napcomputers.in'}</td>
                        <td className="text-xs font-mono text-muted">{JSON.stringify(log.details || {})}</td>
                      </tr>
                    ))}
                    {auditLogs.length === 0 && (
                      <tr>
                        <td colSpan={5} style={{ textAlign: 'center', padding: '32px', color: '#8E95A5' }}>
                          No audit log entries recorded in this session.
                        </td>
                      </tr>
                    )}
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

      {/* INVOICE PREVIEW & PRINT MODAL */}
      {viewingInvoice && (
        <div className="admin-modal-overlay" onClick={() => setViewingInvoice(null)}>
          <div className="admin-modal-card" style={{ maxWidth: '800px', background: '#FFFFFF', color: '#111827' }} onClick={e => e.stopPropagation()}>
            <div className="modal-head" style={{ borderBottom: '2px solid #E5E7EB', paddingBottom: '16px' }}>
              <div>
                <h3 style={{ color: '#111827', margin: 0, fontSize: '20px' }}>
                  {viewingInvoice.documentTitle || (viewingInvoice.store?.gstin ? 'TAX INVOICE' : 'COMMERCIAL ORDER RECEIPT')}
                </h3>
                <span style={{ fontSize: '12px', color: '#6B7280' }}>
                  Ref #{viewingInvoice.invoiceNumber} • Placed: {new Date(viewingInvoice.invoiceDate).toLocaleDateString('en-IN')}
                </span>
              </div>
              <button type="button" className="modal-close" style={{ color: '#111827' }} onClick={() => setViewingInvoice(null)}>✕</button>
            </div>

            <div className="modal-body" style={{ maxHeight: '70vh', overflowY: 'auto', padding: '20px 0', fontSize: '13px', lineHeight: 1.6 }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginBottom: '24px' }}>
                <div style={{ background: '#F9FAFB', padding: '16px', borderRadius: '6px', border: '1px solid #E5E7EB' }}>
                  <h4 style={{ margin: '0 0 6px 0', color: '#111827', fontSize: '14px' }}>Fulfillment Merchant:</h4>
                  <strong>{viewingInvoice.store?.name}</strong><br />
                  {viewingInvoice.store?.company}<br />
                  {viewingInvoice.store?.address}<br />
                  {viewingInvoice.store?.gstin ? (
                    <><strong>GSTIN:</strong> {viewingInvoice.store.gstin}<br /></>
                  ) : (
                    <span style={{ fontSize: '11px', color: '#888' }}>GSTIN: Unregistered / Retail Direct Fulfillment<br /></span>
                  )}
                  <strong>Email:</strong> {viewingInvoice.store?.email} | <strong>Phone:</strong> {viewingInvoice.store?.phone}
                </div>

                <div style={{ background: '#F9FAFB', padding: '16px', borderRadius: '6px', border: '1px solid #E5E7EB' }}>
                  <h4 style={{ margin: '0 0 6px 0', color: '#111827', fontSize: '14px' }}>Billed / Delivered To:</h4>
                  <strong>{viewingInvoice.customer?.name}</strong><br />
                  {viewingInvoice.customer?.phone} | {viewingInvoice.customer?.email}<br />
                  {viewingInvoice.customer?.address}<br />
                  {viewingInvoice.customer?.city}, {viewingInvoice.customer?.state} - {viewingInvoice.customer?.pincode}
                </div>
              </div>

              <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '20px', border: '1px solid #E5E7EB' }}>
                <thead>
                  <tr style={{ background: '#F3F4F6', textAlign: 'left', borderBottom: '2px solid #E5E7EB' }}>
                    <th style={{ padding: '8px 12px' }}>Description</th>
                    <th style={{ padding: '8px 12px' }}>SKU</th>
                    <th style={{ padding: '8px 12px' }}>Qty</th>
                    <th style={{ padding: '8px 12px', textAlign: 'right' }}>Unit Price</th>
                    <th style={{ padding: '8px 12px', textAlign: 'right' }}>Total (INR)</th>
                  </tr>
                </thead>
                <tbody>
                  {viewingInvoice.items?.map((item: any, idx: number) => (
                    <tr key={idx} style={{ borderBottom: '1px solid #E5E7EB' }}>
                      <td style={{ padding: '8px 12px' }}>
                        <strong>{item.productName}</strong>
                      </td>
                      <td style={{ padding: '8px 12px', fontFamily: 'monospace' }}>{item.sku || 'HP-UNIT'}</td>
                      <td style={{ padding: '8px 12px' }}>{item.quantity}</td>
                      <td style={{ padding: '8px 12px', textAlign: 'right' }}>₹{Number(item.unitPrice).toLocaleString('en-IN')}</td>
                      <td style={{ padding: '8px 12px', textAlign: 'right', fontWeight: 600 }}>₹{Number(item.total).toLocaleString('en-IN')}</td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                <div style={{ width: '320px', lineHeight: 1.8 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span>Order Subtotal:</span>
                    <span>₹{Number(viewingInvoice.pricing?.subtotal || viewingInvoice.pricing?.grandTotal).toLocaleString('en-IN')}</span>
                  </div>
                  {viewingInvoice.pricing?.taxAmount > 0 ? (
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span>GST Applicable:</span>
                      <span>₹{Number(viewingInvoice.pricing.taxAmount).toLocaleString('en-IN')}</span>
                    </div>
                  ) : (
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: '#666' }}>
                      <span>Applicable Tax:</span>
                      <span>₹0.00 (All-Inclusive Retail)</span>
                    </div>
                  )}
                  {viewingInvoice.pricing?.shippingAmount > 0 && (
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span>Doorstep Delivery:</span>
                      <span>₹{Number(viewingInvoice.pricing.shippingAmount).toLocaleString('en-IN')}</span>
                    </div>
                  )}
                  <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '2px solid #111827', paddingTop: '6px', fontWeight: 'bold', fontSize: '15px' }}>
                    <span>Total Payable:</span>
                    <span>₹{Number(viewingInvoice.pricing?.grandTotal).toLocaleString('en-IN')}</span>
                  </div>
                  <div style={{ fontSize: '11px', color: '#6B7280', marginTop: '6px', textAlign: 'right' }}>
                    Payment Status: <strong>{viewingInvoice.pricing?.paymentStatus}</strong>
                  </div>
                </div>
              </div>
            </div>

            <div className="modal-actions" style={{ borderTop: '1px solid #E5E7EB', paddingTop: '16px' }}>
              <button type="button" className="btn-secondary" onClick={() => setViewingInvoice(null)}>Close</button>
              <button
                type="button"
                className="btn-primary"
                onClick={() => window.print()}
              >
                <Printer size={15} />
                <span>Print Document</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* BULK CSV IMPORT MODAL */}
      {isBulkImportOpen && (
        <div className="admin-modal-overlay" onClick={() => setIsBulkImportOpen(false)}>
          <div className="admin-modal-card" style={{ maxWidth: '750px' }} onClick={e => e.stopPropagation()}>
            <div className="modal-head">
              <h3>Bulk Import Projector Catalog (CSV)</h3>
              <button type="button" className="modal-close" onClick={() => setIsBulkImportOpen(false)}>✕</button>
            </div>

            <div className="modal-body">
              <p className="text-muted text-sm">
                Paste raw CSV data or download our template. Columns required: <code>name,sku,price,stock,shortDescription,category</code>
              </p>

              <button
                type="button"
                className="table-action-btn"
                style={{ marginBottom: '12px' }}
                onClick={() => {
                  const sampleCsv = `name,sku,price,compareAtPrice,stock,category,shortDescription\n"Optoma CinemaX D2 Smart","OPT-D2-4K",249999,289999,10,"ultra-short-throw","4K UHD Ultra Short Throw Home Cinema Laser Projector"\n"BenQ V7050i Laser TV","BNQ-V7050",299999,349999,8,"ultra-short-throw","CinematicColor 4K HDR Laser TV Projector"`;
                  setBulkCsvText(sampleCsv);
                }}
              >
                Insert Sample Data Template
              </button>

              <div className="modal-form-group">
                <label>CSV Content:</label>
                <textarea
                  rows={8}
                  style={{ fontFamily: 'monospace', fontSize: '12px' }}
                  placeholder="name,sku,price,compareAtPrice,stock,category,shortDescription..."
                  value={bulkCsvText}
                  onChange={e => setBulkCsvText(e.target.value)}
                />
              </div>

              {bulkImportResults && (
                <div style={{ marginTop: '12px', padding: '12px', borderRadius: '6px', background: '#1c2438' }}>
                  <p style={{ color: '#4ECCA3', margin: 0, fontWeight: 'bold' }}>
                    Successfully imported {bulkImportResults.createdCount} products!
                  </p>
                  {bulkImportResults.errors.length > 0 && (
                    <div style={{ marginTop: '8px', color: '#FF6B6B', fontSize: '12px' }}>
                      <p>Errors encountered in {bulkImportResults.errors.length} rows:</p>
                      <ul>
                        {bulkImportResults.errors.map((err, i) => (
                          <li key={i}>Row {err.row}: {err.error}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}
            </div>

            <div className="modal-actions">
              <button type="button" className="btn-secondary" onClick={() => setIsBulkImportOpen(false)}>Close</button>
              <button
                type="button"
                className="btn-primary"
                onClick={async () => {
                  if (!bulkCsvText.trim()) return;
                  try {
                    const lines = bulkCsvText.trim().split('\n');
                    if (lines.length < 2) throw new Error('CSV must contain at least a header row and 1 product row.');
                    const headers = lines[0].split(',').map(h => h.trim().replace(/^"|"$/g, ''));
                    const productsToImport = [];

                    for (let i = 1; i < lines.length; i++) {
                      if (!lines[i].trim()) continue;
                      // Simple CSV line parser supporting quoted commas
                      const values = lines[i].match(/(".*?"|[^",\s]+)(?=\s*,|\s*$)/g) || lines[i].split(',');
                      const obj: Record<string, any> = {};
                      headers.forEach((h, idx) => {
                        obj[h] = values[idx] ? values[idx].replace(/^"|"$/g, '').trim() : '';
                      });
                      productsToImport.push(obj);
                    }

                    const res = await adminService.bulkImportProducts(productsToImport);
                    setBulkImportResults(res);
                    loadDashboardData();
                  } catch (err: any) {
                    alert('Import failed: ' + err.message);
                  }
                }}
              >
                Execute Bulk Import
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
