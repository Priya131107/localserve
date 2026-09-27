import { query } from '../config/db.js';

/**
 * Get User by ID
 * GET /api/users/:id
 */
export async function getUserById(req, res, next) {
  try {
    const { id } = req.params;
    const users = await query('SELECT id, name, email, role, phone, address, city, avatar, created_at FROM `users` WHERE `id` = ?', [Number(id)]);

    if (!users || users.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'User not found.'
      });
    }

    res.status(200).json({
      success: true,
      user: users[0]
    });
  } catch (error) {
    next(error);
  }
}

/**
 * Update User by ID
 * PUT /api/users/:id
 */
export async function updateUser(req, res, next) {
  try {
    const { id } = req.params;
    const { name, phone, address, city, avatar } = req.body;

    // Check if requesting user is authorized
    if (req.user.id !== Number(id) && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'You are not authorized to update this profile.'
      });
    }

    await query(
      'UPDATE `users` SET `name` = COALESCE(?, `name`), `phone` = COALESCE(?, `phone`), `address` = COALESCE(?, `address`), `city` = COALESCE(?, `city`), `avatar` = COALESCE(?, `avatar`) WHERE `id` = ?',
      [name, phone, address, city, avatar, Number(id)]
    );

    const updated = await query('SELECT id, name, email, role, phone, address, city, avatar FROM `users` WHERE `id` = ?', [Number(id)]);

    res.status(200).json({
      success: true,
      message: 'User updated successfully!',
      user: updated[0]
    });
  } catch (error) {
    next(error);
  }
}

export default { getUserById, updateUser };
