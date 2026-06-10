import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { T } from './WelcomeApp';
import { Eye, BookOpen, Sun, CircleDot, ChevronRight, CheckCircle2 } from 'lucide-react';
import { gsap } from 'gsap';

export default function BentoFeatures() {
    const [activeTab, setActiveTab] = useState(0);
    const containerRef = useRef(null);
    const floatRef1 = useRef(null);
    const floatRef2 = useRef(null);

    // Parallax mouse movements for background indicators
    useEffect(() => {
        const handleMouseMove = (e) => {
            if (!containerRef.current) return;
            const rect = containerRef.current.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;

            gsap.to(floatRef1.current, {
                x: x * 0.05,
                y: y * 0.05,
                duration: 1.5,
                ease: 'power2.out'
            });
            gsap.to(floatRef2.current, {
                x: x * -0.07,
                y: y * -0.07,
                duration: 1.5,
                ease: 'power2.out'
            });
        };

        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, []);

    const featuresData = [
        {
            title: 'Tes Rabun Jauh (Myopia)',
            subtitle: 'Kalibrasi Snellen Chart AI',
            icon: <Eye size={20} />,
            color: T.brand,
            desc: 'Menggunakan bagan Snellen digital terstandarisasi medis. Algoritma AI mendeteksi jarak mata Anda dari kamera depan secara real-time untuk memastikan hasil tes akurat meskipun dilakukan secara mandiri.',
            highlights: ['Kalibrasi jarak otomatis', 'Metode arah huruf E standar internasional', 'Akurasi deteksi hingga 98.7%'],
            screenContent: (
                <div style={{ display: 'flex', flexDirection: 'column', height: '100%', gap: '10px', color: '#FFF' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontSize: '0.65rem', fontWeight: 800, opacity: 0.8 }}>TES RABUN JAUH</span>
                        <span style={{ fontSize: '0.55rem', color: T.brand, background: `${T.brand}20`, padding: '2px 6px', borderRadius: '4px', fontWeight: 700 }}>2/3 SELESAI</span>
                    </div>

                    {/* AI Distance Calibrator */}
                    <div style={{
                        background: 'rgba(255,255,255,0.03)',
                        border: '1px solid rgba(255,255,255,0.08)',
                        borderRadius: '10px',
                        padding: '6px 10px',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center'
                    }}>
                        <span style={{ fontSize: '0.52rem', color: T.text3 }}>Jarak Wajah:</span>
                        <span style={{ fontSize: '0.55rem', color: T.green, fontWeight: 700, display: 'flex', alignItems: 'center', gap: '4px' }}>
                            <span style={{ width: '5px', height: '5px', borderRadius: '50%', background: T.green }} />
                            40 cm (Pas)
                        </span>
                    </div>

                    {/* Interactive E-chart block */}
                    <div style={{
                        flex: 1,
                        background: '#FFF',
                        borderRadius: '14px',
                        color: '#000',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '8px',
                        padding: '12px',
                        boxShadow: 'inset 0 0 10px rgba(0,0,0,0.05)'
                    }}>
                        <span style={{ fontSize: '1.8rem', fontWeight: 900, letterSpacing: '-0.05em', lineHeight: 1 }}>E</span>
                        <div style={{ display: 'flex', gap: '6px', fontSize: '1rem', fontWeight: 800 }}>
                            <span>W</span><span>M</span>
                        </div>
                        <div style={{ display: 'flex', gap: '6px', fontSize: '0.6rem', fontWeight: 800, opacity: 0.6 }}>
                            <span>Ǝ</span><span>E</span><span>W</span>
                        </div>
                        <div style={{ width: '100%', height: '1px', background: 'rgba(0,0,0,0.06)', margin: '4px 0' }} />
                        <div style={{ fontSize: '0.55rem', fontWeight: 700, color: T.brand, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                            Garis Aktif: VA 20/30
                        </div>
                    </div>

                    {/* Interaction details */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                        <div style={{ fontSize: '0.5rem', color: T.text3, textAlign: 'center' }}>Tekan arah hadap dari huruf E di atas:</div>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '4px' }}>
                            {['Kiri', 'Atas', 'Kanan', 'Bawah'].map((dir, idx) => (
                                <div key={dir} style={{
                                    background: idx === 1 ? T.brand : 'rgba(255,255,255,0.06)',
                                    border: `1px solid ${idx === 1 ? T.brand : 'rgba(255,255,255,0.1)'}`,
                                    borderRadius: '6px',
                                    padding: '5px 0',
                                    textAlign: 'center',
                                    fontSize: '0.55rem',
                                    fontWeight: 700,
                                    color: '#FFF'
                                }}>{dir}</div>
                            ))}
                        </div>
                    </div>
                </div>
            )
        },
        {
            title: 'Tes Rabun Dekat (Hyperopia)',
            subtitle: 'Tes Ketajaman Fokus & Teks',
            icon: <BookOpen size={20} />,
            color: T.accent,
            desc: 'Mengukur ketajaman mata dalam membaca teks berukuran kecil dalam jarak dekat. Berguna mendeteksi rabun dekat dini serta presbyopia (mata tua) dengan membandingkan respons kontras dan ukuran font.',
            highlights: ['Perbandingan kontras teks', 'Ukuran font dinamis dari 6pt hingga 24pt', 'Rekomendasi jarak baca aman'],
            screenContent: (
                <div style={{ display: 'flex', flexDirection: 'column', height: '100%', gap: '10px', color: '#FFF' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontSize: '0.65rem', fontWeight: 800, opacity: 0.8 }}>TES RABUN DEKAT</span>
                        <span style={{ fontSize: '0.55rem', color: T.accent, background: `${T.accent}20`, padding: '2px 6px', borderRadius: '4px', fontWeight: 700 }}>MULAI TES</span>
                    </div>

                    {/* Face tracking feedback */}
                    <div style={{
                        background: 'rgba(255,255,255,0.03)',
                        border: '1px solid rgba(255,255,255,0.08)',
                        borderRadius: '10px',
                        padding: '6px 10px',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center'
                    }}>
                        <span style={{ fontSize: '0.52rem', color: T.text3 }}>Jarak Baca:</span>
                        <span style={{ fontSize: '0.55rem', color: '#FFA500', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '4px' }}>
                            <span style={{ width: '5px', height: '5px', borderRadius: '50%', background: '#FFA500' }} />
                            30 cm (Terlalu Dekat)
                        </span>
                    </div>

                    {/* Emulated text list */}
                    <div style={{
                        flex: 1,
                        background: '#070114',
                        border: '1px solid rgba(255,255,255,0.08)',
                        borderRadius: '14px',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                        gap: '6px',
                        padding: '12px'
                    }}>
                        <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#FFF', textAlign: 'center' }}>Paragraf Uji Fokus</div>
                        <p style={{ fontSize: '0.55rem', color: 'rgba(255,255,255,0.9)', lineHeight: 1.4, margin: 0, textAlign: 'justify' }}>
                            1. Penglihatan yang sehat adalah jendela utama bagi kita semua untuk menikmati keindahan ciptaan semesta yang luas ini. (Font: 8pt)
                        </p>
                        <p style={{ fontSize: '0.42rem', color: 'rgba(255,255,255,0.5)', lineHeight: 1.3, margin: 0, textAlign: 'justify' }}>
                            2. Jagalah jarak pandang gawai Anda secara berkala agar kornea mata tidak bekerja ekstra keras secara terus-menerus. (Font: 6pt)
                        </p>
                    </div>

                    {/* Controls */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                        <div style={{ fontSize: '0.5rem', color: T.text3, textAlign: 'center' }}>Apakah Anda bisa membaca Paragraf 2 dengan jelas?</div>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px' }}>
                            <div style={{
                                background: T.accent,
                                borderRadius: '6px',
                                padding: '6px 0',
                                textAlign: 'center',
                                fontSize: '0.55rem',
                                fontWeight: 700,
                                color: '#FFF'
                            }}>Bisa, Sangat Jelas</div>
                            <div style={{
                                background: 'rgba(255,255,255,0.06)',
                                border: '1px solid rgba(255,255,255,0.1)',
                                borderRadius: '6px',
                                padding: '6px 0',
                                textAlign: 'center',
                                fontSize: '0.55rem',
                                fontWeight: 700,
                                color: '#FFF'
                            }}>Buram / Sulit</div>
                        </div>
                    </div>
                </div>
            )
        },
        {
            title: 'Tes Silinder (Astigmatism)',
            subtitle: 'Radial Line Distortion Test',
            icon: <CircleDot size={20} />,
            color: '#EC4899',
            desc: 'Menganalisis anomali pada kelengkungan kornea mata. Tes ini menampilkan garis-garis radial di dalam roda lingkaran. Jika Anda memiliki mata silinder, beberapa garis radial akan terlihat lebih tebal, gelap, atau buram dibandingkan garis lainnya.',
            highlights: ['Astigmatism Dial terkalibrasi', 'Deteksi kemiringan sudut distorsi', 'Laporan keparahan silinder dioptri'],
            screenContent: (
                <div style={{ display: 'flex', flexDirection: 'column', height: '100%', gap: '10px', color: '#FFF' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontSize: '0.65rem', fontWeight: 800, opacity: 0.8 }}>TES SILINDER MATA</span>
                        <span style={{ fontSize: '0.55rem', color: '#EC4899', background: 'rgba(236,72,153,0.2)', padding: '2px 6px', borderRadius: '4px', fontWeight: 700 }}>1/2 SELESAI</span>
                    </div>

                    {/* Instruction indicator */}
                    <div style={{
                        background: 'rgba(255,255,255,0.03)',
                        border: '1px solid rgba(255,255,255,0.08)',
                        borderRadius: '10px',
                        padding: '6px 10px',
                        fontSize: '0.52rem',
                        color: T.text2,
                        textAlign: 'center'
                    }}>
                        Tutup mata kiri Anda dan fokus ke titik tengah
                    </div>

                    {/* Astigmatism dial graphic */}
                    <div style={{
                        flex: 1,
                        background: '#070114',
                        border: '1px solid rgba(255,255,255,0.08)',
                        borderRadius: '14px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        position: 'relative'
                    }}>
                        <svg width="100" height="100" viewBox="0 0 100 100">
                            <circle cx="50" cy="50" r="43" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="0.8" />
                            <circle cx="50" cy="50" r="2.5" fill="#EC4899" />
                            {[...Array(12)].map((_, i) => {
                                const angle = i * 15;
                                const rad = (angle * Math.PI) / 180;
                                const x1 = 50 + 40 * Math.cos(rad);
                                const y1 = 50 + 40 * Math.sin(rad);
                                const x2 = 50 - 40 * Math.cos(rad);
                                const y2 = 50 - 40 * Math.sin(rad);
                                // Make line at 30 deg (index 2) thicker to simulate astigmatism distortion
                                const isDistorted = (i === 2 || i === 8);
                                return (
                                    <line 
                                        key={i} 
                                        x1={x1} 
                                        y1={y1} 
                                        x2={x2} 
                                        y2={y2} 
                                        stroke={isDistorted ? '#EC4899' : 'rgba(255,255,255,0.5)'} 
                                        strokeWidth={isDistorted ? '1.8' : '0.6'} 
                                    />
                                );
                            })}
                        </svg>
                        
                        {/* Overlay badge */}
                        <div style={{ position: 'absolute', bottom: '6px', right: '6px', fontSize: '0.45rem', background: '#EC4899', color: '#FFF', padding: '2px 4px', borderRadius: '3px' }}>
                            DISTORSI 30°
                        </div>
                    </div>

                    {/* Controller UI */}
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                        <div style={{ fontSize: '0.5rem', color: T.text3, width: '100%', textAlign: 'center', marginBottom: '2px' }}>Apakah garis miring 30° terlihat lebih tebal?</div>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4px', width: '100%' }}>
                            <div style={{
                                background: '#EC4899',
                                borderRadius: '6px',
                                padding: '5px 0',
                                textAlign: 'center',
                                fontSize: '0.55rem',
                                fontWeight: 700,
                                color: '#FFF'
                            }}>Ya, Lebih Tebal</div>
                            <div style={{
                                background: 'rgba(255,255,255,0.06)',
                                border: '1px solid rgba(255, 255, 255, 0.1)',
                                borderRadius: '6px',
                                padding: '5px 0',
                                textAlign: 'center',
                                fontSize: '0.55rem',
                                fontWeight: 700,
                                color: '#FFF'
                            }}>Tidak, Semua Sama</div>
                        </div>
                    </div>
                </div>
            )
        }
    ];

    return (
        <section
            ref={containerRef}
            id="fitur"
            style={{
                position: 'relative',
                padding: '120px 0',
                background: T.bg,
                overflow: 'hidden'
            }}
        >
            {/* Parallax elements */}
            <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 0 }}>
                <div 
                    ref={floatRef1}
                    style={{
                        position: 'absolute',
                        top: '15%',
                        right: '10%',
                        width: '280px',
                        height: '280px',
                        borderRadius: '50%',
                        background: 'radial-gradient(circle, rgba(236, 72, 153, 0.05) 0%, transparent 70%)',
                        filter: 'blur(30px)'
                    }}
                />
                <div 
                    ref={floatRef2}
                    style={{
                        position: 'absolute',
                        bottom: '10%',
                        left: '5%',
                        width: '320px',
                        height: '320px',
                        borderRadius: '50%',
                        background: 'radial-gradient(circle, rgba(157, 0, 255, 0.06) 0%, transparent 70%)',
                        filter: 'blur(40px)'
                    }}
                />
            </div>

            <div style={{ position: 'relative', zIndex: 1, maxWidth: '1400px', margin: '0 auto', padding: '0 1.5rem' }}>
                
                {/* Header */}
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
                        <Sun size={12} style={{ animation: 'wc-spin 6s linear infinite' }} />
                        Metode Klinis Terintegrasi
                    </span>
                    <h2 style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 800, letterSpacing: '-0.04em', color: '#FFF', margin: '0 0 16px', lineHeight: 1.15 }}>
                        Tiga Tes Utama Untuk<br />
                        <span style={{ background: `linear-gradient(135deg, ${T.brand}, ${T.accent})`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', fontWeight: 800 }}>Kesehatan Refraksi Anda.</span>
                    </h2>
                    <p style={{ fontSize: '1rem', color: T.text2, maxWidth: '580px', margin: '0 auto', lineHeight: 1.7 }}>
                        Nikmati proses pemeriksaan mata digital mandiri yang cepat, terpandu secara visual, dan tervalidasi oleh pakar mata.
                    </p>
                </div>

                {/* Side-by-Side Content */}
                <div style={{ display: 'grid', gridTemplateColumns: '0.85fr 1.15fr', gap: '5rem', alignItems: 'center' }} className="features-grid">
                    
                    {/* LEFT SIDE: Phone Mockup showcasing the active screen content */}
                    <div style={{ display: 'flex', justifyContent: 'center' }}>
                        <div style={{
                            width: '270px',
                            height: '540px',
                            background: 'linear-gradient(145deg, #180C28, #0E071A)',
                            borderRadius: '40px',
                            border: '3px solid rgba(255, 255, 255, 0.12)',
                            boxShadow: `0 20px 50px rgba(0,0,0,0.5), 0 0 40px ${featuresData[activeTab].color}20, inset 0 1px 0 rgba(255,255,255,0.15)`,
                            position: 'relative',
                            padding: '10px',
                            transition: 'box-shadow 0.5s ease'
                        }}>
                            {/* Notch */}
                            <div style={{ position: 'absolute', top: '15px', left: '50%', transform: 'translateX(-50%)', width: '90px', height: '20px', borderRadius: '15px', background: '#070114', zIndex: 10 }} />

                            {/* Inner Screen */}
                            <div style={{
                                width: '100%',
                                height: '100%',
                                background: '#0D051B',
                                borderRadius: '30px',
                                overflow: 'hidden',
                                padding: '36px 12px 14px 12px',
                                position: 'relative'
                            }}>
                                <AnimatePresence mode="wait">
                                    <motion.div
                                        key={activeTab}
                                        initial={{ opacity: 0, x: 20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: -20 }}
                                        transition={{ duration: 0.35, ease: 'easeInOut' }}
                                        style={{ height: '100%' }}
                                    >
                                        {featuresData[activeTab].screenContent}
                                    </motion.div>
                                </AnimatePresence>
                            </div>
                        </div>
                    </div>

                    {/* RIGHT SIDE: Interactive tab cards (White Base Glassmorphism) */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                        {featuresData.map((f, i) => {
                            const isActive = activeTab === i;
                            return (
                                <div
                                    key={i}
                                    onClick={() => setActiveTab(i)}
                                    style={{
                                        background: isActive ? 'rgba(255, 255, 255, 0.08)' : 'rgba(255, 255, 255, 0.02)',
                                        border: `1px solid ${isActive ? f.color : 'rgba(255, 255, 255, 0.06)'}`,
                                        borderRadius: '20px',
                                        padding: '24px',
                                        cursor: 'pointer',
                                        transition: 'all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
                                        boxShadow: isActive ? `0 10px 30px ${f.color}15, inset 0 1px 0 rgba(255,255,255,0.08)` : 'none',
                                        transform: isActive ? 'scale(1.02)' : 'scale(1)',
                                    }}
                                    onMouseEnter={(e) => {
                                        if(!isActive) {
                                            e.currentTarget.style.background = 'rgba(255, 255, 255, 0.04)';
                                            e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.15)';
                                        }
                                    }}
                                    onMouseLeave={(e) => {
                                        if(!isActive) {
                                            e.currentTarget.style.background = 'rgba(255, 255, 255, 0.02)';
                                            e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.06)';
                                        }
                                    }}
                                >
                                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px' }}>
                                        {/* Icon Container */}
                                        <div style={{
                                            padding: '12px',
                                            borderRadius: '12px',
                                            background: isActive ? f.color : 'rgba(255, 255, 255, 0.03)',
                                            color: isActive ? '#FFF' : T.text2,
                                            boxShadow: isActive ? `0 0 15px ${f.color}50` : 'none',
                                            transition: 'all 0.3s ease',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center'
                                        }}>
                                            {f.icon}
                                        </div>

                                        {/* Text info */}
                                        <div style={{ flex: 1 }}>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '4px' }}>
                                                <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#FFF', margin: 0 }}>
                                                    {f.title}
                                                </h3>
                                                <span style={{ fontSize: '0.65rem', color: isActive ? f.color : T.text3, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                                                    {f.subtitle}
                                                </span>
                                            </div>
                                            
                                            <p style={{ fontSize: '0.875rem', color: isActive ? T.text2 : T.text3, lineHeight: 1.6, margin: '12px 0 0 0', transition: 'color 0.3s' }}>
                                                {f.desc}
                                            </p>

                                            {/* Expand Highlights when active */}
                                            {isActive && (
                                                <motion.div
                                                    initial={{ opacity: 0, height: 0 }}
                                                    animate={{ opacity: 1, height: 'auto' }}
                                                    transition={{ duration: 0.3 }}
                                                    style={{ marginTop: '16px', display: 'flex', flexDirection: 'column', gap: '8px', borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '16px' }}
                                                >
                                                    {f.highlights.map((h, idx) => (
                                                        <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.8rem', color: '#FFF' }}>
                                                            <CheckCircle2 size={14} color={T.green} style={{ flexShrink: 0 }} />
                                                            <span>{h}</span>
                                                        </div>
                                                    ))}
                                                </motion.div>
                                            )}
                                        </div>

                                        <ChevronRight size={18} color={isActive ? f.color : 'rgba(255,255,255,0.15)'} style={{ alignSelf: 'center', transition: 'transform 0.3s', transform: isActive ? 'rotate(90deg)' : 'none' }} />
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                </div>
            </div>

            <style>{`
                @media(max-width: 1024px) {
                    .features-grid {
                        grid-template-columns: 1fr !important;
                        gap: 40px !important;
                    }
                }
            `}</style>
        </section>
    );
}
