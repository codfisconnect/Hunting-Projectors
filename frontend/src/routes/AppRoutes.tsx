import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { HomePage } from '../pages/Home/HomePage';
import { ProductsPage } from '../pages/Products/ProductsPage';
import { ProductDetailsPage } from '../pages/ProductDetails/ProductDetailsPage';
import { ComparePage } from '../pages/Compare/ComparePage';
import { ProjectorFinderPage } from '../pages/ProjectorFinder/ProjectorFinderPage';
import { ExperiencePage } from '../pages/Experience/ExperiencePage';
import { AboutPage } from '../pages/About/AboutPage';
import { SupportPage } from '../pages/Support/SupportPage';
import { ContactPage } from '../pages/Contact/ContactPage';
import { FAQPage } from '../pages/FAQ/FAQPage';
import { WarrantyPage } from '../pages/Warranty/WarrantyPage';
import { ShippingPage } from '../pages/Shipping/ShippingPage';
import { RefundPage } from '../pages/Refund/RefundPage';
import { PrivacyPage } from '../pages/Privacy/PrivacyPage';
import { TermsPage } from '../pages/Terms/TermsPage';
import { LoginPage } from '../pages/Auth/LoginPage';
import { RegisterPage } from '../pages/Auth/RegisterPage';
import { AccountPage } from '../pages/Account/AccountPage';
import { CheckoutPage } from '../pages/Checkout/CheckoutPage';
import { OrdersPage } from '../pages/Orders/OrdersPage';

interface AppRoutesProps {
  onOpenEnquiry: (productName?: string) => void;
}

export const AppRoutes: React.FC<AppRoutesProps> = ({ onOpenEnquiry }) => {
  return (
    <Routes>
      <Route path="/" element={<HomePage onOpenEnquiry={onOpenEnquiry} />} />
      <Route path="/products" element={<ProductsPage onOpenEnquiry={onOpenEnquiry} />} />
      <Route path="/products/:slug" element={<ProductDetailsPage onOpenEnquiry={onOpenEnquiry} />} />
      <Route path="/compare" element={<ComparePage onOpenEnquiry={onOpenEnquiry} />} />
      <Route path="/projector-finder" element={<ProjectorFinderPage onOpenEnquiry={onOpenEnquiry} />} />
      <Route path="/experience" element={<ExperiencePage onOpenEnquiry={onOpenEnquiry} />} />
      <Route path="/about" element={<AboutPage onOpenEnquiry={onOpenEnquiry} />} />
      <Route path="/support" element={<SupportPage onOpenEnquiry={onOpenEnquiry} />} />
      <Route path="/contact" element={<ContactPage />} />
      <Route path="/faq" element={<FAQPage onOpenEnquiry={onOpenEnquiry} />} />
      <Route path="/warranty" element={<WarrantyPage />} />
      <Route path="/shipping" element={<ShippingPage />} />
      <Route path="/refund" element={<RefundPage />} />
      <Route path="/privacy" element={<PrivacyPage />} />
      <Route path="/terms" element={<TermsPage />} />
      
      {/* Customer Commerce Routes */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/account" element={<AccountPage />} />
      <Route path="/checkout" element={<CheckoutPage />} />
      <Route path="/orders" element={<OrdersPage />} />

      {/* Catch-all */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};
