import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Film, 
  Gamepad2, 
  Home, 
  Briefcase, 
  Trees, 
  ArrowRight, 
  RefreshCcw, 
  Sparkles, 
  Check, 
  ShoppingBag,
  ExternalLink
} from 'lucide-react';
import { getProducts } from '../../../services/productService';
import { Product } from '../../../types/product';
import { useCart } from '../../../context/CartContext';
import './ProjectorFinderSection.css';

interface ProjectorFinderSectionProps {
  onOpenEnquiry?: (productName: string) => void;
  standalone?: boolean;
}

export const ProjectorFinderSection: React.FC<ProjectorFinderSectionProps> = ({
  onOpenEnquiry,
  standalone = false,
}) => {
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
  const [watching, setWatching] = useState<string>('movies');
  const [space, setSpace] = useState<string>('medium');
  const [budget, setBudget] = useState<string>('30k-50k');
  const [catalog, setCatalog] = useState<Product[]>([]);
  const { addToCart } = useCart();

  useEffect(() => {
    let isMounted = true;
    getProducts()
      .then(res => {
        if (isMounted && res.products.length > 0) {
          setCatalog(res.products);
        }
      })
      .catch(err => {
        console.warn('Finder products load:', err);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const activePool = catalog;

  // Watch Options
  const watchingOptions = [
    { id: 'movies', label: 'Movies & Cinema', icon: <Film size={18} />, desc: 'Films, OTT series, reference color & contrast' },
    { id: 'gaming', label: 'Console & PC Gaming', icon: <Gamepad2 size={18} />, desc: 'High refresh rate, 120Hz/240Hz, ultra-low lag' },
    { id: 'home', label: 'Everyday Family Living Room', icon: <Home size={18} />, desc: 'Sports, daylight TV replacement, kids entertainment' },
    { id: 'business', label: 'Commercial & Boardrooms', icon: <Briefcase size={18} />, desc: 'High-lumen presentations, meeting halls' },
    { id: 'outdoor', label: 'Outdoor, Travel & Terrace', icon: <Trees size={18} />, desc: 'Portable battery-compatible, bedroom ceiling' },
  ];

  // Space Options
  const spaceOptions = [
    { id: 'small', label: 'Small Space (100–180 sq.ft)', desc: 'Bedrooms, studio apartments, or compact throw (< 2.2m)' },
    { id: 'medium', label: 'Medium Living Hall (180–350 sq.ft)', desc: 'Standard Indian living rooms, 2.5m to 3.5m throw distance' },
    { id: 'large', label: 'Large Hall or Dedicated Cinema (350+ sq.ft)', desc: 'Spacious halls or dedicated dark acoustic theater rooms' },
  ];

  // Budget Options
  const budgetOptions = [
    { id: '5k-15k', label: '₹15,000 – ₹25,000', desc: 'Entry smart portable & compact starter' },
    { id: '25k-50k', label: '₹25,000 – ₹50,000', desc: 'Core 4K smart home cinema & ultra-clear daily' },
    { id: '50k-80k', label: '₹50,000 – ₹80,000', desc: 'High-refresh pro gaming & high-lumen commercial' },
    { id: '80k-plus', label: '₹80,000 – ₹1,50,000+', desc: 'Flagship ALPD laser & Triple-Laser Ultra Short Throw' },
  ];

  // Smart Recommendation Engine
  const calculateMatch = (): Product[] => {
    if (watching === 'outdoor' || budget === '5k-15k') {
      const match = activePool.find(p => p.slug === 'hunting-h200' || p.category === 'portable') || activePool[activePool.length - 1];
      return [match];
    }
    if (watching === 'gaming' || watching === 'business' || budget === '50k-80k') {
      const match = activePool.find(p => p.slug === 'hunting-h700' || p.category === 'gaming') || activePool[1] || activePool[0];
      return [match];
    }
    if (budget === '80k-plus' || space === 'large') {
      const match = activePool.find(p => p.slug === 'hunting-h900' || p.isFlagship) || activePool[0];
      return [match];
    }
    // Default Flagship / Core Cinema
    const match = activePool.find(p => p.slug === 'hunting-h500' || p.isBestSeller) || activePool[0];
    return [match];
  };

  const matchedProducts = calculateMatch();
  const primaryMatch = matchedProducts[0] || activePool[0];

  const handleReset = () => {
    setStep(1);
    setWatching('movies');
    setSpace('medium');
    setBudget('25k-50k');
  };

  return (
    <section className={`finder-section ${standalone ? 'finder-standalone' : ''}`} aria-label="Projector Finder Tool">
      <div className="container finder-container">
        
        {/* Title */}
        <div className="finder-header-center">
          <span className="eyebrow">
            <Sparkles size={13} />
            GUIDED DISCOVERY ENGINE
          </span>
          <h2 className="display-title">FIND YOUR HUNTING.</h2>
          <p className="finder-subtitle">
            Answer 3 quick architectural questions to identify the exact optical system engineered for your space.
          </p>
        </div>

        {/* Step Indicator */}
        <div className="finder-steps-nav">
          <div className={`step-circle ${step >= 1 ? 'active' : ''}`}>1</div>
          <div className={`step-connector ${step >= 2 ? 'filled' : ''}`} />
          <div className={`step-circle ${step >= 2 ? 'active' : ''}`}>2</div>
          <div className={`step-connector ${step >= 3 ? 'filled' : ''}`} />
          <div className={`step-circle ${step >= 3 ? 'active' : ''}`}>3</div>
          <div className={`step-connector ${step === 4 ? 'filled' : ''}`} />
          <div className={`step-circle ${step === 4 ? 'match-circle' : ''}`}>
            {step === 4 ? <Check size={14} /> : '★'}
          </div>
        </div>

        {/* Finder Card Body */}
        <div className="finder-card-box">
          
          {/* STEP 1: What are you watching? */}
          {step === 1 && (
            <div className="finder-step-content">
              <span className="step-tag">QUESTION 01 OF 03</span>
              <h3 className="step-question">WHAT ARE YOU WATCHING?</h3>
              
              <div className="finder-options-grid">
                {watchingOptions.map(opt => (
                  <button
                    key={opt.id}
                    type="button"
                    className={`finder-option-btn ${watching === opt.id ? 'selected' : ''}`}
                    onClick={() => setWatching(opt.id)}
                  >
                    <div className="option-icon-box">{opt.icon}</div>
                    <div className="option-text-box">
                      <span className="option-title">{opt.label}</span>
                      <span className="option-desc">{opt.desc}</span>
                    </div>
                  </button>
                ))}
              </div>

              <div className="finder-step-footer">
                <button 
                  type="button" 
                  className="btn-primary" 
                  onClick={() => setStep(2)}
                >
                  <span>NEXT: ROOM SPACE</span>
                  <ArrowRight size={16} />
                </button>
              </div>
            </div>
          )}

          {/* STEP 2: What is your space? */}
          {step === 2 && (
            <div className="finder-step-content">
              <span className="step-tag">QUESTION 02 OF 03</span>
              <h3 className="step-question">WHAT IS YOUR SPACE?</h3>

              <div className="finder-options-grid columns-1">
                {spaceOptions.map(opt => (
                  <button
                    key={opt.id}
                    type="button"
                    className={`finder-option-btn ${space === opt.id ? 'selected' : ''}`}
                    onClick={() => setSpace(opt.id)}
                  >
                    <div className="option-text-box">
                      <span className="option-title">{opt.label}</span>
                      <span className="option-desc">{opt.desc}</span>
                    </div>
                  </button>
                ))}
              </div>

              <div className="finder-step-footer">
                <button 
                  type="button" 
                  className="btn-ghost" 
                  onClick={() => setStep(1)}
                >
                  Back
                </button>
                <button 
                  type="button" 
                  className="btn-primary" 
                  onClick={() => setStep(3)}
                >
                  <span>NEXT: BUDGET RANGE</span>
                  <ArrowRight size={16} />
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: What is your budget? */}
          {step === 3 && (
            <div className="finder-step-content">
              <span className="step-tag">QUESTION 03 OF 03</span>
              <h3 className="step-question">WHAT IS YOUR BUDGET?</h3>

              <div className="finder-options-grid columns-2">
                {budgetOptions.map(opt => (
                  <button
                    key={opt.id}
                    type="button"
                    className={`finder-option-btn ${budget === opt.id ? 'selected' : ''}`}
                    onClick={() => setBudget(opt.id)}
                  >
                    <div className="option-text-box">
                      <span className="option-title">{opt.label}</span>
                      <span className="option-desc">{opt.desc}</span>
                    </div>
                  </button>
                ))}
              </div>

              <div className="finder-step-footer">
                <button 
                  type="button" 
                  className="btn-ghost" 
                  onClick={() => setStep(2)}
                >
                  Back
                </button>
                <button 
                  type="button" 
                  className="btn-primary" 
                  onClick={() => setStep(4)}
                >
                  <span>CALCULATE YOUR MATCH</span>
                  <Sparkles size={16} />
                </button>
              </div>
            </div>
          )}

          {/* STEP 4: YOUR MATCH RESULT */}
          {step === 4 && (
            <div className="finder-result-content">
              <div className="result-top-status">
                <span className="match-eyebrow">YOUR PERFECT HUNTING MATCH</span>
                <button 
                  type="button" 
                  className="reset-quiz-btn" 
                  onClick={handleReset}
                  title="Retake Quiz"
                >
                  <RefreshCcw size={13} />
                  <span>Start Over</span>
                </button>
              </div>

              {!primaryMatch ? (
                <div style={{ padding: '60px 20px', textAlign: 'center', color: 'var(--text-secondary)' }}>
                  Analyzing catalog for optimal match...
                </div>
              ) : (
                <div className="result-card-inner">
                  {/* Product Showcase */}
                  <div className="result-visual-stage">
                  <div className="result-ambient-disc" />
                  <img 
                    src={primaryMatch.images.hero} 
                    alt={primaryMatch.name} 
                    className="result-projector-img"
                  />
                  <span className="result-match-score">99% ROOM COMPATIBILITY</span>
                </div>

                {/* Details & Action */}
                <div className="result-info-pane">
                  <div className="result-category-chip">{primaryMatch.categoryLabel}</div>
                  <h3 className="result-name">{primaryMatch.name}</h3>
                  <p className="result-pitch">{primaryMatch.shortDescription}</p>

                  <div className="result-specs-row">
                    <div className="r-spec">
                      <span className="r-label">RESOLUTION</span>
                      <span className="r-val">{primaryMatch.specifications.resolution.split(' ')[0]}</span>
                    </div>
                    <div className="r-spec">
                      <span className="r-label">LUMINANCE</span>
                      <span className="r-val">{primaryMatch.specifications.brightness.split(' ')[0]}</span>
                    </div>
                    <div className="r-spec">
                      <span className="r-label">THROW RATIO</span>
                      <span className="r-val">{primaryMatch.specifications.throwRatio.split(' ')[0]}</span>
                    </div>
                  </div>

                  <div className="result-price-strip">
                    <div>
                      <span className="r-price-tag">DIRECT DEMO PRICING</span>
                      <div className="r-price">₹{primaryMatch.price.toLocaleString('en-IN')}</div>
                    </div>
                  </div>

                  <div className="result-action-buttons">
                    <button
                      type="button"
                      className="btn-primary"
                      onClick={() => addToCart(primaryMatch)}
                    >
                      <ShoppingBag size={16} />
                      <span>ADD TO CART</span>
                    </button>

                    <Link 
                      to={`/products/${primaryMatch.slug}`} 
                      className="btn-secondary"
                    >
                      <span>INSPECT 360° & SPECS</span>
                      <ExternalLink size={15} />
                    </Link>

                    {onOpenEnquiry && (
                      <button
                        type="button"
                        className="btn-ghost"
                        onClick={() => onOpenEnquiry(primaryMatch.name)}
                      >
                        Enquire via Chennai Specialist
                      </button>
                    )}
                  </div>
                </div>
              </div>
              )}

            </div>
          )}

        </div>

      </div>
    </section>
  );
};
