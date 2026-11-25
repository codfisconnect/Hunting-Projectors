import React from 'react';
import { ShieldCheck, Award, Headphones, Lock } from 'lucide-react';
import './TrustStrip.css';

export const TrustStrip: React.FC = () => {
  const trustItems = [
    {
      icon: <Award className="trust-icon" size={20} />,
      title: 'Genuine Products',
      subtitle: '100% Authentic Hardware',
    },
    {
      icon: <ShieldCheck className="trust-icon" size={20} />,
      title: 'Warranty Support',
      subtitle: 'Official Brand Coverage',
    },
    {
      icon: <Headphones className="trust-icon" size={20} />,
      title: 'Expert Assistance',
      subtitle: 'Dedicated Specialists',
    },
    {
      icon: <Lock className="trust-icon" size={20} />,
      title: 'Secure Shopping',
      subtitle: 'Protected Checkout',
    },
  ];

  return (
    <section className="trust-strip-section" aria-label="Nap Computers Electronicss Trust and Assurances">
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
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
