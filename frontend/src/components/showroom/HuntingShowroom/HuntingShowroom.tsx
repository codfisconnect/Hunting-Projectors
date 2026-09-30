import React, { useState } from 'react';
import { Sofa, Film, Gamepad2, Info, Eye } from 'lucide-react';
import { getProducts } from '../../../services/productService';
import { Product } from '../../../types/product';
import './HuntingShowroom.css';

interface HuntingShowroomProps {
  onOpenEnquiry?: () => void;
}

type EnvironmentKey = 'living-room' | 'home-cinema' | 'gaming';

interface EnvironmentData {
  id: EnvironmentKey;
  label: string;
  subtitle: string;
  icon: React.ReactNode;
  recommendedModel: string;
  recommendedModelSlug: string;
  recommendedImage: string;
  projectionScreenRatio: string;
  screenSize: string;
  ambientLightLevel: string;
  screenContentTitle: string;
  screenContentBadge: string;
  atmosphereGlowColor: string;
  roomDesc: string;
}

export const HuntingShowroom: React.FC<HuntingShowroomProps> = ({ onOpenEnquiry }) => {
  const [activeEnv, setActiveEnv] = useState<EnvironmentKey>('living-room');
  const [catalog, setCatalog] = useState<Product[]>([]);

  React.useEffect(() => {
    let isMounted = true;
    getProducts()
      .then(res => {
        if (isMounted) setCatalog(res.products);
      })
      .catch(err => {
        console.warn('Showroom products load:', err);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const livingModel = catalog.find(p => p.slug === 'hunting-h500') || catalog[0];
  const cinemaModel = catalog.find(p => p.slug === 'hunting-h900') || catalog[1] || catalog[0];
  const gamingModel = catalog.find(p => p.slug === 'hunting-h700') || catalog[2] || catalog[0];

  const environments: Record<EnvironmentKey, EnvironmentData> = {
    'living-room': {
      id: 'living-room',
      label: 'LIVING ROOM',
      subtitle: 'Daylight & Ambient Light Rejection',
      icon: <Sofa size={16} />,
      recommendedModel: livingModel?.name || 'Hunting H500',
      recommendedModelSlug: livingModel?.slug || 'hunting-h500',
      recommendedImage: livingModel?.images.hero || '/assets/products/hunting-cinema-x4-hero.svg',
      projectionScreenRatio: '16:9 4K HDR',
      screenSize: '100" – 120"',
      ambientLightLevel: 'Moderate Daylight / Evening Lamps',
      screenContentTitle: '4K Ultra High-Def Wildlife & Live Cricket',
      screenContentBadge: 'DYNAMIC CONTRAST',
      atmosphereGlowColor: 'rgba(157, 220, 255, 0.22)',
      roomDesc: 'Engineered for bright family spaces. High ANSI lumens maintain vivid color saturation even with ambient curtains drawn.',
    },
    'home-cinema': {
      id: 'home-cinema',
      label: 'HOME CINEMA',
      subtitle: 'Reference Black Levels & Pure Laser Contrast',
      icon: <Film size={16} />,
      recommendedModel: cinemaModel?.name || 'Hunting H900 Flagship',
      recommendedModelSlug: cinemaModel?.slug || 'hunting-h900',
      recommendedImage: cinemaModel?.images.hero || '/assets/products/hunting-vision-x1-hero.svg',
      projectionScreenRatio: '2.39:1 Anamorphic Scope',
      screenSize: '130" – 150"',
      ambientLightLevel: 'Pitch Dark / Controlled Screening Room',
      screenContentTitle: 'Cinematic Space Odyssey (ALPD 4.0 Laser)',
      screenContentBadge: '110% BT.2020 COLOR',
      atmosphereGlowColor: 'rgba(0, 140, 255, 0.3)',
      roomDesc: 'Uncompromising private theater acoustics and triple-laser phosphor dynamics for true film connoisseurs.',
    },
    'gaming': {
      id: 'gaming',
      label: 'GAMING RIG',
      subtitle: '240Hz High Refresh & Low Latency',
      icon: <Gamepad2 size={16} />,
      recommendedModel: gamingModel?.name || 'Hunting H700 Gaming',
      recommendedModelSlug: gamingModel?.slug || 'hunting-h700',
      recommendedImage: gamingModel?.images.hero || '/assets/products/hunting-horizon-max-hero.svg',
      projectionScreenRatio: '21:9 Ultrawide Sim',
      screenSize: '100" High Refresh',
      ambientLightLevel: 'LED Bias Mood Lighting',
      screenContentTitle: 'Competitive Esports Racing & FPS Sim',
      screenContentBadge: '240Hz / 4.2ms LAG',
      atmosphereGlowColor: 'rgba(200, 255, 56, 0.28)',
      roomDesc: 'Blistering refresh speed and game HUD telemetry mode for PlayStation 5, Xbox Series X, and high-end PC rigs.',
    },
  };

  const current = environments[activeEnv];

  return (
    <section className="hunting-showroom-section" aria-label="Digital Product Showroom">
      <div className="container-wide showroom-container">
        
        {/* Header */}
        <div className="showroom-header">
          <div className="showroom-header-left">
            <span className="eyebrow">DIGITAL SHOWROOM</span>
            <h2 className="display-section">HUNTING SHOWROOM</h2>
            <p className="showroom-sub">
              Experience how Hunting optical engines adapt to your exact living architecture and viewing habits.
            </p>
          </div>

          {/* Environment Switcher Tabs */}
          <div className="showroom-env-tabs">
            {Object.values(environments).map(env => (
              <button
                key={env.id}
                type="button"
                className={`showroom-tab-btn ${activeEnv === env.id ? 'active-env' : ''}`}
                onClick={() => setActiveEnv(env.id)}
              >
                {env.icon}
                <span>{env.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Interactive Simulated Architectural Room Stage */}
        <div className={`showroom-room-stage env-${activeEnv}`}>
          
          {/* Ambient Wall Lighting Glow matching Environment */}
          <div 
            className="room-ambient-glow-layer" 
            style={{ background: current.atmosphereGlowColor }}
          />

          {/* Simulated Projected Screen on the Wall */}
          <div className="room-screen-frame">
            <div className="screen-active-canvas">
              {/* Simulated Screen Content Graphic */}
              <div className="screen-content-art">
                <div className="screen-badge-strip">
                  <span className="screen-badge">{current.screenContentBadge}</span>
                  <span className="screen-aspect">{current.projectionScreenRatio}</span>
                </div>
                <div className="screen-film-title">
                  <h3>{current.screenContentTitle}</h3>
                  <span className="screen-diag-size">{current.screenSize} CANVAS</span>
                </div>
              </div>
            </div>

            {/* Simulated Projection Optical Light Beam Cone */}
            <div className="projector-optical-beam" />
          </div>

          {/* Focal Point: The Hunting Projector in Foreground */}
          <div className="room-projector-foreground">
            <div className="room-projector-glow" />
            <img 
              src={current.recommendedImage} 
              alt={current.recommendedModel} 
              className="room-projector-focal-img"
            />
            <div className="room-focal-tag">
              <span className="tag-model">{current.recommendedModel}</span>
              <span className="tag-anchor">FOCAL OPTICAL UNIT</span>
            </div>
          </div>

          {/* Floating Spec Metadata HUD Overlay */}
          <div className="showroom-hud-card">
            <div className="hud-header">
              <Info size={14} className="hud-icon" />
              <span>ROOM TELEMETRY</span>
            </div>
            
            <div className="hud-rows">
              <div className="hud-row">
                <span className="hud-label">OPTIMAL CANVAS:</span>
                <span className="hud-val">{current.screenSize}</span>
              </div>
              <div className="hud-row">
                <span className="hud-label">AMBIENT ENVIRONMENT:</span>
                <span className="hud-val">{current.ambientLightLevel}</span>
              </div>
              <div className="hud-row">
                <span className="hud-label">OPTIMIZED FOR:</span>
                <span className="hud-val">{current.subtitle}</span>
              </div>
            </div>

            <p className="hud-desc">{current.roomDesc}</p>

            {onOpenEnquiry && (
              <button 
                type="button" 
                className="hud-action-btn"
                onClick={onOpenEnquiry}
              >
                <Eye size={14} />
                <span>BOOK A {current.label} DEMO</span>
              </button>
            )}
          </div>

        </div>

      </div>
    </section>
  );
};
