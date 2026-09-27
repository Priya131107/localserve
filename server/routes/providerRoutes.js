import express from 'express';
import { getProviders, getProviderById, updateProviderProfile, toggleAvailability } from '../controllers/providerController.js';
import { authenticateToken } from '../middleware/auth.js';
import { requireRole } from '../middleware/roleCheck.js';

const router = express.Router();

router.get('/', getProviders);
router.put('/profile', authenticateToken, requireRole('provider'), updateProviderProfile);
router.put('/availability', authenticateToken, requireRole('provider'), toggleAvailability);
router.get('/:id', getProviderById);

export default router;
