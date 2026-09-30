import React from 'react';
import { Truck, Headphones, Wrench, ShieldCheck, MapPin, ArrowRight } from 'lucide-react';
import { siteConfig, getWhatsAppLink, getPhoneLink } from '../../../data/siteContent';
import './IndiaDelivery.css';

export const IndiaDelivery: React.FC = () => {
  const pillars = [
    {
      icon: <Truck size={22} />,
      title: 'PAN-INDIA DELIVERY',
      sub: 'Insured Doorstep Dispatch',
      desc: 'Reinforced protective transit cases engineered for delicate optical components. Dispatched directly from our Chennai central facility to all serviceable pin codes across India.',
    },
    {
      icon: <Headphones size={22} />,
      title: 'DIRECT BRAND SUPPORT',
      sub: 'Chennai Technical Team',
      desc: 'No automated bots or outsourced call centers. Consult directly with optical projection specialists who know lens throw physics, screen gains, and room acoustic optimization.',
    },
    {
      icon: <Wrench size={22} />,
      title: 'FACTORY SERVICE',
      sub: 'Genuine Optical Spares',
      desc: 'Direct access to OEM optical engines, DMD chips, cooling fans, and laser phosphor units without relying on third-party gray market repair shops.',
    },
    {
      icon: <ShieldCheck size={22} />,
      title: 'OFFICIAL WARRANTY',
      sub: 'Backed by NAP Computers',
      desc: 'Every Hunting projector includes an official direct warranty card operated and honored by NAP Computers & Electronics in Chennai, Tamil Nadu.',
    },
  ];

  return (
    <section className="india-delivery-section" aria-label="Pan-India Brand Supply and Logistics">
      <div className="container-wide india-container">
        
        {/* Main Banner Grid */}
        <div className="india-grid">
          
          {/* Left: Content & Positioning */}
          <div className="india-content-pane">
            <span className="eyebrow">
              <MapPin size={12} />
              DIRECT FROM CHENNAI, INDIA
            </span>

            <h2 className="display-title india-headline">
              MADE FOR INDIA.<br />
              DELIVERED ACROSS INDIA.
            </h2>

            <p className="india-lead">
              Hunting Projectors operates as a direct brand entity, cutting out commercial layers to provide cutting-edge 4K optical projection at unmatched factory value.
            </p>

            <div className="india-entity-tag">
              <span className="entity-tag-label">BUSINESS ENTITY:</span>
              <span className="entity-tag-val">{siteConfig.entity.owner} • {siteConfig.entity.locationLabel}</span>
            </div>

            <div className="india-action-row">
              <a 
                href={getWhatsAppLink()} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="btn-whatsapp"
              >
                <span>CONSULT VIA WHATSAPP</span>
              </a>

              <a href={getPhoneLink()} className="btn-secondary">
                <span>CALL CHENNAI HEADQUARTERS</span>
              </a>
            </div>
          </div>

          {/* Right: Abstract Indian Map & Logistics Hubs Graphic */}
          <div className="india-map-pane">
            <div className="map-visual-box">
              <svg viewBox="0 0 400 480" className="abstract-india-svg" fill="none" xmlns="http://www.w3.org/2000/svg">
                {/* Abstract Geometric India Map Outline */}
                <path 
                  d="M 180 30 L 220 50 L 250 80 L 220 120 L 260 150 L 290 190 L 330 200 L 310 240 L 260 250 L 240 290 L 230 350 L 200 420 L 190 450 L 180 420 L 150 350 L 130 310 L 110 270 L 80 250 L 90 200 L 120 180 L 150 160 L 140 120 L 160 80 Z" 
                  stroke="#262D3D" 
                  strokeWidth="1.5" 
                  strokeDasharray="4 4"
                  fill="rgba(157, 220, 255, 0.02)"
                />

                {/* Hub: Chennai (HQ - Pulsing Strong) */}
                <g transform="translate(210, 370)">
                  <circle cx="0" cy="0" r="18" fill="rgba(157, 220, 255, 0.15)">
                    <animate attributeName="r" values="8;24;8" dur="2.5s" repeatCount="indefinite"/>
                    <animate attributeName="opacity" values="0.8;0;0.8" dur="2.5s" repeatCount="indefinite"/>
                  </circle>
                  <circle cx="0" cy="0" r="7" fill="#9DDCFF" />
                  <circle cx="0" cy="0" r="3" fill="#08090B" />
                  <text x="14" y="4" fill="#9DDCFF" fontFamily="Inter, sans-serif" fontSize="10" fontWeight="800" letterSpacing="1">CHENNAI HQ</text>
                  <text x="14" y="16" fill="#6C7480" fontFamily="Inter, sans-serif" fontSize="8">NAP Computers & Electronics</text>
                </g>

                {/* Dispatch Transit Lines from Chennai */}
                <line x1="210" y1="370" x2="160" y2="350" stroke="#9DDCFF" strokeWidth="1" strokeDasharray="3 3" opacity="0.6"/>
                <line x1="210" y1="370" x2="120" y2="280" stroke="#9DDCFF" strokeWidth="1" strokeDasharray="3 3" opacity="0.6"/>
                <line x1="210" y1="370" x2="190" y2="150" stroke="#9DDCFF" strokeWidth="1" strokeDasharray="3 3" opacity="0.6"/>
                <line x1="210" y1="370" x2="270" y2="240" stroke="#9DDCFF" strokeWidth="1" strokeDasharray="3 3" opacity="0.6"/>
                <line x1="210" y1="370" x2="180" y2="300" stroke="#9DDCFF" strokeWidth="1" strokeDasharray="3 3" opacity="0.6"/>

                {/* Major Delivery Hubs */}
                <circle cx="160" cy="350" r="4" fill="#C8FF38" />
                <text x="145" y="342" fill="#C8FF38" fontFamily="Inter, sans-serif" fontSize="8" textAnchor="end">Bengaluru</text>

                <circle cx="120" cy="280" r="4" fill="#E7E8EA" />
                <text x="105" y="280" fill="#E7E8EA" fontFamily="Inter, sans-serif" fontSize="8" textAnchor="end">Mumbai</text>

                <circle cx="180" cy="300" r="4" fill="#E7E8EA" />
                <text x="190" y="304" fill="#E7E8EA" fontFamily="Inter, sans-serif" fontSize="8">Hyderabad</text>

                <circle cx="190" cy="150" r="4" fill="#E7E8EA" />
                <text x="200" y="152" fill="#E7E8EA" fontFamily="Inter, sans-serif" fontSize="8">Delhi NCR</text>

                <circle cx="270" cy="240" r="4" fill="#E7E8EA" />
                <text x="280" y="244" fill="#E7E8EA" fontFamily="Inter, sans-serif" fontSize="8">Kolkata</text>

                <circle cx="170" cy="420" r="4" fill="#E7E8EA" />
                <text x="155" y="424" fill="#E7E8EA" fontFamily="Inter, sans-serif" fontSize="8" textAnchor="end">Kochi</text>
              </svg>

              <div className="map-badge-corner">
                <span className="all-india-tag">ALL PIN CODES SERVICED</span>
                <span className="all-india-sub">Doorstep delivery & insured transit</span>
              </div>
            </div>
          </div>

        </div>

        {/* 4 Value Pillars Grid */}
        <div className="pillars-grid">
          {pillars.map((pillar, i) => (
            <div key={i} className="pillar-card">
              <div className="pillar-icon-box">{pillar.icon}</div>
              <h3 className="pillar-title">{pillar.title}</h3>
              <span className="pillar-sub">{pillar.sub}</span>
              <p className="pillar-desc">{pillar.desc}</p>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
