import React from 'react';
import { useNavigate } from 'react-router-dom';
import { AlertTriangle, Zap, Droplets, Car, Flame, X, PhoneCall, ShieldAlert, ArrowRight, Clock } from 'lucide-react';

const EMERGENCY_CATEGORIES = [
  {
    id: 'electrical',
    title: 'Emergency Electrician',
    desc: 'Short circuits, sparking MCBs, total power blackout, inverter failure',
    icon: Zap,
    color: '#eab308',
    slug: 'electrical',
    sla: '15-30 Mins'
  },
  {
    id: 'plumbing',
    title: 'Emergency Plumber',
    desc: 'Burst pipes, major water leaks, overflowing tanks, clogged main drains',
    icon: Droplets,
    color: '#0284c7',
    slug: 'plumbing',
    sla: '20-35 Mins'
  },
  {
    id: 'automotive',
    title: 'Emergency Mechanic / SOS',
    desc: 'Car / Bike breakdown, battery jumpstart, flat tyre, engine failure',
    icon: Car,
    color: '#e11d48',
    slug: 'automotive',
    sla: '15-25 Mins'
  },
  {
    id: 'appliance-repair',
    title: 'Emergency AC & Fridge Repair',
    desc: 'AC gas leak, refrigerator compressor failure, electrical burning smell',
    icon: Flame,
    color: '#f97316',
    slug: 'appliance-repair',
    sla: '30-45 Mins'
  }
];

export default function EmergencyModal({ isOpen, onClose }) {
  const navigate = useNavigate();

  if (!isOpen) return null;

  const handleSelect = (slug) => {
    onClose();
    navigate(`/services?category=${slug}&emergency=true&availability=true`);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div 
        className="modal-content" 
        style={{
          maxWidth: '660px',
          border: '2px solid var(--emergency)',
          boxShadow: '0 25px 60px -15px rgba(225, 29, 72, 0.4)'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Emergency Alert Ribbon */}
        <div style={{
          background: 'linear-gradient(135deg, #be123c 0%, #e11d48 50%, #9f1239 100%)',
          margin: '-2rem -2rem 1.75rem -2rem',
          padding: '1.5rem 2rem',
          color: '#ffffff',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderTopLeftRadius: 'var(--radius-xl)',
          borderTopRightRadius: 'var(--radius-xl)',
          boxShadow: '0 4px 15px rgba(225, 29, 72, 0.3)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
            <div style={{
              background: '#ffffff',
              color: '#e11d48',
              borderRadius: '50%',
              width: '40px',
              height: '40px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              animation: 'pulse-emergency 2s infinite',
              boxShadow: '0 0 15px rgba(255, 255, 255, 0.6)'
            }}>
              <AlertTriangle size={22} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: '800', margin: 0, letterSpacing: '-0.01em' }}>
                24/7 Emergency Service Dispatch
              </h3>
              <p style={{ fontSize: '0.82rem', opacity: 0.95, margin: '0.15rem 0 0' }}>
                Prioritizing nearest available on-duty technicians
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            style={{
              background: 'rgba(255, 255, 255, 0.2)',
              border: 'none',
              borderRadius: '50%',
              width: '34px',
              height: '34px',
              color: '#ffffff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              transition: 'background 0.2s'
            }}
          >
            <X size={18} />
          </button>
        </div>

        <p style={{ fontSize: '0.92rem', color: 'var(--text-muted)', marginBottom: '1.5rem', lineHeight: '1.5' }}>
          Select the emergency service you urgently require. We will instantly match you with verified professionals who are on-call right now:
        </p>

        {/* Emergency Categories Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.75rem' }}>
          {EMERGENCY_CATEGORIES.map((cat) => {
            const Icon = cat.icon;
            return (
              <div
                key={cat.id}
                onClick={() => handleSelect(cat.slug)}
                className="glass-card glass-card-glow"
                style={{
                  padding: '1.35rem',
                  cursor: 'pointer',
                  border: '1.5px solid var(--border-subtle)',
                  borderRadius: 'var(--radius-lg)',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  gap: '0.75rem',
                  background: '#ffffff'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{
                    width: '44px',
                    height: '44px',
                    borderRadius: '12px',
                    background: `${cat.color}15`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <Icon size={24} color={cat.color} />
                  </div>
                  <span className="badge badge-emergency" style={{ fontSize: '0.7rem', fontWeight: '800' }}>
                    ⚡ {cat.sla}
                  </span>
                </div>

                <div>
                  <h4 style={{ fontSize: '1.05rem', fontWeight: '800', color: 'var(--text-main)', marginBottom: '0.3rem' }}>
                    {cat.title}
                  </h4>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', lineHeight: '1.4', margin: 0 }}>
                    {cat.desc}
                  </p>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.85rem', fontWeight: '800', color: 'var(--emergency)' }}>
                  <span>Dispatch Now</span>
                  <ArrowRight size={15} />
                </div>
              </div>
            );
          })}
        </div>

        {/* Helpline Footer */}
        <div style={{
          background: 'var(--bg-subtle)',
          padding: '1.1rem 1.25rem',
          borderRadius: 'var(--radius-md)',
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          fontSize: '0.88rem',
          border: '1px solid var(--border-subtle)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <PhoneCall size={19} color="var(--emergency)" />
            <span style={{ fontWeight: '600' }}>Need voice assistance? Call Toll-Free:</span>
          </div>
          <a 
            href="tel:18002004567" 
            style={{ fontWeight: '800', color: 'var(--emergency)', fontSize: '1.05rem' }}
          >
            1800-200-4567
          </a>
        </div>

      </div>
    </div>
  );
}
