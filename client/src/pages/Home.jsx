import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Wrench, 
  Zap, 
  Droplets, 
  Sparkles, 
  Car, 
  Flame, 
  Hammer, 
  Scissors, 
  GraduationCap, 
  Laptop, 
  Paintbrush, 
  ShieldCheck, 
  ArrowRight, 
  AlertTriangle 
} from 'lucide-react';
import SearchBar from '../components/SearchBar';
import { categoryAPI } from '../services/api';

// Map icon string to Lucide component
const getCategoryIcon = (iconName) => {
  switch (iconName) {
    case 'Zap': return Zap;
    case 'Droplets': return Droplets;
    case 'Sparkles': return Sparkles;
    case 'Car': return Car;
    case 'Flame': return Flame;
    case 'Hammer': return Hammer;
    case 'Scissors': return Scissors;
    case 'GraduationCap': return GraduationCap;
    case 'Laptop': return Laptop;
    case 'Paintbrush': return Paintbrush;
    default: return Wrench;
  }
};

export default function Home({ onOpenEmergency, onOpenCompare }) {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadCategories() {
      try {
        const catRes = await categoryAPI.getAll();
        if (catRes.success) setCategories(catRes.categories);
      } catch (e) {
        console.warn('Error loading categories:', e.message);
      } finally {
        setLoading(false);
      }
    }

    loadCategories();
  }, []);

  const handleSearch = (filters) => {
    const params = new URLSearchParams();
    if (filters.q) params.set('q', filters.q);
    if (filters.category) params.set('category', filters.category);
    if (filters.location) params.set('location', filters.location);
    if (filters.emergency) params.set('emergency', filters.emergency);
    navigate(`/services?${params.toString()}`);
  };

  return (
    <div>
      {/* 1. HERO SECTION */}
      <section style={{
        background: 'linear-gradient(135deg, #0b0f19 0%, #1e1b4b 45%, #312e81 100%)',
        color: '#ffffff',
        padding: '5.5rem 0 7rem',
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* Glow ambient background orbs */}
        <div style={{
          position: 'absolute',
          top: '-10%',
          left: '5%',
          width: '550px',
          height: '550px',
          background: 'radial-gradient(circle, rgba(99, 102, 241, 0.35) 0%, rgba(99, 102, 241, 0) 70%)',
          borderRadius: '50%',
          pointerEvents: 'none'
        }} />
        <div style={{
          position: 'absolute',
          bottom: '-15%',
          right: '5%',
          width: '600px',
          height: '600px',
          background: 'radial-gradient(circle, rgba(13, 148, 136, 0.3) 0%, rgba(13, 148, 136, 0) 70%)',
          borderRadius: '50%',
          pointerEvents: 'none'
        }} />

        <div className="container" style={{ position: 'relative', zIndex: 10, textAlign: 'center' }}>
          
          {/* Trust pill with glowing border */}
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.6rem',
            background: 'rgba(255, 255, 255, 0.08)',
            backdropFilter: 'blur(12px)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            padding: '0.45rem 1.25rem',
            borderRadius: 'var(--radius-full)',
            fontSize: '0.86rem',
            fontWeight: '700',
            color: '#c7d2fe',
            marginBottom: '2rem',
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.2)'
          }}>
            <span style={{ display: 'flex', width: '8px', height: '8px', borderRadius: '50%', background: '#10b981', boxShadow: '0 0 10px #10b981' }}></span>
            <span>Over 1,200+ Verified Home & Commercial Experts Across India</span>
          </div>

          {/* Main Hero Heading */}
          <h1 style={{
            fontSize: 'clamp(2.4rem, 5.5vw, 4.2rem)',
            fontWeight: '800',
            lineHeight: '1.12',
            color: '#ffffff',
            maxWidth: '960px',
            margin: '0 auto 1.5rem',
            letterSpacing: '-0.035em'
          }}>
            Find Trusted Local Services <br />
            <span className="gradient-text">Near Your Doorstep</span>
          </h1>

          <p style={{
            fontSize: 'clamp(1.05rem, 2vw, 1.3rem)',
            color: '#cbd5e1',
            maxWidth: '720px',
            margin: '0 auto 2.75rem',
            lineHeight: '1.6',
            fontWeight: '400'
          }}>
            Connect with certified electricians, plumbers, car mechanics, deep cleaners, tutors, and salon professionals with instant booking and transparent INR (₹) rates.
          </p>

          {/* Large Hero Search Bar */}
          <div style={{ marginBottom: '2.5rem' }}>
            <SearchBar categories={categories} onSearch={handleSearch} />
          </div>

          {/* Floating Key Guarantee Pills */}
          <div style={{
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '1.25rem',
            marginTop: '2.5rem'
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              background: 'rgba(255, 255, 255, 0.07)',
              backdropFilter: 'blur(8px)',
              padding: '0.5rem 1.1rem',
              borderRadius: 'var(--radius-full)',
              border: '1px solid rgba(255, 255, 255, 0.12)',
              fontSize: '0.86rem',
              fontWeight: '700',
              color: '#ffffff'
            }}>
              <ShieldCheck size={18} color="#34d399" />
              <span>100% Background Verified Pros</span>
            </div>

            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              background: 'rgba(255, 255, 255, 0.07)',
              backdropFilter: 'blur(8px)',
              padding: '0.5rem 1.1rem',
              borderRadius: 'var(--radius-full)',
              border: '1px solid rgba(255, 255, 255, 0.12)',
              fontSize: '0.86rem',
              fontWeight: '700',
              color: '#ffffff'
            }}>
              <AlertTriangle size={18} color="#fbbf24" />
              <span>Upfront Standard Pricing</span>
            </div>

            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              background: 'rgba(255, 255, 255, 0.07)',
              backdropFilter: 'blur(8px)',
              padding: '0.5rem 1.1rem',
              borderRadius: 'var(--radius-full)',
              border: '1px solid rgba(255, 255, 255, 0.12)',
              fontSize: '0.86rem',
              fontWeight: '700',
              color: '#ffffff'
            }}>
              <Zap size={18} color="#38bdf8" />
              <span>30-Minute Fast Doorstep Response</span>
            </div>
          </div>

          {/* Quick Popular Tags */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.75rem',
            marginTop: '2.5rem',
            flexWrap: 'wrap'
          }}>
            <span style={{ fontSize: '0.85rem', color: '#94a3b8', fontWeight: '600' }}>Trending Searches:</span>
            {[
              { label: '⚡ Emergency Electrician', cat: 'electrician' },
              { label: '💧 Water Pipe Leakage', cat: 'plumber' },
              { label: '🧹 Deep Home Cleaning', cat: 'cleaning' },
              { label: '🚗 Car Jumpstart / Battery', cat: 'car-mechanic' }
            ].map((tag, idx) => (
              <button
                key={idx}
                onClick={() => navigate(`/services?category=${tag.cat}`)}
                style={{
                  background: 'rgba(255, 255, 255, 0.1)',
                  border: '1px solid rgba(255, 255, 255, 0.15)',
                  color: '#e2e8f0',
                  padding: '0.35rem 0.85rem',
                  borderRadius: 'var(--radius-full)',
                  fontSize: '0.8rem',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.2)';
                  e.currentTarget.style.color = '#ffffff';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
                  e.currentTarget.style.color = '#e2e8f0';
                }}
              >
                {tag.label}
              </button>
            ))}
          </div>

        </div>
      </section>

      {/* 2. EMERGENCY SOS BANNER */}
      <section style={{
        background: 'linear-gradient(90deg, #be123c 0%, #e11d48 50%, #f43f5e 100%)',
        color: '#ffffff',
        padding: '1.25rem 0',
        boxShadow: '0 4px 20px rgba(225, 29, 72, 0.25)'
      }}>
        <div className="container" style={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '1rem'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{
              background: 'rgba(255, 255, 255, 0.2)',
              borderRadius: '50%',
              width: '46px',
              height: '46px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0
            }}>
              <AlertTriangle size={24} color="#ffffff" />
            </div>
            <div>
              <strong style={{ fontSize: '1.05rem', display: 'block', letterSpacing: '-0.01em' }}>
                Facing an Urgent Household Emergency?
              </strong>
              <p style={{ margin: 0, fontSize: '0.86rem', color: '#ffe4e6' }}>
                Instant dispatch for short circuits, water line burst, gas leaks, and vehicle breakdown.
              </p>
            </div>
          </div>

          <button
            onClick={onOpenEmergency}
            style={{
              background: '#ffffff',
              color: '#e11d48',
              border: 'none',
              padding: '0.7rem 1.6rem',
              borderRadius: 'var(--radius-full)',
              fontWeight: '800',
              fontSize: '0.92rem',
              cursor: 'pointer',
              boxShadow: '0 4px 15px rgba(0,0,0,0.2)',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              transition: 'transform 0.15s'
            }}
          >
            <span>Request Emergency SOS</span>
            <ArrowRight size={17} />
          </button>
        </div>
      </section>

      {/* 3. POPULAR CATEGORIES WITH VIBRANT GRADIENT CARDS */}
      <section style={{ padding: '5.5rem 0 6rem', background: 'var(--bg-main)' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
            <span className="badge badge-primary" style={{ marginBottom: '0.6rem' }}>
              Explore Services
            </span>
            <h2 style={{ fontSize: '2.4rem', fontWeight: '800', color: 'var(--text-main)', letterSpacing: '-0.025em' }}>
              Service Categories We Cater To
            </h2>
            <p style={{ color: 'var(--text-muted)', maxWidth: '640px', margin: '0.5rem auto 0', fontSize: '1.05rem' }}>
              Tap any category to discover vetted local specialists ready to visit your location.
            </p>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
            gap: '1.4rem'
          }}>
            {categories.map((cat) => {
              const Icon = getCategoryIcon(cat.icon);
              return (
                <div
                  key={cat.id}
                  onClick={() => navigate(`/services?category=${cat.slug}`)}
                  className="glass-card glass-card-glow"
                  style={{
                    padding: '1.75rem 1.5rem',
                    textAlign: 'center',
                    cursor: 'pointer',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.85rem',
                    borderRadius: 'var(--radius-xl)',
                    background: '#ffffff'
                  }}
                >
                  <div style={{
                    width: '60px',
                    height: '60px',
                    borderRadius: '18px',
                    background: cat.is_emergency ? 'linear-gradient(135deg, #ffe4e6 0%, #fecdd3 100%)' : 'linear-gradient(135deg, #e0e7ff 0%, #c7d2fe 100%)',
                    color: cat.is_emergency ? 'var(--emergency)' : 'var(--primary)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: cat.is_emergency ? '0 8px 16px rgba(225, 29, 72, 0.15)' : '0 8px 16px rgba(79, 70, 229, 0.15)',
                    transition: 'transform 0.2s'
                  }}>
                    <Icon size={28} />
                  </div>
                  <div>
                    <h3 style={{ fontSize: '1.1rem', fontWeight: '800', color: 'var(--text-main)', marginBottom: '0.25rem' }}>
                      {cat.name}
                    </h3>
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: '600' }}>
                      {cat.provider_count || 1}+ Active Pros
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
}
