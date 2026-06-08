import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const NM_OUT_SM = '3px 3px 6px #b5b3b2, -3px -3px 6px #ffffff';
const NM_OUT_MD = '6px 6px 12px #b5b3b2, -6px -6px 12px #ffffff';
const NM_OUT_LG = '10px 10px 20px #b5b3b2, -10px -10px 20px #ffffff';
const NM_IN_SM = 'inset 3px 3px 6px #b5b3b2, inset -3px -3px 6px #ffffff';
const NM_IN_MD = 'inset 5px 5px 10px #b5b3b2, inset -5px -5px 10px #ffffff';
const MONTSERRAT = "'Montserrat', sans-serif";

const SCREENS = [
    {
        label: 'Dashboard', color: '#006666',
        content: (
            <div style={{ padding: '12px', fontFamily: MONTSERRAT }}>
                <div style={{ fontSize: '9px', fontWeight: 700, color: '#1E2938', marginBottom: '10px', fontFamily: MONTSERRAT, textTransform: 'uppercase', letterSpacing: '0.1em' }}>Today</div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginBottom: '10px' }}>
                    {[['Vision Score', '8.4/10', '#006666'], ['Check Due', '3 Days', '#FE9900']].map(([l, v, c]) => (
                        <div key={l} style={{ padding: '8px', borderRadius: '8px', boxShadow: NM_IN_SM }}>
                            <div style={{ fontFamily: MONTSERRAT, fontSize: '7px', textTransform: 'uppercase', color: c, letterSpacing: '0.1em', marginBottom: '3px' }}>{l}</div>
                            <div style={{ fontFamily: MONTSERRAT, fontWeight: 700, fontSize: '11px', color: '#1E2938' }}>{v}</div>
                        </div>
                    ))}
                </div>
                <div style={{ padding: '8px', borderRadius: '8px', boxShadow: NM_IN_SM, marginBottom: '8px' }}>
                    <div style={{ fontFamily: MONTSERRAT, fontSize: '7px', textTransform: 'uppercase', color: '#006666', letterSpacing: '0.1em', marginBottom: '4px' }}>Digital Recommendation</div>
                    <div style={{ fontSize: '9px', color: '#334155' }}>Follow-up scan in 2 months</div>
                    <div style={{ height: '3px', borderRadius: '2px', background: '#E7E5E4', boxShadow: NM_IN_SM, marginTop: '6px', overflow: 'hidden' }}>
                        <div style={{ width: '76%', height: '100%', background: 'linear-gradient(90deg, #004d4d, #006666)', borderRadius: '2px' }} />
                    </div>
                </div>
            </div>
        )
    },
    {
        label: 'Scan', color: '#004d4d',
        content: (
            <div style={{ padding: '12px' }}>
                <div style={{ fontFamily: MONTSERRAT, fontSize: '9px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: '#1E2938', marginBottom: '10px' }}>Digital Eye Scan</div>
                <div style={{ height: '90px', borderRadius: '8px', boxShadow: NM_IN_MD, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '10px', position: 'relative', overflow: 'hidden' }}>
                    <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#006666" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                        <circle cx="12" cy="12" r="3" />
                    </svg>
                    <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '1.5px', background: '#006666', animation: 'scan 2s linear infinite', opacity: 0.7 }} />
                    <div style={{ position: 'absolute', bottom: '6px', left: '50%', transform: 'translateX(-50%)', fontFamily: MONTSERRAT, fontSize: '7px', textTransform: 'uppercase', color: '#006666', letterSpacing: '0.1em', animation: 'pulse 1.5s ease-in-out infinite' }}>Scanning...</div>
                </div>
                {[['Focal Point', 'Detected', '#00A63D'], ['Clarity', '94%', '#006666'], ['Pressure', 'Normal', '#00A63D']].map(([l, v, c]) => (
                    <div key={l} style={{ display: 'flex', justifyContent: 'space-between', padding: '5px 8px', borderRadius: '6px', boxShadow: NM_IN_SM, marginBottom: '5px' }}>
                        <span style={{ fontFamily: MONTSERRAT, fontSize: '8px', color: '#64748b' }}>{l}</span>
                        <span style={{ fontFamily: MONTSERRAT, fontWeight: 700, fontSize: '8px', color: c }}>{v}</span>
                    </div>
                ))}
            </div>
        )
    },
    {
        label: 'Chat', color: '#00A63D',
        content: (
            <div style={{ padding: '12px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px', borderRadius: '8px', boxShadow: NM_IN_SM, marginBottom: '10px' }}>
                    <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: '#006666', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontFamily: MONTSERRAT, fontWeight: 700, fontSize: '10px', flexShrink: 0 }}>S</div>
                    <div>
                        <div style={{ fontFamily: MONTSERRAT, fontWeight: 700, fontSize: '9px', color: '#1E2938' }}>dr. Sari Andini, SpM</div>
                        <div style={{ fontFamily: MONTSERRAT, fontSize: '7px', color: '#00A63D' }}>● Online</div>
                    </div>
                </div>
                {[
                    { from: 'dr', msg: 'Laporan scan Anda sudah saya review.' },
                    { from: 'me', msg: 'Bagaimana hasilnya, dok?' },
                    { from: 'dr', msg: 'Myopia ringan -1.5D. Saya rekomendasikan lensa tipis.' }
                ].map((m, i) => (
                    <div key={i} style={{ display: 'flex', justifyContent: m.from === 'me' ? 'flex-end' : 'flex-start', marginBottom: '6px' }}>
                        <div style={{
                            padding: '6px 10px', borderRadius: '8px', maxWidth: '80%',
                            fontFamily: MONTSERRAT, fontSize: '8px', lineHeight: 1.5,
                            boxShadow: m.from === 'me' ? NM_IN_SM : NM_OUT_SM,
                            color: m.from === 'me' ? '#006666' : '#334155',
                            background: '#E7E5E4'
                        }}>
                            {m.msg}
                        </div>
                    </div>
                ))}
            </div>
        )
    }
];

