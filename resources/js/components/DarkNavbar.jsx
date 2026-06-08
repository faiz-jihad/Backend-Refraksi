import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// DESIGN.MD: Montserrat, teal #006666, surface #E7E5E4, neumorphic shadows
const NM_OUT_SM = '3px 3px 6px #b5b3b2, -3px -3px 6px #ffffff';
const NM_OUT_MD = '6px 6px 12px #b5b3b2, -6px -6px 12px #ffffff';
const NM_IN_SM = 'inset 3px 3px 6px #b5b3b2, inset -3px -3px 6px #ffffff';

const NAV_LINKS = [
    { label: 'Fitur', href: '#fitur' },
    { label: 'Proses', href: '#proses' },
    { label: 'Aplikasi', href: '#app' },
    { label: 'Tentang', href: '#tentang' },
];

export default function NavBar({ loginRoute, adminRoute, isAuthenticated, scrolled }) {
    const [mobileOpen, setMobileOpen] = useState(false);

    return (
        <>
            <motion.nav
                initial={{ y: -56, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="fixed w-full z-50 transition-all duration-300"
                style={{
                    background: scrolled ? 'rgba(231,229,228,0.96)' : 'rgba(231,229,228,0.85)',
                    backdropFilter: 'blur(16px)',
                    boxShadow: scrolled ? NM_OUT_MD : NM_OUT_SM,
                }}
            >
                <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12">
                    <div className="flex justify-between items-center h-16">

                        {/* Logo */}
                        <a href="#" className="flex items-center gap-2.5" style={{ textDecoration: 'none' }}>
                            <motion.div
                                whileHover={{ boxShadow: NM_IN_SM }}
                                className="w-9 h-9 rounded-xl flex items-center justify-center transition-all duration-150"
                                style={{ background: '#E7E5E4', boxShadow: NM_OUT_SM }}
                            >
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#006666" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                                    <circle cx="12" cy="12" r="3"/>
                                </svg>
                            </motion.div>
                            <div>
                                <div style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: 700, fontSize: '1.125rem', color: '#1E2938', letterSpacing: '-0.02em', lineHeight: 1.1 }}>
                                    Mata<span style={{ color: '#006666' }}>Ceria</span>
                                </div>
                                <div style={{ fontFamily: "'Montserrat', sans-serif", fontSize: '0.5625rem', textTransform: 'uppercase', letterSpacing: '0.12em', color: '#64748b', marginTop: '1px' }}>
                                    Digital Health Platform
                                </div>
                            </div>
                        </a>

                        {/* Desktop links */}
                        <div className="hidden md:flex items-center gap-8">
                            {NAV_LINKS.map(link => (
                                <a key={link.label} href={link.href}
                                    style={{ fontFamily: "'Montserrat', sans-serif", fontSize: '0.8125rem', fontWeight: 400, color: '#334155', textDecoration: 'none', transition: 'color 120ms' }}
                                    onMouseEnter={e => e.target.style.color = '#006666'}
                                    onMouseLeave={e => e.target.style.color = '#334155'}
                                >
                                    {link.label}
                                </a>
                            ))}
                        </div>

                        {/* CTA */}
                        <div className="hidden md:block">
                            <motion.a
                                href={isAuthenticated ? adminRoute : loginRoute}
                                whileHover={{ boxShadow: NM_OUT_SM, transform: 'translateY(1px)' }}
                                whileTap={{ boxShadow: NM_IN_SM, transform: 'translateY(2px)' }}
                                style={{
                                    display: 'inline-flex', alignItems: 'center', gap: '6px',
                                    padding: '0.5625rem 1.25rem',
                                    background: '#006666', color: '#ffffff',
                                    fontFamily: "'Montserrat', sans-serif", fontSize: '0.8125rem', fontWeight: 700,
                                    borderRadius: '8px', textDecoration: 'none',
                                    boxShadow: NM_OUT_SM,
                                    transition: 'all 120ms cubic-bezier(0.25, 0, 0, 1)'
                                }}
                            >
                                <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z"/>
                                </svg>
                                {isAuthenticated ? 'Dashboard' : 'Mulai Gratis'}
                            </motion.a>
                        </div>

                        {/* Mobile toggle */}
                        <button
                            onClick={() => setMobileOpen(!mobileOpen)}
                            className="md:hidden w-9 h-9 rounded-xl flex items-center justify-center"
                            style={{ background: '#E7E5E4', boxShadow: mobileOpen ? NM_IN_SM : NM_OUT_SM, border: 'none', cursor: 'pointer', color: '#334155' }}
                        >
                            <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                {mobileOpen
                                    ? <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12"/>
                                    : <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16"/>
                                }
                            </svg>
                        </button>
                    </div>
                </div>
            </motion.nav>

            {/* Mobile drawer */}
            <AnimatePresence>
                {mobileOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-40 md:hidden"
                        style={{ background: 'rgba(231,229,228,0.95)', backdropFilter: 'blur(16px)' }}
                        onClick={() => setMobileOpen(false)}
                    >
                        <motion.div
                            initial={{ x: '100%' }}
                            animate={{ x: 0 }}
                            exit={{ x: '100%' }}
                            transition={{ type: 'tween', duration: 0.25 }}
                            className="absolute right-0 top-0 bottom-0 w-64 p-8 flex flex-col"
                            style={{ boxShadow: '-6px 0 16px rgba(181,179,178,0.6)' }}
                            onClick={e => e.stopPropagation()}
                        >
                            <div className="flex justify-between items-center mb-12">
                                <span style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: 700, color: '#1E2938' }}>Menu</span>
                                <button onClick={() => setMobileOpen(false)}
                                    style={{ background: '#E7E5E4', border: 'none', cursor: 'pointer', borderRadius: '8px', padding: '6px', boxShadow: NM_OUT_SM }}>
                                    <svg width="16" height="16" fill="none" stroke="#334155" strokeWidth="2" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12"/>
                                    </svg>
                                </button>
                            </div>
                            <div className="flex flex-col gap-6 flex-1">
                                {NAV_LINKS.map(link => (
                                    <a key={link.label} href={link.href} onClick={() => setMobileOpen(false)}
                                       style={{ fontFamily: "'Montserrat', sans-serif", fontSize: '1.125rem', fontWeight: 700, color: '#1E2938', textDecoration: 'none' }}>
                                        {link.label}
                                    </a>
                                ))}
                            </div>
                            <a href={isAuthenticated ? adminRoute : loginRoute}
                               style={{
                                   display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px',
                                   padding: '0.875rem', background: '#006666', color: '#ffffff',
                                   fontFamily: "'Montserrat', sans-serif", fontWeight: 700, fontSize: '0.875rem',
                                   borderRadius: '8px', textDecoration: 'none', boxShadow: NM_OUT_SM
                               }}>
                                {isAuthenticated ? 'Dashboard' : 'Mulai Gratis'}
                            </a>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}



