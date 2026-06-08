import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Eye, Menu, X, ArrowRight } from 'lucide-react';

export default function InteractiveNavbar({ loginRoute, adminRoute, isAuthenticated, userName, scrolled }) {
    const [mobileOpen, setMobileOpen] = useState(false);

    const toggleMobile = () => setMobileOpen(!mobileOpen);

    const navLinks = [
        { label: 'Beranda', href: '#beranda' },
        { label: 'Fitur', href: '#fitur' },
        { label: 'Tentang', href: '#tentang' }
    ];

    return (
        <>
            <motion.nav 
                initial={{ y: -50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.6 }}
                className={`fixed w-full z-50 transition-all duration-500 ${
                    scrolled 
                        ? 'bg-[#FEFDFB]/90 backdrop-blur-md py-3 border-b border-[#3C5539]/10 shadow-sm' 
                        : 'bg-transparent py-5'
                }`}
            >
                <div className="max-w-6xl mx-auto px-5 sm:px-8 lg:px-10">
                    <div className="flex justify-between items-center">
                        {/* Logo */}
                        <a href="#" className="flex items-center gap-3 group">
                            <motion.div 
                                whileHover={{ scale: 1.05, rotate: 5 }}
                                className="w-10 h-10 bg-[#3C5539] rounded-2xl flex items-center justify-center text-white shadow-md shadow-emerald-950/10 group-hover:bg-[#5C8258] transition-colors"
                            >
                                <Eye size={20} />
                            </motion.div>
                            <div className="flex flex-col">
                                <span className="font-sans italic text-xl text-[#2B3A29] font-bold tracking-tight leading-tight">
                                    Mata<span className="text-[#3C5539] not-italic">Ceria</span>
                                </span>
                                <span className="text-[10px] text-[#7A9E76] tracking-[0.15em] uppercase font-bold">Kesehatan Mata</span>
                            </div>
                        </a>

                        {/* Desktop Navigation */}
                        <div className="hidden md:flex items-center space-x-8">
                            {navLinks.map((link, idx) => (
                                <a 
                                    key={idx}
                                    href={link.href}
                                    className="text-sm text-[#2B3A29]/75 hover:text-[#3C5539] font-semibold transition-colors relative group py-1"
                                >
                                    {link.label}
                                    <span className="absolute bottom-0 left-0 w-full h-[2px] bg-[#3C5539] scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
                                </a>
                            ))}
                        </div>

                        {/* CTA / Auth */}
                        <div className="flex items-center gap-4">
                            {isAuthenticated ? (
                                <motion.a 
                                    whileHover={{ scale: 1.03 }}
                                    whileTap={{ scale: 0.98 }}
                                    href={adminRoute}
                                    className="hidden sm:inline-flex px-5 py-2.5 bg-[#2B3A29] text-[#FEFDFB] text-sm font-semibold rounded-full hover:bg-[#3C5539] transition-all shadow-sm"
                                >
                                    Dashboard
                                </motion.a>
                            ) : (
                                <motion.a 
                                    whileHover={{ scale: 1.03 }}
                                    whileTap={{ scale: 0.98 }}
                                    href={loginRoute}
                                    className="hidden sm:inline-flex px-5 py-2.5 bg-[#3C5539] text-white text-sm font-semibold rounded-full hover:bg-[#5C8258] transition-all shadow-sm"
                                >
                                    Masuk
                                </motion.a>
                            )}
                            
                            {/* Mobile Toggle */}
                            <button 
                                onClick={toggleMobile}
                                className="md:hidden p-2 text-[#2B3A29]/65 hover:text-[#3C5539] transition-colors rounded-xl hover:bg-[#E4EBE3]"
                            >
                                <Menu size={24} />
                            </button>
                        </div>
                    </div>
                </div>
            </motion.nav>

            {/* Mobile Drawer */}
            <AnimatePresence>
                {mobileOpen && (
                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 md:hidden"
                        onClick={toggleMobile}
                    >
                        <motion.div 
                            initial={{ x: '100%' }}
                            animate={{ x: 0 }}
                            exit={{ x: '100%' }}
                            transition={{ type: 'tween', duration: 0.3 }}
                            className="absolute right-0 top-0 bottom-0 w-64 bg-[#FEFDFB] p-6 flex flex-col shadow-2xl border-l border-[#E4EBE3]"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="flex justify-between items-center mb-10">
                                <span className="font-sans italic text-lg font-bold">Menu</span>
                                <button 
                                    onClick={toggleMobile}
                                    className="p-2 text-[#2B3A29]/65 hover:text-[#3C5539] transition-colors rounded-xl"
                                >
                                    <X size={20} />
                                </button>
                            </div>

                            <div className="flex flex-col gap-6">
                                {navLinks.map((link, idx) => (
                                    <a 
                                        key={idx}
                                        href={link.href}
                                        onClick={toggleMobile}
                                        className="text-lg text-[#2B3A29]/75 hover:text-[#3C5539] font-bold transition-colors"
                                    >
                                        {link.label}
                                    </a>
                                ))}
                                
                                <div className="border-t border-[#E4EBE3] pt-6 mt-4">
                                    {isAuthenticated ? (
                                        <a 
                                            href={adminRoute}
                                            className="w-full flex items-center justify-center gap-2 px-5 py-3 bg-[#2B3A29] text-[#FEFDFB] font-semibold rounded-full text-sm"
                                        >
                                            Dashboard
                                            <ArrowRight size={16} />
                                        </a>
                                    ) : (
                                        <a 
                                            href={loginRoute}
                                            className="w-full flex items-center justify-center gap-2 px-5 py-3 bg-[#3C5539] text-white font-semibold rounded-full text-sm"
                                        >
                                            Masuk
                                            <ArrowRight size={16} />
                                        </a>
                                    )}
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}



