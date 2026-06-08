import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

// DESIGN.MD tokens
const NM_OUT_SM = '3px 3px 6px #b5b3b2, -3px -3px 6px #ffffff';
const NM_OUT_MD = '6px 6px 12px #b5b3b2, -6px -6px 12px #ffffff';
const NM_OUT_LG = '10px 10px 20px #b5b3b2, -10px -10px 20px #ffffff';
const NM_IN_SM = 'inset 3px 3px 6px #b5b3b2, inset -3px -3px 6px #ffffff';

const MONTSERRAT = "'Montserrat', sans-serif";

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

                            <motion.button
                                whileHover={{ boxShadow: NM_OUT_SM }}
                                whileTap={{ boxShadow: NM_IN_SM }}
                                style={{
                                    display: 'inline-flex', alignItems: 'center', gap: '8px',
                                    padding: '0.875rem 1.75rem',
                                    background: '#E7E5E4', color: '#334155',
                                    fontFamily: MONTSERRAT, fontSize: '0.875rem', fontWeight: 700,
                                    borderRadius: '8px', border: 'none', cursor: 'pointer',
                                    boxShadow: NM_OUT_SM,
                                    transition: 'all 120ms cubic-bezier(0.25, 0, 0, 1)'
                                }}
                            >
                                <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M8 5v14l11-7z"/>
                                </svg>
                                Lihat Demo
                            </motion.button>
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
                        <div className="relative rounded-3xl overflow-hidden flex items-center justify-center"
                             style={{ height: '500px', background: '#ffffff', boxShadow: NM_OUT_LG }}>
                            <div style={{ textAlign: 'center', color: '#64748b' }}>
                                <svg width="64" height="64" fill="none" stroke="currentColor" strokeWidth="1" viewBox="0 0 24 24" style={{ margin: '0 auto 16px' }}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                </svg>
                                <span style={{ fontFamily: MONTSERRAT, fontWeight: 600, fontSize: '1rem' }}>Sistem Refraksi Digital</span>
                            </div>
                        </div>
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



