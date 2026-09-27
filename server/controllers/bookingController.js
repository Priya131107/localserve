import { query, memoryDb } from '../config/db.js';

/**
 * Create a new Service Booking with double-booking prevention
 * POST /api/bookings
 */
export async function createBooking(req, res, next) {
  try {
    const customerId = req.user.id;
    const {
      provider_id,
      service_id,
      service_title,
      booking_date,
      booking_time,
      total_price,
      customer_address,
      address,
      customer_phone,
      phone,
      notes
    } = req.body;

    const finalAddress = customer_address || address;
    const finalPhone = customer_phone || phone;

    if (!provider_id || !service_title || !booking_date || !booking_time || !total_price || !finalAddress) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required booking details (provider, service, date, time, price, and address).'
      });
    }

    // Verify provider exists
    const providers = await query('SELECT * FROM `service_providers` WHERE `id` = ?', [Number(provider_id)]);
    if (!providers || providers.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Selected service provider not found.'
      });
    }

    const provider = providers[0];

    // Double Booking Prevention: Check if provider already has an active booking at the same date and time slot
    const existingBookings = await query('SELECT * FROM `bookings` WHERE provider_id = ?', [Number(provider_id)]);
    const isSlotOccupied = existingBookings && existingBookings.some(b => 
      b.booking_date === booking_date && 
      b.booking_time === booking_time && 
      ['pending', 'accepted', 'confirmed', 'in-progress'].includes(b.status)
    );

    if (isSlotOccupied) {
      return res.status(409).json({
        success: false,
        message: `The service provider is already scheduled for ${booking_date} during ${booking_time}. Please pick another time slot or date.`
      });
    }

    const result = await query(
      `INSERT INTO ` + '`bookings`' + ` (\`customer_id\`, \`provider_id\`, \`service_id\`, \`service_title\`, \`booking_date\`, \`booking_time\`, \`total_price\`, \`status\`, \`customer_address\`, \`customer_phone\`, \`notes\`) 
       VALUES (?, ?, ?, ?, ?, ?, ?, 'pending', ?, ?, ?)`,
      [
        customerId,
        Number(provider_id),
        service_id ? Number(service_id) : null,
        service_title,
        booking_date,
        booking_time,
        parseFloat(total_price),
        finalAddress,
        finalPhone || req.user.phone || '',
        notes || ''
      ]
    );

    const bookingId = result.insertId;

    // Send in-app notification to provider
    try {
      const notifId = memoryDb.notifications.length + 1;
      memoryDb.notifications.push({
        id: notifId,
        _id: `notif_${notifId}`,
        user_id: provider.user_id,
        title: 'New Service Booking Request',
        message: `New booking from ${req.user.name} for ${service_title} on ${booking_date}.`,
        type: 'booking',
        is_read: 0,
        link: '/provider/dashboard',
        created_at: new Date()
      });
    } catch (err) {
      // Non-blocking notification
    }

    res.status(201).json({
      success: true,
      message: 'Booking request placed successfully! The service provider will review your request.',
      bookingId,
      booking: {
        id: bookingId,
        provider_name: provider.business_name,
        service_title,
        booking_date,
        booking_time,
        total_price,
        status: 'pending'
      }
    });
  } catch (error) {
    next(error);
  }
}

/**
 * Get Bookings (Role-aware: Customer sees their bookings, Provider sees incoming bookings)
 * GET /api/bookings
 */
export async function getBookings(req, res, next) {
  try {
    const user = req.user;
    const { status } = req.query;

    let bookings = [];

    if (user.role === 'provider') {
      // Find provider ID for this user
      const providers = await query('SELECT id FROM `service_providers` WHERE `user_id` = ?', [user.id]);
      if (providers && providers.length > 0) {
        const providerId = providers[0].id;
        bookings = await query('SELECT * FROM `bookings` WHERE `provider_id` = ?', [providerId]);
      }
    } else {
      // Customer or Admin sees their own bookings
      bookings = await query('SELECT * FROM `bookings` WHERE `customer_id` = ?', [user.id]);
    }

    // Filter by status if provided
    if (status && status !== 'all') {
      bookings = bookings.filter(b => b.status === status);
    }

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
 * Get single booking by ID
 * GET /api/bookings/:id
 */
export async function getBookingById(req, res, next) {
  try {
    const { id } = req.params;
    const bookings = await query('SELECT * FROM `bookings` WHERE `id` = ?', [Number(id)]);

    if (!bookings || bookings.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found.'
      });
    }

    res.status(200).json({
      success: true,
      booking: bookings[0]
    });
  } catch (error) {
    next(error);
  }
}

/**
 * Update Booking Status (Accept / Reject / Complete / Cancel)
 * PUT /api/bookings/:id/status
 */
export async function updateBookingStatus(req, res, next) {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const validStatuses = ['pending', 'accepted', 'rejected', 'in-progress', 'completed', 'cancelled'];

    if (!status || !validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: `Invalid status. Must be one of: ${validStatuses.join(', ')}`
      });
    }

    const bookingList = await query('SELECT * FROM `bookings` WHERE `id` = ?', [Number(id)]);
    if (!bookingList || bookingList.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found.'
      });
    }
    const currentBooking = bookingList[0];

    await query('UPDATE `bookings` SET `status` = ? WHERE `id` = ?', [status, Number(id)]);

    // Trigger in-app notification to customer
    try {
      const notifId = memoryDb.notifications.length + 1;
      let msg = `Your booking for ${currentBooking.service_title} status has changed to "${status}".`;
      if (status === 'accepted') msg = `Your booking for ${currentBooking.service_title} has been accepted!`;
      if (status === 'completed') msg = `Your service has been completed. Please leave a rating and review!`;
      if (status === 'rejected') msg = `Your booking request was rejected by the service provider.`;

      memoryDb.notifications.push({
        id: notifId,
        _id: `notif_${notifId}`,
        user_id: currentBooking.customer_id,
        title: `Booking ${status.toUpperCase()}`,
        message: msg,
        type: 'booking',
        is_read: 0,
        link: '/bookings',
        created_at: new Date()
      });
    } catch (e) {
      // Non-blocking
    }

    res.status(200).json({
      success: true,
      message: `Booking has been marked as ${status}.`,
      status
    });
  } catch (error) {
    next(error);
  }
}

export default { createBooking, getBookings, getBookingById, updateBookingStatus };
