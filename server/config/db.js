import dns from 'dns';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import bcrypt from 'bcryptjs';

try {
  dns.setServers(['8.8.8.8', '1.1.1.1']);
} catch (e) {}

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load env variables
dotenv.config({ path: path.join(__dirname, '../../.env') });
dotenv.config({ path: path.join(__dirname, '../.env') });

import User from '../models/User.js';
import ServiceProvider from '../models/ServiceProvider.js';
import Service from '../models/Service.js';
import Booking from '../models/Booking.js';
import Review from '../models/Review.js';
import Category from '../models/Category.js';
import Favorite from '../models/Favorite.js';
import Chat from '../models/Chat.js';
import Notification from '../models/Notification.js';

export function getJwtSecret() {
  return process.env.JWT_SECRET || 'localserve_jwt_production_secret_key_2026_ultra_secure';
}

const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/local_serve';

let isMongoConnected = false;

// In-memory dataset synced with MongoDB
export const memoryDb = {
  users: [],
  categories: [],
  service_providers: [],
  services: [],
  bookings: [],
  reviews: [],
  favorites: [],
  messages: [],
  notifications: []
};

export async function initMemoryDb() {
  if (memoryDb.users.length > 0) return;
  const hashedPassword = await bcrypt.hash('password123', 10);

  memoryDb.categories = [
    { id: 1, _id: 'cat_1', name: 'Electrical', slug: 'electrical', description: 'Expert electricians for wiring, short circuits, switchboards, and fan repairs.', icon: 'Zap', is_emergency: 1, emergencyAvailable: true },
    { id: 2, _id: 'cat_2', name: 'Plumbing', slug: 'plumbing', description: 'Skilled plumbers for pipe leaks, bathroom fittings, motor installation, and drainage.', icon: 'Droplets', is_emergency: 1, emergencyAvailable: true },
    { id: 3, _id: 'cat_3', name: 'Cleaning & Maid', slug: 'cleaning', description: 'Deep house cleaning, kitchen scrubbing, bathroom sanitation, and sofa cleaning.', icon: 'Sparkles', is_emergency: 0, emergencyAvailable: false },
    { id: 4, _id: 'cat_4', name: 'Automotive & Mechanic', slug: 'automotive', description: 'Car and bike roadside assistance, engine repairs, tyre puncture, and servicing.', icon: 'Car', is_emergency: 1, emergencyAvailable: true },
    { id: 5, _id: 'cat_5', name: 'AC & Appliance Repair', slug: 'appliance-repair', description: 'Fast repairs for Air Conditioners, Refrigerators, Washing Machines, and Microwaves.', icon: 'Flame', is_emergency: 1, emergencyAvailable: true },
    { id: 6, _id: 'cat_6', name: 'Carpentry & Woodwork', slug: 'carpentry', description: 'Custom furniture repair, door locks, modular cabinets, and wooden polishing.', icon: 'Hammer', is_emergency: 0, emergencyAvailable: false },
    { id: 7, _id: 'cat_7', name: 'Beauty & Salon', slug: 'beauty-salon', description: 'Professional home salon, haircuts, bridal makeup, facial, and grooming services.', icon: 'Scissors', is_emergency: 0, emergencyAvailable: false },
    { id: 8, _id: 'cat_8', name: 'Home Tutor & Education', slug: 'education', description: 'Experienced home tutors for CBSE/ICSE, mathematics, science, music, and languages.', icon: 'GraduationCap', is_emergency: 0, emergencyAvailable: false },
    { id: 9, _id: 'cat_9', name: 'Computer & Electronics', slug: 'computer-repair', description: 'Laptop/PC repairs, OS installation, WiFi setup, printer repair, and data recovery.', icon: 'Laptop', is_emergency: 0, emergencyAvailable: false },
    { id: 10, _id: 'cat_10', name: 'Painting & Renovation', slug: 'painting', description: 'Interior and exterior wall painting, waterproof coating, and wallpaper installation.', icon: 'Paintbrush', is_emergency: 0, emergencyAvailable: false }
  ];

  memoryDb.users = [
    { id: 1, _id: 'user_1', name: 'Aman Sharma', email: 'customer@example.com', password: hashedPassword, role: 'customer', phone: '+91 98290 12345', address: 'B-42, Malviya Nagar', city: 'Jaipur', avatar: '/avatars/aman.jpg', profileImage: '/avatars/aman.jpg', created_at: new Date('2026-08-01') },
    { id: 2, _id: 'user_2', name: 'Pooja Verma', email: 'pooja@example.com', password: hashedPassword, role: 'customer', phone: '+91 98290 54321', address: 'Plot 18, Vaishali Nagar', city: 'Jaipur', avatar: '/avatars/pooja.jpg', profileImage: '/avatars/pooja.jpg', created_at: new Date('2026-08-02') },
    { id: 3, _id: 'user_3', name: 'Rohan Mehta', email: 'rohan@example.com', password: hashedPassword, role: 'customer', phone: '+91 98291 98765', address: 'Flat 302, Mansarovar', city: 'Jaipur', avatar: '/avatars/rohan.jpg', profileImage: '/avatars/rohan.jpg', created_at: new Date('2026-08-03') },
    { id: 4, _id: 'user_4', name: 'Ramesh Kumar', email: 'ramesh.electric@example.com', password: hashedPassword, role: 'provider', phone: '+91 94140 11223', address: 'Shop 12, Main Market, Malviya Nagar', city: 'Jaipur', avatar: '/avatars/ramesh.jpg', profileImage: '/avatars/ramesh.jpg', created_at: new Date('2026-08-01') },
    { id: 5, _id: 'user_5', name: 'Rajesh Sharma', email: 'rajesh.plumber@example.com', password: hashedPassword, role: 'provider', phone: '+91 94140 22334', address: 'Near Nursery Circle, Vaishali Nagar', city: 'Jaipur', avatar: '/avatars/rajesh.jpg', profileImage: '/avatars/rajesh.jpg', created_at: new Date('2026-08-01') },
    { id: 6, _id: 'user_6', name: 'Sunita Devi', email: 'sunita.cleaning@example.com', password: hashedPassword, role: 'provider', phone: '+91 94140 33445', address: 'Sector 7, Mansarovar', city: 'Jaipur', avatar: '/avatars/sunita.jpg', profileImage: '/avatars/sunita.jpg', created_at: new Date('2026-08-01') },
    { id: 7, _id: 'user_7', name: 'Amit Patel', email: 'amit.mechanic@example.com', password: hashedPassword, role: 'provider', phone: '+91 94140 44556', address: 'MI Road, Near Panch Batti', city: 'Jaipur', avatar: '/avatars/amit.jpg', profileImage: '/avatars/amit.jpg', created_at: new Date('2026-08-01') },
    { id: 8, _id: 'user_8', name: 'Suresh Meena', email: 'suresh.ac@example.com', password: hashedPassword, role: 'provider', phone: '+91 94140 55667', address: 'Mahal Road, Jagatpura', city: 'Jaipur', avatar: '/avatars/suresh.jpg', profileImage: '/avatars/suresh.jpg', created_at: new Date('2026-08-01') },
    { id: 9, _id: 'user_9', name: 'Vikram Singh Suthar', email: 'vikram.carpenter@example.com', password: hashedPassword, role: 'provider', phone: '+91 94140 66778', address: 'Gali No. 4, Raja Park', city: 'Jaipur', avatar: '/avatars/vikram.jpg', profileImage: '/avatars/vikram.jpg', created_at: new Date('2026-08-01') },
    { id: 10, _id: 'user_10', name: 'Neha Gupta', email: 'neha.salon@example.com', password: hashedPassword, role: 'provider', phone: '+91 94140 77889', address: 'Tonk Road, Gopalpura Mode', city: 'Jaipur', avatar: '/avatars/neha.jpg', profileImage: '/avatars/neha.jpg', created_at: new Date('2026-08-01') },
    { id: 11, _id: 'user_11', name: 'Priya Verma', email: 'priya.tutor@example.com', password: hashedPassword, role: 'provider', phone: '+91 94140 88990', address: 'C-Scheme, Ashok Nagar', city: 'Jaipur', avatar: '/avatars/priya.jpg', profileImage: '/avatars/priya.jpg', created_at: new Date('2026-08-01') },
    { id: 12, _id: 'user_12', name: 'Deepak Soni', email: 'deepak.tech@example.com', password: hashedPassword, role: 'provider', phone: '+91 94140 99001', address: 'Silver Square, Bhagwan Das Road', city: 'Jaipur', avatar: '/avatars/deepak.jpg', profileImage: '/avatars/deepak.jpg', created_at: new Date('2026-08-01') },
    { id: 13, _id: 'user_13', name: 'Mukesh Prajapat', email: 'mukesh.paint@example.com', password: hashedPassword, role: 'provider', phone: '+91 94140 10203', address: 'Vidhyadhar Nagar Sector 2', city: 'Jaipur', avatar: '/avatars/mukesh.jpg', profileImage: '/avatars/mukesh.jpg', created_at: new Date('2026-08-01') },
    { id: 14, _id: 'user_14', name: 'LocalServe Admin', email: 'admin@example.com', password: hashedPassword, role: 'admin', phone: '+91 99999 00000', address: 'Headquarters, Tech Hub', city: 'Jaipur', avatar: '/avatars/aman.jpg', profileImage: '/avatars/aman.jpg', created_at: new Date('2026-08-01') }
  ];

  memoryDb.service_providers = [
    { id: 1, _id: 'sp_1', user_id: 4, category_id: 1, business_name: 'Ramesh Electrical Works & Inverter Service', tagline: 'Certified 24/7 Electrical Care & Installation', bio: 'Experienced government licensed electrician with 8+ years specializing in residential rewiring, short-circuit diagnostics, inverter setups, and smart switch automation.', experience_years: 8, hourly_rate: 350.00, city: 'Jaipur', area: 'Malviya Nagar', latitude: 26.8529, longitude: 75.8052, is_available: 1, is_emergency: 1, working_hours: '24/7 Emergency Service', rating: 4.90, total_reviews: 24, verified: 1, verificationStatus: 'verified', avatar: '/avatars/ramesh.jpg' },
    { id: 2, _id: 'sp_2', user_id: 5, category_id: 2, business_name: 'Sharma Plumbing & Sanitary Solutions', tagline: 'Reliable Pipe Repair, Fixtures & Leakage Experts', bio: 'Providing guaranteed fast plumbing services across Vaishali Nagar. Specializing in high-pressure water motors, concealed pipeline leak detection, and sanitary ware installation.', experience_years: 6, hourly_rate: 300.00, city: 'Jaipur', area: 'Vaishali Nagar', latitude: 26.9089, longitude: 75.7423, is_available: 1, is_emergency: 1, working_hours: '7:30 AM - 9:00 PM', rating: 4.85, total_reviews: 19, verified: 1, verificationStatus: 'verified', avatar: '/avatars/rajesh.jpg' },
    { id: 3, _id: 'sp_3', user_id: 6, category_id: 3, business_name: 'Swachh Ghar Deep Cleaning Services', tagline: 'Eco-Friendly Residential & Commercial Deep Cleaning', bio: 'Led by Sunita Devi with a 6-member trained team. We use industrial steam cleaners and eco-friendly disinfectants for complete home sanitation, kitchen de-greasing, and sofa shampooing.', experience_years: 5, hourly_rate: 450.00, city: 'Jaipur', area: 'Mansarovar', latitude: 26.8612, longitude: 75.7667, is_available: 1, is_emergency: 0, working_hours: '8:00 AM - 7:00 PM', rating: 4.92, total_reviews: 31, verified: 1, verificationStatus: 'verified', avatar: '/avatars/sunita.jpg' },
    { id: 4, _id: 'sp_4', user_id: 7, category_id: 4, business_name: 'Patel 24/7 Car & Bike Roadside Garage', tagline: '24/7 Roadside Assistance & Engine Mechanics', bio: 'Immediate breakdown assistance, battery jump start, tyre puncture replacement, and complete on-site 2-wheeler and 4-wheeler periodic servicing.', experience_years: 9, hourly_rate: 500.00, city: 'Jaipur', area: 'MI Road', latitude: 26.9184, longitude: 75.8115, is_available: 1, is_emergency: 1, working_hours: '24/7 Emergency Service', rating: 4.78, total_reviews: 15, verified: 1, verificationStatus: 'verified', avatar: '/avatars/amit.jpg' },
    { id: 5, _id: 'sp_5', user_id: 8, category_id: 5, business_name: 'Meena AC & Refrigeration Care', tagline: 'Certified HVAC Technicians for all AC & Fridge Brands', bio: 'Specialists in Split/Window AC gas charging, PCB board repairs, deep jet-pump foam wash, and inverter refrigerator troubleshooting with genuine parts.', experience_years: 7, hourly_rate: 400.00, city: 'Jaipur', area: 'Jagatpura', latitude: 26.8228, longitude: 75.8654, is_available: 1, is_emergency: 1, working_hours: '8:00 AM - 9:00 PM', rating: 4.88, total_reviews: 22, verified: 1, verificationStatus: 'verified', avatar: '/avatars/suresh.jpg' },
    { id: 6, _id: 'sp_6', user_id: 9, category_id: 6, business_name: 'Jangid Wood Craft & Furniture Art', tagline: 'Custom Furniture Design, Door Locks & Modern Fittings', bio: 'Master craftsman with over a decade of experience crafting custom modular wardrobes, hydraulic bed repairs, door closers, and luxury wood polishing.', experience_years: 11, hourly_rate: 400.00, city: 'Jaipur', area: 'Raja Park', latitude: 26.8973, longitude: 75.8336, is_available: 1, is_emergency: 0, working_hours: '9:00 AM - 8:00 PM', rating: 4.80, total_reviews: 14, verified: 1, verificationStatus: 'verified', avatar: '/avatars/vikram.jpg' },
    { id: 7, _id: 'sp_7', user_id: 10, category_id: 7, business_name: 'Shringar Herbal Beauty & Bridal Home Salon', tagline: 'Premium Herbal Beauty, Hair Styling & Bridal Care at Home', bio: 'Certified makeup artist & cosmetologist offering hygienic salon-at-home services. We use single-use herbal kits, international skin products, and tailored bridal packages.', experience_years: 4, hourly_rate: 600.00, city: 'Jaipur', area: 'Tonk Road', latitude: 26.8741, longitude: 75.7989, is_available: 1, is_emergency: 0, working_hours: '10:00 AM - 7:00 PM', rating: 4.95, total_reviews: 28, verified: 1, verificationStatus: 'verified', avatar: '/avatars/neha.jpg' },
    { id: 8, _id: 'sp_8', user_id: 11, category_id: 8, business_name: 'Vidya Mandir Home Tuitions & Mentorship', tagline: 'Personalized STEM & Board Exam Home Tutoring', bio: 'M.Sc. Gold Medalist with 6 years experience mentoring Class 8–12 CBSE/ICSE students in Mathematics, Physics, and competitive foundation with interactive problem solving.', experience_years: 6, hourly_rate: 500.00, city: 'Jaipur', area: 'C-Scheme', latitude: 26.9110, longitude: 75.8012, is_available: 1, is_emergency: 0, working_hours: '3:00 PM - 8:30 PM', rating: 4.98, total_reviews: 36, verified: 1, verificationStatus: 'verified', avatar: '/avatars/priya.jpg' },
    { id: 9, _id: 'sp_9', user_id: 12, category_id: 9, business_name: 'Soni Digital Laptop & Network Clinic', tagline: 'Doorstep Computer Diagnostics, Screen & Chip Repair', bio: 'Certified hardware and networking engineer. Fast diagnosis for slow laptops, screen replacements, virus cleaning, printer sharing, and home WiFi mesh setup.', experience_years: 7, hourly_rate: 450.00, city: 'Jaipur', area: 'Bani Park', latitude: 26.9312, longitude: 75.7925, is_available: 1, is_emergency: 0, working_hours: '9:30 AM - 8:30 PM', rating: 4.82, total_reviews: 18, verified: 1, verificationStatus: 'verified', avatar: '/avatars/deepak.jpg' },
    { id: 10, _id: 'sp_10', user_id: 13, category_id: 10, business_name: 'Prajapat Rangoli Wall Masters & Painting', tagline: 'Luxury Wall Painting, Textures & Waterproofing', bio: 'Over 12 years creating vibrant living spaces using Asian Paints Royale, damp-proof sealants, stencils, and dust-free mechanized sanding tools.', experience_years: 12, hourly_rate: 350.00, city: 'Jaipur', area: 'Vidhyadhar Nagar', latitude: 26.9641, longitude: 75.7789, is_available: 1, is_emergency: 0, working_hours: '8:30 AM - 6:30 PM', rating: 4.75, total_reviews: 12, verified: 1, verificationStatus: 'verified', avatar: '/avatars/mukesh.jpg' }
  ];

  memoryDb.services = [
    { id: 1, _id: 'srv_1', provider_id: 1, category_id: 1, title: 'Ceiling Fan & Light Fixture Installation', serviceName: 'Ceiling Fan & Light Fixture Installation', description: 'Complete installation and wiring for standard or decorative ceiling fans and chandelier fixtures.', price: 299.00, averagePrice: 299.00, duration_mins: 45, price_type: 'fixed', is_active: 1 },
    { id: 2, _id: 'srv_2', provider_id: 1, category_id: 1, title: 'Emergency Short-Circuit Diagnosis', serviceName: 'Emergency Short-Circuit Diagnosis', description: 'Fast on-site electrical troubleshooting to restore tripped MCBs and solve burning wire smells.', price: 499.00, averagePrice: 499.00, duration_mins: 60, price_type: 'fixed', is_active: 1 },
    { id: 3, _id: 'srv_3', provider_id: 1, category_id: 1, title: 'Full Home Inverter & Battery Setup', serviceName: 'Full Home Inverter & Battery Setup', description: 'Complete dual-circuit wiring, inverter benching, and battery fluid inspection.', price: 799.00, averagePrice: 799.00, duration_mins: 90, price_type: 'fixed', is_active: 1 },
    { id: 4, _id: 'srv_4', provider_id: 2, category_id: 2, title: 'Water Motor / Submersible Repair', serviceName: 'Water Motor / Submersible Repair', description: 'Motor troubleshooting, capacitor check, priming, and replacement of leaking inlet valves.', price: 599.00, averagePrice: 599.00, duration_mins: 60, price_type: 'fixed', is_active: 1 },
    { id: 5, _id: 'srv_5', provider_id: 2, category_id: 2, title: 'Tap / Shower Leakage & Cartridge Fix', serviceName: 'Tap / Shower Leakage & Cartridge Fix', description: 'Precision repair or replacement of mixer taps, flush tanks, and leaking wall valves.', price: 249.00, averagePrice: 249.00, duration_mins: 30, price_type: 'fixed', is_active: 1 },
    { id: 6, _id: 'srv_6', provider_id: 2, category_id: 2, title: 'Emergency Drain & Pipeline Unclogging', serviceName: 'Emergency Drain & Pipeline Unclogging', description: 'Mechanized snake tool unblocking for blocked kitchen sinks, floor drains, and sewer pipes.', price: 699.00, averagePrice: 699.00, duration_mins: 60, price_type: 'fixed', is_active: 1 },
    { id: 7, _id: 'srv_7', provider_id: 3, category_id: 3, title: 'Full Home Deep Cleaning (2 BHK / 3 BHK)', serviceName: 'Full Home Deep Cleaning (2 BHK / 3 BHK)', description: 'Complete intensive scrub including floors, windows, balcony, cabinets, and bathroom disinfection.', price: 2199.00, averagePrice: 2199.00, duration_mins: 240, price_type: 'fixed', is_active: 1 },
    { id: 8, _id: 'srv_8', provider_id: 3, category_id: 3, title: 'Kitchen Exhaust & Degreasing Scrub', serviceName: 'Kitchen Exhaust & Degreasing Scrub', description: 'High-temp degreasing of tiles, chimney filters, gas burner, and under-counter cabinets.', price: 899.00, averagePrice: 899.00, duration_mins: 90, price_type: 'fixed', is_active: 1 },
    { id: 9, _id: 'srv_9', provider_id: 3, category_id: 3, title: 'Fabric Sofa & Carpet Shampooing', serviceName: 'Fabric Sofa & Carpet Shampooing', description: 'Industrial wet vacuum extraction with antiseptic foam for 5-seater sofa set.', price: 749.00, averagePrice: 749.00, duration_mins: 75, price_type: 'fixed', is_active: 1 },
    { id: 10, _id: 'srv_10', provider_id: 4, category_id: 4, title: 'On-Spot Car Battery Jumpstart', serviceName: 'On-Spot Car Battery Jumpstart', description: 'Immediate emergency mobile battery jumpstart and alternator charging test across the city.', price: 399.00, averagePrice: 399.00, duration_mins: 30, price_type: 'fixed', is_active: 1 },
    { id: 11, _id: 'srv_11', provider_id: 4, category_id: 4, title: 'Doorstep Car Periodic Service', serviceName: 'Doorstep Car Periodic Service', description: 'Engine oil replacement, oil filter, air filter cleaning, 25-point vehicle safety check.', price: 1499.00, averagePrice: 1499.00, duration_mins: 120, price_type: 'fixed', is_active: 1 },
    { id: 12, _id: 'srv_12', provider_id: 5, category_id: 5, title: 'Split AC Foam Jet Deep Wash', serviceName: 'Split AC Foam Jet Deep Wash', description: 'High pressure power jet wash with antibacterial foam for indoor cooling coil and outdoor condenser.', price: 599.00, averagePrice: 599.00, duration_mins: 45, price_type: 'fixed', is_active: 1 },
    { id: 13, _id: 'srv_13', provider_id: 5, category_id: 5, title: 'AC Gas Charging & Leak Repair', serviceName: 'AC Gas Charging & Leak Repair', description: 'Nitrogen pressure testing, copper brazing for pinhole leaks, and genuine R32/R410A refrigerant gas filling.', price: 1899.00, averagePrice: 1899.00, duration_mins: 90, price_type: 'fixed', is_active: 1 },
    { id: 14, _id: 'srv_14', provider_id: 5, category_id: 5, title: 'Washing Machine Inspection & Repair', serviceName: 'Washing Machine Inspection & Repair', description: 'Repair for drum noise, water drain error, spinning faults, and PCB motor capacitor fix.', price: 449.00, averagePrice: 449.00, duration_mins: 60, price_type: 'fixed', is_active: 1 },
    { id: 15, _id: 'srv_15', provider_id: 6, category_id: 6, title: 'Door Lock, Latch & Handle Repair', serviceName: 'Door Lock, Latch & Handle Repair', description: 'Installation or replacement of main door mortise locks, cylinder keys, and tower bolts.', price: 349.00, averagePrice: 349.00, duration_mins: 40, price_type: 'fixed', is_active: 1 },
    { id: 16, _id: 'srv_16', provider_id: 6, category_id: 6, title: 'Hydraulic Bed Lift Mechanism Fix', serviceName: 'Hydraulic Bed Lift Mechanism Fix', description: 'Gas spring replacement and realignment of wooden storage beds.', price: 649.00, averagePrice: 649.00, duration_mins: 60, price_type: 'fixed', is_active: 1 },
    { id: 17, _id: 'srv_17', provider_id: 7, category_id: 7, title: 'O3+ Brightening Glow Facial & Cleanup', serviceName: 'O3+ Brightening Glow Facial & Cleanup', description: 'Hydrating organic facial treatment including steam, blackhead removal, scrub, and massage mask.', price: 1199.00, averagePrice: 1199.00, duration_mins: 60, price_type: 'fixed', is_active: 1 },
    { id: 18, _id: 'srv_18', provider_id: 7, category_id: 7, title: 'Hair Spa & Nourishing Treatment', serviceName: 'Hair Spa & Nourishing Treatment', description: 'Deep conditioning scalp massage, steam infusion, and frizz-taming serum application.', price: 899.00, averagePrice: 899.00, duration_mins: 60, price_type: 'fixed', is_active: 1 },
    { id: 19, _id: 'srv_19', provider_id: 8, category_id: 8, title: 'Monthly 1-on-1 Math / Science Tuition', serviceName: 'Monthly 1-on-1 Math / Science Tuition', description: '12 hours monthly personalized home tuition (3 sessions/week) with weekly diagnostic tests.', price: 3499.00, averagePrice: 3499.00, duration_mins: 60, price_type: 'fixed', is_active: 1 },
    { id: 20, _id: 'srv_20', provider_id: 8, category_id: 8, title: 'Hourly Doubt Clearing & Exam Prep', serviceName: 'Hourly Doubt Clearing & Exam Prep', description: 'Targeted single-session concept revision and board exam sample paper review.', price: 450.00, averagePrice: 450.00, duration_mins: 60, price_type: 'hourly', is_active: 1 },
    { id: 21, _id: 'srv_21', provider_id: 9, category_id: 9, title: 'Laptop SSD Upgrade & Windows 11 Install', serviceName: 'Laptop SSD Upgrade & Windows 11 Install', description: 'Cloning existing data to high-speed NVMe/SATA SSD with genuine Windows OS and drivers.', price: 899.00, averagePrice: 899.00, duration_mins: 90, price_type: 'fixed', is_active: 1 },
    { id: 22, _id: 'srv_22', provider_id: 9, category_id: 9, title: 'Thermal Paste & Deep Fan De-dusting', serviceName: 'Thermal Paste & Deep Fan De-dusting', description: 'Cooling overhaul for overheating gaming and work laptops to prevent thermal throttling.', price: 699.00, averagePrice: 699.00, duration_mins: 60, price_type: 'fixed', is_active: 1 }
  ];

  memoryDb.bookings = [
    { id: 1, _id: 'b_1', customer_id: 1, provider_id: 1, service_id: 1, service_title: 'Ceiling Fan & Light Fixture Installation', booking_date: '2026-08-18', booking_time: '10:00 AM - 12:00 PM', total_price: 299.00, status: 'completed', customer_address: 'B-42, Malviya Nagar, Jaipur', customer_phone: '+91 98290 12345', notes: 'Need 2 Havells fan installed in living room.', created_at: new Date('2026-08-17') },
    { id: 2, _id: 'b_2', customer_id: 1, provider_id: 5, service_id: 12, service_title: 'Split AC Foam Jet Deep Wash', booking_date: '2026-08-21', booking_time: '02:00 PM - 04:00 PM', total_price: 599.00, status: 'accepted', customer_address: 'B-42, Malviya Nagar, Jaipur', customer_phone: '+91 98290 12345', notes: 'Master bedroom 1.5 ton Daikin AC.', created_at: new Date('2026-08-19') },
    { id: 3, _id: 'b_3', customer_id: 2, provider_id: 2, service_id: 4, service_title: 'Water Motor / Submersible Repair', booking_date: '2026-08-15', booking_time: '09:00 AM - 11:00 AM', total_price: 599.00, status: 'completed', customer_address: 'Plot 18, Vaishali Nagar, Jaipur', customer_phone: '+91 98290 54321', notes: 'Overhead water tank motor not starting.', created_at: new Date('2026-08-14') },
    { id: 4, _id: 'b_4', customer_id: 3, provider_id: 3, service_id: 7, service_title: 'Full Home Deep Cleaning (2 BHK / 3 BHK)', booking_date: '2026-08-23', booking_time: '08:30 AM - 01:30 PM', total_price: 2199.00, status: 'pending', customer_address: 'Flat 302, Mansarovar, Jaipur', customer_phone: '+91 98291 98765', notes: 'Move-in deep cleaning required before shifting.', created_at: new Date('2026-08-20') },
    { id: 5, _id: 'b_5', customer_id: 1, provider_id: 4, service_id: 10, service_title: 'On-Spot Car Battery Jumpstart', booking_date: '2026-08-10', booking_time: '08:00 PM - 09:00 PM', total_price: 399.00, status: 'completed', customer_address: 'Near WTP, JLN Marg, Jaipur', customer_phone: '+91 98290 12345', notes: 'Car battery discharged in parking lot.', created_at: new Date('2026-08-10') }
  ];

  memoryDb.reviews = [
    { id: 1, _id: 'r_1', booking_id: 1, provider_id: 1, customer_id: 1, rating: 5, comment: 'Ramesh arrived right on time with all his tools and safety gloves. Finished installing both fans smoothly and verified wiring balance. Highly recommended!', provider_response: 'Thank you so much Aman ji! Pleasure working with you. Always available for any future electrical needs.', created_at: new Date('2026-08-18') },
    { id: 2, _id: 'r_2', booking_id: 3, provider_id: 2, customer_id: 2, rating: 5, comment: 'Punctual and very polite. He quickly pinpointed a blown capacitor in the water pump motor and fixed it within 30 minutes without overcharging.', provider_response: 'Thank you Pooja ji! Glad the water motor is running smoothly now.', created_at: new Date('2026-08-15') },
    { id: 3, _id: 'r_3', booking_id: 5, provider_id: 4, customer_id: 1, rating: 5, comment: 'Lifesaver! My car broke down late evening near WTP mall and Amit arrived within 20 minutes with his jumper kit and got me back on the road in minutes.', provider_response: 'Always happy to assist in emergencies! Safe driving always!', created_at: new Date('2026-08-10') }
  ];

  memoryDb.favorites = [
    { id: 1, _id: 'fav_1', customer_id: 1, provider_id: 1, created_at: new Date('2026-08-10') },
    { id: 2, _id: 'fav_2', customer_id: 1, provider_id: 5, created_at: new Date('2026-08-12') },
    { id: 3, _id: 'fav_3', customer_id: 1, provider_id: 4, created_at: new Date('2026-08-14') },
    { id: 4, _id: 'fav_4', customer_id: 2, provider_id: 2, created_at: new Date('2026-08-15') }
  ];

  memoryDb.messages = [
    { id: 1, _id: 'msg_1', sender_id: 1, receiver_id: 4, booking_id: 1, message: 'Hello Ramesh ji, are you available tomorrow morning around 10 AM?', is_read: 1, created_at: new Date('2026-08-17 18:30:00') },
    { id: 2, _id: 'msg_2', sender_id: 4, receiver_id: 1, booking_id: 1, message: 'Namaste Aman ji, yes certainly! I will bring standard fan clamp accessories with me as well.', is_read: 1, created_at: new Date('2026-08-17 18:35:00') },
    { id: 3, _id: 'msg_3', sender_id: 1, receiver_id: 8, booking_id: 2, message: 'Hi Suresh ji, booking confirmed for Friday 2 PM. Please bring the pressure foam kit.', is_read: 1, created_at: new Date('2026-08-20 09:00:00') },
    { id: 4, _id: 'msg_4', sender_id: 8, receiver_id: 1, booking_id: 2, message: 'Confirmed Aman ji! Our technician will reach your Malviya Nagar location on time.', is_read: 0, created_at: new Date('2026-08-20 09:15:00') }
  ];

  memoryDb.notifications = [
    { id: 1, _id: 'notif_1', user_id: 1, title: 'Booking Accepted', message: 'Suresh Meena accepted your AC Foam Jet Deep Wash booking for Aug 21, 2026.', type: 'booking', is_read: 0, link: '/bookings', created_at: new Date('2026-08-19') },
    { id: 2, _id: 'notif_2', user_id: 8, title: 'New Booking Request', message: 'You have a new booking from Aman Sharma for Aug 21, 2026.', type: 'booking', is_read: 1, link: '/provider/dashboard', created_at: new Date('2026-08-19') },
    { id: 3, _id: 'notif_3', user_id: 1, title: 'Service Completed', message: 'Your Ceiling Fan Installation service was marked completed. Please leave a review!', type: 'review', is_read: 1, link: '/bookings', created_at: new Date('2026-08-18') }
  ];
}

