import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { 
  Filter, 
  Map as MapIcon, 
  LayoutGrid, 
  Search, 
  SlidersHorizontal, 
  RotateCcw, 
  Star, 
  AlertTriangle, 
  CheckCircle, 
  IndianRupee 
} from 'lucide-react';
import ProviderCard from '../components/ProviderCard';
import MapView from '../components/MapView';
import BookingModal from '../components/BookingModal';
import { providerAPI, categoryAPI, favoriteAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

export default function Services({ comparedProviders = [], onToggleCompare, onOpenCompare }) {
  const [searchParams, setSearchParams] = useSearchParams();
  const { isAuthenticated } = useAuth();
  const { showToast } = useToast();

  const [providers, setProviders] = useState([]);
  const [categories, setCategories] = useState([]);
  const [favoriteIds, setFavoriteIds] = useState(new Set());
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState('grid'); // 'grid' | 'map'
  const [selectedProviderForBooking, setSelectedProviderForBooking] = useState(null);

  // Filters State
  const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || '');
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || '');
  const [locationQuery, setLocationQuery] = useState(searchParams.get('location') || '');
  const [minRating, setMinRating] = useState(searchParams.get('rating') || '');
  const [maxPrice, setMaxPrice] = useState(searchParams.get('max_price') || '');
  const [isEmergencyOnly, setIsEmergencyOnly] = useState(searchParams.get('emergency') === 'true');
  const [isAvailableOnly, setIsAvailableOnly] = useState(searchParams.get('availability') === 'true');
  const [sortBy, setSortBy] = useState(searchParams.get('sort') || 'smart');

  // Load Categories & Favorites
  useEffect(() => {
    categoryAPI.getAll().then((res) => {
      if (res.success) setCategories(res.categories);
    });

    if (isAuthenticated) {
      favoriteAPI.getAll().then((res) => {
        if (res.success && res.favorites) {
          setFavoriteIds(new Set(res.favorites.map((f) => f.provider_id)));
        }
      }).catch(() => {});
    }
  }, [isAuthenticated]);

  // Fetch Providers based on filters
  const fetchProviders = async () => {
    setLoading(true);
    try {
      const filters = {
        q: searchQuery,
        category: selectedCategory,
        location: locationQuery,
        rating: minRating,
        max_price: maxPrice,
        emergency: isEmergencyOnly ? 'true' : '',
        availability: isAvailableOnly ? 'true' : '',
        sort: sortBy
      };

      const res = await providerAPI.search(filters);
      if (res.success) {
        setProviders(res.providers || []);
      }
    } catch (error) {
      showToast('Failed to load service providers', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProviders();
  }, [selectedCategory, minRating, maxPrice, isEmergencyOnly, isAvailableOnly, sortBy]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchProviders();
  };

  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedCategory('');
    setLocationQuery('');
    setMinRating('');
    setMaxPrice('');
    setIsEmergencyOnly(false);
    setIsAvailableOnly(false);
    setSortBy('smart');
    setSearchParams({});
  };

  const handleToggleFavorite = async (providerId) => {
    if (!isAuthenticated) {
      showToast('Please log in to save favorite providers.', 'info');
      return;
    }
    try {
      if (favoriteIds.has(providerId)) {
        await favoriteAPI.remove(providerId);
        setFavoriteIds((prev) => {
          const next = new Set(prev);
          next.delete(providerId);
          return next;
        });
        showToast('Removed from favorites', 'info');
      } else {
        await favoriteAPI.add(providerId);
        setFavoriteIds((prev) => new Set([...prev, providerId]));
        showToast('Added to favorites!', 'success');
      }
    } catch (e) {
      showToast('Action failed', 'error');
    }
  };

  return (
    <div style={{ padding: '2.5rem 0 5rem', background: 'var(--bg-main)', minHeight: '85vh' }}>
      <div className="container">
        
        {/* Page Header */}
        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '1.25rem',
          marginBottom: '2rem'
        }}>
          <div>
            <h1 style={{ fontSize: '2rem', fontWeight: '800', color: 'var(--text-main)', letterSpacing: '-0.02em' }}>
              Service Providers Directory
            </h1>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem' }}>
              Showing {providers.length} verified professionals ready to serve in your area.
            </p>
          </div>

          {/* View Mode Toggle: Grid vs Map */}
          <div style={{
            display: 'flex',
            background: '#ffffff',
            padding: '0.3rem',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--border-subtle)',
            boxShadow: 'var(--shadow-sm)'
          }}>
            <button
              onClick={() => setViewMode('grid')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem',
                padding: '0.5rem 0.95rem',
                border: 'none',
                borderRadius: 'var(--radius-sm)',
                background: viewMode === 'grid' ? 'var(--primary)' : 'transparent',
                color: viewMode === 'grid' ? '#ffffff' : 'var(--text-muted)',
                fontWeight: '600',
                fontSize: '0.88rem',
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
            >
              <LayoutGrid size={16} />
              <span>Grid View</span>
            </button>

            <button
              onClick={() => setViewMode('map')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem',
                padding: '0.5rem 0.95rem',
                border: 'none',
                borderRadius: 'var(--radius-sm)',
                background: viewMode === 'map' ? 'var(--primary)' : 'transparent',
                color: viewMode === 'map' ? '#ffffff' : 'var(--text-muted)',
                fontWeight: '600',
                fontSize: '0.88rem',
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
            >
              <MapIcon size={16} />
              <span>Interactive Map</span>
            </button>
          </div>
        </div>

        {/* Main 2-Column Layout (Sidebar Filters + Results) */}
        <div style={{ display: 'grid', gridTemplateColumns: '280px 1fr', gap: '2rem', alignItems: 'flex-start' }} className="services-layout">
          
          {/* LEFT SIDEBAR: FILTERS */}
          <div className="glass-card" style={{ padding: '1.5rem', background: '#ffffff', position: 'sticky', top: '90px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '0.75rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <SlidersHorizontal size={18} color="var(--primary)" />
                <h3 style={{ fontSize: '1.05rem', fontWeight: '700', margin: 0 }}>Filters</h3>
              </div>
              <button
                onClick={handleResetFilters}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'var(--text-muted)',
                  fontSize: '0.8rem',
                  fontWeight: '600',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.25rem'
                }}
                title="Reset all filters"
              >
                <RotateCcw size={13} /> Reset
              </button>
            </div>

            {/* Keyword Search Input */}
            <form onSubmit={handleSearchSubmit} style={{ marginBottom: '1.25rem' }}>
              <label className="form-label">Keyword Search</label>
              <div style={{ display: 'flex', gap: '0.4rem' }}>
                <input
                  type="text"
                  className="form-control"
                  placeholder="e.g. Inverter, Wiring..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  style={{ fontSize: '0.88rem' }}
                />
                <button type="submit" className="btn btn-primary btn-sm" style={{ padding: '0.5rem 0.75rem' }}>
                  <Search size={16} />
                </button>
              </div>
            </form>

            {/* Category Filter */}
            <div className="form-group">
              <label className="form-label">Service Category</label>
              <select
                className="form-select"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                style={{ fontSize: '0.88rem' }}
              >
                <option value="">All Categories</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.slug}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Location / Area Filter */}
            <div className="form-group">
              <label className="form-label">Location / Area</label>
              <input
                type="text"
                className="form-control"
                placeholder="e.g. Vaishali Nagar, Jaipur"
                value={locationQuery}
                onChange={(e) => setLocationQuery(e.target.value)}
                onBlur={fetchProviders}
                style={{ fontSize: '0.88rem' }}
              />
            </div>

            {/* Minimum Rating */}
            <div className="form-group">
              <label className="form-label">Minimum Star Rating</label>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                {[
                  { label: 'Any Rating', val: '' },
                  { label: '4.8+ ⭐ (Exceptional)', val: '4.8' },
                  { label: '4.5+ ⭐ (Highly Rated)', val: '4.5' },
                  { label: '4.0+ ⭐ (Good)', val: '4.0' }
                ].map((r) => (
                  <label key={r.val} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', cursor: 'pointer' }}>
                    <input
                      type="radio"
                      name="rating"
                      checked={minRating === r.val}
                      onChange={() => setMinRating(r.val)}
                      style={{ accentColor: 'var(--primary)' }}
                    />
                    <span>{r.label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Max Hourly Rate */}
            <div className="form-group">
              <label className="form-label">Max Hourly Rate: ₹{maxPrice || 'Any'}</label>
              <input
                type="range"
                min="200"
                max="1000"
                step="50"
                value={maxPrice || 1000}
                onChange={(e) => setMaxPrice(e.target.value)}
                style={{ width: '100%', accentColor: 'var(--primary)', cursor: 'pointer' }}
              />
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                <span>₹200</span>
                <span>₹600</span>
                <span>₹1000+</span>
              </div>
            </div>

            {/* Quick Toggles: Emergency & Availability */}
            <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '1rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', fontSize: '0.86rem', fontWeight: '600', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={isEmergencyOnly}
                  onChange={(e) => setIsEmergencyOnly(e.target.checked)}
                  style={{ accentColor: 'var(--emergency)', width: '16px', height: '16px' }}
                />
                <span style={{ color: 'var(--emergency)', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                  <AlertTriangle size={14} /> 24/7 Emergency Only
                </span>
              </label>

              <label style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', fontSize: '0.86rem', fontWeight: '600', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={isAvailableOnly}
                  onChange={(e) => setIsAvailableOnly(e.target.checked)}
                  style={{ accentColor: 'var(--success)', width: '16px', height: '16px' }}
                />
                <span style={{ color: 'var(--success)', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                  <CheckCircle size={14} /> Available Online Now
                </span>
              </label>
            </div>

          </div>

          {/* RIGHT CONTENT: RESULTS */}
          <div>
            
            {/* Sorting & Result Counts Bar */}
            <div style={{
              background: '#ffffff',
              padding: '0.75rem 1.25rem',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border-subtle)',
              marginBottom: '1.5rem',
              display: 'flex',
              flexWrap: 'wrap',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '1rem'
            }}>
              <span style={{ fontSize: '0.88rem', fontWeight: '600', color: 'var(--text-main)' }}>
                {loading ? 'Searching providers...' : `Found ${providers.length} service providers`}
              </span>

              {/* Sort selector */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>Sort by:</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  style={{
                    padding: '0.35rem 0.75rem',
                    borderRadius: 'var(--radius-sm)',
                    border: '1px solid var(--border-subtle)',
                    fontSize: '0.85rem',
                    fontWeight: '600',
                    color: 'var(--text-main)',
                    background: '#ffffff',
                    cursor: 'pointer'
                  }}
                >
                  <option value="smart">Smart Rank (Recommended)</option>
                  <option value="rating_desc">Highest Rated ⭐</option>
                  <option value="price_asc">Price: Low to High</option>
                  <option value="price_desc">Price: High to Low</option>
                  <option value="experience">Most Experienced</option>
                  <option value="reviews">Most Reviews</option>
                </select>
              </div>
            </div>

            {/* View Mode: Map or Grid */}
            {viewMode === 'map' ? (
              <MapView 
                providers={providers} 
                onBook={(prov) => setSelectedProviderForBooking(prov)} 
              />
            ) : (
              <>
                {loading ? (
                  <div style={{ textAlign: 'center', padding: '4rem 0', color: 'var(--text-muted)' }}>
                    <p style={{ fontWeight: '600', fontSize: '1.1rem' }}>Loading service professionals...</p>
                  </div>
                ) : providers.length === 0 ? (
                  <div 
                    className="glass-card" 
                    style={{ textAlign: 'center', padding: '4rem 2rem', background: '#ffffff' }}
                  >
                    <Search size={48} color="var(--text-light)" style={{ marginBottom: '1rem' }} />
                    <h3 style={{ fontSize: '1.3rem', fontWeight: '800', color: 'var(--text-main)', marginBottom: '0.5rem' }}>
                      No service providers match your filters
                    </h3>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', maxWidth: '400px', margin: '0 auto 1.5rem' }}>
                      Try relaxing your price, category, or location filters to see more available professionals.
                    </p>
                    <button onClick={handleResetFilters} className="btn btn-secondary btn-sm">
                      <RotateCcw size={15} /> Reset All Filters
                    </button>
                  </div>
                ) : (
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
                    gap: '1.5rem'
                  }}>
                    {providers.map((provider) => (
                      <ProviderCard
                        key={provider.id || provider._id}
                        provider={provider}
                        isFavorite={favoriteIds.has(provider.id) || favoriteIds.has(provider._id)}
                        isCompared={comparedProviders.some(p => (p.id === provider.id || p._id === provider._id))}
                        onToggleCompare={onToggleCompare}
                        onToggleFavorite={handleToggleFavorite}
                        onBook={(prov) => setSelectedProviderForBooking(prov)}
                      />
                    ))}
                  </div>
                )}
              </>
            )}

          </div>

        </div>

      </div>

      {/* Booking Modal */}
      {selectedProviderForBooking && (
        <BookingModal
          provider={selectedProviderForBooking}
          onClose={() => setSelectedProviderForBooking(null)}
          onSuccess={() => {
            showToast('Booking request received! You can track it in My Bookings.', 'success');
          }}
        />
      )}

      <style>{`
        @media (max-width: 900px) {
          .services-layout {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
}
