import React, { useState, useEffect, useRef } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { T } from './WelcomeApp';
import { Eye, Shield, Zap, Sparkles, Star, ChevronRight } from 'lucide-react';
import { gsap } from 'gsap';

export default function HeroSection({ loginRoute, adminRoute, isAuthenticated }) {
    const heroRef = useRef(null);
    const bgBlob1Ref = useRef(null);
    const bgBlob2Ref = useRef(null);
    const [activeScreen, setActiveScreen] = useState(0); // 0: Home, 1: Myopia, 2: Astigmatism

    // Mouse positions for 3D card tilt and GSAP parallax
    const x = useMotionValue(0);
    const y = useMotionValue(0);

    // Smooth springs for card tilt
    const rotateX = useSpring(useTransform(y, [-0.5, 0.5], [15, -15]), { stiffness: 150, damping: 20 });
    const rotateY = useSpring(useTransform(x, [-0.5, 0.5], [-15, 15]), { stiffness: 150, damping: 20 });

    useEffect(() => {
        // Cycle mock phone screens every 4.5 seconds
        const screenInterval = setInterval(() => {
            setActiveScreen(prev => (prev + 1) % 3);
        }, 4500);

        // Mouse move handler for parallax
        const handleMouseMove = (e) => {
            const { clientX, clientY } = e;
            const width = window.innerWidth;
            const height = window.innerHeight;
            
            // Normalized values (-0.5 to 0.5)
            const normX = (clientX / width) - 0.5;
            const normY = (clientY / height) - 0.5;
            
            x.set(normX);
            y.set(normY);

            // GSAP smooth background movement for parallax depth
            gsap.to(bgBlob1Ref.current, {
                x: normX * 80,
                y: normY * 80,
                duration: 2,
                ease: 'power2.out'
            });
            gsap.to(bgBlob2Ref.current, {
                x: normX * -120,
                y: normY * -120,
                duration: 2,
                ease: 'power2.out'
            });
        };

        window.addEventListener('mousemove', handleMouseMove);
        return () => {
            clearInterval(screenInterval);
            window.removeEventListener('mousemove', handleMouseMove);
        };
    }, [x, y]);

    // GSAP Entry Animation
    useEffect(() => {
        const ctx = gsap.context(() => {
            gsap.from('.gsap-hero-fade', {
                opacity: 0,
                y: 40,
                stagger: 0.15,
                duration: 1.2,
                ease: 'power4.out',
                delay: 0.2
            });
            gsap.from('.gsap-mockup-fade', {
                opacity: 0,
                scale: 0.9,
                duration: 1.5,
                ease: 'elastic.out(1, 0.75)',
                delay: 0.5
            });
        }, heroRef);

        return () => ctx.revert();
    }, []);

    return (
        <section
            ref={heroRef}
            id="beranda"
            style={{
                position: 'relative',
                minHeight: '100vh',
                display: 'flex',
                alignItems: 'center',
                overflow: 'hidden',
                background: T.bg,
                padding: '120px 0 80px',
            }}
        >
            {/* Background elements */}
            <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 0 }}>
                {/* Glowing radial circles (Parallaxed by GSAP) */}
                <div 
                    ref={bgBlob1Ref}
                    style={{ 
                        position: 'absolute', 
                        top: '10%', 
                        left: '5%', 
                        width: '600px', 
                        height: '600px', 
                        borderRadius: '50%', 
                        background: `radial-gradient(circle, rgba(255, 46, 147, 0.12) 0%, transparent 70%)`, 
                        filter: 'blur(50px)',
                    }} 
                />
                <div 
                    ref={bgBlob2Ref}
                    style={{ 
                        position: 'absolute', 
                        bottom: '5%', 
                        right: '5%', 
                        width: '700px', 
                        height: '700px', 
                        borderRadius: '50%', 
                        background: `radial-gradient(circle, rgba(157, 0, 255, 0.15) 0%, transparent 70%)`, 
                        filter: 'blur(60px)',
                    }} 
                />

                {/* Cyber Grid pattern */}
                <div style={{ 
                    position: 'absolute', 
                    inset: 0, 
                    backgroundImage: `linear-gradient(rgba(255,255,255,0.01) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.01) 1px, transparent 1px)`, 
                    backgroundSize: '64px 64px', 
                    maskImage: 'radial-gradient(ellipse at 50% 50%, black 50%, transparent 95%)' 
                }} />
            </div>

            <div style={{ position: 'relative', zIndex: 1, width: '100%', maxWidth: '1400px', margin: '0 auto', padding: '0 1.5rem' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1.1fr 0.9fr', gap: '4rem', alignItems: 'center' }} className="hero-grid">
                    
                    {/* LEFT COLUMN: Content */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                        {/* Glow Badge */}
                        <div className="gsap-hero-fade">
                            <span style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '8px',
                                padding: '6px 16px',
                                borderRadius: '99px',
                                border: '1px solid rgba(255, 255, 255, 0.1)',
                                background: 'rgba(255, 255, 255, 0.03)',
                                backdropFilter: 'blur(10px)',
                                fontSize: '0.75rem',
                                fontWeight: 700,
                                color: '#FFF',
                                textTransform: 'uppercase',
                                letterSpacing: '0.12em',
                                boxShadow: '0 4px 20px rgba(0,0,0,0.2)'
                            }}>
                                <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: T.brand, display: 'inline-block', boxShadow: `0 0 10px ${T.brand}`, animation: 'wc-pulse 2s infinite' }} />
                                Exclusive Eye Refraction Hub
                                <Sparkles size={12} color="#FFD700" style={{ marginLeft: '4px' }} />
                            </span>
                        </div>

                        {/* Title */}
                        <div className="gsap-hero-fade">
                            <h1 style={{
                                fontSize: 'clamp(2.5rem, 5vw, 4.25rem)',
                                fontWeight: 900,
                                letterSpacing: '-0.04em',
                                lineHeight: 1.1,
                                margin: 0,
                                color: '#FFF'
                            }}>
                                Uji Penglihatan<br />
                                Secara Presisi<br />
                                <span style={{ 
                                    background: `linear-gradient(135deg, ${T.brand} 0%, ${T.accent} 100%)`, 
                                    WebkitBackgroundClip: 'text', 
                                    WebkitTextFillColor: 'transparent',
                                    display: 'inline-block',
                                    fontWeight: 900
                                }}>
                                    Dari Rumah Anda.
                                </span>
                            </h1>
                        </div>

                        {/* Tagline / Subtitle */}
                        <div className="gsap-hero-fade">
                            <p style={{
                                fontSize: '1.1rem',
                                lineHeight: 1.75,
                                color: T.text2,
                                margin: 0,
                                maxWidth: '540px'
                            }}>
                                MataCeria adalah asisten kesehatan mata digital tercanggih. Deteksi dini potensi <span style={{ color: '#FFF', fontWeight: 600 }}>rabun jauh (myopia)</span>, <span style={{ color: '#FFF', fontWeight: 600 }}>rabun dekat (hyperopia)</span>, dan <span style={{ color: '#FFF', fontWeight: 600 }}>silinder (astigmatism)</span> dengan kalibrasi klinis AI.
                            </p>
                        </div>

                        {/* App and Play Store Buttons */}
                        <div className="gsap-hero-fade" style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', marginTop: '0.5rem' }}>
                            {/* App Store Button */}
                            <a 
                                href="#app" 
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '10px',
                                    background: '#000000',
                                    border: '1px solid rgba(255, 255, 255, 0.2)',
                                    borderRadius: '12px',
                                    padding: '10px 20px',
                                    color: '#FFF',
                                    textDecoration: 'none',
                                    transition: 'all 0.3s ease',
                                    boxShadow: '0 10px 30px rgba(0,0,0,0.5)',
                                }}
                                className="store-btn"
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.transform = 'translateY(-3px)';
                                    e.currentTarget.style.borderColor = T.brand;
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.transform = 'none';
                                    e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.2)';
                                }}
                            >
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 4.17c.66-.81 1.11-1.93.99-3.06-1 .04-2.21.67-2.93 1.49-.62.69-1.16 1.84-1.01 2.96 1.12.09 2.27-.57 2.95-1.39z"/>
                                </svg>
                                <div style={{ textAlign: 'left' }}>
                                    <div style={{ fontSize: '0.62rem', textTransform: 'uppercase', opacity: 0.6, letterSpacing: '0.05em' }}>Download on the</div>
                                    <div style={{ fontSize: '0.9rem', fontWeight: 700, fontFamily: T.font }}>App Store</div>
                                </div>
                            </a>

                            {/* Play Store Button */}
                            <a 
                                href="#app" 
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '10px',
                                    background: '#000000',
                                    border: '1px solid rgba(255, 255, 255, 0.2)',
                                    borderRadius: '12px',
                                    padding: '10px 20px',
                                    color: '#FFF',
                                    textDecoration: 'none',
                                    transition: 'all 0.3s ease',
                                    boxShadow: '0 10px 30px rgba(0,0,0,0.5)',
                                }}
                                className="store-btn"
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.transform = 'translateY(-3px)';
                                    e.currentTarget.style.borderColor = T.accent;
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.transform = 'none';
                                    e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.2)';
                                }}
                            >
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M3 5.27v13.46c0 .87.89 1.42 1.63.98l11.41-6.73a1.14 1.14 0 0 0 0-1.96L4.63 4.29C3.89 3.85 3 4.4 3 5.27zM18.77 11.23l-3.32-1.96-2.22 2.22 2.22 2.22 3.32-1.96c.55-.33.55-1.15 0-1.52z"/>
                                </svg>
                                <div style={{ textAlign: 'left' }}>
                                    <div style={{ fontSize: '0.62rem', textTransform: 'uppercase', opacity: 0.6, letterSpacing: '0.05em' }}>GET IT ON</div>
                                    <div style={{ fontSize: '0.9rem', fontWeight: 700, fontFamily: T.font }}>Google Play</div>
                                </div>
                            </a>
                        </div>

                        {/* Frosted White-Base Trust Badge (Base Color White element) */}
                        <div className="gsap-hero-fade" style={{ marginTop: '1rem' }}>
                            <div style={{
                                background: 'rgba(255, 255, 255, 0.05)',
                                border: '1px solid rgba(255, 255, 255, 0.1)',
                                borderRadius: '16px',
                                padding: '16px 20px',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '20px',
                                maxWidth: '480px',
                                backdropFilter: 'blur(16px)',
                                boxShadow: '0 8px 32px rgba(0,0,0,0.3)'
                            }}>
                                <div style={{ display: 'flex', flexDirection: 'column' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                        {[...Array(5)].map((_, i) => <Star key={i} size={14} fill="#FFD700" color="#FFD700" />)}
                                    </div>
                                    <span style={{ fontSize: '0.8rem', color: '#FFF', fontWeight: 700, marginTop: '4px' }}>4.9/5 Rating</span>
                                </div>
                                <div style={{ width: '1px', height: '32px', background: 'rgba(255,255,255,0.1)' }} />
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    <Shield size={20} color={T.brand} />
                                    <div>
                                        <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#FFF' }}>Kemenkes Terdaftar</div>
                                        <div style={{ fontSize: '0.65rem', color: T.text3 }}>Standar Medis Terkalibrasi</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* RIGHT COLUMN: 3D-tilting Mobile Mockup */}
                    <div style={{ display: 'flex', justifyContent: 'center', perspective: 1000 }} className="gsap-mockup-fade">
                        <motion.div
                            style={{
                                rotateX: rotateX,
                                rotateY: rotateY,
                                transformStyle: 'preserve-3d',
                                cursor: 'grab'
                            }}
                            whileTap={{ cursor: 'grabbing' }}
                            style={{
                                width: '280px',
                                height: '560px',
                                background: 'linear-gradient(135deg, #1A0B2E 0%, #0F081D 100%)',
                                borderRadius: '44px',
                                border: '3px solid rgba(255, 255, 255, 0.15)',
                                boxShadow: `0 30px 60px rgba(0,0,0,0.7), 0 0 50px rgba(255, 46, 147, 0.15), inset 0 1px 0 rgba(255,255,255,0.2)`,
                                position: 'relative',
                                overflow: 'hidden',
                                display: 'flex',
                                flexDirection: 'column',
                                padding: '12px'
                            }}
                        >
                            {/* Inner Screen Shadow & Glare */}
                            <div style={{ 
                                position: 'absolute', 
                                top: 0, 
                                left: 0, 
                                right: 0, 
                                height: '50%', 
                                background: 'linear-gradient(to bottom, rgba(255,255,255,0.03), transparent)', 
                                zIndex: 5, 
                                pointerEvents: 'none' 
                            }} />

                            {/* Speaker notch */}
                            <div style={{ 
                                position: 'absolute', 
                                top: '16px', 
                                left: '50%', 
                                transform: 'translateX(-50%)', 
                                width: '100px', 
                                height: '22px', 
                                borderRadius: '20px', 
                                background: '#070114', 
                                zIndex: 10,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                border: '1px solid rgba(255,255,255,0.05)'
                            }}>
                                {/* Camera dots */}
                                <div style={{ width: '5px', height: '5px', borderRadius: '50%', background: '#111', marginRight: '6px' }} />
                                <div style={{ width: '30px', height: '3px', borderRadius: '3px', background: '#222' }} />
                            </div>

                            {/* Screen Content Wrapper */}
                            <div style={{ 
                                flex: 1, 
                                background: '#0D051B', 
                                borderRadius: '32px', 
                                overflow: 'hidden', 
                                display: 'flex', 
                                flexDirection: 'column',
                                padding: '40px 14px 16px 14px',
                                position: 'relative'
                            }}>
                                {/* Top mobile header */}
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.62rem', color: 'rgba(255, 255, 255, 0.5)', marginBottom: '14px', padding: '0 4px' }}>
                                    <span>9:41</span>
                                    <div style={{ display: 'flex', gap: '4px' }}>
                                        <span>5G</span>
                                        <span>100%</span>
                                    </div>
                                </div>

                                {/* Dynamic Screen States */}
                                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', height: '100%' }}>
                                    {activeScreen === 0 && (
                                        <motion.div 
                                            initial={{ opacity: 0, scale: 0.95 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            exit={{ opacity: 0 }}
                                            style={{ display: 'flex', flexDirection: 'column', height: '100%', gap: '14px' }}
                                        >
                                            {/* Brand Info */}
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                                <img src="/favicon.svg" alt="Logo" style={{ width: '32px', height: '32px', objectFit: 'contain' }} />
                                                <div>
                                                    <div style={{ fontSize: '0.8rem', fontWeight: 800, color: '#FFF' }}>MataCeria</div>
                                                    <div style={{ fontSize: '0.55rem', color: T.text3 }}>AI Vision Testing</div>
                                                </div>
                                            </div>

                                            {/* Status Card */}
                                            <div style={{
                                                background: 'rgba(255, 255, 255, 0.05)',
                                                border: '1px solid rgba(255, 255, 255, 0.08)',
                                                borderRadius: '16px',
                                                padding: '12px',
                                                display: 'flex',
                                                flexDirection: 'column',
                                                gap: '8px'
                                            }}>
                                                <span style={{ fontSize: '0.55rem', color: T.text3, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Pemeriksaan Terakhir</span>
                                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                    <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#FFF' }}>Mata Kanan (OD)</span>
                                                    <span style={{ fontSize: '0.75rem', fontWeight: 800, color: T.green }}>20/20 (Normal)</span>
                                                </div>
                                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                    <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#FFF' }}>Mata Kiri (OS)</span>
                                                    <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#FF7E40' }}>20/40 (Rabun Jauh)</span>
                                                </div>
                                            </div>

                                            {/* Main Start Button Area */}
                                            <div style={{
                                                flex: 1,
                                                display: 'flex',
                                                flexDirection: 'column',
                                                justifyContent: 'center',
                                                alignItems: 'center',
                                                gap: '12px',
                                                border: '1px dashed rgba(255, 255, 255, 0.1)',
                                                borderRadius: '20px',
                                                background: 'rgba(255, 255, 255, 0.01)',
                                                padding: '16px'
                                            }}>
                                                <div style={{ 
                                                    width: '52px', 
                                                    height: '52px', 
                                                    borderRadius: '50%', 
                                                    background: `linear-gradient(135deg, ${T.brand}22, ${T.accent}22)`, 
                                                    border: `1px solid ${T.brand}55`,
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    animation: 'wc-pulse 2.5s infinite'
                                                }}>
                                                    <Eye size={20} color={T.brand} />
                                                </div>
                                                <div style={{ textAlign: 'center' }}>
                                                    <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#FFF' }}>Uji Penglihatan Baru</div>
                                                    <div style={{ fontSize: '0.55rem', color: T.text3, marginTop: '2px' }}>Hanya butuh waktu 3 menit</div>
                                                </div>
                                            </div>

                                            {/* Bottom bar button */}
                                            <div style={{
                                                background: `linear-gradient(135deg, ${T.brand}, ${T.accent})`,
                                                borderRadius: '12px',
                                                padding: '10px',
                                                textAlign: 'center',
                                                fontSize: '0.7rem',
                                                fontWeight: 800,
                                                color: '#FFF',
                                                boxShadow: '0 4px 15px rgba(255, 46, 147, 0.3)'
                                            }}>
                                                Mulai Tes Cepat
                                            </div>
                                        </motion.div>
                                    )}

                                    {activeScreen === 1 && (
                                        <motion.div 
                                            initial={{ opacity: 0, scale: 0.95 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            exit={{ opacity: 0 }}
                                            style={{ display: 'flex', flexDirection: 'column', height: '100%', gap: '14px' }}
                                        >
                                            {/* Screen header */}
                                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                <span style={{ fontSize: '0.7rem', fontWeight: 800, color: '#FFF' }}>Tes Rabun Jauh (Myopia)</span>
                                                <span style={{ fontSize: '0.55rem', color: T.brand, background: `${T.brand}15`, padding: '2px 6px', borderRadius: '4px' }}>Mata Kanan</span>
                                            </div>

                                            {/* Calibration indicator */}
                                            <div style={{ fontSize: '0.55rem', color: T.text3, background: 'rgba(255,255,255,0.03)', padding: '6px', borderRadius: '6px', textAlign: 'center' }}>
                                                Jarak HP ke mata: <span style={{ color: T.green, fontWeight: 700 }}>40 cm</span> (Terdeteksi)
                                            </div>

                                            {/* Visual chart emulation */}
                                            <div style={{ 
                                                flex: 1, 
                                                background: '#FFF', 
                                                borderRadius: '16px', 
                                                display: 'flex', 
                                                flexDirection: 'column', 
                                                alignItems: 'center', 
                                                justifyContent: 'center', 
                                                gap: '12px',
                                                padding: '16px',
                                                color: '#000'
                                            }}>
                                                <span style={{ fontSize: '2.5rem', fontWeight: 900, lineHeight: 1 }}>E</span>
                                                <div style={{ display: 'flex', gap: '8px', fontSize: '1.25rem', fontWeight: 800 }}>
                                                    <span>F</span><span>P</span>
                                                </div>
                                                <div style={{ display: 'flex', gap: '8px', fontSize: '0.75rem', fontWeight: 800, opacity: 0.8 }}>
                                                    <span>T</span><span>O</span><span>Z</span>
                                                </div>
                                                <div style={{ display: 'flex', gap: '6px', fontSize: '0.5rem', fontWeight: 800, opacity: 0.5 }}>
                                                    <span>L</span><span>P</span><span>E</span><span>D</span>
                                                </div>
                                            </div>

                                            {/* Controller UI */}
                                            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                                                <div style={{ fontSize: '0.55rem', color: T.text3, textAlign: 'center' }}>Kemana arah huruf E paling atas?</div>
                                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '6px' }}>
                                                    {['↑', '↓', '←', '→'].map(dir => (
                                                        <div key={dir} style={{
                                                            background: 'rgba(255, 255, 255, 0.08)',
                                                            border: '1px solid rgba(255, 255, 255, 0.1)',
                                                            borderRadius: '8px',
                                                            padding: '6px 0',
                                                            textAlign: 'center',
                                                            fontSize: '0.75rem',
                                                            fontWeight: 700,
                                                            color: '#FFF'
                                                        }}>{dir}</div>
                                                    ))}
                                                </div>
                                            </div>
                                        </motion.div>
                                    )}

                                    {activeScreen === 2 && (
                                        <motion.div 
                                            initial={{ opacity: 0, scale: 0.95 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            exit={{ opacity: 0 }}
                                            style={{ display: 'flex', flexDirection: 'column', height: '100%', gap: '14px' }}
                                        >
                                            {/* Screen header */}
                                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                <span style={{ fontSize: '0.7rem', fontWeight: 800, color: '#FFF' }}>Tes Silinder (Astigmat)</span>
                                                <span style={{ fontSize: '0.55rem', color: T.accent, background: `${T.accent}15`, padding: '2px 6px', borderRadius: '4px' }}>Mata Kiri</span>
                                            </div>

                                            {/* Calibration indicator */}
                                            <div style={{ fontSize: '0.55rem', color: T.text3, background: 'rgba(255,255,255,0.03)', padding: '6px', borderRadius: '6px', textAlign: 'center' }}>
                                                Tutup mata kanan Anda dengan tangan
                                            </div>

                                            {/* Astigmatism wheel emulation */}
                                            <div style={{ 
                                                flex: 1, 
                                                borderRadius: '16px', 
                                                display: 'flex', 
                                                alignItems: 'center', 
                                                justifyContent: 'center',
                                                background: 'rgba(0,0,0,0.2)',
                                                border: '1px solid rgba(255, 255, 255, 0.05)',
                                                position: 'relative'
                                            }}>
                                                {/* Simulated Astigmatism Dial */}
                                                <svg width="110" height="110" viewBox="0 0 100 100">
                                                    <circle cx="50" cy="50" r="45" fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth="1" />
                                                    <circle cx="50" cy="50" r="2" fill="#FFF" />
                                                    {[...Array(12)].map((_, i) => {
                                                        const angle = i * 15;
                                                        const rad = (angle * Math.PI) / 180;
                                                        const x1 = 50 + 43 * Math.cos(rad);
                                                        const y1 = 50 + 43 * Math.sin(rad);
                                                        const x2 = 50 - 43 * Math.cos(rad);
                                                        const y2 = 50 - 43 * Math.sin(rad);
                                                        return (
                                                            <line 
                                                                key={i} 
                                                                x1={x1} 
                                                                y1={y1} 
                                                                x2={x2} 
                                                                y2={y2} 
                                                                stroke={i === 2 || i === 8 ? T.brand : 'rgba(255,255,255,0.6)'} 
                                                                strokeWidth={i === 2 || i === 8 ? '2' : '0.8'} 
                                                            />
                                                        );
                                                    })}
                                                </svg>
                                            </div>

                                            {/* Controller UI */}
                                            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                                <div style={{ fontSize: '0.52rem', color: T.text2, lineHeight: 1.3 }}>Apakah ada garis yang terlihat lebih tebal atau gelap dibanding lainnya?</div>
                                                <div style={{ display: 'flex', gap: '8px' }}>
                                                    <div style={{
                                                        flex: 1,
                                                        background: 'rgba(255, 46, 147, 0.1)',
                                                        border: `1px solid ${T.brand}44`,
                                                        borderRadius: '8px',
                                                        padding: '8px',
                                                        textAlign: 'center',
                                                        fontSize: '0.62rem',
                                                        fontWeight: 700,
                                                        color: T.brand
                                                    }}>Ada, Tebal</div>
                                                    <div style={{
                                                        flex: 1,
                                                        background: 'rgba(255, 255, 255, 0.05)',
                                                        border: '1px solid rgba(255, 255, 255, 0.1)',
                                                        borderRadius: '8px',
                                                        padding: '8px',
                                                        textAlign: 'center',
                                                        fontSize: '0.62rem',
                                                        fontWeight: 700,
                                                        color: '#FFF'
                                                    }}>Semua Sama</div>
                                                </div>
                                            </div>
                                        </motion.div>
                                    )}
                                </div>

                                {/* Custom Home Indicator bar */}
                                <div style={{ width: '80px', height: '4px', borderRadius: '2px', background: 'rgba(255,255,255,0.3)', margin: '12px auto 0 auto' }} />
                            </div>
                        </motion.div>
                    </div>

                </div>
            </div>

            {/* Bottom scroll down indicator */}
            <div style={{ position: 'absolute', bottom: '24px', left: '50%', transform: 'translateX(-50%)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', opacity: 0.7 }}>
                <span style={{ fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '0.15em', color: T.text3 }}>Gulir ke Bawah</span>
                <motion.div 
                    animate={{ y: [0, 6, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
                    style={{ width: '1px', height: '20px', background: `linear-gradient(to bottom, ${T.brand}, transparent)` }}
                />
            </div>

            {/* Custom Responsive Style */}
            <style>{`
                @media (max-width: 1024px) {
                    .hero-grid {
                        grid-template-columns: 1fr !important;
                        gap: 3rem !important;
                        text-align: center !important;
                    }
                    .hero-grid > div {
                        align-items: center !important;
                    }
                    .hero-grid p {
                        margin: 0 auto !important;
                    }
                    .hero-grid .store-btn {
                        justify-content: center !important;
                    }
                    .gsap-hero-fade {
                        display: flex !important;
                        flex-direction: column !important;
                        align-items: center !important;
                    }
                }
            `}</style>
        </section>
    );
}
