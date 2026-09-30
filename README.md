# HUNTING PROJECTORS
### Interactive Premium Technology Showroom & E-Commerce Platform

> **Brand Identity:** HUNTING PROJECTORS  
> **Brand Position:** Direct Projector Brand & Manufacturer-side Technology Business  
> **Owned, Supplied & Operated by:** NAP Computers & Electronics, Chennai, Tamil Nadu, India  
> **Aesthetic Direction:** Automotive Luxury + Editorial Cinema + Interactive Digital Showroom (Deep Graphite, Product Silver, Warm White, Subtle Ice Blue)

---

## 1. Project Overview

**Hunting Projectors** is a direct-to-consumer technology brand offering high-performance optical projection systems engineered for modern Indian living rooms, dedicated private cinemas, and mobile setups.

This repository contains:
1. **Frontend (`/frontend`)**: A production-grade, agency-level React 19 + TypeScript + Vite web application featuring 360° product rotation, Three.js real-time 3D PBR viewport, GSAP scroll-driven storytelling, interactive environment room showroom, guided projector finder, side-by-side comparison matrix, localized cart/wishlist drawers, and direct WhatsApp/Phone enquiry flows.
2. **Backend (`/backend`)**: A modular Node.js + Express + TypeScript service architecture with a complete Prisma PostgreSQL schema, RESTful API controllers, typed response utilities, and mock demo data ready for full commerce expansion.

---

## 2. Directory Structure

```text
Hunting-Projectors/
├── frontend/
│   ├── public/
│   │   ├── assets/
│   │   │   └── products/
│   │   │       ├── 360/              # 16-frame 360° rotation sequences
│   │   │       ├── vision-x1.svg
│   │   │       ├── cinema-x4.svg
│   │   │       ├── ultra-pro.svg
│   │   │       ├── neo-air.svg
│   │   │       └── horizon-max.svg
│   │   └── favicon.svg
│   ├── src/
│   │   ├── assets/
│   │   ├── components/
│   │   │   ├── common/              # Accordion, Badge, Button, Modal, Drawer, Marquee
│   │   │   ├── home/                # HeroExperience, ProductReveal, HuntingShowroom, CinemaExperience, IndiaDelivery, etc.
│   │   │   ├── layout/              # Navbar, Footer (with NAP Computers info), AnnouncementBar, MobileDrawer
│   │   │   └── product/             # ProductViewer360 (Image sequence & Three.js 3D), ProductCard, ProductSpecs, etc.
│   │   ├── context/                 # CartContext, WishlistContext (localStorage persisted)
│   │   ├── data/                    # siteContent.ts, products.ts, categories.ts, testimonials.ts, faqs.ts
│   │   ├── hooks/                   # useScrollProgress, useProductRotation, useMediaQuery
│   │   ├── pages/                   # Home, Products, ProductDetails, Compare, ProjectorFinder, About, Experience, Support, Contact, Warranty, Shipping, Refund, Privacy, Terms, FAQ
│   │   ├── routes/                  # AppRoutes.tsx (15 routes)
│   │   ├── services/                # api.ts (VITE_API_BASE_URL with graceful fallback), productService.ts, enquiryService.ts
│   │   ├── styles/                  # variables.css, global.css, typography & layout resets
│   │   ├── types/                   # product.ts, category.ts, enquiry.ts, navigation.ts
│   │   ├── App.tsx
│   │   └── main.tsx
│   ├── package.json
│   ├── tsconfig.json
│   └── vite.config.ts
│
├── backend/
│   ├── prisma/
│   │   └── schema.prisma            # PostgreSQL schema: User, Product, Category, Image, Spec, Enquiry, Review, Wishlist, Cart, Order
│   ├── src/
│   │   ├── config/                  # env.ts
│   │   ├── controllers/             # product, category, enquiry, review
│   │   ├── middleware/              # errorHandler.ts, notFoundHandler
│   │   ├── routes/                  # index.ts, productRoutes, categoryRoutes, enquiryRoutes, reviewRoutes
│   │   ├── services/                # productService, categoryService, enquiryService, reviewService
│   │   ├── types/                   # typed request/response and model interfaces
│   │   ├── utils/                   # response.ts standard formatter
│   │   ├── app.ts                   # Express app with CORS & routes
│   │   └── server.ts                # Server startup entry point
│   ├── .env.example
│   ├── package.json
│   └── tsconfig.json
│
└── README.md
```

