import { query } from '../config/db.js';

/**
 * Get services by Provider ID
 * GET /api/services/provider/:providerId
 */
export async function getProviderServices(req, res, next) {
  try {
    const { providerId } = req.params;
    const services = await query('SELECT * FROM `services` WHERE `provider_id` = ?', [Number(providerId)]);

    res.status(200).json({
      success: true,
      count: services.length,
      services
    });
  } catch (error) {
    next(error);
  }
}

/**
 * Add a new Service (Provider only)
 * POST /api/services
 */
export async function createService(req, res, next) {
  try {
    const userId = req.user.id;
    const { title, description, price, duration_mins = 60, price_type = 'fixed', category_id } = req.body;

    if (!title || !price) {
      return res.status(400).json({
        success: false,
        message: 'Service title and price are required.'
      });
    }

    const providers = await query('SELECT * FROM `service_providers` WHERE `user_id` = ?', [userId]);
    if (!providers || providers.length === 0) {
      return res.status(403).json({
        success: false,
        message: 'Only registered service providers can add services.'
      });
    }

    const providerId = providers[0].id;
    const catId = category_id || providers[0].category_id;

    const result = await query(
      'INSERT INTO `services` (`provider_id`, `category_id`, `title`, `description`, `price`, `duration_mins`, `price_type`) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [providerId, catId, title, description || '', parseFloat(price), parseInt(duration_mins, 10), price_type]
    );

    res.status(201).json({
      success: true,
      message: 'Service added successfully!',
      serviceId: result.insertId
    });
  } catch (error) {
    next(error);
  }
}

/**
 * Delete a Service
 * DELETE /api/services/:id
 */
export async function deleteService(req, res, next) {
  try {
    const { id } = req.params;
    await query('DELETE FROM `services` WHERE `id` = ?', [Number(id)]);

    res.status(200).json({
      success: true,
      message: 'Service deleted successfully.'
    });
  } catch (error) {
    next(error);
  }
}

export default { getProviderServices, createService, deleteService };
