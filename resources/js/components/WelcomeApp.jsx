import React, { useState, useEffect, Suspense } from 'react';
import { motion } from 'framer-motion';
import NavBar from './DarkNavbar';
import HeroSection from './HeroSection';

// Eagerly loaded (Above the fold)
// Lazy loaded (Below the fold) for performance
const StatsSection = React.lazy(() => import('./StatsSection'));
const BentoFeatures = React.lazy(() => import('./BentoFeatures'));
const ProcessTimeline = React.lazy(() => import('./ProcessTimeline'));
const MobileShowcase = React.lazy(() => import('./MobileShowcase'));
const TestimonialMarquee = React.lazy(() => import('./TestimonialMarquee'));

/* ─── Shared Design Tokens ─── */
export const T = {
    bg:      '#050A14',
    surface: '#0A1428',
    surface2:'#0F1E3D',
    text:    '#F0F4FF',
    text2:   '#94A3B8',
    text3:   '#4B5E8A',
    brand:   '#0EA5E9',
    brand2:  '#06B6D4',
    accent:  '#8B5CF6',
    green:   '#10B981',
    border:  'rgba(255,255,255,0.06)',
    border2: 'rgba(255,255,255,0.12)',
    font:    "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
};

export const glow = (color = T.brand, size = 80) =>
    `radial-gradient(${size}px at 50% 0%, ${color}22 0%, transparent 100%)`;

export default function WelcomeApp({ loginRoute, adminRoute, isAuthenticated, userName, statsPatients, statsDoctors, doctors }) {
    const [scrolled, setScrolled] = useState(false);
    const [scrollY, setScrollY] = useState(0);

    useEffect(() => {
        const onScroll = () => {
            setScrolled(window.scrollY > 32);
            setScrollY(window.scrollY);
        };
        window.addEventListener('scroll', onScroll, { passive: true });

        // Signal the blade loader to dismiss — called once after React mounts
        if (typeof window.__mcReady === 'function') {
            window.__mcReady();
        }

        return () => window.removeEventListener('scroll', onScroll);
    }, []);

    return (
        <div style={{ background: T.bg, minHeight: '100vh', color: T.text, fontFamily: T.font, overflowX: 'hidden' }}>
            <NavBar
                loginRoute={loginRoute}
                adminRoute={adminRoute}
                isAuthenticated={isAuthenticated}
                userName={userName}
                scrolled={scrolled}
            />
            <main>
                <HeroSection
                    loginRoute={loginRoute}
                    adminRoute={adminRoute}
                    isAuthenticated={isAuthenticated}
                />
                <Suspense fallback={<div style={{ height: '500px' }} />}>
                    <StatsSection
                        statsPatients={statsPatients}
                        statsDoctors={statsDoctors}
                    />
                    <BentoFeatures doctors={doctors} />
                    <ProcessTimeline />
                    <MobileShowcase />
                    <TestimonialMarquee />
                </Suspense>
                <CTASection
                    loginRoute={loginRoute}
                    adminRoute={adminRoute}
                    isAuthenticated={isAuthenticated}
                    statsPatients={statsPatients}
                />
            </main>
            <SiteFooter />

            {/* Global CSS — no font @import, font loaded via blade <link preload> */}
            <style>{`
                *, *::before, *::after { box-sizing: border-box; }
                html { scroll-behavior: smooth; }
                body { margin: 0; -webkit-font-smoothing: antialiased; }
                ::selection { background: rgba(14,165,233,0.25); color: #E0F2FE; }
                @keyframes wc-pulse { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:0.6;transform:scale(0.92)} }
                @keyframes wc-float { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-10px)} }
                @keyframes wc-spin  { to{transform:rotate(360deg)} }
                @keyframes wc-shimmer { 0%{background-position:-200% 0} 100%{background-position:200% 0} }
                @keyframes wc-marquee { 0%{transform:translateX(0)} 100%{transform:translateX(-50%)} }
                @keyframes wc-ping { 75%,100%{transform:scale(2);opacity:0} }
                @keyframes wc-scan  { 0%{top:0%;opacity:0.7} 49%{opacity:0.7} 50%{opacity:0} 100%{top:100%;opacity:0} }
            `}</style>
        </div>
    );
}