---

## 3. Technology Stack

### Frontend
- **Framework:** React 19 + TypeScript
- **Bundler:** Vite 6
- **Routing:** React Router DOM 7
- **Motion & Interactions:** GSAP 3 (ScrollTrigger, TweenLite), Custom Momentum Physics
- **3D Graphics:** Three.js (PBR physically based rendering material, directional key/rim lights, shadow planes)
- **Icons:** Lucide React
- **Styling:** Modular CSS architecture with CSS Custom Properties design system

### Backend
- **Runtime:** Node.js (ES2022 / NodeNext)
- **Framework:** Express 5
- **Language:** TypeScript
- **Database ORM:** Prisma 5 (PostgreSQL-ready schema)
- **Utilities:** CORS, Dotenv

---

## 4. Key Design & Feature Highlights

1. **Editorial & Automotive Tech Aesthetics:**
   - Palette: Deep Graphite (`#08090B`), Charcoal (`#111317`), Product Silver (`#E7E8EA`), Soft White (`#F5F4EF`), subtle Ice Blue (`#9DDCFF`), micro Acid Lime (`#C8FF38`).
   - Clean typographical contrast pairing ultra-large display headlines (*"SEE BEYOND."*, *"LIGHT CHANGES EVERYTHING."*) with crisp technical metrics.

2. **Dual-Mode 360° Product Viewer:**
   - **Interactive 16-Frame Orbit:** Drag/touch scrub with inertia physics, rotation angle HUD, perspective angle presets (`0° Front`, `45° Three-Quarter`, `90° Profile`, `180° Rear Ports`, `315° Reverse Angle`), and auto-spin mode.
   - **Real-Time Three.js WebGL Engine:** Procedural metallic PBR casing, optical multi-element glass lens, golden flare ring, ventilation baffles, and interactive orbit controls.

3. **Digital Showroom (`HuntingShowroom`):**
   - Live room environment switcher: **Living Room** (ambient balanced lighting), **Home Cinema** (deep cinema blackout, vivid high contrast), and **Gaming Room** (ultra-low latency neon/mood lighting).

4. **Dynamic Cinema Size Simulator (`CinemaExperience`):**
   - Live scale comparison slider: **80"**, **100"**, **120"**, and **150"** diagonal displays with calculated throw distance, seating distance, and visual comparison against standard 55" & 65" TV sets.

5. **Guided Projector Finder (`/projector-finder`):**
   - 3-step interactive advisor matching viewing application (Cinema, Gaming, Home, Business, Outdoor), room dimensions (Small, Medium, Large), and budget brackets (₹5K–₹15K up to ₹50K+).

6. **Side-by-Side Comparison Engine (`/compare`):**
   - Select up to 3 models simultaneously to compare 12+ technical attributes: resolution, ANSI lumens, light engine, throw ratio, smart OS, audio output, HDMI/USB ports, and warranty coverage.

7. **Direct WhatsApp & Phone Consultation Flow:**
   - Centralized contact configuration (`siteContent.ts`) powering instant WhatsApp direct chat, click-to-call links, and quick-enquiry modals with zero dead buttons.

8. **Brand & Supplier Transparency:**
   - Primary brand: **HUNTING PROJECTORS**.
   - Operating entity: **NAP Computers & Electronics**, Chennai, Tamil Nadu, India — prominently and respectfully attributed in the footer, company info, and Pan-India delivery sections.

---

## 5. Getting Started Locally

### Prerequisites
- Node.js (v18 or higher recommended)
- npm or pnpm

### 1. Frontend Setup
```bash
# Navigate to frontend
cd frontend

# Install dependencies
npm install

# Start Vite development server
npm run dev
```
The frontend will start at: `http://localhost:5173`

To build the frontend for production:
```bash
npm run build
npm run preview
```

