import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Plus, 
  X, 
  Check, 
  ShoppingBag, 
  MessageSquare, 
  ArrowRight,
  Sparkles
} from 'lucide-react';
import { getProducts } from '../../services/productService';
import { Product } from '../../types/product';
import { useCart } from '../../context/CartContext';
import './ComparePage.css';

interface ComparePageProps {
  onOpenEnquiry: (productName?: string) => void;
}

export const ComparePage: React.FC<ComparePageProps> = ({ onOpenEnquiry }) => {
  const [productsList, setProductsList] = useState<Product[]>([]);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const { addToCart } = useCart();

  useEffect(() => {
    document.title = 'COMPARE PROJECTORS — Hunting 4K Optical Comparison';
    window.scrollTo(0, 0);

    let isMounted = true;
    getProducts()
      .then(res => {
        if (!isMounted) return;
        setProductsList(res.products);
        if (res.products.length > 0) {
          setSelectedIds(res.products.slice(0, 3).map(p => p.id));
        }
      })
      .catch(err => {
        console.warn('Failed to load products for comparison:', err);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const selectedProducts: Product[] = selectedIds
    .map(id => productsList.find(p => p.id === id))
    .filter((p): p is Product => p !== undefined);

  const handleRemove = (id: string) => {
    setSelectedIds(prev => prev.filter(item => item !== id));
  };

  const handleAdd = (id: string) => {
    if (selectedIds.length < 3 && !selectedIds.includes(id)) {
      setSelectedIds(prev => [...prev, id]);
    }
  };

  const handleSelectSlotChange = (index: number, newId: string) => {
    setSelectedIds(prev => {
      const copy = [...prev];
      copy[index] = newId;
      return copy;
    });
  };

  const availableToAdd = productsList.filter(p => !selectedIds.includes(p.id));

  // Comparison Rows
  const specRows = [
    { label: 'PRICE (DEMO)', getValue: (p: Product) => `₹${p.price.toLocaleString('en-IN')}` },
    { label: 'CATEGORY', getValue: (p: Product) => p.categoryLabel },
    { label: 'NATIVE RESOLUTION', getValue: (p: Product) => p.specifications.resolution },
    { label: 'LUMINOUS OUTPUT', getValue: (p: Product) => p.specifications.brightness },
    { label: 'LIGHT ENGINE', getValue: (p: Product) => p.specifications.lightSource },
    { label: 'CONTRAST RATIO', getValue: (p: Product) => p.specifications.contrastRatio },
    { label: 'THROW RATIO', getValue: (p: Product) => p.specifications.throwRatio },
    { label: 'PROJECTION CANVAS', getValue: (p: Product) => p.specifications.projectionSize },
    { label: 'OPERATING SYSTEM', getValue: (p: Product) => p.specifications.operatingSystem },
    { label: 'ACOUSTICS', getValue: (p: Product) => p.specifications.audio },
    { label: 'NOISE LEVEL', getValue: (p: Product) => p.specifications.noiseLevel },
    { label: 'DIMENSIONS', getValue: (p: Product) => p.specifications.dimensions },
    { label: 'WEIGHT', getValue: (p: Product) => p.specifications.weight },
    { label: 'DIRECT WARRANTY', getValue: () => 'Official Brand Warranty (NAP Computers)' },
  ];

  return (
    <div className="compare-page">
      <div className="container-wide compare-container">
        
        {/* Header */}
        <header className="compare-header text-center">
          <span className="eyebrow">
            <Sparkles size={12} />
            SIDE-BY-SIDE BENCHMARK
          </span>
          <h1 className="display-title">COMPARE PROJECTORS.</h1>
          <p className="compare-sub">
            Evaluate optical throw, ANSI lumen ratings, and acoustic architecture across up to 3 Hunting systems.
          </p>
        </header>

        {/* Comparison Table / Matrix */}
        <div className="compare-matrix-card">
          
          {/* Header Row with Product Visuals and Dropdowns */}
          <div className="compare-matrix-header-row">
            <div className="matrix-label-column">
              <span className="matrix-col-title">SPECIFICATION</span>
              <p className="matrix-col-sub">Technical baseline parameters</p>
            </div>

            {selectedProducts.map((p, idx) => (
              <div key={p.id} className="matrix-product-column">
                <div className="matrix-product-top">
                  <select
                    value={p.id}
                    onChange={e => handleSelectSlotChange(idx, e.target.value)}
                    className="slot-swap-select"
                  >
                    {productsList.map(prod => (
                      <option key={prod.id} value={prod.id}>
                        {prod.name}
                      </option>
                    ))}
                  </select>

                  {selectedProducts.length > 1 && (
                    <button
                      type="button"
                      className="slot-remove-btn"
                      onClick={() => handleRemove(p.id)}
                      title="Remove column"
                      aria-label="Remove column"
                    >
                      <X size={15} />
                    </button>
                  )}
                </div>

                <div className="matrix-img-wrap">
                  <img src={p.images.hero} alt={p.name} />
                </div>

                <h3 className="matrix-product-name">{p.name}</h3>
                <span className="matrix-price">₹{p.price.toLocaleString('en-IN')}</span>

                <div className="matrix-col-actions">
                  <button
                    type="button"
                    className="btn-primary matrix-cart-btn"
                    onClick={() => addToCart(p)}
                  >
                    <ShoppingBag size={14} />
                    <span>ADD TO CART</span>
                  </button>
                  <button
                    type="button"
                    className="btn-secondary matrix-enquire-btn"
                    onClick={() => onOpenEnquiry(p.name)}
                  >
                    <span>ENQUIRE</span>
                  </button>
                </div>
              </div>
            ))}

            {/* Empty Slot if less than 3 */}
            {selectedProducts.length < 3 && (
              <div className="matrix-empty-slot">
                <span className="empty-slot-label">ADD MODEL TO COMPARE</span>
                <div className="empty-slot-options">
                  {availableToAdd.map(avail => (
                    <button
                      key={avail.id}
                      type="button"
                      className="add-slot-btn"
                      onClick={() => handleAdd(avail.id)}
                    >
                      <Plus size={14} />
                      <span>{avail.name}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Matrix Specs Rows */}
          <div className="compare-matrix-body">
            {specRows.map((row, rowIdx) => (
              <div key={rowIdx} className="matrix-data-row">
                <div className="matrix-row-label">
                  <span>{row.label}</span>
                </div>
                {selectedProducts.map(p => (
                  <div key={p.id} className="matrix-row-value">
                    <span>{row.getValue(p)}</span>
                  </div>
                ))}
                {selectedProducts.length < 3 && <div className="matrix-row-empty" />}
              </div>
            ))}
          </div>

        </div>

      </div>
    </div>
  );
};
