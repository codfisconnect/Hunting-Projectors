import React, { useState, useCallback } from 'react';
import { SCREEN_SIZE_OPTIONS, ScreenSizeOption } from './screenSizeData';
import './CinemaExperience.css';

interface CinemaExperienceProps {
  onOpenEnquiry?: () => void;
}

// ─────────────────────────────────────────────
// Sub-component: Top size selector buttons
// ─────────────────────────────────────────────
interface SelectorButtonsProps {
  options: ScreenSizeOption[];
  selected: ScreenSizeOption;
  onSelect: (opt: ScreenSizeOption) => void;
}

const SelectorButtons: React.FC<SelectorButtonsProps> = ({ options, selected, onSelect }) => (
  <div className="wc-selector-row" role="group" aria-label="Screen size selector">
    {options.map((opt) => {
      const isActive = opt.diagonalInches === selected.diagonalInches;
      return (
        <button
          key={opt.diagonalInches}
          type="button"
          className={`wc-selector-btn${isActive ? ' wc-selector-btn--active' : ''}`}
          onClick={() => onSelect(opt)}
          aria-pressed={isActive}
          aria-label={`Select ${opt.diagonalInches} inch screen — ${opt.animal.commonName}`}
        >
          <span className="wcs-animal-icon" aria-hidden="true">
            <img
              src={opt.animal.imagePath}
              alt=""
              className="wcs-animal-thumb"
              loading="lazy"
              onError={(e) => {
                (e.currentTarget as HTMLImageElement).style.display = 'none';
              }}
            />
          </span>
          <span className="wcs-size-label">{opt.diagonalInches}"</span>
          <span className="wcs-animal-name">{opt.animal.commonName}</span>
        </button>
      );
    })}
  </div>
);

// ─────────────────────────────────────────────
// Sub-component: Main visualization stage
// ─────────────────────────────────────────────
interface ComparisonStageProps {
  selected: ScreenSizeOption;
  animating: boolean;
}

