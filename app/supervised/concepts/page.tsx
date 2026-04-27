'use client';

import { useState } from 'react';
import { Brain, LineChart, GitBranch, BookOpen, ArrowLeft, ArrowRight, Activity, Database, CheckCircle, BarChart } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';

export default function SupervisedConcepts() {
  const [currentSection, setCurrentSection] = useState(0);
  const router = useRouter();

  const sections = [
    {
      title: 'Neural Mapping: Supervised Learning',
      content: (
        <div className="text-center">
          <motion.div 
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 1 }}
          >
            <Activity size={120} className="mx-auto mb-10 text-purple-500 drop-shadow-[0_0_20px_rgba(168,85,247,0.4)]" />
          </motion.div>
          <p className="text-2xl text-purple-100 mb-10 max-w-3xl mx-auto font-light leading-relaxed">
            Supervised learning architectures utilize <span className="text-purple-400 font-bold">Labeled Data</span> to decode complex patterns. 
            The system learn a multi-dimensional mapping from <span className="text-teal-400 font-black">Inputs</span> to <span className="text-purple-400 font-black">Outputs</span>, 
            enabling hyper-accurate inference on novel datasets.
          </p>
          <div className="flex justify-center gap-6">
             <div className="flex items-center gap-2 text-xs text-white/30 uppercase tracking-[0.3em]">
                <div className="w-2 h-2 rounded-full bg-purple-500 animate-pulse"></div>
                Real-time Training
             </div>
             <div className="flex items-center gap-2 text-xs text-white/30 uppercase tracking-[0.3em]">
                <div className="w-2 h-2 rounded-full bg-teal-500 animate-pulse"></div>
                Inference Protocol
             </div>
          </div>
        </div>
      ),
    },
    {
      title: 'Architectural Framework',
      content: (
        <div className="grid md:grid-cols-2 gap-8 w-full max-w-5xl mx-auto">
          {[
            {
              icon: <Database className="w-10 h-10 text-purple-400" />,
              title: 'Labeled Data',
              description: 'Ground-truth datasets where each vector is paired with an explicit ground-truth target.',
            },
            {
              icon: <Activity className="w-10 h-10 text-teal-400" />,
              title: 'Gradient Descent',
              description: 'Optimization loop that minimizes error by navigating the multi-variate loss surface.',
            },
            {
              icon: <Brain className="w-10 h-10 text-pink-500" />,
              title: 'Feature Mapping',
              description: 'Automatic identification and extraction of high-dimensional predictive variables.',
            },
            {
              icon: <CheckCircle className="w-10 h-10 text-emerald-400" />,
              title: 'Validation Metrics',
              description: 'Rigorous cross-entropy and RMSE protocols to verify generalized model performance.',
            },
          ].map((concept, index) => (
            <motion.div whileHover={{ translateY: -10 }} key={index}>
              <Card className="p-8 bg-gray-900/40 border border-white/5 backdrop-blur-3xl hover:bg-gray-900/60 transition-all shadow-2xl">
                <div className="bg-black/40 p-4 w-fit rounded-2xl mb-6 shadow-inner">{concept.icon}</div>
                <h3 className="text-2xl font-black text-white mb-2 tracking-tight">{concept.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{concept.description}</p>
              </Card>
            </motion.div>
          ))}
        </div>
      ),
    }
  ];

  const handleNext = () => {
    if (currentSection < sections.length - 1) {
      setCurrentSection(currentSection + 1);
    } else {
      router.push('/supervised/algorithms');
    }
  };

  const handlePrev = () => {
    if (currentSection > 0) {
      setCurrentSection(currentSection - 1);
    } else {
      router.push('/');
    }
  };

  return (
    <div className="min-h-screen bg-[#020202] text-white flex flex-col items-center pb-20 overflow-hidden">
      <div className="max-w-7xl w-full mx-auto px-8 pt-24">
        {/* Navigation Bridge */}
        <div className="flex justify-between items-center mb-24 border-b border-white/5 pb-12">
          <button
            onClick={handlePrev}
            className="flex items-center gap-3 text-gray-500 hover:text-white transition-all group"
          >
            <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center group-hover:bg-purple-600/20">
               <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
            </div>
            <span className="text-[10px] font-black uppercase tracking-[0.4em]">
              {currentSection === 0 ? 'Home' : 'Previous'}
            </span>
          </button>

          <div className="flex gap-4">
            {sections.map((_, i) => (
               <div 
                 key={i} 
                 className={`h-1 rounded-full transition-all duration-700 ${currentSection === i ? 'w-16 bg-purple-500' : 'w-4 bg-gray-800'}`} 
               />
            ))}
          </div>

          <button
            onClick={handleNext}
            className="flex items-center gap-3 bg-purple-600 hover:bg-purple-700 px-8 py-3 rounded-2xl shadow-lg shadow-purple-500/20 text-white transition-all"
          >
            <span className="text-[10px] font-black uppercase tracking-[0.4em]">
               {currentSection === sections.length - 1 ? 'Go to Labs' : 'Next Phase'}
            </span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={currentSection}
            initial={{ opacity: 0, y: 30, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -30, scale: 1.02 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="w-full flex flex-col items-center"
          >
            <div className="text-center mb-16">
              <span className="text-purple-500 text-[10px] font-black uppercase tracking-[0.6em] mb-4 block">Research Phase 0{currentSection + 1}</span>
              <h1 className="text-7xl font-black tracking-tighter bg-clip-text text-transparent bg-gradient-to-b from-white to-gray-500 leading-tight">
                {sections[currentSection].title}
              </h1>
            </div>
            {sections[currentSection].content}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
