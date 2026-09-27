import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, Users, Award, Heart, CheckCircle2, ArrowRight, Wrench, Zap, Star, Check, Globe, Code, Database, Layout } from 'lucide-react';

const TEAM_VALUES = [
  {
    icon: ShieldCheck,
    title: '100% Background Verified',
    desc: 'Every professional undergoes Aadhaar/Govt ID verification, reference checks, and practical skill evaluations before onboarding.',
    color: '#4f46e5',
    bg: '#eef2ff'
  },
  {
    icon: Award,
    title: 'Upfront Transparent Pricing',
    desc: 'No hidden fees or unexpected surge charges. View honest INR (₹) rates and dynamic estimates before you place any booking.',
    color: '#d97706',
    bg: '#fef3c7'
  },
  {
    icon: Heart,
    title: 'Direct Chat & Community Support',
    desc: 'Message providers directly in real time to coordinate exact timings, gate entries, and specific diagnostic symptoms.',
    color: '#0284c7',
    bg: '#e0f2fe'
  }
];

const TECH_STACK = [
  { name: 'Frontend', tech: 'React 18, Vite, Custom CSS System, Leaflet Maps, Lucide Icons', icon: Layout, color: '#4f46e5' },
  { name: 'Backend', tech: 'Node.js, Express.js, RESTful APIs, JWT Auth, Bcrypt Hashing', icon: Code, color: '#0d9488' },
  { name: 'Database', tech: 'MySQL with relational schema, indexes, foreign keys, cascading rules', icon: Database, color: '#d97706' },
  { name: 'Deployment', tech: 'Vite dev server (port 5173), Express API (port 5000), API proxy', icon: Globe, color: '#e11d48' }
];

