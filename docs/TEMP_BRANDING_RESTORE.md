# Temporary Branding Restoration Plan — Nap Computers Electronicss -> Hunting Projectors

This document records the exact baseline and commit hashes required to safely restore the original **Hunting Projectors** branding once the temporary branding period concludes.

---

## 1. Commit Reference Points

- **Original Baseline Commit (Before Rebranding):**  
  `af0241aaeef47f43e3ff1c8feeafe9a50244ce2f`  
  *(Commit message: `fix(vercel): add SPA route rewrite configuration to frontend/vercel.json`)*

- **Customer-Facing Branding Update Commit:**  
  `953f32bf580c53e6318ec697f412f8bf85ed4ee2`  
  *(Commit message: `chore(branding): rebrand website as Nap Computers Electronicss`)*

- **Dedicated Temporary Branding Finalization Commit:**  
  `e62c38373c1785eeaa46fc799868f347cdc324b7`  
  *(Commit message: `chore(branding): temporarily rebrand as Nap Computers Electronicss`)*

- **Remaining Customer-Facing Branding References Commit:**  
  `93f52c3a505fae223fa8c35292a472c914bfadab`  
  *(Commit message: `chore(branding): complete remaining customer-facing references to Nap Computers Electronicss`)*

- **Announcement Ribbon Removal & Header Brand Display Fix Commit:**  
  `778f1a6b57434879ceec2e49a88fa1caf90e23b8`  
  *(Commit message: `fix(branding): remove announcement ribbon and correct brand display`)*

---

## 2. Modified Files in Temporary Branding

1. `frontend/index.html` — Updated title & meta tags to Nap Computers Electronicss.
2. `frontend/src/data/siteContent.ts` — Updated `brand.name` to `Nap Computers` and `brand.subname` to `Electronicss`, set `announcement.enabled` to `false`, plus default enquiry & WhatsApp copy.
3. `frontend/src/App.tsx` — Removed AnnouncementBar component import & rendering block; Concierge floating button text and aria-label.
4. `frontend/src/components/layout/Navbar/Navbar.tsx` — Updated brand aria-label.
5. `frontend/src/components/layout/Footer/Footer.tsx` — Updated copyright text to:  
   `© 2026 Nap Computers Electronicss. All Rights Reserved. | NAP Computers | Web by Codfis Technologies`
6. `frontend/src/components/product/ProductPurchasePanel/ProductPurchasePanel.tsx` — Purchase header badge.
7. `frontend/src/components/home/FeaturedProducts/FeaturedProducts.tsx` — Section aria-label.
8. `frontend/src/components/home/IndiaDelivery/IndiaDelivery.tsx` — Direct entity description.
9. `frontend/src/components/common/CartDrawer/CartDrawer.tsx` — WhatsApp order inquiry copy.
10. `frontend/src/components/common/EnquiryModal/EnquiryModal.tsx` — WhatsApp demo inquiry copy.
11. `frontend/src/data/faqs.ts` — Brand FAQ description and answers.
12. `frontend/src/pages/ProjectorFinder/ProjectorFinderPage.tsx` — WhatsApp consultation copy.
13. Customer-facing pages:
    - `frontend/src/pages/Home/HomePage.tsx`
    - `frontend/src/pages/Experience/ExperiencePage.tsx`
    - `frontend/src/pages/Contact/ContactPage.tsx`
    - `frontend/src/pages/FAQ/FAQPage.tsx`
    - `frontend/src/pages/ProductDetails/ProductDetailsPage.tsx`
    - `frontend/src/pages/About/AboutPage.tsx`
    - `frontend/src/pages/Shipping/ShippingPage.tsx`
    - `frontend/src/pages/Refund/RefundPage.tsx`
    - `frontend/src/pages/Privacy/PrivacyPage.tsx`
    - `frontend/src/pages/Warranty/WarrantyPage.tsx`
    - `frontend/src/pages/Terms/TermsPage.tsx`
    - `frontend/src/pages/Checkout/CheckoutPage.tsx`

---

## 3. How to Restore Original Branding (Safe Revert Procedure)

When you are ready to restore the original **Hunting Projectors** branding, run the following safe Git commands.  
*Do NOT use `git reset --hard` or force-push so other work is never lost.*

```powershell
Set-Location "D:\VS Code - Actual\Hunting-Projectors"

# 1. Fetch latest remote state
git fetch origin

# 2. Revert the temporary branding commits cleanly without destroying subsequent work
git revert --no-edit 778f1a6b57434879ceec2e49a88fa1caf90e23b8 93f52c3a505fae223fa8c35292a472c914bfadab e62c38373c1785eeaa46fc799868f347cdc324b7 953f32bf580c53e6318ec697f412f8bf85ed4ee2

# 3. Validate frontend build
Set-Location "frontend"
npm run build
Set-Location ".."

# 4. Push the restoration commit to main
git push origin main
```

Upon pushing, Vercel will automatically trigger a new deployment and restore the original **Hunting Projectors** branding.
