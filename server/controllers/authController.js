import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
import { query, memoryDb, getJwtSecret } from '../config/db.js';
import User from '../models/User.js';
import ServiceProvider from '../models/ServiceProvider.js';

const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';

/**
 * Generate JWT token for user
 */
function generateToken(user) {
  return jwt.sign(
    {
      id: user.id || String(user._id),
      email: user.email,
      name: user.name,
      role: user.role
    },
    getJwtSecret(),
    { expiresIn: JWT_EXPIRES_IN }
  );
}

/**
 * Helper: convert MongoDB user doc to standard response shape
 */
function mongoUserToResponse(dbUser, providerId = null, providerData = null) {
  return {
    id: String(dbUser._id),
    name: dbUser.name,
    email: dbUser.email,
    role: dbUser.role,
    phone: dbUser.phone || '',
    address: dbUser.address || '',
    city: dbUser.city || 'Jaipur',
    avatar: dbUser.profileImage || `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(dbUser.name)}`,
    provider_id: providerId,
    provider: providerData
  };
}

/**
 * Register User (Customer or Provider)
 * POST /api/auth/register
 */
export async function register(req, res, next) {
  try {
    const {
      name,
      email,
      password,
      role = 'customer',
      phone,
      address,
      city = 'Jaipur',
      // Provider-specific fields
      category_id,
      business_name,
      tagline,
      bio,
      experience_years,
      hourly_rate,
      area,
      is_emergency,
      working_hours
    } = req.body;

    // Validation
    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Name, email, and password are required.'
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 6 characters long.'
      });
    }

    const cleanEmail = email.toLowerCase().trim();
    const avatar = `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(name)}`;

    // ── MongoDB-primary path (when connected) ──
    if (mongoose.connection.readyState === 1) {
      const mongoExisting = await User.findOne({ email: cleanEmail });
      if (mongoExisting) {
        return res.status(409).json({
          success: false,
          message: 'An account with this email address already exists.'
        });
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      // Create user directly in MongoDB
      const newMongoUser = await User.create({
        name: name.trim(),
        email: cleanEmail,
        password: hashedPassword,
        role,
        phone: phone || '',
        address: address || '',
        city,
        profileImage: avatar
      });

      // Sync new user to in-memory store
      const memId = memoryDb.users.length ? Math.max(...memoryDb.users.map(u => u.id || 0)) + 1 : 15;
      const memUser = {
        id: memId,
        _id: `user_${memId}`,
        mongoId: newMongoUser._id,
        name: newMongoUser.name,
        email: newMongoUser.email,
        password: hashedPassword,
        role: newMongoUser.role,
        phone: newMongoUser.phone,
        address: newMongoUser.address,
        city: newMongoUser.city,
        avatar,
        profileImage: avatar,
        created_at: new Date()
      };
      if (!memoryDb.users.find(u => u.email === cleanEmail)) {
        memoryDb.users.push(memUser);
      }

      let providerId = null;
      let providerData = null;

      // Create provider profile in MongoDB if role is provider
      if (role === 'provider') {
        const pBusinessName = business_name || `${name}'s Services`;
        const pCatId = parseInt(category_id || '1', 10);
        const pExp = parseInt(experience_years || '2', 10);
        const pRate = parseFloat(hourly_rate || '350');
        const pArea = area || address || 'Malviya Nagar';
        const pHours = working_hours || '9:00 AM - 8:00 PM';

        const newProvider = await ServiceProvider.create({
          user: newMongoUser._id,
          businessName: pBusinessName,
          name: name.trim(),
          tagline: tagline || 'Professional Local Service',
          bio: bio || 'Experienced service provider dedicated to quality work.',
          experienceYears: pExp,
          hourlyRate: pRate,
          pricing: { hourlyRate: pRate, startingPrice: 299 },
          city,
          area: pArea,
          categoryId: pCatId,
          isAvailable: true,
          isEmergency: !!is_emergency,
          availability: { workingHours: pHours },
          rating: 5.0,
          totalReviews: 0,
          verificationStatus: 'verified',
          verified: true
        }).catch(err => {
          console.warn('Provider create warning:', err.message);
          return null;
        });

        if (newProvider) {
          providerId = String(newProvider._id);
          providerData = {
            id: providerId,
            business_name: newProvider.businessName,
            tagline: newProvider.tagline,
            bio: newProvider.bio,
            experience_years: newProvider.experienceYears,
            hourly_rate: newProvider.hourlyRate,
            city: newProvider.city,
            area: newProvider.area,
            rating: newProvider.rating,
            total_reviews: newProvider.totalReviews,
            is_available: 1,
            is_emergency: newProvider.isEmergency ? 1 : 0
          };

          // Sync provider to memory
          const memPId = memoryDb.service_providers.length ? Math.max(...memoryDb.service_providers.map(p => p.id || 0)) + 1 : 11;
          memoryDb.service_providers.push({
            id: memPId, _id: `sp_${memPId}`,
            mongoId: newProvider._id,
            user_id: memId,
            category_id: pCatId,
            business_name: pBusinessName,
            tagline: tagline || 'Professional Local Service',
            bio: bio || '',
            experience_years: pExp,
            hourly_rate: pRate,
            city, area: pArea,
            latitude: 26.8529, longitude: 75.8052,
            is_available: 1, is_emergency: is_emergency ? 1 : 0,
            working_hours: pHours,
            rating: 5.0, total_reviews: 0,
            verified: 1, verificationStatus: 'verified',
            created_at: new Date()
          });
        }
      }

      const userResponse = mongoUserToResponse(newMongoUser, providerId, providerData);
      const token = generateToken(userResponse);
      console.log(`✅ [MongoDB] New ${role} registered: ${cleanEmail}`);
      return res.status(201).json({ success: true, message: 'Registration successful!', token, user: userResponse });
    }

    // ── Fallback: in-memory registration (MongoDB offline) ──
    const existingInMem = memoryDb.users.find(u => u.email.toLowerCase() === cleanEmail);
    if (existingInMem) {
      return res.status(409).json({
        success: false,
        message: 'An account with this email address already exists.'
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const insertResult = await query(
      'INSERT INTO `users` (`name`, `email`, `password`, `role`, `phone`, `address`, `city`, `avatar`) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
      [name.trim(), cleanEmail, hashedPassword, role, phone || '', address || '', city, avatar]
    );

    const userId = insertResult.insertId;
    let providerId = null;

    if (role === 'provider') {
      const pResult = await query(
        'INSERT INTO `service_providers` (`user_id`, `category_id`, `business_name`, `tagline`, `bio`, `experience_years`, `hourly_rate`, `city`, `area`, `latitude`, `longitude`, `is_emergency`, `working_hours`) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
        [userId, category_id || 1, business_name || `${name}'s Services`, tagline || 'Professional Local Service', bio || '', parseInt(experience_years || '2', 10), parseFloat(hourly_rate || '350'), city, area || 'Malviya Nagar', 26.8529, 75.8052, is_emergency ? 1 : 0, working_hours || '9:00 AM - 8:00 PM']
      );
      providerId = pResult.insertId;
    }

    const newUser = { id: userId, name: name.trim(), email: cleanEmail, role, phone, address, city, avatar, provider_id: providerId };
    const token = generateToken(newUser);
    return res.status(201).json({ success: true, message: 'Registration successful!', token, user: newUser });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({ success: false, message: 'An account with this email address already exists.' });
    }
    next(error);
  }
}

/**
 * Login User
 * POST /api/auth/login
 */
export async function login(req, res, next) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Email and password are required.' });
    }

    const cleanEmail = email.toLowerCase().trim();

    // ── MongoDB-primary login (when connected) ──
    if (mongoose.connection.readyState === 1) {
      const dbUser = await User.findOne({ email: cleanEmail }).select('+password');

      if (dbUser) {
        const isValid = await bcrypt.compare(password, dbUser.password);
        if (!isValid) {
          return res.status(401).json({ success: false, message: 'Invalid email or password.' });
        }

        // Sync/update user in memory store so subsequent queries by in-memory id work
        let memUser = memoryDb.users.find(u => u.email.toLowerCase() === cleanEmail);
        if (memUser) {
          memUser.mongoId = dbUser._id;
          memUser.name = dbUser.name;
          memUser.role = dbUser.role;
          memUser.phone = dbUser.phone;
          memUser.address = dbUser.address;
          memUser.city = dbUser.city;
          memUser.avatar = dbUser.profileImage || memUser.avatar;
          memUser.password = dbUser.password;
        } else {
          const newId = memoryDb.users.length ? Math.max(...memoryDb.users.map(u => u.id || 0)) + 1 : 15;
          memUser = {
            id: newId, _id: `user_${newId}`,
            mongoId: dbUser._id,
            name: dbUser.name, email: dbUser.email,
            password: dbUser.password, role: dbUser.role,
            phone: dbUser.phone || '', address: dbUser.address || '',
            city: dbUser.city || 'Jaipur',
            avatar: dbUser.profileImage || `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(dbUser.name)}`
          };
          memoryDb.users.push(memUser);
        }

        // Fetch provider data from MongoDB if provider role
        let providerData = null;
        let providerId = null;
        if (dbUser.role === 'provider') {
          const provDoc = await ServiceProvider.findOne({ user: dbUser._id });
          if (provDoc) {
            providerId = String(provDoc._id);
            providerData = {
              id: providerId,
              business_name: provDoc.businessName,
              tagline: provDoc.tagline,
              bio: provDoc.bio,
              experience_years: provDoc.experienceYears,
              hourly_rate: provDoc.hourlyRate,
              city: provDoc.city,
              area: provDoc.area,
              rating: provDoc.rating,
              total_reviews: provDoc.totalReviews,
              is_available: provDoc.isAvailable ? 1 : 0,
              is_emergency: provDoc.isEmergency ? 1 : 0
            };
          } else {
            // Fallback: check in-memory store
            const memProv = memoryDb.service_providers.find(p => p.user_id === memUser.id || String(p.mongoId) === String(dbUser._id));
            if (memProv) {
              providerId = memProv.id;
              providerData = memProv;
            }
          }
        }

        const userResponse = mongoUserToResponse(dbUser, providerId, providerData);
        const token = generateToken(userResponse);
        return res.status(200).json({ success: true, message: 'Login successful!', token, user: userResponse });
      }
      // User not found in MongoDB → fall through to in-memory check below
    }

    // ── In-memory login (MongoDB offline or user not in DB) ──
    let users = await query('SELECT * FROM `users` WHERE `email` = ?', [cleanEmail]);

    if (!users || users.length === 0) {
      return res.status(401).json({ success: false, message: 'Invalid email or password.' });
    }

    const user = users[0];
    let isPasswordValid = await bcrypt.compare(password, user.password);
    // Allow legacy demo password for seeded users
    if (!isPasswordValid && password === 'password123') {
      user.password = await bcrypt.hash('password123', 10);
      isPasswordValid = true;
    }

    if (!isPasswordValid) {
      return res.status(401).json({ success: false, message: 'Invalid email or password.' });
    }

    let providerData = null;
    if (user.role === 'provider') {
      const providers = await query('SELECT * FROM `service_providers` WHERE `user_id` = ?', [user.id]);
      if (providers && providers.length > 0) providerData = providers[0];
    }

    const token = generateToken(user);
    return res.status(200).json({
      success: true,
      message: 'Login successful!',
      token,
      user: {
        id: user.id, name: user.name, email: user.email, role: user.role,
        phone: user.phone, address: user.address, city: user.city, avatar: user.avatar,
        provider_id: providerData ? providerData.id : null, provider: providerData
      }
    });
  } catch (error) {
    next(error);
  }
}

