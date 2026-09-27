import React from 'react';
import { X, Star, CheckCircle, ShieldCheck, Zap, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function ProviderCompareModal({ isOpen, onClose, providers = [], onSelectProviderToBook }) {
  if (!isOpen) return null;

  return (
    <div 
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'rgba(15, 23, 42, 0.75)',
        backdropFilter: 'blur(8px)',
        zIndex: 1200,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1rem',
        animation: 'fadeIn 0.2s ease'
      }}
      onClick={onClose}
    >
      <div 
        style={{
          background: '#ffffff',
          borderRadius: 'var(--radius-2xl)',
          maxWidth: '900px',
          width: '100%',
          maxHeight: '90vh',
          overflowY: 'auto',
          boxShadow: 'var(--shadow-2xl)',
          padding: '2rem',
          position: 'relative'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '1rem', marginBottom: '1.5rem' }}>
          <div>
            <h3 style={{ fontSize: '1.45rem', fontWeight: '800', color: 'var(--text-main)', margin: 0, display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              ⚖️ Side-by-Side Provider Comparison
            </h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', margin: '0.3rem 0 0' }}>
              Compare credentials, customer ratings, pricing, and emergency availability to make an informed decision.
            </p>
          </div>
          <button 
            onClick={onClose}
            style={{
              background: 'var(--bg-subtle)',
              border: 'none',
              borderRadius: '50%',
              width: '36px',
              height: '36px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              color: 'var(--text-muted)'
            }}
          >
            <X size={18} />
          </button>
        </div>

        {providers.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '3rem 1rem' }}>
            <p style={{ color: 'var(--text-muted)', fontSize: '1.05rem', fontWeight: '600' }}>
              No service providers selected for comparison yet.
            </p>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
              Browse services and click the <strong>"Compare"</strong> checkbox on any provider card to compare them here!
            </p>
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <div style={{ display: 'grid', gridTemplateColumns: `180px repeat(${providers.length}, minmax(200px, 1fr))`, gap: '1rem', alignItems: 'stretch' }}>
              
              {/* Feature Row Labels */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', paddingTop: '100px', fontWeight: '700', color: 'var(--text-muted)', fontSize: '0.88rem' }}>
                <div style={{ height: '40px', display: 'flex', alignItems: 'center' }}>Category</div>
                <div style={{ height: '40px', display: 'flex', alignItems: 'center' }}>Starting Price</div>
                <div style={{ height: '40px', display: 'flex', alignItems: 'center' }}>Customer Rating</div>
                <div style={{ height: '40px', display: 'flex', alignItems: 'center' }}>Experience</div>
                <div style={{ height: '40px', display: 'flex', alignItems: 'center' }}>Verification</div>
                <div style={{ height: '40px', display: 'flex', alignItems: 'center' }}>24/7 Emergency</div>
                <div style={{ height: '40px', display: 'flex', alignItems: 'center' }}>Location</div>
                <div style={{ height: '50px', display: 'flex', alignItems: 'center' }}>Action</div>
              </div>

              {/* Provider Columns */}
              {providers.map((p) => (
                <div 
                  key={p.id || p._id} 
                  style={{
                    background: 'var(--bg-subtle)',
                    borderRadius: 'var(--radius-lg)',
                    padding: '1.25rem',
                    border: '1.5px solid var(--border-subtle)',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '1.25rem'
                  }}
                >
                  {/* Provider Header Card */}
                  <div style={{ height: '100px', textAlign: 'center' }}>
                    <img 
                      src={p.avatar || p.profileImage || `https://api.dicebear.com/7.x/avataaars/svg?seed=${p.user_name || p.name}`} 
                      alt={p.business_name} 
                      style={{ width: '52px', height: '52px', borderRadius: '50%', objectFit: 'cover', margin: '0 auto 0.5rem', border: '2px solid var(--primary)' }}
                    />
                    <h4 style={{ fontSize: '0.98rem', fontWeight: '800', margin: 0, color: 'var(--text-main)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {p.business_name}
                    </h4>
                  </div>

                  {/* Category */}
                  <div style={{ height: '40px', display: 'flex', alignItems: 'center', fontWeight: '700', color: 'var(--primary)', fontSize: '0.9rem' }}>
                    {p.category_name || (p.serviceCategories && p.serviceCategories[0]) || 'General Service'}
                  </div>

                  {/* Starting Price */}
                  <div style={{ height: '40px', display: 'flex', alignItems: 'center', fontSize: '1.15rem', fontWeight: '800', color: 'var(--text-main)' }}>
                    ₹{p.hourly_rate || p.pricing?.hourlyRate || 299}<span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: '600' }}>/hr</span>
                  </div>

                  {/* Rating */}
                  <div style={{ height: '40px', display: 'flex', alignItems: 'center', gap: '0.35rem', fontWeight: '700' }}>
                    <Star size={16} fill="#f59e0b" color="#f59e0b" />
                    <span>{p.rating || 5.0}</span>
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>({p.total_reviews || 0} reviews)</span>
                  </div>

                  {/* Experience */}
                  <div style={{ height: '40px', display: 'flex', alignItems: 'center', fontWeight: '700', color: 'var(--text-main)' }}>
                    {p.experience_years || p.experienceYears || 5} Years
                  </div>

                  {/* Verification */}
                  <div style={{ height: '40px', display: 'flex', alignItems: 'center', gap: '0.35rem', color: '#10b981', fontWeight: '700' }}>
                    <ShieldCheck size={18} /> Verified
                  </div>

                  {/* Emergency */}
                  <div style={{ height: '40px', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                    {p.is_emergency || p.isEmergency ? (
                      <span style={{ color: 'var(--emergency)', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                        <Zap size={16} /> Yes (24/7)
                      </span>
                    ) : (
                      <span style={{ color: 'var(--text-muted)', fontWeight: '600' }}>Standard Hours</span>
                    )}
                  </div>

                  {/* Location */}
                  <div style={{ height: '40px', display: 'flex', alignItems: 'center', fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: '600' }}>
                    {p.area ? `${p.area}, ` : ''}{p.city}
                  </div>

                  {/* Booking Action */}
                  <div style={{ height: '50px', display: 'flex', alignItems: 'center' }}>
                    <button 
                      className="btn btn-primary btn-sm"
                      style={{ width: '100%', borderRadius: 'var(--radius-full)', fontWeight: '700' }}
                      onClick={() => {
                        onClose();
                        if (onSelectProviderToBook) {
                          onSelectProviderToBook(p);
                        }
                      }}
                    >
                      Book Now
                    </button>
                  </div>

                </div>
              ))}

            </div>
          </div>
        )}

      </div>
    </div>
  );
}
