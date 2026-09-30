import React, { useEffect } from 'react';
import { ProjectorFinderSection } from '../../components/home/ProjectorFinderSection/ProjectorFinderSection';
import { Sparkles, Compass, ShieldCheck, Phone } from 'lucide-react';
import { siteConfig, getPhoneLink, getWhatsAppLink } from '../../data/siteContent';
import './ProjectorFinderPage.css';

interface ProjectorFinderPageProps {
  onOpenEnquiry: (productName?: string) => void;
}

export const ProjectorFinderPage: React.FC<ProjectorFinderPageProps> = ({ onOpenEnquiry }) => {
  useEffect(() => {
    document.title = 'FIND YOUR HUNTING — Guided Projector Match Engine';
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="projector-finder-page">
      <ProjectorFinderSection standalone onOpenEnquiry={onOpenEnquiry} />

      {/* Supporting Architectural Advice Section */}
      <div className="container finder-support-container">
        <div className="finder-support-card">
          <div className="support-card-left">
            <span className="eyebrow">CUSTOM ARCHITECTURAL CONSULTATION</span>
            <h3 className="support-card-title">Need a Custom Room Calculation?</h3>
            <p className="support-card-desc">
              Have non-standard ceiling heights, sloping walls, glass French doors, or existing motorized drop-down screens? Our Chennai technical engineering team prepares custom optical throw diagrams and ALR screen recommendations.
            </p>
          </div>

          <div className="support-card-actions">
            <a 
              href={getWhatsAppLink('Hello Hunting Projectors! I need a custom throw distance and ambient lighting calculation for my room dimensions.')} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="btn-whatsapp"
            >
              <span>SEND ROOM MEASUREMENTS ON WHATSAPP</span>
            </a>
            <a href={getPhoneLink()} className="btn-secondary">
              <Phone size={15} />
              <span>CALL {siteConfig.contact.phoneDisplay}</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
