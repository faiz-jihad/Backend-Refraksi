/**
 * DarkNavbar — Glassmorphism sticky navbar
 * Linear/Vercel-inspired with backdrop blur + smooth scroll transition
 */
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { T } from './WelcomeApp';

const NAV_LINKS = [
    { label: 'Fitur', href: '#fitur' },
    { label: 'Cara Kerja', href: '#proses' },
    { label: 'Download', href: '#app' },
    { label: 'Tentang', href: '#tentang' },
];

export default function DarkNavbar({ loginRoute, adminRoute, isAuthenticated, userName, scrolled }) {
    const [mobileOpen, setMobileOpen] = useState(false);

    return (
        <>
            <motion.header
                initial={{ y: -60, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5, ease: [0.25, 0, 0, 1] }}
                style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    width: '100%',
                    zIndex: 1000,
                    padding: scrolled ? '0' : '12px 1.5rem',
                    transition: 'padding 0.4s cubic-bezier(0.25, 0, 0, 1)',
                    pointerEvents: 'none', // biarkan klik tembus di luar pill
                }}
            >
                <div style={{ 
                    pointerEvents: 'auto',
                    maxWidth: scrolled ? '100%' : '1100px', 
                    margin: '0 auto', 
                    height: scrolled ? '70px' : '60px', 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'space-between', 
                    gap: '2rem',
                    background: scrolled ? 'rgba(7, 1, 20, 0.85)' : 'rgba(255, 255, 255, 0.03)',
                    backdropFilter: 'blur(20px)',
                    WebkitBackdropFilter: 'blur(20px)',
                    borderBottom: scrolled ? `1px solid ${T.border}` : 'none',
                    border: scrolled ? 'none' : `1px solid ${T.border2}`,
                    borderRadius: scrolled ? '0' : '16px',
                    boxShadow: scrolled ? '0 1px 0 rgba(255,255,255,0.04)' : '0 8px 32px rgba(0,0,0,0.4)',
                    transition: 'all 0.4s cubic-bezier(0.25, 0, 0, 1)',
                    padding: '0 1.5rem',
                }}>

                    {/* Logo */}
                    <a href="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '10px', flexShrink: 0 }}>
                        <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: `linear-gradient(135deg, ${T.brand}, ${T.accent})`, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: `0 0 16px rgba(255, 46, 147, 0.4)` }}>
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round">
                                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                                <circle cx="12" cy="12" r="3" />
                            </svg>
                        </div>
                        <span style={{ fontWeight: 700, fontSize: '0.95rem', color: T.text, letterSpacing: '-0.02em' }}>
                            Mata<span style={{ color: T.brand }}>Ceria</span>
                        </span>
                    </a>

                    {/* Desktop nav links */}
                    <nav style={{ display: 'flex', gap: '0.25rem', flex: 1, justifyContent: 'center' }} className="nav-desktop">
                        {NAV_LINKS.map(nl => (
                            <a
                                key={nl.label}
                                href={nl.href}
                                style={{
                                    padding: '0.4rem 0.875rem', borderRadius: '8px',
                                    fontSize: '0.845rem', fontWeight: 500, color: T.text2,
                                    textDecoration: 'none', transition: 'all 0.15s',
                                }}
                                onMouseEnter={e => { e.currentTarget.style.color = T.text; e.currentTarget.style.background = T.border; }}
                                onMouseLeave={e => { e.currentTarget.style.color = T.text2; e.currentTarget.style.background = 'transparent'; }}
                            >
                                {nl.label}
                            </a>
                        ))}
                    </nav>

                    {/* CTA */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', flexShrink: 0 }}>
                        {isAuthenticated ? (
                            <>
                                <span style={{ fontSize: '0.78rem', color: T.text2 }} className="nav-cta-desktop">Hai, {userName}</span>
                                <a href={adminRoute} style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '0.5rem 1rem', borderRadius: '8px', background: `linear-gradient(135deg, ${T.brand}, ${T.brand2})`, color: '#fff', fontSize: '0.8rem', fontWeight: 700, textDecoration: 'none', boxShadow: `0 0 20px rgba(255, 46, 147, 0.3)` }} className="nav-cta-desktop">
                                    Dashboard →
                                </a>
                            </>
                        ) : (
                            <>
                                <a href={loginRoute} style={{ padding: '0.5rem 1rem', borderRadius: '8px', border: `1px solid ${T.border2}`, color: T.text2, fontSize: '0.8rem', fontWeight: 600, textDecoration: 'none', transition: 'all 0.15s' }}
                                    className="nav-cta-desktop"
                                    onMouseEnter={e => e.currentTarget.style.color = T.text}
                                    onMouseLeave={e => e.currentTarget.style.color = T.text2}>
                                    Masuk
                                </a>
                                <a href={loginRoute} style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '0.5rem 1.125rem', borderRadius: '8px', background: `linear-gradient(135deg, ${T.brand}, ${T.brand2})`, color: '#fff', fontSize: '0.8rem', fontWeight: 700, textDecoration: 'none', boxShadow: `0 0 20px rgba(255, 46, 147, 0.3)`, transition: 'box-shadow 0.2s' }}
                                    className="nav-cta-desktop"
                                    onMouseEnter={e => e.currentTarget.style.boxShadow = `0 0 32px rgba(255, 46, 147, 0.5)`}
                                    onMouseLeave={e => e.currentTarget.style.boxShadow = `0 0 20px rgba(255, 46, 147, 0.3)`}>
                                    Mulai Gratis
                                </a>
                            </>
                        )}
                        {/* Mobile hamburger */}
                        <button
                            onClick={() => setMobileOpen(v => !v)}
                            style={{ display: 'none', padding: '0.4rem', borderRadius: '6px', border: `1px solid ${T.border2}`, background: 'transparent', color: T.text2, cursor: 'pointer' }}
                            className="nav-mobile-btn"
                        >
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                {mobileOpen ? <path d="M18 6L6 18M6 6l12 12" /> : <path d="M3 12h18M3 6h18M3 18h18" />}
                            </svg>
                        </button>
                    </div>
                </div>
            </motion.header>

            {/* Mobile Menu */}
            <AnimatePresence>
                {mobileOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        style={{
                            position: 'fixed', top: '80px', left: '1rem', right: '1rem',
                            background: 'rgba(7, 1, 20, 0.95)', backdropFilter: 'blur(20px)',
                            borderRadius: '16px', border: `1px solid ${T.border2}`,
                            padding: '1.25rem', zIndex: 999, display: 'flex', flexDirection: 'column', gap: '4px',
                        }}
                    >
                        {NAV_LINKS.map(nl => (
                            <a key={nl.label} href={nl.href} onClick={() => setMobileOpen(false)}
                                style={{ padding: '0.75rem 1rem', borderRadius: '8px', color: T.text2, fontSize: '0.9rem', fontWeight: 500, textDecoration: 'none', transition: 'all 0.15s' }}
                                onMouseEnter={e => { e.currentTarget.style.color = T.text; e.currentTarget.style.background = T.border; }}
                                onMouseLeave={e => { e.currentTarget.style.color = T.text2; e.currentTarget.style.background = 'transparent'; }}>
                                {nl.label}
                            </a>
                        ))}
                        <div style={{ height: '1px', background: T.border, margin: '0.75rem 0' }} />
                        {isAuthenticated ? (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                <span style={{ fontSize: '0.85rem', color: T.text2, textAlign: 'center', padding: '0.25rem' }}>Hai, {userName}</span>
                                <a href={adminRoute} onClick={() => setMobileOpen(false)}
                                    style={{ padding: '0.75rem 1rem', borderRadius: '8px', background: `linear-gradient(135deg, ${T.brand}, ${T.brand2})`, color: '#fff', fontSize: '0.9rem', fontWeight: 700, textDecoration: 'none', textAlign: 'center' }}>
                                    Dashboard →
                                </a>
                            </div>
                        ) : (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                <a href={loginRoute} onClick={() => setMobileOpen(false)}
                                    style={{ padding: '0.75rem 1rem', borderRadius: '8px', border: `1px solid ${T.border2}`, color: T.text2, fontSize: '0.9rem', fontWeight: 600, textDecoration: 'none', textAlign: 'center' }}>
                                    Masuk
                                </a>
                                <a href={loginRoute} onClick={() => setMobileOpen(false)}
                                    style={{ padding: '0.75rem 1rem', borderRadius: '8px', background: `linear-gradient(135deg, ${T.brand}, ${T.brand2})`, color: '#fff', fontSize: '0.9rem', fontWeight: 700, textDecoration: 'none', textAlign: 'center' }}>
                                    Mulai Gratis
                                </a>
                            </div>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>

            <style>{`
                @media (max-width: 768px) {
                    .nav-desktop { display: none !important; }
                    .nav-cta-desktop { display: none !important; }
                    .nav-mobile-btn { display: flex !important; }
                }
            `}</style>

        </>
    );
}
