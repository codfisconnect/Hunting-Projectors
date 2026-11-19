import React, { useState, useEffect } from 'react';
import { siteConfig } from '../../../data/siteContent';
import { getPublicCms } from '../../../services/cmsService';
import './AnnouncementBar.css';

export const AnnouncementBar: React.FC = () => {
  const [announcementText, setAnnouncementText] = useState<string>(siteConfig.announcement.text);
  const [visible, setVisible] = useState<boolean>(siteConfig.announcement.enabled);

  useEffect(() => {
    let isMounted = true;
    getPublicCms()
      .then(cms => {
        if (!isMounted) return;
        if (cms.cms_announcement) {
          const text = typeof cms.cms_announcement === 'string'
            ? cms.cms_announcement
            : cms.cms_announcement.text;
          if (text && text.trim().length > 0) {
            setAnnouncementText(text.trim());
            setVisible(true);
          }
        }
      })
      .catch(() => {});

    return () => {
      isMounted = false;
    };
  }, []);

  if (!visible) return null;

  return (
    <div className="announcement-bar" role="region" aria-label="Announcement">
      <div className="announcement-content">
        <span className="announcement-tag">{siteConfig.announcement.tag}</span>
        <span className="announcement-text">{announcementText}</span>
      </div>
    </div>
  );
};
