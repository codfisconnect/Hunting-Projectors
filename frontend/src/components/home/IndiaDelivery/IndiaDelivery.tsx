import React from 'react';
import { Truck, Headphones, Wrench, ShieldCheck, MapPin, ArrowRight } from 'lucide-react';
import { siteConfig, getWhatsAppLink, getPhoneLink } from '../../../data/siteContent';
import './IndiaDelivery.css';

export const IndiaDelivery: React.FC = () => {
  const pillars = [
    {
      icon: <Truck size={20} />,
      title: 'PAN-INDIA DELIVERY',
      sub: 'Insured Doorstep Dispatch',
      desc: 'Protective transit cases direct from Chennai to all Indian PIN codes.',
    },
    {
      icon: <Headphones size={20} />,
      title: 'DIRECT BRAND SUPPORT',
      sub: 'Chennai Technical Team',
      desc: 'Direct consultation with optical engineers for room throw & gain setup.',
    },
    {
      icon: <Wrench size={20} />,
      title: 'FACTORY SERVICE',
      sub: 'Genuine Optical Spares',
      desc: 'Direct OEM laser engines, DMD chips, and certified brand maintenance.',
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
              Hunting Projector operates as a direct brand entity by Nap Computers Electronicss, cutting out commercial layers to provide cutting-edge 4K optical projection at unmatched factory value.
            </p>

            <div className="india-entity-tag">
              <span className="entity-tag-label">BUSINESS ENTITY:</span>
              <span className="entity-tag-val">Nap Computers Electronicss • Chennai, Tamil Nadu</span>
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
                {/* Recognizable Geographical India Map Silhouette */}
                <path 
                  d="M 165 42 L 182 32 L 196 46 L 210 50 L 216 70 L 206 82 L 202 96 L 212 110 L 230 118 L 244 134 L 268 142 L 278 156 L 298 160 L 322 170 L 334 186 L 330 200 L 312 208 L 298 220 L 282 220 L 266 226 L 254 242 L 248 266 L 246 290 L 238 316 L 234 340 L 222 368 L 210 398 L 194 434 L 188 448 L 184 438 L 178 406 L 166 376 L 154 346 L 140 318 L 126 292 L 112 268 L 92 254 L 84 240 L 88 224 L 102 214 L 118 206 L 128 190 L 138 174 L 142 152 L 148 136 L 154 116 L 150 96 L 152 74 Z" 
                  stroke="rgba(212, 175, 55, 0.45)" 
                  strokeWidth="1.75" 
                  strokeDasharray="5 3"
                  fill="rgba(212, 175, 55, 0.03)"
                />

                {/* Hub: Chennai (HQ - Pulsing Strong) */}
                <g transform="translate(210, 370)">
                  <circle cx="0" cy="0" r="18" fill="rgba(212, 175, 55, 0.15)">
                    <animate attributeName="r" values="8;24;8" dur="2.5s" repeatCount="indefinite"/>
                    <animate attributeName="opacity" values="0.8;0;0.8" dur="2.5s" repeatCount="indefinite"/>
                  </circle>
                  <circle cx="0" cy="0" r="7" fill="#D4AF37" />
                  <circle cx="0" cy="0" r="3" fill="#0C0D10" />
                  <text x="14" y="4" fill="#E6CA65" fontFamily="Inter, sans-serif" fontSize="10" fontWeight="800" letterSpacing="1">CHENNAI HQ</text>
                  <text x="14" y="16" fill="#9DA3AE" fontFamily="Inter, sans-serif" fontSize="8">Nap Computers Electronicss</text>
                </g>

                {/* Dispatch Transit Lines from Chennai */}
                <line x1="210" y1="370" x2="160" y2="350" stroke="#D4AF37" strokeWidth="1" strokeDasharray="3 3" opacity="0.6"/>
                <line x1="210" y1="370" x2="120" y2="280" stroke="#D4AF37" strokeWidth="1" strokeDasharray="3 3" opacity="0.6"/>
                <line x1="210" y1="370" x2="190" y2="150" stroke="#D4AF37" strokeWidth="1" strokeDasharray="3 3" opacity="0.6"/>
                <line x1="210" y1="370" x2="270" y2="240" stroke="#D4AF37" strokeWidth="1" strokeDasharray="3 3" opacity="0.6"/>
                <line x1="210" y1="370" x2="180" y2="300" stroke="#D4AF37" strokeWidth="1" strokeDasharray="3 3" opacity="0.6"/>

                {/* Major Delivery Hubs */}
                <circle cx="160" cy="350" r="4" fill="#D4AF37" />
                <text x="145" y="342" fill="#E6CA65" fontFamily="Inter, sans-serif" fontSize="8" textAnchor="end">Bengaluru</text>

                <circle cx="120" cy="280" r="4" fill="#E5E7EB" />
                <text x="105" y="280" fill="#E5E7EB" fontFamily="Inter, sans-serif" fontSize="8" textAnchor="end">Mumbai</text>

                <circle cx="180" cy="300" r="4" fill="#E5E7EB" />
                <text x="190" y="304" fill="#E5E7EB" fontFamily="Inter, sans-serif" fontSize="8">Hyderabad</text>

                <circle cx="190" cy="150" r="4" fill="#E5E7EB" />
                <text x="200" y="152" fill="#E5E7EB" fontFamily="Inter, sans-serif" fontSize="8">Delhi NCR</text>

                <circle cx="270" cy="240" r="4" fill="#E5E7EB" />
                <text x="280" y="244" fill="#E5E7EB" fontFamily="Inter, sans-serif" fontSize="8">Kolkata</text>

                <circle cx="170" cy="420" r="4" fill="#E5E7EB" />
                <text x="155" y="424" fill="#E5E7EB" fontFamily="Inter, sans-serif" fontSize="8" textAnchor="end">Kochi</text>
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