initMemoryDb();

/**
 * Sync MongoDB Collections to Memory & ensure initial seed exists
 */
async function syncWithMongo() {
  if (!isMongoConnected) return;

  try {
    const userCount = await User.countDocuments();
    if (userCount === 0) {
      console.log('🌱 Initializing MongoDB Atlas with platform data...');
      // 1. Seed Categories
      for (const cat of memoryDb.categories) {
        await Category.findOneAndUpdate(
          { slug: cat.slug },
          { ...cat },
          { upsert: true, new: true }
        ).catch(() => {});
      }

      // 2. Seed Users
      const userMap = new Map();
      for (const u of memoryDb.users) {
        const created = await User.create({
          name: u.name,
          email: u.email,
          password: u.password,
          role: u.role,
          phone: u.phone,
          address: u.address,
          city: u.city,
          profileImage: u.avatar || u.profileImage
        }).catch(err => null);

        if (created) {
          userMap.set(u.id, created);
          u.mongoId = created._id;
        }
      }

      // 3. Seed Providers
      const provMap = new Map();
      for (const p of memoryDb.service_providers) {
        const u = userMap.get(p.user_id) || memoryDb.users.find(user => user.id === p.user_id);
        const mongoUserId = u?.mongoId || u?._id;
        const createdP = await ServiceProvider.create({
          user: mongoUserId,
          businessName: p.business_name,
          name: u?.name || p.business_name,
          tagline: p.tagline,
          bio: p.bio,
          experienceYears: p.experience_years,
          hourlyRate: p.hourly_rate,
          pricing: { hourlyRate: p.hourly_rate, startingPrice: 299 },
          city: p.city,
          area: p.area,
          categoryId: p.category_id,
          isAvailable: !!p.is_available,
          isEmergency: !!p.is_emergency,
          rating: p.rating || 5.0,
          totalReviews: p.total_reviews || 0,
          verificationStatus: 'verified',
          verified: true
        }).catch(err => null);

        if (createdP) {
          provMap.set(p.id, createdP);
          p.mongoId = createdP._id;
        }
      }

      // 4. Seed Services
      for (const s of memoryDb.services) {
        const p = provMap.get(s.provider_id) || memoryDb.service_providers.find(prov => prov.id === s.provider_id);
        const mongoProvId = p?.mongoId || p?._id;
        if (mongoProvId) {
          await Service.create({
            provider: mongoProvId,
            serviceName: s.serviceName || s.title,
            title: s.title || s.serviceName,
            category: 'General',
            categoryId: s.category_id,
            description: s.description,
            price: s.price,
            averagePrice: s.price,
            durationMins: s.duration_mins || 60,
            priceType: s.price_type || 'fixed',
            isActive: true
          }).catch(err => null);
        }
      }

      console.log('✅ Initial MongoDB Atlas documents populated successfully.');
    } else {
      // Load saved users from MongoDB into memory store
      const mongoUsers = await User.find({}).select('+password');
      for (const mu of mongoUsers) {
        const exists = memoryDb.users.find(u => u.email.toLowerCase() === mu.email.toLowerCase());
        if (exists) {
          exists.mongoId = mu._id;
          exists.name = mu.name;
          exists.role = mu.role;
          exists.phone = mu.phone;
          exists.address = mu.address;
          exists.city = mu.city;
          exists.avatar = mu.profileImage || exists.avatar;
          exists.password = mu.password;
        } else {
          const newId = memoryDb.users.length ? Math.max(...memoryDb.users.map(u => u.id || 0)) + 1 : 1;
          memoryDb.users.push({
            id: newId,
            _id: `user_${newId}`,
            mongoId: mu._id,
            name: mu.name,
            email: mu.email,
            password: mu.password,
            role: mu.role,
            phone: mu.phone,
            address: mu.address,
            city: mu.city,
            avatar: mu.profileImage || `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(mu.name)}`,
            profileImage: mu.profileImage,
            created_at: mu.createdAt || new Date()
          });
        }
      }

      // Load saved providers
      const mongoProviders = await ServiceProvider.find({});
      for (const mp of mongoProviders) {
        const matchingUser = memoryDb.users.find(u => String(u.mongoId) === String(mp.user) || u.email === mp.email);
        const userId = matchingUser ? matchingUser.id : 4;
        const exists = memoryDb.service_providers.find(p => p.user_id === userId || String(p.mongoId) === String(mp._id));
        if (exists) {
          exists.mongoId = mp._id;
          exists.userId = mp.user;
          exists.user_mongo_id = mp.user;
          exists.business_name = mp.businessName || exists.business_name;
          exists.tagline = mp.tagline || exists.tagline;
          exists.hourly_rate = mp.hourlyRate || exists.hourly_rate;
          exists.is_available = mp.isAvailable ? 1 : 0;
          exists.is_emergency = mp.isEmergency ? 1 : 0;
        } else {
          const newId = memoryDb.service_providers.length ? Math.max(...memoryDb.service_providers.map(p => p.id || 0)) + 1 : 1;
          memoryDb.service_providers.push({
            id: newId,
            _id: `sp_${newId}`,
            mongoId: mp._id,
            user_id: userId,
            userId: mp.user,
            user_mongo_id: mp.user,
            category_id: mp.categoryId || 1,
            business_name: mp.businessName,
            tagline: mp.tagline || '',
            bio: mp.bio || '',
            experience_years: mp.experienceYears || 1,
            hourly_rate: mp.hourlyRate || 350,
            city: mp.city || 'Jaipur',
            area: mp.area || 'Malviya Nagar',
            latitude: mp.location?.coordinates?.[1] || 26.8529,
            longitude: mp.location?.coordinates?.[0] || 75.8052,
            is_available: mp.isAvailable ? 1 : 0,
            is_emergency: mp.isEmergency ? 1 : 0,
            working_hours: mp.availability?.workingHours || '9:00 AM - 8:00 PM',
            rating: mp.rating || 5.0,
            total_reviews: mp.totalReviews || 0,
            verified: mp.verified ? 1 : 0,
            verificationStatus: mp.verificationStatus || 'verified',
            created_at: mp.createdAt || new Date()
          });
        }
      }
      console.log(`📦 Synced ${mongoUsers.length} users and ${mongoProviders.length} providers from MongoDB Atlas into memory.`);
    }
  } catch (err) {
    console.warn('⚠️ Notice during MongoDB sync:', err.message);
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// MongoDB Connection Manager
// ─────────────────────────────────────────────────────────────────────────────
let _retryCount = 0;
let _retryTimer = null;

function diagnoseMongoError(err) {
  const msg = (err.message || '').toLowerCase();
  if (msg.includes('querysrv') || msg.includes('enotfound') || msg.includes('econnrefused') || msg.includes('enoent')) {
    return {
      type: 'CLUSTER_PAUSED',
      tip: [
        'Your MongoDB Atlas FREE cluster is AUTO-PAUSED.',
        'To fix: go to https://cloud.mongodb.com',
        '  -> Databases -> Resume Cluster0',
        '  -> Security -> Network Access -> Add 0.0.0.0/0'
      ]
    };
  }
  if (msg.includes('whitelist') || msg.includes('not whitelisted')) {
    return {
      type: 'IP_BLOCKED',
      tip: ['Your IP is blocked on MongoDB Atlas.', 'Fix: Atlas -> Security -> Network Access -> Add 0.0.0.0/0']
    };
  }
  if (msg.includes('authentication') || msg.includes('auth failed')) {
    return { type: 'AUTH_FAILED', tip: ['Wrong credentials. Check MONGO_URI in .env file.'] };
  }
  return { type: 'CONN_ERROR', tip: [(err.message || 'Unknown error').slice(0, 100)] };
}

export async function connectDB() {
  if (_retryTimer) { clearTimeout(_retryTimer); _retryTimer = null; }
  try {
    mongoose.set('strictQuery', false);
    await mongoose.connect(MONGO_URI, {
      serverSelectionTimeoutMS: 12000,
      connectTimeoutMS: 15000,
      socketTimeoutMS: 60000,
      heartbeatFrequencyMS: 10000,
      maxPoolSize: 5,
      minPoolSize: 1,
      retryWrites: true,
      w: 'majority'
    });
    isMongoConnected = true;
    _retryCount = 0;
    const host = MONGO_URI.includes('@') ? MONGO_URI.split('@')[1].split('/')[0] : 'localhost';
    console.log('\n======================================================');
    console.log('  MongoDB Atlas CONNECTED: ' + host);
    console.log('======================================================\n');
    await syncWithMongo();
    return mongoose.connection;
  } catch (error) {
    isMongoConnected = false;
    const { type, tip } = diagnoseMongoError(error);
    if (_retryCount === 0) {
      console.log('\n======================================================');
      console.log('  MongoDB OFFLINE [' + type + ']');
      console.log('------------------------------------------------------');
      tip.forEach(line => console.log('  ' + line));
      console.log('------------------------------------------------------');
      console.log('  App running with in-memory store.');
      console.log('  Data will be lost on server restart!');
      console.log('======================================================\n');
    }
    _retryCount++;
    const delays = [30, 60, 120, 300, 600];
    const delaySec = delays[Math.min(_retryCount - 1, delays.length - 1)];
    if (_retryCount <= delays.length) {
      console.log('  [MongoDB] Retry ' + _retryCount + '/' + delays.length + ' in ' + delaySec + 's...');
      _retryTimer = setTimeout(() => { if (!isMongoConnected) connectDB().catch(() => {}); }, delaySec * 1000);
    } else {
      console.log('  [MongoDB] Max retries reached. Fix Atlas then restart server.\n');
    }
    return null;
  }
}

mongoose.connection.on('connected', () => {
  if (!isMongoConnected) {
    isMongoConnected = true;
    console.log('\n[MongoDB] Reconnected!');
    syncWithMongo().catch(() => {});
  }
});
mongoose.connection.on('disconnected', () => {
  if (isMongoConnected) { isMongoConnected = false; console.log('[MongoDB] Disconnected.'); }
});
mongoose.connection.on('error', () => { isMongoConnected = false; });

connectDB();

export function getIsMongoConnected() {
  return isMongoConnected;
}

export function resolveUserId(val) {
  if (val === null || val === undefined) return null;
  const str = String(val);
  const user = memoryDb.users.find(u => 
    String(u.id) === str || 
    String(u._id) === str || 
    (u.mongoId && String(u.mongoId) === str)
  );
  return user ? user.id : val;
}

export function resolveProviderId(val) {
  if (val === null || val === undefined) return null;
  const str = String(val);
  const prov = memoryDb.service_providers.find(p => 
    String(p.id) === str || 
    String(p._id) === str || 
    (p.mongoId && String(p.mongoId) === str) ||
    String(p.user_id) === str ||
    (p.userId && String(p.userId) === str)
  );
  return prov ? prov.id : val;
}

/**
 * Universal query router supporting both native MongoDB and integrated store
 */
export async function query(sql, params = []) {
  return handleMemoryQuery(sql, params);
}

// Memory & MongoDB query handler
export function handleMemoryQuery(sql, params = []) {
  const normalized = sql.trim().toLowerCase();

  // SELECT queries
  if (normalized.startsWith('select')) {
    // 1. Categories
    if (normalized.includes('categories')) {
      if (normalized.includes('where `id` = ?') || normalized.includes('where id = ?')) {
        const cat = memoryDb.categories.find(c => c.id === Number(params[0]) || c._id === String(params[0]));
        return cat ? [cat] : [];
      }
      return [...memoryDb.categories];
    }

    // 2. Users / Auth
    if (normalized.includes('users')) {
      // Determine if this is a SELECT * (login) or a SELECT id,name,... (getMe/profile)
      const isSelectAll = normalized.startsWith('select *') || normalized.includes('select * from');
      const includesPassword = normalized.includes('password');
      const shouldReturnPassword = isSelectAll || includesPassword;

      const stripSensitive = (user) => {
        if (shouldReturnPassword) return { ...user };
        // eslint-disable-next-line no-unused-vars
        const { password, ...safe } = user;
        return safe;
      };

      if (normalized.includes('where `email` = ?') || normalized.includes('where email = ?')) {
        const user = memoryDb.users.find(u => u.email.toLowerCase() === String(params[0]).toLowerCase());
        return user ? [stripSensitive(user)] : [];
      }
      if (normalized.includes('where `id` = ?') || normalized.includes('where id = ?')) {
        const target = String(params[0]);
        const user = memoryDb.users.find(u => 
          String(u.id) === target || 
          String(u._id) === target || 
          (u.mongoId && String(u.mongoId) === target)
        );
        return user ? [stripSensitive(user)] : [];
      }
      // Support for getMe fallback using email param (string that looks like email)
      if (params.length === 1 && String(params[0]).includes('@')) {
        const user = memoryDb.users.find(u => u.email.toLowerCase() === String(params[0]).toLowerCase());
        return user ? [stripSensitive(user)] : [];
      }
      return memoryDb.users.map(u => stripSensitive(u));
    }

    // 3. Service Providers Search & List
    if (normalized.includes('service_providers')) {
      let results = memoryDb.service_providers.map(p => {
        const user = memoryDb.users.find(u => u.id === p.user_id || u._id === String(p.user_id) || (u.mongoId && String(u.mongoId) === String(p.user_id))) || {};
        const cat = memoryDb.categories.find(c => c.id === p.category_id || c._id === String(p.category_id)) || {};
        const provServices = memoryDb.services.filter(s => (s.provider_id === p.id || s.provider_id === p._id || (p.mongoId && String(s.provider_id) === String(p.mongoId))) && s.is_active);
        const provReviews = memoryDb.reviews.filter(r => r.provider_id === p.id || r.provider_id === p._id || (p.mongoId && String(r.provider_id) === String(p.mongoId)));
        
        return {
          ...p,
          user_name: user.name,
          email: user.email,
          phone: user.phone,
          avatar: user.avatar || user.profileImage,
          user_city: user.city,
          category_name: cat.name,
          category_slug: cat.slug,
          category_icon: cat.icon,
          services: provServices,
          reviews: provReviews
        };
      });

      if (normalized.includes('where `id` = ?') || normalized.includes('where p.`id` = ?') || normalized.includes('where sp.id = ?') || normalized.includes('where id = ?')) {
        const target = String(params[0]);
        const found = results.find(p => 
          String(p.id) === target || 
          String(p._id) === target || 
          (p.mongoId && String(p.mongoId) === target)
        );
        return found ? [found] : [];
      }
      if (normalized.includes('user_id = ?') || normalized.includes('`user_id` = ?')) {
        const target = String(params[0]);
        const resolvedUId = resolveUserId(target);
        const found = results.find(p => 
          String(p.user_id) === String(resolvedUId) || 
          String(p.user_id) === target ||
          String(p.userId) === target ||
          String(p.user_mongo_id) === target ||
          (p.mongoId && String(p.mongoId) === target)
        );
        return found ? [found] : [];
      }
      return results;
    }

    // 4. Services
    if (normalized.includes('services')) {
      if (normalized.includes('provider_id = ?') || normalized.includes('`provider_id` = ?')) {
        const target = String(params[0]);
        const resolvedPId = resolveProviderId(target);
        return memoryDb.services.filter(s => 
          String(s.provider_id) === String(resolvedPId) || 
          String(s.provider_id) === target
        );
      }
      if (normalized.includes('where `id` = ?') || normalized.includes('where id = ?')) {
        const target = String(params[0]);
        const s = memoryDb.services.find(s => 
          String(s.id) === target || 
          String(s._id) === target || 
          (s.mongoId && String(s.mongoId) === target)
        );
        return s ? [s] : [];
      }
      return [...memoryDb.services];
    }

    // 5. Bookings
    if (normalized.includes('bookings')) {
      let results = memoryDb.bookings.map(b => {
        const cust = memoryDb.users.find(u => u.id === b.customer_id || u._id === String(b.customer_id) || (u.mongoId && String(u.mongoId) === String(b.customer_id))) || {};
        const prov = memoryDb.service_providers.find(p => p.id === b.provider_id || p._id === String(b.provider_id) || (p.mongoId && String(p.mongoId) === String(b.provider_id))) || {};
        const provUser = memoryDb.users.find(u => u.id === prov.user_id || u._id === String(prov.user_id) || (u.mongoId && String(u.mongoId) === String(prov.user_id))) || {};
        const rev = memoryDb.reviews.find(r => r.booking_id === b.id || r.booking_id === b._id);
        return {
          ...b,
          customer_name: cust.name,
          customer_email: cust.email,
          customer_avatar: cust.avatar,
          provider_business_name: prov.business_name,
          provider_phone: provUser.phone,
          provider_avatar: provUser.avatar,
          provider_area: prov.area,
          provider_city: prov.city,
          provider_user_id: prov.user_id,
          has_reviewed: !!rev,
          review: rev || null
        };
      });

      if (normalized.includes('customer_id = ?') || normalized.includes('`customer_id` = ?')) {
        const target = String(params[0]);
        const resolvedUId = resolveUserId(target);
        return results.filter(b => 
          String(b.customer_id) === String(resolvedUId) || 
          String(b.customer_id) === target
        ).sort((a,b) => b.id - a.id);
      }
      if (normalized.includes('provider_id = ?') || normalized.includes('`provider_id` = ?')) {
        const target = String(params[0]);
        const resolvedPId = resolveProviderId(target);
        return results.filter(b => 
          String(b.provider_id) === String(resolvedPId) || 
          String(b.provider_id) === target
        ).sort((a,b) => b.id - a.id);
      }
      if (normalized.includes('where b.`id` = ?') || normalized.includes('where id = ?') || normalized.includes('`id` = ?')) {
        const target = String(params[0]);
        const found = results.find(b => 
          String(b.id) === target || 
          String(b._id) === target || 
          (b.mongoId && String(b.mongoId) === target)
        );
        return found ? [found] : [];
      }
      return results.sort((a,b) => b.id - a.id);
    }

    // 6. Reviews
    if (normalized.includes('reviews')) {
      let results = memoryDb.reviews.map(r => {
        const cust = memoryDb.users.find(u => u.id === r.customer_id || u._id === String(r.customer_id) || (u.mongoId && String(u.mongoId) === String(r.customer_id))) || {};
        return {
          ...r,
          customer_name: cust.name,
          customer_avatar: cust.avatar,
          customer_city: cust.city
        };
      });

      if (normalized.includes('provider_id = ?') || normalized.includes('`provider_id` = ?')) {
        const target = String(params[0]);
        const resolvedPId = resolveProviderId(target);
        return results.filter(r => 
          String(r.provider_id) === String(resolvedPId) || 
          String(r.provider_id) === target
        ).sort((a,b) => b.id - a.id);
      }
      return results.sort((a,b) => b.id - a.id);
    }

    // 7. Favorites
    if (normalized.includes('favorites')) {
      if (normalized.includes('customer_id = ?') || normalized.includes('`customer_id` = ?')) {
        const target = String(params[0]);
        const resolvedUId = resolveUserId(target);
        const favs = memoryDb.favorites.filter(f => 
          String(f.customer_id) === String(resolvedUId) || 
          String(f.customer_id) === target
        );
        return favs.map(f => {
          const prov = memoryDb.service_providers.find(p => p.id === f.provider_id || p._id === String(f.provider_id) || (p.mongoId && String(p.mongoId) === String(f.provider_id)));
          const user = prov ? memoryDb.users.find(u => u.id === prov.user_id || u._id === String(prov.user_id) || (u.mongoId && String(u.mongoId) === String(prov.user_id))) : {};
          const cat = prov ? memoryDb.categories.find(c => c.id === prov.category_id || c._id === String(prov.category_id)) : {};
          return {
            ...f,
            business_name: prov?.business_name,
            tagline: prov?.tagline,
            hourly_rate: prov?.hourly_rate,
            rating: prov?.rating,
            total_reviews: prov?.total_reviews,
            area: prov?.area,
            city: prov?.city,
            avatar: user?.avatar,
            category_name: cat?.name
          };
        });
      }
      return [...memoryDb.favorites];
    }

    // 8. Messages
    if (normalized.includes('messages')) {
      if (params.length >= 2) {
        const u1 = resolveUserId(params[0]);
        const u2 = resolveUserId(params[1]);
        const r1 = String(params[0]);
        const r2 = String(params[1]);
        return memoryDb.messages.filter(m => 
          (m.sender_id == u1 && m.receiver_id == u2) ||
          (m.sender_id == u2 && m.receiver_id == u1) ||
          (String(m.sender_id) === r1 && String(m.receiver_id) === r2) ||
          (String(m.sender_id) === r2 && String(m.receiver_id) === r1)
        ).sort((a, b) => new Date(a.created_at) - new Date(b.created_at));
      }
      return [...memoryDb.messages];
    }

    // 9. Notifications
    if (normalized.includes('notifications')) {
      if (normalized.includes('user_id = ?') || normalized.includes('`user_id` = ?')) {
        const target = String(params[0]);
        const resolvedUId = resolveUserId(target);
        return memoryDb.notifications.filter(n => 
          String(n.user_id) === String(resolvedUId) || 
          String(n.user_id) === target
        ).sort((a,b) => b.id - a.id);
      }
      return [...memoryDb.notifications];
    }
  }

  // INSERT queries
  if (normalized.startsWith('insert into')) {
    if (normalized.includes('users')) {
      const newId = memoryDb.users.length ? Math.max(...memoryDb.users.map(u => u.id || 0)) + 1 : 1;
      const newUser = {
        id: newId,
        _id: `user_${newId}`,
        name: params[0],
        email: params[1],
        password: params[2],
        role: params[3] || 'customer',
        phone: params[4] || '',
        address: params[5] || '',
        city: params[6] || 'Jaipur',
        avatar: params[7] || `https://api.dicebear.com/7.x/avataaars/svg?seed=${params[0]}`,
        profileImage: params[7] || `https://api.dicebear.com/7.x/avataaars/svg?seed=${params[0]}`,
        created_at: new Date()
      };
      memoryDb.users.push(newUser);

      // Persist to MongoDB Atlas
      if (mongoose.connection.readyState === 1) {
        User.create({
          name: newUser.name,
          email: newUser.email,
          password: newUser.password,
          role: newUser.role,
          phone: newUser.phone,
          address: newUser.address,
          city: newUser.city,
          profileImage: newUser.avatar
        }).then(doc => {
          newUser.mongoId = doc._id;
          console.log(`💾 [MongoDB] User persisted to database: ${newUser.email} (ID: ${doc._id})`);
        }).catch(err => {
          console.warn('⚠️ [MongoDB] User persistence notice:', err.message);
        });
      }

      return { insertId: newId, affectedRows: 1 };
    }

    if (normalized.includes('service_providers')) {
      const newId = memoryDb.service_providers.length ? Math.max(...memoryDb.service_providers.map(p => p.id || 0)) + 1 : 1;
      const newProv = {
        id: newId,
        _id: `sp_${newId}`,
        user_id: params[0],
        category_id: params[1],
        business_name: params[2],
        tagline: params[3] || '',
        bio: params[4] || '',
        experience_years: params[5] || 1,
        hourly_rate: params[6] || 350,
        city: params[7] || 'Jaipur',
        area: params[8] || 'Malviya Nagar',
        latitude: params[9] || 26.8529,
        longitude: params[10] || 75.8052,
        is_available: 1,
        is_emergency: params[11] ? 1 : 0,
        working_hours: params[12] || '9:00 AM - 8:00 PM',
        rating: 5.0,
        total_reviews: 0,
        verified: 1,
        verificationStatus: 'verified',
        created_at: new Date()
      };
      memoryDb.service_providers.push(newProv);

      // Persist to MongoDB Atlas
      if (mongoose.connection.readyState === 1) {
        const u = memoryDb.users.find(user => user.id === newProv.user_id);
        const mongoUserId = u?.mongoId || new mongoose.Types.ObjectId();
        ServiceProvider.create({
          user: mongoUserId,
          businessName: newProv.business_name,
          name: u?.name || newProv.business_name,
          tagline: newProv.tagline,
          bio: newProv.bio,
          experienceYears: newProv.experience_years,
          hourlyRate: newProv.hourly_rate,
          pricing: { hourlyRate: newProv.hourly_rate, startingPrice: 299 },
          city: newProv.city,
          area: newProv.area,
          categoryId: newProv.category_id,
          isAvailable: true,
          isEmergency: !!newProv.is_emergency,
          rating: 5.0,
          totalReviews: 0,
          verificationStatus: 'verified',
          verified: true
        }).then(doc => {
          newProv.mongoId = doc._id;
          console.log(`💾 [MongoDB] ServiceProvider persisted to database: ${newProv.business_name}`);
        }).catch(err => {
          console.warn('⚠️ [MongoDB] ServiceProvider persistence notice:', err.message);
        });
      }

      return { insertId: newId, affectedRows: 1 };
    }

    if (normalized.includes('bookings')) {
      const newId = memoryDb.bookings.length ? Math.max(...memoryDb.bookings.map(b => b.id || 0)) + 1 : 1;
      const newBooking = {
        id: newId,
        _id: `b_${newId}`,
        customer_id: params[0],
        provider_id: params[1],
        service_id: params[2],
        service_title: params[3],
        booking_date: params[4],
        booking_time: params[5],
        total_price: params[6],
        status: 'pending',
        customer_address: params[7],
        customer_phone: params[8],
        notes: params[9] || '',
        created_at: new Date()
      };
      memoryDb.bookings.push(newBooking);

      if (mongoose.connection.readyState === 1) {
        const cust = memoryDb.users.find(u => u.id === newBooking.customer_id);
        const prov = memoryDb.service_providers.find(p => p.id === newBooking.provider_id);
        const custId = cust?.mongoId || new mongoose.Types.ObjectId();
        const provId = prov?.mongoId || new mongoose.Types.ObjectId();

        Booking.create({
          customerId: custId,
          providerId: provId,
          serviceTitle: newBooking.service_title,
          bookingDate: newBooking.booking_date,
          bookingTime: newBooking.booking_time,
          address: newBooking.customer_address,
          customer_phone: newBooking.customer_phone,
          notes: newBooking.notes,
          estimatedCost: newBooking.total_price,
          finalCost: newBooking.total_price,
          total_price: newBooking.total_price,
          status: 'pending'
        }).then(doc => {
          newBooking.mongoId = doc._id;
          console.log(`💾 [MongoDB] Booking persisted to database: #${newId}`);
        }).catch(err => {});
      }

      return { insertId: newId, affectedRows: 1 };
    }

    if (normalized.includes('services')) {
      const newId = memoryDb.services.length ? Math.max(...memoryDb.services.map(s => s.id || 0)) + 1 : 1;
      const newService = {
        id: newId,
        _id: `srv_${newId}`,
        provider_id: params[0],
        category_id: params[1],
        title: params[2],
        serviceName: params[2],
        description: params[3],
        price: params[4],
        averagePrice: params[4],
        duration_mins: params[5] || 60,
        price_type: params[6] || 'fixed',
        is_active: 1,
        created_at: new Date()
      };
      memoryDb.services.push(newService);

      if (mongoose.connection.readyState === 1) {
        const prov = memoryDb.service_providers.find(p => p.id === newService.provider_id);
        const provId = prov?.mongoId || new mongoose.Types.ObjectId();
        Service.create({
          provider: provId,
          serviceName: newService.title,
          title: newService.title,
          category: 'General',
          categoryId: newService.category_id,
          description: newService.description,
          price: newService.price,
          averagePrice: newService.price,
          durationMins: newService.duration_mins,
          priceType: newService.price_type,
          isActive: true
        }).then(doc => {
          newService.mongoId = doc._id;
        }).catch(err => {});
      }

      return { insertId: newId, affectedRows: 1 };
    }

    if (normalized.includes('reviews')) {
      const newId = memoryDb.reviews.length ? Math.max(...memoryDb.reviews.map(r => r.id || 0)) + 1 : 1;
      const newReview = {
        id: newId,
        _id: `r_${newId}`,
        booking_id: params[0],
        provider_id: params[1],
        customer_id: params[2],
        rating: Number(params[3]),
        comment: params[4],
        provider_response: null,
        created_at: new Date()
      };
      memoryDb.reviews.push(newReview);

      // Recalculate provider average rating
      const provReviews = memoryDb.reviews.filter(r => r.provider_id == newReview.provider_id);
      const avg = provReviews.reduce((sum, r) => sum + r.rating, 0) / provReviews.length;
      const prov = memoryDb.service_providers.find(p => p.id == newReview.provider_id || p._id == newReview.provider_id);
      if (prov) {
        prov.rating = Number(avg.toFixed(2));
        prov.total_reviews = provReviews.length;
      }

      if (mongoose.connection.readyState === 1) {
        const cust = memoryDb.users.find(u => u.id === newReview.customer_id);
        const booking = memoryDb.bookings.find(b => b.id === newReview.booking_id);
        Review.create({
          customerId: cust?.mongoId || new mongoose.Types.ObjectId(),
          providerId: prov?.mongoId || new mongoose.Types.ObjectId(),
          bookingId: booking?.mongoId || new mongoose.Types.ObjectId(),
          rating: newReview.rating,
          comment: newReview.comment
        }).then(doc => {
          newReview.mongoId = doc._id;
        }).catch(err => {});
      }

      return { insertId: newId, affectedRows: 1 };
    }

    if (normalized.includes('favorites')) {
      const exists = memoryDb.favorites.find(f => f.customer_id == params[0] && f.provider_id == params[1]);
      if (!exists) {
        const newId = memoryDb.favorites.length ? Math.max(...memoryDb.favorites.map(f => f.id || 0)) + 1 : 1;
        const newFav = { id: newId, _id: `fav_${newId}`, customer_id: params[0], provider_id: params[1], created_at: new Date() };
        memoryDb.favorites.push(newFav);

        if (mongoose.connection.readyState === 1) {
          const cust = memoryDb.users.find(u => u.id == params[0]);
          const prov = memoryDb.service_providers.find(p => p.id == params[1]);
          if (cust?.mongoId && prov?.mongoId) {
            Favorite.create({ customerId: cust.mongoId, providerId: prov.mongoId }).catch(() => {});
          }
        }

        return { insertId: newId, affectedRows: 1 };
      }
      return { affectedRows: 0 };
    }

    if (normalized.includes('messages')) {
      const newId = memoryDb.messages.length ? Math.max(...memoryDb.messages.map(m => m.id || 0)) + 1 : 1;
      const newMsg = {
        id: newId,
        _id: `msg_${newId}`,
        sender_id: params[0],
        receiver_id: params[1],
        booking_id: params[2] || null,
        message: params[3],
        is_read: 0,
        created_at: new Date()
      };
      memoryDb.messages.push(newMsg);

      if (mongoose.connection.readyState === 1) {
        const sender = memoryDb.users.find(u => u.id == params[0]);
        const receiver = memoryDb.users.find(u => u.id == params[1]);
        if (sender?.mongoId && receiver?.mongoId) {
          Chat.create({
            sender: sender.mongoId,
            receiver: receiver.mongoId,
            message: newMsg.message
          }).catch(() => {});
        }
      }

      return { insertId: newId, affectedRows: 1 };
    }
  }

  // UPDATE queries
  if (normalized.startsWith('update')) {
    if (normalized.includes('bookings')) {
      if (normalized.includes('status = ?') || normalized.includes('`status` = ?')) {
        const status = params[0];
        const id = params[1];
        const booking = memoryDb.bookings.find(b => b.id == id || b._id == id);
        if (booking) {
          booking.status = status;
          if (mongoose.connection.readyState === 1 && booking.mongoId) {
            Booking.findByIdAndUpdate(booking.mongoId, { status }).catch(() => {});
          }
          return { affectedRows: 1 };
        }
      }
    }

    if (normalized.includes('service_providers')) {
      if (normalized.includes('is_available = ?') || normalized.includes('`is_available` = ?')) {
        const target = String(params[1]);
        const resolvedUId = resolveUserId(target);
        const resolvedPId = resolveProviderId(target);
        const prov = memoryDb.service_providers.find(p => 
          String(p.id) === target || 
          String(p.id) === String(resolvedPId) || 
          String(p._id) === target || 
          String(p.user_id) === target || 
          String(p.user_id) === String(resolvedUId) || 
          (p.mongoId && String(p.mongoId) === target) ||
          (p.userId && String(p.userId) === target)
        );
        if (prov) {
          prov.is_available = params[0] ? 1 : 0;
          if (mongoose.connection.readyState === 1 && prov.mongoId) {
            ServiceProvider.findByIdAndUpdate(prov.mongoId, { isAvailable: !!params[0] }).catch(() => {});
          }
          return { affectedRows: 1 };
        }
      }
    }

    if (normalized.includes('reviews')) {
      if (normalized.includes('provider_response = ?') || normalized.includes('`provider_response` = ?')) {
        const response = params[0];
        const id = params[1];
        const rev = memoryDb.reviews.find(r => r.id == id || r._id == id);
        if (rev) {
          rev.provider_response = response;
          if (mongoose.connection.readyState === 1 && rev.mongoId) {
            Review.findByIdAndUpdate(rev.mongoId, { providerResponse: response }).catch(() => {});
          }
          return { affectedRows: 1 };
        }
      }
    }

    if (normalized.includes('users')) {
      const id = params[params.length - 1];
      const target = String(id);
      const u = memoryDb.users.find(user => String(user.id) === target || String(user._id) === target || (user.mongoId && String(user.mongoId) === target));
      if (u) {
        if (params.length >= 4) {
          u.name = params[0] || u.name;
          u.phone = params[1] || u.phone;
          u.address = params[2] || u.address;
          u.city = params[3] || u.city;
          if (params[4]) {
            u.avatar = params[4];
            u.profileImage = params[4];
          }
        }
        if (mongoose.connection.readyState === 1 && u.mongoId) {
          User.findByIdAndUpdate(u.mongoId, {
            name: u.name,
            phone: u.phone,
            address: u.address,
            city: u.city,
            profileImage: u.avatar
          }).catch(() => {});
        }
        return { affectedRows: 1 };
      }
    }
  }

  // DELETE queries
  if (normalized.startsWith('delete from')) {
    if (normalized.includes('favorites')) {
      const cTarget = String(params[0]);
      const pTarget = String(params[1]);
      const resolvedC = resolveUserId(cTarget);
      const resolvedP = resolveProviderId(pTarget);
      const idx = memoryDb.favorites.findIndex(f => 
        (String(f.customer_id) === cTarget || String(f.customer_id) === String(resolvedC)) && 
        (String(f.provider_id) === pTarget || String(f.provider_id) === String(resolvedP))
      );
      if (idx !== -1) {
        memoryDb.favorites.splice(idx, 1);
        if (mongoose.connection.readyState === 1) {
          const cust = memoryDb.users.find(u => String(u.id) === String(resolvedC) || (u.mongoId && String(u.mongoId) === cTarget));
          const prov = memoryDb.service_providers.find(p => String(p.id) === String(resolvedP) || (p.mongoId && String(p.mongoId) === pTarget));
          if (cust?.mongoId && prov?.mongoId) {
            Favorite.deleteOne({ customerId: cust.mongoId, providerId: prov.mongoId }).catch(() => {});
          }
        }
        return { affectedRows: 1 };
      }
    }
    if (normalized.includes('services')) {
      const sId = params[0];
      const idx = memoryDb.services.findIndex(s => s.id == sId || s._id == sId);
      if (idx !== -1) {
        const removed = memoryDb.services.splice(idx, 1)[0];
        if (mongoose.connection.readyState === 1 && removed.mongoId) {
          Service.findByIdAndDelete(removed.mongoId).catch(() => {});
        }
        return { affectedRows: 1 };
      }
    }
  }

  return [];
}

export default { connectDB, query, memoryDb, getIsMongoConnected, getJwtSecret };

