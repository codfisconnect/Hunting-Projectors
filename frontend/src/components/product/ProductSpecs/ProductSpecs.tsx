import React, { useState } from 'react';
import { ProductSpecification } from '../../../types/product';
import './ProductSpecs.css';

interface ProductSpecsProps {
  specifications: ProductSpecification;
}

export const ProductSpecs: React.FC<ProductSpecsProps> = ({ specifications }) => {
  const [activeGroup, setActiveGroup] = useState<'all' | 'optical' | 'system' | 'physical'>('all');

  const opticalSpecs = [
    { label: 'NATIVE RESOLUTION', value: specifications.resolution },
    { label: 'LUMINOUS OUTPUT', value: specifications.brightness },
    { label: 'LIGHT ENGINE', value: specifications.lightSource },
    { label: 'DISPLAY TECHNOLOGY', value: specifications.displayTechnology },
    { label: 'DYNAMIC CONTRAST', value: specifications.contrastRatio },
    { label: 'PROJECTION DIAGONAL', value: specifications.projectionSize },
    { label: 'OPTICAL THROW RATIO', value: specifications.throwRatio },
    { label: 'FOCUS CALIBRATION', value: specifications.focusType },
    { label: 'GEOMETRIC KEYSTONE', value: specifications.keystoneCorrection },
    { label: 'SOLID-STATE LIFESPAN', value: specifications.lampLifeHours || '30,000+ Hours' },
  ];

  const systemSpecs = [
    { label: 'OPERATING SYSTEM', value: specifications.operatingSystem },
    { label: 'ACOUSTIC ARCHITECTURE', value: specifications.audio },
    { label: 'ACOUSTIC NOISE LEVEL', value: specifications.noiseLevel },
    { label: 'TYPICAL POWER CONSUMPTION', value: specifications.powerConsumption },
  ];

  const physicalSpecs = [
    { label: 'CHASSIS DIMENSIONS', value: specifications.dimensions },
    { label: 'SYSTEM WEIGHT', value: specifications.weight },
    { label: 'PRIMARY CONNECTIVITY', value: specifications.connectivity.join(' • ') },
  ];

  const getActiveSpecs = () => {
    switch (activeGroup) {
      case 'optical':
        return opticalSpecs;
      case 'system':
        return systemSpecs;
      case 'physical':
        return physicalSpecs;
      default:
        return [...opticalSpecs, ...systemSpecs, ...physicalSpecs];
    }
  };

  return (
    <section className="product-specs-section" aria-label="Technical Specifications">
      <div className="specs-section-header">
        <div>
          <span className="eyebrow">LABORATORY CALIBRATION</span>
          <h2 className="display-section">TECHNICAL SPECIFICATIONS</h2>
          <p className="specs-notice-text">
            * Clearly stated demo technical parameters. Official production certification will accompany shipment units.
          </p>
        </div>

        {/* Filter buttons */}
        <div className="specs-filter-bar">
          <button
            type="button"
            className={`specs-tab-btn ${activeGroup === 'all' ? 'active' : ''}`}
            onClick={() => setActiveGroup('all')}
          >
            ALL SPECIFICATIONS
          </button>
          <button
            type="button"
            className={`specs-tab-btn ${activeGroup === 'optical' ? 'active' : ''}`}
            onClick={() => setActiveGroup('optical')}
          >
            OPTICAL & LENS
          </button>
          <button
            type="button"
            className={`specs-tab-btn ${activeGroup === 'system' ? 'active' : ''}`}
            onClick={() => setActiveGroup('system')}
          >
            AUDIO & OS
          </button>
          <button
            type="button"
            className={`specs-tab-btn ${activeGroup === 'physical' ? 'active' : ''}`}
            onClick={() => setActiveGroup('physical')}
          >
            CHASSIS & PORTS
          </button>
        </div>
      </div>

      {/* Structured Card Grid */}
      <div className="specs-cards-grid">
        {getActiveSpecs().map((spec, i) => (
          <div key={i} className="spec-item-box">
            <span className="spec-label-title">{spec.label}</span>
            <span className="spec-val-content">{spec.value}</span>
          </div>
        ))}
      </div>
    </section>
  );
};
