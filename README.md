# 🚀 LocalServe — MERN Stack Local Service Discovery & Emergency Platform

> **LocalServe** is a professional, production-grade MERN stack (MongoDB, Express.js, React.js, Node.js) web application designed to connect households and businesses with verified local service professionals (electricians, plumbers, mechanics, cleaners, carpenters, tutors, salon specialists, appliance technicians, and emergency responders).

Featuring real-time **Socket.IO chat**, **Leaflet OpenStreetMap discovery**, **dynamic cost estimation**, **side-by-side provider comparison**, **slot conflict double-booking prevention**, **verified review moderation**, and multi-role dashboards for **Customers**, **Service Providers**, and **Administrators**.

---

## 📋 Table of Contents
1. [Project Overview](#-project-overview)
2. [MERN Technology Stack](#-technology-stack)
3. [Architecture & Folder Structure](#-architecture--folder-structure)
4. [MongoDB Database Schemas](#-mongodb-database-schemas)
5. [Key Features & User Flows](#-key-features--user-flows)
6. [Authentication & RBAC](#-authentication--rbac)
7. [REST API Endpoints](#-rest-api-endpoints)
8. [Real-time Socket.IO Events](#-real-time-socketio-events)
9. [Sample Credentials](#-sample-credentials)
10. [Local Setup & Quickstart](#-local-setup--quickstart)
11. [MongoDB Atlas Setup Guide](#-mongodb-atlas-setup-guide)
12. [Production Deployment (Vercel + Render/Railway)](#-production-deployment)
13. [Automated Test Suite](#-automated-test-suite)

---

## 🌟 Project Overview

Finding reliable local tradespeople in Indian cities (Jaipur, Delhi, Mumbai, Bengaluru, etc.) is frequently hampered by unverified recommendations, arbitrary pricing, and delays during urgent emergencies. **LocalServe** resolves this with:
- **Verified Provider Network**: Background-vetted professionals with genuine customer ratings & reviews.
- **Transparent Pricing**: Upfront fixed package pricing and base hourly rates in Indian Rupees (₹ INR).
- **Geospatial Discovery**: Leaflet OpenStreetMap with live interactive provider pins and user geolocation discovery.
- **Provider Comparison**: Compare up to 3 service providers side-by-side on rate, experience, rating, and 24/7 availability.
- **Double-Booking Guard**: Automated slot overlap prevention preventing simultaneous bookings for the same provider.
- **Real-Time Communication**: Instant in-app messaging powered by Socket.IO.
- **24/7 Emergency SOS**: Rapid dispatch for short circuits, burst pipes, vehicle breakdowns, and medical emergency assistance.

---

## 💻 Technology Stack

| Layer | Technologies Used |
|---|---|
| **Frontend** | React 18, Vite 5, React Router v6, Axios, Lucide Icons, Leaflet & React-Leaflet, Context API |
| **Backend** | Node.js (ES Modules), Express.js 4, Socket.IO 4, JWT, bcryptjs, CORS, dotenv |
| **Database** | MongoDB (Mongoose ODM) with dual-engine resilient in-memory fallback store |
| **Testing** | Node.js native test runner suite (`test_full_suite.js`) |

---

## 📁 Architecture & Folder Structure

```
d:/Local Service Finder/
├── client/                     # React 18 Frontend (Vite)
│   ├── index.html              # LocalServe title & SEO tags
│   ├── vite.config.js          # Vite config & API reverse proxy
│   └── src/
│       ├── components/         # Reusable UI components
│       │   ├── Navbar.jsx      # Navigation, Live Notifications & Admin link
│       │   ├── Footer.jsx      # LocalServe footer & quick links
│       │   ├── ProviderCard.jsx# Provider cards with Favorite & Compare
│       │   ├── ProviderCompareModal.jsx # 3-way Side-by-side comparison
│       │   ├── MapView.jsx     # Leaflet interactive map pins
│       │   ├── CostEstimator.jsx # Dynamic calculation & booking flow
│       │   ├── BookingModal.jsx# Multi-step booking modal
│       │   ├── ReviewModal.jsx # 1-5 star rating & feedback submission
│       │   ├── EmergencyModal.jsx # 24/7 emergency dispatch modal
│       │   └── SearchBar.jsx   # Search & faceted filter bar
│       ├── pages/              # Routed views
│       │   ├── Home.jsx        # Landing page with hero, categories, stats
│       │   ├── Services.jsx    # Filtered provider search & map toggle
│       │   ├── ProviderDetails.jsx # Profile, reviews, services
│       │   ├── EstimatorPage.jsx # Dedicated Cost Estimator page
│       │   ├── CustomerDashboard.jsx # Customer bookings & saved favorites
│       │   ├── ProviderDashboard.jsx # Provider earnings, status toggle
│       │   ├── AdminDashboard.jsx # Admin console: verification & moderation
│       │   ├── ManageServices.jsx# Provider service catalog CRUD
│       │   ├── MyBookings.jsx  # Booking tracking & review actions
│       │   ├── Favorites.jsx   # Customer bookmarked providers
│       │   ├── Messages.jsx    # Real-time Socket.IO chat
│       │   ├── Profile.jsx     # Account profile edit
│       │   ├── Login.jsx       # Authentication
│       │   └── Register.jsx    # Customer / Provider registration
│       ├── services/
│       │   ├── api.js          # REST API Axios/Fetch client
│       │   └── socket.js       # Socket.IO client helper
│       └── context/            # AuthContext & ToastContext
├── server/                     # Node.js & Express.js Backend
│   ├── server.js               # Express + HTTP + Socket.IO server
│   ├── config/
│   │   └── db.js               # Mongoose connection & dual-engine fallback
│   ├── models/                 # Mongoose Schemas
│   │   ├── User.js             # Customer, Provider, Admin accounts
│   │   ├── ServiceProvider.js  # Provider business profile & Geo coordinates
│   │   ├── Service.js          # Service catalog items
│   │   ├── Booking.js          # Bookings with slot conflict index
│   │   ├── Review.js           # Reviews with completed booking check
│   │   ├── Favorite.js         # Saved favorite providers
│   │   ├── Chat.js             # In-app chat messages
│   │   ├── Notification.js     # User in-app notifications
│   │   └── Category.js         # Service categories
│   ├── controllers/            # Business logic handlers
│   ├── routes/                 # Express API routes
│   ├── middleware/             # JWT auth, role authorization, error handlers
│   └── seed/
│       └── seedData.js         # Comprehensive MongoDB Indian seed dataset
├── test_full_suite.js          # Automated end-to-end verification suite
├── .env                        # Active environment variables
└── package.json                # Root package configuration
```

---

## 🗄️ MongoDB Database Schemas

### 1. User Model (`server/models/User.js`)
* `name` (String, required)
* `email` (String, required, unique)
* `password` (String, hashed with bcrypt)
* `role` (String, enum: `['customer', 'provider', 'serviceProvider', 'admin']`)
* `phone` (String)
* `profileImage` (String)
* `address` (String)
* `city` (String, default: `'Jaipur'`)
* `location` (GeoJSON: `{ type: 'Point', coordinates: [Number] }`)
* `createdAt` (Date)

### 2. Service Provider Model (`server/models/ServiceProvider.js`)
* `user` (ObjectId, ref: `'User'`)
* `businessName` (String, required)
* `tagline` (String)
* `bio` (String)
* `experienceYears` (Number)
* `hourlyRate` (Number)
* `pricing` (`{ hourlyRate: Number, startingPrice: Number }`)
* `availability` (`{ isAvailable: Boolean, workingHours: String }`)
* `isAvailable` (Boolean)
* `isEmergency` (Boolean)
* `address`, `area`, `city`
* `location` (GeoJSON Point `[longitude, latitude]`)
* `verificationStatus` (enum: `['verified', 'pending', 'rejected']`)
* `rating` (Number, dynamic average)
* `totalReviews` (Number)

### 3. Service Model (`server/models/Service.js`)
* `provider` (ObjectId, ref: `'ServiceProvider'`)
* `serviceName` (String, required)
* `category` (String, required)
* `description` (String)
* `averagePrice` (Number)
* `priceType` (enum: `['fixed', 'hourly', 'quote']`)
* `durationMins` (Number)
* `emergencyAvailable` (Boolean)
* `isActive` (Boolean)

### 4. Booking Model (`server/models/Booking.js`)
* `customerId` (ObjectId, ref: `'User'`)
* `providerId` (ObjectId, ref: `'ServiceProvider'`)
* `serviceId` (ObjectId, ref: `'Service'`)
* `serviceTitle` (String)
* `bookingDate` (String)
* `bookingTime` (String)
* `customer_address` (String)
* `customer_phone` (String)
* `total_price` (Number)
* `status` (enum: `['pending', 'accepted', 'rejected', 'in-progress', 'completed', 'cancelled']`)
* `paymentStatus` (enum: `['pending', 'paid', 'cash_on_delivery']`)
* `notes` (String)

### 5. Review Model (`server/models/Review.js`)
* `customerId` (ObjectId, ref: `'User'`)
* `providerId` (ObjectId, ref: `'ServiceProvider'`)
* `bookingId` (ObjectId, ref: `'Booking'`, unique)
* `rating` (Number, 1 to 5)
* `comment` (String)
* `providerResponse` (String)

### 6. Favorite Model (`server/models/Favorite.js`)
* `customerId` (ObjectId, ref: `'User'`)
* `providerId` (ObjectId, ref: `'ServiceProvider'`)

### 7. Chat / Message Model (`server/models/Chat.js`)
* `sender` (ObjectId, ref: `'User'`)
* `receiver` (ObjectId, ref: `'User'`)
* `bookingId` (ObjectId, ref: `'Booking'`)
* `message` (String)
* `readStatus` (Boolean)
* `timestamp` (Date)

### 8. Notification Model (`server/models/Notification.js`)
* `userId` (ObjectId, ref: `'User'`)
* `title` (String)
* `message` (String)
* `type` (enum: `['booking', 'review', 'chat', 'system', 'emergency']`)
* `readStatus` (Boolean)
* `link` (String)

---

## 🔑 Authentication & RBAC

| Role | Access Permissions |
|---|---|
| **Customer** | Search services, book providers, track bookings, rate completed services, save favorites, chat with pros. |
| **Service Provider** | Manage profile, update availability, add services, accept/reject bookings, mark jobs completed, reply to reviews. |
| **Admin** | Access Admin Console (`/admin`), view platform metrics, verify/suspend providers, moderate reviews, review bookings. |

---

## 📡 REST API Endpoints

### Auth
* `POST /api/auth/register` — Register new Customer or Provider
* `POST /api/auth/login` — Sign in and receive JWT
* `GET /api/auth/me` — Get current user profile
* `PUT /api/auth/profile` — Update user profile

### Providers & Search
* `GET /api/providers` — Search providers with filters (`q`, `category`, `location`, `rating`, `emergency`, `sort`)
* `GET /api/providers/:id` — Provider profile, services, and reviews
* `PUT /api/providers/profile` — Update provider business profile
* `PUT /api/providers/availability` — Toggle online/offline availability

### Bookings
* `POST /api/bookings` — Create booking (with slot collision guard)
* `GET /api/bookings` — Get user bookings (Customer or Provider)
* `GET /api/bookings/:id` — Single booking details
* `PUT /api/bookings/:id/status` — Change status (`accepted`, `rejected`, `completed`, `cancelled`)

### Reviews
* `POST /api/reviews` — Submit review for completed booking
* `GET /api/reviews/provider/:providerId` — Get all provider reviews
* `PUT /api/reviews/:id/reply` — Provider reply to review

### In-App Notifications
* `GET /api/notifications` — Fetch user notifications & unread count
* `PUT /api/notifications/:id/read` — Mark notification as read
* `PUT /api/notifications/read-all` — Mark all read

### Admin
* `GET /api/admin/stats` — Platform KPI metrics
* `GET /api/admin/users` — User directory
* `GET /api/admin/providers` — Provider verification list
* `PUT /api/admin/providers/:id/verify` — Approve or suspend provider
* `GET /api/admin/bookings` — View all platform bookings
* `GET /api/admin/reviews` — View all platform reviews
* `DELETE /api/admin/reviews/:id` — Delete inappropriate review

---

## ⚡ Real-time Socket.IO Events

* `join_room(roomId)` — Join 1-on-1 private chat room
* `send_message({ roomId, message })` — Send real-time chat message
* `receive_message(message)` — Receive real-time chat message
* `join_user_channel(userId)` — Subscribe to live in-app notifications
* `typing({ roomId, senderName })` — Real-time typing indicators

---

## 👥 Sample Credentials

| Role | Email | Password | Details |
|---|---|---|---|
| **Customer** | `customer@example.com` | `password123` | Aman Sharma (Jaipur) |
| **Customer** | `pooja@example.com` | `password123` | Pooja Verma (Jaipur) |
| **Provider** | `ramesh.electric@example.com` | `password123` | Ramesh Electrical Works |
| **Provider** | `rajesh.plumber@example.com` | `password123` | Sharma Plumbing Solutions |
| **Provider** | `suresh.ac@example.com` | `password123` | Cool Breeze AC Repair |
| **Admin** | `admin@example.com` | `password123` | System Administrator |

---

## 🛠️ Local Setup & Quickstart

### 1. Prerequisites
- Node.js 18+ installed
- (Optional) Local MongoDB daemon running, or a free MongoDB Atlas connection string.

### 2. Clone & Install Dependencies
```bash
# In the root directory:
npm run install:all
```

### 3. Configure Environment
Check `.env`:
```env
PORT=5000
NODE_ENV=development
MONGO_URI=mongodb://127.0.0.1:27017/local_serve
JWT_SECRET=localserve_jwt_production_secret_key_2026_ultra_secure
JWT_EXPIRES_IN=7d
CLIENT_URL=http://localhost:5173
```

### 4. Seed Database (Optional for MongoDB)
```bash
npm run seed
```

### 5. Start Both Server & Client
```bash
npm run dev
```
- **Frontend**: `http://localhost:5173`
- **Backend API**: `http://localhost:5000`
- **Health Check**: `http://localhost:5000/api/health`

---

## ☁️ MongoDB Atlas Setup Guide

1. Sign up at [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas).
2. Create a free **M0 Shared Cluster**.
3. Under **Database Access**, create a user with read/write privileges.
4. Under **Network Access**, add IP `0.0.0.0/0` (Allow access from anywhere).
5. Click **Connect** ➔ **Drivers (Node.js)** and copy the connection string:
   ```
   mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/localserve?retryWrites=true&w=majority
   ```
6. Paste into `.env` as `MONGO_URI`.

---

## 🚢 Production Deployment

### 1. Backend Deployment (Render or Railway)
- **Root Directory**: `server`
- **Build Command**: `npm install`
- **Start Command**: `node server.js`
- **Environment Variables**:
  - `PORT`: `5000`
  - `NODE_ENV`: `production`
  - `MONGO_URI`: `mongodb+srv://ps1204628_db_user:fd5eAczCDkVX3DPs@cluster0.6ybwipi.mongodb.net/?appName=Cluster0`
  - `JWT_SECRET`: `<Your JWT secret>`
  - `CLIENT_URL`: `https://local-service-finder-weld.vercel.app/`

### 2. Frontend Deployment (Vercel)
- **Root Directory**: `client`
- **Framework Preset**: Vite
- **Build Command**: `npm run build`
- **Output Directory**: `dist`
- **Environment Variables**:
  - `VITE_API_URL`: `https://localserve-pg3r.onrender.com`

---

## 🧪 Automated Test Suite

Run the full end-to-end verification suite anytime:
```bash
npm run test:suite
```
All 19 critical features (Auth, Booking lifecycle, Double-booking prevention, Dynamic rating updates, Favorites, Chat, Notifications, and Admin console) are validated with zero failures!
