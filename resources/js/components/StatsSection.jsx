import React from 'react';
import { motion } from 'framer-motion';

const NM_OUT_SM = '3px 3px 6px #b5b3b2, -3px -3px 6px #ffffff';
const NM_OUT_MD = '6px 6px 12px #b5b3b2, -6px -6px 12px #ffffff';
const NM_IN_SM = 'inset 3px 3px 6px #b5b3b2, inset -3px -3px 6px #ffffff';
const MONTSERRAT = "'Montserrat', sans-serif";

export default function StatsSection({ statsPatients, statsDoctors, statsAccuracy = '98.7%' }) {
    const STATS = [
        { display: statsPatients || '50K+', label: 'Patients Served', sublabel: 'Across Indonesia', color: '#006666' },
        { display: statsAccuracy, label: 'Digital Accuracy Rate', sublabel: 'Clinically Validated', color: '#00A63D' },
        { display: statsDoctors || '120+', label: 'Verified Doctors', sublabel: 'Ophthalmologists', color: '#004d4d' },
        { display: '24/7', label: 'Platform Uptime', sublabel: 'Always Available', color: '#338080' },
    ];
    return (
        <section style={{ padding: '5rem 0', background: '#E7E5E4', position: 'relative' }}>
            {/* Inset groove top/bottom */}
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '2px', background: '#E7E5E4', boxShadow: NM_IN_SM }} />
            <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '2px', background: '#E7E5E4', boxShadow: NM_IN_SM }} />

            <div style={{ maxWidth: '80rem', margin: '0 auto', padding: '0 1.5rem' }}>
                <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
                    <span style={{ fontFamily: MONTSERRAT, fontSize: '0.625rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.15em', color: '#00A63D' }}>Live Metrics</span>
                    <h2 style={{ fontFamily: MONTSERRAT, fontWeight: 700, fontSize: 'clamp(1.5rem, 3.5vw, 2.5rem)', color: '#1E2938', letterSpacing: '-0.02em', lineHeight: 1.2, marginTop: '8px' }}>
                        Dipercaya ribuan, <span style={{ color: '#006666' }}>dibuktikan data</span>
                    </h2>
                </motion.div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                    {STATS.map((stat, idx) => (
                        <motion.div
                            key={idx}
                            initial={{ opacity: 0, y: 24, scale: 0.97 }}
                            whileInView={{ opacity: 1, y: 0, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: idx * 0.09 }}
                            whileHover={{ y: -4, boxShadow: NM_OUT_MD }}
                            whileTap={{ boxShadow: NM_IN_SM }}
                            style={{
                                background: '#E7E5E4', borderRadius: '16px',
                                padding: '1.75rem 1.5rem', textAlign: 'center',
                                boxShadow: NM_OUT_SM, cursor: 'default',
                                transition: 'box-shadow 200ms, transform 200ms'
                            }}
                        >
                            {/* Top accent line */}
                            <div style={{ height: '3px', borderRadius: '2px', background: stat.color, width: '40px', margin: '0 auto 1.25rem', boxShadow: `0 0 8px ${stat.color}40` }} />

                            <div style={{
                                fontFamily: MONTSERRAT, fontWeight: 700,
                                fontSize: 'clamp(2rem, 4vw, 3rem)', color: stat.color,
                                letterSpacing: '-0.03em', lineHeight: 1.1, marginBottom: '8px'
                            }}>
                                {stat.display}
                            </div>

                            <div style={{ fontFamily: MONTSERRAT, fontSize: '0.8125rem', fontWeight: 700, color: '#1E2938', marginBottom: '4px' }}>
                                {stat.label}
                            </div>
                            <div style={{ fontFamily: MONTSERRAT, fontSize: '0.6875rem', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                                {stat.sublabel}
                            </div>

                            {/* Pulsing dot */}
                            <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: stat.color, margin: '1rem auto 0', animation: 'pulse 2s ease-in-out infinite' }} />
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}



