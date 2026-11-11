// ============================================================
// Centralized Screen Size & Wildlife Comparison Data
// All screens: 16:9 aspect ratio
// Formula: Width = diag * 2.54 * 16 / sqrt(16² + 9²)
//          Height = diag * 2.54 * 9 / sqrt(16² + 9²)
//
// Physical scale: all sizes (screen + animal) share ONE
// conversion factor — PX_PER_CM pixels per centimetre.
// ============================================================

export interface AnimalData {
  /** Familiar common name only — no scientific names */
  commonName: string;
  imagePath: string;
  /** Representative adult shoulder height (cm) */
  shoulderHeightCm: number;
  /** Full visible height (ground to highest visible pixel in cm) */
  referenceHeightCm: number;
  /** Aspect ratio of the cropped visible animal (visibleWidth / visibleHeight) */
  visibleAspect: number;
}

export interface ScreenSizeOption {
  diagonalInches: number;
  widthCm: number;
  heightCm: number;
  animal: AnimalData;
}

/**
 * Base physical scale: pixels per centimetre.
 * 1.8 px/cm provides comfortable natural resolution across desktop viewports:
 *   80" screen  (177 × 100 cm) → 318.6 × 180 px
 *  100" screen  (221 × 125 cm) → 397.8 × 225 px
 *  120" screen  (266 × 149 cm) → 478.8 × 268.2 px
 *  140" screen  (310 × 174 cm) → 558.0 × 313.2 px
 */
export const PX_PER_CM = 1.8;

/**
 * Common master stage coordinate width & height in physical cm:
 * Width: 55px left arrow + (310cm screen + 32px gap + ~240cm animal) + 20px right
 * Total max content is based on the 140" option so all screen sizes render
 * on the exact same stage coordinate system without changing scale per option!
 */
export const STAGE_MASTER_W = 1000;
export const STAGE_MASTER_H = 390;

export const SCREEN_SIZE_OPTIONS: ScreenSizeOption[] = [
  {
    diagonalInches: 80,
    widthCm: 177,
    heightCm: 100,
    animal: {
      commonName: 'Spotted Deer',
      imagePath: '/assets/experience/cropped/spotted-deer.png',
      shoulderHeightCm: 90,
      referenceHeightCm: 90, // Chital deer: ~90cm visible height against 100cm screen
      visibleAspect: 358 / 413, // 0.867
    },
  },
  {
    diagonalInches: 100,
    widthCm: 221,
    heightCm: 125,
    animal: {
      commonName: 'Lion',
      imagePath: '/assets/experience/cropped/lion.png',
      shoulderHeightCm: 110,
      referenceHeightCm: 115, // Asiatic lion: ~115cm visible height against 125cm screen
      visibleAspect: 483 / 360, // 1.342
    },
  },
  {
    diagonalInches: 120,
    widthCm: 266,
    heightCm: 149,
    animal: {
      commonName: 'Indian Gaur',
      imagePath: '/assets/experience/cropped/indian-gaur.png',
      shoulderHeightCm: 165,
      referenceHeightCm: 165, // Indian Gaur: ~165cm visible height against 149cm screen
      visibleAspect: 446 / 354, // 1.260
    },
  },
  {
    diagonalInches: 140,
    widthCm: 310,
    heightCm: 174,
    animal: {
      commonName: 'Elephant',
      imagePath: '/assets/experience/cropped/asian-elephant.png',
      shoulderHeightCm: 240,
      referenceHeightCm: 185, // Asian elephant: ~185cm visible height against 174cm screen
      visibleAspect: 523 / 341, // 1.534
    },
  },
];
