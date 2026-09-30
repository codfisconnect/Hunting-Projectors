import React from 'react';
import { Package, Check } from 'lucide-react';
import './ProductWhatsIncluded.css';

interface ProductWhatsIncludedProps {
  whatsIncluded: string[];
}

export const ProductWhatsIncluded: React.FC<ProductWhatsIncludedProps> = ({ whatsIncluded }) => {
  return (
    <section className="whats-included-section" aria-label="What is in the box">
      <div className="included-header">
        <span className="eyebrow">UNBOXING EXPERIENCE</span>
        <h2 className="display-section">WHAT'S INCLUDED IN THE BOX</h2>
      </div>

      <div className="included-grid">
        {whatsIncluded.map((item, i) => (
          <div key={i} className="included-item-card">
            <div className="included-check-wrap">
              <Check size={16} />
            </div>
            <span className="included-title">{item}</span>
          </div>
        ))}
      </div>
    </section>
  );
};
