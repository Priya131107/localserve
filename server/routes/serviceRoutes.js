import express from 'express';
import { getProviderServices, createService, deleteService } from '../controllers/serviceController.js';
import { authenticateToken } from '../middleware/auth.js';
import { requireRole } from '../middleware/roleCheck.js';

const router = express.Router();

router.get('/provider/:providerId', getProviderServices);
router.post('/', authenticateToken, requireRole('provider'), createService);
router.delete('/:id', authenticateToken, requireRole('provider'), deleteService);

export default router;
