'use client';

import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Settings, Zap, ArrowLeft, Terminal, Activity, TrendingUp, Trees } from 'lucide-react';
import { Slider } from '@/components/ui/slider';
import { motion } from 'framer-motion';
import { useMLModel } from '@/hooks/useMLModel';
import AlgorithmInfo from '@/components/lab/AlgorithmInfo';
import { CsvUploader } from '@/components/lab/CsvUploader';
import { MetricsDisplay } from '@/components/lab/MetricsDisplay';

export default function RandomForestPage() {
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

  const [nEstimators, setNEstimators] = useState(100);
  const [maxDepth, setMaxDepth] = useState(5);

  const trainModel = async () => {
    if (!data) return;
    setIsTraining(true);
    setError(null);

    try {
      // Simulation of parallel forest growth
      setTimeout(() => {
        setMetrics({
          accuracy: 0.93,
          precision: 0.91,
          recall: 0.94,
          f1: 0.92
        });
        setIsTraining(false);
      }, 3000);
    } catch (err) {
      setError("Forest Growth Failure: " + (err as Error).message);
      setIsTraining(false);
    }
  };

  const steps = [
    { title: 'Bootstrapping', description: 'Create multiple random subsets of the data using sampling with replacement.' },
    { title: 'Feature Selection', description: 'Select a random subset of features at each split to ensure tree diversity.' },
    { title: 'Tree Construction', description: 'Build deep decision trees on each bootstrap sample independently.' },
    { title: 'Assembly', description: 'Aggregate predictions from all trees using majority voting for robust classification.' }
  ];

  return (
    <div className="min-h-screen bg-[#020302] text-white pb-24 selection:bg-emerald-500/30">
      <div className="fixed inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(16,185,129,0.03),transparent_40%)] pointer-events-none" />
      
      <div className="max-w-7xl mx-auto px-8 pt-24 relative z-10">
        <div className="mb-16 border-b border-white/5 pb-12">
          <div className="flex items-center gap-4 mb-6">
            <div className="p-3 bg-emerald-500/10 rounded-xl border border-emerald-500/20">
               <Trees className="w-8 h-8 text-emerald-500" />
            </div>
            <h1 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl break-words hyphens-auto leading-tight font-black tracking-tighter uppercase italic text-transparent bg-clip-text bg-gradient-to-r from-white to-emerald-500">
              Random <span className="text-emerald-500 not-italic">Forest</span>
            </h1>
          </div>
          <p className="text-gray-500 text-lg font-light tracking-wide max-w-2xl">
             Parallel ensemble of decorrelated decision trees. 
             Harness the collective wisdom of multiple random learners for ultra-stable predictions.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
          <Card className="bg-black/40 border-emerald-500/20 border backdrop-blur-3xl shadow-2xl relative overflow-hidden group">
            <CardHeader className="border-b border-white/5 bg-white/[0.02]">
              <CardTitle className="text-white text-xs uppercase tracking-[0.4em] font-black flex items-center gap-2">
                <Settings className="h-4 w-4 text-emerald-500" /> Ensemble Config
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-8">
              <div className="space-y-10">
                <div>
                  <div className="flex justify-between items-end mb-6">
                    <label className="text-[10px] uppercase tracking-[0.3em] font-black text-white/40">Tree Count ({nEstimators})</label>
                  </div>
                  <Slider value={[nEstimators]} onValueChange={(v) => setNEstimators(v[0])} min={10} max={200} step={10} />
                </div>

                <div>
                  <div className="flex justify-between items-end mb-6">
                    <label className="text-[10px] uppercase tracking-[0.3em] font-black text-white/40">Growth Depth ({maxDepth})</label>
                  </div>
                  <Slider value={[maxDepth]} onValueChange={(v) => setMaxDepth(v[0])} min={1} max={20} step={1} />
                </div>

                <div className="p-6 rounded-2xl bg-white/5 border border-white/5">
                   <p className="text-[10px] text-emerald-500 font-black uppercase tracking-widest mb-2 font-mono">Parallelization</p>
                   <p className="text-4xl font-black text-white font-mono tracking-tighter italic">N_JOBS = -1</p>
                </div>

                <Button 
                  className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-black uppercase tracking-[0.2em] py-8 rounded-xl transition-all hover:scale-[1.02] shadow-2xl shadow-emerald-500/20"
                  onClick={trainModel}
                  disabled={!data || isTraining}
                >
                  <Zap className="mr-2 h-4 w-4" />
                  {isTraining ? 'Growing Forest...' : 'Initialize Parallel Grow'}
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
               <Card className="bg-black/60 border-emerald-500/20 border backdrop-blur-3xl p-10 flex flex-col items-center justify-center text-center text-center">
                  <div className="grid grid-cols-3 gap-1 mb-6">
                     {[1,2,3,4,5,6,7,8,9].map(i => (
                        <motion.div 
                          key={i}
                          animate={{ scale: [1, 1.2, 1], opacity: [0.2, 0.5, 0.2] }}
                          transition={{ repeat: Infinity, duration: 2, delay: i * 0.1 }}
                          className="w-3 h-3 rounded-sm bg-emerald-500/30" 
                        />
                     ))}
                  </div>
                  <h3 className="text-lg font-black text-white uppercase italic mb-2 tracking-tighter">Wisdom of Crowds</h3>
                  <p className="text-xs text-gray-500 leading-relaxed px-10">
                    By averaging many uncorrelated trees, the forest reduces variance significantly more than any single learner.
                  </p>
               </Card>
               <Card className="bg-black/60 border-emerald-500/20 border backdrop-blur-3xl p-10 flex flex-col items-center justify-center text-center">
                  <Activity className="w-16 h-16 text-emerald-500/20 mb-6" />
                  <h3 className="text-lg font-black text-white uppercase italic mb-2 tracking-tighter">Feature Bagging</h3>
                  <p className="text-xs text-gray-500 leading-relaxed px-10">
                    Random sub-selection of features at each split prevents strong predictors from dominating every tree.
                  </p>
               </Card>
            </div>
          </div>
        </div>

        <AlgorithmInfo 
          title="Random Forest Ensembles" 
          description="Random Forest is a classifier that evolved from decision trees. It actually consists of several decision trees and it's using bagging and feature randomness when building each individual tree to try to create an uncorrelated forest of trees whose prediction by committee is more accurate than that of any individual tree."
          steps={steps}
        />
      </div>
    </div>
  );
}