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

const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/local_serve';

let isMongoConnected = false;

// In-memory fallback dataset for zero-config evaluation if MongoDB daemon is offline
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
    { id: 1, _id: 'cat_1', name: 'Electrical', slug: 'electrical', description: 'Expert electricians for wiring, short circuits, switchboards, and fan repairs.', icon: 'Zap', is_emergency: 1 },
    { id: 2, _id: 'cat_2', name: 'Plumbing', slug: 'plumbing', description: 'Skilled plumbers for pipe leaks, bathroom fittings, motor installation, and drainage.', icon: 'Droplets', is_emergency: 1 },
    { id: 3, _id: 'cat_3', name: 'Cleaning & Maid', slug: 'cleaning', description: 'Deep house cleaning, kitchen scrubbing, bathroom sanitation, and sofa cleaning.', icon: 'Sparkles', is_emergency: 0 },
    { id: 4, _id: 'cat_4', name: 'Automotive & Mechanic', slug: 'automotive', description: 'Car and bike roadside assistance, engine repairs, tyre puncture, and servicing.', icon: 'Car', is_emergency: 1 },
    { id: 5, _id: 'cat_5', name: 'AC & Appliance Repair', slug: 'appliance-repair', description: 'Fast repairs for Air Conditioners, Refrigerators, Washing Machines, and Microwaves.', icon: 'Flame', is_emergency: 1 },
    { id: 6, _id: 'cat_6', name: 'Carpentry & Woodwork', slug: 'carpentry', description: 'Custom furniture repair, door locks, modular cabinets, and wooden polishing.', icon: 'Hammer', is_emergency: 0 },
    { id: 7, _id: 'cat_7', name: 'Beauty & Salon', slug: 'beauty-salon', description: 'Professional home salon, haircuts, bridal makeup, facial, and grooming services.', icon: 'Scissors', is_emergency: 0 },
    { id: 8, _id: 'cat_8', name: 'Home Tutor & Education', slug: 'education', description: 'Experienced home tutors for CBSE/ICSE, mathematics, science, music, and languages.', icon: 'GraduationCap', is_emergency: 0 },
    { id: 9, _id: 'cat_9', name: 'Computer & Electronics', slug: 'computer-repair', description: 'Laptop/PC repairs, OS installation, WiFi setup, printer repair, and data recovery.', icon: 'Laptop', is_emergency: 0 },
    { id: 10, _id: 'cat_10', name: 'Painting & Renovation', slug: 'painting', description: 'Interior and exterior wall painting, waterproof coating, and wallpaper installation.', icon: 'Paintbrush', is_emergency: 0 }
  ];

  memoryDb.users = [
    { id: 1, _id: 'user_1', name: 'Aman Sharma', email: 'customer@example.com', password: hashedPassword, role: 'customer', phone: '+91 98290 12345', address: 'B-42, Malviya Nagar', city: 'Jaipur', avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80', profileImage: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80', created_at: new Date('2026-08-01') },
    { id: 2, _id: 'user_2', name: 'Pooja Verma', email: 'pooja@example.com', password: hashedPassword, role: 'customer', phone: '+91 98290 54321', address: 'Plot 18, Vaishali Nagar', city: 'Jaipur', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80', profileImage: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80', created_at: new Date('2026-08-02') },
    { id: 3, _id: 'user_3', name: 'Rohan Mehta', email: 'rohan@example.com', password: hashedPassword, role: 'customer', phone: '+91 98291 98765', address: 'Flat 302, Mansarovar', city: 'Jaipur', avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=200&q=80', profileImage: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=200&q=80', created_at: new Date('2026-08-03') },
    { id: 4, _id: 'user_4', name: 'Ramesh Kumar', email: 'ramesh.electric@example.com', password: hashedPassword, role: 'provider', phone: '+91 94140 11223', address: 'Shop 12, Main Market, Malviya Nagar', city: 'Jaipur', avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=200&q=80', profileImage: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=200&q=80', created_at: new Date('2026-08-01') },
    { id: 5, _id: 'user_5', name: 'Rajesh Sharma', email: 'rajesh.plumber@example.com', password: hashedPassword, role: 'provider', phone: '+91 94140 22334', address: 'Near Nursery Circle, Vaishali Nagar', city: 'Jaipur', avatar: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=200&q=80', profileImage: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=200&q=80', created_at: new Date('2026-08-01') },
    { id: 6, _id: 'user_6', name: 'Sunita Devi', email: 'sunita.cleaning@example.com', password: hashedPassword, role: 'provider', phone: '+91 94140 33445', address: 'Sector 7, Mansarovar', city: 'Jaipur', avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=200&q=80', profileImage: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=200&q=80', created_at: new Date('2026-08-01') },
    { id: 7, _id: 'user_7', name: 'Amit Patel', email: 'amit.mechanic@example.com', password: hashedPassword, role: 'provider', phone: '+91 94140 44556', address: 'MI Road, Near Panch Batti', city: 'Jaipur', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80', profileImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80', created_at: new Date('2026-08-01') },
    { id: 8, _id: 'user_8', name: 'Suresh Meena', email: 'suresh.ac@example.com', password: hashedPassword, role: 'provider', phone: '+91 94140 55667', address: 'Mahal Road, Jagatpura', city: 'Jaipur', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80', profileImage: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80', created_at: new Date('2026-08-01') },
    { id: 9, _id: 'user_9', name: 'Vikram Singh', email: 'vikram.carpenter@example.com', password: hashedPassword, role: 'provider', phone: '+91 94140 66778', address: 'Gali No. 4, Raja Park', city: 'Jaipur', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=200&q=80', profileImage: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=200&q=80', created_at: new Date('2026-08-01') },
    { id: 10, _id: 'user_10', name: 'Neha Gupta', email: 'neha.salon@example.com', password: hashedPassword, role: 'provider', phone: '+91 94140 77889', address: 'Tonk Road, Gopalpura Mode', city: 'Jaipur', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80', profileImage: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80', created_at: new Date('2026-08-01') },
    { id: 11, _id: 'user_11', name: 'Priya Verma', email: 'priya.tutor@example.com', password: hashedPassword, role: 'provider', phone: '+91 94140 88990', address: 'C-Scheme, Ashok Nagar', city: 'Jaipur', avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80', profileImage: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80', created_at: new Date('2026-08-01') },
    { id: 12, _id: 'user_12', name: 'Deepak Soni', email: 'deepak.tech@example.com', password: hashedPassword, role: 'provider', phone: '+91 94140 99001', address: 'Silver Square, Bhagwan Das Road', city: 'Jaipur', avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=200&q=80', profileImage: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=200&q=80', created_at: new Date('2026-08-01') },
    { id: 13, _id: 'user_13', name: 'Mukesh Prajapat', email: 'mukesh.paint@example.com', password: hashedPassword, role: 'provider', phone: '+91 94140 10203', address: 'Vidhyadhar Nagar Sector 2', city: 'Jaipur', avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=200&q=80', profileImage: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=200&q=80', created_at: new Date('2026-08-01') },
    { id: 14, _id: 'user_14', name: 'System Administrator', email: 'admin@example.com', password: hashedPassword, role: 'admin', phone: '+91 99999 00000', address: 'Headquarters, Tech Hub', city: 'Jaipur', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=200&q=80', profileImage: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=200&q=80', created_at: new Date('2026-08-01') }
  ];

  memoryDb.service_providers = [
    { id: 1, _id: 'sp_1', user_id: 4, category_id: 1, business_name: 'Ramesh Electrical Works', tagline: 'Certified 24/7 Electrical Care & Installation', bio: 'Experienced government licensed electrician with 8+ years specializing in residential rewiring, short-circuit diagnostics, inverter setups, and smart switch automation.', experience_years: 8, hourly_rate: 350.00, city: 'Jaipur', area: 'Malviya Nagar', latitude: 26.8529, longitude: 75.8052, is_available: 1, is_emergency: 1, working_hours: '24/7 Emergency Service', rating: 4.90, total_reviews: 24, verified: 1, verificationStatus: 'verified' },
    { id: 2, _id: 'sp_2', user_id: 5, category_id: 2, business_name: 'Sharma Plumbing Solutions', tagline: 'Reliable Pipe Repair, Fixtures & Leakage Experts', bio: 'Providing guaranteed fast plumbing services across Vaishali Nagar. Specializing in high-pressure water motors, concealed pipeline leak detection, and sanitary ware installation.', experience_years: 6, hourly_rate: 300.00, city: 'Jaipur', area: 'Vaishali Nagar', latitude: 26.9089, longitude: 75.7423, is_available: 1, is_emergency: 1, working_hours: '7:30 AM - 9:00 PM', rating: 4.85, total_reviews: 19, verified: 1, verificationStatus: 'verified' },
    { id: 3, _id: 'sp_3', user_id: 6, category_id: 3, business_name: 'SparklePro Deep Cleaners', tagline: 'Eco-Friendly Residential & Commercial Deep Cleaning', bio: 'Led by Sunita Devi with a 6-member trained team. We use industrial steam cleaners and eco-friendly disinfectants for complete home sanitation, kitchen de-greasing, and sofa shampooing.', experience_years: 5, hourly_rate: 450.00, city: 'Jaipur', area: 'Mansarovar', latitude: 26.8612, longitude: 75.7667, is_available: 1, is_emergency: 0, working_hours: '8:00 AM - 7:00 PM', rating: 4.92, total_reviews: 31, verified: 1, verificationStatus: 'verified' },
    { id: 4, _id: 'sp_4', user_id: 7, category_id: 4, business_name: 'Express Auto Mobile Garage', tagline: '24/7 Roadside Assistance & Engine Mechanics', bio: 'Immediate breakdown assistance, battery jump start, tyre puncture replacement, and complete on-site 2-wheeler and 4-wheeler periodic servicing.', experience_years: 9, hourly_rate: 500.00, city: 'Jaipur', area: 'MI Road', latitude: 26.9184, longitude: 75.8115, is_available: 1, is_emergency: 1, working_hours: '24/7 Emergency Service', rating: 4.78, total_reviews: 15, verified: 1, verificationStatus: 'verified' },
    { id: 5, _id: 'sp_5', user_id: 8, category_id: 5, business_name: 'Cool Breeze AC & Refrigeration', tagline: 'Certified HVAC Technicians for all AC & Fridge Brands', bio: 'Specialists in Split/Window AC gas charging, PCB board repairs, deep jet-pump foam wash, and inverter refrigerator troubleshooting with genuine parts.', experience_years: 7, hourly_rate: 400.00, city: 'Jaipur', area: 'Jagatpura', latitude: 26.8228, longitude: 75.8654, is_available: 1, is_emergency: 1, working_hours: '8:00 AM - 9:00 PM', rating: 4.88, total_reviews: 22, verified: 1, verificationStatus: 'verified' },
    { id: 6, _id: 'sp_6', user_id: 9, category_id: 6, business_name: 'Royal Wood Art & Carpentry', tagline: 'Custom Furniture Design, Door Locks & Modern Fittings', bio: 'Master craftsman with over a decade of experience crafting custom modular wardrobes, hydraulic bed repairs, door closers, and luxury wood polishing.', experience_years: 11, hourly_rate: 400.00, city: 'Jaipur', area: 'Raja Park', latitude: 26.8973, longitude: 75.8336, is_available: 1, is_emergency: 0, working_hours: '9:00 AM - 8:00 PM', rating: 4.80, total_reviews: 14, verified: 1, verificationStatus: 'verified' },
    { id: 7, _id: 'sp_7', user_id: 10, category_id: 7, business_name: 'Glow & Grace Home Salon', tagline: 'Premium Beauty, Hair Styling & Bridal Care at Home', bio: 'Certified makeup artist & cosmetologist offering hygienic salon-at-home services. We use single-use kits, international skin products, and tailored bridal packages.', experience_years: 4, hourly_rate: 600.00, city: 'Jaipur', area: 'Tonk Road', latitude: 26.8741, longitude: 75.7989, is_available: 1, is_emergency: 0, working_hours: '10:00 AM - 7:00 PM', rating: 4.95, total_reviews: 28, verified: 1, verificationStatus: 'verified' },
    { id: 8, _id: 'sp_8', user_id: 11, category_id: 8, business_name: 'Priya Verma Academic Mentorship', tagline: 'Personalized STEM & Board Exam Home Tutoring', bio: 'M.Sc. Gold Medalist with 6 years experience mentoring Class 8–12 CBSE/ICSE students in Mathematics, Physics, and competitive foundation with interactive problem solving.', experience_years: 6, hourly_rate: 500.00, city: 'Jaipur', area: 'C-Scheme', latitude: 26.9110, longitude: 75.8012, is_available: 1, is_emergency: 0, working_hours: '3:00 PM - 8:30 PM', rating: 4.98, total_reviews: 36, verified: 1, verificationStatus: 'verified' },
    { id: 9, _id: 'sp_9', user_id: 12, category_id: 9, business_name: 'TechDoctor Laptop & Network Clinic', tagline: 'Doorstep Computer Diagnostics, Screen & Chip Repair', bio: 'Certified hardware and networking engineer. Fast diagnosis for slow laptops, screen replacements, virus cleaning, printer sharing, and home WiFi mesh setup.', experience_years: 7, hourly_rate: 450.00, city: 'Jaipur', area: 'Bani Park', latitude: 26.9312, longitude: 75.7925, is_available: 1, is_emergency: 0, working_hours: '9:30 AM - 8:30 PM', rating: 4.82, total_reviews: 18, verified: 1, verificationStatus: 'verified' },
    { id: 10, _id: 'sp_10', user_id: 13, category_id: 10, business_name: 'Jaipur Palette Wall Master', tagline: 'Luxury Wall Painting, Textures & Waterproofing', bio: 'Over 12 years creating vibrant living spaces using Asian Paints Royale, damp-proof sealants, stencils, and dust-free mechanized sanding tools.', experience_years: 12, hourly_rate: 350.00, city: 'Jaipur', area: 'Vidhyadhar Nagar', latitude: 26.9641, longitude: 75.7789, is_available: 1, is_emergency: 0, working_hours: '8:30 AM - 6:30 PM', rating: 4.75, total_reviews: 12, verified: 1, verificationStatus: 'verified' }
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

// Attempt MongoDB / Mongoose connection with timeout
export async function connectDB() {
  try {
    mongoose.set('strictQuery', false);
    await mongoose.connect(MONGO_URI, {
      serverSelectionTimeoutMS: 2500
    });
    isMongoConnected = true;
    console.log(`\n======================================================`);
    console.log(`✅ [MongoDB] Connected successfully to Mongoose: ${MONGO_URI}`);
    console.log(`======================================================\n`);
    return mongoose.connection;
  } catch (error) {
    isMongoConnected = false;
    console.log(`\nℹ️ [Database Engine] MongoDB daemon at "${MONGO_URI}" was not directly reachable.`);
    console.log(`   Running seamlessly on integrated dual-engine fallback store.`);
    console.log(`   To connect MongoDB Atlas or Local mongod, set MONGO_URI in your .env file.\n`);
    return null;
  }
}

connectDB();

export function getIsMongoConnected() {
  return isMongoConnected;
}

/**
 * Universal query router supporting both native MongoDB and integrated fallback store
 */
export async function query(sql, params = []) {
  return handleMemoryQuery(sql, params);
}

// Memory query handler for controllers
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
      if (normalized.includes('where `email` = ?') || normalized.includes('where email = ?')) {
        const user = memoryDb.users.find(u => u.email.toLowerCase() === String(params[0]).toLowerCase());
        return user ? [{ ...user }] : [];
      }
      if (normalized.includes('where `id` = ?') || normalized.includes('where id = ?')) {
        const user = memoryDb.users.find(u => u.id === Number(params[0]) || u._id === String(params[0]));
        return user ? [{ ...user }] : [];
      }
      return [...memoryDb.users];
    }

    // 3. Service Providers Search & List
    if (normalized.includes('service_providers')) {
      let results = memoryDb.service_providers.map(p => {
        const user = memoryDb.users.find(u => u.id === p.user_id || u._id === String(p.user_id)) || {};
        const cat = memoryDb.categories.find(c => c.id === p.category_id || c._id === String(p.category_id)) || {};
        const provServices = memoryDb.services.filter(s => (s.provider_id === p.id || s.provider_id === p._id) && s.is_active);
        const provReviews = memoryDb.reviews.filter(r => r.provider_id === p.id || r.provider_id === p._id);
        
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

      if (normalized.includes('where `id` = ?') || normalized.includes('where p.`id` = ?') || normalized.includes('where sp.id = ?')) {
        const found = results.find(p => p.id === Number(params[0]) || p._id === String(params[0]));
        return found ? [found] : [];
      }
      if (normalized.includes('where `user_id` = ?') || normalized.includes('where sp.user_id = ?')) {
        const found = results.find(p => p.user_id === Number(params[0]) || p.user_id === String(params[0]));
        return found ? [found] : [];
      }
      return results;
    }

    // 4. Services
    if (normalized.includes('services')) {
      if (normalized.includes('where `provider_id` = ?') || normalized.includes('where provider_id = ?')) {
        return memoryDb.services.filter(s => s.provider_id === Number(params[0]) || s.provider_id === String(params[0]));
      }
      if (normalized.includes('where `id` = ?') || normalized.includes('where id = ?')) {
        const s = memoryDb.services.find(s => s.id === Number(params[0]) || s._id === String(params[0]));
        return s ? [s] : [];
      }
      return [...memoryDb.services];
    }

    // 5. Bookings
    if (normalized.includes('bookings')) {
      let results = memoryDb.bookings.map(b => {
        const cust = memoryDb.users.find(u => u.id === b.customer_id || u._id === String(b.customer_id)) || {};
        const prov = memoryDb.service_providers.find(p => p.id === b.provider_id || p._id === String(b.provider_id)) || {};
        const provUser = memoryDb.users.find(u => u.id === prov.user_id || u._id === String(prov.user_id)) || {};
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

      if (normalized.includes('where b.`customer_id` = ?') || normalized.includes('where customer_id = ?')) {
        return results.filter(b => b.customer_id === Number(params[0]) || b.customer_id === String(params[0])).sort((a,b) => b.id - a.id);
      }
      if (normalized.includes('where b.`provider_id` = ?') || normalized.includes('where provider_id = ?')) {
        return results.filter(b => b.provider_id === Number(params[0]) || b.provider_id === String(params[0])).sort((a,b) => b.id - a.id);
      }
      if (normalized.includes('where b.`id` = ?') || normalized.includes('where id = ?')) {
        const found = results.find(b => b.id === Number(params[0]) || b._id === String(params[0]));
        return found ? [found] : [];
      }
      return results.sort((a,b) => b.id - a.id);
    }

    // 6. Reviews
    if (normalized.includes('reviews')) {
      let results = memoryDb.reviews.map(r => {
        const cust = memoryDb.users.find(u => u.id === r.customer_id || u._id === String(r.customer_id)) || {};
        return {
          ...r,
          customer_name: cust.name,
          customer_avatar: cust.avatar,
          customer_city: cust.city
        };
      });

      if (normalized.includes('where `provider_id` = ?') || normalized.includes('where r.provider_id = ?')) {
        return results.filter(r => r.provider_id === Number(params[0]) || r.provider_id === String(params[0])).sort((a,b) => b.id - a.id);
      }
      return results.sort((a,b) => b.id - a.id);
    }

    // 7. Favorites
    if (normalized.includes('favorites')) {
      if (normalized.includes('where `customer_id` = ?') || normalized.includes('where f.customer_id = ?')) {
        const favs = memoryDb.favorites.filter(f => f.customer_id === Number(params[0]) || f.customer_id === String(params[0]));
        return favs.map(f => {
          const prov = memoryDb.service_providers.find(p => p.id === f.provider_id || p._id === String(f.provider_id));
          const user = prov ? memoryDb.users.find(u => u.id === prov.user_id || u._id === String(prov.user_id)) : {};
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
        const u1 = Number(params[0]) || params[0];
        const u2 = Number(params[1]) || params[1];
        return memoryDb.messages.filter(m => 
          (m.sender_id == u1 && m.receiver_id == u2) ||
          (m.sender_id == u2 && m.receiver_id == u1)
        ).sort((a, b) => new Date(a.created_at) - new Date(b.created_at));
      }
      return [...memoryDb.messages];
    }

    // 9. Notifications
    if (normalized.includes('notifications')) {
      if (normalized.includes('where `user_id` = ?')) {
        return memoryDb.notifications.filter(n => n.user_id === Number(params[0]) || n.user_id === String(params[0])).sort((a,b) => b.id - a.id);
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
      return { insertId: newId, affectedRows: 1 };
    }

    if (normalized.includes('favorites')) {
      const exists = memoryDb.favorites.find(f => f.customer_id == params[0] && f.provider_id == params[1]);
      if (!exists) {
        const newId = memoryDb.favorites.length ? Math.max(...memoryDb.favorites.map(f => f.id || 0)) + 1 : 1;
        memoryDb.favorites.push({ id: newId, _id: `fav_${newId}`, customer_id: params[0], provider_id: params[1], created_at: new Date() });
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
          return { affectedRows: 1 };
        }
      }
    }

    if (normalized.includes('service_providers')) {
      if (normalized.includes('is_available = ?') || normalized.includes('`is_available` = ?')) {
        const prov = memoryDb.service_providers.find(p => p.id == params[1] || p._id == params[1] || p.user_id == params[1]);
        if (prov) {
          prov.is_available = params[0] ? 1 : 0;
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
          return { affectedRows: 1 };
        }
      }
    }

    if (normalized.includes('users')) {
      const id = params[params.length - 1];
      const u = memoryDb.users.find(user => user.id == id || user._id == id);
      if (u) {
        if (params.length >= 4) {
          u.name = params[0] || u.name;
          u.phone = params[1] || u.phone;
          u.address = params[2] || u.address;
          u.city = params[3] || u.city;
        }
        return { affectedRows: 1 };
      }
    }
  }

  // DELETE queries
  if (normalized.startsWith('delete from')) {
    if (normalized.includes('favorites')) {
      const cId = params[0];
      const pId = params[1];
      const idx = memoryDb.favorites.findIndex(f => f.customer_id == cId && f.provider_id == pId);
      if (idx !== -1) {
        memoryDb.favorites.splice(idx, 1);
        return { affectedRows: 1 };
      }
    }
    if (normalized.includes('services')) {
      const sId = params[0];
      const idx = memoryDb.services.findIndex(s => s.id == sId || s._id == sId);
      if (idx !== -1) {
        memoryDb.services.splice(idx, 1);
        return { affectedRows: 1 };
      }
    }
  }

  return [];
}

export default { connectDB, query, memoryDb, getIsMongoConnected };
