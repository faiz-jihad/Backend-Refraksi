/**
 * AdminDashboard — Production-grade React Dashboard
 * Inspired by Linear, Vercel, Stripe Dashboard aesthetics
 * 100% inline styles + embedded CSS — no Tailwind JIT dependency
 * Author: Antigravity (Staff UI Engineer)
 */

import React, { useState, useEffect, useMemo, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Users, CheckCircle, MessageSquare, Server, TrendingUp, TrendingDown,
    Sun, Moon, Search, Database, Trash2, ArrowRight, Activity, Wifi,
    RefreshCw, Eye, ShieldCheck, ChevronRight, BarChart3, Calendar,
    Zap, Clock, ArrowUpRight
} from 'lucide-react';

/* ═══════════════════════════════════════════
   DESIGN TOKENS (mirroring admin.blade.php vars)
   ═══════════════════════════════════════════ */
const light = {
    brand:          '#0d9488',
    brandLight:     'rgba(13,148,136,0.08)',
    brandBorder:    'rgba(13,148,136,0.2)',
    canvas:         '#f1f5f9',
    surface:        '#ffffff',
    surface2:       '#f8fafc',
    surfaceHover:   '#f1f5f9',
    text:           '#0f172a',
    text2:          '#334155',
    text3:          '#64748b',
    text4:          '#94a3b8',
    border:         '#e2e8f0',
    border2:        '#f1f5f9',
    shadowSm:       '0 1px 3px rgba(0,0,0,0.06), 0 1px 2px rgba(0,0,0,0.04)',
    shadowMd:       '0 4px 12px rgba(0,0,0,0.07), 0 2px 4px rgba(0,0,0,0.04)',
    chartGrid:      '#e2e8f0',
    chartDot:       '#ffffff',
    success:        '#10b981', successBg: 'rgba(16,185,129,0.08)',
    warning:        '#f59e0b', warningBg: 'rgba(245,158,11,0.08)',
    danger:         '#ef4444', dangerBg:  'rgba(239,68,68,0.08)',
    info:           '#3b82f6', infoBg:    'rgba(59,130,246,0.08)',
};

const dark = {
    brand:          '#2dd4bf',
    brandLight:     'rgba(45,212,191,0.08)',
    brandBorder:    'rgba(45,212,191,0.2)',
    canvas:         '#080e1a',
    surface:        '#111827',
    surface2:       '#0f172a',
    surfaceHover:   '#1e293b',
    text:           '#f1f5f9',
    text2:          '#cbd5e1',
    text3:          '#94a3b8',
    text4:          '#475569',
    border:         '#1e293b',
    border2:        '#0f172a',
    shadowSm:       '0 1px 3px rgba(0,0,0,0.4), 0 1px 2px rgba(0,0,0,0.3)',
    shadowMd:       '0 4px 12px rgba(0,0,0,0.5), 0 2px 4px rgba(0,0,0,0.3)',
    chartGrid:      '#1e293b',
    chartDot:       '#111827',
    success:        '#34d399', successBg: 'rgba(52,211,153,0.08)',
    warning:        '#fbbf24', warningBg: 'rgba(251,191,36,0.08)',
    danger:         '#f87171', dangerBg:  'rgba(248,113,113,0.08)',
    info:           '#60a5fa', infoBg:    'rgba(96,165,250,0.08)',
};

/* ═══════════════════════════════════════════
   PRIMITIVE COMPONENTS
   ═══════════════════════════════════════════ */

const Card = ({ children, style = {}, hover = true }) => {
    const [hovered, setHovered] = React.useState(false);
    return (
        <div
            onMouseEnter={() => hover && setHovered(true)}
            onMouseLeave={() => hover && setHovered(false)}
            style={{
                background: 'var(--ds-surface)',
                border: '1px solid var(--ds-border)',
                borderRadius: '16px',
                padding: '1.5rem',
                boxShadow: hovered ? 'var(--ds-shadow-md)' : 'var(--ds-shadow-sm)',
                transition: 'box-shadow 0.2s ease, transform 0.2s ease',
                transform: hovered ? 'translateY(-1px)' : 'translateY(0)',
                ...style,
            }}
        >
            {children}
        </div>
    );
};

const Badge = ({ children, color = 'brand', style = {} }) => {
    const colors = {
        brand:   ['var(--ds-brand-light)', 'var(--ds-brand)', 'var(--ds-brand-border)'],
        success: ['var(--ds-success-bg)', 'var(--ds-success)', 'rgba(0,0,0,0)'],
        warning: ['var(--ds-warning-bg)', 'var(--ds-warning)', 'rgba(0,0,0,0)'],
        danger:  ['var(--ds-danger-bg)', 'var(--ds-danger)', 'rgba(0,0,0,0)'],
        info:    ['var(--ds-info-bg)', 'var(--ds-info)', 'rgba(0,0,0,0)'],
    };
    const [bg, fg, bd] = colors[color] || colors.brand;
    return (
        <span style={{
            display: 'inline-flex', alignItems: 'center', gap: '0.25rem',
            padding: '0.175rem 0.6rem', borderRadius: '99px',
            fontSize: '0.68rem', fontWeight: 700, letterSpacing: '0.03em',
            background: bg, color: fg, border: `1px solid ${bd}`,
            whiteSpace: 'nowrap', ...style,
        }}>
            {children}
        </span>
    );
};

