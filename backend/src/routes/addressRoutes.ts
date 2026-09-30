import { Router } from 'express';
import {
  getAddresses,
  createAddress,
  updateAddress,
  deleteAddress,
  setDefaultAddress
} from '../controllers/addressController.js';
import { authenticate } from '../middleware/auth.js';

const router = Router();

router.use(authenticate); // All address operations require authentication

router.get('/', getAddresses);
router.post('/', createAddress);
router.patch('/:id', updateAddress);
router.delete('/:id', deleteAddress);
router.patch('/:id/default', setDefaultAddress);

export default router;
