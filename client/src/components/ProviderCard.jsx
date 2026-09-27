import React from 'react';
import { Link } from 'react-router-dom';
import { Star, MapPin, CheckCircle, Clock, Shield, Heart, ArrowRight, Sparkles } from 'lucide-react';

export default function ProviderCard({ 
  provider, 
  onBook, 
  onToggleFavorite, 
  isFavorite = false,
  isCompared = false,
  onToggleCompare = null
}) {
  return (
    <div 
      className="glass-card glass-card-glow" 
      style={{
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        position: 'relative',
        background: '#ffffff',
        borderRadius: 'var(--radius-xl)',
        border: '1px solid rgba(226, 232, 240, 0.9)'
      }}
    >
      {/* Top Banner Accent Line */}
      <div style={{
        height: '4px',
        background: provider.is_emergency === 1 
          ? 'linear-gradient(90deg, #e11d48, #f59e0b)' 
          : 'linear-gradient(90deg, #4f46e5, #06b6d4)'
      }} />

      {/* Main Info Header */}
      <div style={{
        padding: '1.4rem 1.4rem 0.5rem',
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'space-between',
        gap: '0.75rem'
      }}>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <div style={{ position: 'relative' }}>
            <img 
              src={provider.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${provider.business_name}`} 
              alt={provider.business_name}
              style={{
                width: '64px',
                height: '64px',
                borderRadius: '16px',
                objectFit: 'cover',
                border: '2px solid #ffffff',
                boxShadow: 'var(--shadow-md)'
              }}
            />
            {provider.is_available === 1 ? (
              <span 
                title="Available Online Now"
                style={{
                  position: 'absolute',
                  bottom: '-2px',
                  right: '-2px',
                  width: '15px',
                  height: '15px',
                  background: '#10b981',
                  border: '2.5px solid #ffffff',
                  borderRadius: '50%',
                  animation: 'pulse-green 2s infinite'
                }}
              />
            ) : (
              <span 
                title="Off-duty"
                style={{
                  position: 'absolute',
                  bottom: '-2px',
                  right: '-2px',
                  width: '15px',
                  height: '15px',
                  background: '#94a3b8',
                  border: '2.5px solid #ffffff',
                  borderRadius: '50%'
                }}
              />
            )}
          </div>

          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <h3 style={{ fontSize: '1.12rem', fontWeight: '800', color: 'var(--text-main)', margin: 0, letterSpacing: '-0.01em' }}>
                {provider.business_name}
              </h3>
              {provider.verified && (
                <Shield size={16} color="#4f46e5" fill="#eef2ff" title="Verified Professional" style={{ flexShrink: 0 }} />
              )}
            </div>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', fontWeight: '600', margin: '0.2rem 0 0' }}>
              {provider.user_name} • {provider.experience_years}+ Yrs Exp
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
          {/* Compare Toggle Button */}
          {onToggleCompare && (
            <button
              onClick={(e) => {
                e.preventDefault();
                onToggleCompare(provider);
              }}
              style={{
                background: isCompared ? 'var(--primary)' : 'var(--bg-subtle)',
                color: isCompared ? '#ffffff' : 'var(--text-muted)',
                border: isCompared ? '1px solid var(--primary)' : '1px solid var(--border-subtle)',
                borderRadius: 'var(--radius-full)',
                padding: '0.35rem 0.65rem',
                fontSize: '0.75rem',
                fontWeight: '700',
                display: 'flex',
                alignItems: 'center',
                gap: '0.25rem',
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
              title={isCompared ? 'Remove from comparison' : 'Add to side-by-side comparison'}
            >
              <span>⚖️</span>
              <span>{isCompared ? 'Comparing' : 'Compare'}</span>
            </button>
          )}

          {/* Favorite Button */}
          {onToggleFavorite && (
            <button
              onClick={(e) => {
                e.preventDefault();
                onToggleFavorite(provider.id || provider._id);
              }}
              style={{
                background: isFavorite ? '#ffe4e6' : 'var(--bg-subtle)',
                border: 'none',
                borderRadius: '50%',
                width: '38px',
                height: '38px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                color: isFavorite ? 'var(--emergency)' : 'var(--text-muted)',
                transition: 'all 0.2s',
                boxShadow: isFavorite ? '0 2px 8px var(--emergency-glow)' : 'none'
              }}
              title={isFavorite ? 'Remove from favorites' : 'Save to favorites'}
            >
              <Heart size={18} fill={isFavorite ? 'currentColor' : 'none'} />
            </button>
          )}
        </div>
      </div>

      {/* Tagline / Bio Preview */}
      <div style={{ padding: '0 1.4rem', margin: '0.5rem 0' }}>
        <p style={{
          fontSize: '0.86rem',
          color: 'var(--text-muted)',
          display: '-webkit-box',
          WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden',
          lineHeight: '1.45',
          minHeight: '2.5rem'
        }}>
          {provider.tagline || provider.bio || 'Experienced local professional providing guaranteed satisfaction and prompt doorstep service.'}
        </p>
      </div>

      {/* Tags: Category, Emergency & Location */}
      <div style={{ padding: '0 1.4rem', display: 'flex', flexWrap: 'wrap', gap: '0.45rem', marginBottom: '1rem', alignItems: 'center' }}>
        <span className="badge badge-primary">
          {provider.category_name || 'Service'}
        </span>
        {provider.is_emergency === 1 && (
          <span className="badge badge-emergency">
            ⚡ 24/7 SOS
          </span>
        )}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.8rem', color: 'var(--text-muted)', marginLeft: 'auto', fontWeight: '600' }}>
          <MapPin size={13} color="var(--primary)" />
          <span>{provider.area}</span>
        </div>
      </div>

      {/* Rating & Rate Strip */}
      <div style={{
        marginTop: 'auto',
        padding: '0.9rem 1.4rem',
        background: 'linear-gradient(180deg, #f8fafc 0%, #f1f5f9 100%)',
        borderTop: '1px solid var(--border-subtle)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
        {/* Rating */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.25rem',
            background: '#fef3c7',
            color: '#92400e',
            padding: '0.25rem 0.55rem',
            borderRadius: 'var(--radius-sm)',
            fontSize: '0.85rem',
            fontWeight: '800',
            border: '1px solid #fde68a'
          }}>
            <Star size={14} fill="#f59e0b" color="#f59e0b" />
            <span>{Number(provider.rating || 5).toFixed(1)}</span>
          </div>
          <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: '600' }}>
            ({provider.total_reviews || 0} reviews)
          </span>
        </div>

        {/* Pricing */}
        <div>
          <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', display: 'block', textAlign: 'right', fontWeight: '600' }}>Visiting Rate</span>
          <span style={{ fontSize: '1.15rem', fontWeight: '800', color: 'var(--text-main)' }}>
            ₹{provider.hourly_rate}
            <span style={{ fontSize: '0.75rem', fontWeight: '600', color: 'var(--text-muted)' }}> /hr</span>
          </span>
        </div>
      </div>

      {/* Action Footer */}
      <div style={{ padding: '0.85rem 1.4rem 1.1rem', display: 'flex', gap: '0.6rem' }}>
        <Link 
          to={`/providers/${provider.id}`} 
          className="btn btn-secondary btn-sm"
          style={{ flex: '1', fontWeight: '700' }}
        >
          View Profile
        </Link>
        <button
          onClick={() => onBook && onBook(provider)}
          className="btn btn-primary btn-sm"
          style={{ flex: '1.2', fontWeight: '800' }}
        >
          <span>Book Service</span>
          <ArrowRight size={15} />
        </button>
      </div>
    </div>
  );
}
