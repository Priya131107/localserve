import { query } from '../config/db.js';

/**
 * Get current customer's favorites
 * GET /api/favorites
 */
export async function getFavorites(req, res, next) {
  try {
    const customerId = req.user.id;
    const favorites = await query('SELECT * FROM `favorites` WHERE `customer_id` = ?', [customerId]);

    res.status(200).json({
      success: true,
      count: favorites.length,
      favorites
    });
  } catch (error) {
    next(error);
  }
}

/**
 * Add provider to favorites
 * POST /api/favorites
 */
export async function addFavorite(req, res, next) {
  try {
    const customerId = req.user.id;
    const { provider_id } = req.body;

    if (!provider_id) {
      return res.status(400).json({
        success: false,
        message: 'Provider ID is required.'
      });
    }

    await query('INSERT INTO `favorites` (`customer_id`, `provider_id`) VALUES (?, ?)', [customerId, Number(provider_id)]);

    res.status(201).json({
      success: true,
      message: 'Provider added to favorites!'
    });
  } catch (error) {
    next(error);
  }
}

/**
 * Remove provider from favorites
 * DELETE /api/favorites/:providerId
 */
export async function removeFavorite(req, res, next) {
  try {
    const customerId = req.user.id;
    const { providerId } = req.params;

    await query('DELETE FROM `favorites` WHERE `customer_id` = ? AND `provider_id` = ?', [customerId, Number(providerId)]);

    res.status(200).json({
      success: true,
      message: 'Provider removed from favorites.'
    });
  } catch (error) {
    next(error);
  }
}

export default { getFavorites, addFavorite, removeFavorite };
