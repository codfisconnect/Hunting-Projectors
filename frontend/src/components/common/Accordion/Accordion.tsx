import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import './Accordion.css';

export interface AccordionItem {
  id: string;
  title: string;
  content: string;
  category?: string;
}

interface AccordionProps {
  items: AccordionItem[];
  allowMultiple?: boolean;
}

export const Accordion: React.FC<AccordionProps> = ({ items, allowMultiple = false }) => {
  const [openIds, setOpenIds] = useState<string[]>([items[0]?.id || '']);

  const toggleItem = (id: string) => {
    if (allowMultiple) {
      setOpenIds(prev => 
        prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
      );
    } else {
      setOpenIds(prev => (prev.includes(id) ? [] : [id]));
    }
  };

  return (
    <div className="accordion-wrapper">
      {items.map(item => {
        const isOpen = openIds.includes(item.id);
        return (
          <div key={item.id} className={`accordion-row ${isOpen ? 'open' : ''}`}>
            <button
              type="button"
              className="accordion-trigger"
              onClick={() => toggleItem(item.id)}
              aria-expanded={isOpen}
            >
              <span className="accordion-title">{item.title}</span>
              <ChevronDown size={18} className="accordion-icon" />
            </button>
            {isOpen && (
              <div className="accordion-panel">
                <p className="accordion-content-text">{item.content}</p>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};
