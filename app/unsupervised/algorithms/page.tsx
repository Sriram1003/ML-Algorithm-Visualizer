'use client';

import { ScatterChart, Grid, Layers, ArrowLeft, Network, ZoomIn, Boxes, Binary } from 'lucide-react';
import Link from 'next/link';
import { Card } from '@/components/ui/card';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';

export default function UnsupervisedAlgorithms() {
  const router = useRouter();

  const algorithms = [
    {
      title: 'K-Means',
      subtitle: 'Centroid Clustering',
      description: 'Partition data into distinct groups based on recursive centroid optimization.',
      icon: <Grid className="w-8 h-8 text-teal-400" />,
      path: '/unsupervised/kmeans',
    },
    {
      title: 'DBSCAN',
      subtitle: 'Density Clustering',
      description: 'Discover clusters of arbitrary shapes using high-density connectivity analysis.',
      icon: <ScatterChart className="w-8 h-8 text-cyan-400" />,
      path: '/unsupervised/dbscan',
    },
    {
      title: 'Hierarchical',
      subtitle: 'Agglomerative Linkage',
      description: 'Build tree-like nested structures of data relationships via proximity linkage.',
      icon: <Layers className="w-8 h-8 text-blue-400" />,
      path: '/unsupervised/hierarchical-clustering',
    },
    {
      title: 'PCA',
      subtitle: 'Feature Compression',
      description: 'Linear dimensionality reduction projecting data onto principal subspaces.',
      icon: <Boxes className="w-8 h-8 text-emerald-400" />,
      path: '/unsupervised/pca',
    },
    {
      title: 't-SNE',
      subtitle: 'Probability Mapping',
      description: 'Non-linear embedding preserving local neighborhoods for cluster visualization.',
      icon: <Network className="w-8 h-8 text-indigo-400" />,
      path: '/unsupervised/t-sne',
    },
    {
      title: 'UMAP',
      subtitle: 'Topological Learning',
      description: 'Fast manifold learning technique preserving global data structure across projections.',
      icon: <Binary className="w-8 h-8 text-pink-400" />,
      path: '/unsupervised/umap',
    },
  ];

  return (
    <div className="min-h-screen bg-[#010a0a] text-white pb-40 overflow-hidden selection:bg-teal-500/30">
      {/* Background Decor */}
      <div className="fixed inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(20,184,166,0.05),transparent_40%)] pointer-events-none" />
      <div className="fixed inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.02] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-10 pt-32 relative z-10">
        {/* Unsupervised Header */}
        <div className="mb-24 flex flex-col md:flex-row items-start md:items-end justify-between border-b border-teal-500/10 pb-16 gap-8">
          <div>
            <button
               onClick={() => router.push('/unsupervised/concepts')}
               className="flex items-center gap-4 text-gray-500 hover:text-teal-400 transition-all group mb-10 uppercase font-black text-[10px] tracking-[0.4em]"
            >
              <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/5 flex items-center justify-center group-hover:bg-teal-500/20 group-hover:border-teal-500/30">
                <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
              </div>
              Research Theory
            </button>
            <h1 className="text-8xl font-black tracking-tighter text-white leading-none mb-6 uppercase italic">
              Discovery <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-emerald-500 not-italic">Engine</span>
            </h1>
            <p className="text-gray-500 text-xl font-light tracking-wide max-w-2xl leading-relaxed">
               Uncover hidden structures through autonomous geometric analysis. 
               Experience latent space projection in real-time.
            </p>
          </div>
          <div className="hidden lg:block text-right">
             <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-teal-500/5 border border-teal-500/10 text-[10px] font-black uppercase tracking-[0.3em] text-teal-400 mb-4">
                <div className="w-2 h-2 rounded-full bg-teal-500 animate-pulse"></div>
                Heuristics Online
             </div>
             <div className="text-gray-600 font-mono text-xs uppercase tracking-widest">
                Topology_Sync: ESTABLISHED
             </div>
          </div>
        </div>

        {/* Discovery Mesh */}
        <motion.div
           initial={{ opacity: 0, x: -40 }}
           animate={{ opacity: 1, x: 0 }}
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
                <Card className="h-full p-12 bg-[#050505] border border-teal-500/5 backdrop-blur-3xl hover:border-teal-400/30 transition-all cursor-pointer shadow-2xl relative group overflow-hidden rounded-[2.5rem]">
                  <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-teal-500/10 to-transparent blur-[60px] opacity-0 group-hover:opacity-100 transition-opacity" />
                  
                  <div className="mb-10 w-20 h-20 flex items-center justify-center rounded-3xl bg-black border border-white/5 shadow-inner group-hover:scale-110 group-hover:border-teal-500/20 transition-all duration-500">
                    <div className="group-hover:scale-110 transition-transform duration-500">
                      {algo.icon}
                    </div>
                  </div>
                  
                  <div className="mb-10 relative z-10">
                     <span className="text-[10px] font-black text-teal-500/60 uppercase tracking-[0.4em] mb-2 block font-mono">{algo.subtitle}</span>
                     <h3 className="text-4xl font-black text-white mb-4 tracking-tight group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-teal-300 transition-all uppercase italic">
                        {algo.title}
                     </h3>
                     <p className="text-gray-500 text-sm leading-relaxed font-light group-hover:text-gray-400 transition-colors">
                        {algo.description}
                     </p>
                  </div>
                  
                  <div className="flex items-center gap-4 text-[10px] font-black uppercase tracking-[0.4em] text-white/10 group-hover:text-teal-400 transition-all">
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
