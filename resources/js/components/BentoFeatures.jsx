import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

const NM_OUT_SM = '3px 3px 6px #b5b3b2, -3px -3px 6px #ffffff';
const NM_OUT_MD = '6px 6px 12px #b5b3b2, -6px -6px 12px #ffffff';
const NM_IN_SM = 'inset 3px 3px 6px #b5b3b2, inset -3px -3px 6px #ffffff';
const NM_IN_MD = 'inset 5px 5px 10px #b5b3b2, inset -5px -5px 10px #ffffff';
const MONTSERRAT = "'Montserrat', sans-serif";

// Mini neural network inside Digital Engine card
function NeuralMini() {
    const canvasRef = useRef(null);
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        canvas.width = canvas.offsetWidth;
        canvas.height = canvas.offsetHeight;
        const W = canvas.width, H = canvas.height;
        const nodes = [
            {x:W*.1,y:H*.25},{x:W*.1,y:H*.5},{x:W*.1,y:H*.75},
            {x:W*.35,y:H*.15},{x:W*.35,y:H*.38},{x:W*.35,y:H*.62},{x:W*.35,y:H*.85},
            {x:W*.6,y:H*.25},{x:W*.6,y:H*.5},{x:W*.6,y:H*.75},
            {x:W*.85,y:H*.35},{x:W*.85,y:H*.65},
        ];
        const conns = [[0,3],[0,4],[0,5],[1,3],[1,4],[1,5],[1,6],[2,4],[2,5],[2,6],[3,7],[3,8],[4,7],[4,8],[4,9],[5,8],[5,9],[6,8],[6,9],[7,10],[7,11],[8,10],[8,11],[9,10],[9,11]];
        const particles = conns.map(([f,t]) => ({ f, t, progress: Math.random(), speed: Math.random()*.015+.005 }));
        let t2 = 0;
        const anim = () => {
            ctx.clearRect(0,0,W,H); t2 += 0.02;
            conns.forEach(([f,to]) => {
                ctx.beginPath(); ctx.moveTo(nodes[f].x,nodes[f].y); ctx.lineTo(nodes[to].x,nodes[to].y);
                ctx.strokeStyle='rgba(0,102,102,0.12)'; ctx.lineWidth=0.5; ctx.stroke();
            });
            particles.forEach(p => {
                p.progress += p.speed; if(p.progress>1){p.progress=0;p.f=p.t;p.t=Math.floor(Math.random()*nodes.length);}
                const n1=nodes[p.f],n2=nodes[p.t];
                const px=n1.x+(n2.x-n1.x)*p.progress, py=n1.y+(n2.y-n1.y)*p.progress;
                ctx.beginPath(); ctx.arc(px,py,2,0,Math.PI*2); ctx.fillStyle='#00A63D';
                ctx.shadowColor='#00A63D'; ctx.shadowBlur=4; ctx.fill(); ctx.shadowBlur=0;
            });
            nodes.forEach((n,i) => {
                const pulse=Math.sin(t2+i*.7)*.35+.65;
                ctx.beginPath(); ctx.arc(n.x,n.y,4,0,Math.PI*2);
                ctx.fillStyle=`rgba(0,102,102,${pulse})`; ctx.shadowColor='#006666'; ctx.shadowBlur=6; ctx.fill(); ctx.shadowBlur=0;
            });
            requestAnimationFrame(anim);
        };
        anim();
    }, []);
    return <canvas ref={canvasRef} className="w-full h-full" />;
}

