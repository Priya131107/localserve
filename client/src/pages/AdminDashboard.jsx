import React, { useState, useEffect } from 'react';
import { adminAPI } from '../services/api';
import { useToast } from '../context/ToastContext';
import { 
  Users, 
  Briefcase, 
  Calendar, 
  DollarSign, 
  CheckCircle, 
  XCircle, 
  AlertTriangle, 
  ShieldCheck, 
  Trash2, 
  RefreshCw,
  Search,
  Star
} from 'lucide-react';

export default function AdminDashboard() {
  const { showToast } = useToast();
  const [activeTab, setActiveTab] = useState('overview');
  const [stats, setStats] = useState(null);
  const [providers, setProviders] = useState([]);
  const [users, setUsers] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchAdminData = async () => {
    setLoading(true);
    try {
      const [statsRes, provRes, usersRes, bookRes, revRes] = await Promise.all([
        adminAPI.getStats(),
        adminAPI.getProviders(),
        adminAPI.getUsers(),
        adminAPI.getBookings(),
        adminAPI.getReviews()
      ]);

      if (statsRes.success) setStats(statsRes.stats);
      if (provRes.success) setProviders(provRes.providers);
      if (usersRes.success) setUsers(usersRes.users);
      if (bookRes.success) setBookings(bookRes.bookings);
      if (revRes.success) setReviews(revRes.reviews);
    } catch (error) {
      showToast(error.message || 'Failed to fetch admin data', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminData();
  }, []);

  const handleVerifyProvider = async (providerId, newStatus) => {
    try {
      const res = await adminAPI.verifyProvider(providerId, newStatus);
      if (res.success) {
        showToast(`Provider status updated to ${newStatus}!`, 'success');
        setProviders(prev => prev.map(p => (p.id === providerId || p._id === providerId) ? { ...p, verificationStatus: newStatus, verified: newStatus === 'verified' ? 1 : 0 } : p));
      }
    } catch (err) {
      showToast(err.message || 'Failed to update provider status', 'error');
    }
  };

  const handleDeleteReview = async (reviewId) => {
    if (!window.confirm('Are you sure you want to remove this review for platform moderation?')) return;
    try {
      const res = await adminAPI.deleteReview(reviewId);
      if (res.success) {
        showToast('Review removed successfully!', 'success');
        setReviews(prev => prev.filter(r => r.id !== reviewId && r._id !== reviewId));
      }
    } catch (err) {
      showToast(err.message || 'Failed to remove review', 'error');
    }
  };

  if (loading) {
    return (
      <div className="container" style={{ padding: '4rem 1rem', textAlign: 'center' }}>
        <div className="spinner" style={{ margin: '0 auto 1rem' }}></div>
        <p style={{ color: 'var(--text-muted)', fontWeight: '600' }}>Loading Admin Console...</p>
      </div>
    );
  }

  return (
    <div style={{ background: 'var(--bg-subtle)', minHeight: 'calc(100vh - 74px)', padding: '2.5rem 0 4rem' }}>
      <div className="container">
        
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.3rem' }}>
              <span className="badge badge-primary" style={{ fontSize: '0.75rem', fontWeight: '800' }}>
                ADMIN CONSOLE
              </span>
              <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>LocalServe Platform Administration</span>
            </div>
            <h1 style={{ fontSize: '2.1rem', fontWeight: '800', color: 'var(--text-main)', margin: 0, letterSpacing: '-0.02em' }}>
              Platform Overview & Management
            </h1>
          </div>

          <button 
            onClick={fetchAdminData}
            className="btn btn-secondary btn-sm"
            style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', borderRadius: 'var(--radius-full)', fontWeight: '700' }}
          >
            <RefreshCw size={15} /> Refresh Data
          </button>
        </div>

        {/* KPI Summary Cards */}
        {stats && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.25rem', marginBottom: '2.5rem' }}>
            
            <div className="card" style={{ padding: '1.4rem', borderLeft: '4px solid #4f46e5' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.6rem' }}>
                <span style={{ fontSize: '0.85rem', fontWeight: '700', color: 'var(--text-muted)' }}>Total Users</span>
                <Users size={20} color="#4f46e5" />
              </div>
              <h3 style={{ fontSize: '1.8rem', fontWeight: '800', margin: 0, color: 'var(--text-main)' }}>{stats.totalUsers}</h3>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', margin: '0.2rem 0 0' }}>{stats.totalCustomers} Customers, {stats.totalProviders} Pros</p>
            </div>

            <div className="card" style={{ padding: '1.4rem', borderLeft: '4px solid #10b981' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.6rem' }}>
                <span style={{ fontSize: '0.85rem', fontWeight: '700', color: 'var(--text-muted)' }}>Verified Providers</span>
                <ShieldCheck size={20} color="#10b981" />
              </div>
              <h3 style={{ fontSize: '1.8rem', fontWeight: '800', margin: 0, color: 'var(--text-main)' }}>{stats.verifiedProviders}</h3>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', margin: '0.2rem 0 0' }}>{stats.pendingProviders} pending verification</p>
            </div>

            <div className="card" style={{ padding: '1.4rem', borderLeft: '4px solid #06b6d4' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.6rem' }}>
                <span style={{ fontSize: '0.85rem', fontWeight: '700', color: 'var(--text-muted)' }}>Total Bookings</span>
                <Calendar size={20} color="#06b6d4" />
              </div>
              <h3 style={{ fontSize: '1.8rem', fontWeight: '800', margin: 0, color: 'var(--text-main)' }}>{stats.totalBookings}</h3>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', margin: '0.2rem 0 0' }}>{stats.completedBookings} Completed Successfully</p>
            </div>

            <div className="card" style={{ padding: '1.4rem', borderLeft: '4px solid #f59e0b' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.6rem' }}>
                <span style={{ fontSize: '0.85rem', fontWeight: '700', color: 'var(--text-muted)' }}>Platform Volume</span>
                <DollarSign size={20} color="#f59e0b" />
              </div>
              <h3 style={{ fontSize: '1.8rem', fontWeight: '800', margin: 0, color: 'var(--text-main)' }}>₹{stats.totalRevenue.toLocaleString()}</h3>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', margin: '0.2rem 0 0' }}>{stats.totalReviews} Customer Reviews</p>
            </div>

          </div>
        )}

        {/* Tab Navigation */}
        <div style={{ display: 'flex', gap: '0.5rem', borderBottom: '2px solid var(--border-subtle)', marginBottom: '1.8rem', overflowX: 'auto', paddingBottom: '0.25rem' }}>
          {[
            { id: 'overview', label: 'Providers Verification' },
            { id: 'bookings', label: `All Bookings (${bookings.length})` },
            { id: 'users', label: `User Directory (${users.length})` },
            { id: 'reviews', label: `Review Moderation (${reviews.length})` }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                padding: '0.65rem 1.25rem',
                border: 'none',
                background: 'none',
                fontWeight: '700',
                fontSize: '0.92rem',
                cursor: 'pointer',
                color: activeTab === tab.id ? 'var(--primary)' : 'var(--text-muted)',
                borderBottom: activeTab === tab.id ? '3px solid var(--primary)' : '3px solid transparent',
                transition: 'all 0.2s',
                whiteSpace: 'nowrap'
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* TAB 1: Provider Verification */}
        {activeTab === 'overview' && (
          <div className="card" style={{ overflow: 'hidden' }}>
            <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid var(--border-subtle)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: '800', margin: 0, color: 'var(--text-main)' }}>
                Registered Service Providers & Verification Status
              </h3>
            </div>

            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
                <thead>
                  <tr style={{ background: 'var(--bg-surface)', borderBottom: '1px solid var(--border-subtle)', color: 'var(--text-muted)' }}>
                    <th style={{ padding: '0.9rem 1.25rem', fontWeight: '700' }}>Business & Owner</th>
                    <th style={{ padding: '0.9rem 1.25rem', fontWeight: '700' }}>Category</th>
                    <th style={{ padding: '0.9rem 1.25rem', fontWeight: '700' }}>Location</th>
                    <th style={{ padding: '0.9rem 1.25rem', fontWeight: '700' }}>Rate / Exp</th>
                    <th style={{ padding: '0.9rem 1.25rem', fontWeight: '700' }}>Status</th>
                    <th style={{ padding: '0.9rem 1.25rem', fontWeight: '700' }}>Moderate</th>
                  </tr>
                </thead>
                <tbody>
                  {providers.map(p => (
                    <tr key={p.id || p._id} style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                      <td style={{ padding: '0.9rem 1.25rem' }}>
                        <div style={{ fontWeight: '800', color: 'var(--text-main)' }}>{p.business_name}</div>
                        <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{p.user_name || p.name} • {p.phone}</div>
                      </td>
                      <td style={{ padding: '0.9rem 1.25rem', fontWeight: '600' }}>{p.category_name || 'General'}</td>
                      <td style={{ padding: '0.9rem 1.25rem', color: 'var(--text-muted)' }}>{p.area}, {p.city}</td>
                      <td style={{ padding: '0.9rem 1.25rem' }}>
                        <div style={{ fontWeight: '700' }}>₹{p.hourly_rate}/hr</div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{p.experience_years} yrs exp</div>
                      </td>
                      <td style={{ padding: '0.9rem 1.25rem' }}>
                        <span className={`badge ${p.verified || p.verificationStatus === 'verified' ? 'badge-success' : 'badge-warning'}`}>
                          {p.verified || p.verificationStatus === 'verified' ? 'Verified' : 'Pending'}
                        </span>
                      </td>
                      <td style={{ padding: '0.9rem 1.25rem' }}>
                        <div style={{ display: 'flex', gap: '0.4rem' }}>
                          <button 
                            onClick={() => handleVerifyProvider(p.id || p._id, 'verified')}
                            className="btn btn-primary btn-sm"
                            style={{ padding: '0.25rem 0.6rem', fontSize: '0.78rem' }}
                            title="Verify Provider"
                          >
                            Approve
                          </button>
                          <button 
                            onClick={() => handleVerifyProvider(p.id || p._id, 'rejected')}
                            className="btn btn-secondary btn-sm"
                            style={{ padding: '0.25rem 0.6rem', fontSize: '0.78rem', color: 'var(--emergency)' }}
                            title="Reject/Suspend Provider"
                          >
                            Suspend
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 2: All Bookings */}
        {activeTab === 'bookings' && (
          <div className="card" style={{ overflow: 'hidden' }}>
            <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid var(--border-subtle)' }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: '800', margin: 0, color: 'var(--text-main)' }}>
                Platform Wide Service Bookings
              </h3>
            </div>

            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
                <thead>
                  <tr style={{ background: 'var(--bg-surface)', borderBottom: '1px solid var(--border-subtle)', color: 'var(--text-muted)' }}>
                    <th style={{ padding: '0.9rem 1.25rem', fontWeight: '700' }}>ID / Service</th>
                    <th style={{ padding: '0.9rem 1.25rem', fontWeight: '700' }}>Customer</th>
                    <th style={{ padding: '0.9rem 1.25rem', fontWeight: '700' }}>Provider</th>
                    <th style={{ padding: '0.9rem 1.25rem', fontWeight: '700' }}>Date & Slot</th>
                    <th style={{ padding: '0.9rem 1.25rem', fontWeight: '700' }}>Price</th>
                    <th style={{ padding: '0.9rem 1.25rem', fontWeight: '700' }}>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {bookings.map(b => (
                    <tr key={b.id || b._id} style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                      <td style={{ padding: '0.9rem 1.25rem' }}>
                        <span style={{ fontWeight: '800', color: 'var(--primary)' }}>#{b.id || b._id}</span>
                        <div style={{ fontWeight: '700', color: 'var(--text-main)' }}>{b.service_title}</div>
                      </td>
                      <td style={{ padding: '0.9rem 1.25rem' }}>{b.customer_name || 'Customer'}</td>
                      <td style={{ padding: '0.9rem 1.25rem' }}>{b.provider_business_name || `Provider #${b.provider_id}`}</td>
                      <td style={{ padding: '0.9rem 1.25rem' }}>
                        <div>{b.booking_date}</div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{b.booking_time}</div>
                      </td>
                      <td style={{ padding: '0.9rem 1.25rem', fontWeight: '700' }}>₹{b.total_price}</td>
                      <td style={{ padding: '0.9rem 1.25rem' }}>
                        <span className={`badge ${b.status === 'completed' ? 'badge-success' : b.status === 'accepted' ? 'badge-primary' : 'badge-warning'}`}>
                          {b.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 3: User Directory */}
        {activeTab === 'users' && (
          <div className="card" style={{ overflow: 'hidden' }}>
            <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid var(--border-subtle)' }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: '800', margin: 0, color: 'var(--text-main)' }}>
                Registered User Directory
              </h3>
            </div>

            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
                <thead>
                  <tr style={{ background: 'var(--bg-surface)', borderBottom: '1px solid var(--border-subtle)', color: 'var(--text-muted)' }}>
                    <th style={{ padding: '0.9rem 1.25rem', fontWeight: '700' }}>User</th>
                    <th style={{ padding: '0.9rem 1.25rem', fontWeight: '700' }}>Email</th>
                    <th style={{ padding: '0.9rem 1.25rem', fontWeight: '700' }}>Phone</th>
                    <th style={{ padding: '0.9rem 1.25rem', fontWeight: '700' }}>City</th>
                    <th style={{ padding: '0.9rem 1.25rem', fontWeight: '700' }}>Role</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map(u => (
                    <tr key={u.id || u._id} style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                      <td style={{ padding: '0.9rem 1.25rem', fontWeight: '700', color: 'var(--text-main)' }}>{u.name}</td>
                      <td style={{ padding: '0.9rem 1.25rem', color: 'var(--text-muted)' }}>{u.email}</td>
                      <td style={{ padding: '0.9rem 1.25rem' }}>{u.phone || '—'}</td>
                      <td style={{ padding: '0.9rem 1.25rem' }}>{u.city || 'Jaipur'}</td>
                      <td style={{ padding: '0.9rem 1.25rem' }}>
                        <span className={`badge ${u.role === 'admin' ? 'badge-primary' : u.role === 'provider' ? 'badge-secondary' : 'badge-gray'}`}>
                          {u.role}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 4: Review Moderation */}
        {activeTab === 'reviews' && (
          <div className="card" style={{ overflow: 'hidden' }}>
            <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid var(--border-subtle)' }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: '800', margin: 0, color: 'var(--text-main)' }}>
                Review Moderation & Quality Control
              </h3>
            </div>

            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
                <thead>
                  <tr style={{ background: 'var(--bg-surface)', borderBottom: '1px solid var(--border-subtle)', color: 'var(--text-muted)' }}>
                    <th style={{ padding: '0.9rem 1.25rem', fontWeight: '700' }}>Customer</th>
                    <th style={{ padding: '0.9rem 1.25rem', fontWeight: '700' }}>Provider</th>
                    <th style={{ padding: '0.9rem 1.25rem', fontWeight: '700' }}>Rating</th>
                    <th style={{ padding: '0.9rem 1.25rem', fontWeight: '700' }}>Comment</th>
                    <th style={{ padding: '0.9rem 1.25rem', fontWeight: '700' }}>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {reviews.map(r => (
                    <tr key={r.id || r._id} style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                      <td style={{ padding: '0.9rem 1.25rem', fontWeight: '700' }}>{r.customer_name}</td>
                      <td style={{ padding: '0.9rem 1.25rem' }}>{r.provider_name || `Provider #${r.provider_id}`}</td>
                      <td style={{ padding: '0.9rem 1.25rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.2rem', color: '#f59e0b', fontWeight: '700' }}>
                          <Star size={14} fill="#f59e0b" /> {r.rating}
                        </div>
                      </td>
                      <td style={{ padding: '0.9rem 1.25rem', maxWidth: '300px' }}>
                        <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-main)' }}>"{r.comment}"</p>
                      </td>
                      <td style={{ padding: '0.9rem 1.25rem' }}>
                        <button 
                          onClick={() => handleDeleteReview(r.id || r._id)}
                          className="btn btn-secondary btn-sm"
                          style={{ color: 'var(--emergency)', padding: '0.3rem 0.65rem' }}
                          title="Remove Review"
                        >
                          <Trash2 size={15} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
