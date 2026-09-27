import express from 'express';
import { getUserById, updateUser } from '../controllers/userController.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

router.get('/:id', authenticateToken, getUserById);
router.put('/:id', authenticateToken, updateUser);

export default router;
