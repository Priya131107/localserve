import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Heart, Trash2, Star, MapPin, ArrowRight } from 'lucide-react';
import { favoriteAPI } from '../services/api';
import { useToast } from '../context/ToastContext';

export default function Favorites() {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const { showToast } = useToast();

  const loadFavorites = async () => {
    try {
      const res = await favoriteAPI.getAll();
      if (res.success) {
        setFavorites(res.favorites || []);
      }
    } catch (e) {
      showToast('Failed to load favorites', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadFavorites();
  }, []);

  const handleRemoveFavorite = async (providerId) => {
    try {
      const res = await favoriteAPI.remove(providerId);
      if (res.success) {
        setFavorites((prev) => prev.filter((f) => f.provider_id !== providerId));
        showToast('Removed from favorites', 'info');
      }
    } catch (error) {
      showToast('Failed to remove favorite', 'error');
    }
  };

  return (
    <div style={{ padding: '2.5rem 0 5rem', background: 'var(--bg-main)', minHeight: '85vh' }}>
      <div className="container" style={{ maxWidth: '1000px' }}>
        
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2rem' }}>
          <div>
            <h1 style={{ fontSize: '2rem', fontWeight: '800', color: 'var(--text-main)', margin: 0 }}>
              Favorite Service Providers
            </h1>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
              Quick access to your trusted, bookmarked local specialists.
            </p>
          </div>

          <Link to="/services" className="btn btn-outline btn-sm">
            Browse More Providers
          </Link>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '4rem 0', color: 'var(--text-muted)' }}>
            <p style={{ fontWeight: '600' }}>Loading favorite providers...</p>
          </div>
        ) : favorites.length === 0 ? (
          <div className="glass-card" style={{ padding: '4rem 2rem', textAlign: 'center', background: '#ffffff' }}>
            <Heart size={48} color="#fca5a5" style={{ marginBottom: '1rem' }} />
            <h3 style={{ fontSize: '1.3rem', fontWeight: '800', color: 'var(--text-main)', marginBottom: '0.5rem' }}>
              No Saved Favorites Yet
            </h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
              Click the heart icon on any provider profile or card to quickly bookmark them for future appointments.
            </p>
            <Link to="/services" className="btn btn-primary btn-sm">
              Discover Providers
            </Link>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.5rem' }}>
            {favorites.map((f) => (
              <div key={f.id} className="glass-card" style={{ padding: '1.5rem', background: '#ffffff', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <img 
                        src={f.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${f.business_name}`} 
                        alt={f.business_name}
                        style={{ width: '48px', height: '48px', borderRadius: '12px', objectFit: 'cover' }}
                      />
                      <div>
                        <h4 style={{ fontSize: '1.05rem', fontWeight: '800', color: 'var(--text-main)', margin: 0 }}>
                          {f.business_name}
                        </h4>
                        <span className="badge badge-primary" style={{ fontSize: '0.68rem', padding: '0.15rem 0.45rem' }}>
                          {f.category_name || 'Professional'}
                        </span>
                      </div>
                    </div>

                    <button
                      onClick={() => handleRemoveFavorite(f.provider_id)}
                      style={{
                        background: '#fee2e2',
                        border: 'none',
                        color: 'var(--emergency)',
                        borderRadius: '50%',
                        width: '32px',
                        height: '32px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer'
                      }}
                      title="Remove from favorites"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', margin: '0.75rem 0', fontSize: '0.85rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', color: '#b45309', fontWeight: '700' }}>
                      <Star size={14} fill="#f59e0b" color="#f59e0b" />
                      <span>{f.rating}</span>
                    </div>

                    <span style={{ fontWeight: '800', color: 'var(--text-main)' }}>
                      ₹{f.hourly_rate} / hr
                    </span>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '1.25rem' }}>
                    <MapPin size={13} color="var(--primary)" />
                    <span>{f.area}, {f.city}</span>
                  </div>
                </div>

                <Link 
                  to={`/providers/${f.provider_id}`} 
                  className="btn btn-primary btn-sm"
                  style={{ width: '100%', fontWeight: '700' }}
                >
                  <span>Book Now</span>
                  <ArrowRight size={14} />
                </Link>
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
}
