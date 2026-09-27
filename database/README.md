# 🍃 LocalServe MongoDB Database Architecture

This directory defines the **MongoDB** database structure and initialization utilities for **LocalServe**.

---

## 🗄️ Collections & Models

All MongoDB collections are mapped to Mongoose models located in `server/models/`:

| Collection | Model Path | Purpose |
|---|---|---|
| `users` | `server/models/User.js` | Customer, Service Provider, and Admin accounts with bcrypt password hashes. |
| `service_providers`| `server/models/ServiceProvider.js`| Business profile, hourly rates, verified status, and 2dsphere GeoJSON location coordinates. |
| `services` | `server/models/Service.js` | Service catalog items, duration, and emergency availability. |
| `bookings` | `server/models/Booking.js` | Booking records with slot overlap collision indexes. |
| `reviews` | `server/models/Review.js` | Verified customer reviews (1–5 stars) with provider replies. |
| `favorites` | `server/models/Favorite.js` | Saved favorite bookmarks. |
| `chats` | `server/models/Chat.js` | Direct in-app messaging history. |
| `notifications` | `server/models/Notification.js` | Real-time in-app user notifications. |
| `categories` | `server/models/Category.js` | Service categories and icons. |

---

## 🚀 Initializing & Seeding MongoDB

Run the following command from the root directory:

```bash
npm run db:init
```

This will:
1. Connect to MongoDB using `MONGO_URI` from your `.env` file.
2. Automatically create all necessary indexes (e.g. 2dsphere location index, unique emails, and slot collision guard).
3. Seed realistic Indian service provider datasets for **Jaipur, Delhi, Mumbai, and Bengaluru**.

---

## ☁️ Connection String Examples

In `.env`:

### Local MongoDB
```env
MONGO_URI=mongodb://127.0.0.1:27017/local_serve
```

### MongoDB Atlas Cloud Cluster
```env
MONGO_URI=mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/localserve?retryWrites=true&w=majority
```
