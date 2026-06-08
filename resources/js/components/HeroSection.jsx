/**
 * HeroSection — Full-screen premium hero
 * Dark AI HealthTech aesthetic: Linear + Stripe + Raycast-inspired
 */
import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { T } from './WelcomeApp';
import { Eye, Zap, ShieldCheck, ChevronRight, ArrowRight } from 'lucide-react';

/* ─── Animated Scanning Dashboard (right panel) ─── */
function DiagnosticsPanel() {
    const [sph, setSph] = useState(-1.50);
    const [acuity, setAcuity] = useState(98);
    const [scanLine, setScanLine] = useState(0);

    useEffect(() => {
        const iv = setInterval(() => {
            setSph(p => { const d = (Math.random() - 0.5) * 0.25; const n = +(p + d).toFixed(2); return n >= -2.5 && n <= -0.5 ? n : p; });
            setAcuity(p => { const d = Math.round((Math.random() - 0.5) * 4); const n = p + d; return n >= 90 && n <= 100 ? n : p; });
        }, 2200);
        return () => clearInterval(iv);
    }, []);

    useEffect(() => {
        let raf;
        let start = null;
        const duration = 3000;
        const animate = ts => {
            if (!start) start = ts;
            const pct = ((ts - start) % duration) / duration;
            setScanLine(pct * 100);
            raf = requestAnimationFrame(animate);
        };
        raf = requestAnimationFrame(animate);
        return () => cancelAnimationFrame(raf);
    }, []);

    const metrics = [
        { label: 'SPH', value: `${sph > 0 ? '+' : ''}${sph.toFixed(2)}`, unit: 'OD', color: T.brand },
        { label: 'CYL', value: '-0.25', unit: 'OD', color: T.brand2 },
        { label: 'Akurasi', value: `${acuity}%`, unit: 'Optimal', color: T.green },
    ];

    return (
        <div style={{
            background: T.surface, border: `1px solid ${T.border2}`,
            borderRadius: '24px', padding: '1.5rem',
            boxShadow: `0 0 80px rgba(14,165,233,0.1), 0 32px 64px rgba(0,0,0,0.4)`,
            width: '100%', display: 'flex', flexDirection: 'column', gap: '1.25rem',
            position: 'relative', overflow: 'hidden',
        }}>
            {/* Top glow accent */}
            <div style={{ position: 'absolute', top: 0, left: '50%', transform: 'translateX(-50%)', width: '60%', height: '1px', background: `linear-gradient(90deg, transparent, ${T.brand}, transparent)` }} />

            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ width: '7px', height: '7px', borderRadius: '50%', background: T.green, boxShadow: `0 0 8px ${T.green}`, animation: 'wc-pulse 2s infinite' }} />
                    <span style={{ fontSize: '0.65rem', fontWeight: 700, color: T.green, textTransform: 'uppercase', letterSpacing: '0.1em' }}>Diagnostics Active</span>
                </div>
                <span style={{ fontSize: '0.6rem', color: T.text3, fontWeight: 600 }}>v2.5 · Stable</span>
            </div>

            {/* Scanner viewport */}
            <div style={{
                position: 'relative', borderRadius: '16px', overflow: 'hidden',
                background: `linear-gradient(135deg, ${T.bg} 0%, rgba(14,165,233,0.03) 100%)`,
                border: `1px solid ${T.border}`, height: '220px',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
                {/* Grid lines */}
                <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', opacity: 0.15 }}>
                    <defs>
                        <pattern id="hero-grid" width="24" height="24" patternUnits="userSpaceOnUse">
                            <path d="M 24 0 L 0 0 0 24" fill="none" stroke={T.brand} strokeWidth="0.5" />
                        </pattern>
                    </defs>
                    <rect width="100%" height="100%" fill="url(#hero-grid)" />
                </svg>

                {/* Target crosshairs */}
                <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}>
                    <line x1="50%" y1="0" x2="50%" y2="100%" stroke={T.brand} strokeWidth="0.5" strokeOpacity="0.2" strokeDasharray="4 6" />
                    <line x1="0" y1="50%" x2="100%" y2="50%" stroke={T.brand} strokeWidth="0.5" strokeOpacity="0.2" strokeDasharray="4 6" />
                    <circle cx="50%" cy="50%" r="35" fill="none" stroke={T.brand} strokeWidth="0.8" strokeOpacity="0.3" />
                    <circle cx="50%" cy="50%" r="65" fill="none" stroke={T.brand} strokeWidth="0.5" strokeOpacity="0.15" />
                    {/* Corner brackets */}
                    {[[-1,-1],[1,-1],[-1,1],[1,1]].map(([sx,sy], i) => (
                        <g key={i} transform={`translate(${sx === -1 ? '20%' : '80%'}, ${sy === -1 ? '20%' : '80%'})`}>
                            <path d={`M ${sx * -10} 0 L 0 0 L 0 ${sy * 10}`} fill="none" stroke={T.brand} strokeWidth="1.5" strokeOpacity="0.6" />
                        </g>
                    ))}
                </svg>

                {/* Scan laser line */}
                <div style={{
                    position: 'absolute', left: 0, right: 0, height: '2px',
                    top: `${scanLine}%`,
                    background: `linear-gradient(90deg, transparent, ${T.brand}, ${T.brand2}, transparent)`,
                    boxShadow: `0 0 12px ${T.brand}`,
                    opacity: scanLine > 95 || scanLine < 5 ? 0 : 1,
                    transition: 'opacity 0.2s',
                }} />

                {/* Eye icon center */}
                <div style={{ position: 'relative', zIndex: 2 }}>
                    <motion.div
                        animate={{ scale: [1, 1.08, 1], opacity: [0.4, 0.8, 0.4] }}
                        transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                        style={{ position: 'absolute', inset: '-20px', borderRadius: '50%', border: `2px solid ${T.brand}`, zIndex: 0 }}
                    />
                    <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: `radial-gradient(circle, rgba(14,165,233,0.15), transparent)`, border: `1px solid rgba(14,165,233,0.3)`, display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', zIndex: 1 }}>
                        <Eye size={28} color={T.brand} />
                    </div>
                </div>

                {/* Calibration overlays */}
                <div style={{ position: 'absolute', top: '12px', left: '14px' }}>
                    <div style={{ fontSize: '0.55rem', fontWeight: 700, color: T.text, letterSpacing: '0.05em' }}>ALIGNMENT: LOCK</div>
                    <div style={{ fontSize: '0.5rem', color: T.text3, marginTop: '1px' }}>X: +0.024 | Y: -0.012</div>
                </div>
                <div style={{ position: 'absolute', bottom: '12px', right: '14px', textAlign: 'right' }}>
                    <div style={{ fontSize: '0.55rem', fontWeight: 700, color: T.brand, letterSpacing: '0.05em' }}>STABLE_DIST</div>
                    <div style={{ fontSize: '0.5rem', color: T.text3, marginTop: '1px' }}>35 cm [OK]</div>
                </div>
            </div>

            {/* Metrics grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.75rem' }}>
                {metrics.map(m => (
                    <div key={m.label} style={{ padding: '0.875rem', borderRadius: '12px', background: T.bg, border: `1px solid ${T.border}` }}>
                        <div style={{ fontSize: '0.6rem', color: T.text3, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.25rem' }}>{m.label}</div>
                        <div style={{ fontSize: '1rem', fontWeight: 800, color: m.color, letterSpacing: '-0.02em' }}>{m.value}</div>
                        <div style={{ fontSize: '0.55rem', color: T.text3, marginTop: '2px' }}>{m.unit}</div>
                    </div>
                ))}
            </div>

            {/* Acuity bar */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.75rem 1rem', borderRadius: '12px', background: T.bg, border: `1px solid ${T.border}` }}>
                <span style={{ fontSize: '0.72rem', fontWeight: 600, color: T.text2 }}>Visual Acuity</span>
                <span style={{ fontSize: '0.875rem', fontWeight: 800, color: T.green }}>20/20 Snellen ✓</span>
            </div>

            {/* Floating badges */}
            <motion.div
                animate={{ y: [0, -6, 0] }}
                transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
                style={{ position: 'absolute', top: '180px', right: '-16px', background: T.surface2, border: `1px solid ${T.border2}`, borderRadius: '12px', padding: '8px 12px', boxShadow: '0 8px 24px rgba(0,0,0,0.4)', zIndex: 10 }}
            >
                <div style={{ fontSize: '0.6rem', color: T.text3, marginBottom: '2px' }}>AI Score</div>
                <div style={{ fontSize: '1rem', fontWeight: 800, color: T.green }}>9.8/10</div>
            </motion.div>
        </div>
    );
}