/* ─── CTA Section ─── */
function CTASection({ loginRoute, adminRoute, isAuthenticated, statsPatients }) {
    return (
        <section id="tentang" style={{ padding: '8rem 0', position: 'relative', overflow: 'hidden' }}>
            {/* Background */}
            <div style={{ position: 'absolute', inset: 0, background: `linear-gradient(135deg, ${T.surface} 0%, ${T.bg} 60%)`, zIndex: 0 }} />
            <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', width: '800px', height: '400px', borderRadius: '50%', background: `radial-gradient(ellipse, rgba(14,165,233,0.12) 0%, transparent 70%)`, zIndex: 0, pointerEvents: 'none' }} />

            <div style={{ maxWidth: '64rem', margin: '0 auto', padding: '0 1.5rem', textAlign: 'center', position: 'relative', zIndex: 1 }}>
                <motion.div
                    initial={{ opacity: 0, y: 32 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                    style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2rem' }}
                >
                    <span style={{
                        display: 'inline-flex', alignItems: 'center', gap: '8px',
                        padding: '5px 14px', borderRadius: '99px',
                        border: `1px solid rgba(16,185,129,0.3)`,
                        background: 'rgba(16,185,129,0.08)',
                        fontSize: '0.72rem', fontWeight: 700, color: T.green,
                        textTransform: 'uppercase', letterSpacing: '0.1em',
                    }}>
                        <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: T.green, display: 'inline-block', animation: 'wc-pulse 2s infinite' }} />
                        Siap Dimulai?
                    </span>

                    <h2 style={{ fontSize: 'clamp(2.5rem, 6vw, 4.5rem)', fontWeight: 800, letterSpacing: '-0.04em', lineHeight: 1.1, margin: 0 }}>
                        Penglihatanmu{' '}
                        <span style={{ background: `linear-gradient(135deg, ${T.brand}, ${T.accent})`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                            dimulai di sini.
                        </span>
                    </h2>

                    <p style={{ fontSize: '1.1rem', color: T.text2, lineHeight: 1.7, maxWidth: '500px', margin: 0 }}>
                        Bergabunglah dengan <strong style={{ color: T.text }}>{statsPatients || '50.000+'}</strong> pengguna yang sudah mempercayakan kesehatan mata mereka kepada MataCeria.
                    </p>

                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', justifyContent: 'center' }}>
                        <a
                            href={isAuthenticated ? adminRoute : loginRoute}
                            style={{
                                display: 'inline-flex', alignItems: 'center', gap: '10px',
                                padding: '1rem 2.25rem', borderRadius: '12px',
                                background: `linear-gradient(135deg, ${T.brand}, ${T.brand2})`,
                                color: '#fff', fontSize: '1rem', fontWeight: 700,
                                textDecoration: 'none', boxShadow: `0 0 40px rgba(14,165,233,0.4)`,
                                transition: 'all 0.2s',
                            }}
                            onMouseEnter={e => e.currentTarget.style.boxShadow = `0 0 60px rgba(14,165,233,0.6)`}
                            onMouseLeave={e => e.currentTarget.style.boxShadow = `0 0 40px rgba(14,165,233,0.4)`}
                        >
                            <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
                            </svg>
                            {isAuthenticated ? 'Buka Dashboard' : 'Mulai Screening Gratis'}
                        </a>

                        <a
                            href="#app"
                            style={{
                                display: 'inline-flex', alignItems: 'center', gap: '10px',
                                padding: '1rem 2.25rem', borderRadius: '12px',
                                border: `1px solid ${T.border2}`, background: T.surface,
                                color: T.text, fontSize: '1rem', fontWeight: 600,
                                textDecoration: 'none', transition: 'all 0.2s',
                            }}
                            onMouseEnter={e => e.currentTarget.style.background = T.surface2}
                            onMouseLeave={e => e.currentTarget.style.background = T.surface}
                        >
                            Download App →
                        </a>
                    </div>

                    <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '24px' }}>
                        {['HIPAA Compliant', 'ISO 27001', '99.9% Uptime', 'SOC 2 Type II'].map(b => (
                            <span key={b} style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.7rem', fontWeight: 700, color: T.text3, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                                <span style={{ width: '4px', height: '4px', borderRadius: '50%', background: T.green }} />
                                {b}
                            </span>
                        ))}
                    </div>
                </motion.div>
            </div>
        </section>
    );
}

