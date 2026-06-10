import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { T } from './WelcomeApp';
import { Star, ChevronLeft, ChevronRight, MessageSquare, Quote } from 'lucide-react';

const TESTIMONIALS = [
    { 
        name: 'Rina Marlina', 
        role: 'Guru SD, Bandung', 
        rating: 5, 
        testType: 'Tes Rabun Jauh (Myopia)',
        text: 'Menguji rabun jauh anak didik saya jadi sangat praktis lewat bagan Snellen digital MataCeria. Kalibrasi jarak kamera depannya pintar sekali, sangat akurat dan terpercaya!' 
    },
    { 
        name: 'Farhan Hidayat', 
        role: 'Mahasiswa UI, Jakarta', 
        rating: 5, 
        testType: 'Tes Silinder (Astigmatisme)',
        text: 'Awalnya sering pusing saat membaca code di laptop, coba Tes Silinder di aplikasi ini ternyata terdeteksi distorsi 30 derajat. Sekarang setelah pakai kacamata silinder jadi jauh lebih nyaman!' 
    },
    { 
        name: 'Dr. Siti Rahma', 
        role: 'Spesialis Mata, Surabaya', 
        rating: 5, 
        testType: 'Sertifikasi Klinis',
        text: 'Saya merekomendasikan MataCeria ke pasien untuk pre-screening mandiri. Fitur diagnosis AI berbasis visualnya membantu mengidentifikasi rabun jauh dan silinder sebelum pemeriksaan lanjut.' 
    },
    { 
        name: 'Budi Santoso', 
        role: 'Karyawan Swasta, Medan', 
        rating: 5, 
        testType: 'Tes Rabun Dekat (Presbyopia)',
        text: 'Sangat terbantu mendeteksi rabun dekat dini karena sering bekerja di depan layar. Grafik tren kesehatan mata di dasbor memudahkan saya melacak perkembangan ketajaman visual.' 
    },
    { 
        name: 'Dewi Kusuma', 
        role: 'Ibu Rumah Tangga, Yogyakarta', 
        rating: 5, 
        testType: 'Tes Refraksi Anak',
        text: 'Antarmuka tesnya sangat ramah anak. Anak saya yang berumur 8 tahun bisa mengikuti petunjuk arah huruf E dengan mudah tanpa rasa takut seperti di klinik biasa.' 
    },
    { 
        name: 'Kevin Pratama', 
        role: 'Software Engineer, Bali', 
        rating: 5, 
        testType: 'Aturan Terapi 20-20-20',
        text: 'Selain tes mata yang presisi, pengingat latihan 20-20-20 di dasbor aplikasi sangat berguna mengurangi kelelahan mata digital saya akibat menatap layar seharian.' 
    }
];

