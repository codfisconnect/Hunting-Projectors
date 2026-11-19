import React from 'react';
import { ShieldCheck, Award, Headphones, Lock } from 'lucide-react';
import './TrustStrip.css';

export const TrustStrip: React.FC = () => {
  const trustItems = [
    {
      icon: <Award className="trust-icon" size={24} />,
      title: 'GENUINE PRODUCTS',
      subtitle: '100% Authentic Optical Hardware',
      description: 'Factory-direct optical engines and calibrated laser light sources.',
    },
    {
      icon: <ShieldCheck className="trust-icon" size={24} />,
      title: 'WARRANTY SUPPORT',
      subtitle: 'Official Direct Brand Coverage',
      description: 'Comprehensive warranty backed by NAP Computers in Chennai.',
    },
    {
      icon: <Headphones className="trust-icon" size={24} />,
      title: 'EXPERT ASSISTANCE',
      subtitle: 'Dedicated Projection Specialists',
      description: 'Personalized room throw, gain, and acoustic advice via WhatsApp or call.',
    },
    {
      icon: <Lock className="trust-icon" size={24} />,
      title: 'SECURE SHOPPING',
      subtitle: 'Protected Checkout & Invoicing',
      description: 'GST compliance, insured pan-India transit, and encrypted transactions.',
    },
  ];

  return (
    <section className="trust-strip-section" aria-label="NapComputers Trust and Assurances">
      <div className="container-wide trust-strip-container">
        <div className="trust-grid">
          {trustItems.map((item, index) => (
            <div key={index} className="trust-card">
              <div className="trust-icon-wrapper">
                {item.icon}
              </div>
              <div className="trust-content">
                <h3 className="trust-title">{item.title}</h3>
                <span className="trust-subtitle">{item.subtitle}</span>
                <p className="trust-description">{item.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
