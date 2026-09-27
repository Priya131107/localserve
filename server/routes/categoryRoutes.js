import express from 'express';
import { getCategories, getCategoryById } from '../controllers/categoryController.js';

const router = express.Router();

router.get('/', getCategories);
router.get('/:idOrSlug', getCategoryById);

export default router;
