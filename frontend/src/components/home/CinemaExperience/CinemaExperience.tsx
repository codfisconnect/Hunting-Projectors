import React, { useState, useCallback, useRef, useEffect } from 'react';
import { SCREEN_SIZE_OPTIONS, ScreenSizeOption, PX_PER_CM } from './screenSizeData';
import './CinemaExperience.css';

interface CinemaExperienceProps {
  onOpenEnquiry?: () => void;
}

// ─────────────────────────────────────────────────────────────
// Compact segmented tab selector
// ─────────────────────────────────────────────────────────────
interface TabSelectorProps {
  options: ScreenSizeOption[];
  selected: ScreenSizeOption;
  onSelect: (opt: ScreenSizeOption) => void;
}

const TabSelector: React.FC<TabSelectorProps> = ({ options, selected, onSelect }) => (
  <div className="wc-tabs" role="group" aria-label="Select screen size">
    {options.map((opt) => {
      const isActive = opt.diagonalInches === selected.diagonalInches;
      return (
        <button
          key={opt.diagonalInches}
          type="button"
          className={`wc-tab${isActive ? ' wc-tab--active' : ''}`}
          onClick={() => onSelect(opt)}
          aria-pressed={isActive}
          aria-label={`${opt.diagonalInches} inch screen`}
        >
          {opt.diagonalInches}"
        </button>
      );
    })}
  </div>
);

// ─────────────────────────────────────────────────────────────
// Comparison stage — proportional screen + animal
// ─────────────────────────────────────────────────────────────
interface ComparisonStageProps {
  selected: ScreenSizeOption;
  fadeKey: number; // increment to trigger fade-in on change
}

const ComparisonStage: React.FC<ComparisonStageProps> = ({ selected, fadeKey }) => {
  const { diagonalInches, widthCm, heightCm, animal } = selected;

  // ── Physical sizes in pixels at the base scale ──
  const screenW = Math.round(widthCm * PX_PER_CM);
  const screenH = Math.round(heightCm * PX_PER_CM);

  // Animal height in pixels (shoulder height → total body ~1.35× shoulder for quadrupeds)
  const animalBodyHeightPx = Math.round(animal.shoulderHeightCm * 1.35 * PX_PER_CM);

  // ── Stage canvas size: needs to fit the largest possible screen ──
  // 140" → 310 cm wide → 310 * PX_PER_CM = 496 px
  // Add animal (up to ~108 cm / 1.35 × 250 × 1.6 = 540 px for elephant body height,
  // but width is usually ≈ body-length / 2 for a compact side view ≈ 160 px gap)
  // We define a fixed canvas and let CSS scale the whole thing.
  const CANVAS_W = Math.round(310 * PX_PER_CM) + 220; // screen + animal gap + animal width
  const CANVAS_H = Math.round(250 * 1.35 * PX_PER_CM) + 60; // tallest animal + padding

  return (
    <div
      className="wc-stage-scaler"
      style={{ '--canvas-w': `${CANVAS_W}px`, '--canvas-h': `${CANVAS_H}px` } as React.CSSProperties}
      aria-label="Screen and animal size comparison"
    >
      {/* Inner canvas at natural pixel size; CSS scales this down uniformly */}
      <div className="wc-canvas" style={{ width: CANVAS_W, height: CANVAS_H }}>

        {/* ── Ground baseline ── */}
        <div className="wc-ground" style={{ bottom: 0 }} aria-hidden="true" />

        {/* ── Screen block ── */}
        <div
          className="wc-screen-block"
          style={{
            width: screenW,
            height: screenH,
            bottom: 0,          // screen sits on ground
            left: 60,           // leave room for height measurement arrow
          }}
        >
          {/* Width measurement above */}
          <div className="wc-meas-top" aria-hidden="true">
            <div className="wc-meas-line-h" />
            <span className="wc-meas-txt">{widthCm} cm</span>
          </div>

          {/* Height measurement left */}
          <div className="wc-meas-left" style={{ height: screenH }} aria-hidden="true">
            <div className="wc-meas-line-v" />
            <span className="wc-meas-txt wc-meas-txt--v">{heightCm} cm</span>
          </div>

          {/* The screen face */}
          <div
            className="wc-screen-face"
            role="img"
            aria-label={`${diagonalInches}-inch projection screen, ${widthCm} by ${heightCm} centimetres`}
          >
            {/* Cinematic grid */}
            <div className="wc-screen-grid" aria-hidden="true" />
            {/* Gold inner border glow */}
            <div className="wc-screen-border" aria-hidden="true" />

            {/* Top bar */}
            <div className="wc-screen-topbar">
              <span className="wc-screen-badge">HUNTING 4K</span>
              <span className="wc-screen-dims">{widthCm} × {heightCm} cm</span>
            </div>

            {/* Centre stat */}
            <div className="wc-screen-centre">
              <span className="wc-diag-num" key={`diag-${fadeKey}`}>{diagonalInches}"</span>
              <span className="wc-diag-lbl">DIAGONAL</span>
            </div>

            {/* Bottom pulse */}
            <div className="wc-screen-bottombar">
              <span className="wc-pulse-dot" aria-hidden="true" />
              <span className="wc-active-txt">PROJECTION ACTIVE</span>
            </div>
          </div>
        </div>

        {/* ── Animal block ── */}
        <div
          key={`animal-${fadeKey}`}
          className="wc-animal-block"
          style={{
            height: animalBodyHeightPx,
            bottom: 0,          // feet on ground
            left: 60 + screenW + 32, // right of screen + gap
          }}
        >
          <img
            src={animal.imagePath}
            alt={`${animal.commonName} standing beside the screen for scale`}
            className="wc-animal-img"
            loading="lazy"
            draggable={false}
            onError={(e) => {
              // Hide broken image gracefully
              (e.currentTarget as HTMLImageElement).style.opacity = '0';
            }}
          />
          {/* Animal label */}
          <span className="wc-animal-label">{animal.commonName}</span>
        </div>

      </div>
    </div>
  );
};

// ─────────────────────────────────────────────────────────────
// Main exported component
// ─────────────────────────────────────────────────────────────
export const CinemaExperience: React.FC<CinemaExperienceProps> = ({ onOpenEnquiry }) => {
  const [selected, setSelected] = useState<ScreenSizeOption>(SCREEN_SIZE_OPTIONS[0]);
  const [fadeKey, setFadeKey] = useState(0);

  const handleSelect = useCallback((opt: ScreenSizeOption) => {
    if (opt.diagonalInches === selected.diagonalInches) return;
    setFadeKey(k => k + 1);
    setSelected(opt);
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

        {/* ── Compact tab selector ── */}
        <TabSelector
          options={SCREEN_SIZE_OPTIONS}
          selected={selected}
          onSelect={handleSelect}
        />

        {/* ── Proportional comparison stage ── */}
        <div className="wc-stage-wrapper">
          <ComparisonStage selected={selected} fadeKey={fadeKey} />
        </div>

        {/* ── Footer CTA ── */}
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
