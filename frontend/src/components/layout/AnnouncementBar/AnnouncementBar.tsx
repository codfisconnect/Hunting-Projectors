import React from 'react';
import { siteConfig } from '../../../data/siteContent';
import './AnnouncementBar.css';

export const AnnouncementBar: React.FC = () => {
  if (!siteConfig.announcement.enabled) return null;

  return (
    <div className="announcement-bar" role="region" aria-label="Announcement">
      <div className="announcement-content">
        <span className="announcement-tag">{siteConfig.announcement.tag}</span>
        <span className="announcement-text">{siteConfig.announcement.text}</span>
      </div>
    </div>
  );
};
