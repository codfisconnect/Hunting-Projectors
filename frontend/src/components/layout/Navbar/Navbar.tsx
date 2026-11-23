import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Search, Heart, ShoppingBag, Menu, X, MessageSquare, User as UserIcon } from 'lucide-react';
import { useCart } from '../../../context/CartContext';
import { useWishlist } from '../../../context/WishlistContext';
import { useAuth } from '../../../context/AuthContext';
import { siteConfig } from '../../../data/siteContent';
import './Navbar.css';

interface NavbarProps {
  onOpenSearch: () => void;
  onOpenEnquiry: (productName?: string) => void;
  onToggleMobileMenu: () => void;
  isMobileMenuOpen: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  onOpenSearch,
  onOpenEnquiry,
  onToggleMobileMenu,
  isMobileMenuOpen,
}) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();
  const { user } = useAuth();
  const { totalItems, setIsCartOpen } = useCart();
  const { wishlist, setIsWishlistOpen } = useWishlist();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { label: 'PROJECTORS', path: '/products' },
    { label: 'EXPERIENCE', path: '/experience' },
    { label: 'COMPARE', path: '/compare' },
    { label: 'FIND YOUR MATCH', path: '/projector-finder' },
    { label: 'ABOUT', path: '/about' },
    { label: 'SUPPORT', path: '/support' },
  ];

  return (
    <header className={`navbar-header ${isScrolled ? 'scrolled' : ''}`}>
      <div className="container-wide navbar-container">
        
        {/* Brand Identity with Circular Logo */}
        <Link to="/" className="navbar-brand" aria-label="Hunting Projector by Nap Computers Electronicss Home">
          <img
            src="/assets/hunting-projectors-logo-nav.png"
            alt="Hunting Projector Logo"
            className="navbar-brand-logo"
            width="44"
            height="44"
          />
          <div className="navbar-brand-text">
            <span className="brand-primary">HUNTING PROJECTOR</span>
            <span className="brand-secondary">by Nap Computers Electronicss</span>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="navbar-nav" aria-label="Main Navigation">
          <ul className="nav-list">
            {navLinks.map(link => {
              const isActive = location.pathname === link.path;
              return (
                <li key={link.path} className="nav-item">
                  <Link 
                    to={link.path} 
                    className={`nav-link ${isActive ? 'active' : ''}`}
                  >
                    {link.label}
                    {isActive && <span className="nav-active-pip" />}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Right Utilities */}
        <div className="navbar-actions">
          {/* Quick Search */}
          <button 
            type="button" 
            className="action-btn" 
            onClick={onOpenSearch}
            aria-label="Search projectors"
            title="Search Projectors"
          >
            <Search size={19} />
          </button>

          {/* Wishlist */}
          <button 
            type="button" 
            className="action-btn" 
            onClick={() => setIsWishlistOpen(true)}
            aria-label="Saved projectors wishlist"
            title="Wishlist"
          >
            <Heart size={19} />
            {wishlist.length > 0 && (
              <span className="action-badge">{wishlist.length}</span>
            )}
          </button>

          {/* Cart */}
          <button 
            type="button" 
            className="action-btn" 
            onClick={() => setIsCartOpen(true)}
            aria-label="Shopping Cart"
            title="Cart"
          >
            <ShoppingBag size={19} />
            {totalItems > 0 && (
              <span className="action-badge">{totalItems}</span>
            )}
          </button>

          {/* Account */}
          <Link
            to={user ? "/account" : "/login"}
            className={`action-btn action-btn-account ${user ? 'logged-in' : ''}`}
            aria-label={user ? `Client Account (${user.fullName})` : "Client Sign In"}
            title={user ? `Signed in as ${user.fullName}` : "Client Sign In"}
          >
            <UserIcon size={20} className="account-icon-svg" />
            {user && <span className="account-status-dot" />}
          </Link>

          {/* Direct Enquiry / WhatsApp CTA */}
          <button
            type="button"
            className="navbar-enquire-btn"
            onClick={() => onOpenEnquiry()}
            title="Direct Brand Enquiry"
          >
            <MessageSquare size={14} />
            <span>ENQUIRE</span>
          </button>

          {/* Mobile Menu Toggle Button */}
          <button 
            type="button" 
            className="mobile-toggle-btn"
            onClick={onToggleMobileMenu}
            aria-label={isMobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

      </div>
    </header>
  );
};
