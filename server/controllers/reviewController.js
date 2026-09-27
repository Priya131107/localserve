import { query, memoryDb } from '../config/db.js';

/**
 * Add a Review for a completed booking
 * POST /api/reviews
 */
export async function createReview(req, res, next) {
  try {
    const customerId = req.user.id;
    const { booking_id, provider_id, rating, comment } = req.body;

    if (!provider_id || !rating || !comment) {
      return res.status(400).json({
        success: false,
        message: 'Provider ID, rating (1-5), and review comment are required.'
      });
    }

    const numRating = parseInt(rating, 10);
    if (isNaN(numRating) || numRating < 1 || numRating > 5) {
      return res.status(400).json({
        success: false,
        message: 'Rating must be an integer between 1 and 5.'
      });
    }

    // Verify completed booking if booking_id provided
    if (booking_id) {
      const bookings = await query('SELECT * FROM `bookings` WHERE b.`id` = ?', [Number(booking_id)]);
      if (bookings && bookings.length > 0) {
        const bk = bookings[0];
        if (bk.customer_id !== customerId && req.user.role !== 'admin') {
          return res.status(403).json({
            success: false,
            message: 'You are not authorized to review a booking that does not belong to you.'
          });
        }
        if (bk.status !== 'completed' && req.user.role !== 'admin') {
          return res.status(400).json({
            success: false,
            message: 'You can only submit reviews for bookings that are marked as completed.'
          });
        }
      }
    }

    const result = await query(
      'INSERT INTO `reviews` (`booking_id`, `provider_id`, `customer_id`, `rating`, `comment`) VALUES (?, ?, ?, ?, ?)',
      [booking_id ? Number(booking_id) : null, Number(provider_id), customerId, numRating, comment.trim()]
    );

    // Notify provider of new review
    try {
      const providers = await query('SELECT user_id FROM `service_providers` WHERE `id` = ?', [Number(provider_id)]);
      if (providers && providers.length > 0) {
        const notifId = memoryDb.notifications.length + 1;
        memoryDb.notifications.push({
          id: notifId,
          _id: `notif_${notifId}`,
          user_id: providers[0].user_id,
          title: 'New Customer Review',
          message: `${req.user.name} rated your service ${numRating}⭐: "${comment.trim().substring(0, 60)}..."`,
          type: 'review',
          is_read: 0,
          link: '/provider/dashboard',
          created_at: new Date()
        });
      }
    } catch (e) {}

    res.status(201).json({
      success: true,
      message: 'Review submitted successfully! Thank you for your feedback.',
      reviewId: result.insertId
    });
  } catch (error) {
    next(error);
  }
}

/**
 * Get all reviews for a Provider
 * GET /api/reviews/provider/:providerId
 */
export async function getProviderReviews(req, res, next) {
  try {
    const { providerId } = req.params;
    const reviews = await query('SELECT * FROM `reviews` WHERE `provider_id` = ?', [Number(providerId)]);

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
 * Provider reply to a Review
 * PUT /api/reviews/:id/reply
 */
export async function replyToReview(req, res, next) {
  try {
    const { id } = req.params;
    const { provider_response } = req.body;

    if (!provider_response) {
      return res.status(400).json({
        success: false,
        message: 'Provider response text is required.'
      });
    }

    await query('UPDATE `reviews` SET `provider_response` = ? WHERE `id` = ?', [provider_response.trim(), Number(id)]);

    res.status(200).json({
      success: true,
      message: 'Response posted successfully!',
      provider_response
    });
  } catch (error) {
    next(error);
  }
}

export default { createReview, getProviderReviews, replyToReview };