/* ─── Footer ─── */
function SiteFooter() {
    const links = [
        { group: 'Produk', items: [{ l: 'Fitur', h: '#fitur' }, { l: 'Download App', h: '#app' }, { l: 'Harga', h: '#' }] },
        { group: 'Layanan', items: [{ l: 'Tes Refraksi', h: '#' }, { l: 'Konsultasi AI', h: '#' }, { l: 'RS Rujukan', h: '#' }] },
        { group: 'Perusahaan', items: [{ l: 'Tentang', h: '#tentang' }, { l: 'Privasi', h: '#' }, { l: 'Syarat', h: '#' }] },
    ];
    return (
        <footer style={{ background: T.surface, borderTop: `1px solid ${T.border}`, padding: '4rem 0 2rem' }}>
            <div style={{ maxWidth: '80rem', margin: '0 auto', padding: '0 1.5rem' }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '3rem', marginBottom: '3rem' }}>
                    {/* Brand */}
                    <div style={{ gridColumn: 'span 1' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '1rem' }}>
                            <div style={{ width: '34px', height: '34px', borderRadius: '8px', background: `linear-gradient(135deg, ${T.brand}, ${T.accent})`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round">
                                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" />
                                </svg>
                            </div>
                            <span style={{ fontWeight: 700, fontSize: '1rem', color: T.text }}>Mata<span style={{ color: T.brand }}>Ceria</span></span>
                        </div>
                        <p style={{ fontSize: '0.845rem', color: T.text2, lineHeight: 1.6, margin: '0 0 1rem' }}>Platform kesehatan mata digital AI terdepan di Indonesia.</p>
                        <span style={{ fontSize: '0.7rem', color: T.text3, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Digital Health Platform</span>
                    </div>
                    {links.map(g => (
                        <div key={g.group}>
                            <p style={{ fontSize: '0.72rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: T.text3, margin: '0 0 1rem' }}>{g.group}</p>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                                {g.items.map(i => (
                                    <a key={i.l} href={i.h} style={{ fontSize: '0.875rem', color: T.text2, textDecoration: 'none', transition: 'color 0.15s' }}
                                        onMouseEnter={e => e.currentTarget.style.color = T.brand}
                                        onMouseLeave={e => e.currentTarget.style.color = T.text2}>
                                        {i.l}
                                    </a>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
                <div style={{ paddingTop: '2rem', borderTop: `1px solid ${T.border}`, display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '1rem' }}>
                    <p style={{ fontSize: '0.78rem', color: T.text3, margin: 0 }}>© {new Date().getFullYear()} MataCeria Platform · All rights reserved.</p>
                    <div style={{ display: 'flex', gap: '1.5rem' }}>
                        {['Privasi', 'Syarat', 'Keamanan', 'Kontak'].map(l => (
                            <a key={l} href="#" style={{ fontSize: '0.78rem', color: T.text3, textDecoration: 'none', transition: 'color 0.15s' }}
                                onMouseEnter={e => e.currentTarget.style.color = T.text}
                                onMouseLeave={e => e.currentTarget.style.color = T.text3}>
                                {l}
                            </a>
                        ))}
                    </div>
                </div>
            </div>
        </footer>
    );
}
