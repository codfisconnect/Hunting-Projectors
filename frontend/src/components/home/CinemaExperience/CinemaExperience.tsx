import React, { useState } from 'react';
import { Maximize, Tv, Sparkles, Volume2 } from 'lucide-react';
import './CinemaExperience.css';

interface CinemaExperienceProps {
  onOpenEnquiry?: () => void;
}

export const CinemaExperience: React.FC<CinemaExperienceProps> = ({ onOpenEnquiry }) => {
  const [screenSize, setScreenSize] = useState<80 | 100 | 120 | 150>(120);

  const screenConfigs = {
    80: {
      diag: '80 INCHES',
      widthCm: '177 cm',
      heightCm: '100 cm',
      throwDistance: '2.1 meters (Standard) or 14 cm (UST)',
      roomType: 'Compact Bedroom / Private Studio',
      tvComparison: '1.4× larger than a 65" TV',
      scaleFactor: 0.68,
      soundDb: '78 dB Dynamic Headroom',
    },
    100: {
      diag: '100 INCHES',
      widthCm: '221 cm',
      heightCm: '125 cm',
      throwDistance: '2.6 meters (Standard) or 19 cm (UST)',
      roomType: 'Modern Indian Living Room',
      tvComparison: '2.2× larger than a 65" TV',
      scaleFactor: 0.82,
      soundDb: '84 dB Expansive Immersion',
    },
    120: {
      diag: '120 INCHES',
      widthCm: '266 cm',
      heightCm: '149 cm',
      throwDistance: '3.1 meters (Standard) or 24 cm (UST)',
      roomType: 'Dedicated Screening & Entertainment Hall',
      tvComparison: '3.4× larger than a 65" TV',
      scaleFactor: 0.94,
      soundDb: '90 dB Reference Sound Pressure',
    },
    150: {
      diag: '150 INCHES',
      widthCm: '332 cm',
      heightCm: '187 cm',
      throwDistance: '3.9 meters (Standard) or 32 cm (UST)',
      roomType: 'Architectural Private IMAX Wall',
      tvComparison: '5.3× larger than a 65" TV',
      scaleFactor: 1.05,
      soundDb: '96 dB Theater Grade Climax',
    },
  };

  const current = screenConfigs[screenSize];

  return (
    <section className="cinema-experience-section" aria-label="Interactive Cinema Scale Experience">
      <div className="container cinema-container">
        
        {/* Section Header */}
        <div className="cinema-header text-center">
          <span className="eyebrow">SCALE SIMULATION</span>
          <h2 className="display-title">
            TURN ANY ROOM<br />INTO YOUR CINEMA.
          </h2>
          <p className="cinema-sub">
            Why be trapped by a fixed glass panel? Hunting optics let you seamlessly expand from an intimate 80" display to a breathtaking 150" wall-filling spectacle.
          </p>
        </div>

        {/* Screen Size Switcher Controls */}
        <div className="cinema-controls-bar">
          <span className="controls-label">CHOOSE DISPLAY DIAGONAL:</span>
          <div className="cinema-size-buttons">
            {([80, 100, 120, 150] as const).map(size => (
              <button
                key={size}
                type="button"
                className={`size-toggle-btn ${screenSize === size ? 'active-size' : ''}`}
                onClick={() => setScreenSize(size)}
              >
                <span className="size-number">{size}"</span>
                <span className="size-metric-sub">{size === 120 ? 'POPULAR' : ''}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Interactive Wall Visualizer */}
        <div className="cinema-wall-visualizer">
          
          {/* Wall Background & Subtle Living Room Outline */}
          <div className="visualizer-wall-backdrop">
            
            {/* Standard 65" TV Ghost Outline for Scale Contrast */}
            <div className="ghost-tv-outline">
              <Tv size={14} />
              <span>Standard 65" TV</span>
            </div>

            {/* Expanding Projected Screen */}
            <div 
              className="expanding-projection-screen"
              style={{
                width: `${Math.round(current.scaleFactor * 78)}%`,
                height: `${Math.round(current.scaleFactor * 320)}px`,
              }}
            >
              {/* Screen Film Artwork & Hologram Grid */}
              <div className="projection-film-surface">
                <div className="film-top-badges">
                  <span className="film-badge-live">
                    <Sparkles size={12} />
                    <span>HUNTING DYNAMIC 4K</span>
                  </span>
                  <span className="film-dimens">
                    {current.widthCm} × {current.heightCm}
                  </span>
                </div>

                <div className="film-center-stat">
                  <span className="film-huge-number">{screenSize}"</span>
                  <span className="film-huge-label">DIAGONAL CANVAS</span>
                </div>

                <div className="film-bottom-meta">
                  <span className="film-compare-tag">{current.tvComparison}</span>
                  <span className="film-lens-stat">PROJECTION ACTIVE</span>
                </div>
              </div>

              {/* Optical Screen Border Glow */}
              <div className="projection-border-glow" />
            </div>

            {/* Projector Hardware Base on credenza below */}
            <div className="visualizer-credenza-base">
              <div className="credenza-furniture-line" />
              <div className="credenza-projector-dot">
                <span className="dot-pulse" />
                <span>Hunting Laser Engine Position</span>
              </div>
            </div>

          </div>

          {/* Telemetry Metrics Grid Below Canvas */}
          <div className="cinema-metrics-grid">
            <div className="metric-box">
              <div className="metric-icon-wrap">
                <Maximize size={18} />
              </div>
              <div>
                <span className="m-label">PHYSICAL DIMENSIONS</span>
                <span className="m-val">{current.widthCm} (W) × {current.heightCm} (H)</span>
              </div>
            </div>

            <div className="metric-box">
              <div className="metric-icon-wrap">
                <Tv size={18} />
              </div>
              <div>
                <span className="m-label">RECOMMENDED SPACE</span>
                <span className="m-val">{current.roomType}</span>
              </div>
            </div>

            <div className="metric-box">
              <div className="metric-icon-wrap">
                <Volume2 size={18} />
              </div>
              <div>
                <span className="m-label">ACOUSTIC DYNAMICS</span>
                <span className="m-val">{current.soundDb}</span>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom Call to Action */}
        <div className="cinema-footer-cta">
          <p>
            Unsure which screen size fits your Chennai or pan-India home? Our specialists calculate exact throw ratios free of charge.
          </p>
          {onOpenEnquiry && (
            <button 
              type="button" 
              className="btn-primary" 
              onClick={onOpenEnquiry}
            >
              REQUEST THROW CALCULATION & DEMO
            </button>
          )}
        </div>

      </div>
    </section>
  );
};
