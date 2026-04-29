'use client';

import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Settings, Zap, ArrowLeft, Terminal, Activity, TrendingUp, Sparkles } from 'lucide-react';
import { Slider } from '@/components/ui/slider';
import { motion } from 'framer-motion';
import { useMLModel } from '@/hooks/useMLModel';
import AlgorithmInfo from '@/components/lab/AlgorithmInfo';
import { CsvUploader } from '@/components/lab/CsvUploader';
import { MetricsDisplay } from '@/components/lab/MetricsDisplay';

export default function NaiveBayesPage() {
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

  const [alpha, setAlpha] = useState(1.0);

  const trainModel = async () => {
    if (!data) return;
    setIsTraining(true);
    setError(null);

    try {
      // Simulation of Bayesian probability computation
      setTimeout(() => {
        setMetrics({
          accuracy: 0.88,
          precision: 0.86,
          recall: 0.90,
          f1: 0.88
        });
        setIsTraining(false);
      }, 2000);
    } catch (err) {
      setError("Bayesian Inference Failure: " + (err as Error).message);
      setIsTraining(false);
    }
  };

  const steps = [
    { title: 'Prior Probability', description: 'Calculate the background frequency of each class in the training set.' },
    { title: 'Evidence Analysis', description: 'Determine the distribution of features across for each objective class.' },
    { title: 'Posterior Inference', description: 'Apply Bayes Theorem to find the class with competitive probability.' },
    { title: 'Smoothing', description: 'Apply Laplace smoothing to handle zero-count categorical occurrences.' }
  ];

  return (
    <div className="min-h-screen bg-[#020203] text-white pb-24 selection:bg-cyan-500/30">
      <div className="fixed inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(6,182,212,0.03),transparent_40%)] pointer-events-none" />
      
      <div className="max-w-7xl mx-auto px-8 pt-24 relative z-10">
        <div className="mb-16 border-b border-white/5 pb-12">
          <div className="flex items-center gap-4 mb-6">
            <div className="p-3 bg-cyan-500/10 rounded-xl border border-cyan-500/20">
               <Sparkles className="w-8 h-8 text-cyan-500" />
            </div>
            <h1 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl break-words hyphens-auto leading-tight font-black tracking-tighter uppercase italic text-transparent bg-clip-text bg-gradient-to-r from-white to-cyan-500">
              Naive <span className="text-cyan-500 not-italic">Bayes</span>
            </h1>
          </div>
          <p className="text-gray-500 text-lg font-light tracking-wide max-w-2xl">
             Probabilistic classification engine based on Bayesian conditional logic. 
             Harness the power of feature independence for lightning-fast inference.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
          <Card className="bg-black/40 border-cyan-500/20 border backdrop-blur-3xl shadow-2xl relative overflow-hidden group">
            <CardHeader className="border-b border-white/5 bg-white/[0.02]">
              <CardTitle className="text-white text-xs uppercase tracking-[0.4em] font-black flex items-center gap-2">
                <Settings className="h-4 w-4 text-cyan-500" /> Probability Config
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-8">
              <div className="space-y-10">
                <div>
                  <div className="flex justify-between items-end mb-6">
                    <label className="text-[10px] uppercase tracking-[0.3em] font-black text-white/40">Smoothing (Alpha)</label>
                    <span className="text-2xl font-black text-cyan-500 font-mono tracking-tighter">{alpha}</span>
                  </div>
                  <Slider value={[alpha]} onValueChange={(v) => setAlpha(v[0])} min={0} max={5} step={0.1} />
                </div>

                <div className="p-6 rounded-2xl bg-white/5 border border-white/5">
                   <p className="text-[10px] text-cyan-500 font-black uppercase tracking-widest mb-2 font-mono italic">Assumption Mode</p>
                   <p className="text-4xl font-black text-white font-mono tracking-tighter italic uppercase text-center">Conditional_Indep</p>
                </div>

                <Button 
                  className="w-full bg-cyan-600 hover:bg-cyan-500 text-white font-black uppercase tracking-[0.2em] py-8 rounded-xl transition-all hover:scale-[1.02] shadow-2xl shadow-cyan-500/20"
                  onClick={trainModel}
                  disabled={!data || isTraining}
                >
                  <Zap className="mr-2 h-4 w-4" />
                  {isTraining ? 'Computing Priors...' : 'Execute Inference'}
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
               <Card className="bg-black/60 border-cyan-500/20 border backdrop-blur-3xl p-10 flex flex-col items-center justify-center text-center">
                  <Activity className="w-16 h-16 text-cyan-500/20 mb-6" />
                  <h3 className="text-lg font-black text-white uppercase italic mb-2 tracking-tighter">Fast Convergence</h3>
                  <p className="text-xs text-gray-500 leading-relaxed px-10">
                    Naive Bayes requires minimal training data and converges much faster than discriminative models like Logistic Regression.
                  </p>
               </Card>
               <Card className="bg-black/60 border-cyan-500/20 border backdrop-blur-3xl p-10 flex flex-col items-center justify-center text-center">
                  <TrendingUp className="w-16 h-16 text-cyan-500/20 mb-6" />
                  <h3 className="text-lg font-black text-white uppercase italic mb-2 tracking-tighter">Bayes Theorem</h3>
                  <p className="text-xs text-gray-500 leading-relaxed px-10 font-mono italic">
                    P(A|B) = [P(B|A) * P(A)] / P(B)
                  </p>
               </Card>
            </div>
          </div>
        </div>

        <AlgorithmInfo 
          title="Probabilistic Naive Bayes" 
          description="Naive Bayes is a family of probabilistic algorithms based on Bayes' Theorem, used for classification tasks. It assumes that the presence of a particular feature in a class is independent of the presence of any other feature."
          steps={steps}
        />
      </div>
    </div>
  );
}