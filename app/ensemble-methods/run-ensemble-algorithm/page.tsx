'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Play, Pause, RefreshCw, Layers, ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';
import Link from 'next/link';

export default function RunEnsembleAlgorithmPage() {
  const [iterations, setIterations] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let interval: any;
    if (isRunning) {
      interval = setInterval(() => {
        setIterations(prev => prev + 1);
        setProgress(prev => (prev + 5) % 100);
      }, 500);
    }
    return () => clearInterval(interval);
  }, [isRunning]);

  const reset = () => {
    setIsRunning(false);
    setIterations(0);
    setProgress(0);
  };

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <Link href="/ensemble-methods/algorithms" className="text-teal-400 hover:text-teal-300 flex items-center gap-2 mb-4">
            <ArrowLeft className="w-4 h-4" /> Back to Algorithms
          </Link>
          <h1 className="text-4xl font-bold text-center text-teal-400">Run Ensemble Algorithm</h1>
        </div>

        <Card className="bg-gray-900 border-teal-500/30 p-12 text-center">
          <div className="flex justify-center mb-12">
            <div className="relative">
              <motion.div 
                animate={{ rotate: isRunning ? 360 : 0 }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                className="w-32 h-32 border-4 border-teal-500 border-t-transparent rounded-full flex items-center justify-center"
              >
                <Layers className="w-12 h-12 text-teal-400" />
              </motion.div>
              {isRunning && (
                 <motion.div 
                  initial={{ scale: 0 }}
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ repeat: Infinity, duration: 1 }}
                  className="absolute -top-2 -right-2 w-6 h-6 bg-teal-500 rounded-full"
                 />
              )}
            </div>
          </div>

          <p className="text-xl text-teal-300 mb-8 font-medium">
            Generating ensemble predictions through iterative base model training...
          </p>

          <div className="flex justify-center gap-6 mb-12">
            <Button
              onClick={() => setIsRunning(!isRunning)}
              size="lg"
              className={`${isRunning ? 'bg-red-600 hover:bg-red-700' : 'bg-teal-600 hover:bg-teal-700'} text-white px-8`}
            >
              {isRunning ? <Pause className="w-5 h-5 mr-2" /> : <Play className="w-5 h-5 mr-2" />}
              {isRunning ? 'Pause Process' : 'Start Simulation'}
            </Button>
            <Button
              onClick={reset}
              variant="outline"
              size="lg"
              className="border-teal-500 text-teal-300 hover:bg-teal-900 px-8"
            >
              <RefreshCw className="w-5 h-5 mr-2" /> Reset
            </Button>
          </div>

          <div className="grid grid-cols-2 gap-8 max-w-sm mx-auto p-6 bg-black/40 rounded-2xl border border-white/5">
             <div className="text-center">
               <p className="text-xs text-gray-500 uppercase tracking-widest mb-1">Iterations</p>
               <p className="text-3xl font-bold text-teal-400">{iterations}</p>
             </div>
             <div className="text-center border-l border-white/10">
               <p className="text-xs text-gray-500 uppercase tracking-widest mb-1">Convergence</p>
               <p className="text-3xl font-bold text-teal-400">{iterations > 0 ? (95 + Math.random() * 4).toFixed(1) : 0}%</p>
             </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