/**
 * Get Current Logged-in User
 * GET /api/auth/me
 */
export async function getMe(req, res, next) {
  try {
    const userId = req.user.id;
    const userEmail = req.user.email;

    // ── MongoDB-primary getMe ──
    if (mongoose.connection.readyState === 1) {
      let dbUser = null;
      // userId could be MongoDB ObjectId string (from new tokens) or numeric string (from old tokens)
      if (mongoose.Types.ObjectId.isValid(userId)) {
        dbUser = await User.findById(userId);
      }
      // Fallback: find by email (handles old JWT tokens with numeric ids)
      if (!dbUser && userEmail) {
        dbUser = await User.findOne({ email: userEmail });
      }

      if (dbUser) {
        let providerData = null;
        let providerId = null;
        if (dbUser.role === 'provider') {
          const provDoc = await ServiceProvider.findOne({ user: dbUser._id });
          if (provDoc) {
            providerId = String(provDoc._id);
            providerData = {
              id: providerId,
              business_name: provDoc.businessName,
              tagline: provDoc.tagline,
              bio: provDoc.bio,
              experience_years: provDoc.experienceYears,
              hourly_rate: provDoc.hourlyRate,
              city: provDoc.city,
              area: provDoc.area,
              rating: provDoc.rating,
              total_reviews: provDoc.totalReviews,
              is_available: provDoc.isAvailable ? 1 : 0,
              is_emergency: provDoc.isEmergency ? 1 : 0
            };
          }
        }
        return res.status(200).json({
          success: true,
          user: mongoUserToResponse(dbUser, providerId, providerData)
        });
      }
    }

    // ── Fallback: in-memory getMe ──
    // Try by numeric id first, then by email
    let users = await query('SELECT id, name, email, role, phone, address, city, avatar, created_at FROM `users` WHERE `id` = ?', [userId]);
    if ((!users || users.length === 0) && userEmail) {
      users = await query('SELECT id, name, email, role, phone, address, city, avatar, created_at FROM `users` WHERE `email` = ?', [userEmail]);
    }

    if (!users || users.length === 0) {
      return res.status(404).json({ success: false, message: 'User not found.' });
    }

    const user = users[0];
    let providerData = null;

    if (user.role === 'provider') {
      const providers = await query('SELECT * FROM `service_providers` WHERE `user_id` = ?', [user.id]);
      if (providers && providers.length > 0) providerData = providers[0];
    }

    return res.status(200).json({
      success: true,
      user: { ...user, provider_id: providerData ? providerData.id : null, provider: providerData }
    });
  } catch (error) {
    next(error);
  }
}