### 2. Backend Setup
```bash
# Navigate to backend
cd backend

# Install dependencies
npm install

# (Optional) Copy environment variables
cp .env.example .env

# Build TypeScript
npm run build

# Start development server
npm run dev
```
The backend API server will run at: `http://localhost:4000`  
Health check endpoint: `http://localhost:4000/api/health`

---

## 6. Available Routes

| Route | Page | Purpose |
|---|---|---|
| `/` | **Home** | Immersive hero, 360 viewer, 4-frame reveal, showroom, cinema scale simulator, featured models |
| `/products` | **Catalog** | Filterable catalog by category, resolution, brightness, price, and usage |
| `/products/:slug` | **Product Details** | Interactive 360 viewer, technical specs, port map, package contents, reviews, related models |
| `/compare` | **Comparison** | Up to 3 models side-by-side with highlight differences |
| `/projector-finder` | **Projector Finder** | 3-step guided matching engine with instant recommendation |
| `/experience` | **Showroom** | Standalone immersive showroom and screen scale visualizer |
| `/about` | **About Hunting** | Brand philosophy, optical engineering, and Chennai operating headquarters |
| `/support` | **Support Hub** | Pan-India support contacts, direct WhatsApp, ticket submission, downloads |
| `/contact` | **Contact & Enquiry** | Contact form, showroom address, map preview, and direct channels |
| `/faq` | **FAQ** | Categorized accordion guide for first-time projector buyers |
| `/warranty` | **Warranty Policy** | Standard brand coverage and direct warranty service terms |
| `/shipping` | **Shipping & Delivery** | Pan-India transit terms, courier tracking, insured transit |
| `/refund` | **Refund & Cancellation** | Inspection guidelines, transit damage replacement, and return terms |
| `/privacy` | **Privacy Policy** | Customer data handling & privacy disclosure |
| `/terms` | **Terms of Service** | Brand usage, warranty guidelines, and legal jurisdiction (Chennai) |

---

## 7. Centralized Configuration

All company details, contact information, phone numbers, and WhatsApp numbers are configured in:
`frontend/src/data/siteContent.ts`

```typescript
export const siteConfig = {
  company: {
    brandName: 'Hunting Projectors',
    supplier: 'NAP Computers & Electronics',
    tagline: 'See Beyond.',
    city: 'Chennai',
    state: 'Tamil Nadu',
    country: 'India',
    address: 'Chennai, Tamil Nadu, India',
    operatingNote: 'Supplied, Owned and Operated by NAP Computers & Electronics',
  },
  contact: {
    phone: '+91 90422 92929',
    phoneDisplay: '+91 90422 92929',
    whatsapp: '919042292929',
    whatsappDisplay: '+91 90422 92929',
    email: 'support@huntingprojectors.com',
    enquiryEmail: 'sales@huntingprojectors.com',
  },
  // ...
};
```
Updating this single file automatically updates all headers, footers, CTAs, modal prompts, and WhatsApp links across the entire application.

---

## 8. Backend API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/health` | Service health status and operating entity verification |
| `GET` | `/api/products` | Retrieve all products (supports `?category=` and `?q=`) |
| `GET` | `/api/products/:slug` | Retrieve single product with full specs, gallery, highlights |
| `GET` | `/api/categories` | Retrieve all product categories with product counts |
| `POST` | `/api/enquiries` | Submit customer quote request or enquiry |
| `POST` | `/api/contact` | Submit contact form message |
| `GET` | `/api/reviews` | Retrieve customer demo reviews |
| `GET` | `/api/reviews/product/:id`| Retrieve reviews filtered by model |
| `POST` | `/api/reviews` | Submit new customer review |

---

## 9. Future Production Expansion

When ready to transition from client demo to full commerce:
1. Provision a PostgreSQL instance (e.g., Supabase, Neon, AWS RDS) and populate `DATABASE_URL` in `backend/.env`.
2. Run `npx prisma migrate dev` to generate migrations from `backend/prisma/schema.prisma`.
3. Integrate Razorpay / Cashfree SDK in `backend/src/controllers/orderController.ts`.
4. Switch `frontend/src/services/api.ts` from fallback mock data to live server responses.

---

*HUNTING PROJECTORS — Direct from brand owner. Chennai, Tamil Nadu, India.*