export default function About() {
  return (
    <div>
      {/* Hero */}
      <section style={{
        background: 'linear-gradient(135deg, #0b0f19 0%, #1e1b4b 45%, #312e81 100%)',
        padding: '6rem 0',
        position: 'relative',
        overflow: 'hidden',
        textAlign: 'center'
      }}>
        <div style={{ position: 'absolute', top: '-10%', right: '10%', width: '500px', height: '500px', background: 'radial-gradient(circle, rgba(99, 102, 241, 0.25) 0%, rgba(0,0,0,0) 70%)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', bottom: '-10%', left: '15%', width: '400px', height: '400px', background: 'radial-gradient(circle, rgba(13, 148, 136, 0.2) 0%, rgba(0,0,0,0) 70%)', pointerEvents: 'none' }} />

        <div className="container" style={{ position: 'relative', zIndex: 10 }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
            background: 'rgba(255, 255, 255, 0.07)', backdropFilter: 'blur(8px)',
            border: '1px solid rgba(255, 255, 255, 0.15)',
            padding: '0.4rem 1.1rem', borderRadius: 'var(--radius-full)',
            marginBottom: '1.75rem', fontSize: '0.84rem', fontWeight: '700', color: '#a5b4fc'
          }}>
            <Star size={14} fill="currentColor" />
            <span>Our Mission & Values</span>
          </div>

          <h1 style={{
            fontSize: 'clamp(2.4rem, 5vw, 3.8rem)',
            fontWeight: '800', color: '#ffffff',
            lineHeight: '1.12', letterSpacing: '-0.035em',
            maxWidth: '900px', margin: '0 auto 1.25rem'
          }}>
            Empowering Local Service Professionals & Households
          </h1>
          <p style={{ color: '#cbd5e1', fontSize: 'clamp(1rem, 2vw, 1.2rem)', maxWidth: '740px', margin: '0 auto', lineHeight: '1.6' }}>
            Local Service Finder is a modern, transparent full-stack platform engineered to connect homeowners with verified local electricians, plumbers, technicians, mechanics, and tutors.
          </p>
        </div>
      </section>

      {/* Values / Pillars */}
      <section style={{ padding: '6rem 0', background: 'var(--bg-main)' }}>
        <div className="container">
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '1.75rem'
          }}>
            {TEAM_VALUES.map((v, i) => {
              const Icon = v.icon;
              return (
                <div key={i} className="glass-card glass-card-glow" style={{ padding: '2.25rem', background: '#ffffff', textAlign: 'center', borderRadius: 'var(--radius-xl)' }}>
                  <div style={{
                    width: '64px', height: '64px', borderRadius: '20px',
                    background: v.bg, color: v.color,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    margin: '0 auto 1.5rem',
                    boxShadow: `0 8px 20px ${v.color}20`
                  }}>
                    <Icon size={30} />
                  </div>
                  <h3 style={{ fontSize: '1.3rem', fontWeight: '800', color: 'var(--text-main)', marginBottom: '0.6rem' }}>
                    {v.title}
                  </h3>
                  <p style={{ fontSize: '0.92rem', color: 'var(--text-muted)', lineHeight: '1.55' }}>
                    {v.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Tech Stack */}
      <section style={{ padding: '5rem 0', background: '#ffffff', borderTop: '1px solid var(--border-subtle)' }}>
        <div className="container" style={{ maxWidth: '960px' }}>
          <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
            <span className="badge badge-primary" style={{ marginBottom: '0.5rem' }}>Technology</span>
            <h2 style={{ fontSize: '2.2rem', fontWeight: '800', color: 'var(--text-main)', letterSpacing: '-0.02em' }}>
              Engineering Architecture
            </h2>
            <p style={{ color: 'var(--text-muted)', maxWidth: '600px', margin: '0.5rem auto 0', fontSize: '1rem' }}>
              Built with a robust modern web stack designed for fast, accessible performance on mobile, tablet, and desktop.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.25rem' }}>
            {TECH_STACK.map((t, i) => {
              const Icon = t.icon;
              return (
                <div key={i} className="glass-card" style={{ padding: '1.5rem', borderRadius: 'var(--radius-lg)', background: '#ffffff' }}>
                  <div style={{
                    width: '40px', height: '40px', borderRadius: '10px',
                    background: `${t.color}12`, color: t.color,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    marginBottom: '1rem'
                  }}>
                    <Icon size={22} />
                  </div>
                  <strong style={{ display: 'block', color: t.color, fontSize: '0.88rem', fontWeight: '800', marginBottom: '0.35rem' }}>
                    {t.name}
                  </strong>
                  <span style={{ fontSize: '0.84rem', color: 'var(--text-muted)', lineHeight: '1.45' }}>
                    {t.tech}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Safety Guarantees */}
      <section style={{ padding: '5rem 0', background: 'var(--bg-main)' }}>
        <div className="container" style={{ maxWidth: '800px' }}>
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <span className="badge badge-success" style={{ marginBottom: '0.5rem' }}>Safety First</span>
            <h2 style={{ fontSize: '2rem', fontWeight: '800', color: 'var(--text-main)' }}>
              Our Safety & Trust Guarantees
            </h2>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {[
              'Every technician passes a 3-step verification: ID proof, address check, and practical skill assessment.',
              'All service visits are logged with real-time status tracking visible to the customer.',
              'Instant 1-click cancellation for any pending booking, free of charge.',
              'Post-service satisfaction guarantee with a 30-day warranty on workmanship.',
              'Encrypted JWT authentication protects all user sessions and personal data.',
              'Complete complaint escalation system with resolution within 48 working hours.'
            ].map((text, i) => (
              <div key={i} style={{
                display: 'flex', alignItems: 'flex-start', gap: '0.85rem',
                padding: '1.1rem 1.25rem',
                background: '#ffffff',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--border-subtle)',
                boxShadow: 'var(--shadow-sm)'
              }}>
                <div style={{
                  width: '28px', height: '28px', borderRadius: '50%',
                  background: '#ecfdf5', color: '#047857',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  flexShrink: 0, marginTop: '1px'
                }}>
                  <Check size={16} />
                </div>
                <span style={{ fontSize: '0.92rem', color: 'var(--text-main)', fontWeight: '600', lineHeight: '1.5' }}>
                  {text}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{
        padding: '5.5rem 0',
        background: 'linear-gradient(135deg, #4f46e5 0%, #3730a3 50%, #1e1b4b 100%)',
        textAlign: 'center'
      }}>
        <div className="container">
          <h2 style={{ fontSize: '2.4rem', fontWeight: '800', color: '#ffffff', marginBottom: '1rem', letterSpacing: '-0.02em' }}>
            Experience Trusted Local Services Today
          </h2>
          <p style={{ color: '#c7d2fe', fontSize: '1.1rem', maxWidth: '560px', margin: '0 auto 2.5rem', lineHeight: '1.6' }}>
            Find plumbers, electricians, cleaners, and mechanics ready to assist you right now — with verified credentials and transparent pricing.
          </p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
            <Link to="/services" className="btn btn-lg" style={{ background: '#ffffff', color: '#4f46e5', fontWeight: '800', borderRadius: 'var(--radius-full)', boxShadow: 'var(--shadow-xl)' }}>
              <span>Find Services Now</span>
              <ArrowRight size={18} />
            </Link>
            <Link to="/register" className="btn btn-outline btn-lg" style={{ border: '2px solid #ffffff', color: '#ffffff', fontWeight: '800', borderRadius: 'var(--radius-full)' }}>
              Join as Provider
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