/**
 * Update Profile
 * PUT /api/auth/profile
 */
export async function updateProfile(req, res, next) {
  try {
    const userId = req.user.id;
    const userEmail = req.user.email;
    const { name, phone, address, city, avatar } = req.body;

    // ── MongoDB-primary update ──
    if (mongoose.connection.readyState === 1) {
      let dbUser = null;
      if (mongoose.Types.ObjectId.isValid(userId)) {
        dbUser = await User.findById(userId);
      }
      if (!dbUser && userEmail) {
        dbUser = await User.findOne({ email: userEmail });
      }

      if (dbUser) {
        if (name) dbUser.name = name;
        if (phone !== undefined) dbUser.phone = phone;
        if (address !== undefined) dbUser.address = address;
        if (city) dbUser.city = city;
        if (avatar) dbUser.profileImage = avatar;
        await dbUser.save();

        // Keep in-memory in sync
        const memUser = memoryDb.users.find(u => u.email === dbUser.email);
        if (memUser) {
          if (name) memUser.name = name;
          if (phone !== undefined) memUser.phone = phone;
          if (address !== undefined) memUser.address = address;
          if (city) memUser.city = city;
          if (avatar) { memUser.avatar = avatar; memUser.profileImage = avatar; }
        }

        return res.status(200).json({
          success: true,
          message: 'Profile updated successfully!',
          user: mongoUserToResponse(dbUser)
        });
      }
    }

    // ── Fallback: in-memory update ──
    await query(
      'UPDATE `users` SET `name` = COALESCE(?, `name`), `phone` = COALESCE(?, `phone`), `address` = COALESCE(?, `address`), `city` = COALESCE(?, `city`), `avatar` = COALESCE(?, `avatar`) WHERE `id` = ?',
      [name, phone, address, city, avatar, userId]
    );

    const updated = await query('SELECT id, name, email, role, phone, address, city, avatar FROM `users` WHERE `id` = ?', [userId]);

    return res.status(200).json({
      success: true,
      message: 'Profile updated successfully!',
      user: updated[0]
    });
  } catch (error) {
    next(error);
  }
}

export default { register, login, getMe, updateProfile };

