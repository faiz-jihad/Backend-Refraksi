import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';

const NM_OUT_SM = '3px 3px 6px #b5b3b2, -3px -3px 6px #ffffff';
const NM_OUT_MD = '6px 6px 12px #b5b3b2, -6px -6px 12px #ffffff';
const NM_IN_SM = 'inset 3px 3px 6px #b5b3b2, inset -3px -3px 6px #ffffff';
const MONTSERRAT = "'Montserrat', sans-serif";

const STEPS = [
    {
        num: '01', title: 'Scan Retina', subtitle: 'Digital eye capture',
        desc: 'Gunakan kamera smartphone untuk mengambil gambar retina beresolusi tinggi. Sistem memandu melalui proses kalibrasi otomatis.',
        icon: (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#006666" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
        ),
        color: '#006666',
    },
    {
        num: '02', title: 'Digital Analysis', subtitle: 'Neural inference',
        desc: 'Model deep learning kami menganalisis 47 parameter retina dalam hitungan detik — dari kelainan refraksi hingga tanda penyakit serius.',
        icon: (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#004d4d" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                <path d="M9 3v18M15 3v18M3 9h18M3 15h18" />
            </svg>
        ),
        color: '#004d4d',
    },
    {
        num: '03', title: 'Konsultasi Dokter', subtitle: 'Verified specialist',
        desc: 'Hasil Digital dikirim ke dokter spesialis mata terverifikasi yang siap memberikan pendapat medis dan rekomendasi personal.',
        icon: (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#338080" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 18v-6a9 9 0 0 1 18 0v6" />
                <path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3zM3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z" />
            </svg>
        ),
        color: '#338080',
    },
    {
        num: '04', title: 'Treatment Plan', subtitle: 'Personalized care',
        desc: 'Dapatkan resep digital, rujukan optik terdekat, jadwal kontrol, dan rencana perawatan komprehensif — dalam satu aplikasi.',
        icon: (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#00A63D" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                <polyline points="14 2 14 8 20 8" />
                <line x1="16" y1="13" x2="8" y2="13" />
                <line x1="16" y1="17" x2="8" y2="17" />
                <polyline points="10 9 9 9 8 9" />
            </svg>
        ),
        color: '#00A63D',
    },
];

