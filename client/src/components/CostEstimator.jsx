import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calculator, Sparkles, CheckCircle2, ArrowRight, IndianRupee, ShieldCheck, Zap } from 'lucide-react';

const ESTIMATOR_DATA = {
  'ac-repair': {
    name: 'AC Repair & Servicing',
    baseMin: 499,
    baseMax: 799,
    unitName: 'Units / ACs',
    avgDuration: '45 mins per unit',
    categorySlug: 'appliance-repair'
  },
  'fan-install': {
    name: 'Ceiling Fan & Light Fixture Wiring',
    baseMin: 249,
    baseMax: 399,
    unitName: 'Fixtures',
    avgDuration: '30 mins per fixture',
    categorySlug: 'electrical'
  },
  'plumbing-leak': {
    name: 'Pipe Leakage & Tap Replacement',
    baseMin: 299,
    baseMax: 499,
    unitName: 'Points / Taps',
    avgDuration: '40 mins per point',
    categorySlug: 'plumbing'
  },
  'deep-cleaning': {
    name: 'Full Home Deep Sanitization Scrub',
    baseMin: 999,
    baseMax: 1499,
    unitName: 'Rooms / BHK',
    avgDuration: '90 mins per room',
    categorySlug: 'cleaning'
  },
  'car-mechanic': {
    name: 'Roadside Jumpstart & Engine Diagnostic',
    baseMin: 399,
    baseMax: 699,
    unitName: 'Vehicles',
    avgDuration: '35 mins',
    categorySlug: 'automotive'
  },
  'carpentry': {
    name: 'Door Lock & Modular Furniture Fitting',
    baseMin: 349,
    baseMax: 599,
    unitName: 'Doors / Items',
    avgDuration: '45 mins per item',
    categorySlug: 'carpentry'
  },
  'tutoring': {
    name: '1-on-1 Academic Tuition Mentorship',
    baseMin: 350,
    baseMax: 500,
    unitName: 'Hours',
    avgDuration: '60 mins per session',
    categorySlug: 'education'
  },
  'salon': {
    name: 'Home Beauty, Facial & Hair Grooming',
    baseMin: 599,
    baseMax: 999,
    unitName: 'Services / Packages',
    avgDuration: '60 mins',
    categorySlug: 'beauty-salon'
  }
};

