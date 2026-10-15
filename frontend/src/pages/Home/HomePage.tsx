import React, { useEffect } from 'react';
import { HeroExperience } from '../../components/home/HeroExperience/HeroExperience';
import { FeaturedProducts } from '../../components/home/FeaturedProducts/FeaturedProducts';
import { CinemaExperience } from '../../components/home/CinemaExperience/CinemaExperience';
import { IndiaDelivery } from '../../components/home/IndiaDelivery/IndiaDelivery';
import './HomePage.css';

interface HomePageProps {
  onOpenEnquiry: (productName?: string) => void;
}

export const HomePage: React.FC<HomePageProps> = ({ onOpenEnquiry }) => {
  useEffect(() => {
    document.title = 'HUNTING PROJECTORS — 4K Laser & Cinema Optics Direct from Chennai';
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="home-page-wrapper">
      {/* Section 1 — Premium Cinematic Hero */}
      <HeroExperience onOpenEnquiry={() => onOpenEnquiry()} />

      {/* Section 2 — Featured Projectors (Real Catalog Data) */}
      <FeaturedProducts onOpenEnquiry={onOpenEnquiry} />

      {/* Section 3 — Cinematic Experience (Scale Simulation) */}
      <CinemaExperience onOpenEnquiry={() => onOpenEnquiry()} />

      {/* Section 4 — Simple Verified Trust Strip */}
      <IndiaDelivery />
    </div>
  );
};
