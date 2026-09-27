import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

import User from '../server/models/User.js';
import ServiceProvider from '../server/models/ServiceProvider.js';
import Service from '../server/models/Service.js';
import Booking from '../server/models/Booking.js';
import Review from '../server/models/Review.js';
import Favorite from '../server/models/Favorite.js';
import Chat from '../server/models/Chat.js';
import Notification from '../server/models/Notification.js';
import Category from '../server/models/Category.js';
import { seedDatabase } from '../server/seed/seedData.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '../.env') });
dotenv.config({ path: path.join(__dirname, '../server/.env') });

const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/local_serve';

async function initMongoDatabase() {
  console.log('\n======================================================');
  console.log('🍃 LocalServe MongoDB Database Initialization');
  console.log(`📡 Connecting to MongoDB URI: ${MONGO_URI}`);
  console.log('======================================================\n');

  try {
    await mongoose.connect(MONGO_URI, {
      serverSelectionTimeoutMS: 5000
    });
    console.log('✅ Connected successfully to MongoDB!');

    console.log('📑 Ensuring MongoDB Indexes & Collections...');
    await Promise.all([
      User.createIndexes(),
      ServiceProvider.createIndexes(),
      Service.createIndexes(),
      Booking.createIndexes(),
      Review.createIndexes(),
      Favorite.createIndexes(),
      Chat.createIndexes(),
      Notification.createIndexes(),
      Category.createIndexes()
    ]);

    console.log('✅ Indexes created successfully:');
    console.log('   - User: { email: 1 (unique) }');
    console.log('   - ServiceProvider: { location: "2dsphere" }, { city: 1, serviceCategories: 1 }');
    console.log('   - Booking: { providerId: 1, bookingDate: 1, bookingTime: 1, status: 1 }');
    console.log('   - Review: { bookingId: 1 (unique) }, { providerId: 1, createdAt: -1 }');
    console.log('   - Favorite: { customerId: 1, providerId: 1 (unique) }');
    console.log('   - Chat: { sender: 1, receiver: 1 }');

    // Run seed data
    console.log('\n🌱 Seeding initial documents...');
    await seedDatabase();

    console.log('\n======================================================');
    console.log('🎉 MongoDB Initialization Complete for LocalServe!');
    console.log('======================================================\n');
    process.exit(0);
  } catch (error) {
    console.error('❌ MongoDB Initialization Notice:', error.message);
    console.log('\nℹ️ Note: If you do not have a local MongoDB daemon running yet,');
    console.log('   LocalServe automatically uses its integrated Mongoose dual-engine store.');
    console.log('   To connect to MongoDB Atlas, add your connection string to .env:');
    console.log('   MONGO_URI=mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/localserve\n');
    process.exit(0);
  }
}

initMongoDatabase();
