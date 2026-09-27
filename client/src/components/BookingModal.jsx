import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { bookingAPI, serviceAPI } from '../services/api';
import { X, Calendar, Clock, MapPin, Phone, FileText, CheckCircle2, ShieldCheck } from 'lucide-react';

const TIME_SLOTS = [
  '08:00 AM - 10:00 AM',
  '10:00 AM - 12:00 PM',
  '12:00 PM - 02:00 PM',
  '02:00 PM - 04:00 PM',
  '04:00 PM - 06:00 PM',
  '06:00 PM - 08:00 PM'
];

export default function BookingModal({ provider, service = null, onClose, onSuccess }) {
  const { user, isAuthenticated } = useAuth();
  const { showToast } = useToast();

  const [servicesList, setServicesList] = useState([]);
  const [selectedServiceId, setSelectedServiceId] = useState(service?.id || '');
  const [customTitle, setCustomTitle] = useState(service?.title || '');
  const [bookingDate, setBookingDate] = useState(() => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split('T')[0];
  });
  const [bookingTime, setBookingTime] = useState(TIME_SLOTS[1]);
  const [address, setAddress] = useState(user?.address || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);

  // Fetch provider services if not preloaded
  useEffect(() => {
    if (provider?.id) {
      if (provider.services && provider.services.length > 0) {
        setServicesList(provider.services);
        if (!selectedServiceId && provider.services[0]) {
          setSelectedServiceId(provider.services[0].id);
          setCustomTitle(provider.services[0].title);
        }
      } else {
        serviceAPI.getByProvider(provider.id)
          .then((res) => {
            if (res.success && res.services) {
              setServicesList(res.services);
              if (!selectedServiceId && res.services[0]) {
                setSelectedServiceId(res.services[0].id);
                setCustomTitle(res.services[0].title);
              }
            }
          })
          .catch(() => {});
      }
    }
  }, [provider]);

  // Determine current price
  const activeService = servicesList.find((s) => s.id === Number(selectedServiceId)) || service;
  const price = activeService ? parseFloat(activeService.price) : parseFloat(provider?.hourly_rate || 350);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isAuthenticated) {
      showToast('Please log in or create an account to book a service.', 'error');
      return;
    }

    if (!bookingDate || !bookingTime || !address.trim() || !phone.trim()) {
      showToast('Please fill in all mandatory fields (Date, Time, Address, Phone).', 'error');
      return;
    }

    setLoading(true);
    try {
      const payload = {
        provider_id: provider.id,
        service_id: selectedServiceId ? Number(selectedServiceId) : null,
        service_title: activeService ? activeService.title : (customTitle || 'General Service Visit'),
        booking_date: bookingDate,
        booking_time: bookingTime,
        total_price: price,
        customer_address: address.trim(),
        customer_phone: phone.trim(),
        notes: notes.trim()
      };

      const res = await bookingAPI.create(payload);
      if (res.success) {
        showToast('Booking request placed successfully!', 'success');
        if (onSuccess) onSuccess(res.booking);
        onClose();
      }
    } catch (error) {
      showToast(error.message || 'Failed to place booking. Please try again.', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div 
        className="modal-content" 
        style={{ maxWidth: '580px' }} 
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '1rem' }}>
          <div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: '800', color: 'var(--text-main)' }}>
              Book Service Appointment
            </h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              with {provider?.business_name} ({provider?.area}, {provider?.city})
            </p>
          </div>
          <button 
            onClick={onClose}
            style={{ background: 'var(--bg-subtle)', border: 'none', borderRadius: '50%', width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit}>
          
          {/* Service Selection */}
          <div className="form-group">
            <label className="form-label">Select Required Service</label>
            {servicesList.length > 0 ? (
              <select
                className="form-select"
                value={selectedServiceId}
                onChange={(e) => {
                  setSelectedServiceId(e.target.value);
                  const sel = servicesList.find((s) => s.id === Number(e.target.value));
                  if (sel) setCustomTitle(sel.title);
                }}
              >
                {servicesList.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.title} — ₹{s.price} ({s.duration_mins} mins)
                  </option>
                ))}
              </select>
            ) : (
              <input
                type="text"
                className="form-control"
                placeholder="e.g. Standard Inspection / Repair"
                value={customTitle}
                onChange={(e) => setCustomTitle(e.target.value)}
              />
            )}
          </div>

          {/* Date & Time Slot Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.25rem' }}>
            <div>
              <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                <Calendar size={15} color="var(--primary)" /> Preferred Date
              </label>
              <input
                type="date"
                className="form-control"
                min={new Date().toISOString().split('T')[0]}
                value={bookingDate}
                onChange={(e) => setBookingDate(e.target.value)}
                required
              />
            </div>

            <div>
              <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                <Clock size={15} color="var(--secondary)" /> Time Slot
              </label>
              <select
                className="form-select"
                value={bookingTime}
                onChange={(e) => setBookingTime(e.target.value)}
                required
              >
                {TIME_SLOTS.map((slot) => (
                  <option key={slot} value={slot}>
                    {slot}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Service Address */}
          <div className="form-group">
            <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <MapPin size={15} color="var(--accent)" /> Service Address (House/Street/Landmark)
            </label>
            <input
              type="text"
              className="form-control"
              placeholder="e.g. Flat 302, Royal Residency, Malviya Nagar"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              required
            />
          </div>

          {/* Customer Phone */}
          <div className="form-group">
            <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <Phone size={15} color="var(--success)" /> Contact Phone Number
            </label>
            <input
              type="tel"
              className="form-control"
              placeholder="+91 98290 12345"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
            />
          </div>

          {/* Notes / Special Instructions */}
          <div className="form-group">
            <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <FileText size={15} color="var(--text-muted)" /> Additional Instructions (Optional)
            </label>
            <textarea
              className="form-control"
              rows={2}
              placeholder="Describe the issue or any specific gate code/timings..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
          </div>

          {/* Price & Summary Box */}
          <div style={{
            background: 'var(--bg-subtle)',
            padding: '1rem 1.25rem',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--border-subtle)',
            marginBottom: '1.25rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}>
            <div>
              <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)', display: 'block' }}>Total Estimated Cost</span>
              <span style={{ fontSize: '1.4rem', fontWeight: '800', color: 'var(--primary)' }}>
                ₹{price}
              </span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.8rem', color: 'var(--success)', fontWeight: '600' }}>
              <ShieldCheck size={16} /> Pay After Service Completion
            </div>
          </div>

          {/* Actions */}
          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <button
              type="button"
              className="btn btn-secondary"
              style={{ flex: '1' }}
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              style={{ flex: '2' }}
              disabled={loading}
            >
              {loading ? 'Submitting...' : 'Confirm & Request Booking'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