const Divider = () => (
    <div style={{ borderTop: '1px solid var(--ds-border)', margin: '1.25rem 0' }} />
);

const CardHeader = ({ title, subtitle, right }) => (
    <div style={{ marginBottom: '1.25rem', paddingBottom: '1rem', borderBottom: '1px solid var(--ds-border)', display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '1rem' }}>
        <div>
            <h3 style={{ fontSize: '0.9rem', fontWeight: 700, margin: 0, color: 'var(--ds-text)' }}>{title}</h3>
            {subtitle && <p style={{ fontSize: '0.75rem', color: 'var(--ds-text3)', margin: '0.2rem 0 0' }}>{subtitle}</p>}
        </div>
        {right && <div style={{ flexShrink: 0 }}>{right}</div>}
    </div>
);

const SearchInput = ({ value, onChange, placeholder = 'Cari...' }) => (
    <div style={{ position: 'relative', width: '100%' }}>
        <Search size={14} style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--ds-text4)', pointerEvents: 'none' }} />
        <input
            value={value}
            onChange={e => onChange(e.target.value)}
            placeholder={placeholder}
            style={{
                width: '100%', paddingLeft: '2.25rem', paddingRight: '0.75rem', paddingTop: '0.5rem', paddingBottom: '0.5rem',
                borderRadius: '8px', border: '1px solid var(--ds-border)', background: 'var(--ds-surface2)',
                color: 'var(--ds-text)', fontSize: '0.8rem', fontFamily: 'inherit', outline: 'none',
                transition: 'border-color 0.15s, box-shadow 0.15s',
            }}
            onFocus={e => { e.target.style.borderColor = 'var(--ds-brand)'; e.target.style.boxShadow = '0 0 0 3px var(--ds-brand-light)'; }}
            onBlur={e => { e.target.style.borderColor = 'var(--ds-border)'; e.target.style.boxShadow = 'none'; }}
        />
    </div>
);

const EmptyState = ({ message }) => (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '3rem 1rem', color: 'var(--ds-text4)', gap: '0.5rem' }}>
        <Search size={28} style={{ opacity: 0.4 }} />
        <p style={{ fontSize: '0.845rem', margin: 0 }}>{message}</p>
    </div>
);

/* ═══════════════════════════════════════════
   STAT CARD
   ═══════════════════════════════════════════ */
const StatCard = ({ label, value, icon, color, bg, trend, trendLabel, ping }) => {
    const [hov, setHov] = React.useState(false);
    return (
        <motion.div
            whileHover={{ y: -2 }}
            onMouseEnter={() => setHov(true)}
            onMouseLeave={() => setHov(false)}
            style={{
                background: 'var(--ds-surface)',
                border: '1px solid var(--ds-border)',
                borderRadius: '16px',
                padding: '1.375rem 1.5rem',
                boxShadow: hov ? 'var(--ds-shadow-md)' : 'var(--ds-shadow-sm)',
                transition: 'box-shadow 0.2s',
                display: 'flex',
                flexDirection: 'column',
                minHeight: '140px',
            }}
        >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                <div style={{ padding: '0.625rem', borderRadius: '10px', background: bg, color, display: 'inline-flex' }}>
                    {icon}
                </div>
                {ping && (
                    <span style={{ position: 'relative', display: 'flex', width: '10px', height: '10px', marginTop: '4px' }}>
                        <span style={{ position: 'absolute', inset: 0, borderRadius: '50%', background: '#10b981', opacity: 0.5, animation: 'adm-ping 1.5s ease-in-out infinite' }} />
                        <span style={{ position: 'relative', width: '100%', height: '100%', borderRadius: '50%', background: '#10b981', display: 'block' }} />
                    </span>
                )}
            </div>
            <p style={{ fontSize: '0.68rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--ds-text3)', margin: '0 0 0.3rem' }}>{label}</p>
            <p style={{ fontSize: '2rem', fontWeight: 800, letterSpacing: '-0.04em', color: 'var(--ds-text)', margin: 0, lineHeight: 1.1 }}>
                {typeof value === 'number' ? value.toLocaleString('id-ID') : value}
            </p>
            <div style={{ marginTop: 'auto', paddingTop: '0.875rem', borderTop: '1px solid var(--ds-border)', display: 'flex', alignItems: 'center', gap: '0.375rem', fontSize: '0.72rem', fontWeight: 600 }}>
                <TrendingUp size={12} color={color} />
                <span style={{ color }}>{trend}</span>
                <span style={{ color: 'var(--ds-text3)' }}>{trendLabel}</span>
            </div>
        </motion.div>
    );
};

