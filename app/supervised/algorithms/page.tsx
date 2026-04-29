'use client';

import { Brain, LineChart, GitBranch, ArrowLeft, Cpu, Activity, Database, LayoutGrid } from 'lucide-react';
import Link from 'next/link';
import { Card } from '@/components/ui/card';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';

export default function SupervisedAlgorithms() {
  const router = useRouter();

  const algorithms = [
    {
      title: 'Linear Regression',
      subtitle: 'Predictive Modeling',
      description: 'Predict continuous target variables using optimal linear hyperplane fitting.',
      icon: <LineChart className="w-8 h-8 text-blue-400" />,
      path: '/supervised/linear-regression',
    },
    {
      title: 'KNN',
      subtitle: 'Space-Based Classification',
      description: 'Find nearest neighbors in multi-dimensional vector space for classification.',
      icon: <LayoutGrid className="w-8 h-8 text-emerald-400" />,
      path: '/supervised/knn',
    },
    {
      title: 'Logistic Regression',
      subtitle: 'Binary Classification',
      description: 'Compute probabilities for binary outcomes using sigmoid activation functions.',
      icon: <Activity className="w-8 h-8 text-purple-400" />,
      path: '/supervised/logistic-regression',
    },
    {
      title: 'Naive Bayes',
      subtitle: 'Probabilistic Inference',
      description: 'Bayesian probability models for fast and efficient classification.',
      icon: <Database className="w-8 h-8 text-teal-400" />,
      path: '/supervised/naive-bayes',
    },
    {
      title: 'SVM',
      subtitle: 'Kernel-Based Analysis',
      description: 'Maximize hyperplane margins for high-dimensional support vector classification.',
      icon: <Cpu className="w-8 h-8 text-pink-500" />,
      path: '/supervised/svm',
    },
    {
      title: 'Decision Trees',
      subtitle: 'Heuristic Selection',
      description: 'Hierarchical decision logic using Gini impurity or Entropy metrics.',
      icon: <GitBranch className="w-8 h-8 text-amber-500" />,
      path: '/supervised/decision-trees',
    },
    {
      title: 'Random Forests',
      subtitle: 'Ensemble Aggregation',
      description: 'Parallel tree architectures using bootstrap samples to reduce variance.',
      icon: <Brain className="w-8 h-8 text-indigo-400" />,
      path: '/supervised/random-forests',
    },
    {
      title: 'Gradient Boosting',
      subtitle: 'Iterative Optimization',
      description: 'Sequential model optimization minimizing loss via gradient descent.',
      icon: <Brain className="w-8 h-8 text-orange-400" />,
      path: '/supervised/gradient-boosting',
    }
  ];

  return (
    <div className="min-h-screen bg-[#020202] text-white overflow-hidden pb-40 selection:bg-purple-500/30">
      {/* Background Decor */}
      <div className="fixed inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(168,85,247,0.05),transparent_40%)] pointer-events-none" />
      <div className="fixed inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.02] pointer-events-none" />
      
      <div className="max-w-7xl mx-auto px-10 pt-32 relative z-10">
        {/* Superior Header */}
        <div className="mb-24 flex flex-col md:flex-row items-start md:items-end justify-between border-b border-white/5 pb-16 gap-8">
          <div>
            <button
               onClick={() => router.push('/supervised/concepts')}
               className="flex items-center gap-4 text-gray-500 hover:text-white transition-all group mb-10 uppercase font-black text-[10px] tracking-[0.4em]"
            >
              <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/5 flex items-center justify-center group-hover:bg-purple-600/20 group-hover:border-purple-500/30">
                <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
              </div>
              Theory Protocol
            </button>
            <h1 className="text-5xl md:text-8xl font-black tracking-tighter text-white leading-none mb-6 uppercase italic break-words">
              Supervised <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-blue-500 not-italic">Laboratories</span>
            </h1>
            <p className="text-gray-500 text-xl font-light tracking-wide max-w-2xl leading-relaxed">
               Deploy and visualize high-performance patterns using labeled datasets. 
               Experience real-time neural convergence.
            </p>
          </div>
          <div className="hidden lg:block text-right">
             <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-emerald-500/5 border border-emerald-500/10 text-[10px] font-black uppercase tracking-[0.3em] text-emerald-500 mb-4">
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                Nodes Online
             </div>
             <div className="text-gray-600 font-mono text-xs uppercase tracking-widest">
                Latent_Space_Status: OPTIMIZED
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
                <Card className="h-full p-12 bg-[#050505] border border-white/5 backdrop-blur-3xl hover:border-purple-500/30 transition-all cursor-pointer shadow-2xl relative group overflow-hidden rounded-[2.5rem]">
                  <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-purple-500/10 to-transparent blur-[60px] opacity-0 group-hover:opacity-100 transition-opacity" />
                  
                  <div className="mb-10 w-20 h-20 flex items-center justify-center rounded-3xl bg-black border border-white/5 shadow-inner group-hover:scale-110 group-hover:border-purple-500/20 transition-all duration-500">
                    <div className="group-hover:scale-110 transition-transform duration-500">
                      {algo.icon}
                    </div>
                  </div>
                  
                  <div className="mb-10 relative z-10">
                     <span className="text-[10px] font-black text-purple-500/60 uppercase tracking-[0.4em] mb-2 block font-mono">{algo.subtitle}</span>
                     <h3 className="text-4xl font-black text-white mb-4 tracking-tight group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-purple-300 transition-all uppercase italic">
                        {algo.title}
                     </h3>
                     <p className="text-gray-500 text-sm leading-relaxed font-light group-hover:text-gray-400 transition-colors">
                        {algo.description}
                     </p>
                  </div>
                  
                  <div className="flex items-center gap-4 text-[10px] font-black uppercase tracking-[0.4em] text-white/10 group-hover:text-white transition-all">
                    Initialize Core <ArrowLeft className="w-4 h-4 rotate-180" />
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
