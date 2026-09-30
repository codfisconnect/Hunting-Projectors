import React from 'react';
import { Star, MessageSquareQuote, CheckCircle2 } from 'lucide-react';
import { testimonials } from '../../../data/testimonials';
import './ReviewsSection.css';

export const ReviewsSection: React.FC = () => {
  return (
    <section className="reviews-section" aria-label="Customer Experiences and Reviews">
      <div className="container-wide reviews-container">
        
        {/* Header */}
        <div className="reviews-header text-center">
          <span className="eyebrow">OWNER PERSPECTIVES</span>
          <h2 className="display-section">EXPERIENCED IN LIVING ROOMS & PRIVATE CINEMAS.</h2>
          <p className="reviews-sub">
            Read demo feedback from early adopters across Chennai, Bengaluru, Hyderabad, and Mumbai who experienced the Hunting optical difference.
          </p>
          <span className="reviews-demo-disclaimer">
            * Displaying representative demo feedback for concept illustration.
          </span>
        </div>

        {/* Testimonials Grid */}
        <div className="reviews-grid">
          {testimonials.map(item => (
            <div key={item.id} className="review-card">
              <div className="review-card-top">
                <div className="stars-row">
                  {Array.from({ length: item.rating }).map((_, i) => (
                    <Star key={i} size={14} fill="#C8FF38" color="#C8FF38" />
                  ))}
                </div>
                <span className="review-env-badge">{item.environment}</span>
              </div>

              <h4 className="review-title">"{item.reviewTitle}"</h4>
              <p className="review-body">{item.comment}</p>

              <div className="review-author-row">
                <div className="author-info">
                  <span className="author-name">{item.name}</span>
                  <span className="author-loc">{item.location}</span>
                </div>
                <div className="author-verified">
                  <CheckCircle2 size={14} className="verified-icon" />
                  <span>{item.projectorModel}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
