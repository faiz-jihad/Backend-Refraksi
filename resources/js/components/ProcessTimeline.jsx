/**
 * ProcessTimeline — How it works section
 * Numbered steps with connecting line, dark premium theme
 */
import React from 'react';
import { motion } from 'framer-motion';
import { T } from './WelcomeApp';
import { Download, Eye, BarChart3, Stethoscope } from 'lucide-react';

const STEPS = [
    { num: '01', icon: <Download size={22} />, color: T.brand, bg: 'rgba(14,165,233,0.1)', title: 'Unduh & Daftar', desc: 'Install aplikasi MataCeria gratis dari Play Store atau App Store. Buat akun dalam 30 detik tanpa data kartu kredit.' },
    { num: '02', icon: <Eye size={22} />, color: T.brand2, bg: 'rgba(6,182,212,0.1)', title: 'Mulai Tes Digital', desc: 'Ikuti panduan tes refraksi visual yang interaktif. Kamera smartphone mendeteksi respons pupil dengan presisi tinggi.' },
    { num: '03', icon: <BarChart3 size={22} />, color: T.accent, bg: 'rgba(139,92,246,0.1)', title: 'Analisis AI Instan', desc: 'Model AI menganalisis data visual dan memberikan estimasi resep kacamata dalam kurang dari 60 detik.' },
    { num: '04', icon: <Stethoscope size={22} />, color: T.green, bg: 'rgba(16,185,129,0.1)', title: 'Konsultasi & Rujukan', desc: 'Terhubung dengan dokter mata terdekat atau gunakan fitur chat AI untuk tindak lanjut yang tepat.' },
];

export default function ProcessTimeline() {
    return (
        <section id="proses" style={{ padding: '6rem 0', position: 'relative', overflow: 'hidden' }}>
            {/* Subtle background */}
            <div style={{ position: 'absolute', inset: 0, background: `linear-gradient(180deg, transparent, ${T.surface}44, transparent)`, pointerEvents: 'none' }} />

            <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '0 1.5rem', position: 'relative' }}>
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 24 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    style={{ textAlign: 'center', marginBottom: '4rem' }}
                >
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '5px 14px', borderRadius: '99px', border: `1px solid rgba(139,92,246,0.3)`, background: 'rgba(139,92,246,0.06)', fontSize: '0.7rem', fontWeight: 700, color: T.accent, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '1.25rem' }}>
                        Cara Kerja
                    </span>
                    <h2 style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 800, letterSpacing: '-0.04em', color: T.text, margin: '0 0 1rem' }}>
                        Sehat dalam <span style={{ background: `linear-gradient(135deg, ${T.accent}, ${T.brand})`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>4 langkah</span> mudah
                    </h2>
                    <p style={{ fontSize: '1.05rem', color: T.text2, maxWidth: '480px', margin: '0 auto', lineHeight: 1.7 }}>
                        Dari unduh hingga konsultasi dokter, prosesnya cepat, mudah, dan akurat.
                    </p>
                </motion.div>

                {/* Steps */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1.5rem', position: 'relative' }} className="steps-grid">
                    {/* Connecting line */}
                    <div style={{ position: 'absolute', top: '36px', left: '12.5%', right: '12.5%', height: '1px', background: `linear-gradient(90deg, ${T.brand}, ${T.brand2}, ${T.accent}, ${T.green})`, opacity: 0.3 }} className="steps-line" />

                    {STEPS.map((step, i) => (
                        <motion.div
                            key={step.num}
                            initial={{ opacity: 0, y: 32 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6, delay: i * 0.12, ease: [0.25, 0, 0, 1] }}
                        >
                            {/* Icon circle */}
                            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1.5rem', position: 'relative', zIndex: 1 }}>
                                <div style={{ width: '72px', height: '72px', borderRadius: '50%', background: T.surface, border: `1px solid ${step.color}40`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: step.color, boxShadow: `0 0 24px ${step.color}20` }}>
                                    {step.icon}
                                </div>
                            </div>

                            {/* Content card */}
                            <div style={{ background: T.surface, border: `1px solid ${T.border}`, borderRadius: '16px', padding: '1.5rem', textAlign: 'center' }}>
                                <span style={{ fontSize: '0.65rem', fontWeight: 800, color: step.color, textTransform: 'uppercase', letterSpacing: '0.12em', display: 'block', marginBottom: '0.5rem' }}>{step.num}</span>
                                <h3 style={{ fontSize: '0.95rem', fontWeight: 700, color: T.text, margin: '0 0 0.75rem', letterSpacing: '-0.02em' }}>{step.title}</h3>
                                <p style={{ fontSize: '0.845rem', color: T.text2, lineHeight: 1.65, margin: 0 }}>{step.desc}</p>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>

            <style>{`
                @media(max-width: 1024px) { .steps-grid { grid-template-columns: repeat(2, 1fr) !important; } .steps-line { display: none !important; } }
                @media(max-width: 640px)  { .steps-grid { grid-template-columns: 1fr !important; } }
            `}</style>
        </section>
    );
}
