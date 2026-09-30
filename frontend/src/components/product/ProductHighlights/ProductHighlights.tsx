import React from 'react';
import { ProductHighlight } from '../../../types/product';
import './ProductHighlights.css';

interface ProductHighlightsProps {
  highlights: ProductHighlight[];
}

export const ProductHighlights: React.FC<ProductHighlightsProps> = ({ highlights }) => {
  return (
    <section className="product-highlights-section" aria-label="Key Optical Highlights">
      <div className="highlights-header">
        <span className="eyebrow">CORE METRICS</span>
        <h2 className="display-section">ENGINEERED HIGHLIGHTS</h2>
      </div>

      <div className="highlights-grid">
        {highlights.map((h, i) => (
          <div key={i} className="highlight-metric-card">
            {h.metric && (
              <div className="metric-badge-wrap">
                <span className="metric-val">{h.metric}</span>
                {h.metricLabel && <span className="metric-tag">{h.metricLabel}</span>}
              </div>
            )}
            <h3 className="highlight-title">{h.title}</h3>
            <p className="highlight-desc">{h.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
};