/* ─── Hero Section ─── */
const stagger = { hidden: {}, visible: { transition: { staggerChildren: 0.12, delayChildren: 0.2 } } };
const fadeUp = { hidden: { opacity: 0, y: 28 }, visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 80, damping: 20 } } };

export default function HeroSection({ loginRoute, adminRoute, isAuthenticated }) {
    return (
        <section
            id="beranda"
            style={{
                position: 'relative',
                minHeight: '100vh',
                display: 'flex',
                alignItems: 'center',
                overflow: 'hidden',
                paddingTop: '80px',
            }}
        >
            {/* Background effects */}
            <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
                {/* Grid */}
                <div style={{ position: 'absolute', inset: 0, backgroundImage: `linear-gradient(rgba(14,165,233,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(14,165,233,0.04) 1px, transparent 1px)`, backgroundSize: '48px 48px', maskImage: 'radial-gradient(ellipse at center, black 40%, transparent 80%)' }} />
                {/* Glow orbs */}
                <div style={{ position: 'absolute', top: '-20%', left: '-10%', width: '700px', height: '700px', borderRadius: '50%', background: `radial-gradient(circle, rgba(14,165,233,0.07) 0%, transparent 60%)`, filter: 'blur(40px)' }} />
                <div style={{ position: 'absolute', bottom: '-10%', right: '-5%', width: '500px', height: '500px', borderRadius: '50%', background: `radial-gradient(circle, rgba(139,92,246,0.06) 0%, transparent 60%)`, filter: 'blur(40px)' }} />
            </div>

            <div style={{ position: 'relative', zIndex: 1, width: '100%', maxWidth: '1400px', margin: '0 auto', padding: '4rem 1.5rem' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4rem', alignItems: 'center' }} className="hero-grid">

                    {/* ─── LEFT: Content ─── */}
                    <motion.div
                        variants={stagger}
                        initial="hidden"
                        animate="visible"
                        style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}
                    >
                        {/* Badge */}
                        <motion.div variants={fadeUp}>
                            <span style={{
                                display: 'inline-flex', alignItems: 'center', gap: '8px',
                                padding: '5px 14px', borderRadius: '99px',
                                border: `1px solid rgba(14,165,233,0.3)`,
                                background: 'rgba(14,165,233,0.06)',
                                fontSize: '0.7rem', fontWeight: 700, color: T.brand,
                                textTransform: 'uppercase', letterSpacing: '0.1em',
                            }}>
                                <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: T.green, animation: 'wc-pulse 2s infinite' }} />
                                Digital Eye Health Platform
                                <ChevronRight size={12} />
                            </span>
                        </motion.div>

                        {/* Headline */}
                        <motion.h1 variants={fadeUp} style={{ fontSize: 'clamp(2.5rem, 5vw, 4rem)', fontWeight: 900, letterSpacing: '-0.045em', lineHeight: 1.05, margin: 0, color: T.text }}>
                            Lindungi<br />
                            Penglihatanmu<br />
                            <span style={{ background: `linear-gradient(135deg, ${T.brand} 0%, ${T.accent} 100%)`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                                dari Sekarang
                            </span>
                        </motion.h1>

                        {/* Status */}
                        <motion.div variants={fadeUp} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: T.green, boxShadow: `0 0 8px ${T.green}`, animation: 'wc-pulse 2s infinite' }} />
                            <span style={{ fontSize: '0.78rem', color: T.green, fontWeight: 600 }}>System Active · Siap Digunakan</span>
                        </motion.div>

                        {/* Description */}
                        <motion.p variants={fadeUp} style={{ fontSize: '1.05rem', lineHeight: 1.75, color: T.text2, margin: 0, maxWidth: '480px' }}>
                            Platform kesehatan mata digital pertama di Indonesia.{' '}
                            <span style={{ color: T.brand }}>Deteksi dini</span>,{' '}
                            <span style={{ color: T.brand2 }}>tes refraksi digital</span>, dan{' '}
                            <span style={{ color: T.green }}>konsultasi dokter</span>{' '}
                            dalam satu ekosistem terintegrasi berbasis AI.
                        </motion.p>

                        {/* CTA */}
                        <motion.div variants={fadeUp} style={{ display: 'flex', flexWrap: 'wrap', gap: '12px' }}>
                            <a
                                href={isAuthenticated ? adminRoute : loginRoute}
                                style={{
                                    display: 'inline-flex', alignItems: 'center', gap: '10px',
                                    padding: '0.9rem 1.875rem', borderRadius: '12px',
                                    background: `linear-gradient(135deg, ${T.brand}, ${T.brand2})`,
                                    color: '#fff', fontSize: '0.9rem', fontWeight: 700,
                                    textDecoration: 'none',
                                    boxShadow: `0 0 32px rgba(14,165,233,0.35)`,
                                    transition: 'all 0.2s',
                                }}
                                onMouseEnter={e => e.currentTarget.style.boxShadow = `0 0 48px rgba(14,165,233,0.55)`}
                                onMouseLeave={e => e.currentTarget.style.boxShadow = `0 0 32px rgba(14,165,233,0.35)`}
                            >
                                <Zap size={16} />
                                {isAuthenticated ? 'Buka Dashboard' : 'Mulai Screening Gratis'}
                            </a>
                            <a
                                href="#fitur"
                                style={{
                                    display: 'inline-flex', alignItems: 'center', gap: '10px',
                                    padding: '0.9rem 1.875rem', borderRadius: '12px',
                                    border: `1px solid ${T.border2}`, background: T.surface,
                                    color: T.text, fontSize: '0.9rem', fontWeight: 600,
                                    textDecoration: 'none', transition: 'all 0.2s',
                                }}
                                onMouseEnter={e => e.currentTarget.style.background = T.surface2}
                                onMouseLeave={e => e.currentTarget.style.background = T.surface}
                            >
                                Lihat Demo
                                <ArrowRight size={14} />
                            </a>
                        </motion.div>

                        {/* Trust badges */}
                        <motion.div variants={fadeUp} style={{ display: 'flex', flexWrap: 'wrap', gap: '1.5rem' }}>
                            {[
                                { icon: <ShieldCheck size={13} />, label: 'HIPAA Compliant' },
                                { icon: <Zap size={13} />, label: 'Analisis Cepat' },
                                { icon: <Eye size={13} />, label: '98.7% Accuracy' },
                            ].map(t => (
                                <span key={t.label} style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.72rem', fontWeight: 600, color: T.text3, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                                    <span style={{ color: T.brand }}>{t.icon}</span>
                                    {t.label}
                                </span>
                            ))}
                        </motion.div>
                    </motion.div>

                    {/* ─── RIGHT: Dashboard Panel ─── */}
                    <motion.div
                        initial={{ opacity: 0, x: 40 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.9, ease: [0.25, 0, 0, 1], delay: 0.3 }}
                        className="hero-panel"
                    >
                        <DiagnosticsPanel />
                    </motion.div>
                </div>
            </div>

            {/* Scroll cue */}
            <motion.div
                animate={{ y: [0, 8, 0] }}
                transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                style={{ position: 'absolute', bottom: '2rem', left: '50%', transform: 'translateX(-50%)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px' }}
            >
                <span style={{ fontSize: '0.6rem', textTransform: 'uppercase', letterSpacing: '0.15em', color: T.text3 }}>Scroll</span>
                <div style={{ width: '1px', height: '28px', background: `linear-gradient(to bottom, ${T.text3}, transparent)` }} />
            </motion.div>

            <style>{`
                @media (max-width: 1024px) { .hero-grid { grid-template-columns: 1fr !important; } .hero-panel { display: none !important; } }
            `}</style>
        </section>
    );
}
