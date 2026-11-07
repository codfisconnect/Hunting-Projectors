// ============================================================
// Centralized Screen Size & Wildlife Comparison Data
// All screens: 16:9 aspect ratio
// Formula: Width = diag * 2.54 * 16 / sqrt(16²+9²)
//          Height = diag * 2.54 * 9 / sqrt(16²+9²)
//
// Physical scale: all sizes (screen + animal) share ONE
// conversion factor — PX_PER_CM_BASE pixels per centimetre.
// The comparison stage CSS scales the entire stage uniformly
// via transform/scale, so internal proportions stay correct.
// ============================================================

export interface AnimalData {
  /** Familiar common name only — no scientific names */
  commonName: string;
  imagePath: string;
  /**
   * Representative adult shoulder height (cm).
   * Used to calculate the animal's rendered pixel height
   * at the shared physical scale.
   * Sources: wildlife reference ranges (midpoint used).
   *   Chital:        ~90 cm shoulder
   *   Lion:         ~120 cm shoulder
   *   Indian Gaur:  ~175 cm shoulder
   *   Asian Elephant: ~250 cm shoulder
   */
  shoulderHeightCm: number;
}

export interface ScreenSizeOption {
  diagonalInches: number;
  widthCm: number;
  heightCm: number;
  animal: AnimalData;
}

/**
 * Base physical scale: pixels per centimetre.
 * Both the screen and each animal use this same value.
 * The stage container is scaled down responsively by CSS.
 *
 * At 1.6 px/cm:
 *   80" screen → 177 × 100 cm → 283 × 160 px  (smallest)
 *  140" screen → 310 × 174 cm → 496 × 278 px  (1.75× larger)
 */
export const PX_PER_CM = 1.6;

export const SCREEN_SIZE_OPTIONS: ScreenSizeOption[] = [
  {
    diagonalInches: 80,
    widthCm: 177,
    heightCm: 100,
    animal: {
      commonName: 'Spotted Deer',
      imagePath: '/assets/experience/animals/spotted-deer.png',
      shoulderHeightCm: 90,
    },
  },
  {
    diagonalInches: 100,
    widthCm: 221,
    heightCm: 125,
    animal: {
      commonName: 'Lion',
      imagePath: '/assets/experience/animals/lion.png',
      shoulderHeightCm: 120,
    },
  },
  {
    diagonalInches: 120,
    widthCm: 266,
    heightCm: 149,
    animal: {
      commonName: 'Indian Gaur',
      imagePath: '/assets/experience/animals/indian-gaur.png',
      shoulderHeightCm: 175,
    },
  },
  {
    diagonalInches: 140,
    widthCm: 310,
    heightCm: 174,
    animal: {
      commonName: 'Elephant',
      imagePath: '/assets/experience/animals/asian-elephant.png',
      shoulderHeightCm: 250,
    },
  },
];
