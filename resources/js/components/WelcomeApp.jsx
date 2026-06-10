/**
 * WelcomeApp — MataCeria Landing Page
 * Palette: Calm green (Roader-inspired) + white base
 * Animations: GSAP page-load curtain + staggered hero + scroll-reveal throughout
 */
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { gsap } from 'gsap';
import {
    Smartphone,
    Eye,
    Target,
    BarChart3,
    ClipboardList,
    Bot,
    Rocket,
    MessageSquare,
    FileText,
    Star,
    Shield,
    Zap,
    Lightbulb,
    Check,
    Play,
    X
} from 'lucide-react';

/* ═══════════════════════════════════════════════
   DESIGN TOKENS — calm emerald-green palette
═══════════════════════════════════════════════ */
export const T = {
    bg:       '#FFFFFF',
    bgAlt:    '#F4FAF6',           // very soft green tint
    bgDark:   '#0A1F12',           // deep forest dark
    text:     '#0F2918',           // dark forest green
    text2:    '#3D6B52',           // medium muted green
    text3:    '#8AAD97',           // light muted green
    brand:    '#16A34A',           // calm medium green
    brandL:   '#22C55E',           // brighter green
    brandD:   '#15803D',           // deeper green
    accent:   '#059669',           // emerald teal
    accentL:  '#34D399',           // light emerald
    grad:     'linear-gradient(135deg, #22C55E 0%, #059669 100%)',
    gradSoft: 'linear-gradient(135deg, rgba(34,197,94,0.1) 0%, rgba(5,150,105,0.1) 100%)',
    gradDark: 'linear-gradient(135deg, #16A34A 0%, #059669 100%)',
    border:   '#E2F0E8',
    borderM:  '#B6D9C2',
    shadow:   '0 4px 24px rgba(22,163,74,0.1)',
    shadowM:  '0 8px 32px rgba(22,163,74,0.18)',
    font:     "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
};

/* ═══════════════════════════════════════════════
   PAGE-LOAD INTRO ANIMATION (Curtain Reveal)
═══════════════════════════════════════════════ */
function PageLoadAnimation({ onComplete }) {
    const contentRef  = useRef(null);
    const logoRef     = useRef(null);
    const textRef     = useRef(null);
    const barRef      = useRef(null);
    const progressRef = useRef(null);
    const [pct, setPct] = useState(0);

    useEffect(() => {
        const tl = gsap.timeline({
            onComplete: () => {
                onComplete?.();
            }
        });

        // Logo & text entrance
        tl.from(logoRef.current, { scale: 0, opacity: 0, duration: 0.4, ease: 'back.out(1.7)' })
          .from(textRef.current, { y: 20, opacity: 0, duration: 0.3, ease: 'power2.out' }, '-=0.15')
          .from(barRef.current, { scaleX: 0, duration: 0.2, ease: 'power2.out', transformOrigin: 'left' }, '-=0.1')

        // Progress counter
        let count = { val: 0 };
        tl.to(count, {
            val: 100,
            duration: 0.6,
            ease: 'power2.inOut',
            onUpdate: () => setPct(Math.round(count.val)),
        }, '-=0.3');

        // Fill progress bar
        tl.to(progressRef.current, { scaleX: 1, duration: 0.6, ease: 'power2.inOut', transformOrigin: 'left' }, '-=0.6');

        // Fade out content first
        tl.to(contentRef.current, {
            opacity: 0,
            y: -40,
            duration: 0.3,
            ease: 'power3.in',
            delay: 0
        });

        // Staggered slide up of the 4 vertical panels
        tl.to('.curtain-panel', {
            yPercent: -100,
            duration: 0.55,
            stagger: 0.05,
            ease: 'power4.inOut'
        }, '-=0.15');

        return () => tl.kill();
    }, []);

    return (
        <div style={{
            position: 'fixed', inset: 0, zIndex: 9999,
            background: 'transparent',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
            {/* Vertical panels */}
            <div style={{ position: 'absolute', inset: 0, display: 'flex', zIndex: 1 }}>
                {[...Array(4)].map((_, i) => (
                    <div key={i} className="curtain-panel" style={{
                        flex: 1,
                        height: '100%',
                        background: T.bgDark,
                    }} />
                ))}
            </div>

            {/* Loader Content */}
            <div ref={contentRef} style={{
                position: 'relative', zIndex: 2,
                display: 'flex', flexDirection: 'column',
                alignItems: 'center', gap: 24,
            }}>
                {/* Logo */}
                <div ref={logoRef} style={{
                    width: 72, height: 72, borderRadius: 20,
                    background: T.grad,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    boxShadow: '0 0 40px rgba(34,197,94,0.4)',
                }}>
                    <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.2" strokeLinecap="round">
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                        <circle cx="12" cy="12" r="3"/>
                    </svg>
                </div>

                {/* Brand name */}
                <div ref={textRef} style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '1.5rem', fontWeight: 900, color: '#fff', letterSpacing: '-0.04em' }}>
                        Mata<span style={{ color: T.brandL }}>Ceria</span>
                    </div>
                    <div style={{ fontSize: '0.72rem', color: T.text3, textTransform: 'uppercase', letterSpacing: '0.15em', marginTop: 4 }}>
                        Digital Eye Health
                    </div>
                </div>

                {/* Progress bar */}
                <div style={{ width: 200, display: 'flex', flexDirection: 'column', gap: 8 }}>
                    <div ref={barRef} style={{ height: 3, background: 'rgba(255,255,255,0.08)', borderRadius: 2, overflow: 'hidden' }}>
                        <div ref={progressRef} style={{ height: '100%', background: T.grad, borderRadius: 2, scaleX: 0 }} />
                    </div>
                    <div style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.3)', textAlign: 'right', fontVariantNumeric: 'tabular-nums' }}>
                        {pct}%
                    </div>
                </div>
            </div>
        </div>
    );
}

/* ═══════════════════════════════════════════════
   PHONE MOCKUP
═══════════════════════════════════════════════ */
function PhoneMockup({ screen, size = 'md', float = true, shadow = true }) {
    const dims = size === 'lg' ? { w: 290, h: 580 } : size === 'sm' ? { w: 175, h: 350 } : { w: 235, h: 470 };
    return (
        <motion.div
            animate={float ? { y: [0, -14, 0] } : {}}
            transition={{ duration: 4.5, repeat: Infinity, ease: 'easeInOut' }}
            style={{ position: 'relative', width: dims.w, flexShrink: 0 }}
        >
            {shadow && (
                <div style={{
                    position: 'absolute', bottom: -20, left: '50%', transform: 'translateX(-50%)',
                    width: dims.w * 0.65, height: 36, borderRadius: '50%',
                    background: 'radial-gradient(ellipse, rgba(22,163,74,0.3), transparent)',
                    filter: 'blur(14px)'
                }} />
            )}
            <div style={{
                width: dims.w, height: dims.h, borderRadius: 42,
                background: 'linear-gradient(145deg, #1A3025, #0A1A10)',
                border: '2.5px solid rgba(255,255,255,0.15)',
                boxShadow: `0 28px 70px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.15)`,
                position: 'relative', overflow: 'hidden',
                display: 'flex', flexDirection: 'column', padding: 9,
            }}>
                {/* Notch */}
                <div style={{
                    position: 'absolute', top: 13, left: '50%', transform: 'translateX(-50%)',
                    width: 88, height: 20, borderRadius: 20, background: '#060F0A', zIndex: 10,
                }} />
                {/* Screen */}
                <div style={{
                    flex: 1, background: '#0C1A0F', borderRadius: 33, overflow: 'hidden',
                    padding: '42px 13px 13px', position: 'relative',
                }}>
                    {screen}
                    <div style={{
                        position: 'absolute', bottom: 8, left: '50%', transform: 'translateX(-50%)',
                        width: 70, height: 4, borderRadius: 2, background: 'rgba(255,255,255,0.2)'
                    }} />
                </div>
            </div>
        </motion.div>
    );
}

/* ── Screen contents ── */
function ScreenHome() {
    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, color: '#fff' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.55rem', opacity: 0.45, padding: '0 2px' }}>
                <span>9:41</span><span>5G 100%</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <div style={{ width: 32, height: 32, borderRadius: '50%', background: T.grad, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem', fontWeight: 800 }}>F</div>
                <div>
                    <div style={{ fontSize: '0.58rem', opacity: 0.45 }}>Selamat Pagi</div>
                    <div style={{ fontSize: '0.72rem', fontWeight: 800 }}>Faiz Jihad</div>
                </div>
            </div>
            <div style={{ background: T.grad, borderRadius: 14, padding: '12px 14px' }}>
                <div style={{ fontSize: '0.5rem', opacity: 0.85, marginBottom: 4 }}>Status Mata Terakhir</div>
                <div style={{ fontSize: '1.1rem', fontWeight: 900, letterSpacing: '-0.03em' }}>20/20 Normal</div>
                <div style={{ fontSize: '0.5rem', opacity: 0.7, marginTop: 2 }}>Pemeriksaan 3 hari lalu</div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6 }}>
                {[['SPH', '-0.00', T.accentL], ['CYL', '-0.00', T.accentL], ['VA OD', '20/20', T.brandL], ['VA OS', '20/25', '#FBBF24']].map(([l, v, c]) => (
                    <div key={l} style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 10, padding: '8px 10px' }}>
                        <div style={{ fontSize: '0.45rem', opacity: 0.4, textTransform: 'uppercase', letterSpacing: '0.06em' }}>{l}</div>
                        <div style={{ fontSize: '0.72rem', fontWeight: 800, color: c, marginTop: 2 }}>{v}</div>
                    </div>
                ))}
            </div>
            <div style={{ background: T.grad, borderRadius: 10, padding: '9px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4, fontSize: '0.62rem', fontWeight: 800, marginTop: 'auto', cursor: 'pointer' }}>
                <Play size={10} color="#fff" fill="#fff" />
                Mulai Tes Baru
            </div>
        </div>
    );
}

