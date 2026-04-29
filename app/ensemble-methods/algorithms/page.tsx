'use client';

import React from 'react';
import { Layers, Zap, GitMerge, ArrowLeft, Terminal, Layout } from 'lucide-react';
import Link from 'next/link';
import { Card } from '@/components/ui/card';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';

export default function EnsembleAlgorithmsPage() {
  const router = useRouter();
  const algorithms = [
    {
      title: "Random Forest",
      subtitle: "Bootstrap Aggregation",
      desc: "Architectural implementation of bagging using high-variance decision trees.",
      icon: <Layers className="w-8 h-8 text-blue-400" />,
      path: "/supervised/random-forests",
      color: "blue"
    },
    {
      title: "AdaBoost",
      subtitle: "Adaptive Boosting",
      desc: "Sequential optimization focusing on misclassified sample weights.",
      icon: <Zap className="w-8 h-8 text-orange-400" />,
      path: "/ensemble-methods/boosting",
      color: "orange"
    },
    {
      title: "XGBoost",
      subtitle: "Extreme Gradient",
      desc: "Highly optimized gradient boosting with L1/L2 regularization.",
      icon: <Terminal className="w-8 h-8 text-yellow-500" />,
      path: "/ensemble-methods/xgboost",
      color: "yellow"
    },
    {
      title: "Stacking",
      subtitle: "Meta-Ensemble",
      desc: "Multi-layered inference using diverse base learners and meta-regressors.",
      icon: <GitMerge className="w-8 h-8 text-purple-400" />,
      path: "/ensemble-methods/stacking",
      color: "purple"
    },
    {
      title: "Bagging",
      subtitle: "General Protocol",
      desc: "Universal Bootstrap Aggregating framework for variance reduction.",
      icon: <Layout className="w-8 h-8 text-teal-400" />,
      path: "/ensemble-methods/bagging",
      color: "teal"
    }
  ];

  return (
    <div className="w-full max-w-[100vw] overflow-hidden px-4 sm:px-6 md:px-8 min-h-screen bg-[#020202] text-white pb-40 selection:bg-blue-500/30">
      {/* Background Decor */}
      <div className="fixed inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(59,130,246,0.05),transparent_40%)] pointer-events-none" />
      <div className="fixed inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.02] pointer-events-none" />

      <div className="max-w-7xl mx-auto pt-32 relative z-10">
        {/* Lab Header */}
        <div className="mb-24 flex flex-col md:flex-row items-start md:items-end justify-between border-b border-white/5 pb-16 gap-8">
          <div>
            <button
               onClick={() => router.push('/ensemble-methods')}
               className="flex items-center gap-4 text-gray-500 hover:text-white transition-all group mb-10 uppercase font-black text-[10px] tracking-[0.4em]"
            >
              <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/5 flex items-center justify-center group-hover:bg-blue-600/20 group-hover:border-blue-500/30">
                <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
              </div>
              Recall Dashboard
            </button>
            <h1 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl break-words hyphens-auto leading-tight font-black tracking-tighter text-white mb-6 uppercase italic">
              Metadiscourse <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-purple-500 not-italic">Labs</span>
            </h1>
            <p className="text-gray-500 text-xl font-light tracking-wide max-w-2xl leading-relaxed">
               Orchestrate multi-model architectures. Parallelize decision trees and boost latent representations.
            </p>
          </div>
          <div className="hidden lg:block text-right">
             <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-blue-500/5 border border-blue-500/10 text-[10px] font-black uppercase tracking-[0.3em] text-blue-400 mb-4">
                <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></div>
                Compute_Active
             </div>
             <div className="text-gray-600 font-mono text-xs uppercase tracking-widest">
                AGGREGATION_SYNC: STABLE
             </div>
          </div>
        </div>

        {/* Algorithm Mesh */}
        <motion.div
           initial={{ opacity: 0, y: 40 }}
           animate={{ opacity: 1, y: 0 }}
           transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
           className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10"
        >
          {algorithms.map((algo, index) => (
            <motion.div 
              whileHover={{ y: -10 }} 
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
              key={index}
            >
              <Link href={algo.path}>
                <Card className="h-full p-12 bg-[#050505] border border-white/5 backdrop-blur-3xl hover:border-blue-500/30 transition-all cursor-pointer shadow-2xl relative group overflow-hidden rounded-[2.5rem]">
                  <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-blue-500/10 to-transparent blur-[60px] opacity-0 group-hover:opacity-100 transition-opacity" />
                  
                  <div className="mb-10 w-20 h-20 flex items-center justify-center rounded-3xl bg-black border border-white/5 shadow-inner group-hover:scale-110 group-hover:border-blue-500/20 transition-all duration-500">
                    <div className="group-hover:scale-110 transition-transform duration-500">
                      {algo.icon}
                    </div>
                  </div>
                  
                  <div className="mb-10 relative z-10">
                     <span className="text-[10px] font-black text-blue-500/60 uppercase tracking-[0.4em] mb-2 block font-mono">{algo.subtitle}</span>
                     <h3 className="text-4xl font-black text-white mb-4 tracking-tight group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-blue-300 transition-all uppercase italic">
                        {algo.title}
                     </h3>
                     <p className="text-gray-500 text-sm leading-relaxed font-light group-hover:text-gray-400 transition-colors">
                        {algo.desc}
                     </p>
                  </div>
                  
                  <div className="flex items-center gap-4 text-[10px] font-black uppercase tracking-[0.4em] text-white/10 group-hover:text-blue-400 transition-all">
                    Initiate Lab <ArrowLeft className="w-4 h-4 rotate-180" />
                  </div>
                </Card>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}
