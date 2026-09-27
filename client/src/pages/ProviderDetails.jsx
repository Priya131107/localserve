import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  Star, 
  Shield, 
  MapPin, 
  Clock, 
  Phone, 
  Mail, 
  Heart, 
  MessageSquare, 
  Calendar, 
  CheckCircle, 
  AlertTriangle,
  ArrowRight,
  User
} from 'lucide-react';
import BookingModal from '../components/BookingModal';
import ChatDrawer from '../components/ChatDrawer';
import { providerAPI, favoriteAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

export default function ProviderDetails() {
  const { id } = useParams();
  const { user, isAuthenticated } = useAuth();
  const { showToast } = useToast();

  const [provider, setProvider] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isFavorite, setIsFavorite] = useState(false);
  const [selectedServiceForBooking, setSelectedServiceForBooking] = useState(null);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [showChatDrawer, setShowChatDrawer] = useState(false);

  useEffect(() => {
    async function loadProvider() {
      try {
        const res = await providerAPI.getById(id);
        if (res.success && res.provider) {
          setProvider(res.provider);
        }

        if (isAuthenticated) {
          const favRes = await favoriteAPI.getAll().catch(() => ({ favorites: [] }));
          if (favRes.success && favRes.favorites) {
            setIsFavorite(favRes.favorites.some((f) => f.provider_id === Number(id)));
          }
        }
      } catch (e) {
        showToast('Failed to load provider profile', 'error');
      } finally {
        setLoading(false);
      }
    }

    loadProvider();
  }, [id, isAuthenticated]);

  const handleToggleFavorite = async () => {
    if (!isAuthenticated) {
      showToast('Please log in to save favorites.', 'info');
      return;
    }
    try {
      if (isFavorite) {
        await favoriteAPI.remove(id);
        setIsFavorite(false);
        showToast('Removed from favorites', 'info');
      } else {
        await favoriteAPI.add(id);
        setIsFavorite(true);
        showToast('Saved to favorites!', 'success');
      }
    } catch (e) {
      showToast('Action failed', 'error');
    }
  };

  const handleBookService = (service = null) => {
    setSelectedServiceForBooking(service);
    setShowBookingModal(true);
  };

  const handleStartChat = () => {
    if (!isAuthenticated) {
      showToast('Please log in to message this provider.', 'info');
      return;
    }
    setShowChatDrawer(true);
  };

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '6rem 0', color: 'var(--text-muted)' }}>
        <p style={{ fontSize: '1.2rem', fontWeight: '600' }}>Loading provider profile...</p>
      </div>
    );
  }

  if (!provider) {
    return (
      <div className="container" style={{ padding: '5rem 0', textAlign: 'center' }}>
        <h2>Service Provider Not Found</h2>
        <p style={{ color: 'var(--text-muted)', margin: '1rem 0 2rem' }}>The requested profile does not exist or has been removed.</p>
        <Link to="/services" className="btn btn-primary">Browse All Services</Link>
      </div>
    );
  }

  return (
    <div style={{ padding: '2.5rem 0 5rem', background: 'var(--bg-main)', minHeight: '85vh' }}>
      <div className="container">
        
        {/* Profile Card Header */}
        <div className="glass-card" style={{ padding: '2.5rem', background: '#ffffff', marginBottom: '2rem' }}>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '2rem', alignItems: 'flex-start', justifyContent: 'space-between' }}>
            
            {/* Provider Left: Avatar & Meta */}
            <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center', flexWrap: 'wrap' }}>
              <div style={{ position: 'relative' }}>
                <img 
                  src={provider.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${provider.business_name}`} 
                  alt={provider.business_name}
                  style={{
                    width: '100px',
                    height: '100px',
                    borderRadius: 'var(--radius-xl)',
                    objectFit: 'cover',
                    border: '3px solid #ffffff',
                    boxShadow: 'var(--shadow-lg)'
                  }}
                />
                {provider.is_available === 1 ? (
                  <span 
                    title="Online & Available"
                    style={{
                      position: 'absolute',
                      bottom: '4px',
                      right: '4px',
                      width: '18px',
                      height: '18px',
                      background: '#10b981',
                      border: '3px solid #ffffff',
                      borderRadius: '50%'
                    }}
                  />
                ) : (
                  <span 
                    title="Busy / Off-duty"
                    style={{
                      position: 'absolute',
                      bottom: '4px',
                      right: '4px',
                      width: '18px',
                      height: '18px',
                      background: '#94a3b8',
                      border: '3px solid #ffffff',
                      borderRadius: '50%'
                    }}
                  />
                )}
              </div>

              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', flexWrap: 'wrap' }}>
                  <h1 style={{ fontSize: '1.75rem', fontWeight: '800', color: 'var(--text-main)', margin: 0 }}>
                    {provider.business_name}
                  </h1>
                  {provider.verified && (
                    <span className="badge badge-primary" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}>
                      <Shield size={13} fill="currentColor" /> Verified Pro
                    </span>
                  )}
                  {provider.is_emergency === 1 && (
                    <span className="badge badge-emergency">
                      ⚡ 24/7 SOS Ready
                    </span>
                  )}
                </div>

                <p style={{ fontSize: '0.95rem', color: 'var(--text-muted)', margin: '0.35rem 0' }}>
                  Managed by <strong>{provider.user_name}</strong> • {provider.experience_years}+ Years Industry Experience
                </p>

                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', marginTop: '0.75rem', fontSize: '0.88rem', color: 'var(--text-muted)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                    <MapPin size={15} color="var(--primary)" />
                    <span>{provider.area}, {provider.city}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                    <Clock size={15} color="var(--secondary)" />
                    <span>{provider.working_hours || '9:00 AM - 8:00 PM'}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                    <Phone size={15} color="var(--accent)" />
                    <span>{provider.phone}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Provider Right: Price & CTA Actions */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '1rem' }}>
              <div style={{ textAlign: 'right' }}>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'block' }}>Base Visiting Rate</span>
                <span style={{ fontSize: '2rem', fontWeight: '800', color: 'var(--primary)', lineHeight: '1' }}>
                  ₹{provider.hourly_rate}
                  <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)', fontWeight: '500' }}> / hour</span>
                </span>
              </div>

              <div style={{ display: 'flex', gap: '0.6rem' }}>
                <button
                  onClick={handleToggleFavorite}
                  style={{
                    background: isFavorite ? '#ffe4e6' : 'var(--bg-subtle)',
                    border: '1px solid var(--border-subtle)',
                    borderRadius: 'var(--radius-md)',
                    padding: '0.65rem 0.9rem',
                    cursor: 'pointer',
                    color: isFavorite ? 'var(--emergency)' : 'var(--text-muted)'
                  }}
                  title={isFavorite ? 'Remove Favorite' : 'Add to Favorites'}
                >
                  <Heart size={20} fill={isFavorite ? 'currentColor' : 'none'} />
                </button>

                <button
                  onClick={handleStartChat}
                  className="btn btn-secondary"
                  style={{ fontWeight: '600' }}
                >
                  <MessageSquare size={17} />
                  <span>Chat</span>
                </button>

                <button
                  onClick={() => handleBookService(null)}
                  className="btn btn-primary"
                  style={{ fontWeight: '700' }}
                >
                  <Calendar size={17} />
                  <span>Book Appointment</span>
                </button>
              </div>
            </div>

          </div>
        </div>

        {/* 2-Column Content Grid: Left (Services & Reviews) + Right (Bio & Quick Info) */}
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '2rem', alignItems: 'flex-start' }} className="provider-grid">
          
          {/* LEFT COLUMN */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            
            {/* 1. Services Catalogue */}
            <div className="glass-card" style={{ padding: '2rem', background: '#ffffff' }}>
              <h2 style={{ fontSize: '1.35rem', fontWeight: '800', color: 'var(--text-main)', marginBottom: '1.25rem' }}>
                Services Offered & Pricing
              </h2>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {provider.services && provider.services.length > 0 ? (
                  provider.services.map((svc) => (
                    <div
                      key={svc.id}
                      style={{
                        padding: '1.25rem',
                        borderRadius: 'var(--radius-md)',
                        border: '1px solid var(--border-subtle)',
                        background: 'var(--bg-subtle)',
                        display: 'flex',
                        flexWrap: 'wrap',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        gap: '1rem'
                      }}
                    >
                      <div style={{ maxWidth: '400px' }}>
                        <h4 style={{ fontSize: '1.05rem', fontWeight: '700', color: 'var(--text-main)', margin: '0 0 0.25rem' }}>
                          {svc.title}
                        </h4>
                        <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', margin: '0 0 0.4rem', lineHeight: '1.4' }}>
                          {svc.description || 'Standard specialized service by certified technician.'}
                        </p>
                        <span style={{ fontSize: '0.78rem', color: 'var(--secondary)', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                          <Clock size={13} /> Approx. {svc.duration_mins} Minutes
                        </span>
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
                        <div style={{ textAlign: 'right' }}>
                          <span style={{ fontSize: '1.35rem', fontWeight: '800', color: 'var(--text-main)', display: 'block' }}>
                            ₹{svc.price}
                          </span>
                          <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{svc.price_type} price</span>
                        </div>

                        <button
                          onClick={() => handleBookService(svc)}
                          className="btn btn-primary btn-sm"
                          style={{ fontWeight: '700' }}
                        >
                          Book Now
                        </button>
                      </div>
                    </div>
                  ))
                ) : (
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Contact provider for custom service requests.</p>
                )}
              </div>
            </div>

            {/* 2. Customer Reviews */}
            <div className="glass-card" style={{ padding: '2rem', background: '#ffffff' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
                <div>
                  <h2 style={{ fontSize: '1.35rem', fontWeight: '800', color: 'var(--text-main)', margin: 0 }}>
                    Verified Customer Reviews
                  </h2>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                    Based on {provider.reviews?.length || 0} genuine doorstep service feedbacks.
                  </p>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', background: '#fef3c7', padding: '0.4rem 0.8rem', borderRadius: 'var(--radius-md)' }}>
                  <Star size={18} fill="#f59e0b" color="#f59e0b" />
                  <span style={{ fontSize: '1.1rem', fontWeight: '800', color: '#b45309' }}>
                    {Number(provider.rating || 5).toFixed(1)}
                  </span>
                </div>
              </div>

              {/* Reviews Stream */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                {provider.reviews && provider.reviews.length > 0 ? (
                  provider.reviews.map((rev) => (
                    <div
                      key={rev.id}
                      style={{
                        padding: '1.25rem',
                        borderRadius: 'var(--radius-md)',
                        border: '1px solid var(--border-subtle)',
                        background: '#ffffff'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          <img 
                            src={rev.customer_avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${rev.customer_name}`} 
                            alt={rev.customer_name}
                            style={{ width: '32px', height: '32px', borderRadius: '50%' }}
                          />
                          <strong style={{ fontSize: '0.92rem', color: 'var(--text-main)' }}>
                            {rev.customer_name}
                          </strong>
                        </div>

                        {/* Stars */}
                        <div style={{ display: 'flex', gap: '0.15rem' }}>
                          {[1, 2, 3, 4, 5].map((s) => (
                            <Star
                              key={s}
                              size={14}
                              fill={s <= rev.rating ? '#f59e0b' : '#e2e8f0'}
                              color={s <= rev.rating ? '#f59e0b' : '#cbd5e1'}
                            />
                          ))}
                        </div>
                      </div>

                      <p style={{ fontSize: '0.88rem', color: 'var(--text-main)', lineHeight: '1.5', margin: '0.5rem 0' }}>
                        "{rev.comment}"
                      </p>

                      {/* Provider Response bubble if present */}
                      {rev.provider_response && (
                        <div style={{
                          marginTop: '0.75rem',
                          padding: '0.75rem 1rem',
                          background: 'var(--primary-light)',
                          borderLeft: '3px solid var(--primary)',
                          borderRadius: 'var(--radius-sm)',
                          fontSize: '0.82rem'
                        }}>
                          <strong style={{ color: 'var(--primary)', display: 'block', marginBottom: '0.2rem' }}>
                            Response from {provider.business_name}:
                          </strong>
                          <p style={{ color: 'var(--text-main)', margin: 0 }}>
                            {rev.provider_response}
                          </p>
                        </div>
                      )}
                    </div>
                  ))
                ) : (
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>No reviews yet for this provider.</p>
                )}
              </div>
            </div>

          </div>

          {/* RIGHT COLUMN (Bio & Safety) */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            
            {/* About Profile */}
            <div className="glass-card" style={{ padding: '1.75rem', background: '#ffffff' }}>
              <h3 style={{ fontSize: '1.15rem', fontWeight: '800', color: 'var(--text-main)', marginBottom: '0.75rem' }}>
                About Professional
              </h3>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', lineHeight: '1.6' }}>
                {provider.bio || 'Experienced local professional providing guaranteed satisfaction and prompt doorstep service.'}
              </p>
            </div>

            {/* Safety & Service Guarantee */}
            <div className="glass-card" style={{ padding: '1.75rem', background: 'var(--bg-subtle)' }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: '800', color: 'var(--text-main)', marginBottom: '0.75rem' }}>
                Service Guarantee
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <CheckCircle size={15} color="var(--success)" />
                  <span>30-Day Post-Service Warranty</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <CheckCircle size={15} color="var(--success)" />
                  <span>No Advance Payment Required</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <CheckCircle size={15} color="var(--success)" />
                  <span>Govt. ID & Police Background Verified</span>
                </div>
              </div>
            </div>

          </div>

        </div>

      </div>

      {/* Booking Modal */}
      {showBookingModal && (
        <BookingModal
          provider={provider}
          service={selectedServiceForBooking}
          onClose={() => setShowBookingModal(false)}
          onSuccess={() => {
            showToast('Booking placed successfully! You can track status in My Bookings.', 'success');
          }}
        />
      )}

      {/* Chat Drawer */}
      {showChatDrawer && (
        <ChatDrawer
          targetUser={{
            id: provider.user_id,
            name: provider.user_name,
            business_name: provider.business_name,
            avatar: provider.avatar,
            role: 'provider'
          }}
          onClose={() => setShowChatDrawer(false)}
        />
      )}

      <style>{`
        @media (max-width: 860px) {
          .provider-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
}
