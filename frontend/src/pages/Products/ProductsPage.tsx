import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { 
  SlidersHorizontal, 
  Search, 
  X, 
  ArrowUpDown, 
  Sparkles, 
  Grid3X3, 
  LayoutGrid 
} from 'lucide-react';
import { products } from '../../data/products';
import { categories } from '../../data/categories';
import { ProductCard } from '../../components/product/ProductCard/ProductCard';
import './ProductsPage.css';

interface ProductsPageProps {
  onOpenEnquiry: (productName?: string) => void;
}

export const ProductsPage: React.FC<ProductsPageProps> = ({ onOpenEnquiry }) => {
  const [searchParams, setSearchParams] = useSearchParams();
  
  // Filter state
  const initialCategory = searchParams.get('category') || 'all';
  const [selectedCategory, setSelectedCategory] = useState<string>(initialCategory);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [resolutionFilter, setResolutionFilter] = useState<string>('all');
  const [brightnessFilter, setBrightnessFilter] = useState<string>('all');
  const [maxPrice, setMaxPrice] = useState<number>(160000);
  const [sortBy, setSortBy] = useState<'featured' | 'price-asc' | 'price-desc' | 'rating'>('featured');
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  useEffect(() => {
    document.title = 'EXPLORE PROJECTORS — Hunting 4K Laser & Cinema Lineup';
    window.scrollTo(0, 0);
  }, []);

  // Update selected category when query parameter changes
  useEffect(() => {
    const cat = searchParams.get('category');
    if (cat) {
      setSelectedCategory(cat);
    }
  }, [searchParams]);

  const handleCategoryChange = (catId: string) => {
    setSelectedCategory(catId);
    if (catId === 'all') {
      searchParams.delete('category');
      setSearchParams(searchParams);
    } else {
      setSearchParams({ category: catId });
    }
  };

  const handleResetFilters = () => {
    setSelectedCategory('all');
    setSearchQuery('');
    setResolutionFilter('all');
    setBrightnessFilter('all');
    setMaxPrice(160000);
    setSortBy('featured');
    setSearchParams({});
  };

  // Filtered & Sorted products computation
  const filteredProducts = useMemo(() => {
    return products.filter(p => {
      // Category filter
      if (selectedCategory !== 'all' && p.category !== selectedCategory) {
        return false;
      }

      // Search query filter
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matches = 
          p.name.toLowerCase().includes(q) ||
          p.subtitle.toLowerCase().includes(q) ||
          p.specifications.resolution.toLowerCase().includes(q) ||
          p.specifications.brightness.toLowerCase().includes(q) ||
          p.categoryLabel.toLowerCase().includes(q);
        if (!matches) return false;
      }

      // Resolution filter
      if (resolutionFilter !== 'all') {
        if (!p.specifications.resolution.toLowerCase().includes(resolutionFilter.toLowerCase())) {
          return false;
        }
      }

      // Brightness filter
      if (brightnessFilter !== 'all') {
        const lumens = parseInt(p.specifications.brightness.replace(/\D/g, ''), 10) || 0;
        if (brightnessFilter === 'under-1000' && lumens >= 1000) return false;
        if (brightnessFilter === '1000-3000' && (lumens < 1000 || lumens > 3000)) return false;
        if (brightnessFilter === 'over-3000' && lumens <= 3000) return false;
      }

      // Max price
      if (p.price > maxPrice) {
        return false;
      }

      return true;
    }).sort((a, b) => {
      if (sortBy === 'price-asc') return a.price - b.price;
      if (sortBy === 'price-desc') return b.price - a.price;
      if (sortBy === 'rating') return b.rating - a.rating;
      return (b.isFlagship ? 1 : 0) - (a.isFlagship ? 1 : 0);
    });
  }, [selectedCategory, searchQuery, resolutionFilter, brightnessFilter, maxPrice, sortBy]);

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
                  <span className="chip-count">{products.length}</span>
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
                      {products.filter(p => p.category === cat.slug).length}
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
                  SHOWING <strong>{filteredProducts.length}</strong> {filteredProducts.length === 1 ? 'PROJECTOR' : 'PROJECTORS'}
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

            {/* Product Cards Grid */}
            {filteredProducts.length === 0 ? (
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
            ) : (
              <div className="catalog-cards-grid">
                {filteredProducts.map(product => (
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
