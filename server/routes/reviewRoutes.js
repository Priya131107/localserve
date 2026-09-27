import express from 'express';
import { createReview, getProviderReviews, replyToReview } from '../controllers/reviewController.js';
import { authenticateToken } from '../middleware/auth.js';
import { requireRole } from '../middleware/roleCheck.js';

const router = express.Router();

router.post('/', authenticateToken, createReview);
router.get('/provider/:providerId', getProviderReviews);
router.put('/:id/reply', authenticateToken, requireRole('provider'), replyToReview);

export default router;
