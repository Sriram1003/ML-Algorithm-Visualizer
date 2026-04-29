'use client';

import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Layers, Shuffle, GitMerge, Brain, Zap, ArrowLeft, ArrowRight, Network } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';

export default function EnsembleConceptsPage() {
  const [currentPhase, setCurrentPhase] = useState(0);
  const router = useRouter();

  const concepts = [
    {
      title: "Collective Intelligence",
      subtitle: "Aggregation Theory",
      desc: "Architectures that synthesize multiple predictive outputs. By aggregating diverse high-variance models, we minimize global error and achieve superior generalization convergence.",
      icon: <Brain className="w-12 h-12 text-teal-400" />
    },
    {
      title: "Bagging Systems",
      subtitle: "Bootstrap Aggregation",
      desc: "Parallel training on stochastic data subsets to stabilize architectural variance. Exemplified by the Random Forest model family.",
      icon: <Layers className="w-12 h-12 text-blue-400" />
    },
    {
      title: "Gradient Boosting",
      subtitle: "Sequential Optimization",
      desc: "Iterative correction sequences where each subsequent learner targets the residual error gradient of its predecessor. Examples: AdaBoost, XGBoost.",
      icon: <Zap className="w-12 h-12 text-pink-500" />
    },
    {
      title: "Stacking Planes",
      subtitle: "Meta-Learning",
      desc: "Multi-level hierarchical structures where a secondary meta-regressor decodes the combined output of heterogeneous base learners.",
      icon: <GitMerge className="w-12 h-12 text-purple-400" />
    }
  ];

  const handleNext = () => {
    router.push('/ensemble-methods/algorithms');
  };

  const handleBack = () => {
    router.push('/ensemble-methods');
  };

  return (
    <div className="min-h-screen bg-[#020202] text-white flex flex-col items-center pb-24 overflow-hidden">
      <div className="max-w-7xl w-full mx-auto px-8 pt-24">
        {/* Superior Lab Navigation */}
        <div className="flex justify-between items-center mb-24 border-b border-white/5 pb-12">
          <button
            onClick={handleBack}
            className="flex items-center gap-3 text-gray-500 hover:text-white transition-all group"
          >
            <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center group-hover:bg-purple-600/20">
               <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
            </div>
            <span className="text-[10px] font-black uppercase tracking-[0.4em]">Abort Research</span>
          </button>

          <div className="flex gap-4">
             <div className="h-1 w-24 bg-purple-500 rounded-full" />
          </div>

          <button
            onClick={handleNext}
            className="flex items-center gap-3 bg-purple-600 hover:bg-purple-700 px-8 py-3 rounded-2xl shadow-lg shadow-purple-500/20 text-white transition-all"
          >
            <span className="text-[10px] font-black uppercase tracking-[0.4em]">Execute Lab</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* Concept Mesh */}
        <motion.div
           initial={{ opacity: 0, y: 30 }}
           animate={{ opacity: 1, y: 0 }}
           transition={{ duration: 0.8 }}
           className="w-full flex flex-col items-center"
        >
          <div className="text-center mb-20">
             <span className="text-purple-500 text-[10px] font-black uppercase tracking-[0.5em] mb-4 block">Theoretical Foundation</span>
             <h1 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl break-words hyphens-auto leading-tight font-black tracking-tighter bg-clip-text text-transparent bg-gradient-to-b from-white to-gray-500">
                Integrated <span className="text-purple-500">Logic</span>
             </h1>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full">
            {concepts.map((c, i) => (
              <motion.div 
                whileHover={{ scale: 1.02 }}
                key={i}
              >
                <Card className="p-10 bg-gray-950/40 border border-white/5 backdrop-blur-3xl hover:border-purple-500/20 transition-all shadow-[0_30px_60px_rgba(0,0,0,0.5)] h-full overflow-hidden relative group">
                  <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
                    {c.icon}
                  </div>
                  <div className="mb-8 w-20 h-20 flex items-center justify-center rounded-3xl bg-black/60 border border-white/5 shadow-inner">
                    {c.icon}
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-white/20 uppercase tracking-[0.3em] mb-1 block">{c.subtitle}</span>
                    <h3 className="text-3xl font-black text-white mb-4 tracking-tight">{c.title}</h3>
                    <p className="text-gray-400 text-sm leading-relaxed">{c.desc}</p>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>

          {/* Prompt to Lab */}
          <motion.div 
             whileHover={{ scale: 1.01 }}
             onClick={handleNext}
             className="mt-20 w-full cursor-pointer group"
          >
            <div className="relative p-12 rounded-[3.5rem] bg-gradient-to-r from-purple-900/40 to-teal-900/40 border border-white/10 overflow-hidden flex flex-col md:flex-row items-center justify-between gap-8 transition-all hover:border-white/20">
               <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10 pointer-events-none"></div>
               <div className="relative z-10 text-center md:text-left">
                  <h2 className="text-4xl font-black text-white mb-2 leading-none">Ready for Live Computation?</h2>
                  <p className="text-gray-400 font-light tracking-wide italic">Deploy these strategies in our real-time ensemble simulation environment.</p>
               </div>
               <div className="relative z-10 w-20 h-20 rounded-full bg-white flex items-center justify-center text-black shadow-2xl group-hover:scale-110 transition-transform">
                  <Network className="w-8 h-8" />
               </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
