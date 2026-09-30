import React, { useState } from 'react';
import { Sliders, Image as ImageIcon, Box } from 'lucide-react';
import { Product } from '../../../types/product';
import { ProductViewer360 } from '../ProductViewer/ProductViewer360';
import './ProductGalleryViewer.css';

interface ProductGalleryViewerProps {
  product: Product;
}

export const ProductGalleryViewer: React.FC<ProductGalleryViewerProps> = ({ product }) => {
  const [activeTab, setActiveTab] = useState<'360' | 'gallery' | 'ambient'>('360');
  const [selectedGalleryImg, setSelectedGalleryImg] = useState<string>(product.images.hero);

  return (
    <div className="product-gallery-viewer-card">
      
      {/* Tab Switcher */}
      <div className="gallery-tabs-bar">
        <button
          type="button"
          className={`gallery-tab-btn ${activeTab === '360' ? 'active' : ''}`}
          onClick={() => setActiveTab('360')}
        >
          <Sliders size={14} />
          <span>INTERACTIVE 360° VIEWER</span>
        </button>

        <button
          type="button"
          className={`gallery-tab-btn ${activeTab === 'gallery' ? 'active' : ''}`}
          onClick={() => {
            setActiveTab('gallery');
            setSelectedGalleryImg(product.images.hero);
          }}
        >
          <ImageIcon size={14} />
          <span>STUDIO ANGLES ({product.gallery.length})</span>
        </button>

        {product.images.ambient && (
          <button
            type="button"
            className={`gallery-tab-btn ${activeTab === 'ambient' ? 'active' : ''}`}
            onClick={() => setActiveTab('ambient')}
          >
            <Box size={14} />
            <span>ROOM AMBIANCE</span>
          </button>
        )}
      </div>

      {/* Main View Area */}
      <div className="gallery-main-stage">
        {activeTab === '360' && (
          <ProductViewer360 product={product} />
        )}

        {activeTab === 'gallery' && (
          <div className="gallery-static-view">
            <div className="gallery-large-display">
              <img src={selectedGalleryImg} alt={product.name} className="gallery-active-img" />
            </div>

            {/* Thumbnail Strip */}
            <div className="gallery-thumbs-row">
              {product.gallery.map((img, idx) => (
                <button
                  key={idx}
                  type="button"
                  className={`gallery-thumb-btn ${selectedGalleryImg === img ? 'active-thumb' : ''}`}
                  onClick={() => setSelectedGalleryImg(img)}
                >
                  <img src={img} alt={`${product.name} angle ${idx + 1}`} />
                </button>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'ambient' && (
          <div className="gallery-ambient-view">
            <img 
              src={product.images.ambient || product.images.hero} 
              alt={`${product.name} in Room Environment`} 
              className="gallery-ambient-img"
            />
            <div className="ambient-overlay-caption">
              <span>SIMULATED ROOM AMBIANCE • ALR SCREEN READY</span>
            </div>
          </div>
        )}
      </div>

    </div>
  );
};
