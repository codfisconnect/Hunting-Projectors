import React, { useState, useEffect } from 'react';
import { faqs } from '../../data/faqs';
import { Accordion } from '../../components/common/Accordion/Accordion';
import { HelpCircle, Sparkles, MessageCircle, Phone } from 'lucide-react';
import { siteConfig, getWhatsAppLink, getPhoneLink } from '../../data/siteContent';
import './FAQPage.css';

interface FAQPageProps {
  onOpenEnquiry: (productName?: string) => void;
}

export const FAQPage: React.FC<FAQPageProps> = ({ onOpenEnquiry }) => {
  const [activeCategory, setActiveCategory] = useState<string>('all');

  useEffect(() => {
    document.title = 'FREQUENTLY ASKED QUESTIONS — Hunting Projectors';
    window.scrollTo(0, 0);
  }, []);

  const categories = [
    { id: 'all', label: 'All Questions' },
    { id: 'general', label: 'Brand & Fundamentals' },
    { id: 'selection', label: 'Choosing a Model' },
    { id: 'technical', label: 'Room & Throw Distance' },
    { id: 'delivery', label: 'Pan-India Delivery' },
    { id: 'support', label: 'Warranty & Demos' },
  ];

  const filteredFaqs = faqs.filter(f => 
    activeCategory === 'all' ? true : f.category === activeCategory
  ).map(f => ({
    id: f.id,
    title: f.question,
    content: f.answer,
    category: f.categoryLabel,
  }));

  return (
    <div className="faq-page">
      <div className="container faq-container">
        
        {/* Header */}
        <header className="faq-hero text-center">
          <span className="eyebrow">
            <HelpCircle size={13} />
            KNOWLEDGE BASE
          </span>
          <h1 className="display-title">FREQUENTLY ASKED QUESTIONS.</h1>
          <p className="faq-hero-lead">
            Everything you need to know about Hunting optical architecture, room placement, screen selection, pan-India delivery, and direct warranty.
          </p>
        </header>

        {/* Category Filter Chips */}
        <div className="faq-categories-bar">
          {categories.map(cat => (
            <button
              key={cat.id}
              type="button"
              className={`faq-cat-chip ${activeCategory === cat.id ? 'active' : ''}`}
              onClick={() => setActiveCategory(cat.id)}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Accordion Questions */}
        <div className="faq-accordion-container">
          <Accordion items={filteredFaqs} />
        </div>

        {/* Still have questions card */}
        <div className="faq-contact-card">
          <div className="faq-contact-left">
            <span className="eyebrow">DIRECT SPECIALIST CONSULTATION</span>
            <h3 className="faq-card-title">Can't Find Your Exact Question?</h3>
            <p className="faq-card-text">
              Our optical projection engineers in Chennai are happy to calculate custom throw distances or answer audio receiver compatibility questions.
            </p>
          </div>
          <div className="faq-contact-actions">
            <a 
              href={getWhatsAppLink()} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="btn-whatsapp"
            >
              <MessageCircle size={16} />
              <span>ASK ON WHATSAPP</span>
            </a>
            <button
              type="button"
              className="btn-secondary"
              onClick={() => onOpenEnquiry('Technical FAQ Inquiry')}
            >
              SUBMIT INQUIRY
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