const ComparisonStage: React.FC<ComparisonStageProps> = ({ selected, animating }) => {
  const { diagonalInches, widthCm, heightCm, animal } = selected;

  return (
    <div className="wc-stage" aria-label="Screen and animal comparison visualization">
      {/* ── Screen side ── */}
      <div className="wc-screen-side">
        {/* Width measurement label above */}
        <div className="wc-measure-top">
          <div className="wc-measure-line wc-measure-line--h" aria-hidden="true">
            <span className="wc-measure-arrow wc-measure-arrow--left" />
            <span className="wc-measure-arrow wc-measure-arrow--right" />
          </div>
          <span className="wc-measure-label">{widthCm} cm</span>
        </div>

        <div className="wc-screen-row">
          {/* Height measurement label on the left */}
          <div className="wc-measure-left" aria-hidden="true">
            <div className="wc-measure-line wc-measure-line--v">
              <span className="wc-measure-arrow wc-measure-arrow--up" />
              <span className="wc-measure-arrow wc-measure-arrow--down" />
            </div>
            <span className="wc-measure-label wc-measure-label--v">{heightCm} cm</span>
          </div>

          {/* The screen itself */}
          <div
            className="wc-screen"
            style={{
              // Use aspect ratio and constrain via CSS max-width/max-height
              aspectRatio: '16 / 9',
            }}
            role="img"
            aria-label={`${diagonalInches} inch projection screen`}
          >
            {/* Cinematic frame content */}
            <div className="wc-screen-inner">
              {/* Top bar */}
              <div className="wc-screen-topbar">
                <span className="wc-screen-badge">HUNTING DYNAMIC 4K</span>
                <span className="wc-screen-dims">{widthCm} × {heightCm} cm</span>
              </div>

              {/* Centre diagonal display */}
              <div className="wc-screen-center">
                <span className="wc-diag-number">{diagonalInches}"</span>
                <span className="wc-diag-label">DIAGONAL SCREEN</span>
              </div>

              {/* Bottom bar */}
              <div className="wc-screen-bottombar">
                <span className="wc-screen-active-dot" aria-hidden="true" />
                <span className="wc-screen-active-text">PROJECTION ACTIVE</span>
              </div>

              {/* Subtle cinematic grid overlay */}
              <div className="wc-screen-grid" aria-hidden="true" />
              {/* Border glow */}
              <div className="wc-screen-glow" aria-hidden="true" />
            </div>
          </div>
        </div>

        {/* Ground line */}
        <div className="wc-ground-line" aria-hidden="true" />
      </div>

      {/* ── Animal side ── */}
      <div className={`wc-animal-side${animating ? ' wc-animal--entering' : ''}`}>
        <div className="wc-animal-frame">
          <img
            src={animal.imagePath}
            alt={`${animal.commonName} shown at scale beside a ${diagonalInches}-inch screen`}
            className="wc-animal-img"
            loading="lazy"
            onError={(e) => {
              const img = e.currentTarget as HTMLImageElement;
              img.style.display = 'none';
              const fallback = img.nextElementSibling as HTMLElement;
              if (fallback) fallback.style.display = 'flex';
            }}
          />
          {/* Fallback placeholder */}
          <div className="wc-animal-fallback" style={{ display: 'none' }} aria-hidden="true">
            <span className="wc-animal-fallback-icon">🦌</span>
            <span>{animal.commonName}</span>
          </div>
        </div>

        {/* Animal info callout */}
        <div className="wc-animal-info">
          <span className="wc-animal-info-name">{animal.commonName.toUpperCase()}</span>
          <span className="wc-animal-info-scientific">{animal.name}</span>
          <span className="wc-animal-info-length">
            Body length: <strong>{animal.bodyLengthRange}</strong>
          </span>
        </div>

        {/* Ground line continuation */}
        <div className="wc-ground-line" aria-hidden="true" />
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────
// Sub-component: Bottom comparison cards
// ─────────────────────────────────────────────
interface ComparisonCardsProps {
  options: ScreenSizeOption[];
  selected: ScreenSizeOption;
  onSelect: (opt: ScreenSizeOption) => void;
}

const ComparisonCards: React.FC<ComparisonCardsProps> = ({ options, selected, onSelect }) => (
  <div className="wc-cards-row" role="list" aria-label="Screen size comparison cards">
    {options.map((opt) => {
      const isActive = opt.diagonalInches === selected.diagonalInches;
      return (
        <button
          key={opt.diagonalInches}
          type="button"
          role="listitem"
          className={`wc-card${isActive ? ' wc-card--active' : ''}`}
          onClick={() => onSelect(opt)}
          aria-pressed={isActive}
          aria-label={`${opt.diagonalInches} inch — ${opt.animal.commonName}`}
        >
          <div className="wc-card-animal">
            <img
              src={opt.animal.imagePath}
              alt={opt.animal.commonName}
              className="wc-card-animal-img"
              loading="lazy"
              onError={(e) => {
                (e.currentTarget as HTMLImageElement).style.display = 'none';
              }}
            />
          </div>
          <div className="wc-card-info">
            <span className="wc-card-size">{opt.diagonalInches}"</span>
            <span className="wc-card-dims">{opt.widthCm} × {opt.heightCm} cm</span>
            <span className="wc-card-animal-name">{opt.animal.commonName}</span>
          </div>
          {isActive && <div className="wc-card-active-bar" aria-hidden="true" />}
        </button>
      );
    })}
  </div>
);

// ─────────────────────────────────────────────
// Main exported component
// ─────────────────────────────────────────────
export const CinemaExperience: React.FC<CinemaExperienceProps> = ({ onOpenEnquiry }) => {
  const [selected, setSelected] = useState<ScreenSizeOption>(SCREEN_SIZE_OPTIONS[0]);
  const [animating, setAnimating] = useState(false);

  const handleSelect = useCallback((opt: ScreenSizeOption) => {
    if (opt.diagonalInches === selected.diagonalInches) return;
    setAnimating(true);
    setSelected(opt);
    // Reset animation flag after transition completes
    setTimeout(() => setAnimating(false), 500);
  }, [selected.diagonalInches]);

  return (
    <section
      className="wc-section"
      aria-label="Interactive Screen Size and Wildlife Scale Comparison"
    >
      <div className="container wc-container">

        {/* ── Header ── */}
        <div className="wc-header">
          <span className="eyebrow wc-eyebrow">EXPERIENCE THE SCALE</span>
          <h2 className="wc-heading">Bigger Than You Imagine</h2>
          <p className="wc-subtext">
            Choose a screen size and see it compared with a real wild animal.
          </p>
        </div>

        {/* ── Top selector ── */}
        <SelectorButtons
          options={SCREEN_SIZE_OPTIONS}
          selected={selected}
          onSelect={handleSelect}
        />

        {/* ── Cinematic comparison stage ── */}
        <div className="wc-stage-wrapper">
          <ComparisonStage selected={selected} animating={animating} />
        </div>

        {/* ── Bottom comparison cards ── */}
        <ComparisonCards
          options={SCREEN_SIZE_OPTIONS}
          selected={selected}
          onSelect={handleSelect}
        />

        {/* ── Footer CTA (preserved from original) ── */}
        <div className="cinema-footer-cta">
          <p>
            Unsure which screen size fits your Chennai or pan-India home? Our specialists
            calculate exact throw ratios free of charge.
          </p>
          {onOpenEnquiry && (
            <button
              type="button"
              className="btn-primary"
              onClick={onOpenEnquiry}
            >
              REQUEST THROW CALCULATION &amp; DEMO
            </button>
          )}
        </div>

      </div>
    </section>
  );
};
