import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, RotateCcw, ShieldCheck, Download, Calendar, Activity, Eye, AlertCircle } from 'lucide-react';

export default function AISimulator() {
    const [scanState, setScanState] = useState('idle'); // idle | scanning | completed
    const [selectedCondition, setSelectedCondition] = useState('normal'); // normal | myopia | astigmatism
    const [progress, setProgress] = useState(0);
    const [currentLog, setCurrentLog] = useState('');
    const [logs, setLogs] = useState([]);

    const conditions = [
        { id: 'normal', name: 'Mata Normal (Emetropia)', desc: 'Kondisi penglihatan ideal tanpa deviasi refraksi signifikan.' },
        { id: 'myopia', name: 'Mata Minus (Myopia)', desc: 'Titik fokus jatuh di depan retina, objek jauh terlihat kabur.' },
        { id: 'astigmatism', name: 'Mata Silinder (Astigmatism)', desc: 'Kelengkungan kornea tidak merata, menyebabkan distorsi bayangan.' }
    ];

    const reports = {
        normal: {
            sphOD: '0.00', sphOS: '0.00',
            cylOD: '0.00', cylOS: '0.00',
            axisOD: '0', axisOS: '0',
            pd: '63 mm',
            acuity: '20/20 (Normal)',
            summary: 'Penglihatan Anda dalam kondisi sangat baik. Pertahankan dengan konsumsi vitamin A dan istirahat berkala menggunakan aturan 20-20-20.',
            statusColor: 'text-[#00A63D]'
        },
        myopia: {
            sphOD: '-2.25', sphOS: '-2.50',
            cylOD: '-0.25', cylOS: '-0.50',
            axisOD: '15', axisOS: '175',
            pd: '62 mm',
            acuity: '20/60 (Minus)',
            summary: 'Terdeteksi kondisi miopia (rabun jauh) tingkat ringan hingga sedang. Direkomendasikan menggunakan lensa korektif monofokal untuk aktivitas jarak jauh.',
            statusColor: 'text-amber-600'
        },
        astigmatism: {
            sphOD: '-0.50', sphOS: '-0.75',
            cylOD: '-1.50', cylOS: '-1.75',
            axisOD: '90', axisOS: '85',
            pd: '64 mm',
            acuity: '20/50 (Silinder)',
            summary: 'Terdeteksi astigmatisme (mata silinder) yang cukup memengaruhi fokus horizontal. Direkomendasikan lensa silindris dengan sumbu axis yang disesuaikan.',
            statusColor: 'text-rose-600'
        }
    };

    const scanLogs = [
        'Memulai kalibrasi sensor kamera...',
        'Mendeteksi jarak pupil mata ke layar (terkalibrasi: 35cm)...',
        'Memindai koordinat fovea sentralis...',
        'Menganalisis refleksi kornea luar...',
        'Menghitung kelengkungan lensa mata...',
        'Memproses kalkulasi deviasi dioptri...',
        'Mengevaluasi indeks akurasi Digital (98.7%)...',
        'Menyusun laporan refraksi digital...'
    ];

    useEffect(() => {
        let interval;
        if (scanState === 'scanning') {
            setProgress(0);
            setLogs([]);
            let logIndex = 0;
            
            interval = setInterval(() => {
                setProgress((prev) => {
                    const nextProgress = prev + 1.25;
                    
                    // Update logs based on progress thresholds
                    const logTriggerIndex = Math.floor((nextProgress / 100) * scanLogs.length);
                    if (logTriggerIndex > logIndex && logIndex < scanLogs.length) {
                        const newLog = `[${(nextProgress * 0.03).toFixed(1)}s] ${scanLogs[logIndex]}`;
                        setLogs((prevLogs) => [...prevLogs, newLog]);
                        setCurrentLog(scanLogs[logIndex]);
                        logIndex++;
                    }

                    if (nextProgress >= 100) {
                        clearInterval(interval);
                        setTimeout(() => {
                            setScanState('completed');
                        }, 500);
                        return 100;
                    }
                    return nextProgress;
                });
            }, 30);
        }
        return () => clearInterval(interval);
    }, [scanState]);

    const handleStartScan = () => {
        setScanState('scanning');
    };

    const handleReset = () => {
        setScanState('idle');
        setProgress(0);
        setLogs([]);
        setCurrentLog('');
    };

    return (
        <section id="simulator" className="py-24 bg-[#FCF9F2] border-t border-[#E4EBE3] relative z-20">
            <div className="max-w-6xl mx-auto px-5 sm:px-8 lg:px-10">
                
                {/* Header */}
                <div className="mb-16 text-center max-w-xl mx-auto space-y-3">
                    <span className="inline-flex items-center gap-2 text-xs tracking-[0.2em] uppercase text-[#3C5539] font-bold">
                        <span className="w-6 h-[1.5px] bg-[#9BB898]" />
                        Demo Teknologi
                    </span>
                    <h2 className="text-3xl md:text-4xl font-sans font-bold text-[#2B3A29]">
                        Simulator Pemeriksaan Digital
                    </h2>
                    <p className="text-[#2B3A29]/60">
                        Rasakan bagaimana sistem visual cerdas kami mendiagnosis pembiasan cahaya pada lensa mata Anda secara real-time.
                    </p>
                </div>

                {/* Main Simulator Card Layout */}
                <div className="grid lg:grid-cols-12 gap-8 items-stretch">
                    
                    {/* Left Side: Viewer/Scan Area */}
                    <div className="lg:col-span-6 bg-white rounded-[32px] border border-[#E4EBE3] p-6 sm:p-8 flex flex-col justify-between shadow-xl shadow-[#3C5539]/5 overflow-hidden min-h-[400px] relative">
                        
                        {/* Status Tag */}
                        <div className="flex justify-between items-center z-10">
                            <span className="text-[10px] uppercase tracking-[0.15em] font-bold text-[#2B3A29]/40">Visual Feed Simulator</span>
                            <div className="flex items-center gap-1.5">
                                <span className={`w-2 h-2 rounded-full ${scanState === 'scanning' ? 'bg-amber-500 animate-pulse' : scanState === 'completed' ? 'bg-[#00A63D]' : 'bg-[#7A9E76]'}`} />
                                <span className="text-[10px] font-bold text-[#2B3A29]/60 uppercase tracking-wider">
                                    {scanState === 'scanning' ? 'Scanning...' : scanState === 'completed' ? 'Scan Selesai' : 'Siap Pindai'}
                                </span>
                            </div>
                        </div>

                        {/* Visual Window */}
                        <div className="my-8 flex-1 flex items-center justify-center relative min-h-[220px]">
                            
                            {/* Grid calibration background */}
                            <div className="absolute inset-0 opacity-[0.03] pointer-events-none"
                                 style={{ 
                                     backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M40 0v40M0 40h80' stroke='%232B3A29' stroke-width='1' fill='none'/%3E%3C/svg%3E")`,
                                     backgroundSize: '20px 20px'
                                 }} 
                            />

                            {/* Viewfinder corner lines */}
                            <div className="absolute top-0 left-0 w-6 h-6 border-t-2 border-l-2 border-[#C5D4C3] rounded-tl-lg" />
                            <div className="absolute top-0 right-0 w-6 h-6 border-t-2 border-r-2 border-[#C5D4C3] rounded-tr-lg" />
                            <div className="absolute bottom-0 left-0 w-6 h-6 border-b-2 border-l-2 border-[#C5D4C3] rounded-bl-lg" />
                            <div className="absolute bottom-0 right-0 w-6 h-6 border-b-2 border-r-2 border-[#C5D4C3] rounded-br-lg" />

                            {/* Target Crosshair */}
                            <div className="absolute w-8 h-8 flex items-center justify-center text-[#C5D4C3] opacity-40">
                                <Activity size={32} />
                            </div>

                            {/* Dynamic Eye Animation based on states */}
                            <div className="relative w-40 h-40 flex items-center justify-center">
                                {/* Eye Graphic Background (Sclera) */}
                                <motion.div 
                                    animate={scanState === 'scanning' ? { scale: [1, 0.97, 1.03, 1] } : {}}
                                    transition={{ repeat: Infinity, duration: 1.5 }}
                                    className="absolute inset-0 bg-[#FCF9F2] rounded-full border-2 border-[#E4EBE3] flex items-center justify-center shadow-inner overflow-hidden"
                                >
                                    {/* Pupil/Iris */}
                                    <motion.div 
                                        animate={{
                                            filter: selectedCondition === 'myopia' && scanState !== 'completed' ? 'blur(6px)' : 'blur(0px)',
                                            scale: scanState === 'scanning' ? [0.9, 1.1, 0.95, 1] : 1
                                        }}
                                        transition={{ 
                                            filter: { duration: 0.5 },
                                            scale: { repeat: Infinity, duration: 2.2, ease: 'easeInOut' }
                                        }}
                                        className="w-24 h-24 rounded-full bg-gradient-to-tr from-[#3C5539] to-[#7A9E76] p-4 flex items-center justify-center relative shadow-lg"
                                    >
                                        {/* Inner pupil */}
                                        <div className="w-12 h-12 rounded-full bg-slate-900 shadow-inner flex items-center justify-center relative">
                                            {/* Reflection dot */}
                                            <div className="absolute top-2 left-2 w-3.5 h-3.5 bg-white/40 rounded-full blur-[0.5px]" />
                                        </div>

                                        {/* Iris patterns */}
                                        <div className="absolute inset-2 border border-white/10 rounded-full pointer-events-none" />
                                        <div className="absolute inset-4 border border-dashed border-white/15 rounded-full pointer-events-none" />
                                    </motion.div>
                                </motion.div>

                                {/* Astigmatism distorted shape */}
                                {selectedCondition === 'astigmatism' && scanState !== 'completed' && (
                                    <div className="absolute inset-0 border-4 border-dashed border-rose-500/10 rounded-full animate-spin pointer-events-none" style={{ animationDuration: '12s' }} />
                                )}

                                {/* Scanning Line Overlay */}
                                <AnimatePresence>
                                    {scanState === 'scanning' && (
                                        <>
                                            {/* Laser bar */}
                                            <motion.div 
                                                initial={{ top: '0%' }}
                                                animate={{ top: ['5%', '95%', '5%'] }}
                                                exit={{ opacity: 0 }}
                                                transition={{ repeat: Infinity, duration: 2.5, ease: 'easeInOut' }}
                                                className="absolute left-0 right-0 h-1 bg-[#3C5539] shadow-[0_0_12px_#5C8258] z-10 pointer-events-none"
                                            />
                                            {/* Horizontal scanning light reflection */}
                                            <motion.div 
                                                initial={{ opacity: 0.1 }}
                                                animate={{ opacity: [0.1, 0.3, 0.1] }}
                                                transition={{ repeat: Infinity, duration: 1 }}
                                                className="absolute inset-0 bg-[#C5D4C3]/10 pointer-events-none"
                                            />
                                        </>
                                    )}
                                </AnimatePresence>

                                {/* Focal calibration helper dots */}
                                {scanState === 'scanning' && (
                                    <div className="absolute inset-0 pointer-events-none">
                                        <span className="absolute top-2 left-2 text-[8px] font-sans text-[#3C5539] opacity-70">X: 12.43</span>
                                        <span className="absolute bottom-2 right-2 text-[8px] font-sans text-[#3C5539] opacity-70">Y: -8.92</span>
                                    </div>
                                )}
                            </div>

                        </div>

                        {/* Realtime Output Logs console */}
                        <div className="bg-[#FEFDFB] border border-[#E4EBE3] rounded-2xl p-4 font-sans text-xs text-[#2B3A29]/70 min-h-[72px] flex flex-col justify-end">
                            {scanState === 'idle' && (
                                <p className="text-center italic text-[#2B3A29]/40 py-2">Klik tombol "Mulai Pemindaian" di kanan untuk memulai simulasi.</p>
                            )}
                            {scanState === 'scanning' && (
                                <div className="space-y-1">
                                    <div className="flex justify-between items-center text-[10px] text-[#3C5539] font-bold border-b border-[#E4EBE3] pb-1.5 mb-1.5">
                                        <span>Digital INFERENCE LOGS</span>
                                        <span>{progress.toFixed(0)}%</span>
                                    </div>
                                    <p className="text-[#3C5539] font-bold truncate animate-pulse">&gt; {currentLog || 'Inisiasi...'}</p>
                                    <div className="w-full bg-[#E4EBE3] h-1 rounded-full overflow-hidden">
                                        <motion.div 
                                            className="h-full bg-[#3C5539]"
                                            style={{ width: `${progress}%` }}
                                        />
                                    </div>
                                </div>
                            )}
                            {scanState === 'completed' && (
                                <div className="space-y-1 text-emerald-800">
                                    <p className="font-bold flex items-center gap-1">
                                        <ShieldCheck size={14} className="text-[#00A63D]" />
                                        Pemindaian berhasil diselesaikan!
                                    </p>
                                    <p className="text-[10px] text-[#2B3A29]/50">Indeks Kepercayaan Diagnostik: 98.7% (Kalibrasi Optimal)</p>
                                </div>
                            )}
                        </div>

                    </div>

                    {/* Right Side: Control Panel & Diagnosis Report */}
                    <div className="lg:col-span-6 flex flex-col justify-between">
                        
                        <AnimatePresence mode="wait">
                            {scanState !== 'completed' ? (
                                /* Phase 1: Selector Panel */
                                <motion.div 
                                    key="control-panel"
                                    initial={{ opacity: 0, y: 15 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -15 }}
                                    className="bg-white rounded-[32px] border border-[#E4EBE3] p-6 sm:p-8 flex-1 flex flex-col justify-between shadow-xl shadow-[#3C5539]/5"
                                >
                                    <div>
                                        <h3 className="text-xl font-sans font-bold text-[#2B3A29] mb-1">Pilih Kondisi Mata</h3>
                                        <p className="text-xs text-[#2B3A29]/65 mb-6">Pilih salah satu profil refraksi berikut untuk melihat bagaimana Digital mendeteksi parameternya.</p>
                                        
                                        <div className="space-y-3">
                                            {conditions.map((cond) => (
                                                <button
                                                    key={cond.id}
                                                    onClick={() => scanState === 'idle' && setSelectedCondition(cond.id)}
                                                    disabled={scanState === 'scanning'}
                                                    className={`w-full text-left p-4 rounded-2xl border transition-all flex items-start gap-3.5 ${
                                                        selectedCondition === cond.id
                                                            ? 'border-[#3C5539] bg-[#3C5539]/5 shadow-sm'
                                                            : 'border-[#E4EBE3] hover:border-[#C5D4C3] bg-transparent'
                                                    } ${scanState === 'scanning' ? 'opacity-50 cursor-not-allowed' : ''}`}
                                                >
                                                    <div className={`mt-0.5 w-4.5 h-4.5 rounded-full border-2 flex items-center justify-center ${
                                                        selectedCondition === cond.id
                                                            ? 'border-[#3C5539] text-[#3C5539]'
                                                            : 'border-[#C5D4C3]'
                                                    }`}>
                                                        {selectedCondition === cond.id && (
                                                            <span className="w-2 h-2 bg-[#3C5539] rounded-full" />
                                                        )}
                                                    </div>
                                                    <div>
                                                        <p className="text-sm font-bold text-[#2B3A29]">{cond.name}</p>
                                                        <p className="text-xs text-[#2B3A29]/60 mt-1 leading-relaxed">{cond.desc}</p>
                                                    </div>
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Action button */}
                                    <div className="pt-8 mt-6 border-t border-[#E4EBE3]">
                                        <motion.button
                                            whileHover={scanState === 'idle' ? { scale: 1.02 } : {}}
                                            whileTap={scanState === 'idle' ? { scale: 0.98 } : {}}
                                            onClick={handleStartScan}
                                            disabled={scanState === 'scanning'}
                                            className="w-full py-4 px-6 bg-[#3C5539] text-white font-semibold rounded-full flex items-center justify-center gap-2 hover:bg-[#5C8258] transition-colors shadow-lg shadow-[#3C5539]/10 disabled:bg-[#7A9E76]/40 disabled:cursor-not-allowed disabled:shadow-none"
                                        >
                                            {scanState === 'scanning' ? (
                                                <>
                                                    <span className="w-5 h-5 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                                                    Menganalisis Lensa...
                                                </>
                                            ) : (
                                                <>
                                                    <Play size={18} fill="currentColor" />
                                                    Mulai Pemindaian Digital
                                                </>
                                            )}
                                        </motion.button>
                                    </div>
                                </motion.div>
                            ) : (
                                /* Phase 2: Diagnostic Report Card */
                                <motion.div 
                                    key="report-panel"
                                    initial={{ opacity: 0, scale: 0.97 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0 }}
                                    transition={{ duration: 0.5, type: 'spring', stiffness: 90 }}
                                    className="bg-white rounded-[32px] border border-[#E4EBE3] p-6 sm:p-8 flex-1 flex flex-col justify-between shadow-xl shadow-[#3C5539]/8 relative overflow-hidden"
                                >
                                    {/* Watermark logo */}
                                    <div className="absolute -bottom-10 -right-10 text-[#C5D4C3] opacity-[0.08] pointer-events-none">
                                        <Eye size={200} />
                                    </div>

                                    <div>
                                        {/* Header */}
                                        <div className="flex justify-between items-start border-b border-[#E4EBE3] pb-4 mb-5">
                                            <div>
                                                <h3 className="text-lg font-sans font-bold text-[#2B3A29]">Laporan Hasil Refraksi</h3>
                                                <p className="text-[10px] text-[#2B3A29]/50 uppercase tracking-widest font-sans mt-0.5">Ref: MC-Digital-82937A</p>
                                            </div>
                                            <span className="text-[10px] px-2.5 py-1 bg-[#f0fbf4] text-[#00A63D] font-bold rounded-full border border-[#00A63D]/10">
                                                Digital VERIFIED
                                            </span>
                                        </div>

                                        {/* Grid Data Parameters */}
                                        <div className="grid grid-cols-2 gap-3.5 mb-5">
                                            <div className="bg-[#FCF9F2] rounded-2xl p-3 border border-[#E4EBE3]/60">
                                                <span className="text-[10px] font-bold text-[#2B3A29]/45 uppercase">Mata Kanan (OD)</span>
                                                <div className="mt-1.5 space-y-1">
                                                    <div className="flex justify-between text-xs font-semibold">
                                                        <span className="text-[#2B3A29]/60">Spheris (SPH):</span>
                                                        <span className="text-[#2B3A29]">{reports[selectedCondition].sphOD}</span>
                                                    </div>
                                                    <div className="flex justify-between text-xs font-semibold">
                                                        <span className="text-[#2B3A29]/60">Silindris (CYL):</span>
                                                        <span className="text-[#2B3A29]">{reports[selectedCondition].cylOD}</span>
                                                    </div>
                                                    <div className="flex justify-between text-xs font-semibold">
                                                        <span className="text-[#2B3A29]/60">Axis:</span>
                                                        <span className="text-[#2B3A29]">{reports[selectedCondition].axisOD}°</span>
                                                    </div>
                                                </div>
                                            </div>
                                            
                                            <div className="bg-[#FCF9F2] rounded-2xl p-3 border border-[#E4EBE3]/60">
                                                <span className="text-[10px] font-bold text-[#2B3A29]/45 uppercase">Mata Kiri (OS)</span>
                                                <div className="mt-1.5 space-y-1">
                                                    <div className="flex justify-between text-xs font-semibold">
                                                        <span className="text-[#2B3A29]/60">Spheris (SPH):</span>
                                                        <span className="text-[#2B3A29]">{reports[selectedCondition].sphOS}</span>
                                                    </div>
                                                    <div className="flex justify-between text-xs font-semibold">
                                                        <span className="text-[#2B3A29]/60">Silindris (CYL):</span>
                                                        <span className="text-[#2B3A29]">{reports[selectedCondition].cylOS}</span>
                                                    </div>
                                                    <div className="flex justify-between text-xs font-semibold">
                                                        <span className="text-[#2B3A29]/60">Axis:</span>
                                                        <span className="text-[#2B3A29]">{reports[selectedCondition].axisOS}°</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Acuity & Pupil info */}
                                        <div className="grid grid-cols-2 gap-4 border-y border-[#E4EBE3] py-3.5 mb-5 text-sm">
                                            <div>
                                                <span className="text-[10px] font-bold text-[#2B3A29]/45 uppercase block">Tajam Penglihatan</span>
                                                <span className="font-bold text-[#2B3A29] mt-0.5 block">{reports[selectedCondition].acuity}</span>
                                            </div>
                                            <div>
                                                <span className="text-[10px] font-bold text-[#2B3A29]/45 uppercase block">Pupil Distance (PD)</span>
                                                <span className="font-bold text-[#2B3A29] mt-0.5 block">{reports[selectedCondition].pd}</span>
                                            </div>
                                        </div>

                                        {/* Diagnosis Summary Text */}
                                        <div className="space-y-1.5">
                                            <span className="text-[10px] font-bold text-[#2B3A29]/45 uppercase block">Ringkasan Diagnosis</span>
                                            <p className="text-xs text-[#2B3A29]/75 leading-relaxed bg-[#3C5539]/5 border border-[#3C5539]/10 rounded-2xl p-4 font-sans">
                                                {reports[selectedCondition].summary}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Action Buttons */}
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-6 mt-6 border-t border-[#E4EBE3] relative z-10">
                                        <button 
                                            onClick={handleReset}
                                            className="w-full py-3.5 px-5 border-2 border-[#E4EBE3] hover:border-[#3C5539] hover:text-[#3C5539] text-[#2B3A29]/70 font-semibold rounded-full flex items-center justify-center gap-1.5 text-xs transition-colors"
                                        >
                                            <RotateCcw size={14} />
                                            Tes Ulang
                                        </button>
                                        <button 
                                            onClick={() => alert('Ini adalah simulasi unduh. Dalam aplikasi lengkap, laporan PDF akan otomatis dihasilkan.')}
                                            className="w-full py-3.5 px-5 bg-[#3C5539] hover:bg-[#5C8258] text-white font-semibold rounded-full flex items-center justify-center gap-1.5 text-xs transition-colors shadow-md shadow-[#3C5539]/10"
                                        >
                                            <Download size={14} />
                                            Unduh PDF (Simulasi)
                                        </button>
                                    </div>
                                    
                                    {/* Medical disclaimer note */}
                                    <p className="text-[9px] text-center text-[#2B3A29]/45 mt-4 flex items-center justify-center gap-1">
                                        <AlertCircle size={10} />
                                        Simulasi ini bukan pengganti diagnosis medis resmi. Konsultasikan ke dokter mata.
                                    </p>
                                </motion.div>
                            )}
                        </AnimatePresence>

                    </div>

                </div>

            </div>
        </section>
    );
}



