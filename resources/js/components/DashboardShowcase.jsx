import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { T } from './WelcomeApp';
import { BarChart3, ShieldCheck, Heart, User, MessageSquare, Clock, ArrowRight } from 'lucide-react';
import { gsap } from 'gsap';

export default function DashboardShowcase() {
    const sectionRef = useRef(null);
    const chartPathRef = useRef(null);

    useEffect(() => {
        // GSAP ScrollTrigger-like reveal without full scrolltrigger library dependencies
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    // Draw the chart path
                    gsap.fromTo(chartPathRef.current, 
                        { strokeDashoffset: 300 }, 
                        { strokeDashoffset: 0, duration: 2, ease: 'power2.out', delay: 0.5 }
                    );

                    // Animate dashboard cards
                    gsap.fromTo('.gsap-dash-card', 
                        { opacity: 0, y: 30 },
                        { opacity: 1, y: 0, stagger: 0.1, duration: 1, ease: 'power3.out' }
                    );
                    
                    // Unobserve after animating once
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.2 });

        if (sectionRef.current) {
            observer.observe(sectionRef.current);
        }

        return () => {
            if (sectionRef.current) observer.disconnect();
        };
    }, []);

    return (
        <section
            ref={sectionRef}
            id="dashboard-showcase"
            style={{
                padding: '120px 0',
                background: T.bg,
                position: 'relative',
                overflow: 'hidden',
                borderTop: '1px solid rgba(255, 255, 255, 0.03)'
            }}
        >
            {/* Glowing neon backdrops */}
            <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 0 }}>
                <div style={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    width: '600px',
                    height: '600px',
                    borderRadius: '50%',
                    background: `radial-gradient(circle, rgba(157, 0, 255, 0.08) 0%, transparent 60%)`,
                    filter: 'blur(50px)'
                }} />
                <div style={{
                    position: 'absolute',
                    top: '20%',
                    right: '10%',
                    width: '350px',
                    height: '350px',
                    borderRadius: '50%',
                    background: `radial-gradient(circle, rgba(255, 46, 147, 0.07) 0%, transparent 70%)`,
                    filter: 'blur(40px)'
                }} />
            </div>

            <div style={{ position: 'relative', zIndex: 1, maxWidth: '1400px', margin: '0 auto', padding: '0 1.5rem' }}>
                
                {/* Section header */}
                <div style={{ textAlign: 'center', marginBottom: '80px' }}>
                    <span style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '6px',
                        padding: '5px 14px',
                        borderRadius: '99px',
                        border: '1px solid rgba(255,255,255,0.08)',
                        background: 'rgba(255,255,255,0.03)',
                        fontSize: '0.75rem',
                        fontWeight: 700,
                        color: T.brand,
                        textTransform: 'uppercase',
                        letterSpacing: '0.1em',
                        marginBottom: '20px'
                    }}>
                        <BarChart3 size={12} />
                        Klinik dalam Genggaman
                    </span>
                    <h2 style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 800, letterSpacing: '-0.04em', color: '#FFF', margin: '0 0 16px', lineHeight: 1.15 }}>
                        Dasbor Kesehatan Mata<br />
                        <span style={{ background: `linear-gradient(135deg, ${T.brand}, ${T.accent})`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', fontWeight: 800 }}>Terintegrasi Secara Personal.</span>
                    </h2>
                    <p style={{ fontSize: '1rem', color: T.text2, maxWidth: '580px', margin: '0 auto', lineHeight: 1.7 }}>
                        Lacak grafik ketajaman penglihatan Anda, kelola hasil pemeriksaan riwayat tes rabun dan silinder, serta dapatkan rekomendasi terapi kustom.
                    </p>
                </div>

                {/* Dashboard layout showcase */}
                <div style={{
                    background: 'rgba(255, 255, 255, 0.03)',
                    border: '1px solid rgba(255, 255, 255, 0.08)',
                    borderRadius: '32px',
                    padding: '40px',
                    backdropFilter: 'blur(20px)',
                    boxShadow: '0 30px 60px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.1)',
                    maxWidth: '1000px',
                    margin: '0 auto'
                }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '32px' }} className="dash-showcase-grid">
                        
                        {/* LEFT COLUMN: Main Chart & Metrics */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                            {/* Dashboard header emulation */}
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                    <div style={{
                                        width: '40px',
                                        height: '40px',
                                        borderRadius: '50%',
                                        background: 'rgba(255, 255, 255, 0.1)',
                                        border: '1px solid rgba(255, 255, 255, 0.2)',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        color: '#FFF'
                                    }}>
                                        <User size={18} />
                                    </div>
                                    <div>
                                        <div style={{ fontSize: '0.9rem', fontWeight: 800, color: '#FFF' }}>Halo, Faiz Jihad</div>
                                        <div style={{ fontSize: '0.7rem', color: T.text3 }}>ID Pengguna: #MC-9428</div>
                                    </div>
                                </div>
                                <div style={{
                                    background: 'rgba(16, 185, 129, 0.1)',
                                    border: `1px solid ${T.green}40`,
                                    borderRadius: '8px',
                                    padding: '6px 12px',
                                    fontSize: '0.7rem',
                                    fontWeight: 700,
                                    color: T.green
                                }}>
                                    Status: Penglihatan Stabil
                                </div>
                            </div>

                            {/* Chart Card */}
                            <div className="gsap-dash-card" style={{
                                background: 'rgba(0, 0, 0, 0.2)',
                                border: '1px solid rgba(255, 255, 255, 0.05)',
                                borderRadius: '20px',
                                padding: '24px',
                                display: 'flex',
                                flexDirection: 'column',
                                gap: '16px'
                            }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <div>
                                        <div style={{ fontSize: '0.875rem', fontWeight: 800, color: '#FFF' }}>Tren Ketajaman Visual (VA)</div>
                                        <div style={{ fontSize: '0.7rem', color: T.text3 }}>Diambil dalam 6 bulan terakhir</div>
                                    </div>
                                    <div style={{ fontSize: '0.75rem', color: T.brand, fontWeight: 700 }}>Mata Kanan OD</div>
                                </div>

                                {/* Graph Area */}
                                <div style={{ position: 'relative', height: '140px', marginTop: '10px' }}>
                                    <svg viewBox="0 0 300 120" style={{ width: '100%', height: '100%', overflow: 'visible' }}>
                                        {/* Chart Grid Lines */}
                                        <line x1="0" y1="20" x2="300" y2="20" stroke="rgba(255, 255, 255, 0.05)" strokeDasharray="3 3" />
                                        <line x1="0" y1="60" x2="300" y2="60" stroke="rgba(255, 255, 255, 0.05)" strokeDasharray="3 3" />
                                        <line x1="0" y1="100" x2="300" y2="100" stroke="rgba(255, 255, 255, 0.05)" strokeDasharray="3 3" />

                                        {/* Trend Line (Pink Neon Glowing Path) */}
                                        <path 
                                            ref={chartPathRef}
                                            d="M 10,95 L 60,80 L 110,85 L 160,50 L 210,35 L 260,25" 
                                            fill="none" 
                                            stroke={T.brand} 
                                            strokeWidth="3.5" 
                                            strokeLinecap="round" 
                                            strokeLinejoin="round" 
                                            strokeDasharray="300"
                                            strokeDashoffset="300"
                                        />

                                        {/* Background fill area */}
                                        <path 
                                            d="M 10,95 L 60,80 L 110,85 L 160,50 L 210,35 L 260,25 L 260,110 L 10,110 Z" 
                                            fill="url(#chart-grad)"
                                            opacity="0.1"
                                        />

                                        {/* Dots on peak values */}
                                        {[
                                            {x:10, y:95, v:'20/50'}, {x:60, y:80, v:'20/40'}, 
                                            {x:110, y:85, v:'20/40'}, {x:160, y:50, v:'20/30'}, 
                                            {x:210, y:35, v:'20/25'}, {x:260, y:25, v:'20/20'}
                                        ].map((pt, i) => (
                                            <g key={i}>
                                                <circle cx={pt.x} cy={pt.y} r="4.5" fill={i === 5 ? T.green : T.brand} stroke="#000" strokeWidth="1.5" />
                                                <text x={pt.x} y={pt.y - 10} fontSize="7" fill="rgba(255,255,255,0.7)" textAnchor="middle">{pt.v}</text>
                                            </g>
                                        ))}

                                        {/* Gradients */}
                                        <defs>
                                            <linearGradient id="chart-grad" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="0%" stopColor={T.brand} />
                                                <stop offset="100%" stopColor="transparent" />
                                            </linearGradient>
                                        </defs>
                                    </svg>
                                </div>

                                {/* Chart Legend */}
                                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem', color: T.text3 }}>
                                    <span>Jan</span><span>Feb</span><span>Mar</span><span>Apr</span><span>Mei</span><span>Jun</span>
                                </div>
                            </div>
                        </div>

                        {/* RIGHT COLUMN: Health Metrics & Action Center */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                            {/* Health metrics container */}
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#FFF', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Detail Optometri</div>
                                
                                {/* Right Eye Card */}
                                <div className="gsap-dash-card" style={{
                                    background: 'rgba(255, 255, 255, 0.03)',
                                    border: '1px solid rgba(255, 255, 255, 0.05)',
                                    borderRadius: '16px',
                                    padding: '14px 18px',
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center'
                                }}>
                                    <div>
                                        <div style={{ fontSize: '0.85rem', fontWeight: 800, color: '#FFF' }}>Mata Kanan (OD)</div>
                                        <div style={{ fontSize: '0.65rem', color: T.text3 }}>Myopia: -0.00 | Normal</div>
                                    </div>
                                    <div style={{ fontSize: '1.15rem', fontWeight: 900, color: T.green }}>20/20</div>
                                </div>

                                {/* Left Eye Card */}
                                <div className="gsap-dash-card" style={{
                                    background: 'rgba(255, 255, 255, 0.03)',
                                    border: '1px solid rgba(255, 255, 255, 0.05)',
                                    borderRadius: '16px',
                                    padding: '14px 18px',
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center'
                                }}>
                                    <div>
                                        <div style={{ fontSize: '0.85rem', fontWeight: 800, color: '#FFF' }}>Mata Kiri (OS)</div>
                                        <div style={{ fontSize: '0.65rem', color: T.text3 }}>Myopia: -1.25 | Silinder: -0.50</div>
                                    </div>
                                    <div style={{ fontSize: '1.15rem', fontWeight: 900, color: T.brand }}>20/40</div>
                                </div>
                            </div>

                            {/* Exercises / Therapy schedule */}
                            <div className="gsap-dash-card" style={{
                                background: 'rgba(255,255,255,0.02)',
                                border: '1px solid rgba(255,255,255,0.06)',
                                borderRadius: '20px',
                                padding: '20px',
                                display: 'flex',
                                flexDirection: 'column',
                                gap: '14px'
                            }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    <Heart size={16} color={T.brand} />
                                    <span style={{ fontSize: '0.8rem', fontWeight: 800, color: '#FFF' }}>Terapi & Latihan Kustom</span>
                                </div>

                                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                    {/* Action 1 */}
                                    <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
                                        <div style={{
                                            width: '20px',
                                            height: '20px',
                                            borderRadius: '50%',
                                            background: `${T.brand}15`,
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            fontSize: '0.65rem',
                                            fontWeight: 700,
                                            color: T.brand,
                                            flexShrink: 0,
                                            marginTop: '2px'
                                        }}>1</div>
                                        <div>
                                            <div style={{ fontSize: '0.78rem', fontWeight: 700, color: '#FFF' }}>Aturan Latihan 20-20-20</div>
                                            <div style={{ fontSize: '0.65rem', color: T.text3 }}>Setiap 20 menit gawai, lihat 20 kaki jauhnya selama 20 detik.</div>
                                        </div>
                                    </div>

                                    {/* Action 2 */}
                                    <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
                                        <div style={{
                                            width: '20px',
                                            height: '20px',
                                            borderRadius: '50%',
                                            background: `${T.accent}15`,
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            fontSize: '0.65rem',
                                            fontWeight: 700,
                                            color: T.accent,
                                            flexShrink: 0,
                                            marginTop: '2px'
                                        }}>2</div>
                                        <div>
                                            <div style={{ fontSize: '0.78rem', fontWeight: 700, color: '#FFF' }}>Rujukan Dokter Terjadwal</div>
                                            <div style={{ fontSize: '0.65rem', color: T.text3 }}>Rekomendasi konsultasi ke dr. Sari Andini, Sp.M.</div>
                                        </div>
                                    </div>
                                </div>

                                {/* Doctor Chat Button Status */}
                                <div style={{
                                    borderTop: '1px solid rgba(255,255,255,0.06)',
                                    paddingTop: '12px',
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center'
                                }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                        <MessageSquare size={14} color={T.green} />
                                        <span style={{ fontSize: '0.7rem', color: T.green, fontWeight: 700 }}>Konsultasi Dokter Terhubung</span>
                                    </div>
                                    <Clock size={12} color={T.text3} />
                                </div>
                            </div>
                        </div>

                    </div>
                </div>

                {/* Subtext info under dashboard */}
                <div style={{ textAlign: 'center', marginTop: '40px' }} className="gsap-dash-card">
                    <a
                        href="#app"
                        style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '8px',
                            color: '#FFF',
                            fontSize: '0.9rem',
                            fontWeight: 700,
                            textDecoration: 'none',
                            transition: 'opacity 0.2s',
                        }}
                        onMouseEnter={e => e.currentTarget.style.opacity = 0.8}
                        onMouseLeave={e => e.currentTarget.style.opacity = 1}
                    >
                        Pelajari Bagaimana AI Menganalisis
                        <ArrowRight size={16} color={T.brand} />
                    </a>
                </div>

            </div>

            {/* Custom Responsive Rules */}
            <style>{`
                @media(max-width: 1024px) {
                    .dash-showcase-grid {
                        grid-template-columns: 1fr !important;
                        gap: 40px !important;
                    }
                }
            `}</style>
        </section>
    );
}
