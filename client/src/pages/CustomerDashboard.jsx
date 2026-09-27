import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { statAPI, bookingAPI, favoriteAPI, categoryAPI, providerAPI } from '../services/api';
import { 
  Calendar, 
  Heart, 
  CheckCircle, 
  Clock, 
  Search, 
  ArrowRight, 
  Star, 
  MapPin, 
  AlertTriangle,
  Zap,
  Droplets,
  Sparkles,
  Car,
  MessageSquare,
  ShieldCheck,
  TrendingUp
} from 'lucide-react';
import ProviderCard from '../components/ProviderCard';
import BookingModal from '../components/BookingModal';
import ReviewModal from '../components/ReviewModal';

export default function CustomerDashboard({ onOpenEmergency }) {
  const { user } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const [stats, setStats] = useState({ totalBookings: 0, activeBookings: 0, completedBookings: 0, totalFavorites: 0 });
  const [recentBookings, setRecentBookings] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [recommendedProviders, setRecommendedProviders] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  const [selectedProviderForBooking, setSelectedProviderForBooking] = useState(null);
  const [selectedBookingForReview, setSelectedBookingForReview] = useState(null);

  const loadDashboardData = async () => {
    try {
      const [statsRes, bookingsRes, favRes, provRes, catRes] = await Promise.all([
        statAPI.getCustomerStats().catch(() => ({ stats: {} })),
        bookingAPI.getAll().catch(() => ({ bookings: [] })),
        favoriteAPI.getAll().catch(() => ({ favorites: [] })),
        providerAPI.search({ sort: 'rating_desc' }).catch(() => ({ providers: [] })),
        categoryAPI.getAll().catch(() => ({ categories: [] }))
      ]);

      if (statsRes.success) setStats(statsRes.stats);
      if (bookingsRes.success) setRecentBookings(bookingsRes.bookings.slice(0, 4));
      if (favRes.success) setFavorites(favRes.favorites.slice(0, 3));
      if (provRes.success) setRecommendedProviders(provRes.providers.slice(0, 3));
      if (catRes.success) setCategories(catRes.categories.slice(0, 6));
    } catch (e) {
      console.warn('Dashboard load error:', e.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, []);

  return (
    <div style={{ padding: '2.5rem 0 5rem', background: 'var(--bg-main)', minHeight: '85vh' }}>
      <div className="container">
        
        {/* Welcome Header */}
        <div style={{
          background: 'linear-gradient(135deg, #0b0f19 0%, #1e1b4b 50%, #312e81 100%)',
          color: '#ffffff',
          padding: '2.5rem',
          borderRadius: 'var(--radius-xl)',
          marginBottom: '2.25rem',
          boxShadow: 'var(--shadow-2xl)',
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '1.5rem',
          position: 'relative',
          overflow: 'hidden'
        }}>
          {/* Subtle orb background */}
          <div style={{
            position: 'absolute',
            top: '-20%',
            right: '-10%',
            width: '350px',
            height: '350px',
            background: 'radial-gradient(circle, rgba(99, 102, 241, 0.3) 0%, rgba(0,0,0,0) 70%)',
            pointerEvents: 'none'
          }} />

          <div style={{ position: 'relative', zIndex: 10 }}>
            <span style={{ fontSize: '0.82rem', textTransform: 'uppercase', letterSpacing: '0.08em', color: '#a5b4fc', fontWeight: '800' }}>
              Customer Portal • {user?.city || 'Jaipur'}
            </span>
            <h1 style={{ fontSize: '2rem', fontWeight: '800', margin: '0.25rem 0 0.5rem', color: '#ffffff', letterSpacing: '-0.02em' }}>
              Namaste, {user?.name}! 👋
            </h1>
            <p style={{ color: '#cbd5e1', fontSize: '0.95rem', margin: 0 }}>
              Need assistance today? Connect with top-rated local specialists in seconds.
            </p>
          </div>

          <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', position: 'relative', zIndex: 10 }}>
            <button
              onClick={onOpenEmergency}
              className="btn btn-emergency btn-sm"
              style={{ fontWeight: '800', borderRadius: 'var(--radius-full)' }}
            >
              <AlertTriangle size={16} />
              <span>Emergency SOS</span>
            </button>
            <Link to="/services" className="btn btn-secondary btn-sm" style={{ background: '#ffffff', color: '#312e81', fontWeight: '800', borderRadius: 'var(--radius-full)' }}>
              <Search size={16} />
              <span>Find Services</span>
            </Link>
          </div>
        </div>

        {/* Stats Row */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))',
          gap: '1.25rem',
          marginBottom: '2.5rem'
        }}>
          <div className="glass-card" style={{ padding: '1.6rem', background: '#ffffff', borderRadius: 'var(--radius-lg)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
              <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: '700' }}>Total Bookings</span>
              <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'var(--primary-light)', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Calendar size={18} />
              </div>
            </div>
            <div style={{ fontSize: '2rem', fontWeight: '900', color: 'var(--text-main)', lineHeight: '1.1' }}>
              {stats.totalBookings || 0}
            </div>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.25rem', display: 'block' }}>Lifetime service appointments</span>
          </div>

          <div className="glass-card" style={{ padding: '1.6rem', background: '#ffffff', borderRadius: 'var(--radius-lg)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
              <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: '700' }}>Active Appointments</span>
              <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: '#fef3c7', color: '#b45309', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Clock size={18} />
              </div>
            </div>
            <div style={{ fontSize: '2rem', fontWeight: '900', color: '#d97706', lineHeight: '1.1' }}>
              {stats.activeBookings || 0}
            </div>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.25rem', display: 'block' }}>Pending / In-Progress</span>
          </div>

          <div className="glass-card" style={{ padding: '1.6rem', background: '#ffffff', borderRadius: 'var(--radius-lg)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
              <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: '700' }}>Completed Services</span>
              <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: '#ecfdf5', color: '#047857', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <CheckCircle size={18} />
              </div>
            </div>
            <div style={{ fontSize: '2rem', fontWeight: '900', color: '#059669', lineHeight: '1.1' }}>
              {stats.completedBookings || 0}
            </div>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.25rem', display: 'block' }}>Successfully resolved</span>
          </div>

          <div className="glass-card" style={{ padding: '1.6rem', background: '#ffffff', borderRadius: 'var(--radius-lg)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
              <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: '700' }}>Saved Favorites</span>
              <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: '#ffe4e6', color: 'var(--emergency)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Heart size={18} fill="currentColor" />
              </div>
            </div>
            <div style={{ fontSize: '2rem', fontWeight: '900', color: 'var(--emergency)', lineHeight: '1.1' }}>
              {stats.totalFavorites || favorites.length || 0}
            </div>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.25rem', display: 'block' }}>Bookmarked local pros</span>
          </div>
        </div>

        {/* 2-Column Main Section */}
        <div style={{ display: 'grid', gridTemplateColumns: '1.65fr 1fr', gap: '2rem', alignItems: 'flex-start' }} className="dash-grid">
          
          {/* LEFT: Recent Bookings & Recommended */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            
            {/* Recent Bookings Shelf */}
            <div className="glass-card" style={{ padding: '2rem', background: '#ffffff', borderRadius: 'var(--radius-xl)' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
                <h2 style={{ fontSize: '1.3rem', fontWeight: '800', color: 'var(--text-main)', margin: 0 }}>
                  Recent Bookings & Appointments
                </h2>
                <Link to="/bookings" style={{ fontSize: '0.88rem', fontWeight: '700', color: 'var(--primary)' }}>
                  View All ({stats.totalBookings || recentBookings.length})
                </Link>
              </div>

              {recentBookings.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '3rem 0', color: 'var(--text-muted)' }}>
                  <Calendar size={40} color="var(--border-subtle)" style={{ marginBottom: '0.5rem' }} />
                  <p style={{ fontWeight: '700', fontSize: '1rem' }}>No recent bookings found</p>
                  <p style={{ fontSize: '0.85rem', marginBottom: '1.25rem' }}>Find a plumber, electrician, or cleaner to schedule your first service.</p>
                  <Link to="/services" className="btn btn-primary btn-sm" style={{ fontWeight: '700' }}>Find Services</Link>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  {recentBookings.map((b) => (
                    <div
                      key={b.id}
                      style={{
                        padding: '1.25rem',
                        borderRadius: 'var(--radius-lg)',
                        border: '1px solid var(--border-subtle)',
                        background: 'var(--bg-subtle)',
                        display: 'flex',
                        flexWrap: 'wrap',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        gap: '1rem'
                      }}
                    >
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.35rem' }}>
                          <h4 style={{ fontSize: '1.05rem', fontWeight: '800', margin: 0, color: 'var(--text-main)' }}>
                            {b.service_title}
                          </h4>
                          <span className={`status-pill status-${b.status}`}>
                            {b.status}
                          </span>
                        </div>
                        <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', margin: 0 }}>
                          Provider: <strong>{b.provider_business_name}</strong> • Date: {new Date(b.booking_date).toLocaleDateString()} ({b.booking_time})
                        </p>
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
                        <span style={{ fontSize: '1.25rem', fontWeight: '800', color: 'var(--text-main)' }}>
                          ₹{b.total_price}
                        </span>

                        {b.status === 'completed' && !b.has_reviewed && (
                          <button
                            onClick={() => setSelectedBookingForReview(b)}
                            className="btn btn-secondary btn-sm"
                            style={{ fontSize: '0.82rem', color: '#92400e', background: '#fef3c7', border: '1px solid #fde68a', fontWeight: '700' }}
                          >
                            <Star size={14} fill="#f59e0b" color="#f59e0b" />
                            <span>Rate Service</span>
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Recommended Providers */}
            <div className="glass-card" style={{ padding: '2rem', background: '#ffffff', borderRadius: 'var(--radius-xl)' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
                <h2 style={{ fontSize: '1.3rem', fontWeight: '800', color: 'var(--text-main)', margin: 0 }}>
                  Recommended Professionals For You
                </h2>
                <Link to="/services" style={{ fontSize: '0.88rem', fontWeight: '700', color: 'var(--primary)' }}>
                  Explore All
                </Link>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '1.25rem' }}>
                {recommendedProviders.map((prov) => (
                  <ProviderCard
                    key={prov.id}
                    provider={prov}
                    onBook={(p) => setSelectedProviderForBooking(p)}
                  />
                ))}
              </div>
            </div>

          </div>

          {/* RIGHT: Quick Categories & Favorites */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            
            {/* Quick Categories */}
            <div className="glass-card" style={{ padding: '1.75rem', background: '#ffffff', borderRadius: 'var(--radius-xl)' }}>
              <h3 style={{ fontSize: '1.15rem', fontWeight: '800', color: 'var(--text-main)', marginBottom: '1.25rem' }}>
                Quick Service Categories
              </h3>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                {categories.map((c) => (
                  <Link
                    key={c.id}
                    to={`/services?category=${c.slug}`}
                    style={{
                      padding: '0.85rem',
                      borderRadius: 'var(--radius-md)',
                      background: 'var(--bg-subtle)',
                      color: 'var(--text-main)',
                      fontSize: '0.88rem',
                      fontWeight: '700',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      transition: 'all 0.2s',
                      border: '1px solid var(--border-subtle)'
                    }}
                  >
                    <span>{c.name}</span>
                  </Link>
                ))}
              </div>
            </div>

            {/* Favorite Providers Shelf */}
            <div className="glass-card" style={{ padding: '1.75rem', background: '#ffffff', borderRadius: 'var(--radius-xl)' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
                <h3 style={{ fontSize: '1.15rem', fontWeight: '800', color: 'var(--text-main)', margin: 0 }}>
                  Favorite Providers
                </h3>
                <Link to="/favorites" style={{ fontSize: '0.82rem', fontWeight: '700', color: 'var(--primary)' }}>
                  View All
                </Link>
              </div>

              {favorites.length === 0 ? (
                <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', margin: 0 }}>
                  You haven't saved any favorite providers yet. Click the heart icon on any provider card to bookmark them!
                </p>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                  {favorites.map((f) => (
                    <div
                      key={f.id}
                      style={{
                        padding: '0.85rem 1rem',
                        borderRadius: 'var(--radius-md)',
                        background: 'var(--bg-subtle)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        border: '1px solid var(--border-subtle)'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <img 
                          src={f.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${f.business_name}`} 
                          alt={f.business_name}
                          style={{ width: '36px', height: '36px', borderRadius: '50%', objectFit: 'cover' }}
                        />
                        <div>
                          <strong style={{ fontSize: '0.9rem', display: 'block', color: 'var(--text-main)' }}>
                            {f.business_name}
                          </strong>
                          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: '600' }}>
                            ⭐ {f.rating} • ₹{f.hourly_rate}/hr
                          </span>
                        </div>
                      </div>

                      <Link to={`/providers/${f.provider_id}`} className="btn btn-primary btn-sm" style={{ padding: '0.35rem 0.75rem', fontSize: '0.78rem', fontWeight: '700' }}>
                        Book
                      </Link>
                    </div>
                  ))}
                </div>
              )}
            </div>

          </div>

        </div>

      </div>

      {/* Booking Modal */}
      {selectedProviderForBooking && (
        <BookingModal
          provider={selectedProviderForBooking}
          onClose={() => setSelectedProviderForBooking(null)}
          onSuccess={() => {
            loadDashboardData();
            showToast('Booking submitted successfully!', 'success');
          }}
        />
      )}

      {/* Review Modal */}
      {selectedBookingForReview && (
        <ReviewModal
          booking={selectedBookingForReview}
          onClose={() => setSelectedBookingForReview(null)}
          onSuccess={() => {
            loadDashboardData();
            showToast('Review posted successfully!', 'success');
          }}
        />
      )}

      <style>{`
        @media (max-width: 900px) {
          .dash-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}