/* ═══════════════════════════════════════════
   SVG LINE CHART (custom, no recharts)
   ═══════════════════════════════════════════ */
const LineChart = ({ chartData }) => {
    const [tooltip, setTooltip] = useState(null);
    const W = 500, H = 180, PX = 28, PY = 20;

    const pts = useMemo(() => {
        if (!chartData?.data?.length || chartData.data.length < 2) return [];
        const max = Math.max(...chartData.data, 1);
        return chartData.data.map((v, i) => ({
            x: PX + (i / (chartData.data.length - 1)) * (W - PX * 2),
            y: PY + (1 - v / max) * (H - PY * 2),
            v,
            label: chartData.labels?.[i] ?? `D${i + 1}`,
        }));
    }, [chartData]);

    const line = pts.reduce((a, p, i) => i === 0 ? `M${p.x.toFixed(1)} ${p.y.toFixed(1)}` : `${a} L${p.x.toFixed(1)} ${p.y.toFixed(1)}`, '');
    const area = pts.length > 1 ? `${line} L${pts[pts.length-1].x} ${H-PY} L${pts[0].x} ${H-PY} Z` : '';

    if (!pts.length) return (
        <div style={{ height: '180px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--ds-text4)', fontSize: '0.845rem' }}>
            Belum ada data chart
        </div>
    );

    return (
        <div style={{ position: 'relative', width: '100%', height: '180px' }}>
            <svg
                viewBox={`0 0 ${W} ${H}`}
                preserveAspectRatio="xMidYMid meet"
                style={{ width: '100%', height: '100%', overflow: 'visible' }}
            >
                <defs>
                    <linearGradient id="adm-grad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="var(--ds-brand)" stopOpacity="0.18" />
                        <stop offset="100%" stopColor="var(--ds-brand)" stopOpacity="0" />
                    </linearGradient>
                </defs>

                {/* Horizontal grid lines */}
                {[0, 0.25, 0.5, 0.75, 1].map((r, i) => (
                    <line
                        key={i}
                        x1={PX} y1={PY + r * (H - PY * 2)}
                        x2={W - PX} y2={PY + r * (H - PY * 2)}
                        stroke="var(--ds-chart-grid)" strokeWidth={1} strokeDasharray="3 4"
                    />
                ))}

                {/* Area fill */}
                {area && (
                    <motion.path
                        d={area}
                        fill="url(#adm-grad)"
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                        transition={{ duration: 0.8 }}
                    />
                )}

                {/* Line */}
                {line && (
                    <motion.path
                        d={line}
                        fill="none"
                        stroke="var(--ds-brand)"
                        strokeWidth={2.5}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        initial={{ pathLength: 0 }}
                        animate={{ pathLength: 1 }}
                        transition={{ duration: 1.6, ease: 'easeInOut' }}
                    />
                )}

                {/* Dots */}
                {pts.map((pt, i) => (
                    <g key={i}>
                        <circle
                            cx={pt.x} cy={pt.y} r={18}
                            fill="transparent"
                            style={{ cursor: 'pointer' }}
                            onMouseEnter={() => setTooltip(pt)}
                            onMouseLeave={() => setTooltip(null)}
                        />
                        <circle
                            cx={pt.x} cy={pt.y} r={tooltip?.x === pt.x ? 6 : 4}
                            fill="var(--ds-chart-dot)"
                            stroke="var(--ds-brand)"
                            strokeWidth={2.5}
                            style={{ transition: 'r 0.15s', pointerEvents: 'none' }}
                        />
                    </g>
                ))}
            </svg>

            {/* Tooltip */}
            <AnimatePresence>
                {tooltip && (
                    <motion.div
                        initial={{ opacity: 0, y: 6, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        transition={{ duration: 0.12 }}
                        style={{
                            position: 'absolute',
                            left: `${(tooltip.x / W) * 100}%`,
                            top: `${(tooltip.y / H) * 100}%`,
                            transform: 'translate(-50%, -120%)',
                            background: '#0f172a',
                            color: '#fff',
                            padding: '0.5rem 0.875rem',
                            borderRadius: '10px',
                            fontSize: '0.75rem',
                            pointerEvents: 'none',
                            boxShadow: '0 8px 24px rgba(0,0,0,0.4)',
                            whiteSpace: 'nowrap',
                            zIndex: 10,
                        }}
                    >
                        <p style={{ margin: 0, fontWeight: 700, fontSize: '0.7rem', opacity: 0.7 }}>{tooltip.label}</p>
                        <p style={{ margin: '0.1rem 0 0', color: '#2dd4bf', fontWeight: 800 }}>{tooltip.v} Pemeriksaan</p>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

/* ═══════════════════════════════════════════
   HEALTH ITEM
   ═══════════════════════════════════════════ */
const HealthItem = ({ name, sub, icon, color, bg }) => (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.875rem', borderRadius: '12px', border: '1px solid var(--ds-border)', background: 'var(--ds-surface2)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{ padding: '0.5rem', borderRadius: '8px', background: bg, color, display: 'flex', flexShrink: 0 }}>{icon}</div>
            <div>
                <p style={{ fontSize: '0.845rem', fontWeight: 600, margin: 0, color: 'var(--ds-text)' }}>{name}</p>
                <p style={{ fontSize: '0.7rem', color: 'var(--ds-text3)', margin: 0 }}>{sub}</p>
            </div>
        </div>
        <Badge color="success">Online</Badge>
    </div>
);

/* ═══════════════════════════════════════════
   LIST ITEM
   ═══════════════════════════════════════════ */
const ResultItem = ({ name, date, acuity }) => (
    <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, height: 0 }}
        style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.75rem 1rem', borderRadius: '10px', border: '1px solid var(--ds-border)', background: 'var(--ds-surface2)', gap: '0.75rem', flexWrap: 'wrap' }}
    >
        <div>
            <p style={{ fontSize: '0.845rem', fontWeight: 600, margin: 0, color: 'var(--ds-text)' }}>{name}</p>
            <p style={{ fontSize: '0.7rem', color: 'var(--ds-text3)', margin: '0.1rem 0 0', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                <Clock size={11} /> {date}
            </p>
        </div>
        <Badge color="brand">{acuity}</Badge>
    </motion.div>
);

const ChatItem = ({ name, date, id, routes }) => (
    <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, height: 0 }}
        style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.75rem 1rem', borderRadius: '10px', border: '1px solid var(--ds-border)', background: 'var(--ds-surface2)', gap: '0.75rem', flexWrap: 'wrap' }}
    >
        <div>
            <p style={{ fontSize: '0.845rem', fontWeight: 600, margin: 0, color: 'var(--ds-text)' }}>{name}</p>
            <p style={{ fontSize: '0.7rem', color: 'var(--ds-text3)', margin: '0.1rem 0 0', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                <MessageSquare size={11} /> {date}
            </p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Badge color="warning">Aktif</Badge>
            <a
                href={routes?.chatsShow?.replace(':id', id)}
                style={{ padding: '0.35rem', borderRadius: '7px', border: '1px solid var(--ds-border)', background: 'var(--ds-surface)', color: 'var(--ds-text3)', display: 'flex', transition: 'all 0.15s' }}
                onMouseEnter={e => { e.currentTarget.style.background = 'var(--ds-brand-light)'; e.currentTarget.style.color = 'var(--ds-brand)'; }}
                onMouseLeave={e => { e.currentTarget.style.background = 'var(--ds-surface)'; e.currentTarget.style.color = 'var(--ds-text3)'; }}
            >
                <Eye size={14} />
            </a>
        </div>
    </motion.div>
);

/* ═══════════════════════════════════════════
   TOP USER PROGRESS BAR
   ═══════════════════════════════════════════ */
const UserBar = ({ rank, name, count, pct, delay }) => (
    <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <span style={{
                    width: '22px', height: '22px', borderRadius: '50%',
                    background: rank <= 3 ? 'var(--ds-brand-light)' : 'var(--ds-surface2)',
                    border: `1px solid ${rank <= 3 ? 'var(--ds-brand-border)' : 'var(--ds-border)'}`,
                    color: rank <= 3 ? 'var(--ds-brand)' : 'var(--ds-text3)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '0.65rem', fontWeight: 800, flexShrink: 0,
                }}>
                    {rank}
                </span>
                <span style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--ds-text)' }}>{name}</span>
            </div>
            <span style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--ds-brand)' }}>{count.toLocaleString('id-ID')} ×</span>
        </div>
        <div style={{ height: '7px', borderRadius: '99px', background: 'var(--ds-surface2)', border: '1px solid var(--ds-border)', overflow: 'hidden' }}>
            <motion.div
                style={{
                    height: '100%', borderRadius: '99px',
                    background: 'linear-gradient(90deg, #2dd4bf 0%, #0d9488 100%)',
                    position: 'relative', overflow: 'hidden',
                }}
                initial={{ width: 0 }}
                animate={{ width: `${pct}%` }}
                transition={{ duration: 1.1, delay, type: 'spring', stiffness: 70 }}
            >
                <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)', animation: 'adm-shimmer 2s linear infinite' }} />
            </motion.div>
        </div>
    </div>
);

/* ═══════════════════════════════════════════
   MAIN DASHBOARD COMPONENT
   ═══════════════════════════════════════════ */
export default function AdminDashboard({ stats: s0, recentResults: rr0, recentChats: rc0, topUsers: tu0, chartData: cd0, routes }) {

    /* State */
    const [isDark, setIsDark] = useState(() => localStorage.getItem('admin-dark-mode') === 'true');
    const [stats, setStats] = useState(s0 || { total_users: 0, total_results: 0, total_chats: 0, total_hospitals: 0 });
    const [recentResults, setRecentResults] = useState(rr0 || []);
    const [recentChats, setRecentChats]     = useState(rc0 || []);
    const [topUsers, setTopUsers]           = useState(tu0 || []);
    const [chartData, setChartData]         = useState(cd0 || { data: [], labels: [] });
    const [live, setLive]                   = useState(false);
    const [qResult, setQResult]             = useState('');
    const [qChat, setQChat]                 = useState('');
    const [cacheStatus, setCacheStatus]     = useState(null); // null | 'loading' | 'done'
    const [cachePct, setCachePct]           = useState(0);

    /* Theme sync */
    useEffect(() => {
        localStorage.setItem('admin-dark-mode', isDark);
        const tok = isDark ? dark : light;
        const root = document.documentElement;

        // Sync CSS vars to match admin.blade.php design tokens
        root.setAttribute('data-theme', isDark ? 'dark' : '');
        if (!isDark) root.removeAttribute('data-theme');

        // Push our own vars for isolation
        const el = document.getElementById('adm-vars') || (() => {
            const s = document.createElement('style');
            s.id = 'adm-vars';
            document.head.appendChild(s);
            return s;
        })();

        el.textContent = `
            :root {
                --ds-brand:       ${tok.brand};
                --ds-brand-light: ${tok.brandLight};
                --ds-brand-border:${tok.brandBorder};
                --ds-canvas:      ${tok.canvas};
                --ds-surface:     ${tok.surface};
                --ds-surface2:    ${tok.surface2};
                --ds-surface-hover:${tok.surfaceHover};
                --ds-text:        ${tok.text};
                --ds-text2:       ${tok.text2};
                --ds-text3:       ${tok.text3};
                --ds-text4:       ${tok.text4};
                --ds-border:      ${tok.border};
                --ds-border2:     ${tok.border2};
                --ds-shadow-sm:   ${tok.shadowSm};
                --ds-shadow-md:   ${tok.shadowMd};
                --ds-chart-grid:  ${tok.chartGrid};
                --ds-chart-dot:   ${tok.chartDot};
                --ds-success:     ${tok.success};  --ds-success-bg: ${tok.successBg};
                --ds-warning:     ${tok.warning};  --ds-warning-bg: ${tok.warningBg};
                --ds-danger:      ${tok.danger};   --ds-danger-bg:  ${tok.dangerBg};
                --ds-info:        ${tok.info};     --ds-info-bg:    ${tok.infoBg};
            }
        `;
    }, [isDark]);

    /* Live telemetry */
    useEffect(() => {
        if (!live) return;
        const names    = ['Farhan M.', 'Rina Marlina', 'Dodi K.', 'Aisyah P.', 'Taufik H.', 'Mega U.', 'Budi S.'];
        const acuities = ['20/20 Normal', '20/40 Ringan', '20/60 Minus', '20/100 Berat', '20/50 Silinder'];
        const iv = setInterval(() => {
            setStats(p => ({
                ...p,
                total_users:   p.total_users   + (Math.random() > 0.75 ? 1 : 0),
                total_results: p.total_results + 1,
                total_chats:   p.total_chats   + (Math.random() > 0.55 ? 1 : 0),
            }));
            const newRes = {
                id: Date.now(),
                user: { name: names[~~(Math.random() * names.length)] },
                visual_acuity: acuities[~~(Math.random() * acuities.length)],
                _live: true,
            };
            setRecentResults(p => [newRes, ...p.slice(0, 6)]);
            if (Math.random() > 0.5) {
                setRecentChats(p => [{
                    id: Date.now() + 1,
                    user: { name: names[~~(Math.random() * names.length)] },
                    _live: true,
                }, ...p.slice(0, 6)]);
            }
            setChartData(p => {
                const d = [...(p.data || [])];
                if (d.length) d[d.length - 1]++;
                return { ...p, data: d };
            });
        }, 3500);
        return () => clearInterval(iv);
    }, [live]);

    /* Clear cache */
    const clearCache = async () => {
        setCacheStatus('loading'); setCachePct(0);
        const iv = setInterval(() => setCachePct(p => p >= 95 ? 95 : p + 8), 150);
        try {
            const csrf = document.querySelector('meta[name="csrf-token"]')?.content;
            await fetch(routes?.clearCache, { method: 'POST', headers: { 'Content-Type': 'application/json', 'X-CSRF-TOKEN': csrf } });
        } catch (_) {}
        setTimeout(() => { clearInterval(iv); setCachePct(100); setCacheStatus('done'); setTimeout(() => setCacheStatus(null), 2500); }, 1500);
    };

    /* Filters */
    const filteredResults = useMemo(() =>
        (recentResults || []).filter(r =>
            (r.user?.name || '').toLowerCase().includes(qResult.toLowerCase()) ||
            (r.visual_acuity || '').toLowerCase().includes(qResult.toLowerCase())
        ), [recentResults, qResult]);

    const filteredChats = useMemo(() =>
        (recentChats || []).filter(c =>
            (c.user?.name || '').toLowerCase().includes(qChat.toLowerCase())
        ), [recentChats, qChat]);

    /* Top users max */
    const tuMax = useMemo(() => Math.max(...(topUsers || []).map(u => Number(u.total_checks)), 1), [topUsers]);

    /* Stat cards config */
    const statCards = [
        {
            label: 'Total Pengguna',
            value: stats.total_users,
            icon: <Users size={18} />,
            color: '#10b981', bg: 'rgba(16,185,129,0.1)',
            trend: '+12.5%', trendLabel: 'vs bulan lalu',
        },
        {
            label: 'Hasil Periksa',
            value: stats.total_results,
            icon: <CheckCircle size={18} />,
            color: '#f59e0b', bg: 'rgba(245,158,11,0.1)',
            trend: '98.2%', trendLabel: 'akurasi',
        },
        {
            label: 'Sesi Chat AI',
            value: stats.total_chats,
            icon: <MessageSquare size={18} />,
            color: '#3b82f6', bg: 'rgba(59,130,246,0.1)',
            trend: `${stats.total_hospitals || 0}`, trendLabel: 'RS rujukan',
        },
        {
            label: 'Status Sistem',
            value: 'Online',
            icon: <Server size={18} />,
            color: '#0d9488', bg: 'rgba(13,148,136,0.1)',
            trend: 'v1.5 Flash', trendLabel: 'aktif', ping: true,
        },
    ];

    /* ─── RENDER ─── */
    return (
        <div style={{ fontFamily: "Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif", color: 'var(--ds-text)', paddingBottom: '2rem' }}>

            {/* ┌─────────────────────────────────┐
                │  PAGE HEADER                    │
                └─────────────────────────────────┘ */}
            <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'flex-start', justifyContent: 'space-between', gap: '1rem', marginBottom: '2rem' }}>
                <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.75rem', color: 'var(--ds-text3)', marginBottom: '0.5rem' }}>
                        <span>Admin</span>
                        <ChevronRight size={13} style={{ opacity: 0.5 }} />
                        <span style={{ color: 'var(--ds-brand)', fontWeight: 600 }}>Dashboard</span>
                    </div>
                    <h1 style={{ fontSize: '1.75rem', fontWeight: 800, letterSpacing: '-0.035em', margin: 0, lineHeight: 1.15 }}>
                        Panel Kendali
                    </h1>
                    <p style={{ fontSize: '0.875rem', color: 'var(--ds-text3)', margin: '0.35rem 0 0' }}>
                        Pantau aktivitas & data MataCeria secara real-time.
                    </p>
                </div>

                {/* Controls */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', flexWrap: 'wrap' }}>
                    {/* Live toggle */}
                    <button
                        onClick={() => setLive(v => !v)}
                        style={{
                            display: 'flex', alignItems: 'center', gap: '0.5rem',
                            padding: '0.55rem 1rem', borderRadius: '99px',
                            border: `1px solid ${live ? 'var(--ds-brand-border)' : 'var(--ds-border)'}`,
                            background: live ? 'var(--ds-brand-light)' : 'var(--ds-surface)',
                            color: live ? 'var(--ds-brand)' : 'var(--ds-text3)',
                            fontFamily: 'inherit', fontSize: '0.78rem', fontWeight: 700,
                            cursor: 'pointer', transition: 'all 0.2s',
                        }}
                    >
                        <Wifi size={13} style={live ? { animation: 'adm-pulse 2s infinite' } : {}} />
                        <span>{live ? 'Live: Aktif' : 'Simulasi Live'}</span>
                        {live && <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--ds-brand)', animation: 'adm-ping 1.5s infinite' }} />}
                    </button>

                    {/* Dark mode */}
                    <button
                        onClick={() => setIsDark(v => !v)}
                        style={{
                            width: '36px', height: '36px', borderRadius: '8px',
                            border: '1px solid var(--ds-border)', background: 'var(--ds-surface)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            cursor: 'pointer', color: 'var(--ds-text3)', transition: 'all 0.2s',
                        }}
                        title={isDark ? 'Mode Terang' : 'Mode Gelap'}
                    >
                        {isDark ? <Sun size={16} color="#f59e0b" /> : <Moon size={16} />}
                    </button>
                </div>
            </div>

            {/* ┌─────────────────────────────────┐
                │  STAT CARDS — grid 1/2/4 col    │
                └─────────────────────────────────┘ */}
            <div className="adm-cards-grid" style={{ marginBottom: '1.5rem' }}>
                {statCards.map((c, i) => (
                    <StatCard key={i} {...c} />
                ))}
            </div>

            {/* ┌─────────────────────────────────┐
                │  CHART  8col  |  HEALTH  4col   │
                └─────────────────────────────────┘ */}
            <div className="adm-main-grid" style={{ marginBottom: '1.5rem' }}>

                {/* Chart card */}
                <Card style={{ display: 'flex', flexDirection: 'column', gridColumn: 'span 8' }}>
                    <CardHeader
                        title="Tren Pemeriksaan Mata"
                        subtitle="7 hari terakhir — pemindaian digital refraksi"
                        right={<Badge color="brand">Live Chart</Badge>}
                    />
                    {/* Fixed height chart container — prevents ResponsiveContainer overflow issues */}
                    <div style={{ height: '180px', width: '100%', flexShrink: 0 }}>
                        <LineChart chartData={chartData} />
                    </div>
                    {/* X-axis labels */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '0.875rem', paddingTop: '0.75rem', borderTop: '1px solid var(--ds-border)' }}>
                        {(chartData.labels || []).map((l, i) => (
                            <span key={i} style={{ fontSize: '0.65rem', fontWeight: 700, color: 'var(--ds-text4)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{l}</span>
                        ))}
                    </div>
                </Card>

                {/* Health card */}
                <Card style={{ display: 'flex', flexDirection: 'column', gridColumn: 'span 4' }}>
                    <CardHeader
                        title="Kesehatan Sistem"
                        subtitle="Status layanan & server"
                    />
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.625rem', flexGrow: 1 }}>
                        <HealthItem name="Server API" sub="Respon stabil" icon={<Wifi size={15} />} color="#10b981" bg="rgba(16,185,129,0.1)" />
                        <HealthItem name="Gemini AI"  sub="~450ms latensi" icon={<Activity size={15} />} color="#3b82f6" bg="rgba(59,130,246,0.1)" />
                        <HealthItem name="Database"   sub="24% kapasitas" icon={<Database size={15} />} color="#0d9488" bg="rgba(13,148,136,0.1)" />
                    </div>
                    <Divider />
                    <button
                        onClick={clearCache}
                        disabled={cacheStatus === 'loading'}
                        style={{
                            width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem',
                            padding: '0.75rem', borderRadius: '10px', border: 'none',
                            background: cacheStatus === 'done' ? 'rgba(16,185,129,0.1)' : '#0d9488',
                            color: cacheStatus === 'done' ? '#10b981' : '#fff',
                            fontFamily: 'inherit', fontSize: '0.845rem', fontWeight: 700,
                            cursor: cacheStatus === 'loading' ? 'not-allowed' : 'pointer',
                            opacity: cacheStatus === 'loading' ? 0.75 : 1,
                            transition: 'all 0.2s',
                        }}
                    >
                        {cacheStatus === 'loading' && <><RefreshCw size={15} style={{ animation: 'adm-spin 1s linear infinite' }} /><span>Memproses ({cachePct}%)</span></>}
                        {cacheStatus === 'done'    && <><ShieldCheck size={15} /><span>Cache Dibersihkan!</span></>}
                        {!cacheStatus              && <><Trash2 size={15} /><span>Bersihkan Cache</span></>}
                    </button>
                </Card>
            </div>

            {/* ┌─────────────────────────────────┐
                │  RESULTS 6col | CHATS 6col      │
                └─────────────────────────────────┘ */}
            <div className="adm-half-grid" style={{ marginBottom: '1.5rem' }}>

                {/* Recent Results */}
                <Card style={{ display: 'flex', flexDirection: 'column' }}>
                    <CardHeader
                        title="Pemeriksaan Terkini"
                        subtitle="Hasil refraksi pengguna aktif"
                        right={
                            <div style={{ width: '160px' }}>
                                <SearchInput value={qResult} onChange={setQResult} placeholder="Cari pasien..." />
                            </div>
                        }
                    />
                    {/* Fixed scroll area — never overflows card */}
                    <div style={{ overflowY: 'auto', maxHeight: '320px', display: 'flex', flexDirection: 'column', gap: '0.5rem', flexGrow: 1 }}>
                        <AnimatePresence initial={false}>
                            {filteredResults.length > 0
                                ? filteredResults.map(r => (
                                    <ResultItem
                                        key={r.id}
                                        name={r.user?.name || 'Guest'}
                                        date={r._live ? 'Baru saja' : (r.created_at ? 'Terekam' : '—')}
                                        acuity={r.visual_acuity || '—'}
                                    />
                                ))
                                : <EmptyState message="Tidak ada hasil ditemukan." />
                            }
                        </AnimatePresence>
                    </div>
                    <a
                        href={routes?.resultsIndex}
                        style={{ display: 'inline-flex', alignItems: 'center', gap: '0.375rem', marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid var(--ds-border)', fontSize: '0.78rem', fontWeight: 700, color: 'var(--ds-brand)' }}
                        onMouseEnter={e => e.currentTarget.style.opacity = '0.7'}
                        onMouseLeave={e => e.currentTarget.style.opacity = '1'}
                    >
                        <span>Lihat Semua Hasil</span>
                        <ArrowRight size={13} />
                    </a>
                </Card>

                {/* Recent Chats */}
                <Card style={{ display: 'flex', flexDirection: 'column' }}>
                    <CardHeader
                        title="Sesi Chat Konsultasi"
                        subtitle="Interaksi pasien dengan AI"
                        right={
                            <div style={{ width: '160px' }}>
                                <SearchInput value={qChat} onChange={setQChat} placeholder="Cari sesi..." />
                            </div>
                        }
                    />
                    <div style={{ overflowY: 'auto', maxHeight: '320px', display: 'flex', flexDirection: 'column', gap: '0.5rem', flexGrow: 1 }}>
                        <AnimatePresence initial={false}>
                            {filteredChats.length > 0
                                ? filteredChats.map(c => (
                                    <ChatItem
                                        key={c.id}
                                        name={c.user?.name || 'Guest'}
                                        date={c._live ? 'Baru saja' : 'Sesi Aktif'}
                                        id={c.id}
                                        routes={routes}
                                    />
                                ))
                                : <EmptyState message="Tidak ada sesi ditemukan." />
                            }
                        </AnimatePresence>
                    </div>
                    <a
                        href={routes?.chatsIndex}
                        style={{ display: 'inline-flex', alignItems: 'center', gap: '0.375rem', marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid var(--ds-border)', fontSize: '0.78rem', fontWeight: 700, color: '#f59e0b' }}
                        onMouseEnter={e => e.currentTarget.style.opacity = '0.7'}
                        onMouseLeave={e => e.currentTarget.style.opacity = '1'}
                    >
                        <span>Lihat Semua Sesi</span>
                        <ArrowRight size={13} />
                    </a>
                </Card>
            </div>

            {/* ┌─────────────────────────────────┐
                │  TOP ACTIVE USERS — full width  │
                └─────────────────────────────────┘ */}
            <Card>
                <CardHeader
                    title="Top 5 Pengguna Teraktif"
                    subtitle="Kontribusi pemeriksaan mata"
                    right={<Badge color="brand"><BarChart3 size={11} style={{ marginRight: '0.25rem' }} />Statistik</Badge>}
                />
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.375rem' }}>
                    {(topUsers || []).map((u, i) => (
                        <UserBar
                            key={i}
                            rank={i + 1}
                            name={u.name}
                            count={Number(u.total_checks)}
                            pct={(Number(u.total_checks) / tuMax) * 100}
                            delay={i * 0.08}
                        />
                    ))}
                    {!topUsers?.length && <EmptyState message="Belum ada data pengguna." />}
                </div>
            </Card>

            {/* ─── GLOBAL CSS (keyframes + responsive grids) ─── */}
            <style>{`
                /* Animations */
                @keyframes adm-spin    { to { transform: rotate(360deg); } }
                @keyframes adm-pulse   { 0%,100%{opacity:1} 50%{opacity:.4} }
                @keyframes adm-ping    { 75%,100%{transform:scale(2.2);opacity:0} }
                @keyframes adm-shimmer { 0%{transform:translateX(-100%)} 100%{transform:translateX(100%)} }

                /* Stat cards: 1 col mobile, 2 tablet, 4 desktop */
                .adm-cards-grid {
                    display: grid;
                    grid-template-columns: 1fr;
                    gap: 1rem;
                }
                @media (min-width: 640px)  { .adm-cards-grid { grid-template-columns: repeat(2, 1fr); } }
                @media (min-width: 1280px) { .adm-cards-grid { grid-template-columns: repeat(4, 1fr); gap: 1.25rem; } }

                /* Chart+Health: 12-col grid → 8+4 on xl */
                .adm-main-grid {
                    display: grid;
                    grid-template-columns: 1fr;
                    gap: 1.5rem;
                }
                @media (min-width: 1024px) {
                    .adm-main-grid {
                        grid-template-columns: repeat(12, 1fr);
                    }
                    .adm-main-grid > *:nth-child(1) { grid-column: span 8; }
                    .adm-main-grid > *:nth-child(2) { grid-column: span 4; }
                }

                /* Results+Chats: 50/50 on md+ */
                .adm-half-grid {
                    display: grid;
                    grid-template-columns: 1fr;
                    gap: 1.5rem;
                }
                @media (min-width: 768px) {
                    .adm-half-grid { grid-template-columns: 1fr 1fr; }
                }

                /* Scrollbar */
                .adm-scroll::-webkit-scrollbar { width: 5px; }
                .adm-scroll::-webkit-scrollbar-track { background: transparent; }
                .adm-scroll::-webkit-scrollbar-thumb { background: var(--ds-border); border-radius: 99px; }
            `}</style>
        </div>
    );
}
