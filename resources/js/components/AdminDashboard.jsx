import React, { useState, useEffect, useMemo, useRef } from 'react';
import { motion, AnimatePresence, Reorder } from 'framer-motion';
import { 
    Users, CheckCircle, MessageSquare, Server, TrendingUp, Sun, Moon, 
    Search, Database, Trash2, Play, ArrowRight, HelpCircle, Activity, 
    Wifi, AlertCircle, Calendar, RefreshCw, Eye, Download, ShieldCheck
} from 'lucide-react';

export default function AdminDashboard({ stats: initialStats, recentResults: initialResults, recentChats: initialChats, topUsers: initialTopUsers, chartData: initialChartData, routes }) {
    // Styling & Theme states
    const [isDarkMode, setIsDarkMode] = useState(() => {
        return localStorage.getItem('admin-dark-mode') === 'true';
    });

    // Data States
    const [stats, setStats] = useState(initialStats);
    const [recentResults, setRecentResults] = useState(initialResults);
    const [recentChats, setRecentChats] = useState(initialChats);
    const [topUsers, setTopUsers] = useState(initialTopUsers);
    const [chartData, setChartData] = useState(initialChartData);

    // Order of stat cards
    const [cardOrder, setCardOrder] = useState(['users', 'results', 'chats', 'system']);

    // Live telemetry simulation toggle
    const [isTelemetryActive, setIsTelemetryActive] = useState(false);

    // Search query states
    const [resultSearch, setResultSearch] = useState('');
    const [chatSearch, setChatSearch] = useState('');

    // Quick Action States
    const [actionStatus, setActionStatus] = useState(null); // null | 'clearing_cache' | 'cleared' | 'backing_up' | 'backed_up'
    const [actionProgress, setActionProgress] = useState(0);

    // Active chart tooltip state
    const [lineTooltip, setLineTooltip] = useState(null); // { x, y, value, label }
    const [barTooltip, setBarTooltip] = useState(null); // { x, y, name, checks }

    // Toggle theme handler
    const toggleTheme = () => {
        setIsDarkMode((prev) => {
            const nextMode = !prev;
            localStorage.setItem('admin-dark-mode', String(nextMode));
            return nextMode;
        });
    };

    // Theme values (Neumorphic)
    const theme = useMemo(() => {
        if (isDarkMode) {
            return {
                bgCanvas: 'bg-[#181E29]',
                bgSurface: '#181E29',
                bgSurfaceHover: '#131821',
                bgSubtle: '#0f131a',
                textPrimary: 'text-slate-100',
                textSecondary: 'text-slate-400',
                textMuted: 'text-slate-500',
                borderLight: 'border-[#252E3F]/30',
                shadowOutSm: '2px 2px 5px #0a0d13, -2px -2px 5px #262f41',
                shadowOutMd: '5px 5px 10px #0a0d13, -5px -5px 10px #262f41',
                shadowOutLg: '10px 10px 20px #0a0d13, -10px -10px 20px #262f41',
                shadowInSm: 'inset 2px 2px 5px #0a0d13, inset -2px -2px 5px #262f41',
                shadowInMd: 'inset 5px 5px 10px #0a0d13, inset -5px -5px 10px #262f41',
                brandColor: '#20b2aa',
                brandBg: 'bg-[#20b2aa]/10',
                chartGridColor: '#252E3F',
                inputBg: 'bg-[#131821]',
                cardBg: 'bg-[#181E29]'
            };
        } else {
            return {
                bgCanvas: 'bg-[#E7E5E4]',
                bgSurface: '#E7E5E4',
                bgSurfaceHover: '#dfdcdb',
                bgSubtle: '#d7d4d3',
                textPrimary: 'text-[#1E2938]',
                textSecondary: 'text-slate-700',
                textMuted: 'text-slate-500',
                borderLight: 'border-transparent',
                shadowOutSm: '2px 2px 5px #b5b3b2, -2px -2px 5px #ffffff',
                shadowOutMd: '5px 5px 10px #b5b3b2, -5px -5px 10px #ffffff',
                shadowOutLg: '10px 10px 20px #b5b3b2, -10px -10px 20px #ffffff',
                shadowInSm: 'inset 2px 2px 5px #b5b3b2, inset -2px -2px 5px #ffffff',
                shadowInMd: 'inset 5px 5px 10px #b5b3b2, inset -5px -5px 10px #ffffff',
                brandColor: '#006666',
                brandBg: 'bg-[#e6f2f2]',
                chartGridColor: '#ede8de',
                inputBg: 'bg-[#E7E5E4]',
                cardBg: 'bg-[#E7E5E4]'
            };
        }
    }, [isDarkMode]);

    // Apply dark mode to layout body using global data attribute
    useEffect(() => {
        if (isDarkMode) {
            document.documentElement.setAttribute('data-theme', 'dark');
        } else {
            document.documentElement.removeAttribute('data-theme');
        }
    }, [isDarkMode]);

    // Live Telemetry Feed Simulation Loop
    useEffect(() => {
        if (!isTelemetryActive) return;

        const dummyNames = ['Farhan', 'Rina Marlina', 'Dodi Kurniawan', 'Aisyah Putri', 'Taufik Hidayat', 'Mega Utami'];
        const dummyAcuities = ['20/20 (Normal)', '20/40 (Minus Ringan)', '20/60 (Minus)', '20/100 (Minus Berat)', '20/50 (Silinder)'];

        const interval = setInterval(() => {
            // Update stats counter
            setStats(prev => ({
                ...prev,
                total_users: prev.total_users + (Math.random() > 0.7 ? 1 : 0),
                total_results: prev.total_results + 1,
                total_chats: prev.total_chats + (Math.random() > 0.5 ? 1 : 0)
            }));

            // Generate new dummy result
            const randomName = dummyNames[Math.floor(Math.random() * dummyNames.length)];
            const randomAcuity = dummyAcuities[Math.floor(Math.random() * dummyAcuities.length)];
            const newResult = {
                id: Date.now(),
                user: { name: randomName },
                visual_acuity: randomAcuity,
                created_at_simulated: 'Baru saja'
            };
            setRecentResults(prev => [newResult, ...prev.slice(0, 4)]);

            // Generate new dummy chat session
            if (Math.random() > 0.5) {
                const chatUser = dummyNames[Math.floor(Math.random() * dummyNames.length)];
                const newChat = {
                    id: Date.now() + 1,
                    user: { name: chatUser },
                    status: 'Aktif',
                    created_at_simulated: 'Baru saja'
                };
                setRecentChats(prev => [newChat, ...prev.slice(0, 4)]);
            }

            // Animate ChartData slightly (last day increments)
            setChartData(prev => {
                const updatedData = [...prev.data];
                const lastIdx = updatedData.length - 1;
                updatedData[lastIdx] = updatedData[lastIdx] + 1;
                return {
                    ...prev,
                    data: updatedData
                };
            });

            // Update top users table randomly
            setTopUsers(prev => {
                return prev.map(user => {
                    if (Math.random() > 0.8) {
                        return {
                            ...user,
                            total_checks: Number(user.total_checks) + 1
                        };
                    }
                    return user;
                }).sort((a, b) => b.total_checks - a.total_checks);
            });

        }, 3500);

        return () => clearInterval(interval);
    }, [isTelemetryActive]);

    // Handle Quick Action: Clear Cache
    const triggerClearCache = async () => {
        setActionStatus('clearing_cache');
        setActionProgress(0);

        // Progress simulator
        const interval = setInterval(() => {
            setActionProgress(prev => {
                if (prev >= 100) {
                    clearInterval(interval);
                    return 100;
                }
                return prev + 10;
            });
        }, 150);

        try {
            // Retrieve CSRF token
            const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');
            
            const response = await fetch(routes.clearCache, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': csrfToken
                }
            });

            setTimeout(() => {
                clearInterval(interval);
                setActionProgress(100);
                setActionStatus('cleared');
                setTimeout(() => setActionStatus(null), 2500);
            }, 1600);

        } catch (e) {
            console.error('Failed to clear cache:', e);
            clearInterval(interval);
            setActionStatus(null);
        }
    };

    // Client-side list filters
    const filteredResults = useMemo(() => {
        return recentResults.filter(res => {
            const userName = res.user?.name || 'Guest';
            const acuity = res.visual_acuity || '';
            return userName.toLowerCase().includes(resultSearch.toLowerCase()) || 
                   acuity.toLowerCase().includes(resultSearch.toLowerCase());
        });
    }, [recentResults, resultSearch]);

    const filteredChats = useMemo(() => {
        return recentChats.filter(chat => {
            const userName = chat.user?.name || 'Guest';
            return userName.toLowerCase().includes(chatSearch.toLowerCase());
        });
    }, [recentChats, chatSearch]);

    // Custom SVG Line Chart dimensions & math
    const svgWidth = 500;
    const svgHeight = 200;
    const padding = 20;

    const linePoints = useMemo(() => {
        if (!chartData || !chartData.data || chartData.data.length === 0) return '';
        const dataMax = Math.max(...chartData.data, 5); // ensure division safety
        const totalPoints = chartData.data.length;

        return chartData.data.map((val, idx) => {
            const x = padding + (idx / (totalPoints - 1)) * (svgWidth - padding * 2);
            const y = svgHeight - padding - (val / dataMax) * (svgHeight - padding * 2);
            return { x, y, value: val, label: chartData.labels[idx] };
        });
    }, [chartData]);

    const linePathD = useMemo(() => {
        if (linePoints.length === 0) return '';
        return linePoints.reduce((acc, point, idx) => {
            return idx === 0 ? `M ${point.x} ${point.y}` : `${acc} L ${point.x} ${point.y}`;
        }, '');
    }, [linePoints]);

    const areaPathD = useMemo(() => {
        if (linePoints.length === 0) return '';
        const first = linePoints[0];
        const last = linePoints[linePoints.length - 1];
        return `${linePathD} L ${last.x} ${svgHeight - padding} L ${first.x} ${svgHeight - padding} Z`;
    }, [linePoints, linePathD]);

    // Top stats card details dictionary
    const statCardsData = {
        users: {
            title: 'Total Pengguna',
            value: stats.total_users,
            icon: <Users size={22} />,
            color: 'text-emerald-500',
            bg: 'bg-emerald-500/10',
            trend: '+12.5% vs bulan lalu'
        },
        results: {
            title: 'Hasil Periksa',
            value: stats.total_results,
            icon: <CheckCircle size={22} />,
            color: 'text-amber-500',
            bg: 'bg-amber-500/10',
            trend: '98.2% Akurasi Digital'
        },
        chats: {
            title: 'Sesi Chat Digital',
            value: stats.total_chats,
            icon: <MessageSquare size={22} />,
            color: 'text-sky-500',
            bg: 'bg-sky-500/10',
            trend: `${stats.total_hospitals} RS Rujukan`
        },
        system: {
            title: 'Status Sistem',
            value: 'Healthy',
            icon: <Server size={22} />,
            color: 'text-teal-500',
            bg: 'bg-teal-500/10',
            trend: 'v1.5 Flash (Active)'
        }
    };

    return (
        <div className="space-y-8 select-none">
            
            {/* Header controls & Telemetry */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <nav className="text-xs text-slate-500 flex items-center gap-1.5 mb-1.5">
                        <span>Admin</span>
                        <span>/</span>
                        <span className={theme.textMuted}>Interactive Dashboard</span>
                    </nav>
                    <h1 className={`text-2xl font-bold ${theme.textPrimary}`}>
                        Panel Kendali MataCeria
                    </h1>
                </div>

                <div className="flex items-center gap-3 self-stretch md:self-auto">
                    {/* Live Telemetry Switch */}
                    <button
                        onClick={() => setIsTelemetryActive(!isTelemetryActive)}
                        style={{ boxShadow: theme.shadowOutSm }}
                        className={`flex items-center gap-2 px-4 py-2.5 rounded-full text-xs font-bold transition-all border ${theme.borderLight} ${
                            isTelemetryActive 
                                ? 'bg-amber-500/15 border-amber-500/40 text-amber-600' 
                                : 'bg-transparent text-slate-500 border-slate-300/30'
                        }`}
                    >
                        <Wifi size={14} className={isTelemetryActive ? 'animate-pulse' : ''} />
                        <span>{isTelemetryActive ? 'Telemetri Live: Aktif' : 'Simulasi Telemetri'}</span>
                    </button>

                    {/* Dark Mode Toggle */}
                    <button
                        onClick={toggleTheme}
                        style={{ boxShadow: theme.shadowOutSm }}
                        className={`p-3 rounded-full transition-all border ${theme.borderLight} ${
                            isDarkMode 
                                ? 'text-amber-400 bg-slate-800' 
                                : 'text-slate-700 bg-slate-200/50'
                        }`}
                        title={isDarkMode ? 'Mode Terang' : 'Mode Gelap'}
                    >
                        {isDarkMode ? <Sun size={16} /> : <Moon size={16} />}
                    </button>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="space-y-3">
                <span className="text-[10px] uppercase font-bold tracking-widest text-slate-500/80 block">
                    Metrik Utama
                </span>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
                    {cardOrder.map((key) => {
                        const c = statCardsData[key];
                        return (
                            <motion.div
                                key={key}
                                whileHover={{ y: -4 }}
                                style={{ 
                                    boxShadow: theme.shadowOutSm,
                                    backgroundColor: theme.bgSurface 
                                }}
                                className={`p-5 sm:p-6 rounded-[24px] border ${theme.borderLight} transition-all duration-300 relative overflow-hidden`}
                            >
                                <div className="flex justify-between items-start mb-4">
                                    <div className={`p-2.5 rounded-xl ${c.bg} ${c.color} shadow-inner`}>
                                        {c.icon}
                                    </div>
                                    {key === 'system' && (
                                        <span className="flex h-2.5 w-2.5 relative">
                                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                                            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
                                        </span>
                                    )}
                                </div>

                                <h3 className="text-[11px] font-bold uppercase tracking-wider text-slate-500/85">
                                    {c.title}
                                </h3>
                                
                                <p className={`text-2xl font-bold ${theme.textPrimary} mt-1`}>
                                    {typeof c.value === 'number' ? c.value.toLocaleString() : c.value}
                                </p>

                                <div className="flex items-center gap-1 mt-3 pt-3 border-t border-slate-300/10 text-[10px] text-slate-500 font-semibold">
                                    {key === 'users' && <TrendingUp size={12} className="text-emerald-500" />}
                                    <span>{c.trend}</span>
                                </div>
                            </motion.div>
                        );
                    })}
                </div>
            </div>

            {/* Middle Section: Interactive Charts */}
            <div className="grid lg:grid-cols-12 gap-8 items-stretch">
                
                {/* SVG Line Chart: Refraction Checks Trend */}
                <div 
                    style={{ 
                        boxShadow: theme.shadowOutMd,
                        backgroundColor: theme.bgSurface 
                    }}
                    className={`lg:col-span-8 rounded-[32px] p-6 sm:p-8 border ${theme.borderLight} flex flex-col justify-between`}
                >
                    <div className="flex justify-between items-center mb-6 border-b border-slate-300/10 pb-4">
                        <div>
                            <h3 className={`text-sm font-bold uppercase ${theme.textPrimary}`}>Tren Pemeriksaan Mata (7 Hari)</h3>
                            <p className="text-[11px] text-slate-500 mt-0.5">Pemindaian Digital digital refraction</p>
                        </div>
                        <span className="text-[10px] bg-teal-500/10 border border-teal-500/20 text-teal-600 font-bold px-2 py-1 rounded-full uppercase">
                            Visual Chart
                        </span>
                    </div>

                    {/* SVG Canvas */}
                    <div className="relative w-full h-[220px] flex items-center justify-center bg-transparent mt-4">
                        
                        <svg className="w-full h-full overflow-visible" viewBox={`0 0 ${svgWidth} ${svgHeight}`}>
                            {/* Grid Lines */}
                            {[0, 0.25, 0.5, 0.75, 1].map((ratio, idx) => {
                                const y = padding + ratio * (svgHeight - padding * 2);
                                return (
                                    <line 
                                        key={idx} 
                                        x1={padding} 
                                        y1={y} 
                                        x2={svgWidth - padding} 
                                        y2={y} 
                                        stroke={theme.chartGridColor} 
                                        strokeWidth="1" 
                                        strokeDasharray="4 4" 
                                    />
                                );
                            })}

                            {/* Area Fill */}
                            {areaPathD && (
                                <motion.path
                                    d={areaPathD}
                                    fill={`url(#areaGradient-${isDarkMode ? 'dark' : 'light'})`}
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ duration: 1 }}
                                />
                            )}

                            {/* Line Path */}
                            {linePathD && (
                                <motion.path
                                    d={linePathD}
                                    fill="none"
                                    stroke={theme.brandColor}
                                    strokeWidth="3.5"
                                    strokeLinecap="round"
                                    initial={{ pathLength: 0 }}
                                    animate={{ pathLength: 1 }}
                                    transition={{ duration: 1.5, ease: 'easeInOut' }}
                                />
                            )}

                            {/* Interaction Circles */}
                            {linePoints.map((pt, idx) => (
                                <g key={idx}>
                                    <circle
                                        cx={pt.x}
                                        cy={pt.y}
                                        r="4"
                                        fill={isDarkMode ? '#181E29' : '#E7E5E4'}
                                        stroke={theme.brandColor}
                                        strokeWidth="3"
                                        className="cursor-pointer transition-transform duration-200 hover:scale-150"
                                        onMouseEnter={(e) => {
                                            const rect = e.target.getBoundingClientRect();
                                            setLineTooltip({
                                                x: pt.x,
                                                y: pt.y - 12,
                                                value: pt.value,
                                                label: pt.label
                                            });
                                        }}
                                        onMouseLeave={() => setLineTooltip(null)}
                                    />
                                </g>
                            ))}

                            {/* Gradients */}
                            <defs>
                                <linearGradient id="areaGradient-light" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="0%" stopColor="#006666" stopOpacity="0.25" />
                                    <stop offset="100%" stopColor="#006666" stopOpacity="0.0" />
                                </linearGradient>
                                <linearGradient id="areaGradient-dark" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="0%" stopColor="#20b2aa" stopOpacity="0.25" />
                                    <stop offset="100%" stopColor="#20b2aa" stopOpacity="0.0" />
                                </linearGradient>
                            </defs>
                        </svg>

                        {/* Interactive Tooltip Overlay */}
                        {lineTooltip && (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="absolute bg-[#1E2938] text-white p-2.5 rounded-xl border border-slate-700 shadow-xl pointer-events-none text-[10px]"
                                style={{
                                    left: `${(lineTooltip.x / svgWidth) * 100}%`,
                                    top: `${(lineTooltip.y / svgHeight) * 100 - 15}%`,
                                    transform: 'translateX(-50%)'
                                }}
                            >
                                <p className="font-bold">{lineTooltip.label}</p>
                                <p className="mt-0.5 text-teal-300 font-semibold">{lineTooltip.value} Pemeriksaan</p>
                            </motion.div>
                        )}

                    </div>

                    {/* Chart Labels Footer */}
                    <div className="flex justify-between text-[9px] text-slate-500 font-bold border-t border-slate-300/10 pt-4 px-2 mt-4">
                        {chartData.labels.map((lbl, idx) => (
                            <span key={idx}>{lbl}</span>
                        ))}
                    </div>

                </div>

                {/* Health Monitoring Widget & Top Users */}
                <div 
                    style={{ 
                        boxShadow: theme.shadowOutMd,
                        backgroundColor: theme.bgSurface 
                    }}
                    className={`lg:col-span-4 rounded-[32px] p-6 border ${theme.borderLight} flex flex-col justify-between`}
                >
                    <div>
                        <div className="flex justify-between items-center mb-6 border-b border-slate-300/10 pb-4">
                            <div>
                                <h3 className={`text-sm font-bold uppercase ${theme.textPrimary}`}>Kesehatan Sistem</h3>
                                <p className="text-[11px] text-slate-500 mt-0.5">Diagnostik hardware & server</p>
                            </div>
                        </div>

                        {/* Health List */}
                        <div className="space-y-3">
                            {[
                                { name: 'Server API', latency: 'Stable', status: 'Online', icon: <Wifi size={14} className="text-emerald-500" /> },
                                { name: 'Gemini Digital', latency: '450ms Latency', status: 'Connected', icon: <Activity size={14} className="text-emerald-500" /> },
                                { name: 'Database', latency: '24% Cap. Used', status: 'Healthy', icon: <Database size={14} className="text-teal-500" /> }
                            ].map((s, idx) => (
                                <div 
                                    key={idx}
                                    style={{ boxShadow: theme.shadowInSm }}
                                    className="p-3.5 rounded-2xl flex items-center justify-between transition-shadow text-[11px]"
                                >
                                    <div className="flex items-center gap-3">
                                        <div className={`p-2 rounded-xl ${isDarkMode ? 'bg-[#131821]' : 'bg-[#fff]'} shadow-sm`}>
                                            {s.icon}
                                        </div>
                                        <div>
                                            <p className={`font-bold ${theme.textPrimary}`}>{s.name}</p>
                                            <p className="text-[10px] text-slate-500">{s.latency}</p>
                                        </div>
                                    </div>
                                    <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 border border-emerald-500/20 uppercase">
                                        {s.status}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Quick System Action triggers */}
                    <div className="pt-6 border-t border-slate-300/10 mt-6">
                        <button
                            onClick={triggerClearCache}
                            disabled={actionStatus === 'clearing_cache'}
                            style={{ boxShadow: theme.shadowOutSm }}
                            className={`w-full py-3 px-4 bg-teal-600 hover:bg-teal-700 text-white font-bold rounded-2xl text-[11px] flex items-center justify-center gap-2 transition-all disabled:opacity-50`}
                        >
                            {actionStatus === 'clearing_cache' ? (
                                <>
                                    <RefreshCw size={14} className="animate-spin" />
                                    <span>Mengosongkan Cache ({actionProgress}%)</span>
                                </>
                            ) : actionStatus === 'cleared' ? (
                                <>
                                    <ShieldCheck size={14} className="text-emerald-200" />
                                    <span>Cache Berhasil Dibersihkan</span>
                                </>
                            ) : (
                                <>
                                    <Trash2 size={14} />
                                    <span>Bersihkan Cache Sistem</span>
                                </>
                            )}
                        </button>
                    </div>

                </div>

            </div>

            {/* Bottom Section: Recent Results & Recent Chats */}
            <div className="grid md:grid-cols-2 gap-8">
                
                {/* Recent Results Grid */}
                <div 
                    style={{ 
                        boxShadow: theme.shadowOutMd,
                        backgroundColor: theme.bgSurface 
                    }}
                    className={`rounded-[32px] p-6 sm:p-8 border ${theme.borderLight}`}
                >
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 border-b border-slate-300/10 pb-4">
                        <div>
                            <h3 className={`text-sm font-bold uppercase ${theme.textPrimary}`}>Pemeriksaan Terkini</h3>
                            <p className="text-[11px] text-slate-500 mt-0.5">Hasil ketajaman refraksi terbaru</p>
                        </div>
                        {/* Search input */}
                        <div className="relative w-full sm:w-44">
                            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                            <input
                                type="text"
                                placeholder="Cari..."
                                value={resultSearch}
                                onChange={(e) => setResultSearch(e.target.value)}
                                className={`pl-8 pr-3 py-1.5 rounded-full text-xs outline-none w-full border border-slate-300/10 ${theme.inputBg} ${theme.textPrimary}`}
                                style={{ boxShadow: theme.shadowInSm }}
                            />
                        </div>
                    </div>

                    {/* Sunken Table wrapper */}
                    <div style={{ boxShadow: theme.shadowInSm }} className="rounded-2xl p-2.5 overflow-hidden">
                        <div className="max-h-[260px] overflow-y-auto pr-1">
                            <AnimatePresence initial={false}>
                                {filteredResults.length > 0 ? (
                                    <div className="space-y-2.5">
                                        {filteredResults.map((res) => (
                                            <motion.div
                                                key={res.id}
                                                initial={{ opacity: 0, x: -10 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                exit={{ opacity: 0, x: 10 }}
                                                className={`p-3 rounded-xl border border-slate-300/5 flex items-center justify-between text-[11px] ${
                                                    isDarkMode ? 'bg-[#181E29]' : 'bg-[#E7E5E4]'
                                                }`}
                                                style={{ boxShadow: theme.shadowOutSm }}
                                            >
                                                <div className="flex flex-col">
                                                    <span className={`font-bold ${theme.textPrimary}`}>{res.user?.name || 'Guest'}</span>
                                                    <span className="text-[9px] text-slate-500 mt-0.5">
                                                        {res.created_at_simulated || (res.created_at ? 'Terekam' : 'Baru')}
                                                    </span>
                                                </div>
                                                <span className="px-2 py-0.5 rounded-full bg-teal-500/10 text-teal-600 border border-teal-500/20 font-bold uppercase text-[9px]">
                                                    {res.visual_acuity}
                                                </span>
                                            </motion.div>
                                        ))}
                                    </div>
                                ) : (
                                    <p className="text-center text-xs italic text-slate-500 py-8">Tidak ada hasil ditemukan.</p>
                                )}
                            </AnimatePresence>
                        </div>
                    </div>
                    
                    <a 
                        href={routes.resultsIndex} 
                        className={`inline-flex items-center gap-1 mt-4 text-[10px] font-bold text-teal-600 hover:underline`}
                    >
                        <span>Lihat Semua Hasil</span>
                        <ArrowRight size={12} />
                    </a>
                </div>

                {/* Recent Chats Grid */}
                <div 
                    style={{ 
                        boxShadow: theme.shadowOutMd,
                        backgroundColor: theme.bgSurface 
                    }}
                    className={`rounded-[32px] p-6 sm:p-8 border ${theme.borderLight}`}
                >
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 border-b border-slate-300/10 pb-4">
                        <div>
                            <h3 className={`text-sm font-bold uppercase ${theme.textPrimary}`}>Sesi Chat Konsultasi</h3>
                            <p className="text-[11px] text-slate-500 mt-0.5">Interaksi aktif dengan model Digital</p>
                        </div>
                        {/* Search input */}
                        <div className="relative w-full sm:w-44">
                            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                            <input
                                type="text"
                                placeholder="Cari..."
                                value={chatSearch}
                                onChange={(e) => setChatSearch(e.target.value)}
                                className={`pl-8 pr-3 py-1.5 rounded-full text-xs outline-none w-full border border-slate-300/10 ${theme.inputBg} ${theme.textPrimary}`}
                                style={{ boxShadow: theme.shadowInSm }}
                            />
                        </div>
                    </div>

                    {/* Sunken Table wrapper */}
                    <div style={{ boxShadow: theme.shadowInSm }} className="rounded-2xl p-2.5 overflow-hidden">
                        <div className="max-h-[260px] overflow-y-auto pr-1">
                            <AnimatePresence initial={false}>
                                {filteredChats.length > 0 ? (
                                    <div className="space-y-2.5">
                                        {filteredChats.map((chat) => (
                                            <motion.div
                                                key={chat.id}
                                                initial={{ opacity: 0, x: -10 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                exit={{ opacity: 0, x: 10 }}
                                                className={`p-3 rounded-xl border border-slate-300/5 flex items-center justify-between text-[11px] ${
                                                    isDarkMode ? 'bg-[#181E29]' : 'bg-[#E7E5E4]'
                                                }`}
                                                style={{ boxShadow: theme.shadowOutSm }}
                                            >
                                                <div className="flex flex-col">
                                                    <span className={`font-bold ${theme.textPrimary}`}>{chat.user?.name || 'Guest'}</span>
                                                    <span className="text-[9px] text-slate-500 mt-0.5">
                                                        {chat.created_at_simulated || 'Sesi Aktif'}
                                                    </span>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <span className="px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-600 border border-amber-500/20 font-bold uppercase text-[9px]">
                                                        Aktif
                                                    </span>
                                                    <a 
                                                        href={routes.chatsShow.replace(':id', chat.id)} 
                                                        style={{ boxShadow: theme.shadowOutSm }}
                                                        className={`p-1.5 rounded-lg border ${theme.borderLight} ${
                                                            isDarkMode ? 'bg-slate-800 text-slate-300' : 'bg-slate-200 text-slate-700'
                                                        }`}
                                                    >
                                                        <Eye size={12} />
                                                    </a>
                                                </div>
                                            </motion.div>
                                        ))}
                                    </div>
                                ) : (
                                    <p className="text-center text-xs italic text-slate-500 py-8">Tidak ada sesi ditemukan.</p>
                                )}
                            </AnimatePresence>
                        </div>
                    </div>

                    <a 
                        href={routes.chatsIndex} 
                        className={`inline-flex items-center gap-1 mt-4 text-[10px] font-bold text-teal-600 hover:underline`}
                    >
                        <span>Lihat Semua Konsultasi</span>
                        <ArrowRight size={12} />
                    </a>
                </div>

            </div>

            {/* Top active users display */}
            <div 
                style={{ 
                    boxShadow: theme.shadowOutMd,
                    backgroundColor: theme.bgSurface 
                }}
                className={`rounded-[32px] p-6 sm:p-8 border ${theme.borderLight}`}
            >
                <div className="mb-6 border-b border-slate-300/10 pb-4">
                    <h3 className={`text-sm font-bold uppercase ${theme.textPrimary}`}>5 Pengguna Teraktif Memeriksa Mata</h3>
                    <p className="text-[11px] text-slate-500 mt-0.5">Visualisasi bar chart refraksi check counts</p>
                </div>

                <div className="space-y-4 pt-2">
                    {topUsers.map((user, idx) => {
                        const totalChecks = Number(user.total_checks);
                        const maxChecks = Math.max(...topUsers.map(u => Number(u.total_checks)), 1);
                        const percentage = (totalChecks / maxChecks) * 100;
                        
                        return (
                            <div key={idx} className="space-y-1.5 text-[11px]">
                                <div className="flex justify-between items-center">
                                    <span className={`font-bold ${theme.textPrimary}`}>{user.name}</span>
                                    <span className="font-semibold text-slate-500">{totalChecks} Kali Cek</span>
                                </div>
                                <div 
                                    style={{ boxShadow: theme.shadowInSm }} 
                                    className="w-full h-3.5 bg-slate-300/20 rounded-full p-0.5 overflow-hidden flex"
                                >
                                    <motion.div 
                                        className="h-full bg-gradient-to-r from-teal-600 to-teal-400 rounded-full"
                                        initial={{ width: 0 }}
                                        animate={{ width: `${percentage}%` }}
                                        transition={{ duration: 1.2, delay: idx * 0.1, type: 'spring', stiffness: 85 }}
                                    />
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

        </div>
    );
}



