import express from 'express';
import { createBooking, getBookings, getBookingById, updateBookingStatus } from '../controllers/bookingController.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

router.post('/', authenticateToken, createBooking);
router.get('/', authenticateToken, getBookings);
router.get('/:id', authenticateToken, getBookingById);
router.put('/:id/status', authenticateToken, updateBookingStatus);

export default router;
