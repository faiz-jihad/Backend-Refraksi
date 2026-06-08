/**
 * StatsSection — Animated counter cards
 * Grid: 1 col mobile / 2 tablet / 4 desktop
 */
import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { T } from './WelcomeApp';
import { Users, Eye, Star, Building2 } from 'lucide-react';

function useCountUp(target, duration = 2000, isVisible) {
    const [count, setCount] = useState(0);
    const started = useRef(false);

    useEffect(() => {
        if (!isVisible || started.current) return;
        started.current = true;
        const numTarget = parseFloat(String(target).replace(/[^0-9.]/g, '')) || 0;
        let startTime = null;
        const step = (ts) => {
            if (!startTime) startTime = ts;
            const pct = Math.min((ts - startTime) / duration, 1);
            const eased = 1 - Math.pow(1 - pct, 3);
            setCount(Math.round(eased * numTarget));
            if (pct < 1) requestAnimationFrame(step);
        };
        requestAnimationFrame(step);
    }, [isVisible, target, duration]);

    return count;
}

function StatCard({ icon, label, rawValue, suffix, color, bg, delay }) {
    const ref = useRef(null);
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setVisible(true); }, { threshold: 0.3 });
        if (ref.current) obs.observe(ref.current);
        return () => obs.disconnect();
    }, []);

    const count = useCountUp(rawValue, 1800, visible);

    return (
        <motion.div
            ref={ref}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay, ease: [0.25, 0, 0, 1] }}
            whileHover={{ y: -4, boxShadow: `0 20px 40px rgba(0,0,0,0.3), 0 0 0 1px ${color}30` }}
            style={{
                background: T.surface,
                border: `1px solid ${T.border}`,
                borderRadius: '20px',
                padding: '1.75rem',
                position: 'relative',
                overflow: 'hidden',
                transition: 'box-shadow 0.3s, transform 0.3s',
                cursor: 'default',
            }}
        >
            {/* Top accent line */}
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '2px', background: `linear-gradient(90deg, transparent, ${color}, transparent)` }} />

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.25rem' }}>
                <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: bg, display: 'flex', alignItems: 'center', justifyContent: 'center', color }}>
                    {icon}
                </div>
                <span style={{ fontSize: '0.65rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: T.text3, marginTop: '2px' }}>{label}</span>
            </div>

            <div style={{ fontSize: '2.5rem', fontWeight: 900, letterSpacing: '-0.05em', color: T.text, lineHeight: 1 }}>
                {count.toLocaleString('id-ID')}<span style={{ color }}>{suffix}</span>
            </div>
        </motion.div>
    );
}

export default function StatsSection({ statsPatients, statsDoctors }) {
    const patients = parseInt(String(statsPatients).replace(/[^0-9]/g, '')) || 50000;
    const doctors  = parseInt(String(statsDoctors).replace(/[^0-9]/g, '')) || 120;

    const stats = [
        { icon: <Users size={20} />,     label: 'Pengguna Aktif',   rawValue: patients, suffix: '+', color: T.brand,  bg: 'rgba(14,165,233,0.1)' },
        { icon: <Eye size={20} />,       label: 'Pemeriksaan Mata', rawValue: 142000,   suffix: '+', color: T.brand2, bg: 'rgba(6,182,212,0.1)' },
        { icon: <Star size={20} />,      label: 'Rating Pengguna',  rawValue: 4.9,      suffix: '/5', color: '#F59E0B', bg: 'rgba(245,158,11,0.1)' },
        { icon: <Building2 size={20} />, label: 'RS Rujukan',       rawValue: doctors,  suffix: '+', color: T.green,  bg: 'rgba(16,185,129,0.1)' },
    ];

    return (
        <section style={{ padding: '5rem 0', position: 'relative' }}>
            <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '0 1.5rem' }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(1, 1fr)', gap: '1.25rem' }} className="stats-grid">
                    {stats.map((s, i) => <StatCard key={s.label} {...s} delay={i * 0.08} />)}
                </div>
            </div>
            <style>{`
                @media(min-width:640px)  { .stats-grid { grid-template-columns: repeat(2, 1fr) !important; } }
                @media(min-width:1280px) { .stats-grid { grid-template-columns: repeat(4, 1fr) !important; } }
            `}</style>
        </section>
    );
}
