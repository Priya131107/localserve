import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { providerAPI } from '../services/api';
import { User, Mail, Phone, MapPin, Building, Clock, Save, Shield, IndianRupee } from 'lucide-react';

export default function Profile() {
  const { user, isProvider, updateProfile, refreshUser } = useAuth();
  const { showToast } = useToast();

  const [name, setName] = useState(user?.name || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [address, setAddress] = useState(user?.address || '');
  const [city, setCity] = useState(user?.city || 'Jaipur');
  const [avatar, setAvatar] = useState(user?.avatar || '');

  // Provider specific
  const [businessName, setBusinessName] = useState(user?.provider?.business_name || '');
  const [tagline, setTagline] = useState(user?.provider?.tagline || '');
  const [bio, setBio] = useState(user?.provider?.bio || '');
  const [hourlyRate, setHourlyRate] = useState(user?.provider?.hourly_rate || '350');
  const [experienceYears, setExperienceYears] = useState(user?.provider?.experience_years || '3');
  const [workingHours, setWorkingHours] = useState(user?.provider?.working_hours || '8:00 AM - 8:00 PM');
  const [area, setArea] = useState(user?.provider?.area || 'Malviya Nagar');

  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (user) {
      setName(user.name || '');
      setPhone(user.phone || '');
      setAddress(user.address || '');
      setCity(user.city || 'Jaipur');
      setAvatar(user.avatar || '');

      if (user.provider) {
        setBusinessName(user.provider.business_name || '');
        setTagline(user.provider.tagline || '');
        setBio(user.provider.bio || '');
        setHourlyRate(user.provider.hourly_rate || '350');
        setExperienceYears(user.provider.experience_years || '3');
        setWorkingHours(user.provider.working_hours || '8:00 AM - 8:00 PM');
        setArea(user.provider.area || 'Malviya Nagar');
      }
    }
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      // 1. Update basic user profile
      await updateProfile({
        name: name.trim(),
        phone: phone.trim(),
        address: address.trim(),
        city: city.trim(),
        avatar: avatar.trim()
      });

      // 2. If provider, update provider business record
      if (isProvider) {
        await providerAPI.updateProfile({
          business_name: businessName.trim(),
          tagline: tagline.trim(),
          bio: bio.trim(),
          hourly_rate: parseFloat(hourlyRate),
          experience_years: parseInt(experienceYears, 10),
          working_hours: workingHours.trim(),
          area: area.trim(),
          city: city.trim()
        });
      }

      await refreshUser();
      showToast('Profile information updated successfully!', 'success');
    } catch (error) {
      showToast(error.message || 'Failed to save profile', 'error');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div style={{ padding: '2.5rem 0 5rem', background: 'var(--bg-main)', minHeight: '85vh' }}>
      <div className="container" style={{ maxWidth: '850px' }}>
        
        {/* Header */}
        <div style={{ marginBottom: '2rem' }}>
          <h1 style={{ fontSize: '2rem', fontWeight: '800', color: 'var(--text-main)', margin: 0 }}>
            Account Settings & Profile
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
            Manage your personal contact details, location, and service preferences.
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          
          {/* Personal Info Box */}
          <div className="glass-card" style={{ padding: '2rem', background: '#ffffff', marginBottom: '2rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', marginBottom: '1.75rem', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '1.25rem' }}>
              <img 
                src={avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${name}`} 
                alt={name}
                style={{ width: '70px', height: '70px', borderRadius: '50%', objectFit: 'cover', border: '2px solid var(--primary)' }}
              />
              <div>
                <h3 style={{ fontSize: '1.2rem', fontWeight: '800', margin: 0, color: 'var(--text-main)' }}>
                  {name}
                </h3>
                <span className={`badge ${isProvider ? 'badge-primary' : 'badge-gray'}`} style={{ marginTop: '0.25rem' }}>
                  {user?.role} Account
                </span>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div className="form-group">
                <label className="form-label">Full Name</label>
                <input
                  type="text"
                  className="form-control"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Email Address (Read-only)</label>
                <input
                  type="email"
                  className="form-control"
                  value={user?.email || ''}
                  disabled
                  style={{ background: 'var(--bg-subtle)', cursor: 'not-allowed' }}
                />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div className="form-group">
                <label className="form-label">Contact Phone</label>
                <input
                  type="tel"
                  className="form-control"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label className="form-label">City</label>
                <input
                  type="text"
                  className="form-control"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Complete Address / Street</label>
              <input
                type="text"
                className="form-control"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Avatar Image URL (Optional)</label>
              <input
                type="url"
                className="form-control"
                placeholder="https://..."
                value={avatar}
                onChange={(e) => setAvatar(e.target.value)}
              />
            </div>
          </div>

          {/* Provider Specific Section */}
          {isProvider && (
            <div className="glass-card" style={{ padding: '2rem', background: '#ffffff', marginBottom: '2rem' }}>
              <h3 style={{ fontSize: '1.2rem', fontWeight: '800', color: 'var(--text-main)', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <Building size={20} color="var(--primary)" /> Public Business Profile
              </h3>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label className="form-label">Business / Shop Name</label>
                  <input
                    type="text"
                    className="form-control"
                    value={businessName}
                    onChange={(e) => setBusinessName(e.target.value)}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Operating Area / Locality</label>
                  <input
                    type="text"
                    className="form-control"
                    value={area}
                    onChange={(e) => setArea(e.target.value)}
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Tagline (Short Summary)</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="e.g. Certified 24/7 Electrical Care & Wiring"
                  value={tagline}
                  onChange={(e) => setTagline(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Bio & Detailed Experience</label>
                <textarea
                  className="form-control"
                  rows={3}
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem' }}>
                <div className="form-group">
                  <label className="form-label">Base Hourly Rate (₹)</label>
                  <input
                    type="number"
                    className="form-control"
                    value={hourlyRate}
                    onChange={(e) => setHourlyRate(e.target.value)}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Experience (Years)</label>
                  <input
                    type="number"
                    className="form-control"
                    value={experienceYears}
                    onChange={(e) => setExperienceYears(e.target.value)}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Working Hours</label>
                  <input
                    type="text"
                    className="form-control"
                    value={workingHours}
                    onChange={(e) => setWorkingHours(e.target.value)}
                  />
                </div>
              </div>
            </div>
          )}

          <button
            type="submit"
            className="btn btn-primary btn-lg"
            style={{ width: '100%', fontWeight: '700' }}
            disabled={saving}
          >
            <Save size={18} />
            <span>{saving ? 'Saving Updates...' : 'Save Profile Changes'}</span>
          </button>
        </form>

      </div>
    </div>
  );
}
