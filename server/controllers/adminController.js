import { query, memoryDb } from '../config/db.js';

/**
 * Get comprehensive Admin Dashboard statistics
 * GET /api/admin/stats
 */
export async function getAdminStats(req, res, next) {
  try {
    const totalUsers = memoryDb.users.length;
    const totalCustomers = memoryDb.users.filter(u => u.role === 'customer').length;
    const totalProviders = memoryDb.service_providers.length;
    const verifiedProviders = memoryDb.service_providers.filter(p => p.verified === 1 || p.verificationStatus === 'verified').length;
    const pendingProviders = memoryDb.service_providers.filter(p => p.verificationStatus === 'pending').length;
    const totalBookings = memoryDb.bookings.length;
    const completedBookings = memoryDb.bookings.filter(b => b.status === 'completed').length;
    const pendingBookings = memoryDb.bookings.filter(b => b.status === 'pending').length;
    const totalRevenue = memoryDb.bookings.filter(b => b.status === 'completed').reduce((sum, b) => sum + (Number(b.total_price) || 0), 0);
    const totalReviews = memoryDb.reviews.length;
    const totalCategories = memoryDb.categories.length;

    res.status(200).json({
      success: true,
      stats: {
        totalUsers,
        totalCustomers,
        totalProviders,
        verifiedProviders,
        pendingProviders,
        totalBookings,
        completedBookings,
        pendingBookings,
        totalRevenue,
        totalReviews,
        totalCategories
      }
    });
  } catch (error) {
    next(error);
  }
}

/**
 * Get all users
 * GET /api/admin/users
 */
export async function getAllUsers(req, res, next) {
  try {
    const users = memoryDb.users.map(u => ({
      id: u.id,
      _id: u._id,
      name: u.name,
      email: u.email,
      role: u.role,
      phone: u.phone,
      city: u.city,
      created_at: u.created_at
    }));

    res.status(200).json({
      success: true,
      count: users.length,
      users
    });
  } catch (error) {
    next(error);
  }
}

/**
 * Get all providers for Admin review
 * GET /api/admin/providers
 */
export async function getAllProviders(req, res, next) {
  try {
    const providers = memoryDb.service_providers.map(p => {
      const user = memoryDb.users.find(u => u.id == p.user_id || u._id == p.user_id) || {};
      const cat = memoryDb.categories.find(c => c.id == p.category_id || c._id == p.category_id) || {};
      return {
        ...p,
        user_name: user.name,
        email: user.email,
        phone: user.phone,
        category_name: cat.name
      };
    });

    res.status(200).json({
      success: true,
      count: providers.length,
      providers
    });
  } catch (error) {
    next(error);
  }
}

/**
 * Update Provider Verification Status
 * PUT /api/admin/providers/:id/verify
 */
export async function updateProviderVerification(req, res, next) {
  try {
    const { id } = req.params;
    const { status } = req.body; // 'verified', 'pending', 'rejected'

    const prov = memoryDb.service_providers.find(p => p.id == id || p._id == id);
    if (!prov) {
      return res.status(404).json({
        success: false,
        message: 'Service Provider not found.'
      });
    }

    prov.verificationStatus = status || 'verified';
    prov.verified = status === 'verified' ? 1 : 0;

    res.status(200).json({
      success: true,
      message: `Provider verification status updated to "${prov.verificationStatus}".`,
      provider: prov
    });
  } catch (error) {
    next(error);
  }
}

/**
 * Get all bookings for Admin
 * GET /api/admin/bookings
 */
export async function getAllBookings(req, res, next) {
  try {
    const bookings = await query('SELECT * FROM `bookings`');
    res.status(200).json({
      success: true,
      count: bookings.length,
      bookings
    });
  } catch (error) {
    next(error);
  }
}

/**
 * Get all reviews & moderate
 * GET /api/admin/reviews
 */
export async function getAllReviews(req, res, next) {
  try {
    const reviews = memoryDb.reviews.map(r => {
      const cust = memoryDb.users.find(u => u.id == r.customer_id || u._id == r.customer_id) || {};
      const prov = memoryDb.service_providers.find(p => p.id == r.provider_id || p._id == r.provider_id) || {};
      return {
        ...r,
        customer_name: cust.name,
        provider_name: prov.business_name
      };
    });

    res.status(200).json({
      success: true,
      count: reviews.length,
      reviews
    });
  } catch (error) {
    next(error);
  }
}

/**
 * Delete Inappropriate Review
 * DELETE /api/admin/reviews/:id
 */
export async function deleteReview(req, res, next) {
  try {
    const { id } = req.params;
    const idx = memoryDb.reviews.findIndex(r => r.id == id || r._id == id);
    if (idx === -1) {
      return res.status(404).json({
        success: false,
        message: 'Review not found.'
      });
    }

    const removed = memoryDb.reviews.splice(idx, 1)[0];

    // Recalculate provider average rating
    const provReviews = memoryDb.reviews.filter(r => r.provider_id == removed.provider_id);
    const prov = memoryDb.service_providers.find(p => p.id == removed.provider_id || p._id == removed.provider_id);
    if (prov) {
      prov.total_reviews = provReviews.length;
      prov.rating = provReviews.length > 0 
        ? Number((provReviews.reduce((s, r) => s + r.rating, 0) / provReviews.length).toFixed(2)) 
        : 5.0;
    }

    res.status(200).json({
      success: true,
      message: 'Review removed successfully by administrator.'
    });
  } catch (error) {
    next(error);
  }
}

export default {
  getAdminStats,
  getAllUsers,
  getAllProviders,
  updateProviderVerification,
  getAllBookings,
  getAllReviews,
  deleteReview
};