export default function CostEstimator({ compact = false }) {
  const [selectedService, setSelectedService] = useState('ac-repair');
  const [quantity, setQuantity] = useState(2);
  const [tier, setTier] = useState('standard'); // basic (0.85x), standard (1.0x), premium (1.3x)
  const navigate = useNavigate();

  const current = ESTIMATOR_DATA[selectedService];

  const tierMultiplier = tier === 'basic' ? 0.85 : tier === 'premium' ? 1.3 : 1.0;

  const minCost = Math.round(current.baseMin * quantity * tierMultiplier);
  const maxCost = Math.round(current.baseMax * quantity * tierMultiplier);
  const avgCost = Math.round((minCost + maxCost) / 2);

  const handleSearchProviders = () => {
    navigate(`/services?category=${current.categorySlug}&max_price=${maxCost}`);
  };

  return (
    <div 
      className="glass-card" 
      style={{
        padding: compact ? '1.5rem' : '2.75rem',
        maxWidth: compact ? '100%' : '940px',
        margin: '0 auto',
        borderRadius: 'var(--radius-xl)',
        background: '#ffffff',
        border: '1px solid rgba(226, 232, 240, 0.9)',
        boxShadow: 'var(--shadow-xl)'
      }}
    >
      {/* Title */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.9rem', marginBottom: '2rem' }}>
        <div style={{
          background: 'linear-gradient(135deg, #0d9488 0%, #047857 100%)',
          color: '#ffffff',
          width: '46px',
          height: '46px',
          borderRadius: '14px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 6px 16px rgba(13, 148, 136, 0.25)'
        }}>
          <Calculator size={24} />
        </div>
        <div>
          <h3 style={{ fontSize: '1.4rem', fontWeight: '800', color: 'var(--text-main)', margin: 0 }}>
            Dynamic Service Cost Estimator
          </h3>
          <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', margin: '0.15rem 0 0' }}>
            Instant, transparent real-time cost calculation in Indian Rupees (₹)
          </p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: compact ? '1fr' : '1.2fr 1fr', gap: '2rem' }}>
        
        {/* Controls Column */}
        <div>
          {/* 1. Service Selection */}
          <div className="form-group">
            <label className="form-label">Service Category</label>
            <select
              className="form-select"
              value={selectedService}
              onChange={(e) => setSelectedService(e.target.value)}
              style={{ fontWeight: '600' }}
            >
              {Object.entries(ESTIMATOR_DATA).map(([key, data]) => (
                <option key={key} value={key}>
                  {data.name}
                </option>
              ))}
            </select>
          </div>

          {/* 2. Quantity / Hours Slider */}
          <div className="form-group">
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.45rem' }}>
              <label className="form-label" style={{ margin: 0 }}>
                {current.unitName}: <strong style={{ color: 'var(--primary)', fontSize: '1rem' }}>{quantity}</strong>
              </label>
              <span style={{ fontSize: '0.8rem', color: 'var(--secondary)', fontWeight: '600' }}>
                Est. time: {current.avgDuration}
              </span>
            </div>
            <input
              type="range"
              min="1"
              max="6"
              value={quantity}
              onChange={(e) => setQuantity(Number(e.target.value))}
              style={{ width: '100%', accentColor: 'var(--primary)', cursor: 'pointer', height: '6px' }}
            />
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: '600', marginTop: '0.2rem' }}>
              <span>1 {current.unitName.split('/')[0]}</span>
              <span>3</span>
              <span>6 {current.unitName.split('/')[0]}s</span>
            </div>
          </div>

          {/* 3. Service Complexity Tier */}
          <div className="form-group">
            <label className="form-label">Service Scope & Complexity</label>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.6rem' }}>
              {[
                { id: 'basic', label: 'Basic Fix', desc: 'Minor repair' },
                { id: 'standard', label: 'Standard', desc: 'Full service' },
                { id: 'premium', label: 'Heavy Duty', desc: 'Includes parts' }
              ].map((t) => (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => setTier(t.id)}
                  style={{
                    padding: '0.75rem 0.5rem',
                    borderRadius: 'var(--radius-md)',
                    border: tier === t.id ? '2px solid var(--primary)' : '1px solid var(--border-subtle)',
                    background: tier === t.id ? 'var(--primary-light)' : '#ffffff',
                    color: tier === t.id ? 'var(--primary)' : 'var(--text-main)',
                    cursor: 'pointer',
                    textAlign: 'center',
                    transition: 'all 0.15s',
                    boxShadow: tier === t.id ? '0 0 12px var(--primary-glow)' : 'none'
                  }}
                >
                  <span style={{ display: 'block', fontSize: '0.88rem', fontWeight: '800' }}>{t.label}</span>
                  <span style={{ display: 'block', fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '0.15rem' }}>{t.desc}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Dynamic Result Card */}
        <div style={{
          background: 'linear-gradient(135deg, #0b0f19 0%, #1e1b4b 60%, #312e81 100%)',
          borderRadius: 'var(--radius-xl)',
          padding: '2rem',
          color: '#ffffff',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          boxShadow: 'var(--shadow-2xl)',
          border: '1px solid rgba(255, 255, 255, 0.15)',
          position: 'relative',
          overflow: 'hidden'
        }}>
          {/* Subtle glow orb */}
          <div style={{
            position: 'absolute',
            top: '-20%',
            right: '-20%',
            width: '200px',
            height: '200px',
            background: 'radial-gradient(circle, rgba(99, 102, 241, 0.35) 0%, rgba(0,0,0,0) 70%)',
            pointerEvents: 'none'
          }} />

          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.5rem' }}>
              <Sparkles size={16} color="#38bdf8" />
              <span style={{ fontSize: '0.78rem', textTransform: 'uppercase', letterSpacing: '0.08em', color: '#94a3b8', fontWeight: '800' }}>
                Estimated Price Range
              </span>
            </div>

            <div style={{ margin: '0.85rem 0 1.25rem' }}>
              <div style={{ fontSize: '2.6rem', fontWeight: '900', color: '#ffffff', letterSpacing: '-0.03em', lineHeight: '1.1' }}>
                ₹{minCost} – ₹{maxCost}
              </div>
              <span style={{ fontSize: '0.88rem', color: '#cbd5e1', marginTop: '0.25rem', display: 'block' }}>
                Approx. Average: <strong style={{ color: '#38bdf8' }}>₹{avgCost}</strong>
              </span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.55rem', marginBottom: '1.75rem', borderTop: '1px solid rgba(255, 255, 255, 0.12)', paddingTop: '1.1rem', fontSize: '0.85rem', color: '#cbd5e1' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <CheckCircle2 size={15} color="#10b981" />
                <span>Verified technician doorstep visit</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <CheckCircle2 size={15} color="#10b981" />
                <span>30-Day post-service guarantee</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <ShieldCheck size={15} color="#38bdf8" />
                <span>Pay only after work completion</span>
              </div>
            </div>
          </div>

          <button
            onClick={handleSearchProviders}
            className="btn btn-primary"
            style={{
              width: '100%',
              padding: '0.85rem',
              fontWeight: '800',
              fontSize: '0.98rem',
              borderRadius: 'var(--radius-md)',
              background: 'linear-gradient(135deg, #4f46e5 0%, #06b6d4 100%)'
            }}
          >
            <span>Find {current.name.split(' ')[0]}s</span>
            <ArrowRight size={16} />
          </button>
        </div>

      </div>
    </div>
  );
}
