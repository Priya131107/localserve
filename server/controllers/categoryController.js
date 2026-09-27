import { query } from '../config/db.js';

/**
 * Get all categories with provider & service counts
 * GET /api/categories
 */
export async function getCategories(req, res, next) {
  try {
    const categories = await query('SELECT * FROM `categories` ORDER BY `id` ASC');
    
    // Enrich with provider count
    const providers = await query('SELECT category_id FROM `service_providers`');
    const enriched = categories.map(cat => {
      const pCount = providers.filter(p => p.category_id === cat.id).length;
      return {
        ...cat,
        provider_count: pCount
      };
    });

    res.status(200).json({
      success: true,
      count: enriched.length,
      categories: enriched
    });
  } catch (error) {
    next(error);
  }
}

/**
 * Get category by ID or slug
 * GET /api/categories/:idOrSlug
 */
export async function getCategoryById(req, res, next) {
  try {
    const { idOrSlug } = req.params;
    let categories;

    if (!isNaN(idOrSlug)) {
      categories = await query('SELECT * FROM `categories` WHERE `id` = ?', [Number(idOrSlug)]);
    } else {
      categories = await query('SELECT * FROM `categories` WHERE `slug` = ?', [idOrSlug]);
    }

    if (!categories || categories.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Category not found.'
      });
    }

    res.status(200).json({
      success: true,
      category: categories[0]
    });
  } catch (error) {
    next(error);
  }
}

export default { getCategories, getCategoryById };
