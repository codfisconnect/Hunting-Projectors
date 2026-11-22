import React, { useEffect } from 'react';
import { HeroExperience } from '../../components/home/HeroExperience/HeroExperience';
import { TrustStrip } from '../../components/home/TrustStrip/TrustStrip';
import { FeaturedProducts } from '../../components/home/FeaturedProducts/FeaturedProducts';
import { CinemaExperience } from '../../components/home/CinemaExperience/CinemaExperience';
import { IndiaDelivery } from '../../components/home/IndiaDelivery/IndiaDelivery';
import { SEOHead } from '../../components/common/SEOHead/SEOHead';
import { BUSINESS_CONFIG } from '../../config/businessConfig';
import './HomePage.css';

interface HomePageProps {
  onOpenEnquiry: (productName?: string) => void;
}

export const HomePage: React.FC<HomePageProps> = ({ onOpenEnquiry }) => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const organizationStructuredData = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: BUSINESS_CONFIG.brandName,
    alternateName: BUSINESS_CONFIG.companyName,
    url: 'https://huntingprojector.in',
    logo: 'https://huntingprojector.in/favicon.png',
    description: 'Direct brand supply of premium 4K laser cinema, ultra short throw, and high-brightness optical projectors by Nap Computers Electronicss, Chennai, India.',
    telephone: BUSINESS_CONFIG.phoneRaw,
    email: BUSINESS_CONFIG.email,
    address: {
      '@type': 'PostalAddress',
      streetAddress: `${BUSINESS_CONFIG.address.line1}, ${BUSINESS_CONFIG.address.line2}`,
      addressLocality: BUSINESS_CONFIG.address.city,
      addressRegion: BUSINESS_CONFIG.address.state,
      postalCode: BUSINESS_CONFIG.address.pincode,
      addressCountry: 'IN'
    },
    sameAs: [
      'https://napcomputers.in'
    ]
  };

  return (
    <div className="home-page-wrapper">
      <SEOHead
        title="Hunting Projector by Nap Computers Electronicss — 4K Laser & Cinema Optics"
        description="Direct brand supply of premium 4K laser cinema, ultra short throw, and smart portable projectors by Hunting Projector by Nap Computers Electronicss, Chennai, India. Pan-India express delivery."
        canonicalPath="/"
        structuredData={organizationStructuredData}
      />
      {/* Section 1 — Premium Cinematic Hero */}
      <HeroExperience onOpenEnquiry={() => onOpenEnquiry()} />

      {/* Section 2 — Trust Strip (Genuine Products, Warranty, Support, Security) */}
      <TrustStrip />

      {/* Section 3 — Featured Projectors (Real Database Catalog Data) */}
      <FeaturedProducts onOpenEnquiry={onOpenEnquiry} />

      {/* Section 4 — Cinematic Experience (Scale Simulation) */}
      <CinemaExperience onOpenEnquiry={() => onOpenEnquiry()} />

      {/* Section 5 — Direct Brand Hub & Pan-India Dispatch */}
      <IndiaDelivery />
    </div>
  );
};
