import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function SplashScreen({ onComplete }) {
    const [phase, setPhase] = useState(0);
    const [bootLines, setBootLines] = useState([]);
    const [progress, setProgress] = useState(0);

    const BOOT_SEQUENCE = [
        '> Initializing MataCeria v3.2.1...',
        '> Loading ophthalmology models... [OK]',
        '> Calibrating refraction engine... [OK]',
        '> Connecting to inference cluster... [OK]',
        '> Loading 50,247 patient records... [OK]',
        '> System ready. Launching...',
    ];

    useEffect(() => {
        const t1 = setTimeout(() => setPhase(1), 150);
        const t2 = setTimeout(() => setPhase(2), 400);
        return () => { clearTimeout(t1); clearTimeout(t2); };
    }, []);

    useEffect(() => {
        if (phase !== 2) return;
        let lineIdx = 0;
        const interval = setInterval(() => {
            if (lineIdx < BOOT_SEQUENCE.length) {
                setBootLines(prev => [...prev, BOOT_SEQUENCE[lineIdx]]);
                setProgress(Math.round(((lineIdx + 1) / BOOT_SEQUENCE.length) * 100));
                lineIdx++;
            } else {
                clearInterval(interval);
                setTimeout(() => {
                    setPhase(3);
                    onComplete();
                }, 100);
            }
        }, 70);
        return () => clearInterval(interval);
    }, [phase]);

    return (
        <AnimatePresence>
            {phase < 3 && (
                <motion.div
                    initial={{ opacity: 1 }}
                    exit={{ opacity: 0, scale: 1.02 }}
                    transition={{ duration: 0.4, ease: 'easeInOut' }}
                    className="fixed inset-0 z-[9999] flex flex-col items-center justify-center"
                    style={{ background: '#E7E5E4' }}
                >
                    {/* Subtle neumorphic radial */}
                    <div className="absolute inset-0 pointer-events-none"
                         style={{ background: 'radial-gradient(ellipse at 30% 30%, rgba(255,255,255,0.5) 0%, transparent 60%), radial-gradient(ellipse at 70% 70%, rgba(181,179,178,0.3) 0%, transparent 60%)' }} />

                    <div className="relative z-10 flex flex-col items-center gap-8">
                        {/* Logo mark */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.85, y: 16 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            transition={{ duration: 0.55, ease: 'easeOut' }}
                            className="flex flex-col items-center gap-4"
                        >
                            {/* Eye icon neumorphic */}
                            <div className="relative w-20 h-20 rounded-2xl flex items-center justify-center"
                                 style={{ background: '#E7E5E4', boxShadow: '8px 8px 16px #b5b3b2, -8px -8px 16px #ffffff' }}>
                                <svg viewBox="0 0 40 40" fill="none" className="w-9 h-9">
                                    <motion.path
                                        d="M4 20C4 20 10 10 20 10C30 10 36 20 36 20C36 20 30 30 20 30C10 30 4 20 4 20Z"
                                        stroke="#006666" strokeWidth="2" fill="none"
                                        initial={{ pathLength: 0, opacity: 0 }}
                                        animate={{ pathLength: 1, opacity: 1 }}
                                        transition={{ duration: 0.4, delay: 0.1 }}
                                    />
                                    <motion.circle cx="20" cy="20" r="6"
                                        stroke="#006666" strokeWidth="2" fill="none"
                                        initial={{ scale: 0, opacity: 0 }}
                                        animate={{ scale: 1, opacity: 1 }}
                                        transition={{ duration: 0.3, delay: 0.3 }}
                                    />
                                    <motion.circle cx="20" cy="20" r="2.5"
                                        fill="#006666"
                                        initial={{ scale: 0 }}
                                        animate={{ scale: 1 }}
                                        transition={{ duration: 0.2, delay: 0.4 }}
                                    />
                                </svg>
                            </div>

                            <div className="text-center">
                                <h1 className="text-2xl font-bold tracking-tight" style={{ fontFamily: "'Montserrat', sans-serif", color: '#1E2938' }}>
                                    Mata<span style={{ color: '#006666' }}>Ceria</span>
                                </h1>
                                <p style={{ fontFamily: "'Montserrat', sans-serif", fontSize: '0.625rem', textTransform: 'uppercase', letterSpacing: '0.15em', color: '#64748b', marginTop: '4px' }}>
                                    Digital Eye Health Platform
                                </p>
                            </div>
                        </motion.div>

                        {/* Terminal boot */}
                        {phase >= 2 && (
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.3 }}
                                className="w-[420px] max-w-[90vw] rounded-2xl p-5"
                                style={{ background: '#E7E5E4', boxShadow: 'inset 5px 5px 10px #b5b3b2, inset -5px -5px 10px #ffffff' }}
                            >
                                <div className="flex items-center gap-2 mb-3 pb-2" style={{ borderBottom: '1px solid #d0cdcc' }}>
                                    <div className="flex gap-1.5">
                                        <span className="w-2.5 h-2.5 rounded-full" style={{ background: '#FF2157' }}></span>
                                        <span className="w-2.5 h-2.5 rounded-full" style={{ background: '#FE9900' }}></span>
                                        <span className="w-2.5 h-2.5 rounded-full" style={{ background: '#00A63D' }}></span>
                                    </div>
                                    <span style={{ fontFamily: "'Montserrat', sans-serif", fontSize: '10px', color: '#94a3b8', marginLeft: '8px' }}>mataceria — boot</span>
                                </div>

                                <div className="space-y-1 min-h-[100px]" style={{ fontFamily: "'Montserrat', sans-serif", fontSize: '11px' }}>
                                    <AnimatePresence>
                                        {bootLines.map((line, idx) => (
                                            <motion.p key={idx}
                                                initial={{ opacity: 0, x: -8 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                transition={{ duration: 0.15 }}
                                                style={{ color: line.includes('[OK]') ? '#00A63D' : idx === bootLines.length - 1 ? '#006666' : '#64748b' }}>
                                                {line}
                                                {idx === bootLines.length - 1 && (
                                                    <span className="inline-block w-1.5 h-3 ml-0.5 animate-pulse align-middle" style={{ background: '#006666' }} />
                                                )}
                                            </motion.p>
                                        ))}
                                    </AnimatePresence>
                                </div>

                                {/* Progress */}
                                <div className="mt-3 pt-3" style={{ borderTop: '1px solid #d0cdcc' }}>
                                    <div className="flex justify-between mb-1.5" style={{ fontFamily: "'Montserrat', sans-serif", fontSize: '9px', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                                        <span>Boot Progress</span>
                                        <span style={{ color: '#006666', fontWeight: 700 }}>{progress}%</span>
                                    </div>
                                    <div className="h-1.5 rounded-full overflow-hidden" style={{ background: '#E7E5E4', boxShadow: 'inset 2px 2px 4px #b5b3b2, inset -2px -2px 4px #ffffff' }}>
                                        <motion.div className="h-full rounded-full"
                                            style={{ background: 'linear-gradient(90deg, #004d4d, #006666)', width: `${progress}%` }}
                                            transition={{ duration: 0.2 }}
                                        />
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}



