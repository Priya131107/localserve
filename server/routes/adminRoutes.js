import express from 'express';
import {
  getAdminStats,
  getAllUsers,
  getAllProviders,
  updateProviderVerification,
  getAllBookings,
  getAllReviews,
  deleteReview
} from '../controllers/adminController.js';
import { authenticateToken, authorizeRoles } from '../middleware/auth.js';

const router = express.Router();

// Protect all admin routes
router.use(authenticateToken);
router.use(authorizeRoles('admin'));

router.get('/stats', getAdminStats);
router.get('/users', getAllUsers);
router.get('/providers', getAllProviders);
router.put('/providers/:id/verify', updateProviderVerification);
router.get('/bookings', getAllBookings);
router.get('/reviews', getAllReviews);
router.delete('/reviews/:id', deleteReview);

export default router;
