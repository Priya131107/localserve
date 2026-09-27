import { query } from '../config/db.js';

/**
 * Send a message to another user
 * POST /api/messages
 */
export async function sendMessage(req, res, next) {
  try {
    const senderId = req.user.id;
    const { receiver_id, booking_id, message, content } = req.body;
    const messageText = (message || content || '').trim();

    if (!receiver_id || !messageText) {
      return res.status(400).json({
        success: false,
        message: 'Receiver ID and message content are required.'
      });
    }

    const result = await query(
      'INSERT INTO `messages` (`sender_id`, `receiver_id`, `booking_id`, `message`) VALUES (?, ?, ?, ?)',
      [senderId, Number(receiver_id), booking_id ? Number(booking_id) : null, messageText]
    );

    res.status(201).json({
      success: true,
      message: 'Message sent!',
      messageId: result.insertId,
      sentMessage: {
        id: result.insertId,
        sender_id: senderId,
        receiver_id: Number(receiver_id),
        booking_id: booking_id || null,
        message: messageText,
        is_read: 0,
        created_at: new Date()
      }
    });
  } catch (error) {
    next(error);
  }
}

/**
 * Get messages thread between current user and another user
 * GET /api/messages/:targetUserId
 */
export async function getConversation(req, res, next) {
  try {
    const currentUserId = req.user.id;
    const { targetUserId } = req.params;

    const messages = await query('SELECT * FROM `messages`', [currentUserId, Number(targetUserId)]);

    // Fetch target user metadata
    const targetUsers = await query('SELECT id, name, role, phone, avatar, city FROM `users` WHERE `id` = ?', [Number(targetUserId)]);
    const targetUser = targetUsers.length > 0 ? targetUsers[0] : null;

    res.status(200).json({
      success: true,
      targetUser,
      count: messages.length,
      messages
    });
  } catch (error) {
    next(error);
  }
}

/**
 * Get list of active conversation threads for current user
 * GET /api/messages
 */
export async function getConversationsList(req, res, next) {
  try {
    const currentUserId = req.user.id;
    const allMessages = await query('SELECT * FROM `messages`');
    const allUsers = await query('SELECT id, name, role, phone, avatar, city FROM `users`');
    const allProviders = await query('SELECT id, user_id, business_name, tagline FROM `service_providers`');

    // Filter messages involving current user
    const userMessages = allMessages.filter(m => m.sender_id === currentUserId || m.receiver_id === currentUserId);

    // Group by other user id
    const contactsMap = new Map();

    userMessages.forEach(m => {
      const otherId = m.sender_id === currentUserId ? m.receiver_id : m.sender_id;
      if (!contactsMap.has(otherId)) {
        const otherUser = allUsers.find(u => u.id === otherId);
        const otherProvider = allProviders.find(p => p.user_id === otherId);
        contactsMap.set(otherId, {
          userId: otherId,
          name: otherUser ? otherUser.name : 'User #' + otherId,
          business_name: otherProvider ? otherProvider.business_name : null,
          role: otherUser ? otherUser.role : 'user',
          avatar: otherUser ? otherUser.avatar : '',
          lastMessage: m.message,
          lastMessageTime: m.created_at,
          unreadCount: 0
        });
      }

      const contact = contactsMap.get(otherId);
      if (new Date(m.created_at) > new Date(contact.lastMessageTime)) {
        contact.lastMessage = m.message;
        contact.lastMessageTime = m.created_at;
      }
      if (m.receiver_id === currentUserId && !m.is_read) {
        contact.unreadCount += 1;
      }
    });

    const conversations = Array.from(contactsMap.values()).sort((a, b) => new Date(b.lastMessageTime) - new Date(a.lastMessageTime));

    res.status(200).json({
      success: true,
      count: conversations.length,
      conversations
    });
  } catch (error) {
    next(error);
  }
}

export default { sendMessage, getConversation, getConversationsList };
