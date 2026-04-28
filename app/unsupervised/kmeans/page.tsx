'use client';

import { Boxes } from 'lucide-react';
import dynamic from 'next/dynamic';
import AlgorithmInfo from '@/components/lab/AlgorithmInfo';

const InteractiveKMeans = dynamic(
  () => import('@/components/lab/InteractiveKMeans').then(mod => mod.InteractiveKMeans),
  { ssr: false }
);

const KMeansPage = () => {

  const kmeansSteps = [
    {
      title: 'Centroid Initialization',
      description: 'Randomly place K initial centroids in the data space.'
    },
    {
      title: 'Cluster Assignment',
      description: 'Assign each data point to the nearest centroid based on Euclidean distance.'
    },
    {
      title: 'Mean Recalculation',
      description: 'Move centroids to the geometric center (mean) of their assigned points.'
    }
  ];

  return (
    <div className="min-h-screen bg-[#020202] text-white pb-24">
      <div className="fixed inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(168,85,247,0.03),transparent_40%)] pointer-events-none" />
      
      <div className="max-w-7xl mx-auto px-8 pt-24 relative z-10">
        <div className="mb-16 border-b border-white/5 pb-12">
          <div className="flex items-center gap-4 mb-6">
            <div className="p-3 bg-purple-500/10 rounded-xl border border-purple-500/20">
               <Boxes className="w-8 h-8 text-purple-400" />
            </div>
            <h1 className="text-6xl font-black tracking-tighter uppercase italic text-transparent bg-clip-text bg-gradient-to-r from-white to-purple-500">
              K-Means <span className="text-purple-500 not-italic">Clustering</span>
            </h1>
          </div>
          <p className="text-gray-500 text-lg font-light tracking-wide max-w-2xl">
             Explore partition-based clustering via iterative centroid optimization. 
             Visualize the convergence of spatial heuristics in high-fidelity.
          </p>
        </div>

        <div className="mb-16">
          <InteractiveKMeans />
        </div>

        <AlgorithmInfo 
          title="K-Means Partitioning"
          description="K-Means is a vector quantization method that aims to partition n observations into k clusters in which each observation belongs to the cluster with the nearest mean."
          steps={kmeansSteps}
        />
      </div>
    </div>
  );
};

export default KMeansPage;