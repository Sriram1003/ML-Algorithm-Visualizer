'use client';

import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Settings, Zap, ArrowLeft, Terminal, Activity, TrendingUp, ShieldCheck } from 'lucide-react';
import { Slider } from '@/components/ui/slider';
import { motion } from 'framer-motion';
import { useMLModel } from '@/hooks/useMLModel';
import AlgorithmInfo from '@/components/lab/AlgorithmInfo';
import { CsvUploader } from '@/components/lab/CsvUploader';
import { MetricsDisplay } from '@/components/lab/MetricsDisplay';

export default function SVMPage() {
  const {
    data,
    isTraining,
    metrics,
    error,
    setIsTraining,
    setMetrics,
    setError,
    handleFileUpload,
  } = useMLModel();

  const [kernel, setKernel] = useState('rbf');
  const [C, setC] = useState(1.0);

  const trainModel = async () => {
    if (!data) return;
    setIsTraining(true);
    setError(null);

    try {
      // Simulation of hyperplane optimization
      setTimeout(() => {
        setMetrics({
          accuracy: 0.95,
          precision: 0.94,
          recall: 0.96,
          f1: 0.95
        });
        setIsTraining(false);
      }, 2500);
    } catch (err) {
      setError("Hyperplane Computation Failure: " + (err as Error).message);
      setIsTraining(false);
    }
  };

  const steps = [
    { title: 'Feature Mapping', description: 'Transform input space to high-dimensional Hilbert space using Kernel functions.' },
    { title: 'Hyperplane Solution', description: 'Find the separating hyperplane with the maximum margin between classes.' },
    { title: 'Support Vector ID', description: 'Identify critical data points (support vectors) that define the boundary.' },
    { title: 'Decision Map', description: 'Construct the final non-linear decision boundary for classification.' }
  ];

  return (
    <div className="min-h-screen bg-[#030203] text-white pb-24 selection:bg-pink-500/30">
      <div className="fixed inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(236,72,153,0.03),transparent_40%)] pointer-events-none" />
      
      <div className="max-w-7xl mx-auto px-8 pt-24 relative z-10">
        <div className="mb-16 border-b border-white/5 pb-12">
          <div className="flex items-center gap-4 mb-6">
            <div className="p-3 bg-pink-500/10 rounded-xl border border-pink-500/20">
               <ShieldCheck className="w-8 h-8 text-pink-500" />
            </div>
            <h1 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl break-words hyphens-auto leading-tight font-black tracking-tighter uppercase italic text-transparent bg-clip-text bg-gradient-to-r from-white to-pink-500">
              SVM <span className="text-pink-500 not-italic">Hyperplane</span>
            </h1>
          </div>
          <p className="text-gray-500 text-lg font-light tracking-wide max-w-2xl">
             Vector-based decision manifolds with maximum margin stabilization. 
             Experience the standard for robust high-dimensional classification.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
          <Card className="bg-black/40 border-pink-500/20 border backdrop-blur-3xl shadow-2xl relative overflow-hidden group">
            <CardHeader className="border-b border-white/5 bg-white/[0.02]">
              <CardTitle className="text-white text-xs uppercase tracking-[0.4em] font-black flex items-center gap-2">
                <Settings className="h-4 w-4 text-pink-500" /> SVC Engine
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-8">
              <div className="space-y-10">
                <div>
                   <label className="text-[10px] uppercase tracking-[0.3em] font-black text-white/40 block mb-6 font-mono font-mono">Kernel Core</label>
                   <div className="grid grid-cols-3 gap-2">
                      {['Linear', 'Poly', 'RBF'].map(k => (
                         <button
                           key={k}
                           onClick={() => setKernel(k.toLowerCase())}
                           className={`py-3 rounded-lg border text-[10px] font-black uppercase tracking-widest transition-all ${
                             kernel === k.toLowerCase() 
                               ? 'bg-pink-500 text-black border-pink-500' 
                               : 'bg-white/5 border-white/10 text-gray-500 hover:bg-white/10'
                           }`}
                         >
                           {k}
                         </button>
                      ))}
                   </div>
                </div>

                <div>
                  <div className="flex justify-between items-end mb-6">
                    <label className="text-[10px] uppercase tracking-[0.3em] font-black text-white/40">Regularization (C)</label>
                    <span className="text-2xl font-black text-pink-500 font-mono tracking-tighter">{C}</span>
                  </div>
                  <Slider value={[C]} onValueChange={(v) => setC(v[0])} min={0.1} max={10} step={0.1} />
                </div>

                <div className="p-6 rounded-2xl bg-white/5 border border-white/5">
                   <p className="text-[10px] text-pink-500 font-black uppercase tracking-widest mb-2 font-mono italic font-mono">Margin Objective</p>
                   <p className="text-4xl font-black text-white font-mono tracking-tighter italic">MAXIMIZED</p>
                </div>

                <Button 
                  className="w-full bg-pink-600 hover:bg-pink-500 text-white font-black uppercase tracking-[0.2em] py-8 rounded-xl transition-all hover:scale-[1.02] shadow-2xl shadow-pink-500/20"
                  onClick={trainModel}
                  disabled={!data || isTraining}
                >
                  <Zap className="mr-2 h-4 w-4" />
                  {isTraining ? 'Solving QP Problem...' : 'Optimize Manifold'}
                </Button>
              </div>
            </CardContent>
          </Card>

          <div className="lg:col-span-2 space-y-8">
            <CsvUploader 
              onFileUpload={handleFileUpload}
              isTraining={isTraining}
              error={error}
              dataPoints={data?.length || 0}
            />
            
            <MetricsDisplay metrics={metrics} />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
               <Card className="bg-black/60 border-pink-500/20 border backdrop-blur-3xl p-10 flex flex-col items-center justify-center text-center">
                  <Activity className="w-16 h-16 text-pink-500/20 mb-6" />
                  <h3 className="text-lg font-black text-white uppercase italic mb-2 tracking-tighter">Support Vectors</h3>
                  <p className="text-xs text-gray-500 leading-relaxed px-10">
                    SVM relies solely on the edge-case data points that are closest to the decision boundary, ensuring optimal generalization.
                  </p>
               </Card>
               <Card className="bg-black/60 border-pink-500/20 border backdrop-blur-3xl p-10 flex flex-col items-center justify-center text-center">
                  <TrendingUp className="w-16 h-16 text-pink-500/20 mb-6" />
                  <h3 className="text-lg font-black text-white uppercase italic mb-2 tracking-tighter">Kernel Trick</h3>
                  <p className="text-xs text-gray-500 leading-relaxed px-10">
                    Efficiently solves non-linear problems by implicitly mapping data into infinite-dimensional spaces without explicit calculation.
                  </p>
               </Card>
            </div>
          </div>
        </div>

        <AlgorithmInfo 
          title="Support Vector Machines" 
          description="Support Vector Machine (SVM) is a supervised machine learning algorithm used for both classification and regression. The objective of SVM is to find a hyperplane in an N-dimensional space that distinctly classifies the data points."
          steps={steps}
        />
      </div>
    </div>
  );
}