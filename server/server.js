import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Load config
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '../.env') });
dotenv.config({ path: path.join(__dirname, '.env') });

// Import Database
import './config/db.js';

// Import Routes
import authRoutes from './routes/authRoutes.js';
import userRoutes from './routes/userRoutes.js';
import categoryRoutes from './routes/categoryRoutes.js';
import providerRoutes from './routes/providerRoutes.js';
import serviceRoutes from './routes/serviceRoutes.js';
import bookingRoutes from './routes/bookingRoutes.js';
import reviewRoutes from './routes/reviewRoutes.js';
import favoriteRoutes from './routes/favoriteRoutes.js';
import messageRoutes from './routes/messageRoutes.js';
import statRoutes from './routes/statRoutes.js';
import notificationRoutes from './routes/notificationRoutes.js';
import adminRoutes from './routes/adminRoutes.js';

// Import Middleware
import { errorHandler, notFound } from './middleware/errorHandler.js';
import { getProviders } from './controllers/providerController.js';

const app = express();
const server = http.createServer(app);
const PORT = process.env.PORT || 5000;

// Enable CORS
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Body parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Initialize Socket.IO
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
});

// Real-time Chat & Notification Socket handling
io.on('connection', (socket) => {
  console.log(`⚡ [Socket.IO] New client connected: ${socket.id}`);

  // Join private conversation room
  socket.on('join_room', (roomId) => {
    socket.join(roomId);
    console.log(`👤 Socket ${socket.id} joined room: ${roomId}`);
  });

  // User join personal channel for notifications
  socket.on('join_user_channel', (userId) => {
    socket.join(`user_${userId}`);
    console.log(`🔔 User ${userId} subscribed to notifications`);
  });

  // Handle new message
  socket.on('send_message', (data) => {
    const { roomId, message } = data;
    if (roomId) {
      io.to(roomId).emit('receive_message', message);
    }
  });

  // Handle typing indicator
  socket.on('typing', (data) => {
    const { roomId, senderName } = data;
    socket.to(roomId).emit('user_typing', { senderName });
  });

  socket.on('disconnect', () => {
    console.log(`🔌 [Socket.IO] Client disconnected: ${socket.id}`);
  });
});

// Attach socket io to requests
app.use((req, res, next) => {
  req.io = io;
  next();
});

// Request logging in development
if (process.env.NODE_ENV !== 'production') {
  app.use((req, res, next) => {
    console.log(`[API] ${req.method} ${req.originalUrl}`);
    next();
  });
}

// Health Check Endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'online',
    timestamp: new Date(),
    service: 'LocalServe MERN REST API',
    brand: 'LocalServe',
    version: '2.0.0'
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/providers', providerRoutes);
app.use('/api/services', serviceRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/favorites', favoriteRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/stats', statRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/admin', adminRoutes);

// Direct /api/search route
app.get('/api/search', getProviders);

// Global Error Handling
app.use(notFound);
app.use(errorHandler);

// Start Server with Socket.IO
server.listen(PORT, () => {
  console.log(`\n======================================================`);
  console.log(`🚀 LOCALSERVE PLATFORM BACKEND RUNNING`);
  console.log(`📡 Server & WebSockets: http://localhost:${PORT}`);
  console.log(`🔗 Health Check: http://localhost:${PORT}/api/health`);
  console.log(`======================================================\n`);

  // ── Keep-alive ping for Render.com free tier ──
  // Render spins down free services after 15 min of inactivity.
  // We self-ping every 14 minutes to stay warm and prevent cold-starts for users.
  if (process.env.NODE_ENV === 'production') {
    const RENDER_URL = process.env.RENDER_EXTERNAL_URL || `https://localserve-pg3r.onrender.com`;
    const PING_INTERVAL = 14 * 60 * 1000; // 14 minutes

    setInterval(async () => {
      try {
        const { default: https } = await import('https');
        const url = new URL(`${RENDER_URL}/api/health`);
        const req = https.get(url, (res) => {
          if (res.statusCode === 200) {
            console.log(`💓 [Keep-Alive] Server ping OK at ${new Date().toISOString()}`);
          }
          res.resume();
        });
        req.on('error', () => {}); // Silently ignore ping errors
        req.end();
      } catch { /* ignore */ }
    }, PING_INTERVAL);

    console.log(`💓 [Keep-Alive] Self-ping active — pinging every 14 min to prevent Render sleep\n`);
  }
});

export { app, server, io };
export default server;
