// ============================================================
// Centralized Screen Size & Wildlife Comparison Data
// All dimensions use 16:9 aspect ratio
// Formula: Width = diag * 2.54 * 16 / sqrt(16²+9²)
//          Height = diag * 2.54 * 9 / sqrt(16²+9²)
// ============================================================

export interface ScreenSizeOption {
  diagonalInches: number;
  widthCm: number;
  heightCm: number;
  animal: AnimalData;
}

export interface AnimalData {
  name: string;
  commonName: string;
  imagePath: string;
  /** Approximate adult head-to-body length range (cm), tail excluded */
  bodyLengthRange: string;
  /** Short description for the info callout */
  description: string;
}

// Physical scale: pixels per cm in the visualization stage
// We use a reference of ~2.0 px/cm at base, scaled responsively via CSS
export const PX_PER_CM_BASE = 2.0;

export const SCREEN_SIZE_OPTIONS: ScreenSizeOption[] = [
  {
    diagonalInches: 80,
    widthCm: 177,
    heightCm: 100,
    animal: {
      name: 'Chital',
      commonName: 'Spotted Deer',
      imagePath: '/assets/experience/animals/spotted-deer.png',
      bodyLengthRange: '110–145 cm',
      description: 'Adult spotted deer (chital) have a head-to-body length of roughly 110–145 cm, making them agile and compact.',
    },
  },
  {
    diagonalInches: 100,
    widthCm: 221,
    heightCm: 125,
    animal: {
      name: 'Lion',
      commonName: 'Lion',
      imagePath: '/assets/experience/animals/lion.png',
      bodyLengthRange: '170–250 cm',
      description: 'An adult male lion measures approximately 170–250 cm head-to-body — one of the largest big cats on Earth.',
    },
  },
  {
    diagonalInches: 120,
    widthCm: 266,
    heightCm: 149,
    animal: {
      name: 'Bos gaurus',
      commonName: 'Indian Gaur',
      imagePath: '/assets/experience/animals/indian-gaur.png',
      bodyLengthRange: '250–330 cm',
      description: 'The Indian Gaur (Bison) is Asia\'s largest wild bovine at 250–330 cm head-to-body length.',
    },
  },
  {
    diagonalInches: 140,
    widthCm: 310,
    heightCm: 174,
    animal: {
      name: 'Elephas maximus',
      commonName: 'Asian Elephant',
      imagePath: '/assets/experience/animals/asian-elephant.png',
      bodyLengthRange: '550–640 cm',
      description: 'The Asian Elephant is the largest land animal in Asia, with a head-to-body length of 550–640 cm.',
    },
  },
];
