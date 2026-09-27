import React, { useState } from 'react';
import { useToast } from '../context/ToastContext';
import { reviewAPI } from '../services/api';
import { Star, X } from 'lucide-react';

export default function ReviewModal({ booking, onClose, onSuccess }) {
  const { showToast } = useToast();
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!comment.trim()) {
      showToast('Please enter your review feedback.', 'error');
      return;
    }

    setLoading(true);
    try {
      const payload = {
        booking_id: booking.id,
        provider_id: booking.provider_id,
        rating,
        comment: comment.trim()
      };

      const res = await reviewAPI.create(payload);
      if (res.success) {
        showToast('Thank you! Your review has been submitted.', 'success');
        if (onSuccess) onSuccess();
        onClose();
      }
    } catch (error) {
      showToast(error.message || 'Failed to submit review.', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div 
        className="modal-content" 
        style={{ maxWidth: '480px' }} 
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
          <div>
            <h3 style={{ fontSize: '1.2rem', fontWeight: '800', color: 'var(--text-main)' }}>
              Rate & Review Service
            </h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              {booking.service_title}
            </p>
          </div>
          <button 
            onClick={onClose}
            style={{ background: 'var(--bg-subtle)', border: 'none', borderRadius: '50%', width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
          >
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          {/* 5-Star Rating Selector */}
          <div style={{ textAlign: 'center', margin: '1.5rem 0' }}>
            <label className="form-label" style={{ marginBottom: '0.75rem' }}>How was your overall experience?</label>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '0.5rem' }}>
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                  style={{
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    padding: '0.25rem',
                    transition: 'transform 0.15s ease'
                  }}
                >
                  <Star
                    size={36}
                    fill={(hoverRating || rating) >= star ? '#f59e0b' : '#e2e8f0'}
                    color={(hoverRating || rating) >= star ? '#f59e0b' : '#cbd5e1'}
                  />
                </button>
              ))}
            </div>
            <p style={{ fontSize: '0.88rem', fontWeight: '700', color: '#b45309', marginTop: '0.5rem' }}>
              {rating === 5 && '⭐⭐⭐⭐⭐ Exceptional'}
              {rating === 4 && '⭐⭐⭐⭐ Great Experience'}
              {rating === 3 && '⭐⭐⭐ Average'}
              {rating === 2 && '⭐⭐ Below Expectations'}
              {rating === 1 && '⭐ Poor Service'}
            </p>
          </div>

          {/* Feedback Textarea */}
          <div className="form-group">
            <label className="form-label">Write your detailed review</label>
            <textarea
              className="form-control"
              rows={4}
              placeholder="Tell others about the punctuality, quality of work, and professionalism..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              required
            />
          </div>

          {/* Actions */}
          <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1.5rem' }}>
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
              {loading ? 'Submitting...' : 'Submit Review'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
