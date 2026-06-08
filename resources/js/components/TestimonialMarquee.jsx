import React from 'react';
import { motion } from 'framer-motion';

const NM_OUT_SM = '3px 3px 6px #b5b3b2, -3px -3px 6px #ffffff';
const NM_IN_SM = 'inset 3px 3px 6px #b5b3b2, inset -3px -3px 6px #ffffff';
const MONTSERRAT = "'Montserrat', sans-serif";

const TESTIMONIALS = [
    { name: 'Rizky Fajar', role: 'Software Engineer', company: 'Tokopedia', text: 'Deteksi Digital-nya akurat banget. Ketahuan silinder -1.75 padahal pikir mata normal. Sekarang sudah pakai kacamata yang tepat.', rating: 5, color: '#006666' },
    { name: 'Dina Pratiwi', role: 'Product Manager', company: 'Gojek', text: 'Interface-nya clean dan intuitif. Konsultasi dokter bisa langsung dalam aplikasi. Sangat membantu untuk orang yang sibuk.', rating: 5, color: '#004d4d' },
    { name: 'Budi Setiawan', role: 'Wirausahawan', company: 'Bandung', text: 'Awalnya skeptis tapi hasilnya mengejutkan. Digital berhasil deteksi tanda-tanda glaukoma yang belum saya sadari. Langsung ke spesialis.', rating: 5, color: '#338080' },
    { name: 'Siti Nurhaliza', role: 'Ibu Rumah Tangga', company: 'Jakarta', text: 'Untuk ibu-ibu yang tidak punya waktu ke klinik, MataCeria adalah jawaban. Cek mata anak dari rumah. Sangat recommended!', rating: 5, color: '#00A63D' },
    { name: 'Ahmad Fauzi', role: 'Dokter Umum', company: 'RS Hasan Sadikin', text: 'Sebagai tenaga medis saya terkesan dengan akurasi diagnostiknya. Membantu pasien mendapat penanganan mata lebih cepat.', rating: 5, color: '#006666' },
    { name: 'Lestari Dewi', role: 'Guru SMA', company: 'Surabaya', text: 'Sudah 3 bulan pakai MataCeria. Perkembangan kondisi mata bisa dipantau lewat grafik. Dokternya juga responsif.', rating: 5, color: '#004d4d' },
    { name: 'Hendra Kusuma', role: 'Mahasiswa', company: 'UI Jakarta', text: 'Gratis untuk mahasiswa? Luar biasa! Hasil scannya detail dan preskripsi digitalnya bisa langsung ke optik terdekat.', rating: 5, color: '#338080' },
    { name: 'Rahmawati S.', role: 'Perawat', company: 'RSCM Jakarta', text: 'Standar keamanan data mereka sangat baik. HIPAA compliant dan terenkripsi. Pasien bisa percaya sepenuhnya.', rating: 5, color: '#00A63D' },
];

function Star() {
    return (
        <svg width="10" height="10" fill="#FE9900" viewBox="0 0 24 24" style={{ flexShrink: 0 }}>
            <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
        </svg>
    );
}

function TestimonialCard({ t }) {
    return (
        <div style={{
            flexShrink: 0, width: '300px', borderRadius: '16px', padding: '1.25rem',
            margin: '0 10px', background: '#E7E5E4', boxShadow: NM_OUT_SM,
        }}>
            <div style={{ display: 'flex', gap: '2px', marginBottom: '10px' }}>
                {[1,2,3,4,5].map(i => <Star key={i} />)}
            </div>
            <p style={{ fontFamily: MONTSERRAT, fontSize: '0.75rem', lineHeight: 1.7, color: '#334155', marginBottom: '14px' }}>
                "{t.text}"
            </p>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{
                    width: '34px', height: '34px', borderRadius: '50%', flexShrink: 0,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontFamily: MONTSERRAT, fontWeight: 700, fontSize: '0.875rem',
                    background: '#E7E5E4', color: t.color, boxShadow: NM_IN_SM
                }}>
                    {t.name[0]}
                </div>
                <div>
                    <div style={{ fontFamily: MONTSERRAT, fontWeight: 700, fontSize: '0.75rem', color: '#1E2938' }}>{t.name}</div>
                    <div style={{ fontFamily: MONTSERRAT, fontSize: '0.625rem', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.08em' }}>{t.role} · {t.company}</div>
                </div>
                <div style={{ marginLeft: 'auto', width: '5px', height: '5px', borderRadius: '50%', background: t.color, animation: 'pulse 2s ease-in-out infinite' }} />
            </div>
        </div>
    );
}

export default function TestimonialMarquee() {
    const row1 = TESTIMONIALS.slice(0, 4);
    const row2 = TESTIMONIALS.slice(4);

    return (
        <section style={{ padding: '7rem 0', background: '#E7E5E4', overflow: 'hidden', position: 'relative' }}>
            {/* Edge fade masks */}
            {['left', 'right'].map(side => (
                <div key={side} style={{
                    position: 'absolute', top: 0, bottom: 0, [side]: 0, width: '120px', zIndex: 10,
                    background: `linear-gradient(to ${side === 'left' ? 'right' : 'left'}, #E7E5E4, transparent)`,
                    pointerEvents: 'none'
                }} />
            ))}

            <div style={{ maxWidth: '80rem', margin: '0 auto', padding: '0 1.5rem', marginBottom: '4rem', position: 'relative', zIndex: 5 }}>
                <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} style={{ textAlign: 'center' }}>
                    <span style={{ fontFamily: MONTSERRAT, fontSize: '0.625rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.15em', color: '#00A63D' }}>Testimonials</span>
                    <h2 style={{ fontFamily: MONTSERRAT, fontWeight: 700, fontSize: 'clamp(1.75rem, 4vw, 3rem)', color: '#1E2938', letterSpacing: '-0.02em', lineHeight: 1.2, marginTop: '8px' }}>
                        Dipercaya ribuan, <span style={{ color: '#006666' }}>divalidasi dokter</span>
                    </h2>
                </motion.div>
            </div>

            {/* Row 1: L→R */}
            <div style={{ overflow: 'hidden', marginBottom: '16px' }}>
                <motion.div
                    animate={{ x: ['0%', '-50%'] }}
                    transition={{ duration: 38, repeat: Infinity, ease: 'linear' }}
                    style={{ display: 'flex', width: 'max-content' }}
                >
                    {[...row1, ...row1, ...row1, ...row1].map((t, i) => (
                        <TestimonialCard key={i} t={t} />
                    ))}
                </motion.div>
            </div>

            {/* Row 2: R→L */}
            <div style={{ overflow: 'hidden' }}>
                <motion.div
                    animate={{ x: ['-50%', '0%'] }}
                    transition={{ duration: 42, repeat: Infinity, ease: 'linear' }}
                    style={{ display: 'flex', width: 'max-content' }}
                >
                    {[...row2, ...row2, ...row2, ...row2].map((t, i) => (
                        <TestimonialCard key={i} t={t} />
                    ))}
                </motion.div>
            </div>
        </section>
    );
}



