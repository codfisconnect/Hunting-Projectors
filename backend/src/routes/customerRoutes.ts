import { Router } from 'express';
import { getProfile, updateProfile } from '../controllers/customerController.js';
import { authenticate } from '../middleware/auth.js';

const router = Router();

router.get('/me', authenticate, getProfile);
router.patch('/me', authenticate, updateProfile);

export default router;
