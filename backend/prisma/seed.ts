import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('--- Starting Development Database Seed for Hunting Projectors ---');
  console.log('Notice: All seeded products and specifications are sample development fixtures.');

  // 1. Seed Core Projector Categories
  const categoriesData = [
    {
      slug: 'home-cinema',
      name: 'Home Cinema',
      subtitle: 'Living Room & Private Cinema',
      description: 'High-contrast cinematic projectors engineered for dedicated theater rooms and darkened living spaces.',
      featuredSpecs: ['Native 1080p / 4K UHD', 'High Dynamic Contrast', 'Dolby Audio Decoding'],
      isActive: true,
    },
    {
      slug: 'gaming',
      name: 'Gaming',
      subtitle: 'High-Refresh Rate & Low-Lag Console/PC Gaming',
      description: 'Ultra-low input lag high-refresh projection systems engineered for competitive PS5, Xbox, and PC setups.',
      featuredSpecs: ['240Hz Refresh Rate', '4.2ms Low Input Lag', 'Dedicated Game HUD Mode'],
      isActive: true,
    },
    {
      slug: 'portable',
      name: 'Portable',
      subtitle: 'Compact & Outdoor Smart Projectors',
      description: 'Lightweight grab-and-go projectors with built-in acoustics and smart streaming for bedroom and outdoor use.',
      featuredSpecs: ['Ultra-Compact Form Factor', 'Instant Autofocus', 'Dual-Band Wi-Fi & Bluetooth'],
      isActive: true,
    },
    {
      slug: 'smart-projectors',
      name: 'Smart Projectors',
      subtitle: 'All-In-One Intelligent Optical Systems',
      description: 'Smart projectors featuring integrated streaming apps, voice controls, and automated screen calibration.',
      featuredSpecs: ['Certified Smart OS', 'Auto Keystone & Avoidance', 'Optical Zoom'],
      isActive: true,
    },
    {
      slug: 'business',
      name: 'Business',
      subtitle: 'Commercial Presentations & Conference Halls',
      description: 'High-lumen optical engines designed for daylight visibility in executive boardrooms and training halls.',
      featuredSpecs: ['High-Lumen Output', 'Crestron / AMX Control', 'Dual HDMI & USB'],
      isActive: true,
    },
  ];

  const categoryMap = new Map<string, string>();

  for (const cat of categoriesData) {
    const upserted = await prisma.category.upsert({
      where: { slug: cat.slug },
      update: {
        name: cat.name,
        subtitle: cat.subtitle,
        description: cat.description,
        featuredSpecs: cat.featuredSpecs,
        isActive: cat.isActive,
      },
      create: cat,
    });
    categoryMap.set(cat.slug, upserted.id);
    console.log(`[Seed] Category ready: ${cat.name} (${cat.slug})`);
  }

  // 2. Seed Fictional Hunting Sample Models
  const sampleProducts = [
    {
      name: 'Hunting H200',
      slug: 'hunting-h200',
      sku: 'HP-H200-DEMO',
      subtitle: 'Development Sample: Entry-Level Compact Smart Projector',
      tagline: 'Fictional Demo Model for Development Testing',
      categorySlug: 'portable',
      price: 9999,
      mrp: 14999,
      stock: 25,
      isNew: true,
      isFlagship: false,
      isBestSeller: false,
      isFeatured: false,
      badge: 'STARTER SMART',
      availability: 'in-stock',
      warranty: '1 Year Brand Warranty (Development Fixture)',
      shortDescription: 'Development sample entry portable projector for bedroom streaming and compact spaces.',
      description: [
        'Notice: This is sample development fixture data for testing the Hunting Projectors backend API.',
        'The Hunting H200 is an entry-level compact portable projector designed for lightweight travel and bedroom viewing.',
      ],
      whatsIncluded: ['Hunting H200 Projector (Demo)', 'Power Adapter', 'IR Remote Control', 'Quick Start Guide'],
      recommendedUse: ['Bedroom Cinema', 'Casual Streaming', 'Travel / Camping'],
      idealRoomSize: 'small',
      idealLighting: 'darkened-room',
      rating: 4.6,
      reviewsCount: 12,
      specifications: {
        resolution: 'Native 1080p FHD (1920 × 1080)',
        supportedResolution: 'Up to 1080p @ 60Hz',
        brightness: '800 ANSI Lumens (Demo Metric)',
        lightSource: 'Solid-State LED Engine',
        displayTechnology: 'Single LCD Optical Architecture',
        contrastRatio: '2,000:1 Static',
        projectionSize: '40" – 120" Diagonal',
        throwRatio: '1.35:1',
        operatingSystem: 'Hunting Smart OS (Android Core)',
        audio: 'Integrated 5W Chamber Speaker',
        connectivity: ['HDMI 1.4', 'USB 2.0', 'Wi-Fi 5', 'Bluetooth 5.0'],
        dimensions: '160 × 140 × 110 mm',
        weight: '1.2 kg',
        powerConsumption: '65W',
        noiseLevel: '< 28 dB',
        lampLifeHours: '30,000+ Hours LED Life',
        focusType: 'Manual Focus Ring',
        keystoneCorrection: 'Vertical ±30° Electronic',
        refreshRate: '60Hz',
        inputLag: '35ms',
      },
      images: [
        { url: '/assets/products/hunting-neo-air-hero.svg', altText: 'Hunting H200 Hero View (Demo)', viewType: 'hero', sortOrder: 0 },
        { url: '/assets/products/hunting-neo-air-angled.svg', altText: 'Hunting H200 Angled View (Demo)', viewType: 'angled', sortOrder: 1 },
        { url: '/assets/products/hunting-neo-air-back.svg', altText: 'Hunting H200 Rear Ports (Demo)', viewType: 'back', sortOrder: 2 },
      ],
    },
    {
      name: 'Hunting H500',
      slug: 'hunting-h500',
      sku: 'HP-H500-DEMO',
      subtitle: 'Development Sample: High-Brightness Home Theater Projector',
      tagline: 'Fictional Demo Model for Development Testing',
      categorySlug: 'home-cinema',
      price: 24999,
      mrp: 34999,
      stock: 18,
      isNew: false,
      isFlagship: false,
      isBestSeller: true,
      isFeatured: true,
      badge: 'POPULAR CHOICE',
      availability: 'in-stock',
      warranty: '2 Years Official Brand Warranty (Demo)',
      shortDescription: 'Core high-lumen living room projector delivering sharp high-contrast visuals with autofocus.',
      description: [
        'Notice: This is sample development fixture data for testing the Hunting Projectors backend API.',
        'The Hunting H500 represents the sweet spot for modern living rooms, combining high ANSI brightness with automatic optical alignment.',
      ],
      whatsIncluded: ['Hunting H500 Projector (Demo)', 'Bluetooth Voice Remote', 'High-Speed HDMI Cable', 'Power Cord', 'Lens Cap'],
      recommendedUse: ['Living Room Cinema', 'Sports & Cricket Broadcasts', 'Family Streaming'],
      idealRoomSize: 'medium',
      idealLighting: 'ambient-light',
      rating: 4.8,
      reviewsCount: 38,
      specifications: {
        resolution: 'Native 1080p FHD (4K Input Decoding)',
        supportedResolution: 'Up to 4K UHD @ 60Hz',
        brightness: '2,200 ANSI Lumens (Demo Metric)',
        lightSource: 'High-Efficiency Dual LED Engine',
        displayTechnology: '0.33" DMD DLP Optical System',
        contrastRatio: '500,000:1 Dynamic Contrast',
        projectionSize: '60" – 180" Diagonal',
        throwRatio: '1.2:1 Optical Throw Ratio',
        operatingSystem: 'Hunting Smart OS (Android TV Core)',
        audio: 'Dual 10W Neodymium Drivers, Dolby Digital',
        connectivity: ['HDMI 2.0 × 2', 'USB 2.0 × 2', 'Optical Audio Out', 'Dual-Band Wi-Fi', 'Bluetooth 5.2'],
        dimensions: '210 × 200 × 135 mm',
        weight: '2.8 kg',
        powerConsumption: '110W',
        noiseLevel: '< 25 dB (Whisper Quiet)',
        lampLifeHours: '30,000+ Hours Solid-State Life',
        focusType: 'ToF Laser Auto Focus',
        keystoneCorrection: 'Automatic 6-Point Geometric Correction',
        refreshRate: '60Hz / 120Hz Support',
        inputLag: '22ms Game Mode',
        hdr: 'HDR10 / HLG Decoding',
      },
      images: [
        { url: '/assets/products/hunting-cinema-x4-hero.svg', altText: 'Hunting H500 Hero (Demo)', viewType: 'hero', sortOrder: 0 },
        { url: '/assets/products/hunting-cinema-x4-angled.svg', altText: 'Hunting H500 Angled (Demo)', viewType: 'angled', sortOrder: 1 },
        { url: '/assets/products/hunting-cinema-x4-back.svg', altText: 'Hunting H500 Ports (Demo)', viewType: 'back', sortOrder: 2 },
        { url: '/assets/products/hunting-cinema-x4-top.svg', altText: 'Hunting H500 Top (Demo)', viewType: 'top', sortOrder: 3 },
      ],
    },
    {
      name: 'Hunting H700',
      slug: 'hunting-h700',
      sku: 'HP-H700-DEMO',
      subtitle: 'Development Sample: 240Hz Ultra-Low Latency Gaming Projector',
      tagline: 'Fictional Demo Model for Development Testing',
      categorySlug: 'gaming',
      price: 42999,
      mrp: 54999,
      stock: 12,
      isNew: true,
      isFlagship: false,
      isBestSeller: false,
      isFeatured: true,
      badge: '240Hz ESPORTS',
      availability: 'in-stock',
      warranty: '2 Years Official Brand Warranty (Demo)',
      shortDescription: 'High-refresh-rate pro gaming projector engineered for competitive console and PC action with 4.2ms lag.',
      description: [
        'Notice: This is sample development fixture data for testing the Hunting Projectors backend API.',
        'The Hunting H700 is built for fast-paced gaming, esports, and action cinema with blistering 240Hz refresh rates and HDMI 2.1.',
      ],
      whatsIncluded: ['Hunting H700 Gaming Projector (Demo)', 'Low-Latency Gaming Remote', 'Ultra-High-Speed HDMI 2.1 Cable', 'Power Cable'],
      recommendedUse: ['PS5 & Xbox Series X Gaming', 'Competitive PC FPS & Simulators', 'High-Frame Sports Lounges'],
      idealRoomSize: 'medium',
      idealLighting: 'ambient-light',
      rating: 4.9,
      reviewsCount: 24,
      specifications: {
        resolution: 'Full HD 1080p @ 240Hz / 4K UHD @ 60Hz',
        supportedResolution: 'Up to 4K UHD @ 60Hz / 1080p @ 240Hz',
        brightness: '2,800 ANSI Lumens (Demo Metric)',
        lightSource: 'Solid-State Laser-Phosphor Light Engine',
        displayTechnology: '0.47" DMD DLP Optical Architecture',
        contrastRatio: '1,000,000:1 Dynamic Contrast',
        projectionSize: '60" – 200" Diagonal',
        throwRatio: '1.15 – 1.3:1 (Optical Zoom)',
        operatingSystem: 'Hunting Pro Performance Suite',
        audio: 'Dual 10W Dynamic Acoustics + Low Latency Audio Bypass',
        connectivity: ['HDMI 2.1 (Ultra Low Latency) × 2', 'HDMI 2.0 × 1', 'USB 3.0', 'Audio In/Out', 'Wi-Fi 6', 'Bluetooth 5.2'],
        dimensions: '290 × 240 × 125 mm',
        weight: '3.8 kg',
        powerConsumption: '160W',
        noiseLevel: '< 26 dB',
        lampLifeHours: '25,000+ Hours',
        focusType: 'Precision Electronic Focus + Optical Zoom',
        keystoneCorrection: '4-Corner Geometric Correction (±40°)',
        refreshRate: '240Hz Gaming Refresh',
        inputLag: '4.2ms at 1080p 240Hz / 14ms at 4K 60Hz',
        hdr: 'HDR10+ / HLG',
      },
      images: [
        { url: '/assets/products/hunting-horizon-max-hero.svg', altText: 'Hunting H700 Hero (Demo)', viewType: 'hero', sortOrder: 0 },
        { url: '/assets/products/hunting-horizon-max-angled.svg', altText: 'Hunting H700 Angled (Demo)', viewType: 'angled', sortOrder: 1 },
        { url: '/assets/products/hunting-horizon-max-back.svg', altText: 'Hunting H700 Ports (Demo)', viewType: 'back', sortOrder: 2 },
      ],
    },
    {
      name: 'Hunting H900',
      slug: 'hunting-h900',
      sku: 'HP-H900-DEMO',
      subtitle: 'Development Sample: Flagship 4K Triple-Laser Theater Engine',
      tagline: 'Fictional Demo Model for Development Testing',
      categorySlug: 'home-cinema',
      price: 59999,
      mrp: 74999,
      stock: 6,
      isNew: false,
      isFlagship: true,
      isBestSeller: false,
      isFeatured: true,
      badge: 'FLAGSHIP REFERENCE',
      availability: 'in-stock',
      warranty: '3 Years Comprehensive Brand Warranty (Demo)',
      shortDescription: 'Ultimate true 4K laser projector delivering reference-grade DCI-P3 color fidelity and massive 250" screen size.',
      description: [
        'Notice: This is sample development fixture data for testing the Hunting Projectors backend API.',
        'The Hunting H900 is our reference flagship model housing a triple-laser optical engine calibrated for deep inky blacks and specular HDR highlights.',
      ],
      whatsIncluded: ['Hunting H900 4K Flagship Projector (Demo)', 'Backlit Aluminum Remote', 'Premium 3m Braided HDMI 2.1 Cable', 'Power Cable', 'Microfiber Cleaning Cloth'],
      recommendedUse: ['Dedicated Private Cinema Rooms', 'Acoustic Theaters', 'Architectural Feature Walls'],
      idealRoomSize: 'large',
      idealLighting: 'darkened-room',
      rating: 5.0,
      reviewsCount: 19,
      specifications: {
        resolution: 'Native 4K UHD (3840 × 2160)',
        supportedResolution: 'True 4K UHD 60fps / 120fps HDR',
        brightness: '3,200 ANSI Lumens (Demo Metric)',
        lightSource: 'ALPD 4.0 Triple-Laser Optical Core',
        displayTechnology: '0.47" DMD DLP Advanced Precision Prism',
        contrastRatio: '2,500,000:1 Dynamic Contrast',
        projectionSize: '80" – 250" Diagonal',
        throwRatio: '1.2:1 Optical Throw Ratio',
        operatingSystem: 'Hunting Smart OS (Android TV Core)',
        audio: 'Dual 15W Spatial Neodymium Drivers + Dedicated Passive Bass Radiators, Dolby Atmos',
        connectivity: ['HDMI 2.1 (eARC) × 2', 'USB 3.0 × 2', 'Optical Audio Out', 'Gigabit Ethernet', 'Wi-Fi 6', 'Bluetooth 5.3'],
        dimensions: '320 × 280 × 150 mm',
        weight: '4.8 kg',
        powerConsumption: '180W (Eco: 110W)',
        noiseLevel: '< 23 dB (Near Silent)',
        lampLifeHours: '35,000+ Hours Solid-State Laser Life',
        focusType: 'ToF Dual-Sensor Instant Laser Autofocus',
        keystoneCorrection: 'Seamless 8-Point AI Geometric Auto Calibration',
        refreshRate: '120Hz at 1080p / 60Hz at 4K',
        inputLag: '12ms',
        hdr: 'HDR10+ / Dolby Vision / HLG',
        ram: '4GB DDR4',
        storage: '64GB High-Speed eMMC',
      },
      images: [
        { url: '/assets/products/hunting-vision-x1-hero.svg', altText: 'Hunting H900 Hero (Demo)', viewType: 'hero', sortOrder: 0 },
        { url: '/assets/products/hunting-vision-x1-angled.svg', altText: 'Hunting H900 Angled (Demo)', viewType: 'angled', sortOrder: 1 },
        { url: '/assets/products/hunting-vision-x1-back.svg', altText: 'Hunting H900 Rear Ports (Demo)', viewType: 'back', sortOrder: 2 },
        { url: '/assets/products/hunting-vision-x1-top.svg', altText: 'Hunting H900 Top View (Demo)', viewType: 'top', sortOrder: 3 },
      ],
    },
  ];

  for (const item of sampleProducts) {
    const { categorySlug, specifications, images, ...productData } = item;
    const categoryId = categoryMap.get(categorySlug);

    if (!categoryId) {
      console.warn(`[Seed] Warning: Category '${categorySlug}' not found for '${productData.name}'. Skipping.`);
      continue;
    }

    // Check if product exists
    const existing = await prisma.product.findUnique({
      where: { slug: productData.slug },
      include: { specifications: true, images: true },
    });

    if (existing) {
      console.log(`[Seed] Product already exists: ${productData.name} (${productData.slug}), updating attributes.`);
      await prisma.product.update({
        where: { id: existing.id },
        data: {
          name: productData.name,
          sku: productData.sku,
          subtitle: productData.subtitle,
          tagline: productData.tagline,
          price: productData.price,
          mrp: productData.mrp,
          compareAtPrice: productData.mrp,
          stock: productData.stock,
          isNew: productData.isNew,
          isFlagship: productData.isFlagship,
          isBestSeller: productData.isBestSeller,
          isFeatured: productData.isFeatured,
          badge: productData.badge,
          availability: productData.availability,
          warranty: productData.warranty,
          shortDescription: productData.shortDescription,
          description: productData.description,
          whatsIncluded: productData.whatsIncluded,
          recommendedUse: productData.recommendedUse,
          idealRoomSize: productData.idealRoomSize,
          idealLighting: productData.idealLighting,
          rating: productData.rating,
          reviewsCount: productData.reviewsCount,
          specifications: {
            upsert: {
              create: specifications,
              update: specifications,
            },
          },
        },
      });
    } else {
      await prisma.product.create({
        data: {
          ...productData,
          categoryId,
          specifications: {
            create: specifications,
          },
          images: {
            createMany: {
              data: images.map((img, i) => ({
                url: img.url,
                altText: img.altText,
                viewType: img.viewType,
                sortOrder: img.sortOrder ?? i,
              })),
            },
          },
        },
      });
      console.log(`[Seed] Created demo sample product: ${productData.name} (${productData.slug})`);
    }
  }

  console.log('--- Development Database Seed Complete! ---');
}

main()
  .catch(e => {
    console.error('Error during database seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
