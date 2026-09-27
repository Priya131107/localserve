import express from 'express';
import { getProviderStats, getCustomerStats, getPlatformStats } from '../controllers/statController.js';
import { authenticateToken } from '../middleware/auth.js';
import { requireRole } from '../middleware/roleCheck.js';

const router = express.Router();

router.get('/platform', getPlatformStats);
router.get('/provider', authenticateToken, requireRole('provider'), getProviderStats);
router.get('/customer', authenticateToken, requireRole('customer'), getCustomerStats);

export default router;
