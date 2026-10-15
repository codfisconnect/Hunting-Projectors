export interface ShowroomProduct {
  id: string;
  name: string;
  code: string;
  headline: string;
  badge: string;
  posterImage: string;
  themeColor: string;
  ambientGlow: string;
  catalogSlug?: string; // Links to actual database product if matched
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
    posterImage: '/assets/showrooms/warrior-001-poster.jpg',
    themeColor: '#00E5FF',
    ambientGlow: 'rgba(0, 229, 255, 0.18)',
    catalogSlug: 'hunting-vision-x1',
    specs: {
      resolution: 'Full HD 1080p (4K Support)',
      brightness: 'ANSI 1500 (10000 Lumens Peak)',
      contrast: '10000:1 Dynamic Contrast',
      lampLife: '40,000 Hours Lamp Life',
      screenScale: 'Up to 200" Cinema View',
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
    note: 'Launch campaign edition featuring high-efficiency LED engine and rugged cooling architecture.'
  },
  {
    id: 'warrior-002',
    name: 'Model Warrior 002',
    code: 'WARRIOR-002',
    headline: 'Projector • Unleash The Power',
    badge: 'NEW GEN SMART',
    posterImage: '/assets/showrooms/warrior-002-poster.jpg',
    themeColor: '#FF4D26',
    ambientGlow: 'rgba(255, 77, 38, 0.18)',
    catalogSlug: 'hunting-vision-x1',
    specs: {
      resolution: 'Full HD 1080p (4K Playback Support)',
      brightness: 'ANSI 1500 High Brightness',
      contrast: '10000:1 Contrast Ratio',
      lampLife: '40,000 Hours Lamp Life',
      screenScale: 'Up to 200" Screen Canvas',
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
    note: 'Sleek vertical acoustic chassis with dedicated wireless ergonomics controller.'
  },
  {
    id: 'warrior-003',
    name: 'Model Warrior 003',
    code: 'WARRIOR-003',
    headline: 'Unleash The Giant Display • Power • Clarity • Adventure',
    badge: 'PREMIUM 4K FLAGSHIP',
    posterImage: '/assets/showrooms/warrior-003-poster.jpg',
    themeColor: '#A855F7',
    ambientGlow: 'rgba(168, 85, 247, 0.22)',
    catalogSlug: 'hunting-cinema-x4',
    specs: {
      resolution: 'Native Full HD 1080p with True 4K Processing & HDR10',
      brightness: 'ANSI 6500 Lumens Ultra Brightness',
      contrast: '30000:1 Ultra Contrast Ratio',
      lampLife: '70,000 Hours Extended Solid-State Life',
      screenScale: 'Up to 300" Giant Screen Display',
      soundOrBattery: '6 Hours Continuous Viewing Battery',
      smartFeatures: [
        'Google TV Certified Core',
        'Auto Focus & Omnidirectional Auto Keystone',
        'Low-Latency Gaming Mode',
        '2x HDMI, 2x USB, Type-C & AUX Ports',
        'Wi-Fi, Bluetooth 5.2 & Mirror Cast',
        '3D Cinematic Projection Support'
      ],
      warranty: '1 Year Spare Replacement Guarantee + 2 Year Service Warranty'
    },
    note: 'Flagship optical engine with acoustic fabric facade, certified Google TV and low-latency gaming engine.'
  }
];
