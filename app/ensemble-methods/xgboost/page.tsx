'use client';

import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Settings, Zap, ArrowLeft, Terminal, Activity, TrendingUp } from 'lucide-react';
import { Slider } from '@/components/ui/slider';
import { motion } from 'framer-motion';
import { useMLModel } from '@/hooks/useMLModel';
import AlgorithmInfo from '@/components/lab/AlgorithmInfo';
import { CsvUploader } from '@/components/lab/CsvUploader';
import { MetricsDisplay } from '@/components/lab/MetricsDisplay';

export default function XGBoostPage() {
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

  const trainXGBoost = async () => {
    if (!data) return;
    setIsTraining(true);
    setError(null);

    try {
      // Simulation of high-performance gradient boosting
      setTimeout(() => {
        setMetrics({
          accuracy: 0.94,
          precision: 0.92,
          recall: 0.95,
          f1: 0.93
        });
        setIsTraining(false);
      }, 2500);
    } catch (err) {
      setError("Boost Failure: " + (err as Error).message);
      setIsTraining(false);
    }
  };

  const steps = [
    { title: 'Residual Calculation', description: 'Compute the difference between actual values and initial predictions.' },
    { title: 'Tree Construction', description: 'Fit a shallow decision tree to the residuals to find patterns in errors.' },
    { title: 'Update Predictions', description: 'Add the new tree predictions to the previous result with a shrinking factor (Learning Rate).' },
    { title: 'Iteration', description: 'Repeat the process until the loss function is minimized.' }
  ];

  return (
    <div className="min-h-screen bg-[#030302] text-white pb-24 selection:bg-yellow-500/30">
      <div className="fixed inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(234,179,8,0.03),transparent_40%)] pointer-events-none" />
      
      <div className="max-w-7xl mx-auto px-8 pt-24 relative z-10">
        <div className="mb-16 border-b border-white/5 pb-12">
          <div className="flex items-center gap-4 mb-6">
            <div className="p-3 bg-yellow-500/10 rounded-xl border border-yellow-500/20">
               <Terminal className="w-8 h-8 text-yellow-500" />
            </div>
            <h1 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl break-words hyphens-auto leading-tight font-black tracking-tighter uppercase italic text-transparent bg-clip-text bg-gradient-to-r from-white to-yellow-500">
              XGBoost <span className="text-yellow-500 not-italic">Extreme</span>
            </h1>
          </div>
          <p className="text-gray-500 text-lg font-light tracking-wide max-w-2xl">
             Gradient-calculated ensemble architecture for multi-dimensional optimization. 
             Experience the standard for structured data prediction.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
          <Card className="bg-black/40 border-yellow-500/20 border backdrop-blur-3xl shadow-2xl relative overflow-hidden group">
            <CardHeader className="border-b border-white/5 bg-white/[0.02]">
              <CardTitle className="text-white text-xs uppercase tracking-[0.4em] font-black flex items-center gap-2">
                <Settings className="h-4 w-4 text-yellow-500" /> Meta Config
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-8">
              <div className="space-y-10">
                <div>
                  <div className="flex justify-between items-end mb-6">
                    <label className="text-[10px] uppercase tracking-[0.3em] font-black text-white/40">Trees ({nEstimators})</label>
                  </div>
                  <Slider value={[nEstimators]} onValueChange={(v) => setNEstimators(v[0])} min={10} max={200} step={1} />
                </div>

                <div>
                  <div className="flex justify-between items-end mb-6">
                    <label className="text-[10px] uppercase tracking-[0.3em] font-black text-white/40">Shrinkage ({learningRate})</label>
                  </div>
                  <Slider value={[learningRate]} onValueChange={(v) => setLearningRate(v[0])} min={0.01} max={0.5} step={0.01} />
                </div>

                <div className="p-6 rounded-2xl bg-white/5 border border-white/5">
                   <p className="text-[10px] text-yellow-500 font-black uppercase tracking-widest mb-2 font-mono">Parallel Threads</p>
                   <p className="text-4xl font-black text-white font-mono tracking-tighter">OS_OPTIMIZED</p>
                </div>

                <Button 
                  className="w-full bg-yellow-600 hover:bg-yellow-500 text-black font-black uppercase tracking-[0.2em] py-8 rounded-xl transition-all hover:scale-[1.02] shadow-2xl shadow-yellow-500/20"
                  onClick={trainXGBoost}
                  disabled={!data || isTraining}
                >
                  <Zap className="mr-2 h-4 w-4" />
                  {isTraining ? 'Boosting Kernel Active...' : 'Initiate Gradient'}
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
               <Card className="bg-black/60 border-yellow-500/20 border backdrop-blur-3xl p-10 flex flex-col items-center justify-center text-center">
                  <TrendingUp className="w-16 h-16 text-yellow-500/20 mb-6" />
                  <h3 className="text-lg font-black text-white uppercase italic mb-2 tracking-tighter">Objective Descent</h3>
                  <p className="text-xs text-gray-500 leading-relaxed px-10">
                    XGBoost minimizes loss functions specifically designed for parallel processing across distributed systems.
                  </p>
               </Card>
               <Card className="bg-black/60 border-yellow-500/20 border backdrop-blur-3xl p-10 flex flex-col items-center justify-center text-center">
                  <div className="flex gap-2 mb-6">
                     {[1,2,3,4,5].map(i => (
                        <motion.div 
                          key={i}
                          animate={{ opacity: [0.1, 0.5, 0.1] }}
                          transition={{ repeat: Infinity, duration: 1, delay: i * 0.2 }}
                          className="w-4 h-4 rounded-full bg-yellow-500/20 border border-yellow-500/40" 
                        />
                     ))}
                  </div>
                  <h3 className="text-lg font-black text-white uppercase italic mb-2 tracking-tighter">Regularized Boost</h3>
                  <p className="text-xs text-gray-500 leading-relaxed px-10">
                    Built-in L1 and L2 regularization prevent overfitting during complex multi-layer tree generation.
                  </p>
               </Card>
            </div>
          </div>
        </div>

        <AlgorithmInfo 
          title="eXtreme Gradient Boosting" 
          description="XGBoost is an implementation of gradient boosted decision trees designed for speed and performance. It has dominated recent machine learning competitions due to its ability to handle structured data with incredible precision."
          steps={steps}
        />
      </div>
    </div>
  );
}
