import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Eye } from 'lucide-react';

export default function ParallaxHero({ loginRoute, adminRoute, isAuthenticated }) {
    const [coords, setCoords] = useState({ x: 0, y: 0 });

    useEffect(() => {
        const handleMouseMove = (e) => {
            const x = (e.clientX / window.innerWidth) - 0.5;
            const y = (e.clientY / window.innerHeight) - 0.5;
            setCoords({ x, y });
        };
        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, []);

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.2,
                delayChildren: 0.1
            }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 30 },
        visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 100, damping: 15 } }
    };

    return (
        <section id="beranda" className="relative min-h-screen flex items-center bg-[#FEFDFB] overflow-hidden select-none">
            {/* Grid pattern overlay */}
            <div className="absolute inset-0 opacity-15 pointer-events-none" 
                 style={{ 
                     backgroundImage: `url("data:image/svg+xml,%3Csvg width='80' height='80' viewBox='0 0 80 80' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M40 0v80M0 40h80' stroke='%23C5D4C3' stroke-width='1.5' fill='none'/%3E%3C/svg%3E")`,
                     backgroundSize: '40px 40px'
                 }} 
            />

            {/* Parallax vector elements */}
            <motion.div 
                animate={{ x: coords.x * -30, y: coords.y * -30 }}
                transition={{ type: 'spring', stiffness: 45, damping: 18 }}
                className="absolute top-24 left-10 w-96 h-96 border border-[#C5D4C3] rounded-full opacity-35 pointer-events-none"
            />

            <motion.div 
                animate={{ x: coords.x * 50, y: coords.y * 50 }}
                transition={{ type: 'spring', stiffness: 60, damping: 20 }}
                className="absolute bottom-24 right-20 w-[450px] h-[450px] border-2 border-[#E4EBE3] rounded-full opacity-25 pointer-events-none"
            />

            <motion.div 
                animate={{ x: coords.x * -80, y: coords.y * -80 }}
                transition={{ type: 'spring', stiffness: 80, damping: 25 }}
                className="absolute top-1/3 right-1/4 w-4 h-4 bg-[#3C5539] rounded-full opacity-20 pointer-events-none"
            />
            <motion.div 
                animate={{ x: coords.x * 120, y: coords.y * 120 }}
                transition={{ type: 'spring', stiffness: 70, damping: 22 }}
                className="absolute bottom-1/3 left-1/4 w-3 h-3 bg-[#7A9E76] rounded-full opacity-30 pointer-events-none"
            />

            <div className="max-w-6xl mx-auto px-5 sm:px-8 lg:px-10 py-32 lg:py-40 relative z-10 w-full">
                <div className="grid lg:grid-cols-2 gap-16 items-center">
                    
                    {/* Left Column */}
                    <motion.div 
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                        className="space-y-8"
                    >
                        <motion.div variants={itemVariants} className="space-y-3">
                            <span className="inline-flex items-center gap-2 text-xs tracking-[0.2em] uppercase text-[#3C5539] font-bold">
                                <span className="w-6 h-[1.5px] bg-[#9BB898]" />
                                Platform Kesehatan Mata
                            </span>
                        </motion.div>

                        <motion.h1 
                            variants={itemVariants}
                            className="text-5xl sm:text-6xl font-sans font-bold text-[#2B3A29] leading-[1.15]"
                        >
                            Lihat dunia <br />
                            <span className="text-[#3C5539] italic font-normal">lebih</span> jelas, <br />
                            lebih segar.
                        </motion.h1>

                        <motion.p 
                            variants={itemVariants}
                            className="text-lg text-[#2B3A29]/65 leading-relaxed max-w-lg"
                        >
                            MataCeria memadukan kecerdasan buatan terkalibrasi dan pendampingan medis untuk deteksi dini, tes refraksi digital, serta konsultasi cepat — langsung dari kenyamanan gawai Anda.
                        </motion.p>

                        <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-4 pt-4">
                            <motion.a 
                                whileHover={{ scale: 1.05, boxShadow: '0 10px 25px -5px rgba(60, 85, 57, 0.2)' }}
                                whileTap={{ scale: 0.95 }}
                                href="#fitur"
                                className="px-8 py-4 bg-[#3C5539] text-white font-semibold rounded-full text-center flex items-center justify-center gap-2 transition-shadow"
                            >
                                Jelajahi Fitur
                                <ArrowRight size={16} />
                            </motion.a>
                            <motion.a 
                                whileHover={{ scale: 1.03, borderColor: '#3C5539', color: '#3C5539' }}
                                whileTap={{ scale: 0.98 }}
                                href="#tentang"
                                className="px-8 py-4 border-2 border-[#E4EBE3] text-[#2B3A29]/70 font-semibold rounded-full text-center transition-all"
                            >
                                Pelajari Lebih Lanjut
                            </motion.a>
                        </motion.div>
                    </motion.div>

                    {/* Right Column: 3D Interactive Card */}
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.92, rotate: 2 }}
                        animate={{ opacity: 1, scale: 1, rotate: 0 }}
                        transition={{ duration: 0.8, ease: 'easeOut' }}
                        className="relative hidden lg:block"
                    >
                        <motion.div 
                            style={{ 
                                perspective: 1000,
                                transformStyle: 'preserve-3d'
                            }}
                            animate={{ 
                                rotateX: coords.y * -15, 
                                rotateY: coords.x * 15
                            }}
                            className="bg-white rounded-[32px] shadow-xl shadow-emerald-950/5 p-8 border border-[#E4EBE3]"
                        >
                            <div className="aspect-[4/3] bg-gradient-to-br from-[#FEFDFB] to-[#F4F7F4] rounded-2xl flex items-center justify-center border border-[#E4EBE3] overflow-hidden relative shadow-inner">
                                <motion.div 
                                    animate={{ 
                                        x: coords.x * 20, 
                                        y: coords.y * 20 
                                    }}
                                    className="absolute text-[#C5D4C3] opacity-25"
                                >
                                    <Eye size={200} />
                                </motion.div>

                                <motion.div 
                                    className="relative z-10 bg-white/80 backdrop-blur-md rounded-2xl px-8 py-6 text-center border border-[#E4EBE3] shadow-md max-w-xs"
                                >
                                    <span className="text-[10px] text-[#3C5539] font-bold tracking-[0.2em] uppercase">Digital Diagnostics</span>
                                    <p className="text-2xl font-sans text-[#2B3A29] font-bold mt-1">Analisis Presisi</p>
                                    <p className="text-xs text-[#5C8258] mt-1 font-semibold">Ready to test refraction</p>
                                </motion.div>
                            </div>

                            <div className="mt-6 flex justify-around text-sm font-semibold text-[#2B3A29]/60">
                                <div className="flex items-center gap-2">
                                    <span className="w-2.5 h-2.5 bg-[#3C5539] rounded-full" />
                                    Deteksi Instan
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="w-2.5 h-2.5 bg-[#7A9E76] rounded-full" />
                                    Bagan Snellen
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="w-2.5 h-2.5 bg-[#9BB898] rounded-full" />
                                    Konsultasi
                                </div>
                            </div>
                        </motion.div>

                        {/* Backplate shadow layer */}
                        <div className="absolute -bottom-6 -right-6 w-full h-full border-2 border-[#E4EBE3] rounded-[32px] -z-10" />
                    </motion.div>

                </div>
            </div>
        </section>
    );
}