export default function ProcessTimeline() {
    const ref = useRef(null);
    const inView = useInView(ref, { once: true, margin: '-80px' });

    return (
        <section id="proses" ref={ref} style={{ padding: '7rem 0', background: '#E7E5E4', position: 'relative', overflow: 'hidden' }}>
            {/* Subtle bg blobs */}
            <div style={{ position: 'absolute', top: '20%', left: '10%', width: '300px', height: '300px', borderRadius: '50%', background: 'rgba(255,255,255,0.6)', filter: 'blur(60px)', pointerEvents: 'none' }} />
            <div style={{ position: 'absolute', bottom: '20%', right: '10%', width: '250px', height: '250px', borderRadius: '50%', background: 'rgba(181,179,178,0.4)', filter: 'blur(60px)', pointerEvents: 'none' }} />

            <div style={{ maxWidth: '80rem', margin: '0 auto', padding: '0 1.5rem', position: 'relative', zIndex: 1 }}>
                {/* Header */}
                <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} style={{ textAlign: 'center', marginBottom: '5rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', marginBottom: '12px' }}>
                        <div style={{ width: '16px', height: '1px', background: '#006666' }} />
                        <span style={{ fontFamily: MONTSERRAT, fontSize: '0.625rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.15em', color: '#006666' }}>How It Works</span>
                        <div style={{ width: '16px', height: '1px', background: '#006666' }} />
                    </div>
                    <h2 style={{ fontFamily: MONTSERRAT, fontWeight: 700, fontSize: 'clamp(1.75rem, 4vw, 3rem)', color: '#1E2938', letterSpacing: '-0.02em', lineHeight: 1.2, marginBottom: '12px' }}>
                        Dari scan ke treatment<br />
                        <span style={{ color: '#006666' }}>dalam 5 menit</span>
                    </h2>
                </motion.div>

                {/* Connecting line */}
                <div style={{ position: 'relative' }}>
                    {/* Horizontal gradient line behind steps (desktop) */}
                    <div
                        className="hidden lg:block"
                        style={{
                            position: 'absolute', top: '52px', left: '12.5%', right: '12.5%', height: '2px',
                            background: '#E7E5E4', boxShadow: NM_IN_SM, borderRadius: '1px'
                        }}
                    >
                        <motion.div
                            initial={{ scaleX: 0 }} animate={inView ? { scaleX: 1 } : {}}
                            transition={{ duration: 1.5, ease: 'easeInOut', delay: 0.3 }}
                            style={{ height: '100%', background: '#006666', opacity: 0.35, originX: 0, borderRadius: '1px' }}
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {STEPS.map((step, idx) => (
                            <motion.div
                                key={step.num}
                                initial={{ opacity: 0, y: 32 }}
                                animate={inView ? { opacity: 1, y: 0 } : {}}
                                transition={{ duration: 0.55, delay: idx * 0.14 }}
                                style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}
                            >
                                {/* Step circle */}
                                <motion.div
                                    whileHover={{ boxShadow: NM_IN_SM }}
                                    style={{
                                        width: '104px', height: '104px', borderRadius: '50%',
                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        fontSize: '2rem', marginBottom: '2rem',
                                        background: '#E7E5E4', boxShadow: NM_OUT_MD,
                                        position: 'relative', transition: 'box-shadow 200ms'
                                    }}
                                >
                                    {/* Clean subtle outer ring */}
                                    <div style={{
                                        position: 'absolute', inset: '-5px', borderRadius: '50%',
                                        border: `1px solid rgba(0,102,102,0.12)`
                                    }} />
                                    {step.icon}
                                    {/* Number badge */}
                                    <div style={{
                                        position: 'absolute', top: '-8px', right: '-4px',
                                        width: '26px', height: '26px', borderRadius: '50%',
                                        background: step.color, color: '#fff',
                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        fontFamily: MONTSERRAT, fontSize: '10px', fontWeight: 700,
                                        boxShadow: NM_OUT_SM
                                    }}>
                                        {idx + 1}
                                    </div>
                                </motion.div>

                                {/* Card */}
                                <motion.div
                                    whileHover={{ y: -4 }}
                                    style={{
                                        width: '100%', background: '#E7E5E4', borderRadius: '12px',
                                        padding: '1.25rem', textAlign: 'left',
                                        border: '1px solid rgba(0,0,0,0.06)',
                                        transition: 'transform 200ms'
                                    }}
                                >
                                    <div style={{ fontFamily: MONTSERRAT, fontSize: '8px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.12em', color: step.color, marginBottom: '6px' }}>
                                        {step.subtitle}
                                    </div>
                                    <h3 style={{ fontFamily: MONTSERRAT, fontWeight: 700, fontSize: '1rem', color: '#1E2938', marginBottom: '8px', letterSpacing: '-0.01em' }}>
                                        {step.title}
                                    </h3>
                                    <p style={{ fontFamily: MONTSERRAT, fontSize: '0.75rem', lineHeight: 1.7, color: '#64748b' }}>
                                        {step.desc}
                                    </p>
                                    {/* Progress dots */}
                                    <div style={{ display: 'flex', gap: '4px', marginTop: '12px' }}>
                                        {STEPS.map((_, i) => (
                                            <div key={i} style={{
                                                height: '4px', borderRadius: '2px',
                                                width: i === idx ? '20px' : '6px',
                                                background: i === idx ? step.color : '#d0cdcc',
                                                transition: 'width 300ms',
                                            }} />
                                        ))}
                                    </div>
                                </motion.div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}



