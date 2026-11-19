import React, { useEffect } from 'react';
import { HeroExperience } from '../../components/home/HeroExperience/HeroExperience';
import { TrustStrip } from '../../components/home/TrustStrip/TrustStrip';
import { FeaturedProducts } from '../../components/home/FeaturedProducts/FeaturedProducts';
import { CinemaExperience } from '../../components/home/CinemaExperience/CinemaExperience';
import { IndiaDelivery } from '../../components/home/IndiaDelivery/IndiaDelivery';
import './HomePage.css';

interface HomePageProps {
  onOpenEnquiry: (productName?: string) => void;
}

export const HomePage: React.FC<HomePageProps> = ({ onOpenEnquiry }) => {
  useEffect(() => {
    document.title = 'Hunting Projectors by NAP Computers Electronics — 4K Laser & Cinema Optics Direct from Chennai';
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="home-page-wrapper">
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
