import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, X, ArrowRight } from 'lucide-react';
import { products } from '../../../data/products';
import { Product } from '../../../types/product';
import './SearchModal.css';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SearchModal: React.FC<SearchModalProps> = ({ isOpen, onClose }) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Product[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      setTimeout(() => inputRef.current?.focus(), 80);
    } else {
      document.body.style.overflow = '';
      setQuery('');
      setResults([]);
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  useEffect(() => {
    const trimmed = query.trim().toLowerCase();
    if (!trimmed) {
      setResults([]);
      return;
    }

    const filtered = products.filter(p => 
      p.name.toLowerCase().includes(trimmed) ||
      p.subtitle.toLowerCase().includes(trimmed) ||
      p.categoryLabel.toLowerCase().includes(trimmed) ||
      p.specifications.resolution.toLowerCase().includes(trimmed) ||
      p.specifications.brightness.toLowerCase().includes(trimmed) ||
      p.recommendedUse.some(u => u.toLowerCase().includes(trimmed))
    );

    setResults(filtered);
  }, [query]);

  if (!isOpen) return null;

  const handleSelectProduct = (slug: string) => {
    onClose();
    navigate(`/products/${slug}`);
  };

  const handleQuickTagClick = (tagQuery: string) => {
    setQuery(tagQuery);
  };

  return (
    <div className="search-modal-overlay" onClick={onClose} role="dialog" aria-modal="true">
      <div className="search-modal-container" onClick={e => e.stopPropagation()}>
        
        {/* Search Bar Input */}
        <div className="search-input-wrapper">
          <Search size={22} className="search-input-icon" />
          <input
            ref={inputRef}
            type="text"
            className="search-input-field"
            placeholder="Search 4K laser, ultra short throw, gaming 240Hz, or model name..."
            value={query}
            onChange={e => setQuery(e.target.value)}
            aria-label="Search projectors"
          />
          {query && (
            <button 
              type="button" 
              className="search-clear-btn" 
              onClick={() => setQuery('')}
              aria-label="Clear search"
            >
              <X size={18} />
            </button>
          )}
          <button 
            type="button" 
            className="search-close-btn" 
            onClick={onClose}
            aria-label="Close search dialog"
          >
            ESC
          </button>
        </div>

        {/* Quick Filter Tags */}
        <div className="search-quick-tags">
          <span className="quick-tags-label">POPULAR FILTERS:</span>
          {['4K Laser', 'Ultra Short Throw', '240Hz Gaming', 'Smart Portable', 'Living Room'].map(tag => (
            <button 
              key={tag} 
              type="button" 
              className="quick-tag-chip"
              onClick={() => handleQuickTagClick(tag)}
            >
              {tag}
            </button>
          ))}
        </div>

        {/* Results Area */}
        <div className="search-results-area">
          {query.trim() === '' ? (
            <div className="search-starter-state">
              <span className="starter-title">FEATURED HUNTING MODELS</span>
              <div className="starter-models-grid">
                {products.slice(0, 3).map(p => (
                  <div 
                    key={p.id} 
                    className="starter-model-card"
                    onClick={() => handleSelectProduct(p.slug)}
                  >
                    <div className="starter-model-img">
                      <img src={p.images.hero} alt={p.name} />
                    </div>
                    <div>
                      <span className="starter-cat">{p.categoryLabel}</span>
                      <h4 className="starter-name">{p.name}</h4>
                      <span className="starter-price">₹{p.price.toLocaleString('en-IN')}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : results.length === 0 ? (
            <div className="search-no-results">
              <h4>No Projectors Found for "{query}"</h4>
              <p>Try searching for "4K", "Laser", "Gaming", or check our complete product catalog.</p>
              <button 
                type="button" 
                className="btn-secondary"
                onClick={() => {
                  onClose();
                  navigate('/products');
                }}
              >
                VIEW FULL CATALOG
              </button>
            </div>
          ) : (
            <div className="search-results-list">
              <div className="results-count-bar">
                FOUND {results.length} MATCHING {results.length === 1 ? 'PROJECTOR' : 'PROJECTORS'}
              </div>
              {results.map(item => (
                <div 
                  key={item.id} 
                  className="search-result-row"
                  onClick={() => handleSelectProduct(item.slug)}
                >
                  <div className="search-result-thumb">
                    <img src={item.images.hero} alt={item.name} />
                  </div>
                  <div className="search-result-info">
                    <div className="result-header">
                      <span className="result-category">{item.categoryLabel}</span>
                      {item.badge && <span className="result-badge">{item.badge}</span>}
                    </div>
                    <h4 className="result-title">{item.name}</h4>
                    <p className="result-desc">{item.shortDescription}</p>
                    <div className="result-specs-strip">
                      <span>{item.specifications.resolution}</span>
                      <span>•</span>
                      <span>{item.specifications.brightness}</span>
                      <span>•</span>
                      <span>{item.specifications.projectionSize}</span>
                    </div>
                  </div>
                  <div className="search-result-action">
                    <span className="result-price">₹{item.price.toLocaleString('en-IN')}</span>
                    <span className="result-view-cta">
                      <span>View</span>
                      <ArrowRight size={14} />
                    </span>
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
