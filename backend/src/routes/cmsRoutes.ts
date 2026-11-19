import { Router } from 'express';
import { prisma } from '../config/database.js';
import { sendSuccess } from '../utils/response.js';

const router = Router();

// Public CMS endpoint: fetches active homepage banners, announcements, hero content, etc.
router.get('/', async (_req, res, next) => {
  try {
    const settings = await prisma.storeSetting.findMany({
      where: {
        key: {
          in: [
            'cms_hero',
            'cms_banners',
            'cms_faqs',
            'cms_announcement',
            'cms_business_hours',
            'cms_social_links',
            'cms_seo',
          ],
        },
      },
    });

    const cmsData: Record<string, any> = {};
    for (const s of settings) {
      try {
        cmsData[s.key] = JSON.parse(s.value);
      } catch {
        cmsData[s.key] = s.value;
      }
    }

    return sendSuccess(res, cmsData, 'Public CMS content retrieved successfully');
  } catch (err) {
    next(err);
  }
});

export default router;
