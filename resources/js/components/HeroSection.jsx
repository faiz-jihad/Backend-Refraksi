import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

// DESIGN.MD tokens
const NM_OUT_SM = '3px 3px 6px #b5b3b2, -3px -3px 6px #ffffff';
const NM_OUT_MD = '6px 6px 12px #b5b3b2, -6px -6px 12px #ffffff';
const NM_OUT_LG = '10px 10px 20px #b5b3b2, -10px -10px 20px #ffffff';
const NM_IN_SM = 'inset 3px 3px 6px #b5b3b2, inset -3px -3px 6px #ffffff';

const MONTSERRAT = "'Montserrat', sans-serif";

function InteractiveDashboard() {
    const [stableDistance, setStableDistance] = useState(35);
    const [lightLevel, setLightLevel] = useState(94);
    
    useEffect(() => {
        const interval = setInterval(() => {
            setStableDistance(p => {
                const delta = (Math.random() - 0.5) * 2;
                const next = Math.round(p + delta);
                return next >= 33 && next <= 37 ? next : p;
            });
            setLightLevel(p => {
                const delta = (Math.random() - 0.5) * 4;
                const next = Math.round(p + delta);
                return next >= 90 && next <= 98 ? next : p;
            });
        }, 1500);
        return () => clearInterval(interval);
    }, []);

    return (
        <div style={{
            width: '100%',
            height: '500px',
            background: '#E7E5E4',
            borderRadius: '24px',
            padding: '20px',
            boxShadow: NM_OUT_LG,
            display: 'flex',
            flexDirection: 'column',
            gap: '16px',
            position: 'relative',
            overflow: 'hidden',
        }}>
            {/* Header info */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#00A63D', animation: 'pulse 1.5s infinite' }} />
                    <span style={{ fontFamily: MONTSERRAT, fontSize: '10px', fontWeight: 700, color: '#006666', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                        Diagnostics Unit Active
                    </span>
                </div>
                <span style={{ fontFamily: MONTSERRAT, fontSize: '9px', fontWeight: 600, color: '#94a3b8' }}>v2.5.0-Stable</span>
            </div>

            {/* Simulated Retina Scan Viewport */}
            <div style={{
                flex: 1,
                minHeight: 0,
                borderRadius: '16px',
                background: '#E7E5E4',
                boxShadow: NM_IN_SM,
                position: 'relative',
                overflow: 'hidden',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
            }}>
                {/* Scanner Grid Lines */}
                <div style={{
                    position: 'absolute',
                    inset: '10px',
                    border: '1px dashed rgba(0, 102, 102, 0.15)',
                    borderRadius: '12px',
                    pointerEvents: 'none'
                }} />
                
                {/* Crosshair */}
                <svg width="100%" height="100%" style={{ position: 'absolute', pointerEvents: 'none' }}>
                    <line x1="50%" y1="10%" x2="50%" y2="90%" stroke="rgba(0, 102, 102, 0.08)" strokeDasharray="4 4" />
                    <line x1="10%" y1="50%" x2="90%" y2="50%" stroke="rgba(0, 102, 102, 0.08)" strokeDasharray="4 4" />
                    <circle cx="50%" cy="50%" r="40" fill="none" stroke="rgba(0, 102, 102, 0.12)" strokeWidth="1" />
                    <circle cx="50%" cy="50%" r="80" fill="none" stroke="rgba(0, 102, 102, 0.08)" strokeWidth="1" />
                </svg>

                {/* Animated Eye Scan Graphic */}
                <div style={{ position: 'relative', width: '120px', height: '120px', display: 'flex', alignItems: 'center', justifyItems: 'center' }}>
                    {/* Outer pulsing ring */}
                    <motion.div
                        animate={{ scale: [1, 1.15, 1], opacity: [0.3, 0.6, 0.3] }}
                        transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                        style={{
                            position: 'absolute',
                            inset: 0,
                            borderRadius: '50%',
                            border: '2px solid #006666',
                        }}
                    />
                    {/* Inner eye lens container */}
                    <div style={{
                        position: 'absolute',
                        inset: '16px',
                        borderRadius: '50%',
                        background: '#E7E5E4',
                        boxShadow: NM_OUT_SM,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}>
                        <svg width="50" height="50" viewBox="0 0 24 24" fill="none" stroke="#006666" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                            <circle cx="12" cy="12" r="3" fill="#006666" fillOpacity="0.2" />
                        </svg>
                    </div>

                    {/* Scanning Laser Bar */}
                    <motion.div
                        animate={{ top: ['0%', '100%', '0%'] }}
                        transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
                        style={{
                            position: 'absolute',
                            left: '-10px',
                            right: '-10px',
                            height: '2px',
                            background: '#00A63D',
                            boxShadow: '0 0 8px #00A63D',
                            zIndex: 2,
                            opacity: 0.8
                        }}
                    />
                </div>

                {/* Calibration Status Text overlays */}
                <div style={{ position: 'absolute', top: '16px', left: '16px', fontFamily: MONTSERRAT, fontSize: '8px', color: '#64748b' }}>
                    <div style={{ fontWeight: 700, color: '#1E2938' }}>ALIGNMENT: LOCK</div>
                    <div>X: +0.024 | Y: -0.012</div>
                </div>

                <div style={{ position: 'absolute', bottom: '16px', right: '16px', fontFamily: MONTSERRAT, fontSize: '8px', color: '#64748b', textAlign: 'right' }}>
                    <div style={{ fontWeight: 700, color: '#006666' }}>STABLE_DISTANCE</div>
                    <div>{stableDistance} cm [OK]</div>
                </div>
            </div>

            {/* Metrics Dashboard Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px' }}>
                <div style={{ padding: '10px', borderRadius: '12px', boxShadow: NM_IN_SM }}>
                    <div style={{ fontFamily: MONTSERRAT, fontSize: '7px', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>SPHERICAL (SPH)</div>
                    <div style={{ fontFamily: MONTSERRAT, fontWeight: 700, fontSize: '13px', color: '#006666', marginTop: '2px' }}>-1.50 OD</div>
                    <div style={{ fontFamily: MONTSERRAT, fontSize: '7px', color: '#64748b', marginTop: '1px' }}>-1.75 OS</div>
                </div>
                <div style={{ padding: '10px', borderRadius: '12px', boxShadow: NM_IN_SM }}>
                    <div style={{ fontFamily: MONTSERRAT, fontSize: '7px', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>CYLINDER (CYL)</div>
                    <div style={{ fontFamily: MONTSERRAT, fontWeight: 700, fontSize: '13px', color: '#004d4d', marginTop: '2px' }}>-0.25 OD</div>
                    <div style={{ fontFamily: MONTSERRAT, fontSize: '7px', color: '#64748b', marginTop: '1px' }}>-0.50 OS</div>
                </div>
                <div style={{ padding: '10px', borderRadius: '12px', boxShadow: NM_IN_SM }}>
                    <div style={{ fontFamily: MONTSERRAT, fontSize: '7px', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>LIGHT QUALITY</div>
                    <div style={{ fontFamily: MONTSERRAT, fontWeight: 700, fontSize: '13px', color: '#00A63D', marginTop: '2px' }}>{lightLevel}%</div>
                    <div style={{ fontFamily: MONTSERRAT, fontSize: '7px', color: '#64748b', marginTop: '1px' }}>Optimal Range</div>
                </div>
            </div>
            
            {/* Acuity Status */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 14px', borderRadius: '12px', boxShadow: NM_OUT_SM }}>
                <span style={{ fontFamily: MONTSERRAT, fontSize: '9px', fontWeight: 700, color: '#1E2938' }}>Estimated Visual Acuity</span>
                <span style={{ fontFamily: MONTSERRAT, fontSize: '11px', fontWeight: 800, color: '#006666' }}>20/20 Snellen (Equivalent)</span>
            </div>
        </div>
    );
}

export default function HeroSection({ loginRoute, adminRoute, isAuthenticated }) {
    const [mouseCoords, setMouseCoords] = useState({ x: 0, y: 0 });
    const [typedText, setTypedText] = useState('');
    const heroRef = useRef(null);

    const [inferenceReady, setInferenceReady] = useState(false);

    useEffect(() => {
        const t = setTimeout(() => setInferenceReady(true), 300);
        return () => clearTimeout(t);
    }, []);

    // Mouse tracking for canvas tilt
    useEffect(() => {
        const onMove = (e) => {
            if (!heroRef.current) return;
            const rect = heroRef.current.getBoundingClientRect();
            setMouseCoords({
                x: ((e.clientX - rect.left) / rect.width - 0.5) * 2,
                y: ((e.clientY - rect.top) / rect.height - 0.5) * 2
            });
        };
        window.addEventListener('mousemove', onMove, { passive: true });
        return () => window.removeEventListener('mousemove', onMove);
    }, []);

    const container = { hidden: {}, visible: { transition: { staggerChildren: 0.1, delayChildren: 0.1 } } };
    const item = { hidden: { opacity: 0, y: 24 }, visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 90, damping: 20 } } };

    return (
        <section ref={heroRef} id="beranda" className="relative min-h-screen flex items-center"
            style={{ background: '#E7E5E4', overflow: 'hidden' }}>

            {/* Subtle bg gradients */}
            <div className="absolute inset-0 pointer-events-none">
                <div style={{ position: 'absolute', top: '-10%', left: '-5%', width: '500px', height: '500px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(255,255,255,0.7) 0%, transparent 70%)', filter: 'blur(40px)' }} />
                <div style={{ position: 'absolute', bottom: '-5%', right: '-5%', width: '400px', height: '400px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(181,179,178,0.5) 0%, transparent 70%)', filter: 'blur(40px)' }} />
            </div>

            <div className="relative z-10 w-full max-w-7xl mx-auto px-5 sm:px-8 lg:px-12 py-28 lg:py-32">
                <div className="grid lg:grid-cols-2 gap-14 lg:gap-20 items-center">

                    {/* LEFT: Content */}
                    <motion.div variants={container} initial="hidden" animate="visible" className="space-y-7">

                        {/* Badge */}
                        <motion.div variants={item}>
                            <span style={{
                                display: 'inline-flex', alignItems: 'center', gap: '8px',
                                padding: '6px 14px',
                                background: '#E7E5E4', boxShadow: NM_OUT_SM,
                                borderRadius: '100px',
                                fontFamily: MONTSERRAT, fontSize: '0.625rem', fontWeight: 700,
                                textTransform: 'uppercase', letterSpacing: '0.12em', color: '#006666'
                            }}>
                                <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#00A63D', display: 'inline-block', animation: 'pulse 1.5s ease-in-out infinite' }}></span>
                                Digital Eye Health Platform
                            </span>
                        </motion.div>

                        {/* Headline */}
                        <motion.h1 variants={item} style={{ fontFamily: MONTSERRAT, fontWeight: 700, fontSize: 'clamp(2.2rem, 5vw, 3.5rem)', lineHeight: 1.1, letterSpacing: '-0.03em', color: '#1E2938' }}>
                            Lindungi<br />
                            Penglihatanmu<br />
                            <span style={{ color: '#006666' }}>dari Sekarang</span>
                        </motion.h1>

                        <motion.div variants={item} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontFamily: MONTSERRAT, fontSize: '0.75rem', color: '#006666', fontWeight: 500 }}>
                            <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#00A63D', flexShrink: 0, animation: 'pulse 2s ease-in-out infinite' }}></span>
                            <span>System Status: Layanan Aktif</span>
                        </motion.div>

                        <motion.p variants={item} style={{ fontFamily: MONTSERRAT, fontSize: '0.9375rem', lineHeight: 1.7, color: '#334155', maxWidth: '480px' }}>
                            Platform kesehatan mata digital pertama di Indonesia.{' '}
                            <strong style={{ color: '#006666' }}>Deteksi dini</strong>,{' '}
                            <strong style={{ color: '#004d4d' }}>tes refraksi digital</strong>, dan{' '}
                            <strong style={{ color: '#00A63D' }}>konsultasi dokter</strong>{' '}
                            dalam satu ekosistem terintegrasi.
                        </motion.p>

                        {/* CTAs */}
                        <motion.div variants={item} style={{ display: 'flex', flexWrap: 'wrap', gap: '12px' }}>
                            <motion.a
                                href={isAuthenticated ? adminRoute : loginRoute}
                                whileHover={{ boxShadow: NM_OUT_SM, transform: 'translateY(1px)' }}
                                whileTap={{ boxShadow: NM_IN_SM, transform: 'translateY(2px)' }}
                                style={{
                                    display: 'inline-flex', alignItems: 'center', gap: '8px',
                                    padding: '0.875rem 1.75rem',
                                    background: '#006666', color: '#ffffff',
                                    fontFamily: MONTSERRAT, fontSize: '0.875rem', fontWeight: 700,
                                    borderRadius: '8px', textDecoration: 'none',
                                    boxShadow: NM_OUT_MD,
                                    transition: 'all 120ms cubic-bezier(0.25, 0, 0, 1)'
                                }}
                            >
                                <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z"/>
                                </svg>
                                Mulai Screening Gratis
                            </motion.a>

                            <motion.a
                                href="#fitur"
                                whileHover={{ boxShadow: NM_OUT_SM }}
                                whileTap={{ boxShadow: NM_IN_SM }}
                                style={{
                                    display: 'inline-flex', alignItems: 'center', gap: '8px',
                                    padding: '0.875rem 1.75rem',
                                    background: '#E7E5E4', color: '#334155',
                                    fontFamily: MONTSERRAT, fontSize: '0.875rem', fontWeight: 700,
                                    borderRadius: '8px', textDecoration: 'none',
                                    boxShadow: NM_OUT_SM,
                                    transition: 'all 120ms cubic-bezier(0.25, 0, 0, 1)'
                                }}
                            >
                                <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M8 5v14l11-7z"/>
                                </svg>
                                Lihat Demo
                            </motion.a>
                        </motion.div>

                        {/* Trust row */}
                        <motion.div variants={item} style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', paddingTop: '4px' }}>
                            {[
                                {
                                    icon: (
                                        <svg width="11" height="11" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24" style={{ flexShrink: 0 }}>
                                            <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                                            <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                                        </svg>
                                    ),
                                    text: 'HIPAA Compliant',
                                    color: '#475569'
                                },
                                {
                                    icon: (
                                        <svg width="11" height="11" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24" style={{ flexShrink: 0 }}>
                                            <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                                            <path d="M9 3v18M15 3v18M3 9h18M3 15h18" />
                                        </svg>
                                    ),
                                    text: 'Analisis Cepat',
                                    color: '#475569'
                                },
                                {
                                    icon: (
                                        <svg width="11" height="11" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24" style={{ flexShrink: 0 }}>
                                            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                                            <path d="M22 4L12 14.01l-3-3" />
                                        </svg>
                                    ),
                                    text: '98.7% Accuracy',
                                    color: '#475569'
                                }
                            ].map(t => (
                                <span key={t.text} style={{ display: 'flex', alignItems: 'center', gap: '6px', fontFamily: MONTSERRAT, fontSize: '0.6875rem', fontWeight: 600, color: t.color, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                                    {t.icon} {t.text}
                                </span>
                            ))}
                        </motion.div>
                    </motion.div>

                    {/* RIGHT: Image/Graphics Placeholder */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.9, ease: 'easeOut', delay: 0.2 }}
                        className="relative hidden lg:block"
                    >
                        <InteractiveDashboard />
                    </motion.div>
                </div>
            </div>

            {/* Scroll indicator */}
            <motion.div
                animate={{ y: [0, 8, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
                style={{
                    position: 'absolute', bottom: '32px', left: '50%', transform: 'translateX(-50%)',
                    display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px',
                    fontFamily: MONTSERRAT, fontSize: '9px', textTransform: 'uppercase', letterSpacing: '0.15em', color: '#94a3b8'
                }}
            >
                <span>Scroll</span>
                <div style={{ width: '1px', height: '24px', background: 'linear-gradient(to bottom, #b5b3b2, transparent)' }} />
            </motion.div>
        </section>
    );
}



