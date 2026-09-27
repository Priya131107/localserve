import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { serviceAPI, categoryAPI, providerAPI } from '../services/api';
import { Plus, Trash2, Clock, IndianRupee, ArrowLeft, CheckCircle2, Briefcase } from 'lucide-react';

export default function ManageServices() {
  const { user } = useAuth();
  const { showToast } = useToast();

  const [services, setServices] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  // Form State
  const [showAddForm, setShowAddForm] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [durationMins, setDurationMins] = useState('60');
  const [priceType, setPriceType] = useState('fixed');
  const [categoryId, setCategoryId] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const loadServices = async () => {
    try {
      if (user?.provider_id) {
        const [sRes, cRes] = await Promise.all([
          serviceAPI.getByProvider(user.provider_id),
          categoryAPI.getAll()
        ]);
        if (sRes.success) setServices(sRes.services || []);
        if (cRes.success) {
          setCategories(cRes.categories || []);
          if (cRes.categories.length > 0) setCategoryId(cRes.categories[0].id);
        }
      }
    } catch (error) {
      showToast('Failed to load services catalogue', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadServices();
  }, [user]);

  const handleCreateService = async (e) => {
    e.preventDefault();
    if (!title.trim() || !price) {
      showToast('Please enter title and price.', 'error');
      return;
    }

    setSubmitting(true);
    try {
      const payload = {
        title: title.trim(),
        description: description.trim(),
        price: parseFloat(price),
        duration_mins: parseInt(durationMins, 10),
        price_type: priceType,
        category_id: categoryId ? Number(categoryId) : undefined
      };

      const res = await serviceAPI.create(payload);
      if (res.success) {
        showToast('Service added to your public profile!', 'success');
        setTitle('');
        setDescription('');
        setPrice('');
        setShowAddForm(false);
        loadServices();
      }
    } catch (error) {
      showToast(error.message || 'Failed to add service', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteService = async (serviceId) => {
    if (!window.confirm('Are you sure you want to delete this service offering?')) return;

    try {
      const res = await serviceAPI.delete(serviceId);
      if (res.success) {
        showToast('Service removed', 'info');
        setServices((prev) => prev.filter((s) => s.id !== serviceId));
      }
    } catch (e) {
      showToast('Failed to delete service', 'error');
    }
  };

  return (
    <div style={{ padding: '2.5rem 0 5rem', background: 'var(--bg-main)', minHeight: '85vh' }}>
      <div className="container" style={{ maxWidth: '900px' }}>
        
        {/* Top Back Nav */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
          <Link to="/provider/dashboard" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--text-muted)', fontWeight: '600', fontSize: '0.9rem' }}>
            <ArrowLeft size={16} /> Back to Dashboard
          </Link>

          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="btn btn-primary btn-sm"
            style={{ fontWeight: '700' }}
          >
            <Plus size={16} />
            <span>{showAddForm ? 'Cancel' : 'Add New Service'}</span>
          </button>
        </div>

        {/* Header */}
        <div className="glass-card" style={{ padding: '2rem', background: '#ffffff', marginBottom: '2rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{
              background: 'linear-gradient(135deg, #4f46e5 0%, #312e81 100%)',
              color: '#ffffff',
              width: '44px',
              height: '44px',
              borderRadius: '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <Briefcase size={22} />
            </div>
            <div>
              <h1 style={{ fontSize: '1.6rem', fontWeight: '800', color: 'var(--text-main)', margin: 0 }}>
                Manage Service Offerings & Pricing
              </h1>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', margin: 0 }}>
                Add transparent service packages, durations, and rates for customers in your area.
              </p>
            </div>
          </div>
        </div>

        {/* Add Service Modal/Form */}
        {showAddForm && (
          <div className="glass-card fade-in" style={{ padding: '2rem', background: '#ffffff', marginBottom: '2rem', border: '2px solid var(--primary)' }}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: '800', color: 'var(--text-main)', marginBottom: '1.25rem' }}>
              Add New Service Offering
            </h3>

            <form onSubmit={handleCreateService}>
              <div className="form-group">
                <label className="form-label">Service Title</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="e.g. Master Bedroom Split AC Foam Deep Wash"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Description & What is Included</label>
                <textarea
                  className="form-control"
                  rows={3}
                  placeholder="Describe step-by-step what you will do during this service visit..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem' }}>
                <div className="form-group">
                  <label className="form-label">Price (INR ₹)</label>
                  <input
                    type="number"
                    step="10"
                    min="50"
                    className="form-control"
                    placeholder="e.g. 599"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Duration (Minutes)</label>
                  <input
                    type="number"
                    step="15"
                    min="15"
                    className="form-control"
                    placeholder="e.g. 60"
                    value={durationMins}
                    onChange={(e) => setDurationMins(e.target.value)}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Price Type</label>
                  <select
                    className="form-select"
                    value={priceType}
                    onChange={(e) => setPriceType(e.target.value)}
                  >
                    <option value="fixed">Fixed Price</option>
                    <option value="hourly">Hourly Rate</option>
                    <option value="estimate">Estimate / Inspection</option>
                  </select>
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1rem' }}>
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setShowAddForm(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={submitting}
                >
                  {submitting ? 'Saving...' : 'Publish Service'}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Existing Services List */}
        <div className="glass-card" style={{ padding: '2rem', background: '#ffffff' }}>
          <h3 style={{ fontSize: '1.2rem', fontWeight: '800', color: 'var(--text-main)', marginBottom: '1.25rem' }}>
            Current Active Offerings ({services.length})
          </h3>

          {services.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '3rem 0', color: 'var(--text-muted)' }}>
              <p style={{ fontWeight: '600', fontSize: '1rem', marginBottom: '0.5rem' }}>No services added yet</p>
              <p style={{ fontSize: '0.85rem', marginBottom: '1rem' }}>Add your specific services and prices so customers can directly book them!</p>
              <button onClick={() => setShowAddForm(true)} className="btn btn-primary btn-sm">Add First Service</button>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {services.map((s) => (
                <div
                  key={s.id}
                  style={{
                    padding: '1.25rem',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--border-subtle)',
                    background: 'var(--bg-subtle)',
                    display: 'flex',
                    flexWrap: 'wrap',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '1rem'
                  }}
                >
                  <div style={{ maxWidth: '500px' }}>
                    <h4 style={{ fontSize: '1.05rem', fontWeight: '700', color: 'var(--text-main)', margin: '0 0 0.25rem' }}>
                      {s.title}
                    </h4>
                    <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', margin: '0 0 0.35rem' }}>
                      {s.description || 'Standard specialized service by certified technician.'}
                    </p>
                    <span style={{ fontSize: '0.78rem', color: 'var(--secondary)', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                      <Clock size={13} /> {s.duration_mins} Minutes • {s.price_type}
                    </span>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                    <span style={{ fontSize: '1.4rem', fontWeight: '800', color: 'var(--primary)' }}>
                      ₹{s.price}
                    </span>

                    <button
                      onClick={() => handleDeleteService(s.id)}
                      style={{
                        background: '#fee2e2',
                        border: 'none',
                        color: 'var(--emergency)',
                        borderRadius: 'var(--radius-sm)',
                        padding: '0.45rem',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}
                      title="Delete service"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
