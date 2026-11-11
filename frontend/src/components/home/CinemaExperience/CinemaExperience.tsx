import React, { useState, useCallback, useRef, useEffect } from 'react';
import { SCREEN_SIZE_OPTIONS, ScreenSizeOption, PX_PER_CM, STAGE_MASTER_W, STAGE_MASTER_H } from './screenSizeData';
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
  const containerRef = useRef<HTMLDivElement>(null);
  const [stageScale, setStageScale] = useState(1);

  // ── Physical sizes in pixels at the base scale ──
  const screenW = Math.round(widthCm * PX_PER_CM);
  const screenH = Math.round(heightCm * PX_PER_CM);

  // Animal visible height & width derived cleanly from true physical height & aspect ratio
  const animalHeightPx = Math.round(animal.referenceHeightCm * PX_PER_CM);
  const animalWidthPx = Math.round(animalHeightPx * animal.visibleAspect);

  // Layout spacing inside canvas
  const LEFT_OFFSET = 55; // space for height measurement arrow on left
  const GAP = 28;         // gap between screen and animal
  const animalLeft = LEFT_OFFSET + screenW + GAP;

  // Global stage canvas width and height is constant across all options
  const canvasW = STAGE_MASTER_W;
  const canvasH = STAGE_MASTER_H;

  // Responsive scale: derived purely from available container width against master canvasW
  useEffect(() => {
    const handleResize = () => {
      if (!containerRef.current) return;
      const availableW = containerRef.current.clientWidth;
      if (availableW > 0) {
        // Uniform scale factor based on container width vs master canvas width
        const nextScale = Math.min(1, availableW / canvasW);
        setStageScale(nextScale);
      }
    };

    handleResize();

    const ro = new ResizeObserver(() => {
      handleResize();
    });

    if (containerRef.current) {
      ro.observe(containerRef.current);
    }

    window.addEventListener('resize', handleResize);
    return () => {
      ro.disconnect();
      window.removeEventListener('resize', handleResize);
    };
  }, [canvasW]);

  return (
    <div
      ref={containerRef}
      className="wc-stage-scaler-container"
      style={{
        width: '100%',
        height: `${Math.round(canvasH * stageScale)}px`,
        position: 'relative',
        display: 'flex',
        justifyContent: 'flex-start',
        alignItems: 'flex-start',
        overflow: 'hidden',
      }}
    >
      <div
        className="wc-stage-scaler"
        style={{
          width: `${canvasW}px`,
          height: `${canvasH}px`,
          transform: `scale(${stageScale})`,
          transformOrigin: 'top left',
          position: 'relative',
          flexShrink: 0,
        }}
        aria-label="Screen and animal size comparison"
      >
        {/* Ground baseline */}
        <div className="wc-ground" style={{ bottom: 0 }} aria-hidden="true" />

        {/* ── Screen block ── */}
        <div
          className="wc-screen-block"
          style={{
            width: screenW,
            height: screenH,
            bottom: 0,          // screen sits on ground baseline
            left: LEFT_OFFSET,  // room for left measurement arrows
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
            {/* Cinematic landscape background */}
            <img
              src="/assets/experience/landscape.jpg"
              alt="Cinematic 4K projection preview"
              className="wc-screen-bg-image"
              loading="lazy"
            />

            {/* Cinematic grid overlay */}
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
            width: animalWidthPx,
            height: animalHeightPx,
            bottom: 0,          // feet on ground baseline
            left: animalLeft,   // immediately to the right with balanced gap
          }}
        >
          <img
            src={animal.imagePath}
            alt={`${animal.commonName} standing beside the screen for scale`}
            className="wc-animal-img"
            loading="lazy"
            draggable={false}
            onError={(e) => {
              (e.currentTarget as HTMLImageElement).style.opacity = '0';
            }}
          />
        </div>
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────────────────────
// Main exported component
// ─────────────────────────────────────────────────────────────
export const CinemaExperience: React.FC<CinemaExperienceProps> = ({ onOpenEnquiry }) => {
  const [selected, setSelected] = useState<ScreenSizeOption>(SCREEN_SIZE_OPTIONS[3]); // default to 140"
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
            Choose a screen size and see how impressive a large projection screen can be.
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
