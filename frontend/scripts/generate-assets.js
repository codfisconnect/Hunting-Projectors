import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const publicDir = path.resolve(__dirname, '../public/assets/products');
const framesDir = path.resolve(publicDir, '360');

if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
}
if (!fs.existsSync(framesDir)) {
  fs.mkdirSync(framesDir, { recursive: true });
}

// Function to generate high-end SVG projector visuals
function createProjectorSvg(model, angleDeg = 0, viewType = 'hero') {
  const rad = (angleDeg * Math.PI) / 180;
  const sin = Math.sin(rad);
  const cos = Math.cos(rad);

  // Perspective calculation for 360 rotation
  const lensOffsetX = Math.round(sin * 160);
  const lensScaleX = Math.max(0.2, Math.abs(cos) * 0.9 + 0.1);
  const isFront = cos >= 0;
  const bodyShear = sin * 30;

  // Model-specific accents
  const isUST = model.includes('ultra-pro');
  const isCylinder = model.includes('neo-air');
  const isLaserMaster = model.includes('cinema-x4');
  const isGaming = model.includes('horizon-max');

  let bodyWidth = 540;
  let bodyHeight = isUST ? 180 : (isCylinder ? 340 : 280);
  let rx = isCylinder ? 60 : 28;

  // Lens color accents
  const lensGlow = isGaming ? '#C8FF38' : (isLaserMaster ? '#00E5FF' : '#9DDCFF');
  const lensCore = isGaming ? '#74C043' : (isLaserMaster ? '#0A84FF' : '#4C9EEB');

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 600" width="100%" height="100%">
  <defs>
    <!-- Background Vignette / Glow -->
    <radialGradient id="stageGlow" cx="50%" cy="55%" r="65%">
      <stop offset="0%" stop-color="#141822" stop-opacity="0.8"/>
      <stop offset="50%" stop-color="#0B0D12" stop-opacity="0.4"/>
      <stop offset="100%" stop-color="#08090B" stop-opacity="0"/>
    </radialGradient>

    <!-- Metallic Graphite Chassis Gradient -->
    <linearGradient id="chassisGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#242833"/>
      <stop offset="25%" stop-color="#181B22"/>
      <stop offset="70%" stop-color="#101217"/>
      <stop offset="100%" stop-color="#0C0E12"/>
    </linearGradient>

    <!-- Top Plate Anodized Aluminum -->
    <linearGradient id="topPlate" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#3A404F"/>
      <stop offset="10%" stop-color="#222631"/>
      <stop offset="90%" stop-color="#161820"/>
      <stop offset="100%" stop-color="#0E1015"/>
    </linearGradient>

    <!-- Optical Lens Gradients -->
    <radialGradient id="lensGlass" cx="${45 + sin * 15}%" cy="${45 - cos * 10}%" r="55%">
      <stop offset="0%" stop-color="#FFFFFF" stop-opacity="0.95"/>
      <stop offset="20%" stop-color="${lensGlow}" stop-opacity="0.85"/>
      <stop offset="55%" stop-color="${lensCore}" stop-opacity="0.7"/>
      <stop offset="85%" stop-color="#061226" stop-opacity="0.95"/>
      <stop offset="100%" stop-color="#020408"/>
    </radialGradient>

    <!-- Lens Specular Glint -->
    <linearGradient id="specularGlint" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#FFFFFF" stop-opacity="0.8"/>
      <stop offset="50%" stop-color="${lensGlow}" stop-opacity="0.2"/>
      <stop offset="100%" stop-color="#FFFFFF" stop-opacity="0"/>
    </linearGradient>

    <!-- Drop Shadow / Ambient Occlusion -->
    <radialGradient id="floorShadow" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#000000" stop-opacity="0.95"/>
      <stop offset="50%" stop-color="#000000" stop-opacity="0.6"/>
      <stop offset="100%" stop-color="#000000" stop-opacity="0"/>
    </radialGradient>
  </defs>

  <!-- Ambient Light Halo -->
  <circle cx="400" cy="300" r="320" fill="url(#stageGlow)"/>

  <!-- Optical Projection Beam (Subtle) -->
  ${isFront ? `
  <polygon points="${400 + lensOffsetX - 40},${isUST ? 210 : 290} ${400 + lensOffsetX + 40},${isUST ? 210 : 290} ${800 + sin * 100},${isUST ? -50 : 200} ${800 + sin * 100},${isUST ? 100 : 380}" fill="${lensGlow}" opacity="0.07"/>
  ` : ''}

  <!-- Contact Shadow beneath Projector -->
  <ellipse cx="400" cy="485" rx="${220 + Math.abs(cos) * 40}" ry="${35 + Math.abs(sin) * 10}" fill="url(#floorShadow)"/>

  <!-- Projector Main Chassis Group -->
  <g transform="translate(${400}, 300) skewY(${bodyShear * 0.1})">
    
    <!-- Base Chassis Shadow Edge -->
    <rect x="${-bodyWidth / 2 + 5}" y="${-bodyHeight / 2 + 10}" width="${bodyWidth - 10}" height="${bodyHeight}" rx="${rx}" fill="#08090C" opacity="0.8"/>

    <!-- Main Chassis Body -->
    <rect x="${-bodyWidth / 2}" y="${-bodyHeight / 2}" width="${bodyWidth}" height="${bodyHeight}" rx="${rx}" fill="url(#chassisGrad)" stroke="#2D323E" stroke-width="1.5"/>

    <!-- Top Bevel Highlight Edge -->
    <path d="M ${-bodyWidth / 2 + rx} ${-bodyHeight / 2} L ${bodyWidth / 2 - rx} ${-bodyHeight / 2} Q ${bodyWidth / 2} ${-bodyHeight / 2} ${bodyWidth / 2} ${-bodyHeight / 2 + rx * 0.6}" fill="none" stroke="#5A6376" stroke-width="1.5" opacity="0.8"/>

    <!-- Horizontal Acoustic Ventilation Grille -->
    <g opacity="0.45">
      ${Array.from({ length: 8 }, (_, i) => `
        <line x1="${-bodyWidth / 2 + 40}" y1="${-bodyHeight / 2 + 60 + i * 22}" x2="${bodyWidth / 2 - 40}" y2="${-bodyHeight / 2 + 60 + i * 22}" stroke="#0A0C10" stroke-width="3" stroke-linecap="round"/>
        <line x1="${-bodyWidth / 2 + 40}" y1="${-bodyHeight / 2 + 61 + i * 22}" x2="${bodyWidth / 2 - 40}" y2="${-bodyHeight / 2 + 61 + i * 22}" stroke="#333947" stroke-width="1" stroke-linecap="round"/>
      `).join('')}
    </g>

    <!-- Front Optical Lens Assembly (Only visible when facing toward front) -->
    ${isFront ? `
    <!-- Lens Outer Barrel Ring -->
    <g transform="translate(${lensOffsetX}, ${isUST ? -20 : 15})">
      <!-- Shadow behind lens housing -->
      <ellipse cx="0" cy="0" rx="${88 * lensScaleX}" ry="88" fill="#0A0B0E" opacity="0.9"/>
      
      <!-- Outer Machined Bezel with Knurled Texture -->
      <ellipse cx="0" cy="0" rx="${84 * lensScaleX}" ry="84" fill="#1A1C22" stroke="#485062" stroke-width="2.5"/>
      <ellipse cx="0" cy="0" rx="${76 * lensScaleX}" ry="76" fill="#101217" stroke="#222631" stroke-width="1.5"/>

      <!-- Precision Optical Glass Element -->
      <ellipse cx="0" cy="0" rx="${68 * lensScaleX}" ry="68" fill="url(#lensGlass)"/>

      <!-- Anti-Reflective Internal Coating Rings -->
      <ellipse cx="${-5 * lensScaleX}" cy="-5" rx="${52 * lensScaleX}" ry="52" fill="none" stroke="${lensGlow}" stroke-width="1.5" opacity="0.6"/>
      <ellipse cx="${5 * lensScaleX}" cy="6" rx="${36 * lensScaleX}" ry="36" fill="none" stroke="${lensCore}" stroke-width="1.2" opacity="0.7"/>

      <!-- Specular Optical Reflection Arc -->
      <path d="M ${-40 * lensScaleX} -42 A ${58 * lensScaleX} 58 0 0 1 ${30 * lensScaleX} -48" fill="none" stroke="#FFFFFF" stroke-width="3" stroke-linecap="round" opacity="0.85"/>
      <circle cx="${-22 * lensScaleX}" cy="-22" r="5" fill="#FFFFFF" opacity="0.9"/>

      <!-- ToF Laser Sensor Window -->
      <circle cx="${70 * lensScaleX}" cy="-35" r="7" fill="#0C0E14" stroke="#373D4D" stroke-width="1.5"/>
      <circle cx="${70 * lensScaleX}" cy="-35" r="3" fill="${lensGlow}" opacity="0.8"/>
    </g>
    ` : `
    <!-- Back Connectivity Ports Panel (When rotated facing back) -->
    <g transform="translate(${-lensOffsetX}, 20)">
      <rect x="-140" y="-55" width="280" height="110" rx="8" fill="#0E1015" stroke="#2E3340" stroke-width="1.5"/>
      <!-- HDMI 1 & 2 -->
      <rect x="-115" y="-30" width="38" height="16" rx="2" fill="#181B22" stroke="#50596E" stroke-width="1"/>
      <text x="-96" y="-18" font-family="Inter, sans-serif" font-size="7" fill="#8892A2" text-anchor="middle">HDMI 1</text>
      
      <rect x="-65" y="-30" width="38" height="16" rx="2" fill="#181B22" stroke="#50596E" stroke-width="1"/>
      <text x="-46" y="-18" font-family="Inter, sans-serif" font-size="7" fill="#8892A2" text-anchor="middle">HDMI 2</text>

      <!-- USB 3.0 Ports (Blue) -->
      <rect x="-15" y="-30" width="32" height="14" rx="2" fill="#0077CC" opacity="0.85"/>
      <text x="1" y="-19" font-family="Inter, sans-serif" font-size="7" fill="#FFFFFF" text-anchor="middle">USB 3.0</text>
      
      <rect x="25" y="-30" width="32" height="14" rx="2" fill="#0077CC" opacity="0.85"/>
      <text x="41" y="-19" font-family="Inter, sans-serif" font-size="7" fill="#FFFFFF" text-anchor="middle">USB</text>

      <!-- Optical Audio & LAN -->
      <rect x="65" y="-32" width="22" height="20" rx="2" fill="#181B22" stroke="#485062" stroke-width="1"/>
      <circle cx="76" cy="-22" r="5" fill="#FF3B30" opacity="0.9"/>

      <rect x="95" y="-32" width="26" height="20" rx="2" fill="#181B22" stroke="#485062" stroke-width="1"/>

      <!-- Power In Port -->
      <circle cx="-85" cy="22" r="14" fill="#0A0B0E" stroke="#555E72" stroke-width="2"/>
      <circle cx="-85" cy="22" r="4" fill="#20242E"/>

      <!-- Certification & Legal Direct Sub-text -->
      <text x="35" y="24" font-family="Inter, sans-serif" font-size="8" fill="#586072" letter-spacing="1">HUNTING OPTICAL ENGINE • DIRECT BRAND SUPPLY</text>
    </g>
    `}

    <!-- Laser Etched Hunting Brand Emblem -->
    <g transform="translate(0, ${isUST ? 50 : (isFront ? -95 : -80)})" opacity="0.85">
      <text x="0" y="0" font-family="Inter, -apple-system, sans-serif" font-size="12" font-weight="800" fill="#E2E5EB" letter-spacing="5" text-anchor="middle">HUNTING</text>
      <text x="0" y="14" font-family="Inter, -apple-system, sans-serif" font-size="6" font-weight="600" fill="#757E90" letter-spacing="4" text-anchor="middle">PROJECTORS</text>
    </g>

    <!-- Status Indicator LED Strip -->
    <rect x="-35" y="${bodyHeight / 2 - 14}" width="70" height="2.5" rx="1" fill="${lensGlow}" opacity="0.85"/>

    <!-- Corner Anodized Fasteners -->
    <circle cx="${-bodyWidth / 2 + 20}" cy="${-bodyHeight / 2 + 20}" r="2.5" fill="#444B5B"/>
    <circle cx="${bodyWidth / 2 - 20}" cy="${-bodyHeight / 2 + 20}" r="2.5" fill="#444B5B"/>
    <circle cx="${-bodyWidth / 2 + 20}" cy="${bodyHeight / 2 - 20}" r="2.5" fill="#444B5B"/>
    <circle cx="${bodyWidth / 2 - 20}" cy="${bodyHeight / 2 - 20}" r="2.5" fill="#444B5B"/>

  </g>

  <!-- Technical Spec Metadata Stamp (Architectural & Premium) -->
  <g transform="translate(50, 560)">
    <text x="0" y="0" font-family="Inter, monospace" font-size="9" fill="#525B6C" letter-spacing="2">MODEL: ${model.toUpperCase()} • DEGREE: ${angleDeg}°</text>
    <text x="700" y="0" font-family="Inter, monospace" font-size="9" fill="#525B6C" letter-spacing="2" text-anchor="end">OPTICAL GLASS 4K ENGINE</text>
  </g>
</svg>`;
}

const models = [
  'hunting-vision-x1',
  'hunting-cinema-x4',
  'hunting-ultra-pro',
  'hunting-neo-air',
  'hunting-horizon-max'
];

// Generate primary view SVGs for each model
for (const model of models) {
  // Hero (front-facing at 0 deg)
  fs.writeFileSync(path.resolve(publicDir, `${model}-hero.svg`), createProjectorSvg(model, 0, 'hero'), 'utf-8');
  // Angled view (at 30 deg)
  fs.writeFileSync(path.resolve(publicDir, `${model}-angled.svg`), createProjectorSvg(model, 30, 'angled'), 'utf-8');
  // Top view
  fs.writeFileSync(path.resolve(publicDir, `${model}-top.svg`), createProjectorSvg(model, 15, 'top'), 'utf-8');
  // Back view (180 deg)
  fs.writeFileSync(path.resolve(publicDir, `${model}-back.svg`), createProjectorSvg(model, 180, 'back'), 'utf-8');
  // Transparent / ambient
  fs.writeFileSync(path.resolve(publicDir, `${model}-ambient.svg`), createProjectorSvg(model, -25, 'ambient'), 'utf-8');
  fs.writeFileSync(path.resolve(publicDir, `${model}-transparent.svg`), createProjectorSvg(model, 0, 'transparent'), 'utf-8');
}

// Generate 16 360-rotation frames for each model
const prefixMap = {
  'hunting-vision-x1': 'vision-x1',
  'hunting-cinema-x4': 'cinema-x4',
  'hunting-ultra-pro': 'ultra-pro',
  'hunting-neo-air': 'neo-air',
  'hunting-horizon-max': 'horizon-max',
};

for (const model of models) {
  const prefix = prefixMap[model];
  for (let i = 0; i < 16; i++) {
    const angle = i * 22.5;
    const svgContent = createProjectorSvg(model, angle, '360');
    fs.writeFileSync(path.resolve(framesDir, `${prefix}-frame-${i + 1}.svg`), svgContent, 'utf-8');
  }
}

console.log('Successfully generated high-definition SVG assets and 16-frame 360 sequences for all Hunting Projectors!');
