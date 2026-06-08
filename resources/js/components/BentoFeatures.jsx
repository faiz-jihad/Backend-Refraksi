/**
 * BentoFeatures — Bento Box Feature Grid
 * Dark glassmorphism with glow borders and hover animations
 */
import React from 'react';
import { motion } from 'framer-motion';
import { T } from './WelcomeApp';
import { Eye, Brain, MessageSquare, MapPin, ShieldCheck, Zap, BarChart3, Smartphone } from 'lucide-react';

const FEATURES = [
    {
        icon: <Eye size={28} />, color: T.brand, bg: 'rgba(14,165,233,0.1)',
        title: 'Tes Refraksi Digital',
        desc: 'Ukur ketajaman penglihatan dengan metode digital yang terstandarisasi. Hasil akurat dalam hitungan menit, tanpa perlu alat khusus.',
        size: 'large', // col-span-2
        visual: (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '6px', marginTop: '1rem' }}>
                {[['SPH', '-1.50', T.brand], ['CYL', '-0.25', T.brand2], ['VA', '20/20', T.green]].map(([l, v, c]) => (
                    <div key={l} style={{ padding: '8px', borderRadius: '8px', background: T.bg, border: `1px solid ${T.border}` }}>
                        <div style={{ fontSize: '0.55rem', color: T.text3, textTransform: 'uppercase', letterSpacing: '0.08em' }}>{l}</div>
                        <div style={{ fontSize: '0.875rem', fontWeight: 800, color: c, marginTop: '2px' }}>{v}</div>
                    </div>
                ))}
            </div>
        ),
    },
    {
        icon: <Brain size={28} />, color: T.accent, bg: 'rgba(139,92,246,0.1)',
        title: 'AI Diagnostics',
        desc: 'Model Gemini AI menganalisis pola penglihatan dan memberikan interpretasi klinis yang presisi.',
        size: 'normal',
    },
    {
        icon: <MessageSquare size={28} />, color: T.green, bg: 'rgba(16,185,129,0.1)',
        title: 'Konsultasi AI 24/7',
        desc: 'Tanya jawab dengan dokter mata AI kapan saja, dijawab dengan konteks medis yang tepat.',
        size: 'normal',
    },
    {
        icon: <MapPin size={28} />, color: '#F59E0B', bg: 'rgba(245,158,11,0.1)',
        title: 'RS Rujukan Terdekat',
        desc: 'Temukan rumah sakit dan dokter mata terbaik di sekitar Anda berdasarkan lokasi dan spesialisasi.',
        size: 'normal',
    },
    {
        icon: <BarChart3 size={28} />, color: T.brand2, bg: 'rgba(6,182,212,0.1)',
        title: 'Dashboard Riwayat',
        desc: 'Lacak perkembangan kesehatan mata dari waktu ke waktu dengan grafik visual yang informatif.',
        size: 'large',
        visual: (
            <div style={{ marginTop: '1rem', display: 'flex', alignItems: 'flex-end', gap: '6px', height: '48px' }}>
                {[40, 55, 45, 70, 62, 80, 75].map((h, i) => (
                    <motion.div
                        key={i}
                        initial={{ height: 0 }}
                        whileInView={{ height: `${h}%` }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: i * 0.07, ease: 'easeOut' }}
                        style={{ flex: 1, borderRadius: '4px 4px 0 0', background: i === 5 ? T.brand2 : `rgba(6,182,212,0.25)` }}
                    />
                ))}
            </div>
        ),
    },
    {
        icon: <ShieldCheck size={28} />, color: T.green, bg: 'rgba(16,185,129,0.1)',
        title: 'Data Terenkripsi',
        desc: 'Keamanan data medis dengan enkripsi end-to-end berstandar HIPAA dan ISO 27001.',
        size: 'normal',
    },
    {
        icon: <Smartphone size={28} />, color: T.brand, bg: 'rgba(14,165,233,0.1)',
        title: 'Mobile First',
        desc: 'Pengalaman terbaik di semua perangkat. Tersedia di Android & iOS dengan performa optimal.',
        size: 'normal',
    },
    {
        icon: <Zap size={28} />, color: '#F59E0B', bg: 'rgba(245,158,11,0.1)',
        title: 'Hasil Instan',
        desc: 'Analisis kurang dari 60 detik. Teknologi edge computing untuk kecepatan maksimum.',
        size: 'normal',
    },
];

