import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { Mail, Lock, ArrowRight, Sparkles, Wrench, Zap, Droplets, GraduationCap, Eye, EyeOff, ShieldCheck, Star } from 'lucide-react';

const DEMO_ACCOUNTS = [
  {
    label: 'Demo Customer',
    sublabel: 'Aman Sharma',
    email: 'customer@example.com',
    password: 'password123',
    icon: '👤',
    color: '#4f46e5',
    bg: '#eef2ff'
  },
  {
    label: 'Electrician Pro',
    sublabel: 'Ramesh Kumar',
    email: 'ramesh.electric@example.com',
    password: 'password123',
    icon: '⚡',
    color: '#d97706',
    bg: '#fef3c7'
  },
  {
    label: 'Plumber Expert',
    sublabel: 'Rajesh Sharma',
    email: 'rajesh.plumber@example.com',
    password: 'password123',
    icon: '🔧',
    color: '#0284c7',
    bg: '#e0f2fe'
  },
  {
    label: 'Platform Admin',
    sublabel: 'System Admin',
    email: 'admin@example.com',
    password: 'password123',
    icon: '👑',
    color: '#dc2626',
    bg: '#fef2f2'
  }
];

export default function Login() {
  const { login } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [serverWaking, setServerWaking] = useState(false);

  const handleLogin = async (e, demoEmail, demoPassword) => {
    if (e) e.preventDefault();
    const loginEmail = demoEmail || email;
    const loginPass = demoPassword || password;

    if (!loginEmail || !loginPass) {
      showToast('Please enter email and password.', 'error');
      return;
    }

    setLoading(true);
    setServerWaking(false);
    // Show server wake-up notice after 4 seconds (Render free tier cold start)
    const wakeTimer = setTimeout(() => setServerWaking(true), 4000);
    try {
      const res = await login(loginEmail, loginPass);
      clearTimeout(wakeTimer);
      setServerWaking(false);
      if (res.success) {
        showToast(`Welcome back, ${res.user.name}!`, 'success');
        if (res.user.role === 'admin') {
          navigate('/admin/dashboard');
        } else if (res.user.role === 'provider') {
          navigate('/provider/dashboard');
        } else {
          navigate('/customer/dashboard');
        }
      }
    } catch (error) {
      clearTimeout(wakeTimer);
      setServerWaking(false);
      showToast(error.message || 'Login failed. Please check your credentials.', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '90vh',
      display: 'flex',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Left Decorative Panel (Desktop) */}
      <div style={{
        flex: '1.1',
        background: 'linear-gradient(135deg, #0b0f19 0%, #1e1b4b 45%, #312e81 100%)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '3rem',
        position: 'relative',
        overflow: 'hidden'
      }} className="login-left-panel">
        {/* Ambient orbs */}
        <div style={{ position: 'absolute', top: '-10%', left: '10%', width: '450px', height: '450px', background: 'radial-gradient(circle, rgba(99, 102, 241, 0.3) 0%, rgba(0,0,0,0) 70%)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', bottom: '-10%', right: '10%', width: '400px', height: '400px', background: 'radial-gradient(circle, rgba(13, 148, 136, 0.25) 0%, rgba(0,0,0,0) 70%)', pointerEvents: 'none' }} />

        <div style={{ position: 'relative', zIndex: 10, textAlign: 'center', maxWidth: '450px' }}>
          <div style={{
            background: 'linear-gradient(135deg, #4f46e5 0%, #06b6d4 100%)',
            width: '72px', height: '72px', borderRadius: '22px',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            margin: '0 auto 2rem',
            boxShadow: '0 12px 30px rgba(79, 70, 229, 0.5)',
            transform: 'rotate(-3deg)'
          }}>
            <Wrench size={36} color="#ffffff" />
          </div>

          <h2 style={{ fontSize: '2.4rem', fontWeight: '800', color: '#ffffff', lineHeight: '1.15', letterSpacing: '-0.03em', marginBottom: '1rem' }}>
            Your Trusted Local Service Network
          </h2>
          <p style={{ fontSize: '1.05rem', color: '#cbd5e1', lineHeight: '1.6', marginBottom: '2.5rem' }}>
            Connect with certified electricians, plumbers, mechanics, tutors, and cleaning experts across India with transparent pricing in ₹ INR.
          </p>

          {/* Trust indicators */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', alignItems: 'center' }}>
            {[
              { icon: ShieldCheck, text: '100% Background-Verified Professionals', color: '#34d399' },
              { icon: Star, text: '4.9 ⭐ Average Rating (12K+ Reviews)', color: '#fbbf24' },
              { icon: Zap, text: '24/7 Emergency SOS Dispatch Under 30 Mins', color: '#fb7185' }
            ].map((item, i) => {
              const Icon = item.icon;
              return (
                <div key={i} style={{
                  display: 'flex', alignItems: 'center', gap: '0.65rem',
                  background: 'rgba(255, 255, 255, 0.06)',
                  backdropFilter: 'blur(8px)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  padding: '0.55rem 1.1rem',
                  borderRadius: 'var(--radius-full)',
                  width: 'fit-content'
                }}>
                  <Icon size={16} color={item.color} />
                  <span style={{ fontSize: '0.86rem', fontWeight: '700', color: '#e2e8f0' }}>{item.text}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Right Login Form Panel */}
      <div style={{
        flex: '1',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '3rem 2.5rem',
        background: 'var(--bg-main)'
      }}>
        <div style={{ width: '100%', maxWidth: '440px' }}>
          
          {/* Header */}
          <div style={{ marginBottom: '2rem' }}>
            <h1 style={{ fontSize: '2rem', fontWeight: '800', color: 'var(--text-main)', letterSpacing: '-0.02em', marginBottom: '0.35rem' }}>
              Welcome Back
            </h1>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
              Sign in to your account to manage bookings and appointments.
            </p>
          </div>

          {/* 1-Click Demo Login Grid */}
          <div style={{ marginBottom: '2rem' }}>
            <p style={{ fontSize: '0.82rem', fontWeight: '700', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '0.75rem' }}>
              ⚡ Instant Demo Login
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.65rem' }}>
              {DEMO_ACCOUNTS.map((acc) => (
                <button
                  key={acc.email}
                  onClick={() => handleLogin(null, acc.email, acc.password)}
                  disabled={loading}
                  style={{
                    padding: '0.75rem 0.85rem',
                    borderRadius: 'var(--radius-md)',
                    border: `1.5px solid ${acc.color}22`,
                    background: acc.bg,
                    cursor: 'pointer',
                    textAlign: 'left',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.65rem',
                    transition: 'all 0.2s',
                    boxShadow: 'var(--shadow-sm)'
                  }}
                >
                  <span style={{ fontSize: '1.4rem', lineHeight: '1' }}>{acc.icon}</span>
                  <div>
                    <span style={{ display: 'block', fontSize: '0.88rem', fontWeight: '800', color: acc.color }}>{acc.label}</span>
                    <span style={{ display: 'block', fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: '600' }}>{acc.sublabel}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Divider */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', margin: '1.75rem 0' }}>
            <div style={{ flex: 1, height: '1px', background: 'var(--border-subtle)' }} />
            <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)', fontWeight: '700' }}>or sign in manually</span>
            <div style={{ flex: 1, height: '1px', background: 'var(--border-subtle)' }} />
          </div>

          {/* Login Form */}
          <form onSubmit={handleLogin}>
            <div className="form-group">
              <label className="form-label">Email Address</label>
              <div style={{ position: 'relative' }}>
                <Mail size={18} color="var(--text-muted)" style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)' }} />
                <input
                  type="email"
                  className="form-control"
                  placeholder="your.email@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  style={{ paddingLeft: '2.8rem' }}
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Password</label>
              <div style={{ position: 'relative' }}>
                <Lock size={18} color="var(--text-muted)" style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)' }} />
                <input
                  type={showPassword ? 'text' : 'password'}
                  className="form-control"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  style={{ paddingLeft: '2.8rem', paddingRight: '2.8rem' }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{ position: 'absolute', right: '0.75rem', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', padding: '0.25rem' }}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="btn btn-primary btn-lg"
              disabled={loading}
              style={{ width: '100%', fontWeight: '800', borderRadius: 'var(--radius-md)', marginTop: '0.5rem' }}
            >
              {loading ? (
                <span>Signing In...</span>
              ) : (
                <>
                  <span>Sign In to Dashboard</span>
                  <ArrowRight size={18} />
                </>
              )}
            </button>

            {/* Server wake-up notice for Render free tier */}
            {serverWaking && (
              <div style={{
                marginTop: '0.85rem',
                padding: '0.75rem 1rem',
                background: '#fef3c7',
                border: '1px solid #fbbf24',
                borderRadius: 'var(--radius-md)',
                fontSize: '0.83rem',
                color: '#92400e',
                display: 'flex',
                alignItems: 'flex-start',
                gap: '0.5rem'
              }}>
                <span>⏳</span>
                <span><strong>Server is waking up</strong> — The free-tier backend may take up to 30 seconds to start. Please wait, your login will complete automatically.</span>
              </div>
            )}
          </form>

          {/* Register Link */}
          <p style={{ textAlign: 'center', marginTop: '1.75rem', fontSize: '0.92rem', color: 'var(--text-muted)' }}>
            Don't have an account?{' '}
            <Link to="/register" style={{ fontWeight: '800', color: 'var(--primary)' }}>
              Create Free Account
            </Link>
          </p>
        </div>
      </div>

      <style>{`
        @media (max-width: 860px) {
          .login-left-panel { display: none !important; }
        }
      `}</style>
    </div>
  );
}
