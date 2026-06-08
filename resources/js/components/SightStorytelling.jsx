import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ShieldAlert, Cpu, Sparkles, Eye } from 'lucide-react';

export default function SightStorytelling() {
    const [activeStep, setActiveStep] = useState(0);

    const steps = [
        {
            title: '1. Mengapa Dunia Terasa Kabur?',
            desc: 'Banyak dari kita mengabaikan penurunan ketajaman penglihatan ringan. Dari rabun jauh hingga ketegangan mata digital, penglihatan yang tidak terkalibrasi membatasi produktivitas dan kebahagiaan Anda sehari-hari.',
            icon: <ShieldAlert className="text-[#FF2157]" size={24} />,
            color: 'border-red-500/30'
        },
        {
            title: '2. Deteksi Cepat dengan Digital',
            desc: 'Teknologi inferensi deep learning MataCeria memproses citra mata Anda dalam hitungan detik. Algoritma kami menganalisis kelainan struktur refraksi secara akurat untuk memetakan kondisi kesehatan mata Anda secara detail.',
            icon: <Cpu className="text-[#006666]" size={24} />,
            color: 'border-[#006666]/30'
        },
        {
            title: '3. Kembali Melihat dengan Ceria',
            desc: 'Dapatkan resep kacamata digital yang terkalibrasi, rujukan ke optik terdekat, dan jadwal konsultasi langsung dengan dokter spesialis mata terpercaya. Penglihatan jernih kini kembali ke genggaman Anda.',
            icon: <Sparkles className="text-[#00A63D]" size={24} />,
            color: 'border-[#00A63D]/30'
        }
    ];

    return (
        <section id="fitur" className="py-24 bg-[#FEFDFB] relative z-20">
            <div className="max-w-6xl mx-auto px-5 sm:px-8 lg:px-10">
                {/* Section Header */}
                <div className="mb-20 text-center max-w-xl mx-auto space-y-3">
                    <span className="inline-flex items-center gap-2 text-xs tracking-[0.2em] uppercase text-[#3C5539] font-bold">
                        <span className="w-6 h-[1.5px] bg-[#9BB898]" />
                        Perjalanan Penglihatan Anda
                    </span>
                    <h2 className="text-3xl md:text-4xl font-sans font-bold text-[#2B3A29]">
                        Teknologi Medis, Pengalaman Manusiawi
                    </h2>
                    <p className="text-[#2B3A29]/60">
                        Scroll dan ikuti bagaimana MataCeria mengembalikan kejernihan pandangan Anda secara instan.
                    </p>
                </div>

                {/* Split Interactive Storytelling Section */}
                <div className="grid lg:grid-cols-12 gap-12 items-start relative">
                    
                    {/* Left Column: Text Steps */}
                    <div className="lg:col-span-7 space-y-12 pr-4">
                        {steps.map((step, idx) => (
                            <motion.div
                                key={idx}
                                onViewportEnter={() => setActiveStep(idx)}
                                viewport={{ amount: 0.6 }}
                                initial={{ opacity: 0, x: -30 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.6 }}
                                className={`p-8 bg-[#FCF9F2] rounded-3xl border-l-4 ${step.color} shadow-sm cursor-default transition-all duration-300 ${
                                    activeStep === idx 
                                        ? 'shadow-md scale-[1.02] bg-white border border-[#E4EBE3]' 
                                        : 'opacity-50'
                                }`}
                            >
                                <div className="flex items-center gap-4 mb-4">
                                    <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm">
                                        {step.icon}
                                    </div>
                                    <h3 className="text-xl font-sans font-bold text-[#2B3A29]">{step.title}</h3>
                                </div>
                                <p className="text-[#2B3A29]/65 leading-relaxed font-sans">{step.desc}</p>
                            </motion.div>
                        ))}
                    </div>

                    {/* Right Column: Sticky Display */}
                    <div className="lg:col-span-5 lg:sticky lg:top-32 aspect-[4/3] w-full max-w-md mx-auto">
                        <div className="w-full h-full bg-[#FCF9F2] rounded-[32px] border border-[#E4EBE3] p-8 flex flex-col justify-between shadow-md relative overflow-hidden">
                            {/* Inner Visual container */}
                            <div className="flex-1 flex items-center justify-center relative">
                                
                                {/* Step 0: Blurry eye */}
                                {activeStep === 0 && (
                                    <motion.div 
                                        initial={{ opacity: 0, scale: 0.95 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0 }}
                                        className="relative flex items-center justify-center"
                                    >
                                        <div className="text-[#7A9E76]/30 blur-md transition-all">
                                            <Eye size={160} />
                                        </div>
                                        <div className="absolute inset-0 bg-[#E4EBE3]/20 backdrop-blur-[6px] rounded-full border border-red-500/10 pointer-events-none" />
                                        <span className="absolute text-xs font-bold text-red-500 tracking-wider uppercase bg-red-100/95 px-3 py-1.5 rounded-full shadow-sm">Pandangan Terganggu</span>
                                    </motion.div>
                                )}

                                {/* Step 1: Scanning eye */}
                                {activeStep === 1 && (
                                    <motion.div 
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                        className="relative flex items-center justify-center w-full h-full"
                                    >
                                        <div className="text-[#3C5539]/40 relative">
                                            <Eye size={160} />
                                            {/* Laser scanning line */}
                                            <motion.div 
                                                animate={{ top: ['0%', '100%', '0%'] }}
                                                transition={{ repeat: Infinity, duration: 2.5, ease: 'easeInOut' }}
                                                className="absolute left-0 right-0 h-0.5 bg-[#006666] shadow-[0_0_8px_#006666] pointer-events-none"
                                            />
                                        </div>
                                        <span className="absolute bottom-4 text-xs font-bold text-[#006666] tracking-[0.2em] uppercase bg-[#e6f2f2]/95 px-3 py-1.5 rounded-full shadow-sm animate-pulse">Scanning Digital...</span>
                                    </motion.div>
                                )}

                                {/* Step 2: Perfect vision eye */}
                                {activeStep === 2 && (
                                    <motion.div 
                                        initial={{ opacity: 0, scale: 0.9 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0 }}
                                        className="relative flex flex-col items-center justify-center text-center"
                                    >
                                        <div className="text-[#00A63D] filter drop-shadow-[0_0_8px_rgba(0,166,61,0.25)]">
                                            <Eye size={160} />
                                        </div>
                                        <span className="absolute text-xs font-bold text-[#00A63D] tracking-[0.2em] uppercase bg-[#f0fbf4]/95 px-4 py-1.5 rounded-full shadow-sm mt-4">100% Calibrated</span>
                                    </motion.div>
                                )}

                            </div>

                            {/* Label */}
                            <div className="border-t border-[#E4EBE3] pt-4 flex items-center justify-between">
                                <span className="text-[10px] text-[#2B3A29]/40 uppercase tracking-[0.2em] font-bold">Simulator Diagnostik</span>
                                <span className="text-[10px] text-[#3C5539] font-bold">Langkah {activeStep + 1} dari 3</span>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </section>
    );
}



