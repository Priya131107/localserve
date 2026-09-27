import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { notificationAPI } from '../services/api';
import { 
  Wrench, 
  Search, 
  Calendar, 
  Heart, 
  MessageSquare, 
  User, 
  LogOut, 
  LayoutDashboard, 
  AlertTriangle, 
  Menu, 
  X,
  Briefcase,
  Calculator,
  Info,
  ChevronDown,
  Sparkles,
  Bell,
  Shield,
  Layers
} from 'lucide-react';

export default function Navbar({ onOpenEmergency, onOpenCompare }) {
  const { user, isAuthenticated, isCustomer, isProvider, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  const navigate = useNavigate();
  const location = useLocation();

  const isAdmin = user?.role === 'admin';

  useEffect(() => {
    if (isAuthenticated) {
      notificationAPI.getAll()
        .then(res => {
          if (res.success) {
            setNotifications(res.notifications || []);
            setUnreadCount(res.unreadCount || 0);
          }
        })
        .catch(() => {});
    }
  }, [isAuthenticated, location.pathname]);

  const handleMarkAllRead = async () => {
    try {
      await notificationAPI.markAllAsRead();
      setUnreadCount(0);
      setNotifications(prev => prev.map(n => ({ ...n, is_read: 1, readStatus: true })));
    } catch (e) {}
  };

  const handleLogout = () => {
    logout();
    setDropdownOpen(false);
    navigate('/login');
  };

  const isActive = (path) => location.pathname === path;

  return (
    <header style={{
      background: 'rgba(255, 255, 255, 0.94)',
      backdropFilter: 'blur(16px)',
      WebkitBackdropFilter: 'blur(16px)',
      borderBottom: '1px solid rgba(226, 232, 240, 0.8)',
      position: 'sticky',
      top: 0,
      zIndex: 1000,
      boxShadow: '0 4px 20px -2px rgba(0, 0, 0, 0.05)'
    }}>
      <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '74px' }}>
        
        {/* Logo: LocalServe */}
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.85rem', textDecoration: 'none' }}>
          <div style={{
            background: 'linear-gradient(135deg, #4f46e5 0%, #3b82f6 50%, #06b6d4 100%)',
            color: '#fff',
            width: '44px',
            height: '44px',
            borderRadius: '14px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 6px 16px rgba(79, 70, 229, 0.35)',
            transform: 'rotate(-2deg)'
          }}>
            <Wrench size={22} />
          </div>
          <div>
            <span style={{ fontSize: '1.4rem', fontWeight: '800', color: 'var(--text-main)', letterSpacing: '-0.03em', display: 'block', lineHeight: '1' }}>
              Local<span style={{ background: 'linear-gradient(135deg, #4f46e5 0%, #06b6d4 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Serve</span>
            </span>
            <span style={{ fontSize: '0.68rem', fontWeight: '800', color: 'var(--primary)', textTransform: 'uppercase', letterSpacing: '0.12em', display: 'flex', alignItems: 'center', gap: '0.25rem', marginTop: '0.15rem' }}>
              <span style={{ width: '5px', height: '5px', borderRadius: '50%', background: '#10b981' }}></span>
              Trusted Pro Network
            </span>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <nav style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }} className="desktop-nav">
          <Link 
            to="/" 
            style={{ 
              fontWeight: '700', 
              fontSize: '0.92rem',
              padding: '0.55rem 1rem',
              borderRadius: 'var(--radius-full)',
              color: isActive('/') ? 'var(--primary)' : 'var(--text-muted)',
              background: isActive('/') ? 'var(--primary-light)' : 'transparent',
              transition: 'all 0.2s'
            }}
          >
            Home
          </Link>
          <Link 
            to="/services" 
            style={{ 
              fontWeight: '700', 
              fontSize: '0.92rem',
              padding: '0.55rem 1rem',
              borderRadius: 'var(--radius-full)',
              color: isActive('/services') ? 'var(--primary)' : 'var(--text-muted)',
              background: isActive('/services') ? 'var(--primary-light)' : 'transparent',
              transition: 'all 0.2s'
            }}
          >
            Find Services
          </Link>
          <Link 
            to="/estimator" 
            style={{ 
              fontWeight: '700', 
              fontSize: '0.92rem',
              padding: '0.55rem 1rem',
              borderRadius: 'var(--radius-full)',
              color: isActive('/estimator') ? 'var(--primary)' : 'var(--text-muted)',
              background: isActive('/estimator') ? 'var(--primary-light)' : 'transparent',
              transition: 'all 0.2s'
            }}
          >
            Cost Estimator
          </Link>
          <Link 
            to="/about" 
            style={{ 
              fontWeight: '700', 
              fontSize: '0.92rem',
              padding: '0.55rem 1rem',
              borderRadius: 'var(--radius-full)',
              color: isActive('/about') ? 'var(--primary)' : 'var(--text-muted)',
              background: isActive('/about') ? 'var(--primary-light)' : 'transparent',
              transition: 'all 0.2s'
            }}
          >
            About
          </Link>
          {onOpenCompare && (
            <button
              onClick={onOpenCompare}
              style={{
                background: 'none',
                border: 'none',
                fontWeight: '700',
                fontSize: '0.92rem',
                padding: '0.55rem 0.9rem',
                borderRadius: 'var(--radius-full)',
                color: 'var(--text-muted)',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.35rem'
              }}
            >
              <Layers size={15} color="var(--primary)" /> Compare
            </button>
          )}
        </nav>

        {/* Action Buttons, Notifications & Profile */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
          
          {/* Emergency Service Button */}
          <button 
            onClick={onOpenEmergency}
            className="btn btn-emergency btn-sm"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.45rem',
              fontWeight: '800',
              borderRadius: 'var(--radius-full)',
              padding: '0.5rem 1.15rem',
              letterSpacing: '0.01em'
            }}
          >
            <AlertTriangle size={15} />
            <span>Emergency 24/7</span>
          </button>

          {/* In-App Notifications Bell (If Logged In) */}
          {isAuthenticated && (
            <div style={{ position: 'relative' }}>
              <button
                onClick={() => setNotifOpen(!notifOpen)}
                style={{
                  background: 'var(--bg-subtle)',
                  border: '1.5px solid var(--border-subtle)',
                  borderRadius: '50%',
                  width: '40px',
                  height: '40px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  position: 'relative'
                }}
                title="Notifications"
              >
                <Bell size={18} color="var(--text-main)" />
                {unreadCount > 0 && (
                  <span style={{
                    position: 'absolute',
                    top: '-3px',
                    right: '-3px',
                    background: 'var(--emergency)',
                    color: '#fff',
                    borderRadius: '50%',
                    width: '18px',
                    height: '18px',
                    fontSize: '0.68rem',
                    fontWeight: '800',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    border: '2px solid #fff'
                  }}>
                    {unreadCount}
                  </span>
                )}
              </button>

              {/* Notifications Dropdown */}
              {notifOpen && (
                <div 
                  style={{
                    position: 'absolute',
                    top: 'calc(100% + 10px)',
                    right: 0,
                    width: '320px',
                    background: '#ffffff',
                    borderRadius: 'var(--radius-xl)',
                    boxShadow: 'var(--shadow-2xl)',
                    border: '1px solid var(--border-subtle)',
                    padding: '0.8rem',
                    zIndex: 1060,
                    animation: 'fadeIn 0.15s ease'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingBottom: '0.5rem', borderBottom: '1px solid var(--border-subtle)', marginBottom: '0.5rem' }}>
                    <span style={{ fontWeight: '800', fontSize: '0.92rem', color: 'var(--text-main)' }}>Notifications</span>
                    {unreadCount > 0 && (
                      <button 
                        onClick={handleMarkAllRead}
                        style={{ background: 'none', border: 'none', color: 'var(--primary)', fontSize: '0.75rem', fontWeight: '700', cursor: 'pointer' }}
                      >
                        Mark all read
                      </button>
                    )}
                  </div>

                  <div style={{ maxHeight: '280px', overflowY: 'auto' }}>
                    {notifications.length === 0 ? (
                      <p style={{ textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.82rem', padding: '1.5rem 0' }}>No notifications yet.</p>
                    ) : (
                      notifications.slice(0, 6).map(n => (
                        <div 
                          key={n.id || n._id}
                          style={{
                            padding: '0.6rem 0.5rem',
                            borderBottom: '1px solid var(--border-subtle)',
                            background: n.is_read ? 'transparent' : 'rgba(79, 70, 229, 0.05)',
                            borderRadius: 'var(--radius-sm)',
                            marginBottom: '0.2rem'
                          }}
                        >
                          <div style={{ fontWeight: '700', fontSize: '0.82rem', color: 'var(--text-main)' }}>{n.title}</div>
                          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.15rem' }}>{n.message}</div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

          {isAuthenticated ? (
            <div style={{ position: 'relative' }}>
              <button 
                onClick={() => setDropdownOpen(!dropdownOpen)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.65rem',
                  background: 'var(--bg-surface)',
                  border: '1.5px solid var(--border-subtle)',
                  padding: '0.35rem 0.75rem 0.35rem 0.4rem',
                  borderRadius: 'var(--radius-full)',
                  cursor: 'pointer',
                  boxShadow: 'var(--shadow-sm)',
                  transition: 'all 0.2s'
                }}
              >
                <img 
                  src={user?.avatar || user?.profileImage || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.name}`} 
                  alt={user?.name} 
                  style={{ width: '32px', height: '32px', borderRadius: '50%', objectFit: 'cover' }}
                />
                <span style={{ fontSize: '0.88rem', fontWeight: '700', color: 'var(--text-main)', maxWidth: '110px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {user?.name?.split(' ')[0]}
                </span>
                <ChevronDown size={14} color="var(--text-muted)" />
              </button>

              {/* User Dropdown Menu */}
              {dropdownOpen && (
                <div 
                  style={{
                    position: 'absolute',
                    top: 'calc(100% + 10px)',
                    right: 0,
                    width: '240px',
                    background: '#ffffff',
                    borderRadius: 'var(--radius-xl)',
                    boxShadow: 'var(--shadow-2xl)',
                    border: '1px solid var(--border-subtle)',
                    padding: '0.6rem',
                    zIndex: 1050,
                    animation: 'fadeIn 0.15s ease'
                  }}
                  onClick={() => setDropdownOpen(false)}
                >
                  <div style={{ padding: '0.6rem 0.75rem', borderBottom: '1px solid var(--border-subtle)', marginBottom: '0.4rem' }}>
                    <p style={{ fontWeight: '800', fontSize: '0.92rem', color: 'var(--text-main)', margin: 0 }}>{user?.name}</p>
                    <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', margin: '0.1rem 0 0.35rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{user?.email}</p>
                    <span className={`badge ${isAdmin ? 'badge-primary' : isProvider ? 'badge-primary' : 'badge-gray'}`} style={{ fontSize: '0.65rem', padding: '0.15rem 0.5rem' }}>
                      {isAdmin ? '🛡️ Administrator' : isProvider ? '🔧 Service Provider' : '👤 Customer'}
                    </span>
                  </div>

                  {isAdmin && (
                    <Link to="/admin" style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', padding: '0.6rem 0.75rem', borderRadius: 'var(--radius-sm)', color: 'var(--primary)', fontSize: '0.88rem', fontWeight: '700' }}>
                      <Shield size={16} color="var(--primary)" /> Admin Console
                    </Link>
                  )}

                  {isCustomer && (
                    <>
                      <Link to="/customer/dashboard" style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', padding: '0.6rem 0.75rem', borderRadius: 'var(--radius-sm)', color: 'var(--text-main)', fontSize: '0.88rem', fontWeight: '600' }}>
                        <LayoutDashboard size={16} color="var(--primary)" /> Dashboard
                      </Link>
                      <Link to="/bookings" style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', padding: '0.6rem 0.75rem', borderRadius: 'var(--radius-sm)', color: 'var(--text-main)', fontSize: '0.88rem', fontWeight: '600' }}>
                        <Calendar size={16} color="var(--secondary)" /> My Bookings
                      </Link>
                      <Link to="/favorites" style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', padding: '0.6rem 0.75rem', borderRadius: 'var(--radius-sm)', color: 'var(--text-main)', fontSize: '0.88rem', fontWeight: '600' }}>
                        <Heart size={16} color="var(--emergency)" /> Favorites
                      </Link>
                      <Link to="/messages" style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', padding: '0.6rem 0.75rem', borderRadius: 'var(--radius-sm)', color: 'var(--text-main)', fontSize: '0.88rem', fontWeight: '600' }}>
                        <MessageSquare size={16} color="var(--accent)" /> Chat Messages
                      </Link>
                    </>
                  )}

                  {isProvider && (
                    <>
                      <Link to="/provider/dashboard" style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', padding: '0.6rem 0.75rem', borderRadius: 'var(--radius-sm)', color: 'var(--text-main)', fontSize: '0.88rem', fontWeight: '600' }}>
                        <LayoutDashboard size={16} color="var(--primary)" /> Provider Dashboard
                      </Link>
                      <Link to="/provider/services" style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', padding: '0.6rem 0.75rem', borderRadius: 'var(--radius-sm)', color: 'var(--text-main)', fontSize: '0.88rem', fontWeight: '600' }}>
                        <Briefcase size={16} color="var(--secondary)" /> Manage Services
                      </Link>
                      <Link to="/messages" style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', padding: '0.6rem 0.75rem', borderRadius: 'var(--radius-sm)', color: 'var(--text-main)', fontSize: '0.88rem', fontWeight: '600' }}>
                        <MessageSquare size={16} color="var(--accent)" /> Client Chats
                      </Link>
                    </>
                  )}

                  <Link to="/profile" style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', padding: '0.6rem 0.75rem', borderRadius: 'var(--radius-sm)', color: 'var(--text-main)', fontSize: '0.88rem', fontWeight: '600' }}>
                    <User size={16} /> Account Profile
                  </Link>

                  <div style={{ borderTop: '1px solid var(--border-subtle)', marginTop: '0.4rem', paddingTop: '0.4rem' }}>
                    <button 
                      onClick={handleLogout}
                      style={{
                        width: '100%',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.65rem',
                        padding: '0.6rem 0.75rem',
                        borderRadius: 'var(--radius-sm)',
                        color: 'var(--emergency)',
                        fontSize: '0.88rem',
                        fontWeight: '700',
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer',
                        textAlign: 'left'
                      }}
                    >
                      <LogOut size={16} /> Sign Out
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              <Link to="/login" className="btn btn-secondary btn-sm" style={{ fontWeight: '700', borderRadius: 'var(--radius-full)' }}>
                Log In
              </Link>
              <Link to="/register" className="btn btn-primary btn-sm" style={{ fontWeight: '700', borderRadius: 'var(--radius-full)' }}>
                <Sparkles size={14} /> Join Free
              </Link>
            </div>
          )}

          {/* Mobile menu toggle */}
          <button 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            style={{
              display: 'none',
              background: 'none',
              border: 'none',
              color: 'var(--text-main)',
              cursor: 'pointer',
              padding: '0.3rem'
            }}
            className="mobile-menu-btn"
          >
            {mobileMenuOpen ? <X size={26} /> : <Menu size={26} />}
          </button>

        </div>

      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div style={{
          background: '#ffffff',
          borderBottom: '2px solid var(--primary)',
          padding: '1.5rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.8rem',
          boxShadow: 'var(--shadow-xl)'
        }}
        onClick={() => setMobileMenuOpen(false)}
        >
          <Link to="/" style={{ padding: '0.5rem', fontWeight: '700', color: 'var(--text-main)' }}>Home</Link>
          <Link to="/services" style={{ padding: '0.5rem', fontWeight: '700', color: 'var(--text-main)' }}>Find Services</Link>
          <Link to="/estimator" style={{ padding: '0.5rem', fontWeight: '700', color: 'var(--text-main)' }}>Cost Estimator</Link>
          <Link to="/about" style={{ padding: '0.5rem', fontWeight: '700', color: 'var(--text-main)' }}>About Us</Link>
          {isAuthenticated && (
            <>
              <div style={{ height: '1px', background: 'var(--border-subtle)', margin: '0.5rem 0' }}></div>
              {isAdmin && (
                <Link to="/admin" style={{ padding: '0.5rem', fontWeight: '700', color: 'var(--primary)' }}>Admin Console</Link>
              )}
              <Link to={isProvider ? '/provider/dashboard' : '/customer/dashboard'} style={{ padding: '0.5rem', fontWeight: '700', color: 'var(--primary)' }}>
                Dashboard ({user?.role})
              </Link>
              <Link to="/bookings" style={{ padding: '0.5rem', fontWeight: '700', color: 'var(--text-main)' }}>My Bookings</Link>
              <Link to="/messages" style={{ padding: '0.5rem', fontWeight: '700', color: 'var(--text-main)' }}>Messages</Link>
              <Link to="/profile" style={{ padding: '0.5rem', fontWeight: '700', color: 'var(--text-main)' }}>My Profile</Link>
            </>
          )}
        </div>
      )}

      <style>{`
        @media (max-width: 860px) {
          .desktop-nav { display: none !important; }
          .mobile-menu-btn { display: block !important; }
        }
      `}</style>
    </header>
  );
}
