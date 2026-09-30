import React, { useEffect } from 'react';
import { HeroExperience } from '../../components/home/HeroExperience/HeroExperience';
import { ProductReveal } from '../../components/home/ProductReveal/ProductReveal';
import { HuntingShowroom } from '../../components/showroom/HuntingShowroom/HuntingShowroom';
import { CinemaExperience } from '../../components/home/CinemaExperience/CinemaExperience';
import { FeaturedProducts } from '../../components/home/FeaturedProducts/FeaturedProducts';
import { ProjectorFinderSection } from '../../components/home/ProjectorFinderSection/ProjectorFinderSection';
import { IndiaDelivery } from '../../components/home/IndiaDelivery/IndiaDelivery';
import { ReviewsSection } from '../../components/home/ReviewsSection/ReviewsSection';
import { BrandStory } from '../../components/home/BrandStory/BrandStory';
import './HomePage.css';

interface HomePageProps {
  onOpenEnquiry: (productName?: string) => void;
}

export const HomePage: React.FC<HomePageProps> = ({ onOpenEnquiry }) => {
  useEffect(() => {
    document.title = 'HUNTING PROJECTORS — See Beyond. Light Changes Everything.';
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="home-page-wrapper">
      {/* 1. Hero Experience (Opening Viewport) */}
      <HeroExperience onOpenEnquiry={() => onOpenEnquiry()} />

      {/* 2. Product as the Main Character (Scroll Reveal) */}
      <ProductReveal />

      {/* 3. 3D Digital Showroom (Living Room, Home Cinema, Gaming) */}
      <HuntingShowroom onOpenEnquiry={() => onOpenEnquiry()} />

      {/* 4. Cinema Experience (80" to 150" scale expansion) */}
      <CinemaExperience onOpenEnquiry={() => onOpenEnquiry()} />

      {/* 5. Featured Products (Choose Your Experience) */}
      <FeaturedProducts onOpenEnquiry={onOpenEnquiry} />

      {/* 6. Guided Projector Finder Quiz */}
      <ProjectorFinderSection onOpenEnquiry={onOpenEnquiry} />

      {/* 7. Pan-India Delivery & Logistics Map */}
      <IndiaDelivery />

      {/* 8. Owner Perspectives & Verified Demo Testimonials */}
      <ReviewsSection />

      {/* 9. Brand Manifesto & NAP Computers Operating Relationship */}
      <BrandStory />
    </div>
  );
};
