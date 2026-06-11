/**
 * MobileShowcase — App Download Section
 * Premium dark with phone mockup, QR, store badges, APK download
 */
import React from 'react';
import { motion } from 'framer-motion';
import { T } from './WelcomeApp';
import { Smartphone, Download, QrCode, Star } from 'lucide-react';

/* Phone mockup SVG illustration */
function PhoneMockup() {
    return (
        <motion.div
            animate={{ y: [0, -12, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
            style={{ position: 'relative', width: '240px', margin: '0 auto' }}
        >
            {/* Glow */}
            <div style={{ position: 'absolute', bottom: '-30px', left: '50%', transform: 'translateX(-50%)', width: '180px', height: '60px', borderRadius: '50%', background: `radial-gradient(ellipse, rgba(14,165,233,0.25), transparent)`, filter: 'blur(20px)' }} />

            {/* Phone outer */}
            <div style={{
                width: '240px', height: '490px', borderRadius: '40px',
                background: 'linear-gradient(145deg, #1a2744, #0f172a)',
                border: '2px solid rgba(255,255,255,0.15)',
                boxShadow: '0 32px 80px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.1)',
                position: 'relative', overflow: 'hidden',
                display: 'flex', flexDirection: 'column',
            }}>
                {/* Top notch */}
                <div style={{ position: 'absolute', top: '12px', left: '50%', transform: 'translateX(-50%)', width: '80px', height: '18px', borderRadius: '99px', background: '#050A14', zIndex: 10 }} />

                {/* Screen content */}
                <div style={{ flex: 1, padding: '50px 12px 16px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    {/* Status bar */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.55rem', color: 'rgba(255,255,255,0.6)', padding: '0 4px' }}>
                        <span>9:41</span><span>▶▶▶▶ 100%</span>
                    </div>

                    {/* App header */}
                    <div style={{ padding: '12px', borderRadius: '14px', background: 'rgba(14,165,233,0.12)', border: `1px solid rgba(14,165,233,0.2)` }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                            <img src="/favicon.svg" alt="Logo" style={{ width: '28px', height: '28px', objectFit: 'contain' }} />
                            <span style={{ fontSize: '0.7rem', fontWeight: 700, color: '#fff' }}>MataCeria</span>
                        </div>
                        <div style={{ fontSize: '0.55rem', color: 'rgba(255,255,255,0.5)' }}>Diagnostik Aktif</div>
                        <div style={{ fontSize: '0.8rem', fontWeight: 800, color: T.green, marginTop: '2px' }}>20/20 · Normal</div>
                    </div>

                    {/* Metrics mini */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                        {[['SPH', '-1.50', T.brand], ['CYL', '-0.25', T.brand2], ['Akurasi', '98%', T.green], ['Status', 'Sehat', '#F59E0B']].map(([l, v, c]) => (
                            <div key={l} style={{ padding: '10px', borderRadius: '10px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)' }}>
                                <div style={{ fontSize: '0.5rem', color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{l}</div>
                                <div style={{ fontSize: '0.75rem', fontWeight: 700, color: c, marginTop: '2px' }}>{v}</div>
                            </div>
                        ))}
                    </div>

                    {/* Scan button */}
                    <div style={{ marginTop: 'auto', padding: '12px', borderRadius: '12px', background: `linear-gradient(135deg, ${T.brand}, ${T.brand2})`, textAlign: 'center', cursor: 'default' }}>
                        <div style={{ fontSize: '0.65rem', fontWeight: 700, color: '#fff' }}>▶ Mulai Tes Baru</div>
                    </div>
                </div>
            </div>
        </motion.div>
    );
}

/* QR Code placeholder */
function QRPlaceholder() {
    return (
        <div style={{ width: '100px', height: '100px', background: '#fff', borderRadius: '12px', padding: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg viewBox="0 0 21 21" width="84" height="84" xmlns="http://www.w3.org/2000/svg" fill="#000">
                <rect x="0" y="0" width="8" height="8" /><rect x="2" y="2" width="4" height="4" fill="#fff" />
                <rect x="13" y="0" width="8" height="8" /><rect x="15" y="2" width="4" height="4" fill="#fff" />
                <rect x="0" y="13" width="8" height="8" /><rect x="2" y="15" width="4" height="4" fill="#fff" />
                <rect x="10" y="3" width="2" height="2" /><rect x="10" y="7" width="2" height="2" />
                <rect x="14" y="11" width="2" height="2" /><rect x="10" y="11" width="2" height="2" />
                <rect x="12" y="13" width="2" height="2" /><rect x="16" y="15" width="4" height="2" />
                <rect x="10" y="17" width="2" height="2" /><rect x="14" y="19" width="4" height="2" />
                <rect x="3" y="10" width="2" height="2" /><rect x="7" y="10" width="2" height="2" />
            </svg>
        </div>
    );
}

export default function MobileShowcase() {
    return (
        <section id="app" style={{ padding: '6rem 0', position: 'relative', overflow: 'hidden' }}>
            {/* BG accent */}
            <div style={{ position: 'absolute', inset: 0, background: `linear-gradient(135deg, ${T.surface}88 0%, ${T.bg} 50%, ${T.surface}44 100%)`, pointerEvents: 'none' }} />
            <div style={{ position: 'absolute', left: '-10%', top: '50%', transform: 'translateY(-50%)', width: '500px', height: '500px', borderRadius: '50%', background: `radial-gradient(circle, rgba(14,165,233,0.06), transparent 70%)`, filter: 'blur(40px)', pointerEvents: 'none' }} />

            <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '0 1.5rem', position: 'relative' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '5rem', alignItems: 'center' }} className="app-grid">

                    {/* Left: Phone */}
                    <div style={{ display: 'flex', justifyContent: 'center' }}>
                        <PhoneMockup />
                    </div>

                    {/* Right: Content */}
                    <motion.div
                        initial={{ opacity: 0, x: 40 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8, ease: [0.25, 0, 0, 1] }}
                        style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}
                    >
                        <div>
                            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '5px 14px', borderRadius: '99px', border: `1px solid rgba(16,185,129,0.3)`, background: 'rgba(16,185,129,0.06)', fontSize: '0.7rem', fontWeight: 700, color: T.green, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '1.25rem' }}>
                                <Smartphone size={12} />
                                Mobile App
                            </span>
                            <h2 style={{ fontSize: 'clamp(1.875rem, 4vw, 2.75rem)', fontWeight: 800, letterSpacing: '-0.04em', color: T.text, margin: '0 0 1rem', lineHeight: 1.15 }}>
                                Di saku kamu,<br />
                                <span style={{ background: `linear-gradient(135deg, ${T.green}, ${T.brand2})`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                                    kapan saja.
                                </span>
                            </h2>
                            <p style={{ fontSize: '1rem', color: T.text2, lineHeight: 1.7, margin: 0 }}>
                                Unduh aplikasi MataCeria dan nikmati pengalaman tes mata digital yang mulus di mana saja. Gratis, tanpa langganan.
                            </p>
                        </div>

                        {/* Rating */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <div style={{ display: 'flex', gap: '3px' }}>
                                {[...Array(5)].map((_, i) => <Star key={i} size={16} fill="#F59E0B" color="#F59E0B" />)}
                            </div>
                            <span style={{ fontSize: '0.875rem', fontWeight: 700, color: T.text }}>4.9</span>
                            <span style={{ fontSize: '0.845rem', color: T.text3 }}>· 12,000+ Ulasan</span>
                        </div>

                        {/* Download Buttons */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            {/* APK Direct */}
                            <a
                                href="/downloads/mataceria-latest.apk"
                                download="MataCeria-Latest.apk"
                                style={{
                                    display: 'flex', alignItems: 'center', gap: '12px',
                                    padding: '1rem 1.5rem', borderRadius: '14px',
                                    background: `linear-gradient(135deg, ${T.brand}, ${T.brand2})`,
                                    color: '#fff', textDecoration: 'none',
                                    boxShadow: `0 0 32px rgba(14,165,233,0.3)`,
                                    transition: 'box-shadow 0.2s',
                                }}
                                onMouseEnter={e => e.currentTarget.style.boxShadow = `0 0 48px rgba(14,165,233,0.5)`}
                                onMouseLeave={e => e.currentTarget.style.boxShadow = `0 0 32px rgba(14,165,233,0.3)`}
                            >
                                <Download size={22} />
                                <div>
                                    <div style={{ fontSize: '0.65rem', opacity: 0.8, letterSpacing: '0.05em', textTransform: 'uppercase' }}>Download Langsung</div>
                                    <div style={{ fontSize: '1rem', fontWeight: 700, letterSpacing: '-0.02em' }}>APK Android</div>
                                </div>
                                <span style={{ marginLeft: 'auto', fontSize: '0.72rem', opacity: 0.8, background: 'rgba(255,255,255,0.15)', padding: '3px 8px', borderRadius: '6px' }}>v2.5.0</span>
                            </a>

                            {/* Store badges */}
                            <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                                {[
                                    { store: 'Google Play', sub: 'Tersedia di', icon: '▶' },
                                    { store: 'App Store', sub: 'Download di', icon: '⬇' },
                                ].map(b => (
                                    <a key={b.store} href="#" onClick={e => { e.preventDefault(); alert(`${b.store} akan segera hadir!`); }}
                                        style={{
                                            flex: 1, minWidth: '140px', display: 'flex', alignItems: 'center', gap: '10px',
                                            padding: '0.875rem 1.25rem', borderRadius: '12px',
                                            border: `1px solid ${T.border2}`, background: T.surface,
                                            color: T.text, textDecoration: 'none', transition: 'all 0.2s',
                                        }}
                                        onMouseEnter={e => e.currentTarget.style.background = T.surface2}
                                        onMouseLeave={e => e.currentTarget.style.background = T.surface}
                                    >
                                        <span style={{ fontSize: '1.25rem' }}>{b.icon}</span>
                                        <div>
                                            <div style={{ fontSize: '0.6rem', color: T.text3 }}>{b.sub}</div>
                                            <div style={{ fontSize: '0.8rem', fontWeight: 700 }}>{b.store}</div>
                                        </div>
                                    </a>
                                ))}
                            </div>
                        </div>

                        {/* QR */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1rem', borderRadius: '14px', border: `1px solid ${T.border}`, background: T.surface }}>
                            <QRPlaceholder />
                            <div>
                                <div style={{ fontSize: '0.875rem', fontWeight: 700, color: T.text, marginBottom: '0.25rem' }}>Scan QR Code</div>
                                <div style={{ fontSize: '0.8rem', color: T.text2, lineHeight: 1.5 }}>Arahkan kamera HP ke kode ini untuk langsung download.</div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>

            <style>{`
                @media(max-width: 1024px) { .app-grid { grid-template-columns: 1fr !important; } }
            `}</style>
        </section>
    );
}
