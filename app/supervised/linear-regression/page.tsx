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

const InteractiveLinearRegression = dynamic(
  () => import('@/components/lab/InteractiveLinearRegression').then(mod => mod.InteractiveLinearRegression),
  { ssr: false }
);
// Recharts components removed as they were unused and causing build errors


export default function LinearRegressionPage() {
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
            <h1 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl break-words hyphens-auto leading-tight font-black tracking-tighter uppercase italic text-transparent bg-clip-text bg-gradient-to-r from-white to-blue-500">
              Linear <span className="text-blue-500 not-italic">Regression</span>
            </h1>
          </div>
          <p className="text-gray-500 text-lg font-light tracking-wide max-w-2xl">
             Parametric modeling of linear relationships between multi-dimensional vectors. 
             Experience the foundation of predictive statistical analysis.
          </p>
        </div>

        <div className="mb-16">
           <InteractiveLinearRegression />
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