export default function TestimonialMarquee() {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [width, setWidth] = useState(0);
    const carouselRef = useRef(null);

    // Number of testimonials visible per view
    const [cardsPerView, setCardsPerView] = useState(3);

    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth < 768) {
                setCardsPerView(1);
            } else if (window.innerWidth < 1024) {
                setCardsPerView(2);
            } else {
                setCardsPerView(3);
            }
        };

        handleResize();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const maxIndex = TESTIMONIALS.length - cardsPerView;

    const nextSlide = () => {
        setCurrentIndex(prev => Math.min(prev + 1, maxIndex));
    };

    const prevSlide = () => {
        setCurrentIndex(prev => Math.max(prev - 1, 0));
    };

    return (
        <section
            id="ulasan"
            style={{
                padding: '120px 0',
                background: T.bg,
                position: 'relative',
                overflow: 'hidden',
                borderTop: '1px solid rgba(255, 255, 255, 0.03)'
            }}
        >
            {/* Glowing background details */}
            <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 0 }}>
                <div style={{
                    position: 'absolute',
                    top: '10%',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    width: '600px',
                    height: '350px',
                    borderRadius: '50%',
                    background: `radial-gradient(ellipse at center, rgba(255, 46, 147, 0.05) 0%, transparent 70%)`,
                    filter: 'blur(50px)'
                }} />
            </div>

            <div style={{ position: 'relative', zIndex: 1, maxWidth: '1400px', margin: '0 auto', padding: '0 1.5rem' }}>
                
                {/* Header */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '60px', flexWrap: 'wrap', gap: '24px' }}>
                    <div style={{ textAlign: 'left' }}>
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
                            marginBottom: '16px'
                        }}>
                            <MessageSquare size={12} />
                            Ulasan Pengguna
                        </span>
                        <h2 style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 800, letterSpacing: '-0.04em', color: '#FFF', margin: 0, lineHeight: 1.15 }}>
                            Dipercaya oleh Ribuan<br />
                            <span style={{ background: `linear-gradient(135deg, ${T.brand}, ${T.accent})`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', fontWeight: 800 }}>Mata Ceria di Indonesia.</span>
                        </h2>
                    </div>

                    {/* Navigation Buttons */}
                    <div style={{ display: 'flex', gap: '12px' }}>
                        <button
                            onClick={prevSlide}
                            disabled={currentIndex === 0}
                            style={{
                                width: '48px',
                                height: '48px',
                                borderRadius: '50%',
                                background: 'rgba(255, 255, 255, 0.03)',
                                border: '1px solid rgba(255, 255, 255, 0.08)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                color: '#FFF',
                                cursor: currentIndex === 0 ? 'not-allowed' : 'pointer',
                                transition: 'all 0.3s ease',
                                opacity: currentIndex === 0 ? 0.3 : 1
                            }}
                            onMouseEnter={e => { if (currentIndex !== 0) { e.currentTarget.style.background = 'rgba(255, 255, 255, 0.08)'; e.currentTarget.style.borderColor = T.brand; } }}
                            onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255, 255, 255, 0.03)'; e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.08)'; }}
                        >
                            <ChevronLeft size={20} />
                        </button>
                        <button
                            onClick={nextSlide}
                            disabled={currentIndex === maxIndex}
                            style={{
                                width: '48px',
                                height: '48px',
                                borderRadius: '50%',
                                background: 'rgba(255, 255, 255, 0.03)',
                                border: '1px solid rgba(255, 255, 255, 0.08)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                color: '#FFF',
                                cursor: currentIndex === maxIndex ? 'not-allowed' : 'pointer',
                                transition: 'all 0.3s ease',
                                opacity: currentIndex === maxIndex ? 0.3 : 1
                            }}
                            onMouseEnter={e => { if (currentIndex !== maxIndex) { e.currentTarget.style.background = 'rgba(255, 255, 255, 0.08)'; e.currentTarget.style.borderColor = T.brand; } }}
                            onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255, 255, 255, 0.03)'; e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.08)'; }}
                        >
                            <ChevronRight size={20} />
                        </button>
                    </div>
                </div>

                {/* Carousel Card Container */}
                <div 
                    ref={carouselRef}
                    style={{ position: 'relative', overflow: 'hidden', width: '100%', padding: '10px 0' }}
                >
                    <motion.div
                        drag="x"
                        dragConstraints={{ left: 0, right: 0 }}
                        style={{
                            display: 'flex',
                            gap: '24px',
                            width: '100%',
                            cursor: 'grab'
                        }}
                        animate={{ x: `calc(-${currentIndex * (100 / cardsPerView)}% - ${currentIndex * 16}px)` }}
                        transition={{ type: 'spring', stiffness: 150, damping: 20 }}
                        whileTap={{ cursor: 'grabbing' }}
                    >
                        {TESTIMONIALS.map((t, idx) => (
                            <div
                                key={idx}
                                style={{
                                    flexShrink: 0,
                                    width: `calc((100% - ${(cardsPerView - 1) * 24}px) / ${cardsPerView})`,
                                    background: 'rgba(255, 255, 255, 0.03)',
                                    border: '1px solid rgba(255, 255, 255, 0.06)',
                                    borderRadius: '24px',
                                    padding: '32px',
                                    backdropFilter: 'blur(16px)',
                                    boxShadow: '0 10px 30px rgba(0,0,0,0.2), inset 0 1px 0 rgba(255,255,255,0.05)',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    justifyContent: 'space-between',
                                    minHeight: '280px',
                                    transition: 'all 0.3s ease'
                                }}
                                onMouseEnter={e => {
                                    e.currentTarget.style.transform = 'translateY(-5px)';
                                    e.currentTarget.style.borderColor = T.brand;
                                    e.currentTarget.style.boxShadow = `0 15px 35px ${T.brand}10, 0 5px 15px rgba(0,0,0,0.3)`;
                                }}
                                onMouseLeave={e => {
                                    e.currentTarget.style.transform = 'none';
                                    e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.06)';
                                    e.currentTarget.style.boxShadow = '0 10px 30px rgba(0,0,0,0.2)';
                                }}
                            >
                                <div>
                                    {/* Stars & Icon */}
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                                        <div style={{ display: 'flex', gap: '3px' }}>
                                            {[...Array(t.rating)].map((_, i) => <Star key={i} size={14} fill="#FFD700" color="#FFD700" />)}
                                        </div>
                                        <Quote size={24} color={`${T.brand}30`} />
                                    </div>

                                    {/* Test type tag */}
                                    <span style={{
                                        fontSize: '0.62rem',
                                        fontWeight: 800,
                                        color: T.brand,
                                        background: `${T.brand}15`,
                                        padding: '4px 8px',
                                        borderRadius: '6px',
                                        textTransform: 'uppercase',
                                        letterSpacing: '0.05em',
                                        display: 'inline-block',
                                        marginBottom: '12px'
                                    }}>
                                        {t.testType}
                                    </span>

                                    {/* Text */}
                                    <p style={{
                                        fontSize: '0.92rem',
                                        color: T.text2,
                                        lineHeight: 1.65,
                                        margin: '0 0 24px 0',
                                        fontStyle: 'italic'
                                    }}>
                                        "{t.text}"
                                    </p>
                                </div>

                                {/* Author info */}
                                <div style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '12px',
                                    borderTop: '1px solid rgba(255,255,255,0.06)',
                                    paddingTop: '16px'
                                }}>
                                    <div style={{
                                        width: '40px',
                                        height: '40px',
                                        borderRadius: '50%',
                                        background: `linear-gradient(135deg, ${T.brand}, ${T.accent})`,
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        color: '#FFF',
                                        fontWeight: 800,
                                        fontSize: '0.95rem'
                                    }}>
                                        {t.name[0]}
                                    </div>
                                    <div>
                                        <div style={{ fontSize: '0.85rem', fontWeight: 800, color: '#FFF' }}>{t.name}</div>
                                        <div style={{ fontSize: '0.72rem', color: T.text3 }}>{t.role}</div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </motion.div>
                </div>

                {/* Progress Indicators */}
                <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', marginTop: '30px' }}>
                    {[...Array(maxIndex + 1)].map((_, i) => (
                        <div
                            key={i}
                            onClick={() => setCurrentIndex(i)}
                            style={{
                                width: currentIndex === i ? '24px' : '8px',
                                height: '8px',
                                borderRadius: '4px',
                                background: currentIndex === i ? T.brand : 'rgba(255,255,255,0.15)',
                                cursor: 'pointer',
                                transition: 'all 0.3s ease'
                            }}
                        />
                    ))}
                </div>

            </div>
        </section>
    );
}
