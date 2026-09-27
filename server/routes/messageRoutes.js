import express from 'express';
import { sendMessage, getConversation, getConversationsList } from '../controllers/messageController.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

router.get('/', authenticateToken, getConversationsList);
router.get('/:targetUserId', authenticateToken, getConversation);
router.post('/', authenticateToken, sendMessage);

export default router;
