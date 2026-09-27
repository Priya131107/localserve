import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { User, Mail, Lock, Phone, MapPin, Briefcase, ArrowRight, Eye, EyeOff, Wrench, Shield, Sparkles } from 'lucide-react';

export default function Register() {
  const { register } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const [role, setRole] = useState('customer');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [city, setCity] = useState('Jaipur');
  const [showPassword, setShowPassword] = useState(false);

  // Provider-specific fields
  const [businessName, setBusinessName] = useState('');
  const [categoryId, setCategoryId] = useState('1');
  const [area, setArea] = useState('');
  const [experienceYears, setExperienceYears] = useState('3');

  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      showToast('Passwords do not match.', 'error');
      return;
    }

    if (password.length < 6) {
      showToast('Password must be at least 6 characters.', 'error');
      return;
    }

    setLoading(true);
    try {
      const payload = {
        name: name.trim(),
        email: email.trim(),
        password,
        phone: phone.trim(),
        city: city.trim(),
        role
      };

      if (role === 'provider') {
        payload.business_name = businessName.trim();
        payload.category_id = Number(categoryId);
        payload.area = area.trim();
        payload.experience_years = Number(experienceYears);
      }

      const res = await register(payload);
      if (res.success) {
        showToast('Account created successfully!', 'success');
        navigate(role === 'provider' ? '/provider/dashboard' : '/customer/dashboard');
      }
    } catch (error) {
      showToast(error.message || 'Registration failed', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '90vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '3rem 1.5rem', background: 'var(--bg-main)', position: 'relative' }}>
      {/* Subtle orbs */}
      <div style={{ position: 'absolute', top: '5%', right: '10%', width: '400px', height: '400px', background: 'radial-gradient(circle, rgba(79, 70, 229, 0.06) 0%, rgba(0,0,0,0) 70%)', pointerEvents: 'none' }} />

      <div style={{ width: '100%', maxWidth: '640px' }}>

        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <div style={{
            background: 'linear-gradient(135deg, #4f46e5 0%, #06b6d4 100%)',
            width: '56px', height: '56px', borderRadius: '18px',
            display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 8px 20px rgba(79, 70, 229, 0.4)',
            marginBottom: '1.25rem'
          }}>
            <Wrench size={28} color="#ffffff" />
          </div>
          <h1 style={{ fontSize: '2.2rem', fontWeight: '800', color: 'var(--text-main)', letterSpacing: '-0.02em', marginBottom: '0.35rem' }}>
            Create Your Free Account
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.98rem' }}>
            Join thousands of users finding verified services across India.
          </p>
        </div>

        {/* Role Selector Tabs */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '0.75rem',
          marginBottom: '2rem'
        }}>
          <button
            type="button"
            onClick={() => setRole('customer')}
            style={{
              padding: '1.1rem',
              borderRadius: 'var(--radius-lg)',
              border: role === 'customer' ? '2px solid var(--primary)' : '1.5px solid var(--border-subtle)',
              background: role === 'customer' ? 'var(--primary-light)' : '#ffffff',
              cursor: 'pointer',
              textAlign: 'center',
              boxShadow: role === 'customer' ? '0 0 16px var(--primary-glow)' : 'var(--shadow-sm)',
              transition: 'all 0.2s'
            }}
          >
            <User size={24} color={role === 'customer' ? 'var(--primary)' : 'var(--text-muted)'} style={{ marginBottom: '0.4rem' }} />
            <span style={{ display: 'block', fontWeight: '800', fontSize: '1rem', color: role === 'customer' ? 'var(--primary)' : 'var(--text-main)' }}>
              I Need Services
            </span>
            <span style={{ display: 'block', fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '0.15rem' }}>
              Book plumbers, electricians, cleaners
            </span>
          </button>

          <button
            type="button"
            onClick={() => setRole('provider')}
            style={{
              padding: '1.1rem',
              borderRadius: 'var(--radius-lg)',
              border: role === 'provider' ? '2px solid var(--secondary)' : '1.5px solid var(--border-subtle)',
              background: role === 'provider' ? 'var(--secondary-light)' : '#ffffff',
              cursor: 'pointer',
              textAlign: 'center',
              boxShadow: role === 'provider' ? '0 0 16px var(--secondary-glow)' : 'var(--shadow-sm)',
              transition: 'all 0.2s'
            }}
          >
            <Briefcase size={24} color={role === 'provider' ? 'var(--secondary)' : 'var(--text-muted)'} style={{ marginBottom: '0.4rem' }} />
            <span style={{ display: 'block', fontWeight: '800', fontSize: '1rem', color: role === 'provider' ? 'var(--secondary)' : 'var(--text-main)' }}>
              I Offer Services
            </span>
            <span style={{ display: 'block', fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '0.15rem' }}>
              List your skills & get bookings
            </span>
          </button>
        </div>

        {/* Registration Form */}
        <div className="glass-card" style={{ padding: '2.25rem', background: '#ffffff', borderRadius: 'var(--radius-xl)', boxShadow: 'var(--shadow-xl)' }}>
          <form onSubmit={handleSubmit}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div className="form-group">
                <label className="form-label">Full Name</label>
                <input type="text" className="form-control" placeholder="e.g. Amit Patel" value={name} onChange={(e) => setName(e.target.value)} required />
              </div>
              <div className="form-group">
                <label className="form-label">Phone Number</label>
                <input type="tel" className="form-control" placeholder="+91 98XXX XXXXX" value={phone} onChange={(e) => setPhone(e.target.value)} />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Email Address</label>
              <input type="email" className="form-control" placeholder="your.email@example.com" value={email} onChange={(e) => setEmail(e.target.value)} required />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div className="form-group">
                <label className="form-label">Password</label>
                <div style={{ position: 'relative' }}>
                  <input type={showPassword ? 'text' : 'password'} className="form-control" placeholder="Min 6 characters" value={password} onChange={(e) => setPassword(e.target.value)} required style={{ paddingRight: '2.5rem' }} />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} style={{ position: 'absolute', right: '0.75rem', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}>
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Confirm Password</label>
                <input type="password" className="form-control" placeholder="Re-enter password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">City</label>
              <input type="text" className="form-control" placeholder="e.g. Jaipur" value={city} onChange={(e) => setCity(e.target.value)} />
            </div>

            {/* Provider Extra Fields */}
            {role === 'provider' && (
              <div style={{ borderTop: '1px solid var(--border-subtle)', marginTop: '1rem', paddingTop: '1.25rem' }}>
                <p style={{ fontSize: '0.82rem', fontWeight: '800', color: 'var(--secondary)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '1rem' }}>
                  🔧 Business Information
                </p>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div className="form-group">
                    <label className="form-label">Business / Workshop Name</label>
                    <input type="text" className="form-control" placeholder="e.g. Sharma Plumbing Works" value={businessName} onChange={(e) => setBusinessName(e.target.value)} required />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Operating Area / Locality</label>
                    <input type="text" className="form-control" placeholder="e.g. Malviya Nagar" value={area} onChange={(e) => setArea(e.target.value)} required />
                  </div>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div className="form-group">
                    <label className="form-label">Service Category</label>
                    <select className="form-select" value={categoryId} onChange={(e) => setCategoryId(e.target.value)}>
                      <option value="1">Electrical & Wiring</option>
                      <option value="2">Plumbing & Pipes</option>
                      <option value="3">Cleaning & Sanitization</option>
                      <option value="4">Automotive / Mechanic</option>
                      <option value="5">AC & Appliance Repair</option>
                      <option value="6">Carpentry & Furniture</option>
                      <option value="7">Salon & Beauty</option>
                      <option value="8">Education / Tuition</option>
                      <option value="9">Computer & IT Repair</option>
                      <option value="10">Painting & Decor</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Years of Experience</label>
                    <input type="number" className="form-control" min="0" max="40" value={experienceYears} onChange={(e) => setExperienceYears(e.target.value)} />
                  </div>
                </div>
              </div>
            )}

            <button
              type="submit"
              className="btn btn-primary btn-lg"
              disabled={loading}
              style={{ width: '100%', fontWeight: '800', borderRadius: 'var(--radius-md)', marginTop: '0.75rem' }}
            >
              {loading ? 'Creating Account...' : (
                <>
                  <Sparkles size={18} />
                  <span>Create {role === 'provider' ? 'Provider' : 'Customer'} Account</span>
                  <ArrowRight size={18} />
                </>
              )}
            </button>
          </form>
        </div>

        <p style={{ textAlign: 'center', marginTop: '1.75rem', fontSize: '0.92rem', color: 'var(--text-muted)' }}>
          Already have an account?{' '}
          <Link to="/login" style={{ fontWeight: '800', color: 'var(--primary)' }}>
            Sign In Here
          </Link>
        </p>
      </div>
    </div>
  );
}
