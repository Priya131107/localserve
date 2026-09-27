import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { bookingAPI } from '../services/api';
import { 
  Calendar, 
  Clock, 
  MapPin, 
  Phone, 
  Star, 
  MessageSquare, 
  X, 
  CheckCircle, 
  AlertCircle,
  FileText
} from 'lucide-react';
import ReviewModal from '../components/ReviewModal';
import ChatDrawer from '../components/ChatDrawer';

export default function MyBookings() {
  const { user } = useAuth();
  const { showToast } = useToast();

  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedBookingForReview, setSelectedBookingForReview] = useState(null);
  const [activeChatUser, setActiveChatUser] = useState(null);

  const loadBookings = async () => {
    try {
      const res = await bookingAPI.getAll();
      if (res.success) {
        setBookings(res.bookings || []);
      }
    } catch (e) {
      showToast('Failed to load your bookings', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBookings();
  }, []);

  const handleCancelBooking = async (bookingId) => {
    if (!window.confirm('Are you sure you want to cancel this booking appointment?')) return;

    try {
      const res = await bookingAPI.updateStatus(bookingId, 'cancelled');
      if (res.success) {
        showToast('Booking cancelled', 'info');
        loadBookings();
      }
    } catch (error) {
      showToast('Failed to cancel booking', 'error');
    }
  };

  const filteredBookings = filterStatus === 'all' 
    ? bookings 
    : bookings.filter((b) => b.status === filterStatus);

  return (
    <div style={{ padding: '2.5rem 0 5rem', background: 'var(--bg-main)', minHeight: '85vh' }}>
      <div className="container" style={{ maxWidth: '1000px' }}>
        
        {/* Header */}
        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '1rem',
          marginBottom: '2rem'
        }}>
          <div>
            <h1 style={{ fontSize: '2rem', fontWeight: '800', color: 'var(--text-main)', margin: 0 }}>
              My Service Bookings
            </h1>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
              Track your ongoing service requests, appointment dates, and review completed jobs.
            </p>
          </div>

          <Link to="/services" className="btn btn-primary btn-sm">
            Book Another Service
          </Link>
        </div>

        {/* Filter Tabs Bar */}
        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '0.5rem',
          marginBottom: '1.5rem',
          background: '#ffffff',
          padding: '0.4rem',
          borderRadius: 'var(--radius-md)',
          border: '1px solid var(--border-subtle)'
        }}>
          {[
            { id: 'all', label: 'All Bookings' },
            { id: 'pending', label: 'Pending' },
            { id: 'accepted', label: 'Accepted / Upcoming' },
            { id: 'completed', label: 'Completed' },
            { id: 'cancelled', label: 'Cancelled' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setFilterStatus(tab.id)}
              style={{
                padding: '0.45rem 0.95rem',
                border: 'none',
                borderRadius: 'var(--radius-sm)',
                background: filterStatus === tab.id ? 'var(--primary)' : 'transparent',
                color: filterStatus === tab.id ? '#ffffff' : 'var(--text-muted)',
                fontWeight: '600',
                fontSize: '0.85rem',
                cursor: 'pointer',
                transition: 'all 0.15s'
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Bookings List */}
        {loading ? (
          <div style={{ textAlign: 'center', padding: '4rem 0', color: 'var(--text-muted)' }}>
            <p style={{ fontWeight: '600' }}>Loading your bookings...</p>
          </div>
        ) : filteredBookings.length === 0 ? (
          <div className="glass-card" style={{ padding: '3.5rem 2rem', textAlign: 'center', background: '#ffffff' }}>
            <Calendar size={48} color="var(--border-subtle)" style={{ marginBottom: '1rem' }} />
            <h3 style={{ fontSize: '1.25rem', fontWeight: '800', color: 'var(--text-main)', marginBottom: '0.5rem' }}>
              No {filterStatus !== 'all' ? filterStatus : ''} bookings found
            </h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
              Whenever you book a plumber, electrician, cleaner, or tutor, they will appear here.
            </p>
            <Link to="/services" className="btn btn-primary btn-sm">Find Local Services</Link>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            {filteredBookings.map((b) => (
              <div
                key={b.id}
                className="glass-card"
                style={{
                  padding: '1.5rem',
                  background: '#ffffff',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '1rem'
                }}
              >
                {/* Header Strip */}
                <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '0.75rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <img 
                      src={b.provider_avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${b.provider_business_name}`} 
                      alt={b.provider_business_name}
                      style={{ width: '44px', height: '44px', borderRadius: '10px', objectFit: 'cover' }}
                    />
                    <div>
                      <h3 style={{ fontSize: '1.15rem', fontWeight: '800', color: 'var(--text-main)', margin: 0 }}>
                        {b.service_title}
                      </h3>
                      <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', margin: 0 }}>
                        Provider: <strong>{b.provider_business_name}</strong> ({b.provider_area}, {b.provider_city})
                      </p>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <span className={`status-pill status-${b.status}`}>
                      {b.status}
                    </span>
                    <span style={{ fontSize: '1.35rem', fontWeight: '800', color: 'var(--primary)' }}>
                      ₹{b.total_price}
                    </span>
                  </div>
                </div>

                {/* Details Strip */}
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                  gap: '0.75rem',
                  background: 'var(--bg-subtle)',
                  padding: '0.85rem 1rem',
                  borderRadius: 'var(--radius-md)',
                  fontSize: '0.84rem'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <Calendar size={15} color="var(--primary)" />
                    <span><strong>Date:</strong> {new Date(b.booking_date).toLocaleDateString()}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <Clock size={15} color="var(--secondary)" />
                    <span><strong>Time Slot:</strong> {b.booking_time}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <MapPin size={15} color="var(--accent)" />
                    <span><strong>Address:</strong> {b.customer_address}</span>
                  </div>
                </div>

                {b.notes && (
                  <p style={{ fontSize: '0.84rem', color: 'var(--text-muted)', margin: 0, fontStyle: 'italic' }}>
                    Notes: "{b.notes}"
                  </p>
                )}

                {/* Actions */}
                <div style={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '0.75rem',
                  borderTop: '1px solid var(--border-subtle)',
                  paddingTop: '0.75rem'
                }}>
                  <button
                    onClick={() => setActiveChatUser({
                      id: b.provider_user_id,
                      name: b.provider_business_name,
                      avatar: b.provider_avatar,
                      role: 'provider'
                    })}
                    className="btn btn-secondary btn-sm"
                  >
                    <MessageSquare size={15} />
                    <span>Message Provider</span>
                  </button>

                  <div style={{ display: 'flex', gap: '0.6rem' }}>
                    {b.status === 'pending' && (
                      <button
                        onClick={() => handleCancelBooking(b.id)}
                        className="btn btn-secondary btn-sm"
                        style={{ color: 'var(--emergency)', borderColor: '#fca5a5' }}
                      >
                        Cancel Booking
                      </button>
                    )}

                    {b.status === 'completed' && !b.has_reviewed && (
                      <button
                        onClick={() => setSelectedBookingForReview(b)}
                        className="btn btn-primary btn-sm"
                        style={{ background: 'linear-gradient(135deg, #d97706 0%, #b45309 100%)' }}
                      >
                        <Star size={15} fill="#ffffff" />
                        <span>Rate & Review (1–5 ⭐)</span>
                      </button>
                    )}

                    {b.status === 'completed' && b.has_reviewed && (
                      <span style={{ fontSize: '0.85rem', color: 'var(--success)', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                        <CheckCircle size={15} /> Reviewed (Thank you!)
                      </span>
                    )}
                  </div>
                </div>

              </div>
            ))}
          </div>
        )}

      </div>

      {/* Review Modal */}
      {selectedBookingForReview && (
        <ReviewModal
          booking={selectedBookingForReview}
          onClose={() => setSelectedBookingForReview(null)}
          onSuccess={() => {
            loadBookings();
            showToast('Review submitted!', 'success');
          }}
        />
      )}

      {/* Chat Drawer */}
      {activeChatUser && (
        <ChatDrawer
          targetUser={activeChatUser}
          onClose={() => setActiveChatUser(null)}
        />
      )}
    </div>
  );
}
