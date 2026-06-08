/**
 * TestimonialMarquee — Auto-scrolling testimonials
 * Infinite marquee with pause on hover, dark glassmorphism cards
 */
import React, { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { T } from './WelcomeApp';
import { Star, MessageSquare } from 'lucide-react';

const TESTIMONIALS = [
    { name: 'Rina Marlina', role: 'Guru SD, Bandung', rating: 5, text: 'Luar biasa! Hasil tes refraksi sangat akurat. Dokter bilang hasilnya hampir sama persis dengan pemeriksaan di klinik. Hemat waktu dan biaya!' },
    { name: 'Farhan Hidayat', role: 'Mahasiswa UI, Jakarta', rating: 5, text: 'Aplikasinya simpel banget tapi hasilnya profesional. AI-nya bisa jelaskan kondisi mata saya dengan bahasa yang mudah dipahami.' },
    { name: 'Dr. Siti Rahma', role: 'Dokter Umum, Surabaya', rating: 5, text: 'Saya rekomendasikan ke pasien sebagai pre-screening. Membantu banget untuk identifikasi awal sebelum pemeriksaan lengkap.' },
    { name: 'Budi Santoso', role: 'Karyawan Swasta, Medan', rating: 5, text: 'Sudah 3 kali pakai, hasilnya konsisten. Feature chat dokter AI-nya responsif dan informatif. Worth it!' },
    { name: 'Dewi Kusuma', role: 'Ibu Rumah Tangga, Yogya', rating: 5, text: 'Anak saya yang 8 tahun bisa ikut tes tanpa takut. Interface-nya friendly banget. Terima kasih MataCeria!' },
    { name: 'Ahmad Fauzi', role: 'Wirausaha, Makassar', rating: 4, text: 'Cepat, akurat, dan murah. Dibanding ke optik yang antri panjang, ini jauh lebih praktis. Mantap!' },
    { name: 'Lestari Ningrum', role: 'Perawat, Semarang', rating: 5, text: 'Dari sisi medis, hasil analisis AI-nya cukup komprehensif. Rekomendasikan untuk pemeriksaan rutin tahunan.' },
    { name: 'Kevin Pratama', role: 'Developer, Bali', rating: 5, text: 'UI-nya clean, pengalaman pakainya mulus. Hasil langsung tersimpan di histori. Perfect buat saya yang sibuk.' },
];

function TestiCard({ t }) {
    return (
        <div style={{
            width: '300px', flexShrink: 0,
            background: T.surface, border: `1px solid ${T.border}`,
            borderRadius: '20px', padding: '1.5rem',
            marginRight: '1rem',
        }}>
            <div style={{ display: 'flex', gap: '4px', marginBottom: '0.875rem' }}>
                {[...Array(t.rating)].map((_, i) => <Star key={i} size={14} fill="#F59E0B" color="#F59E0B" />)}
            </div>
            <p style={{ fontSize: '0.875rem', color: T.text2, lineHeight: 1.65, margin: '0 0 1rem', fontStyle: 'italic' }}>
                "{t.text}"
            </p>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', paddingTop: '1rem', borderTop: `1px solid ${T.border}` }}>
                <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: `linear-gradient(135deg, ${T.brand}, ${T.accent})`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 700, fontSize: '0.875rem', flexShrink: 0 }}>
                    {t.name[0]}
                </div>
                <div>
                    <div style={{ fontSize: '0.845rem', fontWeight: 700, color: T.text }}>{t.name}</div>
                    <div style={{ fontSize: '0.72rem', color: T.text3 }}>{t.role}</div>
                </div>
            </div>
        </div>
    );
}

export default function TestimonialMarquee() {
    const [paused, setPaused] = useState(false);
    const doubled = [...TESTIMONIALS, ...TESTIMONIALS];

    return (
        <section style={{ padding: '6rem 0', overflow: 'hidden', position: 'relative' }}>
            <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '0 1.5rem', marginBottom: '3rem' }}>
                <motion.div
                    initial={{ opacity: 0, y: 24 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    style={{ textAlign: 'center' }}
                >
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '5px 14px', borderRadius: '99px', border: `1px solid rgba(245,158,11,0.3)`, background: 'rgba(245,158,11,0.06)', fontSize: '0.7rem', fontWeight: 700, color: '#F59E0B', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '1.25rem' }}>
                        <MessageSquare size={12} />
                        Testimoni Pengguna
                    </span>
                    <h2 style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 800, letterSpacing: '-0.04em', color: T.text, margin: '0 0 1rem' }}>
                        Dipercaya <span style={{ background: `linear-gradient(135deg, #F59E0B, ${T.brand})`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>50.000+</span> pengguna
                    </h2>
                    <p style={{ fontSize: '1.05rem', color: T.text2, maxWidth: '460px', margin: '0 auto' }}>
                        Apa kata mereka tentang MataCeria?
                    </p>
                </motion.div>
            </div>

            {/* Marquee */}
            <div
                style={{ position: 'relative', overflow: 'hidden' }}
                onMouseEnter={() => setPaused(true)}
                onMouseLeave={() => setPaused(false)}
            >
                {/* Fade edges */}
                <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: '120px', background: `linear-gradient(90deg, ${T.bg}, transparent)`, zIndex: 10, pointerEvents: 'none' }} />
                <div style={{ position: 'absolute', right: 0, top: 0, bottom: 0, width: '120px', background: `linear-gradient(270deg, ${T.bg}, transparent)`, zIndex: 10, pointerEvents: 'none' }} />

                <div style={{
                    display: 'flex',
                    animation: `wc-marquee 40s linear infinite`,
                    animationPlayState: paused ? 'paused' : 'running',
                    width: 'max-content',
                    paddingLeft: '1rem',
                }}>
                    {doubled.map((t, i) => <TestiCard key={i} t={t} />)}
                </div>
            </div>
        </section>
    );
}
