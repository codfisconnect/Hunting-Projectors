import { Request, Response, NextFunction } from 'express';
import { prisma } from '../config/database.js';

const PRIMARY_DOMAIN = 'https://huntingprojector.in';

const STATIC_PUBLIC_ROUTES = [
  { path: '', changefreq: 'daily', priority: '1.0' },
  { path: '/products', changefreq: 'daily', priority: '0.9' },
  { path: '/experience', changefreq: 'weekly', priority: '0.8' },
  { path: '/compare', changefreq: 'weekly', priority: '0.8' },
  { path: '/projector-finder', changefreq: 'weekly', priority: '0.8' },
  { path: '/about', changefreq: 'monthly', priority: '0.7' },
  { path: '/contact', changefreq: 'monthly', priority: '0.7' },
  { path: '/support', changefreq: 'monthly', priority: '0.6' },
  { path: '/faq', changefreq: 'monthly', priority: '0.6' },
  { path: '/warranty', changefreq: 'monthly', priority: '0.6' },
  { path: '/shipping', changefreq: 'monthly', priority: '0.5' },
  { path: '/refund', changefreq: 'monthly', priority: '0.5' },
  { path: '/privacy', changefreq: 'yearly', priority: '0.3' },
  { path: '/terms', changefreq: 'yearly', priority: '0.3' },
];

/**
 * Dynamic XML Sitemap generator for search engines.
 * Queries PostgreSQL for active published products in real time.
 * Falls back safely to static routes if database is temporarily unavailable.
 * All URLs strictly use https://huntingprojector.in as the canonical domain.
 */
export async function getSitemapXml(req: Request, res: Response, next: NextFunction) {
  try {
    const nowIso = new Date().toISOString().split('T')[0];

    // Query active published products only
    let activeProducts: Array<{ slug: string; updatedAt: Date }> = [];
    try {
      activeProducts = await prisma.product.findMany({
        where: { isActive: true },
        select: { slug: true, updatedAt: true }
      });
    } catch (dbErr: any) {
      console.warn('[Sitemap Generator DB Notice]: Unable to query products, serving static routes sitemap:', dbErr.message);
    }

    let xml = `<?xml version="1.0" encoding="UTF-8"?>\n`;
    xml += `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;

    // 1. Static Public Pages
    for (const route of STATIC_PUBLIC_ROUTES) {
      xml += `  <url>\n`;
      xml += `    <loc>${PRIMARY_DOMAIN}${route.path}</loc>\n`;
      xml += `    <lastmod>${nowIso}</lastmod>\n`;
      xml += `    <changefreq>${route.changefreq}</changefreq>\n`;
      xml += `    <priority>${route.priority}</priority>\n`;
      xml += `  </url>\n`;
    }

    // 2. Active Published Products
    for (const prod of activeProducts) {
      if (!prod.slug) continue;
      const lastMod = prod.updatedAt ? prod.updatedAt.toISOString().split('T')[0] : nowIso;
      xml += `  <url>\n`;
      xml += `    <loc>${PRIMARY_DOMAIN}/products/${encodeURIComponent(prod.slug)}</loc>\n`;
      xml += `    <lastmod>${lastMod}</lastmod>\n`;
      xml += `    <changefreq>daily</changefreq>\n`;
      xml += `    <priority>0.9</priority>\n`;
      xml += `  </url>\n`;
    }

    xml += `</urlset>`;

    res.header('Content-Type', 'application/xml; charset=utf-8');
    res.header('Cache-Control', 'public, max-age=3600, s-maxage=3600');
    return res.status(200).send(xml);
  } catch (err: any) {
    console.error('[Sitemap Generation Error]:', err);
    return res.status(500).type('text/plain').send('Error generating sitemap');
  }
}