export default function MobileShowcase() {
    const [activeTab, setActiveTab] = useState(0);
    const [modalOpen, setModalOpen] = useState(false);
    const [modalMessage, setModalMessage] = useState('');

    const triggerModal = (message) => {
        setModalMessage(message);
        setModalOpen(true);
    };

    return (
        <section id="app" style={{ padding: '7rem 0', background: '#E7E5E4', position: 'relative' }}>
            {/* Elegant Neumorphic Modal Alert */}
            <AnimatePresence>
                {modalOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        style={{
                            position: 'fixed',
                            inset: 0,
                            zIndex: 100,
                            background: 'rgba(231, 229, 228, 0.65)',
                            backdropFilter: 'blur(8px)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            padding: '1.5rem'
                        }} onClick={() => setModalOpen(false)}>
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 16 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 16 }}
                            style={{
                                background: '#E7E5E4',
                                padding: '2rem',
                                borderRadius: '24px',
                                boxShadow: NM_OUT_LG,
                                maxWidth: '420px',
                                width: '100%',
                                textAlign: 'center',
                                cursor: 'default'
                            }}
                            onClick={e => e.stopPropagation()}
                        >
                            <div style={{
                                width: '48px', height: '48px', borderRadius: '50%',
                                background: '#E7E5E4', boxShadow: NM_IN_SM,
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                margin: '0 auto 1.5rem', color: '#006666'
                            }}>
                                <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/>
                                </svg>
                            </div>
                            <h3 style={{ fontFamily: MONTSERRAT, fontWeight: 700, fontSize: '1.125rem', color: '#1E2938', marginBottom: '10px' }}>Unduhan Aplikasi</h3>
                            <p style={{ fontFamily: MONTSERRAT, fontSize: '0.875rem', color: '#64748b', lineHeight: 1.6, marginBottom: '1.5rem' }}>{modalMessage}</p>
                            <button
                                onClick={() => setModalOpen(false)}
                                style={{
                                    display: 'inline-flex', padding: '0.625rem 2rem', background: '#006666', color: '#fff',
                                    fontFamily: MONTSERRAT, fontWeight: 700, fontSize: '0.875rem', border: 'none', borderRadius: '8px',
                                    boxShadow: NM_OUT_SM, cursor: 'pointer'
                                }}
                            >
                                Tutup
                            </button>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            <div style={{ maxWidth: '80rem', margin: '0 auto', padding: '0 1.5rem' }}>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">

                    {/* Phone Mockup */}
                    <motion.div
                        initial={{ opacity: 0, x: -32 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.7 }}
                        style={{ display: 'flex', justifyContent: 'center' }}
                    >
                        <div style={{ position: 'relative' }}>
                            {/* Phone frame */}
                            <div style={{
                                width: '240px', height: '480px', borderRadius: '40px',
                                background: '#E7E5E4', boxShadow: NM_OUT_LG,
                                padding: '3px', position: 'relative'
                            }}>
                                <div style={{ width: '100%', height: '100%', borderRadius: '38px', background: '#f0edec', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
                                    {/* Status bar */}
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 16px 4px', fontSize: '8px', fontFamily: MONTSERRAT, color: '#64748b' }}>
                                        <span>9:41</span>
                                        <div style={{ width: '48px', height: '14px', background: '#1E2938', borderRadius: '7px' }} />
                                        <span>●●●</span>
                                    </div>

                                    {/* App header */}
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '6px 12px 8px', borderBottom: '1px solid rgba(181,179,178,0.3)' }}>
                                        <div style={{ width: '22px', height: '22px', borderRadius: '6px', background: '#006666', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                            <span style={{ color: '#fff', fontFamily: MONTSERRAT, fontWeight: 700, fontSize: '8px' }}>MC</span>
                                        </div>
                                        <span style={{ fontFamily: MONTSERRAT, fontWeight: 700, fontSize: '10px', color: '#1E2938' }}>MataCeria</span>
                                        <span style={{ marginLeft: 'auto', padding: '2px 6px', borderRadius: '100px', background: '#E7E5E4', boxShadow: NM_OUT_SM, fontFamily: MONTSERRAT, fontSize: '7px', color: '#006666', fontWeight: 700 }}>v2.5</span>
                                    </div>

                                    {/* Content */}
                                    <div style={{ flex: 1, overflowY: 'auto' }}>
                                        {SCREENS[activeTab].content}
                                    </div>

                                    {/* Tab bar */}
                                    <div style={{ display: 'flex', borderTop: '1px solid rgba(181,179,178,0.3)', background: '#f0edec' }}>
                                        {SCREENS.map((s, i) => (
                                            <button key={i} onClick={() => setActiveTab(i)}
                                                style={{
                                                    flex: 1, padding: '10px 4px',
                                                    fontFamily: MONTSERRAT, fontSize: '8px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em',
                                                    color: activeTab === i ? s.color : '#94a3b8',
                                                    background: 'transparent', border: 'none', cursor: 'pointer',
                                                    borderTop: activeTab === i ? `2px solid ${s.color}` : '2px solid transparent',
                                                    transition: 'all 120ms'
                                                }}>
                                                {s.label}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* Floating badges */}
                            <motion.div animate={{ y: [0, -3, 0] }} transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
                                style={{ position: 'absolute', right: '-65px', top: '60px', padding: '10px 14px', borderRadius: '12px', background: '#E7E5E4', boxShadow: NM_OUT_MD }}>
                                <div style={{ fontFamily: MONTSERRAT, fontSize: '7px', textTransform: 'uppercase', color: '#00A63D', fontWeight: 700, marginBottom: '2px' }}>Diagnostics Complete</div>
                                <div style={{ fontFamily: MONTSERRAT, fontSize: '9px', fontWeight: 700, color: '#1E2938' }}>Acuity: OD 20/20 • OS 20/20</div>
                            </motion.div>

                            <motion.div animate={{ y: [0, 3, 0] }} transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
                                style={{ position: 'absolute', left: '-65px', bottom: '90px', padding: '10px 14px', borderRadius: '12px', background: '#E7E5E4', boxShadow: NM_OUT_MD }}>
                                <div style={{ fontFamily: MONTSERRAT, fontSize: '7px', textTransform: 'uppercase', color: '#006666', fontWeight: 700, marginBottom: '2px' }}>Verified Telemedicine</div>
                                <div style={{ fontFamily: MONTSERRAT, fontSize: '9px', color: '#334155' }}>dr. Sari Andini • Online</div>
                            </motion.div>
                        </div>
                    </motion.div>

                    {/* Right: Info */}
                    <motion.div
                        initial={{ opacity: 0, x: 32 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.7 }}
                        style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}
                    >
                        <div>
                            <span style={{ fontFamily: MONTSERRAT, fontSize: '0.625rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.15em', color: '#00A63D' }}>Mobile App</span>
                            <h2 style={{ fontFamily: MONTSERRAT, fontWeight: 700, fontSize: 'clamp(1.75rem, 3.5vw, 2.75rem)', color: '#1E2938', letterSpacing: '-0.02em', lineHeight: 1.2, marginTop: '8px' }}>
                                Dokter mata Anda,<br />
                                <span style={{ color: '#006666' }}>di genggaman</span>
                            </h2>
                            <p style={{ fontFamily: MONTSERRAT, fontSize: '0.875rem', color: '#64748b', lineHeight: 1.7, marginTop: '12px' }}>
                                Download MataCeria dan mulai perjalanan menuju penglihatan lebih jernih hari ini. Gratis untuk semua pengguna baru.
                            </p>
                        </div>

                        {/* App meta */}
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                            {[
                                { label: 'Version', value: '2.5.0', color: '#006666' },
                                { label: 'Requires', value: 'Android 8+', color: '#004d4d' },
                                { label: 'Size', value: '45 MB', color: '#338080' },
                                { label: 'Downloads', value: '50K+', color: '#00A63D' },
                            ].map(m => (
                                <div key={m.label} style={{ padding: '12px', borderRadius: '8px', boxShadow: NM_IN_SM }}>
                                    <div style={{ fontFamily: MONTSERRAT, fontSize: '8px', textTransform: 'uppercase', letterSpacing: '0.1em', color: '#94a3b8', marginBottom: '4px' }}>{m.label}</div>
                                    <div style={{ fontFamily: MONTSERRAT, fontWeight: 700, fontSize: '0.9375rem', color: m.color }}>{m.value}</div>
                                </div>
                            ))}
                        </div>

                        {/* Download buttons */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                            <motion.a
                                href="/downloads/mataceria.apk"
                                download="mataceria.apk"
                                whileHover={{ boxShadow: NM_OUT_SM, transform: 'translateY(1px)' }}
                                whileTap={{ boxShadow: NM_IN_SM, transform: 'translateY(2px)' }}
                                style={{
                                    display: 'flex', alignItems: 'center', gap: '12px', padding: '14px 20px', borderRadius: '8px',
                                    background: '#006666', color: '#ffffff', textDecoration: 'none',
                                    fontFamily: MONTSERRAT, fontWeight: 700, fontSize: '0.875rem',
                                    boxShadow: NM_OUT_MD, transition: 'all 120ms', width: '100%'
                                }}>
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
                                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3" />
                                </svg>
                                <div style={{ textAlign: 'left' }}>
                                    <div style={{ fontFamily: MONTSERRAT, fontSize: '9px', textTransform: 'uppercase', letterSpacing: '0.1em', opacity: 0.7, marginBottom: '2px' }}>Direct APK</div>
                                    <div>Download APK — Gratis</div>
                                </div>
                            </motion.a>

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                                {[
                                    {
                                        label: 'Google Play',
                                        msg: 'Aplikasi MataCeria sedang ditinjau di Google Play Store. Segera hadir untuk seluruh perangkat Android Anda!',
                                        icon: (
                                            <svg width="12" height="12" fill="currentColor" viewBox="0 0 24 24" style={{ flexShrink: 0, marginRight: '4px' }}>
                                                <path d="M3.609 1.814L13.783 12 3.609 22.186A2.213 2.213 0 0 1 3 20.613V3.387c0-.623.22-1.178.609-1.573zm9.057 9.07l2.87-2.87 3.993 2.27c.94.536.94 1.41 0 1.944l-3.993 2.27-2.87-2.87-.008-.008zM4.774 3.018l8.91 8.91 2.827-2.827L4.774 3.018zm8.91 9.054l-8.91 8.91 11.737-6.083-2.827-2.827z"/>
                                            </svg>
                                        )
                                    },
                                    {
                                        label: 'App Store',
                                        msg: 'Aplikasi MataCeria sedang dalam proses sertifikasi di Apple App Store. Segera hadir untuk perangkat iOS Anda!',
                                        icon: (
                                            <svg width="12" height="12" fill="currentColor" viewBox="0 0 24 24" style={{ flexShrink: 0, marginRight: '4px' }}>
                                                <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 4.17c.66-.81 1.11-1.93.99-3.06-.96.04-2.13.64-2.82 1.45-.6.69-1.13 1.83-.99 2.94.12.01.24.02.36.02.92 0 2.01-.54 2.46-1.35z"/>
                                            </svg>
                                        )
                                    }
                                ].map(item => (
                                    <motion.button key={item.label}
                                        onClick={() => triggerModal(item.msg)}
                                        whileHover={{ boxShadow: NM_OUT_MD }}
                                        whileTap={{ boxShadow: NM_IN_SM }}
                                        style={{
                                            display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '10px', borderRadius: '8px',
                                            background: '#E7E5E4', color: '#334155', textDecoration: 'none', border: 'none', cursor: 'pointer',
                                            fontFamily: MONTSERRAT, fontWeight: 700, fontSize: '0.75rem',
                                            boxShadow: NM_OUT_SM, transition: 'all 120ms'
                                        }}>
                                        {item.icon}
                                        <span>{item.label}</span>
                                    </motion.button>
                                ))}
                            </div>
                        </div>

                        {/* Rating */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', paddingTop: '8px', borderTop: '1px solid rgba(181,179,178,0.4)' }}>
                            <div style={{ display: 'flex', gap: '2px' }}>
                                {[1, 2, 3, 4, 5].map(i => (
                                    <svg key={i} width="12" height="12" fill="#FE9900" viewBox="0 0 24 24" style={{ flexShrink: 0 }}>
                                        <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                                    </svg>
                                ))}
                            </div>
                            <span style={{ fontFamily: MONTSERRAT, fontWeight: 700, color: '#1E2938', fontSize: '0.875rem' }}>4.9</span>
                            <span style={{ fontFamily: MONTSERRAT, fontSize: '0.6875rem', color: '#94a3b8' }}>dari 12,400 ulasan</span>
                            <span style={{ fontFamily: MONTSERRAT, fontSize: '0.625rem', fontWeight: 700, color: '#00A63D', textTransform: 'uppercase', letterSpacing: '0.08em', marginLeft: 'auto' }}>✓ Verified</span>
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}



