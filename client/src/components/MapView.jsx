import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import { Star, Shield, Phone, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

// Fix for default Leaflet icon paths in Vite / Webpack
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

// Custom Emergency & Standard Pins
const createCustomIcon = (isEmergency = false) => {
  const color = isEmergency ? '#e11d48' : '#4f46e5';
  return L.divIcon({
    className: 'custom-leaflet-marker',
    html: `
      <div style="
        background: ${color};
        width: 32px;
        height: 32px;
        border-radius: 50% 50% 50% 0;
        transform: rotate(-45deg);
        display: flex;
        align-items: center;
        justify-content: center;
        border: 2.5px solid #ffffff;
        box-shadow: 0 4px 10px rgba(0,0,0,0.3);
      ">
        <span style="
          transform: rotate(45deg);
          color: #ffffff;
          font-size: 14px;
          font-weight: bold;
        ">${isEmergency ? '⚡' : '🔧'}</span>
      </div>
    `,
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32]
  });
};

export default function MapView({ providers = [], onBook, center = [26.9124, 75.7873], zoom = 12 }) {
  return (
    <div style={{ width: '100%', height: '550px', borderRadius: 'var(--radius-xl)', overflow: 'hidden', border: '1px solid var(--border-subtle)', boxShadow: 'var(--shadow-lg)', position: 'relative' }}>
      
      {/* Overlay legend */}
      <div style={{
        position: 'absolute',
        top: '15px',
        right: '15px',
        zIndex: 1000,
        background: 'rgba(255, 255, 255, 0.95)',
        backdropFilter: 'blur(8px)',
        padding: '0.6rem 0.9rem',
        borderRadius: 'var(--radius-md)',
        boxShadow: 'var(--shadow-md)',
        display: 'flex',
        flexDirection: 'column',
        gap: '0.35rem',
        fontSize: '0.78rem',
        fontWeight: '600'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
          <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#4f46e5' }}></span>
          <span>Verified Local Provider</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
          <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#e11d48' }}></span>
          <span>24/7 Emergency Dispatch</span>
        </div>
      </div>

      <MapContainer 
        center={center} 
        zoom={zoom} 
        scrollWheelZoom={false}
        style={{ width: '100%', height: '100%' }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {providers.map((p) => {
          const lat = parseFloat(p.latitude) || (26.9124 + (Math.random() - 0.5) * 0.08);
          const lng = parseFloat(p.longitude) || (75.7873 + (Math.random() - 0.5) * 0.08);

          return (
            <Marker 
              key={p.id} 
              position={[lat, lng]} 
              icon={createCustomIcon(p.is_emergency === 1)}
            >
              <Popup>
                <div style={{ width: '220px', padding: '0.2rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.4rem' }}>
                    <img 
                      src={p.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${p.business_name}`} 
                      alt={p.business_name}
                      style={{ width: '38px', height: '38px', borderRadius: '8px', objectFit: 'cover' }}
                    />
                    <div>
                      <h4 style={{ fontSize: '0.92rem', fontWeight: '700', margin: 0, lineHeight: '1.2' }}>
                        {p.business_name}
                      </h4>
                      <span style={{ fontSize: '0.75rem', color: '#64748b' }}>
                        {p.area}, {p.city}
                      </span>
                    </div>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', margin: '0.4rem 0', fontSize: '0.8rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.2rem', color: '#b45309', fontWeight: '700' }}>
                      <Star size={13} fill="#f59e0b" color="#f59e0b" />
                      <span>{Number(p.rating || 5).toFixed(1)}</span>
                    </div>
                    <span style={{ fontWeight: '800', color: '#0f172a' }}>
                      ₹{p.hourly_rate}/hr
                    </span>
                  </div>

                  <div style={{ display: 'flex', gap: '0.4rem', marginTop: '0.5rem' }}>
                    <Link 
                      to={`/providers/${p.id}`}
                      style={{
                        flex: '1',
                        textAlign: 'center',
                        fontSize: '0.75rem',
                        padding: '0.35rem',
                        background: '#f1f5f9',
                        borderRadius: '4px',
                        color: '#0f172a',
                        fontWeight: '600'
                      }}
                    >
                      Profile
                    </Link>
                    <button
                      onClick={() => onBook && onBook(p)}
                      style={{
                        flex: '1',
                        fontSize: '0.75rem',
                        padding: '0.35rem',
                        background: '#4f46e5',
                        borderRadius: '4px',
                        color: '#ffffff',
                        border: 'none',
                        fontWeight: '700',
                        cursor: 'pointer'
                      }}
                    >
                      Book
                    </button>
                  </div>
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>
    </div>
  );
}
