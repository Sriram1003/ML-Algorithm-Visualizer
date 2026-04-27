'use client';

import { useState } from 'react';
import { ScatterChart, Grid, Layers, BookOpen, ArrowLeft, ArrowRight, Network, ZoomIn } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';

export default function UnsupervisedConcepts() {
  const [currentSection, setCurrentSection] = useState(0);
  const router = useRouter();

  const sections = [
    {
      title: 'Autonomous Pattern Discovery',
      content: (
        <div className="text-center">
          <motion.div 
            initial={{ rotate: -10, opacity: 0 }}
            animate={{ rotate: 0, opacity: 1 }}
            transition={{ duration: 1 }}
          >
            <Network size={120} className="mx-auto mb-10 text-teal-500 drop-shadow-[0_0_20px_rgba(20,184,166,0.4)]" />
          </motion.div>
          <p className="text-2xl text-teal-100 mb-10 max-w-3xl mx-auto font-light leading-relaxed">
            Unsupervised learning architectures operate on <span className="text-teal-400 font-bold">Unlabeled Datasets</span>. 
            The objective is the autonomous discovery of <span className="text-teal-500 font-black text-3xl italic block my-4 uppercase tracking-[0.2em]">Hidden Structures</span> 
            without predefined human intervention or classification.
          </p>
          <div className="flex justify-center gap-6">
             <div className="px-4 py-1 border border-teal-500/20 rounded-full text-[10px] text-teal-500 font-black uppercase tracking-widest">
                Pattern Matrix
             </div>
             <div className="px-4 py-1 border border-teal-500/20 rounded-full text-[10px] text-teal-500 font-black uppercase tracking-widest">
                Data Clustery
             </div>
          </div>
        </div>
      ),
    },
    {
      title: 'Structural Methodologies',
      content: (
        <div className="grid md:grid-cols-2 gap-8 w-full max-w-5xl mx-auto">
          {[
            {
              icon: <BookOpen className="w-10 h-10 text-teal-400" />,
              title: 'Unlabeled Vectors',
              description: 'Input streams devoid of target classifications or explicit categories.',
            },
            {
              icon: <Layers className="w-10 h-10 text-blue-400" />,
              title: 'Centroid Clustering',
              description: 'Grouping similar topological data points into dense geometric clusters.',
            },
            {
              icon: <ScatterChart className="w-10 h-10 text-cyan-400" />,
              title: 'Feature Compression',
              description: 'Projecting high-dimensional data onto lower subspaces while preserving variance.',
            },
            {
              icon: <Grid className="w-10 h-10 text-emerald-400" />,
              title: 'Density Analysis',
              description: 'Identifying structural anomalies and intrinsic data hierarchies.',
            },
          ].map((concept, index) => (
            <motion.div whileHover={{ scale: 1.02 }} key={index}>
              <Card className="p-8 bg-gray-950/60 border border-teal-500/10 backdrop-blur-3xl hover:border-teal-400/30 transition-all shadow-2xl h-full">
                <div className="bg-teal-950/20 p-4 w-fit rounded-2xl mb-6 shadow-inner">{concept.icon}</div>
                <h3 className="text-2xl font-black text-white mb-2 tracking-tight uppercase">{concept.title}</h3>
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
      router.push('/unsupervised/algorithms');
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
    <div className="min-h-screen bg-[#010a0a] text-white flex flex-col items-center pb-20 overflow-hidden">
      <div className="max-w-7xl w-full mx-auto px-8 pt-24">
        {/* Navigation Core */}
        <div className="flex justify-between items-center mb-24 border-b border-teal-500/10 pb-12">
          <button
            onClick={handlePrev}
            className="flex items-center gap-3 text-gray-600 hover:text-teal-400 transition-all group"
          >
            <div className="w-12 h-12 rounded-2xl bg-teal-900/10 flex items-center justify-center group-hover:bg-teal-500/20">
               <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
            </div>
            <span className="text-[10px] font-black uppercase tracking-[0.4em]">
              {currentSection === 0 ? 'Home' : 'Back'}
            </span>
          </button>

          <div className="flex gap-4">
            {sections.map((_, i) => (
               <div 
                 key={i} 
                 className={`h-1 rounded-full transition-all duration-700 ${currentSection === i ? 'w-16 bg-teal-500' : 'w-4 bg-teal-900/40'}`} 
               />
            ))}
          </div>

          <button
            onClick={handleNext}
            className="flex items-center gap-3 bg-teal-600 hover:bg-teal-700 px-8 py-3 rounded-2xl shadow-lg shadow-teal-500/20 text-white transition-all"
          >
            <span className="text-[10px] font-black uppercase tracking-[0.4em]">
               {currentSection === sections.length - 1 ? 'Compute Lab' : 'System Sync'}
            </span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={currentSection}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="w-full flex flex-col items-center"
          >
            <div className="text-center mb-16">
              <span className="text-teal-500 text-[10px] font-black uppercase tracking-[0.6em] mb-4 block">Unsupervised Interface_{currentSection + 1}</span>
              <h1 className="text-7xl font-black tracking-tighter bg-clip-text text-transparent bg-gradient-to-b from-white to-teal-900/40 leading-tight uppercase">
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
