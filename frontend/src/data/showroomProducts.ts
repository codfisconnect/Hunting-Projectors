export interface ShowroomProduct {
  id: string;
  name: string;
  code: string;
  headline: string;
  badge: string;
  cleanProductImage: string;
  posterArtwork: string;
  themeColor: string;
  ambientGlow: string;
  catalogSlug: string; // Links directly to verified catalog product detail route
  specs: {
    resolution: string;
    brightness: string;
    contrast: string;
    lampLife: string;
    screenScale: string;
    soundOrBattery: string;
    smartFeatures: string[];
    warranty: string;
  };
  note?: string;
}

export const SHOWROOM_WARRIOR_MODELS: ShowroomProduct[] = [
  {
    id: 'warrior-001',
    name: 'Model Warrior 001',
    code: 'WARRIOR-001',
    headline: 'Power Your View • Stream • Game • Entertain',
    badge: 'STEALTH POWER',
    cleanProductImage: '/assets/products/hunting-vision-x1-hero.svg',
    posterArtwork: '/assets/showrooms/warrior-001-poster.jpg',
    themeColor: '#00E5FF',
    ambientGlow: 'rgba(0, 229, 255, 0.16)',
    catalogSlug: 'warrior-001',
    specs: {
      resolution: 'Full HD 1080p (4K Support)',
      brightness: '1,500 ANSI Lumens (10,000 Peak Lumens)',
      contrast: '10,000:1 Dynamic Contrast',
      lampLife: '40,000 Hours Lamp Life',
      screenScale: 'Up to 200" Canvas',
      soundOrBattery: '4 Hours Continuous Playback Battery',
      smartFeatures: [
        'Android OS Smart Streaming',
        'Auto Focus & Electric Focus Control',
        'Wi-Fi & Bluetooth & Mirror Cast',
        'HDMI, USB & AUX Inputs',
        'All OTT Support (Netflix, Prime, Disney+)',
        '3D Projection Support'
      ],
      warranty: '6 Months Spare Replacement + 2 Year Service Warranty'
    },
    note: 'Engineered with high-efficiency solid-state LED engine, unibody heat-sink cooling, and portable 4-hour battery.'
  },
  {
    id: 'warrior-002',
    name: 'Model Warrior 002',
    code: 'WARRIOR-002',
    headline: 'Projector • Unleash The Power',
    badge: 'NEW GEN SMART',
    cleanProductImage: '/assets/products/hunting-neo-air-hero.svg',
    posterArtwork: '/assets/showrooms/warrior-002-poster.jpg',
    themeColor: '#FF4D26',
    ambientGlow: 'rgba(255, 77, 38, 0.16)',
    catalogSlug: 'warrior-002',
    specs: {
      resolution: 'Full HD 1080p (4K Playback Support)',
      brightness: '1,500 ANSI Lumens',
      contrast: '10,000:1 Contrast Ratio',
      lampLife: '40,000 Hours Lamp Life',
      screenScale: 'Up to 200" Canvas',
      soundOrBattery: '4 Hours Continuous Viewing Time',
      smartFeatures: [
        'Auto Focus Instant Geometry',
        'Android Smart TV Version',
        'Wi-Fi & Bluetooth & Screen Mirroring',
        'Full OTT Streaming Support',
        '3D Playback Support',
        'Ultra-Quiet Thermal Dissipation'
      ],
      warranty: '6 Months Spare Replacement + 2 Year Service Warranty'
    },
    note: 'Sleek vertical acoustic chassis with omnidirectional upward audio and dedicated ergonomic controller.'
  },
  {
    id: 'warrior-003',
    name: 'Model Warrior 003',
    code: 'WARRIOR-003',
    headline: 'Unleash The Giant Display • Power • Clarity • Adventure',
    badge: 'FLAGSHIP 4K',
    cleanProductImage: '/assets/products/hunting-cinema-x4-hero.svg',
    posterArtwork: '/assets/showrooms/warrior-003-poster.jpg',
    themeColor: '#A855F7',
    ambientGlow: 'rgba(168, 85, 247, 0.20)',
    catalogSlug: 'warrior-003',
    specs: {
      resolution: 'Native Full HD 1080p with True 4K Processing & HDR10',
      brightness: '6,500 ANSI Lumens Ultra Brightness',
      contrast: '30,000:1 Ultra Contrast Ratio',
      lampLife: '70,000 Hours Extended Solid-State Life',
      screenScale: 'Up to 300" Giant Display',
      soundOrBattery: '6 Hours Continuous Viewing Battery',
      smartFeatures: [
        'Google TV Certified Core',
        'Auto Focus & Omnidirectional Auto Keystone',
        'Low-Latency Gaming Mode',
        '2x HDMI Ports, 2x USB, Type-C & AUX Ports',
        'Wi-Fi, Bluetooth 5.2 & Mirror Cast',
        '3D Cinematic Projection Support'
      ],
      warranty: '1 Year Spare Replacement Guarantee + 2 Year Service Warranty'
    },
    note: 'Flagship optical engine with acoustic fabric front grille, certified Google TV and low-latency gaming engine.'
  }
];
