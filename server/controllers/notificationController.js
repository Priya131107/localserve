import { query, memoryDb } from '../config/db.js';

/**
 * Get all notifications for current user
 * GET /api/notifications
 */
export async function getNotifications(req, res, next) {
  try {
    const userId = req.user.id;
    const notifications = await query('SELECT * FROM `notifications` WHERE `user_id` = ?', [userId]);

    res.status(200).json({
      success: true,
      count: notifications.length,
      unreadCount: notifications.filter(n => !n.is_read).length,
      notifications
    });
  } catch (error) {
    next(error);
  }
}

/**
 * Mark notification as read
 * PUT /api/notifications/:id/read
 */
export async function markAsRead(req, res, next) {
  try {
    const { id } = req.params;
    const notif = memoryDb.notifications.find(n => n.id == id || n._id == id);
    if (notif) {
      notif.is_read = 1;
      notif.readStatus = true;
    }

    res.status(200).json({
      success: true,
      message: 'Notification marked as read.'
    });
  } catch (error) {
    next(error);
  }
}

/**
 * Mark all notifications as read
 * PUT /api/notifications/read-all
 */
export async function markAllAsRead(req, res, next) {
  try {
    const userId = req.user.id;
    memoryDb.notifications.forEach(n => {
      if (n.user_id == userId) {
        n.is_read = 1;
        n.readStatus = true;
      }
    });

    res.status(200).json({
      success: true,
      message: 'All notifications marked as read.'
    });
  } catch (error) {
    next(error);
  }
}

export default { getNotifications, markAsRead, markAllAsRead };