function ScreenSnellen() {
    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, color: '#fff' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '0.62rem', fontWeight: 800 }}>Tes Rabun Jauh</span>
                <span style={{ fontSize: '0.5rem', background: 'rgba(34,197,94,0.2)', color: T.brandL, padding: '2px 6px', borderRadius: 4, fontWeight: 700 }}>OD</span>
            </div>
            <div style={{ fontSize: '0.5rem', color: '#B2C7B9', background: 'rgba(255,255,255,0.04)', borderRadius: 8, padding: '5px 8px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 3 }}>
                Jarak: <span style={{ color: T.brandL, fontWeight: 700 }}>40 cm</span> <Check size={10} color={T.brandL} strokeWidth={3} />
            </div>
            <div style={{ background: '#fff', borderRadius: 14, padding: '14px 10px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, flex: 1, color: '#000' }}>
                <span style={{ fontSize: '2rem', fontWeight: 900, lineHeight: 1 }}>E</span>
                <div style={{ display: 'flex', gap: 8, fontSize: '1.1rem', fontWeight: 800 }}><span>F</span><span>P</span></div>
                <div style={{ display: 'flex', gap: 6, fontSize: '0.6rem', fontWeight: 800, opacity: 0.65 }}><span>T</span><span>O</span><span>Z</span></div>
                <div style={{ display: 'flex', gap: 5, fontSize: '0.44rem', fontWeight: 800, opacity: 0.35 }}><span>L</span><span>P</span><span>E</span><span>D</span></div>
                <div style={{ fontSize: '0.45rem', color: '#15803D', fontWeight: 700, marginTop: 4 }}>Baris Aktif: 20/30</div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 4 }}>
                {['Kiri','Atas','Kanan','Bawah'].map((d, i) => (
                    <div key={d} style={{ background: i === 1 ? T.grad : 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.09)', borderRadius: 6, padding: '5px 0', textAlign: 'center', fontSize: '0.5rem', fontWeight: 700 }}>{d}</div>
                ))}
            </div>
        </div>
    );
}

function ScreenAstigmat() {
    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, color: '#fff' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '0.62rem', fontWeight: 800 }}>Tes Silinder</span>
                <span style={{ fontSize: '0.5rem', background: 'rgba(5,150,105,0.2)', color: T.accentL, padding: '2px 6px', borderRadius: 4, fontWeight: 700 }}>OS</span>
            </div>
            <div style={{ fontSize: '0.5rem', color: 'rgba(255,255,255,0.4)', background: 'rgba(255,255,255,0.04)', borderRadius: 8, padding: '5px 8px', textAlign: 'center' }}>
                Tutup mata kanan, fokus ke titik tengah
            </div>
            <div style={{ flex: 1, background: 'rgba(0,0,0,0.25)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 14, display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', minHeight: 100 }}>
                <svg width="108" height="108" viewBox="0 0 100 100">
                    <circle cx="50" cy="50" r="44" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="0.8"/>
                    <circle cx="50" cy="50" r="3" fill={T.brandL}/>
                    {[...Array(12)].map((_, i) => {
                        const a = i * 15, r = (a * Math.PI) / 180;
                        const x1 = 50 + 41 * Math.cos(r), y1 = 50 + 41 * Math.sin(r);
                        const x2 = 50 - 41 * Math.cos(r), y2 = 50 - 41 * Math.sin(r);
                        const hi = i === 2 || i === 8;
                        return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke={hi ? T.brandL : 'rgba(255,255,255,0.45)'} strokeWidth={hi ? 1.8 : 0.6}/>;
                    })}
                </svg>
                <div style={{ position: 'absolute', bottom: 6, right: 6, fontSize: '0.42rem', background: T.brand, color: '#fff', padding: '1px 4px', borderRadius: 3 }}>DISTORSI 30°</div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6 }}>
                <div style={{ background: T.grad, borderRadius: 8, padding: '7px 0', textAlign: 'center', fontSize: '0.52rem', fontWeight: 700 }}>Ya, Tebal</div>
                <div style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 8, padding: '7px 0', textAlign: 'center', fontSize: '0.52rem', fontWeight: 700 }}>Semua Sama</div>
            </div>
        </div>
    );
}

function ScreenResult() {
    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, color: '#fff' }}>
            <div style={{ textAlign: 'center', paddingTop: 4 }}>
                <div style={{ fontSize: '0.52rem', opacity: 0.4, marginBottom: 6 }}>Hasil Pemeriksaan</div>
                <div style={{ width: 50, height: 50, borderRadius: '50%', background: T.grad, margin: '0 auto 8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Check size={22} color="#fff" strokeWidth={3} />
                </div>
                <div style={{ fontSize: '0.82rem', fontWeight: 900 }}>Selesai!</div>
            </div>
            {[['Mata Kanan (OD)', 'SPH -0.00 | CYL -0.00', '20/20', T.brandL],
              ['Mata Kiri (OS)', 'SPH -1.25 | CYL -0.50', '20/40', '#FBBF24']].map(([e, d, va, c]) => (
                <div key={e} style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 12, padding: '10px 12px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div>
                            <div style={{ fontSize: '0.62rem', fontWeight: 800 }}>{e}</div>
                            <div style={{ fontSize: '0.48rem', opacity: 0.4, marginTop: 2 }}>{d}</div>
                        </div>
                        <div style={{ fontSize: '0.88rem', fontWeight: 900, color: c }}>{va}</div>
                    </div>
                </div>
            ))}
            <div style={{ background: 'rgba(5,150,105,0.15)', border: '1px solid rgba(52,211,153,0.2)', borderRadius: 12, padding: '10px 12px' }}>
                <div style={{ fontSize: '0.58rem', fontWeight: 700, color: T.accentL, marginBottom: 4, display: 'flex', alignItems: 'center', gap: 4 }}>
                    <Lightbulb size={11} color={T.accentL} /> Rekomendasi AI
                </div>
                <div style={{ fontSize: '0.5rem', opacity: 0.65, lineHeight: 1.45 }}>Konsultasi ke dokter mata untuk koreksi mata kiri. Indeks silinder -0.50D terdeteksi.</div>
            </div>
        </div>
    );
}

/* ═══════════════════════════════════════════════
   STORE BUTTONS
═══════════════════════════════════════════════ */
function StoreButtons({ inverted = false, apkRoute, onStoreClick }) {
    const btn = {
        display: 'flex', alignItems: 'center', gap: 10,
        padding: '11px 22px', borderRadius: 13,
        background: inverted ? '#fff' : T.bgDark,
        color: inverted ? T.bgDark : '#fff',
        textDecoration: 'none',
        transition: 'all 0.25s ease',
        boxShadow: inverted ? '0 4px 18px rgba(0,0,0,0.15)' : '0 4px 20px rgba(10,31,18,0.45)',
        cursor: 'pointer',
    };
    const stores = [
        {
            label: 'App Store',
            sub: 'Download on the',
            icon: (
                <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 4.17c.66-.81 1.11-1.93.99-3.06-1 .04-2.21.67-2.93 1.49-.62.69-1.16 1.84-1.01 2.96 1.12.09 2.27-.57 2.95-1.39z"/>
                </svg>
            ),
            href: '#',
            action: 'coming_soon'
        },
        {
            label: 'Google Play',
            sub: 'Get it on',
            icon: (
                <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M3 20.5v-17c0-.83.94-1.3 1.6-.8l14 8.5c.6.37.6 1.23 0 1.6l-14 8.5c-.66.5-1.6.03-1.6-.8z"/>
                </svg>
            ),
            href: '#',
            action: 'coming_soon'
        },
        {
            label: 'Direct APK',
            sub: 'Download Android',
            icon: (
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="8" y1="2" x2="10" y2="5" stroke="currentColor" />
                    <line x1="16" y1="2" x2="14" y2="5" stroke="currentColor" />
                    <path d="M12 5C7.029 5 3 9.029 3 14h18c0-4.971-4.029-9-9-9z" fill="none" stroke="currentColor" />
                    <path d="M3 14v4a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-4" fill="none" stroke="currentColor" />
                    <circle cx="8.5" cy="10.5" r="1.5" fill="currentColor" />
                    <circle cx="15.5" cy="10.5" r="1.5" fill="currentColor" />
                </svg>
            ),
            href: apkRoute || '/downloads/mataceria-latest.apk',
            action: 'download'
        }
    ];
    return (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12 }} className="mc-store-buttons">
            {stores.map(s => {
                const handleClick = (e) => {
                    if (s.action === 'coming_soon') {
                        e.preventDefault();
                        if (onStoreClick) onStoreClick(s.label);
                    }
                };
                return (
                    <a key={s.label} href={s.href} onClick={handleClick} style={btn}
                       onMouseEnter={e => {
                           e.currentTarget.style.transform = 'translateY(-3px)';
                           e.currentTarget.style.boxShadow = inverted ? '0 8px 28px rgba(0,0,0,0.22)' : `0 8px 30px rgba(10,31,18,0.55)`;
                       }}
                       onMouseLeave={e => {
                           e.currentTarget.style.transform = 'none';
                           e.currentTarget.style.boxShadow = inverted ? '0 4px 18px rgba(0,0,0,0.15)' : '0 4px 20px rgba(10,31,18,0.45)';
                       }}>
                        {s.icon}
                        <div style={{ textAlign: 'left' }}>
                            <div style={{ fontSize: '0.58rem', opacity: 0.6, textTransform: 'uppercase', letterSpacing: '0.04em' }}>{s.sub}</div>
                            <div style={{ fontSize: '0.88rem', fontWeight: 700, lineHeight: 1.2 }}>{s.label}</div>
                        </div>
                    </a>
                );
            })}
        </div>
    );
}

