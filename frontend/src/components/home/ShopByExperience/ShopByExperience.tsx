import React from 'react';
import { Link } from 'react-router-dom';
import { Film, Home, Gamepad2, Sparkles, ArrowRight, Compass } from 'lucide-react';
import './ShopByExperience.css';

interface ExperienceCategory {
  id: string;
  title: string;
  subtitle: string;
  badge: string;
  description: string;
  categoryQuery: string;
  icon: React.ReactNode;
}

const experiences: ExperienceCategory[] = [
  {
    id: 'home-cinema',
    title: 'Home Cinema',
    subtitle: 'ALPD Laser & True 4K Immersion',
    badge: 'DARK ROOM REFERENCE',
    description: 'Engineered for dedicated screening rooms and acoustic theaters with ultra-deep black levels and frame-by-frame HDR tone mapping.',
    categoryQuery: 'home-cinema',
    icon: <Film size={22} />,
  },
  {
    id: 'living-room',
    title: 'Living Room Entertainment',
    subtitle: 'High ANSI Lumens & Smart TV OS',
    badge: 'AMBIENT DAYLIGHT READY',
    description: 'Bright solid-state optical output designed to cut through ambient daylight, replacing standard TVs with screens up to 150 inches.',
    categoryQuery: 'smart-projectors',
    icon: <Home size={22} />,
  },
  {
    id: 'gaming',
    title: 'Pro Gaming & High Refresh',
    subtitle: '240Hz Speed & Sub-15ms Latency',
    badge: 'CONSOLE & PC OPTIMIZED',
    description: 'Ultra-low input lag and dedicated high-refresh modes for PlayStation 5, Xbox Series X, and high-performance gaming rigs.',
    categoryQuery: 'gaming',
    icon: <Gamepad2 size={22} />,
  },
  {
    id: 'compact-spaces',
    title: 'Compact & Bedroom Cinema',
    subtitle: 'Ultra Short Throw & Portable',
    badge: 'COMPACT ARCHITECTURE',
    description: 'Intelligent autofocus, omnidirectional keystone correction, and ultra-short throw optics tailored for space-conscious urban homes.',
    categoryQuery: 'portable',
    icon: <Compass size={22} />,
  },
];

export const ShopByExperience: React.FC = () => {
  return (
    <section className="shop-by-experience-section" aria-label="Shop by Experience">
      <div className="container-wide experience-section-container">
        <div className="experience-header-row">
          <div className="experience-title-group">
            <span className="eyebrow">
              <Sparkles size={12} />
              CURATED USE CASES
            </span>
            <h2 className="display-section">SHOP BY EXPERIENCE.</h2>
            <p className="experience-lead">
              Every room has unique ambient light, acoustic geometry, and viewing distance. Choose your primary setting to filter verified matching optics.
            </p>
          </div>

          <Link to="/products" className="btn-secondary experience-all-btn">
            <span>BROWSE ENTIRE CATALOG</span>
            <ArrowRight size={16} />
          </Link>
        </div>

        <div className="experience-grid">
          {experiences.map((exp) => (
            <Link
              key={exp.id}
              to={`/products?category=${exp.categoryQuery}`}
              className="experience-card"
            >
              <div className="exp-card-header">
                <div className="exp-icon-box">{exp.icon}</div>
                <span className="exp-badge">{exp.badge}</span>
              </div>

              <div className="exp-card-body">
                <h3 className="exp-title">{exp.title}</h3>
                <h4 className="exp-subtitle">{exp.subtitle}</h4>
                <p className="exp-desc">{exp.description}</p>
              </div>

              <div className="exp-card-footer">
                <span className="exp-action-text">EXPLORE COMPATIBLE MODELS</span>
                <div className="exp-arrow-circle">
                  <ArrowRight size={15} />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};
