'use client';

import Link from 'next/link';
import { Terminal, ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#020202] text-white flex flex-col items-center justify-center p-8 relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-[500px] h-[350px] md:h-[500px] bg-red-600/10 blur-[120px] rounded-full pointer-events-none" />
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-10 flex flex-col items-center text-center max-w-2xl"
      >
        <div className="w-20 h-20 mb-8 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center shadow-[0_0_50px_rgba(239,68,68,0.1)]">
          <Terminal className="w-10 h-10 text-red-500" />
        </div>
        
        <h1 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl break-words hyphens-auto leading-tight font-black tracking-tighter uppercase italic text-transparent bg-clip-text bg-gradient-to-br from-white to-gray-600 mb-6">
          404
        </h1>
        
        <h2 className="text-2xl md:text-3xl font-black uppercase tracking-widest text-red-400 mb-8">
          Null Pointer Exception
        </h2>
        
        <p className="text-gray-400 text-lg md:text-xl font-light tracking-wide leading-relaxed mb-12">
          The requested trajectory matrix could not be resolved. The visualization endpoints you are looking for do not exist in the current spatial dimension.
        </p>

        <Link 
          href="/"
          className="group flex items-center gap-3 px-8 py-4 bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 rounded-xl transition-all duration-300 text-sm font-black uppercase tracking-[0.2em]"
        >
          <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          Return to Laboratory
        </Link>
      </motion.div>

      {/* Technical grid overlay */}
      <div className="fixed inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none" />
    </div>
  );
}
