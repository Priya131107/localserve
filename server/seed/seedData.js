import dns from 'dns';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import bcrypt from 'bcryptjs';

try {
  dns.setServers(['8.8.8.8', '1.1.1.1']);
} catch (e) {}

import User from '../models/User.js';
import ServiceProvider from '../models/ServiceProvider.js';
import Service from '../models/Service.js';
import Booking from '../models/Booking.js';
import Review from '../models/Review.js';
import Category from '../models/Category.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '../../.env') });
dotenv.config({ path: path.join(__dirname, '../.env') });

const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/local_serve';

export async function seedDatabase() {
  console.log('🌱 Starting MongoDB Data Seeding for LocalServe...');

  try {
    await mongoose.connect(MONGO_URI, { serverSelectionTimeoutMS: 5000 });
    console.log(`Connected to MongoDB: ${MONGO_URI}`);

    // Clear existing collections
    await Promise.all([
      User.deleteMany({}),
      ServiceProvider.deleteMany({}),
      Service.deleteMany({}),
      Booking.deleteMany({}),
      Review.deleteMany({}),
      Category.deleteMany({})
    ]);
    console.log('Cleared existing collections.');

    // 1. Categories
    const categoriesData = [
      { name: 'Electrical', slug: 'electrical', description: 'Expert electricians for wiring, short circuits, switchboards, and fan repairs.', icon: 'Zap', is_emergency: 1, emergencyAvailable: true },
      { name: 'Plumbing', slug: 'plumbing', description: 'Skilled plumbers for pipe leaks, bathroom fittings, motor installation, and drainage.', icon: 'Droplets', is_emergency: 1, emergencyAvailable: true },
      { name: 'Cleaning & Maid', slug: 'cleaning', description: 'Deep house cleaning, kitchen scrubbing, bathroom sanitation, and sofa cleaning.', icon: 'Sparkles', is_emergency: 0, emergencyAvailable: false },
      { name: 'Automotive & Mechanic', slug: 'automotive', description: 'Car and bike roadside assistance, engine repairs, tyre puncture, and servicing.', icon: 'Car', is_emergency: 1, emergencyAvailable: true },
      { name: 'AC & Appliance Repair', slug: 'appliance-repair', description: 'Fast repairs for Air Conditioners, Refrigerators, Washing Machines, and Microwaves.', icon: 'Flame', is_emergency: 1, emergencyAvailable: true },
      { name: 'Carpentry & Woodwork', slug: 'carpentry', description: 'Custom furniture repair, door locks, modular cabinets, and wooden polishing.', icon: 'Hammer', is_emergency: 0, emergencyAvailable: false },
      { name: 'Beauty & Salon', slug: 'beauty-salon', description: 'Professional home salon, haircuts, bridal makeup, facial, and grooming services.', icon: 'Scissors', is_emergency: 0, emergencyAvailable: false },
      { name: 'Home Tutor & Education', slug: 'education', description: 'Experienced home tutors for CBSE/ICSE, mathematics, science, music, and languages.', icon: 'GraduationCap', is_emergency: 0, emergencyAvailable: false },
      { name: 'Computer & Electronics', slug: 'computer-repair', description: 'Laptop/PC repairs, OS installation, WiFi setup, printer repair, and data recovery.', icon: 'Laptop', is_emergency: 0, emergencyAvailable: false },
      { name: 'Painting & Renovation', slug: 'painting', description: 'Interior and exterior wall painting, waterproof coating, and wallpaper installation.', icon: 'Paintbrush', is_emergency: 0, emergencyAvailable: false }
    ];
    const createdCategories = await Category.insertMany(categoriesData);
    console.log(`Created ${createdCategories.length} categories.`);

    // 2. Users (Admin, Customers, Providers)
    const passwordHash = await bcrypt.hash('password123', 10);

    const usersData = [
      { name: 'LocalServe Admin', email: 'admin@example.com', password: passwordHash, role: 'admin', phone: '+91 99999 00000', city: 'Jaipur', address: 'Tech Park, Sector 5' },
      { name: 'Aman Sharma', email: 'customer@example.com', password: passwordHash, role: 'customer', phone: '+91 98290 12345', city: 'Jaipur', address: 'B-42, Malviya Nagar' },
      { name: 'Pooja Verma', email: 'pooja@example.com', password: passwordHash, role: 'customer', phone: '+91 98290 54321', city: 'Jaipur', address: 'Plot 18, Vaishali Nagar' },
      { name: 'Rohan Mehta', email: 'rohan@example.com', password: passwordHash, role: 'customer', phone: '+91 98291 98765', city: 'Delhi', address: 'Block C, Connaught Place' },
      { name: 'Ramesh Kumar', email: 'ramesh.electric@example.com', password: passwordHash, role: 'provider', phone: '+91 94140 11223', city: 'Jaipur', address: 'Shop 12, Main Market, Malviya Nagar' },
      { name: 'Rajesh Sharma', email: 'rajesh.plumber@example.com', password: passwordHash, role: 'provider', phone: '+91 94140 22334', city: 'Jaipur', address: 'Near Nursery Circle, Vaishali Nagar' },
      { name: 'Sunita Devi', email: 'sunita.cleaning@example.com', password: passwordHash, role: 'provider', phone: '+91 94140 33445', city: 'Jaipur', address: 'Sector 7, Mansarovar' },
      { name: 'Amit Patel', email: 'amit.mechanic@example.com', password: passwordHash, role: 'provider', phone: '+91 94140 44556', city: 'Delhi', address: 'Karol Bagh Metro' },
      { name: 'Suresh Meena', email: 'suresh.ac@example.com', password: passwordHash, role: 'provider', phone: '+91 94140 55667', city: 'Jaipur', address: 'Mahal Road, Jagatpura' },
      { name: 'Vikram Singh', email: 'vikram.carpenter@example.com', password: passwordHash, role: 'provider', phone: '+91 94140 66778', city: 'Mumbai', address: 'Andheri West' },
      { name: 'Neha Gupta', email: 'neha.salon@example.com', password: passwordHash, role: 'provider', phone: '+91 94140 77889', city: 'Bengaluru', address: 'Koramangala 4th Block' }
    ];
    const createdUsers = await User.insertMany(usersData);
    console.log(`Created ${createdUsers.length} users.`);

    // Map users
    const rameshUser = createdUsers.find(u => u.email === 'ramesh.electric@example.com');
    const rajeshUser = createdUsers.find(u => u.email === 'rajesh.plumber@example.com');
    const sunitaUser = createdUsers.find(u => u.email === 'sunita.cleaning@example.com');
    const amitUser = createdUsers.find(u => u.email === 'amit.mechanic@example.com');
    const sureshUser = createdUsers.find(u => u.email === 'suresh.ac@example.com');
    const vikramUser = createdUsers.find(u => u.email === 'vikram.carpenter@example.com');
    const nehaUser = createdUsers.find(u => u.email === 'neha.salon@example.com');

    // 3. Service Providers
    const providersData = [
      {
        user: rameshUser._id,
        businessName: 'Ramesh Electrical Works',
        name: 'Ramesh Kumar',
        tagline: 'Certified 24/7 Electrical Care & Installation',
        bio: 'Government licensed master electrician with 8+ years experience specializing in domestic rewiring, short-circuit troubleshooting, and smart automated switchboards.',
        experienceYears: 8,
        hourlyRate: 350,
        pricing: { hourlyRate: 350, startingPrice: 299 },
        city: 'Jaipur',
        area: 'Malviya Nagar',
        location: { type: 'Point', coordinates: [75.8052, 26.8529] },
        serviceCategories: ['Electrical'],
        categoryId: 1,
        isAvailable: true,
        isEmergency: true,
        rating: 4.9,
        totalReviews: 24,
        verificationStatus: 'verified'
      },
      {
        user: rajeshUser._id,
        businessName: 'Sharma Plumbing Solutions',
        name: 'Rajesh Sharma',
        tagline: 'Reliable Pipe Repair, Fixtures & Leakage Experts',
        bio: 'Over 6 years resolving bathroom seepage, pressure pumps, concealed pipe leaks, and modern sanitary installations across Jaipur.',
        experienceYears: 6,
        hourlyRate: 300,
        pricing: { hourlyRate: 300, startingPrice: 249 },
        city: 'Jaipur',
        area: 'Vaishali Nagar',
        location: { type: 'Point', coordinates: [75.7423, 26.9089] },
        serviceCategories: ['Plumbing'],
        categoryId: 2,
        isAvailable: true,
        isEmergency: true,
        rating: 4.85,
        totalReviews: 19,
        verificationStatus: 'verified'
      },
      {
        user: sunitaUser._id,
        businessName: 'SparklePro Deep Cleaners',
        name: 'Sunita Devi',
        tagline: 'Eco-Friendly Residential & Commercial Deep Cleaning',
        bio: 'Dedicated team providing deep chemical-free kitchen scrub, upholstery sanitization, sofa shampooing, and move-in deep cleaning.',
        experienceYears: 5,
        hourlyRate: 450,
        pricing: { hourlyRate: 450, startingPrice: 749 },
        city: 'Jaipur',
        area: 'Mansarovar',
        location: { type: 'Point', coordinates: [75.7667, 26.8612] },
        serviceCategories: ['Cleaning & Maid'],
        categoryId: 3,
        isAvailable: true,
        isEmergency: false,
        rating: 4.92,
        totalReviews: 31,
        verificationStatus: 'verified'
      },
      {
        user: amitUser._id,
        businessName: 'Express Auto Mobile Garage',
        name: 'Amit Patel',
        tagline: '24/7 Roadside Assistance & Engine Mechanics',
        bio: 'Immediate roadside breakdown support, tyre puncture, battery boost, and on-spot periodic two & four wheeler lube servicing in Delhi NCR.',
        experienceYears: 9,
        hourlyRate: 500,
        pricing: { hourlyRate: 500, startingPrice: 399 },
        city: 'Delhi',
        area: 'Karol Bagh',
        location: { type: 'Point', coordinates: [77.1906, 28.6517] },
        serviceCategories: ['Automotive & Mechanic'],
        categoryId: 4,
        isAvailable: true,
        isEmergency: true,
        rating: 4.78,
        totalReviews: 15,
        verificationStatus: 'verified'
      },
      {
        user: sureshUser._id,
        businessName: 'Cool Breeze AC & Refrigeration',
        name: 'Suresh Meena',
        tagline: 'Certified HVAC Technicians for all AC Brands',
        bio: 'Specialist in split & inverter AC jet wash, refrigerant gas leakage fixing, PCB board repair, and compressor overhauls.',
        experienceYears: 7,
        hourlyRate: 400,
        pricing: { hourlyRate: 400, startingPrice: 449 },
        city: 'Jaipur',
        area: 'Jagatpura',
        location: { type: 'Point', coordinates: [75.8654, 26.8228] },
        serviceCategories: ['AC & Appliance Repair'],
        categoryId: 5,
        isAvailable: true,
        isEmergency: true,
        rating: 4.88,
        totalReviews: 22,
        verificationStatus: 'verified'
      }
    ];
    const createdProviders = await ServiceProvider.insertMany(providersData);
    console.log(`Created ${createdProviders.length} providers.`);

    // 4. Services
    const rameshProv = createdProviders[0];
    const rajeshProv = createdProviders[1];
    const sunitaProv = createdProviders[2];
    const amitProv = createdProviders[3];
    const sureshProv = createdProviders[4];

    const servicesData = [
      {
        provider: rameshProv._id,
        serviceName: 'Ceiling Fan & Light Fixture Installation',
        title: 'Ceiling Fan & Light Fixture Installation',
        category: 'Electrical',
        categoryId: 1,
        description: 'Complete mounting, balancing, and dual-pole wiring for ceiling fans and hanging chandeliers.',
        averagePrice: 299,
        price: 299,
        priceType: 'fixed',
        durationMins: 45,
        emergencyAvailable: false
      },
      {
        provider: rameshProv._id,
        serviceName: 'Emergency Short-Circuit Diagnosis',
        title: 'Emergency Short-Circuit Diagnosis',
        category: 'Electrical',
        categoryId: 1,
        description: 'Immediate on-site fault isolation for tripped main MCB switches and burnt wire diagnostics.',
        averagePrice: 499,
        price: 499,
        priceType: 'fixed',
        durationMins: 60,
        emergencyAvailable: true
      },
      {
        provider: rajeshProv._id,
        serviceName: 'Water Motor / Submersible Repair',
        title: 'Water Motor / Submersible Repair',
        category: 'Plumbing',
        categoryId: 2,
        description: 'Comprehensive capacitor replacement, motor priming, and inlet seal leakage fixing.',
        averagePrice: 599,
        price: 599,
        priceType: 'fixed',
        durationMins: 60,
        emergencyAvailable: true
      },
      {
        provider: sunitaProv._id,
        serviceName: 'Full Home Deep Cleaning (2 BHK / 3 BHK)',
        title: 'Full Home Deep Cleaning (2 BHK / 3 BHK)',
        category: 'Cleaning & Maid',
        categoryId: 3,
        description: 'Complete high-pressure steam scrub of tile floors, kitchen oil filters, windows, and toilets.',
        averagePrice: 2199,
        price: 2199,
        priceType: 'fixed',
        durationMins: 240,
        emergencyAvailable: false
      },
      {
        provider: sureshProv._id,
        serviceName: 'Split AC Foam Jet Deep Wash',
        title: 'Split AC Foam Jet Deep Wash',
        category: 'AC & Appliance Repair',
        categoryId: 5,
        description: 'Antibacterial coil foam wash, jet cleaning outdoor condenser, filter cleansing & airflow check.',
        averagePrice: 599,
        price: 599,
        priceType: 'fixed',
        durationMins: 45,
        emergencyAvailable: true
      }
    ];
    const createdServices = await Service.insertMany(servicesData);
    console.log(`Created ${createdServices.length} services.`);

    // 5. Bookings
    const amanUser = createdUsers.find(u => u.email === 'customer@example.com');
    const poojaUser = createdUsers.find(u => u.email === 'pooja@example.com');

    const bookingsData = [
      {
        customerId: amanUser._id,
        providerId: rameshProv._id,
        serviceId: createdServices[0]._id,
        serviceTitle: 'Ceiling Fan & Light Fixture Installation',
        bookingDate: '2026-08-18',
        bookingTime: '10:00 AM - 12:00 PM',
        address: 'B-42, Malviya Nagar, Jaipur',
        customer_phone: '+91 98290 12345',
        notes: 'Install 2 Havells fans in hall',
        estimatedCost: 299,
        finalCost: 299,
        total_price: 299,
        status: 'completed',
        paymentStatus: 'paid'
      },
      {
        customerId: amanUser._id,
        providerId: sureshProv._id,
        serviceId: createdServices[4]._id,
        serviceTitle: 'Split AC Foam Jet Deep Wash',
        bookingDate: '2026-08-21',
        bookingTime: '02:00 PM - 04:00 PM',
        address: 'B-42, Malviya Nagar, Jaipur',
        customer_phone: '+91 98290 12345',
        notes: '1.5 ton AC servicing in master bedroom',
        estimatedCost: 599,
        finalCost: 599,
        total_price: 599,
        status: 'accepted',
        paymentStatus: 'pending'
      }
    ];
    const createdBookings = await Booking.insertMany(bookingsData);
    console.log(`Created ${createdBookings.length} bookings.`);

    // 6. Review
    await Review.create({
      customerId: amanUser._id,
      providerId: rameshProv._id,
      bookingId: createdBookings[0]._id,
      rating: 5,
      comment: 'Ramesh arrived promptly, diagnosed the electrical point wiring, and installed both fans safely. Truly professional!',
      providerResponse: 'Thank you so much Aman ji! Always here to provide safe electrical work.'
    });
    console.log('Created sample review.');

    console.log('✅ MongoDB Seeding Completed Successfully for LocalServe!');
    await mongoose.connection.close();
  } catch (error) {
    console.error('MongoDB Seeding Error:', error.message);
  }
}

if (process.argv[1] && process.argv[1].includes('seedData.js')) {
  seedDatabase();
}

export default seedDatabase;
