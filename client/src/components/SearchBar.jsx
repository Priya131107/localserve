import React, { useState } from 'react';
import { Search, MapPin, Layers, AlertTriangle, ArrowRight, Sparkles } from 'lucide-react';

export default function SearchBar({ initialValues = {}, onSearch, categories = [] }) {
  const [q, setQ] = useState(initialValues.q || '');
  const [category, setCategory] = useState(initialValues.category || '');
  const [location, setLocation] = useState(initialValues.location || '');
  const [emergency, setEmergency] = useState(initialValues.emergency === 'true' || initialValues.emergency === true);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (onSearch) {
      onSearch({
        q: q.trim(),
        category,
        location: location.trim(),
        emergency: emergency ? 'true' : ''
      });
    }
  };

  return (
    <form 
      onSubmit={handleSubmit}
      style={{
        background: 'rgba(255, 255, 255, 0.98)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        padding: '0.85rem 1rem',
        borderRadius: 'var(--radius-xl)',
        boxShadow: '0 20px 40px -10px rgba(0, 0, 0, 0.25), 0 0 0 1px rgba(255, 255, 255, 0.4)',
        display: 'flex',
        flexWrap: 'wrap',
        gap: '0.75rem',
        alignItems: 'center',
        width: '100%',
        maxWidth: '1020px',
        margin: '0 auto',
        position: 'relative',
        zIndex: 20
      }}
    >
      {/* 1. Keyword search */}
      <div style={{
        flex: '1.4',
        minWidth: '240px',
        display: 'flex',
        alignItems: 'center',
        gap: '0.75rem',
        padding: '0.65rem 1rem',
        background: '#f8fafc',
        borderRadius: 'var(--radius-md)',
        border: '1.5px solid #e2e8f0',
        transition: 'all 0.2s'
      }}>
        <div style={{
          width: '32px',
          height: '32px',
          borderRadius: '8px',
          background: 'var(--primary-light)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0
        }}>
          <Search size={17} color="var(--primary)" />
        </div>
        <input
          type="text"
          placeholder="What service do you need? (e.g. Plumber, AC Repair)"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          style={{
            width: '100%',
            border: 'none',
            background: 'transparent',
            outline: 'none',
            fontSize: '0.92rem',
            fontWeight: '600',
            color: 'var(--text-main)'
          }}
        />
      </div>

      {/* 2. Category Selector */}
      <div style={{
        flex: '1',
        minWidth: '190px',
        display: 'flex',
        alignItems: 'center',
        gap: '0.75rem',
        padding: '0.65rem 1rem',
        background: '#f8fafc',
        borderRadius: 'var(--radius-md)',
        border: '1.5px solid #e2e8f0'
      }}>
        <div style={{
          width: '32px',
          height: '32px',
          borderRadius: '8px',
          background: 'var(--secondary-light)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0
        }}>
          <Layers size={17} color="var(--secondary)" />
        </div>
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          style={{
            width: '100%',
            border: 'none',
            background: 'transparent',
            outline: 'none',
            fontSize: '0.92rem',
            fontWeight: '600',
            color: category ? 'var(--text-main)' : 'var(--text-muted)',
            cursor: 'pointer'
          }}
        >
          <option value="">All Categories</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.slug}>
              {cat.name}
            </option>
          ))}
        </select>
      </div>

      {/* 3. Location */}
      <div style={{
        flex: '1',
        minWidth: '190px',
        display: 'flex',
        alignItems: 'center',
        gap: '0.75rem',
        padding: '0.65rem 1rem',
        background: '#f8fafc',
        borderRadius: 'var(--radius-md)',
        border: '1.5px solid #e2e8f0'
      }}>
        <div style={{
          width: '32px',
          height: '32px',
          borderRadius: '8px',
          background: 'var(--accent-light)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0
        }}>
          <MapPin size={17} color="var(--accent)" />
        </div>
        <input
          type="text"
          placeholder="Location / Area (e.g. Malviya Nagar)"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          style={{
            width: '100%',
            border: 'none',
            background: 'transparent',
            outline: 'none',
            fontSize: '0.92rem',
            fontWeight: '600',
            color: 'var(--text-main)'
          }}
        />
      </div>

      {/* 4. Emergency quick switch */}
      <button
        type="button"
        onClick={() => setEmergency(!emergency)}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.45rem',
          padding: '0.75rem 1.1rem',
          borderRadius: 'var(--radius-md)',
          border: emergency ? '1.5px solid var(--emergency)' : '1.5px solid #e2e8f0',
          background: emergency ? 'var(--emergency-light)' : '#ffffff',
          color: emergency ? 'var(--emergency)' : 'var(--text-muted)',
          fontSize: '0.86rem',
          fontWeight: '800',
          cursor: 'pointer',
          transition: 'all 0.2s ease',
          boxShadow: emergency ? '0 0 12px var(--emergency-glow)' : 'none'
        }}
        title="Filter for 24/7 emergency providers"
      >
        <AlertTriangle size={16} color={emergency ? 'var(--emergency)' : 'var(--text-muted)'} />
        <span>24/7 SOS</span>
      </button>

      {/* 5. Submit Button */}
      <button
        type="submit"
        className="btn btn-primary"
        style={{
          padding: '0.85rem 1.8rem',
          borderRadius: 'var(--radius-md)',
          fontWeight: '800',
          fontSize: '1rem',
          letterSpacing: '0.01em'
        }}
      >
        <span>Search</span>
        <ArrowRight size={18} />
      </button>
    </form>
  );
}
