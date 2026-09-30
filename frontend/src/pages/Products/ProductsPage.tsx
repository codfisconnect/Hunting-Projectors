import React, { useState, useEffect, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import { 
  SlidersHorizontal, 
  Search, 
  X, 
  ArrowUpDown, 
  Sparkles, 
  AlertCircle,
  RefreshCw
} from 'lucide-react';
import { getProducts, getCategories } from '../../services/productService';
import { Product, ProductPagination } from '../../types/product';
import { Category } from '../../types/category';
import { ProductCard } from '../../components/product/ProductCard/ProductCard';
import './ProductsPage.css';

interface ProductsPageProps {
  onOpenEnquiry: (productName?: string) => void;
}

export const ProductsPage: React.FC<ProductsPageProps> = ({ onOpenEnquiry }) => {
  const [searchParams, setSearchParams] = useSearchParams();
  
  // Data State
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [pagination, setPagination] = useState<ProductPagination>({ total: 0, limit: 20, offset: 0 });
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Filter state from query params or defaults
  const initialCategory = searchParams.get('category') || 'all';
  const initialSearch = searchParams.get('q') || '';
  const [selectedCategory, setSelectedCategory] = useState<string>(initialCategory);
  const [searchQuery, setSearchQuery] = useState<string>(initialSearch);
  const [debouncedSearch, setDebouncedSearch] = useState<string>(initialSearch);
  const [resolutionFilter, setResolutionFilter] = useState<string>('all');
  const [brightnessFilter, setBrightnessFilter] = useState<string>('all');
  const [maxPrice, setMaxPrice] = useState<number>(160000);
  const [sortBy, setSortBy] = useState<'featured' | 'price-asc' | 'price-desc' | 'rating'>('featured');
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  const debounceTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    document.title = 'EXPLORE PROJECTORS — Hunting 4K Laser & Cinema Lineup';
    window.scrollTo(0, 0);
  }, []);

  // Debounce search query input (300ms)
  useEffect(() => {
    if (debounceTimeout.current) {
      clearTimeout(debounceTimeout.current);
    }
    debounceTimeout.current = setTimeout(() => {
      setDebouncedSearch(searchQuery);
    }, 300);

    return () => {
      if (debounceTimeout.current) clearTimeout(debounceTimeout.current);
    };
  }, [searchQuery]);

  // Load Categories on Mount from PostgreSQL backend
  useEffect(() => {
    let isMounted = true;
    getCategories()
      .then(cats => {
        if (isMounted) setCategories(cats);
      })
      .catch(err => {
        console.warn('Failed to load categories from backend:', err);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  // Sync selectedCategory if URL parameter changes
  useEffect(() => {
    const cat = searchParams.get('category');
    if (cat && cat !== selectedCategory) {
      setSelectedCategory(cat);
    }
  }, [searchParams]);

  // Fetch Products from PostgreSQL backend whenever filters change
  const fetchCatalog = () => {
    setLoading(true);
    setError(null);

    const apiCategory = selectedCategory !== 'all' ? selectedCategory : undefined;
    const apiQ = debouncedSearch.trim().length > 0 ? debouncedSearch.trim() : undefined;
    const apiMaxPrice = maxPrice < 160000 ? maxPrice : undefined;

    // Backend resolution filter mapping
    let apiResolution: string | undefined = undefined;
    if (resolutionFilter === '4k') {
      apiResolution = '4K';
    } else if (resolutionFilter === '1080p') {
      apiResolution = '1080p';
    }

    // Backend brightness/lumens mapping
    let apiBrightness: string | undefined = undefined;
    if (brightnessFilter === 'over-3000') {
      apiBrightness = '3,';
    } else if (brightnessFilter === 'under-1000') {
      apiBrightness = '800';
    }

    getProducts({
      category: apiCategory,
      searchQuery: apiQ,
      maxPrice: apiMaxPrice,
      resolution: apiResolution,
      brightness: apiBrightness,
      sortBy,
      limit: 50,
      offset: 0,
    })
      .then(result => {
        let list = result.products;

        // Client-side refinement for complex brightness range if needed
        if (brightnessFilter === '1000-3000') {
          list = list.filter(p => {
            const lumens = parseInt(p.specifications.brightness.replace(/\D/g, ''), 10) || 0;
            return lumens >= 1000 && lumens <= 3000;
          });
        }

        setProducts(list);
        setPagination({
          total: result.pagination.total,
          limit: result.pagination.limit,
          offset: result.pagination.offset,
        });
      })
      .catch(err => {
        console.error('Catalog fetch error:', err);
        setError(err instanceof Error ? err.message : 'Unable to connect to product catalog');
        setProducts([]);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchCatalog();
  }, [selectedCategory, debouncedSearch, resolutionFilter, brightnessFilter, maxPrice, sortBy]);

  const handleCategoryChange = (catSlug: string) => {
    setSelectedCategory(catSlug);
    if (catSlug === 'all') {
      searchParams.delete('category');
      setSearchParams(searchParams);
    } else {
      setSearchParams({ category: catSlug });
    }
  };

  const handleResetFilters = () => {
    setSelectedCategory('all');
    setSearchQuery('');
    setDebouncedSearch('');
    setResolutionFilter('all');
    setBrightnessFilter('all');
    setMaxPrice(160000);
    setSortBy('featured');
    setSearchParams({});
  };

  const totalCatalogCount = categories.reduce((sum, c) => sum + (c.count ?? c._count?.products ?? 0), 0);

  return (
    <div className="products-page">
      <div className="container-wide products-page-container">
        
        {/* Page Hero Header */}
        <header className="products-hero-header">
          <div className="products-hero-left">
            <span className="eyebrow">
              <Sparkles size={13} />
              DIRECT FROM HUNTING BRAND
            </span>
            <h1 className="display-title">EXPLORE PROJECTORS.</h1>
            <p className="products-hero-desc">
              From ultra-short-throw triple-laser systems to high-refresh 240Hz esports cinema, browse the complete Hunting catalog engineered for Indian homes.
            </p>
          </div>

          <div className="products-search-box">
            <Search size={18} className="search-bar-icon" />
            <input
              type="text"
              placeholder="Search by resolution, model, or use..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="products-search-input"
            />
            {searchQuery && (
              <button 
                type="button" 
                onClick={() => setSearchQuery('')}
                className="search-clear-cross"
                aria-label="Clear search query"
              >
                <X size={15} />
              </button>
            )}
          </div>
        </header>

        {/* Layout Grid: Sidebar Filters + Products Grid */}
        <div className="products-layout-grid">
          
          {/* Desktop Filter Sidebar */}
          <aside className={`products-filter-sidebar ${isMobileFilterOpen ? 'mobile-open' : ''}`}>
            <div className="sidebar-header">
              <div className="sidebar-title-group">
                <SlidersHorizontal size={16} />
                <span>FILTERS</span>
              </div>
              <button 
                type="button" 
                className="sidebar-reset-btn" 
                onClick={handleResetFilters}
              >
                Reset All
              </button>
              {isMobileFilterOpen && (
                <button 
                  type="button" 
                  className="sidebar-close-mobile"
                  onClick={() => setIsMobileFilterOpen(false)}
                >
                  <X size={20} />
                </button>
              )}
            </div>

            {/* Category Filter */}
            <div className="filter-group">
              <span className="filter-group-title">CATEGORIES</span>
              <div className="filter-options-list">
                <button
                  type="button"
                  className={`filter-chip ${selectedCategory === 'all' ? 'active' : ''}`}
                  onClick={() => handleCategoryChange('all')}
                >
                  <span>All Models</span>
                  <span className="chip-count">{totalCatalogCount || products.length}</span>
                </button>
                {categories.map(cat => (
                  <button
                    key={cat.id}
                    type="button"
                    className={`filter-chip ${selectedCategory === cat.slug ? 'active' : ''}`}
                    onClick={() => handleCategoryChange(cat.slug)}
                  >
                    <span>{cat.name}</span>
                    <span className="chip-count">
                      {cat.count ?? cat._count?.products ?? 0}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Price Range Slider */}
            <div className="filter-group">
              <div className="filter-group-split">
                <span className="filter-group-title">MAX BUDGET</span>
                <span className="filter-price-indicator">₹{maxPrice.toLocaleString('en-IN')}</span>
              </div>
              <input
                type="range"
                min={20000}
                max={160000}
                step={5000}
                value={maxPrice}
                onChange={e => setMaxPrice(Number(e.target.value))}
                className="price-slider-input"
              />
              <div className="slider-ticks-row">
                <span>₹20K</span>
                <span>₹80K</span>
                <span>₹1.6L</span>
              </div>
            </div>

            {/* Resolution Filter */}
            <div className="filter-group">
              <span className="filter-group-title">RESOLUTION</span>
              <div className="filter-options-list">
                {[
                  { label: 'All Resolutions', val: 'all' },
                  { label: 'True 4K UHD', val: '4k' },
                  { label: 'Native 1080p FHD', val: '1080p' },
                ].map(item => (
                  <button
                    key={item.val}
                    type="button"
                    className={`filter-chip ${resolutionFilter === item.val ? 'active' : ''}`}
                    onClick={() => setResolutionFilter(item.val)}
                  >
                    <span>{item.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Brightness Filter */}
            <div className="filter-group">
              <span className="filter-group-title">BRIGHTNESS (ANSI)</span>
              <div className="filter-options-list">
                {[
                  { label: 'All Luminance Levels', val: 'all' },
                  { label: 'Ultra High (3000+ ANSI)', val: 'over-3000' },
                  { label: 'Standard Cinema (1000–3000 ANSI)', val: '1000-3000' },
                  { label: 'Portable Soft (< 1000 ANSI)', val: 'under-1000' },
                ].map(item => (
                  <button
                    key={item.val}
                    type="button"
                    className={`filter-chip ${brightnessFilter === item.val ? 'active' : ''}`}
                    onClick={() => setBrightnessFilter(item.val)}
                  >
                    <span>{item.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* NAP Direct Warranty Badge */}
            <div className="sidebar-warranty-notice">
              <span className="notice-heading">NAP COMPUTERS DIRECT</span>
              <p>Direct supply from Chennai. Official brand warranty and pan-India insured dispatch on every model.</p>
            </div>
          </aside>

          {/* Main Product Grid Column */}
          <main className="products-main-column">
            
            {/* Top Toolbar */}
            <div className="products-toolbar">
              <div className="toolbar-left">
                <button
                  type="button"
                  className="mobile-filter-trigger-btn"
                  onClick={() => setIsMobileFilterOpen(true)}
                >
                  <SlidersHorizontal size={15} />
                  <span>FILTERS</span>
                </button>
                <span className="results-count">
                  {loading ? (
                    'SEARCHING CATALOG...'
                  ) : (
                    <>
                      SHOWING <strong>{products.length}</strong> {products.length === 1 ? 'PROJECTOR' : 'PROJECTORS'}
                    </>
                  )}
                </span>
              </div>

              {/* Sort Dropdown */}
              <div className="toolbar-sort-wrap">
                <ArrowUpDown size={15} className="sort-icon" />
                <label htmlFor="sortBy" className="sort-label">SORT:</label>
                <select
                  id="sortBy"
                  value={sortBy}
                  onChange={e => setSortBy(e.target.value as any)}
                  className="sort-select"
                >
                  <option value="featured">Featured Collection</option>
                  <option value="price-asc">Price: Low to High</option>
                  <option value="price-desc">Price: High to Low</option>
                  <option value="rating">Highest Customer Rating</option>
                </select>
              </div>
            </div>

            {/* Loading State */}
            {loading && (
              <div className="products-empty-state">
                <RefreshCw size={24} className="animate-spin text-accent" />
                <h4 style={{ marginTop: '16px' }}>Loading Projector Catalog</h4>
                <p>Retrieving latest models and specifications from Hunting database...</p>
              </div>
            )}

            {/* Error State */}
            {!loading && error && (
              <div className="products-empty-state">
                <AlertCircle size={28} color="#FF5A79" />
                <h4 style={{ marginTop: '12px' }}>Catalog Connection Error</h4>
                <p>{error}</p>
                <button 
                  type="button" 
                  className="btn-primary" 
                  onClick={fetchCatalog}
                >
                  TRY AGAIN
                </button>
              </div>
            )}

            {/* Empty State */}
            {!loading && !error && products.length === 0 && (
              <div className="products-empty-state">
                <h4>No Projectors Match Your Filter Criteria</h4>
                <p>Try expanding your budget slider or clearing the resolution filter.</p>
                <button 
                  type="button" 
                  className="btn-primary" 
                  onClick={handleResetFilters}
                >
                  RESET ALL FILTERS
                </button>
              </div>
            )}

            {/* Product Cards Grid */}
            {!loading && !error && products.length > 0 && (
              <div className="catalog-cards-grid">
                {products.map(product => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    featured={product.isFlagship}
                    onOpenEnquiry={onOpenEnquiry}
                  />
                ))}
              </div>
            )}

          </main>

        </div>

      </div>
    </div>
  );
};
