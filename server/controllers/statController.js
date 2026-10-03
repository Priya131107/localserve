import { query } from '../config/db.js';

/**
 * Get Provider Dashboard Statistics
 * GET /api/stats/provider
 */
export async function getProviderStats(req, res, next) {
  try {
    const userId = req.user.id;

    // Find provider record
    const providers = await query('SELECT * FROM `service_providers` WHERE `user_id` = ?', [userId]);
    if (!providers || providers.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Provider record not found.'
      });
    }

    const provider = providers[0];
    const bookings = await query('SELECT * FROM `bookings` WHERE `provider_id` = ?', [provider.id]);
    const reviews = await query('SELECT * FROM `reviews` WHERE `provider_id` = ?', [provider.id]);

    const totalBookings = bookings.length;
    const pendingBookings = bookings.filter(b => b.status === 'pending').length;
    const acceptedBookings = bookings.filter(b => b.status === 'accepted').length;
    const completedBookings = bookings.filter(b => b.status === 'completed').length;
    const cancelledBookings = bookings.filter(b => b.status === 'cancelled' || b.status === 'rejected').length;

    // Calculate total earnings from completed bookings
    const totalEarnings = bookings
      .filter(b => b.status === 'completed')
      .reduce((sum, b) => sum + parseFloat(b.total_price || 0), 0);

    // Calculate actual average rating
    const avgRating = reviews.length > 0
      ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
      : (provider.rating || 5.0).toFixed(1);

    res.status(200).json({
      success: true,
      stats: {
        totalBookings,
        pendingBookings,
        acceptedBookings,
        completedBookings,
        cancelledBookings,
        totalEarnings,
        averageRating: parseFloat(avgRating),
        totalReviews: reviews.length,
        isAvailable: provider.is_available === 1,
        recentBookings: bookings.slice(0, 5)
      }
    });
  } catch (error) {
    next(error);
  }
}

/**
 * Get Customer Dashboard Statistics
 * GET /api/stats/customer
 */
export async function getCustomerStats(req, res, next) {
  try {
    const userId = req.user.id;

    const bookings = await query('SELECT * FROM `bookings` WHERE `customer_id` = ?', [userId]);
    const favorites = await query('SELECT * FROM `favorites` WHERE `customer_id` = ?', [userId]);

    const totalBookings = bookings.length;
    const activeBookings = bookings.filter(b => b.status === 'pending' || b.status === 'accepted').length;
    const completedBookings = bookings.filter(b => b.status === 'completed').length;

    res.status(200).json({
      success: true,
      stats: {
        totalBookings,
        activeBookings,
        completedBookings,
        totalFavorites: favorites.length,
        recentBookings: bookings.slice(0, 5)
      }
    });
  } catch (error) {
    next(error);
  }
}

/**
 * Public Platform Summary Stats (for Landing page counters)
 * GET /api/stats/platform
 */
export async function getPlatformStats(req, res, next) {
  try {
    const providers = await query('SELECT * FROM `service_providers`');
    const services = await query('SELECT * FROM `services`');
    const reviews = await query('SELECT * FROM `reviews`');
    const bookings = await query('SELECT * FROM `bookings`');

    res.status(200).json({
      success: true,
      stats: {
        totalProviders: providers.length || 10,
        totalServices: services.length || 22,
        totalReviews: reviews.length || 50,
        completedJobs: bookings.filter(b => b.status === 'completed').length || 28,
        satisfactionRate: '99.4%'
      }
    });
  } catch (error) {
    next(error);
  }
}

export default { getProviderStats, getCustomerStats, getPlatformStats };