/* ═══════════════════════════════════════════════
   NAVBAR
═══════════════════════════════════════════════ */
function Navbar({ loginRoute, adminRoute, isAuthenticated, userName, scrolled }) {
    const [open, setOpen] = useState(false);
    const navRef = useRef(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            gsap.fromTo(navRef.current,
                { y: -70, opacity: 0 },
                { y: 0, opacity: 1, duration: 0.8, ease: 'power3.out', delay: 2.2 }
            );
        });
        return () => ctx.revert();
    }, []);

    const links = [
        { label: 'Beranda', href: '#beranda' },
        { label: 'Fitur', href: '#fitur' },
        { label: 'Cara Kerja', href: '#cara-kerja' },
        { label: 'Ulasan', href: '#ulasan' },
        { label: 'Download', href: '#app' },
    ];

    return (
        <>
            <header ref={navRef} style={{
                position: 'fixed',
                top: scrolled ? 16 : 0,
                left: 0,
                right: 0,
                margin: '0 auto',
                width: scrolled ? 'calc(100% - 48px)' : '100%',
                maxWidth: scrolled ? 1200 : '100%',
                zIndex: 1000,
                background: scrolled ? 'rgba(255, 255, 255, 0.85)' : 'rgba(255, 255, 255, 0.7)',
                backdropFilter: 'blur(20px)',
                borderRadius: scrolled ? 24 : 0,
                border: scrolled ? `1px solid ${T.borderM}` : '1px solid transparent',
                boxShadow: scrolled ? '0 12px 40px rgba(22,163,74,0.12)' : 'none',
                transition: 'all 0.5s cubic-bezier(0.16, 1, 0.3, 1)',
                fontFamily: T.font,
            }}>
                <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 24px', height: 68, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <a href="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 10 }}>
                        <div style={{ width: 36, height: 36, borderRadius: 10, background: T.grad, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 14px rgba(22,163,74,0.35)' }}>
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round">
                                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>
                            </svg>
                        </div>
                        <span style={{ fontWeight: 800, fontSize: '1.1rem', color: T.text, letterSpacing: '-0.02em' }}>
                            Mata<span style={{ color: T.brand }}>Ceria</span>
                        </span>
                    </a>

                    <nav style={{ display: 'flex', gap: 2 }} className="mc-nav-desktop">
                        {links.map(l => (
                            <a key={l.label} href={l.href} style={{ padding: '7px 14px', borderRadius: 8, fontSize: '0.875rem', fontWeight: 500, color: T.text2, textDecoration: 'none', transition: 'all 0.25s cubic-bezier(0.16, 1, 0.3, 1)' }}
                               onMouseEnter={e => { e.currentTarget.style.color = T.brand; e.currentTarget.style.background = T.gradSoft; e.currentTarget.style.transform = 'translateY(-1px)'; }}
                               onMouseLeave={e => { e.currentTarget.style.color = T.text2; e.currentTarget.style.background = 'transparent'; e.currentTarget.style.transform = 'none'; }}>
                                {l.label}
                            </a>
                        ))}
                    </nav>

                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        {isAuthenticated ? (
                            <>
                                <span style={{ fontSize: '0.8rem', color: T.text2 }}>Hai, {userName}</span>
                                <a href={adminRoute} style={{ padding: '8px 18px', borderRadius: 10, background: T.grad, color: '#fff', fontWeight: 700, fontSize: '0.85rem', textDecoration: 'none', boxShadow: '0 4px 14px rgba(22,163,74,0.3)' }}>Dashboard →</a>
                            </>
                        ) : (
                            <a href={loginRoute} style={{ padding: '8px 18px', borderRadius: 10, background: T.grad, color: '#fff', fontWeight: 700, fontSize: '0.85rem', textDecoration: 'none', boxShadow: '0 4px 14px rgba(22,163,74,0.3)', transition: 'all 0.2s' }}
                               onMouseEnter={e => { e.currentTarget.style.boxShadow = '0 6px 22px rgba(22,163,74,0.45)'; e.currentTarget.style.transform = 'translateY(-1px)'; }}
                               onMouseLeave={e => { e.currentTarget.style.boxShadow = '0 4px 14px rgba(22,163,74,0.3)'; e.currentTarget.style.transform = 'none'; }}>
                                Masuk
                            </a>
                        )}
                        <button onClick={() => setOpen(v => !v)} aria-label="Buka menu navigasi" className="mc-nav-mobile-btn" style={{ display: 'none', padding: '8px', borderRadius: 8, border: `1.5px solid ${T.border}`, background: 'transparent', cursor: 'pointer' }}>
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={T.text} strokeWidth="2">
                                {open ? <path d="M18 6L6 18M6 6l12 12"/> : <path d="M3 12h18M3 6h18M3 18h18"/>}
                            </svg>
                        </button>
                    </div>
                </div>
            </header>

            <AnimatePresence>
                {open && (
                    <motion.div initial={{ opacity: 0, y: -10, scale: 0.97 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: -10, scale: 0.97 }} transition={{ duration: 0.25, ease: 'easeOut' }}
                        style={{
                            position: 'fixed',
                            top: scrolled ? 92 : 74,
                            left: 12,
                            right: 12,
                            background: 'rgba(255, 255, 255, 0.94)',
                            backdropFilter: 'blur(20px)',
                            borderRadius: 18,
                            border: `1.5px solid ${T.borderM}`,
                            boxShadow: '0 20px 60px rgba(22,163,74,0.12)',
                            padding: 16,
                            zIndex: 999,
                            display: 'flex',
                            flexDirection: 'column',
                            gap: 4,
                            fontFamily: T.font
                        }}>
                        {links.map(l => (
                            <a key={l.label} href={l.href} onClick={() => setOpen(false)} style={{ padding: '11px 14px', borderRadius: 10, color: T.text2, fontSize: '0.9rem', fontWeight: 500, textDecoration: 'none', transition: 'all 0.15s' }}
                               onMouseEnter={e => { e.currentTarget.style.background = T.gradSoft; e.currentTarget.style.color = T.brand; }}
                               onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = T.text2; }}>
                                {l.label}
                            </a>
                        ))}
                        <div style={{ height: 1, background: T.border, margin: '6px 0' }}/>
                        <a href={isAuthenticated ? adminRoute : loginRoute} style={{ padding: '11px 14px', borderRadius: 10, background: T.grad, color: '#fff', fontWeight: 700, textAlign: 'center', textDecoration: 'none' }}>
                            {isAuthenticated ? 'Dashboard' : 'Masuk'}
                        </a>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}

/* ═══════════════════════════════════════════════
   HERO SECTION — with GSAP stagger entrance
═══════════════════════════════════════════════ */
function HeroSection({ loginRoute, adminRoute, isAuthenticated, apkRoute, onStoreClick }) {
    const sectionRef = useRef(null);
    const blob1 = useRef(null);
    const blob2 = useRef(null);
    const blob3 = useRef(null);
    const [screenIdx, setScreenIdx] = useState(0);

    useEffect(() => {
        // Rotate phone screens
        const iv = setInterval(() => setScreenIdx(s => (s + 1) % 3), 4200);

        // Parallax blobs on mouse move
        let w = window.innerWidth;
        let h = window.innerHeight;
        const onResize = () => {
            w = window.innerWidth;
            h = window.innerHeight;
        };
        window.addEventListener('resize', onResize, { passive: true });

        const onMove = (e) => {
            const nx = (e.clientX / w - 0.5);
            const ny = (e.clientY / h - 0.5);
            gsap.to(blob1.current, { x: nx * 70, y: ny * 50, duration: 2.5, ease: 'power2.out' });
            gsap.to(blob2.current, { x: nx * -90, y: ny * -60, duration: 2.5, ease: 'power2.out' });
            gsap.to(blob3.current, { x: nx * 40, y: ny * 80, duration: 3, ease: 'power2.out' });
        };
        window.addEventListener('mousemove', onMove, { passive: true });

        // GSAP staggered hero entrance after curtain clears
        const ctx = gsap.context(() => {
            const tl = gsap.timeline({ delay: 2.3 });
            tl.from('.mc-hero-badge', { y: 24, opacity: 0, duration: 0.7, ease: 'power3.out' })
              .from('.mc-hero-h1 .mc-word', { y: 60, opacity: 0, stagger: 0.1, duration: 0.8, ease: 'power4.out' }, '-=0.3')
              .from('.mc-hero-body', { y: 20, opacity: 0, duration: 0.6, ease: 'power3.out' }, '-=0.4')
              .from('.mc-hero-store', { y: 16, opacity: 0, duration: 0.5, ease: 'power3.out' }, '-=0.3')
              .from('.mc-hero-trust', { y: 12, opacity: 0, duration: 0.5, ease: 'power3.out' }, '-=0.3')
              .from('.mc-hero-phone', { x: 60, opacity: 0, duration: 1, ease: 'power4.out' }, '-=0.8')
              .from('.mc-hero-chip-1', { x: 40, opacity: 0, duration: 0.6, ease: 'back.out(1.5)' }, '-=0.4')
              .from('.mc-hero-chip-2', { x: -40, opacity: 0, duration: 0.6, ease: 'back.out(1.5)' }, '-=0.3');
        }, sectionRef);

        return () => {
            clearInterval(iv);
            window.removeEventListener('resize', onResize);
            window.removeEventListener('mousemove', onMove);
            ctx.revert();
        };
    }, []);

    const screens = [<ScreenHome />, <ScreenSnellen />, <ScreenAstigmat />];

    return (
        <section ref={sectionRef} id="beranda" style={{ minHeight: '100vh', position: 'relative', display: 'flex', alignItems: 'center', overflow: 'hidden', background: T.bg, paddingTop: 100, fontFamily: T.font }}>
            {/* Background blobs */}
            <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 0 }}>
                <div ref={blob1} style={{ position: 'absolute', top: '5%', right: '-8%', width: 560, height: 560, borderRadius: '50%', background: 'radial-gradient(circle, rgba(34,197,94,0.1) 0%, transparent 70%)', filter: 'blur(56px)' }}/>
                <div ref={blob2} style={{ position: 'absolute', bottom: '-10%', left: '-8%', width: 480, height: 480, borderRadius: '50%', background: 'radial-gradient(circle, rgba(5,150,105,0.09) 0%, transparent 70%)', filter: 'blur(50px)' }}/>
                <div ref={blob3} style={{ position: 'absolute', top: '50%', left: '35%', width: 300, height: 300, borderRadius: '50%', background: 'radial-gradient(circle, rgba(52,211,153,0.06) 0%, transparent 70%)', filter: 'blur(40px)' }}/>
                {/* Dot-grid pattern */}
                <div style={{ position: 'absolute', inset: 0, backgroundImage: `radial-gradient(circle, ${T.brand}0A 1px, transparent 1px)`, backgroundSize: '38px 38px', maskImage: 'radial-gradient(ellipse 70% 70% at 60% 40%, black 30%, transparent 80%)' }}/>
                {/* Decorative arc */}
                <svg style={{ position: 'absolute', right: '-60px', top: '10%', opacity: 0.06 }} width="600" height="600" viewBox="0 0 600 600" fill="none">
                    <circle cx="300" cy="300" r="280" stroke={T.brand} strokeWidth="1.5" strokeDasharray="8 12"/>
                    <circle cx="300" cy="300" r="200" stroke={T.accent} strokeWidth="1" strokeDasharray="4 8"/>
                </svg>
            </div>

            <div style={{ position: 'relative', zIndex: 1, maxWidth: 1280, margin: '0 auto', padding: '80px 24px', width: '100%' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '5rem', alignItems: 'center' }} className="mc-hero-grid">

                    {/* ── LEFT COLUMN ── */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
                        {/* Badge */}
                        <div className="mc-hero-badge">
                            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '5px 14px', borderRadius: 99, border: `1.5px solid rgba(22,163,74,0.25)`, background: 'rgba(22,163,74,0.07)', fontSize: '0.72rem', fontWeight: 700, color: T.brandD, textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                                <span style={{ width: 7, height: 7, borderRadius: '50%', background: T.brandD, display: 'inline-block', animation: 'mc-pulse 2s infinite' }}/>
                                Aplikasi Kesehatan Mata #1 Indonesia
                            </span>
                        </div>

                        {/* Headline with word-by-word reveal */}
                        <h1 className="mc-hero-h1" style={{ fontSize: 'clamp(2.4rem, 5vw, 3.9rem)', fontWeight: 900, letterSpacing: '-0.04em', lineHeight: 1.1, margin: 0, color: T.text, overflow: 'hidden' }}>
                            {['Download App,', 'Uji Mata Kamu,'].map((line, li) => (
                                <span key={li} style={{ display: 'block' }}>
                                    {line.split(' ').map((w, wi) => (
                                        <span key={wi} className="mc-word" style={{ display: 'inline-block', marginRight: '0.25em' }}>{w}</span>
                                    ))}
                                </span>
                            ))}
                            <span className="mc-word" style={{ display: 'inline-block', background: T.grad, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                                Lihat Lebih Jelas!
                            </span>
                        </h1>

                        {/* Body text */}
                        <p className="mc-hero-body" style={{ fontSize: '1.05rem', color: T.text2, lineHeight: 1.75, margin: 0, maxWidth: 490 }}>
                            Download MataCeria dari PlayStore atau App Store, buat akun gratis, dan uji kesehatan mata <strong style={{ color: T.text }}>rabun jauh</strong>, <strong style={{ color: T.text }}>rabun dekat</strong>, dan <strong style={{ color: T.text }}>silinder</strong> hanya dalam 3 menit.
                        </p>

                        {/* Store buttons */}
                        <div className="mc-hero-store">
                            <StoreButtons apkRoute={apkRoute} onStoreClick={onStoreClick} />
                        </div>

                        {/* Trust badges */}
                        <div className="mc-hero-trust" style={{ display: 'flex', flexWrap: 'wrap', gap: 20 }}>
                            {[
                                { icon: <Star size={16} color="#FBBF24" fill="#FBBF24" />, title: '4.9/5 Rating', desc: '12.000+ ulasan' },
                                { icon: <Shield size={16} color={T.brand} />, title: 'Kemenkes', desc: 'Terstandarisasi Medis' },
                                { icon: <Zap size={16} color={T.brand} fill={T.brand} />, title: '3 Menit', desc: 'Hasil instan' }
                            ].map((item, index) => (
                                <div key={index} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                    <span style={{ display: 'flex', alignItems: 'center' }}>{item.icon}</span>
                                    <div>
                                        <div style={{ fontSize: '0.78rem', fontWeight: 700, color: T.text }}>{item.title}</div>
                                        <div style={{ fontSize: '0.65rem', color: T.text3 }}>{item.desc}</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* ── RIGHT COLUMN ── */}
                    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', position: 'relative' }}>
                        {/* Decorative rings */}
                        <div style={{ position: 'absolute', width: 460, height: 460, borderRadius: '50%', border: '1.5px dashed rgba(22,163,74,0.14)', animation: 'mc-spin-slow 35s linear infinite' }}/>
                        <div style={{ position: 'absolute', width: 350, height: 350, borderRadius: '50%', border: '1px solid rgba(5,150,105,0.08)' }}/>

                        {/* Floating accent chips */}
                        <motion.div className="mc-hero-chip-1"
                            animate={{ y: [0, -9, 0] }} transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
                            style={{ position: 'absolute', top: '8%', left: '-4%', background: '#fff', borderRadius: 14, padding: '10px 14px', boxShadow: T.shadowM, border: `1px solid ${T.border}`, zIndex: 5 }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                <div style={{ width: 28, height: 28, borderRadius: 8, background: T.grad, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                                </div>
                                <div>
                                    <div style={{ fontSize: '0.58rem', color: T.text3 }}>Diagnostik</div>
                                    <div style={{ fontSize: '0.72rem', fontWeight: 800, color: T.brand }}>20/20 Normal</div>
                                </div>
                            </div>
                        </motion.div>

                        <motion.div className="mc-hero-chip-2"
                            animate={{ y: [0, 9, 0] }} transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
                            style={{ position: 'absolute', bottom: '10%', right: '-4%', background: '#fff', borderRadius: 14, padding: '10px 14px', boxShadow: T.shadowM, border: `1px solid ${T.border}`, zIndex: 5 }}>
                            <div style={{ fontSize: '0.58rem', color: T.text3, marginBottom: 3 }}>AI Score</div>
                            <div style={{ fontSize: '1rem', fontWeight: 900, color: T.brand, display: 'flex', alignItems: 'center', gap: 4 }}>
                                9.8/10 <Star size={14} color="#FBBF24" fill="#FBBF24" />
                            </div>
                        </motion.div>

                        {/* Phone mockup with screen transition */}
                        <div className="mc-hero-phone">
                            <AnimatePresence mode="wait">
                                <motion.div key={screenIdx}
                                    initial={{ opacity: 0, scale: 0.94, y: 14 }}
                                    animate={{ opacity: 1, scale: 1, y: 0 }}
                                    exit={{ opacity: 0, scale: 0.94, y: -14 }}
                                    transition={{ duration: 0.45, ease: [0.25, 0.46, 0.45, 0.94] }}>
                                    <PhoneMockup screen={screens[screenIdx]} size="lg" />
                                </motion.div>
                            </AnimatePresence>
                        </div>
                    </div>
                </div>
            </div>

            {/* Scroll cue */}
            <motion.div animate={{ y: [0, 8, 0] }} transition={{ duration: 2, repeat: Infinity }}
                style={{ position: 'absolute', bottom: 28, left: '50%', transform: 'translateX(-50%)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, opacity: 0.38 }}>
                <span style={{ fontSize: '0.6rem', textTransform: 'uppercase', letterSpacing: '0.12em', color: T.text3, fontFamily: T.font }}>Gulir</span>
                <div style={{ width: 1, height: 24, background: `linear-gradient(to bottom, ${T.brand}, transparent)` }}/>
            </motion.div>
        </section>
    );
}

/* ═══════════════════════════════════════════════
   SCROLL-REVEAL HELPER HOOK
═══════════════════════════════════════════════ */
function useScrollReveal(selector, options = {}, trigger = true) {
    useEffect(() => {
        if (!trigger) return;
        const { delay = 0, y = 0, x = 0, scale = 1, duration = 0.8, stagger = 0 } = options;
        const els = document.querySelectorAll(selector);
        if (!els.length) return;

        const obs = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const target = entry.target;
                    const animParams = { opacity: 0, duration, ease: 'power3.out', delay };
                    if (y !== 0) animParams.y = y;
                    if (x !== 0) animParams.x = x;
                    if (scale !== 1) animParams.scale = scale;
                    
                    if (stagger > 0 && target.children.length > 0) {
                        gsap.from(Array.from(target.children), { ...animParams, stagger });
                    } else {
                        gsap.from(target, animParams);
                    }
                    obs.unobserve(target);
                }
            });
        }, { threshold: 0.15 });

        els.forEach(el => obs.observe(el));
        return () => obs.disconnect();
    }, [trigger]);
}

/* ═══════════════════════════════════════════════
   HOW IT WORKS — 4 steps with scroll-reveal
═══════════════════════════════════════════════ */
function HowItWorks() {
    const steps = [
        { num: 1, icon: <Smartphone size={20} color={T.brand} />, title: 'Download Aplikasi', desc: 'Unduh MataCeria gratis dari Play Store atau App Store. Daftar akun hanya 30 detik.' },
        { num: 2, icon: <Eye size={20} color={T.brand} />, title: 'Pilih Jenis Tes', desc: 'Pilih tes: Rabun Jauh (Myopia), Rabun Dekat (Hyperopia), atau Silinder (Astigmatisme).' },
        { num: 3, icon: <Target size={20} color={T.brand} />, title: 'Tes Dipandu AI', desc: 'Ikuti panduan langkah demi langkah. Kalibrasi jarak dilakukan otomatis oleh AI.' },
        { num: 4, icon: <BarChart3 size={20} color={T.brand} />, title: 'Terima Hasil', desc: 'Dapatkan interpretasi klinis instan & rekomendasi langkah selanjutnya dari AI.' },
    ];

    return (
        <section id="cara-kerja" style={{ padding: '100px 0', background: T.bgAlt, position: 'relative', overflow: 'hidden', fontFamily: T.font }}>
            {/* Subtle arch connector */}
            <div style={{ position: 'absolute', top: 0, left: '50%', transform: 'translateX(-50%)', width: '80%', height: 2, background: `linear-gradient(90deg, transparent, ${T.borderM}, transparent)` }}/>

            <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 24px' }}>
                <div className="sr-up" style={{ textAlign: 'center', marginBottom: 64 }}>
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '5px 14px', borderRadius: 99, border: `1.5px solid rgba(22,163,74,0.22)`, background: 'rgba(22,163,74,0.07)', fontSize: '0.72rem', fontWeight: 700, color: T.brandD, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 18 }}>
                        Mudah & Cepat
                    </span>
                    <h2 style={{ fontSize: 'clamp(1.75rem, 3.5vw, 2.75rem)', fontWeight: 800, letterSpacing: '-0.04em', color: T.text, margin: '0 0 14px' }}>
                        Bagaimana MataCeria Bekerja?
                    </h2>
                    <p style={{ fontSize: '1rem', color: T.text2, maxWidth: 520, margin: '0 auto', lineHeight: 1.7 }}>
                        Dalam 4 langkah sederhana, Anda bisa mengetahui kondisi penglihatan Anda secara akurat dan aman.
                    </p>
                </div>

                {/* Steps */}
                <div className="mc-steps-grid sr-stagger-up" style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '2rem 4rem', alignItems: 'start' }}>
                    {steps.map((s, i) => (
                        <div key={s.num} className="mc-step-card" style={{ display: 'flex', gap: 20, alignItems: 'flex-start' }}>
                            <div style={{
                                width: 56, height: 56, borderRadius: '50%', flexShrink: 0,
                                background: s.num % 2 === 1 ? T.grad : 'transparent',
                                border: s.num % 2 === 0 ? `2.5px solid ${T.borderM}` : 'none',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                fontWeight: 900, fontSize: '1.25rem',
                                color: s.num % 2 === 1 ? '#fff' : T.brand,
                                boxShadow: s.num % 2 === 1 ? '0 4px 20px rgba(22,163,74,0.3)' : 'none',
                            }}>
                                {s.num}
                            </div>
                            <div style={{ paddingTop: 6 }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                                    <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>{s.icon}</span>
                                    <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: T.text, margin: 0 }}>{s.title}</h3>
                                </div>
                                <p style={{ fontSize: '0.9rem', color: T.text2, lineHeight: 1.7, margin: 0 }}>{s.desc}</p>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Center phone */}
                <div className="sr-scale" style={{ display: 'flex', justifyContent: 'center', marginTop: 72, position: 'relative' }}>
                    <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', width: 420, height: 420, borderRadius: '50%', background: 'radial-gradient(circle, rgba(22,163,74,0.09), transparent 70%)', filter: 'blur(40px)' }}/>
                    <PhoneMockup screen={<ScreenResult />} size="md" />
                </div>
            </div>
        </section>
    );
}

/* ═══════════════════════════════════════════════
   HOW DOES IT WORK — Tabs Pasien / Dokter
═══════════════════════════════════════════════ */
function HowDoesItWork() {
    const [tab, setTab] = useState(0);

    const data = [
        {
            features: [
                { icon: <ClipboardList size={22} color={T.brand} />, title: 'Pilih Pemeriksaan', desc: 'Pilih tes yang ingin dilakukan — rabun jauh, rabun dekat, atau astigmatisme.' },
                { icon: <Bot size={22} color={T.brand} />, title: 'Panduan AI Real-time', desc: 'AI MataCeria memandu setiap langkah tes secara real-time untuk hasil optimal.' },
                { icon: <Rocket size={22} color={T.brand} />, title: 'Tes Mandiri di Mana Saja', desc: 'Tes dilakukan langsung dari smartphone, tanpa peralatan khusus atau kunjungan klinik.' },
            ],
            screens: [<ScreenSnellen />, <ScreenHome />],
        },
        {
            features: [
                { icon: <BarChart3 size={22} color={T.brand} />, title: 'Dashboard Pasien', desc: 'Pantau hasil tes mandiri semua pasien di satu dasbor terintegrasi secara real-time.' },
                { icon: <MessageSquare size={22} color={T.brand} />, title: 'Konsultasi Terenkripsi', desc: 'Hubungi pasien melalui chat aman untuk memberikan interpretasi dan rekomendasi klinis.' },
                { icon: <FileText size={22} color={T.brand} />, title: 'Ekspor Laporan Klinis', desc: 'Cetak atau unduh laporan digital berformat medis yang terstandarisasi kapan saja.' },
            ],
            screens: [<ScreenResult />, <ScreenAstigmat />],
        },
    ];

    const active = data[tab];

    return (
        <section id="fitur" style={{ padding: '100px 0', background: T.bg, fontFamily: T.font }}>
            <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 24px' }}>
                <div className="sr-up" style={{ textAlign: 'center', marginBottom: 48 }}>
                    <h2 style={{ fontSize: 'clamp(1.75rem, 3.5vw, 2.75rem)', fontWeight: 800, letterSpacing: '-0.04em', color: T.text, margin: '0 0 14px' }}>
                        Bagaimana Aplikasi Ini Bekerja?
                    </h2>
                    <p style={{ fontSize: '1rem', color: T.text2, maxWidth: 520, margin: '0 auto 28px', lineHeight: 1.7 }}>
                        MataCeria dirancang untuk pengguna awam maupun tenaga medis profesional.
                    </p>
                    {/* Tab switcher */}
                    <div style={{ display: 'inline-flex', background: T.bgAlt, borderRadius: 14, padding: 5, border: `1px solid ${T.border}` }}>
                        {['Pengguna / Pasien', 'Dokter / Klinik'].map((t, i) => (
                            <button key={t} onClick={() => setTab(i)} style={{
                                padding: '10px 26px', borderRadius: 10, border: 'none', cursor: 'pointer',
                                background: tab === i ? T.grad : 'transparent',
                                color: tab === i ? '#fff' : T.text2,
                                fontWeight: tab === i ? 700 : 500,
                                fontSize: '0.875rem', fontFamily: T.font,
                                boxShadow: tab === i ? '0 4px 14px rgba(22,163,74,0.25)' : 'none',
                                transition: 'all 0.28s ease',
                            }}>
                                {t}
                            </button>
                        ))}
                    </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4rem', alignItems: 'center' }} className="mc-tab-grid">
                    {/* Left: phones */}
                    <div className="sr-scale" style={{ display: 'flex', gap: 14, justifyContent: 'center', alignItems: 'flex-end', position: 'relative' }}>
                        <div style={{ position: 'absolute', top: '20%', left: '50%', transform: 'translateX(-50%)', width: 300, height: 300, borderRadius: '50%', background: 'radial-gradient(circle, rgba(22,163,74,0.07), transparent 70%)', filter: 'blur(30px)' }}/>
                        <AnimatePresence mode="wait">
                            <motion.div key={`${tab}-main`}
                                initial={{ opacity: 0, x: -20, scale: 0.94 }}
                                animate={{ opacity: 1, x: 0, scale: 1 }}
                                exit={{ opacity: 0, x: 20, scale: 0.94 }}
                                transition={{ duration: 0.38 }}>
                                <PhoneMockup screen={active.screens[0]} size="md" />
                            </motion.div>
                        </AnimatePresence>
                        <AnimatePresence mode="wait">
                            <motion.div key={`${tab}-sub`}
                                initial={{ opacity: 0, x: 20, scale: 0.94 }}
                                animate={{ opacity: 1, x: 0, scale: 1 }}
                                exit={{ opacity: 0, x: -20, scale: 0.94 }}
                                transition={{ duration: 0.38, delay: 0.08 }}
                                style={{ marginBottom: -30 }}
                                className="mc-secondary-phone">
                                <PhoneMockup screen={active.screens[1]} size="sm" float={false} />
                            </motion.div>
                        </AnimatePresence>
                    </div>

                    {/* Right: features */}
                    <div className="sr-up" style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>
                        <AnimatePresence mode="wait">
                            <motion.div key={tab}
                                initial={{ opacity: 0, y: 14 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -14 }}
                                transition={{ duration: 0.32 }}
                                style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>
                                {active.features.map((f, i) => (
                                    <motion.div key={f.title}
                                        initial={{ opacity: 0, x: 20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: i * 0.1, duration: 0.4 }}
                                        style={{ display: 'flex', gap: 18, alignItems: 'flex-start' }}>
                                        <div style={{ width: 50, height: 50, borderRadius: 14, background: T.gradSoft, border: `1.5px solid ${T.border}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.4rem', flexShrink: 0 }}>
                                            {f.icon}
                                        </div>
                                        <div>
                                            <h3 style={{ fontSize: '1rem', fontWeight: 800, color: T.text, margin: '0 0 6px' }}>{f.title}</h3>
                                            <p style={{ fontSize: '0.875rem', color: T.text2, lineHeight: 1.65, margin: 0 }}>{f.desc}</p>
                                        </div>
                                    </motion.div>
                                ))}
                            </motion.div>
                        </AnimatePresence>
                    </div>
                </div>
            </div>
        </section>
    );
}

/* ═══════════════════════════════════════════════
   TESTIMONIALS CAROUSEL
═══════════════════════════════════════════════ */
const REVIEWS = [
    { name: 'Rina Marlina', role: 'Guru SD, Bandung', rating: 5, type: 'Tes Rabun Jauh', text: 'Bagan Snellen digital MataCeria sangat akurat! Kalibrasi jarak kameranya cerdas. Dokter bilang hasilnya hampir sama persis dengan pemeriksaan klinik.' },
    { name: 'Farhan Hidayat', role: 'Mahasiswa, Jakarta', rating: 5, type: 'Tes Silinder', text: 'Terdeteksi distorsi 30 derajat di tes silinder. Setelah pakai kacamata dari rekomendasi MataCeria, baca kode di laptop jauh lebih nyaman!' },
    { name: 'dr. Siti Rahma, Sp.M', role: 'Spesialis Mata, Surabaya', rating: 5, type: 'Platform Dokter', text: 'Dashboard dokternya sangat membantu memantau pasien. Fitur laporan klinisnya sudah terformat dengan baik dan profesional.' },
    { name: 'Dewi Kusuma', role: 'Ibu Rumah Tangga, Yogya', rating: 5, type: 'Tes Anak', text: 'Antarmuka tesnya ramah anak! Anak saya yang 8 tahun bisa ikut tes tanpa takut seperti di klinik biasa. Ada rekomendasi AI-nya juga.' },
    { name: 'Budi Santoso', role: 'Karyawan, Medan', rating: 5, type: 'Tes Rabun Dekat', text: 'Sudah 3 kali pakai, hasilnya konsisten. Grafik tren ketajaman visual di dasbor sangat membantu melacak perkembangan kondisi mata.' },
    { name: 'Kevin Pratama', role: 'Developer, Bali', rating: 5, type: 'UI/UX Feedback', text: 'UI-nya clean dan premium. Pengalaman pakainya mulus. Hasil langsung tersimpan di histori. Reminder 20-20-20-nya berguna banget!' },
];

function Testimonials() {
    const [idx, setIdx] = useState(0);
    const [perView, setPerView] = useState(() => {
        if (typeof window !== 'undefined') {
            return window.innerWidth < 768 ? 1 : window.innerWidth < 1100 ? 2 : 3;
        }
        return 3;
    });
    const trackRef = useRef(null);

    useEffect(() => {
        const h = () => setPerView(window.innerWidth < 768 ? 1 : window.innerWidth < 1100 ? 2 : 3);
        h(); window.addEventListener('resize', h); return () => window.removeEventListener('resize', h);
    }, []);

    const max = REVIEWS.length - perView;

    return (
        <section id="ulasan" style={{ padding: '100px 0', background: T.bgAlt, overflow: 'hidden', fontFamily: T.font }}>
            <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 24px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 48, flexWrap: 'wrap', gap: 20 }}>
                    <div className="sr-up">
                        <span style={{ display: 'block', width: 'max-content', marginBottom: 14, padding: '5px 14px', borderRadius: 99, border: `1.5px solid rgba(22,163,74,0.22)`, background: 'rgba(22,163,74,0.07)', fontSize: '0.72rem', fontWeight: 700, color: T.brandD, textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                            Testimoni Nyata
                        </span>
                        <h2 style={{ fontSize: 'clamp(1.75rem, 3.5vw, 2.75rem)', fontWeight: 800, letterSpacing: '-0.04em', color: T.text, margin: 0 }}>
                            Dipercaya{' '}
                            <span style={{ background: T.grad, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                                50.000+
                            </span>{' '}
                            Pengguna
                        </h2>
                    </div>

                    <div style={{ display: 'flex', gap: 10 }}>
                        {[0, 1].map(dir => (
                            <button key={dir}
                                onClick={() => setIdx(p => dir === 0 ? Math.max(p - 1, 0) : Math.min(p + 1, max))}
                                disabled={dir === 0 ? idx === 0 : idx === max}
                                aria-label={dir === 0 ? "Ulasan sebelumnya" : "Ulasan berikutnya"}
                                style={{ width: 44, height: 44, borderRadius: '50%', border: `1.5px solid ${T.border}`, background: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: (dir === 0 ? idx === 0 : idx === max) ? 0.3 : 1, transition: 'all 0.2s', boxShadow: T.shadow }}
                                onMouseEnter={e => { if (!((dir === 0 ? idx === 0 : idx === max))) { e.currentTarget.style.borderColor = T.brand; e.currentTarget.style.background = T.gradSoft; } }}
                                onMouseLeave={e => { e.currentTarget.style.borderColor = T.border; e.currentTarget.style.background = '#fff'; }}>
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={T.text} strokeWidth="2.5">
                                    {dir === 0 ? <path d="M15 18l-6-6 6-6"/> : <path d="M9 18l6-6-6-6"/>}
                                </svg>
                            </button>
                        ))}
                    </div>
                </div>

                <div style={{ overflow: 'hidden' }}>
                    <motion.div
                        animate={{ x: `calc(-${idx * (100 / perView)}% - ${idx * 20}px)` }}
                        transition={{ type: 'spring', stiffness: 160, damping: 24 }}
                        style={{ display: 'flex', gap: 20 }}>
                        {REVIEWS.map((r, i) => (
                            <motion.div key={i}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: (i % perView) * 0.1, duration: 0.6 }}
                                                                style={{ flexShrink: 0, width: `calc((100% - ${(perView - 1) * 20}px) / ${perView})`, background: '#fff', border: `1px solid ${T.border}`, borderRadius: 20, padding: 28, boxShadow: T.shadow, display: 'flex', flexDirection: 'column', gap: 14, transition: 'all 0.2s' }}
                                className="mc-review-card"
                                onMouseEnter={e => { e.currentTarget.style.borderColor = T.brand; e.currentTarget.style.boxShadow = T.shadowM; e.currentTarget.style.transform = 'translateY(-5px)'; }}
                                onMouseLeave={e => { e.currentTarget.style.borderColor = T.border; e.currentTarget.style.boxShadow = T.shadow; e.currentTarget.style.transform = 'none'; }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                    <div style={{ display: 'flex', gap: 2 }}>
                                        {[...Array(r.rating)].map((_, j) => <span key={j} style={{ color: '#FBBF24', fontSize: '0.88rem' }}>★</span>)}
                                    </div>
                                    <span style={{ fontSize: '0.62rem', color: T.brand, background: 'rgba(22,163,74,0.08)', padding: '3px 8px', borderRadius: 6, fontWeight: 700 }}>{r.type}</span>
                                </div>
                                <p style={{ fontSize: '0.875rem', color: T.text2, lineHeight: 1.7, margin: 0, fontStyle: 'italic', flex: 1 }}>"{r.text}"</p>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 10, borderTop: `1px solid ${T.border}`, paddingTop: 14 }}>
                                    <div style={{ width: 38, height: 38, borderRadius: '50%', background: T.grad, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 800, fontSize: '0.9rem', flexShrink: 0 }}>{r.name[0]}</div>
                                    <div>
                                        <div style={{ fontSize: '0.85rem', fontWeight: 700, color: T.text }}>{r.name}</div>
                                        <div style={{ fontSize: '0.7rem', color: T.text3 }}>{r.role}</div>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </motion.div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'center', gap: 8, marginTop: 28 }}>
                    {[...Array(max + 1)].map((_, i) => (
                        <div key={i} onClick={() => setIdx(i)} style={{ width: idx === i ? 24 : 8, height: 8, borderRadius: 4, background: idx === i ? T.brand : T.borderM, cursor: 'pointer', transition: 'all 0.3s' }}/>
                    ))}
                </div>
            </div>
        </section>
    );
}

/* ═══════════════════════════════════════════════
   DOWNLOAD CTA — green gradient panel
═══════════════════════════════════════════════ */
function DownloadCTA({ statsPatients, apkRoute, onStoreClick }) {
    return (
        <section id="app" style={{ padding: '80px 24px', background: T.bg, fontFamily: T.font }}>
            <div style={{ maxWidth: 1100, margin: '0 auto' }}>
                <div
                    className="mc-cta-grid sr-scale"
                    style={{ background: T.grad, borderRadius: 28, padding: '56px 56px', display: 'grid', gridTemplateColumns: '1fr auto', gap: '3rem', alignItems: 'center', overflow: 'hidden', position: 'relative' }}
                >
                    {/* Decorative circles */}
                    <div style={{ position: 'absolute', top: -80, right: 220, width: 280, height: 280, borderRadius: '50%', background: 'rgba(255,255,255,0.07)', pointerEvents: 'none' }}/>
                    <div style={{ position: 'absolute', bottom: -60, right: 90, width: 200, height: 200, borderRadius: '50%', background: 'rgba(255,255,255,0.05)', pointerEvents: 'none' }}/>
                    <div style={{ position: 'absolute', top: -50, left: -50, width: 180, height: 180, borderRadius: '50%', background: 'rgba(255,255,255,0.04)', pointerEvents: 'none' }}/>

                    <div style={{ position: 'relative', zIndex: 1 }}>
                        <h2 style={{ fontSize: 'clamp(1.75rem, 3.5vw, 2.75rem)', fontWeight: 900, letterSpacing: '-0.04em', color: '#fff', margin: '0 0 16px', lineHeight: 1.15 }}>
                            Download MataCeria App
                        </h2>
                        <p style={{ fontSize: '1rem', color: 'rgba(255,255,255,0.82)', lineHeight: 1.7, margin: '0 0 28px', maxWidth: 480 }}>
                            Platform kesehatan mata digital inovatif pertama di Indonesia. Dipercaya oleh{' '}
                            <strong style={{ color: '#fff' }}>{statsPatients || '50.000+'}</strong>{' '}
                            pengguna aktif untuk deteksi dini, tes refraksi, dan konsultasi dokter mata.
                        </p>
                        <StoreButtons inverted={true} apkRoute={apkRoute} onStoreClick={onStoreClick} />
                    </div>

                    <motion.div animate={{ y: [0, -12, 0] }} transition={{ duration: 4.5, repeat: Infinity, ease: 'easeInOut' }}
                        style={{ position: 'relative', zIndex: 1 }}
                        className="mc-cta-phone-container">
                        <div style={{ width: 195, height: 390, borderRadius: 38, background: 'rgba(0,0,0,0.3)', border: '2px solid rgba(255,255,255,0.22)', boxShadow: '0 20px 60px rgba(0,0,0,0.35)', overflow: 'hidden', position: 'relative' }}>
                            <div style={{ position: 'absolute', top: 12, left: '50%', transform: 'translateX(-50%)', width: 68, height: 18, borderRadius: 12, background: 'rgba(0,0,0,0.35)', zIndex: 5 }}/>
                            <div style={{ padding: '36px 12px 12px', height: '100%', display: 'flex', flexDirection: 'column', gap: 10 }}>
                                <div style={{ textAlign: 'center', color: '#fff' }}>
                                    <div style={{ fontSize: '0.52rem', opacity: 0.5, marginBottom: 4 }}>MataCeria App</div>
                                    <div style={{ fontSize: '0.9rem', fontWeight: 900 }}>Hasil Tes Anda</div>
                                </div>
                                <div style={{ background: 'rgba(255,255,255,0.14)', borderRadius: 14, padding: '12px', textAlign: 'center' }}>
                                    <div style={{ fontSize: '1.5rem', fontWeight: 900, color: '#fff' }}>20/20</div>
                                    <div style={{ fontSize: '0.52rem', color: 'rgba(255,255,255,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 3 }}>
                                        Penglihatan Normal <Check size={10} color="#4ADE80" strokeWidth={3} />
                                    </div>
                                </div>
                                {[['Rabun Jauh', 'Normal', '#4ADE80'], ['Rabun Dekat', 'Normal', '#4ADE80'], ['Silinder', 'Terdeteksi', '#FBBF24']].map(([l, v, c]) => (
                                    <div key={l} style={{ background: 'rgba(255,255,255,0.09)', borderRadius: 10, padding: '8px 10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <span style={{ fontSize: '0.52rem', color: 'rgba(255,255,255,0.7)' }}>{l}</span>
                                        <span style={{ fontSize: '0.52rem', fontWeight: 700, color: c }}>{v}</span>
                                    </div>
                                ))}
                                <div style={{ background: 'rgba(255,255,255,0.92)', borderRadius: 10, padding: '8px 10px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4, marginTop: 'auto', cursor: 'pointer' }}>
                                    <Play size={10} color={T.brand} fill={T.brand} />
                                    <div style={{ fontSize: '0.6rem', fontWeight: 800, color: T.brand }}>Tes Ulang</div>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}

/* ═══════════════════════════════════════════════
   FOOTER
 ═══════════════════════════════════════════════ */
function Footer({ onGeneralClick }) {
    const cols = [
        { 
            title: 'Quick Links', 
            links: [
                { label: 'Beranda', href: '#beranda' }, 
                { label: 'Fitur', href: '#fitur' }, 
                { label: 'Cara Kerja', href: '#cara-kerja' }, 
                { label: 'Privacy Policy', href: '#', onClick: () => onGeneralClick('Kebijakan Privasi') }, 
                { label: 'Terms & Conditions', href: '#', onClick: () => onGeneralClick('Syarat & Ketentuan') }
            ] 
        },
        { 
            title: 'About Us', 
            links: [
                { label: 'Our Team', href: '#', onClick: () => onGeneralClick('Tim Kami') }, 
                { label: 'Our Story', href: '#', onClick: () => onGeneralClick('Sejarah Kami') }, 
                { label: 'Blog', href: '#', onClick: () => onGeneralClick('Blog & Berita') }, 
                { label: 'Careers', href: '#', onClick: () => onGeneralClick('Karir') }
            ] 
        },
        { 
            title: 'Contacts', 
            links: [
                { label: 'hello@mataceria.com', href: 'mailto:hello@mataceria.com' }, 
                { label: 'Jl. Sudirman No. 1, Jakarta', href: 'https://maps.google.com/?q=-6.2183,106.8021', target: '_blank', rel: 'noopener noreferrer' }, 
                { label: '+62 812-3456-7890', href: 'tel:+6281234567890' }
            ] 
        },
    ];
    return (
        <footer style={{ background: T.bgDark, color: '#fff', padding: '64px 0 0', fontFamily: T.font }}>
            <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 24px' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1.5fr repeat(3, 1fr)', gap: '3rem', marginBottom: '3rem' }} className="mc-footer-grid">
                    <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
                            <div style={{ width: 36, height: 36, borderRadius: 10, background: T.grad, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                            </div>
                            <span style={{ fontWeight: 800, fontSize: '1.15rem' }}>Mata<span style={{ color: T.brandL }}>Ceria</span></span>
                        </div>
                        <p style={{ fontSize: '0.875rem', color: 'rgba(255,255,255,0.65)', lineHeight: 1.7, maxWidth: 260, margin: '0 0 24px' }}>
                            Platform revolusioner kesehatan mata digital di Indonesia. Membantu pengguna memahami kondisi penglihatan dengan teknologi AI terdepan.
                        </p>
                        <div style={{ display: 'flex', gap: 10 }}>
                            {['Facebook', 'LinkedIn', 'Instagram'].map(s => {
                                const disp = s === 'Facebook' ? 'f' : s === 'LinkedIn' ? 'in' : 'ig';
                                return (
                                    <a key={s} href="#" onClick={(e) => { e.preventDefault(); onGeneralClick(`Media Sosial ${s}`); }} style={{ width: 36, height: 36, borderRadius: 10, background: 'rgba(255,255,255,0.06)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'rgba(255,255,255,0.65)', fontSize: '0.8rem', fontWeight: 700, textDecoration: 'none', transition: 'all 0.2s' }}
                                       onMouseEnter={e => { e.currentTarget.style.background = T.grad; e.currentTarget.style.color = '#fff'; }}
                                       onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.06)'; e.currentTarget.style.color = 'rgba(255,255,255,0.65)'; }}>
                                        {disp}
                                    </a>
                                );
                            })}
                        </div>
                    </div>
                    {cols.map(c => (
                        <div key={c.title}>
                            <p style={{ fontSize: '0.72rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'rgba(255,255,255,0.5)', margin: '0 0 16px' }}>{c.title}</p>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                                {c.links.map(link => {
                                    const linkProps = {
                                        href: link.href,
                                        style: { fontSize: '0.875rem', color: 'rgba(255,255,255,0.7)', textDecoration: 'none', transition: 'color 0.15s' },
                                        onMouseEnter: e => e.currentTarget.style.color = T.brandL,
                                        onMouseLeave: e => e.currentTarget.style.color = 'rgba(255,255,255,0.7)'
                                    };
                                    if (link.onClick) {
                                        linkProps.onClick = (e) => { e.preventDefault(); link.onClick(); };
                                    }
                                    if (link.target) linkProps.target = link.target;
                                    if (link.rel) linkProps.rel = link.rel;
                                    return (
                                        <a key={link.label} {...linkProps}>
                                            {link.label}
                                        </a>
                                    );
                                })}
                            </div>
                        </div>
                    ))}
                </div>
                <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)', padding: '24px 0', textAlign: 'center' }}>
                    <p style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.48)', margin: 0 }}>
                        Copyright © {new Date().getFullYear()} MataCeria · All rights reserved.
                    </p>
                </div>
            </div>
        </footer>
    );
}

/* ═══════════════════════════════════════════════
   ROOT APP
═══════════════════════════════════════════════ */
export default function WelcomeApp({ loginRoute, adminRoute, isAuthenticated, userName, statsPatients, statsDoctors, apkRoute }) {
    const [scrolled, setScrolled] = useState(false);
    const [showCurtain, setShowCurtain] = useState(true);
    const [comingSoon, setComingSoon] = useState(false);
    const [modalTitle, setModalTitle] = useState('');
    const [modalDesc, setModalDesc] = useState('');
    const [modalType, setModalType] = useState('store'); // 'store' or 'general'
    const [platform, setPlatform] = useState('');

    useScrollReveal('.sr-up', { y: 45, duration: 0.95 }, !showCurtain);
    useScrollReveal('.sr-down', { y: -45, duration: 0.95 }, !showCurtain);
    useScrollReveal('.sr-scale', { scale: 0.95, duration: 0.95 }, !showCurtain);
    useScrollReveal('.sr-stagger-up', { y: 35, duration: 0.85, stagger: 0.12 }, !showCurtain);

    useEffect(() => {
        const detector = document.getElementById('scroll-detector');
        let observer;
        if (detector) {
            observer = new IntersectionObserver(([entry]) => {
                setScrolled(!entry.isIntersecting);
            }, { threshold: 0 });
            observer.observe(detector);
        }
        if (typeof window.__mcReady === 'function') window.__mcReady();
        return () => {
            if (observer) observer.disconnect();
        };
    }, []);

    const handleStoreClick = (p) => {
        setPlatform(p);
        setModalType('store');
        setModalTitle(`Segera Hadir di ${p}!`);
        setModalDesc(`Aplikasi MataCeria saat ini sedang dalam proses review di ${p === 'App Store' ? 'Apple App Store' : 'Google Play Store'}. Kami akan segera hadir untuk Anda!`);
        setComingSoon(true);
    };

    const handleGeneralClick = (title) => {
        setModalType('general');
        setModalTitle(`Halaman ${title} Segera Hadir`);
        setModalDesc(`Fitur atau informasi mengenai "${title}" sedang dalam pengembangan oleh tim pengembang kami.`);
        setComingSoon(true);
    };

    return (
        <div style={{ background: T.bg, minHeight: '100vh', fontFamily: T.font, overflowX: 'hidden' }}>
            {/* Scroll detector for sticky capsule navbar */}
            <div id="scroll-detector" style={{ position: 'absolute', top: 40, left: 0, width: '1px', height: '1px', pointerEvents: 'none', visibility: 'hidden' }} />
            {/* Page-load curtain animation */}
            {showCurtain && (
                <PageLoadAnimation onComplete={() => setShowCurtain(false)} />
            )}

            <Navbar loginRoute={loginRoute} adminRoute={adminRoute} isAuthenticated={isAuthenticated} userName={userName} scrolled={scrolled} />
            <main>
                <HeroSection loginRoute={loginRoute} adminRoute={adminRoute} isAuthenticated={isAuthenticated} apkRoute={apkRoute} onStoreClick={handleStoreClick} />
                <HowItWorks />
                <HowDoesItWork />
                <Testimonials />
                <DownloadCTA isAuthenticated={isAuthenticated} statsPatients={statsPatients} apkRoute={apkRoute} onStoreClick={handleStoreClick} />
            </main>
            <Footer onGeneralClick={handleGeneralClick} />

            {/* Premium Coming Soon Modal */}
            <AnimatePresence>
                {comingSoon && (
                    <div style={{
                        position: 'fixed', inset: 0, zIndex: 10000,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        background: 'rgba(15,41,24,0.3)', backdropFilter: 'blur(12px)',
                        padding: 24,
                        fontFamily: T.font
                    }} onClick={() => setComingSoon(false)}>
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 16 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 16 }}
                            onClick={e => e.stopPropagation()}
                            style={{
                                width: '100%', maxWidth: 440,
                                background: '#ffffff',
                                borderRadius: 24, border: `1.5px solid ${T.borderM}`,
                                boxShadow: '0 24px 60px rgba(15,41,24,0.18)',
                                padding: 32,
                                position: 'relative',
                                textAlign: 'center'
                            }}
                        >
                            {/* Close Button */}
                            <button
                                onClick={() => setComingSoon(false)}
                                style={{
                                    position: 'absolute', top: 20, right: 20,
                                    background: 'transparent', border: 'none', cursor: 'pointer',
                                    color: T.text3, transition: 'color 0.2s'
                                }}
                                onMouseEnter={e => e.currentTarget.style.color = T.brand}
                                onMouseLeave={e => e.currentTarget.style.color = T.text3}
                            >
                                <X size={20} />
                            </button>

                            {/* Icon */}
                            <div style={{
                                width: 64, height: 64, borderRadius: '50%',
                                background: T.gradSoft, border: `1.5px solid ${T.border}`,
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                margin: '0 auto 20px', color: T.brand
                            }}>
                                <Smartphone size={28} />
                            </div>

                            {/* Content */}
                            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: T.text, margin: '0 0 12px' }}>
                                {modalTitle}
                            </h3>
                            <p style={{ fontSize: '0.88rem', color: T.text2, lineHeight: 1.6, margin: '0 0 24px' }}>
                                {modalDesc}
                            </p>

                            {/* Android APK Alternative Callout */}
                            {modalType === 'store' && (
                                <div style={{
                                    background: T.bgAlt, border: `1px solid ${T.border}`,
                                    borderRadius: 16, padding: '16px 20px', marginBottom: 24,
                                    textAlign: 'left'
                                }}>
                                    <div style={{ fontSize: '0.8rem', fontWeight: 700, color: T.text, marginBottom: 4 }}>
                                        Pengguna Android?
                                    </div>
                                    <div style={{ fontSize: '0.72rem', color: T.text2, lineHeight: 1.4 }}>
                                        Anda dapat mengunduh berkas APK secara langsung untuk mulai mencoba aplikasi sekarang.
                                    </div>
                                </div>
                            )}

                            {/* Action Buttons */}
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                                {modalType === 'store' && (
                                    <a
                                        href={apkRoute || '/downloads/mataceria-latest.apk'}
                                        style={{
                                            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                                            padding: '12px 24px', borderRadius: 12,
                                            background: T.grad, color: '#fff',
                                            fontSize: '0.9rem', fontWeight: 700, textDecoration: 'none',
                                            boxShadow: '0 4px 14px rgba(22,163,74,0.3)',
                                            transition: 'all 0.2s'
                                        }}
                                        onMouseEnter={e => e.currentTarget.style.boxShadow = '0 6px 20px rgba(22,163,74,0.4)'}
                                        onMouseLeave={e => e.currentTarget.style.boxShadow = '0 4px 14px rgba(22,163,74,0.3)'}
                                        onClick={() => setComingSoon(false)}
                                    >
                                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ transform: 'rotate(0deg)' }}>
                                            <line x1="12" y1="5" x2="12" y2="19"></line>
                                            <polyline points="19 12 12 19 5 12"></polyline>
                                        </svg>
                                        Unduh APK Langsung
                                    </a>
                                )}

                                <button
                                    onClick={() => setComingSoon(false)}
                                    style={{
                                        padding: '12px 24px', borderRadius: 12,
                                        border: `1.5px solid ${T.borderM}`, background: 'transparent',
                                        color: T.text2, fontSize: '0.9rem', fontWeight: 600,
                                        cursor: 'pointer', transition: 'all 0.2s'
                                    }}
                                    onMouseEnter={e => e.currentTarget.style.borderColor = T.brand}
                                    onMouseLeave={e => e.currentTarget.style.borderColor = T.borderM}
                                >
                                    Tutup
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* Global styles */}
            <style>{`
                *, *::before, *::after { box-sizing: border-box; }
                html { scroll-behavior: smooth; }
                body { margin: 0; -webkit-font-smoothing: antialiased; }
                ::selection { background: rgba(22,163,74,0.2); color: #0F2918; }

                /* Keyframes */
                @keyframes mc-pulse {
                    0%, 100% { opacity: 1; transform: scale(1); }
                    50% { opacity: 0.5; transform: scale(0.85); }
                }
                @keyframes mc-spin-slow {
                    to { transform: rotate(360deg); }
                }

                /* Responsive and Mobile Optimizations */
                .mc-store-buttons {
                    justify-content: flex-start;
                }
                .mc-hero-trust {
                    justify-content: flex-start;
                }
                .mc-cta-phone-container {
                    display: flex;
                    justify-content: flex-end;
                }

                @media (max-width: 1024px) {
                    .mc-hero-grid  { grid-template-columns: 1fr !important; text-align: center !important; }
                    .mc-hero-grid > div { align-items: center !important; }
                    .mc-store-buttons { justify-content: center !important; }
                    .mc-hero-trust { justify-content: center !important; }
                    .mc-steps-grid { grid-template-columns: 1fr !important; }
                    .mc-tab-grid   { grid-template-columns: 1fr !important; }
                    .mc-cta-grid   { grid-template-columns: 1fr !important; }
                    .mc-footer-grid { grid-template-columns: 1fr 1fr !important; }
                    .mc-cta-phone-container { justify-content: center !important; margin-top: 1.5rem; }
                }
                
                @media (max-width: 768px) {
                    .mc-nav-desktop    { display: none !important; }
                    .mc-nav-mobile-btn { display: flex !important; }
                    .mc-footer-grid    { grid-template-columns: 1fr !important; }
                    .mc-cta-grid {
                        padding: 32px 20px !important;
                        text-align: center !important;
                        gap: 2rem !important;
                    }
                    .mc-cta-grid > div:first-of-type {
                        display: flex;
                        flex-direction: column;
                        align-items: center;
                    }
                }

                @media (max-width: 480px) {
                    .mc-secondary-phone {
                        display: none !important;
                    }
                    .mc-review-card {
                        padding: 20px !important;
                    }
                }
            `}</style>
        </div>
    );
}
