import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { statAPI, bookingAPI, providerAPI, reviewAPI } from '../services/api';
import { 
  Briefcase, 
  Calendar, 
  Clock, 
  CheckCircle, 
  XCircle, 
  Star, 
  IndianRupee, 
  Phone, 
  MapPin, 
  User, 
  Check, 
  X, 
  AlertCircle, 
  Power, 
  MessageSquare,
  Send,
  Plus,
  TrendingUp,
  ShieldCheck
} from 'lucide-react';
import ChatDrawer from '../components/ChatDrawer';

export default function ProviderDashboard() {
  const { user } = useAuth();
  const { showToast } = useToast();

  const [stats, setStats] = useState({
    totalBookings: 0,
    pendingBookings: 0,
    acceptedBookings: 0,
    completedBookings: 0,
    totalEarnings: 0,
    averageRating: 5.0,
    totalReviews: 0,
    isAvailable: true
  });
  const [bookings, setBookings] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [replyTextMap, setReplyTextMap] = useState({});
  const [activeChatUser, setActiveChatUser] = useState(null);

  const loadProviderData = async () => {
    try {
      const [statsRes, bookingsRes] = await Promise.all([
        statAPI.getProviderStats().catch(() => ({ stats: {} })),
        bookingAPI.getAll().catch(() => ({ bookings: [] }))
      ]);

      if (statsRes.success) {
        setStats(statsRes.stats);
      }
      if (bookingsRes.success) {
        setBookings(bookingsRes.bookings);
      }

      // Load reviews if provider id available
      if (user?.provider_id) {
        const revRes = await reviewAPI.getByProvider(user.provider_id).catch(() => ({ reviews: [] }));
        if (revRes.success) setReviews(revRes.reviews);
      }
    } catch (e) {
      console.warn('Provider data load error:', e.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProviderData();
  }, [user]);

  const handleToggleAvailability = async () => {
    try {
      const newStatus = !stats.isAvailable;
      const res = await providerAPI.toggleAvailability(newStatus);
      if (res.success) {
        setStats((prev) => ({ ...prev, isAvailable: newStatus }));
        showToast(res.message, 'success');
      }
    } catch (error) {
      showToast('Failed to update availability status', 'error');
    }
  };

  const handleUpdateBookingStatus = async (bookingId, newStatus) => {
    try {
      const res = await bookingAPI.updateStatus(bookingId, newStatus);
      if (res.success) {
        showToast(`Booking #${bookingId} status updated to ${newStatus}`, 'success');
        loadProviderData();
      }
    } catch (error) {
      showToast(error.message || 'Failed to update booking status', 'error');
    }
  };

  const handleSendReply = async (reviewId) => {
    const text = replyTextMap[reviewId];
    if (!text || !text.trim()) {
      showToast('Please type a response message.', 'error');
      return;
    }

    try {
      const res = await reviewAPI.reply(reviewId, text.trim());
      if (res.success) {
        showToast('Response published!', 'success');
        setReplyTextMap((prev) => ({ ...prev, [reviewId]: '' }));
        loadProviderData();
      }
    } catch (error) {
      showToast(error.message || 'Failed to send reply', 'error');
    }
  };

  return (
    <div style={{ padding: '2.5rem 0 5rem', background: 'var(--bg-main)', minHeight: '85vh' }}>
      <div className="container">
        
        {/* Top Provider Header Banner */}
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
          {/* Ambient light orb */}
          <div style={{
            position: 'absolute',
            top: '-15%',
            right: '-5%',
            width: '350px',
            height: '350px',
            background: 'radial-gradient(circle, rgba(13, 148, 136, 0.3) 0%, rgba(0,0,0,0) 70%)',
            pointerEvents: 'none'
          }} />

          <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', position: 'relative', zIndex: 10 }}>
            <img 
              src={user?.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.name}`} 
              alt={user?.name}
              style={{ width: '68px', height: '68px', borderRadius: 'var(--radius-lg)', objectFit: 'cover', border: '2.5px solid #ffffff', boxShadow: 'var(--shadow-lg)' }}
            />
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', flexWrap: 'wrap' }}>
                <h1 style={{ fontSize: '1.85rem', fontWeight: '800', margin: 0, color: '#ffffff', letterSpacing: '-0.02em' }}>
                  {user?.provider?.business_name || `${user?.name}'s Workshop`}
                </h1>
                <span className="badge badge-primary" style={{ background: '#312e81', color: '#c7d2fe' }}>
                  Verified Professional
                </span>
              </div>
              <p style={{ color: '#cbd5e1', fontSize: '0.92rem', margin: '0.3rem 0 0' }}>
                {user?.name} • Service Provider Dashboard ({user?.city || 'Jaipur'})
              </p>
            </div>
          </div>

          {/* Availability Status Toggle */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap', position: 'relative', zIndex: 10 }}>
            <button
              onClick={handleToggleAvailability}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.6rem',
                padding: '0.7rem 1.4rem',
                borderRadius: 'var(--radius-full)',
                border: stats.isAvailable ? '1.5px solid #10b981' : '1.5px solid #94a3b8',
                background: stats.isAvailable ? 'rgba(16, 185, 129, 0.2)' : 'rgba(148, 163, 184, 0.2)',
                color: stats.isAvailable ? '#34d399' : '#cbd5e1',
                fontWeight: '800',
                fontSize: '0.92rem',
                cursor: 'pointer',
                transition: 'all 0.2s',
                boxShadow: stats.isAvailable ? '0 0 15px rgba(16, 185, 129, 0.3)' : 'none'
              }}
            >
              <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: stats.isAvailable ? '#10b981' : '#94a3b8', animation: stats.isAvailable ? 'pulse-green 2s infinite' : 'none' }}></span>
              <span>{stats.isAvailable ? 'Online (Accepting Jobs)' : 'Offline / On Break'}</span>
            </button>

            <Link to="/provider/services" className="btn btn-primary btn-sm" style={{ fontWeight: '800', borderRadius: 'var(--radius-full)' }}>
              <Plus size={16} />
              <span>Manage Services</span>
            </Link>
          </div>
        </div>

        {/* Analytics Overview Cards */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '1.25rem',
          marginBottom: '2.5rem'
        }}>
          {/* Earnings */}
          <div className="glass-card" style={{ padding: '1.6rem', background: '#ffffff', borderRadius: 'var(--radius-lg)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
              <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: '700' }}>Total Earnings</span>
              <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'var(--primary-light)', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <IndianRupee size={18} />
              </div>
            </div>
            <div style={{ fontSize: '2rem', fontWeight: '900', color: 'var(--primary)', lineHeight: '1.1' }}>
              ₹{Number(stats.totalEarnings || 0).toLocaleString()}
            </div>
            <span style={{ fontSize: '0.75rem', color: 'var(--success)', fontWeight: '700', marginTop: '0.25rem', display: 'block' }}>From completed jobs</span>
          </div>

          {/* Pending Bookings */}
          <div className="glass-card" style={{ padding: '1.6rem', background: '#ffffff', borderRadius: 'var(--radius-lg)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
              <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: '700' }}>Pending Requests</span>
              <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: '#fef3c7', color: '#b45309', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Clock size={18} />
              </div>
            </div>
            <div style={{ fontSize: '2rem', fontWeight: '900', color: '#d97706', lineHeight: '1.1' }}>
              {stats.pendingBookings || 0}
            </div>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.25rem', display: 'block' }}>Awaiting your action</span>
          </div>

          {/* Accepted */}
          <div className="glass-card" style={{ padding: '1.6rem', background: '#ffffff', borderRadius: 'var(--radius-lg)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
              <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: '700' }}>Scheduled Jobs</span>
              <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: '#e0f2fe', color: '#0369a1', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Calendar size={18} />
              </div>
            </div>
            <div style={{ fontSize: '2rem', fontWeight: '900', color: '#0284c7', lineHeight: '1.1' }}>
              {stats.acceptedBookings || 0}
            </div>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.25rem', display: 'block' }}>Upcoming appointments</span>
          </div>

          {/* Completed */}
          <div className="glass-card" style={{ padding: '1.6rem', background: '#ffffff', borderRadius: 'var(--radius-lg)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
              <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: '700' }}>Completed Jobs</span>
              <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: '#ecfdf5', color: '#047857', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <CheckCircle size={18} />
              </div>
            </div>
            <div style={{ fontSize: '2rem', fontWeight: '900', color: '#059669', lineHeight: '1.1' }}>
              {stats.completedBookings || 0}
            </div>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.25rem', display: 'block' }}>100% resolution</span>
          </div>

          {/* Rating */}
          <div className="glass-card" style={{ padding: '1.6rem', background: '#ffffff', borderRadius: 'var(--radius-lg)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
              <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: '700' }}>Customer Rating</span>
              <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: '#fef3c7', color: '#b45309', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Star size={18} fill="#f59e0b" color="#f59e0b" />
              </div>
            </div>
            <div style={{ fontSize: '2rem', fontWeight: '900', color: '#b45309', lineHeight: '1.1' }}>
              {Number(stats.averageRating || 5).toFixed(1)}
            </div>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.25rem', display: 'block' }}>{stats.totalReviews || reviews.length} verified reviews</span>
          </div>
        </div>

        {/* Incoming Bookings Queue */}
        <div className="glass-card" style={{ padding: '2rem', background: '#ffffff', borderRadius: 'var(--radius-xl)', marginBottom: '2.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
            <div>
              <h2 style={{ fontSize: '1.35rem', fontWeight: '800', color: 'var(--text-main)', margin: 0 }}>
                Incoming Service Requests & Bookings
              </h2>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem' }}>
                Manage customer appointments, accept incoming jobs, and mark completed jobs.
              </p>
            </div>
            <span className="badge badge-primary">
              {bookings.length} Total Bookings
            </span>
          </div>

          {bookings.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '3rem 0', color: 'var(--text-muted)' }}>
              <Calendar size={40} color="var(--border-subtle)" style={{ marginBottom: '0.75rem' }} />
              <p style={{ fontWeight: '700', fontSize: '1rem' }}>No incoming bookings at this moment</p>
              <p style={{ fontSize: '0.85rem' }}>Ensure your availability status is set to "Online" so nearby customers can discover you.</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              {bookings.map((b) => (
                <div
                  key={b.id}
                  style={{
                    padding: '1.5rem',
                    borderRadius: 'var(--radius-lg)',
                    border: '1px solid var(--border-subtle)',
                    background: b.status === 'pending' ? '#fffbeb' : '#ffffff',
                    boxShadow: 'var(--shadow-sm)',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '1rem'
                  }}
                >
                  {/* Top line: Service title, price, status */}
                  <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '0.75rem' }}>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                        <h3 style={{ fontSize: '1.15rem', fontWeight: '800', color: 'var(--text-main)', margin: 0 }}>
                          {b.service_title}
                        </h3>
                        <span className={`status-pill status-${b.status}`}>
                          {b.status}
                        </span>
                      </div>
                      <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                        Booking ID #{b.id} • Placed on {new Date(b.created_at || Date.now()).toLocaleDateString()}
                      </span>
                    </div>

                    <div style={{ textAlign: 'right' }}>
                      <span style={{ fontSize: '1.4rem', fontWeight: '800', color: 'var(--primary)' }}>
                        ₹{b.total_price}
                      </span>
                    </div>
                  </div>

                  {/* Middle metadata: Customer details, address, date & time */}
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
                    gap: '1rem',
                    background: 'var(--bg-subtle)',
                    padding: '1rem',
                    borderRadius: 'var(--radius-md)',
                    fontSize: '0.86rem'
                  }}>
                    <div>
                      <span style={{ color: 'var(--text-muted)', display: 'block', marginBottom: '0.2rem', fontWeight: '600' }}>Customer</span>
                      <strong style={{ color: 'var(--text-main)' }}>{b.customer_name}</strong>
                    </div>

                    <div>
                      <span style={{ color: 'var(--text-muted)', display: 'block', marginBottom: '0.2rem', fontWeight: '600' }}>Contact Phone</span>
                      <a href={`tel:${b.customer_phone}`} style={{ color: 'var(--primary)', fontWeight: '800' }}>
                        {b.customer_phone || '+91 98290 00000'}
                      </a>
                    </div>

                    <div>
                      <span style={{ color: 'var(--text-muted)', display: 'block', marginBottom: '0.2rem', fontWeight: '600' }}>Scheduled Appointment</span>
                      <strong>{new Date(b.booking_date).toLocaleDateString()} ({b.booking_time})</strong>
                    </div>

                    <div>
                      <span style={{ color: 'var(--text-muted)', display: 'block', marginBottom: '0.2rem', fontWeight: '600' }}>Service Address</span>
                      <span>{b.customer_address}</span>
                    </div>
                  </div>

                  {b.notes && (
                    <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontStyle: 'italic', margin: 0 }}>
                      Note from customer: "{b.notes}"
                    </p>
                  )}

                  {/* Actions strip */}
                  <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '0.75rem', borderTop: '1px solid var(--border-subtle)', paddingTop: '0.85rem' }}>
                    
                    <button
                      onClick={() => setActiveChatUser({
                        id: b.customer_id,
                        name: b.customer_name,
                        role: 'customer'
                      })}
                      className="btn btn-secondary btn-sm"
                      style={{ fontWeight: '700' }}
                    >
                      <MessageSquare size={15} />
                      <span>Chat with Customer</span>
                    </button>

                    <div style={{ display: 'flex', gap: '0.6rem' }}>
                      {b.status === 'pending' && (
                        <>
                          <button
                            onClick={() => handleUpdateBookingStatus(b.id, 'rejected')}
                            className="btn btn-secondary btn-sm"
                            style={{ color: 'var(--emergency)', borderColor: '#fca5a5', fontWeight: '700' }}
                          >
                            <X size={15} /> Decline
                          </button>
                          <button
                            onClick={() => handleUpdateBookingStatus(b.id, 'accepted')}
                            className="btn btn-primary btn-sm"
                            style={{ fontWeight: '800' }}
                          >
                            <Check size={15} /> Accept Job
                          </button>
                        </>
                      )}

                      {b.status === 'accepted' && (
                        <button
                          onClick={() => handleUpdateBookingStatus(b.id, 'completed')}
                          className="btn btn-success btn-sm"
                          style={{ fontWeight: '800' }}
                        >
                          <CheckCircle size={15} /> Mark as Completed
                        </button>
                      )}

                      {b.status === 'completed' && (
                        <span style={{ fontSize: '0.88rem', color: 'var(--success)', fontWeight: '800', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                          <CheckCircle size={17} /> Service Finished & Billed
                        </span>
                      )}
                    </div>

                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Customer Reviews & Responses Section */}
        <div className="glass-card" style={{ padding: '2rem', background: '#ffffff', borderRadius: 'var(--radius-xl)' }}>
          <h2 style={{ fontSize: '1.35rem', fontWeight: '800', color: 'var(--text-main)', marginBottom: '1.25rem' }}>
            Customer Feedback & Reviews
          </h2>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            {reviews.length === 0 ? (
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>No reviews received yet.</p>
            ) : (
              reviews.map((rev) => (
                <div
                  key={rev.id}
                  style={{
                    padding: '1.25rem',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--border-subtle)',
                    background: 'var(--bg-subtle)'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
                    <strong>{rev.customer_name}</strong>
                    <div style={{ display: 'flex', gap: '0.15rem' }}>
                      {[1, 2, 3, 4, 5].map((s) => (
                        <Star key={s} size={14} fill={s <= rev.rating ? '#f59e0b' : '#cbd5e1'} color={s <= rev.rating ? '#f59e0b' : '#cbd5e1'} />
                      ))}
                    </div>
                  </div>

                  <p style={{ fontSize: '0.88rem', color: 'var(--text-main)', margin: '0.4rem 0' }}>
                    "{rev.comment}"
                  </p>

                  {/* Existing Reply or Reply Box */}
                  {rev.provider_response ? (
                    <div style={{
                      marginTop: '0.75rem',
                      padding: '0.75rem 1rem',
                      background: '#ffffff',
                      borderLeft: '3px solid var(--primary)',
                      borderRadius: '4px',
                      fontSize: '0.84rem'
                    }}>
                      <strong style={{ color: 'var(--primary)' }}>Your Response: </strong>
                      <span>{rev.provider_response}</span>
                    </div>
                  ) : (
                    <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.75rem' }}>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Write a polite response to thank the customer..."
                        value={replyTextMap[rev.id] || ''}
                        onChange={(e) => setReplyTextMap({ ...replyTextMap, [rev.id]: e.target.value })}
                        style={{ fontSize: '0.85rem' }}
                      />
                      <button
                        onClick={() => handleSendReply(rev.id)}
                        className="btn btn-primary btn-sm"
                        style={{ fontWeight: '700' }}
                      >
                        <Send size={14} /> Reply
                      </button>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>

      </div>

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