function FeatureCard({ feature, delay }) {
    const [hov, setHov] = React.useState(false);
    const isLarge = feature.size === 'large';

    return (
        <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay, ease: [0.25, 0, 0, 1] }}
            onMouseEnter={() => setHov(true)}
            onMouseLeave={() => setHov(false)}
            style={{
                gridColumn: isLarge ? 'span 2' : 'span 1',
                background: T.surface,
                border: `1px solid ${hov ? feature.color + '40' : T.border}`,
                borderRadius: '20px',
                padding: '1.75rem',
                position: 'relative',
                overflow: 'hidden',
                transition: 'border-color 0.25s, box-shadow 0.25s, transform 0.25s',
                boxShadow: hov ? `0 0 40px ${feature.color}18, 0 20px 40px rgba(0,0,0,0.3)` : '0 4px 12px rgba(0,0,0,0.2)',
                transform: hov ? 'translateY(-3px)' : 'translateY(0)',
                cursor: 'default',
            }}
        >
            {/* Glow top line */}
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '1px', background: `linear-gradient(90deg, transparent, ${feature.color}${hov ? 'AA' : '40'}, transparent)`, transition: 'all 0.3s' }} />

            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
                <div style={{ padding: '0.75rem', borderRadius: '12px', background: feature.bg, color: feature.color, display: 'inline-flex', flexShrink: 0, boxShadow: hov ? `0 0 24px ${feature.color}30` : 'none', transition: 'box-shadow 0.25s' }}>
                    {feature.icon}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                    <h3 style={{ fontSize: '1rem', fontWeight: 700, color: T.text, margin: '0 0 0.5rem', letterSpacing: '-0.02em' }}>{feature.title}</h3>
                    <p style={{ fontSize: '0.875rem', color: T.text2, lineHeight: 1.65, margin: 0 }}>{feature.desc}</p>
                </div>
            </div>

            {feature.visual && <div style={{ marginTop: '1rem' }}>{feature.visual}</div>}
        </motion.div>
    );
}

export default function BentoFeatures() {
    return (
        <section id="fitur" style={{ padding: '6rem 0', position: 'relative' }}>
            <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '0 1.5rem' }}>
                {/* Section header */}
                <motion.div
                    initial={{ opacity: 0, y: 24 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    style={{ textAlign: 'center', marginBottom: '4rem' }}
                >
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '5px 14px', borderRadius: '99px', border: `1px solid rgba(14,165,233,0.3)`, background: 'rgba(14,165,233,0.06)', fontSize: '0.7rem', fontWeight: 700, color: T.brand, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '1.25rem' }}>
                        <Zap size={12} />
                        Platform Lengkap
                    </span>
                    <h2 style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 800, letterSpacing: '-0.04em', color: T.text, margin: '0 0 1rem' }}>
                        Semua yang kamu butuhkan,<br />
                        <span style={{ background: `linear-gradient(135deg, ${T.brand}, ${T.accent})`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>dalam satu platform.</span>
                    </h2>
                    <p style={{ fontSize: '1.05rem', color: T.text2, maxWidth: '520px', margin: '0 auto', lineHeight: 1.7 }}>
                        Ekosistem kesehatan mata digital yang terintegrasi penuh, didukung kecerdasan buatan terdepan.
                    </p>
                </motion.div>

                {/* Bento Grid */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.25rem' }} className="bento-grid">
                    {FEATURES.map((f, i) => (
                        <FeatureCard key={f.title} feature={f} delay={i * 0.06} />
                    ))}
                </div>
            </div>

            <style>{`
                @media(max-width: 1024px) {
                    .bento-grid { grid-template-columns: repeat(2, 1fr) !important; }
                    .bento-grid > *[style*="span 2"] { grid-column: span 2 !important; }
                }
                @media(max-width: 640px) {
                    .bento-grid { grid-template-columns: 1fr !important; }
                    .bento-grid > *[style*="span 2"] { grid-column: span 1 !important; }
                }
            `}</style>
        </section>
    );
}
