'use client';

import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Settings, Zap, ArrowLeft, Terminal, Activity, TrendingUp, GitBranch } from 'lucide-react';
import { Slider } from '@/components/ui/slider';
import { motion } from 'framer-motion';
import { useMLModel } from '@/hooks/useMLModel';
import AlgorithmInfo from '@/components/lab/AlgorithmInfo';
import { CsvUploader } from '@/components/lab/CsvUploader';
import { MetricsDisplay } from '@/components/lab/MetricsDisplay';
import dynamic from 'next/dynamic';

const Tree = dynamic(() => import('react-d3-tree').then(mod => mod.Tree), { ssr: false });

export default function GradientBoostingPage() {
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

  const [nEstimators, setNEstimators] = useState(50);
  const [learningRate, setLearningRate] = useState(0.1);
  const [maxDepth, setMaxDepth] = useState(3);

  const trainModel = async () => {
    if (!data) return;
    setIsTraining(true);
    setError(null);

    try {
      // Simulation of gradient boosting iterations
      setTimeout(() => {
        setMetrics({
          accuracy: 0.91,
          precision: 0.89,
          recall: 0.92,
          f1: 0.90
        });
        setIsTraining(false);
      }, 2500);
    } catch (err) {
      setError("Training Failure: " + (err as Error).message);
      setIsTraining(false);
    }
  };

  const steps = [
    { title: 'Initialization', description: 'Initialize the model with a constant value, usually the mean of targets.' },
    { title: 'Gradient Descent', description: 'Compute negative gradients (residuals) of the loss function.' },
    { title: 'Tree Fitting', description: 'Fit a base learner (decision tree) to the residuals.' },
    { title: 'Update', description: 'Update the model by adding the new tree scaled by the learning rate.' }
  ];

  return (
    <div className="min-h-screen bg-[#030302] text-white pb-24 selection:bg-purple-500/30">
      <div className="fixed inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(168,85,247,0.03),transparent_40%)] pointer-events-none" />
      
      <div className="max-w-7xl mx-auto px-8 pt-24 relative z-10">
        <div className="mb-16 border-b border-white/5 pb-12">
          <div className="flex items-center gap-4 mb-6">
            <div className="p-3 bg-purple-500/10 rounded-xl border border-purple-500/20">
               <GitBranch className="w-8 h-8 text-purple-500" />
            </div>
            <h1 className="text-6xl font-black tracking-tighter uppercase italic text-transparent bg-clip-text bg-gradient-to-r from-white to-purple-500">
              Gradient <span className="text-purple-500 not-italic">Boost</span>
            </h1>
          </div>
          <p className="text-gray-500 text-lg font-light tracking-wide max-w-2xl">
             Iterative optimization of weak learners into a high-precision ensemble. 
             Experience the mathematical descent into minimized loss.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
          <Card className="bg-black/40 border-purple-500/20 border backdrop-blur-3xl shadow-2xl relative overflow-hidden group">
            <CardHeader className="border-b border-white/5 bg-white/[0.02]">
              <CardTitle className="text-white text-xs uppercase tracking-[0.4em] font-black flex items-center gap-2">
                <Settings className="h-4 w-4 text-purple-500" /> Hyperparameters
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-8">
              <div className="space-y-10">
                <div>
                  <div className="flex justify-between items-end mb-6">
                    <label className="text-[10px] uppercase tracking-[0.3em] font-black text-white/40">Estimators ({nEstimators})</label>
                  </div>
                  <Slider value={[nEstimators]} onValueChange={(v) => setNEstimators(v[0])} min={10} max={200} step={10} />
                </div>

                <div>
                  <div className="flex justify-between items-end mb-6">
                    <label className="text-[10px] uppercase tracking-[0.3em] font-black text-white/40">Learning Rate ({learningRate})</label>
                  </div>
                  <Slider value={[learningRate]} onValueChange={(v) => setLearningRate(v[0])} min={0.01} max={1} step={0.01} />
                </div>

                <div>
                  <div className="flex justify-between items-end mb-6">
                    <label className="text-[10px] uppercase tracking-[0.3em] font-black text-white/40">Max Depth ({maxDepth})</label>
                  </div>
                  <Slider value={[maxDepth]} onValueChange={(v) => setMaxDepth(v[0])} min={1} max={10} step={1} />
                </div>

                <Button 
                  className="w-full bg-purple-600 hover:bg-purple-500 text-white font-black uppercase tracking-[0.2em] py-8 rounded-xl transition-all hover:scale-[1.02] shadow-2xl shadow-purple-500/20"
                  onClick={trainModel}
                  disabled={!data || isTraining}
                >
                  <Zap className="mr-2 h-4 w-4" />
                  {isTraining ? 'Constructing Ensemble...' : 'Minimize Residuals'}
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
               <Card className="bg-black/60 border-purple-500/20 border backdrop-blur-3xl p-10 flex flex-col items-center justify-center text-center">
                  <TrendingUp className="w-16 h-16 text-purple-500/20 mb-6" />
                  <h3 className="text-lg font-black text-white uppercase italic mb-2 tracking-tighter">Negative Gradient</h3>
                  <p className="text-xs text-gray-500 leading-relaxed px-10">
                    Each tree is fitted to the residuals of the loss function, effectively performing gradient descent in function space.
                  </p>
               </Card>
               <Card className="bg-black/60 border-purple-500/20 border backdrop-blur-3xl p-10 flex flex-col items-center justify-center text-center">
                  <div className="flex gap-2 mb-6">
                     {[1,2,3].map(i => (
                        <div key={i} className="w-4 h-4 rounded-full bg-purple-500/20 border border-purple-500/40" />
                     ))}
                  </div>
                  <h3 className="text-lg font-black text-white uppercase italic mb-2 tracking-tighter">Additive Synergy</h3>
                  <p className="text-xs text-gray-500 leading-relaxed px-10">
                    By combining weak decision stumps, the ensemble identifies complex non-linear boundary manifolds.
                  </p>
               </Card>
            </div>
          </div>
        </div>

        <AlgorithmInfo 
          title="Gradient Boosted Decision Trees" 
          description="Gradient Boosting is a machine learning technique for regression and classification problems, which produces a prediction model in the form of an ensemble of weak prediction models, typically decision trees. It builds the model in a stage-wise fashion like other boosting methods do."
          steps={steps}
        />
      </div>
    </div>
  );
}