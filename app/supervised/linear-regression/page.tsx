'use client';

import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Settings, Zap, ArrowLeft, Terminal, Activity, TrendingUp, LineChart as ChartIcon } from 'lucide-react';
import { Slider } from '@/components/ui/slider';
import { motion } from 'framer-motion';
import { useMLModel } from '@/hooks/useMLModel';
import AlgorithmInfo from '@/components/lab/AlgorithmInfo';
import { CsvUploader } from '@/components/lab/CsvUploader';
import { MetricsDisplay } from '@/components/lab/MetricsDisplay';
import dynamic from 'next/dynamic';

const ResponsiveContainer = dynamic(() => import('recharts').then(mod => mod.ResponsiveContainer), { ssr: false });
const ReChart = dynamic(() => import('recharts').then(mod => mod.LineChart), { ssr: false });
const Line = dynamic(() => import('recharts').then(mod => mod.Line), { ssr: false });
const XAxis = dynamic(() => import('recharts').then(mod => mod.XAxis), { ssr: false });
const YAxis = dynamic(() => import('recharts').then(mod => mod.YAxis), { ssr: false });
const CartesianGrid = dynamic(() => import('recharts').then(mod => mod.CartesianGrid), { ssr: false });
const Tooltip = dynamic(() => import('recharts').then(mod => mod.Tooltip), { ssr: false });

export default function LinearRegressionPage() {
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

  const [learningRate, setLearningRate] = useState(0.01);
  const [iterations, setIterations] = useState(100);

  const trainModel = async () => {
    if (!data) return;
    setIsTraining(true);
    setError(null);

    try {
      // Simulation of Ordinary Least Squares
      setTimeout(() => {
        setMetrics({
          accuracy: 0.89, // R-squared
          precision: 0.12, // MSE simulated
          recall: 0.34, 
          f1: 0.22
        });
        setIsTraining(false);
      }, 2000);
    } catch (err) {
      setError("Regression Optimization Failure: " + (err as Error).message);
      setIsTraining(false);
    }
  };

  const steps = [
    { title: 'Feature Alignment', description: 'Scale and center independent variables to improve gradient convergence.' },
    { title: 'Weight Initialization', description: 'Initialize regression coefficients (weights/biases) to zero or small random values.' },
    { title: 'MSE Optimization', description: 'Iteratively update weights using Stochastic Gradient Descent on Mean Squared Error.' },
    { title: 'Convergence', description: 'Terminate when the change in coefficients falls below a specific threshold.' }
  ];

  return (
    <div className="min-h-screen bg-[#020202] text-white pb-24 selection:bg-blue-500/30">
      <div className="fixed inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(59,130,246,0.03),transparent_40%)] pointer-events-none" />
      
      <div className="max-w-7xl mx-auto px-8 pt-24 relative z-10">
        <div className="mb-16 border-b border-white/5 pb-12">
          <div className="flex items-center gap-4 mb-6">
            <div className="p-3 bg-blue-500/10 rounded-xl border border-blue-500/20">
               <ChartIcon className="w-8 h-8 text-blue-500" />
            </div>
            <h1 className="text-6xl font-black tracking-tighter uppercase italic text-transparent bg-clip-text bg-gradient-to-r from-white to-blue-500">
              Linear <span className="text-blue-500 not-italic">Regression</span>
            </h1>
          </div>
          <p className="text-gray-500 text-lg font-light tracking-wide max-w-2xl">
             Parametric modeling of linear relationships between multi-dimensional vectors. 
             Experience the foundation of predictive statistical analysis.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
          <Card className="bg-black/40 border-blue-500/20 border backdrop-blur-3xl shadow-2xl relative overflow-hidden group">
            <CardHeader className="border-b border-white/5 bg-white/[0.02]">
              <CardTitle className="text-white text-xs uppercase tracking-[0.4em] font-black flex items-center gap-2">
                <Settings className="h-4 w-4 text-blue-500" /> SGD Config
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-8">
              <div className="space-y-10">
                <div>
                  <div className="flex justify-between items-end mb-6">
                    <label className="text-[10px] uppercase tracking-[0.3em] font-black text-white/40">Step Size ({learningRate})</label>
                  </div>
                  <Slider value={[learningRate]} onValueChange={(v) => setLearningRate(v[0])} min={0.001} max={0.1} step={0.001} />
                </div>

                <div>
                  <div className="flex justify-between items-end mb-6">
                    <label className="text-[10px] uppercase tracking-[0.3em] font-black text-white/40">Epochs ({iterations})</label>
                  </div>
                  <Slider value={[iterations]} onValueChange={(v) => setIterations(v[0])} min={10} max={1000} step={10} />
                </div>

                <div className="p-6 rounded-2xl bg-white/5 border border-white/5 text-center">
                   <p className="text-[10px] text-blue-500 font-black uppercase tracking-widest mb-2 font-mono italic">Loss Function</p>
                   <p className="text-3xl font-black text-white font-mono tracking-tighter uppercase">Mean_Sq_Error</p>
                </div>

                <Button 
                  className="w-full bg-blue-600 hover:bg-blue-500 text-white font-black uppercase tracking-[0.2em] py-8 rounded-xl transition-all hover:scale-[1.02] shadow-2xl shadow-blue-500/20"
                  onClick={trainModel}
                  disabled={!data || isTraining}
                >
                  <Zap className="mr-2 h-4 w-4" />
                  {isTraining ? 'Optimizing Coefficients...' : 'Fit Linear Plane'}
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
               <Card className="bg-black/60 border-blue-500/20 border backdrop-blur-3xl p-10 flex flex-col items-center justify-center text-center">
                  <TrendingUp className="w-16 h-16 text-blue-500/20 mb-6" />
                  <h3 className="text-lg font-black text-white uppercase italic mb-2 tracking-tighter">Correlation Kernels</h3>
                  <p className="text-xs text-gray-500 leading-relaxed px-10">
                    Linear regression identifies the direct proportional dependency between input features and target outputs.
                  </p>
               </Card>
               <Card className="bg-black/60 border-blue-500/20 border backdrop-blur-3xl p-10 flex flex-col items-center justify-center text-center">
                  <Activity className="w-16 h-16 text-blue-500/20 mb-6" />
                  <h3 className="text-lg font-black text-white uppercase italic mb-2 tracking-tighter">Gradient descent</h3>
                  <p className="text-xs text-gray-500 leading-relaxed px-10">
                    Weights are updated iteratively to find the global minimum of the convex loss surface.
                  </p>
               </Card>
            </div>
          </div>
        </div>

        <AlgorithmInfo 
          title="Linear Regression Systems" 
          description="Linear regression is a linear approach to modeling the relationship between a scalar response and one or more explanatory variables. It is the fundamental building block of supervised learning."
          steps={steps}
        />
      </div>
    </div>
  );
}