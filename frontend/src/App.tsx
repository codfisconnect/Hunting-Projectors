import React, { useState } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { MessageCircle } from 'lucide-react';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { WishlistProvider } from './context/WishlistContext';
import { AnnouncementBar } from './components/layout/AnnouncementBar/AnnouncementBar';
import { Navbar } from './components/layout/Navbar/Navbar';
import { MobileDrawer } from './components/layout/MobileDrawer/MobileDrawer';
import { Footer } from './components/layout/Footer/Footer';
import { SearchModal } from './components/common/SearchModal/SearchModal';
import { EnquiryModal } from './components/common/EnquiryModal/EnquiryModal';
import { CartDrawer } from './components/common/CartDrawer/CartDrawer';
import { WishlistDrawer } from './components/common/WishlistDrawer/WishlistDrawer';
import { AppRoutes } from './routes/AppRoutes';
import { siteConfig, getWhatsAppLink } from './data/siteContent';
import './styles/global.css';

export const App: React.FC = () => {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isEnquiryOpen, setIsEnquiryOpen] = useState(false);
  const [selectedEnquiryProduct, setSelectedEnquiryProduct] = useState<string | undefined>(undefined);

  const handleOpenEnquiry = (productName?: string) => {
    setSelectedEnquiryProduct(productName);
    setIsEnquiryOpen(true);
  };

  return (
    <BrowserRouter>
      <AuthProvider>
        <CartProvider>
          <WishlistProvider>
            <div className="hunting-app-root">
            
            {/* 1. Top Announcement Bar */}
            <AnnouncementBar />

            {/* 2. Global Navbar */}
            <Navbar
              onOpenSearch={() => setIsSearchOpen(true)}
              onOpenEnquiry={handleOpenEnquiry}
              onToggleMobileMenu={() => setIsMobileMenuOpen(prev => !prev)}
              isMobileMenuOpen={isMobileMenuOpen}
            />

            {/* 3. Mobile Navigation Fullscreen Drawer */}
            <MobileDrawer
              isOpen={isMobileMenuOpen}
              onClose={() => setIsMobileMenuOpen(false)}
              onOpenEnquiry={() => handleOpenEnquiry()}
            />

            {/* 4. Global Search Modal */}
            <SearchModal
              isOpen={isSearchOpen}
              onClose={() => setIsSearchOpen(false)}
            />

            {/* 5. Direct Enquiry & Showroom Demo Modal */}
            <EnquiryModal
              isOpen={isEnquiryOpen}
              onClose={() => {
                setIsEnquiryOpen(false);
                setSelectedEnquiryProduct(undefined);
              }}
              initialProduct={selectedEnquiryProduct}
            />

            {/* 6. Shopping Cart Drawer */}
            <CartDrawer
              onOpenEnquiry={handleOpenEnquiry}
            />

            {/* 7. Wishlist Drawer */}
            <WishlistDrawer
              onOpenEnquiry={handleOpenEnquiry}
            />

            {/* 8. Main Application Routes Viewport */}
            <main className="hunting-main-viewport">
              <AppRoutes onOpenEnquiry={handleOpenEnquiry} />
            </main>

            {/* 9. Global Luxury Footer */}
            <Footer />

            {/* 10. Sticky WhatsApp Floating Concierge Button */}
            <a
              href={getWhatsAppLink()}
              target="_blank"
              rel="noopener noreferrer"
              className="sticky-whatsapp-bubble"
              aria-label="Chat directly with Hunting Projectors specialist on WhatsApp"
              title="Chat with Chennai Specialist"
            >
              <div className="whatsapp-bubble-icon">
                <MessageCircle size={24} />
              </div>
              <span className="whatsapp-bubble-text">HUNTING CONCIERGE</span>
            </a>

          </div>
        </WishlistProvider>
      </CartProvider>
    </AuthProvider>
  </BrowserRouter>
  );
};

export default App;
