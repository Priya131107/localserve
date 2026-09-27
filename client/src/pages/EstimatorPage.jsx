import React from 'react';
import { Link } from 'react-router-dom';
import CostEstimator from '../components/CostEstimator';
import { HelpCircle, ArrowRight, Sparkles, ShieldCheck, IndianRupee } from 'lucide-react';

export default function EstimatorPage() {
  return (
    <div style={{ minHeight: '85vh' }}>
      {/* Hero header with dark gradient */}
      <section style={{
        background: 'linear-gradient(135deg, #0b0f19 0%, #1e1b4b 50%, #312e81 100%)',
        padding: '4.5rem 0 6rem',
        position: 'relative',
        overflow: 'hidden',
        textAlign: 'center'
      }}>
        {/* Ambient orbs */}
        <div style={{ position: 'absolute', top: '-10%', left: '15%', width: '450px', height: '450px', background: 'radial-gradient(circle, rgba(13, 148, 136, 0.25) 0%, rgba(0,0,0,0) 70%)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', bottom: '-5%', right: '10%', width: '350px', height: '350px', background: 'radial-gradient(circle, rgba(245, 158, 11, 0.15) 0%, rgba(0,0,0,0) 70%)', pointerEvents: 'none' }} />

        <div className="container" style={{ position: 'relative', zIndex: 10 }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
            background: 'rgba(255, 255, 255, 0.07)', backdropFilter: 'blur(8px)',
            border: '1px solid rgba(255, 255, 255, 0.15)',
            padding: '0.4rem 1rem', borderRadius: 'var(--radius-full)',
            marginBottom: '1.5rem', fontSize: '0.84rem', fontWeight: '700', color: '#a5b4fc'
          }}>
            <IndianRupee size={14} />
            <span>Transparent Indian Market Rates</span>
          </div>

          <h1 style={{ fontSize: 'clamp(2rem, 4.5vw, 3.2rem)', fontWeight: '800', color: '#ffffff', letterSpacing: '-0.03em', marginBottom: '1rem', lineHeight: '1.15' }}>
            Dynamic Service Cost Estimator
          </h1>
          <p style={{ color: '#cbd5e1', fontSize: 'clamp(1rem, 2vw, 1.15rem)', maxWidth: '680px', margin: '0 auto', lineHeight: '1.6' }}>
            Get transparent, instant estimates for AC repairs, plumbing, electrical installations, deep cleaning, and tuition — before you book a single appointment.
          </p>
        </div>
      </section>

      {/* Calculator Section */}
      <section style={{ padding: '0 0 5rem', background: 'var(--bg-main)', marginTop: '-3rem', position: 'relative', zIndex: 20 }}>
        <div className="container">
          <CostEstimator />
        </div>
      </section>

      {/* FAQ Section */}
      <section style={{ padding: '4rem 0 5rem', background: '#ffffff', borderTop: '1px solid var(--border-subtle)' }}>
        <div className="container" style={{ maxWidth: '960px' }}>
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <span className="badge badge-primary" style={{ marginBottom: '0.5rem' }}>
              Pricing FAQ
            </span>
            <h2 style={{ fontSize: '2rem', fontWeight: '800', color: 'var(--text-main)', letterSpacing: '-0.02em' }}>
              Frequently Asked Pricing Questions
            </h2>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
            {[
              { q: 'Are these prices fixed or estimated?', a: 'The estimator provides realistic standard market ranges in INR (₹). Providers will quote final charges upfront based on your exact inspection.' },
              { q: 'Do I need to pay any advance?', a: 'No advance is ever required. You pay the service provider directly after the job is completed and inspected by you.' },
              { q: 'What if spare parts are required?', a: 'If replacement materials are needed, the technician will show you genuine parts and invoice cost before installation.' },
              { q: 'Is there an emergency surcharge?', a: 'Standard visiting charges apply. Night-time emergency SOS dispatches may carry a nominal convenience charge as indicated on the provider profile.' }
            ].map((faq, i) => (
              <div key={i} className="glass-card" style={{ padding: '1.5rem', borderRadius: 'var(--radius-lg)', background: '#ffffff' }}>
                <h4 style={{ fontSize: '1rem', fontWeight: '800', color: 'var(--text-main)', marginBottom: '0.5rem', display: 'flex', alignItems: 'flex-start', gap: '0.5rem' }}>
                  <HelpCircle size={18} color="var(--primary)" style={{ flexShrink: 0, marginTop: '2px' }} />
                  {faq.q}
                </h4>
                <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', lineHeight: '1.55', margin: 0, paddingLeft: '1.65rem' }}>
                  {faq.a}
                </p>
              </div>
            ))}
          </div>

          {/* CTA */}
          <div style={{ textAlign: 'center', marginTop: '3.5rem' }}>
            <Link to="/services" className="btn btn-primary btn-lg" style={{ fontWeight: '800', borderRadius: 'var(--radius-full)' }}>
              <span>Find Service Providers Now</span>
              <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
