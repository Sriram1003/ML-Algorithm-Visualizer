'use client';

import React from 'react';
import { Layers, Brain, GitMerge, ArrowLeft, Play, LayoutGrid } from 'lucide-react';
import Link from 'next/link';
import { motion } from 'framer-motion';

export default function EnsembleMethodsDashboard() {
  const sections = [
    {
      title: "Core Concepts",
      desc: "Architectural theory behind Bagging, Boosting, and Meta-Learning.",
      icon: <Brain className="w-10 h-10 text-teal-400" />,
      path: "/ensemble-methods/concepts",
      style: "from-teal-500/10 to-transparent",
      tag: "Theoretical"
    },
    {
      title: "Algorithm Labs",
      desc: "Visualizing Random Forest, AdaBoost, and gradient optimized XGBoost.",
      icon: <Layers className="w-10 h-10 text-blue-400" />,
      path: "/ensemble-methods/algorithms",
      style: "from-blue-500/10 to-transparent",
      tag: "Experimental"
    },
    {
      title: "Live Simulation",
      desc: "Iterative ensemble convergence and loss surface optimization.",
      icon: <Play className="w-10 h-10 text-pink-400" />,
      path: "/ensemble-methods/run-ensemble-algorithm",
      style: "from-pink-500/10 to-transparent",
      tag: "Real-time"
    }
  ];

  return (
    <div className="w-full max-w-[100vw] overflow-hidden px-4 sm:px-6 md:px-8 min-h-screen bg-[#020202] text-gray-200 flex flex-col items-center justify-center py-10">
      <div className="max-w-7xl w-full">
        {/* Superior Branding */}
        <div className="flex flex-col items-center text-center mb-24">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex items-center gap-2 px-4 py-1.5 rounded-full border border-purple-500/20 bg-purple-500/5 mb-6"
          >
            <GitMerge className="w-3.5 h-3.5 text-purple-400" />
            <span className="text-[10px] font-black text-purple-400 uppercase tracking-[0.4em]">Integrated Intelligence Suite</span>
          </motion.div>
          
          <h1 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl break-words hyphens-auto leading-tight font-black mb-6 tracking-tighter bg-clip-text text-transparent bg-gradient-to-b from-white to-gray-500">
            Ensemble <span className="text-purple-500">Suite</span>
          </h1>
          <p className="text-xl text-gray-500 max-w-2xl font-light leading-relaxed">
            Harness the power of collective intelligence through multi-model aggregation and gradient distributed architectures.
          </p>
        </div>

        {/* Dashboard Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {sections.map((s, i) => (
            <motion.div
              key={i}
              whileHover={{ y: -10 }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
            >
              <Link href={s.path}>
                <div className={`relative h-full bg-gradient-to-br ${s.style} border border-white/5 backdrop-blur-3xl rounded-[2.5rem] p-10 group overflow-hidden transition-all hover:border-white/10 shadow-2xl`}>
                  <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:opacity-25 transition-opacity">
                    <LayoutGrid className="w-20 h-20 text-white" />
                  </div>
                  
                  <div className="mb-10 w-20 h-20 flex items-center justify-center rounded-3xl bg-black/40 border border-white/5 shadow-inner group-hover:scale-110 transition-transform">
                    {s.icon}
                  </div>
                  
                  <div className="mb-8">
                     <span className="text-[10px] font-black text-white/10 uppercase tracking-[0.4em] mb-2 block">{s.tag} Protocol</span>
                     <h3 className="text-3xl font-black text-white mb-4 tracking-tight">{s.title}</h3>
                     <p className="text-gray-500 text-sm leading-relaxed">{s.desc}</p>
                  </div>

                  <div className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-purple-400 group-hover:gap-4 transition-all">
                    Initiate Sequence <ArrowLeft className="w-4 h-4 rotate-180" />
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* System Recall */}
        <div className="mt-24 text-center">
           <Link href="/" className="group inline-flex items-center gap-3 text-gray-600 hover:text-white transition-all">
              <div className="w-10 h-10 flex items-center justify-center rounded-xl bg-white/5 group-hover:bg-purple-600/20 transition-all">
                <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
              </div>
              <span className="text-[10px] font-black uppercase tracking-[0.5em]">System Exit</span>
           </Link>
        </div>
      </div>
    </div>
  );
}