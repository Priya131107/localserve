import { io } from 'socket.io-client';

let socket = null;

export function getSocket() {
  if (!socket) {
    // In dev, connect to current host origin or default port 5000
    const SOCKET_URL = window.location.hostname === 'localhost' ? 'http://localhost:5000' : window.location.origin;
    socket = io(SOCKET_URL, {
      autoConnect: true,
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000
    });

    socket.on('connect', () => {
      console.log('⚡ Connected to LocalServe Realtime Socket Server:', socket.id);
    });

    socket.on('disconnect', () => {
      console.log('🔌 Disconnected from LocalServe Socket Server');
    });
  }
  return socket;
}

export function subscribeToUserNotifications(userId, callback) {
  const s = getSocket();
  if (userId) {
    s.emit('join_user_channel', userId);
  }
  if (callback) {
    s.on('notification', callback);
  }
  return () => {
    if (callback) {
      s.off('notification', callback);
    }
  };
}

export function joinChatRoom(roomId) {
  const s = getSocket();
  s.emit('join_room', roomId);
}

export function sendRealtimeMessage(roomId, message) {
  const s = getSocket();
  s.emit('send_message', { roomId, message });
}

export function onReceiveMessage(callback) {
  const s = getSocket();
  s.on('receive_message', callback);
  return () => {
    s.off('receive_message', callback);
  };
}

export default {
  getSocket,
  subscribeToUserNotifications,
  joinChatRoom,
  sendRealtimeMessage,
  onReceiveMessage
};