function ProgressBar({ label, value, color }) {
    return (
        <div style={{ marginBottom: '8px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: MONTSERRAT, fontSize: '9px', color: '#64748b', marginBottom: '4px' }}>
                <span>{label}</span><span style={{ color, fontWeight: 600 }}>{value}%</span>
            </div>
            <div style={{ height: '4px', borderRadius: '2px', overflow: 'hidden', background: 'rgba(181,179,178,0.35)' }}>
                <motion.div
                    initial={{ width: 0 }} whileInView={{ width: `${value}%` }} viewport={{ once: true }}
                    transition={{ duration: 1.2, ease: 'easeOut', delay: 0.3 }}
                    style={{ height: '100%', borderRadius: '2px', background: color }}
                />
            </div>
        </div>
    );
}

const CARDS = [
    {
        id: 'ai', title: 'Digital Inference Engine', subtitle: '50K+ ophthalmologic datasets',
        icon: (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#006666" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                <path d="M9 3v18M15 3v18M3 9h18M3 15h18" />
            </svg>
        ),
        color: '#006666', colSpan: 2, rowSpan: 2, content: 'neural'
    },
    {
        id: 'refraction', title: 'Digital Refraction Test', subtitle: 'Real-time visual acuity measurement',
        icon: (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#004d4d" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                <circle cx="12" cy="12" r="3" />
            </svg>
        ),
        color: '#004d4d', content: 'refraction'
    },
    {
        id: 'consult', title: 'Instant Telemedicine', subtitle: '120+ verified doctors 24/7',
        icon: (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#00A63D" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
            </svg>
        ),
        color: '#00A63D', content: 'doctors'
    },
    {
        id: 'detect', title: 'Early Detection', subtitle: 'Glaucoma, Cataract, Retinopathy',
        icon: (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#FE9900" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M14 22V14a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v8" />
                <path d="M12 8a4 4 0 1 0-8 0 4 4 0 0 0 8 0z" />
                <path d="M16 8h6M19 5v6" />
            </svg>
        ),
        color: '#FE9900', content: 'conditions'
    },
    {
        id: 'analytics', title: 'Medical Analytics', subtitle: 'Comprehensive reports & tracking',
        icon: (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#338080" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="20" x2="18" y2="10" />
                <line x1="12" y1="20" x2="12" y2="4" />
                <line x1="6" y1="20" x2="6" y2="14" />
            </svg>
        ),
        color: '#338080', content: 'stats'
    },
    {
        id: 'security', title: 'HIPAA Compliant', subtitle: 'End-to-end encrypted records',
        icon: (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#00A63D" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                <path d="M7 11V7a5 5 0 0 1 10 0v4" />
            </svg>
        ),
        color: '#00A63D', content: 'security'
    },
];

export default function BentoFeatures({ doctors = [] }) {
    const [hovered, setHovered] = useState(null);
    const [aiScore, setAiScore] = useState(98.7);

    useEffect(() => {
        const iv = setInterval(() => setAiScore(p => parseFloat((p + (Math.random()-.5)*.3).toFixed(1))), 2200);
        return () => clearInterval(iv);
    }, []);

    const renderContent = (card) => {
        if (card.id === 'ai') return (
            <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                <div style={{ flex: 1, minHeight: 0, borderRadius: '8px', overflow: 'hidden', marginBottom: '14px', boxShadow: NM_IN_SM }}>
                    <NeuralMini />
                </div>
                <div style={{ fontFamily: MONTSERRAT, fontSize: '8px', textTransform: 'uppercase', letterSpacing: '0.1em', color: '#006666', marginBottom: '8px', fontWeight: 700 }}>
                    Live Confidence — {aiScore}%
                </div>
                <ProgressBar label="Retina Analysis" value={98} color="#006666" />
                <ProgressBar label="Refraction Score" value={96} color="#004d4d" />
                <ProgressBar label="Pathology Detection" value={94} color="#00A63D" />
            </div>
        );
        if (card.id === 'refraction') return (
            <div style={{ marginTop: '8px' }}>
                {[{ eye: 'OD (Right)', sph: '-1.50', cyl: '-0.25', axis: '170°' }, { eye: 'OS (Left)', sph: '-1.75', cyl: '-0.50', axis: '15°' }].map((r, i) => (
                    <div key={i} style={{ padding: '10px', borderRadius: '8px', marginBottom: '8px', boxShadow: NM_IN_SM }}>
                        <div style={{ fontFamily: MONTSERRAT, fontSize: '8px', textTransform: 'uppercase', letterSpacing: '0.1em', color: '#004d4d', fontWeight: 700, marginBottom: '6px' }}>{r.eye}</div>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '4px' }}>
                            {[['SPH', r.sph], ['CYL', r.cyl], ['Axis', r.axis]].map(([l, v]) => (
                                <div key={l}>
                                    <div style={{ fontFamily: MONTSERRAT, fontSize: '8px', color: '#94a3b8' }}>{l}</div>
                                    <div style={{ fontFamily: MONTSERRAT, fontWeight: 700, fontSize: '12px', color: '#1E2938' }}>{v}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        );
        if (card.id === 'consult') {
            const activeDoctors = doctors.length > 0 ? doctors.slice(0, 2) : [
                { name: 'dr. Sari Andini, Sp.M', time: 'Respon < 5 mnt' },
                { name: 'dr. Andi Wijaya, Sp.M', time: 'Respon < 10 mnt' }
            ];
            return (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '6px' }}>
                    {activeDoctors.map((doc, i) => (
                        <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 12px', borderRadius: '8px', boxShadow: NM_IN_SM }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#00A63D' }}></span>
                                <span style={{ fontFamily: MONTSERRAT, fontSize: '10px', fontWeight: 700, color: '#1E2938' }}>{doc.name}</span>
                            </div>
                            <span style={{ fontFamily: MONTSERRAT, fontSize: '8px', color: '#64748b' }}>{doc.time}</span>
                        </div>
                    ))}
                    <div style={{ fontFamily: MONTSERRAT, fontSize: '8px', color: '#00A63D', fontWeight: 700, paddingLeft: '4px', marginTop: '2px' }}>
                        ● {doctors.length > 0 ? `${doctors.length} Dokter Terdaftar di Database` : '117 Dokter Spesialis Aktif Melayani'}
                    </div>
                </div>
            );
        }
        if (card.id === 'detect') return (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginTop: '6px' }}>
                {[['Glaukoma', 'Sensitivitas 94%'], ['Katarak', 'Sensitivitas 97%'], ['Retinopati', 'Sensitivitas 91%']].map(([c, p]) => (
                    <div key={c} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '6px 0', borderBottom: '1px solid rgba(181,179,178,0.2)' }}>
                        <span style={{ fontFamily: MONTSERRAT, fontSize: '10px', fontWeight: 700, color: '#1E2938' }}>{c}</span>
                        <span style={{ fontFamily: MONTSERRAT, fontSize: '8px', color: '#006666', fontWeight: 600 }}>{p}</span>
                    </div>
                ))}
            </div>
        );
        if (card.id === 'analytics') return (
            <div style={{ display: 'flex', flexDirection: 'column', height: '100%', marginTop: '4px' }}>
                <div style={{ flex: 1, height: '45px', display: 'flex', alignItems: 'flex-end', gap: '6px', padding: '4px 0' }}>
                    {[40, 65, 55, 85, 70, 95].map((h, i) => (
                        <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '4px', height: '100%', justifyContent: 'flex-end' }}>
                            <div style={{ height: `${h}%`, background: '#338080', borderRadius: '2px', opacity: 0.85 }} />
                        </div>
                    ))}
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: MONTSERRAT, fontSize: '7px', color: '#94a3b8', marginTop: '4px' }}>
                    <span>JAN</span>
                    <span>MAR</span>
                    <span>MEI</span>
                </div>
            </div>
        );
        if (card.id === 'security') return (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '6px' }}>
                {['AES-256 Encryption', 'ISO 27001 Certified', 'Zero-knowledge Storage'].map((f, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontFamily: MONTSERRAT, fontSize: '9px', color: '#64748b' }}>
                        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#00A63D" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
                            <polyline points="20 6 9 17 4 12" />
                        </svg>
                        <span>{f}</span>
                    </div>
                ))}
            </div>
        );
    };

    return (
        <section id="fitur" style={{ padding: '7rem 0', background: '#E7E5E4' }}>
            {/* Section Header */}
            <div style={{ maxWidth: '80rem', margin: '0 auto', padding: '0 1.5rem', marginBottom: '4rem' }}>
                <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                        <div style={{ width: '16px', height: '1px', background: '#006666' }} />
                        <span style={{ fontFamily: MONTSERRAT, fontSize: '0.625rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.15em', color: '#006666' }}>Technology Suite</span>
                    </div>
                    <h2 style={{ fontFamily: MONTSERRAT, fontWeight: 700, fontSize: 'clamp(1.75rem, 4vw, 3rem)', color: '#1E2938', letterSpacing: '-0.02em', lineHeight: 1.2, marginBottom: '12px' }}>
                        Semua yang dibutuhkan<br />
                        <span style={{ color: '#006666' }}>dalam satu platform</span>
                    </h2>
                    <p style={{ fontFamily: MONTSERRAT, fontSize: '0.9375rem', color: '#64748b', maxWidth: '500px', lineHeight: 1.7 }}>
                        End-to-end Digital-powered eye health ecosystem. Dari deteksi ke preskripsi — sepenuhnya otomatis dan tervalidasi klinis.
                    </p>
                </motion.div>
            </div>

            {/* Bento Grid */}
            <div style={{ maxWidth: '80rem', margin: '0 auto', padding: '0 1.5rem' }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', gridAutoRows: '200px' }}>
                    {CARDS.map((card, idx) => {
                        const isHovered = hovered === card.id;
                        return (
                            <motion.div
                                key={card.id}
                                initial={{ opacity: 0, y: 24 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.5, delay: idx * 0.07 }}
                                onMouseEnter={() => setHovered(card.id)}
                                onMouseLeave={() => setHovered(null)}
                                style={{
                                    gridColumn: card.colSpan === 2 ? 'span 2' : 'span 1',
                                    gridRow: card.rowSpan === 2 ? 'span 2' : 'span 1',
                                    background: '#E7E5E4',
                                    borderRadius: '16px',
                                    padding: '1.5rem',
                                    display: 'flex', flexDirection: 'column',
                                    boxShadow: isHovered ? NM_IN_MD : NM_OUT_MD,
                                    transition: 'box-shadow 200ms cubic-bezier(0.25, 0, 0, 1)',
                                    cursor: 'default',
                                    overflow: 'hidden',
                                }}
                            >
                                {/* Card header */}
                                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', marginBottom: '12px' }}>
                                    <div style={{
                                        width: '40px', height: '40px', borderRadius: '8px', flexShrink: 0,
                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        fontSize: '1.25rem',
                                        boxShadow: isHovered ? NM_IN_SM : NM_OUT_SM,
                                        transition: 'box-shadow 200ms',
                                    }}>
                                        {card.icon}
                                    </div>
                                    <div>
                                        <h3 style={{ fontFamily: MONTSERRAT, fontWeight: 700, fontSize: '0.875rem', color: '#1E2938', letterSpacing: '-0.01em' }}>{card.title}</h3>
                                        <p style={{ fontFamily: MONTSERRAT, fontSize: '0.6875rem', color: '#64748b', marginTop: '3px' }}>{card.subtitle}</p>
                                    </div>
                                </div>

                                {/* Accent bar */}
                                <div style={{ height: '2px', borderRadius: '1px', background: card.color, marginBottom: '12px', opacity: isHovered ? 1 : 0.4, transition: 'opacity 200ms', width: isHovered ? '100%' : '40%', transition: 'width 300ms ease, opacity 200ms' }} />

                                {/* Content */}
                                <div style={{ flex: 1, minHeight: 0 }}>
                                    {renderContent(card)}
                                </div>
                            </motion.div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}



