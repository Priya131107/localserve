import React from 'react';
import { Link } from 'react-router-dom';
import { Wrench, MapPin, Phone, Mail, Shield, Star, Clock, Heart, ArrowRight, Zap, ExternalLink } from 'lucide-react';

export default function Footer() {
  return (
    <footer style={{
      background: 'linear-gradient(180deg, #0b0f19 0%, #020617 100%)',
      color: '#94a3b8',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Top gradient separator */}
      <div style={{
        height: '4px',
        background: 'linear-gradient(90deg, #4f46e5, #06b6d4, #10b981, #f59e0b, #e11d48)',
        backgroundSize: '200% auto',
        animation: 'gradientShift 6s ease infinite'
      }} />

      {/* Ambient glow */}
      <div style={{
        position: 'absolute',
        top: '10%',
        left: '10%',
        width: '400px',
        height: '400px',
        background: 'radial-gradient(circle, rgba(79, 70, 229, 0.08) 0%, rgba(0,0,0,0) 70%)',
        pointerEvents: 'none'
      }} />
      <div style={{
        position: 'absolute',
        bottom: '5%',
        right: '10%',
        width: '350px',
        height: '350px',
        background: 'radial-gradient(circle, rgba(13, 148, 136, 0.06) 0%, rgba(0,0,0,0) 70%)',
        pointerEvents: 'none'
      }} />

      <div className="container" style={{ position: 'relative', zIndex: 10, padding: '4.5rem 1.5rem 2rem' }}>

        {/* Main Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '3rem',
          marginBottom: '3.5rem'
        }}>

          {/* Column 1: Brand */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.25rem' }}>
              <div style={{
                background: 'linear-gradient(135deg, #4f46e5 0%, #06b6d4 100%)',
                color: '#ffffff',
                width: '42px',
                height: '42px',
                borderRadius: '12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 6px 16px rgba(79, 70, 229, 0.4)',
                transform: 'rotate(-2deg)'
              }}>
                <Wrench size={20} />
              </div>
              <span style={{ fontSize: '1.3rem', fontWeight: '800', color: '#ffffff', letterSpacing: '-0.02em' }}>
                Local<span style={{ color: '#818cf8' }}>Serve</span>
              </span>
            </div>
            <p style={{ fontSize: '0.88rem', lineHeight: '1.65', color: '#64748b', marginBottom: '1.5rem', maxWidth: '280px' }}>
              India's trusted marketplace connecting households with verified local electricians, plumbers, cleaners, mechanics, tutors, and emergency services.
            </p>

            {/* Trust Badges Row */}
            <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
              <div style={{
                display: 'flex', alignItems: 'center', gap: '0.35rem',
                background: 'rgba(16, 185, 129, 0.1)', border: '1px solid rgba(16, 185, 129, 0.2)',
                padding: '0.35rem 0.65rem', borderRadius: '6px', fontSize: '0.72rem', fontWeight: '700', color: '#34d399'
              }}>
                <Shield size={12} /> Verified Pros
              </div>
              <div style={{
                display: 'flex', alignItems: 'center', gap: '0.35rem',
                background: 'rgba(245, 158, 11, 0.1)', border: '1px solid rgba(245, 158, 11, 0.2)',
                padding: '0.35rem 0.65rem', borderRadius: '6px', fontSize: '0.72rem', fontWeight: '700', color: '#fbbf24'
              }}>
                <Star size={12} fill="currentColor" /> 4.9 / 5 Rating
              </div>
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div>
            <h4 style={{ fontSize: '0.82rem', textTransform: 'uppercase', letterSpacing: '0.1em', color: '#475569', fontWeight: '800', marginBottom: '1.25rem' }}>
              Explore Platform
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.7rem' }}>
              {[
                { to: '/', label: 'Home' },
                { to: '/services', label: 'Find Services' },
                { to: '/estimator', label: 'Cost Estimator' },
                { to: '/about', label: 'About Us' },
                { to: '/login', label: 'Sign In' },
                { to: '/register', label: 'Register Free' }
              ].map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  style={{
                    fontSize: '0.9rem', fontWeight: '600', color: '#94a3b8',
                    display: 'flex', alignItems: 'center', gap: '0.35rem',
                    transition: 'all 0.15s'
                  }}
                >
                  <span style={{ width: '4px', height: '4px', borderRadius: '50%', background: '#475569', flexShrink: 0 }} />
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Column 3: Popular Services */}
          <div>
            <h4 style={{ fontSize: '0.82rem', textTransform: 'uppercase', letterSpacing: '0.1em', color: '#475569', fontWeight: '800', marginBottom: '1.25rem' }}>
              Popular Categories
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.7rem' }}>
              {[
                { to: '/services?category=electrical', label: 'Electrical & Wiring' },
                { to: '/services?category=plumbing', label: 'Plumbing & Pipes' },
                { to: '/services?category=cleaning', label: 'Deep Home Cleaning' },
                { to: '/services?category=automotive', label: 'Car & Bike Mechanic' },
                { to: '/services?category=appliance-repair', label: 'AC & Appliance Repair' },
                { to: '/services?category=carpentry', label: 'Carpentry & Furniture' }
              ].map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  style={{
                    fontSize: '0.9rem', fontWeight: '600', color: '#94a3b8',
                    display: 'flex', alignItems: 'center', gap: '0.35rem',
                    transition: 'all 0.15s'
                  }}
                >
                  <span style={{ width: '4px', height: '4px', borderRadius: '50%', background: '#475569', flexShrink: 0 }} />
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Column 4: Contact & Guarantees */}
          <div>
            <h4 style={{ fontSize: '0.82rem', textTransform: 'uppercase', letterSpacing: '0.1em', color: '#475569', fontWeight: '800', marginBottom: '1.25rem' }}>
              Contact & Support
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.6rem' }}>
                <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'rgba(99, 102, 241, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: '2px' }}>
                  <MapPin size={15} color="#818cf8" />
                </div>
                <div>
                  <span style={{ fontSize: '0.88rem', color: '#cbd5e1', fontWeight: '600', display: 'block' }}>Headquartered in Jaipur</span>
                  <span style={{ fontSize: '0.78rem', color: '#64748b' }}>Serving all major cities across India</span>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'rgba(16, 185, 129, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <Phone size={15} color="#34d399" />
                </div>
                <div>
                  <a href="tel:18002004567" style={{ fontSize: '0.95rem', color: '#34d399', fontWeight: '800', display: 'block' }}>
                    1800-200-4567
                  </a>
                  <span style={{ fontSize: '0.72rem', color: '#64748b' }}>Toll-Free, 24/7 Support</span>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'rgba(56, 189, 248, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <Mail size={15} color="#38bdf8" />
                </div>
                <a href="mailto:support@servicefinder.in" style={{ fontSize: '0.88rem', color: '#94a3b8', fontWeight: '600' }}>
                  support@servicefinder.in
                </a>
              </div>
            </div>

            {/* Emergency CTA */}
            <div style={{
              marginTop: '1.5rem',
              padding: '0.85rem 1rem',
              background: 'rgba(225, 29, 72, 0.08)',
              border: '1px solid rgba(225, 29, 72, 0.2)',
              borderRadius: '10px',
              display: 'flex',
              alignItems: 'center',
              gap: '0.6rem'
            }}>
              <Zap size={16} color="#fb7185" />
              <span style={{ fontSize: '0.82rem', fontWeight: '700', color: '#fb7185' }}>
                24/7 Emergency? Call us immediately!
              </span>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div style={{
          borderTop: '1px solid rgba(148, 163, 184, 0.1)',
          paddingTop: '1.75rem',
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '1rem'
        }}>
          <p style={{ fontSize: '0.82rem', color: '#475569', margin: 0 }}>
            © {new Date().getFullYear()} LocalServe. Full MERN Stack (MongoDB, Express, React, Node.js). All rights reserved.
          </p>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', fontSize: '0.82rem', color: '#475569' }}>
            <span style={{ cursor: 'pointer' }}>Privacy Policy</span>
            <span style={{ cursor: 'pointer' }}>Terms of Service</span>
            <span style={{ cursor: 'pointer' }}>Refund Policy</span>
          </div>
        </div>

      </div>

      <style>{`
        @keyframes gradientShift {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
      `}</style>
    </footer>
  );
}
