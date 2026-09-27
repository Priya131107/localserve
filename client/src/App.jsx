import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';

// Components
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import EmergencyModal from './components/EmergencyModal';
import ProviderCompareModal from './components/ProviderCompareModal';
import ProtectedRoute from './components/ProtectedRoute';

// Pages
import Home from './pages/Home';
import Services from './pages/Services';
import ProviderDetails from './pages/ProviderDetails';
import EstimatorPage from './pages/EstimatorPage';
import About from './pages/About';
import Login from './pages/Login';
import Register from './pages/Register';
import CustomerDashboard from './pages/CustomerDashboard';
import ProviderDashboard from './pages/ProviderDashboard';
import ManageServices from './pages/ManageServices';
import MyBookings from './pages/MyBookings';
import Favorites from './pages/Favorites';
import Messages from './pages/Messages';
import Profile from './pages/Profile';
import AdminDashboard from './pages/AdminDashboard';

export default function App() {
  const [isEmergencyModalOpen, setIsEmergencyModalOpen] = useState(false);
  const [isCompareModalOpen, setIsCompareModalOpen] = useState(false);
  const [comparedProviders, setComparedProviders] = useState([]);

  const handleToggleCompare = (provider) => {
    setComparedProviders(prev => {
      const exists = prev.some(p => (p.id === provider.id || p._id === provider._id));
      if (exists) {
        return prev.filter(p => (p.id !== provider.id && p._id !== provider._id));
      } else {
        if (prev.length >= 3) {
          alert('You can compare a maximum of 3 providers at a time.');
          return prev;
        }
        return [...prev, provider];
      }
    });
  };

  return (
    <Router>
      <AuthProvider>
        <ToastProvider>
          <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
            
            {/* Navigation with Emergency & Compare triggers */}
            <Navbar 
              onOpenEmergency={() => setIsEmergencyModalOpen(true)} 
              onOpenCompare={() => setIsCompareModalOpen(true)}
            />

            {/* Floating Compare Badge if providers selected */}
            {comparedProviders.length > 0 && !isCompareModalOpen && (
              <div 
                onClick={() => setIsCompareModalOpen(true)}
                style={{
                  position: 'fixed',
                  bottom: '24px',
                  right: '24px',
                  background: 'linear-gradient(135deg, #4f46e5 0%, #3b82f6 100%)',
                  color: '#fff',
                  borderRadius: 'var(--radius-full)',
                  padding: '0.75rem 1.4rem',
                  boxShadow: '0 10px 25px rgba(79, 70, 229, 0.45)',
                  zIndex: 999,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.65rem',
                  fontWeight: '700',
                  fontSize: '0.92rem',
                  border: '2px solid rgba(255, 255, 255, 0.3)'
                }}
              >
                <span>⚖️ Compare ({comparedProviders.length})</span>
              </div>
            )}

            {/* Main Content Pages */}
            <main style={{ flex: 1 }}>
              <Routes>
                {/* Public Pages */}
                <Route 
                  path="/" 
                  element={
                    <Home 
                      onOpenEmergency={() => setIsEmergencyModalOpen(true)} 
                      onOpenCompare={() => setIsCompareModalOpen(true)}
                    />
                  } 
                />
                <Route 
                  path="/services" 
                  element={
                    <Services 
                      comparedProviders={comparedProviders}
                      onToggleCompare={handleToggleCompare}
                      onOpenCompare={() => setIsCompareModalOpen(true)}
                    />
                  } 
                />
                <Route path="/providers/:id" element={<ProviderDetails />} />
                <Route path="/estimator" element={<EstimatorPage />} />
                <Route path="/about" element={<About />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />

                {/* Customer Protected Pages */}
                <Route 
                  path="/customer/dashboard" 
                  element={
                    <ProtectedRoute allowedRoles={['customer', 'admin']}>
                      <CustomerDashboard onOpenEmergency={() => setIsEmergencyModalOpen(true)} />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/bookings" 
                  element={
                    <ProtectedRoute>
                      <MyBookings />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/favorites" 
                  element={
                    <ProtectedRoute allowedRoles={['customer', 'admin']}>
                      <Favorites />
                    </ProtectedRoute>
                  } 
                />

                {/* Provider Protected Pages */}
                <Route 
                  path="/provider/dashboard" 
                  element={
                    <ProtectedRoute allowedRoles={['provider', 'admin']}>
                      <ProviderDashboard />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/provider/services" 
                  element={
                    <ProtectedRoute allowedRoles={['provider', 'admin']}>
                      <ManageServices />
                    </ProtectedRoute>
                  } 
                />

                {/* Admin Console Route */}
                <Route 
                  path="/admin" 
                  element={
                    <ProtectedRoute allowedRoles={['admin']}>
                      <AdminDashboard />
                    </ProtectedRoute>
                  } 
                />

                {/* Common Protected Pages */}
                <Route 
                  path="/messages" 
                  element={
                    <ProtectedRoute>
                      <Messages />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/profile" 
                  element={
                    <ProtectedRoute>
                      <Profile />
                    </ProtectedRoute>
                  } 
                />

                {/* Fallback */}
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </main>

            {/* Footer */}
            <Footer />

            {/* Global Emergency Modal */}
            <EmergencyModal 
              isOpen={isEmergencyModalOpen} 
              onClose={() => setIsEmergencyModalOpen(false)} 
            />

            {/* Global Provider Comparison Modal */}
            <ProviderCompareModal
              isOpen={isCompareModalOpen}
              onClose={() => setIsCompareModalOpen(false)}
              providers={comparedProviders}
            />

          </div>
        </ToastProvider>
      </AuthProvider>
    </Router>
  );
}
