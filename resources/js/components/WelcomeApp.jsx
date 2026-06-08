import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import NavBar from './DarkNavbar';
import HeroSection from './HeroSection';
import BentoFeatures from './BentoFeatures';
import ProcessTimeline from './ProcessTimeline';
import StatsSection from './StatsSection';
import MobileShowcase from './MobileShowcase';
import TestimonialMarquee from './TestimonialMarquee';

const NM_OUT_SM = '3px 3px 6px #b5b3b2, -3px -3px 6px #ffffff';
const NM_OUT_MD = '6px 6px 12px #b5b3b2, -6px -6px 12px #ffffff';
const NM_IN_SM = 'inset 3px 3px 6px #b5b3b2, inset -3px -3px 6px #ffffff';
const MONTSERRAT = "'Montserrat', sans-serif";

export default function WelcomeApp({ loginRoute, adminRoute, isAuthenticated, userName, statsPatients, statsDoctors, doctors }) {
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 40);
        window.addEventListener('scroll', onScroll, { passive: true });
        return () => window.removeEventListener('scroll', onScroll);
    }, []);

    return (
        <>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.7 }}
                style={{
                    minHeight: '100vh',
                    background: '#E7E5E4',
                    fontFamily: MONTSERRAT,
                    overflowX: 'hidden',
                    color: '#1E2938'
                }}
            >
                {/* Navigation */}
                <NavBar
                    loginRoute={loginRoute}
                    adminRoute={adminRoute}
                    isAuthenticated={isAuthenticated}
                    userName={userName}
                    scrolled={scrolled}
                />

                <main>
                    {/* 1. Hero */}
                    <HeroSection
                        loginRoute={loginRoute}
                        adminRoute={adminRoute}
                        isAuthenticated={isAuthenticated}
                    />

                    {/* 2. Stats */}
                    <StatsSection statsPatients={statsPatients} statsDoctors={statsDoctors} />

                    {/* 3. Bento Features */}
                    <BentoFeatures doctors={doctors} />

                    {/* 4. Process Timeline */}
                    <ProcessTimeline />

                    {/* 5. Mobile App Showcase */}
                    <MobileShowcase />

                    {/* 6. Testimonials */}
                    <TestimonialMarquee />

                    {/* 7. Final CTA */}
                    <section id="tentang" style={{ padding: '7rem 0', background: '#E7E5E4', position: 'relative', overflow: 'hidden' }}>
                        {/* Background blobs */}
                        <div style={{ position: 'absolute', top: '20%', left: '15%', width: '400px', height: '400px', borderRadius: '50%', background: 'rgba(255,255,255,0.6)', filter: 'blur(70px)', pointerEvents: 'none' }} />
                        <div style={{ position: 'absolute', bottom: '10%', right: '10%', width: '300px', height: '300px', borderRadius: '50%', background: 'rgba(181,179,178,0.5)', filter: 'blur(60px)', pointerEvents: 'none' }} />

                        <div style={{ maxWidth: '56rem', margin: '0 auto', padding: '0 1.5rem', textAlign: 'center', position: 'relative', zIndex: 1 }}>
                            <motion.div
                                initial={{ opacity: 0, y: 24 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.5rem' }}
                            >
                                {/* Badge */}
                                <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '6px 16px', background: '#E7E5E4', boxShadow: NM_OUT_SM, borderRadius: '100px' }}>
                                    <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#00A63D', display: 'inline-block', animation: 'pulse 1.5s ease-in-out infinite' }}></span>
                                    <span style={{ fontFamily: MONTSERRAT, fontSize: '0.625rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.12em', color: '#006666' }}>Ready to Begin?</span>
                                </div>

                                {/* Heading */}
                                <h2 style={{ fontFamily: MONTSERRAT, fontWeight: 700, fontSize: 'clamp(2.5rem, 6vw, 5rem)', color: '#1E2938', letterSpacing: '-0.03em', lineHeight: 1.08 }}>
                                    Penglihatanmu<br />
                                    <span style={{ color: '#006666' }}>dimulai di sini.</span>
                                </h2>

                                <p style={{ fontFamily: MONTSERRAT, fontSize: '1.0625rem', color: '#64748b', lineHeight: 1.7, maxWidth: '480px' }}>
                                    Bergabunglah dengan {statsPatients || '50.000+'} pengguna yang sudah mempercayakan kesehatan mata mereka kepada MataCeria.
                                </p>

                                {/* CTA buttons */}
                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '14px', justifyContent: 'center', paddingTop: '8px' }}>
                                    <motion.a
                                        href={isAuthenticated ? adminRoute : loginRoute}
                                        whileHover={{ boxShadow: NM_OUT_SM, transform: 'translateY(1px)' }}
                                        whileTap={{ boxShadow: NM_IN_SM, transform: 'translateY(2px)' }}
                                        style={{
                                            display: 'inline-flex', alignItems: 'center', gap: '10px',
                                            padding: '1.125rem 2.5rem', background: '#006666', color: '#ffffff',
                                            fontFamily: MONTSERRAT, fontSize: '1rem', fontWeight: 700,
                                            borderRadius: '8px', textDecoration: 'none',
                                            boxShadow: NM_OUT_MD, transition: 'all 120ms cubic-bezier(0.25, 0, 0, 1)'
                                        }}
                                    >
                                        <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z"/>
                                        </svg>
                                        {isAuthenticated ? 'Buka Dashboard' : 'Mulai Screening Gratis'}
                                    </motion.a>

                                    <motion.a href="#app"
                                        whileHover={{ boxShadow: NM_OUT_MD }}
                                        whileTap={{ boxShadow: NM_IN_SM }}
                                        style={{
                                            display: 'inline-flex', alignItems: 'center', gap: '10px',
                                            padding: '1.125rem 2.5rem', background: '#E7E5E4', color: '#334155',
                                            fontFamily: MONTSERRAT, fontSize: '1rem', fontWeight: 700,
                                            borderRadius: '8px', textDecoration: 'none',
                                            boxShadow: NM_OUT_SM, transition: 'all 120ms cubic-bezier(0.25, 0, 0, 1)'
                                        }}
                                    >
                                        Download App →
                                    </motion.a>
                                </div>

                                {/* Trust badges */}
                                <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '20px', paddingTop: '12px' }}>
                                    {['HIPAA Compliant', 'ISO 27001', '99.9% Uptime', 'SOC 2 Type II'].map(b => (
                                        <span key={b} style={{ display: 'flex', alignItems: 'center', gap: '5px', fontFamily: MONTSERRAT, fontSize: '0.6875rem', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                                            <span style={{ width: '4px', height: '4px', borderRadius: '50%', background: '#00A63D', display: 'inline-block' }}></span>
                                            {b}
                                        </span>
                                    ))}
                                </div>
                            </motion.div>
                        </div>
                    </section>
                </main>

                {/* Footer */}
                <footer style={{ background: '#E7E5E4', borderTop: 'none', boxShadow: 'inset 0 2px 6px #b5b3b2, inset 0 -2px 6px #ffffff', padding: '3rem 0' }}>
                    <div style={{ maxWidth: '80rem', margin: '0 auto', padding: '0 1.5rem' }}>
                        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '1.5rem' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                <div style={{ width: '34px', height: '34px', borderRadius: '8px', background: '#006666', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>
                                    </svg>
                                </div>
                                <div>
                                    <div style={{ fontFamily: MONTSERRAT, fontWeight: 700, color: '#1E2938', fontSize: '0.9375rem' }}>
                                        Mata<span style={{ color: '#006666' }}>Ceria</span>
                                    </div>
                                    <div style={{ fontFamily: MONTSERRAT, fontSize: '0.5625rem', textTransform: 'uppercase', letterSpacing: '0.1em', color: '#94a3b8', marginTop: '1px' }}>
                                        Digital Health Platform
                                    </div>
                                </div>
                            </div>

                            <div style={{ display: 'flex', gap: '2rem' }}>
                                {['Privasi', 'Syarat', 'Keamanan', 'Kontak'].map(l => (
                                    <a key={l} href="#" style={{ fontFamily: MONTSERRAT, fontSize: '0.8125rem', color: '#64748b', textDecoration: 'none', transition: 'color 120ms' }}
                                       onMouseEnter={e => e.target.style.color = '#006666'}
                                       onMouseLeave={e => e.target.style.color = '#64748b'}
                                    >{l}</a>
                                ))}
                            </div>

                            <p style={{ fontFamily: MONTSERRAT, fontSize: '0.6875rem', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                                © {new Date().getFullYear()} MataCeria Platform
                            </p>
                        </div>
                    </div>
                </footer>
            </motion.div>
        </>
    );
}



